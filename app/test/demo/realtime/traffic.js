/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.demo.realtime.traffic', function() {
  var mockScope = {};
  var controller;
  var state;

  beforeEach(angular.mock.module('pr.demo.traffic'));
  beforeEach(angular.mock.inject(function($controller, $rootScope, $state) {
    state = $state;
    mockScope = $rootScope.$new();
    controller = $controller('TrafficController', {
      $scope: mockScope
    });

    spyOn(state, 'go');
  }));

  it('TrafficController changes the date', function() {
    mockScope.changeDateRange(123456789, 234567890);
    expect(state.go).toHaveBeenCalledWith('.', {
      start: 123456789,
      end: 234567890
    });
  });

  it('TrafficController removeFilter', function() {
    mockScope.dynamicFilters = {
      browserfamily: ['Firefox', 'Chrome']
    };

    mockScope.removeFilter('browserfamily', 'Firefox');

    expect(mockScope.dynamicFilters).toEqual({
      browserfamily: ['Chrome']
    });
    expect(state.go).toHaveBeenCalledWith('.', {
      dynamicFilters: angular.toJson({browserfamily: ['Chrome']})
    });
  });

  it('TrafficController removeAllFilters', function() {
    mockScope.dynamicFilters = {
      browserfamily: ['Firefox', 'Chrome']
    };

    mockScope.removeAllFilters('browserfamily');

    expect(mockScope.dynamicFilters).toEqual({browserfamily: []});
    expect(state.go).toHaveBeenCalledWith('.', {
      dynamicFilters: angular.toJson({browserfamily: []})
    });
  });

});
