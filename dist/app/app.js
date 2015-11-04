/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

var deps = [
  'ngResource',
  'ncy-angular-breadcrumb',

  'pr.ui.creator',
  'pr.ui.admin',
  'pr.api',

  'ui.router.menus'
];

// Conditionally add modules if available
try {
  angular.module('pr.tpls');
  deps.push('pr.tpls');
} catch (err) { }

try {
  angular.module('pr.demo');
  deps.push('pr.demo');
} catch (err) { }

/**
 * @ngdoc object
 * @name pr
 * @requires $rootScope
 * @requires $log
 * @requires $state
 * @requires $stateParams
 * @description
 *
 * This is the main script to setup the stand-alone application, which does the following:
 *
 */
angular.module('pr', deps)

.config(
    function($stateProvider, $urlRouterProvider, $breadcrumbProvider, prApiProvider) {

      // Define the base state
      $stateProvider.state('home', {
        abstract: true,
        url: '',

        template: '<div ui-view></div>',

        controller: function($rootScope, $state) {
          $rootScope.pageTitle = function() {
            return $state.current.data.pageTitle;
          };
        },

        ncyBreadcrumb: {
          label: 'Pulsar Reporting UI Sample App'
        },
        data: {
          pageTitle: 'Home'
        }
      });

      // Configure the breadcrumb
      $breadcrumbProvider.setOptions({
        prefixStateName: 'home',
        includeAbstract: true
      });

      // If the url is ever invalid, e.g. '/asdf', then redire ct to '/' aka the home state
      $urlRouterProvider
        .otherwise('/demo/realtime');
    });
})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc object
 * @name pr.ui.creator
 * @description This is a controller for one of the main sections of the reporting tool.
 *
 * @requires $rootScope
 * @requires $log
 * @requires $state
 * @requires $stateParams
 * @requires ui.router
 * @requires ui.bootstrap
 * @requires pr.date
 * @requires pr.datasource
 * @requires pr.dashboard
 * @requires pr.dashboard.layouts
 * @requires pr.dashboard.widgets.grid.widget:pr-grid
 * @requires pr.dashboard.widgets.bar.widget:pr-bar
 * @requires pr.dashboard.widgets.linewithfocus.widget:pr-linewithfocus
 * @requires pr.dashboard.widgets.groupedBar.widget:pr-groupedBar
 * @requires pr.dashboard.widgets.metric.widget:pr-metric
 * @requires pr.dashboard.widgets.pie.widget:pr-pie
 * @requires pr.dashboard.widgets.stack.widget:pr-stack
 * @requires pr.dashboard.widgets.timeline.widget:pr-timeline
 *
 */

angular.module('pr.ui.creator', [
    'ui.router',
    'ui.bootstrap',

    'pr.api',

    'pr.date',
    'pr.datasource',

    'pr.dashboard',
    'pr.dashboard.layouts',

    'pr.dashboard.widgets.grid',
    'pr.dashboard.widgets.bar',
    'pr.dashboard.widgets.linewithfocus',
    'pr.dashboard.widgets.groupedBar',
    'pr.dashboard.widgets.metric',
    'pr.dashboard.widgets.pie',
    'pr.dashboard.widgets.stack',
    'pr.dashboard.widgets.timeline'
]);

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.creator')

.config(
    function($stateProvider) {
      $stateProvider.state('home.creator', {
        weight: 2,
        url: '/creator?:dashboard',
        views: {
          '': {
            templateUrl: 'src/ui/creator/creator.html',
            controller: 'CreatorController'
          },
          'dashboard@home.creator': {
            templateUrl: 'src/ui/creator/creatorDashboard.html',
            controller: 'CreatorDashboardController'
          }
        },
        resolve: {
          dashboards: function(prDashboardResource) {
            return prDashboardResource.query({right: 'view'}).$promise;
          },
          editableDashboards: function(prDashboardResource) {
            return prDashboardResource.query({right: 'manage'}).$promise;
          }
        },
        ncyBreadcrumb: {
          label: 'Reports Creator'
        },
        data: {
          pageTitle: 'Reports Creator'
        },
        menu: {
          name: 'Reports Creator',
          icon: 'fa fa-pencil',
          priority: 1
        }
      });
    })

/**
 * @ngdoc controller
 * @name pr.ui.creator.controller:CreatorController
 *
 * @description The `CreatorController` defines how to add, select and delete a dashboard.
 *
 * @requires pr.dashboard.prDashboardResource
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */
.controller('CreatorController',
  function($scope, $modal, $stateParams, $state, $location, $log, prDashboardResource, dashboards, editableDashboards) {
    $scope.dashboards = dashboards;
    $scope.editableDashboards = editableDashboards;

    $scope.dashboard = null;
    $scope.current = -1;
    $scope.savedDashboard = null;

    /**
     * @ngdoc method
     * @name addDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Opens a modal that adds a dashboard
     */

    $scope.addDashboard = function() {
      var modalInstance = $modal.open({
        scope: $scope,
        backdrop: 'static',
        templateUrl: 'src/ui/creator/modals/add.html',
        controller: 'CreatorModalAddController',
        size: 'lg'
      });

      modalInstance.result.then(function(dashboard) {
        $scope.dashboards.push(dashboard);
        $scope.selectDashboard($scope.dashboards.length - 1);
        prDashboardResource.query({right: 'manage'}, function(editableDbs) {
          angular.copy(editableDbs, $scope.editableDashboards);
        });
      }, function() {
        $log.log('error');
      });
    };

    /**
     * @ngdoc method
     * @name canEditDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Answers if the user can edit the dashboard
     * @returs {boolean} true if the dashboard is in the list of dashboards with manage rights
     */
    $scope.canEditDashboard = function() {
      var res = false;
      angular.forEach($scope.editableDashboards, function(editableDashboard) {
        if ($scope.dashboard && editableDashboard.name === $scope.dashboard.name) {
          res = true;
        }
      });
      return res;
    };

    /**
     * @ngdoc method
     * @name deleteDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description DELETEs a dashboard from the backend.
     * @param {function(value, responseHeaders) } success Success callback
     * @param {function(httpErrorResponse) } error Error callback
     */
    $scope.deleteDashboard = function() {
      if (!$scope.canEditDashboard()) {
        return;
      }
      var modalInstance = $modal.open({
        scope: $scope,
        backdrop: 'static',
        templateUrl: 'src/ui/creator/modals/delete.html'
      });
      modalInstance.result.then(function() {
        $scope.dashboards[$scope.current].$delete(function() {
          $scope.selectDashboard();
          prDashboardResource.query({right: 'manage'}, function(editableDbs) {
            angular.copy(editableDbs, $scope.editableDashboards);
          });
          prDashboardResource.query({right: 'view'}, function(dashboards) {
            angular.copy(dashboards, $scope.dashboards);
          });
        });
      });
    };

    /**
     * @ngdoc method
     * @name selectDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Select and show the content of a dashboard
     * @param {number} index Index of dashboard in the dashboards array
     */
    $scope.selectDashboard = function(i) {
      if ($scope.dashboards[i]) {
        $scope.current = i;
        $scope.dashboard = $scope.dashboards[i];
        $scope.dashboard.$get(function() {
          $scope.savedDashboard = angular.copy($scope.dashboard);
        });

        $stateParams.dashboard = $scope.dashboard.name;
        $state.params.dashboard = $scope.dashboard.name;
        $location.search('dashboard', $scope.dashboard.name);

      } else {
        $scope.dashboard = null;
        $scope.savedDashboard = null;
        $scope.current = -1;

        $stateParams.dashboard = undefined;
        $state.params.dashboard = undefined;
        $location.search('dashboard', undefined);
      }
    };

    // Initialize controller

    // If not dashboard is selected, a default dashboard is set
    if (angular.isUndefined($stateParams.dashboard)) {
      $scope.selectDashboard();
    } else {
      angular.forEach($scope.dashboards, function(d, i) {
        if ($stateParams.dashboard === d.name) {
          $scope.selectDashboard(i);
        }
      });
    }

  });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.creator')

