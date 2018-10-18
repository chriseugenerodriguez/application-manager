// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '**/*.spec.ts',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-mocha'),
      require('karma-chrome-launcher'),
      require('karma-mocha-reporter'),
      require('@angular/cli/plugins/karma'),
      require('karma-trx-reporter')
    ],
    client:{
      clearContext: true,
      captureConsole: false
    },
    angularCli: {
      environment: 'dev'
    },
    mochaReporter: {
      colors: {
        success: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'red'
      },
      output: 'autowatch',
      showDiff: true
    },
    reporters: ['mocha', 'trx'],
    trxReporter: { outputFile: 'jasmine.trx', shortTestName: false},
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 2
  });
};
