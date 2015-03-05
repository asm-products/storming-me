module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // all of our configuration will go here

    // configure jshint to validate js files -----------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

    // when this task is run, lint the Gruntfile and all js files in src
      build: ['Grunfile.js', 'public/js/script.js']
    },

    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      my_target: {
        files: {
          'public/dist/js/application.min.js': ['public/js/html2canvas.js',
                                                'public/js/randomColor.min.js',
                                                'public/js/rangy/rangy-core.js',
                                                'public/js/rangy/rangy-classapplier.js',
                                                'public/js/rangy/rangy-textrange.js',
                                                'public/js/rangy/rangy-highlighter.js',
                                                'public/js/medium-editor.min.js',
                                                'public/js/ripples.min.js',
                                                'public/js/material.min.js',
                                                'public/js/strftime-min.js',
                                                'public/js/autosize.js',
                                                'public/js/script.js']
        }
      }
    },

    watch: {
      js: {
        files: [
          'public/js/*.js'
        ],
        tasks: ['jshint','uglify']
      }
    }

  });

  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('dev', ['watch']);

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
