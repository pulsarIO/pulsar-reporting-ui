/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('linewithfocus:directive', function() {
  var mockScope;
  var compileService;
  var controller;
  var mockWidgetParams;
  var mockWidgetOptions;

  beforeEach(angular.mock.module('pr.dashboard.widgets.linewithfocus'));
  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {
        this.getHistogram = function(params, payload, successCallback, errorCallback) {
          successCallback([
            {
              key: 'count',
              values: [
                {x: new Date(2015, 6, 27, 0, 0, 0), y: 114637644},
                {x: new Date(2015, 6, 28, 0, 0, 0), y: 109278129},
                {x: new Date(2015, 6, 29, 0, 0, 0), y: 106309427},
                {x: new Date(2015, 6, 30, 0, 0, 0), y: 104441724},
                {x: new Date(2015, 6, 31, 0, 0, 0), y: 94551272},
                {x: new Date(2015, 7, 1, 0, 0, 0), y: 90943660},
                {x: new Date(2015, 7, 2, 0, 0, 0), y: 109272100}
              ]
            }
          ]);
        };
        this.getTables = function(urlParam, param, successCallback, errorCallback) {
          successCallback(['table1', 'table2', 'table3']);
        };
        this.getMetrics = function(urlParam, param, successCallback, errorCallback) {
          successCallback([{name: 'metric1'}, {name: 'metric2'}, {name: 'metric3'}]);
        };
      });
      $provide.service('prUIOptionService', function($filter) {
        this.getLineWithFocusOptions = function(options) {
          var defaults = {
            type: 'lineWithFocusChart',
            margin: {
              top: 20,
              right: 50,
              bottom: 40,
              left: 80
            },
            height: 380,
            xAxis: {
              axisLabel: 'Time',
              tickFormat: function(d) {
                return moment(d).format('MMM DD, HH:mm');
              }
            },
            x2Axis: {
              axisLabel: 'Time',
              tickFormat: function(d) {
                return moment(d).format('MMM DD, HH:mm');
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
  beforeEach(angular.mock.inject(function($rootScope, $compile, $controller, prDatasourceSqlService, prUIOptionService) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    mockWidgetParams = {
      table: 'pulsar_session',
      dimensions: [],
      metrics: [
        {
          name: 'count',
          type: 'sum',
          alias: 'count'
        }
      ],
      maxResults: 100,
      granularity: 'five_minute',
      dataSourceName: 'pulsar'
    };
    mockWidgetOptions = {
      title: 'session count',
      disabled: false,
      chart: {
        showLegend: true
      }
    };
    controller = $controller('prLineWithFocusWidgetEdit', {
      $scope: mockScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique']
    });
  }));

  it('prLineWithFocusWidget directive', function() {
    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = {
      intervals: '2015-07-27 00:00:00/2015-08-02 23:59:59',
      where: {},
      whereRaw: ''
    };
    var compileFn = compileService('<pr-line-with-focus-widget params="params" options="options" filters="filters"></pr-line-with-focus-widget>');
    elem = compileFn(mockScope);
    mockScope.$apply();
    expect(elem.find('div').find('nvd3')).toEqual(jasmine.any(Object));
    expect(elem.find('div').find('nvd3').find('svg')).toEqual(jasmine.any(Object));
    expect(elem.find('nvd3').length).toEqual(1);
    expect(elem.find('nvd3 svg').eq(0).children('g').attr('class')).toContain('nv-lineWithFocusChart');
    expect(elem.find('nvd3 svg g.nv-series text').text()).toEqual('count');
    expect(elem.find('nvd3 svg g.nv-focus').length).toEqual(1);
    expect(elem.find('nvd3 svg g.nv-context').length).toEqual(1);
    var labels = elem.find('nvd3 svg g.nv-x g.nv-axisMaxMin text');
    expect(labels.eq(0).text()).toContain('Jul 27');
    expect(labels.eq(1).text()).toContain('Aug 02');
  });

  it('prLineWithFocusWidgetEdit controller', function() {
    expect(mockScope.tables).toEqual(['table1', 'table2', 'table3']);
    expect(mockScope.metrics).toEqual([{name: 'metric1'}, {name: 'metric2'}, {name: 'metric3'}]);
    expect(mockScope.newParams.metrics.length).toEqual(1);
    expect(mockScope.newParams.metrics).toEqual([{name: 'count', type: 'sum', alias: 'count'}]);
    mockScope.$apply();
    mockScope.newParams.table = 'pulsar_ogmb';
    mockScope.$apply();
    expect(mockScope.newParams.metrics).toEqual([]);
  });
});