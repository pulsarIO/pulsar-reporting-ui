/*
 pulsar-reporting-ui | 0.2.0
 Copyright (C) 2012-2015 eBay Software Foundation
 Licenses: MIT & Apache 2.0
*/
angular.module("src/demo/realtime/realtime.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtime.html",
    "<section class=content-header> <h1> Real-time Analytics Demo Page </h1> <ncy-breadcrumb></ncy-breadcrumb> </section>  <section class=content> <div class=\"row clearfix\"> <section class=\"col-sm-12 col-md-8\"> <div class=margin-bottom ui-view=filters></div> </section> <section class=\"col-sm-12 col-md-4\"> <div class=\"text-right margin-bottom clearfix\"> <div class=\"btn-group pull-right\"> <button type=button ng-click=\"setRefresh(true, true) \" ng-class={active:refresh.active} class=\"btn btn-default\"> <i ng-class=\"{'text-green': refresh.active}\" class=\"fa fa-play\"></i> Auto Refresh </button> <button type=button ng-click=setRefresh(false) ng-class=\"{active: !refresh.active}\" class=\"btn btn-default\"> <i ng-class=\"{'text-red': !refresh.active}\" class=\"fa fa-square\"></i> </button> </div> </div> </section> </div> <div class=row> <div class=\"col-md-4 col-lg-3\" ui-view=metric></div> <div class=\"col-md-8 col-lg-9\" ui-view=trend></div> </div> <div class=row> <div class=\"col-md-12 col-lg-3\" ui-view=info-box></div> <div class=\"col-md-12 col-lg-5\" ui-view=grid></div> <div class=\"col-md-12 col-lg-4\" ui-view=ratio></div> </div> <div class=row> <div class=col-md-12 ui-view=distribution></div> </div> </section>");
}]);

angular.module("src/demo/realtime/realtimeDistribution.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtimeDistribution.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title> <i class=\"fa fa-globe\"></i> Events Distribution </h3> </div> <div class=box-body> <div class=row> <div class=col-md-12> <pr-grouped-bar-widget params=params options=options filters=filters></pr-grouped-bar-widget> </div> </div> </div> </div>");
}]);

angular.module("src/demo/realtime/realtimeFilters.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtimeFilters.html",
    "<div ng-show=\"\n" +
    "    $stateParams.trafficsource || \n" +
    "    $stateParams.devicefamily || \n" +
    "    $stateParams.osfamily ||\n" +
    "    $stateParams.country\n" +
    "  \"> <a ng-show=$stateParams.trafficsource ng-click=\"$state.go($state.current.name, { trafficsource :'' })\"> <span class=\"btn btn-default\">Traffic Source: {{$stateParams.trafficsource}} <i class=\"fa fa-fw fa-times\"></i></span> </a> <a ng-show=$stateParams.devicefamily ng-click=\"$state.go($state.current.name, { devicefamily : '' })\"> <span class=\"btn btn-default\">Device Family: {{$stateParams.devicefamily}} <i class=\"fa fa-fw fa-times\"></i></span> </a> <a ng-show=$stateParams.osfamily ng-click=\"$state.go($state.current.name, { osfamily : '' })\"> <span class=\"btn btn-default\">OS Family: {{$stateParams.osfamily}} <i class=\"fa fa-fw fa-times\"></i></span> </a> <a ng-show=$stateParams.country ng-click=\"$state.go($state.current.name, { country : '' })\"> <span class=\"btn btn-default\">Country: {{$stateParams.country}} <i class=\"fa fa-fw fa-times\"></i></span> </a> <a ng-click=\"$state.go($state.current.name, { trafficsource : '', devicefamily : '', osfamily : '', country : ''})\"> <span class=\"btn btn-default\"> Clear All <i class=\"fa fa-trash-o\"></i></span> </a> </div>");
}]);

angular.module("src/demo/realtime/realtimeGrid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtimeGrid.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title> <i class=\"fa fa-table\"></i> Traffic Sources </h3> </div> <div class=box-body> <div class=row> <div class=col-md-12> <pr-grid-widget params=params options=options filters=filters></pr-grid-widget> </div> </div> </div> </div>");
}]);

angular.module("src/demo/realtime/realtimeInfoBox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtimeInfoBox.html",
    "<div class=row> <section class=\"col-sm-12 col-md-6 col-lg-12 metric-info-box\"> <a href ng-click=\"updateDeviceFilter('Desktop')\"> <div class=\"info-box bg-default\"> <span class=info-box-icon><i class=\"fa fa-desktop\"></i></span> <div class=info-box-content> <span class=info-box-text> Desktop </span> <span class=info-box-number>{{deviceFamily.Desktop || 0 | number:0}}</span> <div class=progress> <div class=progress-bar ng-style=\"{width : (deviceFamily.Desktop || 0)*100/deviceFamily.total + '%'}\"></div> </div> <span class=progress-description> {{ (deviceFamily.Desktop || 0)*100/deviceFamily.total || 0 | number : 2}}% </span> </div> </div> </a> </section> <section class=\"col-sm-12 col-md-6 col-lg-12 metric-info-box\"> <a href ng-click=\"updateDeviceFilter('Tablet')\"> <div class=\"info-box bg-default\"> <span class=info-box-icon><i class=\"fa fa-tablet\"></i></span> <div class=info-box-content> <span class=info-box-text> Tablet </span> <span class=info-box-number>{{deviceFamily.Tablet || 0 | number:0}}</span> <div class=progress> <div class=progress-bar ng-style=\"{width : (deviceFamily.Tablet || 0)*100/deviceFamily.total + '%'}\"></div> </div> <span class=progress-description> {{ (deviceFamily.Tablet || 0)*100/deviceFamily.total || 0 | number : 2}}% </span> </div> </div> </a> </section> <section class=\"col-sm-12 col-md-6 col-lg-12 metric-info-box\"> <a href ng-click=\"updateDeviceFilter('Mobile')\"> <div class=\"info-box bg-default\"> <span class=info-box-icon><i class=\"fa fa-mobile\"></i></span> <div class=info-box-content> <span class=info-box-text> Mobile </span> <span class=info-box-number>{{deviceFamily.Mobile || 0 | number:0}}</span> <div class=progress> <div class=progress-bar ng-style=\"{width : (deviceFamily.Mobile || 0)*100/deviceFamily.total + '%'}\"></div> </div> <span class=progress-description> {{ (deviceFamily.Mobile || 0)*100/deviceFamily.total || 0 | number : 2}}% </span> </div> </div> </a> </section> <section class=\"col-sm-12 col-md-6 col-lg-12 metric-info-box\"> <a href ng-click=\"updateDeviceFilter('Other')\"> <div class=\"info-box bg-default\"> <span class=info-box-icon><i class=\"fa fa-question\"></i></span> <div class=info-box-content> <span class=info-box-text> Other </span> <span class=info-box-number>{{deviceFamily.Other || 0 | number:0}}</span> <div class=progress> <div class=progress-bar ng-style=\"{width : (deviceFamily.Other || 0)*100/deviceFamily.total + '%'}\"></div> </div> <span class=progress-description> {{ (deviceFamily.Other || 0)*100/deviceFamily.total || 0 | number : 2}}% </span> </div> </div> </a> </section> </div>");
}]);

angular.module("src/demo/realtime/realtimeMetric.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtimeMetric.html",
    "<pr-metric-widget params=params options=options filters=filters></pr-metric-widget>");
}]);

angular.module("src/demo/realtime/realtimeRatio.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtimeRatio.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title> <i class=\"fa fa-pie-chart\"></i> OS Ratio </h3> </div> <div class=box-body> <div class=row> <div class=col-md-12> <pr-pie-widget params=params options=options filters=filters></pr-pie-widget> </div> </div> </div> </div>");
}]);

angular.module("src/demo/realtime/realtimeTrend.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/realtime/realtimeTrend.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title> <i class=\"fa fa-line-chart\"></i> Trend Today </h3> </div> <div class=box-body> <div class=row> <div class=col-md-12> <pr-timeline-widget params=params options=options filters=filters transform-data=transformData></pr-timeline-widget> </div> </div> </div> </div>");
}]);

angular.module("src/demo/traffic/traffic.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/traffic/traffic.html",
    "<section class=content-header> <h1> Traffic Analytics Demo Page </h1> <ncy-breadcrumb></ncy-breadcrumb> </section>  <section class=content> <div class=\"row clearfix\"> <section class=\"pull-left col-md-9\"> <div ng-repeat=\"(dimensionName, dimensionVals) in dynamicFilters\" ng-show=dimensionVals.length class=btn-group> <button type=button class=\"btn btn-default dropdown-toggle\" data-toggle=dropdown> {{dimensionName}}: ({{dimensionVals.length}}) ...<i class=\"fa fa-caret-down\"></i> </button> <ul class=dropdown-menu role=menu> <li ng-repeat=\"dimVal in dimensionVals track by $index\"> <a href ng-click=\"removeFilter(dimensionName, dimVal)\"> {{dimVal}} <i class=\"fa fa-fw fa-times\"></i> </a> </li> <li class=divider></li> <li> <a href ng-click=removeAllFilters(dimensionName)> <strong>Remove all</strong> <i class=\"fa fa-fw fa-times\"></i> </a> </li> </ul> &nbsp; </div> </section> <section class=\"pull-right col-md-3\"> <div class=\"text-right margin-bottom clearfix\"> <pr-datepicker start-date=$stateParams.start end-date=$stateParams.end callback=changeDateRange opens=left class=pull-right></pr-datepicker> </div> </section> </div> <div class=row> <div class=col-sm-12 ui-view=filter></div> </div> <div class=row> <div class=col-sm-12 ui-view=trend></div> </div> <div class=row> <div class=col-sm-12 ui-view=grid></div> </div> </section>");
}]);

angular.module("src/demo/traffic/trafficDetail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/traffic/trafficDetail.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title> <i class=\"fa fa-table\"></i> Device Family Session </h3> </div> <div class=box-body> <div class=row> <div class=col-md-12> <pr-grid-widget params=params options=options filters=filters></pr-grid-widget> </div> </div> </div> </div>");
}]);

angular.module("src/demo/traffic/trafficFilters.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/traffic/trafficFilters.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h4 class=box-title> Filters </h4> <div class=\"box-tools pull-right\"> <button class=\"btn btn-default btn-sm pull-right\" ng-click=toggleCollapse(!isCollapsed)> <i class=fa ng-class=\"isCollapsed == 'collapse'? 'fa-plus' : 'fa-minus'\"></i> </button> </div> </div> <div class=box-body collapse=\"isCollapsed == 'collapsed'\"> <div class=row> <div class=\"col-lg-push-3 col-lg-6 col-md-push-2 col-md-8\"> <pr-dynamic-filter datasource=dataSourceName table=table metric=metric filters=basicFilters max-options=6 max-dimensions=10 model=model drilldown=true edit-mode=true visible-options-selected=3 submit-event=submitEvent dimensions=dimensions> </pr-dynamic-filter> </div> </div> </div> </div>");
}]);

angular.module("src/demo/traffic/trafficTrend.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/demo/traffic/trafficTrend.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title> <i class=\"fa fa-line-chart\"></i> Trend of Sessions </h3> <div class=\"box-tools btn-group pull-right\"> <button class=\"btn btn-default btn-sm\" ng-class=\"{active: $stateParams.granularity=='hour'}\" ng-click=\"changeGranularity('hour')\"> Hour </button> <button class=\"btn btn-default btn-sm\" ng-class=\"{active: $stateParams.granularity=='day'}\" ng-click=\"changeGranularity('day')\"> Day </button> <button class=\"btn btn-default btn-sm\" ng-class=\"{active: $stateParams.granularity=='week'}\" ng-click=\"changeGranularity('week')\"> Week </button> </div> </div> <div class=box-body> <pr-stack-widget params=params options=options filters=filters transform-data=transformData></pr-stack-widget> </div> <div ng-show=wait class=overlay> <i class=\"fa fa-refresh fa-spin\"></i> </div> </div>");
}]);

angular.module("src/prReporting/prDashboard/prDashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboard/prDashboard.html",
    "<div class=dashboard ng-class=\"{'dashboard-mock' : mock}\"> <div ng-show=\"isEmpty() && !mock\"> <div class=\"alert bg-light-blue\"> <button type=button class=close data-dismiss=alert aria-hidden=true> <i class=\"fa fa-times\"></i> </button> <h4> <i class=\"icon fa fa-check\"></i> Your dashboard is empty! </h4> You can start adding new widgets. Select the edit button &nbsp;<i class=\"fa fa-edit fa-lg\"></i>, and clicking 'Add a widget'. </div> </div> <div ng-class=\"{row : !mock}\" class=clearfix> <div ng-repeat=\"column in model.config.columns\" class=column ng-class=column.styleClass> <div ng-class=\"{'column-inner': editMode || mock}\" ui-sortable=sortableOptions ng-model=column.widgets> <div ng-if=mock class=mock-content> {{column.mockContent}} </div> <div ng-repeat=\"widget in column.widgets\"> <pr-dashboard-widget edit-mode=editMode widget=widget widgets=column.widgets filters=filters></pr-dashboard-widget> </div> </div> </div> </div> </div>");
}]);

angular.module("src/prReporting/prDashboard/prDashboardWidget.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboard/prDashboardWidget.html",
    "<div class=box ng-class=\"{'box-danger' : status.name == 'error', 'box-default': status.name == 'done'}\"> <div class=box-header> <h3 class=box-title> <i class={{icon}}></i> {{widget.options.title}} </h3> <div class=\"box-tools pull-right\"> <a class=\"btn btn-box-tool\" ng-click=showStructure() tooltip-html=getSummary()> <i class=\"fa fa-info\"></i> </a> <a class=\"btn btn-box-tool\" ng-click=\"isCollapsed = !isCollapsed\" data-widget=collapse> <i ng-class=\"isCollapsed ? 'fa fa-plus' : 'fa fa-minus'\"></i> </a> <a class=\"btn btn-box-tool move-icon\" ng-show=editMode style=\"cursor: move\"> <i class=\"fa fa-arrows\"></i> </a> <a class=\"btn btn-box-tool\" ng-click=edit() ng-show=editMode> <i class=\"fa fa-gear\"></i> </a> <a class=\"btn btn-box-tool\" ng-click=remove() ng-show=editMode> <i class=\"fa fa-times\"></i> </a> </div> </div> <div collapse=isCollapsed> <div class=box-body> <div ng-show=\"status.name == 'error'\" ng-switch=status.httpStatus class=\"callout callout-danger\"> <h4 title={{status.errorMessage}}> <i class=\"fa fa-bell\"></i> {{status.httpStatus}} Error </h4> <p ng-switch-when=400> This widget configuration didn't work out... Could you try something else? </p> <p ng-switch-when=500> There was a problem on our side. Is not your fault. Please contact us for assitance. </p> <p ng-switch-default> A problem occured. Please contact us for assitance. </p> </div> <div class=widgetContent></div> </div> </div> <div ng-show=\"status.name == 'wait'\" class=overlay> <i class=\"fa fa-refresh fa-spin\"></i> </div> </div>");
}]);

