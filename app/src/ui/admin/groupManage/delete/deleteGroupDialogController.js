/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';
angular.module('pr.ui.admin')
/**
 * @ngdoc controller

 * @name pr.ui.admin.controller:GroupDeleteDialogController

 * @description
 * The `GroupDeleteDialogController` is used to confirm user's willing to delete selected group.

 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */
.controller('GroupDeleteDialogController',
    function($scope, $modalInstance, $q) {
      $scope.close = function() {
        $modalInstance.dismiss('close');
      };
      $scope.confirm = function(info) {
        $modalInstance.close($q.resolve({}));
      };
    });
})();
