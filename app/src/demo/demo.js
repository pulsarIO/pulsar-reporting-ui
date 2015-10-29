/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.demo', [
  'angular-loading-bar',
  'ngAnimate',

  'ui.router',
  'pr.demo.realtime',
  'pr.demo.traffic'
])

.config(
    function($stateProvider) {
      $stateProvider.state('home.demo', {
        abstract: true,

        template: '<div ui-view></div>',

        url: '/demo',

        ncyBreadcrumb: {
          label: 'Demo'
        },
        data: {
          pageTitle: 'Demo'
        },
        menu: {
          name: 'Demo',
          icon: 'fa fa-dot-circle-o',
          tag: 'sidebar',
          priority: 100
        }
      });
    });
})();
