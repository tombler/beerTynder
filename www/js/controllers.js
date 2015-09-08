angular.module('starter.controllers', ['firebase'])

.controller('LoginCtrl', ["$scope", "$firebaseAuth", "$q", "Auth", "$location",
  function($scope, $firebaseAuth, $q, storage, Auth, $location) {

  var usersRef = new Firebase("https//beertynder.firebaseio.com/users");
  $scope.uid = $firebaseAuth(usersRef);

  $scope.login = function() {
  $scope.uid.$authWithOAuthRedirect("facebook").then(function(authData) {
    // User successfully logged in
  }).catch(function(error) {
    if (error.code === "TRANSPORT_UNAVAILABLE") {
      Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
        // User successfully logged in. We can log to the console
        // since we’re using a popup here
        console.log(authData);
      });
    } else {
      // Another error occurred
      console.log(error);
    }
  });
};

}])

.controller('LandingCtrl', ['$scope', '$stateParams', '$firebaseArray', function($scope, $stateParams, $firebaseArray) {
  // console.log('hello');
  var ref = new Firebase('https://beertynder.firebaseio.com/myBeers');
  $scope.myBeers = $firebaseArray(ref);
  // console.log($scope.myBeers);
  
}])

.controller('ExploreCtrl', function($scope, $stateParams, $http){

  console.log("hello");
  $http.get("http://localhost:1337/api.brewerydb.com/v2/beer/random/?key=124796ba126c92f04f87e154a597c112&format=json&hasLabels=Y&withBreweries=Y").
  then(function(data) {
    var beer = {
      name: data.data.data.name,
      img: data.data.data.labels.medium,
      company: data.data.data.breweries[0].name,
      abv: data.data.data.abv,
      shortDescript: data.data.data.shortName,
      descript: data.data.data.style.description
    }
    console.log("data :", data);
    console.log("beer :", beer);
    $scope.beer = beer;
  }, function(data) {
    console.log(data)
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
})

.controller('WishlistCtrl', ['$scope', '$firebaseArray', '$stateParams', function($scope, $firebaseArray, $stateParams){
  console.log("Yo");

  var ref = new Firebase("https://beertynder.firebaseio.com/wishlist");

    $scope.wishlist = $firebaseArray(ref);

    console.log("$scope.wishlist", $scope.wishlist);

    $scope.rating = 5;
    $scope.saveRatingToServer = function(rating) {
      console.log('Rating selected - ' + rating);
    };
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

