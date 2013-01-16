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
_yuitest_coverage["build/gallery-storage-lite/gallery-storage-lite.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-storage-lite/gallery-storage-lite.js",
    code: []
};
_yuitest_coverage["build/gallery-storage-lite/gallery-storage-lite.js"].code=["YUI.add('gallery-storage-lite', function (Y, NAME) {","","/*global YUI */","/*jslint onevar: true, browser: true, undef: true, bitwise: true, regexp: true, newcap: true, immed: true */","","/**"," * Implements a persistent local key/value data store similar to HTML5's"," * localStorage. Should work in IE5+, Firefox 2+, Safari 3.1+, Chrome 4+, and"," * Opera 10.5+."," *"," * @module gallery-storage-lite"," */","","// -- Shorthand ----------------------------------------------------------------","var d           = Y.config.doc,","    w           = Y.config.win,","    JSON        = Y.JSON,","    StorageLite = Y.namespace('StorageLite'),","","// -- Private Constants --------------------------------------------------------","DB_NAME           = 'yui_storage_lite',","DB_DISPLAYNAME    = 'YUI StorageLite data',","DB_MAXSIZE        = 1048576,","DB_VERSION        = '1.0',","","EVT_READY         = 'ready',","","MODE_NOOP         = 0,","MODE_HTML5        = 1,","MODE_GECKO        = 2,","MODE_DB           = 3,","MODE_USERDATA     = 4,","","USERDATA_PATH     = 'yui_storage_lite',","USERDATA_NAME     = 'data',","","// -- Private Variables --------------------------------------------------------","data = {},","storageDriver,","storageMode;","","// -- Implementation -----------------------------------------------------------","","// Determine the best available storage mode.","try {","    if (w.localStorage) {","        storageMode = MODE_HTML5;","    } else if (w.globalStorage) {","        storageMode = MODE_GECKO;","    } else if (w.openDatabase && navigator.userAgent.indexOf('Chrome') === -1) {","        storageMode = MODE_DB;","    } else if (Y.UA.ie >= 5) {","        storageMode = MODE_USERDATA;","    } else {","        storageMode = MODE_NOOP;","    }","} catch (ex) {","    storageMode = MODE_NOOP;","}","","Y.StorageFullError = function (message) {","    Y.StorageFullError.superclass.constructor.call(message);","","    this.name    = 'StorageFullError';","    this.message = message || 'Maximum storage capacity reached';","","    if (Y.UA.ie) {","        this.description = this.message;","    }","};","","Y.extend(Y.StorageFullError, Error);","","/**"," * Provides a persistent local key/value data store similar to HTML5's"," * localStorage."," *"," * @class StorageLite"," * @static"," */","","// -- Public Events ------------------------------------------------------------","Y.augment(StorageLite, Y.EventTarget, true, null, {","    emitFacade : true,","    prefix     : 'storage-lite',","    preventable: false","});","","/**"," * Fired when the storage interface is loaded and ready for use."," *"," * @event storage-lite:ready"," */","StorageLite.publish(EVT_READY, {fireOnce: true});","","Y.mix(StorageLite, {","    // -- Public Methods -------------------------------------------------------","","    /**","     * Removes all items from the data store.","     *","     * @method clear","     */","    clear: function () {},","","    /**","     * Returns the item with the specified key, or <code>null</code> if the item","     * was not found.","     *","     * @method getItem","     * @param {String} key","     * @param {bool} json (optional) <code>true</code> if the item is a JSON","     *     string and should be parsed before being returned","     * @return {Object|null} item or <code>null</code> if not found","     */","    getItem: function (key, json) { return null; },","","    /**","     * Returns the number of items in the data store.","     *","     * @method length","     * @return {Number} number of items in the data store","     */","    length: function () { return 0; },","","    /**","     * Removes the item with the specified key.","     *","     * @method removeItem","     * @param {String} key","     */","    removeItem: function (key) {},","","    /**","     * Stores an item under the specified key. If the key already exists in the","     * data store, it will be replaced.","     *","     * @method setItem","     * @param {String} key","     * @param {Object} value","     * @param {bool} json (optional) <code>true</code> if the item should be","     *     serialized to a JSON string before being stored","     */","    setItem: function (key, value) {}","","});","","if (storageMode === MODE_HTML5 || storageMode === MODE_GECKO) {","","    // Common methods shared by the HTML5 and Gecko implementations.","    Y.mix(StorageLite, {","        length: function () {","            return storageDriver.length;","        },","","        removeItem: function (key) {","            storageDriver.removeItem(key);","        },","","        setItem: function (key, value, json) {","            storageDriver.setItem(key, json ? JSON.stringify(value) : value);","        }","    }, true);","","    if (storageMode === MODE_HTML5) {","","        // HTML5 localStorage methods. Currently supported by IE8, Firefox 3.5+,","        // Safari 4+, Chrome 4+, and Opera 10.5+.","        storageDriver = w.localStorage;","","        // Mobile Safari in iOS 5 loses track of storageDriver when page is","        // restored from the bfcache. This fixes the reference.","        Y.Node.DOM_EVENTS.pageshow = 1;","","        Y.on('pageshow', function () {","            storageDriver = w.localStorage;","        });","","        Y.mix(StorageLite, {","            clear: function () {","                storageDriver.clear();","            },","","            getItem: function (key, json) {","                try {","                    return json ? JSON.parse(storageDriver.getItem(key)) :","                            storageDriver.getItem(key);","                } catch (ex) {","                    return null;","                }","            }","        }, true);","","    } else if (storageMode === MODE_GECKO) {","","        // Gecko globalStorage methods. Supported by Firefox 2 and 3.0.","        storageDriver = w.globalStorage[w.location.hostname];","","        Y.mix(StorageLite, {","            clear: function () {","                for (var key in storageDriver) {","                    if (storageDriver.hasOwnProperty(key)) {","                        storageDriver.removeItem(key);","                        delete storageDriver[key];","                    }","                }","            },","","            getItem: function (key, json) {","                try {","                    return json ? JSON.parse(storageDriver[key].value) :","                            storageDriver[key].value;","                } catch (ex) {","                    return null;","                }","            }","        }, true);","","    }","","    StorageLite.fire(EVT_READY);","","} else if (storageMode === MODE_DB || storageMode === MODE_USERDATA) {","","    // Common methods shared by the database and userdata implementations.","    Y.mix(StorageLite, {","        clear: function () {","            data = {};","            StorageLite._save();","        },","","        getItem: function (key, json) {","            return data.hasOwnProperty(key) ? data[key] : null;","        },","","        length: function () {","            var count = 0, key;","","            for (key in data) {","                if (data.hasOwnProperty(key)) {","                    count += 1;","                }","            }","","            return count;","        },","","        removeItem: function (key) {","            delete data[key];","            StorageLite._save();","        },","","        setItem: function (key, value, json) {","            data[key] = value;","            StorageLite._save();","        }","","    }, true);","","    if (storageMode === MODE_DB) {","","        // Database storage methods. Supported by Safari 3.1 and 3.2.","        storageDriver = w.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAYNAME, DB_MAXSIZE);","","        Y.mix(StorageLite, {","            _save: function () {","                storageDriver.transaction(function (t) {","                    t.executeSql(\"REPLACE INTO \" + DB_NAME + \" (name, value) VALUES ('data', ?)\", [JSON.stringify(data)]);","                });","            }","        }, true);","","        storageDriver.transaction(function (t) {","            t.executeSql(\"CREATE TABLE IF NOT EXISTS \" + DB_NAME + \"(name TEXT PRIMARY KEY, value TEXT NOT NULL)\");","            t.executeSql(\"SELECT value FROM \" + DB_NAME + \" WHERE name = 'data'\", [], function (t, results) {","                if (results.rows.length) {","                    try {","                        data = JSON.parse(results.rows.item(0).value);","                    } catch (ex) {","                        data = {};","                    }","                }","","                StorageLite.fire(EVT_READY);","            });","        });","","    } else if (storageMode === MODE_USERDATA) {","","        // userData storage methods. Supported by IE5, 6, and 7.","        storageDriver = d.createElement('span');","        storageDriver.addBehavior('#default#userData');","","        Y.mix(StorageLite, {","            _save: function () {","                var _data = JSON.stringify(data);","","                try {","                    storageDriver.setAttribute(USERDATA_NAME, _data);","                    storageDriver.save(USERDATA_PATH);","                } catch (ex) {","                    throw new Y.StorageFullError();","                }","            }","        }, true);","","        Y.on('domready', function () {","            d.body.appendChild(storageDriver);","            storageDriver.load(USERDATA_PATH);","","            try {","                data = JSON.parse(storageDriver.getAttribute(USERDATA_NAME) || '{}');","            } catch (ex) {","                data = {};","            }","","            StorageLite.fire(EVT_READY);","        });","","    }","","} else {","","    // Fire the ready event for browsers that only support the noop mode.","    StorageLite.fire(EVT_READY);","","}","","","}, '@VERSION@', {\"requires\": [\"event-base\", \"event-custom\", \"event-custom-complex\", \"json\", \"node-base\"]});"];
_yuitest_coverage["build/gallery-storage-lite/gallery-storage-lite.js"].lines = {"1":0,"15":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"55":0,"58":0,"61":0,"62":0,"64":0,"65":0,"67":0,"68":0,"72":0,"83":0,"94":0,"96":0,"116":0,"124":0,"148":0,"151":0,"153":0,"157":0,"161":0,"165":0,"169":0,"173":0,"175":0,"176":0,"179":0,"181":0,"185":0,"186":0,"189":0,"194":0,"197":0,"199":0,"201":0,"202":0,"203":0,"204":0,"210":0,"211":0,"214":0,"221":0,"223":0,"226":0,"228":0,"229":0,"233":0,"237":0,"239":0,"240":0,"241":0,"245":0,"249":0,"250":0,"254":0,"255":0,"260":0,"263":0,"265":0,"267":0,"268":0,"273":0,"274":0,"275":0,"276":0,"277":0,"278":0,"280":0,"284":0,"288":0,"291":0,"292":0,"294":0,"296":0,"298":0,"299":0,"300":0,"302":0,"307":0,"308":0,"309":0,"311":0,"312":0,"314":0,"317":0,"325":0};
_yuitest_coverage["build/gallery-storage-lite/gallery-storage-lite.js"].functions = {"StorageFullError:61":0,"getItem:116":0,"length:124":0,"length:152":0,"removeItem:156":0,"setItem:160":0,"(anonymous 2):175":0,"clear:180":0,"getItem:184":0,"clear:200":0,"getItem:209":0,"clear:227":0,"getItem:232":0,"length:236":0,"removeItem:248":0,"setItem:253":0,"(anonymous 3):267":0,"_save:266":0,"(anonymous 5):275":0,"(anonymous 4):273":0,"_save:295":0,"(anonymous 6):307":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-storage-lite/gallery-storage-lite.js"].coveredLines = 95;
_yuitest_coverage["build/gallery-storage-lite/gallery-storage-lite.js"].coveredFunctions = 23;
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 1);
YUI.add('gallery-storage-lite', function (Y, NAME) {

/*global YUI */
/*jslint onevar: true, browser: true, undef: true, bitwise: true, regexp: true, newcap: true, immed: true */

/**
 * Implements a persistent local key/value data store similar to HTML5's
 * localStorage. Should work in IE5+, Firefox 2+, Safari 3.1+, Chrome 4+, and
 * Opera 10.5+.
 *
 * @module gallery-storage-lite
 */

// -- Shorthand ----------------------------------------------------------------
_yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 15);
var d           = Y.config.doc,
    w           = Y.config.win,
    JSON        = Y.JSON,
    StorageLite = Y.namespace('StorageLite'),

// -- Private Constants --------------------------------------------------------
DB_NAME           = 'yui_storage_lite',
DB_DISPLAYNAME    = 'YUI StorageLite data',
DB_MAXSIZE        = 1048576,
DB_VERSION        = '1.0',

EVT_READY         = 'ready',

MODE_NOOP         = 0,
MODE_HTML5        = 1,
MODE_GECKO        = 2,
MODE_DB           = 3,
MODE_USERDATA     = 4,

USERDATA_PATH     = 'yui_storage_lite',
USERDATA_NAME     = 'data',

// -- Private Variables --------------------------------------------------------
data = {},
storageDriver,
storageMode;

// -- Implementation -----------------------------------------------------------

// Determine the best available storage mode.
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 45);
try {
    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 46);
