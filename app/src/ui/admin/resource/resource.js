/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/
(function() {
'use strict';

angular.module('pr.ui.admin.resource', [
    'ngResource',
    'pr.api'
])

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:Groups
 * @description
 * The `Groups` service is used to talk to backend, dedicated to get all groups which are managable for the user,
 * add a mew group and remove a group.
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('Groups',
    function($resource, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:Groups
       * @description Obtains data as an array of objects. Response:
       * ```js
       *     [{
       *       name: 'foo',
       *       displayname: 'Foo',
       *       owner: 'admin'
       *     }, {
       *       ...
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method: 'GET',
        isArray: true,
        withCredentials: true,
        url:prApi.url + '/groups?right=:type'
      };
      /**
       * @ngdoc method
       * @name add
       * @methodOf pr.ui.admin.resource.service:Groups
       * @description Add a new group. Response:
       * ```js
       *     {
       *        name:'foo',
       *        displayName: 'Foo',
       *        owner:'admin'
       *     }
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {displayName: 'Foo'}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var add = {
        method: 'POST',
        isArray: false,
        withCredentials: true
      };
      /**
       * @ngdoc method
       * @name remove
       * @methodOf pr.ui.admin.resource.service:Groups
       * @description Remove a group. Response:
       * ```js
       *     {
       *        deleted:number
       *     }
       * ```
       * @param {object} pathParam {groupName: 'groupName'}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var remove = {
        method: 'DELETE',
        isArray: false,
        withCredentials: true
      };
      var update = {
        method: 'PUT',
        isArray: false,
        withCredentials: true
      };
      var options = {
        query: query,
        add: add,
        remove: remove,
        update:update
      };
      return $resource(prApi.url + '/groups/:groupName', nullParamDefaults, options);
    })

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:GroupUsers
 * @description
 * The `GroupUsers` service is used to talk to backend, dedicated to get all users belonging to the specified group,
 * replace all users with new users.
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('GroupUsers',
    function($resource, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:GroupUsers
       * @description Get a group's belonging users. Response:
       * ```js
       *     ['username1', 'username2', ...]
       * ```
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method:'GET',
        isArray: true,
        withCredentials: true,
        cache: false
      };
      /**
       * @ngdoc method
       * @name replaceAll
       * @methodOf pr.ui.admin.resource.service:GroupUsers
       * @description ReplaceAll a group's belonging users with new users. Response:
       * ```js
       *     ['username1', 'username2', ...]
       * ```
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {array} dataParam ['username1', 'username2', ...]
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var replaceAll = {
        method: 'PUT',
        withCredentials: true,
        isArray: true
      };
      var options = {
        query:query,
        replaceAll:replaceAll
      };
      return $resource(prApi.url + '/groups/:groupName/users', nullParamDefaults, options);

    })
/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:GroupRights
 * @description
 * The `GroupRights` service is used to talk to backend, dedicated to get all rights belonging to the specified group,
 * replace all rights with new rights.
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('GroupRights',
    function($resource, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:GroupRights
       * @description Get a group's belonging rights. Response:
       * ```js
       *     [{
       *        rightName:'datasource1_VIEW',
       *        rightType:'1'
       *     },{
       *        rightName:'dashboard1_VIEW',
       *        rightType:'2'
       *     }]
       * ```
       *
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method:'GET',
        isArray: true,
        withCredentials: true
      };
      /**
       * @ngdoc method
       * @name replaceAll
       * @methodOf pr.ui.admin.resource.service:GroupRights
       * @description ReplaceAll a group's belonging rights with new rights. Response:
       * ```js
       *     [{
       *        rightName:'datasource1_VIEW',
       *        rightType:'1'
       *     },{
       *        rightName:'dashboard1_VIEW',
       *        rightType:'2'
       *     }...]
       * ```
       *
       * @param {object} pathParam {groupName: 'groupNameFoo'}
       * @param {array} dataParam [{
       *        rightName:'datasource1_VIEW',
       *        rightType:'1'
       *     },{
       *        rightName:'dashboard1_VIEW',
       *        rightType:'2'
       *     }...]
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var replaceAll = {
        method: 'PUT',
        withCredentials: true,
        isArray: true
      };
      var options = {
        query: query,
        replaceAll: replaceAll
      };
      return $resource(prApi.url + '/groups/:groupName/rights', nullParamDefaults, options);
    })

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:Datasources
 * @description
 * The `Datasources` service is used to talk to backend, dedicated to get, add, update, remove and batchRemove datasouces.
 *
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('Datasources',
    function($resource, $http, prApi) {
      var nullParamDefaults = {};

      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Load all datasources. Response:
       * ```js
       *    [{
       *      displayName: "trackingdruid"
       *      endpoint: "http://druid.broker.vip.lvs.ebay.com/druid/v2"
       *      name: "trackingdruid"
       *      owner: null
       *      readonly: true
       *      type: "druid"
       *    },{
       *     ...
       *    }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var query = {
        method: 'GET',
        isArray: true,
        withCredentials: true,
        url: prApi.url + '/datasources?right=:type'

      };

      /**
       * @ngdoc method
       * @name add
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Add a new datasouce. Response:
       * ```js
       *     [{
       *       displayName: "datasource01"
       *       endpoint: "http://xxx"
       *       name: "datasource01"
       *       owner: null
       *       readonly: true
       *       type: "druid"
       *     },{
       *     ...
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {"displayName":"datasource01", "type":"druid","endpoint":"http://xxx"}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var add = {
        method: 'POST',
        isArray: false,
        withCredentials: true
      };

      /**
       * @ngdoc method
       * @name update
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Update a datasource. Response:
       * ```js
       *     [{
       *       displayName: "datasourceNewName"
       *       endpoint: "http://xxx"
       *       name: "datasource01"
       *       owner: null
       *       readonly: true
       *       type: "druid"
       *     },{
       *     ...
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {"name":"datasource01", "displayName":"datasourceNewName","endpoint":"http://xxx"}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var update = {
        method: 'PUT',
        isArray: false,
        withCredentials: true
      };

      /**
       * @ngdoc method
       * @name remove
       * @methodOf pr.ui.admin.resource.service:Datasources
       * @description Remove a datasource. Response:
       * ```js
       *     [{
       *      "deleted":number
       *     }]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */

      var remove = {
        method: 'DELETE',
        isArray: false,
        withCredentials: true,
        url: prApi.url + '/datasources/:names'
      };
      var options = {
        query: query,
        add: add,
        remove: remove,
        update: update
      };
      return $resource(prApi.url + '/datasources', nullParamDefaults, options);
    })

/**
 * @ngdoc service
 * @name pr.ui.admin.resource.service:SysRights
 * @description
 * The `SysRights` service is used to talk to backend, dedicated to get user's system rights.
 *
 * @requires ngResource.service:$resource service defined in angular-resource.js
 * @requires pr.api.prApiProvider prApi
 */

.factory('SysRights',
    function($resource, $http, prApi) {
      var nullParamDefaults = {};
      /**
       * @ngdoc method
       * @name query
       * @methodOf pr.ui.admin.resource.service:SysRights
       * @description Batch remove the selected datasources. Response:
       * ```js
       *     ['sysrightName1','sysrightName2'...]
       * ```
       * @param {object} pathParam {}
       * @param {object} dataParam {}
       * @param {function(array<object>) } successCallback Function to be called on success
       * @param {function(object) } errorCallback Function to be called on error
       * @returns {object} the object returned by $resource wrapped api service invoked
       */
      var query = {
        method: 'GET',
        isArray: true,
        withCredentials: true
      };
      var options = {
        query: query
      };
      return $resource(prApi.url + '/sysrights', nullParamDefaults, options);
    });
})();
