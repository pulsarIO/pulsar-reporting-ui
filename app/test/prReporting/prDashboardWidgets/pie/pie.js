/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.widgets.pie', function() {
  var mockScope;
  var compileService;
  var controller;
  var mockWidgetParams;
  var mockWidgetOptions;

  beforeEach(angular.mock.module('pr.dashboard.widgets.pie'));
  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {
        this.getHistogram = function(params, payload, successCallback, errorCallback) {
          if (payload.table != 'error_table') {
            successCallback([{key: 'count', values: [{x: 'Chrome', y: 213382521}, {x: 'Safari', y: 118770175}]}]);
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
      $provide.service('prUIOptionService', function($filter) {
        this.getPieChartOptions = function(options) {
          var defaults = {
            type: 'pieChart',
            margin: {
              top: -30,
              right: -30,
              bottom: -30,
              left: -30
            },
            height: 300,
            valueFormat: $filter('number'),
            showLabels: true,
            showLegend: false,
            transitionDuration: 500,
            labelsOutside: false,
            pie: {
              dispatch: {
              }
            }
          };
          return {
            chart: $.extend(defaults, options || {})
          };
        };
      });
    })
  );
  beforeEach(angular.mock.inject(function($rootScope, $compile, $controller, prDatasourceSqlService, prUIOptionService) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    mockWidgetParams = {
      dataSourceName: 'pulsar',
      table: 'pulsar_session',
      dimensions: [
        {
          name: 'browserfamily'
        }
      ],
      metrics: [
        {
          name: 'count',
          type: 'sum',
          alias: 'count'
        }
      ],
      maxResults: 10,
      granularity: 'all'
    };
    mockWidgetErrorParams = {
      dataSourceName: 'pulsar',
      table: 'error_table',
      dimensions: [
        {
          name: 'browserfamily'
        }
      ],
      metrics: [],
      maxResults: 10,
      granularity: 'all'
    };
    mockWidgetFilters = {
      intervals: '2015-07-27 00:00:00/2015-08-02 23:59:59',
      where: {},
      whereRaw: ''
    };
    mockWidgetOptions = {
      title: 'Broswer Distribution',
      disabled: false
    };
    controller = $controller('prPieWidgetEdit', {
      $scope: mockScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique']
    });

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

  }));

  it('prPieWidget directive', function() {
    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    var compileFn = compileService('<pr-pie-widget params="params" options="options" filters="filters"></pr-pie-widget>');
    elem = compileFn(mockScope);
    mockScope.$apply();

    expect(elem.find('div').find('nvd3')).toEqual(jasmine.any(Object));
    expect(elem.find('div').find('nvd3').find('svg')).toEqual(jasmine.any(Object));
    expect(elem.find('nvd3').length).toEqual(1);
    expect(elem.find('nvd3 svg').eq(0).children('g').attr('class')).toContain('nv-pieChart');
    var labels = elem.find('nvd3 svg g.nv-label text');
    expect(labels.eq(0).text()).toEqual('Chrome');
    expect(labels.eq(1).text()).toEqual('Safari');

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).not.toHaveBeenCalled();
    expect(callback.done).toHaveBeenCalled();
  });

  it('prPieWidget directive click adds filter (YEL-1414)', function() {

    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    var compileFn = compileService('<pr-pie-widget params="params" options="options" filters="filters"></pr-pie-widget>');
    elem = compileFn(mockScope);

    // Append the elem to body to pass firefox tests: svg will fail if not in the document.
    // Some details in https://github.com/NESCent/dplace/issues/175
    $(document.body).append(elem);

    mockScope.$apply();

    expect(mockWidgetFilters.where).toEqual({});

    // Can't use regular jquery events work here. Used a d3 event dispatch http://stackoverflow.com/a/11180172/777539
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    // Simulate click
    elem.find('.nv-slice').first().find('path')[0].dispatchEvent(evt);

    mockScope.$apply();

    expect(mockWidgetFilters.where).toEqual({
      browserfamily: 'Chrome'
    });

  });

  it('prPieWidget directive throws error', function() {
    var compileFn = compileService('<pr-pie-widget params="params" options="options" filters="filters"></pr-pie-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetErrorParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).toHaveBeenCalled();
    expect(callback.done).not.toHaveBeenCalled();
  });

  it('prPieWidget is set as interactive only when slice can be cliecked (YEL-1416)', function() {
    var compileFn = compileService('<pr-pie-widget params="params" options="options" filters="filters"></pr-pie-widget>');

    mockScope.params = mockWidgetParams;
    mockScope.options = {
      title: 'Browser Distribution With No Click',
      disabled: false,
      chart: {
        pie: {
          dispatch: {
            elementClick: null
          }
        }
      }
    };
    mockScope.filters = mockWidgetFilters;

    elem = compileFn(mockScope);

    mockScope.$apply();

    expect(elem.find('nvd3').size()).toEqual(1);
    expect(elem.find('nvd3.interactive').size()).toEqual(0);
  });

  it('prPieWidgetEdit controller', function() {
    expect(mockScope.tables).toEqual(['table1', 'table2', 'table3']);
    mockScope.initDimensionsAndMetrics();
    expect(mockScope.dimensions).toEqual([{name: 'dimension1'}, {name: 'dimension2'}, {name: 'dimension3'}]);
    expect(mockScope.metrics).toEqual([{name: 'metric1'}, {name: 'metric2'}, {name: 'metric3'}]);
    mockScope.$apply();
    mockScope.newParams.table = 'pulsar_ogmb';
    mockScope.$apply();
    expect(mockScope.newParams.dimensions).toEqual([]);
    expect(mockScope.newParams.metrics).toEqual([]);
  });

});