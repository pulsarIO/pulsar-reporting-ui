/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.bar', [
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
       * @name pr.dashboard.widgets.bar.widget:pr-bar
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/discreteBar.html nvd3 discrete bar chart}. This widget displays data in
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
       *   "type": "pr-bar",
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
       *     "title": "A bar chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/discreteBar.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-bar', {
          label: 'Bar',
          icon: 'fa fa-bar-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/bar/view.html',
          controller: 'prBarWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/bar/edit.html',
            controller: 'prBarWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.bar.directive:prBarWidget
 * @restrict E
 *
 * @description
 * The `prBarWidget` pulls data and presents it as a bar chart based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying on the chart.
 */
.directive('prBarWidget', function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="barChart.data" options="barChart.options" pr-nvd3-clear-tooltip api="api" class="interactive"></nvd3></div>',

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
            }
          };

          $scope.barChart = {
            options: prUIOptionService.getDiscreteBarChartOptions(angular.merge(defaults, $scope.options.chart || {}))
          };
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
            newParams.maxResults = newParams.maxResults || 10;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.barChart.data = results;
                scope.barChart.options.chart.xAxis = {axisLabel: results[0].key};
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.barChart.data = [];
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prBarWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prBarWidgetEdit',
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
      },
      function(error) {
        //To handler the error
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
