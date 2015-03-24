/**
 * Created by Mustapha on 2/28/2015.
 */

appSuotin.dashboard = {};
appSuotin.dashboard.controller = function ($scope){
    debugger;


    $scope.startEdit = function(){
        // copy item from array to temporary edit buffer; but first discard previous edit buffer
        // store selected item id for future
    };

    $scope.markerClicked = function(item){

        //if current view is smaller than tablet loadcontent to the dash detail

        // set current item to the clicked item

        $.afui.loadContent("#mpSelect",false,0,"up");
        $.afui.setBackButtonVisibility(false);
    };

    $scope.listItemClicked = function(item){

        //if current view is smaller than tablet loadcontent to the dash detail

        // set current item to the clicked item

        $.afui.loadContent("#mpSelect",false,0,"up");
        $.afui.setBackButtonVisibility(false);
    };

    $scope.selectMapCancel = function(){

        //reload data from the edit buffer with the actual data from the array
        $.afui.loadContent("#fmSumission",false,0,"up");
        $.afui.setBackButtonVisibility(false);
    };

    $scope.selectMapSave = function(){
        $.afui.loadContent("#fmSumission",false,0,"up");
        $.afui.setBackButtonVisibility(false);
    };

    $scope.$on(
        "$destroy",
        function handleDestroyEvent() {
            debugger;

        }
    );

}

jQuery(function($){

    appSuotin.dashboard.init = function(){
        var controllerName = 'js/motor/controllers/dashboardController.js';
         var tmp = JSON.parse(sessionStorage.controllerScripts);
         tmp.scripts.push(controllerName);
         sessionStorage.controllerScripts = JSON.stringify(tmp);
         tmp = null;

        var vw = angular.element("#dshbrdView");

        appSuotin.lazyLoader.rootScope.$apply(function() {
             debugger;
             vw.attr('ng-controller', "appSuotin.dashboard.controller");

             if(!angular.isDefined(appSuotin.dashboard))
                appSuotin.dashboard = {};

             appSuotin.dashboard.scope = appSuotin.lazyLoader.rootScope.$new();
             appSuotin.dashboard.compiled = appSuotin.lazyLoader.compile(vw[0]);

             appSuotin.dashboard.compiled(appSuotin.dashboard.scope);

             vw = angular.element("#dshbrdView");

             vw.on("$destroy",function handleDestroyEvent() {

                     suotin.cleanAppFrmwrk();

                     var controllerfilePathName = 'js/motor/controllers/dashboardController.js';

                     var vw = angular.element("#dshbrdView");
                     appSuotin.dashboard.scope.$destroy();
                     //vw.remove();



                     appSuotin.dashboard.scope = null;
                     appSuotin.dashboard.compiled = null;
                     appSuotin.dashboard = null;

                     //appSuotin.lazyLoader.controllers('addCaseController', null);

                     removejscssfile("dashboardController.js", "js");
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
    $.afui.setBackButtonVisibility(false);

    suotin.frame.reload();

});