/**
 * @ngdoc controller
 * @name pr.ui.creator.controller:CreatorDashboardController
 *
 * @description The `CreatorDashboardController` defines how to create customized dashboard.
 * You can select the layout and date range, then add widgets and save dashboard.
 *
 * @requires pr.dashboard.directive:prDashboard
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */
.controller('CreatorDashboardController',
  function($scope, $modal, $filter, prApi, prDashboard) {

    /**
     * @ngdoc method
     * @name refreshDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Reload the current dashboard from the backend
     */
    $scope.refreshDashboard = function() {
      $scope.dashboard.$get(function() {
        $scope.savedDashboard = angular.copy($scope.dashboard);
        if ($scope.dashboard && $scope.dashboard.config && $scope.dashboard.config.filters) {
          $scope.whereRaw = $scope.dashboard.config.filters.whereRaw || '';
        }
      });
    };

    /**
     * @ngdoc method
     * @name persistDashboard
     * @methodOf pr.ui.creator.controller:CreatorController
     * @description Saves the dashboard to the backend
     */
    $scope.persistDashboard = function() {
      $scope.dashboard.$update(function() {
        $scope.savedDashboard = angular.copy($scope.dashboard);
      });
    };

    /**
     * @ngdoc method
     * @name changeDateRange
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Navigates to a new date range, used by pr-datepicker directive as a callback for date changes.
     * @param  {moment} start Start Date
     * @param  {moment} end   End Date
     */
    $scope.changeDateRange = function(start, end) {
      $scope.dashboard.config.filters.intervals = $filter('intervalDate')(start) + '/' + $filter('intervalDate')(end);
    };

    $scope.removeFilter = function(name) {
      delete $scope.dashboard.config.filters.where[name];
    };

    $scope.addRawFilter = function(filter) {
      $scope.dashboard.config.filters.whereRaw = filter;
    };

    $scope.isDashboardSaved = function() {
      return angular.equals($scope.dashboard, $scope.savedDashboard);
    };

    /**
     * @ngdoc method
     * @name selectLayout
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Select the layout of dashboard
     * @param  {number} layoutId The layout id, '12' stand for Bootstap 3 class col-sm-12
     */
    $scope.selectLayout = function() {
      var modalInstance = $modal.open({
        scope: $scope,
        backdrop: 'static',
        templateUrl: 'src/ui/creator/modals/layout.html',
        controller: 'CreatorModalSelectLayoutController',
        size: 'lg'
      });

      modalInstance.result.then(function(layoutId) {
        // Note, layout is the id string
        $scope.dashboard.config.layout = layoutId;
      });
    };

    /**
     * @ngdoc method
     * @name setEditMode
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Set the edit mode of the dashboard
     * @param {boolean} editMode New edit mode value
     */
    $scope.setEditMode = function(editMode) {
      $scope.editMode = editMode;
    };

    /**
     * @ngdoc method
     * @name addWidget
     * @methodOf pr.ui.creator.controller:CreatorDashboardController
     * @description Add a new widget to the dashboard
     * @param {string} widgetType Widget tpye name, must match one of the widgets in the prDashboard service.
     */
    $scope.addWidget = function(widgetType) {
      // Create a default empty generic widget
      var widget = {
        type: widgetType,

        params: {
          dataSourceName: $scope.dashboard.config.dataSourceName || '',
          table: '',
          dimensions: [],
          metrics: [],
          maxResults: undefined,
          granularity: 'all'
        },
        options: {
          title: '',

          // The widget is initialized with disabled state
          disabled: true
        }
      };
      $scope.dashboard.config.columns[0].widgets.unshift(widget);
    };

    // Initialize controller

    // Get list of available widgets in the service
    $scope.widgets = prDashboard.widgets;

    // Ensure once the dahboard is loaded, the dates and filters stay syncronized
    $scope.$watch('dashboard.config.filters', function(filters) {
      if (filters) {
        $scope.start = moment.tz(filters.intervals.split('/')[0], prApi.timezone).format('X');
        $scope.end = moment.tz(filters.intervals.split('/')[1], prApi.timezone).format('X');
        $scope.whereRaw = filters.whereRaw || '';
      }
    }, true);

    // The dashboard is initially not in edit mode
    $scope.editMode = false;

  });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.creator')

/**
 * @ngdoc controller
 * @name pr.ui.creator.controller:CreatorModalAddController
 *
 * @description The `CreatorModalAddController` defines the modal to create a new dashboard, including name and type input
 *
 * @requires pr.dashboard.directive:prDashboard
 * @requires pr.dashboard.prDashboardResource
 * @requires pr.datasource.sql.prDatasourceSqlService
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */

.controller('CreatorModalAddController',
    function($scope, $modalInstance, $filter, prApi, prDashboard, prDatasourceSqlService, prDashboardResource) {
      $scope.saveError = null;

      /**
       * @ngdoc method
       * @name add
       * @methodOf pr.ui.creator.controller:CreatorModalAddController
       * @description Adds a dashboard to the backend, resolves the modal if succesful
       */
      $scope.add = function() {
        // Create a blank dashboard
        var structure = angular.copy(prDashboard.layouts[$scope.newDashboard.config.layout]);
        angular.extend($scope.newDashboard.config, structure);

        $scope.wait = true;

        $scope.newDashboard.$save(function() {
          $scope.wait = false;
          $modalInstance.close($scope.newDashboard);
        }, function(error) {
          $scope.wait = false;
          $scope.saveError = error;
        });

      };

      // Initialize controller

      // Build default values of the dashboard
      var startTime = moment().tz(prApi.timezone).startOf('day').subtract(1, 'weeks').format('X');
      var endTime = moment().tz(prApi.timezone).endOf('day').subtract(1, 'days').format('X');

      $scope.newDashboard = new prDashboardResource({
        displayName: 'Dashboard ' + ($scope.dashboards.length + 1),
        config: {
          dataSourceName: '',
          layout:  '4-4-4',
          filters: {
            intervals: $filter('intervalDate')(startTime) + '/' + $filter('intervalDate')(endTime),
            where: {}
          }
        }
      });

      $scope.wait = true;
      $scope.dataSourcesError = null;

      prDatasourceSqlService.getDataSources({}, {}, function(data) {
        $scope.dataSources = data;
        $scope.wait = false;
      }, function(errorResponse) {
        $scope.error = 'Error';
        $scope.wait = false;
        if (errorResponse.data && errorResponse.data.error) {
          $scope.dataSourcesError = errorResponse.data.error;
        }
      });
    });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.creator')

