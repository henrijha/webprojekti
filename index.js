'use strict';

var player_pos = [63, 23];

var markerArray = [];
//markerArray.push(makeMarker(63, 23, 'a', 'b'));
for (var i = 0; i < markers.length; i++) {
    if (!(markers[i].latitude === "NULL")) {
        markerArray.push(makeMarker(parseFloat(markers[i].latitude), parseFloat(markers[i].longitude), markers[i].name, markers[i].website));
    }
}
var vectorLayer = makeVectorLayer(markerArray);

function makeMarker(lat, lon, name, website) {
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
        name: name,
        website: website,
        lat: lat,
        lon: lon
    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0.5, 500],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: "img/mark.png",
            scale: 0.1
        }))
    });

    iconFeature.setStyle(iconStyle);

    return iconFeature;
}

function makeMarker_2(lat, lon, name, website, imgsrc) {
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
        name: name,
        website: website,
        lat: lat,
        lon: lon
    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0.5, 500],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imgsrc,
            scale: 0.1
        }))
    });

    iconFeature.setStyle(iconStyle);

    return iconFeature;
}

function makeVectorLayer (markerArray) {
    var vectorSource = new ol.source.Vector({
        features: markerArray
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    return vectorLayer;
}
/*var markerArray = [];
markerArray.push(makeMarker(60.192059, 24.945831,  'kenttä: helsinki' +'\n'+ 'sää: pekka pouta', ''));
markerArray.push(makeMarker(50.192059, 24.945831,  'helsinki', ''));
markerArray.push(makeMarker(40.192059, 24.945831,  'helsinki', ''));
var vectorLayer = makeVectorLayer(markerArray);*/

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    },
    positioning: 'bottom-center',
    //stopEvent: false,
    offset: [0, -50]
});


/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};


//https://api.openrouteservice.org/directions?api_key=5b3ce3597851110001cf6248f52705feaa8f4427b566b518718b452d&coordinates=8.34234,48.23424%7C8.34423,48.26424&profile=driving-car&geometry_format=polyline

var markerLayer;

/**
 * Create the map.
 */
var map = new ol.Map({
    layers: [
        new ol.layer.Tile({  // MUUTA
            source: new ol.source.OSM()
        }),
        vectorLayer
    ],
    overlays: [overlay],
    target: 'map',
    view: new ol.View({
        center: ol.proj.transform([26, 65], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6
    })
});

/**
 * Add a click handler to the map to render the popup.
 */
/*map.on('dblclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
            return feature;
        });
    if (!feature) {
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
            '</code>';
        overlay.setPosition(coordinate)
    }
});*/

var element = document.getElementById('popup_marker');

var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50]
});
map.addOverlay(popup);
/*fetch("http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={6a91d7c0abb6707456280e0ce8dd8087}")                 // Käynnistetään haku. Vakiometodi on GET.
    .then(function(vastaus){        // Sitten kun haku on valmis,
        return vastaus.json();      // muutetaan ladattu tekstimuotoinen JSON JavaScript-olioksi
    }).then(function(json){         // Sitten otetaan ladattu data vastaan ja
    console.log(json);            // kutsutaan naytaKuva-funktiota ja lähetetään ladattu data siihen parametrinä.
}).catch(function(error){           // Jos tapahtuu virhe,
    console.log(error);             // kirjoitetaan virhe konsoliin.
})*/

//var address = "Multahaankuja 3";