angular.module("src/prReporting/prDashboard/prDashboardWidgetStructureModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboard/prDashboardWidgetStructureModal.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Widget Structure</h4> </div> <div class=modal-body> <strong>Widget</strong> <pre>{{widget | json}}</pre> <strong>Filters</strong> <pre>{{filters | json}}</pre> </div> <div class=modal-footer> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/bar/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/bar/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Bar Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table ng-required=newParams.table ng-options=\"table for table in tables\"> <option value=\"\">-- Select a table --</option> </select> </div> <div class=form-group ng-show=dimensions.length> <label for=widget-dimension>Dimension</label> <select class=form-control id=widget-dimension ng-model=newParams.dimensions[0] ng-options=\"dimension.name for dimension in dimensions track by dimension.name\"> <option value=\"\">-- Choose dimension --</option> </select> </div> <div class=form-group ng-show=metrics.length> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=false></pr-metric-picker> </div> <label ng-init=\"showMore = true\"> <a href ng-click=\"showMore = !showMore\"> More Options <i class=\"fa {{showMore ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <fieldset collapse=showMore> <div class=form-group> <label>Max Results</label> <input type=number class=form-control ng-model=\"newParams.maxResults\"> </div> </fieldset> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/bar/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/bar/view.html",
    "<pr-bar-widget options=widget.options params=widget.params filters=filters></pr-bar-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/grid/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/grid/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Grid Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table ng-required=newParams.table ng-options=\"table for table in tables\"> <option value=\"\">-- Select a table --</option> </select> </div> <div class=form-group ng-show=dimensions.length> <label for=\"\">Dimension</label> <ui-select multiple=multiple ng-model=newParams.dimensions theme=bootstrap> <ui-select-match placeholder=\"Select dimension...\">{{$item.name}}</ui-select-match> <ui-select-choices repeat=\"dimension as dimension in dimensions | filter:$select.search\"> {{dimension.name}} </ui-select-choices> </ui-select> </div> <div class=form-group ng-show=metrics.length> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=true></pr-metric-picker> </div> <label ng-init=\"showMore = true\"> <a href ng-click=\"showMore = !showMore\"> More Options <i class=\"fa {{showMore ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <fieldset collapse=showMore> <div class=form-group ng-show=newParams.table> <label for=widget-granularity> Granularity </label> <select class=form-control id=widget-granularity ng-model=newParams.granularity> <option ng-repeat=\"granularity in granularities\" ng-selected=\"{{granularity.name==newParams.granularity}}\" value={{granularity.name}}> {{granularity.displayName}} </option> </select> <p class=help-block ng-show=newParams.dimensions.length> Granularity not recommended when using dimensions.</p> </div> <div class=form-group> <label>Max Results</label> <input type=text class=form-control ng-model=\"newParams.maxResults\"> </div> </fieldset> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/grid/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/grid/view.html",
    "<pr-grid-widget options=widget.options params=widget.params filters=filters></pr-grid-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/groupedBar/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/groupedBar/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Grouped Bar Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <div> <label for=widget-title>Grouped Bar Mode</label></div> <div class=col-lg-3> <div class=radio> <label> <input type=radio ng-model=multipleMetrics ng-value=false> Single Metric </label> </div> </div> <div class=col-lg-9> <div class=radio> <label> <input type=radio ng-model=multipleMetrics ng-value=true> Mutiple Metrics </label> </div></div> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table> <option value=\"\">-- Select a table --</option> <option ng-repeat=\"table in tables\" ng-selected=\"{{table==newParams.table}}\" value={{table}}> {{table}} </option> </select> </div> <div class=form-group ng-show=dimensions.length> <label for=widget-dimension>Dimension 1</label> <select class=form-control id=widget-dimension ng-model=newParams.dimensions[0] ng-options=\"dimension.name for dimension in dimensions track by dimension.name\"> <option value=\"\">-- Choose dimension --</option> </select> </div> <div class=form-group ng-show=\"dimensions.length && !multipleMetrics\"> <label for=widget-dimension-2>Dimension 2</label> <select class=form-control id=widget-dimension-2 ng-model=newParams.dimensions[1] ng-options=\"dimension.name for dimension in dimensions track by dimension.name\"> <option value=\"\">-- Choose dimension --</option> </select> </div> <div class=form-group> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=multipleMetrics></pr-metric-picker> </div> <label ng-init=\"showMore = true\"> <a href ng-click=\"showMore = !showMore\"> More Options <i class=\"fa {{showMore ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <fieldset collapse=showMore> <div class=form-group> <label>Max Results</label> <input type=number class=form-control ng-model=\"newParams.maxResults\"> </div> <div class=form-group> <label>Show Legend:&nbsp;&nbsp;&nbsp;&nbsp; <input type=checkbox ng-model=\"options.chart.showLegend\"> </label> </div> </fieldset> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/groupedBar/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/groupedBar/view.html",
    "<pr-grouped-bar-widget options=widget.options params=widget.params filters=filters></pr-grouped-bar-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/lineWithFocus/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/lineWithFocus/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Line with Focus Chart Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table ng-required=newParams.table ng-options=\"table for table in tables\"> <option value=\"\">-- Select a table --</option> </select> </div> <div class=form-group ng-show=metrics.length> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=true></pr-metric-picker> </div> <label ng-init=\"showMore = true\"> <a href ng-click=\"showMore = !showMore\"> More Options <i class=\"fa {{showMore ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <fieldset collapse=showMore> <div class=form-group> <label>Max Results</label> <input type=number class=form-control ng-model=\"newParams.maxResults\"> </div> <div class=form-group> <label>Show Legend:&nbsp;&nbsp;&nbsp;&nbsp; <input type=checkbox ng-model=\"options.chart.showLegend\"> </label> </div> </fieldset> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/lineWithFocus/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/lineWithFocus/view.html",
    "<pr-line-with-focus-widget options=widget.options params=widget.params filters=filters></pr-line-with-focus-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/metric/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/metric/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Metric Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table> <option value=\"\">-- Select a table --</option> <option ng-repeat=\"table in tables\" ng-selected=\"{{table==newParams.table}}\" value={{table}}> {{table}} </option> </select> </div> <div class=form-group ng-show=metrics.length> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=false></pr-metric-picker> </div> <div class=form-group> <label for=metric-description>Metric Description</label> <input type=text class=form-control id=metric-description ng-model=options.description placeholder=\"Please enter metric description...\"> </div> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/metric/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/metric/view.html",
    "<pr-metric-widget options=widget.options params=widget.params filters=filters></pr-metric-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/metric/widget.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/metric/widget.html",
    "<div class=\"small-box bg-default\"> <div class=inner> <h4>{{params.metrics[0].alias || params.metrics[0].name}}</h4> <h3><pr-count-to value=totalNumber>--</pr-count-to></h3> <h4 ng-if=options.description>{{options.description}}</h4> </div> <div class=icon> <i ng-class=icon></i> </div> <br> <div class=small-box-footer ng-if=options.subDescription>{{options.subDescription}}</div> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/pie/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/pie/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Pie Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table> <option value=\"\">-- Select a table --</option> <option ng-repeat=\"table in tables\" ng-selected=\"{{table==newParams.table}}\" value={{table}}> {{table}} </option> </select> </div> <div class=form-group ng-show=dimensions.length> <label for=widget-dimension>Dimension</label> <select class=form-control id=widget-dimension ng-model=newParams.dimensions[0] ng-options=\"dimension.name for dimension in dimensions track by dimension.name\"> <option value=\"\">-- Choose dimension --</option> </select> </div> <div class=form-group ng-show=metrics.length> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=false></pr-metric-picker> </div> <label ng-init=\"showMore = true\"> <a href ng-click=\"showMore = !showMore\"> More Options <i class=\"fa {{showMore ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <fieldset collapse=showMore> <div class=form-group> <label>Max Results</label> <input type=number class=form-control ng-model=\"newParams.maxResults\"> </div> </fieldset> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/pie/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/pie/view.html",
    "<pr-pie-widget options=widget.options params=widget.params filters=filters></pr-pie-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/stack/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/stack/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Stack Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table> <option value=\"\">-- Choose source --</option> <option ng-repeat=\"table in tables\" ng-selected=\"{{table == newParams.table}}\" value={{table}}> {{table}} </option> </select> </div> <div class=form-group> <label for=widget-granularity> Granularity </label> <select class=form-control id=widget-table ng-model=newParams.granularity> <option ng-repeat=\"granularity in granularities\" ng-selected=\"{{granularity == newParams.granularity}}\" value={{granularity.name}}> {{granularity.displayName}} </option> </select> </div> <div class=form-group ng-show=dimensions.length> <label for=widget-dimension>Dimension</label> <select class=form-control id=widget-dimension ng-model=newParams.dimensions[0] ng-options=\"dimension.name for dimension in dimensions track by dimension.name\"> <option value=\"\">-- Choose dimension --</option> </select> </div> <div class=form-group ng-show=metrics.length> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=false></pr-metric-picker> </div> <label ng-init=\"showMore = true\"> <a href ng-click=\"showMore = !showMore\"> More Options <i class=\"fa {{showMore ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <fieldset collapse=showMore> <div class=form-group> <label>Max Results</label> <input type=number class=form-control ng-model=\"newParams.maxResults\"> </div> <div class=form-group> <label>Show Legend:&nbsp;&nbsp;&nbsp;&nbsp; <input type=checkbox ng-model=\"options.chart.showLegend\"> </label> </div> </fieldset> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/stack/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/stack/view.html",
    "<pr-stack-widget options=widget.options params=widget.params filters=filters></pr-stack-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/timeline/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/timeline/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Edit Timeline Widget</h4> </div> <div class=modal-body> <div class=form-group> <label for=widget-title>Widget Title</label> <input type=text class=form-control id=widget-title ng-model=options.title placeholder=\"Please enter widget title...\"> </div> <div class=form-group> <div> <label for=widget-title>Layout Style</label></div> <div class=col-lg-3> <div class=radio> <label> <input type=radio ng-model=options.isArea ng-value=false checked=checked> LineChart </label> </div> </div> <div class=col-lg-9> <div class=radio> <label> <input type=radio ng-model=options.isArea ng-value=true> AreaChart </label> </div></div> </div> <div class=form-group> <label for=widget-table>Table</label> <select class=form-control id=widget-table ng-model=newParams.table> <option value=\"\">-- Select a table --</option> <option ng-repeat=\"table in tables\" ng-selected=\"{{table==newParams.table}}\" value={{table}}> {{table}} </option> </select> </div> <div class=form-group ng-show=metrics.length> <pr-metric-picker metric-options=metrics aggregation-options=aggregationTypes metrics=newParams.metrics multiple=true></pr-metric-picker> </div> <div class=form-group> <label for=widget-granularity>Granularity</label> <select class=form-control id=widget-granularity ng-model=newParams.granularity> <option ng-repeat=\"granularity in granularities\" ng-selected=\"{{granularity.name == newParams.granularity}}\" value={{granularity.name}}> {{granularity.displayName}} </option> </select> </div> <label ng-init=\"showMore = true\"> <a href ng-click=\"showMore = !showMore\"> More Options <i class=\"fa {{showMore ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <fieldset collapse=showMore> <div class=form-group> <label>Max Results</label> <input type=number class=form-control ng-model=\"newParams.maxResults\"> </div> <div class=form-group> <label>Show Legend:&nbsp;&nbsp;&nbsp;&nbsp; <input type=checkbox ng-model=\"options.chart.showLegend\"> </label> </div> </fieldset> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Close</button> </div>");
}]);

angular.module("src/prReporting/prDashboardWidgets/timeline/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/timeline/view.html",
    "<pr-timeline-widget options=widget.options params=widget.params filters=filters></pr-timeline-widget>");
}]);

angular.module("src/prReporting/prDashboardWidgets/util/prMetricPicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDashboardWidgets/util/prMetricPicker.html",
    "<div ng-show=metricOptions.length> <label> Metrics </label> <table class=\"table metric-detail\"> <tbody> <tr> <th style=\"width: 25%\"><em>Metric</em></th> <th><em>Aggregation</em></th> <th><em>Alias</em></th> <th style=\"width: 50px\"></th> </tr>  <tr class=metric ng-if=multiple ng-repeat=\"metric in metrics\"> <td class=metric-name> {{metric.name}} </td> <td class=metric-aggregation> <div class=btn-group> <select class=form-control ng-model=metric.type> <option ng-repeat=\"aggregationOption in aggregationOptions\" ng-selected=\"{{aggregationOption == metric.type}}\" value={{aggregationOption}}> {{aggregationOption }} </option> </select> </div> </td> <td class=metric-alias> <input type=text ng-model=metric.alias class=\"form-control input-sm\" placeholder=\"Please enter metric alias...\"> </td> <td class=metric-remove> <button type=button class=\"btn btn-default btn-sm\" ng-click=removeMetric($index)> <i class=\"fa fa-close\"></i> </button> </td> </tr> <tr ng-if=multiple> <td class=metric-add> <div class=btn-group> <button type=button class=\"btn btn-default btn-sm dropdown-toggle\" data-toggle=dropdown data-placeholder=\"Please select\"> <span class=\"fa fa-plus\"></span> Add a metric </button> <ul class=dropdown-menu> <li ng-repeat=\"metricOption in metricOptions\"> <a href ng-click=addMetric(metricOption.name)>{{metricOption.name}}</a> </li> </ul> </div> </td> <td>-</td> <td>-</td> <td></td> </tr>  <tr class=metric ng-if=!multiple> <td class=metric-name> <div class=form-group> <select class=form-control ng-model=metrics[0].name ng-change=selectMetric(metrics[0].name)> <option value=\"\">-- Choose metric --</option> <option ng-repeat=\"metricOption in metricOptions\" ng-selected=\"{{metricOption.name==metrics[0].name}}\" value={{metricOption.name}}> {{metricOption.name}} </option> </select> </div> </td> <td class=metric-aggregation> <div class=form-group> <select class=form-control ng-model=metrics[0].type> <option class=aggregation-option ng-repeat=\"aggregationOption in aggregationOptions\" ng-selected=\"{{aggregationOption == metrics[0].type}}\" value={{aggregationOption}}> {{aggregationOption}} </option> </select> </div> </td> <td class=metric-alias> <div class=form-group><input type=text ng-model=metrics[0].alias class=\"form-control input-sm\"></div> </td> </tr> </tbody> </table> </div>");
}]);

angular.module("src/prReporting/prDynamicFilter/prDynamicFilter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prDynamicFilter/prDynamicFilter.html",
    "<form class=form-horizontal> <div class=form-group ng-repeat=\"dimension in dimensions\" ng-class=\"{'has-error': dimension.error}\"> <label class=\"col-sm-3 control-label\"> {{dimension.name}} </label> <div class=col-sm-9> <div class=\"btn-group btn-block filter\" dropdown auto-close=\"'outsideClick'\"> <a type=button class=\"btn btn-block btn-default dropdown-toggle\" ng-class=\"{'active': model[dimension.name].length}\" dropdown-toggle ng-disabled=!dimension.options.length> <i class=\"fa fa-spinner fa-pulse\" ng-show=dimension.wait></i> <em ng-if=dimension.error> Error, no options loaded </em> <em ng-if=\"!dimension.wait && !dimension.error && model[dimension.name] && model[dimension.name].length == 0\"> Not filtered </em> <span ng-if=\"!dimension.error && !dimension.wait\"> <span ng-if=\"model[dimension.name].length <= visibleOptionsSelected\" ng-repeat=\"option in model[dimension.name]\"> {{option}}<span ng-show=!$last>, </span> </span> <span ng-if=\"model[dimension.name].length > visibleOptionsSelected\"> {{model[dimension.name].length}} of {{dimension.options.length}} selected </span> </span> <i class=\"fa fa-caret-down dropdown-toggle-caret\"></i> </a> <ul class=dropdown-menu ng-click=$event.stopPropagation() role=menu> <li ng-repeat=\"option in dimension.options\"> <a href ng-click=\"toggleOption(dimension, option)\"> <i class=\"fa {{ isOptionSelected(dimension, option) ? 'fa-check-square-o' : 'fa-square-o'}}\"></i> {{option}} </a> </li> <li class=divider></li> <li> <a href ng-click=unselectAllOptions(dimension)> <i class=\"fa fa-clone\"></i> Uncheck all </a> </li> </ul> <a ng-click=removeDimension(dimension) ng-show=editMode ng-disabled=dimension.locked class=\"btn btn-default filter-remove\"> <i class=\"fa fa-trash-o\"></i> </a> </div> </div> </div> <div class=form-group ng-show=editMode> <label class=col-sm-3> <div class=\"btn-group btn-block\" dropdown> <button type=button class=\"btn btn-default btn-block dropdown-toggle\" dropdown-toggle ng-disabled=\"dimensions.length >= maxDimensions\"> {{dimensions.length >= maxDimensions ? 'Max. filters added': 'Add filter'}}<i class=\"fa fa-caret-down dropdown-toggle-caret\"></i> </button> <ul class=dropdown-menu> <li ng-repeat=\"dimensionOption in dimensionOptions\" ng-show=!isDimensionAdded(dimensionOption.name)> <a href ng-click=addDimension(dimensionOption)>{{dimensionOption.name}}</a> </li> </ul> </div> </label> <div class=col-sm-9> <div class=\"btn-group btn-block\" dropdown auto-close=\"'outsideClick'\"> <a type=button class=\"btn btn-block btn-default disabled\" dropdown-toggle style=\"text-align: left\"> - </a> </div> </div> </div> <div class=text-right> <button class=\"btn btn-primary\" ng-if=submitEvent ng-click=submit()>Submit</button> </div> </form>");
}]);

angular.module("src/prReporting/prGridExtensions/prGridLimitationAlert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prGridExtensions/prGridLimitationAlert.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close> <i class=\"fa fa-times\"></i> </button> <h4 class=modal-title>Alert</h4> </div> <div class=modal-body> <p>No more than {{maximum}} selected items!</p> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=cancel() data-dismiss=modal>Close</button> </div>");
}]);

angular.module("src/prReporting/prUIOption/uiGridPager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prUIOption/uiGridPager.html",
    "<div class=ui-grid-pager-panel ui-grid-pager ng-show=grid.options.enablePaginationControls> <div class=\"text-right clearfix\"> <div class=inline ng-show=\"grid.options.totalItems > 0\"> {{showingLow}} to {{showingHigh}} of {{grid.options.totalItems}} {{totalItemsLabel}}. </div> <div class=inline ng-show=\"grid.options.paginationPageSizes && grid.options.paginationPageSizes.length > 1\"> <span>Show</span> <select ng-model=grid.options.paginationPageSize ng-options=\"o as o for o in grid.options.paginationPageSizes\" class=\"form-control inline\"></select> <span>{{sizesLabel}}.</span> </div> <div class=\"pagination no-margin btn-group\" ng-init=\"\"> <button type=button class=\"btn btn-default\" ng-click=paginationApi.seek(1) ng-disabled=cantPageBackward()> <i class=\"fa fa-angle-double-left\"></i> </button> <button type=button class=\"btn btn-default disabled\" ng-show=\"grid.options.paginationCurrentPage - 3 > 0\"> ... </button> <button type=button class=\"btn btn-default\" ng-click=paginationApi.seek(i+1) ng-class=\"{active: grid.options.paginationCurrentPage == i+1}\" ng-show=\"grid.options.paginationCurrentPage - 3 < i+1 && grid.options.paginationCurrentPage + 3 > i+1\" ng-repeat=\"i in paginationApi.getTotalPages() | range\"> {{i+1}} </button> <button type=button class=\"btn btn-default disabled\" ng-show=\"grid.options.paginationCurrentPage + 3 <= paginationApi.getTotalPages()\"> ... </button> <button type=button class=\"btn btn-default\" ng-click=paginationApi.seek(paginationApi.getTotalPages()) ng-disabled=cantPageToLast()> <i class=\"fa fa-angle-double-right\"></i> </button> </div> </div> </div>");
}]);

angular.module("src/prReporting/prUIOption/uiGridPagerSimple.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/prReporting/prUIOption/uiGridPagerSimple.html",
    "<div class=ui-grid-pager-panel ui-grid-pager ng-show=grid.options.enablePaginationControls> <div class=\"text-right clearfix\"> <div class=inline ng-show=\"grid.options.totalItems > 0\"> {{showingLow}} to {{showingHigh}} of {{grid.options.totalItems}} {{totalItemsLabel}}. </div> <div class=\"pagination no-margin btn-group\"> <button type=button class=\"btn btn-default\" ng-click=paginationApi.previousPage() ng-disabled=cantPageBackward()> <i class=\"fa fa-angle-left\"></i> </button> <button type=button class=\"btn btn-default\" ng-click=paginationApi.nextPage() ng-disabled=cantPageForward()> <i class=\"fa fa-angle-right\"></i> </button> </div> </div> </div>");
}]);