/**
 * @ngdoc controller
 * @name pr.ui.creator.controller:CreatorModalSelectLayoutController
 *
 * @description The `CreatorModalSelectLayoutController` defines the modal to select layout,
 * including 12, 6-6, 3-3-3-3, 4-8, 8-4, and 4-4-4.
 *
 * @requires pr.dashboard.directive:prDashboard
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */

.controller('CreatorModalSelectLayoutController',
    function($scope, $modalInstance, prDashboard) {
      $scope.model = {
        layouts: prDashboard.layouts,
        selected: $scope.dashboard.config.layout
      };

      /**
       * @ngdoc method
       * @name select
       * @methodOf pr.ui.creator.controller:CreatorModalSelectLayoutController
       * @description Resolve the modal with the selected a layout
       */
      $scope.select = function() {
        $modalInstance.close($scope.model.selected);
      };

    });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

// controller for all groups
angular.module('pr.ui.admin', [
  'ui.router',
  'ui.select',
  'ngSanitize',
  'pr.ui.admin.resource',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.bootstrap.modal'
])
.config(
    function($stateProvider, $urlRouterProvider) {

      $stateProvider.state('home.admin', {
        weight: 100,
        url: '/admin',
        controller: 'AdminController',
        templateUrl: 'src/ui/admin/admin.html',

        ncyBreadcrumb: {
          label: 'Admin'
        },
        data: {
          pageTitle: 'Admin'
        },
        menu: {
          name: 'Admin',
          icon: 'fa fa-user-plus',
          priority: 0
        }
      });
    })
.controller('AdminController',
    function($scope, $timeout, $q) {

      $scope.tips = {
        lists:[]
      };
      var tips = {
        lists:$scope.tips.lists,
        autoClose:true,
        duration:3000,
        dismissTip:function(item) {
          var removeIndex = this.lists.indexOf(item);
          if (removeIndex != -1) {
            this.lists.splice(removeIndex, 1);
          }
        },
        addTip:function(tipOption) {
          this.lists.length = 0;
          this.lists.push(tipOption || {});
          if (this.autoClose) {
            var _this = this;
            $timeout(function() {
              _this.dismissTip(tipOption);
            }, this.duration);
          }
        }
      };
      $scope.promiseTellViewFromManageForGridData = function(vPromise, mPromise) {
        var deferForManageGroup = $q.defer();
        mPromise.then(function(data) {
          deferForManageGroup.resolve(data);
        }, function(data) {
          deferForManageGroup.reject([]);
        });
        var deferForViewGroup = $q.defer();
        vPromise.then(function(data) {
          deferForViewGroup.resolve(data);
        }, function(data) {
          deferForViewGroup.resolve([]);
        });

        var allDefer = $q.defer();

        $q.all([deferForManageGroup.promise, deferForViewGroup.promise]).then(function(arr) {
          var mGroups = arr[0];
          var vGroups = arr[1];
          var mNameArr = [];
          angular.forEach(mGroups, function(entity) {
            mNameArr.push(entity.name);
            entity.editable = true;
          });

          var trueVGroups = [];
          angular.forEach(vGroups, function(entity) {
            if (_.indexOf(mNameArr, entity.name) == -1) {
              entity.editable = false;
              trueVGroups.push(entity);
            }
          });
          var rs = mGroups.concat(trueVGroups);
          allDefer.resolve(rs);
        }, function() {
          allDefer.reject([]);
        });
        return allDefer.promise;
      };

      $scope.notification = {
        success:function(msg) {
          tips.addTip({
            title:'Success',
            message:msg,
            type:'Success'
          });
        },
        error:function(msg) {
          tips.addTip({
            title:'Error',
            message:msg,
            type:'Error'
          });
        }
      };
    });
})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.admin')

/**
 * @ngdoc controller
 * @name pr.ui.admin.controller:DatasourceManageController
 *
 * @description The `DatasourceManageController` defines the content of the table,
 * and also enable functions like get, addDatasource, editDatasource and deleteDatasource.
 * Name validation is provided to allow letters and numbers only.
 * For view-only datasource, the edit and delete buttons are hidden according to permission control.
 *
 * @requires pr.ui.admin.resource.service:Datasources
 * @requires pr.UIOption.service:prUIOptionService
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 *
 */

.controller('DatasourceManageController',
    function($scope, $q, $timeout, prUIOptionService, Datasources, $modal) {

      $scope.datasourceRefresh = {
        loading: true
      };
      $scope.grid = $scope.grid || {};
      $scope.grid.gridOptions = prUIOptionService.getGridOptions({
        enableSorting: false,
        enableFiltering: true,
        title: 'DataSource Management',
        columnDefs: [{
          field: 'name',
          displayName: 'Datasource Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'displayName',
          displayName: 'Display Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'endpoint',
          displayName: 'Endpoint',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html',
          width: '30%'
        }, {
          field: 'type',
          displayName: 'Type',
          width: '10%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'owner',
          displayName: 'Creator',
          width: '10%',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html'
        }, {
          field: 'operation',
          enableFiltering: false,
          headerCellClass: 'text-center',
          headerTemplate: '<div class="ui-grid-top-panel" style="text-align: center">Operation</div>',
          displayName: 'Operation',
          cellTemplate: 'src/ui/admin/datasourceManage/cellTemplates/adminDatasourceOperateView.html',
          width: '10%'
        }],
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
        }
      });

      $scope.datasourceParam = {};

      var mDefer = $q.defer();
      Datasources.query({type:'manage'}, {}, function succ(data) {
        mDefer.resolve(data);
      }, function fail(data) {
        mDefer.reject([]);
      });
      var vDefer = $q.defer();
      Datasources.query({type:'view'}, {}, function succ(data) {
        vDefer.resolve(data);
      }, function fail(data) {
        vDefer.reject([]);
      });

      var allDatasourcesPromise = $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);

      allDatasourcesPromise.then(function succ(result) {
        $scope.grid.gridOptions.data.length = 0;;
        angular.forEach(result, function(d) {
          $scope.grid.gridOptions.data.push(d);
        });
      }, function fail() {
        $scope.notification.error('Load Datasources Failed');
      });
      allDatasourcesPromise.finally(function() {
        $scope.datasourceRefresh.loading = false;
      });

      $scope.deleteDatasource = function(row) {
        var deleteDataSources = [row.entity.name];
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'src/ui/admin/datasourceManage/delete/delete.html',
          controller: 'DatasourceManageDeleteController',
          backdrop: 'static',
          resolve: {
            deleteDataSources: function() {
              return deleteDataSources;
            }
          }
        });
        modalInstance.result.then(function ok(result) {
          $scope.datasourceRefresh.loading = true;
          result.promise.then(function succ(data) {
            angular.forEach([row.entity], function(data, index) {
              $scope.grid.gridOptions.data.splice($scope.grid.gridOptions.data.indexOf(data), 1);
            });
            $scope.notification.success('Delete Datasource Successfully');
          }, function fail(data) {
            $scope.notification.error('Delete Datasource Failed');
          }).finally(function() {
            $scope.datasourceRefresh.loading = false;
          });
        }, function dismiss() {

        });
      };

      $scope.addDatasource = function() {
        var modalInstance;
        modalInstance = $modal.open({
          backdrop: 'static',
          templateUrl: 'src/ui/admin/datasourceManage/add/add.html',
          controller: 'DatasourceManageAddController'
        });

        modalInstance.result.then(function ok(result) {
          $scope.datasourceRefresh.loading = true;
          result.promise.then(function succ(data) {
            data.editable = true;
            $scope.grid.gridOptions.data.unshift(data);
            $scope.notification.success('Add Datasource Successfully');
          }, function fail(data) {
            $scope.notification.error((data && data.error) || 'Add Datasource Failed');
          }).finally(function() {
            $scope.datasourceRefresh.loading = false;
          });
        }, function cancel(data) {
        });

      };

      $scope.editDatasource = function editDatasource(row) {
        var modalInstance;
        modalInstance = $modal.open({
          backdrop: 'static',
          templateUrl: 'src/ui/admin/datasourceManage/edit/edit.html',
          controller: 'DatasourceManageEditController',
          resolve: {
            datasource: function() {
              return row;
            }
          }
        });
        modalInstance.result.then(function ok(result) {
          $scope.datasourceRefresh.loading = true;
          result.promise.then(function succ(newRow) {
            row.displayName = newRow.displayName;
            row.endpoint = newRow.endpoint;
            $scope.notification.success('Update Datasource Successfully');
          }, function fail(data) {
            $scope.notification.error('Update Datasource Failed');
          }).finally(function() {
            $scope.datasourceRefresh.loading = false;
          });
        }, function cancel(data) {
        });
      };

    });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc controller
 *
 * @name pr.ui.admin.controller:DatasourceManageAddController
 *
 * @description
 * The `DatasourceManageAddController` is to add a new datasouce by input datasource display name and endpoint.
 * Display name is unique, letters and numbers only.
 *
 * @requires pr.ui.admin.resource.service:Datasources
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */

