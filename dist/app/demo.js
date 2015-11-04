/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.demo', [
  'angular-loading-bar',
  'ngAnimate',

  'ui.router',
  'pr.demo.realtime',
  'pr.demo.traffic'
])

.config(
    function($stateProvider) {
      $stateProvider.state('home.demo', {
        abstract: true,

        template: '<div ui-view></div>',

        url: '/demo',

        ncyBreadcrumb: {
          label: 'Demo'
        },
        data: {
          pageTitle: 'Demo'
        },
        menu: {
          name: 'Demo',
          icon: 'fa fa-dot-circle-o',
          tag: 'sidebar',
          priority: 100
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

angular.module('pr.demo.realtime', [
  'ui.router',

  'ui.grid',
  'ui.grid.selection',
  'ui.grid.pagination',
  'ui.grid.autoResize',
  'pr.gridextensions',

  'pr.api',

  'pr.UIOption',
  'pr.dashboard.widgets.metric',
  'pr.dashboard.widgets.timeline',
  'pr.dashboard.widgets.grid',
  'pr.dashboard.widgets.pie',

  'pr.datasource.sql'
])
.config(
    function($stateProvider) {
      $stateProvider.state('home.demo.realtime', {

        url: '/realtime?trafficsource&osfamily&devicefamily&country',

        views: {
          '': {
            templateUrl: 'src/demo/realtime/realtime.html',
            controller: 'RealtimeController'
          },
          'filters@home.demo.realtime': {
            templateUrl: 'src/demo/realtime/realtimeFilters.html',
            controller: 'RealtimeFiltersController'
          },
          'metric@home.demo.realtime': {
            templateUrl: 'src/demo/realtime/realtimeMetric.html',
            controller: 'RealtimeMetricController'
          },
          'trend@home.demo.realtime': {
            templateUrl: 'src/demo/realtime/realtimeTrend.html',
            controller: 'RealtimeTrendController'
          },
          'grid@home.demo.realtime': {
            templateUrl: 'src/demo/realtime/realtimeGrid.html',
            controller: 'RealtimeGridController'
          },
          'info-box@home.demo.realtime': {
            templateUrl: 'src/demo/realtime/realtimeInfoBox.html',
            controller: 'RealtimeInfoBoxController'
          },
          'ratio@home.demo.realtime': {
            templateUrl: 'src/demo/realtime/realtimeRatio.html',
            controller: 'RealtimeRatioController'
          },
          'distribution@home.demo.realtime': {
            templateUrl: 'src/demo/realtime/realtimeDistribution.html',
            controller: 'RealtimeDistributionController'
          }
        },

        ncyBreadcrumb: {
          label: 'Realtime'
        },
        data: {
          pageTitle: 'Realtime'
        },
        menu: {
          name: 'Realtime',
          icon: 'fa fa-dashboard',
          tag: 'sidebar',
          priority: 100
        }
      });
    })
.controller('RealtimeController',
    function($state, $stateParams, $scope, $interval, $window, prApi, $filter) {

      // --
      // -- AUTO REFRESH OF REALTIME DATA
      // --

      /**
       * Init all intervals for refresh
       * @type {Object}
       */
      $scope.refresh = {
        active: false,
        restartOnFocus: false,
        intervals: [],

        // a store for the intervals
        rates: {
          // 10 seconds
          realtime: 10,

          // 60 seconds
          fast: 60,

          // 5 minutes
          medium: 5 * 60,

          // 15 minutes
          slow: 15 * 60

        }
      };

      /**
       * Starts or stops a the intervals for auto-refresh
       * @param {boolean} refresh whether to stop or start auto-refresh
       * @param force
       */
      $scope.setRefresh = function(refresh, force) {
        if (refresh) {
          angular.forEach($scope.refresh.rates, function(rateSeconds, rate) {
            if (force) {
              $scope.$broadcast('refresh-' + rate);
            }

            var interval = $interval(function() {
              $scope.$broadcast('refresh-' + rate);
            }, rateSeconds * 1000);

            $scope.refresh.intervals.push(interval);
            $scope.refresh.active = true;
          });
        } else {
          while ($scope.refresh.intervals.length > 0) {
            $interval.cancel($scope.refresh.intervals.pop());
          }

          $scope.refresh.active = false;
        }
      };

      // Start the refresh
      $scope.setRefresh(true);

      // Stop the refresh temporarily when the user is not on this window
      angular.element($window)
        .bind('blur.realtimeRefresh', function() {
          if ($scope.refresh.active) {
            $scope.setRefresh(false);
            $scope.refresh.restartOnFocus = true;
          }
        })
        .bind('focus.realtimeRefresh', function() {
          if ($scope.refresh.restartOnFocus) {
            $scope.setRefresh(true, true);
            $scope.refresh.restartOnFocus = false;
          }
        });

      // Stop refresh for good when realtime controller does not exist anymore
      $scope.$on('$destroy', function() {
        $scope.setRefresh(false);
        angular.element($window).unbind('blur.realtimeRefresh');
        angular.element($window).unbind('focus.realtimeRefresh');
      });

      // --
      // -- FILTER HANDLING FOR REALTIME QUERIES
      // --

      /**
       * Get filters for all realtime controllers and subcontrollers
       * @return {string} Filter that can be sent to the backend
       */
      $scope.getFilter = function(params) {
        var stateParams = angular.copy($stateParams);
        return angular.merge({}, stateParams, params || {});
      };

      // Defined the interval for each controller to reuse
      $scope.lastFiveMinutesIntervals = function() {
        return $filter('intervalDate')(moment().subtract(5, 'minutes'))  + '/' + $filter('intervalDate')(moment());
      };

      $scope.lastTwoDaysIntervals = function() {
        return moment().tz(prApi.timezone).subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss') + '/' + $filter('intervalDate')(moment().tz(prApi.timezone).startOf('hour'));
      };

      $scope.filters = {
        intervals: $scope.lastFiveMinutesIntervals(),
        where: $scope.getFilter()
      };

      // Update filter when refresh
      $scope.$on('refresh-realtime', function() {
        $scope.filters.intervals = $scope.lastFiveMinutesIntervals();
      });

      $scope.$watch('filters.where', function(newVal, oldVal) {
        $state.go('.', newVal);
      }, true);
    })
.controller('RealtimeFiltersController',
    function($scope, $state, $stateParams) {
      $scope.$state = $state;
      $scope.$stateParams = $stateParams;
    })
.controller('RealtimeMetricController',
    function($scope, prApi, $filter) {
      // Prepare query params to create total event metric
      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_event',
        granularity: 'all',
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'total events'
          }
        ]
      };

      // Update metric description
      $scope.options = {
        title: 'Total Events',
        description: 'In the last 5 minutes',
        subDescription: 'Retrieved at ' + moment().tz(prApi.timezone).format('h:mm A'),
        disabled: false,
        icon: 'fa fa-heartbeat'
      };

      // Refresh each 10 seconds
      $scope.$on('refresh-realtime', function() {
        $scope.options.subDescription = 'Retrieved at ' + moment().tz(prApi.timezone).format('h:mm A');
      });
    })
.controller('RealtimeTrendController',
    function($scope, prApi, $filter) {
      // Prepare query params to create trend compare chart
      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_event',
        granularity: 'hour',
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'today events'
          }
        ],
        maxResults: 100
      };

      // Set interval filter from yesterday to current
      $scope.filters = {
        intervals: $scope.lastTwoDaysIntervals(),
        where: $scope.getFilter()
      };

      $scope.options = {
        title: 'Total Events',
        disabled: false,
        isArea: true,
        chart: {
          height: 120,
          yAxis: {
            tickFormat: function(n) {
              return $filter('number')(n, 0);
            }
          }
        }
      };

      // Update the results to create yesterday and today's events chart
      $scope.transformData = function(data, param) {
        var i = moment().tz(prApi.timezone).startOf('day').subtract(1, 'days').subtract(1, 'hours');
        var timeRange = [];
        // Setup the time range
        while (moment().tz(prApi.timezone).startOf('hour').diff(i) > 0) {
          timeRange.push(i);
          i = i.add(1, 'hours').clone();
        }
        var yesterdayValues = {
          area: true,
          key: 'yesterday events',
          values: []
        };
        var todayValues = {
          area: true,
          key: 'today events',
          values: []
        };
        // Transform data to split yesterday and today, and fill 0 to empty date
        angular.forEach(timeRange, function(val, index) {
          var count = 0;
          angular.forEach(data[0].values, function(point) {
            if (val.diff(point.x) === 0) {
              count = point.y;
            }
          });
          if (index < 24) {
            yesterdayValues.values.push({
              x: val.add(1, 'days'),
              y: count
            });
          } else {
            todayValues.values.push({
              x: val,
              y: count
            });
          }
        });
        var results = [];
        results.push(yesterdayValues);
        results.push(todayValues);
        return results;
      };

      // Refresh each 15 minutes
       $scope.$on('refresh-slow', function() {
         $scope.filters.intervals = $scope.lastTwoDaysIntervals();
      });
    })
