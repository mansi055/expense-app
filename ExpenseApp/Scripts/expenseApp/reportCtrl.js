(function () {

    //'use strict';
    
    //app.header('Access-Control-Allow-Origin: *');
    //create angularjs controller
    //var app = angular.module('expenseApp', []);//set and get the angular module
    app.controller('reportController', ['$scope', '$http', '$location', reportController]);

    //var reportId = 0;

    //angularjs controller method
    function reportController($scope, $http, $location) {
        var pathName = $location.path();
        var empId = pathName.toString().split("/")[3];
        var reportId = 0;

        //declare variable for maintain ajax load and entry or edit mode
        $scope.loading = true;
        $scope.addMode = false;

        $scope.trloading = true;
        $scope.traddMode = false;

        $scope.showModal = false;

        $scope.open = function () {
            $scope.showModal = true;
        };

        $scope.ok = function () {
            $scope.showModal = false;
        };

        $scope.cancel = function () {
            $scope.showModal = false;
        };


        //get all employee information
        $http.get('http://localhost:7274/api/Employees/' + empId).success(function (data) {
            $scope.employee = data;
            $scope.reports = $scope.employee.ExpenseReports
            //$scope.reports = $scope.employee[0].ExpenseReports;
            $scope.loading = false;
        })
        .error(function () {
            $scope.error = "An Error has occured while loading posts!";
            $scope.loading = false;
        });

        //by pressing toggleEdit button ng-click in html, this method will be hit
        $scope.toggleEdit = function () {
            this.report.editMode = !this.report.editMode;
        };
        $scope.trtoggleEdit = function () {
            this.transaction.treditMode = !this.transaction.treditMode;
        };

        //by pressing toggleAdd button ng-click in html, this method will be hit
        $scope.toggleAdd = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.trtoggleAdd = function () {
            //document.getElementById("transaddform").style.display = "block";
            $scope.traddMode = !$scope.traddMode;
             //document.getElementById("transaddform").style.display = "none";
        };
        
        $scope.showtransform = function () {
            document.getElementById("transTable").style.display = "block";
            window.reportId = this.report.Id;

            var Id = this.report.Id;
            $scope.billList = [];

            $http.get('http://localhost:7274/api/ExpenseReports/' + Id).success(function (data) {
                $.each($scope.reports, function (i) {
                    if ($scope.reports[i].Id === Id) {
                        $scope.transactions = $scope.reports[i].Transactions;
                        
                        var i = $scope.transactions.length
                        while (i--) {
                            var j = $scope.transactions[i].Bills.length
                            while (j--) {
                                $scope.billList.push($scope.transactions[i].Bills[j]);
                            }
                        }
                        //window.transactionsList = $scope.transactions;
                        return false;
                    }
                });
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while retrieving transactions ! " + data;
                $scope.loading = false;
            });
            document.getElementById("transaddform").style.display = "block";
            
        };

        //Add Report
        $scope.add = function () {
            $scope.loading = true;
            this.newreport.EmployeeID = empId;
            var currentDate = new Date();
            this.newreport.Date = currentDate;
            $http.post('http://localhost:7274/api/ExpenseReports', this.newreport).success(function (data) {
                alert("Added Successfully!!");
                $scope.addMode = false;
                $scope.reports.push(data);
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while Adding report! " + data;
                $scope.loading = false;
            });
        };

        //Edit Report
        $scope.save = function () {
            alert("Edit");
            $scope.loading = true;
            var frien = this.report;
            alert(frien);
            $http.put('http://localhost:7274/api/ExpenseReports/' + frien.Id, frien).success(function (data) {
                alert("Saved Successfully!!");
                frien.editMode = false;
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while Saving report! " + data;
                $scope.loading = false;
            });
        };

        //Delete Report
        $scope.deletereport = function () {
            $scope.loading = true;
            var Id = this.report.Id;
            $http.delete('http://localhost:7274/api/ExpenseReports/' + Id).success(function (data) {
                alert("Deleted Successfully!!");
                $.each($scope.reports, function (i) {
                    if ($scope.reports[i].Id === Id) {
                        $scope.reports.splice(i, 1);
                        return false;
                    }
                });
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while Saving report! " + data;
                $scope.loading = false;
            });
        };

        //Retrieve Transactions and bills
        $scope.viewtransactions = function () {
            $scope.loading = true;
            document.getElementById("transTable").style.display = "block";
            var Id = this.report.Id;
            $scope.billList = [];

            $http.get('http://localhost:7274/api/ExpenseReports/' + Id).success(function (data) {
                $.each($scope.reports, function (i) {
                    if ($scope.reports[i].Id === Id) {
                        $scope.transactions = $scope.reports[i].Transactions;
                        var i = $scope.transactions.length
                        while (i--) {
                            var j = $scope.transactions[i].Bills.length
                            while (j--) {
                                $scope.billList.push($scope.transactions[i].Bills[j]);
                            }
                        }
                        //window.transactionsList = $scope.transactions;
                        return false;
                    }
                });
                $scope.loading = false;
            }).error(function (data) {
                $scope.error = "An Error has occured while retrieving transactions ! " + data;
                $scope.loading = false;
            });
        };
        
        //Edit Transaction
        $scope.savetransaction = function () {
            alert("Edit");
            $scope.loading = true;
            var currentDate = new Date();
            this.transaction.Date = currentDate;
            var frien = this.transaction;
            frien.Date = currentDate;
            var billfrien = this.transaction.Bills[0];
            alert(frien);

            //var fileurl = "C:\\Users\\manverma\\Desktop\\TONE_Assignments\\assignment-2\\ExpenseApp\\ExpenseApp\\";
            //var selectedfile = fileurl + document.getElementById("billurledit").files[0].name;
            //console.log(selectedfile);

            $http.put('http://localhost:7274/api/Transactions/' + frien.Id, frien).success(function (data) {
                alert("Saved Successfully!!");
                frien.treditMode = false;
                $scope.loading = false;

                /*
                billfrien.TransactionID = frien.Id;
                billfrien.Url = selectedfile;

                $http.put('http://localhost:7274/api/Bills/' + billfrien.Id, billfrien).success(function (data) {
                    alert("Bill Updated Successfully!!");
                    $scope.treditMode = false;
                    $scope.billList.push(data);
                    $scope.loading = false;
                }).error(function (data) {
                    $scope.error = "An Error has occured while Saving bill! " + data;
                    $scope.loading = false;
                });*/

            }).error(function (data) {
                $scope.error = "An Error has occured while Saving report! " + data;
                $scope.loading = false;
            });
        };


        //Add Transaction
        $scope.addtransaction = function () {
            $scope.loading = true;
            this.newtransaction.Date = new Date();
            var Id = window.reportId;
            this.newtransaction.ReportID = Id;
            var fileurl = "C:\\Users\\manverma\\Desktop\\TONE_Assignments\\assignment-2\\ExpenseApp\\ExpenseApp\\";
            var selectedfile = fileurl + document.getElementById("billurl").files[0].name;

            
            $http.post('http://localhost:7274/api/Transactions/', this.newtransaction).success(function (data) {
               var transID = data.Id;
                $scope.traddMode = false;
                $scope.loading = false;

                var bill = {"TransactionID": transID, "Url":selectedfile};

                $http.post('http://localhost:7274/api/Bills/', bill).success(function (databill) {
                    alert("Added Successfully!!");
                    $scope.traddMode = false;

                    $scope.billList.push(databill);
                    $scope.transactions.push(data);

                    $scope.loading = false;
                    }).error(function (databilll) {
                    $scope.error = "An Error has occured while Saving bill! " + databill;
                    $scope.loading = false;
                });
            }).error(function (data) {
                $scope.error = "An Error has occured while Saving report! " + data;
                $scope.loading = false;
            });

            document.getElementById("transaddform").style.display = "none";
        };

        //Delete Transaction
        $scope.deletetransaction = function () {
            $scope.loading = true;
            var Id = this.transaction.Id;
            $scope.transbills = [];

            $.each($scope.transactions, function (i) {
                if ($scope.transactions[i].Id === Id) {
                    transbills = $scope.transactions[i].Bills;
                    return false;
                }
            });

            var billId = transbills[0].Id;
            console.log(billId);
            
            $http.delete('http://localhost:7274/api/Bills/' + billId).success(function (data) {
                //alert("Deleted bill Successfully!!");
                $.each($scope.billList, function (i) {
                    if ($scope.billList[i].Id === billId) {
                        $scope.billList.splice(i, 1);
                        return false;
                    }
                });
                $scope.loading = false;
                //////////////////////////////

                $http.delete('http://localhost:7274/api/Transactions/' + Id).success(function (data) {
                    alert("Deleted Successfully!!");
                    $.each($scope.transactions, function (i) {
                        if ($scope.transactions[i].Id === Id) {
                            $scope.transactions.splice(i, 1);
                            return false;
                        }
                    });
                    $scope.loading = false;
                }).error(function (data) {
                    $scope.error = "An Error has occured while deleting transaction! " + data;
                    $scope.loading = false;
                });
                //////////////////////////////////

            }).error(function (data) {
                $scope.error = "An Error has occured while deleting bills! " + data;
                $scope.loading = false;
            });

        };

        $scope.toggleModal = function () {
            $scope.reportModal = this.report;
        };

   }

 })();