// controller for all groups
angular.module('pr.ui.admin')
.controller('DatasourceManageAddController',
    function($scope, $modalInstance, Datasources, $q) {
      $scope.datasourceParam = {};

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
      $scope.save = function() {
        var datasource = {
          displayName: $scope.datasourceParam.displayName,
          type: 'druid',
          endpoint: $scope.datasourceParam.endpoint
        };
        var defer = $q.defer();
        Datasources.add({}, datasource, function succ(result) {
          defer.resolve(result);
        }, function fail(data) {
          defer.reject(data.data);
        });
        $modalInstance.close($q.resolve({
          promise: defer.promise
        }));
      };
    });
})();
/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc controller

 * @name pr.ui.admin.controller:DatasourceManageDeleteController

 * @description
 * The `DatasourceManageDeleteController` is to delete the datasouce.
 *
 * @requires pr.ui.admin.resource.service:Datasources *
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */

// controller for all groups
angular.module('pr.ui.admin')

.controller('DatasourceManageDeleteController',
    function($scope, $modalInstance, $q, Datasources, deleteDataSources) {
      $scope.delete = function() {
        var defer = $q.defer();
        Datasources.remove({names: deleteDataSources}, {}, function(data) {
          defer.resolve(data);
        }, function(data) {
          defer.reject(data);
        });
        $modalInstance.close($q.resolve({
          promise: defer.promise
        }));
      };
    });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc controller
 *
 * @name pr.ui.admin.controller:DatasourceManageEditController
 *
 * @description
 * The `DatasourceManageEditController` is to update the name and endpoint of datasouce.
 *
 * @requires pr.ui.admin.resource.service:Datasources
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */

// controller for all groups
angular.module('pr.ui.admin')
.controller('DatasourceManageEditController',
    function($scope, $modalInstance, Datasources, datasource, $q) {
      $scope.datasourceParam = angular.copy(datasource);
      $scope.cancel = function() {
        $modalInstance.dismiss();
      };
      $scope.ok = function() {
        var dataParam = {
          name: $scope.datasourceParam.name,
          displayName: $scope.datasourceParam.displayName,
          type: $scope.datasourceParam.type,
          endpoint: $scope.datasourceParam.endpoint
        };

        var defer = $q.defer();
        var result = defer.promise;
        Datasources.update(dataParam, function succ(result) {
          defer.resolve(dataParam);
          return result;
        }, function fail() {
          defer.reject({});
        });
        $modalInstance.close($q.resolve({
          promise: result
        }));
      };
    });
})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';
angular.module('pr.ui.admin')
/**
 * @ngdoc controller

 * @name pr.ui.admin.controller:GroupManageController

 * @description
 * The `GroupManageController` is used to control admin page group management table.
 * For Wire all features workable, only need to provide below dependencies which will be injected into this controller.
 * Specifically to say, users only need to provide valid api service as clarified in related API Call Service, and load related module,
 * then admin module's features can be set up rightly.

 * @requires pr.ui.admin.service:GroupSearchService
 * @requires pr.UIOption.service:prUIOptionService
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * @requires pr.ui.admin.resource.service:Groups API service used to interact with backend to get the user's groups
 * @requires pr.ui.admin.resource.service:GroupUsers API service used to interact with backend to get the group's users
 * @requires pr.ui.admin.resource.service:GroupRights API service used to interact with backend to get the group's rights
 * @requires pr.ui.admin.resource.service:Datasources API service used to interact with backend to get the user's rights on datasource
 * @requires pr.ui.admin.resource.service:SysRights API service used to interact with backend to get the user's system rights
 * @requires pr.dashboard.prDashboardResource API service used to interact with backend to get the user's rights on prDashboardResource
 */
