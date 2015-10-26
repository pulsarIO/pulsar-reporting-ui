/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.numberfilter')

/**
 * @ngdoc filter
 * @name pr.numberfilter.filter:duration
 * @function
 * @description Formats a number in miliseconds as a duration in the format HH:mm:ss (e.g. 01:59:59)
 * @param {number} n Amount in miliseconds to format, can be negative.
 */
.filter('duration',
    function() {
      function pad(num) {
        var s = num + '';
        while (s.length < 2) {
          s = '0' + s;
        }
        return s;
      }

      return function(n) {
        if (angular.isNumber(n)) {
          n = parseFloat(n);
          if (n !== n) {
            n = 0;
          }

          var duration = moment.duration(Math.abs(n), 'milliseconds');
          return (n < 0 ? '-' : '') + pad(Math.floor(duration.asHours())) + ':' + pad(duration.minutes()) + ':' + pad(duration.seconds());
        }
        return '';
      };
    });

})();
