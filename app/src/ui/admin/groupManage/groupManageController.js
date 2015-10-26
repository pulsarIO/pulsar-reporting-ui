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

 * @name pr.ui.admin.controller:GroupManageController

 * @description
 * The `GroupManageController` is used to control admin page group management table.
 * For Wire all features workable, only need to provide below dependencies which will be injected into this controller.
 * Specifically to say, users only need to provide valid api service as clarified in related API Call Service, and load related module,
 * then admin module's features can be set up rightly.

 * @requires pr.ui.admin.service:GroupSearchService
 * @requires pr.UIOption.service:prUIOptionService
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * @requires pr.ui.admin.resource.service:Groups API service used to interact with backend to get the user's groups
 * @requires pr.ui.admin.resource.service:GroupUsers API service used to interact with backend to get the group's users
 * @requires pr.ui.admin.resource.service:GroupRights API service used to interact with backend to get the group's rights
 * @requires pr.ui.admin.resource.service:Datasources API service used to interact with backend to get the user's rights on datasource
 * @requires pr.ui.admin.resource.service:SysRights API service used to interact with backend to get the user's system rights
 * @requires pr.dashboard.prDashboardResource API service used to interact with backend to get the user's rights on prDashboardResource
 */
.controller('GroupManageController',
    function GroupManageController($scope, $q, $timeout, GroupSearchService, GroupRightsTransform, prUIOptionService, $modal, Groups, GroupUsers, GroupRights, Datasources, SysRights, prDashboardResource) {

      $scope.groupsRefresh = {
        loading: true
      };

      $scope.groupGrid = prUIOptionService.getGridOptions({
        enableRowSelection: false,
        enableSorting: false,
        enableFiltering: true,
        multiSelect: false,
        title: 'DataSource Management',
        columnDefs: [{
          field: 'name',
          displayName: 'Group Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupNameView.html'
        }, {
          field: 'displayName',
          displayName: 'Display Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupDisplayNameView.html'
        }, {
          field: 'users',
          filter:{
            condition: GroupSearchService.USERS_CONTAINS
          },
          displayName: 'Users',
          width: '40%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupUsersView.html'
        }, {
          field: 'owner',
          displayName: 'Creator',
          width: '10%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupCreatorView.html'
        }, {
          field: 'operation',
          enableFiltering: false,
          displayName: 'Operation',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupOperateView.html',
          width: '10%'
        }],
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
        }
      });

      //Initialization
      $scope.groups = {};
      $scope.groupsControllers = {};

      var groupPathParam = {type:'manage'};
      var groupDataParam = {};
      var mDefer = $q.defer();
      Groups.query(groupPathParam, groupDataParam, function succ(responseGroups) {
        mDefer.resolve(responseGroups);
      }, function fail(responseGroups) {
        mDefer.reject([]);
      });
      var vDefer = $q.defer();
      Groups.query({type:'view'}, {}, function succ(responseGroups) {
        vDefer.resolve(responseGroups);
      }, function fail(responseGroups) {
        vDefer.reject([]);
      });

      var allGroupsPromise = $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);
      allGroupsPromise.then(function succ(responseGroups) {

        //make indices for each group
        angular.forEach(responseGroups, function(group) {
          $scope.groups[group.name] = {
            name: group.name,
            displayName: group.displayName,
            users: [],
            owner: group.owner,
            editable:group.editable

          };
        });

        registerGroupsUIControllersAndBelongData($scope.groups);

        //assemble data for groups' grid
        angular.forEach($scope.groups, function(group, groupname) {
          $scope.groupGrid.data.push(group);
        });
      }, function fail() {

        //TODO
        $scope.notification.error('Load Groups Failed');
      });
      allGroupsPromise.finally(function() {
        $scope.groupsRefresh.loading = false;
      });

      $scope.editRow = function editRow(groupname) {
        $scope.groupsRefresh.loading = true;
        var modalInstance = $modal.open({
          scope: $scope,
          templateUrl: 'src/ui/admin/groupManage/update/edit.html',
          controller: 'GroupEditDialogController',
          size:'lg',
          backdrop: 'static',
          resolve: {
            groupname: function() {
              return groupname;
            },
            groupdisplayname:function() {
              return $scope.groups[groupname].displayName;
            },
            groupUsers: function() {
              return angular.copy($scope.groups[groupname].users);
            },
            userRightsOfdatasources: function ownerDataSources() {
              var vDefer = $q.defer();
              Datasources.query({type:'view'}, {}, function(owningDataSources) {
                vDefer.resolve(owningDataSources);
              }, function(owningDataSources) {
                vDefer.reject([]);
              });

              var mDefer = $q.defer();
              Datasources.query({type:'manage'}, {}, function(owningDataSources) {
                mDefer.resolve(owningDataSources);
              }, function(owningDataSources) {
                mDefer.resolve([]);
              });

              return $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);
            },
            userRightsOfdashboards: function ownerDashboards() {
              var vDefer = $q.defer();
              prDashboardResource.query({right:'view'}, {}, function(owningDashboards) {
                vDefer.resolve(owningDashboards);
              }, function(owningDashboards) {
                vDefer.reject([]);
              });

              var mDefer = $q.defer();
              prDashboardResource.query({right:'manage'}, {}, function(owningDashboards) {
                mDefer.resolve(owningDashboards);
              }, function(owningDashboards) {
                mDefer.reject([]);
              });

              return $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);
            },
            userRightsOfsystem:function() {
              var defer = $q.defer();
              SysRights.query({}, {}, function(data) {
                defer.resolve(data);
              }, function(data) {
                defer.reject(data);
              });
              return defer.promise;
            },
            userRightsOfgroups:function() {
              var rights = [];
              angular.forEach($scope.groups, function(group, groupname) {
                var copy = angular.copy(group);
                rights.push(copy);
              });
              return rights;
            },
            groupRights: function() {
              var result = groupRightsPromise(groupname, $scope.groups[groupname]);
              return result;
            }
          }
        });
        modalInstance.opened.then(function succ() {

        }, function fail() {

          //TODO notification
          $scope.notification.error('Get User Latest Rights Failed');
        }).finally(function() {
          $scope.groupsRefresh.loading = false;
        });
        modalInstance.result.then(function close(result) {
          var groupdisplaynamePromise = result.groupdisplaynameChanged;
          if (groupdisplaynamePromise) {
            $scope.groupsControllers[groupname].displayNameInLoading = true;

            groupdisplaynamePromise.promise.then(function succ(updatedGroup) {
              $scope.groups[groupname].displayName = updatedGroup.displayName;

              //TODO notification
              $scope.notification.success('Update Group Name Successfully');
            }, function fail(updatedGroup) {

              //TODO notification
              $scope.notification.error('Update Group Name Failed');
            }).finally(function() {
              $scope.groupsControllers[groupname].displayNameInLoading = false;
            });
          }

          var usersPromise = result.usersChanged;
          if (usersPromise) {
            $scope.groupsControllers[groupname].usersInLoading = true;

            usersPromise.promise.then(function succ(newUsers) {
              //clear
              $scope.groups[groupname].users.length = 0;
              angular.forEach(newUsers, function(user) {
                $scope.groups[groupname].users.push(user);
              });

              //TODO notification
              $scope.notification.success('Update Users Successfully');
            }, function fail(data) {

              //TODO notification
              $scope.notification.error('Update Users Failed');

            }).finally(function() {
              $scope.groupsControllers[groupname].usersInLoading = false;
            });
          }

          var rightsPromise = result.rightsChanged;
          if (rightsPromise) {
            $scope.groupsControllers[groupname].rightsInLoading = true;

            rightsPromise.promise.then(function succ(newRights) {

              //TODO notification
              $scope.notification.success('Update Rights Successfully');
            }, function fail(data) {

              //TODO notification
              $scope.notification.error('Update Rights Failed');
            });
          }

        }, function dismiss() {

        });
      };

      $scope.prepareRemoveRow = function(groupName) {
        var modalInstance = $modal.open({
          backdrop: 'static',
          templateUrl: 'src/ui/admin/groupManage/delete/removeDialogTemplate.html',
          controller: 'GroupDeleteDialogController',
          size: 'md'
        });

        modalInstance.result.then(function ok() {
          $scope.removeGroup(groupName);
        }, function dismiss(info) {
        });

      };

      $scope.removeGroup = function(groupName) {
        var groupPathParam = {groupName: groupName};
        var groupDataParam = {};

        $scope.groupsRefresh.loading = true;

        Groups.remove(groupPathParam, groupDataParam, function(group) {

          //TODO message notification for success
          $scope.notification.success('Delete Group Successfully');

          var index = $scope.groupGrid.data.indexOf($scope.groups[groupName]);
          $scope.groupGrid.data.splice(index, 1);
          delete $scope.groups[groupName];
          delete $scope.groupsControllers[groupName];
        }, function(group) {

          //TODO message notification for fail
          $scope.notification.error('Delete Group Failed');

        }).$promise.finally(function() {
            $scope.groupsRefresh.loading = false;
          });
      };
      $scope.addOperation = {};

      $scope.addNewGroup = function() {

        var groupPathParam = {};
        var groupDataParam = {displayName: $scope.addOperation.newGroupName};
        if ($scope.addOperation.newGroupName) {
          $scope.groupsRefresh.loading = true;
          Groups.add(groupPathParam, groupDataParam, function(group) {
            group.users = [];
            group.datasources = [];
            group.dashboards = [];
            group.managedGroups = [];
            group.editable = true;
            $scope.groups[group.name] = group;
            $scope.groupGrid.data.unshift(group);

            $scope.groupsControllers[group.name] = {
              usersInLoading: false,
              rightsInLoading: false,
              displayNameInLoading:false
            };

            //clear input content after adding successfully
            $scope.addOperation.newGroupName = '';

            //TODO
            $scope.notification.success('Add Group Successfully');
          }, function(response) {
            var data = response.data;

            //TODO
            $scope.notification.error((data && data.error) || 'Add Group Failed');
          }).$promise.finally(function() {
              $scope.groupsRefresh.loading = false;
            });
        }

      };

      function registerGroupsUIControllersAndBelongData(groups) {
        angular.forEach(groups, function(group, groupname) {
          //for ui control
          $scope.groupsControllers[groupname] = {
            displayNameInLoading:false,
            usersInLoading: true
          };

          //update group users asynchronously
          groupUsersPromise(groupname, group).finally(function() {
            $scope.groupsControllers[groupname].usersInLoading = false;
          });

        });
      }

      function groupUsersPromise(groupName, group) {
        var groupUsersPathParam = {groupName: groupName};
        var groupUsersDataParam = {};
        var _defer = $q.defer();
        GroupUsers.query(groupUsersPathParam, groupUsersDataParam, function(groupUsers) {

          //update
          angular.forEach(groupUsers, function(val) {
            group.users.push(val);
          });
          _defer.resolve(groupUsers);
        }, function(response) {
          _defer.reject([]);
        });
        return _defer.promise;
      }

      function groupRightsPromise(groupName, group) {
        var groupRightsPathParam = {groupName: groupName};
        var groupRightsDataParam = {};
        var defer = $q.defer();
        GroupRights.query(groupRightsPathParam, groupRightsDataParam, function(groupRights) {
          var rightsSet = GroupRightsTransform.transform(groupRights);
          defer.resolve(rightsSet);
        }, function(groupRights) {
          defer.reject([]);
        });
        return defer.promise;
      }
    });

})();
