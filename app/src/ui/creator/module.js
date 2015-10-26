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
