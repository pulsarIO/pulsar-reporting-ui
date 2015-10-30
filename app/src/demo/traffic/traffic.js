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
            axisLabel: 'Time',
            tickFormat: function(d) {
              // Update xAxis format
              if (typeof d !== 'string') {
                return prUIOptionService.getxAxisTickFormat(d, $scope.params.granularity, prApi.timezone);
              } else {
                return d;
              }
            }
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
                '<a href title="{{COL_FIELD}}" ng-click="grid.appScope.addFilter(\'devicefamily\', grid.getCellValue(row, col))">' +
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
