/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.gridextensions')

/**
 * @ngdoc directive
 * @name pr.gridextensions.directive:prGridHeight
 * @restrict A
 *
 * @description
 * Grid height automatically recalculates the height of the grid according to the current configuration and data.
 *
 * @requires uiGrid
 */
.directive('prGridHeight',
    function(gridUtil, $timeout) {
      return {
        restrict: 'A',
        require: 'uiGrid',
        link: function($scope, $elm, $attrs, uiGridCtrl) {
          var grid = uiGridCtrl.grid;
          var options = grid.options;

          // On creation we guess an initial height that doesn't rely
          // on DOM or other info it can be overriden by the attribute,
          // is just a wild guess anyway before the real data comes!
          var initialHeight = $attrs.prGridHeight;
          if (initialHeight === '') {
            initialHeight = 1 * options.rowHeight;

            if (options.showHeader) {
              initialHeight += 30;
            }

            if (options.enableFiltering) {
              initialHeight += 30;
            }

            if (options.showFooter) {
              initialHeight += 32;
            }

            // Check if we have a pagination
            if ($attrs.uiGridPagination === '') {
              initialHeight += 32;
            }
          }

          $elm.css('height', initialHeight + 'px');

          var calculateHeight = function() {
            // Figure out the new height, component by component
            // 1. Header height
            var headerHeight = $elm.find('.ui-grid-header').size() ? $elm.find('.ui-grid-header').outerHeight() : grid.headerRowHeight;

            // 2. Content height
            // Take the height of the data if the data is small, otherwise take the pagination
            var contentHeight;
            if (options.data.length === 0) {
              contentHeight = 1 * options.rowHeight;
            } else if ('uiGridPagination' in $attrs && options.paginationPageSize && options.data.length > options.paginationPageSize) {
              contentHeight = options.paginationPageSize * options.rowHeight;
            } else {
              contentHeight = options.data.length * options.rowHeight;
            }

            // 3. Footer height
            var footerHeight = options.showFooter ? options.footerRowHeight : 0;

            // 4. Column footer height
            var columnFooterHeight = options.showColumnFooter ? options.columnFooterHeight : 0;

            // 5. Horizontal scrollbar height
            var scrollbarHeight = options.enableHorizontalScrollbar ? gridUtil.getScrollbarWidth() : 0;

            // 6. Pager height
            var pager = $elm.find('.ui-grid-pager-panel');
            var pagerHeight = pager.size() ? pager.outerHeight() : 0;

            // Put all the heights together
            var height = headerHeight + contentHeight + footerHeight + columnFooterHeight + scrollbarHeight + pagerHeight;

            // Prevent the table from becoming too small
            if (height < initialHeight) {
              height = initialHeight;
            }

            // Add one more pixel to remove the scroll bar
            height++;

            return height;
          };

          $scope.$watch($attrs.uiGrid + '.data', function() {

            uiGridCtrl.scrollbars = uiGridCtrl.scrollbars || [];

            // Wait for digest cycle to finish
            $timeout(function() {
              var newHeight = calculateHeight();

              $elm.css('height', newHeight + 'px');

              grid.gridHeight = $scope.gridHeight = gridUtil.elementHeight($elm);

              // Run initial canvas refresh
              grid.refreshCanvas();
            });

          }, $attrs.prGridHeightDeep ? true : false);
        }
      };
    });

})();
