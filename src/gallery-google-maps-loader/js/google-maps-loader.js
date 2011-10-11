'use strict';

var _loaded = false,

    _class;

_class = function (config) {
    _class.superclass.constructor.call(this, config);
};

_class.ATTRS = {
    source: {
        value: 'http://maps.google.com/maps/api/js'
    },
    timeout: {
        value: 30000
    }
};

_class.NAME = 'GoogleMapsLoader';

Y.extend(_class, Y.Base, {
    initializer: function () {
        this.publish('failure');
        this.publish('success', {
            fireOnce: true
        });
        this.publish('timeout');
    },
    isLoaded: function () {
        return _loaded;
    },
    load: function (parameters) {
        if (_loaded) {
            return;
        }

        if (!parameters) {
            parameters = {};
        }
        
        var language = parameters.language,
            libraries = parameters.libraries,
            region = parameters.region,
            sensor = parameters.sensor,
            timeout = parameters.timeout || this.get('timeout'),
            url = (parameters.source || this.get('source')) + '?callback={callback}',
            version = parameters.version;

        if (language) {
            url += '&language=' + language;
        }

        if (libraries) {
            if (Y.Lang.isArray(libraries)) {
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
            context: this,
            on: {
                failure: function () {
                    this.fire('failure');
                },
                success: function () {
                    _loaded = true;
                    this.fire('success');
                },
                timeout: function () {
                    this.fire('timeout');
                }
            },
            timeout: timeout
        });
    }
});

Y.GoogleMapsLoader = new _class();