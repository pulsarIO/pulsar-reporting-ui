/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.prDashboardWidget', function() {
  var elem;
  var $scope;
  var compile;

  var modalMock = jasmine.createSpyObj('modal', ['open']);

  var widget;
  var controller;
  var editController;

  beforeEach(angular.mock.module('pr.dashboard'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(function() {
    angular.mock.module(function($provide) {
      $provide.value('$modal', modalMock);
    });
  });

  beforeEach(module('pr.dashboard', function(prDashboardProvider) {
    // This callback is only called during instantiation
    controller = function() {};
    editController = function() {};

    prDashboardProvider.widget('mock-widget', {
      label: 'Mock Widget',
      icon: 'fa fa-circle-o',
      template: '<div class="mock-content">Mock Widget Content</div>',
      controller: controller,

      edit: {
        template: '<div class="mock-edit-content">Mock Widget Edit Content</div>',
        controller: editController
      }
    });
  }));

  beforeEach(angular.mock.inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    compile = $compile;

    widget1 = {
      type: 'mock-widget'
    };

  }));

  beforeEach(function() {
    var compileFn = compile('<div><pr-dashboard-widget widget="widget" edit-mode="editMode" widgets="widgets"></pr-dashboard-widget></div>');
    elem = compileFn($scope);
  });

  it('widget is displayed', function() {
    $scope.widget = widget1;
    $scope.$apply();

    expect(elem.find('pr-dashboard-widget .box').size()).toBe(1);
    expect(elem.find('pr-dashboard-widget .mock-content').size()).toBe(1);
    expect(elem.find('pr-dashboard-widget .mock-content').text()).toBe('Mock Widget Content');

    expect(elem.find('pr-dashboard-widget [ng-click="edit()"]').size()).toBe(1);
    expect(elem.find('pr-dashboard-widget [ng-click="remove()"]').size()).toBe(1);

  });

  it('widget edit window is displayed', function() {
    $scope.widget = widget1;
    $scope.editMode = true;

    $scope.$apply();

    elem.find('[ng-click="edit()"]').click();

    expect(modalMock.open).toHaveBeenCalledWith(jasmine.objectContaining({
      template: '<div class="mock-edit-content">Mock Widget Edit Content</div>',
      controller: editController
    }));
  });

  it('widget gets removed', function() {
    $scope.widget = widget1;
    $scope.widgets = [widget1];
    $scope.editMode = true;

    $scope.$apply();

    expect($scope.widgets.length).toBe(1);

    elem.find('[ng-click="remove()"]').click();

    expect($scope.widgets.length).toBe(0);
    expect(elem.html()).toEqual('');
  });

  afterEach(function() {
    elem.remove();
  });

});