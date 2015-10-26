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
 * @name pr.numberfilter.filter:percentage
 * @function
 * @description Formats a number as a percentage. (e.g. 0.45 -> 45%)
 * @param {number} n Amount to format using 1 as 100%.
 * @param {number} fractionSize Number of decimal places to round the number to, defaults to 2.
 */
.filter('percentage',
    function($filter) {
      return function(n, fractionSize) {
        fractionSize = fractionSize || 2;
        var res = $filter('number')(n * 100, fractionSize);
        return res ? res + '%' : '';
      };
    });
})();
