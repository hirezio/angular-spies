describe('spy-factory', () => {

  var serviceName,
    returnedService,
    $rootScope,
    spy;

  Given(() => {
    serviceName = 'myService';
  });

  describe('spy with no methods', () => {

    Given(() => {
      spy = angular.spyOnService(serviceName);
    });

    When(injectSpy( (myService) => {
      returnedService = myService;
    }));

    Then(() => {
      expect(returnedService).toEqual({});
    });

    describe('spy with method names as parameters', () => {
      Given(() => {
        spy.methods('doSomething');
      });
      Then(() => {
        expect(spy.methodNames).toEqual(['doSomething']);
      });
    });

    describe('spy with method names as an array', () => {
      Given(() => {
        spy.methods(['doSomething']);
      });

      When(injectSpy( (myService) => {
        returnedService = myService;
        myService.doSomething();
      }));

      Then(() => {
        expect(returnedService.doSomething).toHaveBeenCalled();
      });

      describe('spy with async method names as parameters', () => {
        Given(() => {
          spy.asyncMethods('doSomethingAsync');
        });
        Then(() => {
          expect(spy.asyncMethodNames).toEqual(['doSomethingAsync']);
        });
      });

      describe('spy with asyncMethods', () => {
        var promiseResponse,
          fakePromiseResponse;
        Given(()=>{
          fakePromiseResponse = 'BOO!';
          spy.asyncMethods(['doSomethingAsync']);
        });

        When(injectSpy( (myService) => {
          returnedService = myService;
          returnedService.getDeferred('doSomethingAsync')
            .resolve(fakePromiseResponse);

          returnedService
            .doSomethingAsync()
            .then((response)=> promiseResponse = response);
        }));

        When(inject( (_$rootScope_) => {
          $rootScope = _$rootScope_;
          $rootScope.$apply();
        }));

        Then(() => {
          expect(returnedService.doSomethingAsync).toHaveBeenCalled();
          expect(promiseResponse).toBe(fakePromiseResponse);
        });
      });

      describe('extending a spy', () => {
        var childSpy,
          returnedChildSpy;

        Given(() => {
          childSpy = angular.spyOnService('childSpy', [serviceName]);
        });

        When(injectSpy( (childSpy) => {
          returnedChildSpy = childSpy;
        }));

        Then(() => {
          expect(returnedChildSpy.doSomething).toHaveBeenCalled();
        });

        describe('copy also asyncMethods with their deferreds when child spy has asyncMethods too', function () {
          var promiseResult,
            fakePromiseResult;

          Given(function(){
            spy.asyncMethods(['doSomethingAsync']);

            childSpy.asyncMethods('childAsyncMethod');

            fakePromiseResult = 'BOOM!';
          });


          When(injectSpy( (childSpy) => {
            returnedChildSpy = childSpy;
            returnedChildSpy
              .getDeferred('doSomethingAsync')
              .resolve(fakePromiseResult);

            returnedChildSpy
              .doSomethingAsync()
              .then(onSuccess);

            function onSuccess(result){
              promiseResult = result;
            }
          }));

          When(inject( (_$rootScope_) => {
            $rootScope = _$rootScope_;
            $rootScope.$apply();
          }));

          Then(function(){
            expect(promiseResult).toBe(fakePromiseResult);
          });
        });
      });

    });



  });



});