/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.dynamicfilter.prDynamicFilter', function() {
  var elem;
  var $scope;
  var compileFn;
  var filter;

  beforeEach(angular.mock.module('pr.dynamicfilter'));
  beforeEach(angular.mock.module('karma-html2js-templates'));

  beforeEach(angular.mock.module(function($provide) {
    $provide.service('prDatasourceSqlService', function() {
      this.getDimensions = function(urlParam, param, successCallback, errorCallback) {
        successCallback([{
          name: 'browserfamily'
        }, {
          name: 'devicefamily'
        }, {
          name: 'trafficsource'
        }]);
      };

      this.getDataset = function(urlParam, param, successCallback, errorCallback) {
        var dimName = param.dimensions[0].name;
        res = [];
        if (dimName == 'browserfamily') {
          res = [{
            count: 9999, browserfamily: 'browserfamily1'
          }, {
            count: 8888, browserfamily: 'browserfamily2'
          }, {
            count: 7777, browserfamily: 'browserfamily3'
          }, {
            count: 6666, browserfamily: 'browserfamily4'
          }];
        } else if (dimName == 'devicefamily') {
          res = [{
            count: 999, devicefamily: 'devicefamily1'
          }, {
            count: 888, devicefamily: 'devicefamily2'
          }, {
            count: 777, devicefamily: 'devicefamily3'
          }];
        } else if (dimName == 'trafficsource') {
          res = [{
            count: 99, trafficsource: 'trafficsource1'
          }, {
            count: 88, trafficsource: 'trafficsource2'
          }, {
            count: 77, trafficsource: 'trafficsource3'
          }];
        } else {
          errorCallback({
            data: {
              error: 'Cannot use error_source'
            }
          });
          return;
        }
        successCallback(res);
      };

    });
  }));

  beforeEach(angular.mock.inject(function($rootScope, $compile, $filter) {
    mockScope = $rootScope.$new();
    filter = $filter;

    mockScope.metric = undefined;
    mockScope.filters = undefined;
    mockScope.maxOptions = undefined;
    mockScope.maxDimensions = undefined;

    mockScope.model = undefined;

    mockScope.drilldown = undefined;
    mockScope.editMode = undefined;
    mockScope.visibleOptionsSelected = undefined;
    mockScope.submitEvent = undefined;

    mockScope.dimensions = undefined;

    compileFn = $compile('<pr-dynamic-filter ' +
      'datasource="\'pulsar\'"' +
      'table="\'events\'"' +
      'metric="metric"' +
      'filters="filters"' +
      'maxOptions="maxOptions"' +
      'maxDimensions="maxDimensions"' +

      'model="model"' +

      'drilldown="drilldown"' +
      'edit-mode="editMode"' +
      'visible-options-selected="visibleOptionsSelected"' +
      'submit-event="submitEvent"' +

      'dimensions="dimensions"' +
      '></pr-dynamic-filter>');
  }));

  it('prDynamicFilter is rendered', function() {
    elem = compileFn(mockScope);

    mockScope.model = {};
    mockScope.drilldown = false;
    mockScope.editMode = false;
    mockScope.visibleOptionsSelected = 1;
    mockScope.submitEvent = undefined;

    mockScope.dimensions = undefined;

    mockScope.$apply();

    expect(elem.find('form').size()).toEqual(1);

    // Model should be empty
    expect(mockScope.model).toEqual({});

  });

  it('prDynamicFilter is rendered with a preset dimension', function() {
    elem = compileFn(mockScope);

    mockScope.model = {
      browserfamily: []
    };
    mockScope.editMode = false;
    mockScope.dimensions = [{
      name: 'browserfamily'
    }];

    mockScope.$apply();

    expect(mockScope.model).toEqual({browserfamily: []});
    expect(elem.find('.form-group:eq(0) .dropdown-menu a').size()).toBe(4 + 1);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a .fa-square-o').size()).toBe(4);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a .fa-check-square-o').size()).toBe(0);

    // Click the second option
    var opt1 = elem.find('.form-group:eq(0) > div').find('[dropdown] .dropdown-menu a:eq(1)');
    opt1.click();

    mockScope.$apply();

    expect(mockScope.model).toEqual({browserfamily: ['browserfamily2']});
    expect(elem.find('.form-group:eq(0) .dropdown-menu a').size()).toBe(4 + 1);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a .fa-square-o').size()).toBe(3);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a .fa-check-square-o').size()).toBe(1);
  });

  it('prDynamicFilter is rendered with a preset dimension - remove dimension', function() {
    elem = compileFn(mockScope);

    mockScope.model = {};
    mockScope.editMode = true;
    mockScope.dimensions = [{
      name: 'browserfamily'
    }];

    mockScope.$apply();

    expect(mockScope.model).toEqual({browserfamily: []});

    // Click the remove option
    var deleteOpt = elem.find('.form-group:eq(0) .filter-remove');
    expect(deleteOpt.html()).toMatch('.*fa fa-trash-o.*');

    deleteOpt.click();

    mockScope.$apply();

    // Model is empty
    expect(mockScope.dimensions.length).toEqual(0);
    expect(mockScope.model).toEqual({});
  });

  it('prDynamicFilter is rendered with a preset dimension - uncheck dimension', function() {
    elem = compileFn(mockScope);

    mockScope.model = {
      browserfamily: ['browserfamily2', 'browserfamily4']
    };
    mockScope.dimensions = [{
      name: 'browserfamily'
    }];
    mockScope.editMode = true;

    mockScope.$apply();

    expect(mockScope.model).toEqual({browserfamily: ['browserfamily2', 'browserfamily4']});

    var uncheckAll = elem.find('.form-group:eq(0) > div').find('[dropdown] .dropdown-menu a').last();
    expect(uncheckAll.text()).toMatch('.*Uncheck all.*');

    // Click the 'uncheck all' option
    uncheckAll.click();

    mockScope.$apply();

    expect(mockScope.model).toEqual({browserfamily: []});
  });

  it('prDynamicFilter edit mode - add a new dimension', function() {
    elem = compileFn(mockScope);

    mockScope.model = {};
    mockScope.dimensions = [];
    mockScope.editMode = true;
    mockScope.$apply();

    var dropdownGroups = elem.find('.form-group');
    var editDropdown = dropdownGroups.last().find('[dropdown]').first();

    // Dropdowsn to add dimension is there
    expect(dropdownGroups.size()).toEqual(1);
    expect(editDropdown.find('[dropdown-toggle]').text()).toMatch('.*Add filter.*');
    expect(editDropdown.find('.dropdown-menu').children().size()).toEqual(3);

    // Click to add a dimension
    editDropdown.find('.dropdown-menu a').first().click();
    mockScope.$apply();

    dropdownGroups = elem.find('.form-group');
    expect(dropdownGroups.size()).toEqual(2);
    expect(dropdownGroups.first().find('label').text()).toMatch('.*browserfamily.*');

    // Model has one dimension
    expect(mockScope.dimensions.length).toEqual(1);
    expect(mockScope.dimensions[0].name).toEqual('browserfamily');
    expect(mockScope.dimensions[0].options.length).toEqual(4);
    expect(mockScope.model.browserfamily).toEqual([]);
  });

  it('prDynamicFilter preset values', function() {
    elem = compileFn(mockScope);

    mockScope.model = {
      browserfamily: ['browserfamily2', 'browserfamily4']
    };
    mockScope.$apply();

    // Model is not empty
    expect(elem.find('.form-group:eq(0) .dropdown-menu a').size()).toBe(4 + 1);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a').eq(0).find('.fa-square-o').size()).toBe(1);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a').eq(1).find('.fa-check-square-o').size()).toBe(1);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a').eq(2).find('.fa-square-o').size()).toBe(1);
    expect(elem.find('.form-group:eq(0) .dropdown-menu a').eq(3).find('.fa-check-square-o').size()).toBe(1);
  });

  it('prDynamicFilter drilldown', function() {
    elem = compileFn(mockScope);

    mockScope.model = {
      browserfamily: ['browserfamily2', 'browserfamily4'],
      devicefamily: ['devicefamily2', 'devicefamily3']
    };
    mockScope.drilldown = true;
    mockScope.dimensions = [{
      name: 'browserfamily'
    }, {
      name: 'devicefamily'
    }];
    mockScope.$apply();

    // Model is setup
    expect(mockScope.model).toEqual({
      browserfamily: ['browserfamily2', 'browserfamily4'],
      devicefamily: ['devicefamily2', 'devicefamily3']
    });

    // Modify model, click an option
    var dropdownGroups = elem.find('.form-group');
    dropdownGroups.first().find('.dropdown-menu a').first().click();
    mockScope.$apply();

    // Model sets new options and resets the following ones
    expect(mockScope.model).toEqual({
      browserfamily: ['browserfamily2', 'browserfamily4', 'browserfamily1'],
      devicefamily: []
    });

  });

  it('prDynamicFilter submit and event', function() {
    elem = compileFn(mockScope);

    mockScope.dimensions = [{
      name: 'browserfamily'
    }, {
      name: 'devicefamily'
    }];
    mockScope.model = {
      browserfamily: ['browserfamily2', 'browserfamily4'],
      devicefamily: ['devicefamily2', 'devicefamily3']
    };
    mockScope.submitEvent = 'mySubmitEvent';
    mockScope.$apply();

    var spy = jasmine.createSpyObj('spy', ['submit']);
    mockScope.$on('mySubmitEvent', function(e, values) {
      spy.submit(values);
    });

    expect(elem.find('[ng-click="submit()"]').size()).toEqual(1);

    elem.find('[ng-click="submit()"]').click();
    mockScope.$apply();

    expect(spy.submit).toHaveBeenCalledWith({
      browserfamily: ['browserfamily2', 'browserfamily4'],
      devicefamily: ['devicefamily2', 'devicefamily3']
    });

    elem.find('[ng-click="submit()"]').click();

    // Modify model, click an option
    var dropdownGroups = elem.find('.form-group');
    dropdownGroups.first().find('.dropdown-menu a').first().click();
    mockScope.$apply();

    elem.find('[ng-click="submit()"]').click();
    mockScope.$apply();

    // Expect the new topsion
    expect(spy.submit).toHaveBeenCalledWith({
      browserfamily: ['browserfamily2', 'browserfamily4', 'browserfamily1'],
      devicefamily: ['devicefamily2', 'devicefamily3']
    });

  });

});