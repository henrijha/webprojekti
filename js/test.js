import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {fromLonLat} from "ol/proj";

var SinglePoint = OpenLayers.Class.create();
SinglePoint.prototype = OpenLayers.Class.inherit(OpenLayers.Handler.Point, {
    createFeature: function(evt) {
        this.control.layer.removeFeatures(this.control.layer.features);
        OpenLayers.Handler.Point.prototype.createFeature.apply(this, arguments);
    }
});

var start_style = OpenLayers.Util.applyDefaults({
    externalGraphic: "start.png",
    graphicWidth: 18,
    graphicHeight: 26,
    graphicYOffset: -26,
    graphicOpacity: 1
}, OpenLayers.Feature.Vector.style['default']);

var stop_style = OpenLayers.Util.applyDefaults({
    externalGraphic: "stop.png",
    graphicWidth: 18,
    graphicHeight: 26,
    graphicYOffset: -26,
    graphicOpacity: 1
}, OpenLayers.Feature.Vector.style['default']);

var result_style = OpenLayers.Util.applyDefaults({
    strokeWidth: 3,
    strokeColor: "#ff0000",
    fillOpacity: 0
}, OpenLayers.Feature.Vector.style['default']);

// global variables
var map, parser, start, stop, downtown, result, controls;

function init() {
    map = new OpenLayers.Map('map', {projection: "EPSG: 54004",
        units: "m",
        maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(-20037508,
            -136554022,
            20037508,
            136554022)
    });
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.MousePosition());

    // create and add layers to the map
    var satellite = new OpenLayers.Layer.GoogleMercator("Google Satellite",
        {type: G_NORMAL_MAP});
    start = new OpenLayers.Layer.Vector("Start point", {style: start_style});
    stop = new OpenLayers.Layer.Vector("End point", {style: stop_style});
    downtown = new OpenLayers.Layer.Vector("Downtown data area",
        {style: result_style});
    result = new OpenLayers.Layer.Vector("Routing results",
        {style: result_style});

    map.addLayers([satellite, start, stop, downtown,result]);

    // create a feature from a wkt string and add it to the map
    parser = new OpenLayers.Format.WKT();
    var wkt = "POLYGON((-13737893 6151394, -13737893 6141906, -13728396 6141906, -13728396 6151394, -13737893 6151394))";
    var geometry = parser.read(wkt);
    var feature = new OpenLayers.Feature.Vector(geometry);
    downtown.addFeatures([feature]);

    // set default position
    map.zoomToExtent(new OpenLayers.Bounds(-13737893,
        6141906,
        -13728396,
        6151394));

    // controls
    controls = {
        start: new OpenLayers.Control.DrawFeature(start, SinglePoint),
        stop: new OpenLayers.Control.DrawFeature(stop, SinglePoint)
    }
    for (var key in controls) {
        map.addControl(controls[key]);
    }
}

function toggleControl(element) {
    for (key in controls) {
        if (element.value == key && element.checked) {
            controls[key].activate();
        } else {
            controls[key].deactivate();
        }
    }
}

function compute() {
    var startPoint = start.features[0];
    var stopPoint = stop.features[0];

    if (startPoint && stopPoint) {
        var result = {
            startpoint: startPoint.geometry.x + ' ' + startPoint.geometry.y,
            finalpoint: stopPoint.geometry.x + ' ' + stopPoint.geometry.y,
            method: OpenLayers.Util.getElement('method').value,
            region: "victoria",
            srid: "54004"
        };
        OpenLayers.loadURL("./ax_routing.php",
            OpenLayers.Util.getParameterString(result),
            null,
            displayRoute);
    }
}

function displayRoute(response) {
    if (response && response.responseXML) {
        // erase the previous results
        result.removeFeatures(result.features);

        // parse the features
        var edges = response.responseXML.getElementsByTagName('edge');
        var features = [];
        for (var i = 0; i < edges.length; i++) {
            var g = parser.read(edges[i].getElementsByTagName('wkt')[0].textContent);
            features.push(g);
        }
        result.addFeatures(features);
    }
}