angular.module('starter.services', ['firebase'])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//beertynder.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})
