var _ = require('lodash');

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-continue');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      app: 'app',
      tmp: '.tmp',
      dist: 'dist',
      docs: 'docs',
      server: 'server'
    },

    bower: {
      install: {
        options: {
          install: true,
          verbose: true,
          copy: false,
          targetDir: '<%= dirs.app %>/bower_components',
          cleanTargetDir: false
        }
      }
    },

    ngdocs: {
      all: {
        src: ['<%= dirs.app %>/src/**/*.js']
      },
      options: {
        dest: '<%= dirs.docs %>',
        image: 'ngdoc_assets/logo.png',
        title: 'Pulsar Reporting UI <%= pkg.version %>',
        styles: ['ngdoc_assets/ngdocs.css'],
        navTemplate: 'ngdoc_assets/nav.html'
      }
    },

    clean: {
      dist: {
        src: '<%= dirs.dist %>'
      },
      docs: {
        src: '<%= dirs.docs %>'
      },
      temp: {
        src: '<%= dirs.tmp %>'
      },
      bundle: {
        src: '<%= pkg.name %>-bundle.zip'
      }
    },

    useminPrepare: {
      html: '<%= dirs.app %>/index.html',
      options: {
        dest: '<%= dirs.dist %>',
        flow: {
          steps: {
            css: ['concat'],
            js: ['concat'],
            less: [{
              name: 'less',
              createConfig: function(context, block) {
                var path = require('path');
                var cfg = {files: []};
                var filesDef = {};

                filesDef.dest = path.join(context.outDir, block.dest);
                filesDef.src = [];

                context.inFiles.forEach(function(inFile) {
                  filesDef.src.push(path.join(context.inDir, inFile));
                });

                cfg.files.push(filesDef);
                context.outFiles = [block.dest];
                return cfg;
              }
            }]
          },
          post: {

          }
        }
      }
    },

    uglify: {
      dist: {
        src: '<%= dirs.dist %>/**/*.js',
        expand: true,
        ext: '.min.js'
      },
      options: {
        sourceMap: true,
        mangle: false
      }
    },

    cssmin: {
      dist: {
        src: '<%= dirs.dist %>/**/*.css',
        expand: true,
        ext: '.min.css'
      }
    },

    copy: {
      dist: {
        files: [{
            // index
            src: '<%= dirs.app %>/index.html',
            dest: '<%= dirs.dist %>/index.html'
          }, {
            // favicon
            src: '<%= dirs.app %>/favicon.ico',
            dest: '<%= dirs.dist %>/favicon.ico'
          }, {
            //fonts
            cwd: '<%= dirs.app %>',
            expand: true,
            flatten: true,
            src: ['assets/fonts/*'],
            dest: '<%= dirs.dist %>/app/assets/fonts'
          }, {
            // font awesome
            cwd: '<%= dirs.app %>',
            expand: true,
            flatten: true,
            src: ['bower_components/font-awesome/fonts/*'],
            dest: '<%= dirs.dist %>/app/fonts'
          }, {
            // img
            cwd: '<%= dirs.app %>',
            expand: true,
            src: [
              'assets/img/*'
            ],
            dest: '<%= dirs.dist %>'
          }, {
            // ui grid icons
            cwd: '<%= dirs.app %>',
            flatten: true,
            expand: true,
            src: [
              'bower_components/angular-ui-grid/ui-grid.svg',
              'bower_components/angular-ui-grid/ui-grid.ttf',
              'bower_components/angular-ui-grid/ui-grid.woff'
            ],
            dest: '<%= dirs.dist %>/app/css'
          }, {
            // jvector maps
            cwd: '<%= dirs.app %>',
            expand: true,
            src: ['assets/plugin/jvectormap/**'],
            dest: '<%= dirs.dist %>'
          }, {
            // config bundle
            src: '<%= dirs.app %>/config-bundle.json',
            dest: '<%= dirs.dist %>/config-bundle.json'
          }]
      },
      server: {
        files: [{
            flatten: true,
            expand: true,
            src: '<%= dirs.server %>/server.dist.js',
            dest: '<%= dirs.dist %>/'
          }, {
            src: ['node_modules/connect/**/*', 'node_modules/serve-static/**/*'],
            expand: true,
            dest: '<%= dirs.dist %>/'
          }]
      },
      bundle: {
        files: [{
          nonull: true,
          src: ['<%= pkg.name %>-bundle.zip'],
          dest: '<%= dirs.docs %>/'
        }]
      },
      ngdocs: {
        files: [{
          expand: true,
          flatten: true,
          src: ['ngdoc_assets/font/*'],
          dest: '<%= dirs.docs %>/font/'
        }]
      }
    },

    usemin: {
      html: '<%= dirs.dist %>/index.html',
      options: {
        blockReplacements: {
          less: function(block) {
            return '<link rel="stylesheet" href="' + block.dest + '" />';
          }
        }
      }
    },

    concat: {
      tpls: {
        src: ['<%= dirs.tmp %>/tpls.js', '<%= dirs.dist %>/<%= pkg.config.filename %>.js'],
        dest: '<%= dirs.dist %>/<%= pkg.config.filename %>-tpls.js',
        separator: ';'
      }
    },

    html2js: {
      tpls: {
        src: '<%= dirs.app %>/src/**/*.html',
        dest: '<%= dirs.tmp %>/tpls.js'
      },
      options: {
        module: null,
        base: '<%= dirs.app %>',
        htmlmin: {
          collapseBooleanAttributes: false,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeComments: true
        }
      }
    },

    replace: {
      tplsSrc: {
        src: '<%= dirs.dist %>/index.html',
        dest: '<%= dirs.dist %>/index.html',
        replacements: [{
          from: 'src="<%= pkg.config.filename %>.js"',
          to: 'src="<%= pkg.config.filename %>-tpls.js"'
        }]
      },
      ngdocs: {
        src: '<%= dirs.docs %>/**/*.html',
        dest: '<%= dirs.docs %>/',
        replacements: [{
          from: 'class="row"',
          to: 'class="row-fluid"'
        }, {
          from: 'class="container"',
          to: 'class="container-fluid"'
        }, {
          from: 'icon-cog"></i>',
          to: 'icon-cog"></i>Provider'
        }]
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          linebreak: true,
          banner: '/*\n' +
                  ' <%= pkg.name %> | <%= pkg.version %>\n' +
                  ' Copyright (C) 2012-2015 eBay Software Foundation\n' +
                  ' Licenses: MIT & Apache 2.0\n' +
                  '*/'
        },
        files: {
          src: ['<%= dirs.dist %>/*.js', '<%= dirs.dist %>/**/*.min.js', '!<%= dirs.dist %>/assets/plugin/**/*.js']
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.config.js'
      },
      local: {
        singleRun: true,
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        options: {
          force: true
        }
      }
    },

    zip: {
      bundle: {
        cwd: '<%= dirs.dist %>/',
        src: ['<%= dirs.dist %>/**/*'],
        dest: '<%= pkg.name %>-bundle.zip',
        compression: 'DEFLATE'
      }
    },

    'gh-pages': {
      options: {
        base: 'docs',
        message: 'Generated by grunt gh-pages | <%= pkg.name %> <%= pkg.version %>'
      },
      src: ['**/*']
    }

  });

  grunt.registerTask('html2js-ngmodule', 'Create template module', function() {
    var html2jsSrcArr = grunt.file.expand(grunt.config('html2js.tpls.src'));
    var html2jsBase = grunt.config('html2js.options.base') + '/';
    _.forEach(html2jsSrcArr, function(fileName, i) {
      html2jsSrcArr[i] = fileName.split(html2jsBase).pop();
    });
    var html2jsResult = grunt.file.read(grunt.config('html2js.tpls.dest'));
    var module = 'angular.module("pr.tpls", ["' + html2jsSrcArr.join('", "') + '"]);';
    grunt.file.write(grunt.config('html2js.tpls.dest'), html2jsResult + module);
  });

  grunt.registerTask('testlocal', [
    'continue:on',
    'karma:local',
    'continue:off'
  ]);

  grunt.registerTask('templates', [
    'html2js',
    'html2js-ngmodule',
    'concat:tpls'
  ]);

  grunt.registerTask('minify', [
    'clean',
    'useminPrepare',
    'concat:generated',
    'less:generated',
    'copy:dist',

    'usemin',

    'templates',
    'replace:tplsSrc',
    'uglify:dist',
    'cssmin:dist',
    'usebanner:dist',
    'copy:server',
    'zip:bundle'
  ]);

  grunt.registerTask('docs', [
    'ngdocs',
    'replace:ngdocs',
    'copy:ngdocs',
    'copy:bundle'
  ]);

  grunt.registerTask('build', [
    'bower',
    'testlocal',
    'minify',
    'docs',
    'gh-pages'
  ]);

  grunt.registerTask('default', ['build']);
};