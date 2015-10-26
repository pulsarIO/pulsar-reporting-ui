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
    function($scope, prApi) {
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
        disabled: false
      };
    });
})();
