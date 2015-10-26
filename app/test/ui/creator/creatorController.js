/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.creator.creatorController', function() {

  var mockScope;
  var dashboard1;
  var dashboard2;
  var controller;

  beforeEach(angular.mock.module('pr.ui.creator'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(function() {
    var $get = function(callback) {
      if (callback) {
        callback(dashboard1);
      }
    };

    var $delete = function(callback) {
      if (callback) {
        callback(dashboard1);
      }
    };

    dashboard1 = {
      id: 185,
      name: 'dashboard_1',
      displayName: 'My Dashboard 1',
      owner: 'mrincon',
      config: {},
      createTime: 1443518258000,
      lastUpdateTime: 1443518258000,
      $get: $get,
      $delete: $delete
    };
    dashboard2 = {
      id: 187,
      name: 'dashboard_2',
      displayName: 'My Dashboard 2',
      owner: 'mrincon',
      config: {},
      createTime: 1443518492000,
      lastUpdateTime: 1443518492000,
      $get: $get,
      $delete: $delete
    };
  });

  beforeEach(angular.mock.module(function($provide) {
    $provide.service('prDashboardResource', function () {
      this.query = function (params) {
        var defer = $q.defer();
        if (params.right == 'view') {
          defer.resolve([dashboard1, dashboard2]);
          $rootScope.$apply();
          return {$promise: defer.promise};
        }
        if (params.right == 'manage') {
          defer.resolve([dashboard1]);
          $rootScope.$apply();
          return {$promise: defer.promise};
        }
      };
    });
  }));

  beforeEach(angular.mock.inject(function($rootScope, $q, $controller) {
    mockScope = $rootScope.$new();
    controller = $controller('CreatorController', {
      $scope: mockScope,
      dashboards: [dashboard1, dashboard2],
      editableDashboards: [dashboard1]
    });

  }));

  it('dashboards get loaded into the scope', function() {
    expect(mockScope.dashboards).toEqual([dashboard1, dashboard2]);
    expect(mockScope.editableDashboards).toEqual([dashboard1]);
    expect(mockScope.dashboard).toEqual(null);

  });

  it('dashboard can be selected', function() {
    mockScope.selectDashboard(0);
    expect(mockScope.dashboard).toEqual(dashboard1);
  });

  it('dashboard can be selected, check if editable works', function() {
    mockScope.selectDashboard(0);
    expect(mockScope.current).toBe(0);
    expect(mockScope.dashboard).toEqual(dashboard1);
    expect(mockScope.canEditDashboard()).toBeTruthy();

    mockScope.selectDashboard(1);
    expect(mockScope.current).toBe(1);
    expect(mockScope.dashboard).toEqual(dashboard2);
    expect(mockScope.canEditDashboard()).toBeFalsy();
  });

  it('dashboard can be deleted if there are permissions', function() {

    mockScope.selectDashboard(0);
    expect(mockScope.current).toBe(0);

    spyOn(dashboard1, '$delete');

    mockScope.deleteDashboard();
    mockScope.$apply();

    // The modal clicks on delete
    var btn = $('body').find('[ng-click\="$close()"]').click();
    expect(dashboard1.$delete).toHaveBeenCalled();
  });

  it('dashboard can\'t be deleted if there are no permissions', function() {

    mockScope.selectDashboard(1);
    expect(mockScope.current).toBe(1);

    spyOn(dashboard2, '$delete').and.callThrough();

    mockScope.deleteDashboard();
    mockScope.$apply();

    // The modal clicks on delete
    var btn = $('body').find('[ng-click\="$close()"]').click();
    expect(dashboard2.$delete).not.toHaveBeenCalled();
  });
});