angular.module("src/ui/admin/admin.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/admin.html",
    "<section class=content-header> <div class=\"alert alert-success color-palette alert-dismissible\" ng-show=\"tip.type == 'Success'\" ng-repeat=\"tip in tips.lists\"> <button type=button class=close data-dismiss=alert aria-hidden=true><i class=\"icon fa fa-times\"></i> </button> <h4><i class=\"icon fa fa-check\"></i> Success </h4> {{ tip.message }} </div> <div class=\"alert alert-danger color-palette alert-dismissible\" ng-show=\"tip.type == 'Error'\" ng-repeat=\"tip in tips.lists\"> <button type=button class=close data-dismiss=alert aria-hidden=true><i class=\"icon fa fa-times\"></i> </button> <h4><i class=\"icon fa fa-bell-slash-o\"></i> Error </h4> {{ tip.message }} </div> </section> <section class=content-header> <h1> Admin </h1> <ncy-breadcrumb></ncy-breadcrumb> </section>  <section class=content> <div ng-controller=DatasourceManageController ng-include=\"'src/ui/admin/datasourceManage/datasourceManageView.html'\"></div> <div ng-controller=GroupManageController ng-include=\"'src/ui/admin/groupManage/groupManageView.html'\"></div> </section>");
}]);

angular.module("src/ui/admin/datasourceManage/add/add.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/datasourceManage/add/add.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close> <i class=\"fa fa-times\"></i> </button> <h4 class=modal-title>DataSource Management</h4> </div> <form name=addForm class=modal-body> <div class=row> <div class=col-md-12> <div class=form-group> <label for=dataSource-name>DataSource Name</label> <input required type=text name=displayName ng-pattern=\"/^[a-zA-Z0-9]{1,64}$/\" class=form-control id=dataSource-name ng-model=datasourceParam.displayName placeholder=\"Please enter datasource name...\"> <span class=text-red> * </span>letters and numbers only, max length is 64 <div role=alert> <span class=\"error text-red\" ng-show=addForm.displayName.$error.pattern>Invalid name format...</span> </div> </div> <div class=form-group> <label>DataSource Type</label> <input type=text class=form-control value=druid ng-disabled=\"true\"> </div> <div class=form-group> <label for=dataSource-endpoint>Endpoint</label>  <input required type=text name=endpoint ng-pattern=\"/[a-zA-z]+://[^\\s]*/\" class=form-control id=dataSource-endpoint ng-model=datasourceParam.endpoint placeholder=\"Please enter datasource endpoint...\"> <span class=text-red> * </span>input url with format: xxx://xxx <div role=alert> <span class=\"error text-red\" ng-show=addForm.endpoint.$error.pattern>Invalid url format...</span> </div> </div> </div> </div> </form> <div class=modal-footer> <button class=\"btn btn-primary\" ng-disabled=!addForm.$valid ng-click=save()>Save</button> <button class=\"btn btn-default\" ng-click=cancel()>cancel</button> </div>");
}]);

angular.module("src/ui/admin/datasourceManage/cellTemplates/adminDatasourceOperateView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/datasourceManage/cellTemplates/adminDatasourceOperateView.html",
    "<div ng-show=row.entity.editable class=text-center> <button class=\"btn btn-box-tool\" ng-click=grid.appScope.editDatasource(row.entity)> <i class=\"fa fa-pencil fa-fw\"></i> </button> &nbsp;&nbsp; <button class=\"btn btn-box-tool\" ng-click=grid.appScope.deleteDatasource(row)> <i class=\"fa fa-trash-o fa-lg\"></i> </button> </div>");
}]);

angular.module("src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html",
    "<div> <div class=ui-grid-cell-contents> <span class=grid-tooltip tooltip=\"{{ COL_FIELD }}\" tooltip-placement=top tooltip-append-to-body=true> {{COL_FIELD}} </span> </div> </div>");
}]);

angular.module("src/ui/admin/datasourceManage/datasourceManageView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/datasourceManage/datasourceManageView.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title><i class=\"fa fa-database\"></i>&nbsp; Datasource Manage </h3> <div class=box-tools> <div class=\"input-group btn-group pull-rught\"> <button class=\"btn btn-sm btn-default\" ng-click=addDatasource()> Add Datasource &nbsp; <i class=\"fa fa-plus-square\"></i> </button> </div> </div> </div> <div class=box-body> <div class=row> <div class=col-md-12> <div ui-grid=grid.gridOptions ui-grid-pagination ui-grid-auto-resize pr-grid-height pr-grid-height-deep=true class=grid> </div> </div> </div> </div> <div ng-show=datasourceRefresh.loading class=overlay> <i class=\"fa fa-refresh fa-spin\"></i> </div> </div>");
}]);

angular.module("src/ui/admin/datasourceManage/delete/delete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/datasourceManage/delete/delete.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Alert</h4> </div> <div class=modal-body> <p>Are you sure to delete the datasources ?</p> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=delete()>Delete</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Cancel</button> </div>");
}]);

angular.module("src/ui/admin/datasourceManage/edit/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/datasourceManage/edit/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close> <i class=\"fa fa-times\"></i> </button> <h4 class=modal-title>DataSource Management</h4> </div> <form name=editForm class=modal-body> <div class=row> <div class=col-md-12> <div class=form-group> <label for=dataSource-name>DataSource Name</label> <input required type=text name=displayName ng-pattern=\"/^[a-zA-Z0-9]{1,64}$/\" class=form-control id=dataSource-name ng-model=datasourceParam.displayName placeholder=\"Please enter datasource name...\"> <span class=text-red> * </span>letters and numbers only, max length is 64 <div role=alert> <span class=\"error text-red\" ng-show=editForm.displayName.$error.pattern>Invalid name format...</span> </div> </div> <div class=form-group> <label>DataSource Type</label> <input type=text class=form-control value=druid ng-disabled=\"true\"> </div> <div class=form-group> <label for=dataSource-endpoint>Endpoint</label> <input type=text name=endpoint ng-pattern=\"/[a-zA-z]+://[^\\s]*/\" class=form-control id=dataSource-endpoint ng-model=datasourceParam.endpoint placeholder=\"Please enter datasource endpoint...\"> <span class=text-red> * </span>input url with format: xxx://xxx <div role=alert> <span class=\"error text-red\" ng-show=addForm.endpoint.$error.pattern>Invalid url format...</span> </div> </div> </div> </div> </form> <div class=modal-footer> <button class=\"btn btn-primary\" ng-disabled=!editForm.displayName.$valid ng-click=ok()>Save</button> <button class=\"btn btn-default\" ng-click=cancel()>Cancel</button> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightDisplayNameView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightDisplayNameView.html",
    "<div> <span class=ui-grid-cell-contents> <span> <span class=grid-tooltip tooltip=\"{{ COL_FIELD }}\" tooltip-placement=top tooltip-append-to-body=true> {{ COL_FIELD }} </span> </span> </span> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameSuffixView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameSuffixView.html",
    "<div ng-show=\"row.entity.rightType != '0' \" class=\"btn-group text-center margin-for-grid\"> <label class=\"btn btn-xs btn-default\" ng-model=row.entity._VIEW btn-checkbox> View </label> <label class=\"btn btn-xs btn-default\" ng-model=row.entity._MANAGE ng-class=\"{'btn-default-disabled-active':row.entity._MANAGE && !row.entity.editable}\" data-ng-disabled=!row.entity.editable btn-checkbox> Manage </label> </div> <div ng-show=\"row.entity.rightType == '0' \" class=\"btn-group text-center margin-for-grid\"> <label class=\"btn btn-xs btn-default\" ng-model=row.entity.checked btn-checkbox> Check </label> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameView.html",
    "<div> <span class=ui-grid-cell-contents> <span class=grid-tooltip tooltip=\"{{ COL_FIELD }}\" tooltip-placement=top tooltip-append-to-body=true> {{ COL_FIELD }} </span> </span> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightTypeView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightTypeView.html",
    "<div class=margin-for-grid> <span ng-show=\" COL_FIELD == 0 \"> &nbsp; <i class=\"fa fa-database\"></i>&nbsp; System </span> <span ng-show=\" COL_FIELD == 1 \"> &nbsp; <i class=\"fa fa-database\"></i>&nbsp; Datasource </span> <span ng-show=\" COL_FIELD == 2 \"> &nbsp; <i class=\"fa fa-dashboard text-blue\"></i>&nbsp; Dashboard </span> <span ng-show=\" COL_FIELD == 4 \"> &nbsp; <i class=\"fa fa-group\"></i>&nbsp; Group </span> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupCreatorView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupCreatorView.html",
    "<div> <div class=ui-grid-cell-contents> <span class=grid-tooltip tooltip=\"{{ COL_FIELD }}\" tooltip-placement=top tooltip-append-to-body=true> {{ COL_FIELD }} </span> </div> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupDisplayNameView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupDisplayNameView.html",
    "<div ng-show=!grid.appScope.groupsControllers[row.entity.name].displayNameInLoading> <div class=ui-grid-cell-contents> <span class=grid-tooltip tooltip=\"{{ COL_FIELD }}\" tooltip-placement=top tooltip-append-to-body=true> {{COL_FIELD}} </span> </div> </div> <div ng-show=grid.appScope.groupsControllers[row.entity.name].displayNameInLoading> <span> &nbsp; <i class=\"fa fa-refresh fa-spin\"></i>&nbsp;Loading... </span> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupNameView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupNameView.html",
    "<div> <div class=ui-grid-cell-contents> <span class=grid-tooltip tooltip=\"{{ COL_FIELD }}\" tooltip-placement=top tooltip-append-to-body=true> {{COL_FIELD}} </span> </div> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupOperateView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupOperateView.html",
    "<div ng-show=row.entity.editable class=text-center> <button class=\"btn btn-box-tool\" ng-click=grid.appScope.editRow(row.entity.name) data-ng-disabled=grid.appScope.groupsControllers[row.entity.name].usersInLoading> <i class=\"fa fa-pencil fa-fw\"></i> </button> &nbsp;&nbsp; <button class=\"btn btn-box-tool\" ng-click=grid.appScope.prepareRemoveRow(row.entity.name) data-ng-disabled=gird.appScope.groupsControllers[row.entity.name].usersInLoading> <i class=\"fa fa-trash-o fa-lg\"></i> </button> </div>");
}]);

angular.module("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupUsersView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupUsersView.html",
    "<div ng-show=!grid.appScope.groupsControllers[row.entity.name].usersInLoading> <div class=ui-grid-cell-contents> <span class=grid-tooltip tooltip=\"{{row.entity.users.join(', ')}}\" tooltip-placement=top tooltip-append-to-body=true> <span ng-repeat=\"user in COL_FIELD\">{{ user + ( !$last ? ',' : '') }}&nbsp;&nbsp;</span> </span> </div> </div> <div ng-show=grid.appScope.groupsControllers[row.entity.name].usersInLoading> <span> &nbsp; <i class=\"fa fa-refresh fa-spin\"></i>&nbsp;Loading... </span> </div>");
}]);

angular.module("src/ui/admin/groupManage/delete/removeDialogTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/delete/removeDialogTemplate.html",
    "<div class=modal-header> <button type=button ng-click=close() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title>Alert</h4> </div> <div class=modal-body> <p>Are you sure of deleting the selected group?</p> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=confirm()>Delete</button> <button class=\"btn btn-default\" ng-click=close()>Cancel</button> </div>");
}]);

angular.module("src/ui/admin/groupManage/groupManageView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/groupManageView.html",
    "<div class=\"box box-default\"> <div class=\"box-header with-border\"> <h3 class=box-title><i class=\"fa fa-group\"></i>&nbsp;Permission Manage</h3> <div class=box-tools> <form name=addGroup> <div class=\"input-group pull-right add-group-width\"> <input class=\"form-control input-sm\" name=groupName ng-pattern=\"/^[a-zA-Z0-9\\s]{1,64}$/\" ng-model=addOperation.newGroupName placeholder=\"Add Group\" type=text> <div class=input-group-btn> <button class=\"btn btn-sm btn-default\" ng-disabled=!addGroup.groupName.$valid ng-click=addNewGroup()><i class=\"fa fa-plus-square\"></i></button> </div> </div> <div ng-show=!addGroup.$valid class=\"pull-right text-red add-group-middle\"> letters, numbers and space only, max length is 64 &nbsp;&nbsp;</div> </form> </div> </div> <div class=box-body> <div class=row> <div class=col-md-12> <div ui-grid=groupGrid ui-grid-pagination ui-grid-auto-resize pr-grid-height pr-grid-height-deep=true class=grid></div> </div> </div> </div>  <div class=box-footer></div> <div ng-show=groupsRefresh.loading class=overlay> <i class=\"fa fa-refresh fa-spin\"></i> </div> </div>");
}]);

angular.module("src/ui/admin/groupManage/update/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/admin/groupManage/update/edit.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close> <i class=\"fa fa-times\"></i> </button> <h4 class=modal-title>Permission Management</h4> </div> <div class=modal-body> <div class=row> <div class=col-md-12> <form name=editForm class=form-group> <label>Group Name</label> <input required type=text name=displayName ng-pattern=\"/^[a-zA-Z0-9\\s]{1,64}$/\" class=form-control id=dataSource-name ng-model=groupdisplayname placeholder=\"Please enter group name...\"> <span class=text-red> * </span>letters, numbers and space only, max length is 64 <div role=alert> <span class=\"error text-red\" ng-show=editForm.displayName.$error.pattern>Invalid name format...</span> </div> </form> <br> <div class=form-group> <label>Add Users</label> <ui-select ng-model=users.new tagging tagging-label=\" \" multiple=multiple theme=bootstrap> <ui-select-match placeholder=\"Select users...\">{{$item}}</ui-select-match> <ui-select-choices repeat=\"user in users.old | filter: $select.search\" ng-hide=!$select.items.length> {{user}} </ui-select-choices> </ui-select> <span class=text-red> * </span>press 'Enter' to finish input </div> <br> <label>Permission Control</label> <div class=\"btn-group text-center pull-right\"> <label class=\"btn btn-xs btn-default\" ng-click=\"singleFilter('Selected')\" ng-model=selectedStatus btn-radio=\"'Selected'\"> &nbsp;&nbsp;Selected&nbsp;&nbsp; </label> <label class=\"btn btn-xs btn-default\" ng-click=\"singleFilter('All')\" ng-model=selectedStatus btn-radio=\"'All'\"> &nbsp;&nbsp;Show All&nbsp;&nbsp; </label> </div> <div ui-grid=dialogGrid ui-grid-pagination ui-grid-auto-resize pr-grid-height pr-grid-height-deep=true class=grid> </div> </div> <br> </div> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-disabled=\"!editForm.displayName.$valid || newUserNameInText\" ng-click=ok()>Save</button> <button class=\"btn btn-default\" ng-click=cancel()>Cancel</button> </div>");
}]);

angular.module("src/ui/creator/creator.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/creator/creator.html",
    "<section class=content-header> <h1> Reports creator </h1> <ncy-breadcrumb></ncy-breadcrumb> </section> <section class=content> <div> <button type=button class=\"btn btn-primary\" ng-click=addDashboard()> <i class=\"fa fa-plus\"></i> </button> <div class=btn-group ng-if=\"dashboards.length > 0\"> <button type=button class=\"btn btn-primary dropdown-toggle\" data-toggle=dropdown ng-if=dashboards> <span ng-if=dashboards[current]> {{dashboards[current].displayName}} ({{dashboards[current].config.dataSourceName}}) <span class=caret></span> </span> <span ng-if=!dashboards[current]> <em>Select a dashboard</em> <span class=caret></span> </span> </button> <ul class=\"dropdown-menu creator-dropdown-menu\"> <li ng-repeat=\"(i, dashboard) in dashboards\"> <a href ng-click=\"selectDashboard(i, dashboard.name);\">{{dashboard.displayName}} ({{dashboard.config.dataSourceName}})</a> </li> </ul> </div> <span ng-if=dashboards[current]> <button type=button class=\"btn btn-default\" ng-disabled=!canEditDashboard() ng-click=deleteDashboard() ng-if=\"dashboards.length > 0\"> <i class=\"fa fa-trash-o\"></i> </button> </span> </div> <div> &nbsp; &nbsp; </div> <div ng-if=dashboard> <div ui-view=dashboard></div> </div> <div ng-if=!dashboard> <div class=\"alert bg-light-blue\"> <button type=button class=close data-dismiss=alert aria-hidden=true> <i class=\"fa fa-times\"></i> </button> <h4> <i class=\"icon fa fa-check\"></i> Select a dashboard or create a new one </h4> If you can't select any dashboard, click the add button &nbsp;<i class=\"fa fa-plus fa-lg\"></i>&nbsp; to start. </div> </div> </section>");
}]);

