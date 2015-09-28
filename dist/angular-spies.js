/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	__webpack_require__(3);

	module.exports = {};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _spySuffix = __webpack_require__(2);

	var _spySuffix2 = _interopRequireDefault(_spySuffix);

	module.exports = window.angular.spyOnService = spyOnService;

	function spyOnService(serviceName, parentSpies) {

	  function SpyCreator() {
	    var spyCreatorInstance = this;
	    this.methodNames = null;
	    this.asyncMethodNames = null;
	    createAngularService(spyCreatorInstance, serviceName, parentSpies);
	  }

	  SpyCreator.prototype.methods = addMethods;
	  SpyCreator.prototype.asyncMethods = addAsyncMethods;

	  return new SpyCreator();
	}

	function createAngularService(spyCreatorInstance, serviceName, parents) {
	  var parentServiceNames = [],
	      parentModuleNames = [];

	  if (parents && angular.isArray(parents)) {
	    parentServiceNames = parents;
	    parentModuleNames = parents.map(function (parent) {
	      return parent + _spySuffix2['default'];
	    });
	  }

	  angular.module(serviceName + _spySuffix2['default'], parentModuleNames).factory(serviceName, factory);

	  factory.$inject = ['$q'].concat(parentServiceNames);

	  function factory() {
	    var spyService, args, $q, parentSpies;

	    spyService = {};

	    args = Array.prototype.slice.call(arguments, 0);
	    $q = args[0];
	    parentSpies = args.slice(1);

	    parentSpies.forEach(function (parentSpy) {
	      angular.extend(spyService, parentSpy);
	    });

	    createSyncMethodsOnSpy(spyCreatorInstance, spyService, serviceName);

	    createAsyncSyncMethodsOnSpy(spyCreatorInstance, spyService, serviceName, $q);

	    return spyService;
	  }
	}

	function createSyncMethodsOnSpy(spyCreatorInstance, spyService, serviceName) {
	  var methodNames = spyCreatorInstance.methodNames;
	  if (methodNames && angular.isArray(methodNames)) {
	    methodNames.forEach(function (methodName) {
	      spyService[methodName] = jasmine.createSpy(serviceName + methodName);
	    });
	  }
	}

	function createAsyncSyncMethodsOnSpy(spyCreatorInstance, spyService, serviceName, $q) {
	  var asyncMethodNames;

	  asyncMethodNames = spyCreatorInstance.asyncMethodNames;

	  if (asyncMethodNames && angular.isArray(asyncMethodNames)) {
	    (function () {
	      var setDeferred = function setDeferred(methodName) {
	        spyService.__deferreds[methodName] = $q.defer();
	        spyService[methodName].and.returnValue(spyService.__deferreds[methodName].promise);
	      };

	      var getDeferred = function getDeferred(methodName) {
	        return spyService.__deferreds[methodName];
	      };

	      // in case this spy extends from a parent, keep the deferreds
	      spyService.__deferreds = spyService.__deferreds || {};

	      spyService.setDeferred = setDeferred;
	      spyService.getDeferred = getDeferred;

	      asyncMethodNames.forEach(function (methodName) {
	        spyService[methodName] = jasmine.createSpy(serviceName + methodName);
	        setDeferred(methodName);
	      });
	    })();
	  }
	}

	function addMethods() {
	  var args = Array.prototype.slice.call(arguments, 0);
	  if (angular.isArray(args[0])) {
	    this.methodNames = args[0];
	  } else {
	    this.methodNames = args;
	  }
	  return this;
	}

	function addAsyncMethods() {
	  var args = Array.prototype.slice.call(arguments, 0);
	  if (angular.isArray(args[0])) {
	    this.asyncMethodNames = args[0];
	  } else {
	    this.asyncMethodNames = args;
	  }
	  return this;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = 'Spy';
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _spySuffix = __webpack_require__(2);

	var _spySuffix2 = _interopRequireDefault(_spySuffix);

	module.exports = window.injectSpy = injectSpy;

	var initializedSpyModules = [];

	window.beforeEach(function () {
	  initializedSpyModules = [];
	});

	window.afterEach(function () {
	  initializedSpyModules = [];
	});

	function injectSpy(spyInjections) {
	  var spyInjectionNames;

	  if (typeof spyInjections === 'function') {
	    spyInjectionNames = angular.injector.$$annotate(spyInjections);
	  } else if (!angular.isArray(spyInjections) || spyInjections.length < 2 || typeof spyInjections[spyInjections.length - 1] !== "function") {

	    throw new Error('The injection parameter must be an array of injections and a function in the end');
	  } else {
	    spyInjectionNames = spyInjections.slice(0, -1);
	  }
	  createModules(spyInjectionNames);

	  return inject(spyInjections);
	}

	function createModules(spyInjections) {
	  for (var i = 0; i < spyInjections.length; i++) {
	    var spyName = spyInjections[i];

	    if (!angular.isString(spyName)) {
	      throw new Error('Spy name must be of type String, injection value was: ' + spyName);
	    }
	    var spyModuleName = spyName + _spySuffix2['default'];

	    if (initializedSpyModules.indexOf(spyModuleName) === -1) {
	      initializedSpyModules.push(spyModuleName);
	      beforeEach(window.module(spyModuleName));
	    }
	  }
	}

/***/ }
/******/ ]);