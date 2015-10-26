/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard')

/**
 * @ngdoc object
 * @name pr.dashboard.prDashboardProvider
 * @description
 *
 * The dashboardProvider can be used to register layouts and widgets.
 */
.provider('prDashboard',
    function() {

      var widgets = {};
      var layouts = {};

      /**
       * @ngdoc method
       * @name widget
       * @methodOf pr.dashboard.prDashboardProvider
       * @description
       *
       * Registers a new widget.
       *
       * @param {string} name of the widget
       * @param {object} widget to be registered.
       *
       *   Object properties:
       *
       *   - `label` - `{string=}` - The label of the button to add the widget.
       *   - `icon` - `{string=}` - Font awesome class to create an icon.
       *   - `template` - `{string=|function()=}` - html template as a string.
       *   - `templateUrl` - `{string=}` - Path to an html template.
       *   - `controller` - `{string=|function()=}` - Controller fn that should be
       *      associated with newly created scope of the widget or the name of a
       *      {@link http://docs.angularjs.org/api/angular.Module#controller registered controller}
       *      if passed as a string.
       *   - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
       *      be injected into the controller. If any of these dependencies are promises, the widget
       *      will wait for them all to be resolved or one to be rejected before the controller is
       *      instantiated.
       *      If all the promises are resolved successfully, the values of the resolved promises are
       *      injected.
       *
       *      The map object is:
       *      - `key` - `{string}`: a name of a dependency to be injected into the controller.
       *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
       *        Otherwise if function, then it is {@link http://docs.angularjs.org/api/AUTO.$injector#invoke injected}
       *        and the return value is treated as the dependency. If the result is a promise, it is
       *        resolved before its value is injected into the controller.
       *   - `edit` - `{object}` - Edit modus of the widget.
       *      - `controller` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
       *      - `template` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
       *      - `templateUrl` - `{string=}` - Same as above, but for the edit mode of the widget.
       *      - `resolve` - `{Object.<string, function>=}` - Same as above, but for the edit mode of the widget.
       *
       * @returns {Object} self
       */
      this.widget = function(name, widget) {
        widgets[name] = widget;
        return this;
      };

      /**
       * @ngdoc method
       * @name layout
       * @methodOf pr.dashboard.prDashboardProvider
       * @description
       *
       * Registers a new layout.
       *
       * @param {string} name of the layout
       * @param {object} layout to be registered.
       *
       *   Object properties:
       *   - `displayName`
       *   - `columns` - `{Array.<object>}` - Columns of the dashboard layout
       *     - mockContent `{string}` - Text use to display on the column of a mock
       *     - styleClass `{string}`  CSS Class of the column.
       *
       * @returns {object} self
       */
      this.layout = function(name, layout) {
        layouts[name] = layout;
        return this;
      };

      /**
       * @ngdoc object
       * @name pr.dashboard.prDashboard
       * @description
       *
       * The dashboard holds all options, layouts and widgets.
       *
       * @returns {Object} self
       */
      this.$get = function() {
        var cid = 0;

        return {
          widgets: widgets,
          layouts: layouts,
          id: function() {
            return ++cid;
          }
        };
      };
    });
})();
