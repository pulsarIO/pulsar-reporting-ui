/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc object
 * @name pr.datasource.sql.prSqlBuilder
 * @description Builds sql statements from params objects. Uses http://knexjs.org to build the query object
 */
angular.module('pr.datasource.sql')

.factory('prSqlBuilder',
    function($log) {

      /**
       * @ngdoc method
       * @name getAlias
       * @methodOf pr.datasource.sql.prSqlBuilder
       * @description Gets the name of a column according to the information in the metric or dimension.
       * @param {object} metric Metric object
       * @return {string} Alias of the metric
       */
      var getAlias = function(metric) {
        var alias = metric.alias ? metric.alias : metric.name + ' ' + metric.type;
        return alias;
      };
      /**
       * @ngdocs method
       * @name buildQuery
       * @methodOf pr.datasource.sql.prSqlBuilder
       * @description
       *
       * Formats a query from a set of parameteres to be sent to the sql api
       *
       * @param  {object} param Parameters to build an query to the back end.
       *
       *   Object properties:
       *
       *   - `table` `{string}` - Either pulsar_session or pulsar_event
       *   - `dimensions` `{array<object>}` Array of dimensions, e.g. ['trafficSource', '...' ]
       *   - `metrics` `{array<object>}` Array of metrics, e.g. ['newSessionRate', 'sessionDuration']
       *   - `where` `{object}` An object which can contains different kinds of values:
       *         where : {
       *           site : 0 // string, becomes (site=0)
       *           m : [1,2,3] // array, becode (m='1' or m='2' ...)
       *           str : {
       *             operator : 'like'
       *             val: '%XX%'
       *           }
       *         }
       *    - `string` or `number`, resulting in WHERE key = value
       *    - `array` of values, resulting in WHERE key = value1 or key = value2 or ...
       *    - `object` which must include `val` and optional `operator`, e.g.
       *   - `whereRaw` : A string with a raw filter
       *   - `orderBy` : column to orderBy in the statement
       *         orderBy : 'sessions' // simple
       *         orderBy : {          // more power
       *           sessions : 'asc',
       *           users : 'desc',
       *           ...
       *         }
       * @return {string} Build query in MySQL format
       */
      var buildQuery = function(param) {
        // Make select statement
        var k = Knex({client: 'mysql'}).select().from(param.table);

        // Order by
        var orderByAdded = false;
        if (param.orderBy) {
          if (angular.isString(param.orderBy) || angular.isNumber(param.orderBy)) {
            // Keep ASC always?
            k.orderBy(param.orderBy, 'desc');
            orderByAdded = true;
          } else if (angular.isObject(param.orderBy)) {
            angular.forEach(param.orderBy, function(val, key) {
              k.orderBy(key, val);
              orderByAdded = true;
            });
          } else {
            throw Error('cannot order by: type' + typeof (param.orderBy) + ' is not supported for order by');
          }
        }

        // Metrics update for test
        angular.forEach(param.metrics, function(metric, i) {
          var alias = '"' + getAlias(metric) + '"';
          if (metric.type === 'count') {
            k.count(metric.name + ' as ' + alias);
          } else if (metric.type === 'sum') {
            k.sum(metric.name + ' as ' + alias);
          } else if (metric.type === 'max') {
            k.max(metric.name + ' as ' + alias);
          } else if (metric.type === 'min') {
            k.min(metric.name + ' as ' + alias);
          } else if (metric.type === 'unique') {
            k.count('distinct ' + metric.name + ' as ' + alias);
          }  else if (metric.type === 'avg') {
            var avg = Knex.raw('sum("' + metric.name + '")/count("' + metric.name + '") as ' + alias);
            k.select(avg);
          } else {
            throw Error('cannot aggregate: aggregation ' + metric.type + ' is not supported');
          }

          // Add a default orderBy for the first metric
          if (!orderByAdded && i === 0) {
            if (param.dimensions && param.dimensions.length) {
              if (metric.type !== 'unique') {
                k.orderBy(metric.type + '(' + metric.name + ')', 'desc');
              }
            }
          }
        });

        // Dimension
        if (param.dimensions) {
          var columns = [];
          angular.forEach(param.dimensions, function(dimension) {
            if (dimension && dimension.name) {
              columns.push(dimension.name);
            }
          });

          k.column(columns);
        }

        // Where
        if (param.where) {

          angular.forEach(param.where, function(value, key) {

            if (angular.isString(value) || angular.isNumber(value)  || value === null) {
              // Condition is a simple value
              k.where(key, value);
            } else if (angular.isArray(value)) {
              k = orWhereFromArray(k, key, value);
            } else if (angular.isObject(value)) {
              var cond = value;
              if (cond.val) {
                if (!cond.operator) {
                  cond.operator = '=';
                }
                k = whereWithOperator(k, key, cond);
              }
            }
          });
        }

        if (param.whereRaw && angular.isString(param.whereRaw)) {
          k.whereRaw('(' + param.whereRaw + ')');
        }

        // Group by
        angular.forEach(param.dimensions, function(dimension) {
          if (dimension && dimension.name) {
            k.groupBy(dimension.name);
          }
        });

        // Limit
        if (param.maxResults) {
          if (angular.isString(param.maxResults)) {
            param.maxResults = parseInt(param.maxResults);
          }
          k.limit(param.maxResults);
        }

        var s = k.toString();

        //Remove MySQL quote symbols
        s = s.replace(/`/g, '');
        return s;
      };

      // HELPERS

      /**
       * Appends a where condition to a kenx statement
       * @param  {knex object}
       * @param  {string}
       * @param  {array}
       * @param  {string}
       * @return {knex object}
       */
      function orWhereFromArray(k, key, array, operator) {
        if (array.length > 0) {
          k.where(function() {
            var i = 1;
            if (operator) {
              this.where(key, operator, array[0]);
              for (; i < array.length; i++) {
                this.orWhere(key, operator, array[i]);
              }
            } else {
              this.where(key, array[0]);
              for (; i < array.length; i++) {
                this.orWhere(key, array[i]);
              }
            }
          });
        }
        return k;
      }

      /**
       * Add a where statement with an operator
       * @param  {[type]}
       * @param  {[type]}
       * @param  {[type]}
       * @return {[type]}
       */
      function whereWithOperator(k, key, cond) {
        if ((cond.operator === 'in' || cond.operator === 'not in') && angular.isArray(cond.val)) {
          return k.where(key, cond.operator, cond.val);
        } else if (cond.operator === 'between' && angular.isArray(cond.val) && cond.val.length === 2) {
          return k.where(key, cond.operator, cond.val);
        } else if (angular.isString(cond.val) || angular.isNumber(cond.val)) {
          return k.where(key, cond.operator, cond.val);
        } else if (angular.isArray(cond.val)) {
          return orWhereFromArray(k, key, cond.val, cond.operator);
        } else {
          $log.error('Filter condition ', cond, ' for query cannot be added by prSqlBuilder. Filter condition ignored.');
          return k;
        }
      }

      return {
        getAlias: getAlias,
        buildQuery: buildQuery
      };
    });

})();
