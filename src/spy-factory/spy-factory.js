import spySuffix from '../spy-suffix';

module.exports = window.angular.spyOnService = createServiceSpy;

function createServiceSpy(serviceName, parents) {

  function AngularSpy() {
    var spyCreatorInstance = this;
    this.methodNames = null;
    this.asyncMethodNames = null;
    createAngularService(spyCreatorInstance, serviceName, parents);
  }

  AngularSpy.prototype.methods = addMethods;
  AngularSpy.prototype.asyncMethods = addAsyncMethods;

  return new AngularSpy();
}


function createAngularService(spyCreatorInstance, serviceName, parents){
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
    var spyService,
      args,
      $q,
      parentSpies;

    spyService = {};

    args = Array.prototype.slice.call(arguments, 0);
    $q = args[0];
    parentSpies = args.slice(1);

    parentSpies.forEach(function(parentSpy){
      angular.extend(spyService, parentSpy);
    });

    createSyncMethodsOnSpy(spyCreatorInstance,
                           spyService,
                           serviceName);

    createAsyncSyncMethodsOnSpy(spyCreatorInstance,
                                spyService,
                                serviceName,
                                $q);

    return spyService;
  }
}

function createSyncMethodsOnSpy(spyCreatorInstance, spyService, serviceName){
  var methodNames = spyCreatorInstance.methodNames;
  if (methodNames && angular.isArray(methodNames)) {
    methodNames.forEach(function (methodName) {
      spyService[methodName] = jasmine.createSpy(serviceName + methodName);
    })
  }
}

function createAsyncSyncMethodsOnSpy(spyCreatorInstance, spyService, serviceName, $q){
  var asyncMethodNames,
    deferreds;

  asyncMethodNames = spyCreatorInstance.asyncMethodNames;

  if (asyncMethodNames && angular.isArray(asyncMethodNames)) {

    deferreds = {};

    spyService.setDeferred = setDeferred;
    spyService.getDeferred = getDeferred;

    asyncMethodNames.forEach(function (methodName) {
      spyService[methodName] = jasmine.createSpy(serviceName + methodName);
      setDeferred(methodName);
    })

    function setDeferred(methodName) {
      deferreds[methodName] = $q.defer();
      spyService[methodName].and.returnValue(deferreds[methodName].promise);
    }

    function getDeferred(methodName) {
      return deferreds[methodName];
    }
  }
}


function addMethods() {
  var args = Array.prototype.slice.call(arguments, 0);
  if (angular.isArray(args[0])){
    this.methodNames = args[0];
  }else{
    this.methodNames = args;
  }
  return this;
}

function addAsyncMethods() {
  var args = Array.prototype.slice.call(arguments, 0);
  if (angular.isArray(args[0])){
    this.asyncMethodNames = args[0];
  }else{
    this.asyncMethodNames = args;
  }
  return this;
}