.controller('GroupManageController',
    function GroupManageController($scope, $q, $timeout, GroupSearchService, GroupRightsTransform, prUIOptionService, $modal, Groups, GroupUsers, GroupRights, Datasources, SysRights, prDashboardResource) {

      $scope.groupsRefresh = {
        loading: true
      };

      $scope.groupGrid = prUIOptionService.getGridOptions({
        enableRowSelection: false,
        enableSorting: false,
        enableFiltering: true,
        multiSelect: false,
        title: 'DataSource Management',
        columnDefs: [{
          field: 'name',
          displayName: 'Group Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupNameView.html'
        }, {
          field: 'displayName',
          displayName: 'Display Name',
          width: '20%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupDisplayNameView.html'
        }, {
          field: 'users',
          filter:{
            condition: GroupSearchService.USERS_CONTAINS
          },
          displayName: 'Users',
          width: '40%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupUsersView.html'
        }, {
          field: 'owner',
          displayName: 'Creator',
          width: '10%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupCreatorView.html'
        }, {
          field: 'operation',
          enableFiltering: false,
          displayName: 'Operation',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupOperateView.html',
          width: '10%'
        }],
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
        }
      });

      //Initialization
      $scope.groups = {};
      $scope.groupsControllers = {};

      var groupPathParam = {type:'manage'};
      var groupDataParam = {};
      var mDefer = $q.defer();
      Groups.query(groupPathParam, groupDataParam, function succ(responseGroups) {
        mDefer.resolve(responseGroups);
      }, function fail(responseGroups) {
        mDefer.reject([]);
      });
      var vDefer = $q.defer();
      Groups.query({type:'view'}, {}, function succ(responseGroups) {
        vDefer.resolve(responseGroups);
      }, function fail(responseGroups) {
        vDefer.reject([]);
      });

      var allGroupsPromise = $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);
      allGroupsPromise.then(function succ(responseGroups) {

        //make indices for each group
        angular.forEach(responseGroups, function(group) {
          $scope.groups[group.name] = {
            name: group.name,
            displayName: group.displayName,
            users: [],
            owner: group.owner,
            editable:group.editable

          };
        });

        registerGroupsUIControllersAndBelongData($scope.groups);

        //assemble data for groups' grid
        angular.forEach($scope.groups, function(group, groupname) {
          $scope.groupGrid.data.push(group);
        });
      }, function fail() {

        //TODO
        $scope.notification.error('Load Groups Failed');
      });
      allGroupsPromise.finally(function() {
        $scope.groupsRefresh.loading = false;
      });

      $scope.editRow = function editRow(groupname) {
        $scope.groupsRefresh.loading = true;
        var modalInstance = $modal.open({
          scope: $scope,
          templateUrl: 'src/ui/admin/groupManage/update/edit.html',
          controller: 'GroupEditDialogController',
          size:'lg',
          backdrop: 'static',
          resolve: {
            groupname: function() {
              return groupname;
            },
            groupdisplayname:function() {
              return $scope.groups[groupname].displayName;
            },
            groupUsers: function() {
              return angular.copy($scope.groups[groupname].users);
            },
            userRightsOfdatasources: function ownerDataSources() {
              var vDefer = $q.defer();
              Datasources.query({type:'view'}, {}, function(owningDataSources) {
                vDefer.resolve(owningDataSources);
              }, function(owningDataSources) {
                vDefer.reject([]);
              });

              var mDefer = $q.defer();
              Datasources.query({type:'manage'}, {}, function(owningDataSources) {
                mDefer.resolve(owningDataSources);
              }, function(owningDataSources) {
                mDefer.resolve([]);
              });

              return $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);
            },
            userRightsOfdashboards: function ownerDashboards() {
              var vDefer = $q.defer();
              prDashboardResource.query({right:'view'}, {}, function(owningDashboards) {
                vDefer.resolve(owningDashboards);
              }, function(owningDashboards) {
                vDefer.reject([]);
              });

              var mDefer = $q.defer();
              prDashboardResource.query({right:'manage'}, {}, function(owningDashboards) {
                mDefer.resolve(owningDashboards);
              }, function(owningDashboards) {
                mDefer.reject([]);
              });

              return $scope.promiseTellViewFromManageForGridData(vDefer.promise, mDefer.promise);
            },
            userRightsOfsystem:function() {
              var defer = $q.defer();
              SysRights.query({}, {}, function(data) {
                defer.resolve(data);
              }, function(data) {
                defer.reject(data);
              });
              return defer.promise;
            },
            userRightsOfgroups:function() {
              var rights = [];
              angular.forEach($scope.groups, function(group, groupname) {
                var copy = angular.copy(group);
                rights.push(copy);
              });
              return rights;
            },
            groupRights: function() {
              var result = groupRightsPromise(groupname, $scope.groups[groupname]);
              return result;
            }
          }
        });
        modalInstance.opened.then(function succ() {

        }, function fail() {

          //TODO notification
          $scope.notification.error('Get User Latest Rights Failed');
        }).finally(function() {
          $scope.groupsRefresh.loading = false;
        });
        modalInstance.result.then(function close(result) {
          var groupdisplaynamePromise = result.groupdisplaynameChanged;
          if (groupdisplaynamePromise) {
            $scope.groupsControllers[groupname].displayNameInLoading = true;

            groupdisplaynamePromise.promise.then(function succ(updatedGroup) {
              $scope.groups[groupname].displayName = updatedGroup.displayName;

              //TODO notification
              $scope.notification.success('Update Group Name Successfully');
            }, function fail(updatedGroup) {

              //TODO notification
              $scope.notification.error('Update Group Name Failed');
            }).finally(function() {
              $scope.groupsControllers[groupname].displayNameInLoading = false;
            });
          }

          var usersPromise = result.usersChanged;
          if (usersPromise) {
            $scope.groupsControllers[groupname].usersInLoading = true;

            usersPromise.promise.then(function succ(newUsers) {
              //clear
              $scope.groups[groupname].users.length = 0;
              angular.forEach(newUsers, function(user) {
                $scope.groups[groupname].users.push(user);
              });

              //TODO notification
              $scope.notification.success('Update Users Successfully');
            }, function fail(data) {

              //TODO notification
              $scope.notification.error('Update Users Failed');

            }).finally(function() {
              $scope.groupsControllers[groupname].usersInLoading = false;
            });
          }

          var rightsPromise = result.rightsChanged;
          if (rightsPromise) {
            $scope.groupsControllers[groupname].rightsInLoading = true;

            rightsPromise.promise.then(function succ(newRights) {

              //TODO notification
              $scope.notification.success('Update Rights Successfully');
            }, function fail(data) {

              //TODO notification
              $scope.notification.error('Update Rights Failed');
            });
          }

        }, function dismiss() {

        });
      };

      $scope.prepareRemoveRow = function(groupName) {
        var modalInstance = $modal.open({
          backdrop: 'static',
          templateUrl: 'src/ui/admin/groupManage/delete/removeDialogTemplate.html',
          controller: 'GroupDeleteDialogController',
          size: 'md'
        });

        modalInstance.result.then(function ok() {
          $scope.removeGroup(groupName);
        }, function dismiss(info) {
        });

      };

      $scope.removeGroup = function(groupName) {
        var groupPathParam = {groupName: groupName};
        var groupDataParam = {};

        $scope.groupsRefresh.loading = true;

        Groups.remove(groupPathParam, groupDataParam, function(group) {

          //TODO message notification for success
          $scope.notification.success('Delete Group Successfully');

          var index = $scope.groupGrid.data.indexOf($scope.groups[groupName]);
          $scope.groupGrid.data.splice(index, 1);
          delete $scope.groups[groupName];
          delete $scope.groupsControllers[groupName];
        }, function(group) {

          //TODO message notification for fail
          $scope.notification.error('Delete Group Failed');

        }).$promise.finally(function() {
            $scope.groupsRefresh.loading = false;
          });
      };
      $scope.addOperation = {};

      $scope.addNewGroup = function() {

        var groupPathParam = {};
        var groupDataParam = {displayName: $scope.addOperation.newGroupName};
        if ($scope.addOperation.newGroupName) {
          $scope.groupsRefresh.loading = true;
          Groups.add(groupPathParam, groupDataParam, function(group) {
            group.users = [];
            group.datasources = [];
            group.dashboards = [];
            group.managedGroups = [];
            group.editable = true;
            $scope.groups[group.name] = group;
            $scope.groupGrid.data.unshift(group);

            $scope.groupsControllers[group.name] = {
              usersInLoading: false,
              rightsInLoading: false,
              displayNameInLoading:false
            };

            //clear input content after adding successfully
            $scope.addOperation.newGroupName = '';

            //TODO
            $scope.notification.success('Add Group Successfully');
          }, function(response) {
            var data = response.data;

            //TODO
            $scope.notification.error((data && data.error) || 'Add Group Failed');
          }).$promise.finally(function() {
              $scope.groupsRefresh.loading = false;
            });
        }

      };

      function registerGroupsUIControllersAndBelongData(groups) {
        angular.forEach(groups, function(group, groupname) {
          //for ui control
          $scope.groupsControllers[groupname] = {
            displayNameInLoading:false,
            usersInLoading: true
          };

          //update group users asynchronously
          groupUsersPromise(groupname, group).finally(function() {
            $scope.groupsControllers[groupname].usersInLoading = false;
          });

        });
      }

      function groupUsersPromise(groupName, group) {
        var groupUsersPathParam = {groupName: groupName};
        var groupUsersDataParam = {};
        var _defer = $q.defer();
        GroupUsers.query(groupUsersPathParam, groupUsersDataParam, function(groupUsers) {

          //update
          angular.forEach(groupUsers, function(val) {
            group.users.push(val);
          });
          _defer.resolve(groupUsers);
        }, function(response) {
          _defer.reject([]);
        });
        return _defer.promise;
      }

      function groupRightsPromise(groupName, group) {
        var groupRightsPathParam = {groupName: groupName};
        var groupRightsDataParam = {};
        var defer = $q.defer();
        GroupRights.query(groupRightsPathParam, groupRightsDataParam, function(groupRights) {
          var rightsSet = GroupRightsTransform.transform(groupRights);
          defer.resolve(rightsSet);
        }, function(groupRights) {
          defer.reject([]);
        });
        return defer.promise;
      }
    });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';
