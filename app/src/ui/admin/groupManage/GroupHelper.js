/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';
angular.module('pr.ui.admin')
/**
 * @ngdoc service

 * @name pr.ui.admin.service:GroupSearchService

 * @description
 * The `GroupSearch` service is used to get self-defined suitable fitlers which can filter a group's users and so on.

 * @requires lodash
 */
.factory('GroupSearchService', function() {
  var uiGridFilters = {
    /**
      * @ngdoc method
      * @name USERS_CONTAINS
      * @methodOf pr.ui.admin.service:GroupSearchService
      * @param {string} term 'user2'
      * @param {string} cellVal 'user1,user2...'
      * @returns {boolean} the boolean result which indicates if the cell value, namingly group's users, contrains the input term
      */
    USERS_CONTAINS:function(term, cellVal) {
      return _.findIndex(cellVal, function(username) {
        return _.contains(username, term);
      }) > -1;
    }
  };
  return uiGridFilters;
})

/**
 * @ngdoc service

 * @name pr.ui.admin.service:GroupRightsTransform

 * @description
 * The `GroupRightsTransform` service is used to transform group's rights to adapt to use properly.

 * @requires lodash
 */
.service('GroupRightsTransform', function() {
  /**
    * @ngdoc method
    * @name transform
    * @methodOf pr.ui.admin.service:GroupRightsTransform
    * @param {array} groupRights array of original format
    * @returns {array} array of programmatic-nneded format
    */
  this.transform = function(groupRights) {

    //transform
    var newGroupRights = [];
    var _MANAGE = '_MANAGE';
    var _VIEW = '_VIEW';
    angular.forEach(groupRights, function(rawGroup) {
      var rightName = null;
      var rightNameSuffix = null;
      if (_.endsWith(rawGroup.rightName, _MANAGE)) {
        rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _MANAGE.length);
        rightNameSuffix = _MANAGE;
      } else if (_.endsWith(rawGroup.rightName, _VIEW)) {
        rightName = rawGroup.rightName.slice(0, rawGroup.rightName.length - _VIEW.length);
        rightNameSuffix = _VIEW;
      } else {
        rightName = rawGroup.rightName;
        rightNameSuffix = '';
      }
      rawGroup.rightName = rightName;
      rawGroup.rightType = rawGroup.rightType + '';
      rawGroup.rightNameSuffix = rightNameSuffix;
      newGroupRights.push(rawGroup);
    });

    //assemble
    var rightsSet = [];
    angular.forEach(newGroupRights, function(right) {
      rightsSet.push(right);
    });
    return rightsSet;
  };
});

})();
