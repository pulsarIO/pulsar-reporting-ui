/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('prBarWidget:directive', function() {
  var mockScope;
  var compileService;
  var controller;
  var mockWidgetParams;
  var mockWidgetOptions;

  beforeEach(angular.mock.module('pr.dashboard.widgets.bar'));
  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {
        this.getHistogram = function(params, payload, successCallback, errorCallback) {
          successCallback([
            {
              key: 'gmv_ag',
              values: [
                {series: 0, x: '301694136591', y: 251565},
                {series: 0, x: '131561332468', y: 136400}
              ]
            }
          ]);
        };
        this.getTables = function(urlParam, param, successCallback, errorCallback) {
          successCallback(['table1', 'table2', 'table3']);
        };
        this.getDimensions = function(urlParam, param, successCallback, errorCallback) {
          successCallback([{name: 'dimension1'}, {name: 'dimension2'}, {name: 'dimension3'}]);
        };
        this.getMetrics = function(urlParam, param, successCallback, errorCallback) {
          successCallback([{name: 'metric1'}, {name: 'metric2'}, {name: 'metric3'}]);
        };
      });
      $provide.service('prUIOptionService', function() {
        this.getDiscreteBarChartOptions = function(options) {
          var defaults = {
            type: 'discreteBarChart',
            height: 300,
            margin: {
              top: 5,
              right: 5,
              bottom: 40,
              left: 35
            },
            showValues: true,
            transitionDuration: 500,
            discretebar: {
              dispatch: {
              }
            }
          };
          return {
            chart: $.extend(true, defaults, options || {})
          };
        };
      });
    })
  );
  beforeEach(angular.mock.inject(function($rootScope, $compile, $controller) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    mockWidgetParams = {
      dataSourceName: 'pulsar',
      table: 'table2',
      dimensions: [
          {
            name: 'itm'
          }
        ],
      metrics: [
          {
            name: 'gmv_ag',
            type: 'sum',
            alias: 'gmv_ag'
          }
        ],
      maxResults: 100,
      granularity: 'all'
    };
    mockWidgetOptions = {
      title: 'topitems',
      disabled: false
    };
    controller = $controller('prBarWidgetEdit', {
      $scope: mockScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique']
    });
  }));

  it('prBarWidget directive', function() {
    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = {
      intervals: '2015-07-28 00:00:00/2015-07-28 23:59:59',
      where: {},
      whereRaw: 'country=\'usa\' or country=\'chn\''
    };
    var compileFn = compileService('<pr-bar-widget params="params" options="options" filters="filters"></pr-bar-widget>');
    elem = compileFn(mockScope);
    mockScope.$apply();
    expect(elem.find('div').find('nvd3')).toEqual(jasmine.any(Object));
    expect(elem.find('div').find('nvd3').find('svg')).toEqual(jasmine.any(Object));
    expect(elem.find('nvd3').length).toEqual(1);
    expect(elem.find('nvd3 svg').eq(0).children('g').attr('class')).toContain('nv-discreteBarWithAxes');
    var labels = elem.find('nvd3 svg g.tick text');
    expect(labels.eq(0).text()).toEqual('301694136591');
    expect(labels.eq(1).text()).toEqual('131561332468');
    var values = elem.find('nvd3 svg g.nv-bar text');
    expect(values.eq(0).text()).toEqual('251,565.00');
    expect(values.eq(1).text()).toEqual('136,400.00');
  });

  it('prBarWidgetEdit controller', function() {
    expect(mockScope.tables).toEqual(['table1', 'table2', 'table3']);
    mockScope.initDimensionsAndMetrics();
    expect(mockScope.dimensions).toEqual([{name: 'dimension1'}, {name: 'dimension2'}, {name: 'dimension3'}]);
    expect(mockScope.metrics).toEqual([{name: 'metric1'}, {name: 'metric2'}, {name: 'metric3'}]);

    mockScope.$apply();
    mockScope.newParams.table = 'table3';

    mockScope.$apply();
    expect(mockScope.newParams.dimensions).toEqual([]);
    expect(mockScope.newParams.metrics).toEqual([]);
  });
});