/**
 * Created by Mustapha on 2/28/2015.
 */

appSuotin.gallery = {};
appSuotin.gallery.controller = function ($scope){

    $scope.vctms = [];
    $scope.picsLoader = true;
    $scope.currentPage = 0;
    $scope.totalPage = 0;
    $scope.msnry = null;
    $scope.msnryContainer = null;
    $scope.intervalTkn = null;

    $scope.initPics = function(){
        suotin.loaderVM.showLoaderMessage("loading data...");

        if(suotin.appData.cntrlrer != null){
            $scope.cleanScrollMagic();
        }

        $scope.msnryContainer = $("#masonry");

         window.setTimeout(function(){
            $scope.$apply(function(){

                    $scope.showPicsLoader();
                    suotin.appData.loading = true;
                    $scope.initScrollMgc();
                    suotin.appData.loading = false;
                    suotin.loaderVM.closeLoaderMessage();

                    var container =  $scope.msnryContainer[0]; //document.querySelector('.masonry'); //
                    $scope.msnry = new Masonry(container, {
                        columnWidth: 60,
                        itemSelector: '.grid-item',
                        gutter: 1
                    });
                    $scope.msnryContainer.css({'min-height': '99%'});
                }
            );
        }, 1200);
    };

    $scope.showPicsLoader = function(){
        $scope.picsLoader = true;
    };
    $scope.hidePicsLoader = function(){
        $scope.picsLoader = false;
    };


    $scope.loadVictims = function(pageNum){
        suotin.appData.loading = true;
        $scope.getGallery(pageNum).then(function(pckt){
            suotin.appData.loading = false;
            if(!angular.isUndefined(pckt) && angular.isArray(pckt.data))
            {
                var vctms = pckt.data;
                var dataLength = vctms.length;

                for(var i = 0; i < dataLength; i++)
                {
                    var nwVtm = vctms[i];
                    nwVtm.kClass =  $scope.generateClass();

                    //'<div style="z-index: inherit;  border-right: 8px solid #D83333; " class="'+ vctm.kClass + '">' +

                    var child = $( document.createElement('div') ).html($scope.createElem(nwVtm));
                    child.css({'z-index': 'inherit', 'margin-top': '2px', 'margin-bottom': '2px'}); //'border-right' : '8px solid #D83333'
                    child.addClass('grid-item ' + nwVtm.kClass);//nwVtm.kClass

                    //$.extend(child, appSuotin.gallery.scope);
                    //appSuotin.lazyLoader.compile(c);

                    var newScope = appSuotin.lazyLoader.rootScope.$new(false, appSuotin.gallery.scope);
                    newScope.xid = nwVtm;
                    newScope.selected = $scope.selected;



                    $scope.msnryContainer.append(child);
                    $scope.msnry.appended(child[0]);

                    appSuotin.lazyLoader.compile(child[0])( newScope);

                    $scope.msnryContainer.imagesLoaded( function() {
                       // $container.masonry();
                        $scope.msnry.layout();
                    });

                    //$scope.msnry.layout();
                    child = null;

                    $scope.vctms.push(nwVtm);
                }
                vctms = null;

                $scope.currentPage = pckt.currentPage;
                $scope.totalPage = pckt.totalPage;

                if(pckt.currentPage < pckt.totalPage){
                    $scope.showPicsLoader();
                    suotin.appData.scene.update();
                }
                else
                {
                    $scope.hidePicsLoader();
                    suotin.appData.scene.update();
                    $scope.cleanScrollMagic();
                }
            }
            else{
                $scope.hidePicsLoader();
            }
            //suotin.loaderVM.closeLoaderMessage();
        },function(msg){
            suotin.appData.loading = false;
            $scope.hidePicsLoader();
            suotin.loaderVM.closeLoaderMessage();
        });
    };

    $scope.initScrollMgc= function(){
        suotin.appData.cntrlrer = new ScrollMagic.Controller({vertical: true});
        suotin.appData.scene = new ScrollMagic.Scene({triggerElement: ".dataLoader", triggerHook: "onEnter"})
            .addTo(suotin.appData.cntrlrer)
            .on("enter", function (e) {

                $scope.$apply(function(){
                    $scope.hidePicsLoader();
                    if(suotin.appData.loading == true)
                        return;
                    suotin.appData.loading = true;

                    $scope.loadVictims($scope.currentPage + 1);
                });


            });
    };

    $scope.cleanScrollMagic = function(){
        suotin.appData.scene.destroy(true);
        suotin.appData.scene = null;

        suotin.appData.cntrlrer.destroy(true);
        suotin.appData.cntrlrer = null;
    };

    $scope.generateClass = function(){
        var val = Math.round(Math.random() * (8 - 1)) + 1;

        switch (val){
            case 1 :
                //return "item";
               // break;
            case 2 :
               // return "item w2";
               // break;
            case 3 :
                return "item h2";
                break;
            case 4 :

            case 5 :
                return "item h4";
                break;
                //return "item w3";
                //break;
            case 6 :
               // return "item w4";
               // break;
            case 7 :
                return "item h3";
                break;
            default :
                return "item "; //w2 h4
                break;
        }
    };

    $scope.createElem = function(vctm){
       return '<div class="hover-target" >' +
        '<div class="thumb ">' +
            '<span class="photo_container" >' +
                '<a class="rapidnofollow photo-click" >' +
                   ' <img  src="' + vctm.imageUrl + '"  border="0" class="'+ vctm.kClass +'">' + //
                        '<div class="play"></div>' +
                    '</a>' +
                '</span>' +
                '<div class="meta">' +
                    '<div class="picTitle">' +
                        '<a  ng-click="selected(xid)" title="" class="picTitle galleryItemTitle">{{xid.name}}</a>' +
                    '</div>' +
                    /*'<div class="attribution-block">' +
                        '<span class="attribution">' +
                            '<span> </span>' +
                            '<a  href="/photos/samjudson"  class="owner">Sam Judson</a>' +
                       ' </span>' +
                    '</div>' +*/
                    '<span class="inline-icons">' +
                        '<a  class="" title="" style="font-style: italic">' +
                           // '<i class="fa fa-angle-double-up fa-3x" ></i>' +
                            vctm.occurrencedate +

                        '</a>' +
                    '</span>' +
                '</div>' +
            '</div>' +
        '</div>' ;
    };

    //_id is a victim object so U can access its props as _id.xxx
    $scope.selected = function(_id){
        suotin.loaderVM.showDialog(_id.name, $scope.constructContent(_id));

        var selector = "#popupParagraphDetail";

        $scope.getVictimDetail(_id.id).then(function(pckt){

            if(!angular.isUndefined(pckt) && (_id.id == pckt.id) && !angular.isUndefined(pckt.details))
            {
                suotin.loaderVM.updateDialog(selector, pckt.details.detail + '<br /> <span style="color: #ff0000; font-size: 46px; line-height: 1">' + pckt.details.crimeType + '</span>');
            }
            else{

                suotin.loaderVM.appendToDialog(selector, "Error retrieving victim's detail ...");
            }

        },function(msg){
            suotin.loaderVM.appendToDialog(selector, "Error retrieving victim's detail \n" + msg);
        });
    };

    $scope.constructContent = function(victim){
        var genderSpan = victim.gender == 'm' ? '<span class="mlGndr picsdetailGender"></span>' : '<span class="fmlGndr picsdetailGender" ></span>';
        return '<div style="text-align: left; position: relative; height: 30px;"> ' +
            '<span class="picsDate" style="position: absolute;">' + victim.occurrencedate + '</span>' +
            genderSpan + '</div>' +

            '<div class="textScrollingContent"><img src="' + victim.imageUrl + '" style="width:130px; height: 86px; float: left; border-style: none; border-radius:5px 0px 0px 5px; margin-right:15px;" >' +
            victim.name + " is " + victim.ageGroup +
            "<p id='popupParagraphDetail' >  " +
            '<span class="dataLoader" style="border-color: #000000; display: inline-block; margin-top: 0%"></span >' +
            '<span id="popupParagraphDetailLoadingMessage" style="font-weight: bold"> Loading ...</span>' +
            '</p>'+
            '</div>';
    };

    $scope.scroolend = function(){

        if($scope.intervalTkn != null || angular.isDefined($scope.intervalTkn))
        {
            appSuotin.lazyLoader.interval.cancel($scope.intervalTkn);
            $scope.intervalTkn = null;
        }
    };

    $scope.scrooldwn = function(){
        $scope.scroolend();
        vw = $("#imgView");
        var pos = vw.scrollTop();
        vw.scrollTop(++pos);
        $scope.intervalTkn = appSuotin.lazyLoader.interval(function() {
            vw.scrollTop(++pos);
        }, 30);
    };

    $scope.scroolup= function(){
       $scope.scroolend();
        vw = $("#imgView");
        var pos = vw.scrollTop();
        vw.scrollTop(--pos);
        $scope.intervalTkn = appSuotin.lazyLoader.interval(function() {
            vw.scrollTop(--pos);
        }, 20);
    };


    $scope.$on(
        "$destroy",
        function handleDestroyEvent() {
            if(suotin.security.authCompleteIntervalToken != null)
            {
                appSuotin.lazyLoader.interval.cancel(suotin.security.authCompleteIntervalToken);

                $scope.vctms = [];
                $scope.vctms = null;
                suotin.loaderVM.closeLoaderMessage();

                if($scope.msnry != null)
                {
                    $scope.msnry.destroy();
                    $scope.msnry = null;
                }
            }

            appSuotin.lazyLoader.interval.cancel($scope.intervalTkn);
            $scope.intervalTkn = null;
        }
    );

    $scope.initPics();

}

