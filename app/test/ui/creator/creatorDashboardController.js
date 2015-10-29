/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.creator.creatorDashboardController', function() {

  var mockScope;
  var dashboard;
  var controller;

  beforeEach(angular.mock.module('pr.ui.creator'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(function() {
    var $get = function(callback) {
      dashboard = copy;
      if (callback) {
        callback(dashboard);
      }
    };

    var $update = function(callback) {
      if (callback) {
        callback(dashboard);
      }
    };

    var $delete = function(callback) {
      if (callback) {
        callback(dashboard);
      }
    };

    dashboard = {
      id: 185,
      name: 'dashboard_1',
      displayName: 'My Dashboard 1',
      owner: 'mrincon',
      config: {
        columns: [{
          widgets: []
        }],
        filters: {
          where: {},
          whereRaw: 'site=0',
          intervals: '2015-10-11 00:00:00/2015-10-17 23:59:59'
        }
      },
      createTime: 1443518258000,
      lastUpdateTime: 1443518258000,
      $get: $get,
      $update: $update,
      $delete: $delete
    };
    var copy = angular.copy(dashboard);

  });

  beforeEach(angular.mock.inject(function($rootScope, $q, $controller) {
    mockScope = $rootScope.$new();
    mockScope.dashboard = dashboard;
    controller = $controller('CreatorDashboardController', {
      $scope: mockScope
    });

  }));

  it('widgets are available in the scope', function() {
    expect(mockScope.widgets).toBeDefined();
  });

  it('refresh dashboard works', function() {
    var original = angular.copy(dashboard);
    dashboard.displayName = 'Changed Name of Dahsboard';

    expect(angular.equals(dashboard, original)).toBe(false);

    mockScope.refreshDashboard();
    mockScope.$apply();

    expect(angular.equals(dashboard, original)).toBe(true);
    expect(mockScope.whereRaw).toEqual('site=0');
  });

  it('persist dashboard works', function() {
    spyOn(dashboard, '$update').and.callThrough();

    dashboard.displayName = 'Changed Name of Dahsboard';

    expect(angular.equals(mockScope.savedDashboard, dashboard)).toBe(false);
    expect(dashboard.$update).not.toHaveBeenCalled();

    mockScope.persistDashboard();
    mockScope.$apply();

    expect(angular.equals(mockScope.savedDashboard, dashboard)).toBe(true);
    expect(dashboard.$update).toHaveBeenCalled();
  });

  it('change date range works', function() {
    expect(dashboard.config.filters.intervals).toEqual('2015-10-11 00:00:00/2015-10-17 23:59:59');
    mockScope.changeDateRange(1445065200, 1445151599);
    expect(dashboard.config.filters.intervals).toEqual('2015-10-17 00:00:00/2015-10-17 23:59:59');
  });

  it('addWidget works', function() {
    expect(dashboard.config.columns[0].widgets.length).toEqual(0);
    mockScope.addWidget('pie');
    expect(dashboard.config.columns[0].widgets.length).toEqual(1);
    expect(dashboard.config.columns[0].widgets[0].type).toEqual('pie');
  });

  it('removeFilter works', function() {
    dashboard.config.filters.where = {
      browser: 'ABC'
    };
    mockScope.removeFilter('browser');
    expect(dashboard.config.filters.where).toEqual({});
  });

  it('addRawFilter works', function() {
    mockScope.addRawFilter('browser="firefox"');
    expect(dashboard.config.filters.whereRaw).toEqual('browser="firefox"');
  });
});