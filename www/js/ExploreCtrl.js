app.controller('ExploreCtrl', ["$scope", "$stateParams", "$http", "PROXY", "$firebaseArray", function($scope, $stateParams, $http, PROXY, $firebaseArray){

  $scope.userId = window.localStorage.getItem("userId");
  // On page load, run ajax call
  runAjaxCall();

  function runAjaxCall() {
    $http.get("http://api.brewerydb.com/v2/beer/random/?key=124796ba126c92f04f87e154a597c112&format=json&hasLabels=Y&withBreweries=Y").
    then(function(data) {
      $scope.beer = {
        // Main data to be displayed on explore page:
        name: data.data.data.name,
        style: data.data.data.style.category.name,
        brewery: data.data.data.breweries[0].name,
        abv: data.data.data.abv + "%",
        ibu: data.data.data.ibu,
        labelMedium: data.data.data.labels.medium,
        description: data.data.data.description,
        // Additional data to store for Beer Detail view:
        styleDescrip: data.data.data.style.category.description,
        organic: data.data.data.isOrganic,
        labelIcon: data.data.data.labels.icon,
        labelLarge: data.data.data.labels.large,
        // glassType: data.data.data.glass.name,
        foodPairings: data.data.data.foodPairings,
        breweryLoc: data.data.data.breweries[0].locations[0].locality,
        breweryCountry: data.data.data.breweries[0].locations[0].country.name,
        breweryWebsite: data.data.data.breweries[0].website,
        breweryType: data.data.data.breweries[0].locations[0].locationTypeDisplay,
        // User-specific data:
        rating: 0,
        dateAdded: new Date()
      }

      // **** Avoids errors when passing $scope.beer to Firebase.
      for (var key in $scope.beer) {
        if ($scope.beer[key] === undefined || $scope.beer[key] === (undefined + "%")) {
          $scope.beer[key] = "Not available.";
        }
      }

      //console.log("Loaded beer: ", $scope.beer);
    }, function(data) {
      //console.log(data)
    });
  }

  $scope.saveToWishlist = function () {
    $http.post('/beerTynder', $scope.beer)
      .success(function(response) {
        //console.log(response);
      });
    runAjaxCall();
  }

  $scope.discard = function(){
    runAjaxCall();
  }

  $scope.saveToMyBeers = function () {
    //console.log($scope.beer);

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

              $scope.myBeers.$add($scope.beer)
              .then(function (data) {
                console.log("Beer added to myBeers: ", data);
              })   
         } 
        }
      });
    runAjaxCall();
  }
}]);