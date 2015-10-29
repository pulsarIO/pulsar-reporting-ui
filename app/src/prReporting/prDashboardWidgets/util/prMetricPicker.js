/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.util')

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.util.directive:prMetricPicker
 * @restrict E
 * @scope
 *
 * @description
 * The `prMetricPicker` creates a picker for one or more metrics from a list of metric options and aggregation types.
 *
 * It's model is the `metrics` attribute. `metrics` will be updated as the user adds them on the UI. `metrics`
 * will update via two-way binding.
 *
 * Attributes `metric-options` and `aggregation-options` added into the directive will display options
 * to the user to create the list of metrics.
 *
 * @param {Array<object>} metrics The model, which contains the list of selected metrics.
 *   Each metric contains the following properties
 *   - `name` - `{string=}` - Column name in the data source query
 *   - `type` - `{string=}` - Aggregation type (count, sum, etc...)
 *   - `alias` - `{string=}` - Column alias in the data source query
 *
 * @param {boolean} multiple `true` if the user can input multiple metrics, `false` to allow one single metric.
 * @param {Array<object>} metricOptions The array of metric options
 *   Each metric option contains the following properties
 *   - `name` - `{string=}` - Name of the metric
 *
 * @param {Array<string>} aggregationOptions Array of string containing the kinds of aggregations that are allowed for the
 * metrics. (eg. "count", "sum", "min", "max", "unique")
 */
.directive('prMetricPicker', function() {
    return {
      restrict: 'E',
      scope: {
        metrics: '=',
        multiple: '=?',
        metricOptions: '=',
        aggregationOptions: '='
      },
      templateUrl: 'src/prReporting/prDashboardWidgets/util/prMetricPicker.html',
      link: function(scope) {

        scope.metrics = scope.metrics || [];

        function newMetric(metricName) {
          var type = null;
          if (scope.aggregationOptions && scope.aggregationOptions.length) {
            type = scope.aggregationOptions[0];
          }
          return {name: metricName, type: type, alias: metricName};
        }

        scope.selectMetric = function(metricName) {
          scope.metrics[0] = newMetric(metricName);
        };

        /**
         * Add a metric
         * @param {[type]} metricName [description]
         */
        scope.addMetric = function(metricName) {
          scope.metrics.push(newMetric(metricName));
        };

        /**
         * Removes a metric by index
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        scope.removeMetric = function(index) {
          scope.metrics.splice(index, 1);
        };

        // init
        scope.$watchGroup(['multiple', 'metricOptions', 'aggregationOptions'], function(newValues) {

          // Ensure we have a exactly 1 metric if is not multiple
          var isMultiple = newValues[0];
          scope.metrics = scope.metrics || [];
          if (!isMultiple) {
            if (scope.metrics.length === 0 && scope.metricOptions && scope.metricOptions.length > 0) {
              scope.selectMetric(scope.metricOptions[0].name);
            }
            if (scope.metrics.length > 1) {
              scope.metrics.splice(1, scope.metrics.length - 1);
            }
          }
        });
      }
    };
  });

})();
