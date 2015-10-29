/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.metric', [
    'pr.dashboard',
    'pr.countto',
    'pr.datasource.sql',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.metric.widget:pr-metric
       * @description
       *
       * Widget for a single metric view. Uses the style of {@link https://almsaeedstudio.com/themes/AdminLTE/pages/widgets.html Admin LTE widgets (style as in third row)}.
       * This widget displays data as a single animated value of a single metric, no dimensions are allowed.
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
       *   "type": "pr-metric",
       *   "params": {
       *     "dimensions": [], // No dimensions
       *     "metrics": [{
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
       *     "title": "A metric widget",
       *     "disabled": false,
       *     "icon": A string wit the class for an icon. Defaults to 'fa fa-heartbeat' (http://fortawesome.github.io/Font-Awesome/icon/heartbeat/)
       *     "description": "A description of the value, displayed on top of the value",
       *     "subDescription": "A small notice at the bottom of the value",
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-metric', {
          label: 'Metric',
          icon: 'fa fa-gears',
          templateUrl: 'src/prReporting/prDashboardWidgets/metric/view.html',
          controller: 'prMetricWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/metric/edit.html',
            controller: 'prMetricWidgetEdit'
          }
        });
    })
/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.metric.directive:prMetricWidget
 * @restrict E
 *
 * @description
 * The `prMetricWidget` pulls data and presents it as an animated metric.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before showing the metric.
 */
.directive('prMetricWidget',
    function(prDatasourceSqlService) {
      return {
        restrict: 'E',
        templateUrl: 'src/prReporting/prDashboardWidgets/metric/widget.html',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          $scope.options = $scope.options || {};
          $scope.icon = $scope.options.icon || 'fa fa-heartbeat';
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
            newParams.maxResults = 1;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');

              prDatasourceSqlService.getMetricData({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.totalNumber = results;
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.totalNumber = null;
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })
.controller('prMetricWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prMetricWidgetEdit',
    function(widgetParams, widgetOptions, $scope, prDatasourceSqlService, AGGREGATION_TYPES) {

      /**
       * Initializes metrics options according to a data source.
       */
      $scope.initMetrics = function() {
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

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initMetrics();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.metrics = [];
          $scope.initMetrics();
        }
      });

    });

})();
