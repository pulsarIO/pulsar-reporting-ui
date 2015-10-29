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
 * @name pr.numberfilter.filter:float
 * @deprecated
 * @function
 * @description Formats a number as a decimal. **This filter is deprecated, please use number filter instead.**
 * @param {number} n Amount to format.
 */
.filter('float',
    function($log, $filter) {
      return function(n) {
        $log.warn('"float" filter (in pr.numberfilter module) is deprecated, please use the core "number" filter');
        return $filter('number')(n, 2);
      };
    });

})();
