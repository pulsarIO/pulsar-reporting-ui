/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

var deps = [
  'ngResource',
  'ncy-angular-breadcrumb',

  'pr.ui.creator',
  'pr.ui.admin',
  'pr.api',

  'ui.router.menus'
];

// Conditionally add modules if available
try {
  angular.module('pr.tpls');
  deps.push('pr.tpls');
} catch (err) { }

try {
  angular.module('pr.demo');
  deps.push('pr.demo');
} catch (err) { }

/**
 * @ngdoc object
 * @name pr
 * @requires $rootScope
 * @requires $log
 * @requires $state
 * @requires $stateParams
 * @description
 *
 * This is the main script to setup the stand-alone application, which does the following:
 *
 */
angular.module('pr', deps)

.config(
    function($stateProvider, $urlRouterProvider, $breadcrumbProvider, prApiProvider) {

      // Define the base state
      $stateProvider.state('home', {
        abstract: true,
        url: '',

        template: '<div ui-view></div>',

        controller: function($rootScope, $state) {
          $rootScope.pageTitle = function() {
            return $state.current.data.pageTitle;
          };
        },

        ncyBreadcrumb: {
          label: 'Pulsar Reporting UI Sample App'
        },
        data: {
          pageTitle: 'Home'
        }
      });

      // Configure the breadcrumb
      $breadcrumbProvider.setOptions({
        prefixStateName: 'home',
        includeAbstract: true
      });

      // If the url is ever invalid, e.g. '/asdf', then redire ct to '/' aka the home state
      $urlRouterProvider
        .otherwise('/demo/realtime');
    });
})();
