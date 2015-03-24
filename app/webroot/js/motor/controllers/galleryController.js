/**
 * Created by Mustapha on 2/28/2015.
 */

appSuotin.gallery = {};
appSuotin.gallery.controller = function ($scope){
    debugger;
    var test = false;

    $scope.$on(
        "$destroy",
        function handleDestroyEvent() {
            debugger;

        }
    );

}

jQuery(function($){

    appSuotin.gallery.init = function(){
        var controllerName = 'js/motor/controllers/galleryController.js';
         var tmp = JSON.parse(sessionStorage.controllerScripts);
         tmp.scripts.push(controllerName);
         sessionStorage.controllerScripts = JSON.stringify(tmp);
         tmp = null;

        var vw = angular.element("#imgView");

        appSuotin.lazyLoader.rootScope.$apply(function() {
             debugger;
             vw.attr('ng-controller', "appSuotin.gallery.controller");

             if(!angular.isDefined(appSuotin.gallery))
                appSuotin.gallery = {};

             appSuotin.gallery.scope = appSuotin.lazyLoader.rootScope.$new();
             appSuotin.gallery.compiled = appSuotin.lazyLoader.compile(vw[0]);

             appSuotin.gallery.compiled(appSuotin.gallery.scope);

             vw = angular.element("#imgView");

             vw.on("$destroy",function handleDestroyEvent() {
                     debugger;
                     var controllerfilePathName = 'js/motor/controllers/galleryController.js';

                     var vw = angular.element("#imgView");
                     appSuotin.gallery.scope.$destroy();
                     //vw.remove();



                     appSuotin.gallery.scope = null;
                     appSuotin.gallery.compiled = null;
                     appSuotin.gallery = null;

                     removejscssfile("galleryController.js", "js");
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

    appSuotin.gallery.init();
    appSuotin.modulePromise.resolve(true);
    suotin.frame.reload();

});
