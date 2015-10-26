/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dynamicfilter', [
  'pr.datasource.sql',
  'ui.bootstrap.dropdown'
])

/**
 * @ngdoc directive
 * @name pr.dynamicfilter.directive:prDynamicFilter
 * @restrict E
 *
 * @description
 * Displays a list of filters for the user to drilldown in the data. The options for the user are loaded for the data
 * source dynamically, using top N queries.
 *
 * Optionally it emits ($emit) an event when filters are changed by the user so the data can be refreshed.
 *
 * @param {string} datasource The data source to be used
 * @param {string} table The table in the data source to be queried
 * @param {string=} metric The metric to sort by in the top N query. Defaults to `count`.
 * @param {object=} filters Extra filters that can be added to the query.
 * @param {number=} maxOptions Limit to the number of options in each of the dimension filters. 4 - 10 is recommended.
 * @param {number=} maxDimensions Limit to the number of dimensions in each of the dimension filters. 4 - 10 is recommended.
 * @param {object=} model Key, value pairs of dimension names and arrays of values set by the filter, uses double data binding.
 * @param {boolean=} drilldown This flag makes the options in a filter depend on the filters previously selected.
 * When a filter is selected, the filters below will be cleared of their values. Defaults to `false`
 * @param {boolean=} editMode This flag allows the user to add and remove dimensions in the filter on the UI.
 * @param {number=} visibleOptionsSelected Number of options that are shown before being collapsed as `2 of 4 options selected`.
 * @param {string=} submitEvent Displays an extra submit button, which when click will `$emit` an event with the value of this parameter.
 * The second argument is an object with the filters selected.
 * @param {array<object>=} dimensions Dimensions in the filters, uses double data binding. An additional option `locked`,
 * which if true prevents the dimension from being removed.
 */
