/*global YUI*/
//select * from geo.places where woeid in (select place.woeid from flickr.places where (lat,lon) in(select latitude,longitude from ip.location where ip="209.131.62.113"))
/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 * Written by Nicholas C. Zakas, nczonline.net
 */
 
var IP_URL  = "http://www.geoplugin.net/json.gp?jsoncallback=";

/**
 * Geolocation API
 * @module gallery-geo
 */
 
/*(intentionally not documented)
 * Tries to get the current position by using the native geolocation API.
 * If the user denies permission, then no further attempt is made to get
 * the location. If an error occurs, then an attempt is made to get the
 * location information by IP address.
 * @param callback {Function} The callback function to call when the
 *      request is complete. The object passed into the request has
 *      four properties: success (true/false), coords (an object), 
 *      timestamp, and source ("native" or "geoplugin").
 * @param scope {Object} (Optional) The this value for the callback function.
 */
function getCurrentPositionByAPI(callback, scope){
    navigator.geolocation.getCurrentPosition(
        function(data){
            callback.call(scope, {
                success: true,
                coords: {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude,
                    accuracy: data.coords.accuracy,
                    altitude: data.coords.altitude,
                    altitudeAccuracy: data.coords.altitudeAccuracy,
                    heading: data.coords.heading,
                    speed: data.coords.speed
                },
                timestamp: data.timestamp,
                source: "native"
            });
        }, 
        function(error){
            if (error.code == 1) {  //user denied permission, so don't do anything
                callback.call(scope, { success: false, denied: true });
            } else {    //try Geo IP Lookup instead
                getCurrentPositionByGeoIp(callback,scope);        
            }
        }
    );
}

/*(intentionally not documented)
 * Tries to get the current position by using the IP address.
 * @param callback {Function} The callback function to call when the
 *      request is complete. The object passed into the request has
 *      four properties: success (true/false), coords (an object), 
 *      timestamp, and source ("native" or "geoplugin").
 * @param scope {Object} (Optional) The this value for the callback function.
 */
function getCurrentPositionByGeoIP(callback, scope){

    //Try to get by IP address
    Y.jsonp(IP_URL, {
        format: function(url, proxy){
            return url + proxy;
        },
        on: {
            success: function(response){
                callback.call(scope, {
                    success: true,
                    coords: {
                        latitude: parseFloat(response.geoplugin_latitude),
                        longitude: parseFloat(response.geoplugin_longitude),
                        accuracy: Infinity    //TODO: Figure out better value
                    },
                    timestamp: +new Date(),
                    source: "geoplugin"
                });                
            },
            failure: function(){
                callback.call(scope, { success: false });
            }
        }
    });

}

/**
 * Geolocation API
 * @class Geo
 * @static
 */
Y.Geo = {
    
    /**
     * Get the current position. This tries to use the native geolocation
     * API if available. Otherwise it uses the GeoPlugin site to do an
     * IP address lookup.
     * @param callback {Function} The callback function to call when the
     *      request is complete. The object passed into the request has
     *      four properties: success (true/false), coords (an object), 
     *      timestamp, and source ("native" or "geoplugin").
     * @param scope {Object} (Optional) The this value for the callback function.     
     */
    getCurrentPosition: navigator.geolocation ?
        getCurrentPositionByAPI :
        getCurrentPositionByGeoIP

};