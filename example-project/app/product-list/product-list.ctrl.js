(function(){

  angular
    .module('productsExample')
    .controller('productListCtrl', ctrl);

  function ctrl(productService){
    var vm = this;

    vm.fetchProducts = function(){
      productService.getProducts()
                    .then(onSuccess);

      function onSuccess(fetchedProducts){
        vm.products = fetchedProducts;
      }
    }


  }

})();