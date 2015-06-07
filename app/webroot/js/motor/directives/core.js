/**
 * Created by Mustapha on 2/15/2015.
 */
var appDirectives = angular.module('appDirectives', []);

function stringToBoolean(string){

    if(string == undefined || string == null)
        return false;
    switch(string.toLowerCase()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return false;//Boolean(string);
    }
}

function setDefaults(attr, scope){
    scope.showViewControl = stringToBoolean(attr.showViewControl);
    scope.hasMarkerClickHndlr = ((angular.isDefined(scope.markerClickHndlr())) && (angular.isFunction(scope.markerClickHndlr())));
    scope.hasliClickHndlr = ((angular.isDefined(scope.liClickHndlr())) && (angular.isFunction(scope.liClickHndlr())));

    scope.showListControl = stringToBoolean(attr.showListControl);
    scope.showVictimList = stringToBoolean(attr.showVictimList);

    //scope.autoInit = stringToBoolean(attr.autoInit);
}

appDirectives.directive('leafletMap',["$compile", function leafletMap ($compile){
    return{
        restrict: 'E',
        scope:{
            markerClickHndlr: '&',
            liClickHndlr: '&',
            showViewControl: '@',
            showListControl: '@',
            showVictimList: '@',
            containerSelector: '@',
            victims: '='
        },
        controller: function($scope){
            $scope.victimsLoaderFlag = $scope.$parent.victimsLoaderFlag;
            $scope.map = null;
            $scope.control = null;
            $scope.mapView = "default"; //default, heat, chloro
            $scope.currentView = "default";

            $scope.visibleWidth = null;
            $scope.orientation = "horizontal";
            $scope.markerLayerGroup = null;
           // $scope.ulWidth = null;

            $scope.configureControl = function(){

                if(!$scope.showListControl)
                    return;
                var hframe = $(".leaflet-control-scroller .hframe");
                this._left = hframe.find('.left');//.scroller-nav-container
                this._right = hframe.find('.right');
                this._ul =  hframe.find(' ul');

                $scope.visibleWidth = hframe.width();
                //$scope.ulWidth =
                hframe = null;
            };
            $scope.previous = function(e, flickSpeed){
               // e.stopImmediatePropagation();
                //e.preventDefault();
                var ulWidth = $scope._ul.width();
                var hframe = $(".leaflet-control-scroller .hframe");
                var pageWidth = hframe.width();
                if(pageWidth > ulWidth)
                    return;

                var xtranslation = $scope.getTranslationX($scope._ul[0]);

                if(xtranslation < 0){
                    var maxTrans = Math.abs(xtranslation);
                    var itemSize = $(hframe.find("li")[0]).outerWidth(true);
                    var steps = pageWidth / itemSize; //number of items per page
                    var mod = maxTrans % itemSize;

                    if(mod != 0) {
                        xtranslation += mod;
                        $scope._ul.css({transform: "translateX(" + xtranslation + "px) translateZ(0)"});
                        return false;
                    }


                    if(angular.isDefined(flickSpeed) && isFinite(flickSpeed))
                            itemSize = itemSize * flickSpeed;

                    if(maxTrans < itemSize)
                    {
                        xtranslation += maxTrans;
                    }
                    else
                    {
                        xtranslation += itemSize;
                    }

                    $scope._ul.css({transform: "translateX(" + xtranslation +"px) translateZ(0)"});
                    return false;
                }
                return false;
            };
            $scope.swipePrevious = function(e, ee){
                $scope.previous(null, 3);
            };


            $scope.next = function(e, flickSpeed){
                //e.stopImmediatePropagation();
                //e.preventDefault();
                var ulWidth = $scope._ul.width();
                var hframe = $(".leaflet-control-scroller .hframe");
                var pageWidth = hframe.width();
                if(pageWidth > ulWidth)
                    return;

                var xtranslation = $scope.getTranslationX($scope._ul[0]);

                var itemCount = $scope._ul.find("li").length;
                var itemSize = $(hframe.find("li")[0]).outerWidth(true);

                var limit = -1 * ((itemCount * itemSize ) - pageWidth);

                //var

                if(xtranslation > limit)
                {
                    var maxTrans = Math.abs(xtranslation);

                    var steps = pageWidth / itemSize; //number of items per page
                    var mod = maxTrans % itemSize;

                    if(mod != 0)
                    {

                        var norm = (xtranslation + mod) - steps;

                        xtranslation -= norm - xtranslation;
                        $scope._ul.css({transform: "translateX(" + xtranslation +"px) translateZ(0)"});
                        return false;
                    }

                    if(angular.isDefined(flickSpeed) && isFinite(flickSpeed))
                        itemSize = itemSize * flickSpeed;

                    if(maxTrans < itemSize)
                    {

                        xtranslation -= (itemSize - maxTrans);
                    }
                    else
                    {
                        xtranslation -= itemSize;
                    }



                    $scope._ul.css({transform: "translateX(" + xtranslation +"px) translateZ(0)"});
                    return false;

                }
                return false;

            };
            $scope.swipeNext = function(e, ee){
               // debugger;
                $scope.next(null,3);
            };


            $scope.markerCache = null;
            $scope.markerIconCache = null;
            $scope.selectVictim = function(arrIdx, item, listItemId){
                var vctm = $scope.victims[arrIdx];

                $scope.map.panTo(L.latLng(vctm.lat, vctm.lng));
                vctm = null;

                var layergroup = $scope.markerLayerGroup; //iterate over makers to find matching one

                layergroup.eachLayer(function(mkrArg){

                    var idx = mkrArg.options.idx;

                    if(idx == this.idx){

                        $scope.addMrkrAndIconToCache(mkrArg);
                        mkrArg.setIcon($scope.selectedCaseIcon);
                    }


                }, {idx: arrIdx});

                //alert(arrIdx + "\n" + item.name + "\n" + "list item id: " +  arrIdx + "_li_victim");

            };
            $scope.getTranslationX = function(transformVal){

                var matrix = $scope.getMatrix(transformVal);
                var transMtrx = $scope.getTranslationMatrix(matrix);
                var value = transMtrx[0];

                if (typeof value == 'string' || value instanceof String)
                {
                   value = parseInt(value);
                }
                return value;
            };

            $scope.getMatrix = function(ele){
                var st = window.getComputedStyle(ele, null);

                var tr = st.getPropertyValue("-webkit-transform") ||
                    st.getPropertyValue("-moz-transform") ||
                    st.getPropertyValue("-ms-transform") ||
                    st.getPropertyValue("-o-transform") ||
                    st.getPropertyValue("transform");

                var values = tr.split('(')[1],
                    values = values.split(')')[0],
                    arr = values.split(',');

                return arr;
            };

            $scope.getTranslationMatrix = function(matrix){
                var transMtrx = [];

                if(matrix.length == 16)
                {
                    for(var i = 0; i<4; i++)
                    {
                        var idx = (4 * 3) + i;
                        transMtrx.push(matrix[idx]);
                    }
                }
                else if(matrix.length == 6)
                {
                    transMtrx.push(matrix[4]);
                    transMtrx.push(matrix[5]);
                }

                return transMtrx;
            };

            $scope.clean = function(){
                this._left = null;
                this._right = null;
                this._ul =  null;
//debugger;
                var frme = $('.hframe');
                if(frme != null)
                {
                    frme.find(' ul li').off('click') ;
                    frme.find('.left').off('click');
                    frme.find('.right').off('click');
                }


                $scope.victims = [];
                $scope.victims = null;
                frme = null;
            };

            $scope.removeMarkers = function(){
                if($scope.markerLayerGroup != null)
                {

                    $scope.clearMarkersLayerGrpEvts();

                    $scope.markerLayerGroup.clearLayers();
                    $scope.map.removeLayer($scope.markerLayerGroup);
                    $scope.markerLayerGroup = null;
                }

            };

            $scope.defaultMarkerClickHndlr = function(e){
                $scope.map.panTo(e.latlng);
                $scope.scrollMapTo(e.target.options.idx); // and perhaps some other id and or info
                $scope.addMrkrAndIconToCache(e.target);
                e.target.setIcon($scope.selectedCaseIcon);

                var idx = e.target.options.idx
                var url = $scope.victims[idx].url
                var name = $scope.victims[idx].name;

                var popup = L.popup({keepInView: true, className: "sauveLeafletPopup", offset: L.point(0, -10)})
                    .setLatLng(e.latlng) //(assuming e.latlng returns the coordinates of the event)
                    .setContent('<div class="popHostContainner">' +
                        '<div class="popHost"><div class="poopImgHost"><img src=\"'+  url +'\" /></div><div class="popOverlay">'+ name +'</div>' +
                        '</div>' +
                    '</div>')
                    .openOn($scope.map);
            };

            $scope.addMarkers = function(){
                if(!$scope.showVictimList)
                    return;

                var datalength = $scope.victims.length;
                if($scope.markerLayerGroup != null)
                    $scope.markerLayerGroup.clearLayers();

                $scope.markerLayerGroup = new L.MarkerClusterGroup({ spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: true }); // L.layerGroup();

                for (var i = 0; i < datalength; i++)
                {
                    var vctm = $scope.victims[i];
                    var mkr = L.marker(L.latLng(vctm.lat, vctm.lng),{riseOnHover: true, idx:vctm.idx}).bindLabel(vctm.name);
                    mkr.on("click", $scope.defaultMarkerClickHndlr);
                    //mkr.addTo($scope.map);
                    $scope.markerLayerGroup.addLayer(mkr);
                    mkr = null;
                    vctm = null;
                }
                $scope.markerLayerGroup.addTo($scope.map);
            };
            $scope.addHeatMap = function(){

                if(!$scope.showVictimList)
                    return;

                var datalength = $scope.victims.length;
                if($scope.markerLayerGroup != null)
                    $scope.markerLayerGroup.clearLayers();

                $scope.markerLayerGroup =  L.layerGroup();


                var tmp = [];

                for (var i = 0; i < datalength; i++)
                {
                    var vctm = $scope.victims[i];
                    var heat = new L.latLng(vctm.lat, vctm.lng);
                    tmp.push(heat);
                    vctm = null;
                    heat = null;
                }
                $scope.markerLayerGroup.addLayer( new  L.heatLayer(tmp, {radius: 25}));
                $scope.markerLayerGroup.addTo($scope.map);
               // $scope.markerLayerGroup.redraw();

            };
            $scope.scrollMapTo = function(idx){
                var hframe = $(".leaflet-control-scroller .hframe");
                var pageWidth = hframe.width();
                var itemSize = $(hframe.find("li")[0]).outerWidth(true);
                var numItemPerPage = Math.floor(pageWidth / itemSize);
                var hlfNumItemPerPage = Math.floor(numItemPerPage / 2);
                var xtranslation = $scope.getTranslationX(hframe.find(' ul')[0]);
                var absXtranslation = Math.abs(xtranslation);

                var soughtItem = (idx * itemSize) - (hlfNumItemPerPage * itemSize);

                var diff = absXtranslation - soughtItem;

                xtranslation += diff;

                if(xtranslation > 0) xtranslation = 0;

                $scope._ul.css({transform: "translateX(" + xtranslation +"px) translateZ(0)"});

            };

            $scope.resetView = function(){
                /*
                 $scope.mapView = "default"; //default, heat, chloro
                 $scope.currentView = "default";
                * */

                if($scope.mapView == $scope.currentView)
                    return;

                switch ($scope.mapView){
                    case 'heat':
                        $scope.removeMarkers();
                        $scope.addHeatMap();
                        $scope.currentView = 'heat';
                        break;
                    case 'chloro':
                        break;
                    default :
                        $scope.removeMarkers();
                        $scope.addMarkers();
                        $scope.currentView = 'default';
                        break;
                }

             };

            $scope.clearMarkersLayerGrpEvts = function(){

                if($scope.markerLayerGroup != null)
                {
                    $scope.markerLayerGroup.eachLayer(function(lyr){
                        if(angular.isDefined(lyr.off))
                            lyr.off("click", $scope.defaultMarkerClickHndlr);
                            $(lyr).off();
                    }, this);
                }
            };

            $scope.clearClickHandlerMarker = function(){
                if($scope.clickedMarker != undefined || $scope.clikedMarker != null)
                {
                    $scope.clickedMarker.clearLayers();
                }
            };

            $scope.procesMapClickEvt = function(e){
                if($scope.clickedMarker == undefined || $scope.clickedMarker == null)
                {
                    $scope.clickedMarker  = L.layerGroup();
                }
                else
                {
                    $scope.clickedMarker.clearLayers();
                }

                var mkr = L.marker(e.latlng);
                $scope.clickedMarker.addLayer(mkr);
                $scope.clickedMarker.addTo($scope.map);


                $scope.tempArg = {lat: e.latlng.lat, lng: e.latlng.lng};
                $scope.markerClickHndlr()(e.latlng.lat, e.latlng.lng);
            };

            $scope.enableMapClickHandler = function(){
                $scope.map.on('click', $scope.procesMapClickEvt)
            };

            $scope.disableMapClickHandler = function(){
                $scope.map.off('click', $scope.procesMapClickEvt)
            };

            $scope.setSingleMarker = function(lat, lng){
                if($scope.clickedMarker == undefined || $scope.clickedMarker == null)
                {
                    $scope.clickedMarker  = L.layerGroup();
                }
                else
                {
                    $scope.clickedMarker.clearLayers();
                }
                var mkr = L.marker(L.latLng(lat, lng));
                $scope.clickedMarker.addLayer(mkr);
                $scope.clickedMarker.addTo($scope.map);
            };


            appSuotin.leafletMapController = $scope;

            $scope.selectedCaseIconEx = L.Icon.extend({
                options: {
                    iconSize:     [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor:  [-3, -76]
                }
            });

            $scope.selectedCaseIcon = new $scope.selectedCaseIconEx({ iconUrl: 'imgs/marker-icon-greenish.png' });

            $scope.addMrkrAndIconToCache = function(mkrArg){
                if($scope.markerCache != mkrArg)
                {
                    if($scope.markerCache != null){
                        $scope.markerCache.setIcon($scope.markerIconCache);
                    }

                    $scope.markerCache = $scope.markerIconCache = null;

                    $scope.markerCache = mkrArg;
                    $scope.markerIconCache = mkrArg.options.icon;
                }
            };

        },
        link: function(scope, iEle, iAttr){

            setDefaults(iAttr, scope);

            //if( scope.autoInit != true )
                //return;

            if( angular.isDefined(scope.$parent.initied) && scope.$parent.initied == true)
                return;


            //scope.autoInit = false;

            MB_URL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

            OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';  //'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

            OSM_HYDA_URL = "http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png";

            $(".article").css("height", verge.viewportH() );
            scope.map = L.map($(scope.containerSelector)[0], {maxBounds:[[39.108751, -27.905273],[-41.459195, 56.074219]], zoomControl:false }).setView([7.682668, -5.021439],15);
            var mapLink =
                '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer(
                OSM_HYDA_URL , { //'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution: '&copy; ' + mapLink + ' Contributors',
                    maxZoom: 18,
                    minZoom: 7,
                    //These should reduce memory usage
                    unloadInvisibleTiles: true,
                    updateWhenIdle: true,
                    reuseTiles: true,
                    // Disable the animation on double-click and other zooms.
                    zoomAnimation: false,

                    // Disable the animation of tiles fading in and out.
                    fadeAnimation: false,

                    // Disable the inertia that causes the map to keep moving
                    // when you drag it quickly.
                    inertia: false
                }).addTo(scope.map);


            if(scope.showListControl)
            {
                L.Control.Scroller = L.Control.extend({
                    options: {
                        position: 'bottomleft'
                    },
                    initialize: function (options) {
                        L.setOptions(this, options);
                    },
                    getContainer: function () {
                        return this._container;
                    },

                    onAdd: function (map) {

                        var scrollerContainerName = 'leaflet-control-scrollerContainer',
                            scrollername = 'leaflet-control-scroller',
                            container = L.DomUtil.create('div', scrollerContainerName),
                            options = this.options;

                        var scrollerEdgeName = "leaflet-control-scrollerEdge";
                        this._edge = L.DomUtil.create('div', scrollerEdgeName, container);

                        // create the control container with a particular class name
                        var scroller = L.DomUtil.create('div', scrollername, container);
                        scroller.innerHTML = '<div class="hframe" id="centered"><ul class="clearfix " style="min-width: 6040px" >' +
                        '<li ng-repeat="victim in victims" class="" id="{{victim.idx}}_li_victim " ng-click="selectVictim($index, victim )" >' +
                        '<div>' +
                        '<span ng-class="{mlGndr : victim.gender == \'m\' , fmlGndr : victim.gender == \'f\' }"></span>' +
                        '<div><span class="date-time" >{{victim.occurrencedate}} </span><span class="vctmAge"> {{victim.ageGroup}}</span> </div>' +
                        '   </div>' +
                        '<div class="vctmName">{{victim.name}}</div>' +
                            //'' +
                        '<div class="vctmSyn "><textarea  rows="5" cols="25">{{victim.detail}}</textarea></div>' +
                        '<div ng-class="{vctmstatus_open: victim.status == \'open\', vctmstatus_pending: victim.status == \'pending\', vctmstatus_unresolved: victim.status == \'unresolved\', vctmstatus_closed: victim.status == \'closed\', vctmstatus_unknown: victim.status == \'unknown\'}">{{victim.status}}</div>' +
                        '</li>' +
                        '<li ng-show="$parent.victimsLoader" >' +
                            '<div class="dataLoader"><span ></span></div>'+
                        '</li>'+
                        '<li ng-show="$parent.victimsLoaderFlag" style="margin-left: -150px;" >' +
                        '<div class="dataLoaderGuard"><span ></span></div>'+
                        '</li>'+

                        '</ul>'+
                            //'<div class="scroller-nav-container">' +ng-swipe-left="swipeNext()"ng-swipe-right="swipePrevious()"
                        '<div class="left"  ><i class="fa fa-chevron-left fa-5x" ng-click="previous()"></i>' +
                                                                            '<span class="swipeRight "  ng-click="swipePrevious()"><i class="fa fa-angle-double-left fa-5x mobileOnly"></i></span>' +
                        '</div>' +
                        ' <div class="right" style="position: absolute"  ><i class="fa fa-chevron-right fa-5x" ng-click="next()"></i>' +
                                                        '<span class="swipeLeft "  ng-click="swipeNext()"><i class="fa fa-angle-double-right fa-5x mobileOnly"></i></span>' +
                        '</div></div>';// +
                        //'</div>';

                        $compile(scroller)(this.options.scope);

                        return container;
                    }
                    ,
                    onRemove: function(map){
                        //scope.clean();
                        scope.$destroy();
                    }
                });
                L.control.scroller = function( options) {
                    return new L.Control.Scroller(options);
                }


                scope.map.addControl(scope.control = new L.Control.Scroller({scope: scope}));
            }

            if(scope.showViewControl)
            {
                L.Control.ViewSelector = L.Control.extend({
                    options:{"position" : 'topright'},
                    initialize: function(options){L.setOptions(this, options);},
                    getContainer:function(){return this._container;},
                    showHideMenu: function(){

                        if(L.DomUtil.hasClass(this.getContainer(),"open")){
                            L.DomUtil.removeClass(this.getContainer(),"open")
                        }
                        else
                        {
                            L.DomUtil.addClass(this.getContainer(),"open")
                        }


                    },
                    onAdd: function(){
                        var viewContainerBtnClassName = 'leaflet-control-viewContainer',
                            viewIconBtnClassName = 'leaflet-control-iconBtn',
                            expandClassName = 'leaflet-control-viewExpand',
                            retreatClassName = 'leaflet-control-viewRetreat',
                            radioBtnClassName = 'leaflet-control-radioBtn',
                            radioBtnContainerClassName = 'leaflet-control-radioBtnContainer',
                        //firstTier = 'leaflet-control-viewContainerFirstTier',
                            dropdown = 'leaflet-control-dropdown',
                            secondTier = 'leaflet-control-viewContainerSecondTier';

                        var containar = L.DomUtil.create('div', viewContainerBtnClassName);
                        var premierBtn = L.DomUtil.create('button', viewIconBtnClassName, containar);
                        var eyeICon = L.DomUtil.create('i', "fa fa-eye ", premierBtn)
                        this._deuxiemeBtn = L.DomUtil.create('button', viewIconBtnClassName + " " + dropdown  , containar);
                        L.DomUtil.create('span', 'caret', this._deuxiemeBtn);
                        L.DomUtil.create('span', 'sr-only', this._deuxiemeBtn);
                        this._menu = L.DomUtil.create('div', 'dropdown-menu', containar);

                        this._menu.innerHTML =
                            '<input id="rddefault" name="groupradio" ng-model="mapView" checked="checked" type="radio" value="default" tabindex="1" ng-click="resetView()" /><label for="rddefault"> Default</label> ' +
                            '<br/>' +
                            ' <input id="rdHeatmap" name="groupradio" ng-model="mapView" type="radio" value="heat" tabindex="2" ng-click="resetView()" /><label for="rdHeatmap"> Heat map</label> ' +
                            '<br/>' +
                            ' <input id="rdchoropleth" name="groupradio" ng-model="mapView" type="radio" value="chloro" tabindex="3" ng-click="resetView()" /><label for="rdchoropleth"> Choropleth</label> ' ;


                        L.DomEvent.addListener(this._deuxiemeBtn, 'click',this.showHideMenu, this);

                        $compile(this._menu)(this.options.scope);

                        return containar;
                    },
                    onRemove: function(){
                        L.DomEvent.removetListener(this._deuxiemeBtn, 'click',this.showHideMenu, this);
                        scope.$destroy();
                        this._deuxiemeBtn = null;
                        this._menu = null;
                    }
                });

                L.Control.viewSelector = function(options){
                    return new L.Control.ViewSelector(options);
                };
                scope.map.addControl(scope.viewControl = new L.Control.ViewSelector({scope: scope}));
            }


            scope.configureControl();

            function winResizerHndlr() {
                $(".article").css("height", verge.viewportH() );
            }
            $(window).resize(winResizerHndlr);

            // Disable dragging when user's cursor enters the element

            if(scope.showListControl)
            {
                function controlMouseOver () {

                    scope.map.dragging.disable();
                    scope.map.touchZoom.disable();
                    scope.map.doubleClickZoom.disable();
                    scope.map.scrollWheelZoom.disable();
                }
                scope.control.getContainer().addEventListener('mouseover', controlMouseOver);


                // Re-enable dragging when user's cursor leaves the element
                function controlMouseOut() {

                    scope.map.dragging.enable();
                    scope.map.touchZoom.enable();
                    scope.map.doubleClickZoom.enable();
                    scope.map.scrollWheelZoom.enable();
                }

                scope.control.getContainer().addEventListener('mouseout',controlMouseOut );
            }

            if(scope.showViewControl) {

                function viewControlMouseOver() {

                    scope.map.dragging.disable();
                    scope.map.touchZoom.disable();
                    scope.map.doubleClickZoom.disable();
                    scope.map.scrollWheelZoom.disable();
                }

                scope.viewControl.getContainer().addEventListener('mouseover', viewControlMouseOver);

                // Re-enable dragging when user's cursor leaves the element
                function viewControlMouseOut() {

                    scope.map.dragging.enable();
                    scope.map.touchZoom.enable();
                    scope.map.doubleClickZoom.enable();
                    scope.map.scrollWheelZoom.enable();
                }

                scope.viewControl.getContainer().addEventListener('mouseout', viewControlMouseOut);
            }


            scope.addMarkers();

            //on map zoom start: remove all evt handlers  and do same to all descendants : zoomstart
            scope.map.on('zoomstart', function(){
                $(".leaflet-tile-pane").find("*").off();
                $(".leaflet-tile-pane").off();


                $('.leaflet-tile .leaflet-tile-loaded').off(); //.remove();
                $('.leaflet-marker-icon .marker-cluster .marker-cluster-small .leaflet-zoom-animated .leaflet-clickable').off();
                $(".leaflet-tile-pane").find("*").off();
            });

            if(scope.showVictimList)
            {
                scope.map.on('zoomend', function(e){
                    //debugger;
                    scope.currentView = 'unknown';  //set it to anything other than the current webview which would either be default, heat, or chloro
                    scope.resetView();
                });

                scope.watcher = scope.$watch(function(){
                    return scope.victims.length;
                }, function(nwVl, ldVl){
                    scope.removeMarkers();
                    scope.addMarkers();
                    scope.map.invalidateSize(false);
/*
                    var zm = scope.map.getZoom();
                    scope.map.setZoom(zm+1);
                    scope.map.setZoom(zm);*/

                    if(nwVl != ldVl)
                        suotin.loaderVM.closeLoaderMessage();

                }, true);//
            }

            if(scope.hasMarkerClickHndlr)
            {
                scope.EnableMapClickHandler();
            }



            scope.$on('$destroy', function(){

                appSuotin.leafletMapController = null;

                if(scope.showVictimList == true)
                   scope.watcher();


                $(scope.map).off();
                $(".leaflet-tile-pane").off();

                $('.leaflet-tile .leaflet-tile-loaded').off().remove();
                $('.leaflet-marker-icon .marker-cluster .marker-cluster-small .leaflet-zoom-animated .leaflet-clickable').off().remove();
                $(".leaflet-tile-pane").find("*").off().remove();


                if(scope.showListControl == true)
                {
                    scope.control.getContainer().removeEventListener('mouseout',controlMouseOut );
                    scope.control.getContainer().removeEventListener('mouseover', controlMouseOver);
                }


                if(scope.showViewControl == true) {
                    scope.viewControl.getContainer().removeEventListener('mouseover', viewControlMouseOver);
                    scope.viewControl.getContainer().removeEventListener('mouseout', viewControlMouseOut);
                }

                scope.clean();
                scope.removeMarkers();
                //delete scope.markerLayerGroup;
                $(window).off("resize", winResizerHndlr);

                scope.map.remove();

                scope.control = null;
                scope.mapView = null;
                scope.currentView = null;
                scope.map = null;
            });



            suotin.frame.reload();

        }

    };
}]);
