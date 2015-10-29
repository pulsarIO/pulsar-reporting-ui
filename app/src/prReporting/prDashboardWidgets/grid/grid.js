/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.grid', [
    'pr.dashboard',

    'ui.select',
    'ngSanitize',

    'ui.grid',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.autoResize',

    'pr.gridextensions',
    'pr.UIOption',

    'pr.datasource.sql',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.grid.widget:pr-grid
       * @description
       *
       * Widget for {@link http://ui-grid.info/ ui-grid}. This widget displays data in a table format and performs
       * very little formatting of the original data.
       *
       * It supports both several dimensions and several metrics simultaneoustly which allows users to
       * explore data in detail. ui-grid offers high performance for high quantities of rows of data.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-grid",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       },
       *       {
       *         "name": "trafficsource"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }, {
       *         "name": "gmv_ag",
       *         "type": "sum",
       *         "alias": "gmv_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A grid widget",
       *     "disabled": false,
       *     "grid" : {
       *        // Additional options that will be sent ui-grid, see http://ui-grid.info/docs/#/tutorial
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-grid', {
          label: 'Table',
          icon: 'fa fa-table',
          templateUrl: 'src/prReporting/prDashboardWidgets/grid/view.html',
          controller: 'prGridWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/grid/edit.html',
            controller: 'prGridWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.grid.directive:prGridWidget
 * @restrict E
 *
 * @description
 * The `prGridWidget` pulls data and presents it as a grid based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before placing it in the grid.
 */
.directive('prGridWidget', function($compile, prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div ng-if="!grid.gridOptions.enableRowSelection" ui-grid="grid.gridOptions" ui-grid-pagination ui-grid-auto-resize pr-grid-height class="grid"></div>' +
                  '<div ng-if="grid.gridOptions.enableRowSelection" ui-grid="grid.gridOptions" ui-grid-selection ui-grid-pagination ui-grid-auto-resize pr-grid-height class="grid"></div>',

        scope: {
          params: '=',
          options: '=?',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs, $element) {
          $scope.options = $scope.options || {};

          $scope.grid = {
            gridOptions: prUIOptionService.getSimpleGridOptions($scope.options.grid || {})
          };

          $scope.addFilter = function(dimensionName, dimensionValue) {
            $scope.filters.where = $scope.filters.where || {};
            $scope.filters.where[dimensionName] = dimensionValue;
          };
        },

        link: function(scope, element, attrs) {
          var staticColumnDefs = scope.grid.gridOptions.columnDefs;

          scope.$watch(function() {
            // Use a watch function, becuase watchGroup doesn't support deep equality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);

            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 100;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');

              var columnDefs = staticColumnDefs;
              if (!columnDefs) {
                columnDefs = [];
                angular.forEach(newParams.dimensions, function(dimension) {
                  columnDefs.push({
                    field: dimension.name,
                    cellTemplate:
                      '<div class="ui-grid-cell-contents">' +
                        '<a href title="{{COL_FIELD}}" ng-click="grid.appScope.addFilter(\'' + dimension.name + '\', grid.getCellValue(row, col))">' +
                          '{{COL_FIELD}}' +
                        '</a>' +
                      '</div>'
                  });
                });

                angular.forEach(newParams.metrics, function(metric) {
                  var field = metric.alias || metric.name + ' ' + metric.type;
                  columnDefs.push({
                    field: field,
                    displayName: field,
                    cellClass: 'text-right',
                    cellFilter: metric.filter || 'number'
                  });
                });
              }

              prDatasourceSqlService.getDataset({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                // Reset grid options to force to recreate the grid
                scope.grid.gridOptions.data = [];
                scope.grid.gridOptions.columnDefs = [];

                // Add timestamp if present
                if (!staticColumnDefs && results.length && results[0].timestamp) {
                  columnDefs.push({
                    field: 'timestamp',
                    cellFilter: 'date:\'short\''
                  });
                }
                scope.grid.gridOptions.columnDefs = columnDefs;
                scope.grid.gridOptions.data = results;

                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.grid.gridOptions.data = [];
                scope.grid.gridOptions.columnDefs = [];
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prGridWidget',
    function($scope, widgetParams, widgetOptions) {

    })

.controller('prGridWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES, GRANULARITIES) {

      /**
       * Initializes dimensions and metrics options according to a data source.
       * @param  {string} dataSource Name of data source
       */
      $scope.initDimensionsAndMetrics = function() {
        prDatasourceSqlService.getDimensions({}, $scope.newParams,
          function(data) {
            $scope.dimensions = data;
          },
          function(error) {
            //TODO handle this error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //TODO handle this error
          });

        $scope.granularities = angular.copy(GRANULARITIES);
      };

      // INIT

      // Init parameters
      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 100;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.dimensions = [];
          $scope.newParams.metrics = [];
          $scope.initDimensionsAndMetrics();
        }
      });

    });

})();
