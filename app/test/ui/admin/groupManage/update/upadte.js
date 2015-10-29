/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin GroupEditDialogController', function() {

  //to be tested Scope
  var scope;

  //$q alias
  var q;

  //$modal alias
  var modal;

  //$timeout alias
  var timeout;

  //$compile replacement
  var compile;

  //rootScope alias
  var rootScope;

  //GroupRights Related defer object
  var GroupRightsDefer = {
    replaceAll:null
  };

  //GroupUsers Related defer object
  var GroupUsersDefer = {
    replaceAll:null
  };
  //Groups Related defer object
  var GroupsDefer = {
    update:null
  };

  //$modal service opened result
  var modalInstance;
  var groupUsers = ['u1', 'u2'];

  var userRightsOfdatasources = [{
    name:'data1',
    editable:true
  }, {
    name:'data2',
    editable:false
  }];

  var userRightsOfdashboards = [{
    name:'dash1',
    editable:true
  }, {
    name:'dash2',
    editable:false
  }];

  var userRightsOfgroups = [{
    name:'g1',
    displayname:'G1',
    owner:'admin1',
    editable:true
  },{
    name:'g2',
    displayname:'G2',
    owner:'admin1',
    editable:false
  }];

  var userRightsOfsystem = ['SYS1', 'SYS2'];

  var groupRights = [{
    rightName:'data1',
    rightType:'1',
    rightNameSuffix:'_VIEW'
  },{
    rightName:'data1',
    rightType:'1',
    rightNameSuffix:'_MANAGE'
  },{
    rightName:'data2',
    rightType:'1',
    rightNameSuffix:'_VIEW'
  },{
    rightName:'dash1',
    rightType:'2',
    rightNameSuffix:'_VIEW'
  },{
    rightName:'g1',
    rightType:'4',
    rightNameSuffix:'_VIEW'
  },{
    rightName:'g1',
    rightType:'4',
    rightNameSuffix:'_MANAGE'
  },{
    rightName:'g2',
    rightType:'4',
    rightNameSuffix:'_VIEW'
  },,{
    rightName:'SYS1',
    rightType:'0'
  }];

  //for getting util service 'prUIOptionService', set up a replacement for it and then inject into controller again
  angular.module('non.existing.module', ['pr.UIOption', 'pr.dashboard']).run(function(prUIOptionService, prDashboardResource) {
    prUIOptionServiceInstance = prUIOptionService;
    prDashboardResourceInstance = prDashboardResource;
  });
  angular.bootstrap({}, ['non.existing.module']);

  beforeEach(function() {

    module('karma-html2js-templates');

    module('pr.ui.admin');

    module(function($provide) {

      //mocked prDashboardResource
      $provide.factory('prDashboardResource', function() {
        return prDashboardResourceInstance;
      });

      //mocked prUIOptionService
      $provide.factory('prUIOptionService', function() {
        return prUIOptionServiceInstance;
      });

      //mocked $modal
      $provide.factory('$modalInstance', function() {
        modalInstance = {
          close:function() {},
          dismiss:function() {}
        };
        return modalInstance;

      });

      //mocked groupname
      $provide.value('groupname', 'foo');

      //mocked groupdisplayname
      $provide.value('groupdisplayname', 'Foo');

      //mocked users
      $provide.value('groupUsers', groupUsers);

      //mocked rights
      $provide.value('groupRights', groupRights);

      //mocked datasources
      $provide.value('userRightsOfdatasources', userRightsOfdatasources);

      //mocked dashboards
      $provide.value('userRightsOfdashboards', userRightsOfdashboards);

      //mocked userRightsOfgroups
      $provide.value('userRightsOfgroups', userRightsOfgroups);

      //mocked userRightsOfsystem
      $provide.value('userRightsOfsystem', userRightsOfsystem);

      //mocked GroupUsers
      $provide.service('GroupUsers', function() {
        this.replaceAll = function get(path, params, succ, fail) {
          GroupUsersDefer.replaceAll = q.defer();
          GroupUsersDefer.replaceAll.promise.then(succ, fail);
          return {
            $promise:GroupUsersDefer.replaceAll.promise
          };
        };
      });

      //mocked Groups
      $provide.service('Groups', function() {
        this.update = function get(path, params, succ, fail) {
          GroupsDefer.update = q.defer();
          GroupsDefer.update.promise.then(succ, fail);
          return {
            $promise:GroupsDefer.update.promise
          };
        };
      });

      //mocked GroupRights
      $provide.service('GroupRights', function() {
        this.replaceAll = function get(path, params, succ, fail) {
          GroupRightsDefer.replaceAll = q.defer();
          GroupRightsDefer.replaceAll.promise.then().then(succ, fail);
          return {
            $promise:GroupRightsDefer.replaceAll.promise
          };
        };
      });

    });

    //inject dependencies
    inject(function($rootScope, $q, $timeout, $compile, $controller, prUIOptionService, $modalInstance, groupname, groupdisplayname, groupUsers, groupRights, userRightsOfgroups, userRightsOfdatasources, userRightsOfdashboards, userRightsOfsystem, Groups, GroupUsers, GroupRights, Datasources, prDashboardResource) {
      q = $q;
      timeout = $timeout;
      compile = $compile;
      rootScope = $rootScope;
      scope = $rootScope.$new();
      $controller('GroupEditDialogController', {$scope: scope});

      compile('<div ui-grid="dialogGrid" ui-grid-edit ui-grid-pagination ui-grid-auto-resize pr-grid-height pr-grid-height-deep="true" class="grid"></div>')(scope);
      scope.$apply();
      scope.gridApi.selection = {
        getSelectedRows:function() {
          return rights;
        }
      };
    });

  });

  it('dialog cancel', function() {
    scope.cancel();
  });

  it('given mocked input data, expect ui-grid\'s data length is 3', function() {
    scope.$apply();
    timeout.flush();
    expect(scope.dialogGrid.data.length).toEqual(8);
  });

  it('click Selected', function() {
    scope.$apply();
    timeout.flush();
    scope.singleFilter('Selected');
    scope.$apply();
  });

  it('click ok to affect group displayname', function() {
    scope.$apply();
    timeout.flush();
    scope.groupdisplayname = 'newDisplayName';
    scope.ok();
    scope.$apply();
  });

});
