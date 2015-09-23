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

	module.exports = "";

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _spySuffix = __webpack_require__(2);

	var _spySuffix2 = _interopRequireDefault(_spySuffix);

	module.exports = window.angular.spyOnService = createServiceSpy;

	function createServiceSpy(serviceName, parents) {

	  function AngularSpy() {
	    var spyInstance = this;
	    this.methodNames = null;
	    this.asyncMethodNames = null;

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
	      var spy, deferreds, args, methodNames, asyncMethodNames, parentSpy;

	      args = Array.prototype.slice.call(arguments, 0);
	      spy = {};

	      var $q = args[0];

	      for (var i = 1; i < args.length; i++) {
	        parentSpy = args[i];
	        angular.extend(spy, parentSpy);
	      }

	      if (spyInstance.methodNames && angular.isArray(spyInstance.methodNames)) {
	        methodNames = spyInstance.methodNames;
	        methodNames.forEach(function (methodName) {
	          spy[methodName] = jasmine.createSpy(serviceName + methodName);
	        });
	      }

	      if (spyInstance.asyncMethodNames) {
	        (function () {
	          var setDeferred = function setDeferred(methodName) {
	            deferreds[methodName] = $q.defer();
	            spy[methodName].and.returnValue(deferreds[methodName].promise);
	          };

	          var getDeferred = function getDeferred(methodName) {
	            return deferreds[methodName];
	          };

	          asyncMethodNames = spyInstance.asyncMethodNames;

	          deferreds = {};

	          spy.setDeferred = setDeferred;
	          spy.getDeferred = getDeferred;

	          asyncMethodNames.forEach(function (methodName) {
	            spy[methodName] = jasmine.createSpy(serviceName + methodName);
	            setDeferred(methodName);
	          });
	        })();
	      }
	      return spy;
	    }
	  }

	  AngularSpy.prototype.methods = createMethods;
	  AngularSpy.prototype.asyncMethods = createAsyncMethods;

	  return new AngularSpy();

	  function createMethods(methodNames) {
	    this.methodNames = methodNames;
	    return this;
	  }

	  function createAsyncMethods(asyncMethodNames) {
	    this.asyncMethodNames = asyncMethodNames;
	    return this;
	  }
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

	function injectSpy(spiesArrayFn) {

	  if (!angular.isArray(spiesArrayFn)) {
	    throw new Error('The injection parameter must be an array of injections and a function in the end');
	  }
	  for (var i = 0; i < spiesArrayFn.length - 1; i++) {
	    var spyName = spiesArrayFn[0];
	    if (!angular.isString(spyName)) {
	      throw new Error('Spy names must be Strings');
	    }
	    beforeEach(window.module(spyName + _spySuffix2['default']));
	  }
	  return inject(spiesArrayFn);
	}

/***/ }
/******/ ]);