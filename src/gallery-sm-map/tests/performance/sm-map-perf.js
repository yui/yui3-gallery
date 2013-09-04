/*jshint node:true */

global.YUI = require('../../../../yui/build/yui/yui').YUI;
require('../../../../build/gallery-sm-map/gallery-sm-map');

var Y = global.Y = YUI().use('gallery-sm-map');

function fillMap(map, entryCount) {
    for (var i = 0; i < entryCount; ++i) {
        map.set({}, i);
    }

    return map;
}

global.fillMap      = fillMap;
global.uniqueSuffix = 0;

module.exports = {
    name: 'Y.Map',

    tests: {
        'Create an instance': function () {
            global.result = new Y.Map();
        },

        'Set an entry with a string key': {
            setup: function () {
                var map = new Y.Map();
            },

            fn: function () {
                global.result = map.set('foo' + (global.uniqueSuffix += 1), 'bar');
            }
        },

        'Set an entry with an object key': {
            setup: function () {
                var map = new Y.Map();
            },

            fn: function () {
                global.result = map.set({}, 'bar');
            }
        },

        'Set an entry with an object key (autoStamp enabled)': {
            setup: function () {
                var map = new Y.Map({autoStamp: true});
            },

            fn: function () {
                global.result = map.set({}, 'bar');
            }
        },

        'Get a string key from a 500-entry map': {
            setup: function () {
                var map = fillMap(new Y.Map(), 499);
                map.set('key', 'value');
            },

            fn: function () {
                global.result = map.get('key');
            }
        },

        'Get an object key from a 500-entry map (best-case)': {
            setup: function () {
                var key = {},
                    map = new Y.Map([[key, 'value']]);

                fillMap(map, 499);
            },

            fn: function () {
                global.result = map.get(key);
            }
        },

        'Get an object key from a 500-entry map (worst-case)': {
            setup: function () {
                var key = {},
                    map = new Y.Map();

                fillMap(map, 499);
                map.set(key, 'value');
            },

            fn: function () {
                global.result = map.get(key);
            }
        },

        'Get an object key from a 500-entry map (worst-case, autoStamp enabled)': {
            setup: function () {
                var key = {},
                    map = new Y.Map({autoStamp: true});

                fillMap(map, 499);
                map.set(key, 'value');
            },

            fn: function () {
                global.result = map.get(key);
            }
        }
    }
};
