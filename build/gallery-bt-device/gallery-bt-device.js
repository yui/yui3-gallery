YUI.add('gallery-bt-device', function(Y) {

/*global screen */
/**
 * Provide information about browser and device by Y.UA.
 *
 * @module gallery-bt-device
 * @static
 */

/**
 * The Y.Bottle.Device class is static, and provides device information
 *
 * @class Device
 * @namespace Bottle
 */
var Device = {

    /**
     * The name of current device, should be: iphone , ipad, ipod, android, null
     * @static
     * @type string
     * @property Name
     */
    Name: null,

    /**
     * The name of current OS, should be: Android, Apple, null
     * @static
     * @type string
     * @property OS
     */
    OS: null,

    /**
     * The version of current OS
     * @static
     * @type string
     * @property OS_Version
     */
    OS_Version: 0,

    /**
     * The name of current browser, will be: webkit, ie, safari, firefox, chrome
     * @static
     * @type string
     * @property Browser
     */
    Borwser: null,

    /**
     * get current Device Width in pixel
     * @static
     * @method getDeviceWidth
     * @return {Number} an integer
     */
    getDeviceWidth: function () { return screen.width; },

    /**
     * get current Device Height in pixel
     * @static
     * @method getDeviceHeight
     * @return {Number} an integer
     */
    getDeviceHeight: function () {
        return screen.height;
    },

    /**
     * get current Browser Width in pixel
     * @static
     * @method getBrowserWidth
     * @return {Number} an integer
     */
    getBrowserWidth: function () {
        return window.innerWidth;
    },

    /**
     * get current Browser Height in pixel
     * @static
     * @method getBrowserHeight
     * @return {Number} an integer
     */
    getBrowserHeight: function () {
        return window.innerHeight;
    }
};

//init data
if (Y.UA.iphone) {
    Device.Name = 'iphone';
    Device.OS = 'Apple';
    Device.OS_Version = Y.UA.iphone;
    Device.Browser = 'safari';
    Device.B_Version = Y.UA.safari;
} else if (Y.UA.ipad) {
    Device.Name = 'ipad';
    Device.OS = 'Apple';
    Device.OS_Version = Y.UA.ipad;
    Device.Browser = 'safari';
    Device.B_Version = Y.UA.safari;
} else if (Y.UA.ipod) {
    Device.Name = 'ipad';
    Device.OS = 'Apple';
    Device.OS_Version = Y.UA.ipod;
    Device.Browser = 'safari';
    Device.B_Version = Y.UA.safari;
} else if (Y.UA.mobile === 'Android') {
    Device.Name = 'android';
    Device.OS = 'android';
    Device.OS_Version = Y.UA.android;
    Device.Browser = 'webkit';
    Device.B_Version = Y.UA.webkit;
} else if (Y.UA.ie) {
    Device.Browser = 'ie';
    Device.B_Version = Y.UA.ie;
} else if (Y.UA.gecko) {
    Device.Browser = 'firefox';
    Device.B_Version = Y.UA.gecko;
} else if (Y.UA.chrome) {
    Device.Browser = 'chrome';
    Device.B_Version = 'chrome';
}

Y.namespace('Bottle').Device = Device;


}, '@VERSION@' ,{requires:['node-base']});
