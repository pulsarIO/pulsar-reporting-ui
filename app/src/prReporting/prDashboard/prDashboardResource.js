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
