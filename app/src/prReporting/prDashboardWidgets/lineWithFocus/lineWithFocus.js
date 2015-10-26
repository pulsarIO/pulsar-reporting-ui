/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.linewithfocus', [
    'nvd3',

    'pr.datasource.sql',
    'pr.dashboard',
    'pr.UIOption',

    'pr.dashboard.widgets.util'
])
.config(
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.linewithfocus.widget:pr-line-with-focus
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/lineWithFocus.html nvd3 line with view chart}. This widget displays data in
       * a chart for a single metric and no dimensions, a granularity that is not `'all'` is required.
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
       *     "dimensions": [], // No dimensions
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
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/lineWithFocus.html
       *     }
       *   }
       * }
       * ```
       *
       */
    function(prDashboardProvider) {
      prDashboardProvider
        .widget('pr-line-with-focus', {
          label: 'Line with Focus',
          icon: 'fa fa-line-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/lineWithFocus/view.html',
          controller: 'prLineWithFocusWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/lineWithFocus/edit.html',
            controller: 'prLineWithFocusWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.linewithfocus.directive:prLineWithFocusWidget
 * @restrict E
 *
 * @description
 * The `prTimelineWidget` pulls data and presents it as a line chart with a focus area based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prLineWithFocusWidget', function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="lineChart.data" options="lineChart.options"></nvd3><div ng-show="wait" class="overlay"><i class="fa fa-refresh fa-spin"></i></div></div>',

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
          $scope.defaults = {
            height: height,
            showLegend: true
          };
          $scope.lineChart = {
            options: prUIOptionService.getLineWithFocusOptions(angular.merge($scope.defaults, $scope.options.chart || {}))
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
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 100;
            newParams.isTimeline = true;
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              scope.lineChart.data = [];

              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.lineChart.data = results;
                scope.lineChart.options = prUIOptionService.getLineWithFocusOptions(angular.merge(scope.defaults, scope.options.chart || {}));
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

.controller('prLineWithFocusWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prLineWithFocusWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES) {
      /**
       * Initializes dimensions and metrics options according to a data source.
       * @param  {string} dataSource Name of data source
       */
      $scope.init = function() {
        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
        $scope.newParams.granularity = 'five_minute';
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
