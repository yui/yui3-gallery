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
_yuitest_coverage["/build/gallery-google-maps-loader/gallery-google-maps-loader.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-google-maps-loader/gallery-google-maps-loader.js",
    code: []
};
_yuitest_coverage["/build/gallery-google-maps-loader/gallery-google-maps-loader.js"].code=["YUI.add('gallery-google-maps-loader', function(Y) {","","/**"," * @module gallery-google-maps-loader"," */","(function (Y, moduleName) {","    'use strict';","","    var _Base = Y.Base,","","        _isArray = Y.Lang.isArray,","        _stringify = Y.QueryString.stringify;","","    /**","     * @class GoogleMapsLoader","     * @constructor","     * @extends Base","     * @param {Object} config Configuration object.","     */","    Y.GoogleMapsLoader = _Base.create(moduleName, _Base, [], {","        initializer: function () {","            var me = this;","","            /**","             * Fired when JSONP fails.","             * @event failure","             */","            me.publish('failure');","","            /**","             * Fired when JSONP succeeds.","             * @event success","             * @fireOnce","             */","            me.publish('success', {","                fireOnce: true","            });","","            /**","             * Fired when JSONP times out.","             * @event timeout","             */","            me.publish('timeout');","        },","        /**","         * Loads the Google Maps JavaScript API through JSONP.  Does nothing if","         * this object has already loaded it.","         * @method load","         * @chainable","         * @param {Object} parameters An optional object with the following","         * optional properties:","         * <dl>","         *     <dt>","         *         client","         *     </dt>","         *     <dd>","         *         This is your client id when using Google Maps API for","         *         Business.","         *     </dd>","         *     <dt>","         *         language","         *     </dt>","         *     <dd>","         *         The language code to override the browser's default language.","         *     </dd>","         *     <dt>","         *         libraries","         *     </dt>","         *     <dd>","         *         An array or comma separated string of library names.","         *     </dd>","         *     <dt>","         *         key","         *     </dt>","         *     <dd>","         *         This is your Google Maps v3 API key.","         *     </dd>","         *     <dt>","         *         region","         *     </dt>","         *     <dd>","         *         A Unicode region subtag identifier to override the default","         *         region.","         *     </dd>","         *     <dt>","         *         sensor","         *     </dt>","         *     <dd>","         *         Set this to a truthy value if your application determines the","         *         user's location via a sensor.","         *     </dd>","         *     <dt>","         *         source","         *     </dt>","         *     <dd>","         *         Location of the Google Maps JavaScript API to override the","         *         attribute.","         *     </dd>","         *     <dt>","         *         timeout","         *     </dt>","         *     <dd>","         *         Timeout in milliseconds to override the attribute.","         *     </dd>","         *     <dt>","         *         version","         *     </dt>","         *     <dd>","         *         The version of the Google Maps JavaScript API to load.","         *     </dd>","         * </dl>","         * If other properties not listed here are included in the parameters","         * object, they will also be included the the Google Maps API request.","         */","        load: function (parameters) {","            parameters = parameters || {};","","            var me = this,","","                libraries = parameters.libraries,","                timeout = parameters.timeout || me.get('timeout'),","                url = parameters.source || me.get('source');","","            if (me.get('loaded')) {","                return me;","            }","","            if (_isArray(libraries)) {","                parameters.libraries = libraries.join(',');","            }","","            parameters.sensor = parameters.sensor ? 'true' : 'false';","            parameters.v = parameters.v || parameters.version;","","            delete parameters.callback;","            delete parameters.source;","            delete parameters.timeout;","            delete parameters.version;","","            if (url.indexOf('?') === -1) {","                url += '?';","            }","","            Y.jsonp(url + _stringify(parameters) + '&callback={callback}', {","                on: {","                    failure: function () {","                        me.fire('failure');","                    },","                    success: function () {","                        me._set('loaded', true);","                        me.fire('success');","                    },","                    timeout: function () {","                        me.fire('timeout');","                    }","                },","                timeout: timeout","            });","","            return me;","        }","    }, {","        ATTRS: {","            /**","             * @attribute loaded","             * @default false","             * @readOnly","             * @type Boolean","             */","            loaded: {","                readOnly: true,","                value: false","            },","            /**","             * The location of the Google Maps JavaScrpt API.","             * @attribute source","             * @default 'http://maps.google.com/maps/api/js'","             * @type String","             */","            source: {","                value: 'http://maps.google.com/maps/api/js'","            },","            /**","             * The timeout in milliseconds used by JSONP.","             * @attribute timeout","             * @default 30000","             * @type Number","             */","            timeout: {","                value: 30000","            }","        }","    });","}(Y, arguments[1]));","","","}, 'gallery-2012.09.05-20-01' ,{requires:['base', 'jsonp', 'querystring-stringify'], skinnable:false});"];
_yuitest_coverage["/build/gallery-google-maps-loader/gallery-google-maps-loader.js"].lines = {"1":0,"6":0,"7":0,"9":0,"20":0,"22":0,"28":0,"35":0,"43":0,"116":0,"118":0,"124":0,"125":0,"128":0,"129":0,"132":0,"133":0,"135":0,"136":0,"137":0,"138":0,"140":0,"141":0,"144":0,"147":0,"150":0,"151":0,"154":0,"160":0};
_yuitest_coverage["/build/gallery-google-maps-loader/gallery-google-maps-loader.js"].functions = {"initializer:21":0,"failure:146":0,"success:149":0,"timeout:153":0,"load:115":0,"(anonymous 2):6":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-google-maps-loader/gallery-google-maps-loader.js"].coveredLines = 29;
_yuitest_coverage["/build/gallery-google-maps-loader/gallery-google-maps-loader.js"].coveredFunctions = 7;
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 1);
YUI.add('gallery-google-maps-loader', function(Y) {

/**
 * @module gallery-google-maps-loader
 */
_yuitest_coverfunc("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 6);
(function (Y, moduleName) {
    _yuitest_coverfunc("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", "(anonymous 2)", 6);
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 7);
'use strict';

    _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 9);
var _Base = Y.Base,

        _isArray = Y.Lang.isArray,
        _stringify = Y.QueryString.stringify;

    /**
     * @class GoogleMapsLoader
     * @constructor
     * @extends Base
     * @param {Object} config Configuration object.
     */
    _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 20);
Y.GoogleMapsLoader = _Base.create(moduleName, _Base, [], {
        initializer: function () {
            _yuitest_coverfunc("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", "initializer", 21);
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 22);
var me = this;

            /**
             * Fired when JSONP fails.
             * @event failure
             */
            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 28);
me.publish('failure');

            /**
             * Fired when JSONP succeeds.
             * @event success
             * @fireOnce
             */
            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 35);
me.publish('success', {
                fireOnce: true
            });

            /**
             * Fired when JSONP times out.
             * @event timeout
             */
            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 43);
me.publish('timeout');
        },
        /**
         * Loads the Google Maps JavaScript API through JSONP.  Does nothing if
         * this object has already loaded it.
         * @method load
         * @chainable
         * @param {Object} parameters An optional object with the following
         * optional properties:
         * <dl>
         *     <dt>
         *         client
         *     </dt>
         *     <dd>
         *         This is your client id when using Google Maps API for
         *         Business.
         *     </dd>
         *     <dt>
         *         language
         *     </dt>
         *     <dd>
         *         The language code to override the browser's default language.
         *     </dd>
         *     <dt>
         *         libraries
         *     </dt>
         *     <dd>
         *         An array or comma separated string of library names.
         *     </dd>
         *     <dt>
         *         key
         *     </dt>
         *     <dd>
         *         This is your Google Maps v3 API key.
         *     </dd>
         *     <dt>
         *         region
         *     </dt>
         *     <dd>
         *         A Unicode region subtag identifier to override the default
         *         region.
         *     </dd>
         *     <dt>
         *         sensor
         *     </dt>
         *     <dd>
         *         Set this to a truthy value if your application determines the
         *         user's location via a sensor.
         *     </dd>
         *     <dt>
         *         source
         *     </dt>
         *     <dd>
         *         Location of the Google Maps JavaScript API to override the
         *         attribute.
         *     </dd>
         *     <dt>
         *         timeout
         *     </dt>
         *     <dd>
         *         Timeout in milliseconds to override the attribute.
         *     </dd>
         *     <dt>
         *         version
         *     </dt>
         *     <dd>
         *         The version of the Google Maps JavaScript API to load.
         *     </dd>
         * </dl>
         * If other properties not listed here are included in the parameters
         * object, they will also be included the the Google Maps API request.
         */
        load: function (parameters) {
            _yuitest_coverfunc("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", "load", 115);
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 116);
parameters = parameters || {};

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 118);
var me = this,

                libraries = parameters.libraries,
                timeout = parameters.timeout || me.get('timeout'),
                url = parameters.source || me.get('source');

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 124);
if (me.get('loaded')) {
                _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 125);
