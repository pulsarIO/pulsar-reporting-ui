/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.layouts.prDashboardLayouts', function() {
  var prDashboard;

  beforeEach(angular.mock.module('pr.dashboard.layouts'));

  beforeEach(angular.mock.inject(['prDashboard', function(pd) {
    prDashboard = pd;
  }]));

  it('prDashboard has a layouts object', function() {
    expect(prDashboard.layouts).toBeDefined();
  });

  it('there are more than 5 layouts defined and they are not empty', function() {
    var layoutsCount = 0;
    angular.forEach(prDashboard.layouts, function() {
      layoutsCount++;
    });
    expect(layoutsCount).toBeGreaterThan(5);
  });

  it('prDashboard has the "12" layout for one column', function() {
    expect(prDashboard.layouts['12']).toBeDefined();
    expect(prDashboard.layouts['12'].columns.length).toEqual(1);
  });

  it('prDashboard has the "3-3-3-3" layout for 4 columns', function() {
    expect(prDashboard.layouts['3-3-3-3']).toBeDefined();
    expect(prDashboard.layouts['3-3-3-3'].columns.length).toEqual(4);
  });

});
