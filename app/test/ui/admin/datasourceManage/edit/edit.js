/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin.datasourceManage.edit', function() {

  var scope;
  var DatasourcesDefer = {
    update: null
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
        this.update = function(param, succ, fail) {
          DatasourcesDefer.update = q.defer();
          DatasourcesDefer.update.promise.then(succ, fail);
          return {
            $promise:null
          };
        };
      });
      $provide.value('datasource', []);
    });

    //inject dependencies
    inject(function($rootScope, $q, $controller, $modalInstance) {
      q = $q;
      scope = $rootScope.$new();
      $controller('DatasourceManageEditController', {$scope: scope});
    });

  });

  it('ensure ok and cancel can be invoked safely', function() {
    scope.cancel();
  });

  it('update success', function() {
    scope.ok();
    DatasourcesDefer.update.resolve();
    scope.$apply();
  });

  it('update failure', function() {
    scope.ok();
    DatasourcesDefer.update.reject();
    scope.$apply();
  });

});