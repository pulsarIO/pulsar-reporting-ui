/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.gridextensions')

/**
 * @ngdoc directive
 * @name pr.gridextensions.directive:prGridLimitation
 * @restrict A
 *
 * @description This small helper directive, when added to a ui-grid, will auto calculate the grid height dynamically.
 * Requires the grid to have a set number of rows or a pagination to work.
 *
 * @requires ui-grid
 *
 */
.directive('prGridLimitation',
    function(gridUtil, uiGridConstants, $modal) {
      return {
        restrict: 'A',
        require: 'uiGrid',
        link: function($scope, $elm, $attrs, uiGridCtrl) {
          var gridApi = uiGridCtrl.grid.api;
          var selectedRows = [];
          var maximum = $attrs.prGridLimitation;

          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            selectedRows = gridApi.selection.getSelectedRows();
            if (selectedRows.length > maximum) {
              $modal.open({
                templateUrl: 'src/prReporting/prGridExtensions/prGridLimitationAlert.html',
                backdrop: 'static',
                controller: function($scope, $modalInstance, maximum) {
                  $scope.maximum = maximum;
                  $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                  };
                },
                resolve: {
                  maximum: function() {
                    // deep copy
                    return maximum;
                  }
                }
              });
              gridApi.selection.unSelectRow(row.entity);
            }

            if (selectedRows.length > 0) {
              gridApi.grid.selection.selectAll = true;
            }
          });

          gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            if (gridApi.grid.selection.selectAll) {
              gridApi.grid.selection.selectAll = false;
              gridApi.selection.clearSelectedRows();
            } else {
              //select limited maximum rows in current page
              var paginationPageSize = gridApi.grid.options.paginationPageSize;
              var pageIndex = gridApi.pagination.getPage() - 1;
              var start = paginationPageSize * pageIndex;
              var end = (+start) + (+maximum);

              angular.forEach(rows, function(row, index) {
                row.isSelected = index >= start && index < end;
              });
            }
          });

        }
      };
    });
})();
