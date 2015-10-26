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