/**
 * Created by Mustapha on 2/7/2015.
 */

/*
*
* clear loaded scripts from session storage
* and all items to be clear on browser refresh
*
* Notes that authentication session is not deleted,m thus kept on browser refresh.
* */
sessionStorage.removeItem("controllerScripts");
function getPathName(){
    var pathName = window.location.pathname;
    var pathlength = pathName.length;
    var lastChar = pathName.charAt(pathlength - 1);

    if(lastChar == "/")
    {
        pathName = pathName.slice(0, pathlength - 1);
    }

    return pathName;
}

function _hasPopupBlocker(poppedWindow) {
    var result = false;

    try {
        if (typeof poppedWindow == 'undefined') {
            // Safari with popup blocker... leaves the popup window handle undefined
            result = true;
        }
        else if (poppedWindow && poppedWindow.closed) {
            // This happens if the user opens and closes the client window...
            // Confusing because the handle is still available, but it's in a "closed" state.
            // We're not saying that the window is not being blocked, we're just saying
            // that the window has been closed before the test could be run.
            result = false;
        }
        else if (poppedWindow && poppedWindow.test) {
            // This is the actual test. The client window should be fine.
            result = false;
        }
        else {
            // Else we'll assume the window is not OK
            result = true;
        }

    } catch (err) {
        //if (console) {
        //    console.warn("Could not access popup window", err);
        //}
    }

    return result;
}
// For browser refresh $window.location.href.
//future http://turfjs.org/-validate lr
var suotin = {
    isMobileDevice: true,
    alreadyInit: false,
    init:function(){

       if(this.alreadyInit == false)
        {
            //$(document).bind('authcompleted', suotin.security.authCompletedHandler);
            localStorage.removeItem("securityToken");
            this.alreadyInit = true;
        }

        //TODO: if log in cookie is present, then user is logged in

        suotin.initialDefaultLocation = "/demos/sosci" // getPathName();

        if(verge){
            if(verge.viewportW() > 767){ //tablet && desktop
                if(this.currentViewportClient != suotin.flags.desktblet){
                    if(this.currentViewportClient == suotin.flags.mobile){
                        //unhook  previous mobile anim and watchers

                        $("#idMobileMenuBars").off("click");
                        $(".frame .host .menu li").off("click");

                        //make sure menu shows
                        $(".host .menu").show();
                    }
                    // logic goes here
                    this.currentViewportClient = suotin.flags.desktblet;
                    this.security.configureSecurity(suotin.flags.desktblet);
                }
            }
            else // mobile
            {
                $(".host .menu").hide();
                if(this.currentViewportClient != suotin.flags.mobile){
                    if(this.currentViewportClient == suotin.flags.desktblet){
                        //unhook  previous anim and watchers
                        $("#idLogin").removeClass("authClassOnForlargeScreen").off("click");
                        $("#idLogoff").removeClass("authClassOnForlargeScreen").off("click");
                        //$("#idLogoff");
                        //$("#idLogin");
                        $(".bottomMenu .container div.host .authItems a").off("click");
                    }

                    // logic goes here
                    this.currentViewportClient = suotin.flags.mobile;

                    //mobile bars
                    $("#idMobileMenuBars").on( "click",function(){
                        $(".host .menu").toggle("slow");
                    });

                    $(".frame .host .menu li").on("click", function(){
                        $(".host .menu").hide("slow");
                    });

                    this.security.configureSecurity(suotin.flags.mobile);

                }
            }
        }

        if(Cookies.enabled){
            Cookies.expire('uploading');
        }

    },
    reInit:function(){
        this.init();
    },
    UI:{},
    currentViewportClient: "none",
    flags:{
        mobile: "mobile",
        desktblet: "deskblet",
        NA: "none"
    },
    security: {
        isLoggedIn: function(){
            return this._loggedIn;
        },
        signIn: function(providerName, callbck){
            if((providerName != undefined) && (providerName != null) && (providerName != ""))
            {

                localStorage.removeItem("securityTokenAuthDone");
                suotin.security.SecuredPopup(suotin.security.authEndpoint + providerName, false);

                this.authCompleteIntervalToken = window.setInterval(function(){

                    if(localStorage.securityTokenAuthDone == undefined)
                    {

                    }
                    else
                    {
                        window.clearInterval(suotin.security.authCompleteIntervalToken);
                        suotin.security.authCompleteIntervalToken = null;

                        suotin.openWin = null;
                        suotin.security.authCompletedHandler();
                    }

                }, 500);

            }
            this._loggedIn = true;
        },
        _loggedIn: false,
        signOff: function(){
            //this._loggedIn = false;
            sessionStorage.removeItem("securityToken");
            /* no need if(suotin.flags.mobile != suotin.currentViewportClient){
                //remove image mouser over and name
            }*/
            window.location.href = suotin.initialDefaultLocation + "/users/logoff";
        },
        listenSignOffEvent: function(){
            if(suotin.flags.desktblet == suotin.currentViewportClient || suotin.flags.NA == suotin.currentViewportClient){
                $(".bottomMenuMobile div.authItems ").hide();
                $("#idLogoff").off("click")
                .on("click", function(){
                    suotin.security.signOff();
                    $("#idLogin").addClass("authClassOnForlargeScreen");
                    $("#idLogoff").removeClass("authClassOnForlargeScreen")
                        .off("click");
                    suotin.security.listenSignInEvent();

                });
            }
            else if(suotin.flags.mobile == suotin.currentViewportClient)
            {
                $(".bottomMenuMobile div.authItems").hide();
                $("#idMobileLogoff").off("click")
                    .on("click", function(){
                        suotin.security.signOff();
                        $("#idMobileLogIn").show(); // show logg in button
                        $("#idMobileLogoff").hide();// hide log-off button
                        $(this).off("click");
                        suotin.security.listenSignInEvent();
                    });
            }
        },
        listenSignInEvent: function(){
            if(suotin.flags.desktblet == suotin.currentViewportClient || suotin.flags.NA == suotin.currentViewportClient) {
                $("#idLogin").off("click")
                    .on("click",function(){

                    if($(".bottomMenu .container div.host").hasClass("farLeftOffscreen")) //auth menu not showing
                    {
                        $(".bottomMenu .container div.host").removeClass("farLeftOffscreen"); // now showing
                        $(".bottomMenu .container div.host .authItems a").on("click", function(evt){ // listen to one of the auth clicks and do the ting

                            //get the data-auth attribute value of target element and pass it in to the signin method below
                            var providerName = $(this).data('auth');


                            // append the rest of the logic as a callback (2nd arg ) to the signin method

                            suotin.security.signIn(providerName, function(){
                                if(suotin.security.isLoggedIn())
                                {

                                    $("#idLogin").removeClass("authClassOnForlargeScreen")
                                        .off("click");
                                    $("#idLogoff").addClass("authClassOnForlargeScreen");



                                    suotin.security.listenSignOffEvent();
                                }
                            });
                            $(".bottomMenu .container div.host").addClass("farLeftOffscreen");
                            $(".bottomMenu .container div.host .authItems a").off("click");


                        });
                    }
                    else
                    {
                        $(".bottomMenu .container div.host").addClass("farLeftOffscreen");
                        $(".bottomMenu .container div.host .authItems li").off("click");
                    }

                });
            }
            else if(suotin.flags.mobile == suotin.currentViewportClient)
            {
                $($(".bottomMenuMobile div.authItems").show()[0]).find("ul li a")// show mobile login menu options
                    .off("click")
                    .on("click",function(){ //hook evts
                        suotin.security.signIn();

                        if(suotin.security.isLoggedIn())
                        {
                            $($(".bottomMenuMobile div.authItems").hide()[0]).find("ul li a")// show mobile login menu options
                                .off("click"); //unhook evts for the authentication options: yahoo!, msft etc...

                            $("#idMobileLogIn").hide(); // hide logg in button
                            $("#idMobileLogoff").show();// show log-off button
                            suotin.security.listenSignOffEvent();
                        }
                    });

            }
        },
        configureSecurity: function(viewPortClient){

            //Check Session for security token
            //debugger
            if(sessionStorage.securityToken)
            {
                var securityToken = JSON.parse(sessionStorage.securityToken);

                //suotin.security._loggedIn  to be set based on token validation
                if(securityToken.validated == true){
                    suotin.security._loggedIn = true;

                    if(suotin.flags.mobile != suotin.currentViewportClient){
                        //set image mouser over and name

                       var carte =  $("#loginCarte").removeClass("hide");
                        carte.find("a.tooltip").first().attr("data-tooltip", securityToken.name);

                        carte = null;
                        $("#userPic").attr("src",securityToken.image );

                    }

                }
            }
            switch (viewPortClient)
            {
                case suotin.flags.desktblet: //deskblet
                    if(suotin.security.isLoggedIn()){ //logged in
                        $("#idLogoff").addClass("authClassOnForlargeScreen"); // show log off button
                        suotin.security.listenSignOffEvent();
                    }
                    else // logged off
                    {
                        $("#idLogin").addClass("authClassOnForlargeScreen"); // show logg in button
                        suotin.security.listenSignInEvent();
                    }
                    break;
                default : //mobile

                    if(suotin.security.isLoggedIn()){ //logged in
                        $("#idMobileLogIn").hide(); //hide log-in btn
                        $("#idMobileLogoff").show();// show log-off button
                        suotin.security.listenSignOffEvent();
                    }
                    else // logged off
                    {
                        $("#idMobileLogIn").show(); // show logg in button
                        $("#idMobileLogoff").hide();// hide log-off button
                        suotin.security.listenSignInEvent();
                    }
                    break;
            }
        },
        authEndpoint: "/auth/",
        authCompletedHandler: function(evt){
            var secuTok = JSON.parse(localStorage.securityToken);
            localStorage.removeItem("securityToken");

            if(secuTok.validated == true){
                sessionStorage.securityToken = JSON.stringify(secuTok);

                window.location.href = suotin.initialDefaultLocation;

            }
        },
        authCompleteIntervalToken: null,
        SecuredPopup: function(endpointPath, isAbsolute){

            var authPath = null;
            if(isAbsolute == 'undefined' || isAbsolute == null || isAbsolute == false){
                authPath = window.location.origin + suotin.initialDefaultLocation + endpointPath
            }
            else
            {
                authPath = endpointPath;
            }


            // window location base path href
            // append auth/providerName
            //launch poop wind with url
            var wdth = 560;
            var hght = 650;
            var top = 0; //default and suited for mobile
            var lft = 0; //default and suited for mobile
            if(suotin.flags.mobile == suotin.currentViewportClient)
            {
                if(verge.viewportW() < wdth )
                    wdth = verge.viewportW();
                if(verge.viewportH() < hght)
                    hght = verge.viewportH();

            }
            else
            {
                top = "5%";
                lft = "15%";

            }
            // set wide mask on actual widown to disable further interaction from user if popup actually does get displayed
            //blank makes sure it is a window and not tab

            suotin.openWin = window.open(authPath, '_blank', "directories=no,height="+ hght +",width="+ wdth +",toolbar=no,menubar=no,resizable=no,titlebar=no,top=" + top +",left="+ lft +",location=no,alwaysRaised=yes"); //,dialog=truemodal=yes,scrollbars=no,status=no,

        }
    },
    loaderVM: {
        showMainLoader: function(){
            if(this.mainLoader != null)
                this.mainLoader.show();
        },
        hideMainLoader: function(){
            if(this.mainLoader != null) {
                this.mainLoader.hide("slow");
                this.mainLoader.addClass("makeTransparent");
                this.mainLoader.hide();
                this.mainLoader.find("#loader").addClass("hide");
                this.mainLoader.find(".titleText").addClass("hide");
                this.mainLoader.find(".notifier").removeClass("hide");
            }
        },
        showLoaderMessage: function(msg){
            $(this.mainLoader.find(".notifierContent")[0]).text(msg);
            this.showMainLoader();


            ///TODO: temporary to be removed
           /* this.timeoutToken = setTimeout(function(){
                if(suotin.loaderVM.timeoutToken != null)
                {
                    clearTimeout(suotin.loaderVM.timeoutToken);
                    suotin.loaderVM.timeoutToken = null;
                    suotin.loaderVM.closeLoaderMessage();
                }
            }, 500);*/

        },
        closeLoaderMessage:function(){
            if(this.mainLoader != null) {
                this.mainLoader.hide("slow");
            }
        },
        showDialog: function(title, innerHTML){
            var node = this.mainLoader.find(".notifier");
            if(node != null && node != undefined && !node.hasClass("hide"))
                node.addClass("hide");

            $('#dlgMssge').removeClass('hide');

            $('.titleGrid').text(title);

            $('#messageBoxContent')[0].innerHTML = innerHTML;
            this.showMainLoader();


        },
        hideDialog: function(){

            if(this.mainLoader != null) {
                this.mainLoader.hide();
            }

            this.mainLoader.find(".notifier").removeClass("hide");
            $('#dlgMssge').addClass('hide');

            $('.titleGrid').text('');
        },
        updateDialog: function(selector, htmlContent){

            var dialog = $('#dlgMssge');

            if(this.mainLoader != null && ! dialog.hasClass("hide") ) {

                dialog.find(selector).html(htmlContent);
            }
        },
        appendToDialog: function(selector, textContent){

            var dialog = $('#dlgMssge');

            if(this.mainLoader != null && ! dialog.hasClass("hide") ) {

                dialog.find(selector).append(textContent);
            }
        },
        mainLoader: null,
        activitiesStillPending: false,
        activityMonitoringForLoader:null,
        timeoutToken: null
    },
    frame: null,
    initAppFrmwrk: function(selectorZStr){
        $.afui.autoLaunch = false;
        $.afui.useInternalRouting=false;
        $.afui.manageHistory=false;
        $.afui.loadDefaultHash=false;
        $.afui.launch();
        $.afui.loadContent(selectorZStr,false,0,"none");
    },
    cleanAppFrmwrk: function(){

        var view=$($.afui.activeDiv);
        view.removeClass("active");
        view.trigger("panelunload");
        $("div.ui-loader").off().remove();


        $.afui.hasLaunched = false ;
        $.afui.launchCompleted = false;
        $.afui.isLaunching = false;
        $.afui.defaultPanel = null;
        $.afui.init = false;

        view.off();
        $(document).off("click");
        //$(document).off("click", "a");
        $(".backButton .back").off();
        $(document).off("click", ".backButton, [data-back]");
        $(document).off("click","footer a:not(.button)");


        $.afui.activeDiv = null;
        view.remove();
        view = null;
    },
    browseBack: function(){
        this.storePreviousLocation = false;

        this.currentLocation = this.previousLocation;

        appSuotin.lazyLoader.location.path(this.previousLocation);
        appSuotin.lazyLoader.location.replace();
    },
    storePreviousLocation: true,
    previousLocation: null,
    currentLocation:null,
    initialDefaultLocation:"",
    appData:{}
};