jQuery(function($){

    appSuotin.gallery.init = function(){
        //
        // var controllerName = 'js/motor/controllers/galleryController.js';
        var controllerName = 'js/motor/controllers/galleryController.min.js';
         var tmp = JSON.parse(sessionStorage.controllerScripts);
         tmp.scripts.push(controllerName);
         sessionStorage.controllerScripts = JSON.stringify(tmp);
         tmp = null;

        var vw = angular.element("#imgView");

        appSuotin.lazyLoader.rootScope.$apply(function() {
             //debugger;
             vw.attr('ng-controller', "appSuotin.gallery.controller");

             if(!angular.isDefined(appSuotin.gallery))
                appSuotin.gallery = {};

             appSuotin.gallery.scope = vw.scope(); //appSuotin.lazyLoader.rootScope.$new();
             //appSuotin.gallery.compiled = appSuotin.lazyLoader.compile(vw[0]);

             //appSuotin.gallery.compiled(appSuotin.gallery.scope);
            appSuotin.gallery.scope.initied = true;

            $.extend( appSuotin.gallery.scope, appSuotin.gallery.controller(appSuotin.gallery.scope) );

             vw = angular.element("#imgView");

             vw.on("$destroy",function handleDestroyEvent() {
                     //debugger;
                     //var controllerfilePathName = 'js/motor/controllers/galleryController.js';
                     var controllerfilePathName = 'js/motor/controllers/galleryController.min.js';

                     var vw = angular.element("#imgView");
                     appSuotin.gallery.scope.$destroy();


                     appSuotin.gallery.scope = null;
                     appSuotin.gallery.compiled = null;
                     appSuotin.gallery = null;

                     //removejscssfile("galleryController.js", "js");
                     removejscssfile("galleryController.min.js", "js");
                     removejscssfile("masonry.pkgd.min.js", "js");

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

   /* var masonLoaded = sessionStorage.masonJsScript;

    if(masonLoaded == null || masonLoaded == undefined)
    {*/
        ImportJsFiles([
            "js/libs/masonry.pkgd.min.js"
        ], function(){

            sessionStorage.masonJsScript = JSON.stringify({loaded : true});
            appSuotin.gallery.init();
            appSuotin.modulePromise.resolve(true);
            suotin.frame.reload();

            var isChromium = !!window.chrome;

            if(isChromium){
                $("#imgView").css("overflow-y", "visible");

            }
        });

   /* }
    else
    {
        appSuotin.gallery.init();
        appSuotin.modulePromise.resolve(true);
        suotin.frame.reload();
    }*/

});
