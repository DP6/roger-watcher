/*global module:false*/
module.exports = grunt => {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
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
          'dist/js/all.js': ['src/js/commonrules.js', 'src/js/metadata.js', 'src/js/script.js', 'src/js/eventos.js', 'src/js/tagueamento.js'],
          'dist/js/devtools.js': 'src/js/devtools.js'
        }
      }
    },
    jshint: {
      options: grunt.file.readJSON('jshint.json'),
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: ['src/js/script.js', 'src/js/eventos.js', 'src/js/tagueamento.js']
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-text-replace');

  // Default task.
  grunt.registerTask('html', ['replace']);
  grunt.registerTask('css', ['cssmin']);
  grunt.registerTask('js', ['concat', 'jshint']);
  grunt.registerTask('default', ['clean', 'html', 'css', 'js', 'copy']);

};