if (w.localStorage) {
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 47);
storageMode = MODE_HTML5;
    } else {_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 48);
if (w.globalStorage) {
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 49);
storageMode = MODE_GECKO;
    } else {_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 50);
if (w.openDatabase && navigator.userAgent.indexOf('Chrome') === -1) {
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 51);
storageMode = MODE_DB;
    } else {_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 52);
if (Y.UA.ie >= 5) {
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 53);
storageMode = MODE_USERDATA;
    } else {
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 55);
storageMode = MODE_NOOP;
    }}}}
} catch (ex) {
    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 58);
storageMode = MODE_NOOP;
}

_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 61);
Y.StorageFullError = function (message) {
    _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "StorageFullError", 61);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 62);
Y.StorageFullError.superclass.constructor.call(message);

    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 64);
this.name    = 'StorageFullError';
    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 65);
this.message = message || 'Maximum storage capacity reached';

    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 67);
if (Y.UA.ie) {
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 68);
this.description = this.message;
    }
};

_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 72);
Y.extend(Y.StorageFullError, Error);

/**
 * Provides a persistent local key/value data store similar to HTML5's
 * localStorage.
 *
 * @class StorageLite
 * @static
 */

// -- Public Events ------------------------------------------------------------
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 83);
Y.augment(StorageLite, Y.EventTarget, true, null, {
    emitFacade : true,
    prefix     : 'storage-lite',
    preventable: false
});

