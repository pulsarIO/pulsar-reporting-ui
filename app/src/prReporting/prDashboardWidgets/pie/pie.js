/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.pie', [
    'nvd3',

    'pr.dashboard',
    'pr.datasource.sql',
    'pr.UIOption',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.pie.widget:pr-pie
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/pie.html nvd3 pie chart}. This widget displays data in
       * a chart for a single metric and a single dimension.
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
       *   "type": "pr-pie",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A pie chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/pie.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-pie', {
          label: 'Pie',
          icon: 'fa fa-pie-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/pie/view.html',
          controller: 'prPieWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/pie/edit.html',
            controller: 'prPieWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.pie.directive:prPieWidget
 * @restrict E
 *
 * @description
 * The `prPieWidget` pulls data and presents it as a pie chart based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prPieWidget',
    function($filter, prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="pieChart.data" options="pieChart.options" pr-nvd3-clear-tooltip api="api" ng-class="{interactive: pieChart.options.chart.pie.dispatch.elementClick}"></nvd3></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          var height = 340;
          $scope.options = $scope.options || {};
          if ($scope.options.chart && $scope.options.chart.height) {
            height = $scope.options.chart.height;
          }
          $scope.height = height + 40;

          var defaults = {
            height: height,
            tooltip: {
              keyFormatter: function(d) {
                if (!$scope.params.metrics || !$scope.params.metrics[0]) {
                  return d;
                } else {
                  var metric = $scope.params.metrics[0];
                  return (d ? d + ' ' : '') + metric.alias || metric.name;
                }
              }
            },
            pie: {
              dispatch: {
                elementClick: function(e) {
                  if ($scope.filters.where) {
                    var dimensionName = $scope.params.dimensions[0].name;
                    $scope.filters.where[dimensionName] = e.data.x;
                    $scope.$apply();
                  }
                }
              }
            }
          };

          $scope.pieChart = {
            options: prUIOptionService.getPieChartOptions(angular.merge(defaults, $scope.options.chart || {}))
          };
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, becuase watchGroup doesn't support objectEquality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more by modifing
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 10;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');

              if (scope.pieChart.options.chart.width === 0) {
                scope.pieChart.options.chart.width = undefined;
              }

              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                // Only the first series to create pie chart.
                var data = [];
                if (results[0]) {
                  data = results[0].values;
                  var total = 0;
                  angular.forEach(data, function(val, index) {
                    total += val.y;
                  });
                  if (total === 0) {
                    data = [];
                  }
                }
                scope.pieChart.data = data;
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.pieChart.data = [];
                scope.pieChart.options.chart.width = 0;
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prPieWidget',
    function($scope, widgetParams, widgetOptions) {

    })

.controller('prPieWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES) {

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
            //To handler the error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
      };

      // INIT

      // Init parameters
      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 10;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

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
