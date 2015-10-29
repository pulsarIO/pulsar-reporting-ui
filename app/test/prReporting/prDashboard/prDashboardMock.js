/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.prDashboardMock', function() {
  var elem;
  var $scope;
  var compile;

  beforeEach(angular.mock.module('pr.dashboard'));
  beforeEach(angular.mock.module('pr.dashboard.layouts'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    compile = $compile;
  }));

  beforeEach(function() {
    var compileFn = compile('<pr-dashboard layout="layout" mock="true"></pr-dashboard>');
    elem = compileFn($scope);
  });

  it('dashboard mock is displayed - 1 column', function() {
    $scope.layout = '12';
    $scope.$apply();

    expect(elem.find('.dashboard').hasClass('dashboard-mock')).toBeTruthy(true);
  });

  it('dashboard mock is displayed with correct columns', function() {
    $scope.layout = '12';
    $scope.$apply();

    expect(elem.find('.column').size()).toEqual(1);
    expect(elem.find('.column .mock-content').size()).toEqual(1);
  });

  it('dashboard mock updates it\'s layout', function() {
    $scope.layout = '12';
    $scope.$apply();

    expect(elem.find('.column').size()).toEqual(1);

    $scope.layout = '4-8';
    $scope.$apply();

    expect(elem.find('.column').size()).toEqual(2);

    $scope.layout = '4-4-4';
    $scope.$apply();

    expect(elem.find('.column').size()).toEqual(3);

  });

  afterEach(function() {
    elem.remove();
  });

});