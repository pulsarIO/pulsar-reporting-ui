/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.creator')

.config(
    function($stateProvider) {
      $stateProvider.state('home.creator', {
        weight: 2,
        url: '/creator?:dashboard',
        views: {
          '': {
            templateUrl: 'src/ui/creator/creator.html',
            controller: 'CreatorController'
          },
          'dashboard@home.creator': {
            templateUrl: 'src/ui/creator/creatorDashboard.html',
            controller: 'CreatorDashboardController'
          }
        },
        resolve: {
          dashboards: function(prDashboardResource) {
            return prDashboardResource.query({right: 'view'}).$promise;
          },
          editableDashboards: function(prDashboardResource) {
            return prDashboardResource.query({right: 'manage'}).$promise;
          }
        },
        ncyBreadcrumb: {
          label: 'Reports Creator'
        },
        data: {
          pageTitle: 'Reports Creator'
        },
        menu: {
          name: 'Reports Creator',
          icon: 'fa fa-pencil',
          priority: 1
        }
      });
    })

/**
 * @ngdoc controller
 * @name pr.ui.creator.controller:CreatorController
 *
 * @description The `CreatorController` defines how to add, select and delete a dashboard.
 *
 * @requires pr.dashboard.prDashboardResource
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */
.controller('CreatorController',
  function($scope, $modal, $stateParams, $state, $location, $log, prDashboardResource, dashboards, editableDashboards) {
    $scope.dashboards = dashboards;
    $scope.editableDashboards = editableDashboards;

    $scope.dashboard = null;
    $scope.current = -1;
    $scope.savedDashboard = null;

    /**
     * @ngdoc method
     * @name addDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Opens a modal that adds a dashboard
     */

    $scope.addDashboard = function() {
      var modalInstance = $modal.open({
        scope: $scope,
        backdrop: 'static',
        templateUrl: 'src/ui/creator/modals/add.html',
        controller: 'CreatorModalAddController',
        size: 'lg'
      });

      modalInstance.result.then(function(dashboard) {
        $scope.dashboards.push(dashboard);
        $scope.selectDashboard($scope.dashboards.length - 1);
        prDashboardResource.query({right: 'manage'}, function(editableDbs) {
          angular.copy(editableDbs, $scope.editableDashboards);
        });
      }, function() {
        $log.log('error');
      });
    };

    /**
     * @ngdoc method
     * @name canEditDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Answers if the user can edit the dashboard
     * @returs {boolean} true if the dashboard is in the list of dashboards with manage rights
     */
    $scope.canEditDashboard = function() {
      var res = false;
      angular.forEach($scope.editableDashboards, function(editableDashboard) {
        if ($scope.dashboard && editableDashboard.name === $scope.dashboard.name) {
          res = true;
        }
      });
      return res;
    };

    /**
     * @ngdoc method
     * @name deleteDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description DELETEs a dashboard from the backend.
     * @param {function(value, responseHeaders) } success Success callback
     * @param {function(httpErrorResponse) } error Error callback
     */
    $scope.deleteDashboard = function() {
      if (!$scope.canEditDashboard()) {
        return;
      }
      var modalInstance = $modal.open({
        scope: $scope,
        backdrop: 'static',
        templateUrl: 'src/ui/creator/modals/delete.html'
      });
      modalInstance.result.then(function() {
        $scope.dashboards[$scope.current].$delete(function() {
          $scope.selectDashboard();
          prDashboardResource.query({right: 'manage'}, function(editableDbs) {
            angular.copy(editableDbs, $scope.editableDashboards);
          });
          prDashboardResource.query({right: 'view'}, function(dashboards) {
            angular.copy(dashboards, $scope.dashboards);
          });
        });
      });
    };

    /**
     * @ngdoc method
     * @name selectDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Select and show the content of a dashboard
     * @param {number} index Index of dashboard in the dashboards array
     */
    $scope.selectDashboard = function(i) {
      if ($scope.dashboards[i]) {
        $scope.current = i;
        $scope.dashboard = $scope.dashboards[i];
        $scope.dashboard.$get(function() {
          $scope.savedDashboard = angular.copy($scope.dashboard);
        });

        $stateParams.dashboard = $scope.dashboard.name;
        $state.params.dashboard = $scope.dashboard.name;
        $location.search('dashboard', $scope.dashboard.name);

      } else {
        $scope.dashboard = null;
        $scope.savedDashboard = null;
        $scope.current = -1;

        $stateParams.dashboard = undefined;
        $state.params.dashboard = undefined;
        $location.search('dashboard', undefined);
      }
    };

    // Initialize controller

    // If not dashboard is selected, a default dashboard is set
    if (angular.isUndefined($stateParams.dashboard)) {
      $scope.selectDashboard();
    } else {
      angular.forEach($scope.dashboards, function(d, i) {
        if ($stateParams.dashboard === d.name) {
          $scope.selectDashboard(i);
        }
      });
    }

  });

})();
