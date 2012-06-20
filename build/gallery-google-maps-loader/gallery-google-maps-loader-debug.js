YUI.add('gallery-google-maps-loader', function(Y) {

/**
 * @module gallery-google-maps-loader
 */
(function (Y, moduleName) {
    'use strict';

    var _Base = Y.Base,
    
        _isArray = Y.Lang.isArray;

    /**
     * @class GoogleMapsLoader
     * @constructor
     * @extends Base
     * @param {Object} config Configuration object.
     */
    Y.GoogleMapsLoader = _Base.create(moduleName, _Base, [], {
        initializer: function () {
            var me = this;
            
            /**
             * Fired when JSONP fails.
             * @event failure
             */
            me.publish('failure');
            
            /**
             * Fired when JSONP succeeds.
             * @event success
             * @fireOnce
             */
            me.publish('success', {
                fireOnce: true
            });
            
            /**
             * Fired when JSONP times out.
             * @event timeout
             */
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
         *         Location of the Google Maps JavaScript API to override the attribute.
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
         */
        load: function (parameters) {
            var me = this;
            
            if (me.get('loaded')) {
                return me;
            }

            parameters = parameters || {};

            var language = parameters.language,
                libraries = parameters.libraries,
                region = parameters.region,
                sensor = parameters.sensor,
                timeout = parameters.timeout || me.get('timeout'),
                url = (parameters.source || me.get('source')) + '?callback={callback}',
                version = parameters.version;

            if (language) {
                url += '&language=' + language;
            }

            if (libraries) {
                if (_isArray(libraries)) {
                    libraries = libraries.join(',');
                }

                url += '&libraries=' + libraries;
            }

            if (region) {
                url += '&region=' + region;
            }

            url += '&sensor=' + (sensor ? 'true' : 'false');

            if (version) {
                url += '&v=' + version;
            }

            Y.jsonp(url, {
                on: {
                    failure: function () {
                        me.fire('failure');
                    },
                    success: function () {
                        me._set('loaded', true);
                        me.fire('success');
                    },
                    timeout: function () {
                        me.fire('timeout');
                    }
                },
                timeout: timeout
            });
            
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


}, 'gallery-2012.06.20-20-07' ,{requires:['base', 'jsonp'], skinnable:false});
