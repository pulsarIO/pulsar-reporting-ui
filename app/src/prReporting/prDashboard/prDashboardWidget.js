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
