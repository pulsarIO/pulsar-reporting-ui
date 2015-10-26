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
 * @name pr.ui.creator.controller:CreatorModalSelectLayoutController
 *
 * @description The `CreatorModalSelectLayoutController` defines the modal to select layout,
 * including 12, 6-6, 3-3-3-3, 4-8, 8-4, and 4-4-4.
 *
 * @requires pr.dashboard.directive:prDashboard
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */

.controller('CreatorModalSelectLayoutController',
    function($scope, $modalInstance, prDashboard) {
      $scope.model = {
        layouts: prDashboard.layouts,
        selected: $scope.dashboard.config.layout
      };

      /**
       * @ngdoc method
       * @name select
       * @methodOf pr.ui.creator.controller:CreatorModalSelectLayoutController
       * @description Resolve the modal with the selected a layout
       */
      $scope.select = function() {
        $modalInstance.close($scope.model.selected);
      };

    });

})();
