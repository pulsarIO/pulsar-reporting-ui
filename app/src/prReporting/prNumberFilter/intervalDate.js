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
 * @name pr.numberfilter.filter:intervalDate
 * @description Formats time to be used in the queries
 *
 * @param {string|number} time Timestamp to be converted
 * @param {string=} format Format to use in returning the date. Defaults to 'X' (timestamp)
 * @param {string=} originalFormat Format. Defaults to 'YYYY-MM-DD HH:mm:ss'
 * @param {string=} timezone Timezone
 */
.filter('intervalDate',
    function(prApi) {
      return function(time, format, originalFormat, timezone) {
        originalFormat = originalFormat || 'X';
        timezone = timezone || prApi.timezone;
        format = format || 'YYYY-MM-DD HH:mm:ss';

        return moment(time, originalFormat).tz(timezone).format(format);
      };
    });
})();