/**
 * Fired when the storage interface is loaded and ready for use.
 *
 * @event storage-lite:ready
 */
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 94);
StorageLite.publish(EVT_READY, {fireOnce: true});

_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 96);
Y.mix(StorageLite, {
    // -- Public Methods -------------------------------------------------------

    /**
     * Removes all items from the data store.
     *
     * @method clear
     */
    clear: function () {},

    /**
     * Returns the item with the specified key, or <code>null</code> if the item
     * was not found.
     *
     * @method getItem
     * @param {String} key
     * @param {bool} json (optional) <code>true</code> if the item is a JSON
     *     string and should be parsed before being returned
     * @return {Object|null} item or <code>null</code> if not found
     */
    getItem: function (key, json) { _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "getItem", 116);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 116);
return null; },

    /**
     * Returns the number of items in the data store.
     *
     * @method length
     * @return {Number} number of items in the data store
     */
    length: function () { _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "length", 124);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 124);
return 0; },

    /**
     * Removes the item with the specified key.
     *
     * @method removeItem
     * @param {String} key
     */
    removeItem: function (key) {},

    /**
     * Stores an item under the specified key. If the key already exists in the
     * data store, it will be replaced.
     *
     * @method setItem
     * @param {String} key
     * @param {Object} value
     * @param {bool} json (optional) <code>true</code> if the item should be
     *     serialized to a JSON string before being stored
     */
    setItem: function (key, value) {}

});

