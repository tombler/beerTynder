angular.module('starter.controllers', ['firebase'])

.constant("PROXY", {
  url: 'https://crossorigin.me/http://api.brewerydb.com/v2'
})

.controller('LoginCtrl', ['$scope', "$state",  "Auth", "$firebaseArray", function ($scope, $state, Auth, $firebaseArray) {

  var ref = new Firebase('https://beertynder.firebaseio.com/users');
  $scope.users = $firebaseArray(ref);
         
  // FB Login
  $scope.fbLogin = function () {
      FB.login(function (response) {
          if (response.authResponse) {
              getUserInfo();
          } else {
              console.log('User cancelled login or did not fully authorize.');
          }
      }, {scope: 'email,user_photos,user_videos'});

      function getUserInfo() {
          // get basic info
          FB.api('/me', function (response) {
              console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
              // get profile picture
              FB.api('/me/picture?type=normal', function (picResponse) {
                  console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
                  response.imageUrl = picResponse.data.url;

                  var user = {};
                  user.name = response.name;
                  user.email = response.email;
                  if(response.gender) {
                      response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
                  } else {
                      user.gender = '';
                  }
                  user.profilePic = picResponse.data.url;
                  window.localStorage.setItem('userId', response.id);

                  $scope.users.$loaded()
                    .then(function (users) {
                     var userExists = 0;
                     for (var i = 0; i < users.length; i++) {
                       // console.log(users[i])
                       if (users[i].uid === response.id) {
                         userExists = 1;
                       } else {
                         console.log("New user: ", users[i].uid);
                       }                     
                     }
                     console.log(userExists);
                     if (userExists === 0) {
                       $scope.users.$add({
                         "name": user.name,
                         "profilePic": user.profilePic,
                         "uid": response.id,
                         "myBeers": [],
                         "wishlist": []
                       })
                     }
                    })
                  $state.go('tab.home');
              });
          });
      }
  };
    // END FB Login
}]) 

.controller('LandingCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicModal', '$location', function($scope, $stateParams, $firebaseArray, $ionicModal, $location) {
  
  $scope.userId = window.localStorage.getItem("userId");

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

  // ******** Beer Rating not implemented yet *******
  // $scope.saveRatingToFirebase = function (beer, rating) {
  //   $scope.modal.hide();
  //   console.log(rating);
  //   console.log(beer);
  //   beer.rating = rating;
  //   $scope.myBeers.$save(beer)
  //     .then(function () {

  //     })
  // }

  $scope.removeFromBeerlist = function(beer){
    console.log("removed clicked");
    $scope.userBeers.$remove(beer)
    .then(function (data) {
      console.log("Removed beer from mybeers: ", data);
    });
  };

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
}]) 

.controller('ExploreCtrl', ["$scope", "$stateParams", "$http", "PROXY", "$firebaseArray", function($scope, $stateParams, $http, PROXY, $firebaseArray){

  $scope.userId = window.localStorage.getItem("userId");
  // On page load, run ajax call
  runAjaxCall();

  function runAjaxCall() {
    $http.get(PROXY.url + "/beer/random/?key=124796ba126c92f04f87e154a597c112&format=json&hasLabels=Y&withBreweries=Y").
    then(function(data) {
      //console.log(data)
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

.controller('WishlistCtrl', ['$scope', '$firebaseArray', '$stateParams', '$ionicModal', function($scope, $firebaseArray, $stateParams, $ionicModal){
  
  $scope.userId = window.localStorage.getItem("userId");
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

  $scope.removeFromWishlist = function(beer){
    console.log("removed clicked");
    $scope.userWishlist.$remove(beer)
    .then(function (data) {
      console.log("Removed beer from wishlist: ", data);
    });
  };
}])

.controller('SocialCtrl', ['$scope', '$firebaseArray', '$stateParams', "$ionicModal", function($scope, $firebaseArray, $stateParams, $ionicModal){

  var ref = new Firebase("https://beertynder.firebaseio.com/users");
  $scope.users = $firebaseArray(ref);

  $ionicModal.fromTemplateUrl('templates/socialDetail.html', {
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

    $scope.seeUserDetails = function (user) {
      $scope.modal.show();
      $scope.thisUser = user;
      $scope.firstName = user.name.split(" ")[0];
      // console.log($scope.firstName);
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
}])

.controller('SearchCtrl', function($scope, $stateParams, $http, PROXY, $firebaseArray){
  
  $scope.userId = window.localStorage.getItem("userId");

  $scope.userInput = "";

  $scope.search = function(){
    console.log("$scope.userInput", $scope.userInput);
    $http.get(PROXY.url + "/search/?&key=124796ba126c92f04f87e154a597c112&format=json&type=beer&withBreweries=Y&q="+$scope.userInput).
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
})
// beer star rating, not implemented yet.
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

