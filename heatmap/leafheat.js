/*
* Created by Midas Lambrichts.
* Heavily inspired by and build upon: https://github.com/Leaflet/Leaflet.heat
*/
L.HeatLayer = (L.Layer ? L.Layer : L.Class).extend({


    defaultGradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
    },

    defaultOptions: {
        globalAlpha: 0.03, //Changes the max value, lower means less peaks.
        lineWidth: 3, //How wide each route should be.
        blurSize: 3, //How much each routes blurs.
        show: true // Whether or not the layer should be shown.
    },

    initialize: function(options){
        this._routes = [];
        options = options === undefined? this.defaultOptions: options;
        Object.assign(this.options, options);
    },

    setOptions: function(options){
        Object.assign(this.options, options);
        this.redraw();
    },

    resetDefaultOptions: function(){
        Object.assign(this.options, this.defaultOptions);
        this.redraw();
    },

    setRoutes: function(routes){
        this._routes = routes;
        this.redraw();
    },

    addRoutes: function(routes){
        this._routes.concat(routes);
        this.redraw();
    },

    addRoute: function(route){
        this._routes.push(route);
        this.redraw();
    },

    _findRoute(r, r2){
        return r[0] == r2[0] && r[1] == r2[1];
    },

    removeRoute: function(route){
        var index = this._routes.findIndex((e) => {return this._findRoute(e, route)});
        if (index >= 0){
            this._routes.splice(index, 1);
            this.redraw();
        }
    },

    removeRoutes: function(routes){
        var indices = [];
        routes.forEach((r) => {
            var index = this._routes.findIndex((e) => {return this._findRoute(e, r)});
            if (index >= 0){
                indices.push(index);
            } else {
                console.log("Not found");
            }
        });

        indices.sort((a,b) => {return a-b;});
        for (var i = indices.length; i >= 0; --i){
            this._routes.splice(indices[i], 1);
        };
        
        this.redraw();
    },

    redraw: function () {
        if (!this._frame && this._map && !this._map._animating) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    },


    _initCanvas: function () {
        var canvas = this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer leaflet-layer');

        var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        canvas.style[originProp] = '50% 50%';

        var size = this._map.getSize();
        canvas.width  = size.x;
        canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
    },


    _reset: function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);

        var size = this._map.getSize();

        this._redraw();
    },

    _redraw: function () {
        if (!this._map) {
            return;
        }
        if (!this.options.show){
            var ctx = this._canvas.getContext('2d');
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._frame = null;
            return;
        }

        var size = this._map.getSize();
        var bounds = new L.Bounds(
            L.point([0, 0]), size);
        var ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.globalAlpha = this.options.globalAlpha;
        ctx.lineWidth = this.options.lineWidth;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.shadowBlur = this.options.blurSize;
        ctx.shadowColor = 'black';
        ctx.strokeStyle = "black";

        this._routes.forEach((route) => {
            ctx.beginPath();
            var p = this._map.latLngToContainerPoint(route[0]);
            var nextP;
            ctx.moveTo(p.x, p.y);
            for (var i = 1; i < route.length; i++){
                p = this._map.latLngToContainerPoint(route[i]);
                ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
            ctx.closePath();
        });

        //ctx.filter = 'drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 5px black)';

        var colored = ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
        this._colorize(colored.data, this.gradient(this.defaultGradient));
        ctx.putImageData(colored, 0, 0);
        
        this._frame = null;
    },


    gradient: function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = this._createCanvas(),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        return ctx.getImageData(0, 0, 1, 256).data;
    },

    _colorize: function (pixels, gradient) {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // get gradient color from opacity value

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
                // pixels[i] = 122;
                // pixels[i + 1] = 122;
                // pixels[i + 2] = 122;
                // pixels[i + 3] = 255;
            }
        }
    },


    onRemove: function (map) {
        if (this.options.pane) {
            this.getPane().removeChild(this._canvas);
        }else{
            map.getPanes().overlayPane.removeChild(this._canvas);
        }

        map.off('moveend', this._reset, this);

        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    onAdd: function (map) {
        this._map = map;

        if (!this._canvas) {
            this._initCanvas();
        }

        if (this.options.pane) {
            this.getPane().appendChild(this._canvas);
        }else{
            map._panes.overlayPane.appendChild(this._canvas);
        }

        map.on('moveend', this._reset, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        this._reset();
    },

    _createCanvas: function () {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            // create a new canvas instance in node.js
            // the canvas class needs to have a default constructor without any parameter
            return new this._canvas.constructor();
        }
    },

    _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

        if (L.DomUtil.setTransform) {
            L.DomUtil.setTransform(this._canvas, offset, scale);

        } else {
            this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
        }
    }
});

L.heatLayer = function (options) {
    return new L.HeatLayer(options);
};