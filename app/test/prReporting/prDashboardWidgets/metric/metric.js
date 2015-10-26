/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.widgets.metric', function() {
  var mockScope;
  var compileService;
  var editController;
  var mockWidgetParams;
  var mockWidgetErrorParams;
  var mockWidgetOptions;
  var mockWidgetFilters;
  var elem;
  var timeout;
  var callback;
  var mockEditScope;

  beforeEach(angular.mock.module('pr.dashboard.widgets.metric'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {

        this.getMetricData = function(urlParams, param, successCallback, errorCallback) {
          if (param.table != 'error_source') {
            successCallback(12345);
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
    })
  );
  beforeEach(angular.mock.inject(function($rootScope, $compile, $controller) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    mockWidgetParams = {
      dataSourceName: 'pulsar',
      table: 'pulsar_ogmb',
      dimensions: [],
      metrics: [
          {
            name: 'gmv_ag',
            type: 'count',
            alias: 'gmv_ag'
          }
        ],
      maxResults: 1,
      granularity: 'all'
    };

    mockWidgetErrorParams = {
      dataSourceName: 'pulsar',
      table: 'error_source',
      dimensions: [],
      metrics: [
          {
            name: 'gmv_ag',
            type: 'count',
            alias: 'gmv_ag'
          }
        ],
      maxResults: 1,
      granularity: 'all'
    };

    mockWidgetOptions = {
      title: 'Metric Title Test',
      description: 'Description Test',
      disabled: false
    };

    mockWidgetFilters = {
      intervals: '2015-07-28 00:00:00/2015-07-28 23:59:59',
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

    editController = $controller('prMetricWidgetEdit', {
      $scope: mockEditScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique']
    });
  }));

  it('prMetricWidget directive works', function() {
    var compileFn = compileService('<pr-metric-widget params="params" options="options" filters="filters"></pr-metric-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    expect(elem.find('.inner h4').eq(0).html()).toEqual('gmv_ag');
    expect(elem.find('.inner h3').text()).toEqual('12,345');
    expect(elem.find('.inner h4').eq(1).html()).toEqual('Description Test');

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).not.toHaveBeenCalled();
    expect(callback.done).toHaveBeenCalled();
  });

  it('prMetricWidget directive throws error', function() {
    var compileFn = compileService('<pr-metric-widget params="params" options="options" filters="filters"></pr-metric-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetErrorParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    expect(elem.find('.inner h4').eq(0).html()).toEqual('gmv_ag');
    expect(elem.find('.inner h3').text()).toEqual('--');
    expect(elem.find('.inner h4').eq(1).html()).toEqual('Description Test');

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).toHaveBeenCalled();
    expect(callback.done).not.toHaveBeenCalled();
  });

  it('prMetricWidgetEdit loads datasources', function() {
    mockEditScope.$apply();

    expect(angular.equals(mockEditScope.newParams, mockWidgetParams)).toBe(true);
    expect(mockEditScope.tables).toEqual(['table1', 'table2', 'table3']);
  });

  it('prMetricWidgetEdit loads metrics ', function() {
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(1);
    expect(mockEditScope.newParams.dimensions.length).toBe(0);

    mockEditScope.newParams.table = 'test_source';
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(0);
    expect(mockEditScope.newParams.dimensions.length).toBe(0);

  });
});