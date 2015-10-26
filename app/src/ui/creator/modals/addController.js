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
 * @name pr.ui.creator.controller:CreatorModalAddController
 *
 * @description The `CreatorModalAddController` defines the modal to create a new dashboard, including name and type input
 *
 * @requires pr.dashboard.directive:prDashboard
 * @requires pr.dashboard.prDashboardResource
 * @requires pr.datasource.sql.prDatasourceSqlService
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */

.controller('CreatorModalAddController',
    function($scope, $modalInstance, $filter, prApi, prDashboard, prDatasourceSqlService, prDashboardResource) {
      $scope.saveError = null;

      /**
       * @ngdoc method
       * @name add
       * @methodOf pr.ui.creator.controller:CreatorModalAddController
       * @description Adds a dashboard to the backend, resolves the modal if succesful
       */
      $scope.add = function() {
        // Create a blank dashboard
        var structure = angular.copy(prDashboard.layouts[$scope.newDashboard.config.layout]);
        angular.extend($scope.newDashboard.config, structure);

        $scope.wait = true;

        $scope.newDashboard.$save(function() {
          $scope.wait = false;
          $modalInstance.close($scope.newDashboard);
        }, function(error) {
          $scope.wait = false;
          $scope.saveError = error;
        });

      };

      // Initialize controller

      // Build default values of the dashboard
      var startTime = moment().tz(prApi.timezone).startOf('day').subtract(1, 'weeks').format('X');
      var endTime = moment().tz(prApi.timezone).endOf('day').subtract(1, 'days').format('X');

      $scope.newDashboard = new prDashboardResource({
        displayName: 'Dashboard ' + ($scope.dashboards.length + 1),
        config: {
          dataSourceName: '',
          layout:  '4-4-4',
          filters: {
            intervals: $filter('intervalDate')(startTime) + '/' + $filter('intervalDate')(endTime),
            where: {}
          }
        }
      });

      $scope.wait = true;
      $scope.dataSourcesError = null;

      prDatasourceSqlService.getDataSources({}, {}, function(data) {
        $scope.dataSources = data;
        $scope.wait = false;
      }, function(errorResponse) {
        $scope.error = 'Error';
        $scope.wait = false;
        if (errorResponse.data && errorResponse.data.error) {
          $scope.dataSourcesError = errorResponse.data.error;
        }
      });
    });

})();
