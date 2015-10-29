/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

// controller for all groups
angular.module('pr.ui.admin', [
  'ui.router',
  'ui.select',
  'ngSanitize',
  'pr.ui.admin.resource',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.bootstrap.modal'
])
.config(
    function($stateProvider, $urlRouterProvider) {

      $stateProvider.state('home.admin', {
        weight: 100,
        url: '/admin',
        controller: 'AdminController',
        templateUrl: 'src/ui/admin/admin.html',

        ncyBreadcrumb: {
          label: 'Admin'
        },
        data: {
          pageTitle: 'Admin'
        },
        menu: {
          name: 'Admin',
          icon: 'fa fa-user-plus',
          priority: 0
        }
      });
    })
.controller('AdminController',
    function($scope, $timeout, $q) {

      $scope.tips = {
        lists:[]
      };
      var tips = {
        lists:$scope.tips.lists,
        autoClose:true,
        duration:3000,
        dismissTip:function(item) {
          var removeIndex = this.lists.indexOf(item);
          if (removeIndex != -1) {
            this.lists.splice(removeIndex, 1);
          }
        },
        addTip:function(tipOption) {
          this.lists.length = 0;
          this.lists.push(tipOption || {});
          if (this.autoClose) {
            var _this = this;
            $timeout(function() {
              _this.dismissTip(tipOption);
            }, this.duration);
          }
        }
      };
      $scope.promiseTellViewFromManageForGridData = function(vPromise, mPromise) {
        var deferForManageGroup = $q.defer();
        mPromise.then(function(data) {
          deferForManageGroup.resolve(data);
        }, function(data) {
          deferForManageGroup.reject([]);
        });
        var deferForViewGroup = $q.defer();
        vPromise.then(function(data) {
          deferForViewGroup.resolve(data);
        }, function(data) {
          deferForViewGroup.resolve([]);
        });

        var allDefer = $q.defer();

        $q.all([deferForManageGroup.promise, deferForViewGroup.promise]).then(function(arr) {
          var mGroups = arr[0];
          var vGroups = arr[1];
          var mNameArr = [];
          angular.forEach(mGroups, function(entity) {
            mNameArr.push(entity.name);
            entity.editable = true;
          });

          var trueVGroups = [];
          angular.forEach(vGroups, function(entity) {
            if (_.indexOf(mNameArr, entity.name) == -1) {
              entity.editable = false;
              trueVGroups.push(entity);
            }
          });
          var rs = mGroups.concat(trueVGroups);
          allDefer.resolve(rs);
        }, function() {
          allDefer.reject([]);
        });
        return allDefer.promise;
      };

      $scope.notification = {
        success:function(msg) {
          tips.addTip({
            title:'Success',
            message:msg,
            type:'Success'
          });
        },
        error:function(msg) {
          tips.addTip({
            title:'Error',
            message:msg,
            type:'Error'
          });
        }
      };
    });
})();
