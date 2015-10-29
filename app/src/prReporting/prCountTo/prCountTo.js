/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.countto')

/**
 * @ngdoc directive
 * @name pr.countto.directive:prCountTo
 * @scope
 * @restrict EA
 *
 * @description
 * The `prCountTo` directive displays an animated numeric count using jQuery countTo.
 *
 * https://github.com/mhuggins/jquery-countTo
 *
 * If the plugin is not present, the contents will be replaced directly in to the html tag.
 *
 * The animation lasts for 1 second.
 *
 * This directive makes use of both $timeout and setInterval to animate the number.
 *
 * @param {number} value The value to animate, animation will happen every time it changes.
 * @param {number} decimals Number of decimals
 * @param {string} placeholder Text to show in case the value is not a number: undefined or null
 */
.directive('prCountTo',
    function($compile, $parse, $timeout, $filter) {
      return {
        restrict: 'EA',
        scope: {
          value:'=',
          decimals:'=?',
          placeholder: '=?'
        },
        template: '',

        link: function(scope, element) {
          scope.placeholder = scope.placeholder || '--';

          scope.formatter = function(value) {
            return $filter('number')(value, scope.decimals || 0);
          };

          scope.$watch('value', function(newValue, oldValue) {
            if (!angular.isNumber(newValue)) {
              element.html(scope.placeholder);
            } else if (element.countTo && angular.isNumber(oldValue)) {
              $timeout(function() {
                element
                  .countTo('stop')
                  .countTo({
                    from:  oldValue,
                    to: newValue,
                    speed: 1000,
                    formatter: scope.formatter,
                    refreshInterval: 100
                  });
              }, 100);
            } else {
              element.html(scope.formatter(newValue));
            }
          });
        }
      };
    });

})();
