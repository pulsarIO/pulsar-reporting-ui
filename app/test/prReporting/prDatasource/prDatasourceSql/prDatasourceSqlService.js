/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.datasource.sql.prDatasourceSqlService', function() {

  var prDatasourceSqlService;
  var $httpBackend;
  var prSqlBuilder;

  var paramOneDimensionOneMetric;
  var payloadOneDimensionOneMetric;
  var responseOneDimensionOneMetric;

  var paramTwoDimensionOneMetric;
  var payloadTwoDimensionOneMetric;
  var responseTwoDimensionOneMetric;

  //beforeEach(angular.mock.module('pr.datasource.sql'));

  beforeEach(module('pr.datasource.sql', function(prApiProvider) {
    prApiProvider.url('http://example.com');
    prApiProvider.useWithCredentialsDatasources(false);
    prApiProvider.timezone();
  }));

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      prDatasourceSqlService = $injector.get('prDatasourceSqlService');
      $httpBackend = $injector.get('$httpBackend');
      prSqlBuilder = $injector.get('prSqlBuilder');
    });
  });

  beforeEach(function() {
    // Mock payload and responses
    var metrics = [{name: 'count', type: 'sum', alias: 'events'}, {name: 'count', type: 'sum', alias: 'sessions'}];
    var dimensions = [{ name: 'osfamily'}, {name: 'browserfamily'}];
    var granularities = ['all', 'hour'];

    paramOneDimensionOneMetric = {
      table: 'pulsar_session',
      dimensions: [dimensions[0]],
      metrics: [metrics[0]],
      filters: {
        intervals: '2015-10-14 20:22:28/2015-10-14 20:27:28',
        where: {}
      },
      orderBy: metrics[0].alias,
      granularity: granularities[0]
    };

    payloadOneDimensionOneMetric = {
      sql: prSqlBuilder.buildQuery(paramOneDimensionOneMetric),
      intervals: '2015-10-14 20:22:28/2015-10-14 20:27:28',
      granularity: granularities[0]
    };

    responseOneDimensionOneMetric = [{
      timestamp: '2015-10-14 20:22:28',
      result: {
        osfamily: 'iOS',
        events: 9999
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        osfamily: 'Android',
        events: 8888
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        osfamily: 'Windows 7',
        events: 7777
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        osfamily: 'Other',
        events: 6666
      }
    }];

    paramTwoDimensionOneMetric = {
      table: 'pulsar_session',
      dimensions: [dimensions[0], dimensions[1]],
      metrics: [metrics[0]],
      filters: {
        intervals: '2015-10-14 20:22:28/2015-10-14 20:27:28',
        where: {}
      },
      orderBy: metrics[0].alias,
      granularity: granularities[0]
    };

    payloadTwoDimensionOneMetric = {
      sql: prSqlBuilder.buildQuery(paramTwoDimensionOneMetric),
      intervals: '2015-10-14 20:22:28/2015-10-14 20:27:28',
      granularity: granularities[0]
    };

    responseTwoDimensionOneMetric = [{
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Safari',
        osfamily: 'iOS',
        events: 11
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Safari',
        osfamily: 'Android',
        events: 12
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Safari',
        osfamily: 'Windows 7',
        events: 13
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Chrome',
        osfamily: 'iOS',
        events: 21
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Chrome',
        osfamily: 'Android',
        events: 22
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Chrome',
        osfamily: 'Windows 7',
        events: 23
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Internet Explorer',
        osfamily: 'iOS',
        events: 31
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Internet Explorer',
        osfamily: 'Android',
        events: 32
      }
    }, {
      timestamp: '2015-10-14 20:22:28',
      result: {
        browserfamily: 'Internet Explorer',
        osfamily: 'Windows 7',
        events: 33
      }
    }];
  });

  it('prDatasourceSqlService: api did not change accidentally', function() {
    expect(prDatasourceSqlService.getDataset).toEqual(jasmine.any(Function));
    expect(prDatasourceSqlService.getHistogram).toEqual(jasmine.any(Function));
    expect(prDatasourceSqlService.getGroupedBarData).toEqual(jasmine.any(Function));
    expect(prDatasourceSqlService.getStackDataset).toEqual(jasmine.any(Function));
    expect(prDatasourceSqlService.getMetricData).toEqual(jasmine.any(Function));

    expect(prDatasourceSqlService.getDataSources).toEqual(jasmine.any(Function));
    expect(prDatasourceSqlService.getTables).toEqual(jasmine.any(Function));
    expect(prDatasourceSqlService.getDimensions).toEqual(jasmine.any(Function));
    expect(prDatasourceSqlService.getMetrics).toEqual(jasmine.any(Function));
  });

  it('prDatasourceSqlService: getDataset converts a single dimension and single metric data', function() {
    var params = paramOneDimensionOneMetric;
    var payload = payloadOneDimensionOneMetric;
    var response = responseOneDimensionOneMetric;

    $httpBackend.expectPOST('http://example.com/sql/mydatasource', angular.toJson(payload)).respond(200, angular.toJson(response));

    prDatasourceSqlService.getDataset({dataSourceName: 'mydatasource'}, params, function(data) {
      expect(data).toEqual([{
        osfamily: 'iOS',
        events: 9999
      }, {
        osfamily: 'Android',
        events: 8888
      }, {
        osfamily: 'Windows 7',
        events: 7777
      }, {
        osfamily: 'Other',
        events: 6666
      }]);
    });

    $httpBackend.flush();
  });

  it('prDatasourceSqlService: getHistogram converts a single dimension and single metric data', function() {
    var params = paramOneDimensionOneMetric;
    var payload = payloadOneDimensionOneMetric;
    var response = responseOneDimensionOneMetric;

    $httpBackend.expectPOST('http://example.com/sql/mydatasource', angular.toJson(payload)).respond(200, angular.toJson(response));

    prDatasourceSqlService.getHistogram({dataSourceName: 'mydatasource'}, params, function(data) {
      expect(data).toEqual([{
        key: 'events',
        values: [{
          x: 'iOS',
          y: 9999
        }, {
          x: 'Android',
          y: 8888
        }, {
          x: 'Windows 7',
          y: 7777
        }, {
          x: 'Other',
          y: 6666
        }]
      }]);
    });

    $httpBackend.flush();
  });

  it('prDatasourceSqlService: getStackDataset converts a single dimension and single metric data', function() {
    var params = paramOneDimensionOneMetric;
    var payload = payloadOneDimensionOneMetric;
    var response = responseOneDimensionOneMetric;

    $httpBackend.expectPOST('http://example.com/sql/mydatasource', angular.toJson(payload)).respond(200, angular.toJson(response));

    prDatasourceSqlService.getStackDataset({dataSourceName: 'mydatasource'}, params, function(data) {
      expect(data).toEqual([{
          key: 'iOS',
          values: [{x: new Date('2015-10-14T12:22:28.000Z'), y:9999}]
        }, {
          key: 'Android',
          values: [{x: new Date('2015-10-14T12:22:28.000Z'), y:8888}]
        }, {
          key:'Windows 7',
          values: [{x: new Date('2015-10-14T12:22:28.000Z'), y:7777}]
        }, {
          key:'Other',
          values: [{x: new Date('2015-10-14T12:22:28.000Z'), y:6666}]
        }
      ]);
    });

    $httpBackend.flush();
  });

  it('prDatasourceSqlService: getStackDataset converts a two-dimension and single metric data', function() {
    var params = paramTwoDimensionOneMetric;
    var payload = payloadTwoDimensionOneMetric;
    var response = responseTwoDimensionOneMetric;

    $httpBackend.expectPOST('http://example.com/sql/mydatasource', angular.toJson(payload)).respond(200, angular.toJson(response));

    prDatasourceSqlService.getStackDataset({dataSourceName: 'mydatasource'}, params, function(data) {
      expect(data).toEqual([{
        key: 'iOS',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 11}]
      }, {
        key: 'Android',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 12}]
      }, {
        key: 'Windows 7',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 13}]
      }, {
        key: 'iOS',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 21}]
      }, {
        key: 'Android',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 22}]
      }, {
        key: 'Windows 7',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 23}]
      }, {
        key: 'iOS',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 31}]
      }, {
        key: 'Android',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 32}]
      }, {
        key: 'Windows 7',
        values: [{x: new Date('2015-10-14T12:22:28.000Z'), y: 33}]
      }]);
    });

    $httpBackend.flush();
  });

  it('prDatasourceSqlService: getGroupedBarData converts a two-dimension and single metric data', function() {
    var params = paramTwoDimensionOneMetric;
    var payload = payloadTwoDimensionOneMetric;
    var response = responseTwoDimensionOneMetric;

    $httpBackend.expectPOST('http://example.com/sql/mydatasource', angular.toJson(payload)).respond(200, angular.toJson(response));

    prDatasourceSqlService.getGroupedBarData({dataSourceName: 'mydatasource'}, params, function(data) {
      expect(data).toEqual([{
        key: 'Safari',
        values: [{
          series: 0,
          x: 'iOS',
          y: 11
        }, {
          series: 0,
          x: 'Windows 7',
          y: 13
        }, {
          series: 0,
          x: 'Android',
          y: 12
        }]
      }, {
        key: 'Chrome',
        values: [{
          series: 1,
          x: 'iOS',
          y: 21
        }, {
          series: 1,
          x: 'Windows 7',
          y: 23
        }, {
          series: 1,
          x: 'Android',
          y: 22
        }]
      }, {
        key: 'Internet Explorer',
        values: [{
          series: 2,
          x: 'iOS',
          y: 31
        }, {
          series: 2,
          x: 'Windows 7',
          y: 33
        }, {
          series: 2,
          x: 'Android',
          y: 32
        }]
      }]);
    });

    $httpBackend.flush();
  });

  it('prDatasourceSqlService: getTables works', function() {

    $httpBackend.expectPOST('http://example.com/sql', {
      sql: 'show tables from mydatasource'
    }).respond(200, angular.toJson(['table1', 'table2', 'table3']));

    prDatasourceSqlService.getTables({
      dataSourceName: 'mydatasource'
    }, function(data) {
      expect(angular.equals(data, ['table1', 'table2', 'table3'])).toBe(true);
    });

    $httpBackend.flush();
  });

  it('prDatasourceSqlService: getDimensions works', function() {

    $httpBackend.expectPOST('http://example.com/sql', {
      sql: 'desc mydatasource.mytable.dimensions'
    }).respond(200, angular.toJson(['dimension1', 'dimension2', 'dimension3']));

    prDatasourceSqlService.getDimensions({
      dataSourceName: 'mydatasource',
      table: 'mytable'
    }, function(data) {
      expect(data).toEqual([{
          name: 'dimension1'
        }, {
          name: 'dimension2'
        }, {
          name: 'dimension3'
        }
      ]);
    });

    $httpBackend.flush();
  });

  it('prDatasourceSqlService: getMetrics works', function() {

    $httpBackend.expectPOST('http://example.com/sql', {
      sql: 'desc mydatasource.mytable.metrics'
    }).respond(200, angular.toJson(['metric1', 'metric2', 'metric3']));

    prDatasourceSqlService.getMetrics({
      dataSourceName: 'mydatasource',
      table: 'mytable'
    }, function(data) {
      expect(data).toEqual([{
          name: 'metric1'
        }, {
          name: 'metric2'
        }, {
          name: 'metric3'
        }
      ]);
    });

    $httpBackend.flush();
  });

});