function content_creator(feature, evt) {
    content.innerHTML = '<a target="_blank" href=\"' + feature.get('website') + '\">' + feature.get('name') + '</a>';
    fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + feature.get('lat') + '&lon=' + feature.get('lon') + '&APPID=aad7575441a6804bb37fbe37bbf698bf')                 // Käynnistetään haku. Vakiometodi on GET.
        .then(function(vastaus){        // Sitten kun haku on valmis,
            return vastaus.json();                  // muutetaan ladattu tekstimuotoinen JSON JavaScript-olioksi
        }).then(function(json){         // Sitten otetaan ladattu data vastaan ja
        weather_creator(json);                              // kutsutaan naytaKuva-funktiota ja lähetetään ladattu data siihen parametrinä.
    }).catch(function(error){               // Jos tapahtuu virhe,
        console.log(error);             // kirjoitetaan virhe konsoliin.
    });

    fetch("https://api.openrouteservice.org/directions?api_key=5b3ce3597851110001cf6248f52705feaa8f4427b566b518718b452d&coordinates=" + player_pos[1] + ',' + player_pos[0] + "%7C" + feature.get('lon') + ',' + feature.get('lat') + "&profile=driving-car&geometry_format=polyline")                 // Käynnistetään haku. Vakiometodi on GET.
        .then(function(vastaus){        // Sitten kun haku on valmis,
            return vastaus.json();      // muutetaan ladattu tekstimuotoinen JSON JavaScript-olioksi
        }).then(function(json){         // Sitten otetaan ladattu data vastaan ja
        draw_route(json, feature);            // kutsutaan naytaKuva-funktiota ja lähetetään ladattu data siihen parametrinä.
    }).catch(function(error){           // Jos tapahtuu virhe,
        console.log(error);             // kirjoitetaan virhe konsoliin.
    })

    /*var address = document.getElementById("address").value;
    console.log(address);

    fetch("https://nominatim.openstreetmap.org/search/" + address + "?format=json&addressdetails=1&limit=1&polygon_svg=1")                 // Käynnistetään haku. Vakiometodi on GET.
        .then(function(vastaus){        // Sitten kun haku on valmis,
            return vastaus.json();      // muutetaan ladattu tekstimuotoinen JSON JavaScript-olioksi
        }).then(function(json){         // Sitten otetaan ladattu data vastaan ja
        get_route_data(json, feature);            // kutsutaan naytaKuva-funktiota ja lähetetään ladattu data siihen parametrinä.
    }).catch(function(error){           // Jos tapahtuu virhe,
        console.log(error);             // kirjoitetaan virhe konsoliin.
    })*/
}

function get_route_data(json, feature) {
    fetch("https://api.openrouteservice.org/directions?api_key=5b3ce3597851110001cf6248f52705feaa8f4427b566b518718b452d&coordinates=" + json[0]['lon'] + ',' + json[0]['lat'] + "%7C" + feature.get('lon') + ',' + feature.get('lat') + "&profile=driving-car&geometry_format=polyline")                 // Käynnistetään haku. Vakiometodi on GET.
        .then(function(vastaus){        // Sitten kun haku on valmis,
            return vastaus.json();      // muutetaan ladattu tekstimuotoinen JSON JavaScript-olioksi
        }).then(function(json){         // Sitten otetaan ladattu data vastaan ja
        draw_route(json, feature);            // kutsutaan naytaKuva-funktiota ja lähetetään ladattu data siihen parametrinä.
    }).catch(function(error){           // Jos tapahtuu virhe,
        console.log(error);             // kirjoitetaan virhe konsoliin.
    })
}

function weather_creator(json) {    // 273.16
    console.log(json);
    const kelvin_conversion = 273.16;
    content.innerHTML = content.innerHTML + '<br>' + '<img src=http://openweathermap.org/img/w/' + json.weather[0].icon + '.png>';
    content.innerHTML = content.innerHTML + (parseFloat(json.main.temp) - kelvin_conversion).toFixed(1).toString() + ' °C, ';
    content.innerHTML = content.innerHTML + json.wind.speed + ' m/s';
}

map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
            return feature;
        });
    if (feature && feature.get('website') != 'empty') {
        var coordinates = feature.getGeometry().getCoordinates();
        overlay.setPosition(coordinates);
        content_creator(feature, evt);
    } else {
        map.removeLayer(markerLayer);
        map.removeLayer(vectorLayer_2);
        var coordinate = evt.coordinate;
        var coords = ol.proj.toLonLat(coordinate);
        var markerArray = [];
        markerArray.push(makeMarker_2(coords[1], coords[0],"aa", "empty", "img/userMark.png"));
        markerLayer = makeVectorLayer(markerArray);
        map.addLayer(markerLayer);
        player_pos[0] = coords[1];
        player_pos[1] = coords[0];

        overlay.setPosition(undefined);
    }
});

var vectorLayer_2;

function draw_route(json) {
    if (vectorLayer_2) {
        map.removeLayer(vectorLayer_2);
    }
    var locations = json.routes[0].geometry;
    console.log(json.routes[0].geometry);
    //var locations = [[53.44241609, 12], [53.44241894, 20], [53.44242156, 25] /* ... */ ];

    // OpenLayers uses [lon, lat], not [lat, lon] for coordinates
    /*locations.map(function(l) {
        return l.reverse();
    });*/

    var polyline = new ol.geom.LineString(locations);
    // Coordinates need to be in the view's projection, which is
    // 'EPSG:3857' if nothing else is configured for your ol.View instance
    polyline.transform('EPSG:4326', 'EPSG:3857');
    var feature = new ol.Feature(polyline);
    var source = new ol.source.Vector();
    source.addFeature(feature);

    vectorLayer_2 = new ol.layer.Vector({
        source: source
    });
    map.addLayer(vectorLayer_2);
}

// change mouse cursor when over marker
/*map.on('pointermove', function(e) {
    if (e.dragging) {
        $(element).popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});*/