'use strict';

/**
 * @ngdoc function
 * @name editableTableApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the editableTableApp
 */
angular.module('editableTableApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
