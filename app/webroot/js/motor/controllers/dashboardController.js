/**
 * Created by Mustapha on 2/28/2015.
 */

appSuotin.dashboard = {};
appSuotin.dashboard.controller = function ($scope){

    $scope.vctms = [];
    $scope.selectedModel = null;
    $scope.newModel = null;
    $scope.saving = false;
    $scope.showDone = false;
    $scope.inEditMode = false;

    $scope.init = function(){
        $scope.getUserContributions(null).then(function(pckt){

                if(!angular.isUndefined(pckt) && angular.isArray(pckt.data)) {
                    var victims = pckt.data;
                    var dataLength = victims.length;

                    $scope.vctms  = [];

                    for(var i = 0; i < dataLength; i++) {

                        $scope.vctms .push(victims[i]);
                    }
                }
                else
                {
                    $scope.showErrorMessage();
                }
                data = null;
                suotin.loaderVM.closeLoaderMessage();

            },function(msg){
                suotin.loaderVM.closeLoaderMessage();
                // $scope.saving = false;
                $scope.showErrorMessage();
            }
        );
    };

    $scope.selectVictim = function(idx, vctm){
        $scope.selectedModel = vctm;
    };

    $scope.switchView = function(idx, vctm){

        $scope.selectedModel = vctm;
        $scope.selectedModelIdx = idx;

        $scope.newModel = JSON.parse(JSON.stringify(vctm));

        var tempDate  = $scope.newModel.occurrencedate.trim();
        tempDate = tempDate.replace(" ", "T");
        tempDate = new Date(tempDate);
        $scope.newModel.occurrencedate = tempDate; //Date.parse(tempDate);

        $scope.inEditMode = true;
        $.afui.loadContent("#dshDetail",false,0,"up");
        $.afui.setBackButtonVisibility(true);

        $("a.backButton.back").on('click', function(){
           // $scope.inEditMode =  false;
            $("a.backButton.back").off();
            $scope.cancelEdit();
            //$.afui.goBack();
        });
    };

    $scope.cancelEdit = function(){
        $scope.newModel = null;
        $scope.selectedModelIdx = null;
        $scope.inEditMode = false;
        $("#dtOccurence").blur();
        $.afui.goBack();
    };


    $scope.saveEdit = function(frmToSave){
        $("#dtOccurence").blur();

        if(frmToSave.$valid == false || $scope.saving == true) {
            return;
        }
        suotin.loaderVM.showLoaderMessage("updating victim information!");

        $scope.updateVictim($scope.newModel).then(function(pckt){
            suotin.loaderVM.closeLoaderMessage();
            $scope.saving = false;

            // set current seleted model based on idx
            $scope.vctms[$scope.selectedModelIdx] = pckt.data;

            $scope.inEditMode = false;


            $scope.messageContent = "The information have been saved!\n" +
            " thanks for providing this important message to the world." ;

            $scope.messageBoxEnterMessage = "back to list";

            $scope.messageBoxCancelMessage = "cancel";

            $scope.dataSaved = true;
            // perhaps, update old data with newly saved data ???? ***************************

            $.afui.loadContent("#vwMessage",false,0,"up");
            $.afui.setBackButtonVisibility(false);

            suotin.loaderVM.closeLoaderMessage();

        },function(msg){
            suotin.loaderVM.closeLoaderMessage();
            $scope.saving = false;
            $scope.inEditMode = false;

            $scope.messageContent = "Sorry, we weren't able to save the provided information.  please, either try again now or later. \n" +
            "such report is crucial to us all."

            $scope.messageBoxEnterMessage = "Try again!";

            $scope.messageBoxCancelMessage = "cancel";

            $scope.dataSaved = false;

            $.afui.loadContent("#vwMessage",false,0,"up");
            $.afui.setBackButtonVisibility(false);

        });
        $scope.saving = true;
    };

    $scope.seeMap = function(enableClickHandler){

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

        $.afui.loadContent("#dshMap",false,0,"left");
        $.afui.setBackButtonVisibility(true);
        $("a.backButton.back").on('click.map', function(){
            $("a.backButton.back").off("click.map");
            appSuotin.leafletMapController.map.off('click');
            $scope.showDone = false;
            $.afui.goBack();
        });


       // $scope.map.on('click', $scope.procesMapClickEvt)
        if(angular.isDefined(enableClickHandler) && enableClickHandler === true)
            childShdw.enableMapClickHandler();

        childShdw.clearClickHandlerMarker();

        //show marker here
        var lat = $scope.selectedModel.lat;
        var lng = $scope.selectedModel.lng;
        childShdw.setSingleMarker(lat, lng);

        childShdw.map.panTo([lat, lng]);

        childShdw.map.invalidateSize(false);
/*
        if($scope.mapAlreadyClicked == true) {
            $scope.showDone = true;

            //this.$$childHead.setSingleMarker(lat ,lng); use lat long of current Model

        }*/

       /* if($scope.newModel.lat != null && $scope.newModel.lat != undefined){
            childShdw.setSingleMarker($scope.newModel.lat, $scope.newModel.lng);
        }*/
    };

    $scope.messageDone = function(bcontinue){
        if(bcontinue == true){
            $scope.newModel = {};
            $scope.inEditMode = false;
            $("a.backButton.back").off();
            $.afui.loadContent("#dshMaster",false,true,"slide");
            $.afui.setBackButtonVisibility(false);
        }
        else{

            suotin.browseBack();
        }

    };

    $scope.clickHandler = function(lat, lng){

        if(!$scope.inEditMode)
            return;

        $scope.newModel.lat = lat == undefined ? $scope.$$childHead.tempArg.lat : lat;
        $scope.newModel.lng = lng == undefined ? $scope.$$childHead.tempArg.lng : lng;

        $scope.$apply(function(){
            $scope.newModel.location = [$scope.newModel.lat, $scope.newModel.lng];
            $scope.showDone = true;
        });

        $scope.mapAlreadyClicked = true;
    };

    $scope.showErrorMessage = function(){
        $scope.messageContent = "An error occured while retrieving data over the network. \n";

        $scope.messageBoxEnterMessage = "Try again!";

        $scope.messageBoxCancelMessage = "cancel";

        //$scope.dataSaved = false;

        $.afui.loadContent("#vwMessage",false,0,"up");
        $.afui.setBackButtonVisibility(false);
    };

    $scope.$on(
        "$destroy",
        function handleDestroyEvent() {
            $scope.vctms = [];
            $scope.vctms = null;

        }
    );

    $scope.init();

}

