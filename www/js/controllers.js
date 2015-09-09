angular.module('starter.controllers', ['firebase'])

.constant("PROXY", {
  url: 'http://localhost:1337/api.brewerydb.com/v2'
})

.factory('storage', function () {
    var bucket = {};

    return {
        get: function (junk) {
            if (bucket.hasOwnProperty(junk)) {
                return bucket[junk];
            }
        },
        set: function (key, value) {
            bucket[key] = value;
        }
    };
})

.run(['storage', function(storage) {
   var ref = new Firebase("https://beertynder.firebaseio.com/");
   console.log("auth response", ref.getAuth());

   // auth = $firebaseAuth(ref);
   var authData = ref.getAuth();

   if (authData === null) {
     // ref.$authWithOAuthPopup(loginType)
     //   .then(function (authData) {
     //     storage.set("userId", authData.uid);
     //     // $location.url('/users/' + authData.uid);
     //   })
     //   .catch(function(error) {
     //     console.log("Authentication failed:", error);
     //   });
     } else {
       storage.set("userId", authData.uid);
     }
}])

.factory("Auth", function($firebaseAuth) {
 var usersRef = new Firebase("https://beertynder.firebaseio.com/");
 return $firebaseAuth(usersRef);
})

.controller('LoginCtrl', ['$scope', 'storage', "$location",  "Auth", "$firebaseArray", function ($scope, storage, $location, Auth, $firebaseArray) {
// console.log("het")
$scope.login = function() {
   Auth.$authWithOAuthPopup("facebook")
     .then(function (authData) {
       if (authData !== null) {
         console.log(authData);
         storage.set("userId", authData.uid);
         var ref = new Firebase('https://beertynder.firebaseio.com/users');
         $scope.users = $firebaseArray(ref);
         
         
         $scope.users.$loaded()
           .then(function (users) {
             var userExists = 0;
             for (var i = 0; i < users.length; i++) {
               // console.log(users[i])
               if (users[i].uid === authData.uid) {
                 userExists = 1;
               } else {
                 console.log("New user: ", users[i].uid);
               }
               
             }
             console.log(userExists);
             if (userExists === 0) {
               $scope.users.$add({
                 "name": authData.facebook.displayName,
                 "profilePic": authData.facebook.profileImageURL,
                 "uid": authData.uid,
                 "myBeers": [],
                 "wishlist": []
               })
             }
           })
         

         $location.path('tab/'+ authData.uid + '/home');
       }
     });
 };
}])
 

.controller('LandingCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicModal', 'storage', '$location', function($scope, $stateParams, $firebaseArray, $ionicModal, storage, $location) {
  // console.log('hello');
  $scope.userId = storage.get("userId");

  $scope.isDisabled = true;
  $scope.addButtonText = "Added";



  var ref = new Firebase("https://beertynder.firebaseio.com/users");
    $scope.users = $firebaseArray(ref);

    $scope.users.$loaded()
      .then(function (usersArray) {
        for (var i = 0; i < usersArray.length; i ++) {
          if (usersArray[i].uid === $scope.userId) {
            console.log(usersArray[i].$id);

            var ref = new Firebase("https://beertynder.firebaseio.com/users/" + usersArray[i].$id + "/myBeers/");
            $scope.userBeers = $firebaseArray(ref);

          }
        }

      })



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


.controller('ExploreCtrl', ["$scope", "$stateParams", "$http", "PROXY", "$firebaseArray", "storage", function($scope, $stateParams, $http, PROXY, $firebaseArray, storage){

  $scope.userId = storage.get("userId");
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
        dateAdded: new Date()
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

    var ref = new Firebase("https://beertynder.firebaseio.com/users");
    $scope.users = $firebaseArray(ref);

    $scope.users.$loaded()
      .then(function (usersArray) {
        for (var i = 0; i < usersArray.length; i ++) {
          if (usersArray[i].uid === $scope.userId) {
            console.log(usersArray[i].$id);

            var ref = new Firebase("https://beertynder.firebaseio.com/users/" + usersArray[i].$id + "/wishlist/");
            $scope.userWishlist = $firebaseArray(ref);
            $scope.userWishlist.$add($scope.beer)
              .then(function (data) {
                console.log("New beer added: ", data)
              })

          }
        }

      })

    runAjaxCall();
  }

  $scope.discard = function(){
    runAjaxCall();
  }

  $scope.saveToMyBeers = function () {
    console.log($scope.beer);

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
  
}])


.controller('WishlistCtrl', ['$scope', '$firebaseArray', '$stateParams', '$ionicModal', "storage", function($scope, $firebaseArray, $stateParams, $ionicModal, storage){
  // console.log("Yo");
  $scope.userId = storage.get("userId");
  $scope.addButtonText = "Add To My Beers";



  var ref = new Firebase("https://beertynder.firebaseio.com/users");
  $scope.users = $firebaseArray(ref);

  $scope.users.$loaded()
    .then(function (usersArray) {
      for (var i = 0; i < usersArray.length; i ++) {
        if (usersArray[i].uid === $scope.userId) {
          console.log(usersArray[i].$id);

          var ref = new Firebase("https://beertynder.firebaseio.com/users/" + usersArray[i].$id + "/wishlist/");
          $scope.userWishlist = $firebaseArray(ref);

        }
      }

    })

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
    $scope.userWishlist.$remove(beerDetail)
      .then(function (data) {
        console.log("Removed beer from wishlist: ", data);
      })

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

              $scope.myBeers.$add(beerDetail)
              .then(function (data) {
                console.log("Beer added to myBeers: ", data);
              })   
         } 
        }
      });

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
    $http.get(PROXY.url + "/search/?&key=124796ba126c92f04f87e154a597c112&format=json&type=beer&withBreweries=Y&q="+$scope.userInput).
    then(function(data) {///search?q=Goosinator&type=beer
      console.log(data);
      $scope.results = data.data.data;
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

