/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.gridextensions.prGridHeight', function() {
  var mockScope;
  var compileService;
  var timeout;
  var uiGridCons;

  beforeEach(angular.mock.module('pr.gridextensions'));
  beforeEach(angular.mock.inject(function($rootScope, $compile, $timeout, uiGridConstants) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    timeout = $timeout;
    uiGridCons = uiGridConstants;
  }));

  it('prGridHeight empty', function() {
    mockScope.grid = {
      options: {
        rowHeight: 30,
        showHeader: true,
        enableFiltering: true,
        showFooter: true,
        uiGridPagination: true
      }
    };
    var compileFn = compileService('<div ui-grid="grid.options" ui-grid-pagination pr-grid-height class="grid"></div>');
    elem = compileFn(mockScope);
    mockScope.$apply();
    expect(elem.attr('style')).toContain('height: 154px;');

  });

  it('prGridHeight 2 rows data', function() {
    mockScope.grid = {
      options: {
        rowHeight: 30,
        showHeader: true,
        enableHorizontalScrollbar: uiGridCons.scrollbars.NEVER,
        enableFiltering: true,
        showColumnFooter: true,
        columnFooterHeight: 30,
        data: [
          {
            firstName: 'Miguel',
            lastName: 'Rincon'
          },
          {
            firstName: 'Julian',
            lastName: 'Pan'
          }
        ]
      }
    };
    var compileFn = compileService('<div ui-grid="grid.options" ui-grid-pagination pr-grid-height class="grid"></div>');
    elem = compileFn(mockScope);
    timeout.flush(1000);
    expect(elem.attr('style')).toContain('height: 123px;');
  });

});