jQuery(function($){

    appSuotin.dashboard.init = function(){
        //var controllerName = 'js/motor/controllers/dashboardController.js';
        var controllerName = 'js/motor/controllers/dashboardController.min.js';
         var tmp = JSON.parse(sessionStorage.controllerScripts);
         tmp.scripts.push(controllerName);
         sessionStorage.controllerScripts = JSON.stringify(tmp);
         tmp = null;

        var vw = angular.element("#dshbrdView");

        appSuotin.lazyLoader.rootScope.$apply(function() {

             vw.attr('ng-controller', "appSuotin.dashboard.controller");

             if(!angular.isDefined(appSuotin.dashboard))
                appSuotin.dashboard = {};

            appSuotin.dashboard.scope = vw.scope();

            appSuotin.dashboard.scope.initied = true;

            $.extend( appSuotin.dashboard.scope, appSuotin.dashboard.controller(appSuotin.dashboard.scope) );

             vw = angular.element("#dshbrdView");

             vw.on("$destroy",function handleDestroyEvent() {

                     suotin.cleanAppFrmwrk();

                     //var controllerfilePathName = 'js/motor/controllers/dashboardController.js';
                     var controllerfilePathName = 'js/motor/controllers/dashboardController.min.js';

                     var vw = angular.element("#dshbrdView");
                     appSuotin.dashboard.scope.$destroy();


                     appSuotin.dashboard.scope = null;
                     appSuotin.dashboard.compiled = null;
                     appSuotin.dashboard = null;


                     //removejscssfile("dashboardController.js", "js");
                     removejscssfile("dashboardController.min.js", "js");
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

    appSuotin.dashboard.init();
    appSuotin.modulePromise.resolve(true);

    suotin.initAppFrmwrk("#dshMaster");
    $.afui.setBackButtonVisibility(true);

    suotin.frame.reload();

});
