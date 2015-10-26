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
 * @name pr.numberfilter.filter:range
 * @function
 * @description Creates an array of sequential n numbers such as [0, 1, 2, 3, ...]
 * @param {number} n Amount of numbers to create. Should be a positive integer.
 */
.filter('range',
    function() {
      return function(n) {
        var res = [];
        for (var i = 0; i < n; i++) {
          res.push(i);
        }
        return res;
      };
    });
})();
