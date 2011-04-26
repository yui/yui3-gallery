
var SRC_POPSTATE    = 'popstate',
    Do = Y.Do,
    Lang = Y.Lang,

    win             = Y.config.win,
    location        = win.location,

    HistoryHash     = Y.HistoryHash,

    _nativeHashInit = HistoryHash.prototype._init,
    nativeParseHash = HistoryHash.parseHash,
    nativeCreateHash = HistoryHash.createHash;

HistoryHash.prototype._init = function(config) {
    //Y.log('enter HistoryHash.prototype._init');

    this._config = config || {};

    // HistoryHash.parseHash and HistoryHash.createHash should be redefined. But,
    // the two methods are static and cannot access "this" instance. So, an static
    // method "_currInstance" is added/deleted before and after these two methods ar
    // invoked. Since JavaScript is single threaded, this works without race condition.
    //
    Do.before(HistoryHash._injectInstance, HistoryHash, 'parseHash', this);
    Do.after(HistoryHash._ejectInstance, HistoryHash, 'parseHash', this);
    Do.before(HistoryHash._injectInstance, HistoryHash, 'createHash', this);
    Do.after(HistoryHash._ejectInstance, HistoryHash, 'createHash', this);

    _nativeHashInit.apply(this, arguments);
};

HistoryHash._injectInstance = function() {
    //Y.log('enter HistoryHash._injectInstance');
    //Y.log(this);
    HistoryHash._currInstance = this;
};

HistoryHash._ejectInstance = function(config) {
    //Y.log('enter HistoryHash._ejectInstance');
    //Y.log(this);
    delete HistoryHash._currInstance;
};

/**
 * Replaces native method HistoryHash.parseHash of YUI.
 *
 * Parses a location hash string into an object of key/value parameter
 * pairs. If <i>hash</i> is not specified, the current location hash will
 * be used.
 *
 * @method parseHash
 * @param {String} hash (optional) location hash string
 * @return {Object} object of parsed key/value parameter pairs
 * @static
 */
HistoryHash.parseHash = function (hash) {
    //Y.log('enter new HistoryHash.parseHash');

    var usePath = HistoryHash._currInstance && HistoryHash._currInstance._config && HistoryHash._currInstance._config.usePath;

    if (!usePath) {
        return nativeParseHash.apply(this, arguments);
    } else {
        return HistoryHash._parsePath(hash, usePath);
    }
};

HistoryHash._parsePath = function (hash, usePathConfig) {
    var decode = HistoryHash.decode,
        i,
        len,
        segments,
        param,
        params = {},
        prefix = HistoryHash.hashPrefix,
        prefixIndex;

    hash = Lang.isValue(hash) ? hash : HistoryHash.getHash();

    if (prefix) {
        prefixIndex = hash.indexOf(prefix);

        if (prefixIndex === 0 || (prefixIndex === 1 && hash.charAt(0) === '#')) {
            hash = hash.replace(prefix, '');
        }
    }

    segments = hash.split('/');
    for (i = 0, len = segments.length; i < len; ++i) {
        params[decode(usePathConfig[i])] = decode(segments[i]);
    }

    //Y.log(params);
    return params;
};

/**
 * Replaces native method HistoryHash.parseHash of YUI.
 *
 * Creates a location hash string from the specified object of key/value
 * pairs. The hash string is composed according to config.
 *
 * @method createHash
 * @param {Object} params object of key/value parameter pairs
 * @return {String} location hash string
 * @static
 */
HistoryHash.createHash = function (params) {
    //Y.log('enter new HistoryHash.createHash');

    var usePath = HistoryHash._currInstance && HistoryHash._currInstance._config && HistoryHash._currInstance._config.usePath;

    //Y.log(HistoryHash._currInstance);
    //Y.log('usePath: ' + usePath);
    if (!usePath) {
        return nativeCreateHash.apply(this, arguments);
    } else {
        return HistoryHash._createPath(params, usePath);
    }
};

HistoryHash._createPath = function (params, usePathConfig) {
    var encode      = HistoryHash.encode,
        segments    = [];

    Y.Array.each(usePathConfig, function(val, i) {
        if (Lang.isValue(params[val])) {
            segments.push(params[val]);
        }
    });

    //Y.log(segments.join('/'));
    return segments.join('/');
};