function resolveController($q, $timeout, controllerName){


    appSuotin.modulePromise = $q.defer();

   var smeTkn =  $timeout(function(){
        var controllerfilePathName = 'js/motor/controllers/' + controllerName + 'Controller.min.js';

       $timeout.cancel(smeTkn);
       smeTkn = null;

        //var intervalToken = null;
        //debugger;
        if(angular.isDefined(sessionStorage.controllerScripts) )
        {
            var tmp = JSON.parse(sessionStorage.controllerScripts);

            if(tmp.scripts.indexOf(controllerfilePathName) != -1)
            {
                tmp = null;

              return appSuotin.modulePromise.resolve(true);
                appSuotin.modulePromise = null;
            }
        }
        else{
            var controllerScripts = {
                name:"loadedFiles",
                scripts: []
            };
            sessionStorage.controllerScripts = JSON.stringify(controllerScripts);
            controllerScripts = null;
        }


        ImportJsFiles([controllerfilePathName], function(){
            //debugger;

            /*intervalToken = $interval(function(){
                debugger;
                var tmp = JSON.parse(sessionStorage.controllerScripts);

                if(tmp.scripts.indexOf(controllerfilePathName) != -1)
                {
                    $interval.cancel(intervalToken);
                    prms.resolve(true);
                }
            }, 1000);*/

           /* var tmp = JSON.parse(sessionStorage.controllerScripts);
            tmp.scripts.push(controllerfilePathName);
            sessionStorage.controllerScripts = JSON.stringify(tmp);
            tmp = null;*/

           /* $rootScope.$apply(function(){
                appSuotin.modulePromise.resolve(true);
            });*/
        });
    }, 3000);
    return appSuotin.modulePromise.promise;
};

