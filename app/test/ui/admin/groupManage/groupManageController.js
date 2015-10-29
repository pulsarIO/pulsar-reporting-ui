/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin groupManageController', function() {

  //adminScope Scope
  var adminScope;

  //groupManageScope
  var groupManageScope;

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

  //$modal service opened result
  var modalInstance;

  //Groups network interaction related deferred objects;
  var GroupsDefer = {
    queryV:null,
    queryM:null,
    remove:null,
    add:null
  };

  //GroupUsers network interaction related deferred objects;
  var GroupUsersDefer = {
    query:null
  };

  //GroupRights network interaction related deferred objects;
  var GroupRightsDefer = {
    query:null
  };

  //Datasources network interaction related deferred objects;
  var DatasourcesDefer = {
    queryV:null,
    queryM:null
  };

  //SysRights network interaction related deferred objects;
  var SysRightsDefer = {
    query:null
  };

  //prDashboardResource network interaction related deferred objects;
  var prDashboardResourceDefer = {
    queryV:null,
    queryM:null
  };

  //for getting util service 'prUIOptionService', set up a replacement for it and then inject into controller again
  var prUIOptionServiceInstance;
  angular.module('non.existing.module', ['pr.UIOption', 'pr.dashboard']).run(function(prUIOptionService) {
    prUIOptionServiceInstance = prUIOptionService;
  });
  angular.bootstrap({}, ['non.existing.module']);

  beforeEach(function() {
    module('karma-html2js-templates');

    module('pr.ui.admin');

    module(function($provide) {

      //mocked prUIOptionService
      $provide.factory('prUIOptionService', function() {
        return prUIOptionServiceInstance;
      });

      //mocked $modal
      $provide.service('$modal', function() {

        this.open = function open(o) {

          function MockedModal() {
            this.result = {};
            var _ok;
            var _cancel;
            this.result.then = function(ok, cancel) {
              _ok = ok;
              _cancel = cancel;
            };
            this.close = function close(resolvedData) {
              _ok(resolvedData);
            };
            this.dismiss = function dismiss(tips) {
              _cancel(tips);
            };
          }

          var toResolved = o.resolve;
          var promises = [];
          if (toResolved) {
            angular.forEach(toResolved, function(f, prop) {
              var val = f();
              if (val.then && val.catch && val.finally) {
                promises.push(val);
              }
            });
          }
          modalInstance = new MockedModal();
          var openedDefer = q.defer();
          modalInstance.opened = openedDefer.promise;
          if (promises.length > 0) {
            q.all(promises).then(function() {
              openedDefer.resolve();
            }, function() {
              openedDefer.reject();
            });
          }
          return modalInstance;
        };

      });

      //mocked Groups
      $provide.service('Groups', function() {
        this.query = function query(path, params, succ, fail) {
          if (path.type == 'view') {
            GroupsDefer.queryV = q.defer();
            GroupsDefer.queryV.promise.then(succ, fail);
          } else {
            if (path.type == 'manage') {
              GroupsDefer.queryM = q.defer();
              GroupsDefer.queryM.promise.then(succ, fail);
            }
          }
        };
        this.add = function add(path, params, succ, fail) {
          GroupsDefer.add = q.defer();
          GroupsDefer.add.promise.then(succ, fail);
          return {
            $promise:GroupsDefer.add.promise
          };
        };
        this.remove = function remove(path, params, succ, fail) {
          GroupsDefer.remove = q.defer();
          GroupsDefer.remove.promise.then(succ, fail);
          return {
            $promise:GroupsDefer.remove.promise
          };
        };
      });

      //mocked GroupUsers
      $provide.service('GroupUsers', function() {
        this.query = function query(path, params, succ, fail) {
          GroupUsersDefer.query = q.defer();
          GroupUsersDefer.query.promise.then(succ, fail);
          return {
            $promise:GroupUsersDefer.query.promise
          };
        };
      });

      //mocked GroupRights
      $provide.service('GroupRights', function() {
        this.query = function query(path, params, succ, fail) {
          GroupRightsDefer.query = q.defer();
          GroupRightsDefer.query.promise.then().then(succ, fail);
          return {
            $promise:GroupRightsDefer.query.promise
          };
        };
      });

      //mocked Datasources
      $provide.service('Datasources', function() {
        this.query = function(path, params, succ, fail) {
          if (path.type == 'view') {
            DatasourcesDefer.queryV = q.defer();
            DatasourcesDefer.queryV.promise.then(succ, fail);
            return {
              $promise:DatasourcesDefer.queryV.promise
            };
          } else {
            DatasourcesDefer.queryM = q.defer();
            DatasourcesDefer.queryM.promise.then(succ, fail);
            return {
              $promise:DatasourcesDefer.queryM.promise
            };
          }
        };
      });

      //mocked SysRights
      $provide.service('SysRights', function() {
        this.query = function(path, params, succ, fail) {
          SysRightsDefer.query = q.defer();
          SysRightsDefer.query.promise.then(succ, fail);
          return {
            $promise:SysRightsDefer.query.promise
          };
        };
      });

      //mocked Dashboards
      $provide.service('prDashboardResource', function() {
        this.query = function(path, params, succ, fail) {
          if (path.right == 'view') {
            prDashboardResourceDefer.queryV = q.defer();
            prDashboardResourceDefer.queryV.promise.then(succ, fail);
            return {
              $promise:prDashboardResourceDefer.queryV.promise
            };
          } else {
            prDashboardResourceDefer.queryM = q.defer();
            prDashboardResourceDefer.queryM.promise.then(succ, fail);
            return {
              $promise:prDashboardResourceDefer.queryM.promise
            };
          }
        };
      });
    });

    //inject dependencies
    inject(function($rootScope, $q, $timeout, $compile, $controller, $modal, prUIOptionService, Groups, GroupUsers, GroupRights, Datasources, SysRights, prDashboardResource) {
      q = $q;
      timeout = $timeout;
      compile = $compile;
      rootScope = $rootScope;
      adminScope = $rootScope.$new();
      $controller('AdminController', {$scope: adminScope});
      groupManageScope = adminScope.$new();
      $controller('GroupManageController', {$scope: groupManageScope});
      var elem = compile('<div ui-grid="groupGrid" ui-grid-pagination ui-grid-auto-resize pr-grid-height pr-grid-height-deep="true" class="grid"></div>')(groupManageScope);
      elem.insertAfter(angular.element('body'));
      groupManageScope.$apply();
    });

  });

  it('viewed groups and managed groups both fail --> load groups fail', function() {
    GroupsDefer.queryV.reject([]);
    GroupsDefer.queryM.reject([]);
    groupManageScope.$apply();
    expect(Object.keys(groupManageScope.groups).length).toEqual(0);
  });
  it('viewed groups and managed groups both succeed --> load groups succeed and identification groups editable rightly', function() {
    GroupsDefer.queryV.resolve([{
      name:'g1',
      displayName:'G1'
    },{
      name:'g2',
      displayName:'G2'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'g1',
      displayName:'G1'
    }]);
    groupManageScope.$apply();
    expect(Object.keys(groupManageScope.groups).length).toEqual(2);
    expect(groupManageScope.groups.g1.editable).toBeTruthy();
    expect(groupManageScope.groups.g2.editable).toBeFalsy();
  });

  it('load groups successfully but get users successfully', function() {
    GroupsDefer.queryV.resolve([{
      name:'g1',
      displayName:'G1'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'g1',
      displayName:'G1'
    }]);
    groupManageScope.$apply();

    GroupUsersDefer.query.resolve(['u1','u2']);
    groupManageScope.$apply();

    expect(Object.keys(groupManageScope.groups).length).toEqual(1);
    expect(groupManageScope.groups.g1.users.length).toEqual(2);
  });

  it('load groups successfully but get users failed', function() {
    GroupsDefer.queryV.resolve([{
      name:'g1',
      displayName:'G1'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'g1',
      displayName:'G1'
    }]);
    groupManageScope.$apply();

    GroupUsersDefer.query.reject([]);
    groupManageScope.$apply();

    expect(Object.keys(groupManageScope.groups).length).toEqual(1);
    expect(groupManageScope.groups.g1.users.length).toEqual(0);
  });

  it('viewed groups succeed but managed groups fail --> load groups fail', function() {
    GroupsDefer.queryV.resolve([{
      name:'g1',
      displayName:'G1'
    }]);
    GroupsDefer.queryM.reject([]);
    groupManageScope.$apply();
    expect(Object.keys(groupManageScope.groups).length).toEqual(0);
  });

  it('viewed groups fail but managed groups succeed --> load groups succeed', function() {
    GroupsDefer.queryV.reject([]);
    GroupsDefer.queryM.resolve([{
      name:'g1',
      displayName:'G1'
    }]);
    groupManageScope.$apply();
    expect(Object.keys(groupManageScope.groups).length).toEqual(1);
  });

  //TODO
  it('edit row dialog open success', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupUsersDefer.query.resolve(['user1']);
    groupManageScope.$apply();

    groupManageScope.editRow('foo');

    DatasourcesDefer.queryV.resolve([]);
    DatasourcesDefer.queryM.resolve([]);

    prDashboardResourceDefer.queryV.resolve([]);
    prDashboardResourceDefer.queryM.resolve([]);

    SysRightsDefer.query.resolve([]);
    
    GroupRightsDefer.query.resolve([]);
    groupManageScope.$apply();

    expect(groupManageScope.tips.lists.length).toEqual(0);
    timeout.flush();
    expect(groupManageScope.tips.lists.length).toEqual(0);
  });

  it('edit row dialog open fail', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupUsersDefer.query.resolve([]);
    groupManageScope.$apply();

    groupManageScope.editRow('foo');
    DatasourcesDefer.queryV.reject([]);
    DatasourcesDefer.queryM.reject([]);
    prDashboardResourceDefer.queryV.reject([]);
    prDashboardResourceDefer.queryM.reject([]);
    SysRightsDefer.query.reject([]);
    
    GroupRightsDefer.query.reject([]);
    groupManageScope.$apply();
    expect(groupManageScope.tips.lists.length).toEqual(1);
    timeout.flush();
    expect(groupManageScope.tips.lists.length).toEqual(0);
  });

  it('edit row dialog dismiss', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.editRow('foo');

    DatasourcesDefer.queryV.resolve([]);
    DatasourcesDefer.queryM.resolve([]);

    prDashboardResourceDefer.queryV.resolve([]);
    prDashboardResourceDefer.queryM.resolve([]);

    SysRightsDefer.query.resolve([]);
    GroupUsersDefer.query.resolve(['user1']);
    groupManageScope.$apply();

    modalInstance.dismiss();
    expect(groupManageScope.groups.foo.users.length).toEqual(1);
  });

  it('edit row dialog close with side effects successfully', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.editRow('foo');

    DatasourcesDefer.queryV.resolve([]);
    DatasourcesDefer.queryM.resolve([]);

    prDashboardResourceDefer.queryV.resolve([]);
    prDashboardResourceDefer.queryM.resolve([]);

    SysRightsDefer.query.resolve([]);
    GroupUsersDefer.query.resolve(['user1']);
    groupManageScope.$apply();

    modalInstance.close({
      groupdisplaynameChanged:{
        promise:(function() {
          var defer = q.defer();
          defer.resolve({displayName:'NewDisplayName'});
          return defer.promise;
        }())
      },
      usersChanged:{
        promise:(function() {
          var defer = q.defer();
          defer.resolve(['u1','u2','u3']);
          return defer.promise;
        }())
      }
    });
    groupManageScope.$apply();
    expect(groupManageScope.groups.foo.displayName).toEqual('NewDisplayName');
    expect(groupManageScope.groups.foo.users.length).toEqual(3);
  });

  it('edit row dialog close with side effects failed', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.editRow('foo');

    DatasourcesDefer.queryV.resolve([]);
    DatasourcesDefer.queryM.resolve([]);

    prDashboardResourceDefer.queryV.resolve([]);
    prDashboardResourceDefer.queryM.resolve([]);

    SysRightsDefer.query.resolve([]);
    GroupUsersDefer.query.resolve(['user1']);
    groupManageScope.$apply();

    modalInstance.close({
      groupdisplaynameChanged:{
        promise:(function() {
          var defer = q.defer();
          defer.reject({});
          return defer.promise;
        }())
      },
      usersChanged:{
        promise:(function() {
          var defer = q.defer();
          defer.reject([]);
          return defer.promise;
        }())
      }
    });
    groupManageScope.$apply();
    expect(groupManageScope.groups.foo.displayName).toEqual('Foo');
    expect(groupManageScope.groups.foo.users.length).toEqual(1);
  });

  it('prepareRemoveRow dialog dismiss', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.prepareRemoveRow ('foo');
    modalInstance.dismiss();
  });

  it('remove specified group successfully', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.prepareRemoveRow ('foo');
    modalInstance.close();
    GroupsDefer.remove.resolve();
    groupManageScope.$apply();

    expect(Object.keys(groupManageScope.groups).length).toEqual(0);
  });

  it('remove specified group failed', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.prepareRemoveRow ('foo');
    modalInstance.close();
    GroupsDefer.remove.reject();
    groupManageScope.$apply();

    expect(Object.keys(groupManageScope.groups).length).toEqual(1);
  });

  it('addNewGroup success', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.addOperation.newGroupName = 'foo2';
    groupManageScope.addNewGroup();
    GroupsDefer.add.resolve({
      name:'foo2',
      displayName:'Foo2'
    });
    groupManageScope.$apply();
    expect(Object.keys(groupManageScope.groups).length).toEqual(2);

    expect(groupManageScope.tips.lists.length).toEqual(1);
    timeout.flush();
    expect(groupManageScope.tips.lists.length).toEqual(0);
  });

  it('addNewGroup fail', function() {
    GroupsDefer.queryV.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    GroupsDefer.queryM.resolve([{
      name:'foo',
      displayName:'Foo'
    }]);
    groupManageScope.$apply();

    groupManageScope.addOperation.newGroupName = 'foo2';
    groupManageScope.addNewGroup();
    GroupsDefer.add.reject({error:'Already existing'});
    groupManageScope.$apply();

    expect(groupManageScope.tips.lists.length).toEqual(1);
    timeout.flush();
    expect(groupManageScope.tips.lists.length).toEqual(0);
  });

});
