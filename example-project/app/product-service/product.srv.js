(function(){

  angular
    .module('productsExample')
    .factory('productService', srv);

  function srv($http){

    this.getProducts = getProducts;

    function getProducts(){
      var promise = $http.get('/products')
                          .then(mapper);

      function mapper(response){
        return response.data;
      }

      return promise;
    }



  }

})();