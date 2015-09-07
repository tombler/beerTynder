angular.module('starter.controllers', ['firebase'])

.constant('PROXY', {
  url: 'http://localhost:1337/api.brewerydb.com/v2'
})

.factory("storage", function () {
  var storageObj = {};

    return {
        get: function (key) {
            if (storageObj.hasOwnProperty(key)) {
                return storageObj[key];
            }
        },
        set: function (key, value) {
            storageObj[key] = value;
        }
    };
})


.controller('LandingCtrl', ['$scope', '$stateParams', '$firebaseArray', function($scope, $stateParams, $firebaseArray) {
  // console.log('hello');
  $scope.login = function() {

  };

  var ref = new Firebase('https://beertynder.firebaseio.com/myBeers');
  $scope.myBeers = $firebaseArray(ref);
  // console.log($scope.myBeers);
  
}])

.controller('ExploreCtrl', function($scope, $stateParams, $http, PROXY, $firebaseArray){

  // On page load, run ajax call
  runAjaxCall();

  function runAjaxCall() {
    $http.get(PROXY.url + "/beer/random/?key=124796ba126c92f04f87e154a597c112&format=json&hasLabels=Y&withBreweries=Y").
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
        dateAdded: new Date(),
        uid: "Tom"
      }
      // console.log("data :", data);

      // **** Avoids errors when passing $scope.beer to Firebase.
      for (var key in $scope.beer) {
        if ($scope.beer[key] === undefined) {
          $scope.beer[key] = "Not available.";
        }
      }

      console.log("Loaded beer: ", $scope.beer);
    }, function(data) {
      console.log(data)

    });
    
  }

  $scope.saveToWishlist = function () {
    console.log($scope.beer);

    var ref = new Firebase("https://beertynder.firebaseio.com/wishlist");
    $scope.wishlist = $firebaseArray(ref);

    $scope.wishlist.$add($scope.beer)
      .then(function (addedBeer) {
        console.log("The following beer was added to your wishlist: ", addedBeer);
      });

    runAjaxCall();
  }
  
})

.controller('WishlistCtrl', ['$scope', '$firebaseArray', '$stateParams', '$ionicModal', function($scope, $firebaseArray, $stateParams, $ionicModal){
  // console.log("Yo");

  $scope.addButtonText = "Add To My Beers";

  var ref = new Firebase("https://beertynder.firebaseio.com/wishlist");

  $scope.wishlist = $firebaseArray(ref);

  console.log("$scope.wishlist", $scope.wishlist);

  $scope.rating = 0;
  $scope.saveRatingToServer = function(rating) {
    console.log('Rating selected - ' + rating);
  };

  $scope.seeBeerDetails = function (beer) {
    console.log(beer);
    $scope.isDisabled = false;
    $scope.addButtonText = "Add To My Beers";

    $scope.beerDetail = beer;
    $scope.modal.show();
  }

  $ionicModal.fromTemplateUrl('templates/beerDetail.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;

    });
    $scope.openModal = function() {

      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

  $scope.saveToMyBeers = function (beerDetail) {
    // console.log(beerDetail); 
    $scope.wishlist.$remove(beerDetail)
      .then(function (data) {
        console.log("Removed beer from wishlist: ", data);
      })

    var ref = new Firebase("https://beertynder.firebaseio.com/myBeers");
    $scope.myBeers = $firebaseArray(ref);
    $scope.myBeers.$add(beerDetail)
      .then(function (data) {
        console.log("Beer added to myBeers: ", data);
      })

    $scope.isDisabled = true;
    $scope.addButtonText = "Added";
  }

  // Add a swipe-left function to remove beer from wishlist.

}])

.controller('SocialCtrl', ['$scope', '$firebaseArray', '$stateParams', function($scope, $firebaseArray, $stateParams){
  // console.log("Working");
  var ref = new Firebase("https://beertynder.firebaseio.com/users");
  $scope.users = $firebaseArray(ref);

}])



.directive('beerRating', function () {
  return {
    restrict: 'A',
    template: '<ul class="rating">' +
                '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
                  '\u2605' +
                '</li>' +
              '</ul>',
    scope: {
      ratingValue: '=',
      max: '=',
      readonly: '@',
      onRatingSelected: '&'
    },
    link: function (scope, elem, attrs) {

      var updateStars = function() {
        scope.stars = [];
        for (var  i = 0; i < scope.max; i++) {
          scope.stars.push({filled: i < scope.ratingValue});
        }
      };

      scope.toggle = function(index) {
        if (scope.readonly && scope.readonly === 'true') {
          return;
        }
        scope.ratingValue = index + 1;
        scope.onRatingSelected({rating: index + 1});
      };

      scope.$watch('ratingValue', function(newVal, oldVal) {
        if (newVal || newVal === 0) {
          updateStars();
        }
      });
    }
  }
});

