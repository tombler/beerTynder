app.controller('SocialCtrl', ['$scope', '$firebaseArray', '$stateParams', "$ionicModal", function($scope, $firebaseArray, $stateParams, $ionicModal){

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
}]);