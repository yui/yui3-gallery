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
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].code=["YUI.add('gallery-bt-device', function(Y) {","","/*global screen */","/**"," * Provide information about browser and device by Y.UA."," *"," * @module gallery-bt-device"," * @static"," */","","/**"," * The Y.Bottle.Device class is static, and provides device information"," *"," * @class Device"," * @namespace Bottle"," */","var positionFixedSupport = null,","","    Device = {","","    /**","     * The name of current device, should be: iphone , ipad, ipod, android, null","     * @static","     * @type string","     * @property Name","     */","    Name: null,","","    /**","     * The name of current OS, should be: Android, Apple, null","     * @static","     * @type string","     * @property OS","     */","    OS: null,","","    /**","     * The version of current OS","     * @static","     * @type string","     * @property OS_Version","     */","    OS_Version: 0,","","    /**","     * The name of current browser, will be: webkit, ie, safari, firefox, chrome","     * @static","     * @type string","     * @property Browser","     */","    Borwser: null,","","    /**","     * get current Device touch support status","     * @static","     * @method getTouchSupport","     * @return {Boolean}","     */","    getTouchSupport: function () { return ((Y.config.win && ('ontouchstart' in Y.config.win)) && !(Y.UA.chrome && Y.UA.chrome < 6))},","","    /**","     * get current Device touch support status","     * @static","     * @method getTouchSupport","     * @return {Boolean}","     */","    getPositionFixedSupport: function () {","        var positionFixedParent,","            py;","        if (positionFixedSupport !== null) {","            return positionFixedSupport;","        }","        ","        positionFixedParent = Y.one('.bt_posfixed') || Y.one('body').appendChild('<div class=\"bt_posfixed\"><div><span></span></div></div>');","        py = positionFixedParent.one('div').set('scrollTop', '30px').one('span').getY();","        positionFixedParent.remove();","","        return positionFixedSupport = (py === 1);","    },","","    /**","     * get current Device Width in pixel","     * @static","     * @method getDeviceWidth","     * @return {Number} an integer","     */","    getDeviceWidth: function () { return screen.width; },","","    /**","     * get current Device Height in pixel","     * @static","     * @method getDeviceHeight","     * @return {Number} an integer","     */","    getDeviceHeight: function () {","        return screen.height;","    },","","    /**","     * get current Browser Width in pixel","     * @static","     * @method getBrowserWidth","     * @return {Number} an integer","     */","    getBrowserWidth: function () {","        return window.innerWidth;","    },","","    /**","     * get current Browser Height in pixel","     * @static","     * @method getBrowserHeight","     * @return {Number} an integer","     */","    getBrowserHeight: function () {","        return window.innerHeight;","    }","};","","//init data","if (Y.UA.iphone) {","    Device.Name = 'iphone';","    Device.OS = 'Apple';","    Device.OS_Version = Y.UA.iphone;","    Device.Browser = 'safari';","    Device.B_Version = Y.UA.safari;","} else if (Y.UA.ipad) {","    Device.Name = 'ipad';","    Device.OS = 'Apple';","    Device.OS_Version = Y.UA.ipad;","    Device.Browser = 'safari';","    Device.B_Version = Y.UA.safari;","} else if (Y.UA.ipod) {","    Device.Name = 'ipad';","    Device.OS = 'Apple';","    Device.OS_Version = Y.UA.ipod;","    Device.Browser = 'safari';","    Device.B_Version = Y.UA.safari;","} else if (Y.UA.mobile === 'Android') {","    Device.Name = 'android';","    Device.OS = 'android';","    Device.OS_Version = Y.UA.android;","    Device.Browser = 'webkit';","    Device.B_Version = Y.UA.webkit;","} else if (Y.UA.ie) {","    Device.Browser = 'ie';","    Device.B_Version = Y.UA.ie;","} else if (Y.UA.gecko) {","    Device.Browser = 'firefox';","    Device.B_Version = Y.UA.gecko;","} else if (Y.UA.chrome) {","    Device.Browser = 'chrome';","    Device.B_Version = 'chrome';","}","","Y.namespace('Bottle').Device = Device;","","","}, '@VERSION@' ,{requires:['node-screen']});"];
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].lines = {"1":0,"17":0,"59":0,"68":0,"70":0,"71":0,"74":0,"75":0,"76":0,"78":0,"87":0,"96":0,"106":0,"116":0,"121":0,"122":0,"123":0,"124":0,"125":0,"126":0,"127":0,"128":0,"129":0,"130":0,"131":0,"132":0,"133":0,"134":0,"135":0,"136":0,"137":0,"138":0,"139":0,"140":0,"141":0,"142":0,"143":0,"144":0,"145":0,"146":0,"147":0,"148":0,"149":0,"150":0,"151":0,"152":0,"153":0,"156":0};
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].functions = {"getTouchSupport:59":0,"getPositionFixedSupport:67":0,"getDeviceWidth:87":0,"getDeviceHeight:95":0,"getBrowserWidth:105":0,"getBrowserHeight:115":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].coveredLines = 48;
_yuitest_coverage["/build/gallery-bt-device/gallery-bt-device.js"].coveredFunctions = 7;
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
var positionFixedSupport = null,

    Device = {

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
     * get current Device touch support status
     * @static
     * @method getTouchSupport
     * @return {Boolean}
     */
    getTouchSupport: function () { _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getTouchSupport", 59);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 59);
return ((Y.config.win && ('ontouchstart' in Y.config.win)) && !(Y.UA.chrome && Y.UA.chrome < 6))},

    /**
     * get current Device touch support status
     * @static
     * @method getTouchSupport
     * @return {Boolean}
     */
    getPositionFixedSupport: function () {
        _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getPositionFixedSupport", 67);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 68);
var positionFixedParent,
            py;
        _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 70);
if (positionFixedSupport !== null) {
            _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 71);
return positionFixedSupport;
        }
        
        _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 74);
