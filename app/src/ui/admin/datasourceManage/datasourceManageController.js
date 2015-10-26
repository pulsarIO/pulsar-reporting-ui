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
 * @name pr.ui.admin.controller:DatasourceManageController
 *
 * @description The `DatasourceManageController` defines the content of the table,
 * and also enable functions like get, addDatasource, editDatasource and deleteDatasource.
 * Name validation is provided to allow letters and numbers only.
 * For view-only datasource, the edit and delete buttons are hidden according to permission control.
 *
 * @requires pr.ui.admin.resource.service:Datasources
 * @requires pr.UIOption.service:prUIOptionService
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */

.controller('DatasourceManageController',
    function($scope, $q, $timeout, prUIOptionService, Datasources, $modal) {

      $scope.datasourceRefresh = {
        loading: true
      };
      $scope.grid = $scope.grid || {};
      $scope.grid.gridOptions = prUIOptionService.getGridOptions({
        enableSorting: false,
        enableFiltering: true,
        title: 'DataSource Management',
        columnDefs: [{
          field: 'name',
          displayName: 'Datasource Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'displayName',
          displayName: 'Display Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'endpoint',
          displayName: 'Endpoint',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html',
          width: '30%'
        }, {
          field: 'type',
          displayName: 'Type',
          width: '10%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'owner',
          displayName: 'Creator',
          width: '10%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'operation',
          enableFiltering: false,
          headerCellClass: 'text-center',
          headerTemplate: '<div class="ui-grid-top-panel" style="text-align: center">Operation</div>',
          displayName: 'Operation',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceOperateView.html',
          width: '10%'
        }],
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
        }
      });

      $scope.datasourceParam = {};

      var mDefer = $q.defer();
      Datasources.query({type:'manage'}, {}, function succ(data) {
        mDefer.resolve(data);
      }, function fail(data) {
        mDefer.reject([]);
      });
      var vDefer = $q.defer();
      Datasources.query({type:'view'}, {}, function succ(data) {
        vDefer.resolve(data);
      }, function fail(data) {
        vDefer.reject([]);
      });

      var allDatasourcesPromise = $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);

      allDatasourcesPromise.then(function succ(result) {
        $scope.grid.gridOptions.data.length = 0;;
        angular.forEach(result, function(d) {
          $scope.grid.gridOptions.data.push(d);
        });
      }, function fail() {
        $scope.notification.error('Load Datasources Failed');
      });
      allDatasourcesPromise.finally(function() {
        $scope.datasourceRefresh.loading = false;
      });

      $scope.deleteDatasource = function(row) {
        var deleteDataSources = [row.entity.name];
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'src/ui/admin/datasourceManage/delete/delete.html',
          controller: 'DatasourceManageDeleteController',
          backdrop: 'static',
          resolve: {
            deleteDataSources: function() {
              return deleteDataSources;
            }
          }
        });
        modalInstance.result.then(function ok(result) {
          $scope.datasourceRefresh.loading = true;
          result.promise.then(function succ(data) {
            angular.forEach([row.entity], function(data, index) {
              $scope.grid.gridOptions.data.splice($scope.grid.gridOptions.data.indexOf(data), 1);
            });
            $scope.notification.success('Delete Datasource Successfully');
          }, function fail(data) {
            $scope.notification.error('Delete Datasource Failed');
          }).finally(function() {
            $scope.datasourceRefresh.loading = false;
          });
        }, function dismiss() {

        });
      };

      $scope.addDatasource = function() {
        var modalInstance;
        modalInstance = $modal.open({
          backdrop: 'static',
          templateUrl: 'src/ui/admin/datasourceManage/add/add.html',
          controller: 'DatasourceManageAddController'
        });

        modalInstance.result.then(function ok(result) {
          $scope.datasourceRefresh.loading = true;
          result.promise.then(function succ(data) {
            data.editable = true;
            $scope.grid.gridOptions.data.unshift(data);
            $scope.notification.success('Add Datasource Successfully');
          }, function fail(data) {
            $scope.notification.error((data && data.error) || 'Add Datasource Failed');
          }).finally(function() {
            $scope.datasourceRefresh.loading = false;
          });
        }, function cancel(data) {
        });

      };

      $scope.editDatasource = function editDatasource(row) {
        var modalInstance;
        modalInstance = $modal.open({
          backdrop: 'static',
          templateUrl: 'src/ui/admin/datasourceManage/edit/edit.html',
          controller: 'DatasourceManageEditController',
          resolve: {
            datasource: function() {
              return row;
            }
          }
        });
        modalInstance.result.then(function ok(result) {
          $scope.datasourceRefresh.loading = true;
          result.promise.then(function succ(newRow) {
            row.displayName = newRow.displayName;
            row.endpoint = newRow.endpoint;
            $scope.notification.success('Update Datasource Successfully');
          }, function fail(data) {
            $scope.notification.error('Update Datasource Failed');
          }).finally(function() {
            $scope.datasourceRefresh.loading = false;
          });
        }, function cancel(data) {
        });
      };

    });

})();
