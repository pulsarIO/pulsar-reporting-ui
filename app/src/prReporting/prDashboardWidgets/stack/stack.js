/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.stack', [
    'nvd3',

    'pr.dashboard',
    'pr.UIOption',

    'pr.datasource.sql',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.stack.widget:pr-stack
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/stackedArea.html nvd3 stack area chart}. This widget displays data in
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
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/pie.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-stack', {
          label: 'Stack',
          icon: 'fa fa-area-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/stack/view.html',
          controller: 'prStackWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/stack/edit.html',
            controller: 'prStackWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.stack.directive:prStackWidget
 * @restrict E
 *
 * @description
 * The `prStackWidget` pulls data and presents it as a stacked area char based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prStackWidget', function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="stackChart.data" options="stackChart.options" class="interactive"></nvd3><div ng-show="wait" class="overlay"><i class="fa fa-refresh fa-spin"></i></div></div>',

        scope: {
          params: '=',
          options: '=?',
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
            xScale:  d3.time.scale(),
            showLegend: true
          };
          $scope.stackChart = {
            options: prUIOptionService.getStackedAreaChartOptions(angular.merge($scope.defaults, $scope.options.chart || {}))
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
            newParams.maxResults = newParams.maxResults || 200;
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getStackDataset({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.stackChart.data = results;
                scope.stackChart.options = prUIOptionService.getStackedAreaChartOptions(angular.merge(scope.defaults, scope.options.chart || {}));
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

.controller('prStackWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prStackWidgetEdit',
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

      // Init parameters
      $scope.newParams = widgetParams;

      var granularities = angular.copy(GRANULARITIES);
      granularities.shift();

      if (!$scope.newParams.granularity || $scope.newParams.granularity === 'all') {
        $scope.newParams.granularity = granularities[0].name;
      }
      $scope.granularities = granularities;

      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 200;

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