.controller('RealtimeGridController',
    function($scope, prApi) {
      // Prepare query params for traffic grid
      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_event',
        granularity: 'all',
        dimensions: [
          {
            name: 'trafficsource'
          }
        ],
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'event count'
          }
        ],
        maxResults: 100
      };

      $scope.options = {
        title: 'Traffic Source',
        disabled: false
      };
    })
.controller('RealtimeInfoBoxController',
    function($scope, prDatasourceSqlService, prApi) {
      // Prepare query params to query prDatasourceSqlService
      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_event',
        granularity: 'all',
        dimensions: [
          {
            name: 'devicefamily'
          }
        ],
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'count'
          }
        ],
        maxResults: 100,
        filters: $scope.filters
      };

      // Render the data for info-box
      $scope.loadInfoBox = function() {
        prDatasourceSqlService.getDataset({dataSourceName: $scope.params.dataSourceName}, $scope.params, function(data) {
          // Recombinate data and calculate total
          var newData = [];
          var total = 0;
          data.forEach(function(point) {
            newData[point.devicefamily] = point.count;
            total += point.count;
          });

          newData.total = total;
          $scope.deviceFamily = newData;
        });
      };

      // Add device filter to realtime page
      $scope.updateDeviceFilter = function(type) {
        $scope.filters.where.devicefamily = type;
      };

      $scope.loadInfoBox();
    })
