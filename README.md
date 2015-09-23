# angular-spies
Super easy spy setup and injection library.

If you ever wrote Angular tests, especially in TDD style (Test Driven Development), you know you need Spies (also known by their other misused name: mocks).

You need them to isolate your units (services, controllers, etc...) from their dependencies (other services).

Usually it involves tons of boilerplate code but NO MORE! 

## Dependencies
* Angular 1.x
* angular-mocks (same version as Angular)
* Jasmine 2.x and above (spies are jasmine.createSpy)

## Installation

`npm install -g angular-spies`

or

`bower install angular-spies` 


## Usage

### Define a Spy

To define a spy, just use  `angular.spyOnService()`
It returns an object with 2 methods you can chain to - `methods` and `asyncMethods`. 

`productService.srv.spy.js`:

```js
angular
	.spyOnService('productService')
	.methods('getProducts', 'saveProducts')
```


### Inject a Spy

`productService.srv.spec.js`:

```js

var productCtrl,
	productServiceSpy;

beforeEach( injectSpy( function(productService) {
	
	// productService.getProducts is actualy a jasmine.createSpy()
	productServiceSpy = productService; 
	
}));

it ('should get products', function(){
	
	var fakeProducts = ['product1', 'product2'];
	
	productServiceSpy.getProducts.and.returnValue( fakeProducts );
	
	productCtrl.loadProducts();
	
	expect(productServiceSpy.getProducts).toHaveBeenCalled();
});

```

### Async Methods (Return Promises)
If you want to mark some methods as async, you just add them through the `asyncMethods` call like this:
```js
angular
	.spyOnService('productService')
	.methods('someSyncMethod')
	.asyncMethods('getProducts', 'saveProducts')
```

Angular spies uses $q in the background to create both the promise as the return value, and exposes its deferred object, and allows you to control the promise's state.

```js

it ('should get products async', function(){
	
	var fakeProducts = ['product1', 'product2'];
	
	var returnedProducts;
	
	productServiceSpy.getDeferred('getProducts').resolve( fakeProducts );
	
	productServiceSpy.getProducts().then(function (products) {
		returnedProducts = products;
	});
	
	$rootScope.flush();
	
	expect(productServiceSpy.getProducts).toHaveBeenCalled();
	
	expect(returnedProducts).toBe(fakeProducts);
	
});

``` 

### Extending a previous defined spy

If you want to extend the functionality of a spy.
Lets say for example that you have a generic spy for a data library, with all the CRUD methods defined already:

```js
angular
	.spyOnService('dataService')
	.asyncMethods('create', 'read', 'update', 'delete')
```

You can use the second parameter of the `spyOnService` method to declare its parent spies.
 
```js
angular
	.spyOnService('productService', ['dataService'])
	.asyncMethods('createProductByName')
```

Now the spy will have 5 async methods -  `create`, `read`, `update`, `delete` and `createProductByName` 

 

## License

Copyright (c) 2015 [HiRez.io](https://github.com/hirezio)

Licensed under [the MIT License](./LICENSE).