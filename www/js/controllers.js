angular.module('starter.controllers', ['firebase'])

// .run(['$rootScope', '$window', 'srvAuth', 
//   function($rootScope, $window, sAuth) {

//   $rootScope.user = {};

//   $window.fbAsyncInit = function() {
//     // Executed when the SDK is loaded

//     FB.init({ 

//       /* 
//        The app id of the web app;
//        To register a new app visit Facebook App Dashboard
//        ( https://developers.facebook.com/apps/ ) 
//       */

//       appId: '874695239280638', 

//       /* 
//        Adding a Channel File improves the performance 
//        of the javascript SDK, by addressing issues 
//        with cross-domain communication in certain browsers. 
//       */

//       channelUrl: 'app/channel.html', 

       
//        Set if you want to check the authentication status
//        at the start up of the app 
      

//       status: true, 

//       /* 
//        Enable cookies to allow the server to access 
//        the session 
//       */

//       cookie: true, 

//       /* Parse XFBML */

//       xfbml: true 
//     });

//     sAuth.watchAuthenticationStatusChange();

//   };

//   // Are you familiar to IIFE ( http://bit.ly/iifewdb ) ?

//   (function(d){
//     // load the Facebook javascript SDK

//     var js, 
//     id = 'facebook-jssdk', 
//     ref = d.getElementsByTagName('script')[0];

//     if (d.getElementById(id)) {
//       return;
//     }

//     js = d.createElement('script'); 
//     js.id = id; 
//     js.async = true;
//     js.src = "//connect.facebook.net/en_US/all.js";

//     ref.parentNode.insertBefore(js, ref);

//   }(document));

// }])

.factory('facebookService', function($q) {
    return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
})

.constant('PROXY', {
  url: 'http://localhost:1337/api.brewerydb.com/v2'
})

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://beertynder.firebaseio.com/users");
  return $firebaseAuth(usersRef);
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

// .controller('AppCtrl', function($scope, $state, $ionicModal) {
   
//   $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
//       $scope.loginModal = modal;
//     },
//     {
//       scope: $scope,
//       animation: 'slide-in-up'
//     }
//   );
//   //Be sure to cleanup the modal by removing it from the DOM
//   $scope.$on('$destroy', function() {
//     $scope.loginModal.remove();
//   });
// })

.controller('LoginCtrl', ['$scope', 'Auth', "$location", function ($scope, Auth, $location) {
 
  // $scope.login = function() {
  //   Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
  //     // User successfully logged in
  //     $location.url('tab/user/home')
  //     console.log(authData)
  //   }).catch(function(error) {
  //     if (error.code === "TRANSPORT_UNAVAILABLE") {
  //       Auth.$authWithOAuthPopup("facebook").then(function(authData) {
  //         // User successfully logged in. We can log to the console
  //         // since we’re using a popup here
  //         console.log(authData);
  //         $location.url('tab/user/home')
  //       });
  //     } else {
  //       // Another error occurred
  //       console.log(error);
  //     }
  //   });
  // };  
}])


.controller('LandingCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicModal', function($scope, $stateParams, $firebaseArray, $ionicModal) {
  // console.log('hello');

  $scope.isDisabled = true;
  $scope.addButtonText = "Added";

  var ref = new Firebase('https://beertynder.firebaseio.com/myBeers');
  $scope.myBeers = $firebaseArray(ref);
  // console.log($scope.myBeers);

  $scope.saveRatingToFirebase = function (beer, rating) {
    $scope.modal.hide();
    console.log(rating);
    console.log(beer);
    beer.rating = rating;
    $scope.myBeers.$save(beer)
      .then(function () {

      })

  }

  $scope.seeBeerDetails = function (beer) {
    console.log(beer);

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

    // Add a swipe-left function to remove beer from wishlist.
  
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
        if ($scope.beer[key] === undefined || $scope.beer[key] === (undefined + "%")) {
          $scope.beer[key] = "Not available.";
        }
      }

      console.log("Loaded beer: ", $scope.beer);
    }, function(data) {
      console.log(data)

    });
    
  }

  $scope.saveToWishlist = function () {
    console.log("swiped");
    console.log($scope.beer);

    var ref = new Firebase("https://beertynder.firebaseio.com/wishlist");
    $scope.wishlist = $firebaseArray(ref);

    $scope.wishlist.$add($scope.beer)
      .then(function (addedBeer) {
        console.log("The following beer was added to your wishlist: ", addedBeer);
      });

    runAjaxCall();
  }

  $scope.discard = function(){
    runAjaxCall();
  }

  $scope.saveToMyBeers = function () {
    console.log($scope.beer);

    var ref = new Firebase("https://beertynder.firebaseio.com/myBeers");
    $scope.myBeers = $firebaseArray(ref);
    console.log($scope.myBeers);
    $scope.myBeers.$add($scope.beer)
      .then(function (data) {
        console.log("Beer added to myBeers: ", data);
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

.controller('SearchCtrl', function($scope, $stateParams, $http, PROXY, $firebaseArray){
  $scope.userInput = "";

  $scope.search = function(){
    console.log("$scope.userInput", $scope.userInput);
    $http.get(PROXY.url + "/search/?&key=124796ba126c92f04f87e154a597c112&format=json&type=beer&q="+$scope.userInput).
    then(function(data) {///search?q=Goosinator&type=beer
      console.log(data);
      $scope.results = data.data.data;
      console.log("results", $scope.results);
    });
  }
})



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

