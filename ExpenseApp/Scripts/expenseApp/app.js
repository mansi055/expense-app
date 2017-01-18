var app = angular.module('expenseApp', [], function ($locationProvider) {
    $locationProvider.html5Mode($locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    }));

});
