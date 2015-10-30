/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.demo.realtime.RealtimeController', function() {
  var rootScope;
  var mockScope = {};
  var controller;

  beforeEach(angular.mock.module('pr.demo.realtime'));
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    mockScope = $rootScope.$new();
    controller = $controller('RealtimeController', {
      $scope: mockScope
    });
    spyOn(mockScope, '$broadcast');
  }));

  it('RealtimeController', function() {
    expect(mockScope.refresh).toEqual(jasmine.any(Object));
    expect(mockScope.refresh.active).toBeTruthy();
    mockScope.setRefresh(true, true);
    expect(mockScope.$broadcast).toHaveBeenCalledWith('refresh-realtime');
    mockScope.setRefresh(false);
    expect(mockScope.refresh.active).toBeFalsy();
    expect(mockScope.getFilter({trafficsource: 'Direct', devicefamily: 'Desktop', osfamily: 'Windows 7'})).toEqual({trafficsource: 'Direct', devicefamily: 'Desktop', osfamily: 'Windows 7'});
    expect(mockScope.getFilter({devicefamily: 'Desktop', osfamily: 'Windows 7'})).toEqual({devicefamily: 'Desktop', osfamily: 'Windows 7'});
    expect(mockScope.getFilter({osfamily: 'Windows 7'})).toEqual({osfamily: 'Windows 7'});
  });
});

describe('pr.demo.realtime.RealtimeMetricController', function() {
  var mockScope = {};
  var controller;

  beforeEach(angular.mock.module('pr.demo.realtime'));
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    rootScope = $rootScope;
    mockScope = $rootScope.$new();
    mockScope.filters = {};
    $controller('RealtimeController', {
      $scope: $rootScope
    });
    controller = $controller('RealtimeMetricController', {
      $scope: mockScope
    });
  }));

  it('RealtimeMetricController', function() {
    expect(mockScope.params).toEqual(jasmine.any(Object));
    expect(mockScope.params.dataSourceName).toEqual('trackingdruid');
    expect(mockScope.params.table).toEqual('pulsar_event');
    expect(mockScope.options).toEqual(jasmine.any(Object));
    expect(mockScope.options.title).toEqual('Total Events');

    rootScope.$broadcast('refresh-realtime');
    expect(rootScope.filters.intervals).toBeDefined();
  });
});

describe('pr.demo.realtime.RealtimeTrendController', function() {
  var mockScope = {};
  var controller;

  beforeEach(angular.mock.module('pr.demo.realtime'));
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    mockScope = $rootScope.$new();
    mockScope.getFilter = function() {
      return {};
    };
    $controller('RealtimeController', {
      $scope: $rootScope
    });
    controller = $controller('RealtimeTrendController', {
      $scope: mockScope
    });
  }));

  it('RealtimeTrendController', function() {
    expect(mockScope.params).toEqual(jasmine.any(Object));
    expect(mockScope.params.dataSourceName).toEqual('trackingdruid');
    expect(mockScope.params.table).toEqual('pulsar_event');
    expect(mockScope.filters).toEqual(jasmine.any(Object));
    expect(mockScope.filters.where).toEqual({});
    expect(mockScope.options).toEqual(jasmine.any(Object));
    expect(mockScope.options.isArea).toBeTruthy();
  });
});

describe('pr.demo.realtime.RealtimeGridController', function() {
  var mockScope = {};
  var controller;

  beforeEach(angular.mock.module('pr.demo.realtime'));
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    mockScope = $rootScope.$new();
    mockScope.getFilter = function() {
      return {};
    };
    mockScope.filters = {};
    $controller('RealtimeController', {
      $scope: $rootScope
    });
    controller = $controller('RealtimeGridController', {
      $scope: mockScope
    });
  }));

  it('RealtimeGridController', function() {
    expect(mockScope.params).toEqual(jasmine.any(Object));
    expect(mockScope.params.dataSourceName).toEqual('trackingdruid');
    expect(mockScope.params.table).toEqual('pulsar_event');
    expect(mockScope.options).toEqual(jasmine.any(Object));
    expect(mockScope.options.title).toEqual('Traffic Source');

    rootScope.$broadcast('refresh-realtime');
    expect(rootScope.filters.intervals).toBeDefined();
  });
});

