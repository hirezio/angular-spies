require('source-map-support').install();
var webpackConfig = require('./webpack.config');

var indexEntry = 'src/index.test.js';
var specsEntry = 'src/**/*.spec.js';

webpackConfig.entry = './'+indexEntry;

var browsers = [];
var preprocessors = {};
preprocessors[indexEntry] = ['webpack', 'sourcemap'];
preprocessors[specsEntry] = ['webpack'];

var inCIMode = process.env.CI === 'true';

if (inCIMode){
  //preprocessors['src/**/spy*/*!(spec).js'] = ['coverage'];
  browsers.push('Firefox');
}else{
  browsers.push('Chrome');
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'source-map-support'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/jasmine-given/dist/jasmine-given.js',
      indexEntry,
      specsEntry
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: preprocessors,

    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      }
    },

    webpack: webpackConfig,

    coverageReporter: {
      reporters: [
        {type: 'lcov', dir: 'coverage/', subdir: '.'},
        {type: 'json', dir: 'coverage/', subdir: '.'},
        {type: 'text-summary'}
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: getReporters(),


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}

function getReporters() {
  var reps = ['progress'];
  if (inCIMode) {
    //reps.push('coverage');
  }
  return reps;
}