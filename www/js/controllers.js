angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
})

.controller('ExploreCtrl', function($scope, $stateParams){

  console.log("hello");
  $http.get('http://localhost:1337/api.brewerydb.com/v2/beer/random/?key=124796ba126c92f04f87e154a597c112&format=json/hasLabels=Y').
  then(function(response) {
    console.log(response);
    $scope.beer = response;
    // this callback will be called asynchronously
    // when the response is available
  }, function(response) {
    console.log(response)
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
