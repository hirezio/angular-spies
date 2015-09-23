import spySuffix from '../spy-suffix';

describe('spy-loader', ()=>{

  var spyName,
    spyInjections,
    returnedValue;


  Given(() => {
    spyName = 'mySpy';
    window.module = jasmine.createSpy('window.module');
    window.inject = jasmine.createSpy('window.inject');
  });

  describe('when called with the wrong format', () => {
    Given(() => spyInjections = '' );
    Then(() => {
      expect(() => injectSpy(spyInjections)).toThrow();
    });
  });

  describe('when called with an empty array', () => {
    Given( () => spyInjections = [] );
    Then(() => {
      expect(() => injectSpy(spyInjections)).toThrow();
    });
  });

  describe('when called with a wrong array', () => {
    Given( () => spyInjections = ['test', 1, function(){}] );
    Then(() => {
      expect(() => injectSpy(spyInjections)).toThrow();
    });
  });

  describe('when called with a single function array', () => {
    Given( () => spyInjections = [function(){}] );
    Then(() => {
      expect(() => injectSpy(spyInjections)).toThrow();
    });
  });

  describe('when called with an array with a function in the end', () => {

    Given(() => {
      spyName = 'mySpy';
      spyInjections = [spyName, () => {}];
      window.module = jasmine.createSpy('window.module');
      window.inject = jasmine.createSpy('window.inject');
      window.inject.and.returnValue('CALLED');
    });

    When(() => returnedValue = injectSpy(spyInjections) );

    Then(() => {
      expect(window.module).toHaveBeenCalledWith(spyName + spySuffix);
      expect(window.inject).toHaveBeenCalledWith(spyInjections);
      expect(returnedValue).toBe('CALLED');
    } );
  });

  describe('when called with a function of injections', () => {

    Given(() => {

      spyInjections = (spyName) => {};
      window.module = jasmine.createSpy('window.module');
      window.inject = jasmine.createSpy('window.inject');
      window.inject.and.returnValue('CALLED');
    });

    When(() => returnedValue = injectSpy(spyInjections) );

    Then(() => {
      expect(window.module).toHaveBeenCalledWith(spyName + spySuffix);
      expect(window.inject).toHaveBeenCalledWith(spyInjections);
      expect(returnedValue).toBe('CALLED');
    } );
  });

});