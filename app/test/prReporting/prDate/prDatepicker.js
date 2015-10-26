/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.date.prDatepicker', function() {
  var mockScope;
  var compileService;

  beforeEach(angular.mock.module('pr.date'));
  beforeEach(angular.mock.inject(function($rootScope, $compile) {
    mockScope = $rootScope.$new();
    compileService = $compile;
  }));

  it('Generates datepicker', function() {
    mockScope.start = 1438671600;
    mockScope.end = 1439276399;
    var compileFn = compileService('<pr-datepicker start-date="start" end-date="end"></pr-datepicker>');
    elem = compileFn(mockScope);
    mockScope.$apply();
    expect(elem.find('button').prop('class')).toEqual('btn btn-default');
    expect(elem.find('button').find('i').prop('class')).toEqual('fa fa-calendar');
    expect(elem.find('button').find('b').prop('class')).toEqual('caret');
    expect(elem.find('button').find('span').text()).toEqual('2015-08-04 - 2015-08-10');
  });

});