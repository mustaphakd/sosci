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

    service.addNewVictim = function(victim){

        var defr = $q.defer();




        var req ={
            method: "POST",
            url: getPathName() + "/api/victims/add",
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            },
            data:{
                /*name: newMedCenter.name,
                province_id: newMedCenter.provinceId,
                country_id: newMedCenter.countryId,
                detail: newMedCenter.detail,
                capacity: newMedCenter.capacity,
                centertype: newMedCenter.centerType,
                locationlat: newMedCenter.locationLat,
                locationlong: newMedCenter.locationLong*/
            }
        }

        service.timeoutToken = $timeout(function(){
            $timeout.cancel(service.timeoutToken);
            service.timeoutToken = null;

            defr.resolve(victim);

        }, 2000);

/*        $http(req)
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
*/


        return defr.promise;
    }


    service.getVictims = function(){

        var newDeferred = $q.defer();

        var req ={
            method: "GET",
            url: getPathName() + "/api/medsites/index",
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }
        }
/*
        $http(req)
            .success(function(data, status, headers, config){
                if(data.message == "success")
                {
                    var dataLength = data.medsites.length;
                    var jData = [];

                    for(var i = 0; i < dataLength; i++){
                        var medSite = data.medsites[i].Medsite;
                        var site = {};
                        site.countryName = data.medsites[i].Country.name;
                        site.provinceName = data.medsites[i].Province.name;
                        site.name = medSite.name;
                        site.locationLat = medSite.locationlat;
                        site.locationLong = medSite.locationlong;
                        site.detail = medSite.detail;
                        site.capacity = medSite.capacity;
                        site.centerType = medSite.centerType;

                        jData.push(site);
                    }

                    newDeferred.resolve(jData);
                }
                else
                    newDeferred.reject("Error: " + data);
            })
            .error(function(data, status, headers, config){
                newDeferred.reject("Error: " + data);
            });
*/

        service.timeoutToken = $timeout(function(){
            $timeout.cancel(service.timeoutToken);
            service.timeoutToken = null;

            var victims = [
                {
                    idx: 0,
                    occurenceDate: "12/30/2015"  ,
                    name: "lopiioa_1",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "open",
                    gndr: "f",
                    lat: "7.707134",
                    lng: "-5.026487"
                },
                {
                    idx: 1,
                    occurenceDate: "02/15/2015"  ,
                    name: "etrs_2",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "pending",
                    gndr: "m",
                    lat: "7.704519",
                    lng: "-5.033278"
                },
                {
                    idx: 2,
                    occurenceDate: "12/05/2015"  ,
                    name: "lopiioa_3",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "unknown",
                    gndr: "m",
                    lat: "7.701255",
                    lng: "-5.028750"
                },
                {
                    idx: 3,
                    occurenceDate: "01/30/2015"  ,
                    name: "etrs_4",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "unresolved",
                    gndr: "m",
                    lat: "7.699981",
                    lng: "-5.039817"
                },
                {
                    idx: 4,
                    occurenceDate: "02/03/2015"  ,
                    name: "lopiioa_5",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "pending",
                    gndr: "f",
                    lat: "7.685189",
                    lng: "-5.031336"
                },
                {
                    idx: 5,
                    occurenceDate: "10/21/2015"  ,
                    name: "etrs_6",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "open",
                    gndr: "m",
                    lat: "7.682957",
                    lng: "-5.029641"
                },
                {
                    idx: 6,
                    occurenceDate: "07/10/2015"  ,
                    name: "lopiioa_7",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "unresolved",
                    gndr: "f",
                    lat: "7.683935",
                    lng: "-5.028332"
                },
                {
                    idx: 7,
                    occurenceDate: "04/13/2015"  ,
                    name: "etrs_8",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "pending",
                    gndr: "f",
                    lat: "7.683212",
                    lng: "-5.023043"
                },
                {
                    idx: 8,
                    occurenceDate: "07/07/2015"  ,
                    name: "lopiioa_9",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "closed",
                    gndr: "f",
                    lat: "7.682818",
                    lng: "-5.018451"
                },
                {
                    idx: 9,
                    occurenceDate: "06/10/2015"  ,
                    name: "etrs_10",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "open",
                    gndr: "m",
                    lat: "7.671612",
                    lng: "-5.016090"
                },
                {
                    idx: 10,
                    occurenceDate: "11/26/2015"  ,
                    name: "lopiioa_11",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "pending",
                    gndr: "m",
                    lat: "7.680039",
                    lng: "-5.056994"
                },
                {
                    idx: 11,
                    occurenceDate: "12/31/2015"  ,
                    name: "etrs_12",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "unresolved",
                    gndr: "m",
                    lat: "7.688630",
                    lng: "-5.066178"
                },
                {
                    idx: 12,
                    occurenceDate: "05/20/2015"  ,
                    name: "lopiioa_13",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "pending",
                    gndr: "f",
                    lat: "7.719377",
                    lng: "-5.057766"
                },
                {
                    idx: 13,
                    occurenceDate: "03/13/2015"  ,
                    name: "etrs_14",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "unknown",
                    gndr: "m",
                    lat: "7.686971",
                    lng: "-5.084932"
                },
                {
                    idx: 14,
                    occurenceDate: "02/06/2015"  ,
                    name: "lopiioa_15",
                    ageGrp: "young adult",
                    location: "school",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "open",
                    gndr: "f",
                    lat: "7.672043",
                    lng: "-5.049055"
                },
                {
                    idx: 15,
                    occurenceDate: "10/15/2015"  ,
                    name: "etrs_16",
                    ageGrp: "young adult",
                    location: "home",
                    detail: "bal;k afkl;ajsk asfl;kjaskfja",
                    status: "unresolved",
                    gndr: "f",
                    lat: "7.660043",
                    lng: "-5.052075"
                }
            ];

            newDeferred.resolve(victims);

        },5000);

        return newDeferred.promise;
    }

    service.updateVictim = function(victim){

        var defr = $q.defer();




        var req ={
            method: "POST",
            url: getPathName() + "/api/victims/update",
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json'
            },
            data:{
                /*name: newMedCenter.name,
                 province_id: newMedCenter.provinceId,
                 country_id: newMedCenter.countryId,
                 detail: newMedCenter.detail,
                 capacity: newMedCenter.capacity,
                 centertype: newMedCenter.centerType,
                 locationlat: newMedCenter.locationLat,
                 locationlong: newMedCenter.locationLong*/
            }
        }

        service.timeoutToken = $timeout(function(){
            $timeout.cancel(service.timeoutToken);
            service.timeoutToken = null;

            defr.resolve(victim);

        }, 1000);

        /*        $http(req)
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
         */


        return defr.promise;
    }


    return service;

}]);

