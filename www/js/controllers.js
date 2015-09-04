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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
