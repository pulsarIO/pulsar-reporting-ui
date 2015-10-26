/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.widgets.stack', function() {
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

  beforeEach(angular.mock.module('pr.dashboard.widgets.stack'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {
        this.getStackDataset = function(functionName, param, successCallback, errorCallback) {
          successCallback([
            {
              key: 'Safari',
              values: [{
                x: 1200,
                y: new Date(1000)
              }, {
                x: 1300,
                y: new Date(2000)
              }, {
                x: 1500,
                y: new Date(3000)
              }]
            }, {
              key: 'Internet Explorer',
              values: [{
                x: 800,
                y: new Date(1000)
              }, {
                x: 900,
                y: new Date(2000)
              }, {
                x: 1000,
                y: new Date(3000)
              }]
            }, {
              key: 'Firefox',
              values: [{
                x: 500,
                y: new Date(1000)
              }, {
                x: 600,
                y: new Date(2000)
              }, {
                x: 700,
                y: new Date(3000)
              }]
            }
          ]);
        };
        this.getDimensions = function(params, payload, successCallback, errorCallback) {
          successCallback([{name: 'dimension1'}, {name: 'dimension2'}, {name: 'dimension3'}]);
        };
        this.getMetrics = function(params, payload, successCallback, errorCallback) {
          successCallback([{name: 'metrics1'}, {name: 'metrics2'}, {name: 'metrics3'}]);
        };
        this.getTables = function(params, payload, successCallback, errorCallback) {
          successCallback(['table1', 'table2', 'table3']);
        };
      });
    })
  );
  beforeEach(angular.mock.inject(function($rootScope, $compile, $controller, $timeout, prDatasourceSqlService) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    timeout = $timeout;
    mockWidgetParams = {
      table: 'pulsar_ogmb',
      dimensions: [{
        name: 'browserfamily'
      }],
      metrics: [{
        name: 'clickcount_ag',
        type: 'count',
        alias: 'clickcount_ag'
      }],
      maxResults: 20,
      granularity: 'all',
      dataSourceName: 'pulsar'
    };

    mockWidgetErrorParams = {
      table: 'error_source',
      dimensions: [],
      metrics: [],
      maxResults: 20,
      granularity: 'all',
      dataSourceName: 'pulsar'
    };

    mockWidgetOptions = {
      disabled: false,
      chart: {
        showLegend: true
      }
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

    editController = $controller('prStackWidgetEdit', {
      $scope: mockEditScope,
      widgetParams: mockWidgetParams,
      widgetOptions: mockWidgetOptions,
      prDatasourceSqlService: prDatasourceSqlService,
      AGGREGATION_TYPES: ['count', 'sum', 'min', 'max', 'unique']
    });
  }));

  it('prStackWidget directive works', function() {
    var compileFn = compileService('<pr-stack-widget params="params" options="options" filters="filters"></pr-stack-widget>');
    elem = compileFn(mockScope);

    mockScope.params = mockWidgetParams;
    mockScope.options = mockWidgetOptions;
    mockScope.filters = mockWidgetFilters;

    mockScope.$apply();

    expect(elem.find('svg .nv-legendWrap .nv-series').size()).toBe(3);
    expect(elem.find('svg .nv-groups .nv-group').size()).toBe(3);
    expect(elem.find('svg .nv-groups .nv-point').size()).toBe(9);

    expect(callback.wait).toHaveBeenCalled();
    expect(callback.error).not.toHaveBeenCalled();
    expect(callback.done).toHaveBeenCalled();
  });

  // it('prStackWidget directive throws error', function() {
  //   var compileFn = compileService('<pr-stack-widget params="params" options="options" filters="filters"></pr-stack-widget>');
  //   elem = compileFn(mockScope);

  //   mockScope.params = mockWidgetErrorParams;
  //   mockScope.options = mockWidgetOptions;
  //   mockScope.filters = mockWidgetFilters;

  //   mockScope.$apply();

  //   expect(callback.wait).toHaveBeenCalled();
  //   expect(callback.error).toHaveBeenCalled();
  //   expect(callback.done).not.toHaveBeenCalled();
  // });

  it('prStackWidgetEdit loads datasources', function() {
    mockEditScope.$apply();

    expect(angular.equals(mockEditScope.newParams, mockWidgetParams)).toBe(true);
    expect(mockEditScope.tables).toEqual(['table1', 'table2', 'table3']);
  });

  it('prStackWidgetEdit loads metrics ', function() {
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(1);
    expect(mockEditScope.newParams.dimensions.length).toBe(1);

    mockEditScope.newParams.table = 'test_source';
    mockEditScope.$apply();

    expect(mockEditScope.newParams.metrics.length).toBe(0);
    expect(mockEditScope.newParams.dimensions.length).toBe(0);

  });
});