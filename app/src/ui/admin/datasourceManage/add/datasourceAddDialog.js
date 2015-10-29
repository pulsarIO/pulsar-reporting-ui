/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc controller
 *
 * @name pr.ui.admin.controller:DatasourceManageAddController
 *
 * @description
 * The `DatasourceManageAddController` is to add a new datasouce by input datasource display name and endpoint.
 * Display name is unique, letters and numbers only.
 *
 * @requires pr.ui.admin.resource.service:Datasources
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */

// controller for all groups
angular.module('pr.ui.admin')
.controller('DatasourceManageAddController',
    function($scope, $modalInstance, Datasources, $q) {
      $scope.datasourceParam = {};

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
      $scope.save = function() {
        var datasource = {
          displayName: $scope.datasourceParam.displayName,
          type: 'druid',
          endpoint: $scope.datasourceParam.endpoint
        };
        var defer = $q.defer();
        Datasources.add({}, datasource, function succ(result) {
          defer.resolve(result);
        }, function fail(data) {
          defer.reject(data.data);
        });
        $modalInstance.close($q.resolve({
          promise: defer.promise
        }));
      };
    });
})();