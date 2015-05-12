var appControllers = angular.module('appControllers', []);
//'securityService','$modal',

appControllers.controller('mainAppController',['$scope','$route', '$location','$rootScope', '$templateCache', '$controller', '$compile','suotinService','$interval',
    function($scope, $route, $location, $rootScope, $templateCache, $controller, $compile, suotinService, $interval){

        $scope.$root = $rootScope;
        $scope.services = suotinService;

        appSuotin.lazyLoader.rootScope = $rootScope;
        appSuotin.lazyLoader.controller = $controller;
        appSuotin.lazyLoader.compile = $compile;
        appSuotin.lazyLoader.route = $route;
        appSuotin.lazyLoader.location = $location;
        appSuotin.lazyLoader.interval = $interval;

        /***** Notication structs****/
        $scope.NotificationMessage = "zbonjopr";
        $scope.NotificationClass = "";  /*********to be used on status-bar ng-class to auto hide on click event*********/

        $scope.hideNotification = function(){
            $scope.NotificationClass = "hideNotice";
        }
        $scope.AnimHideNotification = function(){
            $scope.notify = false;
        }

        $scope.showNotification = function(msg){
            $scope.NotificationClass = "";
            $scope.NotificationMessage = msg;
            $scope.notify = true;
            //$scope.AnimHideNotification();
        }
        $scope.notify = true;

        /***** intro modal structs****/
        $scope.modalTitle = "";
        $scope.hasModalTitle = true;
        $scope.modalContent = "";
        $scope.modalshowCloseButton = true;

        $scope.showModal = function(title, content, hasTitle, showCloseButton){
            //debugger;


        }

        $scope.showSaveModal = function(title, content, hasTitle, showCloseButton){
            //debugger;

            var scope = $scope.$new();
            scope.hasModalTitle = true;
            scope.modalTitle = "musmus";


            hasTitle = (typeof hasTitle === "undefined") ? true : hasTitle;
            if(hasTitle)
            {
                scope.modalTitle = title;
                scope.modalContent = content;
            }
            else{
                scope.modalContent = content;
            }

            showCloseButton = (typeof showCloseButton === "undefined") ? true : showCloseButton;

            var $modalInstance = $modal.open({
                templateUrl: 'views/modalSavedTpl.html',
                //controller: 'ModalInstanceCtrl',
                scope: scope
            });

            scope.ok = function () {
                $modalInstance.close();
            };

            scope.cancel = function () {
                $modalInstance.dismiss('cancel');
                scope.$destroy();
            };
        }

        /***** alert modal structs****/
        $scope.alert = function(msg){
            // debugger;
            $scope.showModal("", msg, false, false);
        }

        $scope.closeDialog = function(){
            suotin.loaderVM.hideDialog();
        };

        //debugger;
        $scope.$root.$on('$routeChangeStart', function(scope, next, current){
            //console.log('Changing from '+angular.toJson(current)+' to '+angular.toJson(next));

            $scope.clearAllListeners();
            if (typeof(current) !== 'undefined'){
                $templateCache.remove(current.templateUrl);
                $templateCache.remove(current.loadedTemplateUrl);
            }
            if(suotin.storePreviousLocation == true)
            {
                suotin.previousLocation = suotin.currentLocation;
                suotin.currentLocation = appSuotin.lazyLoader.location.path();
            }
            suotin.storePreviousLocation = true;

        });

        $scope.$root.$on('$routeChangeSuccess', function(scope, next, current){
            //console.log('Changing from '+angular.toJson(current)+' to '+angular.toJson(next));

            if(next && next.$$route)
            {
                $scope.showNotification( 'done loading ' + next.$$route.originalPath);
                $scope.AnimHideNotification();
            }
        });

        $scope.$root.$on('$routeChangeError', function(scope, next, current){
            $scope.showNotification( 'Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
        });

        $scope.$root.$on('$routeUpdate', function(scope, next, current){
            // debugger;
            $scope.showNotification( 'Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
        });
        /*
         $scope.showModal("West Africa/Africa Center for Disease Monitoring", "This is a very simple demo app for " +
         "what is possible for a disease monitoring app for our region.  the actual app would be delivered as a web App " +
         "open to the public to see whats happening along with highly secured access control for allowed personnel.  we hope to also develop desktop app and mobile app" +
         " for real-time performance reasons and onsite auditing!", true, true);
         */

        $scope.showPopWindow = function(title, message, scrollbar){

            scrollbar = scrollbar || false;

            var ScreenWidth=window.screen.width;
            var ScreenHeight=window.screen.height;
            var movefromedge=0;
            placementx=(ScreenWidth/2)-((400)/2);
            placementy=(ScreenHeight/2)-((300+50)/2);
            WinPop=window.open("About:Blank","","width=400,height=300,toolbar=0,location=false,directories=false,status=0,scrollbars=" + scrollbar + ",menubar=0,resizable=0,left="+placementx+",top="+placementy+",scre enX="+placementx+",screenY="+placementy+",");
            var msg = "<strong>" + message + "</strong>";
            WinPop.document.write('<html>\n<head>\n<title>' + title + '</title>></head>\n<body>'+ msg +'</body></html>');

        }

        $scope.clearAllListeners = function(){
            if(suotin.security.authCompleteIntervalToken != null)
            {
                window.clearInterval(suotin.security.authCompleteIntervalToken);
                suotin.security.authCompleteIntervalToken = null;
            }
            if(Cookies.enabled){
                Cookies.expire('uploading');
            }

        };

        /************************Services and behaviors*******************************************/

        $scope.getVictims = function(page){
            //debugger;
            return $scope.services.getVictims(page);
        };

        $scope.getGallery = function(page){
            //debugger;
            return $scope.services.getGallery(page);
        };

        $scope.addNewVictim = function(newVictim){
            return $scope.services.addNewVictim(newVictim);
        };

        $scope.getVictimDetail = function(victimId){
            //debugger;
            return $scope.services.getVictimDetail(victimId);
        };


    } ]);