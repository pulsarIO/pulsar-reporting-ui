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
 * @name pr.ui.admin.controller:DatasourceManageEditController
 *
 * @description
 * The `DatasourceManageEditController` is to update the name and endpoint of datasouce.
 *
 * @requires pr.ui.admin.resource.service:Datasources
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */

// controller for all groups
angular.module('pr.ui.admin')
.controller('DatasourceManageEditController',
    function($scope, $modalInstance, Datasources, datasource, $q) {
      $scope.datasourceParam = angular.copy(datasource);
      $scope.cancel = function() {
        $modalInstance.dismiss();
      };
      $scope.ok = function() {
        var dataParam = {
          name: $scope.datasourceParam.name,
          displayName: $scope.datasourceParam.displayName,
          type: $scope.datasourceParam.type,
          endpoint: $scope.datasourceParam.endpoint
        };

        var defer = $q.defer();
        var result = defer.promise;
        Datasources.update(dataParam, function succ(result) {
          defer.resolve(dataParam);
          return result;
        }, function fail() {
          defer.reject({});
        });
        $modalInstance.close($q.resolve({
          promise: result
        }));
      };
    });
})();
