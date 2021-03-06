'use strict';

/**
 * @ngdoc overview
 * @name editableTableApp
 * @description
 * # editableTableApp
 *
 * Main module of the application.
 */
angular
  .module('editableTableApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
