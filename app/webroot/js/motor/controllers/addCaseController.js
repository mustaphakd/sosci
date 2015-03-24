/**
 * Created by Mustapha on 2/28/2015.
 */

appSuotin.addcase = {};
appSuotin.addcase.controller = function($scope){
    //debugger;
    $scope.initied = true;
    $scope.showDone = false;
    $scope.mapAlreadyClicked = false;
    //$scope.caseModel ={};
    $scope.newModel = {};
    $scope.selectedImageSourceItem = null;

    $scope.selectMap = function(){

        //$scope.autoInit = true;
        var childShdw = null;

        if(angular.isDefined(this.$$childHead.enableMapClickHandler))
        {
            childShdw = this.$$childHead;
        }
        else if(angular.isDefined(this.$$childTail.enableMapClickHandler))
        {
            childShdw = this.$$childTail;
        }
        else if(angular.isDefined(appSuotin.leafletMapController) && angular.isDefined(appSuotin.leafletMapController.enableMapClickHandler))
        {
            childShdw = appSuotin.leafletMapController;
        }

        if(childShdw == null)
            return;

        $.afui.loadContent("#mpSelect",false,0,"up");


        $.afui.setBackButtonVisibility(false);



        childShdw.enableMapClickHandler();

        childShdw.clearClickHandlerMarker();
        childShdw.map.invalidateSize(false);

        if($scope.mapAlreadyClicked == true) {
            $scope.showDone = true;

            //this.$$childHead.setSingleMarker(lat ,lng); use lat long of current Model

        }

        if($scope.newModel.lat != null && $scope.newModel.lat != undefined){
            childShdw.setSingleMarker($scope.newModel.lat, $scope.newModel.lng);
        }

    };

    $scope.selectMapCancel = function(){
        $scope.resetModel();
        suotin.browseBack();
    };

    $scope.selectMapSave = function(frmToSave){
        //debugger;

        if(frmToSave.$valid == false || $scope.saving == true) {
            return;
        }
       //$.afui.loadContent("#fmSumission",false,0,"up");
        suotin.loaderVM.showLoaderMessage("saving victim information!");
        //appSuotin.lazyLoader.rootScope.saveNewModel(model).then(function(){
        // suotin.loaderVM.closeLoaderMessage();
        // });
        $scope.addNewVictim($scope.newModel).then(function(data){
            suotin.loaderVM.closeLoaderMessage();
            $scope.saving = false;

            $scope.messageContent = "Your new case has been saved!\n" +
            " thanks for providing this important message to the world." ;

            $scope.messageBoxEnterMessage = "Add new Case";

            $scope.messageBoxCancelMessage = "cancel";

            $scope.dataSaved = true;

            $.afui.loadContent("#vwMessage",false,0,"up");
            $.afui.setBackButtonVisibility(false);

        },function(msg){
            suotin.loaderVM.closeLoaderMessage();
            $scope.saving = false;

            $scope.messageContent = "Sorry, we weren't able to save your new case.  please, either try again now or later. \n" +
            "such report is crucial to us all."

            $scope.messageBoxEnterMessage = "Try again!";

            $scope.messageBoxCancelMessage = "cancel";

            $scope.dataSaved = false;

            $.afui.loadContent("#vwMessage",false,0,"up");
            $.afui.setBackButtonVisibility(false);
        });

        $scope.saving = true;
    };

    $scope.messageDone = function(bcontinue){
        if(bcontinue == true){
            $scope.newModel = {};
            $.afui.goBack();
            $.afui.setBackButtonVisibility(false);
        }
        else{
            $scope.selectMapCancel();
        }

    };

    $scope.clickHandler = function(lat, lng){
        $scope.newModel.lat = lat == undefined ? $scope.$$childHead.tempArg.lat : lat;
        $scope.newModel.lng = lng == undefined ? $scope.$$childHead.tempArg.lng : lng;

        $scope.$apply(function(){
            $scope.newModel.location = [$scope.newModel.lat, $scope.newModel.lng];
            $scope.showDone = true;
        });

        $scope.mapAlreadyClicked = true;
    };

    $scope.doneSectingLocation = function(){
        $.afui.goBack();
        $.afui.setBackButtonVisibility(false);

            $scope.showDone = false;

    }

    $scope.resetModel = function(){

    };

    $scope.launchImageFinder = function(src){
alert($scope.selectedImageSourceItem );
        switch ($scope.selectedImageSourceItem ){
            case 'flickr':
                alert("flckr Source");
                break;

            default :
                break;
        }
    }

    $scope.$on(
        "$destroy",
        function handleDestroyEvent() {
            //debugger;

        }
    );

}

jQuery(function($){


    appSuotin.addcase.init = function(){
        var controllerName = 'js/motor/controllers/addCaseController.js';
         var tmp = JSON.parse(sessionStorage.controllerScripts);
         tmp.scripts.push(controllerName);
         sessionStorage.controllerScripts = JSON.stringify(tmp);
         tmp = null;

        var vw = angular.element("#addCaseView");

        appSuotin.lazyLoader.rootScope.$apply(function() {
             //debugger;
             vw.attr('ng-controller', "appSuotin.addcase.controller");

             if(!angular.isDefined(appSuotin.addcase))
                appSuotin.addcase = {};

             appSuotin.addcase.scope = vw.scope(); //appSuotin.lazyLoader.rootScope.$new();

            appSuotin.addcase.scope.initied = true;

            $.extend( appSuotin.addcase.scope, appSuotin.addcase.controller(appSuotin.addcase.scope) );
/*
            appSuotin.addcase.scope.$$childHead = appSuotin.addcase.scope.$$childHead;
            appSuotin.addcase.scope.map = appSuotin.addcase.scope.$$childHead.map;

             appSuotin.addcase.compiled = appSuotin.lazyLoader.compile(vw[0]);

             appSuotin.addcase.compiled(appSuotin.addcase.scope.$$childHead); //appSuotin.addcase.scope);
*/

             vw = angular.element("#addCaseView");

             vw.on("$destroy",function handleDestroyEvent() {

                     suotin.cleanAppFrmwrk();

                     var controllerfilePathName = 'js/motor/controllers/addCaseController.js';

                     var vw = angular.element("#addCaseView");


                     appSuotin.addcase.scope.map = null;
                     appSuotin.addcase.scope.$destroy();
                     //vw.remove();



                     //appSuotin.addcase.scope.$$childHead = null;
                     appSuotin.addcase.scope = null;
                     appSuotin.addcase.compiled = null;
                     //appSuotin.addcase.addCompiledMap = null;
                     appSuotin.addcase = null;
                     addcase_controller = null;



                     //appSuotin.lazyLoader.controllers('addCaseController', null);

                     removejscssfile("addCaseController.js", "js");
                     var tmp = JSON.parse(sessionStorage.controllerScripts);
                     var idx =  0;
                     if( (idx = tmp.scripts.indexOf(controllerfilePathName)) != -1)
                     {
                         tmp.scripts.splice(idx, 1);
                         sessionStorage.controllerScripts = JSON.stringify(tmp);
                         tmp = null;
                     }

                }
             );
            vw= null;
        });

    };

    appSuotin.addcase.init();

    appSuotin.modulePromise.resolve(true);
    suotin.initAppFrmwrk("#fmSumission");
    $.afui.setBackButtonVisibility(false);

    suotin.frame.reload();


});