var appSuotin;
function configularAngJs(){
    appSuotin = angular.module('suotinApp', [ 'appControllers','ngRoute', 'ngAnimate','appServices', 'appDirectives', 'ngTouch']);// //,'oz.d3Map', 'oz.d3ChartSizer'

    appSuotin.config(['$routeProvider','$locationProvider', '$controllerProvider', '$compileProvider','$filterProvider','$provide', //
        function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

            //for production
            //$compileProvider.debugInfoEnabled(false);
            $controllerProvider.allowGlobals();

        appSuotin.lazyLoader = {
            controllerProvier: $controllerProvider,
            controllers: $controllerProvider.register,
            directives: $compileProvider.directive,
            filters: $filterProvider.register,
            factories: $provide.factory,
            services: $provide.service
        }

        $routeProvider
            .when("/", { templateUrl: "views/home.html", reloadOnSearch: false, controller: "homeController"}) //
            .when("/ourpeople", { templateUrl: "views/gallery.html", reloadOnSearch: false, resolve:{found: function($q, $timeout){ resolveController($q, $timeout, "gallery");}} })
            .when("/add", { templateUrl: "views/add_case.html",reloadOnSearch: false, resolve:{found: function($q, $timeout){ resolveController($q, $timeout, "addCase");}} })
            .when("/dataviz", { templateUrl: "views/dataviz.html", reloadOnSearch: false, resolve:{found: function($q, $timeout){ resolveController($q, $timeout, "stats");}} })
            .when("/dashbrd", { templateUrl: "views/dashbrd.html", reloadOnSearch: false, resolve:{found: function($q, $timeout){ resolveController($q, $timeout, "dashboard");}} })
            //.when("/validate", { templateUrl: "views/validate.html", controller:"validateController", reloadOnSearch: false })
           ;// .otherwise({ redirectTo: "/" });

        $locationProvider.html5Mode(true);
    }]);
};