_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 148);
if (storageMode === MODE_HTML5 || storageMode === MODE_GECKO) {

    // Common methods shared by the HTML5 and Gecko implementations.
    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 151);
Y.mix(StorageLite, {
        length: function () {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "length", 152);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 153);
return storageDriver.length;
        },

        removeItem: function (key) {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "removeItem", 156);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 157);
storageDriver.removeItem(key);
        },

        setItem: function (key, value, json) {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "setItem", 160);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 161);
storageDriver.setItem(key, json ? JSON.stringify(value) : value);
        }
    }, true);

    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 165);
if (storageMode === MODE_HTML5) {

        // HTML5 localStorage methods. Currently supported by IE8, Firefox 3.5+,
        // Safari 4+, Chrome 4+, and Opera 10.5+.
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 169);
storageDriver = w.localStorage;

        // Mobile Safari in iOS 5 loses track of storageDriver when page is
        // restored from the bfcache. This fixes the reference.
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 173);
Y.Node.DOM_EVENTS.pageshow = 1;

        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 175);
Y.on('pageshow', function () {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "(anonymous 2)", 175);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 176);
storageDriver = w.localStorage;
        });

        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 179);
Y.mix(StorageLite, {
            clear: function () {
                _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "clear", 180);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 181);
storageDriver.clear();
            },

            getItem: function (key, json) {
                _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "getItem", 184);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 185);
try {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 186);
return json ? JSON.parse(storageDriver.getItem(key)) :
                            storageDriver.getItem(key);
                } catch (ex) {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 189);
return null;
                }
            }
        }, true);

    } else {_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 194);
if (storageMode === MODE_GECKO) {

        // Gecko globalStorage methods. Supported by Firefox 2 and 3.0.
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 197);
storageDriver = w.globalStorage[w.location.hostname];

        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 199);
