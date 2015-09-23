describe('spy-factory', function () {

  var serviceName,
    returnedService,
    $rootScope,
    spy;

  Given(function(){
    serviceName = 'myService';
  });

  describe('an empty spy', function () {

    Given(()=>{
      spy = angular.spyOnService(serviceName);
    });

    When(injectSpy( function(myService){
      returnedService = myService;
    }));

    Then(function(){
      expect(returnedService).toEqual({});
    });

    describe('spy with method names as parameters', function () {
      Given(()=>{
        spy.methods('doSomething');
      });
      Then(function(){
        expect(spy.methodNames).toEqual(['doSomething']);
      });
    });

    describe('spy with method names as an array', function () {
      Given(()=>{
        spy.methods(['doSomething']);
      });

      When(injectSpy( function(myService){
        returnedService = myService;
        myService.doSomething();
      }));

      Then(function(){
        expect(returnedService.doSomething).toHaveBeenCalled();
      });

      describe('spy with async method names as parameters', function () {
        Given(()=>{
          spy.asyncMethods('doSomethingAsync');
        });
        Then(function(){
          expect(spy.asyncMethodNames).toEqual(['doSomethingAsync']);
        });
      });

      describe('spy with asyncMethods', function () {
        var promiseResponse,
          fakePromiseResponse;
        Given(()=>{
          fakePromiseResponse = 'BOO!';
          spy.asyncMethods(['doSomethingAsync']);
        });

        When(injectSpy( function(myService){
          returnedService = myService;
          returnedService.getDeferred('doSomethingAsync')
            .resolve(fakePromiseResponse);

          returnedService
            .doSomethingAsync()
            .then((response)=> promiseResponse = response);
        }));

        When(inject(function(_$rootScope_){
          $rootScope = _$rootScope_;
          $rootScope.$apply();
        }));

        Then(function(){
          expect(returnedService.doSomethingAsync).toHaveBeenCalled();
          expect(promiseResponse).toBe(fakePromiseResponse);
        });
      });

      describe('extending a spy', function () {
        var childSpy,
          returnedChildSpy;
        Given(() => {
          spy = angular
                  .spyOnService('childSpy', [serviceName]);
        });

        When(injectSpy( function(childSpy){
          returnedChildSpy = childSpy;
          returnedChildSpy.doSomething();
        }));

        Then(function(){
          expect(returnedChildSpy.doSomething).toHaveBeenCalled();
        });
      });

    });



  });



});