describe('pr.demo.realtime.RealtimeRatioController', function() {
  var mockScope = {};
  var controller;

  beforeEach(angular.mock.module('pr.demo.realtime'));
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    mockScope = $rootScope.$new();
    mockScope.getFilter = function() {
      return {};
    };
    mockScope.filters = {};
    $controller('RealtimeController', {
      $scope: $rootScope
    });
    controller = $controller('RealtimeRatioController', {
      $scope: mockScope
    });
  }));

  it('RealtimeRatioController', function() {
    expect(mockScope.params).toEqual(jasmine.any(Object));
    expect(mockScope.params.dataSourceName).toEqual('trackingdruid');
    expect(mockScope.params.table).toEqual('pulsar_event');
    expect(mockScope.options).toEqual(jasmine.any(Object));

    rootScope.$broadcast('refresh-realtime');
    expect(rootScope.filters.intervals).toBeDefined();
  });
});

describe('pr.demo.realtime.RealtimeDistributionController', function() {
  var mockScope = {};
  var controller;

  beforeEach(angular.mock.module('pr.demo.realtime'));
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    mockScope = $rootScope.$new();
    mockScope.getFilter = function() {
      return {};
    };
    mockScope.filters = {};
    $controller('RealtimeController', {
      $scope: $rootScope
    });
    controller = $controller('RealtimeDistributionController', {
      $scope: mockScope
    });
  }));

  it('RealtimeRatioController', function() {
    expect(mockScope.params).toEqual(jasmine.any(Object));
    expect(mockScope.params.dataSourceName).toEqual('trackingdruid');
    expect(mockScope.params.table).toEqual('pulsar_event');
    expect(mockScope.options).toEqual(jasmine.any(Object));
    expect(mockScope.options.title).toEqual('Events Distribution');

    rootScope.$broadcast('refresh-realtime');
    expect(rootScope.filters.intervals).toBeDefined();
  });
});

describe('pr.demo.realtime.RealtimeInfoBoxController', function() {
  var mockScope = {};
  var controller;
  beforeEach(angular.mock.module(function($provide) {
      $provide.service('prDatasourceSqlService', function() {
        this.getDataset = function(params, payload, successCallback, errorCallback) {
          successCallback([
            {
              devicefamily: 'Desktop',
              count: 2710729
            },
            {
              devicefamily: 'Mobile',
              count: 1681766
            },
            {
              devicefamily: 'Other',
              count: 625462
            },
            {
              devicefamily: 'Tablet',
              count: 433024
            }
          ]);
        };
      });
    })
  );

  beforeEach(angular.mock.module('pr.demo.realtime'));
  beforeEach(angular.mock.inject(function($controller, $rootScope, prDatasourceSqlService) {
    mockScope = $rootScope.$new();
    mockScope.getFilter = function() {
      return {};
    };
    mockScope.filters = {
      where: {}
    };
    $controller('RealtimeController', {
      $scope: $rootScope
    });
    controller = $controller('RealtimeInfoBoxController', {
      $scope: mockScope
    });
  }));

  it('RealtimeInfoBoxController', function() {
    expect(mockScope.params).toEqual(jasmine.any(Object));
    expect(mockScope.params.dataSourceName).toEqual('trackingdruid');
    expect(mockScope.params.table).toEqual('pulsar_event');
    mockScope.$broadcast('refresh-realtime');
    mockScope.updateDeviceFilter('Desktop');
    expect(mockScope.filters.where.devicefamily).toEqual('Desktop');
    mockScope.loadInfoBox();
  });
});