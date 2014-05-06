module.exports = function(grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  var testemConfig = grunt.file.readJSON("testem.json");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: {
      "old built assets": {
        src: ["build"]
      }
    },
    watch: {
      requirejs: {
        files: ["src/**/*.js"],
        tasks: ["clean", "jshint", "requirejs", "testem"]
      },
      jsTests: {
        files: ["tests/spec-runner-template.html", "tests/**/*.js"],
        tasks: ["jshint", "testem"]
      }
    },
    jshint: {
      options: {
        jshintrc: "bower_components/jsgreat/.jshintrc"
      },
      configs: [
        "Gruntfile.js",
        "package.json",
        "bower.json"
      ],
      mvc: ["src/**/*.js"],
      jstests: ["tests/**/*.js"]
    },
    requirejs: {
      compile: {
        options: {
          mainConfigFile: "require-config.js"
        }
      }
    },
    testem: {
      local: {
        src: testemConfig.src_files,
        options: testemConfig
      }
    },
    env : {
      phantom : {
        push : {
          PATH : {
            value : "node_modules/grunt-contrib-jasmine/node_modules/grunt-lib-phantomjs/node_modules/.bin",
            delimiter : ":"
          }
        }
      }
    }
  });

  grunt.registerTask("default", [
    "clean",
    "requirejs",
    "watch"
  ]);

  grunt.registerTask("test", [
    "env:phantom",
    "testem"
  ]);

  grunt.registerTask("build", [
    "clean",
    "jshint",
    "requirejs"
  ]);
};
