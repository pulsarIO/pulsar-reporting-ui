/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.widgets.grid', function() {
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

  beforeEach(angular.mock.module('pr.dashboard.widgets.grid'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {
        this.getDataset = function(urlParam, param, successCallback, errorCallback) {
          if (param.table != 'error_table') {
            successCallback([{
              trafficsource: 'Direct',
              users: 999,
              sessions: 9999,
              timestamp: '2015-08-03 00:00:00'
            }, {
              trafficsource: 'Referral',
              users: 888,
              sessions: 8888,
              timestamp: '2015-08-03 00:00:00'
            }]);
          }
          else {
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
  beforeEach(angular.mock.inject(function($rootScope, $compile, $controller, $timeout) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    timeout = $timeout;
    mockWidgetParams = {
      dataSourceName: 'pulsar',
      table: 'pulsar_ogmb',
      dimensions: [{
        name: 'trafficsource'
      }],
      metrics: [{
        name: 'user',
        type: 'count',
        alias: 'users'
      }, {
        name: 'session',
        type: 'count',
        alias: 'sessions'
      }],
      maxResults: 20,
      granularity: 'all'
    };

    mockWidgetErrorParams = {
      dataSourceName: 'pulsar',
      table: 'error_table',
      dimensions: [],
      metrics: [
          {
            name: 'gmv_ag',
            type: 'count',
            alias: 'gmv_ag'
          }
        ],
      maxResults: 20,
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

    editController = $controller('prGridWidgetEdit', {
      $scope: mockEditScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique']
    });
  }));

  it('prGridWidget directive works', function() {
    var compileFn = compileService('<pr-grid-widget params="params" options="options" filters="filters"></pr-grid-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    expect(elem.find('.ui-grid-row').size()).toEqual(2);

    var row1 = elem.find('.ui-grid-row').eq(0);
    var row2 = elem.find('.ui-grid-row').eq(1);
    expect(row1.find('.ui-grid-cell').eq(0).text()).toEqual('Direct');
    expect(row1.find('.ui-grid-cell').eq(1).text()).toEqual('999');
    expect(row1.find('.ui-grid-cell').eq(2).text()).toEqual('9,999');
    expect(row1.find('.ui-grid-cell').eq(3).text()).toEqual('2015-08-03 00:00:00');

    expect(row2.find('.ui-grid-cell').eq(0).text()).toEqual('Referral');
    expect(row2.find('.ui-grid-cell').eq(1).text()).toEqual('888');
    expect(row2.find('.ui-grid-cell').eq(2).text()).toEqual('8,888');
    expect(row1.find('.ui-grid-cell').eq(3).text()).toEqual('2015-08-03 00:00:00');

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).not.toHaveBeenCalled();
    expect(callback.done).toHaveBeenCalled();
  });

  it('prGridWidget directive throws error', function() {
    var compileFn = compileService('<pr-grid-widget params="params" options="options" filters="filters"></pr-grid-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetErrorParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    expect(elem.find('.ui-grid-row').size()).toEqual(0);

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).toHaveBeenCalled();
    expect(callback.done).not.toHaveBeenCalled();
  });

  it('prGridWidgetEdit loads tables', function() {
    mockEditScope.$apply();

    expect(angular.equals(mockEditScope.newParams, mockWidgetParams)).toBe(true);
    expect(mockEditScope.tables).toEqual(['table1', 'table2', 'table3']);
  });

  it('prMetricWidgetEdit loads metrics ', function() {
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(2);
    expect(mockEditScope.newParams.dimensions.length).toBe(1);

    mockEditScope.newParams.table = 'test_source';
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(0);
    expect(mockEditScope.newParams.dimensions.length).toBe(0);

  });
});