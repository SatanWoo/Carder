module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      scripts: {
        files: [],
        tasks: ['browserify'],
        options: {
          spawn: false,
          livereload: true
        },
      },
    },

    browserify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'UI/js',
          src: ['index.js'],
          dest: 'public/javascripts'
        }],
        options: {
          transform: ['reactify']
        }
      }
    }
  });

  // grunt.registerTask('', ['']);
};

// // file expand

// files: [
//         {
//           expand: true,     // Enable dynamic expansion.
//           cwd: 'lib/',      // Src matches are relative to this path.
//           src: ['**/*.js'], // Actual pattern(s) to match.
//           dest: 'build/',   // Destination path prefix.
//           ext: '.min.js',   // Dest filepaths will have this extension.
//           extDot: 'first'   // Extensions in filenames begin after the first dot
//         },
//       ],
      
      
// // watch
// watch: {
//   scripts: {
//     files: ['**/*.js'],
//     tasks: ['jshint'],
//     options: {
//       spawn: false,
//     },
//   },
// },