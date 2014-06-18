'use strict';

/**
 * @ngdoc function
 * @name editableTableApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the editableTableApp
 */
angular.module('editableTableApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