.directive('prDynamicFilter',
    function(prDatasourceSqlService) {

      return {
        restrict: 'E',
        scope: {
          /* Query information */
          datasource: '=',
          table: '=',
          metric: '=?',
          filters: '=?',
          maxOptions: '=?',
          maxDimensions: '=?',

          /* Share the model with upper scope */
          model: '=?',

          /* Layout and special behavior */
          drilldown: '=?',
          editMode: '=?',
          visibleOptionsSelected: '=?',
          submitEvent: '=?',

          /* Predefined values by app */
          dimensions: '=?'
        },

        templateUrl: 'src/prReporting/prDynamicFilter/prDynamicFilter.html',

        controller: function($scope) {
          $scope.submit = function() {
            if ($scope.submitEvent) {
              $scope.$emit($scope.submitEvent, $scope.model);
            }
          };

          // Set defaults
          $scope.model = $scope.model || {};
          $scope.filters = $scope.filters || {};
          $scope.dimensions = $scope.dimensions || [];
          $scope.drilldown = angular.isUndefined($scope.drilldown) ? false : $scope.drilldown;
          $scope.editMode = angular.isUndefined($scope.editMode) ? true : $scope.editMode;
          $scope.visibleOptionsSelected = $scope.visibleOptionsSelected || 3;
          $scope.maxDimensions = $scope.maxDimensions || 10;
          $scope.maxOptions = $scope.maxOptions || 10;
          $scope.metric = $scope.metric || {
            name: 'count',
            type: 'count',
            alias: 'count'
          };

          $scope.isDimensionAdded = function(dimensionName) {
            for (var i in $scope.dimensions) {
              if ($scope.dimensions[i].name === dimensionName) {
                return true;
              }
            }
            return false;
          };

          $scope.isOptionSelected = function(dimension, option) {
            if ($scope.model[dimension.name]) {
              var index = $scope.model[dimension.name].indexOf(option);
              if (index === -1) {
                return false;
              } else {
                return true;
              }
            }
            return false;
          };

          $scope.resetDimensionsFromIndex = function(dimIndex) {
            if (dimIndex !== -1) {
              for (var i = dimIndex; i < $scope.dimensions.length; i++) {
                // Reset options and values
                $scope.model[$scope.dimensions[i].name] = [];
                $scope.setupDimension($scope.dimensions[i]);
              }
            }
          };

          $scope.toggleOption = function(dimension, option) {
            if ($scope.model[dimension.name]) {
              var optIndex = $scope.model[dimension.name].indexOf(option);
              if (optIndex === -1) {
                $scope.model[dimension.name].push(option);
              } else {
                $scope.model[dimension.name].splice(optIndex, 1);
              }

              if ($scope.drilldown) {
                var dimIndex = _.findIndex($scope.dimensions, function(dim) {
                  return dimension.name === dim.name;
                });
                $scope.resetDimensionsFromIndex(dimIndex + 1);
              }
            }
          };

          $scope.unselectAllOptions = function(dimension) {
            if ($scope.model[dimension.name]) {
              $scope.model[dimension.name] = [];
            }
            if ($scope.drilldown) {
              var dimIndex = $scope.dimensions.indexOf(dimension);
              $scope.resetDimensionsFromIndex(dimIndex + 1);
            }
          };

          $scope.removeDimension = function(dimension) {
            if (!dimension.locked) {
              var dimIndex = $scope.dimensions.indexOf(dimension);
              $scope.dimensions.splice(dimIndex, 1);
              delete $scope.model[dimension.name];
              if ($scope.drilldown) {
                $scope.resetDimensionsFromIndex(dimIndex);
              }
            }
          };

          $scope.addDimension = function(newDimension) {
            $scope.dimensions.push(newDimension);
            $scope.model[newDimension.name] = [];
            $scope.setupDimension(newDimension);
          };

          /**
           * Load the options of a dimension
           * @param dimension
           */
          $scope.setupDimension = function(dimension) {
            var topNparams = {
              dataSourceName: $scope.datasource,
              table: $scope.table,
              dimensions: [dimension],
              metrics: [
                $scope.metric
              ],
              maxResults: $scope.maxOptions,
              sortBy: $scope.metric.alias,
              filters: {
                where: {}
              }
            };
            angular.merge(topNparams.filters, $scope.filters);

            if ($scope.drilldown) {
              var drilldownWhere = {};
              for (var dimensionName in $scope.model) {
                if (dimensionName === dimension.name) {
                  break;
                } else {
                  if ($scope.model[dimensionName] && $scope.model[dimensionName].length) {
                    drilldownWhere[dimensionName] = angular.copy($scope.model[dimensionName]);
                  }
                }
              }
              angular.merge(topNparams.filters.where, drilldownWhere);
            }

            dimension.wait = true;
            dimension.options = [];
            prDatasourceSqlService.getDataset({dataSourceName: $scope.datasource}, topNparams, function(topNResults) {
              dimension.wait = false;
              dimension.options = [];
              angular.forEach(topNResults, function(topNResult) {
                dimension.options.push(topNResult[dimension.name]);
              });
            }, function(error) {
              dimension.wait = false;
              dimension.error = true;
            });
          };
        },

        link: function(scope, element, attrs) {

          // Add dimensions that are in the model, but not in the dimension list
          for (var dimensionName in scope.model) {
            var dimIndex = _.findIndex(scope.dimensions, function(dim) {
              return dimensionName === dim.name;
            });
            if (dimIndex === -1) {
              scope.dimensions.push({name: dimensionName});
            }
          }

          angular.forEach(scope.dimensions, function(dimension) {
            scope.model[dimension.name] = scope.model[dimension.name] || [];
            scope.setupDimension(dimension);
          });

          prDatasourceSqlService.getDimensions({}, {dataSourceName: scope.datasource, table: scope.table}, function(dimensionOptions) {
            scope.dimensionOptions = dimensionOptions;
          });
        }
      };
    });
})();
