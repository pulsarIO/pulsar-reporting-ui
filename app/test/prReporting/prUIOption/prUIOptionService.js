/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.UIOption.prUIOptionService', function() {
  // Setup
  var service;
  var uiGridCons;
  beforeEach(angular.mock.module('pr.UIOption'));
  beforeEach(angular.mock.inject(function(prUIOptionService, uiGridConstants) {
    service = prUIOptionService;
    uiGridCons = uiGridConstants;
  }));

  it('getPieChartOptions returns default values', function() {
    var pieChartOptions = service.getPieChartOptions();
    expect(pieChartOptions).toEqual(jasmine.any(Object));
    expect(pieChartOptions.chart).toEqual(jasmine.any(Object));
  });

  it('getPieChartOptions returns correct assigned values', function() {
    var pieChartOptions = service.getPieChartOptions({
      margin: {
        top: 20,
        left: 25
      },
      showLabels: false
    });
    expect(pieChartOptions).toEqual(jasmine.any(Object));
    expect(pieChartOptions.chart.margin.top).toEqual(20);
    expect(pieChartOptions.chart.margin.left).toEqual(25);
    expect(pieChartOptions.chart.showLabels).toBeFalsy();
  });

  it('getGridOptions returns default values', function() {
    var getGridOptions = service.getGridOptions();
    expect(getGridOptions).toEqual(jasmine.any(Object));
  });

  it('getGridOptions returns correct assigned values', function() {
    var getGridOptions = service.getGridOptions({
      rowHeight: 20,
      headerRowHeight: 25,
      columnFooterHeight: 30,
      enableColumnMenus: true,
      paginationPageSize: 20
    });
    expect(getGridOptions).toEqual(jasmine.any(Object));
    expect(getGridOptions.rowHeight).toEqual(20);
    expect(getGridOptions.headerRowHeight).toEqual(25);
    expect(getGridOptions.columnFooterHeight).toEqual(30);
    expect(getGridOptions.enableColumnMenus).toBeTruthy();
    expect(getGridOptions.enableSorting).toBeFalsy();
    expect(getGridOptions.paginationPageSizes).toEqual([10]);
    expect(getGridOptions.paginationPageSize).toEqual(20);
    expect(getGridOptions.paginationTemplate).toEqual('src/prReporting/prUIOption/uiGridPager.html');
  });

  it('getSimpleGridOptions returns default values', function() {
    var getSimpleGridOptions = service.getSimpleGridOptions();
    expect(getSimpleGridOptions).toEqual(jasmine.any(Object));
    expect(getSimpleGridOptions.paginationPageSizes).toEqual([]);
    expect(getSimpleGridOptions.paginationTemplate).toEqual('src/prReporting/prUIOption/uiGridPagerSimple.html');
    expect(getSimpleGridOptions.enableHorizontalScrollbar).toEqual(uiGridCons.scrollbars.NEVER);
    expect(getSimpleGridOptions.enableVerticalScrollbar).toEqual(uiGridCons.scrollbars.NEVER);
  });

  it('getFilterGridOptions returns default values', function() {
    var getFilterGridOptions = service.getFilterGridOptions();
    expect(getFilterGridOptions).toEqual(jasmine.any(Object));
    expect(getFilterGridOptions.enableFiltering).toBeTruthy();
    expect(getFilterGridOptions.paginationPageSizes).toEqual([10]);
    expect(getFilterGridOptions.paginationTemplate).toEqual('src/prReporting/prUIOption/uiGridPager.html');
  });

  it('getFilterGridOptions returns correct assigned values', function() {
    var getFilterGridOptionDefault = service.getFilterGridOptions({
      columnDefs:[{}]
    });
    expect(getFilterGridOptionDefault).toEqual(jasmine.any(Object));
    expect(getFilterGridOptionDefault.columnDefs[0].filter.condition).toEqual(uiGridCons.filter.CONTAINS);
    var getFilterGridOptionEmptyFilter = service.getFilterGridOptions({
      columnDefs:[{filter: {}}]
    });
    expect(getFilterGridOptionDefault.columnDefs[0].filter.condition).toEqual(uiGridCons.filter.CONTAINS);
    var getFilterGridOptionsAssigned = service.getFilterGridOptions({
      columnDefs: [{
        filter: {
          condition: uiGridCons.filter.STARTS_WITH
        }
      }]
    });
    expect(getFilterGridOptionsAssigned.columnDefs[0].filter.condition).toEqual(uiGridCons.filter.STARTS_WITH);
  });

  it('getxAxisTickFormat', function() {
    var d = new Date(Date.UTC(115, 7, 10, 17, 05, 0));
    expect(service.getxAxisTickFormat(d, 'hour', 'UTC')).toEqual('Aug 10, 17:05');
    expect(service.getxAxisTickFormat(d, 'minute', 'UTC')).toEqual('Aug 10, 17:05');
    expect(service.getxAxisTickFormat(d, 'day', 'UTC')).toEqual('Aug 10');
  });

  it('getIndexCellTemplate', function() {
    var getIndexCellTemplate = service.getIndexCellTemplate();
    expect(getIndexCellTemplate).toEqual(jasmine.any(String));
    expect(getIndexCellTemplate).toEqual('<div class="ui-grid-cell-contents">{{(grid.options.paginationCurrentPage - 1) * grid.options.paginationPageSize + rowRenderIndex + 1}}</div>');
  });

  it('getTimeLineChartOptions returns default values', function() {
    var getTimeLineChartOptions = service.getTimeLineChartOptions();
    expect(getTimeLineChartOptions).toEqual(jasmine.any(Object));
    expect(getTimeLineChartOptions.chart).toEqual(jasmine.any(Object));
  });

  it('getTimeLineChartOptions returns correct assigned values', function() {
    var getTimeLineChartOptions = service.getTimeLineChartOptions({
      margin: {
        top: 20,
        left: 25
      },
      useInteractiveGuideline: false
    });
    expect(getTimeLineChartOptions).toEqual(jasmine.any(Object));
    expect(getTimeLineChartOptions.chart.margin.top).toEqual(20);
    expect(getTimeLineChartOptions.chart.margin.left).toEqual(25);
    expect(getTimeLineChartOptions.chart.useInteractiveGuideline).toBeFalsy();
  });

  it('getLineWithFocusOptions returns default values', function() {
    var getLineWithFocusOptions = service.getLineWithFocusOptions();
    expect(getLineWithFocusOptions).toEqual(jasmine.any(Object));
    expect(getLineWithFocusOptions.chart).toEqual(jasmine.any(Object));
    expect(getLineWithFocusOptions.chart.type).toEqual('lineWithFocusChart');
  });

  it('getLineWithFocusOptions returns default values', function() {
    var getLineWithFocusOptions = service.getLineWithFocusOptions({
      xAxis: {
        axisLabel: 'Time X Axis Test'
      },
      x2Axis: {
        axisLabel: 'Time X2 Axis Test'
      }
    });
    expect(getLineWithFocusOptions).toEqual(jasmine.any(Object));
    expect(getLineWithFocusOptions.chart).toEqual(jasmine.any(Object));
    expect(getLineWithFocusOptions.chart.xAxis.axisLabel).toEqual('Time X Axis Test');
    expect(getLineWithFocusOptions.chart.x2Axis.axisLabel).toEqual('Time X2 Axis Test');
  });

  it('getDiscreteBarChartOptions returns default values', function() {
    var getDiscreteBarChartOptions = service.getDiscreteBarChartOptions();
    expect(getDiscreteBarChartOptions).toEqual(jasmine.any(Object));
    expect(getDiscreteBarChartOptions.chart).toEqual(jasmine.any(Object));
  });

  it('getDiscreteBarChartOptions returns correct assigned values', function() {
    var getDiscreteBarChartOptions = service.getDiscreteBarChartOptions({
      margin: {
        top: 20,
        left: 25
      },
      showValues: false
    });
    expect(getDiscreteBarChartOptions).toEqual(jasmine.any(Object));
    expect(getDiscreteBarChartOptions.chart.margin.top).toEqual(20);
    expect(getDiscreteBarChartOptions.chart.margin.left).toEqual(25);
    expect(getDiscreteBarChartOptions.chart.showValues).toBeFalsy();
  });

  it('getGroupedBarChartOptions returns default values', function() {
    var getGroupedBarChartOptions = service.getGroupedBarChartOptions();
    expect(getGroupedBarChartOptions).toEqual(jasmine.any(Object));
    expect(getGroupedBarChartOptions.chart).toEqual(jasmine.any(Object));
    expect(getGroupedBarChartOptions.chart.type).toEqual('multiBarChart');
  });

  it('getGroupedBarChartOptions returns default values', function() {
    var getGroupedBarChartOptions = service.getLineWithFocusOptions({
      reduceXTicks: true,
      showValues: false
    });
    expect(getGroupedBarChartOptions).toEqual(jasmine.any(Object));
    expect(getGroupedBarChartOptions.chart).toEqual(jasmine.any(Object));
    expect(getGroupedBarChartOptions.chart.reduceXTicks).toEqual(true);
    expect(getGroupedBarChartOptions.chart.showValues).toEqual(false);
  });
});