app.controller('LandingCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicModal', '$location', function($scope, $stateParams, $firebaseArray, $ionicModal, $location) {
  
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
}]);