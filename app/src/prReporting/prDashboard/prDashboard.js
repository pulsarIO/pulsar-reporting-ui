/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard')

/**
 * @ngdoc directive
 * @name pr.dashboard.directive:prDashboard
 * @scope
 * @restrict E
 *
 * @description
 * The `prDashboard` creates an interactive dashboard report from a model.
 *
 * @param {string} layout Layout string identifier, must match a layout created with the `prDashboardProvider.layout()`
 * function. Allows to change the layout of the dashboard without changing the model manually.
 * @param {object} model Main model representing the dashboard. Must contain the widgets.
 * @param {boolean} filters Query filters to be passed to all the widgets of the dashboard.
 * @param {boolean} editMode Flag to enable or disabled editing of the dashabord. It allows to move, add, or remove
 * widgets and layout from the UI.
 * @param {boolean} mock Special flag used when the dashboard is displayed with no contents (and no model) for demo purpose,
 * such as selecting a layout.
 */
.directive('prDashboard', function(prDashboard) {
    return {
      restrict: 'E',
      templateUrl: 'src/prReporting/prDashboard/prDashboard.html',

      scope: {
        layout: '=',
        model: '=?', /* The is no model when on mock mode */
        filters: '=',
        editMode: '=',
        mock: '@'
      },

      link: function(scope, element, attrs) {
        scope.sortableOptions = {
          handle: '.move-icon',
          connectWith: '.column-inner'
        };

        // In case the layout changes we create a brand new dashboard model and
        // move the widgets there. This guarantees that no widget is lost.
        scope.isEmpty = function() {
          var res = true;
          if (scope.model && scope.model.config && scope.model.config.columns) {
            angular.forEach(scope.model.config.columns, function(column) {
              if (column.widgets && column.widgets.length) {
                res = false;
              }
            });
          }
          return res;
        };

        scope.$watch('layout', function(newValue) {
          // Start with an empty layout as the new model
          if (prDashboard.layouts[newValue]) {
            if (scope.mock) {
              scope.model = {
                config: angular.copy(prDashboard.layouts[newValue])
              };
            } else if (scope.model) {
              var newColumns = angular.copy(prDashboard.layouts[newValue].columns);
              angular.forEach(newColumns, function(newColumn) {
                delete newColumn.mockContent;
              });
              angular.forEach(scope.model.config.columns, function(column, index) {
                angular.forEach(column.widgets, function(widget) {
                  // Add only if the columns exists
                  var i = newColumns[index] ? index : newColumns.length - 1;
                  newColumns[i].widgets.push(widget);
                });
              });

              scope.model.config.columns = newColumns;
            }
          }
        });
      }
    };
  });

})();

