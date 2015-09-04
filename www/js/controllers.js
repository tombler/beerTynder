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
})
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