.controller('RealtimeRatioController',
    function($scope, prApi) {
      // Prepare query params for OS ratio
      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_event',
        granularity: 'all',
        dimensions: [
          {
            name: 'osfamily'
          }
        ],
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'events'
          }
        ],
        maxResults: 10
      };

      // Slight change the look an feel for pie chart
      $scope.options = {
        title: 'OS Ratio',
        disabled: false,
        chart: {
          height: 315,
          margin: {
            top: -40,
            right: -30,
            bottom: -20,
            left: -30
          }
        }
      };
    })
.controller('RealtimeDistributionController',
    function($scope, prApi, $filter) {
      // Prepare query params for map
      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_event',
        granularity: 'all',
        dimensions: [
          {
            name: 'country'
          },
          {
            name: 'devicefamily'
          }
        ],
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'event count'
          }
        ],
        maxResults: 20
      };

      $scope.options = {
        title: 'Events Distribution',
        disabled: false,
        chart: {
          yAxis: {
            tickFormat: function(n) {
              return $filter('number')(n, 0);
            }
          }
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

angular.module('pr.demo.traffic', [
  'ui.router',
  'ui.bootstrap',

  'ui.grid',
  'ui.grid.selection',
  'ui.grid.pagination',
  'ui.grid.autoResize',
  'pr.gridextensions',

  'pr.UIOption',
  'pr.dashboard.widgets.stack',
  'pr.date',

  'pr.dynamicfilter'
])
.config(
    function($stateProvider) {
      $stateProvider.state('home.demo.traffic', {

        url: '/traffic?dynamicFilters&granularity&start&end&filterCollapse',

        views: {
          '': {
            templateUrl: 'src/demo/traffic/traffic.html',
            controller: 'TrafficController'
          },
          'filter@home.demo.traffic': {
            templateUrl: 'src/demo/traffic/trafficFilters.html',
            controller: 'TrafficFilterController'
          },
          'trend@home.demo.traffic': {
            templateUrl: 'src/demo/traffic/trafficTrend.html',
            controller: 'TrafficTrendController'
          },
          'grid@home.demo.traffic': {
            templateUrl: 'src/demo/traffic/trafficDetail.html',
            controller: 'TrafficGridController'
          }
        },
        params: {
          // Initialize datepicker, granularity and dynamicFilter properties
          start: {
            value: function(prApi) {
              return moment().tz(prApi.timezone).startOf('day').subtract(1, 'weeks').format('X');
            },
            squash: false
          },
          end: {
            value: function(prApi) {
              return moment().tz(prApi.timezone).endOf('day').subtract(1, 'days').format('X');
            },
            squash: false
          },
          granularity: 'day',
          filterCollapse: 'collapsed'
        },

        ncyBreadcrumb: {
          label: 'Traffic'
        },
        data: {
          pageTitle: 'Traffic Demo'
        },
        menu: {
          name: 'Traffic',
          icon: 'fa fa-cubes',
          tag: 'sidebar',
          priority: 99
        }
      });
    })
.controller('TrafficController',
    function($state, $stateParams, $scope, $filter) {

      $scope.$state = $state;
      $scope.$stateParams = $stateParams;

      /**
       * Navigates to a new date range, used by pr-datepicker directive
       * as a callback for date changes.
       * @param  {moment object} start Start Date
       * @param  {moment object} end   End Date
       */
      $scope.changeDateRange = function(start, end) {
        $scope.$state.go('.', {
          start: start,
          end: end
        });
      };

      /**
       * Get filters for all realtime controllers and subcontrollers
       */
      $scope.dynamicFilters = {};
      if ($scope.$stateParams.dynamicFilters) {
        $scope.dynamicFilters = angular.fromJson($scope.$stateParams.dynamicFilters);
      }

      // Transform the grid selection to chart controller
      $scope.$on('compareDevice', function(event, args) {
        $scope.$broadcast('displayCompare', {devicefamily: args.devicefamily});
      });

      // Transform the chart legend to chart controller
      $scope.$on('legendChange', function(event, args) {
        $scope.$broadcast('toggleDeviceSelection', {devicename: args.devicename});
      });

      // Synchronize select last legend behavior
      $scope.$on('legendSelectAll', function(event, args) {
        $scope.$broadcast('selectAllDevice');
      });

      // Defined the interval for each controller to reuse
      $scope.basicFilters = {
        intervals: $filter('intervalDate')($scope.$state.params.start) + '/' + $filter('intervalDate')($scope.$state.params.end)
      };

      // Defined the dynamic filter for each controller to reuse
      $scope.filters = {
        intervals: $filter('intervalDate')($scope.$state.params.start) + '/' + $filter('intervalDate')($scope.$state.params.end),
        where: $scope.dynamicFilters
      };

      // Remove dynamic filter
      $scope.removeFilter = function(dimensionName, dimVal) {
        var dimValIndex = $scope.dynamicFilters[dimensionName].indexOf(dimVal);
        $scope.dynamicFilters[dimensionName].splice(dimValIndex, 1);
        $state.go('.', {dynamicFilters: angular.toJson($scope.dynamicFilters)});
      };

      $scope.removeAllFilters = function(dimensionName) {
        $scope.dynamicFilters[dimensionName] = [];
        $state.go('.', {dynamicFilters: angular.toJson($scope.dynamicFilters)});
      };

    })
.controller('TrafficFilterController',
    function($scope, $location) {

      // Setup filter panel
      $scope.dataSourceName = 'trackingdruid';
      $scope.table = 'pulsar_session';
      $scope.dimensions = [{
        name: 'osfamily',
        locked: true
      }, {
        name: 'browserfamily',
        locked: true
      }, {
        name: 'devicefamily',
        locked: true
      }, {
        name: 'trafficsource',
        locked: true
      }];
      $scope.metric = {
        name: 'count',
        type: 'sum',
        alias: 'total'
      };

      var dynamicFilters = $scope.$stateParams.dynamicFilters;
      if (dynamicFilters) {
        $scope.model = angular.fromJson(dynamicFilters);
      }

      $scope.submitEvent = 'applyFilters';
      $scope.$on($scope.submitEvent, function(e, params) {
        $scope.$state.go('.', {
          dynamicFilters: angular.toJson(params)
        });
      });

      $scope.isCollapsed = $scope.$stateParams.filterCollapse;
      $scope.toggleCollapse = function() {
        $scope.isCollapsed = $scope.isCollapsed == 'collapsed' ? 'open' : 'collapsed';

        // Silent url update
        $scope.$stateParams.filterCollapse = $scope.isCollapsed;
        $scope.$state.params.filterCollapse = $scope.isCollapsed;
        $location.search('filterCollapse', $scope.isCollapsed);
      };
    })
.controller('TrafficTrendController',
    function($scope, prUIOptionService, prApi, $filter, $location) {
      $scope.options = {
        disabled: false,
        chart: {
          xAxis: {
            axisLabel: 'Time'
          },
          yAxis: {
            tickFormat: function(n) {
              return $filter('number')(n, 0);
            }
          },
          // Set the style(stacked, stream, expanded) for stack chart
          sytle: $scope.chartStyle || 'stack',
          dispatch: {
            stateChange: function(t, u) {
              $scope.chartStyle = t.style;
            }
          },
          showLegend: true,
          legend: {
            dispatch: {
              legendClick: function(t, u) {
                // Trigger the legend event
                $scope.$emit('legendChange', {devicename: t.key});
              },
              stateChange: function(t, u) {
                // Trigger synchronize selection for grid
                var selectAll = true;
                angular.forEach(t.disabled, function(val) {
                  if (val) {
                    selectAll = false;
                  }
                });
                if (selectAll) {
                  $scope.$emit('legendSelectAll');
                }
              }
            }
          }
        }
      };

      $scope.changeGranularity = function(granularity) {
        $scope.$stateParams.granularity = granularity;
        $scope.$state.params.granularity  = granularity;
        // Keep the style same with before granularity change
        $scope.options.chart.style  = $scope.chartStyle;
        $location.search('granularity', granularity);

        $scope.params.granularity = granularity;
      };

      // Synchronize selection event to chart
      $scope.$on('displayCompare', function(event, args) {
        var devicefamily = args.devicefamily;
        if (devicefamily.length === 0) {
          $scope.params.dimensions = [];
          $scope.options.display = undefined;
        } else {
          $scope.params.dimensions = [{name: 'devicefamily'}];
          $scope.options.display = devicefamily;
        }
      });

      // Reset data to fit legend
      $scope.transformData = function(data, param) {
        if ($scope.options.display && $scope.options.display.length) {
          angular.forEach(data, function(val, index) {
            if ($scope.options.display.indexOf(val.key) < 0) {
              data[index].disabled = true;
            } else {
              data[index].disabled = false;
            }
          });
        }
        return data;
      };

      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_session',
        granularity: $scope.$stateParams.granularity,
        dimensions: [],
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'total'
          }
        ],
        maxResults: 100
      };

    })
