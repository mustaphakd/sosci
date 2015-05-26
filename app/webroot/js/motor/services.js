/**
 * Created by Mustapha on 2/15/2015.
 */



var appServices = angular.module('appServices', []);

appServices.service('repositoryService', [ "$q", function( $q){


    //InitializeDb
}]);

appServices.factory('suotinService', [ "$location", "$q" ,"repositoryService","$http", "$timeout", function ( $location, $q, repositoryService,  $http, $timeout) {
    var service = {};
    //debugger;

    service.addNewVictim = function (victim) {

        var defr = $q.defer();

        var test = getPathName();
        var req = {
            method: "POST",
            url: suotin.initialDefaultLocation + "/api/victims/add",  //getPathName()
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            },
            data: {
                name: victim.name,
                crimetype: victim.crimeType,
                picurl: victim.imageUrl,
                detail: victim.detail,
                locationlat: victim.lat,
                locationlng: victim.lng,
                agegroup: victim.ageGroup,
                occurenceplace: victim.place,
                casestatus: victim.status,
                occurrencedate: victim.occurenceDate,
                gender: victim.gender
            }
        }

        /*service.timeoutToken = $timeout(function(){
         $timeout.cancel(service.timeoutToken);
         service.timeoutToken = null;

         defr.resolve(victim);

         }, 2000);*/

        $http(req)
            .success(function (data, status, headers, config) {
                if (data.status != undefined && data.status.toLowerCase() == "success") {
                    defr.resolve(null);
                }
                else
                    defr.reject("Error: " + data.message);
            })
            .error(function (data, status, headers, config) {
                defr.reject("Error: " + data);
            });


        return defr.promise;
    }


    service.getVictims = function (page) {

        /*
         *
         * name: victim.name,
         crimetype: victim.crimeType,
         picurl: victim.imageUrl,
         detail: victim.detail,
         locationlat: victim.lat,
         locationlng: victim.lng,
         agegroup: victim.ageGroup,
         occurenceplace: victim.place,
         casestatus: victim.status,
         occurrencedate: victim.occurenceDate,
         gender: victim.gender
         * */


        if (angular.isUndefined(page))
            page = 0;

        var newDeferred = $q.defer();

        var req = {
            method: "GET",
            url: suotin.initialDefaultLocation + "/api/victims/get?page=" + page,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json',
                'x-pageopo': page
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data != undefined && data.status != undefined && data.status.toLowerCase() == "success") {
                    var dataLength = data.victims.length;
                    var jData = [];

                    var multiplier = (data.page.current - 1 ) * data.page.pageSize;

                    for (var i = 0; i < dataLength; i++) {
                        var currentVictim = data.victims[i].Victim;
                        var victim = {};
                        victim.idx = i + multiplier; //temporary
                        victim.id = currentVictim.id;
                        victim.name = currentVictim.name;
                        victim.url = currentVictim.picurl;
                        victim.detail = " ";
                        victim.lat = currentVictim.locationlat;
                        victim.lng = currentVictim.locationlng;
                        victim.gender = service._getGender(currentVictim.gender);
                        victim.ageGroup = service._getAgeGroup(currentVictim.agegroup);
                        //victim.place = currentVictim.occurenceplace;
                        victim.status = service._getStatus(currentVictim.casestatus);
                        victim.occurrencedate = currentVictim.occurrencedate;


                        jData.push(victim);
                    }

                    var packt = {data: jData, currentPage: data.page.current, totalPage: data.page.pageCount};

                    newDeferred.resolve(packt);
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function (data, status, headers, config) {
                newDeferred.reject("Error: " + data);
            });


        /*service.timeoutToken = $timeout(function(){
         $timeout.cancel(service.timeoutToken);
         service.timeoutToken = null;

         newDeferred.resolve(victims);

         },5000);*/

        return newDeferred.promise;
    }

    service._getAgeGroup = function (_num, gender) {

        switch (_num) {

            case "1" :
                return (gender == null || gender == undefined) ? "an enfant" : (gender == 'f') ? "a little girl" : "a little boy";
                break;
            case "2" :
                return (gender == null || gender == undefined) ? " a teenage" : (gender == 'f') ? "a teen aged girl" : "a teen aged boy";//(12-18 ans)
                break;
            case "4" :
                return (gender == null || gender == undefined) ? "a Jeune Adult" : (gender == 'f') ? "a young woman" : "a young man";//(19 - 25 ans)
                break;
            case "8":
                return (gender == null || gender == undefined) ? " an Adult" : (gender == 'f') ? " an adult woman" : "an adult man";//(26 - 45 ans)
                break;
            case "16":
                return (gender == null || gender == undefined) ? " a middle age person" : (gender == 'f') ? " a middle aged woman" : " a middle aged man";//(46 - 69 ans)
                break;

            default :
                return (gender == null || gender == undefined) ? " an elderly person" : (gender == 'f') ? " an old woman" : " an old aged man";
                break;

        }

    };

    service._getStatus = function (_num) {
        switch (parseInt(_num)) {
            case 1:
                return "open";
                break;
            case 2:
                return "pending";
                break;
            case 16:
                return "close";
                break;
            case 4:
                return "unresolved";
                break;
            default :
                return "unknown";
                break;  //8
        }
    };

    service._getGender = function (_num) {
        switch (parseInt(_num)) {
            case 0:
            case 1:
                return "m";
                break;
            default :
                return "f";
                break;
        }
    };

    service._getCrimeType = function (_num) {
        switch (parseInt(_num)) {
            case 1:
                return "kidnapped";
                break;
            default:
                return "murdered";
                break; //2
        }
    };

    service._getOccurrencePlace = function (_num) {
        switch (_num) {
            case "1":
                return "Club";
                break;
            case "2":
                return "Ecole";
                break;
            case "4":
                return "Marche";
                break;
            case "8":
                return "Rue";
                break;
            case "16":
                return "Taxi";
                break;
            case "32":
                return "Maison";
                break;
            default:
                return "other";
                break; //32
        }
    };

    service.getVictimDetail = function (victimId) {


        var newDeferred = $q.defer();

        var req = {
            method: "GET",
            url: suotin.initialDefaultLocation + "/api/victims/detail/" + victimId,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data != undefined && data.status != undefined && data.status.toLowerCase() == "success") {
                    var currentVictim = data.victim;
                    var victim = {};
                    victim.crimeType = service._getCrimeType(currentVictim.crimetype);
                    victim.detail = currentVictim.detail;

                    newDeferred.resolve({id: victimId, details: victim});
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function (data, status, headers, config) {
                newDeferred.reject("Error: " + data);
            });
        return newDeferred.promise;
    };

    service.getGallery = function (page) {


        if (angular.isUndefined(page))
            page = 0;

        var newDeferred = $q.defer();

        var req = {
            method: "GET",
            url: suotin.initialDefaultLocation + "/api/victims/pics?page=" + page,
            headers: {
                'Accept': "application/json"
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data != undefined && data.status != undefined && data.status.toLowerCase() == "success") {
                    var dataLength = data.victims.length;
                    var jData = [];

                    for (var i = 0; i < dataLength; i++) {
                        var currentVictim = data.victims[i].Victim;
                        var victim = {};
                        victim.id = currentVictim.id;
                        victim.name = currentVictim.name;
                        //victim.crimeType = currentVictim.crimetype;
                        victim.imageUrl = currentVictim.picurl;
                        //victim.detail = " "; //currentVictim.detail;
                        //victim.lat = currentVictim.locationlat;
                        //victim.lng = currentVictim.locationlng;
                        victim.gender = service._getGender(currentVictim.gender);
                        victim.ageGroup = service._getAgeGroup(currentVictim.agegroup, victim.gender);
                        victim.place = service._getOccurrencePlace(currentVictim.occurenceplace);
                        //victim.status = service._getStatus(currentVictim.casestatus);
                        victim.occurrencedate = currentVictim.occurrencedate;


                        jData.push(victim);
                    }

                    var packt = {data: jData, currentPage: data.page.current, totalPage: data.page.pageCount};

                    newDeferred.resolve(packt);
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function (data, status, headers, config) {
                newDeferred.reject("Error: " + data);
            });
        return newDeferred.promise;
    };
/*
    service.updateVictim = function (victim) {

        var defr = $q.defer();

        var req = {
            method: "POST",
            url: getPathName() + "/api/victims/update",
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            },
            data: {
                /*name: victim.name,
                 province_id: victim.provinceId,
                 country_id: victim.countryId,
                 detail: victim.detail,
                 capacity: victim.capacity,
                 centertype: victim.centerType,
                 locationlat: victim.locationLat,
                 locationlong: victim.locationLong
            }
        }

        service.timeoutToken = $timeout(function () {
            $timeout.cancel(service.timeoutToken);
            service.timeoutToken = null;

            defr.resolve(victim);

        }, 1000);

                $http(req)
         .success(function(data, status, headers, config){
         if(data.message == "success")
         {
         defr.resolve(null);
         }
         else
         defr.reject("Error: " + data);
         })
         .error(function(data, status, headers, config){
         defr.reject("Error: " + data);
         });



        return defr.promise;
    };
*/
    service.getDatavizDates = function () {
        var newDeferred = $q.defer();

        var req = {
            method: "GET",
            url: suotin.initialDefaultLocation + "/api/victims/availableYears",
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data != undefined && data.status != undefined && data.status.toLowerCase() == "success") {
                    var dataLength = data.years.length;
                    var jData = [];

                    for (var i = 0; i < dataLength; i++) {
                        var year = data.years[i];

                        jData.push(year);
                    }

                    var packt = {data: jData};

                    newDeferred.resolve(packt);
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function (data, status, headers, config) {
                newDeferred.reject("Error: " + data);
        });

        return newDeferred.promise;

    };

    service.getVictimsByDate = function (_date) {


        var newDeferred = $q.defer();

        var req = {
            method: "GET",
            url: suotin.initialDefaultLocation + "/api/victims/vizData/" + _date,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data != undefined && data.status != undefined && data.status.toLowerCase() == "success") {
                    var dataLength = data.victims.length;
                    var jData = [];


                    for (var i = 0; i < dataLength; i++) {
                        var currentVictim = data.victims[i].Victim;
                        var victim = {};

                        victim.gender = service._getGender(currentVictim.gender);
                        victim.ageGroupOrdinal = currentVictim.agegroup;
                        victim.placeOrdinal = currentVictim.occurenceplace;


                        victim.ageGroup = service._getAgeGroup(currentVictim.agegroup);
                        victim.place = service._getOccurrencePlace(currentVictim.occurenceplace);
                        //victim.status = service._getStatus(currentVictim.casestatus);
                        victim.occurrencedate = currentVictim.occurrencedate;


                        jData.push(victim);
                    }

                    var packt = {data: jData};

                    newDeferred.resolve(packt);
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function (data, status, headers, config) {
                newDeferred.reject("Error: " + data);
            });
        return newDeferred.promise;
    };

    service.userLoggedIn = function () {


        var newDeferred = $q.defer();

        var req = {
            method: "GET",
            url: suotin.initialDefaultLocation + "/api/users/still_logged_in/" ,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data != undefined && data.status != undefined && data.status.toLowerCase() == "success") {


                    var packt = {data: data.loggedin};

                    newDeferred.resolve(packt);
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function (data, status, headers, config) {
                newDeferred.reject("Error: " + data);
            });
        return newDeferred.promise;
    };



    service.getUserContributions = function (page) {

        if (angular.isUndefined(page))
            page = 0;

        var newDeferred = $q.defer();

        var req = {
            method: "GET",
            url: suotin.initialDefaultLocation + "/api/victims/get_user_contributions?page=" + page,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json',
                'x-pageopo': page
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data != undefined && data.status != undefined && data.status.toLowerCase() == "success") {
                    var dataLength = data.victims.length;
                    var jData = [];

                    //var multiplier = (data.page.current - 1 ) * data.page.pageSize;

                    for (var i = 0; i < dataLength; i++) {
                        var currentVictim = data.victims[i].Victim;
                        var victim = {};
                        victim.idx = i; //+ multiplier; //temporary
                        victim.id = currentVictim.id;
                        victim.name = currentVictim.name;
                        victim.url = currentVictim.picurl;
                        victim.detail = currentVictim.detail;
                        victim.lat = currentVictim.locationlat;
                        victim.lng = currentVictim.locationlng;

                        victim.gender = currentVictim.gender;
                        victim.ageGroup = currentVictim.agegroup;
                        victim.place = currentVictim.occurenceplace;
                        victim.status = currentVictim.casestatus;
                        victim.crimeType = currentVictim.crimetype;

                        victim.crimeTypeDisplay = service._getCrimeType(currentVictim.crimetype);
                        victim.genderDisplay = service._getGender(currentVictim.gender);
                        victim.ageGroupDisplay = service._getAgeGroup(currentVictim.agegroup);
                        victim.placeDisplay = service._getOccurrencePlace(currentVictim.occurenceplace);
                        victim.statusDisplay = service._getStatus(currentVictim.casestatus);
                        victim.occurrencedate = currentVictim.occurrencedate;

                        victim.location = " lat: " + victim.lat + " lng: " + victim.lng;


                        jData.push(victim);
                    }

                    var packt = {data: jData};// currentPage: data.page.current, totalPage: data.page.pageCount};

                    newDeferred.resolve(packt);
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function (data, status, headers, config) {
                newDeferred.reject("Error: " + data);
            });

        return newDeferred.promise;
    }

    service.updateVictim = function (victim) {

        var defr = $q.defer();

        var req = {
            method: "POST",
            url: suotin.initialDefaultLocation + "/api/victims/update_victim_info",
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            },
            data: {
                name: victim.name,
                crimetype: victim.crimeType,
                picurl: victim.url,
                detail: victim.detail,
                locationlat: victim.lat,
                locationlng: victim.lng,
                agegroup: victim.ageGroup,
                occurenceplace: victim.place,
                casestatus: victim.status,
                occurrencedate: victim.occurrencedate,
                gender: victim.gender,
                id: victim.id
            }
        }

        $http(req)
            .success(function (data, status, headers, config) {
                if (data.status != undefined && data.status.toLowerCase() == "success") {

                    req.data.crimeTypeDisplay = service._getCrimeType(req.data.crimetype);
                    req.data.genderDisplay = service._getGender(req.data.gender);
                    req.data.ageGroupDisplay = service._getAgeGroup(req.data.agegroup);
                    req.data.placeDisplay = service._getOccurrencePlace(req.data.occurenceplace);
                    req.data.statusDisplay = service._getStatus(req.data.casestatus);
                    req.data.occurrencedate = req.data.occurrencedate;

                    req.data.location = " lat: " + req.data.lat + " lng: " + req.data.lng;
                    
                    
                    defr.resolve({data:req.data});
                }
                else
                    defr.reject("Error: " + data.message);
            })
            .error(function (data, status, headers, config) {
                defr.reject("Error: " + data);
            });


        return defr.promise;
    }


    return service;

}]);

