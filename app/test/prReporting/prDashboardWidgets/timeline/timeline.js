/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.widgets.timeline', function() {
  var mockScope;
  var compileService;
  var controller;
  var mockWidgetParams;
  var mockWidgetOptions;

  beforeEach(angular.mock.module('pr.dashboard.widgets.timeline'));
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
        this.getMetrics = function(params, payload, successCallback, errorCallback) {
          successCallback([{name: 'metrics1'}, {name: 'metrics2'}, {name: 'metrics3'}]);
        };
        this.getTables = function(params, payload, successCallback, errorCallback) {
          successCallback(['table1', 'table2', 'table3']);
        };
      });
      $provide.service('prUIOptionService', function($filter) {
        this.getTimeLineChartOptions = function(options) {
          var defaults = {
            type: 'lineChart',
            tooltip: {
              enabled: true
            },
            height: 135,
            margin: {
              top: 20,
              right: 40,
              bottom: 40,
              left: 100
            },
            forceY: 0,
            interpolate: 'cardinal',
            useInteractiveGuideline: true,
            xAxis: {
              axisLabel: 'Time'
            },
            xScale: d3.time.scale().nice(d3.time.hour),
            yAxis: {
              tickFormat: function(n) {
                return $filter('number')(n, 0);
              },
              axisLabelDistance: 30
            }
          };

          return {
            chart: $.extend(true, defaults, options || {})
          };
        };
        this.getxAxisTickFormat = function(d, granularity) {
          if (granularity === 'hour') {
            return moment(d).format('MMM DD, HH:mm');
          } else if (granularity === 'minute') {
            return moment(d).format('MMM DD, HH:mm');
          } else {
            return moment(d).format('MMM DD');
          }
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
      granularity: 'day',
      dataSourceName: 'pulsar'
    };
    mockWidgetOptions = {
      title: 'session count',
      disabled: false,
      chart: {
        showLegend: true
      }
    };
    controller = $controller('prTimelineWidgetEdit', {
      $scope: mockScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique'],
      GRANULARITIES: [
        {name: 'all', displayName: '-- Choose granularity if needed --'},
        {name: 'hour', displayName: 'Hourly'},
        {name: 'day', displayName: 'Daily'},
        {name: 'week', displayName: 'Week'}
      ]
    });
  }));

  it('prTimelineWidget directive', function() {
    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.options.isArea = true;
    mockScope.filters = {
      intervals: '2015-07-27 00:00:00/2015-08-02 23:59:59',
      where: {},
      whereRaw: ''
    };
    var compileFn = compileService('<pr-timeline-widget params="params" options="options" filters="filters"></pr-timeline-widget>');
    elem = compileFn(mockScope);
    mockScope.$apply();
    expect(elem.find('div').find('nvd3')).toEqual(jasmine.any(Object));
    expect(elem.find('div').find('nvd3').find('svg')).toEqual(jasmine.any(Object));
    expect(elem.find('nvd3').length).toEqual(1);
    expect(elem.find('nvd3 svg').eq(0).children('g').attr('class')).toContain('nv-lineChart');
    var labels = elem.find('nvd3 svg g.nv-x g.nv-axisMaxMin text');
    expect(labels.eq(0).text()).toEqual('Jul 27');
    expect(labels.eq(1).text()).toEqual('Aug 02');
    expect(elem.find('nvd3 svg g.nv-series text').text()).toEqual('count');
  });

  it('prTimelineWidgetEdit controller', function() {
    expect(mockScope.tables).toEqual(['table1', 'table2', 'table3']);
    expect(mockScope.metrics).toEqual([{name: 'metrics1'}, {name: 'metrics2'}, {name: 'metrics3'}]);
    expect(mockScope.newParams.metrics.length).toEqual(1);
    expect(mockScope.newParams.metrics).toEqual([{name: 'count', type: 'sum', alias: 'count'}]);
    mockScope.$apply();
    mockScope.newParams.table = 'pulsar_ogmb';
    mockScope.$apply();
    expect(mockScope.newParams.metrics).toEqual([]);
  });
});