angular.module('pr.ui.admin')
/**
 * @ngdoc service

 * @name pr.ui.admin.service:GroupSearchService

 * @description
 * The `GroupSearch` service is used to get self-defined suitable fitlers which can filter a group's users and so on.

 * @requires lodash
 */
.factory('GroupSearchService', function() {
  var uiGridFilters = {
    /**
      * @ngdoc method
      * @name USERS_CONTAINS
      * @methodOf pr.ui.admin.service:GroupSearchService
      * @param {string} term 'user2'
      * @param {string} cellVal 'user1,user2...'
      * @returns {boolean} the boolean result which indicates if the cell value, namingly group's users, contrains the input term
      */
    USERS_CONTAINS:function(term, cellVal) {
      return _.findIndex(cellVal, function(username) {
        return _.contains(username, term);
      }) > -1;
    }
  };
  return uiGridFilters;
})

/**
 * @ngdoc service

 * @name pr.ui.admin.service:GroupRightsTransform

 * @description
 * The `GroupRightsTransform` service is used to transform group's rights to adapt to use properly.

 * @requires lodash
 */
.service('GroupRightsTransform', function() {
  /**
    * @ngdoc method
    * @name transform
    * @methodOf pr.ui.admin.service:GroupRightsTransform
    * @param {array} groupRights array of original format
    * @returns {array} array of programmatic-nneded format
    */
  this.transform = function(groupRights) {

    //transform
    var newGroupRights = [];
    var _MANAGE = '_MANAGE';
    var _VIEW = '_VIEW';
    angular.forEach(groupRights, function(rawGroup) {
      var rightName = null;
      var rightNameSuffix = null;
      if (_.endsWith(rawGroup.rightName, _MANAGE)) {
        rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _MANAGE.length);
        rightNameSuffix = _MANAGE;
      } else if (_.endsWith(rawGroup.rightName, _VIEW)) {
        rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _VIEW.length);
        rightNameSuffix = _VIEW;
      } else {
        rightName = rawGroup.rightName;
        rightNameSuffix = '';
      }
      rawGroup.rightName = rightName;
      rawGroup.rightType = rawGroup.rightType + '';
      rawGroup.rightNameSuffix = rightNameSuffix;
      newGroupRights.push(rawGroup);
    });

    //assemble
    var rightsSet = [];
    angular.forEach(newGroupRights, function(right) {
      rightsSet.push(right);
    });
    return rightsSet;
  };
});

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';
angular.module('pr.ui.admin')
/**
 * @ngdoc controller

 * @name pr.ui.admin.controller:GroupEditDialogController

 * @description
 * The `GroupEditDialogController` is responsible to control


 * @requires pr.UIOption.service:prUIOptionService
 * @requires groupname Group's name passed from the place where dialog is opened
 * @requires groupUsers To be updated group's users
 * @requires groupRights To be updated group's rights(inlcuding datasource and dashboard)
 * @requires userRightsOfdatasources Retrieved user's rights about datasource
 * @requires userRightsOfdashboards Retrieved user's rights about dashboards
 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 * @requires pr.ui.admin.resource.service:GroupUsers API service used to interact with backend to update the group's users
 * @requires pr.ui.admin.resource.service:GroupRights API service used to interact with backend to update the group's rihgts
 */
