/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.datasource.sql')
/**
 * @ngdoc object
 * @name pr.datasource.sql.prDatasourceSqlService
 * @description
 *
 * The prDatasourceSqlService handles queries done to the dataSource backend, it wraps around a configurable $resource object.
 * Service which wraps around a $resource object. The service contains several calls.
 *
 * It performs tasks transforming requests to sql foramt and intpreting them back in different format for the framework consumption.
 *
 * The methods of this service are actions of $resource. See $resource documentation for more details:
 * https://docs.angularjs.org/api/ngResource/service/$resource
 *
 * @requires pr.datasource.util.sqlbuilder.prSqlBuilder
 *
 * @returns {object} $resource object
 */

.service('prDatasourceSqlService',
    function($resource, prSqlBuilder, prApi) {

      var transformDataRequest = function(param) {
        // Send the server a clone, remove query object to keep params intact.
        var q = {};
        if (param.table) {
          q.table = param.table;
        }
        if (param.orderBy) {
          q.orderBy = param.orderBy;
        }
        if (param.metrics) {
          q.metrics = param.metrics;
        }
        if (param.dimensions) {
          q.dimensions = param.dimensions;
        }
        if (param.maxResults) {
          q.maxResults = param.maxResults;
        }
        if (param.filters.where) {
          q.where = param.filters.where;
        }
        if (param.filters.whereRaw) {
          q.whereRaw = param.filters.whereRaw;
        }

        var p = {
          sql: prSqlBuilder.buildQuery(q),
          intervals: param.filters.intervals,
          granularity:  param.granularity
        };
        return angular.toJson(p);
      };

      return $resource(prApi.url + '/sql/:dataSourceName', {}, {
        /**
         * @ngdoc method
         * @name getDataset
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as an array of objects.
         * ```js
         *     [{
         *       dimension1: value1,
         *       dimension2: value2,
         *       metric1: 1111,
         *       metrci2: 2222
         *     }, {
         *       ...
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getDataset: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(response) {
              var data = response.data;
              var config = response.config;
              var result = [];
              angular.forEach(data, function(value, key) {
                if (value.result && angular.toJson(value.result) !== '{}') {
                  result[key] = value.result;
                  if (config.data && config.data.granularity !== 'all') {
                    result[key].timestamp = moment(value.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
                  }
                }
              });

              return result;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getHistogram
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as an array of objects to build a histogram.
         * ```js
         *     [{
         *       x: dimensionValue1,
         *       y: metricValue1
         *     }, {
         *       ...
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getHistogram: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(rawResponse) {
              var data = rawResponse.data;
              var config = rawResponse.config;
              var metrics = config.data.metrics;
              var responses = [];
              if (data && data.length > 0) {
                angular.forEach(metrics, function(metric) {
                  var response = [];
                  angular.forEach(data, function(value) {
                    var point = {};
                    if (!config.data.dimensions || !config.data.dimensions.length || config.data.isTimeline) {
                      point.x = moment(value.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
                    } else {
                      point.x = value.result[config.data.dimensions[0].name];
                    }
                    point.y = value.result[prSqlBuilder.getAlias(metric)];
                    response.push(point);
                  });

                  responses.push({key:prSqlBuilder.getAlias(metric), values:response});
                });
              }

              return responses;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getGroupedBarData
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as a nested array of objects to build a grouped bar chart.
         * ```js
         *     [{
         *       key: dimension A Value 1,
         *       values: [{
         *         x: dimension B Value 2,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }, {
         *       key: dimension A Value 2,
         *       values: [
         *         ...
         *       ]
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getGroupedBarData: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(rawResponse) {
              var data = rawResponse.data;
              var config = rawResponse.config;
              var dimensions = config.data.dimensions || [];
              var metrics = config.data.metrics || [];
              var responses = [];

              if (!data || data.length === 0) {
                return responses;
              }

              if (dimensions.length === 2 && metrics.length === 1) {
                // Dimensions are switched
                var dim1Name = dimensions[1].name;
                var dim2Name = dimensions[0].name;
                var dim1Vals = [];
                var dim2Vals = [];
                var metricName = metrics[0].alias;

                // Select the first dimension to group by
                angular.forEach(data, function(d) {
                  var value = d.result;
                  var dim1Val = value[dim1Name];
                  var seriesIndex = dim1Vals.indexOf(dim1Val);

                  // If the series does not exist, add it
                  if (seriesIndex === -1) {
                    seriesIndex = dim1Vals.length;

                    // Keep track of which dimensions were added
                    dim1Vals.push(dim1Val);
                    responses.push({
                      key: dim1Val,
                      values: []
                    });
                  }

                  // Add value
                  responses[seriesIndex].values.push({
                    series: seriesIndex,
                    x: value[dim2Name],
                    y: value[metricName]
                  });

                  // Keep track of which dimensions were added
                  if (dim2Vals.indexOf(value[dim2Name]) === -1) {
                    dim2Vals.push(value[dim2Name]);
                  }
                });
                responses.forEach(function(series, seriesIndex) {

                  // For all the dimensions found, add a 0 value when the value is not found
                  dim2Vals.forEach(function(dimValue) {
                    var have = false;
                    series.values.forEach(function(e) {
                      if (e.x === dimValue) {
                        have = true;
                      }
                    });

                    if (!have) {
                      series.values.push({
                        series: seriesIndex,
                        x: dimValue,
                        y: 0
                      });
                    }
                  });
                });

              } else if (dimensions.length === 1) {
                var metricNames = [];
                var dimName = dimensions[0].name;

                angular.forEach(data, function(d) {
                  var value = d.result;
                  var dimValue = value[dimName];
                  angular.forEach(value, function(val, key) {
                    if (key !== dimName) {
                      var metricName = key;
                      var seriesIndex = metricNames.indexOf(metricName);

                      if (seriesIndex === -1) {
                        seriesIndex = responses.length;
                        metricNames.push(metricName);
                        responses.push({
                          key: metricName,
                          values: []
                        });
                      }
                      responses[seriesIndex].values.push({
                        x: dimValue,
                        y: val
                      });
                    }
                  });
                });
              }

              responses.forEach(function(series) {
                // Sort makes the values get displayed correctly on 'stacked' mode
                series.values.sort(function(v1, v2) {
                  if (v1.x === v2.x) {
                    return 0;
                  }
                  return v1.x > v2.x ? -1 : 1;
                });
              });
              return responses;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getStackDataset
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as 1 or more series, which contain values with a timestamp (date) and a metric.
         *
         * If no dimension is selected, a single series is returned. The series represents the total for a metric.
         *
         * If a dimension is selelcted, several series are returned. Each series represents a metric value of the dimension.
         * ```js
         *     [{
         *       key: dimension value 1,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }, {
         *       key: dimension value 2,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getStackDataset: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(response) {
              var data = response.data;
              var config = response.config;
              var metricName = prSqlBuilder.getAlias(config.data.metrics[0]);
              var dimensionName = config.data.dimensions[0] ? config.data.dimensions[0].name : null;
              var dimensionValues = [];

              // Multiple series, values are store in each
              var series = [];

              // Group the data by the timestamp they carry, creating an array of small arrays
              var timestampGroups = _.groupBy(data, 'timestamp');

              // Find lenght of the bggest group, to prevent any 'holes' in the data
              var maxTimestampGroupLength = 0;
              for (var d in timestampGroups) {
                maxTimestampGroupLength = maxTimestampGroupLength < timestampGroups[d].length ? timestampGroups[d].length : maxTimestampGroupLength;
              }

              // Add the
              var timestampIndex = 0;
              for (var timestamp in timestampGroups) {
                var timestampGroup = timestampGroups[timestamp];
                var date = moment(timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();

                // Ensure we go through each of the values in the timestamp, even the ones missing
                for (var seriesIndex = 0; seriesIndex < maxTimestampGroupLength; seriesIndex++) {

                  // Create the series if not added yet
                  if (!series[seriesIndex]) {
                    series[seriesIndex] = [];
                  }

                  // Create a point in the series
                  series[seriesIndex][timestampIndex] = {
                    x: date,
                    y: 0
                  };

                  // Add y value for the point in the series if found
                  if (timestampGroup[seriesIndex]) {
                    var resultValue = timestampGroup[seriesIndex].result;
                    series[seriesIndex][timestampIndex].y = resultValue[metricName];
                    dimensionValues[seriesIndex] = resultValue[dimensionName];
                  }
                }
                timestampIndex++;
              }

              // Done! Put the data in the format suitable to nvd3
              var results = [];
              angular.forEach(series, function(serie, i) {
                results.push({
                  key: dimensionValues[i] || metricName,
                  values: serie
                });
              });
              return results;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getMetricData
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains total data for a single metric.
         *
         * ```js
         *     [{
         *       key: dimension value 1,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }, {
         *       key: dimension value 2,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getMetricData: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(response) {
              var alias = prSqlBuilder.getAlias(response.config.data.metrics[0]);
              return response.data[0].result[alias];
            }
          },
          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getDataSources
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of dataSources available for the user.
         * @param {object} unused No params are needed
         * @param {object} unused No payload is needed
         * @param {function(array<string>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {array<string>} An array with the list of datasources which the user can view.
         */
        getDataSources: {
          method: 'GET',
          url: prApi.url + '/datasources?right=view',
          isArray: true,
          withCredentials: true
        },

        /**
         * @ngdoc method
         * @name getTables
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of the tables in a given dataSource
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} unused No payload is needed as is created internally.
         * @param {function(array<string>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {array<string>} An array of names of tables of a dataSource.
         */
        getTables: {
          method: 'POST',
          url: prApi.url + '/sql',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          transformRequest: function(param) {
            var p = {
              sql: 'show tables from ' + param.dataSourceName
            };
            return angular.toJson(p);
          }
        },

        /**
         * @ngdoc method
         * @name getDimensions
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of the dimensions in a given table and dataSource
         * @param {object} urlParams Object which must include `dataSourceName` and `table`. e.g.
         * ```
         * {
         *   dataSourceName: 'pulsar',
         *   table: 'pulsar_events'
         * }
         * ```
         * @param {object} unused No payload is needed as is created internally.
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {array<object>} An array of objects which represent dimensions in a table
         */
        getDimensions: {
          method: 'POST',
          url: prApi.url + '/sql',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          transformRequest: function(param) {
            var p = {
              sql: 'desc ' + param.dataSourceName + '.' + param.table + '.dimensions'
            };
            return angular.toJson(p);
          },
          interceptor: {
            response: function(results) {
              var response = [];
              angular.forEach(results.data, function(dimension) {
                response.push({name: dimension});
              });
              return response;
            }
          }
        },

        /**
         * @ngdoc method
         * @name getMetrics
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of the metrics in a given table and dataSource
         * @param {object} urlParams Object which must include `dataSourceName` and `table`. e.g.
         * ```
         * {
         *   dataSourceName: 'pulsar',
         *   table: 'pulsar_events'
         * }
         * ```
         * @param {Object} unused No payload is needed as is created internally.
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {Array<object>} An array of objects which represent metrics in a table
         */
        getMetrics: {
          method: 'POST',
          url: prApi.url + '/sql',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          transformRequest: function(param) {
            var p = {
              sql: 'desc ' + param.dataSourceName + '.' + param.table + '.metrics'
            };
            return angular.toJson(p);
          },
          interceptor: {
            response: function(results) {
              var response = [];
              angular.forEach(results.data, function(metric) {
                response.push({name: metric});
              });

              return response;
            }
          }
        }
      });
    });

})();
