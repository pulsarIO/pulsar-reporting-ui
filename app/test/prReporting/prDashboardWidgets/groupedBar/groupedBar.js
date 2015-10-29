/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.widgets.groupedBar', function() {
  var mockScope;
  var compileService;
  var editController;
  var mockWidgetParams;
  var mockWidgetErrorParams;
  var mockWidgetOptions;
  var mockWidgetFilters;
  var elem;
  var callback;
  var mockEditScope;

  beforeEach(angular.mock.module('pr.dashboard.widgets.groupedBar'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {
        this.getGroupedBarData = function(urlParams, payload, successCallback, errorCallback) {
          if (payload.table != 'error_source') {
            successCallback([
              {
                key: 'Desktop',
                values: [
                  {x:'usa', y:1111},
                  {x:'chn', y:2222},
                  {x:'and', y:3333}
                ]}, {
                key: 'Tablet',
                values: [
                  {x:'usa', y:4444},
                  {x:'chn', y:5555},
                  {x:'and', y:6666}
                ]}, {
                key: 'Mobile',
                values: [
                  {x:'usa', y:7777},
                  {x:'chn', y:8888},
                  {x:'and', y:9998}
                ]
              }
            ]);
          } else {
            errorCallback({
              data: {
                error: 'Cannot use error_source'
              }
            });
          }
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
        this.getGroupedBarChartOptions = function(options) {
          var defaults = {
            type: 'multiBarChart',
            height: 300,
            margin: {
              top: 5,
              right: 5,
              bottom: 50,
              left: 35
            },
            reduceXTicks: false,
            stacked:  false,
            showValues: true,
            transitionDuration: 500
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
      table: 'pulsar_ogmb',
      dimensions: [
        {
          name: 'devicefamily'
        },
        {
          name: 'country'
        }
      ],
      metrics: [
        {
          name: 'gmv_ag',
          type: 'sum',
          alias: 'gmv_ag'
        }
      ],
      granularity: 'all',
      maxResults: 100
    };

    mockWidgetErrorParams = {
      dataSourceName: 'pulsar',
      table: 'error_source',
      dimensions: [],
      metrics: [{
        name: 'clickcount_ag',
        type: 'count',
        alias: 'clickcount_ag'
      }],
      granularity: 'all',
      maxResults: 20
    };

    mockWidgetOptions = {
      disabled: false,
      chart: {
        showLegend: true
      }
    };

    mockWidgetFilters = {
      intervals: '2015-08-28 00:00:00/2015-08-28 23:59:59',
      where: {},
      whereRaw: 'country=\'usa\' or country=\'chn\''
    };

    callback = jasmine.createSpyObj('callback', ['done', 'wait', 'error']);

    mockScope.$on('statusChanged', function(e, status, details) {
      if (status == 'wait') {
        callback.wait(details);
      } else if (status == 'done') {
        callback.done(details);
      } else if (status == 'error') {
        callback.error(details);
      }
    });

    mockEditScope = $rootScope.$new();

    editController = $controller('prGroupedBarWidgetEdit', {
      $scope: mockEditScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique']
    });

  }));

  it('prGroupedBarWidget directive works', function() {
    var compileFn = compileService('<pr-grouped-bar-widget params="params" options="options" filters="filters"></pr-grouped-bar-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    // check the elem
    expect(elem.find('div').find('nvd3').find('svg')).toEqual(jasmine.any(Object));
    expect(elem.find('nvd3 svg').find('g').attr('class')).toContain('nv-multiBarWithLegend');
    expect(elem.find('nvd3 svg .nv-legendWrap .nv-series').size()).toEqual(3);
    expect(elem.find('nvd3 svg .nv-controlsWrap .nv-series').size()).toEqual(2);

    // check the x label
    var series = elem.find('nvd3 svg g.nv-legend g.nv-series text');
    expect(series.eq(0).text()).toEqual('Desktop');
    expect(series.eq(1).text()).toEqual('Tablet');
    expect(series.eq(2).text()).toEqual('Mobile');

    // check the legend
    var labels = elem.find('nvd3 svg g.nv-x text');
    expect(labels.eq(0).text()).toEqual('usa');
    expect(labels.eq(1).text()).toEqual('chn');
    expect(labels.eq(2).text()).toEqual('and');

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).not.toHaveBeenCalled();
    expect(callback.done).toHaveBeenCalled();

  });

  it('prGroupedBarWidget directive throws error', function() {
    var compileFn = compileService('<pr-grouped-bar-widget params="params" options="options" filters="filters"></pr-grouped-bar-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetErrorParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).toHaveBeenCalled();
    expect(callback.done).not.toHaveBeenCalled();
  });

  it('prGroupedBarWidgetEdit loads datasources', function() {
    mockEditScope.$apply();

    expect(angular.equals(mockEditScope.newParams, mockWidgetParams)).toBe(true);
    expect(mockEditScope.tables).toEqual(['table1', 'table2', 'table3']);
  });

  it('prGroupedBarWidgetEdit loads metrics ', function() {
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(1);
    expect(mockEditScope.newParams.dimensions.length).toBe(2);

    mockEditScope.newParams.table = 'test_source';
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(0);
    expect(mockEditScope.newParams.dimensions.length).toBe(0);

  });
});