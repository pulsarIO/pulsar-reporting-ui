/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc controller

 * @name pr.ui.admin.controller:DatasourceManageDeleteController

 * @description
 * The `DatasourceManageDeleteController` is to delete the datasouce.
 *
 * @requires pr.ui.admin.resource.service:Datasources *
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */

// controller for all groups
angular.module('pr.ui.admin')

.controller('DatasourceManageDeleteController',
    function($scope, $modalInstance, $q, Datasources, deleteDataSources) {
      $scope.delete = function() {
        var defer = $q.defer();
        Datasources.remove({names: deleteDataSources}, {}, function(data) {
          defer.resolve(data);
        }, function(data) {
          defer.reject(data);
        });
        $modalInstance.close($q.resolve({
          promise: defer.promise
        }));
      };
    });

})();
