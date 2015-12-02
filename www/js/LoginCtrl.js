app.controller('LoginCtrl', ['$scope', "$state",  "Auth", "$firebaseArray", "$http", function ($scope, $state, Auth, $firebaseArray, $http) {

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

                  $scope.userToAdd = {
                     name: user.name,
                     profilePic: user.profilePic,
                     uid: response.id,
                     myBeers: [],
                     wishlist: []
                  };

                  $http.post('/beerTynder', $scope.userToAdd)
                  .success(function(response) {
                    console.log(response);
                  });

            // $scope.users.$loaded()
            //   .then(function (users) {
            //    var userExists = 0;
            //    for (var i = 0; i < users.length; i++) {
            //      // console.log(users[i])
            //      if (users[i].uid === response.id) {
            //        userExists = 1;
            //      } else {
            //        console.log("New user: ", users[i].uid);
            //      }                     
            //    }
            //    console.log(userExists);
            //    if (userExists === 0) {
            //      $scope.users.$add({
            //        "name": user.name,
            //        "profilePic": user.profilePic,
            //        "uid": response.id,
            //        "myBeers": [],
            //        "wishlist": []
            //      })
            //    }
            //   })
                  $state.go('tab.home');
              });
          });
      }
  };
    // END FB Login
}]);