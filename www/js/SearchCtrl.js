app.controller('SearchCtrl', function($scope, $stateParams, $http, PROXY, $firebaseArray){
  
  $scope.userId = window.localStorage.getItem("userId");

  $scope.userInput = "";

  $scope.search = function(){
    console.log("$scope.userInput", $scope.userInput);
    $http.get("http://api.brewerydb.com/v2/search/?&key=124796ba126c92f04f87e154a597c112&format=json&type=beer&withBreweries=Y&q="+$scope.userInput).
    then(function(data) {///search?q=Goosinator&type=beer
      console.log(data);
      $scope.results = data.data.data;
      for (var key in $scope.results) {
        for(var i=0; i<$scope.results.length; i++){
          console.log($scope.results[key][i]);
        }
      }
      console.log("results", $scope.results);
    });
  }

  $scope.addToMyBeers = function(beer){

    var ref = new Firebase("https://beertynder.firebaseio.com/users");
    $scope.users = $firebaseArray(ref);

    $scope.users.$loaded()
      .then(function (usersArray) {
        for (var i = 0; i < usersArray.length; i++) {
         // console.log(users[i])
         if (usersArray[i].uid === $scope.userId) {
            // console.log("userId.$id", userId.$id);

            var ref = new Firebase('https://beertynder.firebaseio.com/users/' + usersArray[i].$id + '/myBeers/');
            $scope.myBeers = $firebaseArray(ref);

              $scope.myBeers.$add(beer)
              .then(function (data) {
                console.log("Beer added to myBeers: ", data);
              })   
         } 
        }
      });
  }

  $scope.addToWishlist = function(beer){

  var ref = new Firebase("https://beertynder.firebaseio.com/users");
  $scope.users = $firebaseArray(ref);

  $scope.users.$loaded()
    .then(function (usersArray) {
      for (var i = 0; i < usersArray.length; i++) {
       // console.log(users[i])
       if (usersArray[i].uid === $scope.userId) {
          // console.log("userId.$id", userId.$id);

          var ref = new Firebase('https://beertynder.firebaseio.com/users/' + usersArray[i].$id + '/wishlist/');
          $scope.wishlist = $firebaseArray(ref);

            $scope.wishlist.$add(beer)
            .then(function (data) {
              console.log("Beer added to Wishlist: ", data);
            })   
       } 
      }
    });
  }
});