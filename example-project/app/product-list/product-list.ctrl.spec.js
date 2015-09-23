describe('Product List', function () {
  var productServiceSpy,
    $controller,
    $rootScope,
    vm;

  beforeEach( injectSpy(function(productService){
    productServiceSpy = productService;
  }));

  beforeEach( inject(function(_$controller_,
                                 _$rootScope_){
    $controller = _$controller_;
    $rootScope = _$rootScope_;

    vm = $controller('productListCtrl');

  }));

  describe('METHOD: fetchProducts', function () {

    it('should populate vm.products', function(){

      var fakeProducts = ['product1', 'product2'];
      vm.products = [];

      productServiceSpy.getDeferred('getProducts').resolve(fakeProducts)

      vm.fetchProducts();

      $rootScope.flush();

      expect(vm.products.length).toBe(2);
      expect(productServiceSpy.getProducts).toHaveBeenCalled();

    });

  });

});
