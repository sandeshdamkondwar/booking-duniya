/**
 * SPWebApp Module
 *
 * Description
 */

var app = angular.module('BDWebApp', ['ngRoute'])
    .config(['$routeProvider', routeProvider])
    .config(['$locationProvider', locationProvider]);

function routeProvider ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/views/bookingView.html',
        controller: 'BookingController'
    })
    .when('/booking', {
        templateUrl: 'app/views/bookingView.html',
        controller: 'BookingController'
    })
    .otherwise({
        redirectTo: '/'
    });
}

function locationProvider ($locationProvider) {
    $locationProvider.hashPrefix("!");
}
