// Karma configuration
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'app',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'angular-filesort'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/jquery-ui/ui/minified/core.min.js',
      'bower_components/jquery-ui/ui/minified/widget.min.js',
      'bower_components/jquery-ui/ui/minified/mouse.min.js',
      'bower_components/jquery-ui/ui/minified/sortable.min.js',

      'bower_components/lodash/lodash.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/admin-lte/dist/js/app.js',
      'assets/scripts/admin_lte_custom.js',

      'bower_components/d3/d3.js',
      'bower_components/nvd3/build/nv.d3.js',
      'bower_components/moment/moment.js',
      'bower_components/moment-timezone/builds/moment-timezone-with-data.js',
      'bower_components/knex/browser/knex.js',
      'bower_components/bootstrap-daterangepicker/daterangepicker.js',
      'bower_components/countto/jquery.countTo.js',

      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-ui-sortable/sortable.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-breadcrumb/dist/angular-breadcrumb.js',
      'bower_components/angular-ui-router-menus/dist/angular-ui-router-menus.js',
      'bower_components/angular-nvd3/dist/angular-nvd3.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-load/angular-load.js',
      'bower_components/angular-loading-bar/build/loading-bar.min.js',

      'bower_components/angular-mocks/angular-mocks.js',

      'src/**/*.js',

      'src/**/*.html',

      'test/**/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    angularFilesort: {
      whitelist: [
        'src/**/*.js'
      ]
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['coverage'],
      'src/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'karma-html2js-templates'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit', 'html', 'coverage'],

    htmlReporter: {
      outputFile: '../test/result.html'
    },

    junitReporter: {
      outputDir: '../test/junit/',
      outputFile: 'results.xml'
    },

    coverageReporter: {
      dir: '../test/coverage/',
      type: 'lcov'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
