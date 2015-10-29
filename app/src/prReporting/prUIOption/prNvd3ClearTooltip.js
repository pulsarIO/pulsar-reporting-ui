/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.UIOption')

.directive('prNvd3ClearTooltip',
    function() {
      var _rootScope;

      return {
        restrict: 'A',
        controller: function($rootScope) {
          _rootScope = $rootScope;
        },
        link: function(scope, element) {
          scope.$watch('api', function(api) {
            var chartScope = scope.api.getScope();

            var off = _rootScope.$on('$stateChangeSuccess', function() {
              if (chartScope.chart && chartScope.chart.tooltip) {
                d3.select('#' + chartScope.chart.tooltip.id()).remove();
              }
              off();
            });

            chartScope.$watch('chart', function(chart, oldChart) {
              // When replacing an old chart, we make sure the tooltips are removed
              if (chart.id !== oldChart.id && oldChart.tooltip) {
                d3.select('#' + oldChart.tooltip.id()).remove();
              }
            });
          });
        }
      };
    });

})();
