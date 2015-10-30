/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.numberfilter.filter', function() {
  // Setup
  var $f;
  beforeEach(angular.mock.module('pr.numberfilter'));
  beforeEach(angular.mock.inject(function($filter) {
    $f = $filter;
  }));

  it('Creates correct durations - seconds', function() {
    expect($f('duration')(0)).toEqual('00:00:00');
    expect($f('duration')(1)).toEqual('00:00:00');
    expect($f('duration')(1000)).toEqual('00:00:01');
    expect($f('duration')(10 * 1000)).toEqual('00:00:10');
  });

  it('Creates correct durations - minutes', function() {
    expect($f('duration')(01 * 60 * 1000)).toEqual('00:01:00');
    expect($f('duration')(02 * 60 * 1000)).toEqual('00:02:00');
    expect($f('duration')(10 * 60 * 1000)).toEqual('00:10:00');
    expect($f('duration')(59 * 60 * 1000)).toEqual('00:59:00');
    expect($f('duration')(59 * 60 * 1000 + 01 * 1000)).toEqual('00:59:01');
    expect($f('duration')(59 * 60 * 1000 + 59 * 1000)).toEqual('00:59:59');
  });

  it('Creates correct durations - hours', function() {
    expect($f('duration')(60 * 60 * 1000)).toEqual('01:00:00');
    expect($f('duration')(02 * 60 * 60 * 1000)).toEqual('02:00:00');
    expect($f('duration')(03 * 60 * 60 * 1000)).toEqual('03:00:00');
    expect($f('duration')(10 * 60 * 60 * 1000)).toEqual('10:00:00');
    expect($f('duration')(24 * 60 * 60 * 1000)).toEqual('24:00:00');
  });

  it('Creates correct durations - days or more', function() {
    expect($f('duration')(48 * 60 * 60 * 1000)).toEqual('48:00:00');
    expect($f('duration')(99 * 60 * 60 * 1000)).toEqual('99:00:00');
    expect($f('duration')(100 * 60 * 60 * 1000)).toEqual('100:00:00');
    expect($f('duration')(1000 * 60 * 60 * 1000)).toEqual('1000:00:00');
    expect($f('duration')(9999 * 60 * 60 * 1000 + 10 * 60 * 1000 + 59 * 1000)).toEqual('9999:10:59');
  });

  it('Creates correct durations - negative values', function() {
    expect($f('duration')(-01 * 60 * 1000)).toEqual('-00:01:00');
    expect($f('duration')(-02 * 60 * 1000)).toEqual('-00:02:00');
    expect($f('duration')(-10 * 60 * 1000)).toEqual('-00:10:00');
    expect($f('duration')(-59 * 60 * 1000)).toEqual('-00:59:00');
    expect($f('duration')(-03 * 60 * 60 * 1000)).toEqual('-03:00:00');
    expect($f('duration')(-1000 * 60 * 60 * 1000)).toEqual('-1000:00:00');
  });

  it('Works on unexpected values', function() {
    expect($f('duration')(NaN)).toEqual('00:00:00');
    expect($f('duration')(false)).toEqual('');
    expect($f('duration')({an: 'object'})).toEqual('');
    expect($f('duration')(undefined)).toEqual('');
  });

});

describe('prNumberFilter:range', function() {
  // Setup
  var $f;
  beforeEach(angular.mock.module('pr.numberfilter'));
  beforeEach(angular.mock.inject(function($filter) {
    $f = $filter;
  }));

  it('Creates correct ranges', function() {
    expect($f('range')(0)).toEqual([]);
    expect($f('range')(1)).toEqual([0]);
    expect($f('range')(3)).toEqual([0, 1, 2]);
    expect($f('range')(5)).toEqual([0, 1, 2, 3, 4]);
    expect($f('range')(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect($f('range')(15)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it('Works on unexpected values', function() {
    expect($f('range')(-1)).toEqual([]);
    expect($f('range')(-10)).toEqual([]);
    expect($f('range')(NaN)).toEqual([]);
    expect($f('range')(false)).toEqual([]);
  });

});

describe('prNumberFilter:percentage', function() {
  // Setup
  var $f;
  beforeEach(angular.mock.module('pr.numberfilter'));
  beforeEach(angular.mock.inject(function($filter) {
    $f = $filter;
  }));

  it('Works on float values', function() {
    expect($f('percentage')(0)).toEqual('0.00%');
    expect($f('percentage')(0.1)).toEqual('10.00%');
    expect($f('percentage')(0.11)).toEqual('11.00%');
    expect($f('percentage')(0.5555)).toEqual('55.55%');
    expect($f('percentage')(0.2525)).toEqual('25.25%');
    expect($f('percentage')(0.9999)).toEqual('99.99%');
    expect($f('percentage')(0.123456)).toEqual('12.35%');
  });

  it('Works on values bigger than 1', function() {
    expect($f('percentage')(-1)).toEqual('-100.00%');
    expect($f('percentage')(1)).toEqual('100.00%');
    expect($f('percentage')(5)).toEqual('500.00%');
    expect($f('percentage')(Math.PI)).toEqual('314.16%');
  });

  it('Works on unexpected values', function() {
    expect($f('percentage')(NaN)).toEqual('');
    expect($f('percentage')('I am string')).toEqual('');
    expect($f('percentage')({an: 'object'})).toEqual('');
  });

});

describe('prNumberFilter:intervalDate', function() {
  //Setup
  var $f;
  beforeEach(angular.mock.module('pr.numberfilter'));
  beforeEach(angular.mock.module('pr.api'));
  beforeEach(angular.mock.inject(function($filter) {
    $f = $filter;
  }));

  it('Works on an interval', function() {
    expect($f('intervalDate')(moment(1439276399000))).toEqual('2015-08-10 23:59:59');
    expect($f('intervalDate')(moment(1439276399000), 'MM/DD/YYYY HH:mm:ss')).toEqual('08/10/2015 23:59:59');
    expect($f('intervalDate')(moment.tz('2015-08-10 23:59:59', 'GMT'), 'MM/DD/YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', 'GMT')).toEqual('08/10/2015 23:59:59');
  });
});
