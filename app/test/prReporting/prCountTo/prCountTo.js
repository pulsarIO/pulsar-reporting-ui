/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.countto.prCountTo', function() {
  var elem;
  var elem2;
  var $scope;

  var compile;
  var timeout;

  // Setup
  beforeEach(angular.mock.module('pr.countto'));
  beforeEach(angular.mock.inject(function($rootScope, $compile, $timeout) {
    $scope = $rootScope.$new();
    compile = $compile;
    timeout = $timeout;
  }));
  beforeEach(function() {
    $scope.value = undefined;
    $scope.placeholder = undefined;
    var compileFn = compile('<pr-count-to value="value" placeholder="placeholder"></pr-count-to>');
    elem = compileFn($scope);

    var compileFn2 = compile('<div pr-count-to value="value" placeholder="placeholder"></div>');
    elem2 = compileFn2($scope);
  });

  it('jQuery countTo is added to the build', function() {
    expect(elem.countTo).toBeDefined();
    expect(elem2.countTo).toBeDefined();
  });

  it('jQuery countTo inits with default placeholder "--"', function() {
    $scope.$digest();
    expect(elem.html()).toEqual('--');
    expect(elem2.html()).toEqual('--');
  });

  it('jQuery countTo uses custom placeholder "N/A"', function() {
    $scope.placeholder = 'N/A';
    $scope.$digest();
    expect(elem.html()).toEqual('N/A');
    expect(elem2.html()).toEqual('N/A');
  });

  it('countTo counts to 10 after some time', function(done) {
    $scope.value = 10;
    $scope.$digest();
    timeout.flush(); /* Executes the timeout inside countTo directive */
    setTimeout(function() {
      expect(elem.html()).toEqual('10');
      expect(elem2.html()).toEqual('10');
      done();
    }, 1201);
  });

  it('countTo counts to 100 after some time', function(done) {
    $scope.value = 100;
    $scope.$digest();
    timeout.flush(); /* Executes the timeout inside countTo directive */
    setTimeout(function() {
      expect(elem.html()).toEqual('100');
      expect(elem2.html()).toEqual('100');
      done();
    }, 1201);
  });

  it('countTo counts to 1000 after some time, with the right format', function(done) {
    $scope.value = 1000;
    $scope.$digest();
    timeout.flush(); /* Executes the timeout inside countTo directive */
    setTimeout(function() {
      expect(elem.html()).toEqual('1,000');
      expect(elem2.html()).toEqual('1,000');
      done();
    }, 1201);
  });

  it('countTo counts displays placeholder on expected values', function() {
    $scope.value = 'Some String Value';
    $scope.$digest();
    expect(elem.html()).toEqual('--');
    expect(elem2.html()).toEqual('--');

    $scope.value = {an: 'object'};
    $scope.$digest();
    expect(elem.html()).toEqual('--');
    expect(elem2.html()).toEqual('--');

    $scope.value = null;
    $scope.$digest();
    expect(elem.html()).toEqual('--');
    expect(elem2.html()).toEqual('--');
  });

  it('countTo degrades gracefully if countTo jquery plugin is not available', function() {
    var jQPlugin =  $.fn.countTo;
    $.fn.countTo = undefined;

    $scope.value = 10;
    $scope.$digest();
    expect(elem.html()).toEqual('10');
    expect(elem2.html()).toEqual('10');

    $.fn.countTo = jQPlugin;
  });

});
