import spySuffix from '../spy-suffix';

module.exports = window.injectSpy = injectSpy;

function injectSpy(spyInjections) {
  var spyInjectionNames;

  if (typeof spyInjections === 'function') {
    spyInjectionNames = angular.injector.$$annotate(spyInjections)

  } else if (!angular.isArray(spyInjections) ||
    spyInjections.length < 2 ||
    typeof spyInjections[spyInjections.length - 1] !== "function") {

    throw new Error('The injection parameter must be an array of injections and a function in the end');

  } else {
    spyInjectionNames = spyInjections.slice(0, -1);
  }
  createModules(spyInjectionNames);

  return inject(spyInjections);

}

function createModules(spyInjections) {
  for (var i = 0; i < (spyInjections.length); i++) {
    var spyName = spyInjections[i];

    if (!angular.isString(spyName)) {
      throw new Error('Spy name must be of type String, injection value was: ' + spyName);
    }
    var spyModuleName = spyName + spySuffix;
    beforeEach(window.module(spyModuleName));

  }
}