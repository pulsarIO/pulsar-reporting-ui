/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
describe('pr.ui.admin.datasourceManageController', function() {

  var adminScope;
  var datasourceManageScope;
  var q;
  var timeout;
  var modalInstance;

  //datasource network interaction related deferred objects;
  var DatasourcesDefer = {
    queryV:null,
    queryM:null
  };

  //for getting util service 'prUIOptionService', set up a replacement for it and then inject into controller again
  var prUIOptionServiceInstance;
  angular.module('non.existing.module', ['pr.UIOption']).run(function(prUIOptionService) {
    prUIOptionServiceInstance = prUIOptionService;
  });
  angular.bootstrap({}, ['non.existing.module']);

  beforeEach(function() {
    module('karma-html2js-templates');

    module('pr.ui.admin');

    module(function($provide) {

      //mocked prUIOptionService
      $provide.factory('prUIOptionService', function() {
        return prUIOptionServiceInstance;
      });

      //mocked $modal
      $provide.service('$modal', function() {
        this.open = function open(o) {

          function MockedModal() {
            this.result = {};
            var _ok;
            var _cancel;
            this.result.then = function(ok, cancel) {
              _ok = ok;
              _cancel = cancel;
            };
            this.close = function close(resolvedData) {
              _ok(resolvedData);
            };
            this.dismiss = function dismiss(tips) {
              _cancel(tips);
            };
          }

          var toResolved = o.resolve;
          var promises = [];
          if (toResolved) {
            angular.forEach(toResolved, function(f, prop) {
              var val = f();
              if (val.then && val.catch && val.finally) {
                promises.push(val);
              }
            });
          }
          modalInstance = new MockedModal();
          var defer = q.defer();
          modalInstance.opened = defer.promise;
          if (promises.length > 0) {
            q.all(promises).then(function succ() {
              defer.resolve();
            }, function fail() {
              defer.reject();
            });
          }
          return modalInstance;
        };

      });

      //mocked Groups
      $provide.service('Datasources', function() {
        this.query = function query(path, params, succ, fail) {
          if (path.type == 'view') {
            DatasourcesDefer.queryV = q.defer();
            DatasourcesDefer.queryV.promise.then(succ, fail);
            return {
              $promise:DatasourcesDefer.queryV.promise
            };
          } else {
            if (path.type == 'manage') {
              DatasourcesDefer.queryM = q.defer();
              DatasourcesDefer.queryM.promise.then(succ, fail);
              return {
                $promise:DatasourcesDefer.queryM.promise
              };
            }
          }
        };
      });
    });

    //inject dependencies
    inject(function($rootScope, $q, $timeout, $compile, $controller, $modal, prUIOptionService, Datasources) {

      //$httpBackend.whenGET('src/ui/admin/datasourceManage/cellTemplates/adminDatasourceOperateView.html').respond('foo1');
      q = $q;
      timeout = $timeout;
      compile = $compile;
      rootScope = $rootScope;
      adminScope = $rootScope.$new();
      $controller('AdminController', {$scope: adminScope});
      datasourceManageScope = adminScope.$new();
      $controller('DatasourceManageController', {$scope: datasourceManageScope});

      compile('<div ui-grid="grid.gridOptions" ui-grid-selection ui-grid-pagination ui-grid-auto-resize pr-grid-height pr-grid-height-deep = "true" class="grid"></div>')(datasourceManageScope);
      datasourceManageScope.$apply();

    });

  });

  it('load datasource success', function() {
    DatasourcesDefer.queryV.resolve([{
      displayName:'Mani01',
      endpoint:'aaa'
    }, {
      displayName:'Mani02',
      endpoint:'bbb'
    }]);
    DatasourcesDefer.queryM.resolve([{
      displayName:'Mani01',
      endpoint:'aaa'
    }, {
      displayName:'Mani02',
      endpoint:'bbb'
    }]);
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(2);
  });

  it('load datasource fail', function() {
    DatasourcesDefer.queryV.reject([]);
    DatasourcesDefer.queryM.reject([]);
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(0);
  });

  it('Delete datasource success', function() {
    var data = [{
      displayName:'Mani01',
      endpoint:'aaa'
    }, {
      displayName:'Mani02',
      endpoint:'bbb'
    }];
    DatasourcesDefer.queryV.resolve(data);
    DatasourcesDefer.queryM.resolve(data);
    datasourceManageScope.$apply();

    datasourceManageScope.deleteDatasource(datasourceManageScope.gridApi.grid.rows[0]);
    modalInstance.close({
      promise: q.resolve()
    });
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(1);
  });

  it('Delete datasource failure', function() {
    var data = [{
      displayName:'Mani01',
      endpoint:'aaa'
    }, {
      displayName:'Mani02',
      endpoint:'bbb'
    }];
    DatasourcesDefer.queryV.resolve(data);
    DatasourcesDefer.queryM.resolve(data);
    datasourceManageScope.$apply();

    datasourceManageScope.deleteDatasource(datasourceManageScope.gridApi.grid.rows[0]);
    modalInstance.close({
      promise: q.reject()
    });
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(2);
  });

  it('delete datasource dialog dismiss', function() {
    var data = [{
      displayName:'Mani01',
      endpoint:'aaa'
    }, {
      displayName:'Mani02',
      endpoint:'bbb'
    }];
    DatasourcesDefer.queryV.resolve(data);
    DatasourcesDefer.queryM.resolve(data);
    datasourceManageScope.$apply();

    datasourceManageScope.deleteDatasource(datasourceManageScope.gridApi.grid.rows[0]);
    modalInstance.dismiss();
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(2);
  });

  it('add datasource success', function() {
    var data = [{
      displayName:'Mani01',
      endpoint:'aaa'
    }, {
      displayName:'Mani02',
      endpoint:'bbb'
    }];
    DatasourcesDefer.queryV.resolve(data);
    DatasourcesDefer.queryM.resolve(data);
    datasourceManageScope.$apply();

    datasourceManageScope.addDatasource({
      displayName:'Mani02',
      endpoint:'bbb'
    });
    modalInstance.close({
      promise: q.resolve({
        displayName:'Mani02',
        endpoint:'bbb'
      })
    });
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(3);
  });

  it('add datasource failure', function() {
    var data = [{
      displayName:'Mani01',
      endpoint:'aaa'
    }];
    DatasourcesDefer.queryV.resolve(data);
    DatasourcesDefer.queryM.resolve(data);
    datasourceManageScope.$apply();

    datasourceManageScope.addDatasource(
      {displayName:'Mani02',
        endpoint:'bbb'});
    modalInstance.close({
      promise: q.reject()
    });
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(1);
  });

  it('add datasource dismiss', function() {
    var data = [{
      displayName:'Mani01',
      endpoint:'aaa'
    }];
    datasourceManageScope.grid.gridOptions.data = data;
    datasourceManageScope.$apply();
    datasourceManageScope.addDatasource(
      {displayName:'Mani02',
        endpoint:'bbb'});
    modalInstance.dismiss({
    });
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(1);
  });

  it('edit datasource success', function() {
    var data = [{
      displayName:'Mani01',
      endpoint:'aaa'
    }];
    datasourceManageScope.grid.gridOptions.data = data;
    datasourceManageScope.$apply();
    datasourceManageScope.editDatasource(data[0]);
    modalInstance.close({
      promise: q.resolve({
        displayName:'Mani02',
        endpoint:'bbb'
      })
    });
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(1);
    expect(datasourceManageScope.grid.gridOptions.data[0].displayName).toEqual('Mani02');
    expect(datasourceManageScope.grid.gridOptions.data[0].endpoint).toEqual('bbb');
  });

  it('edit datasource failure', function() {
    var data = [{
      displayName: 'Mani01',
      endpoint: 'aaa'
    }];
    datasourceManageScope.grid.gridOptions.data = data;
    datasourceManageScope.$apply();
    datasourceManageScope.editDatasource(data[0]);
    modalInstance.close({
      promise: q.reject({
        displayName: 'Mani02',
        endpoint: 'bbb'
      })
    });
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(1);
    expect(datasourceManageScope.grid.gridOptions.data[0].displayName).toEqual('Mani01');
    expect(datasourceManageScope.grid.gridOptions.data[0].endpoint).toEqual('aaa');
  });

  it('edit datasource dismiss', function() {
    var data = [{
      displayName: 'Mani01',
      endpoint: 'aaa'
    }];
    datasourceManageScope.grid.gridOptions.data = data;
    datasourceManageScope.$apply();
    datasourceManageScope.editDatasource(data[0]);
    modalInstance.dismiss();
    datasourceManageScope.$apply();
    expect(datasourceManageScope.grid.gridOptions.data.length).toEqual(1);
    expect(datasourceManageScope.grid.gridOptions.data[0].displayName).toEqual('Mani01');
    expect(datasourceManageScope.grid.gridOptions.data[0].endpoint).toEqual('aaa');
  });

});