Y.mix(StorageLite, {
            clear: function () {
                _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "clear", 200);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 201);
for (var key in storageDriver) {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 202);
if (storageDriver.hasOwnProperty(key)) {
                        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 203);
storageDriver.removeItem(key);
                        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 204);
delete storageDriver[key];
                    }
                }
            },

            getItem: function (key, json) {
                _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "getItem", 209);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 210);
try {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 211);
return json ? JSON.parse(storageDriver[key].value) :
                            storageDriver[key].value;
                } catch (ex) {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 214);
return null;
                }
            }
        }, true);

    }}

    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 221);
StorageLite.fire(EVT_READY);

} else {_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 223);
if (storageMode === MODE_DB || storageMode === MODE_USERDATA) {

    // Common methods shared by the database and userdata implementations.
    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 226);
Y.mix(StorageLite, {
        clear: function () {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "clear", 227);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 228);
data = {};
            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 229);
StorageLite._save();
        },

        getItem: function (key, json) {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "getItem", 232);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 233);
return data.hasOwnProperty(key) ? data[key] : null;
        },

        length: function () {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "length", 236);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 237);
var count = 0, key;

            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 239);
for (key in data) {
                _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 240);
if (data.hasOwnProperty(key)) {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 241);
count += 1;
                }
            }

            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 245);
return count;
        },

        removeItem: function (key) {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "removeItem", 248);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 249);
delete data[key];
            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 250);
StorageLite._save();
        },

        setItem: function (key, value, json) {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "setItem", 253);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 254);
data[key] = value;
            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 255);
StorageLite._save();
        }

    }, true);

    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 260);
if (storageMode === MODE_DB) {

        // Database storage methods. Supported by Safari 3.1 and 3.2.
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 263);
storageDriver = w.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAYNAME, DB_MAXSIZE);

        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 265);
Y.mix(StorageLite, {
            _save: function () {
                _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "_save", 266);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 267);
storageDriver.transaction(function (t) {
                    _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "(anonymous 3)", 267);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 268);
t.executeSql("REPLACE INTO " + DB_NAME + " (name, value) VALUES ('data', ?)", [JSON.stringify(data)]);
                });
            }
        }, true);

        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 273);
storageDriver.transaction(function (t) {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "(anonymous 4)", 273);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 274);
t.executeSql("CREATE TABLE IF NOT EXISTS " + DB_NAME + "(name TEXT PRIMARY KEY, value TEXT NOT NULL)");
            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 275);
t.executeSql("SELECT value FROM " + DB_NAME + " WHERE name = 'data'", [], function (t, results) {
                _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "(anonymous 5)", 275);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 276);
if (results.rows.length) {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 277);
try {
                        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 278);
data = JSON.parse(results.rows.item(0).value);
                    } catch (ex) {
                        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 280);
data = {};
                    }
                }

                _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 284);
StorageLite.fire(EVT_READY);
            });
        });

    } else {_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 288);
if (storageMode === MODE_USERDATA) {

        // userData storage methods. Supported by IE5, 6, and 7.
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 291);
storageDriver = d.createElement('span');
        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 292);
storageDriver.addBehavior('#default#userData');

        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 294);
Y.mix(StorageLite, {
            _save: function () {
                _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "_save", 295);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 296);
var _data = JSON.stringify(data);

                _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 298);
try {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 299);
storageDriver.setAttribute(USERDATA_NAME, _data);
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 300);
storageDriver.save(USERDATA_PATH);
                } catch (ex) {
                    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 302);
throw new Y.StorageFullError();
                }
            }
        }, true);

        _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 307);
Y.on('domready', function () {
            _yuitest_coverfunc("build/gallery-storage-lite/gallery-storage-lite.js", "(anonymous 6)", 307);
_yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 308);
d.body.appendChild(storageDriver);
            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 309);
storageDriver.load(USERDATA_PATH);

            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 311);
try {
                _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 312);
data = JSON.parse(storageDriver.getAttribute(USERDATA_NAME) || '{}');
            } catch (ex) {
                _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 314);
data = {};
            }

            _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 317);
StorageLite.fire(EVT_READY);
        });

    }}

} else {

    // Fire the ready event for browsers that only support the noop mode.
    _yuitest_coverline("build/gallery-storage-lite/gallery-storage-lite.js", 325);
StorageLite.fire(EVT_READY);

}}


}, '@VERSION@', {"requires": ["event-base", "event-custom", "event-custom-complex", "json", "node-base"]});
