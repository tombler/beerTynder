angular.module('starter.controllers', [])



.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('LandingCtrl', ['$scope', '$stateParams', '$firebaseArray', function($scope, $stateParams, $firebaseArray) {
  // console.log('hello');
  var ref = new Firebase('https://beertynder.firebaseio.com/myBeers');
  $scope.myBeers = $firebaseArray(ref);
  // console.log($scope.myBeers);
}])

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
