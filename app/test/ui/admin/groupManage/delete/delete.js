/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin.groupManage.delete', function() {

  var scope;

  beforeEach(function() {
    module('pr.ui.admin');
    module(function($provide) {
      $provide.factory('$modalInstance', function() {
        return {
          close:function() {},
          dismiss:function() {}
        };
      });
    });

    //inject dependencies
    inject(function($rootScope, $q, $controller, $modalInstance) {
      q = $q;
      scope = $rootScope.$new();
      $controller('GroupDeleteDialogController', {$scope: scope});
    });

  });

  it('ensure save and cancel can be invoked safely', function() {
    scope.close();
    scope.confirm();
  });

});