/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.timeline', [
    'pr.dashboard',

    'nvd3',
    'pr.datasource.sql',
    'pr.UIOption'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.timeline.widget:pr-timeline
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/line.html nvd3 line chart in a time series}. This widget displays data in
       * a chart for a single metric and no dimensions, a granularity different from `'all'` is required.
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
       *   "type": "pr-stack",
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
       *     "title": "A stacked area chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/line.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-timeline', {
          label: 'Timeline',
          icon: 'fa fa-clock-o',
          templateUrl: 'src/prReporting/prDashboardWidgets/timeline/view.html',
          controller: 'prTimelineWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/timeline/edit.html',
            controller: 'prTimelineWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.timeline.directive:prTimelineWidget
 * @restrict E
 *
 * @description
 * The `prTimelineWidget` pulls data and presents it as a time line chart based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prTimelineWidget',
    function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="{{height}}px"><nvd3 data="lineChart.data" options="lineChart.options"></nvd3><div ng-show="wait" class="overlay"><i class="fa fa-refresh fa-spin"></i></div></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs, prApi) {
          $scope.options = $scope.options || {};

          var height = $scope.options.height || 180;
          $scope.height = height + 20;

          $scope.defaults = {
            margin: {
              top: 20,
              right: 50,
              bottom: 20,
              left: 80
            },
            height: height,
            xAxis: {
              axisLabel: 'Time',
              tickFormat: function(d) {
                console.lo
                return prUIOptionService.getxAxisTickFormat(d, $scope.params.granularity, prApi.timezone);
              }
            },
            showLegend: true
          };

          $scope.lineChart = {
            options: prUIOptionService.getTimeLineChartOptions(angular.merge($scope.defaults, $scope.options.chart || {}))
          };
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, because watchGroup doesn't support objectEquality (angular.equals)
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

            // Format the xAxis to timestamp if the isTimeLine is true.
            newParams.isTimeline = true;
            if (!scope.lineChart.data) {
              scope.lineChart.data = [];
            }
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }
            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }
                scope.lineChart.data = results;
                scope.lineChart.options = prUIOptionService.getTimeLineChartOptions(angular.merge(scope.defaults, scope.options.chart || {}));

                if (scope.options.isArea) {
                  angular.forEach(scope.lineChart.data, function(data) {
                    data.area = true;
                  });
                }
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.lineChart.data = [];
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prTimelineWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prTimelineWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES, GRANULARITIES) {
      /**
       * Initializes metrics options according to a data source.
       */
      $scope.init = function() {
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
      if (angular.isUndefined($scope.options.isArea)) {
        $scope.options.isArea = false;
      }
      $scope.newParams.maxResults = widgetParams.maxResults || 100;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      },
      function(error) {
        //To handler the error
      });

      // Init granularity select items, disable 'all' option.
      $scope.granularities = angular.copy(GRANULARITIES);
      $scope.granularities.splice(0, 1);
      if ($scope.newParams.granularity == 'all') {
        $scope.newParams.granularity = $scope.granularities[0].name;
      }

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.init();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.metrics = [];
          $scope.init();
        }
      });
    });

})();