return me;
            }

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 128);
if (_isArray(libraries)) {
                _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 129);
parameters.libraries = libraries.join(',');
            }

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 132);
parameters.sensor = parameters.sensor ? 'true' : 'false';
            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 133);
parameters.v = parameters.v || parameters.version;

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 135);
delete parameters.callback;
            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 136);
delete parameters.source;
            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 137);
delete parameters.timeout;
            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 138);
delete parameters.version;

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 140);
if (url.indexOf('?') === -1) {
                _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 141);
url += '?';
            }

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 144);
Y.jsonp(url + _stringify(parameters) + '&callback={callback}', {
                on: {
                    failure: function () {
                        _yuitest_coverfunc("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", "failure", 146);
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 147);
me.fire('failure');
                    },
                    success: function () {
                        _yuitest_coverfunc("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", "success", 149);
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 150);
me._set('loaded', true);
                        _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 151);
me.fire('success');
                    },
                    timeout: function () {
                        _yuitest_coverfunc("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", "timeout", 153);
_yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 154);
me.fire('timeout');
                    }
                },
                timeout: timeout
            });

            _yuitest_coverline("/build/gallery-google-maps-loader/gallery-google-maps-loader.js", 160);
return me;
        }
    }, {
        ATTRS: {
            /**
             * @attribute loaded
             * @default false
             * @readOnly
             * @type Boolean
             */
            loaded: {
                readOnly: true,
                value: false
            },
            /**
             * The location of the Google Maps JavaScrpt API.
             * @attribute source
             * @default 'http://maps.google.com/maps/api/js'
             * @type String
             */
            source: {
                value: 'http://maps.google.com/maps/api/js'
            },
            /**
             * The timeout in milliseconds used by JSONP.
             * @attribute timeout
             * @default 30000
             * @type Number
             */
            timeout: {
                value: 30000
            }
        }
    });
}(Y, arguments[1]));


}, 'gallery-2012.09.05-20-01' ,{requires:['base', 'jsonp', 'querystring-stringify'], skinnable:false});
