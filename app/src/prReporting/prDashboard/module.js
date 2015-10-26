/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard', [
  'ui.sortable',
  'ui.bootstrap.modal',
  'ngResource',

  'pr.api'
])

/**
 * @ngdoc object
 * @name pr.dashboard.AGGREGATION_TYPES
 * @description
 *
 * Defines the types of aggregations in the param queries
 *
 * @example
 * <pre>
 *   .config(function (AGGREGATION_TYPES) { (...)
 * </pre>
 */
.constant('AGGREGATION_TYPES', ['count', 'sum', 'min', 'max', 'unique'])

/**
 * @ngdoc object
 * @name pr.dashboard.GRANULARITIES
 * @description
 *
 * Defines the types of granularities in the query
 *
 * @example
 * <pre>
 *   .config(function (GRANULARITIES) { (...)
 * </pre>
 */
.constant('GRANULARITIES', [{
    name: 'all',
    displayName: '-- Choose granularity if needed --'
  }, {
    name: 'hour',
    displayName: 'Hourly'
  }, {
    name: 'day',
    displayName: 'Daily'
  }, {
    name: 'week',
    displayName: 'Weekly'
  }]);

})();