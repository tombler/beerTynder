app.controller('WishlistCtrl', ['$scope', '$firebaseArray', '$stateParams', '$ionicModal', function($scope, $firebaseArray, $stateParams, $ionicModal){
  
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
}]);