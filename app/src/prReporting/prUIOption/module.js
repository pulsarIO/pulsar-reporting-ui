/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc overview
 * @name pr.UIOption
 * @description
 *
 * pr.UIOption module several methods to quickly create widgets with a default configuration.
 *
 * The pr.UIOption provides a service to generate several default settings, which can as well be overrided when needed.
 *
 * This module is to be used on ui-grid and angular nvd3 components
 */
angular.module('pr.UIOption', [
  'pr.numberfilter',
  'ui.grid'
]);

})();