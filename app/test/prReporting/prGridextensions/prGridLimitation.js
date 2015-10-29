/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.gridextensions.prGridLimitation', function() {
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

  it('prGridLimitation rowSelectionChanged', function() {
    var gridApi;
    mockScope.grid = {
      options: {
        rowHeight: 30,
        showHeader: true,
        enableFiltering: true,
        showFooter: true,
        uiGridPagination: true,
        onRegisterApi: function(api) {
          gridApi = api;
        },
        data: [
          {
            firstName: 'Miguel',
            lastName: 'Rincon'
          },
          {
            firstName: 'Xin',
            lastName: 'Xu'
          },
          {
            firstName: 'Julian',
            lastName: 'Pan'
          }
        ]
      }
    };
    var compileFn = compileService('<div ui-grid="grid.options" ui-grid-pagination pr-grid-height ui-grid-selection pr-grid-limitation="2" class="grid"></div>');
    elem = compileFn(mockScope);
    mockScope.$apply();
    gridApi.selection.selectRow(mockScope.grid.options.data[0]);
    gridApi.selection.selectRow(mockScope.grid.options.data[1]);
    gridApi.selection.selectRow(mockScope.grid.options.data[2]);
    expect(gridApi.selection.getSelectedRows().length).toEqual(2);
  });

  it('prGridLimitation rowSelectionChangedBatch', function() {
    var gridApi;
    mockScope.grid = {
      options: {
        rowHeight: 30,
        showHeader: true,
        enableFiltering: true,
        showFooter: true,
        uiGridPagination: true,
        paginationPageSize: 10,
        onRegisterApi: function(api) {
          gridApi = api;
        },
        data: [
          {
            firstName: 'Miguel',
            lastName: 'Rincon'
          },
          {
            firstName: 'Xin',
            lastName: 'Xu'
          },
          {
            firstName: 'Julian',
            lastName: 'Pan'
          }
        ]
      }
    };
    var compileFn = compileService('<div ui-grid="grid.options" ui-grid-pagination pr-grid-height ui-grid-selection pr-grid-limitation="2" class="grid"></div>');
    elem = compileFn(mockScope);
    mockScope.$apply();
    gridApi.selection.selectAllRows();
    expect(gridApi.selection.getSelectedRows().length).toEqual(2);
    gridApi.selection.clearSelectedRows();
    expect(gridApi.selection.getSelectedRows().length).toEqual(0);
  });

});