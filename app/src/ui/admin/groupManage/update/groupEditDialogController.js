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

 * @name pr.ui.admin.controller:GroupEditDialogController

 * @description
 * The `GroupEditDialogController` is responsible to control


 * @requires pr.UIOption.service:prUIOptionService
 * @requires groupname Group's name passed from the place where dialog is opened
 * @requires groupUsers To be updated group's users
 * @requires groupRights To be updated group's rights(inlcuding datasource and dashboard)
 * @requires userRightsOfdatasources Retrieved user's rights about datasource
 * @requires userRightsOfdashboards Retrieved user's rights about dashboards
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 * @requires pr.ui.admin.resource.service:GroupUsers API service used to interact with backend to update the group's users
 * @requires pr.ui.admin.resource.service:GroupRights API service used to interact with backend to update the group's rihgts
 */
.controller('GroupEditDialogController',
    function($scope, $timeout, $q, prUIOptionService, uiGridConstants, $modalInstance, groupname, groupdisplayname, groupUsers, groupRights, userRightsOfgroups, userRightsOfdatasources, userRightsOfdashboards, userRightsOfsystem, Groups, GroupUsers, GroupRights) {

      var oldgroupdisplayname = groupdisplayname;
      $scope.groupdisplayname = groupdisplayname;

      var allRights = [];
      angular.forEach(userRightsOfdatasources, function(right) {
        allRights.push({
          rightName: right.name,
          displayName:right.displayName,
          owner:right.owner,
          rightType: '1',
          editable:right.editable,
          _MANAGE:false,
          _VIEW:false
        });
      });
      angular.forEach(userRightsOfdashboards, function(right) {
        allRights.push({
          rightName: right.name,
          displayName:right.displayName,
          owner:right.owner,
          rightType: '2',
          editable:right.editable,
          _MANAGE:false,
          _VIEW:false
        });
      });
      angular.forEach(userRightsOfgroups, function(right) {
        allRights.push({
          rightName: right.name,
          displayName:right.displayName,
          owner:right.owner,
          rightType: '4',
          editable:right.editable,
          _MANAGE:false,
          _VIEW:false
        });
      });
      angular.forEach(userRightsOfsystem, function(sysrightName) {
        allRights.push({
          rightName: sysrightName,
          displayName:sysrightName,
          rightType: '0',
          checked:false
        });
      });

      $scope.users = {
        new: angular.copy(groupUsers),
        old: angular.copy(groupUsers)
      };

      $scope.selectedStatus = 'All';

      $scope.singleFilter = function(selectedVal) {
        $scope.selectedStatus = selectedVal;
        $scope.gridApi.grid.refresh();
      };

      $scope.refilteringGridData = function(renderableRows) {

        //filter single filter to judge if the row is selected or not, if selected visible, otherwise invisible
        if ($scope.selectedStatus == 'All') {
          return renderableRows;
        } else {
          angular.forEach(renderableRows, function(row) {
            //TODO rewrite isSelected method
            if (isSelected(row)) {

            } else {
              row.visible = false;
            }
          });
        }

        //filter cell condition

        return renderableRows;
      };
      function isSelected(row) {
        var entity = row.entity;
        if (entity.rightType == '0') {
          return entity.checked;
        } else {
          return entity._VIEW || entity._MANAGE;
        }
      }

      $scope.dialogGrid = prUIOptionService.getGridOptions({
        enableRowSelection: true,
        enableFiltering: true,
        enableSorting: false,
        multiSelect: true,
        columnDefs: [{
          field: 'rightType',
          width: '15%',
          displayName: 'Type',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightTypeView.html',
          filter: {
          priority: 200,
          type: uiGridConstants.filter.SELECT,

          selectOptions: [{
            value: '0',
            label: 'System'
          }, {
            value: '1',
            label: 'Datasource'
          }, {
            value: '2',
            label: 'Dashboard'
          }, {
            value:'4',
            label: 'Group'
          }]
        }
        }, {
          field: 'rightName',
          displayName: 'Name',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameView.html',
          filter: {
            priority: 200,
            type: uiGridConstants.filter.CONTAINS
          }
        }, {
          field: 'displayName',
          displayName: 'Display Name',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightDisplayNameView.html',
          filter: {
            priority: 200,
            type: uiGridConstants.filter.CONTAINS
          }
        }, {
          field: 'owner',
          displayName: 'Creator',
          width: '10%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupCreatorView.html'
        }, {
          field: 'rightNameSuffix',
          displayName: 'Permissions',
          enableFiltering: false,
          width: '12%',
          headerCellClass: 'text-center',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameSuffixView.html'
        }],
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.grid.registerRowsProcessor($scope.refilteringGridData, 700);
        },
        data: allRights
      });

      var oldRightNames = [];
      angular.forEach(groupRights, function(groupRight) {
        oldRightNames.push(groupRight.rightType + groupRight.rightName + groupRight.rightNameSuffix);
      });

      $timeout(function() {
        markSelectedRows(groupRights, $scope.gridApi.grid.rows);
      });

      function markSelectedRows(selectedRights, allRights) {
        var checkerHelper = {};
        angular.forEach(selectedRights, function(right) {
          if (right.rightType == '0') {
            //System rights
            checkerHelper[right.rightName + right.rightType] = {
              checked:true
            };
          } else {
            //NON System rights
            var defaultValue = {
              _VIEW:false,
              _MANAGE:false
            };
            var rightsSet = checkerHelper[right.rightName + right.rightType] = checkerHelper[right.rightName + right.rightType] || defaultValue;
            if (right.rightNameSuffix == '_MANAGE') {
              rightsSet._MANAGE = true;
            } else {
              rightsSet._VIEW = true;
            }
          }

        });
        angular.forEach(allRights, function(row) {
          var right = row.entity;
          var typedRightObj = checkerHelper[right.rightName + right.rightType];

          //no need to process those unselected rows for users' rights
          if (typedRightObj) {
            if (right.rightType == '0') {

              //system rights
              right.checked = true;
            } else {

              //non system rights
              right._VIEW = typedRightObj._VIEW;
              right._MANAGE = typedRightObj._MANAGE;
            }
          }
        });
      }
      function stringArrayEqual(a1, a2) {
        if (a1.length != a2.length) {
          return false;
        } else {
          var flag = true;
          angular.forEach(a1, function(item) {
            if (a2.indexOf(item) == -1) {
              flag = false;
            }
          });
          return flag;
        }
      }
      function getSelectedRights() {
        var arr = [];
        angular.forEach($scope.dialogGrid.data, function(datum) {
          if (datum.rightType == '0') {
            if (datum.checked) {
              arr.push({
                rightName:datum.rightName,
                rightType:datum.rightType,
                rightNameSuffix:''
              });
            }
          } else {
            if (datum._MANAGE) {
              arr.push({
                rightName:datum.rightName,
                rightType:datum.rightType,
                rightNameSuffix:'_MANAGE'
              });
            }
            if (datum._VIEW) {
              arr.push({
                rightName:datum.rightName,
                rightType:datum.rightType,
                rightNameSuffix:'_VIEW'
              });
            }
          }
        });
        return arr;
      }

      $scope.ok = function ok() {

        var newRightNames = [];
        var currentRights = getSelectedRights();
        angular.forEach(currentRights, function(row) {
          newRightNames.push(row.rightType + row.rightName + row.rightNameSuffix);
        });

        var finalResult = {
          usersChanged: undefined,
          rightsChanged: undefined,
          groupdisplaynameChanged:undefined
        };

        if (oldgroupdisplayname != $scope.groupdisplayname) {
          var groupdisplaynameDefer = $q.defer();
          Groups.update({}, {name:groupname, displayName:$scope.groupdisplayname}, function succ(result) {
            groupdisplaynameDefer.resolve({name:groupname, displayName:$scope.groupdisplayname});
          }, function fail(result) {
            groupdisplaynameDefer.reject(result);
          });
          finalResult.groupdisplaynameChanged = {
            promise: groupdisplaynameDefer.promise
          };
        }

        if (_.difference($scope.users.old, $scope.users.new)) {
          var groupUsersPathParam = {groupName: groupname};
          var groupUsersDataParam = $scope.users.new;
          var usersUpdateDefer = $q.defer();
          var usersPromise = GroupUsers.replaceAll(groupUsersPathParam, groupUsersDataParam, function(newUsers) {
            usersUpdateDefer.resolve(newUsers);
          }, function(data) {
            usersUpdateDefer.reject(data);
          }).$promise;
          finalResult.usersChanged = {
            promise: usersUpdateDefer.promise
          };
        }

        if (!stringArrayEqual(newRightNames, oldRightNames)) {
          var groupRightsPathParam = {groupName: groupname};
          var groupRightsDataParam = [];
          angular.forEach(getSelectedRights(), function(gridRow) {
            groupRightsDataParam.push({
              rightName: gridRow.rightName + gridRow.rightNameSuffix,
              rightType: gridRow.rightType
            });
          });
          var rightsUpdateDefer = $q.defer();
          GroupRights.replaceAll(groupRightsPathParam, groupRightsDataParam, function(responseGroupRights) {
            var newGroupRights = [];
            var _MANAGE = '_MANAGE';
            var _VIEW = '_VIEW';
            angular.forEach(responseGroupRights, function(rawGroup) {
              var rightName = null;
              var rightNameSuffix = null;
              if (_.endsWith(rawGroup.rightName, _MANAGE)) {
                rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _MANAGE.length);
                rightNameSuffix = _MANAGE;
              } else if (_.endsWith(rawGroup.rightName, _VIEW)) {
                rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _VIEW.length);
                rightNameSuffix = _VIEW;
              }
              rawGroup.rightName = rightName;
              rawGroup.rightNameSuffix = rightNameSuffix;
              newGroupRights.push(rawGroup);
            });
            rightsUpdateDefer.resolve(newGroupRights);
          }, function(data) {
            rightsUpdateDefer.reject(data);
          });

          finalResult.rightsChanged = {
            promise: rightsUpdateDefer.promise
          };
        }

        $modalInstance.close($q.resolve(finalResult));
      };

      $scope.cancel = function() {
        $modalInstance.dismiss();
      };
    });

})();