.controller('TrafficGridController',
    function($scope, prUIOptionService) {
      $scope.options = {
        disabled: false
      };
      $scope.options.grid =  prUIOptionService.getGridOptions({
        enableRowSelection: true,
        multiSelect: true,
        columnDefs: [{
            field: 'devicefamily',
            displayName: 'Device Family',
            // Customized the cell to add device filter
            cellTemplate:
              '<div class="ui-grid-cell-contents">' +
                '<a href title="{{COL_FIELD}}" ng-click="grid.appScope.addFilter(\'devicefamily\', [grid.getCellValue(row, col)])">' +
                  '{{COL_FIELD}}' +
                '</a>' +
              '</div>'
          }, {
            field: 'count',
            displayName: 'Sessions',
            width: '30%',
            cellFilter: 'number',
            cellClass: 'text-right'
          }, {
            field: 'sessionduration_ag',
            displayName: 'Avg. Session Duration',
            width: '30%',
            cellFilter: 'duration',
            cellClass: 'text-right'
          }],
        onRegisterApi: function(gridApi) {
          gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
            if (event) {
              $scope.refreshChart(gridApi);
            }
          });
          // Implemention batch select
          gridApi.selection.on.rowSelectionChangedBatch($scope, function() {
            if (gridApi.grid.selection.selectAll) {
              gridApi.grid.selection.selectAll = false;
              gridApi.selection.clearSelectedRows();
            } else {
              gridApi.selection.selectAllRows();
              gridApi.grid.selection.selectAll = true;
            }
            $scope.refreshChart(gridApi);
          });
          $scope.gridApi = gridApi;
        }
      });

      $scope.params = {
        dataSourceName: 'trackingdruid',
        table: 'pulsar_session',
        granularity: 'all',
        dimensions: [
          {
            name: 'devicefamily'
          }
        ],
        metrics: [
          {
            name: 'count',
            type: 'sum',
            alias: 'count'
          },
          {
            name: 'sessionduration_ag',
            type: 'avg',
            alias: 'sessionduration_ag'
          }
        ],
        maxResults: 100
      };

      $scope.refreshChart = function(gridApi) {
        var devicefamily = [];
        angular.forEach(gridApi.selection.getSelectedRows(), function(selected) {
          devicefamily.push(selected.devicefamily);
        });
        // Trigger the grid events to chart by TrafficController
        $scope.$emit('compareDevice', {devicefamily: devicefamily});
      };

      // Synchronize chart legend event to grid
      $scope.$on('toggleDeviceSelection', function(event, args) {
        window.onresize = null;
        angular.forEach($scope.gridApi.grid.rows, function(row) {
          if (row.entity.devicefamily === args.devicename) {
            $scope.gridApi.selection.toggleRowSelection(row.entity);
            $scope.$apply();
          }
        });
      });

      $scope.$on('selectAllDevice', function(event, args) {
        window.onresize = null;
        $scope.gridApi.selection.selectAllRows();
        $scope.gridApi.grid.selection.selectAll = true;
        $scope.$apply();
      });

      $scope.$watch('filters.where', function(newWhere, oldWhere) {
        if (!angular.equals(newWhere, oldWhere)) {
          // Add the changed filter to dynamicFilters, if present. Otherwise create a new one.
          var dynamicFilters = $scope.$stateParams.dynamicFilters ? angular.fromJson($scope.$stateParams.dynamicFilters) : {};
          angular.forEach(newWhere, function(value, key) {
            if (angular.isArray(value)){
              dynamicFilters[key] = value;
            } else if (value){
              dynamicFilters[key] = [value];
            }
          });

          $scope.$state.go('.', {
            dynamicFilters: angular.toJson(dynamicFilters)
          });
        }
      }, true);

    });
})();
