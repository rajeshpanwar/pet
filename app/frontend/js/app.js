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
    }).state('select_pet', {
        url: '/shop',
        templateUrl: '/templates/shop.html',
        controller: 'shopCtrl'
    });

}]);

m.run(['$rootScope', '$location', '$http', '$state', '$stateParams', function ($rootScope, $location, $http, $state, $stateParams) {
    console.log("Run called");
    $rootScope.ps = {};
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

        var options = {
            method: 'POST',
            url: '/api/v1/user/login',
            data: $scope.data
        }
        $http(options).then(function (response) {
            console.log("--------------", response);
            $rootScope.ps.user = response.data;
            alert("User login successfully");
            $location.path('/pet-selection');
        }, function (response) {
            alert("Error  occurred in user Login");
        })
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
        $http(options).then(function (response) {
            console.log("--------------", response);
            alert("User registered successfully");
            $location.path('/pet-selection');
        }, function (response) {
            alert("Error  occurred in user registration");
        })

    }

}]);


m.controller("petCtrl", ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    console.log('petCtrl Ctrl called');
    $scope.pets = null;
    $http.get('/api/v1/pet/list').then(function (response) {
        console.log("Response >>>>>>>>>>>", response);
        $scope.pets = response.data;

        $http.get('/api/v1/pet/selected-pet').then(function (response) {
            console.log("Response >>>>>>>>>>>", response);
            if (response && response.data) {
                $scope.pets.forEach(function (pet) {
                    pet.selected = false
                    if (response.data.indexOf(pet._id) > -1) {
                        pet.selected = true;
                    }
                })
            }
        }, function (error) {
            //alert("Something Went Wrong");
        });

    }, function (error) {
        alert("Something Went Wrong");
    });

}]);


m.controller("shopCtrl", ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    console.log('petCtrl Ctrl called');
    $scope.pets = null;
    $http.get('/api/v1/pet/list').then(function (response) {
        console.log("Response >>>>>>>>>>>", response);
        $scope.pets = response.data;

        $http.get('/api/v1/pet/selected-pet').then(function (response) {
            console.log("Response >>>>>>>>>>>", response);
            if (response && response.data) {
                $scope.pets.forEach(function (pet) {
                    pet.selected = false
                    if (response.data.indexOf(pet) > -1) {
                        pet.selected = true;
                    }
                })
            }
        }, function (error) {
            //alert("Something Went Wrong");
        });

    }, function (error) {
        alert("Something Went Wrong");
    });


    $scope.submit = function () {
        var selected = [];

        console.log("$scope.pets >>>>>>>>>>>>", $scope.pets);

        $scope.pets.forEach(function (pet) {
            if (pet.selected) {
                selected.push(pet._id);
            }
        });
        var options = {
            method: 'put',
            url: '/api/v1/user/updatepetSelection',
            data: {
                pets: selected
            }
        }
        $http(options).then(function (response) {
            console.log("--------------", response);
            alert("Pet selected Successfully");
            $location.path('/pet-selection');
        }, function (response) {
            alert("Error  occurred in pet selected");
        })


    }


}]);




