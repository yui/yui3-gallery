'use strict';

var _loaded = false,

    _class;

_class = function (config) {
    _class.superclass.constructor.call(this, config);
};

_class.ATTRS = {
    container: {
        writeOnce: 'initOnly'
    },
    domNode: {
        readOnly: true
    },
    frame: {
        readOnly: true
    },
    parameters: {
        writeOnce: 'initOnly'
    }
};

_class.NAME = 'GoogleMapsFrame';

Y.extend(_class, Y.Base, {
    initializer: function () {
        this.publish('failure');
        this.publish('load', {
            fireOnce: true
        });
        this.publish('timeout');

        var frame = new Y.Frame({
            content: '<div id="map"></div>',
            extracss: 'body, html, #map {height: 100%; width: 100%;}'
        });

        frame.on('ready', function () {
            var iY = frame.getInstance(),
                me = this;

            iY.config.win.YUI = YUI;
            iY.use('gallery-google-maps-loader', 'node', function (iY) {
                var googleMapsLoader = iY.GoogleMapsLoader;

                googleMapsLoader.on('failure', function () {
                    this.fire('failure');
                }, me);
                googleMapsLoader.on('success', function () {
                    _loaded = true;
                    this.google = iY.config.win.google;
                    this.fire('load');
                }, me);
                googleMapsLoader.on('timeout', function () {
                    this.fire('timeout');
                }, me);
                googleMapsLoader.load(me.get('parameters'));

                me._set('domNode', iY.Node.getDOMNode(iY.one('#map')));
                me._set('frame', frame);
            });
        }, this);

        frame.render(this.get('container'));
    },
    isLoaded: function () {
        return _loaded;
    }
});

Y.GoogleMapsFrame = _class;