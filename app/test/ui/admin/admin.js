/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin', function() {

  //AdminController Scope
  var adminScope;

  //$q alias
  var q;

  //$timeout alias
  var timeout;

  beforeEach(function() {

    //Load module 'pr.ui.admin'
    module('pr.ui.admin');

    inject(function($rootScope, $q, $controller, Groups, GroupUsers, GroupRights, $timeout) {
      q = $q;
      timeout = $timeout;
      adminScope = $rootScope.$new();
      $controller('AdminController', {$scope: adminScope});
    });
  });

  it('default to have no tips', function() {
    expect(adminScope.tips.lists.length).toEqual(0);
  });

  it('invoke notification.success, tips.length == 1', function() {
    adminScope.notification.success('You win');
    adminScope.$apply();
    expect(adminScope.tips.lists.length).toEqual(1);
    timeout.flush();
    adminScope.$apply();
    expect(adminScope.tips.lists.length).toEqual(0);
  });

  it('invoke notification.success, when timeout ticks, tips.length == 0', function() {
    adminScope.notification.success('You win');
    timeout.flush();
    adminScope.$apply();
    expect(adminScope.tips.lists.length).toEqual(0);
  });

  it('invoke notification.error, tips.length == 1', function() {
    adminScope.notification.error('You win');
    adminScope.$apply();
    expect(adminScope.tips.lists.length).toEqual(1);
  });

  it('invoke notification.error, when timeout ticks, tips.length == 0', function() {
    adminScope.notification.error('You win');
    timeout.flush();
    adminScope.$apply();
    expect(adminScope.tips.lists.length).toEqual(0);
  });

  it('promiseTellViewFromManageForGridData method test if identification viewonly or manage is right', function() {
    var v = q.defer();
    var m = q.defer();
    v.resolve([{
      name:'name1'
    },{
      name:'name2'
    },{
      name:'name3'
    }]);
    m.resolve([{
      name:'name1'
    },{
      name:'name2'
    }]);
    var result = adminScope.promiseTellViewFromManageForGridData(v.promise, m.promise);
    adminScope.$apply();

    //for promise, status 1 indicates resolved promise
    expect(result.$$state.status).toEqual(1);
    expect(result.$$state.value.length).toEqual(3);
    var name1Editable;
    var name2Editable;
    var name3Editable;
    angular.forEach(result.$$state.value, function(item) {
      if (item.name == 'name1') {
        name1Editable = item.editable;
      } else if (item.name == 'name2') {
        name2Editable = item.editable;
      } else if (item.name == 'name3') {
        name3Editable = item.editable;
      }
    });
    expect(name1Editable).toBeTruthy();
    expect(name2Editable).toBeTruthy();
    expect(name3Editable).toBeFalsy();

  });

  it('promiseTellViewFromManageForGridData method: view succeed, manage fail --> total fail', function() {
    var v = q.defer();
    var m = q.defer();
    v.resolve([{
      name:'name1'
    },{
      name:'name2'
    },{
      name:'name3'
    }]);
    m.reject([]);
    var result = adminScope.promiseTellViewFromManageForGridData(v.promise, m.promise);
    adminScope.$apply();

    //for promise, status 2 indicates rejected promise
    expect(result.$$state.status).toEqual(2);
    expect(result.$$state.value.length).toEqual(0);
  });

  it('promiseTellViewFromManageForGridData method: view fail, manage succedd --> total succ, all editable', function() {
    var v = q.defer();
    var m = q.defer();
    v.reject([]);
    m.resolve([{
      name:'name1'
    },{
      name:'name2'
    }]);
    var result = adminScope.promiseTellViewFromManageForGridData(v.promise, m.promise);
    adminScope.$apply();

    //for promise, status 2 indicates rejected promise
    expect(result.$$state.status).toEqual(1);
    expect(result.$$state.value.length).toEqual(2);
    expect(result.$$state.value[0].editable).toBeTruthy();
    expect(result.$$state.value[1].editable).toBeTruthy();
  });
});