.controller('GroupEditDialogController',
    function($scope, $timeout, $q, prUIOptionService, uiGridConstants, $modalInstance, groupname, groupdisplayname, groupUsers, groupRights, userRightsOfgroups, userRightsOfdatasources, userRightsOfdashboards, userRightsOfsystem, Groups, GroupUsers, GroupRights) {

      var oldgroupdisplayname = groupdisplayname;
      $scope.groupdisplayname = groupdisplayname;

      var allRights = [];
      angular.forEach(userRightsOfdatasources, function(right) {
        allRights.push({
          rightName: right.name,
          displayName:right.displayName,
          owner:right.owner,
          rightType: '1',
          editable:right.editable,
          _MANAGE:false,
          _VIEW:false
        });
      });
      angular.forEach(userRightsOfdashboards, function(right) {
        allRights.push({
          rightName: right.name,
          displayName:right.displayName,
          owner:right.owner,
          rightType: '2',
          editable:right.editable,
          _MANAGE:false,
          _VIEW:false
        });
      });
      angular.forEach(userRightsOfgroups, function(right) {
        allRights.push({
          rightName: right.name,
          displayName:right.displayName,
          owner:right.owner,
          rightType: '4',
          editable:right.editable,
          _MANAGE:false,
          _VIEW:false
        });
      });
      angular.forEach(userRightsOfsystem, function(sysrightName) {
        allRights.push({
          rightName: sysrightName,
          displayName:sysrightName,
          rightType: '0',
          checked:false
        });
      });

      $scope.users = {
        new: angular.copy(groupUsers),
        old: angular.copy(groupUsers)
      };

      $scope.selectedStatus = 'All';

      $scope.singleFilter = function(selectedVal) {
        $scope.selectedStatus = selectedVal;
        $scope.gridApi.grid.refresh();
      };

      $scope.refilteringGridData = function(renderableRows) {

        //filter single filter to judge if the row is selected or not, if selected visible, otherwise invisible
        if ($scope.selectedStatus == 'All') {
          return renderableRows;
        } else {
          angular.forEach(renderableRows, function(row) {
            //TODO rewrite isSelected method
            if (isSelected(row)) {

            } else {
              row.visible = false;
            }
          });
        }

        //filter cell condition

        return renderableRows;
      };
      function isSelected(row) {
        var entity = row.entity;
        if (entity.rightType == '0') {
          return entity.checked;
        } else {
          return entity._VIEW || entity._MANAGE;
        }
      }

      $scope.dialogGrid = prUIOptionService.getGridOptions({
        enableRowSelection: true,
        enableFiltering: true,
        enableSorting: false,
        multiSelect: true,
        columnDefs: [{
          field: 'rightType',
          width: '15%',
          displayName: 'Type',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightTypeView.html',
          filter: {
          priority: 200,
          type: uiGridConstants.filter.SELECT,

          selectOptions: [{
            value: '0',
            label: 'System'
          }, {
            value: '1',
            label: 'Datasource'
          }, {
            value: '2',
            label: 'Dashboard'
          }, {
            value:'4',
            label: 'Group'
          }]
        }
        }, {
          field: 'rightName',
          displayName: 'Name',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameView.html',
          filter: {
            priority: 200,
            type: uiGridConstants.filter.CONTAINS
          }
        }, {
          field: 'displayName',
          displayName: 'Display Name',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightDisplayNameView.html',
          filter: {
            priority: 200,
            type: uiGridConstants.filter.CONTAINS
          }
        }, {
          field: 'owner',
          displayName: 'Creator',
          width: '10%',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupCreatorView.html'
        }, {
          field: 'rightNameSuffix',
          displayName: 'Permissions',
          enableFiltering: false,
          width: '12%',
          headerCellClass: 'text-center',
          cellTemplate: 'src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameSuffixView.html'
        }],
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.grid.registerRowsProcessor($scope.refilteringGridData, 700);
        },
        data: allRights
      });

      var oldRightNames = [];
      angular.forEach(groupRights, function(groupRight) {
        oldRightNames.push(groupRight.rightType + groupRight.rightName + groupRight.rightNameSuffix);
      });

      $timeout(function() {
        markSelectedRows(groupRights, $scope.gridApi.grid.rows);
      });

      function markSelectedRows(selectedRights, allRights) {
        var checkerHelper = {};
        angular.forEach(selectedRights, function(right) {
          if (right.rightType == '0') {
            //System rights
            checkerHelper[right.rightName + right.rightType] = {
              checked:true
            };
          } else {
            //NON System rights
            var defaultValue = {
              _VIEW:false,
              _MANAGE:false
            };
            var rightsSet = checkerHelper[right.rightName + right.rightType] = checkerHelper[right.rightName + right.rightType] || defaultValue;
            if (right.rightNameSuffix == '_MANAGE') {
              rightsSet._MANAGE = true;
            } else {
              rightsSet._VIEW = true;
            }
          }

        });
        angular.forEach(allRights, function(row) {
          var right = row.entity;
          var typedRightObj = checkerHelper[right.rightName + right.rightType];

          //no need to process those unselected rows for users' rights
          if (typedRightObj) {
            if (right.rightType == '0') {

              //system rights
              right.checked = true;
            } else {

              //non system rights
              right._VIEW = typedRightObj._VIEW;
              right._MANAGE = typedRightObj._MANAGE;
            }
          }
        });
      }
      function stringArrayEqual(a1, a2) {
        if (a1.length != a2.length) {
          return false;
        } else {
          var flag = true;
          angular.forEach(a1, function(item) {
            if (a2.indexOf(item) == -1) {
              flag = false;
            }
          });
          return flag;
        }
      }
      function getSelectedRights() {
        var arr = [];
        angular.forEach($scope.dialogGrid.data, function(datum) {
          if (datum.rightType == '0') {
            if (datum.checked) {
              arr.push({
                rightName:datum.rightName,
                rightType:datum.rightType,
                rightNameSuffix:''
              });
            }
          } else {
            if (datum._MANAGE) {
              arr.push({
                rightName:datum.rightName,
                rightType:datum.rightType,
                rightNameSuffix:'_MANAGE'
              });
            }
            if (datum._VIEW) {
              arr.push({
                rightName:datum.rightName,
                rightType:datum.rightType,
                rightNameSuffix:'_VIEW'
              });
            }
          }
        });
        return arr;
      }

      $scope.ok = function ok() {

        var newRightNames = [];
        var currentRights = getSelectedRights();
        angular.forEach(currentRights, function(row) {
          newRightNames.push(row.rightType + row.rightName + row.rightNameSuffix);
        });

        var finalResult = {
          usersChanged: undefined,
          rightsChanged: undefined,
          groupdisplaynameChanged:undefined
        };

        if (oldgroupdisplayname != $scope.groupdisplayname) {
          var groupdisplaynameDefer = $q.defer();
          Groups.update({}, {name:groupname, displayName:$scope.groupdisplayname}, function succ(result) {
            groupdisplaynameDefer.resolve({name:groupname, displayName:$scope.groupdisplayname});
          }, function fail(result) {
            groupdisplaynameDefer.reject(result);
          });
          finalResult.groupdisplaynameChanged = {
            promise: groupdisplaynameDefer.promise
          };
        }

        if (_.difference($scope.users.old, $scope.users.new)) {
          var groupUsersPathParam = {groupName: groupname};
          var groupUsersDataParam = $scope.users.new;
          var usersUpdateDefer = $q.defer();
          var usersPromise = GroupUsers.replaceAll(groupUsersPathParam, groupUsersDataParam, function(newUsers) {
            usersUpdateDefer.resolve(newUsers);
          }, function(data) {
            usersUpdateDefer.reject(data);
          }).$promise;
          finalResult.usersChanged = {
            promise: usersUpdateDefer.promise
          };
        }

        if (!stringArrayEqual(newRightNames, oldRightNames)) {
          var groupRightsPathParam = {groupName: groupname};
          var groupRightsDataParam = [];
          angular.forEach(getSelectedRights(), function(gridRow) {
            groupRightsDataParam.push({
              rightName: gridRow.rightName + gridRow.rightNameSuffix,
              rightType: gridRow.rightType
            });
          });
          var rightsUpdateDefer = $q.defer();
          GroupRights.replaceAll(groupRightsPathParam, groupRightsDataParam, function(responseGroupRights) {
            var newGroupRights = [];
            var _MANAGE = '_MANAGE';
            var _VIEW = '_VIEW';
            angular.forEach(responseGroupRights, function(rawGroup) {
              var rightName = null;
              var rightNameSuffix = null;
              if (_.endsWith(rawGroup.rightName, _MANAGE)) {
                rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _MANAGE.length);
                rightNameSuffix = _MANAGE;
              } else if (_.endsWith(rawGroup.rightName, _VIEW)) {
                rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _VIEW.length);
                rightNameSuffix = _VIEW;
              }
              rawGroup.rightName = rightName;
              rawGroup.rightNameSuffix = rightNameSuffix;
              newGroupRights.push(rawGroup);
            });
            rightsUpdateDefer.resolve(newGroupRights);
          }, function(data) {
            rightsUpdateDefer.reject(data);
          });

          finalResult.rightsChanged = {
            promise: rightsUpdateDefer.promise
          };
        }

        $modalInstance.close($q.resolve(finalResult));
      };

      $scope.cancel = function() {
        $modalInstance.dismiss();
      };
    });

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';
angular.module('pr.ui.admin')
/**
 * @ngdoc controller

 * @name pr.ui.admin.controller:GroupDeleteDialogController

 * @description
 * The `GroupDeleteDialogController` is used to confirm user's willing to delete selected group.

 * @requires ui.bootstrap.modal.service:$modal https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
 * Its open method invoked returned result `$modalInstance` will be injected into this controller.
 */
