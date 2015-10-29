/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.date')

/**
 * @ngdoc directive
 * @name pr.date.directive:prDatepicker
 * @scope
 * @restrict E
 * @requires bootstrap-daterangepicker https://github.com/dangrossman/bootstrap-daterangepicker
 * @requires momentjs http://momentjs.com/
 *
 * @description
 * The `prDatepicker` directive creates a date picker for a range of dates.
 *
 * @param {number} startDate The starting date of the range, in timestamp format
 * @param {number} endDate The starting date of the range, in timestamp format
 * @param {function} callback The callback to run when the dates range is changed
 * @param {string=} format The date format to display, defaults to `YYYY-MM-DD`
 * @param {string=} timezone The timezone to use when creating the ranges.
 */
.directive('prDatepicker',
    function(prApi) {
      return {
        restrict: 'E',
        scope: {
          startDate:'=',
          endDate:'=',
          callbackHandler:'&callback',
          timezone: '@'
        },
        template: '<button class="btn btn-default">' +
                    '<i class="fa fa-calendar"></i> ' +
                    ' <span></span> ' +
                    '<b class="caret"></b>' +
                  '</button>',
        link: function(scope, element, attrs) {
          // Init
          var timezone = scope.timezone || prApi.timezone;
          var format = attrs.format || 'YYYY-MM-DD';
          var separator = ' - ';
          var callback = scope.callbackHandler ? scope.callbackHandler() : function() {};

          function startOfToday() {
            return moment().tz(timezone).startOf('day');
          }
          function endOfToday() {
            return moment().tz(timezone).endOf('day');
          }

          var ranges = {
            Today: [
              startOfToday(),
              endOfToday()
            ],
            Yesterday: [
              startOfToday().subtract(1, 'days'),
              endOfToday().subtract(1, 'days')
            ],
            'Last 7 Days': [
              startOfToday().subtract(1, 'weeks'),
              endOfToday().subtract(1, 'days')
            ],
            'Last 30 Days': [
              startOfToday().subtract(30, 'days'),
              endOfToday().subtract(1, 'days')
            ],
            'This Month': [
              startOfToday().startOf('month'),
              endOfToday()
            ],
            'Last Month': [
              startOfToday().subtract(1, 'month').startOf('month'),
              endOfToday().subtract(1, 'month').endOf('month')
            ]
          };

          // Create datepicker, full list of options at https://github.com/dangrossman/bootstrap-daterangepicker
          var maxDate = moment.tz(moment().tz(timezone).format(format), timezone);
          var minDate = maxDate.clone().subtract(6, 'month');
          var options = {
            maxDate: maxDate,
            minDate: minDate,
            format: format,
            showDropdowns: true,
            opens: attrs.opens || 'right',
            ranges: ranges
          };

          element.daterangepicker(options, function(start, end, label) {
            scope.startDate = moment.tz(start.startOf('day').format('YYYY-MM-DD HH:mm:ss'), timezone).format('X');
            scope.endDate = moment.tz(end.endOf('day').format('YYYY-MM-DD HH:mm:ss'), timezone).format('X');
            callback(scope.startDate, scope.endDate, start.startOf('day'), end.startOf('day'));
            scope.$apply();
          });

          // Watch
          // We use $watchGroup, update the view if either start or end change.
          scope.$watchGroup(['startDate', 'endDate'], function(newValues) {
            var startDate = newValues[0] ? moment(newValues[0], 'X').tz(timezone).format(format) : null;
            var endDate = newValues[1]  ? moment(newValues[1], 'X').tz(timezone).format(format) : null;

            if (startDate && endDate) {
              var val = startDate + separator + endDate;
              element.find('span').html(val);
              element.data('daterangepicker').setStartDate(startDate);
              element.data('daterangepicker').setEndDate(endDate);
            }
          });
        }
      };
    });
})();