angular.module("src/ui/creator/creatorDashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/creator/creatorDashboard.html",
    "<div class=\"row clearfix\"> <section class=\"pull-left col-lg-2\"> <div class=input-group> <input type=text class=form-control ng-model=whereRaw placeholder=\"e.g. browserfamily = 'Chrome'\"> <span class=input-group-btn> <button type=button class=\"btn btn-default\" ng-click=addRawFilter(whereRaw)> <i class=\"fa fa-search\"></i> </button> </span> </div> </section> <section class=pull-left> <a ng-repeat=\"(name, value) in dashboard.config.filters.where\" ng-click=removeFilter(name)> <span class=\"btn btn-default\">{{name}}: {{value}} <i class=\"fa fa-fw fa-times\"></i></span> </a> </section> <section class=\"pull-right col-lg-10\"> <div class=\"text-right margin-bottom clearfix\"> <pr-datepicker start-date=start end-date=end callback=changeDateRange opens=left class=pull-right></pr-datepicker> <div class=pull-right> &nbsp; &nbsp; </div> <div class=pull-right> <form class=\"form-inline btn-group\" ng-show=editMode> <div class=form-group> <label for=dashboard.name>Dashboard name: </label> <input type=text class=form-control id=dashboard.name ng-model=dashboard.displayName placeholder=\"Dashboard name\"> </div> </form> <div class=btn-group ng-show=editMode> <button type=button class=\"btn btn-default\" title=\"Config Layout\" ng-click=selectLayout()><i class=\"fa fa-columns\"></i></button> </div> <div class=btn-group ng-show=editMode> <button type=button class=\"btn btn-default dropdown-toggle\" data-toggle=dropdown aria-haspopup=true aria-expanded=false> Add a widget <span class=caret></span> </button> <ul class=dropdown-menu> <li ng-repeat=\"(key, w) in widgets\"> <a href ng-click=addWidget(key)> <i ng-class=w.icon></i> {{w.label}} </a> </li> </ul> </div> <div class=btn-group> <button ng-show=editMode type=button class=btn ng-class=\"isDashboardSaved() ? 'btn-default' : 'btn-primary'\" title=Save ng-click=persistDashboard()> <i class=\"fa fa-save\"></i> Save </button> <button ng-show=editMode type=button class=\"btn btn-default\" title=Undo ng-click=refreshDashboard()> <i class=\"fa fa-undo\"></i> Reload </button> <button ng-disabled=!canEditDashboard() type=button class=\"btn btn-default\" title=Edit ng-click=setEditMode(!editMode)><i class=\"fa fa-edit\"></i></button> </div> </div> </div> </section> </div> <pr-dashboard model=dashboard layout=dashboard.config.layout edit-mode=editMode filters=dashboard.config.filters></pr-dashboard> <br> <label ng-init=\"collapseJson = true\"> <a href ng-click=\"collapseJson = !collapseJson\"> Show Dashboard structure <i class=\"fa {{collapseJson ? 'fa-caret-right' : 'fa-caret-down'}}\"></i> </a> </label> <pre collapse=collapseJson>\n" +
    "  {{dashboard | json}}\n" +
    "</pre>");
}]);

angular.module("src/ui/creator/modals/add.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/creator/modals/add.html",
    "<form> <div class=modal-header> <button type=button ng-click=$dismiss() class=close> <i class=\"fa fa-times\"></i> </button> <h4 class=modal-title>Add New Dashboard</h4> </div> <div class=modal-body> <div ng-show=saveError class=\"callout callout-danger\"> <h4> <i class=\"fa fa-bell\"></i> {{saveError.httpStatus}} Error </h4> <p> {{saveError.data}} </p> </div> <div class=form-group> <label for=newDashboard.displayName>Dashboard Name</label> <input type=text class=form-control id=newDashboard.displayName ng-model=newDashboard.displayName placeholder=\"Please enter dashboard name...\"> </div> <div class=form-group ng-class=\"{'has-error': dataSourcesError}\"> <label>Data source</label> <select class=form-control ng-model=newDashboard.config.dataSourceName ng-disabled=dataSourcesError> <option value=\"\">-- Select a data source --</option> <option ng-repeat=\"dataSource in dataSources\" value={{dataSource.name}}> {{dataSource.displayName}} ({{dataSource.type}}) </option> </select> <p class=help-block ng-if=dataSourcesError>Data sources list couldn't be loaded. ({{dataSourcesError}})</p> </div> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-disabled=\"!newDashboard.config.dataSourceName || wait\" ng-click=add()> Save <i class=\"fa fa-spinner fa-spin\" ng-if=wait></i> </button> <button class=\"btn btn-default\" ng-click=$dismiss()>Cancel</button> </div> </form>");
}]);

angular.module("src/ui/creator/modals/delete.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/creator/modals/delete.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close data-dismiss=modal aria-label=Close><span aria-hidden=true>×</span></button> <h4 class=modal-title>Alert</h4> </div> <div class=modal-body> <p>Are you sure you want to delete this Dashboard? This action cannot be undone!</p> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=$close()>Delete</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Cancel</button> </div>");
}]);

angular.module("src/ui/creator/modals/layout.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/ui/creator/modals/layout.html",
    "<div class=modal-header> <button type=button ng-click=$dismiss() class=close><i class=\"fa fa-times\"></i></button> <h4 class=modal-title><i class=\"fa fa-columns\"></i> Select Layout</h4> </div> <div class=modal-body> <div class=row> <div ng-repeat=\"(key, layout) in model.layouts\" class=\"col-sm-4 margin-bottom dashboard-layout-select\"> <label ng-class=\"{active : model.selected == key}\"> <input type=radio name=selected value={{key}} ng-model=model.selected class=hidden> <pr-dashboard layout=key mock=true class=clearfix></pr-dashboard> </label> </div> </div> </div> <div class=modal-footer> <button class=\"btn btn-primary\" ng-click=select()>Save</button> <button class=\"btn btn-default\" ng-click=$dismiss()>Cancel</button> </div>");
}]);
angular.module("pr.tpls", ["src/demo/realtime/realtime.html", "src/demo/realtime/realtimeDistribution.html", "src/demo/realtime/realtimeFilters.html", "src/demo/realtime/realtimeGrid.html", "src/demo/realtime/realtimeInfoBox.html", "src/demo/realtime/realtimeMetric.html", "src/demo/realtime/realtimeRatio.html", "src/demo/realtime/realtimeTrend.html", "src/demo/traffic/traffic.html", "src/demo/traffic/trafficDetail.html", "src/demo/traffic/trafficFilters.html", "src/demo/traffic/trafficTrend.html", "src/prReporting/prDashboard/prDashboard.html", "src/prReporting/prDashboard/prDashboardWidget.html", "src/prReporting/prDashboard/prDashboardWidgetStructureModal.html", "src/prReporting/prDashboardWidgets/bar/edit.html", "src/prReporting/prDashboardWidgets/bar/view.html", "src/prReporting/prDashboardWidgets/grid/edit.html", "src/prReporting/prDashboardWidgets/grid/view.html", "src/prReporting/prDashboardWidgets/groupedBar/edit.html", "src/prReporting/prDashboardWidgets/groupedBar/view.html", "src/prReporting/prDashboardWidgets/lineWithFocus/edit.html", "src/prReporting/prDashboardWidgets/lineWithFocus/view.html", "src/prReporting/prDashboardWidgets/metric/edit.html", "src/prReporting/prDashboardWidgets/metric/view.html", "src/prReporting/prDashboardWidgets/metric/widget.html", "src/prReporting/prDashboardWidgets/pie/edit.html", "src/prReporting/prDashboardWidgets/pie/view.html", "src/prReporting/prDashboardWidgets/stack/edit.html", "src/prReporting/prDashboardWidgets/stack/view.html", "src/prReporting/prDashboardWidgets/timeline/edit.html", "src/prReporting/prDashboardWidgets/timeline/view.html", "src/prReporting/prDashboardWidgets/util/prMetricPicker.html", "src/prReporting/prDynamicFilter/prDynamicFilter.html", "src/prReporting/prGridExtensions/prGridLimitationAlert.html", "src/prReporting/prUIOption/uiGridPager.html", "src/prReporting/prUIOption/uiGridPagerSimple.html", "src/ui/admin/admin.html", "src/ui/admin/datasourceManage/add/add.html", "src/ui/admin/datasourceManage/cellTemplates/adminDatasourceOperateView.html", "src/ui/admin/datasourceManage/cellTemplates/adminDatasourceTooltipTemplate.html", "src/ui/admin/datasourceManage/datasourceManageView.html", "src/ui/admin/datasourceManage/delete/delete.html", "src/ui/admin/datasourceManage/edit/edit.html", "src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightDisplayNameView.html", "src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameSuffixView.html", "src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightNameView.html", "src/ui/admin/groupManage/cellTemplates/groupUpdate/groupUpdateRightTypeView.html", "src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupCreatorView.html", "src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupDisplayNameView.html", "src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupNameView.html", "src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupOperateView.html", "src/ui/admin/groupManage/cellTemplates/groupsView/adminGroupUsersView.html", "src/ui/admin/groupManage/delete/removeDialogTemplate.html", "src/ui/admin/groupManage/groupManageView.html", "src/ui/admin/groupManage/update/edit.html", "src/ui/creator/creator.html", "src/ui/creator/creatorDashboard.html", "src/ui/creator/modals/add.html", "src/ui/creator/modals/delete.html", "src/ui/creator/modals/layout.html"]);
/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.api', [

]);

})();
/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.api')

/**
 * @ngdoc object
 * @name pr.api.prApiProvider
 * @description
 *
 * The `prApiProvider` is used to configure the connection to the Pulsar Query API.
 */