function registerApp(){
    angular.bootstrap(document.body, ['suotinApp', 'appControllers',  'ngRoute','appServices', 'appDirectives', 'appFilters', 'datePicker']);//, 'ui.bootstrap', { strictDi: true}
};

function ImportJsFilesWrapper(cbk)
{
    ImportJsFiles([

        //"js/motor/controllers/homeController.js",
        "js/motor/controllers/homeController.min.js",
        //"js/motor/services.js",
        "js/motor/services.min.js",
        //"js/motor/controllers/rootController.js",
        "js/motor/controllers/rootController.min.js",
        "js/motor/directives/core.js",
        "js/motor/filters.js"
        //"motor/app.js"
    ], cbk);
};

$.afui.useInternalRouting=false;
$.afui.autoLaunch = false;
//$.afui.loadDefaultHash=false;
jQuery(function ($) {
    'use strict';

    var options = {
        scrollBy: 200,
        speed: 200,
        easing: 'easeOutQuart',
        scrollBar: '#scrollbar' ,
        dynamicHandle: 1,
        dragHandle: 1,
        clickBar: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1
    };
    suotin.frame = new Sly('#frame', options);//

    // Initiate frame
    suotin.frame.init();


    suotin.loaderVM.mainLoader = $("#loader-wrapper");
    // Reload on resize

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        suotin.isMobileDevice = true;
        suotin.init();

    }
    else
    {
        suotin.isMobileDevice = false;
        suotin.init();

        $(window).on('resize', function () {
            suotin.frame.reload();
            suotin.reInit();
        });
    }

    ImportJsFilesWrapper(function(){
      //  debugger;
        configularAngJs();
        registerApp();
        // start running
        suotin.loaderVM.hideMainLoader();

    });

    //$.afui.loadDefaultHash=false;
});

