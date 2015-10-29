/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.layouts')

.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:12
       * @description
       *
       * Defines a single column layout for the dashboard.
       *
       * Uses Bootstap 3 class col-sm-12
       */
      prDashboardProvider.layout('12', {
        displayName: '1 full width column',
        columns: [{
          mockContent: '100%',
          styleClass: 'col-sm-12',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:6-6
       * @description
       *
       * Defines a 2-column layout for the dashboard.
       *
       * Uses Bootstap 3 class col-sm-6
       */
      prDashboardProvider.layout('6-6', {
        displayName: '2 columns (50% - 50%)',
        columns: [{
          mockContent: '50%',
          styleClass: 'col-sm-6',
          widgets: []
        }, {
          mockContent: '50%',
          styleClass: 'col-sm-6',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:3-3-3-3
       * @description
       *
       * Defines a 4-column layout for the dashboard. Each column is 25% width.
       *
       * Uses Bootstap 3 class col-sm-3
       */
      prDashboardProvider.layout('3-3-3-3', {
        displayName: '4 columns (25% each)',
        columns: [{
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }, {
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }, {
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }, {
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:4-8
       * @description
       *
       * Defines a 2-column layout for the dashboard. With 33% and 66% width respectively.
       *
       * Uses Bootstap 3 class col-sm-4 and col-sm-8
       */
      prDashboardProvider.layout('4-8', {
        displayName: '2 columns (33% - 66%)',
        columns: [{
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }, {
          mockContent: '66%',
          styleClass: 'col-sm-8',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:8-4
       * @description
       *
       * Defines a 2-column layout for the dashboard. With 66% and 33% width respectively.
       *
       * Uses Bootstap 3 class col-sm-8 and col-sm-4
       */
      prDashboardProvider.layout('8-4', {
        displayName: '2 columns (66% - 33%)',
        columns: [{
          mockContent: '66%',
          styleClass: 'col-sm-8',
          widgets: []
        }, {
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:4-4-4
       * @description
       *
       * Defines a 3-column layout for the dashboard. Each column is 33.3% width.
       *
       * Uses Bootstap 3 class col-sm-4
       */
      prDashboardProvider.layout('4-4-4', {
        displayName: '3 columns',
        columns: [{
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }, {
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }, {
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }]
      });

    });
})();
