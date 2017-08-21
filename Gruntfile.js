/*global module:false*/
module.exports = function(grunt) {
  var jshintopts = {
    curly: false,
    eqeqeq: true,
    immed: true,
    latedef: false,
    newcap: true,
    evil: true,
    noarg: true,
    sub: true,
    undef: false,
    boss: true,
    eqnull: true,
    smarttabs: true,
    loopfunc: true,
    esversion: 6
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      html: {
        files: ['src/devtools.html', 'src/panel.html', 'src/template.html'],
        tasks: ['htmlcompressor']
      },
      css: {
        files: 'src/css/*.css',
        tasks: ['cssmin']
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['jshint']
      }
    },
    replace: {
      compile: {
        src: 'src/panel.html',
        dest: 'dist/panel.html',
        replacements: [{
          from: /<!-- @dev-css [\s\S]*? dev-css@ -->/img,
          to: '<link rel="stylesheet" type="text/css" href="css/all.css"/>'
        }, {
          from: /<!-- @dev-js [\s\S]*? dev-js@ -->/img,
          to: '<script src="js/jquery.js"></script><script src="js/all.js"></script>'
        }]
      }
    },
    htmlcompressor: {
      compile: {
        options: {
          removeIntertagSpaces: true
        },
        files: {
          'dist/panel.html': 'dist/panel.html',
          'dist/template.html': 'src/template.html',
          'dist/devtools.html': 'src/devtools.html'
        }
      },
      options: {
        type: 'html'
      }
    },
    csslint: {
      compile: {
        options: {
          ids: false,
          'adjoining-classes': false,
          'unqualified-attributes': false,
          'box-model': false
        },
        src: 'src/css/style.css'
      }
    },
    cssmin: {
      combine: {
        files: {
          'dist/css/all.css': ['src/css/normalize.css', 'src/css/style.css']
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        files: {
          'dist/js/all.js': ['src/js/rules.js', 'src/js/metadata.js', 'src/js/script.js', 'src/js/eventos.js', 'src/js/tagueamento.js'],
          // 'dist/js/background.js': 'src/js/background.js',
          'dist/js/devtools.js': 'src/js/devtools.js'
        }
      }
    },
    jshint: {
      options: jshintopts,
      globals: {
        exports: true,
        module: false,
        jquery: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: ['src/js/script.js', 'src/js/eventos.js', 'src/js/tagueamento.js']
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      compile: {
        files: {
          // 'dist/js/all.js': 'dist/js/all.js',
          // 'dist/js/devtools.js': 'dist/js/devtools.js'
        }
      }
    },
    copy: {
      compile: {
        files: [{
          cwd: 'src/',
          expand: true,
          src: ['manifest.json', 'icons/*', 'img/*', 'js/jquery.js', 'devtools.html'],
          dest: 'dist/'
        }]
      }
    },
    clean: ['dist']
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-htmlcompressor');
  grunt.loadNpmTasks('grunt-text-replace');

  // Default task.
  grunt.registerTask('html', ['replace'/*, 'htmlcompressor'*/]);
  grunt.registerTask('css', [ /*'csslint', */ 'cssmin']);
  grunt.registerTask('js', ['concat', 'jshint', 'uglify']);
  grunt.registerTask('default', ['clean', 'html', 'css', 'js', 'copy']);

};