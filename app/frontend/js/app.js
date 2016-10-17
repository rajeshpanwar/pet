/**
 * Created by rajesh on 17/10/16.
 */


var m = angular.module('pet', ['ui.router']);


m.factory('myHttpInterceptor', ['$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {
    return {
        response: function (response) {
            return response;
        },
        responseError: function (response) {
            // do something on error
            return $q.reject(response);
        }
    };
}]);

m.config(['$httpProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider', function ($httpProvider, $locationProvider, $urlRouterProvider, $stateProvider) {

    $httpProvider.interceptors.push('myHttpInterceptor');
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.defaults.headers.common = {
        'ajax': 1
    };

    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/templates/home.html',
    }).state('select_page', {
        url: '/pet-selection',
        templateUrl: '/templates/petselection.html'
    });

}]);

m.run(['$rootScope', '$location', '$http', '$state', '$stateParams', function ($rootScope, $location, $http, $state, $stateParams) {
    console.log("Run called");
}]);

/* Controller */
m.controller("loginCtrl", ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    console.log('Login Ctrl called');

    $scope.data = {};


    $scope.submit = function () {
        $scope.errors = {};

        if (!$scope.data.email) {
            $scope.errors['email'] = "Required Fields"
        }

        if (!$scope.data.password) {
            $scope.errors['email'] = "Required Fields"
        }


    }

}]);

m.controller("registrationCtrl", ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    console.log('Login Ctrl called');


    $scope.data = {};


    $scope.submit = function () {
        $scope.errors = {};

        if (!$scope.data.email) {
            $scope.errors['email'] = "Required Fields"
        }

        if (!$scope.data.password) {
            $scope.errors['email'] = "Required Fields"
        }

        if ($scope.data.password && $scope.data.password != $scope.data.confirm_password) {
            $scope.errors['confirm_password'] = "Confirm password does not match";
        }

        if (Object.keys($scope.errors).length > 0) {
            return;
        }

        var options = {
            method: 'POST',
            url: '/api/v1/user/registration',
            data: $scope.data
        }

        $http(options).then(function (response, status, headers) {
           console.log("--------------", response, status, headers);
        }, function (response, status, headers) {
        })

    }

}]);




