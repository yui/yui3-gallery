if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-device/gallery-bt-device.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].code=["YUI.add('gallery-bt-device', function(Y) {","","/*global screen */","/**"," * Provide information about browser and device by Y.UA."," *"," * @module gallery-bt-device"," * @static"," */","","/**"," * The Y.Bottle.Device class is static, and provides device information"," *"," * @class Device"," * @namespace Bottle"," */","var Device = {","","    /**","     * The name of current device, should be: iphone , ipad, ipod, android, null","     * @static","     * @type string","     * @property Name","     */","    Name: null,","","    /**","     * The name of current OS, should be: Android, Apple, null","     * @static","     * @type string","     * @property OS","     */","    OS: null,","","    /**","     * The version of current OS","     * @static","     * @type string","     * @property OS_Version","     */","    OS_Version: 0,","","    /**","     * The name of current browser, will be: webkit, ie, safari, firefox, chrome","     * @static","     * @type string","     * @property Browser","     */","    Borwser: null,","","    /**","     * get current Device Width in pixel","     * @static","     * @method getDeviceWidth","     * @return {Number} an integer","     */","    getDeviceWidth: function () { return screen.width; },","","    /**","     * get current Device Height in pixel","     * @static","     * @method getDeviceHeight","     * @return {Number} an integer","     */","    getDeviceHeight: function () {","        return screen.height;","    },","","    /**","     * get current Browser Width in pixel","     * @static","     * @method getBrowserWidth","     * @return {Number} an integer","     */","    getBrowserWidth: function () {","        return window.innerWidth;","    },","","    /**","     * get current Browser Height in pixel","     * @static","     * @method getBrowserHeight","     * @return {Number} an integer","     */","    getBrowserHeight: function () {","        return window.innerHeight;","    }","};","","//init data","if (Y.UA.iphone) {","    Device.Name = 'iphone';","    Device.OS = 'Apple';","    Device.OS_Version = Y.UA.iphone;","    Device.Browser = 'safari';","    Device.B_Version = Y.UA.safari;","} else if (Y.UA.ipad) {","    Device.Name = 'ipad';","    Device.OS = 'Apple';","    Device.OS_Version = Y.UA.ipad;","    Device.Browser = 'safari';","    Device.B_Version = Y.UA.safari;","} else if (Y.UA.ipod) {","    Device.Name = 'ipad';","    Device.OS = 'Apple';","    Device.OS_Version = Y.UA.ipod;","    Device.Browser = 'safari';","    Device.B_Version = Y.UA.safari;","} else if (Y.UA.mobile === 'Android') {","    Device.Name = 'android';","    Device.OS = 'android';","    Device.OS_Version = Y.UA.android;","    Device.Browser = 'webkit';","    Device.B_Version = Y.UA.webkit;","} else if (Y.UA.ie) {","    Device.Browser = 'ie';","    Device.B_Version = Y.UA.ie;","} else if (Y.UA.gecko) {","    Device.Browser = 'firefox';","    Device.B_Version = Y.UA.gecko;","} else if (Y.UA.chrome) {","    Device.Browser = 'chrome';","    Device.B_Version = 'chrome';","}","","Y.namespace('Bottle').Device = Device;","","","}, '@VERSION@' ,{requires:['node-base']});"];
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].lines = {"1":0,"17":0,"57":0,"66":0,"76":0,"86":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"100":0,"101":0,"102":0,"103":0,"104":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"119":0,"120":0,"121":0,"122":0,"123":0,"126":0};
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].functions = {"getDeviceWidth:57":0,"getDeviceHeight:65":0,"getBrowserWidth:75":0,"getBrowserHeight:85":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].coveredLines = 40;
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].coveredFunctions = 5;
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 1);
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
_yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 17);
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
    getDeviceWidth: function () { _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getDeviceWidth", 57);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 57);
return screen.width; },

    /**
     * get current Device Height in pixel
     * @static
     * @method getDeviceHeight
     * @return {Number} an integer
     */
    getDeviceHeight: function () {
        _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getDeviceHeight", 65);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 66);
return screen.height;
    },

    /**
     * get current Browser Width in pixel
     * @static
     * @method getBrowserWidth
     * @return {Number} an integer
     */
    getBrowserWidth: function () {
        _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getBrowserWidth", 75);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 76);
return window.innerWidth;
    },

    /**
     * get current Browser Height in pixel
     * @static
     * @method getBrowserHeight
     * @return {Number} an integer
     */
    getBrowserHeight: function () {
        _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getBrowserHeight", 85);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 86);
return window.innerHeight;
    }
};

//init data
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 91);
if (Y.UA.iphone) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 92);
Device.Name = 'iphone';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 93);
Device.OS = 'Apple';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 94);
Device.OS_Version = Y.UA.iphone;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 95);
Device.Browser = 'safari';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 96);
Device.B_Version = Y.UA.safari;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 97);
if (Y.UA.ipad) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 98);
Device.Name = 'ipad';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 99);
Device.OS = 'Apple';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 100);
Device.OS_Version = Y.UA.ipad;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 101);
Device.Browser = 'safari';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 102);
Device.B_Version = Y.UA.safari;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 103);
if (Y.UA.ipod) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 104);
Device.Name = 'ipad';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 105);
Device.OS = 'Apple';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 106);
Device.OS_Version = Y.UA.ipod;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 107);
Device.Browser = 'safari';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 108);
Device.B_Version = Y.UA.safari;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 109);
if (Y.UA.mobile === 'Android') {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 110);
Device.Name = 'android';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 111);
Device.OS = 'android';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 112);
Device.OS_Version = Y.UA.android;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 113);
Device.Browser = 'webkit';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 114);
Device.B_Version = Y.UA.webkit;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 115);
if (Y.UA.ie) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 116);
Device.Browser = 'ie';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 117);
Device.B_Version = Y.UA.ie;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 118);
if (Y.UA.gecko) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 119);
Device.Browser = 'firefox';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 120);
Device.B_Version = Y.UA.gecko;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 121);
if (Y.UA.chrome) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 122);
Device.Browser = 'chrome';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 123);
Device.B_Version = 'chrome';
}}}}}}}

_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 126);
Y.namespace('Bottle').Device = Device;


}, '@VERSION@' ,{requires:['node-base']});
