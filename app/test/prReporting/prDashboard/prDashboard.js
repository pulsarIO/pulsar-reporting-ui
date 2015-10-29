/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.prDashboard', function() {
  var elem;
  var $scope;
  var compile;

  var widget1;
  var widget2;

  beforeEach(angular.mock.module('pr.dashboard'));
  beforeEach(angular.mock.module('pr.dashboard.layouts'));
  beforeEach(angular.mock.module('pr.dashboard.widgets.grid'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    compile = $compile;
  }));

  beforeEach(function() {
    var compileFn = compile('<pr-dashboard layout="layout" model="model" edit-mode="editMode"></pr-dashboard>');
    elem = compileFn($scope);

    widget1 = {
      type: 'pr-grid',
      params: {
        dimensions: [],
        metrics: []
      },
      options: {
        disabled: true
      }
    };

    widget2 = {
      type: 'pr-grid',
      params: {
        dimensions: [],
        metrics: []
      },
      options: {
        disabled: true
      }
    };

  });

  it('dashboard is displayed - 1 column and 1 widget', function() {
    $scope.layout = '12';
    $scope.model = {
      displayName: 'Dashboard Test',
      config: {
        columns: [{
          widgets: [widget1]
        }]
      }
    };
    $scope.$apply();

    expect(elem.find('.dashboard').size()).toEqual(1);
    expect(elem.find('.dashboard .column').size()).toBe(1);
    expect(elem.find('.dashboard .column pr-dashboard-widget').size()).toBe(1);
  });

  it('dashboard is displayed - 2 columns and 1 widget', function() {
    $scope.layout = '4-8';
    $scope.model = {
      displayName: 'Dashboard Test',
      config: {
        columns: [{
          widgets: []
        }, {
          widgets: [widget1]
        }]
      }
    };
    $scope.$apply();

    expect(elem.find('.dashboard').size()).toEqual(1);

    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(0);
    expect(elem.find('.dashboard .column').eq(1).find('pr-dashboard-widget').size()).toBe(1);
  });

  it('dashboard is displayed - 2 columns and 2 widget', function() {
    $scope.layout = '4-8';
    $scope.model = {
      displayName: 'Dashboard Test',
      config: {
        columns: [{
          widgets: [widget1]
        }, {
          widgets: [widget2]
        }]
      }
    };
    $scope.$apply();

    expect(elem.find('.dashboard').size()).toEqual(1);

    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(1).find('pr-dashboard-widget').size()).toBe(1);
  });

  it('dashboard is displayed - 2 widgets and multiple changes to layout with more cols', function() {
    $scope.layout = '4-8';
    $scope.model = {
      displayName: 'Dashboard Test',
      config: {
        columns: [{
          widgets: [widget1]
        }, {
          widgets: [widget2]
        }]
      }
    };
    $scope.$apply();
    expect(elem.find('.dashboard .column').size()).toBe(2);
    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(1).find('pr-dashboard-widget').size()).toBe(1);

    $scope.layout = '8-4';
    $scope.$apply();
    expect(elem.find('.dashboard .column').size()).toBe(2);
    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(1).find('pr-dashboard-widget').size()).toBe(1);

    $scope.layout = '3-3-3-3';
    $scope.$apply();
    expect(elem.find('.dashboard .column').size()).toBe(4);
    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(1).find('pr-dashboard-widget').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(2).find('pr-dashboard-widget').size()).toBe(0);
    expect(elem.find('.dashboard .column').eq(3).find('pr-dashboard-widget').size()).toBe(0);
  });

  it('dashboard is displayed - 2 widgets and multiple changes to layout with fewer cols', function() {
    $scope.layout = '4-8';
    $scope.model = {
      displayName: 'Dashboard Test',
      config: {
        columns: [{
          widgets: [widget1]
        }, {
          widgets: [widget2]
        }]
      }
    };
    $scope.$apply();
    expect(elem.find('.dashboard .column').size()).toBe(2);
    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(1).find('pr-dashboard-widget').size()).toBe(1);

    $scope.layout = '12';
    $scope.$apply();
    expect(elem.find('.dashboard .column').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(2);
  });

  it('dashboard is displayed - 2 widgets and arbitraty layout', function() {
    $scope.layout = 'blah';
    $scope.model = {
      name: 'dashboard_test',
      config: {
        columns: [{
          styleClass: 'my-class-1',
          widgets: [widget1]
        }, {
          styleClass: 'my-class-2',
          widgets: [widget2]
        }]
      }
    };
    $scope.$apply();
    expect(elem.find('.dashboard .column').size()).toBe(2);
    expect(elem.find('.dashboard .column').eq(0).hasClass('my-class-1')).toBe(true);
    expect(elem.find('.dashboard .column').eq(0).find('pr-dashboard-widget').size()).toBe(1);
    expect(elem.find('.dashboard .column').eq(1).hasClass('my-class-2')).toBe(true);
    expect(elem.find('.dashboard .column').eq(1).find('pr-dashboard-widget').size()).toBe(1);
  });

  afterEach(function() {
    elem.remove();
  });

});