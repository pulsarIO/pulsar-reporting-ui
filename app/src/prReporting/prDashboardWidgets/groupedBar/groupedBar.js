/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.groupedBar', [
  'pr.dashboard',
  'nvd3',
  'pr.UIOption',
  'pr.datasource.sql',
  'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.groupedBar.widget:pr-grouped-bar
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/multiBar.html nvd3 multiBar}. This widget displays data in an advanced
       * multidimensional multi-bar nvd3 chart.
       *
       * It supports 2 modes.
       *
       * **Single metric and 2 dimensions:** To group a dimension inside another one, and display the values of a metric
       * for it.
       *
       * **Multiple metrics and 1 dimension:** To group several values of a metric grouped by a dimension. *Note: As
       * several metrics are displayed in the same scale, the y-axis units may not be meaningful.*
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
       *   "type": "pr-grouped-bar",
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
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A grid widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/multiBar.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-grouped-bar', {
          label: 'Grouped Bar',
          icon: 'fa fa-tasks fa-rotate-270',
          templateUrl: 'src/prReporting/prDashboardWidgets/groupedBar/view.html',

          controller: 'prGroupedBarWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/groupedBar/edit.html',
            controller: 'prGroupedBarWidgetEdit'
          }
        });
    })
/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.groupedBar.directive:prGroupedBarWidget
 * @restrict E
 *
 * @description
 * The `prGroupedBarWidget` loads data and presents it as a multiBarChart based on the parmeters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters
 */
.directive('prGroupedBarWidget',
    function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="groupedBarChart.data" options="groupedBarChart.options" class="interactive"></nvd3></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          $scope.groupedBarChart = {};

          var height = 340;
          $scope.options = $scope.options || {};
          if ($scope.options.chart && $scope.options.chart.height) {
            height = $scope.options.chart.height;
          }
          $scope.height = height + 40;
          $scope.defaults = {
            height: height,
            margin: {
              top: 5,
              right: 5,
              bottom: 5,
              left: 100
            },
            showLegend: true
          };
          $scope.groupedBarChart.options = prUIOptionService.getGroupedBarChartOptions(angular.merge($scope.defaults, $scope.options.chart || {}));

        },
        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, because watchGroup doesn't support deep equality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);

            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 40;
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }
            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getGroupedBarData({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.groupedBarChart.data = results;
                scope.groupedBarChart.options = prUIOptionService.getGroupedBarChartOptions(angular.merge(scope.defaults, scope.options.chart || {}));

                if (results && results[0]) {
                  if (newParams.dimensions[0]) {
                    scope.groupedBarChart.options.chart.xAxis = {axisLabel: newParams.dimensions[0].name};
                  }
                }

                scope.$emit('statusChanged', 'done');
              },
                function(result) {
                  scope.$emit('statusChanged', 'error', result.data.error, result);
                });
            }
          }, true);
        }
      };
    })
.controller('prGroupedBarWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prGroupedBarWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES) {
      /**
       * Initializes dimensions and metrics options according to a data source.
       */
      $scope.initDimensionsAndMetrics = function() {
        prDatasourceSqlService.getDimensions({}, $scope.newParams,
          function(data) {
            $scope.dimensions = data;
          },
          function(error) {
            //To handle the error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handle the error
          });
      };

      // INIT

      // Init parameters

      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.multipleMetrics = widgetParams.metrics && widgetParams.metrics.length > 1;
      $scope.newParams.maxResults = widgetParams.maxResults || 40;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams,
        function(data) {
          $scope.tables = data;
        },
        function(error) {
          //To handler the error
        });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      $scope.$watch('multipleMetrics', function(isMultipleMetrics) {
        if (isMultipleMetrics) {
          // Ensure a single dimension if using multiple metrics
          $scope.newParams.dimensions.splice(1, $scope.newParams.dimensions.length - 1);
        }
      });

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