.controller('GroupDeleteDialogController',
    function($scope, $modalInstance, $q) {
      $scope.close = function() {
        $modalInstance.dismiss('close');
      };
      $scope.confirm = function(info) {
        $modalInstance.close($q.resolve({}));
      };
    });
})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.admin.resource', [
    'ngResource',
    'pr.api'
])

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:Groups
 * @description
 * The `Groups` service is used to talk to backend, dedicated to get all groups which are managable for the user,
 * add a mew group and remove a group.
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('Groups',
    function($resource, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:Groups
       * @description Obtains data as an array of objects. Response:
       * ```js
       *     [{
       *       name: 'foo',
       *       displayname: 'Foo',
       *       owner: 'admin'
       *     }, {
       *       ...
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method: 'GET',
        isArray: true,
        withCredentials: true,
        url:prApi.url + '/groups?right=:type'
      };
      /**
       * @ngdoc method
       * @name add
       * @methodOf pr.ui.admin.resource.service:Groups
       * @description Add a new group. Response:
       * ```js
       *     {
       *        name:'foo',
       *        displayName: 'Foo',
       *        owner:'admin'
       *     }
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {displayName: 'Foo'}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var add = {
        method: 'POST',
        isArray: false,
        withCredentials: true
      };
      /**
       * @ngdoc method
       * @name remove
       * @methodOf pr.ui.admin.resource.service:Groups
       * @description Remove a group. Response:
       * ```js
       *     {
       *        deleted:number
       *     }
       * ```
       * @param {object} pathParam {groupName: 'groupName'}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var remove = {
        method: 'DELETE',
        isArray: false,
        withCredentials: true
      };
      var update = {
        method: 'PUT',
        isArray: false,
        withCredentials: true
      };
      var options = {
        query: query,
        add: add,
        remove: remove,
        update:update
      };
      return $resource(prApi.url + '/groups/:groupName', nullParamDefaults, options);
    })

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:GroupUsers
 * @description
 * The `GroupUsers` service is used to talk to backend, dedicated to get all users belonging to the specified group,
 * replace all users with new users.
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('GroupUsers',
    function($resource, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:GroupUsers
       * @description Get a group's belonging users. Response:
       * ```js
       *     ['username1', 'username2', ...]
       * ```
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method:'GET',
        isArray: true,
        withCredentials: true,
        cache: false
      };
      /**
       * @ngdoc method
       * @name replaceAll
       * @methodOf pr.ui.admin.resource.service:GroupUsers
       * @description ReplaceAll a group's belonging users with new users. Response:
       * ```js
       *     ['username1', 'username2', ...]
       * ```
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {array} dataParam ['username1', 'username2', ...]
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var replaceAll = {
        method: 'PUT',
        withCredentials: true,
        isArray: true
      };
      var options = {
        query:query,
        replaceAll:replaceAll
      };
      return $resource(prApi.url + '/groups/:groupName/users', nullParamDefaults, options);

    })
/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:GroupRights
 * @description
 * The `GroupRights` service is used to talk to backend, dedicated to get all rights belonging to the specified group,
 * replace all rights with new rights.
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('GroupRights',
    function($resource, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:GroupRights
       * @description Get a group's belonging rights. Response:
       * ```js
       *     [{
       *        rightName:'datasource1_VIEW',
       *        rightType:'1'
       *     },{
       *        rightName:'dashboard1_VIEW',
       *        rightType:'2'
       *     }]
       * ```
       *
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method:'GET',
        isArray: true,
        withCredentials: true
      };
      /**
       * @ngdoc method
       * @name replaceAll
       * @methodOf pr.ui.admin.resource.service:GroupRights
       * @description ReplaceAll a group's belonging rights with new rights. Response:
       * ```js
       *     [{
       *        rightName:'datasource1_VIEW',
       *        rightType:'1'
       *     },{
       *        rightName:'dashboard1_VIEW',
       *        rightType:'2'
       *     }...]
       * ```
       *
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {array} dataParam [{
       *        rightName:'datasource1_VIEW',
       *        rightType:'1'
       *     },{
       *        rightName:'dashboard1_VIEW',
       *        rightType:'2'
       *     }...]
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var replaceAll = {
        method: 'PUT',
        withCredentials: true,
        isArray: true
      };
      var options = {
        query: query,
        replaceAll: replaceAll
      };
      return $resource(prApi.url + '/groups/:groupName/rights', nullParamDefaults, options);
    })

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:Datasources
 * @description
 * The `Datasources` service is used to talk to backend, dedicated to get, add, update, remove and batchRemove datasouces.
 *
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('Datasources',
    function($resource, $http, prApi) {
      var nullParamDefaults = {};

      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Load all datasources. Response:
       * ```js
       *    [{
       *      displayName: "trackingdruid"
       *      endpoint: "http://druid.broker.vip.lvs.ebay.com/druid/v2"
       *      name: "trackingdruid"
       *      owner: null
       *      readonly: true
       *      type: "druid"
       *    },{
       *     ...
       *    }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var query = {
        method: 'GET',
        isArray: true,
        withCredentials: true,
        url: prApi.url + '/datasources?right=:type'

      };

      /**
       * @ngdoc method
       * @name add
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Add a new datasouce. Response:
       * ```js
       *     [{
       *       displayName: "datasource01"
       *       endpoint: "http://xxx"
       *       name: "datasource01"
       *       owner: null
       *       readonly: true
       *       type: "druid"
       *     },{
       *     ...
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {"displayName":"datasource01", "type":"druid","endpoint":"http://xxx"}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var add = {
        method: 'POST',
        isArray: false,
        withCredentials: true
      };

      /**
       * @ngdoc method
       * @name update
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Update a datasource. Response:
       * ```js
       *     [{
       *       displayName: "datasourceNewName"
       *       endpoint: "http://xxx"
       *       name: "datasource01"
       *       owner: null
       *       readonly: true
       *       type: "druid"
       *     },{
       *     ...
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {"name":"datasource01", "displayName":"datasourceNewName","endpoint":"http://xxx"}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var update = {
        method: 'PUT',
        isArray: false,
        withCredentials: true
      };

      /**
       * @ngdoc method
       * @name remove
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Remove a datasource. Response:
       * ```js
       *     [{
       *      "deleted":number
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var remove = {
        method: 'DELETE',
        isArray: false,
        withCredentials: true,
        url: prApi.url + '/datasources/:names'
      };
      var options = {
        query: query,
        add: add,
        remove: remove,
        update: update
      };
      return $resource(prApi.url + '/datasources', nullParamDefaults, options);
    })

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:SysRights
 * @description
 * The `SysRights` service is used to talk to backend, dedicated to get user's system rights.
 *
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('SysRights',
    function($resource, $http, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:SysRights
       * @description Batch remove the selected datasources. Response:
       * ```js
       *     ['sysrightName1','sysrightName2'...]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method: 'GET',
        isArray: true,
        withCredentials: true
      };
      var options = {
        query: query
      };
      return $resource(prApi.url + '/sysrights', nullParamDefaults, options);
    });
})();
