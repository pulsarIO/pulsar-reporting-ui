/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.creator')

/**
 * @ngdoc controller
 * @name pr.ui.creator.controller:CreatorDashboardController
 *
 * @description The `CreatorDashboardController` defines how to create customized dashboard.
 * You can select the layout and date range, then add widgets and save dashboard.
 *
 * @requires pr.dashboard.directive:prDashboard
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */
.controller('CreatorDashboardController',
  function($scope, $modal, $filter, prApi, prDashboard) {

    /**
     * @ngdoc method
     * @name refreshDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Reload the current dashboard from the backend
     */
    $scope.refreshDashboard = function() {
      $scope.dashboard.$get(function() {
        $scope.savedDashboard = angular.copy($scope.dashboard);
        if ($scope.dashboard && $scope.dashboard.config && $scope.dashboard.config.filters) {
          $scope.whereRaw = $scope.dashboard.config.filters.whereRaw || '';
        }
      });
    };

    /**
     * @ngdoc method
     * @name persistDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Saves the dashboard to the backend
     */
    $scope.persistDashboard = function() {
      $scope.dashboard.$update(function() {
        $scope.savedDashboard = angular.copy($scope.dashboard);
      });
    };

    /**
     * @ngdoc method
     * @name changeDateRange
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Navigates to a new date range, used by pr-datepicker directive as a callback for date changes.
     * @param  {moment} start Start Date
     * @param  {moment} end   End Date
     */
    $scope.changeDateRange = function(start, end) {
      $scope.dashboard.config.filters.intervals = $filter('intervalDate')(start) + '/' + $filter('intervalDate')(end);
    };

    $scope.removeFilter = function(name) {
      delete $scope.dashboard.config.filters.where[name];
    };

    $scope.addRawFilter = function(filter) {
      $scope.dashboard.config.filters.whereRaw = filter;
    };

    $scope.isDashboardSaved = function() {
      return angular.equals($scope.dashboard, $scope.savedDashboard);
    };

    /**
     * @ngdoc method
     * @name selectLayout
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Select the layout of dashboard
     * @param  {number} layoutId The layout id, '12' stand for Bootstap 3 class col-sm-12
     */
    $scope.selectLayout = function() {
      var modalInstance = $modal.open({
        scope: $scope,
        backdrop: 'static',
        templateUrl: 'src/ui/creator/modals/layout.html',
        controller: 'CreatorModalSelectLayoutController',
        size: 'lg'
      });

      modalInstance.result.then(function(layoutId) {
        // Note, layout is the id string
        $scope.dashboard.config.layout = layoutId;
      });
    };

    /**
     * @ngdoc method
     * @name setEditMode
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Set the edit mode of the dashboard
     * @param {boolean} editMode New edit mode value
     */
    $scope.setEditMode = function(editMode) {
      $scope.editMode = editMode;
    };

    /**
     * @ngdoc method
     * @name addWidget
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Add a new widget to the dashboard
     * @param {string} widgetType Widget tpye name, must match one of the widgets in the prDashboard service.
     */
    $scope.addWidget = function(widgetType) {
      // Create a default empty generic widget
      var widget = {
        type: widgetType,

        params: {
          dataSourceName: $scope.dashboard.config.dataSourceName || '',
          table: '',
          dimensions: [],
          metrics: [],
          maxResults: undefined,
          granularity: 'all'
        },
        options: {
          title: '',

          // The widget is initialized with disabled state
          disabled: true
        }
      };
      $scope.dashboard.config.columns[0].widgets.unshift(widget);
    };

    // Initialize controller

    // Get list of available widgets in the service
    $scope.widgets = prDashboard.widgets;

    // Ensure once the dahboard is loaded, the dates and filters stay syncronized
    $scope.$watch('dashboard.config.filters', function(filters) {
      if (filters) {
        $scope.start = moment.tz(filters.intervals.split('/')[0], prApi.timezone).format('X');
        $scope.end = moment.tz(filters.intervals.split('/')[1], prApi.timezone).format('X');
        $scope.whereRaw = filters.whereRaw || '';
      }
    }, true);

    // The dashboard is initially not in edit mode
    $scope.editMode = false;

  });

})();
