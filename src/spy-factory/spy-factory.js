import spySuffix from '../spy-suffix';

module.exports = window.angular.spyOnService = createServiceSpy;

function createServiceSpy(serviceName, parents) {

  function AngularSpy() {
    var spyInstance = this;
    this.methodNames = null;
    this.asyncMethodNames = null;

    var parentServiceNames = [],
      parentModuleNames = [];

    if (parents && angular.isArray(parents)){
      parentServiceNames = parents;
      parentModuleNames = parents.map(function(parent){
        return parent+spySuffix;
      })
    }

    angular
      .module(serviceName + spySuffix, parentModuleNames)
      .factory(serviceName, factory);

    factory.$inject = ['$q'].concat(parentServiceNames);

    function factory() {
      var spy,
        deferreds,
        args,
        methodNames,
        asyncMethodNames,
        parentSpy;

      args = Array.prototype.slice.call(arguments, 0);
      spy = {};

      var $q = args[0];

      for (var i=1; i<args.length; i++){
        parentSpy = args[i];
        angular.extend(spy, parentSpy);
      }

      if (spyInstance.methodNames && angular.isArray(spyInstance.methodNames)) {
        methodNames = spyInstance.methodNames;
        methodNames.forEach(function (methodName) {
          spy[methodName] = jasmine.createSpy(serviceName + methodName);
        })
      }

      if (spyInstance.asyncMethodNames) {
        asyncMethodNames = spyInstance.asyncMethodNames;


        deferreds = {};

        spy.setDeferred = setDeferred;
        spy.getDeferred = getDeferred;

        asyncMethodNames.forEach(function (methodName) {
          spy[methodName] = jasmine.createSpy(serviceName + methodName);
          setDeferred(methodName);
        })

        function setDeferred(methodName) {
          deferreds[methodName] = $q.defer();
          spy[methodName].and.returnValue(deferreds[methodName].promise);
        }

        function getDeferred(methodName) {
          return deferreds[methodName];
        }
      }
      return spy;
    }

  }


  AngularSpy.prototype.methods = createMethods;
  AngularSpy.prototype.asyncMethods = createAsyncMethods;

  return new AngularSpy();

  function createMethods() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (angular.isArray(args[0])){
      this.methodNames = args[0];
    }else{
      this.methodNames = args;
    }
    return this;
  }

  function createAsyncMethods() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (angular.isArray(args[0])){
      this.asyncMethodNames = args[0];
    }else{
      this.asyncMethodNames = args;
    }
    return this;
  }

}