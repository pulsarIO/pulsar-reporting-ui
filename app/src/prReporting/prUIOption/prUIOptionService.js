/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.UIOption')

/**
 * @ngdoc service
 * @name pr.UIOption.service:prUIOptionService
 */
.factory('prUIOptionService',
    function($log, $filter, uiGridConstants) {
      var colorSet1 = [
        '#5D9CEC', /* Blue jeans */
        '#4FC1E9', /* Aqua */
        '#48CFAD', /* Mint */
        '#A0D468', /* Grass */
        '#FFCE54', /* Sunflower */
        '#FC6E51', /* Bittersweet */
        '#ED5565', /* Grapefruit */
        '#AC92EC', /* Lavender */
        '#EC87C0'  /* Pink Rose */
      ];

      var colorSet2 = [
        '#4A89DC', /* Blue jeans 2 */
        '#3BAFDA', /* Aqua 2 */
        '#37BC9B', /* Mint 2 */
        '#8CC152', /* Grass 2 */
        '#F6BB42', /* Sunflower 2 */
        '#E9573F', /* Bittersweet 2 */
        '#DA4453', /* Grapefruit 2 */
        '#967ADC', /* Lavender 2 */
        '#D770AD'  /* Pink Rose 2 */
      ];

      var prUIOptionService = {
        _getBaseGridOptions: function() {
          return {
            data: [],

            // Size
            //NEVER, ALWAYS, WHEN_NEEDED
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            rowHeight: 30,
            headerRowHeight: 30,
            columnFooterHeight: 33,
            enableColumnMenus: false,
            enableSorting: false,

            // Default pagination config
            paginationPageSize: 10
          };
        },

        /**
         * @ngdoc method
         * @name getGridOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns options to build a ui-grid
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} Full list of options to create a grid
         */
        getGridOptions: function(options) {
          var defaults =  {
            // Default pagination config
            paginationPageSizes: [10],
            paginationTemplate: 'src/prReporting/prUIOption/uiGridPager.html'
          };
          return angular.merge({}, prUIOptionService._getBaseGridOptions(), defaults, options || {});
        },

        /**
         * @ngdoc method
         * @name getSimpleGridOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns options to build a ui-grid, using a simple pagination template
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} Full list of options to create a 'simpler' grid
         */
        getSimpleGridOptions: function(options) {
          var defaults =  {
            // Default pagination config
            paginationPageSizes: [],
            paginationTemplate: 'src/prReporting/prUIOption/uiGridPagerSimple.html'
          };
          return angular.merge({}, prUIOptionService._getBaseGridOptions(), defaults, options || {});
        },

        /**
         * @ngdoc method
         * @name getFilterGridOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns options to build a ui-grid, which has filters in the header
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} Full list of options to create a grid with filters
         */
        getFilterGridOptions: function(options) {
          var defaults = {
            enableFiltering: true,
            paginationPageSizes: [10],
            paginationTemplate: 'src/prReporting/prUIOption/uiGridPager.html'
          };
          if (options && options.columnDefs) {
            angular.forEach(options.columnDefs, function(col) {
              if (!col.filter) {
                col.filter = {condition:uiGridConstants.filter.CONTAINS};
              } else {
                if (typeof col.filter.condition === 'undefined') {
                  angular.merge({}, true, col.filter, {condition: uiGridConstants.filter.CONTAINS});
                }
              }
            });
          }
          return angular.merge({}, prUIOptionService._getBaseGridOptions(), defaults, options || {});
        },

        /**
         * @ngdoc method
         * @deprecated
         * @name getIndexCellTemplate
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns a template to create an cellTemplate to be used by ui-grid. **This method is deprecated.**
         * @return {object} String with HTML template
         */
        getIndexCellTemplate: function() {
          $log.warn('getIndexCellTemplate in pr.UIOption:prUIOptionService is deprecated, please add you own template');
          return '<div class="ui-grid-cell-contents">{{(grid.options.paginationCurrentPage - 1) * grid.options.paginationPageSize + rowRenderIndex + 1}}</div>';
        },

        /**
         * @ngdoc method
         * @name getPieChartOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns a options to build a nvd3 pieChart
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} An object of which contains `chart`, as expected by nvd3 directives
         */
        getPieChartOptions: function(options) {
          var defaults = {
            type: 'pieChart',
            color: colorSet2,
            margin: {
              top: -30,
              right: -30,
              bottom: -30,
              left: -30
            },
            height: 300,
            valueFormat: $filter('number'),
            showLabels: true,
            showLegend: false,
            transitionDuration: 500,
            labelsOutside: false,
            pie: {
              dispatch: {
              }
            }
          };
          return {
            chart: angular.merge({}, defaults, options || {})
          };
        },

        /**
         * @ngdoc method
         * @name getxAxisTickFormat
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Formats a date according to a granularity, shows a more detailed time if the granularity is higher.
         * @param  {date} date Date to format
         * @param  {string=} granularity (hour or minute)
         * @param  {string=} timezone Timezone (MST)
         * @return {object} A date formatted by moment.js
         */
        getxAxisTickFormat: function(date, granularity, timezone) {
          if (granularity === 'hour') {
            return moment(date).tz(timezone).format('MMM DD, HH:mm');
          } else if (granularity === 'minute') {
            return moment(date).tz(timezone).format('MMM DD, HH:mm');
          } else {
            return moment(date).tz(timezone).format('MMM DD');
          }
        },

        /**
         * @ngdoc method
         * @name getTimeLineChartOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns a options to build a nvd3 lineChart
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} An object of which contains `chart`, as expected by nvd3 directives
         */
        getTimeLineChartOptions: function(options) {
          var defaults = {
            type: 'lineChart',
            color: colorSet2,
            height: 135,
            margin: {
              top: 20,
              right: 40,
              bottom: 40,
              left: 100
            },
            forceY: 0,
            interpolate: 'cardinal',
            useInteractiveGuideline: true,
            xAxis: {
              axisLabel: 'Time'
            },
            xScale: d3.time.scale().nice(d3.time.hour),
            yAxis: {
              axisLabelDistance: 30
            }
          };

          return {
            chart: angular.merge({}, true, defaults, options || {})
          };
        },

        /**
         * @ngdoc method
         * @name getLineWithFocusOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns a options to build a nvd3 lineWithFocusChart
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} An object of which contains `chart`, as expected by nvd3 directives
         */
        getLineWithFocusOptions: function(options) {
          var defaults = {
            type: 'lineWithFocusChart',
            color: colorSet2,
            margin: {
              top: 20,
              right: 50,
              bottom: 40,
              left: 80
            },
            height: 380,
            xAxis: {
              axisLabel: 'Time',
              tickFormat: function(d) {
                return moment(d).format('MMM DD, HH:mm');
              }
            },
            x2Axis: {
              axisLabel: 'Time',
              tickFormat: function(d) {
                return moment(d).format('MMM DD, HH:mm');
              }
            }
          };

          return {
            chart: angular.merge({}, true, defaults, options || {})
          };
        },

        /**
         * @ngdoc method
         * @name getDiscreteBarChartOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns a options to build a nvd3 discreteBarChart
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} An object of which contains `chart`, as expected by nvd3 directives
         */
        getDiscreteBarChartOptions: function(options) {
          var defaults = {
            type: 'discreteBarChart',
            color: colorSet2,
            height: 300,
            margin: {
              top: 5,
              right: 5,
              bottom: 5,
              left: 100
            },
            showValues: true,
            transitionDuration: 500,
            discretebar: {
              dispatch: {
              }
            }
          };

          return {
            chart: angular.merge({}, true, defaults, options || {})
          };
        },

        /**
         * @ngdoc method
         * @name getStackedAreaChartOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns a options to build a nvd3 stackedAreaChart
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} An object of which contains `chart`, as expected by nvd3 directives
         */
        getStackedAreaChartOptions: function(options) {
          var defaults = {
            type: 'stackedAreaChart',
            color: colorSet2,
            height: 380,
            margin: {
              top: 20,
              right: 40,
              bottom: 50,
              left: 100
            },
            x: function(d) {return d.x;},
            y: function(d) {return d.y;},
            useVoronoi: false,
            clipEdge: true,
            transitionDuration: 500,
            useInteractiveGuideline: true,
            xAxis: {
              showMaxMin: false,
              tickFormat: function(d) {
                return moment(d).format('MMM DD, HH:mm');
              }
            }
          };
          return {
            chart: angular.merge({}, true, defaults, options || {})
          };
        },

        /**
         * @ngdoc method
         * @name getGroupedBarChartOptions
         * @methodOf pr.UIOption.service:prUIOptionService
         * @description Returns a options to build a nvd3 multiBarChart (grouped bar chart))
         * @param  {object=} options More options, take precendence over defaults
         * @return {object} An object of which contains `chart`, as expected by nvd3 directives
         */
        getGroupedBarChartOptions: function(options) {
          var defaults = {
            type: 'multiBarChart',
            color: colorSet2,
            height: 300,
            margin: {
              top: 5,
              right: 5,
              bottom: 50,
              left: 35
            },
            reduceXTicks: false,
            stacked:  false,
            showValues: true,
            transitionDuration: 500
          };

          return {
            chart: angular.merge({}, true, defaults, options || {})
          };
        }

      };
      return prUIOptionService;
    });

})();
