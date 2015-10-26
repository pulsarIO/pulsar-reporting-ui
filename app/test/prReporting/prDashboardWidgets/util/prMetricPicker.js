/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dashboard.widgets.util.prMetricPicker', function() {
  var elem;
  var elemMulti;
  var $scope;
  var $scopeMulti;

  var compile;
  var timeout;

  // Setup
  beforeEach(angular.mock.module('pr.dashboard.widgets.util'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.inject(function($rootScope, $compile, $timeout) {
    $scope = $rootScope.$new();
    $scopeMulti = $rootScope.$new();
    compile = $compile;
    timeout = $timeout;
  }));

  beforeEach(function() {
    $scope.metrics = undefined;
    $scope.metricsOptions = undefined;
    $scope.aggregationOptions = undefined;
    $scope.multiple = undefined;

    var compileFn = compile('<pr-metric-picker metrics="metrics" metric-options="metricsOptions" aggregation-options="aggregationOptions"></pr-metric-picker>');
    elem = compileFn($scope);

    $scopeMulti.metrics = undefined;
    $scopeMulti.metricsOptions = undefined;
    $scopeMulti.aggregationOptions = undefined;
    $scopeMulti.multiple = true;

    var compileFn2 = compile('<pr-metric-picker metrics="metrics" metric-options="metricsOptions" aggregation-options="aggregationOptions" multiple="multiple"></pr-metric-picker>');
    elemMulti = compileFn2($scopeMulti);
  });

  it('loads html code', function() {
    $scope.$apply();
    $scopeMulti.$apply();

    expect(elem.html()).not.toEqual('');
    expect(elemMulti.html()).not.toEqual('');
  });

  it('hides its contents when no metric options are available', function() {
    $scope.metricsOptions = null;
    $scope.$apply();

    $scopeMulti.metricsOptions = null;
    $scopeMulti.$apply();

    expect(elem.children('div').size()).not.toEqual(0);
    expect(elem.children('div:visible').size()).toEqual(0);

    expect(elemMulti.children('div').size()).not.toEqual(0);
    expect(elemMulti.children('div:visible').size()).toEqual(0);

    $scope.metricsOptions = [];
    $scope.$apply();

    $scopeMulti.metricsOptions = [];
    $scopeMulti.$apply();

    expect(elem.children('div').size()).not.toEqual(0);
    expect(elem.children('div:visible').size()).toEqual(0);

    expect(elemMulti.children('div').size()).not.toEqual(0);
    expect(elemMulti.children('div:visible').size()).toEqual(0);

  });

  it('single metric - displays a single metric ready for selection', function() {
    $scope.metricsOptions = [{name: 'column1'}];
    $scope.$apply();

    expect(elem.find('tr.metric').size()).toEqual(1);
    expect(elem.find('tr.metric td.metric-name').size()).toEqual(1);

    var metricOptions = elem.find('tr.metric td.metric-name option[value!=""]');
    expect(metricOptions.size()).toEqual(1);
    expect(metricOptions.text().trim()).toEqual('column1');

  });

  it('single metric - displays a multiple metrics ready for selection', function() {
    $scope.metricsOptions = [{name: 'column1'}, {name: 'column2'}, {name: 'Third Column'}];
    $scope.$apply();

    expect(elem.find('tr.metric').size()).toEqual(1);
    expect(elem.find('tr.metric td.metric-name').size()).toEqual(1);

    var metricOptions = elem.find('tr.metric td.metric-name option[value!=""]');
    expect(metricOptions.size()).toEqual(3);
    expect(metricOptions.eq(0).text().trim()).toEqual('column1');
    expect(metricOptions.eq(1).text().trim()).toEqual('column2');
    expect(metricOptions.eq(2).text().trim()).toEqual('Third Column');

  });

  it('single metric - displays a multiple aggregations ready for selection', function() {
    $scope.aggregationOptions = ['count', 'sum'];
    $scope.$apply();

    expect(elem.find('tr.metric').size()).toEqual(1);
    expect(elem.find('tr.metric td.metric-aggregation').size()).toEqual(1);

    var aggOptions = elem.find('td.metric-aggregation option.aggregation-option');
    expect(aggOptions.size()).toEqual(2);
    expect(aggOptions.eq(0).text().trim()).toEqual('count');
    expect(aggOptions.eq(1).text().trim()).toEqual('sum');
  });

  it('single metric - select a metric and aggregation', function() {
    $scope.metricsOptions = [{name: 'column1'}, {name: 'column2'}, {name: 'column3'}];
    $scope.aggregationOptions = ['count', 'sum'];
    $scope.$apply();

    elem.find('td.metric-name select').val('column2').trigger('change');
    elem.find('td.metric-aggregation select').val('sum').trigger('change');

    expect($scope.metrics.length).toEqual(1);
    expect($scope.metrics[0].name).toEqual('column2');
    expect($scope.metrics[0].type).toEqual('sum');
    expect($scope.metrics[0].alias).toEqual('column2');
  });

  it('multiple metric - adds a metric', function() {
    $scopeMulti.metricsOptions = [{name: 'column1'}, {name: 'column2'}, {name: 'column3'}];
    $scopeMulti.aggregationOptions = ['count', 'sum'];
    $scopeMulti.$apply();

    expect($scopeMulti.metrics.length).toEqual(0);

    elemMulti.find('.metric-add .dropdown-menu a').eq(2).click();
    $scopeMulti.$apply();

    expect($scopeMulti.metrics.length).toEqual(1);
    expect($scopeMulti.metrics[0].name).toEqual('column3');
    expect($scopeMulti.metrics[0].type).toEqual('count');
    expect($scopeMulti.metrics[0].alias).toEqual('column3');

    elemMulti.find('td.metric-aggregation select').val('sum').trigger('change');

    expect($scopeMulti.metrics[0].name).toEqual('column3');
    expect($scopeMulti.metrics[0].type).toEqual('sum');
    expect($scopeMulti.metrics[0].alias).toEqual('column3');
  });

  it('multiple metric - adds a 3 metrics', function() {
    $scopeMulti.metricsOptions = [{name: 'column1'}, {name: 'column2'}, {name: 'column3'}];
    $scopeMulti.aggregationOptions = ['count', 'sum', 'max'];
    $scopeMulti.$apply();

    expect($scopeMulti.metrics.length).toEqual(0);

    // Add 3 metrics
    elemMulti.find('.metric-add .dropdown-menu a').eq(2).click();
    elemMulti.find('.metric-add .dropdown-menu a').eq(1).click();
    elemMulti.find('.metric-add .dropdown-menu a').eq(0).click();

    // Select its aggregations
    elemMulti.find('td.metric-aggregation select').eq(0).val('sum').trigger('change');
    elemMulti.find('td.metric-aggregation select').eq(1).val('max').trigger('change');
    elemMulti.find('td.metric-aggregation select').eq(2).val('count').trigger('change');
    $scopeMulti.$apply();

    expect($scopeMulti.metrics.length).toBe(3);
    expect(angular.equals($scopeMulti.metrics, [
      {
        name: 'column3', type: 'sum', alias: 'column3'
      }, {
        name: 'column2', type: 'max', alias: 'column2'
      }, {
        name: 'column1', type: 'count', alias: 'column1'
      }
    ])).toBe(true);
  });

  it('multiple metric - removes a metric', function() {
    $scopeMulti.metricsOptions = [{name: 'column1'}, {name: 'column2'}, {name: 'column3'}];
    $scopeMulti.aggregationOptions = ['count'];
    $scopeMulti.metrics = [
      {
        name: 'column2', type: 'count', alias: 'column2'
      }, {
        name: 'column3', type: 'count', alias: 'column3'
      }
    ];
    $scopeMulti.$apply();

    // Remove first metric
    elemMulti.find('td.metric-remove [ng-click^="removeMetric"]').eq(0).trigger('click');

    expect($scopeMulti.metrics.length).toBe(1);
    expect($scopeMulti.metrics[0].name).toBe('column3');
    expect($scopeMulti.metrics[0].type).toBe('count');
  });

  it('multiple metric - leaves only a single metric when multiple is set to false', function() {
    $scopeMulti.metricsOptions = [{name: 'column1'}, {name: 'column2'}, {name: 'column3'}];
    $scopeMulti.aggregationOptions = ['count'];
    $scopeMulti.metrics = [
      {
        name: 'column1', type: 'count', alias: 'column1'
      }, {
        name: 'column2', type: 'count', alias: 'column2'
      }, {
        name: 'column3', type: 'count', alias: 'column3'
      }
    ];
    $scopeMulti.$apply();

    expect($scopeMulti.metrics.length).toBe(3);

    $scopeMulti.multiple = false;
    $scopeMulti.$apply();

    expect($scopeMulti.metrics.length).toBe(1);
    expect($scopeMulti.metrics[0].name).toBe('column1');
  });

  afterEach(function() {
    elem.remove();
    elemMulti.remove();
  });

});
