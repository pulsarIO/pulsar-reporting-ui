/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin.datasourceManage.add', function() {

  var scope;
  var DatasourcesDefer = {
    add:null
  };

  beforeEach(function() {
    module('pr.ui.admin');
    module(function($provide) {
      $provide.factory('$modalInstance', function() {
        return {
          close:function() {},
          dismiss:function() {}
        };
      });
      $provide.service('Datasources', function() {
        this.add = function(param, succ, fail) {
          DatasourcesDefer.add = q.defer();
          DatasourcesDefer.add.promise.then(succ, fail);
        };
      });
    });

    //inject dependencies
    inject(function($rootScope, $q, $controller, $modalInstance) {
      q = $q;
      scope = $rootScope.$new();
      $controller('DatasourceManageAddController', {$scope: scope});
    });

  });

  it('ensure save and cancel can be invoked safely', function() {
    scope.cancel();
  });
  it('save success', function() {
    scope.save();
    DatasourcesDefer.add.resolve();
    scope.$apply();
  });
  it('save failed', function() {
    scope.save();
    DatasourcesDefer.add.reject();
    scope.$apply();
  });

});
