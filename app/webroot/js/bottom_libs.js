/*
	Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
	(c) 2012-2013, Jacob Toye, Smartrak

	https://github.com/Leaflet/Leaflet.label
	http://leafletjs.com
	https://github.com/jacobtoye
*/
(function(){L.labelVersion="0.2.2-dev",L.Label=L.Class.extend({includes:L.Mixin.Events,options:{className:"",clickable:!1,direction:"right",noHide:!1,offset:[12,-15],opacity:1,zoomAnimation:!0},initialize:function(t,e){L.setOptions(this,t),this._source=e,this._animated=L.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._pane=this._source instanceof L.Marker?t._panes.markerPane:t._panes.popupPane,this._container||this._initLayout(),this._pane.appendChild(this._container),this._initInteraction(),this._update(),this.setOpacity(this.options.opacity),t.on("moveend",this._onMoveEnd,this).on("viewreset",this._onViewReset,this),this._animated&&t.on("zoomanim",this._zoomAnimation,this),L.Browser.touch&&!this.options.noHide&&L.DomEvent.on(this._container,"click",this.close,this)},onRemove:function(t){this._pane.removeChild(this._container),t.off({zoomanim:this._zoomAnimation,moveend:this._onMoveEnd,viewreset:this._onViewReset},this),this._removeInteraction(),this._map=null},setLatLng:function(t){return this._latlng=L.latLng(t),this._map&&this._updatePosition(),this},setContent:function(t){return this._previousContent=this._content,this._content=t,this._updateContent(),this},close:function(){var t=this._map;t&&(L.Browser.touch&&!this.options.noHide&&L.DomEvent.off(this._container,"click",this.close),t.removeLayer(this))},updateZIndex:function(t){this._zIndex=t,this._container&&this._zIndex&&(this._container.style.zIndex=t)},setOpacity:function(t){this.options.opacity=t,this._container&&L.DomUtil.setOpacity(this._container,t)},_initLayout:function(){this._container=L.DomUtil.create("div","leaflet-label "+this.options.className+" leaflet-zoom-animated"),this.updateZIndex(this._zIndex)},_update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updatePosition(),this._container.style.visibility="")},_updateContent:function(){this._content&&this._map&&this._prevContent!==this._content&&"string"==typeof this._content&&(this._container.innerHTML=this._content,this._prevContent=this._content,this._labelWidth=this._container.offsetWidth)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},_setPosition:function(t){var e=this._map,i=this._container,n=e.latLngToContainerPoint(e.getCenter()),o=e.layerPointToContainerPoint(t),s=this.options.direction,a=this._labelWidth,l=L.point(this.options.offset);"right"===s||"auto"===s&&o.x<n.x?(L.DomUtil.addClass(i,"leaflet-label-right"),L.DomUtil.removeClass(i,"leaflet-label-left"),t=t.add(l)):(L.DomUtil.addClass(i,"leaflet-label-left"),L.DomUtil.removeClass(i,"leaflet-label-right"),t=t.add(L.point(-l.x-a,l.y))),L.DomUtil.setPosition(i,t)},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPosition(e)},_onMoveEnd:function(){this._animated&&"auto"!==this.options.direction||this._updatePosition()},_onViewReset:function(t){t&&t.hard&&this._update()},_initInteraction:function(){if(this.options.clickable){var t=this._container,e=["dblclick","mousedown","mouseover","mouseout","contextmenu"];L.DomUtil.addClass(t,"leaflet-clickable"),L.DomEvent.on(t,"click",this._onMouseClick,this);for(var i=0;e.length>i;i++)L.DomEvent.on(t,e[i],this._fireMouseEvent,this)}},_removeInteraction:function(){if(this.options.clickable){var t=this._container,e=["dblclick","mousedown","mouseover","mouseout","contextmenu"];L.DomUtil.removeClass(t,"leaflet-clickable"),L.DomEvent.off(t,"click",this._onMouseClick,this);for(var i=0;e.length>i;i++)L.DomEvent.off(t,e[i],this._fireMouseEvent,this)}},_onMouseClick:function(t){this.hasEventListeners(t.type)&&L.DomEvent.stopPropagation(t),this.fire(t.type,{originalEvent:t})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&L.DomEvent.preventDefault(t),"mousedown"!==t.type?L.DomEvent.stopPropagation(t):L.DomEvent.preventDefault(t)}}),L.BaseMarkerMethods={showLabel:function(){return this.label&&this._map&&(this.label.setLatLng(this._latlng),this._map.showLabel(this.label)),this},hideLabel:function(){return this.label&&this.label.close(),this},setLabelNoHide:function(t){this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))},bindLabel:function(t,e){var i=this.options.icon?this.options.icon.options.labelAnchor:this.options.labelAnchor,n=L.point(i)||L.point(0,0);return n=n.add(L.Label.prototype.options.offset),e&&e.offset&&(n=n.add(e.offset)),e=L.Util.extend({offset:n},e),this._labelNoHide=e.noHide,this.label||(this._labelNoHide||this._addLabelRevealHandlers(),this.on("remove",this.hideLabel,this).on("move",this._moveLabel,this).on("add",this._onMarkerAdd,this),this._hasLabelHandlers=!0),this.label=new L.Label(e,this).setContent(t),this},unbindLabel:function(){return this.label&&(this.hideLabel(),this.label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this).off("add",this._onMarkerAdd,this)),this._hasLabelHandlers=!1),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},getLabel:function(){return this.label},_onMarkerAdd:function(){this._labelNoHide&&this.showLabel()},_addLabelRevealHandlers:function(){this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),L.Browser.touch&&this.on("click",this.showLabel,this)},_removeLabelRevealHandlers:function(){this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this),L.Browser.touch&&this.off("click",this.showLabel,this)},_moveLabel:function(t){this.label.setLatLng(t.latlng)}},L.Icon.Default.mergeOptions({labelAnchor:new L.Point(9,-20)}),L.Marker.mergeOptions({icon:new L.Icon.Default}),L.Marker.include(L.BaseMarkerMethods),L.Marker.include({_originalUpdateZIndex:L.Marker.prototype._updateZIndex,_updateZIndex:function(t){var e=this._zIndex+t;this._originalUpdateZIndex(t),this.label&&this.label.updateZIndex(e)},_originalSetOpacity:L.Marker.prototype.setOpacity,setOpacity:function(t,e){this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)},_originalUpdateOpacity:L.Marker.prototype._updateOpacity,_updateOpacity:function(){var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this.label&&this.label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)},_originalSetLatLng:L.Marker.prototype.setLatLng,setLatLng:function(t){return this.label&&!this._labelNoHide&&this.hideLabel(),this._originalSetLatLng(t)}}),L.CircleMarker.mergeOptions({labelAnchor:new L.Point(0,0)}),L.CircleMarker.include(L.BaseMarkerMethods),L.Path.include({bindLabel:function(t,e){return this.label&&this.label.options===e||(this.label=new L.Label(e,this)),this.label.setContent(t),this._showLabelAdded||(this.on("mouseover",this._showLabel,this).on("mousemove",this._moveLabel,this).on("mouseout remove",this._hideLabel,this),L.Browser.touch&&this.on("click",this._showLabel,this),this._showLabelAdded=!0),this},unbindLabel:function(){return this.label&&(this._hideLabel(),this.label=null,this._showLabelAdded=!1,this.off("mouseover",this._showLabel,this).off("mousemove",this._moveLabel,this).off("mouseout remove",this._hideLabel,this)),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},_showLabel:function(t){this.label.setLatLng(t.latlng),this._map.showLabel(this.label)},_moveLabel:function(t){this.label.setLatLng(t.latlng)},_hideLabel:function(){this.label.close()}}),L.Map.include({showLabel:function(t){return this.addLayer(t)}}),L.FeatureGroup.include({clearLayers:function(){return this.unbindLabel(),this.eachLayer(this.removeLayer,this),this},bindLabel:function(t,e){return this.invoke("bindLabel",t,e)},unbindLabel:function(){return this.invoke("unbindLabel")},updateLabelContent:function(t){this.invoke("updateLabelContent",t)}})})(this,document);
/*
(c) 2014, Vladimir Agafonkin
simpleheat, a tiny JavaScript library for drawing heatmaps with Canvas
    https://github.com/mourner/simpleheat
*/
        !function(){"use strict";function t(i){return this instanceof t?(this._canvas=i="string"==typeof i?document.getElementById(i):i,this._ctx=i.getContext("2d"),this._width=i.width,this._height=i.height,this._max=1,void this.clear()):new t(i)}t.prototype={defaultRadius:25,defaultGradient:{.4:"blue",.6:"cyan",.7:"lime",.8:"yellow",1:"red"},data:function(t){return this._data=t,this},max:function(t){return this._max=t,this},add:function(t){return this._data.push(t),this},clear:function(){return this._data=[],this},radius:function(t,i){i=i||15;var a=this._circle=document.createElement("canvas"),s=a.getContext("2d"),e=this._r=t+i;return a.width=a.height=2*e,s.shadowOffsetX=s.shadowOffsetY=200,s.shadowBlur=i,s.shadowColor="black",s.beginPath(),s.arc(e-200,e-200,t,0,2*Math.PI,!0),s.closePath(),s.fill(),this},gradient:function(t){var i=document.createElement("canvas"),a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,256);i.width=1,i.height=256;for(var e in t)s.addColorStop(e,t[e]);return a.fillStyle=s,a.fillRect(0,0,1,256),this._grad=a.getImageData(0,0,1,256).data,this},draw:function(t){this._circle||this.radius(this.defaultRadius),this._grad||this.gradient(this.defaultGradient);var i=this._ctx;i.clearRect(0,0,this._width,this._height);for(var a,s=0,e=this._data.length;e>s;s++)a=this._data[s],i.globalAlpha=Math.max(a[2]/this._max,t||.05),i.drawImage(this._circle,a[0]-this._r,a[1]-this._r);var n=i.getImageData(0,0,this._width,this._height);return this._colorize(n.data,this._grad),i.putImageData(n,0,0),this},_colorize:function(t,i){for(var a,s=3,e=t.length;e>s;s+=4)a=4*t[s],a&&(t[s-3]=i[a],t[s-2]=i[a+1],t[s-1]=i[a+2])}},window.simpleheat=t}(),/*
         (c) 2014, Vladimir Agafonkin
         Leaflet.heat, a tiny and fast heatmap plugin for Leaflet.
         https://github.com/Leaflet/Leaflet.heat
         */
            L.HeatLayer=(L.Layer?L.Layer:L.Class).extend({initialize:function(t,i){this._latlngs=t,L.setOptions(this,i)},setLatLngs:function(t){return this._latlngs=t,this.redraw()},addLatLng:function(t){return this._latlngs.push(t),this.redraw()},setOptions:function(t){return L.setOptions(this,t),this._heat&&this._updateOptions(),this.redraw()},redraw:function(){return!this._heat||this._frame||this._map._animating||(this._frame=L.Util.requestAnimFrame(this._redraw,this)),this},onAdd:function(t){this._map=t,this._canvas||this._initCanvas(),t._panes.overlayPane.appendChild(this._canvas),t.on("moveend",this._reset,this),t.options.zoomAnimation&&L.Browser.any3d&&t.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(t){t.getPanes().overlayPane.removeChild(this._canvas),t.off("moveend",this._reset,this),t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},_initCanvas:function(){var t=this._canvas=L.DomUtil.create("canvas","leaflet-heatmap-layer leaflet-layer"),i=this._map.getSize();t.width=i.x,t.height=i.y;var a=this._map.options.zoomAnimation&&L.Browser.any3d;L.DomUtil.addClass(t,"leaflet-zoom-"+(a?"animated":"hide")),this._heat=simpleheat(t),this._updateOptions()},_updateOptions:function(){this._heat.radius(this.options.radius||this._heat.defaultRadius,this.options.blur),this.options.gradient&&this._heat.gradient(this.options.gradient),this.options.max&&this._heat.max(this.options.max)},_reset:function(){var t=this._map.containerPointToLayerPoint([0,0]);L.DomUtil.setPosition(this._canvas,t);var i=this._map.getSize();this._heat._width!==i.x&&(this._canvas.width=this._heat._width=i.x),this._heat._height!==i.y&&(this._canvas.height=this._heat._height=i.y),this._redraw()},_redraw:function(){var t,i,a,s,e,n,h,o,r,_=[],d=this._heat._r,l=this._map.getSize(),m=new L.LatLngBounds(this._map.containerPointToLatLng(L.point([-d,-d])),this._map.containerPointToLatLng(l.add([d,d]))),c=void 0===this.options.maxZoom?this._map.getMaxZoom():this.options.maxZoom,u=1/Math.pow(2,Math.max(0,Math.min(c-this._map.getZoom(),12))),g=d/2,f=[],p=this._map._getMapPanePos(),v=p.x%g,w=p.y%g;for(t=0,i=this._latlngs.length;i>t;t++)if(m.contains(this._latlngs[t])){a=this._map.latLngToContainerPoint(this._latlngs[t]),e=Math.floor((a.x-v)/g)+2,n=Math.floor((a.y-w)/g)+2;var y=void 0!==this._latlngs[t].alt?this._latlngs[t].alt:void 0!==this._latlngs[t][2]?+this._latlngs[t][2]:1;r=y*u,f[n]=f[n]||[],s=f[n][e],s?(s[0]=(s[0]*s[2]+a.x*r)/(s[2]+r),s[1]=(s[1]*s[2]+a.y*r)/(s[2]+r),s[2]+=r):f[n][e]=[a.x,a.y,r]}for(t=0,i=f.length;i>t;t++)if(f[t])for(h=0,o=f[t].length;o>h;h++)s=f[t][h],s&&_.push([Math.round(s[0]),Math.round(s[1]),Math.min(s[2],1)]);this._heat.data(_).draw(this.options.minOpacity),this._frame=null},_animateZoom:function(t){var i=this._map.getZoomScale(t.zoom),a=this._map._getCenterOffset(t.center)._multiplyBy(-i).subtract(this._map._getMapPanePos());L.DomUtil.setTransform?L.DomUtil.setTransform(this._canvas,a,i):this._canvas.style[L.DomUtil.TRANSFORM]=L.DomUtil.getTranslateString(a)+" scale("+i+")"}}),L.heatLayer=function(t,i){return new L.HeatLayer(t,i)};