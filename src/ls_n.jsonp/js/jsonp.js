var l    = Y.Lang,
    noop = function () {};

/**
 * <p>Provides a JSONPRequest class for repeated JSONP calls, and a convenience
 * method Y.ls_n.jsonp(url, callback) to instantiate and send a JSONP request.</p>
 *
 * <p>The url of the JSONP service should include the substring "{callback}"
 * in place of the name of the callback function to be executed.  E.g
 * <code>Y.ls_n.jsonp("http://foo.com/bar?cb={callback}",myCallback);</code></p>
 *
 * <p>The second parameter can be a callback function that accepts the JSON
 * payload as its argument, or a configuration object supporting the keys:</p>
 * <ul>
 *   <li>success - function handler for successful transmission</li>
 *   <li>failure - function handler for failed transmission</li>
 *   <li>pattern - RegExp instance used to insert the generated callback name
 *          into the JSONP url (default /\{callback\}/i)</li>
 * </ul>
 *
 * @module ls_n.jsonp
 * @class JSONPRequest
 * @constructor
 * @param url {String} the url of the JSONP service, including a {placeholder}
 *                     for the callback function
 * @param callback {Object|Function} the callback configuration or success
 *                     handler
 */
function JSONPRequest(url,callback) {
    if (!(this instanceof JSONPRequest)) {
        return new JSONPRequest(url,callback);
    }

    if (!url) {
        Y.log("JSONP URL not provided","warn","jsonp");
        return null;
    }

    this.url = url;

    this._init(callback);
}

/**
 * Default RegExp used to insert the generated callback name into the JSONP
 * url.
 *
 * @member JSONPRequest.pattern
 * @type RegExp
 * @static
 */
JSONPRequest.pattern = /\{callback\}/i;

JSONPRequest.prototype = {
    /**
     * Set up the success and failure handlers and the regex pattern used
     * to insert the temporary callback name in the url.
     *
     * @method _init
     * @param cfg {Object|Function} The success callback or the config
     *                  object containing success and failure functions and
     *                  the url regex.
     * @protected
     */
    _init : function (cfg) {
        var c = l.isObject(cfg) ? cfg : {};

        this.success = l.isFunction(c) ?
            c :
            l.isFunction(c.success) ?
                c.success :
                noop;

        this.failure = l.isFunction(c.failure) ? c.failure : noop;

        this.pattern = l.type(c.pattern) === 'regexp' ?
            c.pattern :
            Y.ls_n.JSONPRequest.pattern;
    },

    /** 
     * Issues the JSONP request.
     *
     * @method send
     * @chainable
     */
    send : function () {
        var proxy   = Y.guid().replace(/-/g,'_'),
            url     = this.url.replace(this.pattern, "YUI."+proxy),
            success = this.success,
            failure = this.failure;

        // Temporary un-sandboxed function alias
        YUI[proxy] = success;

        // Use the YUI instance's Get util to add the script and trigger the
        // callback.
        YUI({ modules: { _ : { fullpath : url } } }).
        use('_', function(X,res) {
            delete YUI[proxy];

            var el = Y.Selector.query('head > script[src*='+proxy+']',null,true);
            if (el) {
                el.parentNode.removeChild(el);
            } else {
                Y.log('JSONP script element not found for cleanup','warn','jsonp');
            }

            if (!res.success) {
                failure(url);
            }
        });

        return this;
    }
};

Y.namespace('ls_n').JSONPRequest = JSONPRequest;

/**
 *
 * @method Y.ls_n.jsonp
 * @param url {String} the url of the JSONP service with the {callback}
 *          placeholder where the callback function name typically goes.
 * @param c {Function|Object} Callback function accepting the JSON payload
 *          as its argument, or a configuration object (see above).
 * @return {JSONPRequest}
 * @static
 */
Y.ls_n.jsonp = function (url,c) {
    var req = new Y.ls_n.JSONPRequest(url,c);

    // returns null if invalid inputs
    return req && req.send();
};