.provider('prApi',
    function() {

      /**
       * @ngdoc method
       * @name url
       * @methodOf pr.api.prApiProvider
       * @description
       *
       * Configures the URL which will be used to call the backend (Pulsar Query API).
       *
       * @param {string} url Base URL for queries to the back-end dataSource. Defaults to the empty string`''`,
       * in which case the back-end calls will be done to the same URL as the application in the browser. *Don't add a trailiing slash.*
       */
      var apiUrl = '';
      this.url = function(url) {
        apiUrl = url || apiUrl;
      };

      /**
       * @ngdoc method
       * @name useWithCredentialsDatasource
       * @methodOf pr.api.prApiProvider
       * @description
       *
       * Configures the withCredentials flag in all XHR requests to the datasources. If not configured, defaults to `'false'`
       *
       * @param {boolean} value Values of the withCredentials flag in all requests to the datasource. Defaults to `'false'`
       */
      var withCredentialsDatasources = false;
      this.useWithCredentialsDatasources = function(value) {
        withCredentialsDatasources = !!value;
      };

      /**
       * @ngdoc method
       * @name timezone
       * @methodOf pr.api.prApiProvider
       * @description
       *
       * Configures the timezone which will be used in generating dates, should match the back-end timezone.
       *
       * @param {string} timezone Must match a timezone provided by {@link http://momentjs.com/timezone/ moment timezone}. Defaults to `'MST'`
       */
      var timezone = 'MST';
      this.timezone = function(tz) {
        timezone = tz || timezone;
      };

      /**
       * @ngdoc object
       * @name pr.api.prApi
       * @description
       *
       * An object that represents the connection to the Pulsar Query API. Contains the url of the API and other basic configuration.
       *
       * @returns {Object} self
       */
      this.$get = function() {
        return {
          /**
           * @ngdoc property
           * @name pr.api.prApi:url
           * @propertyOf pr.api.prApi
           * @description Url of the Pulsar Query API backend
           */
          url: apiUrl,

          /**
           * @ngdoc property
           * @name pr.api.prApi:withCredentialsDatasource
           * @propertyOf pr.api.prApi
           * @description Whether to set the withCredentials flag on the requests to the datasources
           */
          withCredentialsDatasources: withCredentialsDatasources,

          /**
           * @ngdoc property
           * @name pr.api.prApi:timezone
           * @propertyOf pr.api.prApi
           * @description Timezone of the backend
           */
          timezone: timezone
        };
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
 * @ngdoc overview
 * @name pr.numberfilter
 * @description
 *
 * This module groups several useful filters used for numbers
 */
angular.module('pr.numberfilter', [
    'pr.api'
]);

})();
/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.numberfilter')

/**
 * @ngdoc filter
 * @name pr.numberfilter.filter:duration
 * @function
 * @description Formats a number in miliseconds as a duration in the format HH:mm:ss (e.g. 01:59:59)
 * @param {number} n Amount in miliseconds to format, can be negative.
 */
.filter('duration',
    function() {
      function pad(num) {
        var s = num + '';
        while (s.length < 2) {
          s = '0' + s;
        }
        return s;
      }

      return function(n) {
        if (angular.isNumber(n)) {
          n = parseFloat(n);
          if (n !== n) {
            n = 0;
          }

          var duration = moment.duration(Math.abs(n), 'milliseconds');
          return (n < 0 ? '-' : '') + pad(Math.floor(duration.asHours())) + ':' + pad(duration.minutes()) + ':' + pad(duration.seconds());
        }
        return '';
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

angular.module('pr.numberfilter')

/**
 * @ngdoc filter
 * @name pr.numberfilter.filter:float
 * @deprecated
 * @function
 * @description Formats a number as a decimal. **This filter is deprecated, please use number filter instead.**
 * @param {number} n Amount to format.
 */
.filter('float',
    function($log, $filter) {
      return function(n) {
        $log.warn('"float" filter (in pr.numberfilter module) is deprecated, please use the core "number" filter');
        return $filter('number')(n, 2);
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

angular.module('pr.numberfilter')

/**
 * @ngdoc filter
 * @name pr.numberfilter.filter:percentage
 * @function
 * @description Formats a number as a percentage. (e.g. 0.45 -> 45%)
 * @param {number} n Amount to format using 1 as 100%.
 * @param {number} fractionSize Number of decimal places to round the number to, defaults to 2.
 */
.filter('percentage',
    function($filter) {
      return function(n, fractionSize) {
        fractionSize = fractionSize || 2;
        var res = $filter('number')(n * 100, fractionSize);
        return res ? res + '%' : '';
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

angular.module('pr.numberfilter')

/**
 * @ngdoc filter
 * @name pr.numberfilter.filter:range
 * @function
 * @description Creates an array of sequential n numbers such as [0, 1, 2, 3, ...]
 * @param {number} n Amount of numbers to create. Should be a positive integer.
 */
.filter('range',
    function() {
      return function(n) {
        var res = [];
        for (var i = 0; i < n; i++) {
          res.push(i);
        }
        return res;
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

angular.module('pr.numberfilter')

/**
 * @ngdoc filter
 * @name pr.numberfilter.filter:intervalDate
 * @description Formats time to be used in the queries
 *
 * @param {string|number} time Timestamp to be converted
 * @param {string=} format Format to use in returning the date. Defaults to 'X' (timestamp)
 * @param {string=} originalFormat Format. Defaults to 'YYYY-MM-DD HH:mm:ss'
 * @param {string=} timezone Timezone
 */
.filter('intervalDate',
    function(prApi) {
      return function(time, format, originalFormat, timezone) {
        originalFormat = originalFormat || 'X';
        timezone = timezone || prApi.timezone;
        format = format || 'YYYY-MM-DD HH:mm:ss';

        return moment(time, originalFormat).tz(timezone).format(format);
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
 * @ngdoc overview
 * @name pr.countto
 * @description
 *
 * pr.countto module is a wrapper for the countTo directive.
 */
angular.module('pr.countto', []);

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.countto')

/**
 * @ngdoc directive
 * @name pr.countto.directive:prCountTo
 * @scope
 * @restrict EA
 *
 * @description
 * The `prCountTo` directive displays an animated numeric count using jQuery countTo.
 *
 * https://github.com/mhuggins/jquery-countTo
 *
 * If the plugin is not present, the contents will be replaced directly in to the html tag.
 *
 * The animation lasts for 1 second.
 *
 * This directive makes use of both $timeout and setInterval to animate the number.
 *
 * @param {number} value The value to animate, animation will happen every time it changes.
 * @param {number} decimals Number of decimals
 * @param {string} placeholder Text to show in case the value is not a number: undefined or null
 */
.directive('prCountTo',
    function($compile, $parse, $timeout, $filter) {
      return {
        restrict: 'EA',
        scope: {
          value:'=',
          decimals:'=?',
          placeholder: '=?'
        },
        template: '',

        link: function(scope, element) {
          scope.placeholder = scope.placeholder || '--';

          scope.formatter = function(value) {
            return $filter('number')(value, scope.decimals || 0);
          };

          scope.$watch('value', function(newValue, oldValue) {
            if (!angular.isNumber(newValue)) {
              element.html(scope.placeholder);
            } else if (element.countTo && angular.isNumber(oldValue)) {
              $timeout(function() {
                element
                  .countTo('stop')
                  .countTo({
                    from:  oldValue,
                    to: newValue,
                    speed: 1000,
                    formatter: scope.formatter,
                    refreshInterval: 100
                  });
              }, 100);
            } else {
              element.html(scope.formatter(newValue));
            }
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

angular.module('pr.gridextensions', [
  'ui.grid',
  'ui.grid.selection',
  'ui.grid.pagination',
  'ui.bootstrap.modal'
]);

})();
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
 * @name pr.gridextensions.directive:prGridLimitation
 * @restrict A
 *
 * @description This small helper directive, when added to a ui-grid, will auto calculate the grid height dynamically.
 * Requires the grid to have a set number of rows or a pagination to work.
 *
 * @requires ui-grid
 *
 */
.directive('prGridLimitation',
    function(gridUtil, uiGridConstants, $modal) {
      return {
        restrict: 'A',
        require: 'uiGrid',
        link: function($scope, $elm, $attrs, uiGridCtrl) {
          var gridApi = uiGridCtrl.grid.api;
          var selectedRows = [];
          var maximum = $attrs.prGridLimitation;

          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            selectedRows = gridApi.selection.getSelectedRows();
            if (selectedRows.length > maximum) {
              $modal.open({
                templateUrl: 'src/prReporting/prGridExtensions/prGridLimitationAlert.html',
                backdrop: 'static',
                controller: function($scope, $modalInstance, maximum) {
                  $scope.maximum = maximum;
                  $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                  };
                },
                resolve: {
                  maximum: function() {
                    // deep copy
                    return maximum;
                  }
                }
              });
              gridApi.selection.unSelectRow(row.entity);
            }

            if (selectedRows.length > 0) {
              gridApi.grid.selection.selectAll = true;
            }
          });

          gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            if (gridApi.grid.selection.selectAll) {
              gridApi.grid.selection.selectAll = false;
              gridApi.selection.clearSelectedRows();
            } else {
              //select limited maximum rows in current page
              var paginationPageSize = gridApi.grid.options.paginationPageSize;
              var pageIndex = gridApi.pagination.getPage() - 1;
              var start = paginationPageSize * pageIndex;
              var end = (+start) + (+maximum);

              angular.forEach(rows, function(row, index) {
                row.isSelected = index >= start && index < end;
              });
            }
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

/**
 * @ngdoc overview
 * @name pr.date
 * @description
 *
 * pr.date module
 */
angular.module('pr.date', [
  'pr.api'
]);

})();
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

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

/**
 * @ngdoc overview
 * @name pr.UIOption
 * @description
 *
 * pr.UIOption module several methods to quickly create widgets with a default configuration.
 *
 * The pr.UIOption provides a service to generate several default settings, which can as well be overrided when needed.
 *
 * This module is to be used on ui-grid and angular nvd3 components
 */
angular.module('pr.UIOption', [
  'pr.numberfilter',
  'ui.grid'
]);

})();
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

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.UIOption')

.directive('prNvd3ClearTooltip',
    function() {
      var _rootScope;

      return {
        restrict: 'A',
        controller: function($rootScope) {
          _rootScope = $rootScope;
        },
        link: function(scope, element) {
          scope.$watch('api', function(api) {
            var chartScope = scope.api.getScope();

            var off = _rootScope.$on('$stateChangeSuccess', function() {
              if (chartScope.chart && chartScope.chart.tooltip) {
                d3.select('#' + chartScope.chart.tooltip.id()).remove();
              }
              off();
            });

            chartScope.$watch('chart', function(chart, oldChart) {
              // When replacing an old chart, we make sure the tooltips are removed
              if (chart.id !== oldChart.id && oldChart.tooltip) {
                d3.select('#' + oldChart.tooltip.id()).remove();
              }
            });
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

angular.module('pr.dashboard', [
  'ui.sortable',
  'ui.bootstrap.modal',
  'ngResource',

  'pr.api'
])

/**
 * @ngdoc object
 * @name pr.dashboard.AGGREGATION_TYPES
 * @description
 *
 * Defines the types of aggregations in the param queries
 *
 * @example
 * <pre>
 *   .config(function (AGGREGATION_TYPES) { (...)
 * </pre>
 */
.constant('AGGREGATION_TYPES', ['count', 'sum', 'min', 'max', 'unique'])

/**
 * @ngdoc object
 * @name pr.dashboard.GRANULARITIES
 * @description
 *
 * Defines the types of granularities in the query
 *
 * @example
 * <pre>
 *   .config(function (GRANULARITIES) { (...)
 * </pre>
 */
.constant('GRANULARITIES', [{
    name: 'all',
    displayName: '-- Choose granularity if needed --'
  }, {
    name: 'hour',
    displayName: 'Hourly'
  }, {
    name: 'day',
    displayName: 'Daily'
  }, {
    name: 'week',
    displayName: 'Weekly'
  }]);

})();
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


/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard')

/**
 * @ngdoc service
 * @name pr.dashboard.prDashboardResource
 * @description
 * The dashboard resource is a configure wrapper of a $resource class. It helps manage dashboard entities.
 *
 * The URL calls all follow the pattern: `<prApiBackendUrl>/dashboards/<dashbaordName>`
 *
 * @requires prApi
 * @requires $resource
 */
.service('prDashboardResource',
  function($resource, prApi) {
    return $resource(prApi.url + '/dashboards/:name', {name: '@name'}, {
      /**
       * @ngdoc method
       * @name get
       * @methodOf pr.dashboard.prDashboardResource
       * @description GETs a dashboard from the backend.
       * @param {object} params An object with a single param, the unique name of the dashbaord. `{name:'myDashboardName'}`
       * @param {function(value, responseHeaders) } success Success callback
       * @param {function(httpErrorResponse) } error Error callback
       * @returns {object} A dashboard object as a $resource
       */
      get: {
        method: 'GET',
        withCredentials: true
      },

      /**
       * @ngdoc method
       * @name save
       * @methodOf pr.dashboard.prDashboardResource
       * @description POSTs a dashboard to the backend.
       * @param {object} params An empty object. `{}`.
       * @param {object} postData The dahsboard object
       * @param {function(value, responseHeaders) } success Success callback
       * @param {function(httpErrorResponse) } error Error callback
       * @returns {object} A dashboard object as a $resource, which includes new name and id
       */
      save: {
        method: 'POST',
        withCredentials: true
      },

      /**
       * @ngdoc method
       * @name update
       * @methodOf pr.dashboard.prDashboardResource
       * @description PUTs (updates) a dashboard in the backend.
       * @param {function(value, responseHeaders) } success Success callback
       * @param {function(httpErrorResponse) } error Error callback
       */
      update: {
        url: prApi.url + '/dashboards',
        params: {
          name: undefined
        },
        method:'PUT',
        withCredentials: true,
        transformResponse: function(data) {
          // Explicitly return undefined. Otherwise the resource data will be replaced with
          // the result of the PUT call, which only shows the status of elements.
          return undefined;
        }
      },

      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.dashboard.prDashboardResource
       * @description GETs an array of dashboards from the backend. The list of dashboards available to the user.
       * @param {function(value, responseHeaders) } success Success callback
       * @param {function(httpErrorResponse) } error Error callback
       * @returns {object} A dashboard object as a $resource
       */
      query: {
        method: 'GET',
        isArray: true,
        withCredentials: true
      },

      /**
       * @ngdoc method
       * @name remove
       * @methodOf pr.dashboard.prDashboardResource
       * @description DELETEs a dashboard from the backend.
       * @param {function(value, responseHeaders) } success Success callback
       * @param {function(httpErrorResponse) } error Error callback
       */
      remove: {
        method: 'DELETE',
        withCredentials: true
      },

      /**
       * @ngdoc method
       * @name delete
       * @methodOf pr.dashboard.prDashboardResource
       * @description DELETEs a dashboard from the backend.
       * @param {function(value, responseHeaders) } success Success callback
       * @param {function(httpErrorResponse) } error Error callback
       */
      delete: {
        method: 'DELETE',
        withCredentials: true
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
 * @name pr.dashboard.directive:prDashboardWidget
 * @restrict E
 *
 * @description
 * The `prDashboardWidget` creates a single widget.
 *
 * A widget is a representation of data to the user. It is typically shown as a chart or table to display data in a visually
 * appealing way.
 *
 * The widget directive delegates its body of content to one of the widget directives (bar, grid, linewithfocus, ...)
 * according to the widget type (`widget.type`).
 *
 * @param {object} widget The object that displays the widget
 * @param {object} filter The query filter
 * @param {boolean=} editMode Flag to enable the widget to be editable from the UI
 * @param {object=} widgets Reference to array of widgets, so the widget can remove itself from a report.
 */
.directive('prDashboardWidget',
    function($q, $log, $modal, prDashboard, $templateCache, $sce, $http, $controller, $compile) {

      function getTemplate(widget) {
        var deferred = $q.defer();

        if (widget.template) {
          deferred.resolve(widget.template);
        } else if (widget.templateUrl) {
          // try to fetch template from cache
          var tpl = $templateCache.get(widget.templateUrl);
          if (tpl) {
            deferred.resolve(tpl);
          } else {
            var url = $sce.getTrustedResourceUrl(widget.templateUrl);
            $http.get(url)
              .success(function(response) {
                // put response to cache, with unmodified url as key
                $templateCache.put(widget.templateUrl, response);
                deferred.resolve(response);
              })
              .error(function() {
                deferred.reject('could not load template');
              });
          }
        }

        return deferred.promise;
      }

      function compileWidget($scope, $element, currentScope) {
        var content = prDashboard.widgets[$scope.widget.type];

        // create new scope
        var templateScope = $scope.$new();

        // local injections
        var base = {
          $scope: templateScope,
          widgetParams: $scope.widget.params,
          widgetOptions: $scope.widget.options
        };

        // get resolve promises from content object
        var resolvers = {};
        resolvers.$tpl = getTemplate(content);
        if (content.resolve) {
          angular.forEach(content.resolve, function(promise, key) {
            if (angular.isString(promise)) {
              resolvers[key] = $injector.get(promise);
            } else {
              resolvers[key] = $injector.invoke(promise, promise, base);
            }
          });
        }

        // resolve all resolvers
        $q.all(resolvers).then(function(locals) {
          angular.extend(locals, base);

          // compile & render template
          var template = locals.$tpl;
          var body = $element.find('.widgetContent');

          body.html(template);
          if (content.controller) {
            var templateCtrl = $controller(content.controller, locals);
            body.children().data('$ngControllerController', templateCtrl);
          }

          $compile(body.contents())(templateScope);
        }, function(reason) {
          // handle promise rejection
          var msg = 'Could not resolve all promises';
          if (reason) {
            msg += ': ' + reason;
          }
          var body = $element.find('.widgetContent');
          body.html(dashboard.messageTemplate.replace(/{}/g, msg));
          $log.warn(msg);
        });

        return templateScope;
      }

      return {
        restrict: 'E',
        templateUrl: 'src/prReporting/prDashboard/prDashboardWidget.html',
        transclude: true,
        scope: {
          widget:'=',
          filters: '=',
          editMode: '=?',
          widgets:'=?'
        },
        controller: function($scope, $element) {
          $scope.isCollapsed = false;
          $scope.icon = prDashboard.widgets[$scope.widget.type].icon;
          $scope.title = $scope.widget.title;
          $scope.widget.params = $scope.widget.params || {};
          $scope.status = {
            name: 'new',
            errorMessage: null
          };
        },

        link: function(scope, element) {
          compileWidget(scope, element);

          scope.$on('statusChanged', function(e, newStatus, errorMessage, errorResult) {
            scope.status = {
              name: newStatus,
              httpStatus: errorResult ? errorResult.status : undefined,
              errorMessage: errorMessage
            };
            if (errorMessage) {
              $log.error('Widget SQL error: ' + errorMessage, errorResult);
            }
          });

          scope.remove = function() {
            var widgets = scope.widgets;
            if (widgets) {
              var index = widgets.indexOf(scope.widget);
              if (index >= 0) {
                widgets.splice(index, 1);
              }
            }

            scope.$destroy();
            element.remove();
          };

          scope.getSummary = function() {
            var params = scope.widget.params;
            var dims = _.reduce(params.dimensions, function(names, dim) {
              names.push(dim.name);
              return names;
            }, []);
            return 'Dimensions: ' + _.escape(dims.join(', '));
          };

          scope.showStructure = function() {
            var modalInstance;
            modalInstance = $modal.open({
              scope: scope,
              backdrop: 'static',
              templateUrl: 'src/prReporting/prDashboard/prDashboardWidgetStructureModal.html',
              size: 'lg'
            });
          };

          scope.edit = function() {
            var widgetType = prDashboard.widgets[scope.widget.type];

            if (widgetType) {
              // Create new params and options to modify freely,
              // without updating the widget unless is saved.
              var modalInstance;
              var newParams = angular.copy(scope.widget.params);
              var newOptions = angular.copy(scope.widget.options);
              var editScope = scope.$new();

              /**
               * Saves the grid widget configuration
               * @return {[type]} [description]
               */
              editScope.save = function() {
                newOptions.disabled = false; /* On save, the widget is always enabled */
                if (!angular.equals(newParams, scope.widget.params)) {
                  scope.widget.params = newParams;
                }
                if (!angular.equals(newOptions, scope.widget.options)) {
                  scope.widget.options = newOptions;
                }
                modalInstance.close();
              };

              modalInstance = $modal.open({
                scope: editScope,
                backdrop: 'static',
                template: widgetType.edit.template,
                templateUrl: widgetType.edit.templateUrl,
                controller: widgetType.edit.controller,
                size: 'lg',
                resolve: {
                  widgetParams: function() {
                    return newParams;
                  },

                  widgetOptions: function() {
                    return newOptions;
                  }
                }
              });
            }
          };

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

/**
 * @ngdoc overview
 * @name pr.dashboard.layouts
 * @description
 *
 * pr.dashboard.layouts is an optional module that can be included a add several default layouts based in Bootsrap 3.
 *
 * The dashboards use the class col-sm-* so will collapse to single columns layouts in most mobile phones.
 *
 */
angular.module('pr.dashboard.layouts', [
  'pr.dashboard'
]);

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.layouts')

.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:12
       * @description
       *
       * Defines a single column layout for the dashboard.
       *
       * Uses Bootstap 3 class col-sm-12
       */
      prDashboardProvider.layout('12', {
        displayName: '1 full width column',
        columns: [{
          mockContent: '100%',
          styleClass: 'col-sm-12',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:6-6
       * @description
       *
       * Defines a 2-column layout for the dashboard.
       *
       * Uses Bootstap 3 class col-sm-6
       */
      prDashboardProvider.layout('6-6', {
        displayName: '2 columns (50% - 50%)',
        columns: [{
          mockContent: '50%',
          styleClass: 'col-sm-6',
          widgets: []
        }, {
          mockContent: '50%',
          styleClass: 'col-sm-6',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:3-3-3-3
       * @description
       *
       * Defines a 4-column layout for the dashboard. Each column is 25% width.
       *
       * Uses Bootstap 3 class col-sm-3
       */
      prDashboardProvider.layout('3-3-3-3', {
        displayName: '4 columns (25% each)',
        columns: [{
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }, {
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }, {
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }, {
          mockContent: '25%',
          styleClass: 'col-sm-3',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:4-8
       * @description
       *
       * Defines a 2-column layout for the dashboard. With 33% and 66% width respectively.
       *
       * Uses Bootstap 3 class col-sm-4 and col-sm-8
       */
      prDashboardProvider.layout('4-8', {
        displayName: '2 columns (33% - 66%)',
        columns: [{
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }, {
          mockContent: '66%',
          styleClass: 'col-sm-8',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:8-4
       * @description
       *
       * Defines a 2-column layout for the dashboard. With 66% and 33% width respectively.
       *
       * Uses Bootstap 3 class col-sm-8 and col-sm-4
       */
      prDashboardProvider.layout('8-4', {
        displayName: '2 columns (66% - 33%)',
        columns: [{
          mockContent: '66%',
          styleClass: 'col-sm-8',
          widgets: []
        }, {
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }]
      });

      /**
       * @ngdoc object
       * @name pr.dashboard.layouts.object:4-4-4
       * @description
       *
       * Defines a 3-column layout for the dashboard. Each column is 33.3% width.
       *
       * Uses Bootstap 3 class col-sm-4
       */
      prDashboardProvider.layout('4-4-4', {
        displayName: '3 columns',
        columns: [{
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }, {
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }, {
          mockContent: '33%',
          styleClass: 'col-sm-4',
          widgets: []
        }]
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

angular.module('pr.dashboard.widgets.grid', [
    'pr.dashboard',

    'ui.select',
    'ngSanitize',

    'ui.grid',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.autoResize',

    'pr.gridextensions',
    'pr.UIOption',

    'pr.datasource.sql',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.grid.widget:pr-grid
       * @description
       *
       * Widget for {@link http://ui-grid.info/ ui-grid}. This widget displays data in a table format and performs
       * very little formatting of the original data.
       *
       * It supports both several dimensions and several metrics simultaneoustly which allows users to
       * explore data in detail. ui-grid offers high performance for high quantities of rows of data.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-grid",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       },
       *       {
       *         "name": "trafficsource"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }, {
       *         "name": "gmv_ag",
       *         "type": "sum",
       *         "alias": "gmv_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A grid widget",
       *     "disabled": false,
       *     "grid" : {
       *        // Additional options that will be sent ui-grid, see http://ui-grid.info/docs/#/tutorial
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-grid', {
          label: 'Table',
          icon: 'fa fa-table',
          templateUrl: 'src/prReporting/prDashboardWidgets/grid/view.html',
          controller: 'prGridWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/grid/edit.html',
            controller: 'prGridWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.grid.directive:prGridWidget
 * @restrict E
 *
 * @description
 * The `prGridWidget` pulls data and presents it as a grid based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before placing it in the grid.
 */
.directive('prGridWidget', function($compile, prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div ng-if="!grid.gridOptions.enableRowSelection" ui-grid="grid.gridOptions" ui-grid-pagination ui-grid-auto-resize pr-grid-height class="grid"></div>' +
                  '<div ng-if="grid.gridOptions.enableRowSelection" ui-grid="grid.gridOptions" ui-grid-selection ui-grid-pagination ui-grid-auto-resize pr-grid-height class="grid"></div>',

        scope: {
          params: '=',
          options: '=?',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs, $element) {
          $scope.options = $scope.options || {};

          $scope.grid = {
            gridOptions: prUIOptionService.getSimpleGridOptions($scope.options.grid || {})
          };

          $scope.addFilter = function(dimensionName, dimensionValue) {
            $scope.filters.where = $scope.filters.where || {};
            $scope.filters.where[dimensionName] = dimensionValue;
          };
        },

        link: function(scope, element, attrs) {
          var staticColumnDefs = scope.grid.gridOptions.columnDefs;

          scope.$watch(function() {
            // Use a watch function, becuase watchGroup doesn't support deep equality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);

            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 100;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');

              var columnDefs = staticColumnDefs;
              if (!columnDefs) {
                columnDefs = [];
                angular.forEach(newParams.dimensions, function(dimension) {
                  columnDefs.push({
                    field: dimension.name,
                    cellTemplate:
                      '<div class="ui-grid-cell-contents">' +
                        '<a href title="{{COL_FIELD}}" ng-click="grid.appScope.addFilter(\'' + dimension.name + '\', grid.getCellValue(row, col))">' +
                          '{{COL_FIELD}}' +
                        '</a>' +
                      '</div>'
                  });
                });

                angular.forEach(newParams.metrics, function(metric) {
                  var field = metric.alias || metric.name + ' ' + metric.type;
                  columnDefs.push({
                    field: field,
                    displayName: field,
                    cellClass: 'text-right',
                    cellFilter: metric.filter || 'number'
                  });
                });
              }

              prDatasourceSqlService.getDataset({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                // Reset grid options to force to recreate the grid
                scope.grid.gridOptions.data = [];
                scope.grid.gridOptions.columnDefs = [];

                // Add timestamp if present
                if (!staticColumnDefs && results.length && results[0].timestamp) {
                  columnDefs.push({
                    field: 'timestamp',
                    cellFilter: 'date:\'short\''
                  });
                }
                scope.grid.gridOptions.columnDefs = columnDefs;
                scope.grid.gridOptions.data = results;

                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.grid.gridOptions.data = [];
                scope.grid.gridOptions.columnDefs = [];
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prGridWidget',
    function($scope, widgetParams, widgetOptions) {

    })

.controller('prGridWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES, GRANULARITIES) {

      /**
       * Initializes dimensions and metrics options according to a data source.
       * @param  {string} dataSource Name of data source
       */
      $scope.initDimensionsAndMetrics = function() {
        prDatasourceSqlService.getDimensions({}, $scope.newParams,
          function(data) {
            $scope.dimensions = data;
          },
          function(error) {
            //TODO handle this error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //TODO handle this error
          });

        $scope.granularities = angular.copy(GRANULARITIES);
      };

      // INIT

      // Init parameters
      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 100;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.dimensions = [];
          $scope.newParams.metrics = [];
          $scope.initDimensionsAndMetrics();
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

angular.module('pr.dashboard.widgets.pie', [
    'nvd3',

    'pr.dashboard',
    'pr.datasource.sql',
    'pr.UIOption',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.pie.widget:pr-pie
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/pie.html nvd3 pie chart}. This widget displays data in
       * a chart for a single metric and a single dimension.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-pie",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A pie chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/pie.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-pie', {
          label: 'Pie',
          icon: 'fa fa-pie-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/pie/view.html',
          controller: 'prPieWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/pie/edit.html',
            controller: 'prPieWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.pie.directive:prPieWidget
 * @restrict E
 *
 * @description
 * The `prPieWidget` pulls data and presents it as a pie chart based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prPieWidget',
    function($filter, prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="pieChart.data" options="pieChart.options" pr-nvd3-clear-tooltip api="api" ng-class="{interactive: pieChart.options.chart.pie.dispatch.elementClick}"></nvd3></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          var height = 340;
          $scope.options = $scope.options || {};
          if ($scope.options.chart && $scope.options.chart.height) {
            height = $scope.options.chart.height;
          }
          $scope.height = height + 40;

          var defaults = {
            height: height,
            tooltip: {
              keyFormatter: function(d) {
                if (!$scope.params.metrics || !$scope.params.metrics[0]) {
                  return d;
                } else {
                  var metric = $scope.params.metrics[0];
                  return (d ? d + ' ' : '') + metric.alias || metric.name;
                }
              }
            },
            pie: {
              dispatch: {
                elementClick: function(e) {
                  if ($scope.filters.where) {
                    var dimensionName = $scope.params.dimensions[0].name;
                    $scope.filters.where[dimensionName] = e.data.x;
                    $scope.$apply();
                  }
                }
              }
            }
          };

          $scope.pieChart = {
            options: prUIOptionService.getPieChartOptions(angular.merge(defaults, $scope.options.chart || {}))
          };
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, becuase watchGroup doesn't support objectEquality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more by modifing
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 10;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');

              if (scope.pieChart.options.chart.width === 0) {
                scope.pieChart.options.chart.width = undefined;
              }

              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                // Only the first series to create pie chart.
                var data = [];
                if (results[0]) {
                  data = results[0].values;
                  var total = 0;
                  angular.forEach(data, function(val, index) {
                    total += val.y;
                  });
                  if (total === 0) {
                    data = [];
                  }
                }
                scope.pieChart.data = data;
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.pieChart.data = [];
                scope.pieChart.options.chart.width = 0;
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prPieWidget',
    function($scope, widgetParams, widgetOptions) {

    })

.controller('prPieWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES) {

      /**
       * Initializes dimensions and metrics options according to a data source.
       * @param  {string} dataSource Name of data source
       */
      $scope.initDimensionsAndMetrics = function() {
        prDatasourceSqlService.getDimensions({}, $scope.newParams,
          function(data) {
            $scope.dimensions = data;
          },
          function(error) {
            //To handler the error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
      };

      // INIT

      // Init parameters
      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 10;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.dimensions = [];
          $scope.newParams.metrics = [];
          $scope.initDimensionsAndMetrics();
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

angular.module('pr.dashboard.widgets.bar', [
    'pr.dashboard',
    'nvd3',
    'pr.UIOption',
    'pr.datasource.sql',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.bar.widget:pr-bar
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/discreteBar.html nvd3 discrete bar chart}. This widget displays data in
       * a chart for a single metric and a single dimension.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-bar",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A bar chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/discreteBar.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-bar', {
          label: 'Bar',
          icon: 'fa fa-bar-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/bar/view.html',
          controller: 'prBarWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/bar/edit.html',
            controller: 'prBarWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.bar.directive:prBarWidget
 * @restrict E
 *
 * @description
 * The `prBarWidget` pulls data and presents it as a bar chart based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying on the chart.
 */
.directive('prBarWidget', function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="barChart.data" options="barChart.options" pr-nvd3-clear-tooltip api="api" class="interactive"></nvd3></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          var height = 340;
          $scope.options = $scope.options || {};
          if ($scope.options.chart && $scope.options.chart.height) {
            height = $scope.options.chart.height;
          }
          $scope.height = height + 40;

          var defaults = {
            height: height,
            tooltip: {
              keyFormatter: function(d) {
                if (!$scope.params.metrics || !$scope.params.metrics[0]) {
                  return d;
                } else {
                  var metric = $scope.params.metrics[0];
                  return (d ? d + ' ' : '') + metric.alias || metric.name;
                }
              }
            }
          };

          $scope.barChart = {
            options: prUIOptionService.getDiscreteBarChartOptions(angular.merge(defaults, $scope.options.chart || {}))
          };
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, because watchGroup doesn't support deep equality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 10;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.barChart.data = results;
                scope.barChart.options.chart.xAxis = {axisLabel: results[0].key};
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.barChart.data = [];
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prBarWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prBarWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES) {
      /**
       * Initializes dimensions and metrics options according to a data source.
       */
      $scope.initDimensionsAndMetrics = function() {
        prDatasourceSqlService.getDimensions({}, $scope.newParams,
          function(data) {
            $scope.dimensions = data;
          },
          function(error) {
            //To handler the error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
      };

      // INIT

      // Init parameters

      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 10;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      },
      function(error) {
        //To handler the error
      });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.dimensions = [];
          $scope.newParams.metrics = [];
          $scope.initDimensionsAndMetrics();
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

angular.module('pr.dashboard.widgets.timeline', [
    'pr.dashboard',

    'nvd3',
    'pr.datasource.sql',
    'pr.UIOption'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.timeline.widget:pr-timeline
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/line.html nvd3 line chart in a time series}. This widget displays data in
       * a chart for a single metric and no dimensions, a granularity different from `'all'` is required.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-stack",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A stacked area chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/line.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-timeline', {
          label: 'Timeline',
          icon: 'fa fa-clock-o',
          templateUrl: 'src/prReporting/prDashboardWidgets/timeline/view.html',
          controller: 'prTimelineWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/timeline/edit.html',
            controller: 'prTimelineWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.timeline.directive:prTimelineWidget
 * @restrict E
 *
 * @description
 * The `prTimelineWidget` pulls data and presents it as a time line chart based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prTimelineWidget',
    function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="{{height}}px"><nvd3 data="lineChart.data" options="lineChart.options"></nvd3><div ng-show="wait" class="overlay"><i class="fa fa-refresh fa-spin"></i></div></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs, prApi) {
          $scope.options = $scope.options || {};

          var height = $scope.options.height || 180;
          $scope.height = height + 20;

          $scope.defaults = {
            margin: {
              top: 20,
              right: 50,
              bottom: 20,
              left: 80
            },
            height: height,
            xAxis: {
              axisLabel: 'Time',
              tickFormat: function(d) {
                console.lo
                return prUIOptionService.getxAxisTickFormat(d, $scope.params.granularity, prApi.timezone);
              }
            },
            showLegend: true
          };

          $scope.lineChart = {
            options: prUIOptionService.getTimeLineChartOptions(angular.merge($scope.defaults, $scope.options.chart || {}))
          };
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, because watchGroup doesn't support objectEquality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 100;

            // Format the xAxis to timestamp if the isTimeLine is true.
            newParams.isTimeline = true;
            if (!scope.lineChart.data) {
              scope.lineChart.data = [];
            }
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }
            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }
                scope.lineChart.data = results;
                scope.lineChart.options = prUIOptionService.getTimeLineChartOptions(angular.merge(scope.defaults, scope.options.chart || {}));

                if (scope.options.isArea) {
                  angular.forEach(scope.lineChart.data, function(data) {
                    data.area = true;
                  });
                }
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.lineChart.data = [];
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prTimelineWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prTimelineWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES, GRANULARITIES) {
      /**
       * Initializes metrics options according to a data source.
       */
      $scope.init = function() {
        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
      };

      // INIT

      // Init parameters
      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      if (angular.isUndefined($scope.options.isArea)) {
        $scope.options.isArea = false;
      }
      $scope.newParams.maxResults = widgetParams.maxResults || 100;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      },
      function(error) {
        //To handler the error
      });

      // Init granularity select items, disable 'all' option.
      $scope.granularities = angular.copy(GRANULARITIES);
      $scope.granularities.splice(0, 1);
      if ($scope.newParams.granularity == 'all') {
        $scope.newParams.granularity = $scope.granularities[0].name;
      }

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.init();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.metrics = [];
          $scope.init();
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

angular.module('pr.dashboard.widgets.linewithfocus', [
    'nvd3',

    'pr.datasource.sql',
    'pr.dashboard',
    'pr.UIOption',

    'pr.dashboard.widgets.util'
])
.config(
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.linewithfocus.widget:pr-line-with-focus
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/lineWithFocus.html nvd3 line with view chart}. This widget displays data in
       * a chart for a single metric and no dimensions, a granularity that is not `'all'` is required.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-stack",
       *   "params": {
       *     "dimensions": [], // No dimensions
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A stacked area chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/lineWithFocus.html
       *     }
       *   }
       * }
       * ```
       *
       */
    function(prDashboardProvider) {
      prDashboardProvider
        .widget('pr-line-with-focus', {
          label: 'Line with Focus',
          icon: 'fa fa-line-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/lineWithFocus/view.html',
          controller: 'prLineWithFocusWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/lineWithFocus/edit.html',
            controller: 'prLineWithFocusWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.linewithfocus.directive:prLineWithFocusWidget
 * @restrict E
 *
 * @description
 * The `prTimelineWidget` pulls data and presents it as a line chart with a focus area based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prLineWithFocusWidget', function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="lineChart.data" options="lineChart.options"></nvd3><div ng-show="wait" class="overlay"><i class="fa fa-refresh fa-spin"></i></div></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          var height = 340;
          $scope.options = $scope.options || {};
          if ($scope.options.chart && $scope.options.chart.height) {
            height = $scope.options.chart.height;
          }
          $scope.height = height + 40;
          $scope.defaults = {
            height: height,
            showLegend: true
          };
          $scope.lineChart = {
            options: prUIOptionService.getLineWithFocusOptions(angular.merge($scope.defaults, $scope.options.chart || {}))
          };
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, becuase watchGroup doesn't support objectEquality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 100;
            newParams.isTimeline = true;
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              scope.lineChart.data = [];

              prDatasourceSqlService.getHistogram({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.lineChart.data = results;
                scope.lineChart.options = prUIOptionService.getLineWithFocusOptions(angular.merge(scope.defaults, scope.options.chart || {}));
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.lineChart.data = [];
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prLineWithFocusWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prLineWithFocusWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES) {
      /**
       * Initializes dimensions and metrics options according to a data source.
       * @param  {string} dataSource Name of data source
       */
      $scope.init = function() {
        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
        $scope.newParams.granularity = 'five_minute';
      };

      // INIT

      // Init parameters
      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 100;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.init();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.metrics = [];
          $scope.init();
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

angular.module('pr.dashboard.widgets.stack', [
    'nvd3',

    'pr.dashboard',
    'pr.UIOption',

    'pr.datasource.sql',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.stack.widget:pr-stack
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/stackedArea.html nvd3 stack area chart}. This widget displays data in
       * a chart for a single metric and no dimensions, a granularity that is not `'all'` is required.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-stack",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A stacked area chart widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/pie.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-stack', {
          label: 'Stack',
          icon: 'fa fa-area-chart',
          templateUrl: 'src/prReporting/prDashboardWidgets/stack/view.html',
          controller: 'prStackWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/stack/edit.html',
            controller: 'prStackWidgetEdit'
          }
        });
    })

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.stack.directive:prStackWidget
 * @restrict E
 *
 * @description
 * The `prStackWidget` pulls data and presents it as a stacked area char based on the parameters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before displaying it on the chart.
 */
.directive('prStackWidget', function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="stackChart.data" options="stackChart.options" class="interactive"></nvd3><div ng-show="wait" class="overlay"><i class="fa fa-refresh fa-spin"></i></div></div>',

        scope: {
          params: '=',
          options: '=?',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          var height = 340;
          $scope.options = $scope.options || {};
          if ($scope.options.chart && $scope.options.chart.height) {
            height = $scope.options.chart.height;
          }
          $scope.height = height + 40;

          $scope.defaults = {
            height: height,
            xScale:  d3.time.scale(),
            showLegend: true
          };
          $scope.stackChart = {
            options: prUIOptionService.getStackedAreaChartOptions(angular.merge($scope.defaults, $scope.options.chart || {}))
          };
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, becuase watchGroup doesn't support objectEquality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 200;
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getStackDataset({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.stackChart.data = results;
                scope.stackChart.options = prUIOptionService.getStackedAreaChartOptions(angular.merge(scope.defaults, scope.options.chart || {}));
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })

.controller('prStackWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prStackWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES, GRANULARITIES) {
      /**
       * Initializes dimensions and metrics options according to a data source.
       * @param  {string} dataSource Name of data source
       */
      $scope.initDimensionsAndMetrics = function() {
        prDatasourceSqlService.getDimensions({}, $scope.newParams,
          function(data) {
            $scope.dimensions = data;
          },
          function(error) {
            //To handler the error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
      };

      // Init parameters
      $scope.newParams = widgetParams;

      var granularities = angular.copy(GRANULARITIES);
      granularities.shift();

      if (!$scope.newParams.granularity || $scope.newParams.granularity === 'all') {
        $scope.newParams.granularity = granularities[0].name;
      }
      $scope.granularities = granularities;

      $scope.options = widgetOptions;
      $scope.newParams.maxResults = widgetParams.maxResults || 200;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.dimensions = [];
          $scope.newParams.metrics = [];
          $scope.initDimensionsAndMetrics();
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

angular.module('pr.dashboard.widgets.metric', [
    'pr.dashboard',
    'pr.countto',
    'pr.datasource.sql',
    'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.metric.widget:pr-metric
       * @description
       *
       * Widget for a single metric view. Uses the style of {@link https://almsaeedstudio.com/themes/AdminLTE/pages/widgets.html Admin LTE widgets (style as in third row)}.
       * This widget displays data as a single animated value of a single metric, no dimensions are allowed.
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-metric",
       *   "params": {
       *     "dimensions": [], // No dimensions
       *     "metrics": [{
       *         "name": "gmv_ag",
       *         "type": "sum",
       *         "alias": "gmv_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A metric widget",
       *     "disabled": false,
       *     "icon": A string wit the class for an icon. Defaults to 'fa fa-heartbeat' (http://fortawesome.github.io/Font-Awesome/icon/heartbeat/)
       *     "description": "A description of the value, displayed on top of the value",
       *     "subDescription": "A small notice at the bottom of the value",
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-metric', {
          label: 'Metric',
          icon: 'fa fa-gears',
          templateUrl: 'src/prReporting/prDashboardWidgets/metric/view.html',
          controller: 'prMetricWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/metric/edit.html',
            controller: 'prMetricWidgetEdit'
          }
        });
    })
/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.metric.directive:prMetricWidget
 * @restrict E
 *
 * @description
 * The `prMetricWidget` pulls data and presents it as an animated metric.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters Query filters
 * @param {function=} transformData Transforms data before showing the metric.
 */
.directive('prMetricWidget',
    function(prDatasourceSqlService) {
      return {
        restrict: 'E',
        templateUrl: 'src/prReporting/prDashboardWidgets/metric/widget.html',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          $scope.options = $scope.options || {};
          $scope.icon = $scope.options.icon || 'fa fa-heartbeat';
        },

        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, becuase watchGroup doesn't support objectEquality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);
            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = 1;

            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');

              prDatasourceSqlService.getMetricData({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.totalNumber = results;
                scope.$emit('statusChanged', 'done');
              },

              function(result) {
                scope.totalNumber = null;
                scope.$emit('statusChanged', 'error', result.data.error, result);
              });
            }
          }, true);
        }
      };
    })
.controller('prMetricWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prMetricWidgetEdit',
    function(widgetParams, widgetOptions, $scope, prDatasourceSqlService, AGGREGATION_TYPES) {

      /**
       * Initializes metrics options according to a data source.
       */
      $scope.initMetrics = function() {
        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handler the error
          });
      };

      // INIT

      // Init parameters
      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams, function(data) {
        $scope.tables = data;
      });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initMetrics();
      }

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.metrics = [];
          $scope.initMetrics();
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

angular.module('pr.dashboard.widgets.groupedBar', [
  'pr.dashboard',
  'nvd3',
  'pr.UIOption',
  'pr.datasource.sql',
  'pr.dashboard.widgets.util'
])
.config(
    function(prDashboardProvider) {
      /**
       * @ngdoc object
       * @name pr.dashboard.widgets.groupedBar.widget:pr-grouped-bar
       * @description
       *
       * Widget for {@link http://nvd3.org/examples/multiBar.html nvd3 multiBar}. This widget displays data in an advanced
       * multidimensional multi-bar nvd3 chart.
       *
       * It supports 2 modes.
       *
       * **Single metric and 2 dimensions:** To group a dimension inside another one, and display the values of a metric
       * for it.
       *
       * **Multiple metrics and 1 dimension:** To group several values of a metric grouped by a dimension. *Note: As
       * several metrics are displayed in the same scale, the y-axis units may not be meaningful.*
       *
       * Usage:
       *
       * **HTML:**
       * ```html
       * <pr-dashboard-widget widget="widget"></pr-dashboard-widget>
       * ```
       *
       * **JS:**
       * ```js
       * $scope.widget = {
       *   "type": "pr-grouped-bar",
       *   "params": {
       *     "dimensions": [
       *       {
       *         "name": "browserfamily"
       *       },
       *       {
       *         "name": "trafficsource"
       *       }
       *     ],
       *     "metrics": [
       *       {
       *         "name": "clickcount_ag",
       *         "type": "count",
       *         "alias": "clickcount_ag"
       *       }
       *     ],
       *     "maxResults": 100
       *     "granularity": "all",
       *     "dataSourceName": "pulsar_ogmb"
       *   },
       *   "options": {
       *     "title": "A grid widget",
       *     "disabled": false,
       *     "chart" : {
       *        // Additional options that will be sent to nvd3 chart, example available at http://nvd3.org/examples/multiBar.html
       *     }
       *   }
       * }
       * ```
       *
       */
      prDashboardProvider
        .widget('pr-grouped-bar', {
          label: 'Grouped Bar',
          icon: 'fa fa-tasks fa-rotate-270',
          templateUrl: 'src/prReporting/prDashboardWidgets/groupedBar/view.html',

          controller: 'prGroupedBarWidget',

          edit: {
            templateUrl: 'src/prReporting/prDashboardWidgets/groupedBar/edit.html',
            controller: 'prGroupedBarWidgetEdit'
          }
        });
    })
/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.groupedBar.directive:prGroupedBarWidget
 * @restrict E
 *
 * @description
 * The `prGroupedBarWidget` loads data and presents it as a multiBarChart based on the parmeters.
 *
 * @param {object} params Params
 * @param {object=} options Options
 * @param {object} filters Filters
 */
.directive('prGroupedBarWidget',
    function(prDatasourceSqlService, prUIOptionService) {
      return {
        restrict: 'E',
        template: '<div style="height:{{height}}px"><nvd3 data="groupedBarChart.data" options="groupedBarChart.options" class="interactive"></nvd3></div>',

        scope: {
          params: '=',
          options: '=',
          filters: '=',
          transformDataFn: '&transformData'
        },

        controller: function($scope, $attrs) {
          $scope.groupedBarChart = {};

          var height = 340;
          $scope.options = $scope.options || {};
          if ($scope.options.chart && $scope.options.chart.height) {
            height = $scope.options.chart.height;
          }
          $scope.height = height + 40;
          $scope.defaults = {
            height: height,
            margin: {
              top: 5,
              right: 5,
              bottom: 5,
              left: 100
            },
            showLegend: true
          };
          $scope.groupedBarChart.options = prUIOptionService.getGroupedBarChartOptions(angular.merge($scope.defaults, $scope.options.chart || {}));

        },
        link: function(scope, attrs) {
          scope.$watch(function() {
            // Use a watch function, because watchGroup doesn't support deep equality (angular.equals)
            return {
              filters: scope.filters,
              params: scope.params,
              options: scope.options
            };
          }, function(newVals) {
            // Use copies to prevent the $watch to be called once more
            var newParams = angular.copy(newVals.params);

            newParams.filters = angular.copy(newVals.filters);
            newParams.maxResults = newParams.maxResults || 40;
            // Init show legend.
            if (!scope.options.chart || scope.options.chart.showLegend === undefined) {
              scope.options.chart = scope.options.chart || {};
              scope.options.chart.showLegend = scope.defaults.showLegend;
            }
            if (!scope.options.disabled) {
              scope.$emit('statusChanged', 'wait');
              prDatasourceSqlService.getGroupedBarData({dataSourceName: newParams.dataSourceName}, newParams, function(results) {
                var transformData = scope.transformDataFn();
                if (transformData) {
                  results = transformData(results);
                }

                scope.groupedBarChart.data = results;
                scope.groupedBarChart.options = prUIOptionService.getGroupedBarChartOptions(angular.merge(scope.defaults, scope.options.chart || {}));

                if (results && results[0]) {
                  if (newParams.dimensions[0]) {
                    scope.groupedBarChart.options.chart.xAxis = {axisLabel: newParams.dimensions[0].name};
                  }
                }

                scope.$emit('statusChanged', 'done');
              },
                function(result) {
                  scope.$emit('statusChanged', 'error', result.data.error, result);
                });
            }
          }, true);
        }
      };
    })
.controller('prGroupedBarWidget',
    function($scope, widgetParams, widgetOptions) {
    })

.controller('prGroupedBarWidgetEdit',
    function($scope, widgetParams, widgetOptions, prDatasourceSqlService, AGGREGATION_TYPES) {
      /**
       * Initializes dimensions and metrics options according to a data source.
       */
      $scope.initDimensionsAndMetrics = function() {
        prDatasourceSqlService.getDimensions({}, $scope.newParams,
          function(data) {
            $scope.dimensions = data;
          },
          function(error) {
            //To handle the error
          });

        prDatasourceSqlService.getMetrics({}, $scope.newParams,
          function(data) {
            $scope.metrics = data;
          },
          function(error) {
            //To handle the error
          });
      };

      // INIT

      // Init parameters

      $scope.newParams = widgetParams;
      $scope.options = widgetOptions;
      $scope.multipleMetrics = widgetParams.metrics && widgetParams.metrics.length > 1;
      $scope.newParams.maxResults = widgetParams.maxResults || 40;

      // Init data source select items.
      prDatasourceSqlService.getTables({}, $scope.newParams,
        function(data) {
          $scope.tables = data;
        },
        function(error) {
          //To handler the error
        });

      // Init aggregation
      $scope.aggregationTypes = AGGREGATION_TYPES;

      if ($scope.newParams.table) {
        $scope.initDimensionsAndMetrics();
      }

      $scope.$watch('multipleMetrics', function(isMultipleMetrics) {
        if (isMultipleMetrics) {
          // Ensure a single dimension if using multiple metrics
          $scope.newParams.dimensions.splice(1, $scope.newParams.dimensions.length - 1);
        }
      });

      //Reset widget info in case the source changes
      $scope.$watch('newParams.table', function(newTable, oldTable) {
        if (newTable !== oldTable) {
          $scope.newParams.dimensions = [];
          $scope.newParams.metrics = [];
          $scope.initDimensionsAndMetrics();
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

angular.module('pr.dashboard.widgets.util', []);

})();
/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.dashboard.widgets.util')

/**
 * @ngdoc directive
 * @name pr.dashboard.widgets.util.directive:prMetricPicker
 * @restrict E
 * @scope
 *
 * @description
 * The `prMetricPicker` creates a picker for one or more metrics from a list of metric options and aggregation types.
 *
 * It's model is the `metrics` attribute. `metrics` will be updated as the user adds them on the UI. `metrics`
 * will update via two-way binding.
 *
 * Attributes `metric-options` and `aggregation-options` added into the directive will display options
 * to the user to create the list of metrics.
 *
 * @param {Array<object>} metrics The model, which contains the list of selected metrics.
 *   Each metric contains the following properties
 *   - `name` - `{string=}` - Column name in the data source query
 *   - `type` - `{string=}` - Aggregation type (count, sum, etc...)
 *   - `alias` - `{string=}` - Column alias in the data source query
 *
 * @param {boolean} multiple `true` if the user can input multiple metrics, `false` to allow one single metric.
 * @param {Array<object>} metricOptions The array of metric options
 *   Each metric option contains the following properties
 *   - `name` - `{string=}` - Name of the metric
 *
 * @param {Array<string>} aggregationOptions Array of string containing the kinds of aggregations that are allowed for the
 * metrics. (eg. "count", "sum", "min", "max", "unique")
 */
.directive('prMetricPicker', function() {
    return {
      restrict: 'E',
      scope: {
        metrics: '=',
        multiple: '=?',
        metricOptions: '=',
        aggregationOptions: '='
      },
      templateUrl: 'src/prReporting/prDashboardWidgets/util/prMetricPicker.html',
      link: function(scope) {

        scope.metrics = scope.metrics || [];

        function newMetric(metricName) {
          var type = null;
          if (scope.aggregationOptions && scope.aggregationOptions.length) {
            type = scope.aggregationOptions[0];
          }
          return {name: metricName, type: type, alias: metricName};
        }

        scope.selectMetric = function(metricName) {
          scope.metrics[0] = newMetric(metricName);
        };

        /**
         * Add a metric
         * @param {[type]} metricName [description]
         */
        scope.addMetric = function(metricName) {
          scope.metrics.push(newMetric(metricName));
        };

        /**
         * Removes a metric by index
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        scope.removeMetric = function(index) {
          scope.metrics.splice(index, 1);
        };

        // init
        scope.$watchGroup(['multiple', 'metricOptions', 'aggregationOptions'], function(newValues) {

          // Ensure we have a exactly 1 metric if is not multiple
          var isMultiple = newValues[0];
          scope.metrics = scope.metrics || [];
          if (!isMultiple) {
            if (scope.metrics.length === 0 && scope.metricOptions && scope.metricOptions.length > 0) {
              scope.selectMetric(scope.metricOptions[0].name);
            }
            if (scope.metrics.length > 1) {
              scope.metrics.splice(1, scope.metrics.length - 1);
            }
          }
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

angular.module('pr.datasource', [
  'pr.datasource.sql'
]);

})();

/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.datasource.sql', [
  'ngResource',
  'pr.api'
]);

})();
/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.datasource.sql')
/**
 * @ngdoc object
 * @name pr.datasource.sql.prDatasourceSqlService
 * @description
 *
 * The prDatasourceSqlService handles queries done to the dataSource backend, it wraps around a configurable $resource object.
 * Service which wraps around a $resource object. The service contains several calls.
 *
 * It performs tasks transforming requests to sql foramt and intpreting them back in different format for the framework consumption.
 *
 * The methods of this service are actions of $resource. See $resource documentation for more details:
 * https://docs.angularjs.org/api/ngResource/service/$resource
 *
 * @requires pr.datasource.util.sqlbuilder.prSqlBuilder
 *
 * @returns {object} $resource object
 */

.service('prDatasourceSqlService',
    function($resource, prSqlBuilder, prApi) {

      var transformDataRequest = function(param) {
        // Send the server a clone, remove query object to keep params intact.
        var q = {};
        if (param.table) {
          q.table = param.table;
        }
        if (param.orderBy) {
          q.orderBy = param.orderBy;
        }
        if (param.metrics) {
          q.metrics = param.metrics;
        }
        if (param.dimensions) {
          q.dimensions = param.dimensions;
        }
        if (param.maxResults) {
          q.maxResults = param.maxResults;
        }
        if (param.filters.where) {
          q.where = param.filters.where;
        }
        if (param.filters.whereRaw) {
          q.whereRaw = param.filters.whereRaw;
        }

        var p = {
          sql: prSqlBuilder.buildQuery(q),
          intervals: param.filters.intervals,
          granularity:  param.granularity
        };
        return angular.toJson(p);
      };

      return $resource(prApi.url + '/sql/:dataSourceName', {}, {
        /**
         * @ngdoc method
         * @name getDataset
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as an array of objects.
         * ```js
         *     [{
         *       dimension1: value1,
         *       dimension2: value2,
         *       metric1: 1111,
         *       metrci2: 2222
         *     }, {
         *       ...
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getDataset: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(response) {
              var data = response.data;
              var config = response.config;
              var result = [];
              angular.forEach(data, function(value, key) {
                if (value.result && angular.toJson(value.result) !== '{}') {
                  result[key] = value.result;
                  if (config.data && config.data.granularity !== 'all') {
                    result[key].timestamp = moment(value.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
                  }
                }
              });

              return result;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getHistogram
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as an array of objects to build a histogram.
         * ```js
         *     [{
         *       x: dimensionValue1,
         *       y: metricValue1
         *     }, {
         *       ...
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getHistogram: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(rawResponse) {
              var data = rawResponse.data;
              var config = rawResponse.config;
              var metrics = config.data.metrics;
              var responses = [];
              if (data && data.length > 0) {
                angular.forEach(metrics, function(metric) {
                  var response = [];
                  angular.forEach(data, function(value) {
                    var point = {};
                    if (!config.data.dimensions || !config.data.dimensions.length || config.data.isTimeline) {
                      point.x = moment(value.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
                    } else {
                      point.x = value.result[config.data.dimensions[0].name];
                    }
                    point.y = value.result[prSqlBuilder.getAlias(metric)];
                    response.push(point);
                  });

                  responses.push({key:prSqlBuilder.getAlias(metric), values:response});
                });
              }

              return responses;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getGroupedBarData
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as a nested array of objects to build a grouped bar chart.
         * ```js
         *     [{
         *       key: dimension A Value 1,
         *       values: [{
         *         x: dimension B Value 2,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }, {
         *       key: dimension A Value 2,
         *       values: [
         *         ...
         *       ]
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getGroupedBarData: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(rawResponse) {
              var data = rawResponse.data;
              var config = rawResponse.config;
              var dimensions = config.data.dimensions || [];
              var metrics = config.data.metrics || [];
              var responses = [];

              if (!data || data.length === 0) {
                return responses;
              }

              if (dimensions.length === 2 && metrics.length === 1) {
                // Dimensions are switched
                var dim1Name = dimensions[1].name;
                var dim2Name = dimensions[0].name;
                var dim1Vals = [];
                var dim2Vals = [];
                var metricName = metrics[0].alias;

                // Select the first dimension to group by
                angular.forEach(data, function(d) {
                  var value = d.result;
                  var dim1Val = value[dim1Name];
                  var seriesIndex = dim1Vals.indexOf(dim1Val);

                  // If the series does not exist, add it
                  if (seriesIndex === -1) {
                    seriesIndex = dim1Vals.length;

                    // Keep track of which dimensions were added
                    dim1Vals.push(dim1Val);
                    responses.push({
                      key: dim1Val,
                      values: []
                    });
                  }

                  // Add value
                  responses[seriesIndex].values.push({
                    series: seriesIndex,
                    x: value[dim2Name],
                    y: value[metricName]
                  });

                  // Keep track of which dimensions were added
                  if (dim2Vals.indexOf(value[dim2Name]) === -1) {
                    dim2Vals.push(value[dim2Name]);
                  }
                });
                responses.forEach(function(series, seriesIndex) {

                  // For all the dimensions found, add a 0 value when the value is not found
                  dim2Vals.forEach(function(dimValue) {
                    var have = false;
                    series.values.forEach(function(e) {
                      if (e.x === dimValue) {
                        have = true;
                      }
                    });

                    if (!have) {
                      series.values.push({
                        series: seriesIndex,
                        x: dimValue,
                        y: 0
                      });
                    }
                  });
                });

              } else if (dimensions.length === 1) {
                var metricNames = [];
                var dimName = dimensions[0].name;

                angular.forEach(data, function(d) {
                  var value = d.result;
                  var dimValue = value[dimName];
                  angular.forEach(value, function(val, key) {
                    if (key !== dimName) {
                      var metricName = key;
                      var seriesIndex = metricNames.indexOf(metricName);

                      if (seriesIndex === -1) {
                        seriesIndex = responses.length;
                        metricNames.push(metricName);
                        responses.push({
                          key: metricName,
                          values: []
                        });
                      }
                      responses[seriesIndex].values.push({
                        x: dimValue,
                        y: val
                      });
                    }
                  });
                });
              }

              responses.forEach(function(series) {
                // Sort makes the values get displayed correctly on 'stacked' mode
                series.values.sort(function(v1, v2) {
                  if (v1.x === v2.x) {
                    return 0;
                  }
                  return v1.x > v2.x ? -1 : 1;
                });
              });
              return responses;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getStackDataset
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains data as 1 or more series, which contain values with a timestamp (date) and a metric.
         *
         * If no dimension is selected, a single series is returned. The series represents the total for a metric.
         *
         * If a dimension is selelcted, several series are returned. Each series represents a metric value of the dimension.
         * ```js
         *     [{
         *       key: dimension value 1,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }, {
         *       key: dimension value 2,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getStackDataset: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(response) {
              var data = response.data;
              var config = response.config;
              var metricName = prSqlBuilder.getAlias(config.data.metrics[0]);
              var dimensionName = config.data.dimensions[0] ? config.data.dimensions[0].name : null;
              var dimensionValues = [];

              // Multiple series, values are store in each
              var series = [];

              // Group the data by the timestamp they carry, creating an array of small arrays
              var timestampGroups = _.groupBy(data, 'timestamp');

              // Find lenght of the bggest group, to prevent any 'holes' in the data
              var maxTimestampGroupLength = 0;
              for (var d in timestampGroups) {
                maxTimestampGroupLength = maxTimestampGroupLength < timestampGroups[d].length ? timestampGroups[d].length : maxTimestampGroupLength;
              }

              // Add the
              var timestampIndex = 0;
              for (var timestamp in timestampGroups) {
                var timestampGroup = timestampGroups[timestamp];
                var date = moment(timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();

                // Ensure we go through each of the values in the timestamp, even the ones missing
                for (var seriesIndex = 0; seriesIndex < maxTimestampGroupLength; seriesIndex++) {

                  // Create the series if not added yet
                  if (!series[seriesIndex]) {
                    series[seriesIndex] = [];
                  }

                  // Create a point in the series
                  series[seriesIndex][timestampIndex] = {
                    x: date,
                    y: 0
                  };

                  // Add y value for the point in the series if found
                  if (timestampGroup[seriesIndex]) {
                    var resultValue = timestampGroup[seriesIndex].result;
                    series[seriesIndex][timestampIndex].y = resultValue[metricName];
                    dimensionValues[seriesIndex] = resultValue[dimensionName];
                  }
                }
                timestampIndex++;
              }

              // Done! Put the data in the format suitable to nvd3
              var results = [];
              angular.forEach(series, function(serie, i) {
                results.push({
                  key: dimensionValues[i] || metricName,
                  values: serie
                });
              });
              return results;
            }
          },

          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getMetricData
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains total data for a single metric.
         *
         * ```js
         *     [{
         *       key: dimension value 1,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }, {
         *       key: dimension value 2,
         *       values: [{
         *         x: date value,
         *         y: metricValue1
         *       },{
         *         ...
         *       }]
         *     }]
         * ```
         *
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} param Params
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {object} promise Promise of the resources, which resolves to the data in array format
         */
        getMetricData: {
          method: 'POST',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          interceptor: {
            response: function(response) {
              var alias = prSqlBuilder.getAlias(response.config.data.metrics[0]);
              return response.data[0].result[alias];
            }
          },
          transformRequest: transformDataRequest
        },

        /**
         * @ngdoc method
         * @name getDataSources
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of dataSources available for the user.
         * @param {object} unused No params are needed
         * @param {object} unused No payload is needed
         * @param {function(array<string>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {array<string>} An array with the list of datasources which the user can view.
         */
        getDataSources: {
          method: 'GET',
          url: prApi.url + '/datasources?right=view',
          isArray: true,
          withCredentials: true
        },

        /**
         * @ngdoc method
         * @name getTables
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of the tables in a given dataSource
         * @param {object} urlParams Object which must include `dataSourceName`. e.g. `{dataSourceName: 'pulsar'}`
         * @param {object} unused No payload is needed as is created internally.
         * @param {function(array<string>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {array<string>} An array of names of tables of a dataSource.
         */
        getTables: {
          method: 'POST',
          url: prApi.url + '/sql',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          transformRequest: function(param) {
            var p = {
              sql: 'show tables from ' + param.dataSourceName
            };
            return angular.toJson(p);
          }
        },

        /**
         * @ngdoc method
         * @name getDimensions
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of the dimensions in a given table and dataSource
         * @param {object} urlParams Object which must include `dataSourceName` and `table`. e.g.
         * ```
         * {
         *   dataSourceName: 'pulsar',
         *   table: 'pulsar_events'
         * }
         * ```
         * @param {object} unused No payload is needed as is created internally.
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {array<object>} An array of objects which represent dimensions in a table
         */
        getDimensions: {
          method: 'POST',
          url: prApi.url + '/sql',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          transformRequest: function(param) {
            var p = {
              sql: 'desc ' + param.dataSourceName + '.' + param.table + '.dimensions'
            };
            return angular.toJson(p);
          },
          interceptor: {
            response: function(results) {
              var response = [];
              angular.forEach(results.data, function(dimension) {
                response.push({name: dimension});
              });
              return response;
            }
          }
        },

        /**
         * @ngdoc method
         * @name getMetrics
         * @methodOf pr.datasource.sql.prDatasourceSqlService
         * @description Obtains the list of the metrics in a given table and dataSource
         * @param {object} urlParams Object which must include `dataSourceName` and `table`. e.g.
         * ```
         * {
         *   dataSourceName: 'pulsar',
         *   table: 'pulsar_events'
         * }
         * ```
         * @param {Object} unused No payload is needed as is created internally.
         * @param {function(array<object>) } successCallback Function to be called on success
         * @param {function(object) } errorCallback Function to be called on error
         * @returns {Array<object>} An array of objects which represent metrics in a table
         */
        getMetrics: {
          method: 'POST',
          url: prApi.url + '/sql',
          isArray: true,
          withCredentials: prApi.withCredentialsDatasources,
          transformRequest: function(param) {
            var p = {
              sql: 'desc ' + param.dataSourceName + '.' + param.table + '.metrics'
            };
            return angular.toJson(p);
          },
          interceptor: {
            response: function(results) {
              var response = [];
              angular.forEach(results.data, function(metric) {
                response.push({name: metric});
              });

              return response;
            }
          }
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

/**
 * @ngdoc object
 * @name pr.datasource.sql.prSqlBuilder
 * @description Builds sql statements from params objects. Uses http://knexjs.org to build the query object
 */
angular.module('pr.datasource.sql')

.factory('prSqlBuilder',
    function($log) {

      /**
       * @ngdoc method
       * @name getAlias
       * @methodOf pr.datasource.sql.prSqlBuilder
       * @description Gets the name of a column according to the information in the metric or dimension.
       * @param {object} metric Metric object
       * @return {string} Alias of the metric
       */
      var getAlias = function(metric) {
        var alias = metric.alias ? metric.alias : metric.name + ' ' + metric.type;
        return alias;
      };
      /**
       * @ngdocs method
       * @name buildQuery
       * @methodOf pr.datasource.sql.prSqlBuilder
       * @description
       *
       * Formats a query from a set of parameteres to be sent to the sql api
       *
       * @param  {object} param Parameters to build an query to the back end.
       *
       *   Object properties:
       *
       *   - `table` `{string}` - Either pulsar_session or pulsar_event
       *   - `dimensions` `{array<object>}` Array of dimensions, e.g. ['trafficSource', '...' ]
       *   - `metrics` `{array<object>}` Array of metrics, e.g. ['newSessionRate', 'sessionDuration']
       *   - `where` `{object}` An object which can contains different kinds of values:
       *         where : {
       *           site : 0 // string, becomes (site=0)
       *           m : [1,2,3] // array, becode (m='1' or m='2' ...)
       *           str : {
       *             operator : 'like'
       *             val: '%XX%'
       *           }
       *         }
       *    - `string` or `number`, resulting in WHERE key = value
       *    - `array` of values, resulting in WHERE key = value1 or key = value2 or ...
       *    - `object` which must include `val` and optional `operator`, e.g.
       *   - `whereRaw` : A string with a raw filter
       *   - `orderBy` : column to orderBy in the statement
       *         orderBy : 'sessions' // simple
       *         orderBy : {          // more power
       *           sessions : 'asc',
       *           users : 'desc',
       *           ...
       *         }
       * @return {string} Build query in MySQL format
       */
      var buildQuery = function(param) {
        // Make select statement
        var k = Knex({client: 'mysql'}).select().from(param.table);

        // Order by
        var orderByAdded = false;
        if (param.orderBy) {
          if (angular.isString(param.orderBy) || angular.isNumber(param.orderBy)) {
            // Keep ASC always?
            k.orderBy(param.orderBy, 'desc');
            orderByAdded = true;
          } else if (angular.isObject(param.orderBy)) {
            angular.forEach(param.orderBy, function(val, key) {
              k.orderBy(key, val);
              orderByAdded = true;
            });
          } else {
            throw Error('cannot order by: type' + typeof (param.orderBy) + ' is not supported for order by');
          }
        }

        // Metrics update for test
        angular.forEach(param.metrics, function(metric, i) {
          var alias = '"' + getAlias(metric) + '"';
          if (metric.type === 'count') {
            k.count(metric.name + ' as ' + alias);
          } else if (metric.type === 'sum') {
            k.sum(metric.name + ' as ' + alias);
          } else if (metric.type === 'max') {
            k.max(metric.name + ' as ' + alias);
          } else if (metric.type === 'min') {
            k.min(metric.name + ' as ' + alias);
          } else if (metric.type === 'unique') {
            k.count('distinct ' + metric.name + ' as ' + alias);
          }  else if (metric.type === 'avg') {
            var avg = Knex.raw('sum("' + metric.name + '")/count("' + metric.name + '") as ' + alias);
            k.select(avg);
          } else {
            throw Error('cannot aggregate: aggregation ' + metric.type + ' is not supported');
          }

          // Add a default orderBy for the first metric
          if (!orderByAdded && i === 0) {
            if (param.dimensions && param.dimensions.length) {
              if (metric.type !== 'unique') {
                k.orderBy(metric.type + '(' + metric.name + ')', 'desc');
              }
            }
          }
        });

        // Dimension
        if (param.dimensions) {
          var columns = [];
          angular.forEach(param.dimensions, function(dimension) {
            if (dimension && dimension.name) {
              columns.push(dimension.name);
            }
          });

          k.column(columns);
        }

        // Where
        if (param.where) {

          angular.forEach(param.where, function(value, key) {

            if (angular.isString(value) || angular.isNumber(value)  || value === null) {
              // Condition is a simple value
              k.where(key, value);
            } else if (angular.isArray(value)) {
              k = orWhereFromArray(k, key, value);
            } else if (angular.isObject(value)) {
              var cond = value;
              if (cond.val) {
                if (!cond.operator) {
                  cond.operator = '=';
                }
                k = whereWithOperator(k, key, cond);
              }
            }
          });
        }

        if (param.whereRaw && angular.isString(param.whereRaw)) {
          k.whereRaw('(' + param.whereRaw + ')');
        }

        // Group by
        angular.forEach(param.dimensions, function(dimension) {
          if (dimension && dimension.name) {
            k.groupBy(dimension.name);
          }
        });

        // Limit
        if (param.maxResults) {
          if (angular.isString(param.maxResults)) {
            param.maxResults = parseInt(param.maxResults);
          }
          k.limit(param.maxResults);
        }

        var s = k.toString();

        //Remove MySQL quote symbols
        s = s.replace(/`/g, '');
        return s;
      };

      // HELPERS

      /**
       * Appends a where condition to a kenx statement
       * @param  {knex object}
       * @param  {string}
       * @param  {array}
       * @param  {string}
       * @return {knex object}
       */
      function orWhereFromArray(k, key, array, operator) {
        if (array.length > 0) {
          k.where(function() {
            var i = 1;
            if (operator) {
              this.where(key, operator, array[0]);
              for (; i < array.length; i++) {
                this.orWhere(key, operator, array[i]);
              }
            } else {
              this.where(key, array[0]);
              for (; i < array.length; i++) {
                this.orWhere(key, array[i]);
              }
            }
          });
        }
        return k;
      }

      /**
       * Add a where statement with an operator
       * @param  {[type]}
       * @param  {[type]}
       * @param  {[type]}
       * @return {[type]}
       */
      function whereWithOperator(k, key, cond) {
        if ((cond.operator === 'in' || cond.operator === 'not in') && angular.isArray(cond.val)) {
          return k.where(key, cond.operator, cond.val);
        } else if (cond.operator === 'between' && angular.isArray(cond.val) && cond.val.length === 2) {
          return k.where(key, cond.operator, cond.val);
        } else if (angular.isString(cond.val) || angular.isNumber(cond.val)) {
          return k.where(key, cond.operator, cond.val);
        } else if (angular.isArray(cond.val)) {
          return orWhereFromArray(k, key, cond.val, cond.operator);
        } else {
          $log.error('Filter condition ', cond, ' for query cannot be added by prSqlBuilder. Filter condition ignored.');
          return k;
        }
      }

      return {
        getAlias: getAlias,
        buildQuery: buildQuery
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

angular.module('pr.dynamicfilter', [
  'pr.datasource.sql',
  'ui.bootstrap.dropdown'
])

/**
 * @ngdoc directive
 * @name pr.dynamicfilter.directive:prDynamicFilter
 * @restrict E
 *
 * @description
 * Displays a list of filters for the user to drilldown in the data. The options for the user are loaded for the data
 * source dynamically, using top N queries.
 *
 * Optionally it emits ($emit) an event when filters are changed by the user so the data can be refreshed.
 *
 * @param {string} datasource The data source to be used
 * @param {string} table The table in the data source to be queried
 * @param {string=} metric The metric to sort by in the top N query. Defaults to `count`.
 * @param {object=} filters Extra filters that can be added to the query.
 * @param {number=} maxOptions Limit to the number of options in each of the dimension filters. 4 - 10 is recommended.
 * @param {number=} maxDimensions Limit to the number of dimensions in each of the dimension filters. 4 - 10 is recommended.
 * @param {object=} model Key, value pairs of dimension names and arrays of values set by the filter, uses double data binding.
 * @param {boolean=} drilldown This flag makes the options in a filter depend on the filters previously selected.
 * When a filter is selected, the filters below will be cleared of their values. Defaults to `false`
 * @param {boolean=} editMode This flag allows the user to add and remove dimensions in the filter on the UI.
 * @param {number=} visibleOptionsSelected Number of options that are shown before being collapsed as `2 of 4 options selected`.
 * @param {string=} submitEvent Displays an extra submit button, which when click will `$emit` an event with the value of this parameter.
 * The second argument is an object with the filters selected.
 * @param {array<object>=} dimensions Dimensions in the filters, uses double data binding. An additional option `locked`,
 * which if true prevents the dimension from being removed.
 */
.directive('prDynamicFilter',
    function(prDatasourceSqlService) {

      return {
        restrict: 'E',
        scope: {
          /* Query information */
          datasource: '=',
          table: '=',
          metric: '=?',
          filters: '=?',
          maxOptions: '=?',
          maxDimensions: '=?',

          /* Share the model with upper scope */
          model: '=?',

          /* Layout and special behavior */
          drilldown: '=?',
          editMode: '=?',
          visibleOptionsSelected: '=?',
          submitEvent: '=?',

          /* Predefined values by app */
          dimensions: '=?'
        },

        templateUrl: 'src/prReporting/prDynamicFilter/prDynamicFilter.html',

        controller: function($scope) {
          $scope.submit = function() {
            if ($scope.submitEvent) {
              $scope.$emit($scope.submitEvent, $scope.model);
            }
          };

          // Set defaults
          $scope.model = $scope.model || {};
          $scope.filters = $scope.filters || {};
          $scope.dimensions = $scope.dimensions || [];
          $scope.drilldown = angular.isUndefined($scope.drilldown) ? false : $scope.drilldown;
          $scope.editMode = angular.isUndefined($scope.editMode) ? true : $scope.editMode;
          $scope.visibleOptionsSelected = $scope.visibleOptionsSelected || 3;
          $scope.maxDimensions = $scope.maxDimensions || 10;
          $scope.maxOptions = $scope.maxOptions || 10;
          $scope.metric = $scope.metric || {
            name: 'count',
            type: 'count',
            alias: 'count'
          };

          $scope.isDimensionAdded = function(dimensionName) {
            for (var i in $scope.dimensions) {
              if ($scope.dimensions[i].name === dimensionName) {
                return true;
              }
            }
            return false;
          };

          $scope.isOptionSelected = function(dimension, option) {
            if ($scope.model[dimension.name]) {
              var index = $scope.model[dimension.name].indexOf(option);
              if (index === -1) {
                return false;
              } else {
                return true;
              }
            }
            return false;
          };

          $scope.resetDimensionsFromIndex = function(dimIndex) {
            if (dimIndex !== -1) {
              for (var i = dimIndex; i < $scope.dimensions.length; i++) {
                // Reset options and values
                $scope.model[$scope.dimensions[i].name] = [];
                $scope.setupDimension($scope.dimensions[i]);
              }
            }
          };

          $scope.toggleOption = function(dimension, option) {
            if ($scope.model[dimension.name]) {
              var optIndex = $scope.model[dimension.name].indexOf(option);
              if (optIndex === -1) {
                $scope.model[dimension.name].push(option);
              } else {
                $scope.model[dimension.name].splice(optIndex, 1);
              }

              if ($scope.drilldown) {
                var dimIndex = _.findIndex($scope.dimensions, function(dim) {
                  return dimension.name === dim.name;
                });
                $scope.resetDimensionsFromIndex(dimIndex + 1);
              }
            }
          };

          $scope.unselectAllOptions = function(dimension) {
            if ($scope.model[dimension.name]) {
              $scope.model[dimension.name] = [];
            }
            if ($scope.drilldown) {
              var dimIndex = $scope.dimensions.indexOf(dimension);
              $scope.resetDimensionsFromIndex(dimIndex + 1);
            }
          };

          $scope.removeDimension = function(dimension) {
            if (!dimension.locked) {
              var dimIndex = $scope.dimensions.indexOf(dimension);
              $scope.dimensions.splice(dimIndex, 1);
              delete $scope.model[dimension.name];
              if ($scope.drilldown) {
                $scope.resetDimensionsFromIndex(dimIndex);
              }
            }
          };

          $scope.addDimension = function(newDimension) {
            $scope.dimensions.push(newDimension);
            $scope.model[newDimension.name] = [];
            $scope.setupDimension(newDimension);
          };

          /**
           * Load the options of a dimension
           * @param dimension
           */
          $scope.setupDimension = function(dimension) {
            var topNparams = {
              dataSourceName: $scope.datasource,
              table: $scope.table,
              dimensions: [dimension],
              metrics: [
                $scope.metric
              ],
              maxResults: $scope.maxOptions,
              sortBy: $scope.metric.alias,
              filters: {
                where: {}
              }
            };
            angular.merge(topNparams.filters, $scope.filters);

            if ($scope.drilldown) {
              var drilldownWhere = {};
              for (var dimensionName in $scope.model) {
                if (dimensionName === dimension.name) {
                  break;
                } else {
                  if ($scope.model[dimensionName] && $scope.model[dimensionName].length) {
                    drilldownWhere[dimensionName] = angular.copy($scope.model[dimensionName]);
                  }
                }
              }
              angular.merge(topNparams.filters.where, drilldownWhere);
            }

            dimension.wait = true;
            dimension.options = [];
            prDatasourceSqlService.getDataset({dataSourceName: $scope.datasource}, topNparams, function(topNResults) {
              dimension.wait = false;
              dimension.options = [];
              angular.forEach(topNResults, function(topNResult) {
                dimension.options.push(topNResult[dimension.name]);
              });
            }, function(error) {
              dimension.wait = false;
              dimension.error = true;
            });
          };
        },

        link: function(scope, element, attrs) {

          // Add dimensions that are in the model, but not in the dimension list
          for (var dimensionName in scope.model) {
            var dimIndex = _.findIndex(scope.dimensions, function(dim) {
              return dimensionName === dim.name;
            });
            if (dimIndex === -1) {
              scope.dimensions.push({name: dimensionName});
            }
          }

          angular.forEach(scope.dimensions, function(dimension) {
            scope.model[dimension.name] = scope.model[dimension.name] || [];
            scope.setupDimension(dimension);
          });

          prDatasourceSqlService.getDimensions({}, {dataSourceName: scope.datasource, table: scope.table}, function(dimensionOptions) {
            scope.dimensionOptions = dimensionOptions;
          });
        }
      };
    });
})();
