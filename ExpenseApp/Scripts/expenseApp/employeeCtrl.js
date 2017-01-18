(function () {
    'use strict';
    //create angularjs controller
    //var app = angular.module('expenseApp', []);//set and get the angular module
    app.controller('employeeController', ['$scope', '$http', '$location', employeeController]);
    app.controller('reportController', ['$scope', '$http', '$location', reportController]);

    //angularjs controller method
    function employeeController($scope, $http, $location) {

        //declare variable for maintain ajax load and entry or edit mode
        $scope.loading = true;
        $scope.addMode = false;
       
        
        //get all employee information
        $http.get('http://localhost:7274/api/Employees').success(function (data) {
            $scope.employees = data;
            $scope.loading = false;
        })
        .error(function () {
            $scope.error = "An Error has occured while loading posts!";
            $scope.loading = false;
        });

        //by pressing toggleEdit button ng-click in html, this method will be hit
        $scope.toggleEdit = function () {
            this.employee.editMode = !this.employee.editMode;
        };

        //by pressing toggleAdd button ng-click in html, this method will be hit
        $scope.toggleAdd = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.add = function () {
            $scope.loading = true;
            $http.post('http://localhost:7274/api/Employees', this.newemployee).success(function (data) {
                alert("Added Successfully!!");
                $scope.addMode = false;
                $scope.employees.push(data);
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while Adding employee! " + data;
                $scope.loading = false;
            });
        };

        //Edit Employee
        $scope.save = function () {
            //alert("Edit");
            $scope.loading = true;
            var frien = this.employee;
            //alert(frien);
            $http.put('http://localhost:7274/api/Employees/' + frien.Id, frien).success(function (data) {
                alert("Saved Successfully!!");
                frien.editMode = false;
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while Saving employee! " + data;
                $scope.loading = false;
            });
        };

        //Delete employee
        $scope.deleteemployee = function () {
            $scope.loading = true;
            var Id = this.employee.Id;
            $http.delete('http://localhost:7274/api/Employees/' + Id).success(function (data) {
                alert("Deleted Successfully!!");
                $.each($scope.employees, function (i) {
                    if ($scope.employees[i].Id === Id) {
                        $scope.employees.splice(i, 1);
                        return false;
                    }
                });
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while Saving employee! " + data;
                $scope.loading = false;
            });
        };

        

    }


    function reportController($scope, $http, $location) {
        $scope.message = "ssas";

        //get all employee information
        $http.get('http://localhost:7274/api/Employees/').success(function (data) {
            $scope.employee = data;
            $scope.url = $location.path();
            $scope.loading = false;
        })
        .error(function () {
            $scope.error = "An Error has occured while loading posts!";
            $scope.loading = false;
        });

    }
})();