positionFixedParent = Y.one('.bt_posfixed') || Y.one('body').appendChild('<div class="bt_posfixed"><div><span></span></div></div>');
        _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 75);
py = positionFixedParent.one('div').set('scrollTop', '30px').one('span').getY();
        _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 76);
positionFixedParent.remove();

        _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 78);
return positionFixedSupport = (py === 1);
    },

    /**
     * get current Device Width in pixel
     * @static
     * @method getDeviceWidth
     * @return {Number} an integer
     */
    getDeviceWidth: function () { _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getDeviceWidth", 87);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 87);
return screen.width; },

    /**
     * get current Device Height in pixel
     * @static
     * @method getDeviceHeight
     * @return {Number} an integer
     */
    getDeviceHeight: function () {
        _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getDeviceHeight", 95);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 96);
return screen.height;
    },

    /**
     * get current Browser Width in pixel
     * @static
     * @method getBrowserWidth
     * @return {Number} an integer
     */
    getBrowserWidth: function () {
        _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getBrowserWidth", 105);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 106);
return window.innerWidth;
    },

    /**
     * get current Browser Height in pixel
     * @static
     * @method getBrowserHeight
     * @return {Number} an integer
     */
    getBrowserHeight: function () {
        _yuitest_coverfunc("/build/gallery-bt-device/gallery-bt-device.js", "getBrowserHeight", 115);
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 116);
return window.innerHeight;
    }
};

//init data
_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 121);
if (Y.UA.iphone) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 122);
Device.Name = 'iphone';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 123);
Device.OS = 'Apple';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 124);
Device.OS_Version = Y.UA.iphone;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 125);
Device.Browser = 'safari';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 126);
Device.B_Version = Y.UA.safari;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 127);
if (Y.UA.ipad) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 128);
Device.Name = 'ipad';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 129);
Device.OS = 'Apple';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 130);
Device.OS_Version = Y.UA.ipad;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 131);
Device.Browser = 'safari';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 132);
Device.B_Version = Y.UA.safari;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 133);
if (Y.UA.ipod) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 134);
Device.Name = 'ipad';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 135);
Device.OS = 'Apple';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 136);
Device.OS_Version = Y.UA.ipod;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 137);
Device.Browser = 'safari';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 138);
Device.B_Version = Y.UA.safari;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 139);
if (Y.UA.mobile === 'Android') {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 140);
Device.Name = 'android';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 141);
Device.OS = 'android';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 142);
Device.OS_Version = Y.UA.android;
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 143);
Device.Browser = 'webkit';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 144);
Device.B_Version = Y.UA.webkit;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 145);
if (Y.UA.ie) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 146);
Device.Browser = 'ie';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 147);
Device.B_Version = Y.UA.ie;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 148);
if (Y.UA.gecko) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 149);
Device.Browser = 'firefox';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 150);
Device.B_Version = Y.UA.gecko;
} else {_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 151);
if (Y.UA.chrome) {
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 152);
Device.Browser = 'chrome';
    _yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 153);
Device.B_Version = 'chrome';
}}}}}}}

_yuitest_coverline("/build/gallery-bt-device/gallery-bt-device.js", 156);
Y.namespace('Bottle').Device = Device;


}, '@VERSION@' ,{requires:['node-screen']});
