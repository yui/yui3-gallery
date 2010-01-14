YUI.add('gallery-jsonp', function(Y) {

var l    = Y.Lang,
    noop = function () {};

/**
 * <p>Provides a JSONPRequest class for repeated JSONP calls, and a convenience
 * method Y.jsonp(url, callback) to instantiate and send a JSONP request.</p>
 *
 * <p>The url of the JSONP service will have a proxy function assigned as the
 * callback name.  By default it will look for callback=(anything).  If
 * (anything) is present, it will be clobbered by the proxy name.  And if the
 * callback= param can't be found, it will be appended to the url.</p>
 *
 * <p>To override this behavior, pass a function to the &quot;format&quot;
 * property in the callback config.</p>
 *
 * <p>The second parameter can be a callback function that accepts the JSON
 * payload as its argument, or a configuration object supporting the keys:</p>
 * <ul>
 *   <li>success - function handler for successful transmission</li>
 *   <li>failure - function handler for failed transmission</li>
 *   <li>format - function for inserting the proxy name into the url</li>
 * </ul>
 *
 * @module gallery-jsonp
 * @class JSONPRequest
 * @constructor
 * @param url {String} the url of the JSONP service
 * @param callback {Object|Function} the callback configuration or success
 *                     handler
 */
function JSONPRequest(url,callback) {

    this.url = url;

    this._init(callback);
}

/**
 * RegExp used by the default URL formatter to insert the generated callback
 * name into the JSONP url.  Looks for a query param callback=.  If a value is
 * assigned, it will be clobbered.
 *
 * @member JSONPRequest._pattern
 * @type RegExp
 * @default /\bcallback=.*?(?=&|$)/i
 * @protected
 * @static
 */
JSONPRequest._pattern = /\bcallback=.*?(?=&|$)/i;

/**
 * Template used by the default URL formatter to add the callback function name
 * to the url.
 *
 * @member JSONPRequest._template
 * @type String
 * @default "callback={callback}"
 * @protected
 * @static
 */
JSONPRequest._template = "callback={callback}";

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

        if (l.isFunction(c.format)) {
            this._format = c.format;
        }
    },

    /**
     * Default url formatter.  Looks for callback= in the url and appends it
     * if not present.  The supplied proxy name will be assigned to the query
     * param.  Override this method by passing a function as the
     * &quot;format&quot; property in the config object to the constructor.
     *
     * @method _format
     * @param proxy {String} the function name that will be used as a proxy to
     *      the configured callback methods.
     * @return {String} fully qualified JSONP url
     * @protected
     */
    _format: function (proxy) {
        var url       = this.url,
            callback  = JSONPRequest._template.replace(/\{callback\}/, proxy),
            c;

        if (JSONPRequest._pattern.test(url)) {
            return url.replace(JSONPRequest._pattern, callback);
        } else {
            c = url.slice(-1);
            if (c !== '&' && c !== '?') {
                url += (url.indexOf('?') > -1) ? '&' : '?';
            }
            return url + callback;
        }
    },

    /** 
     * Issues the JSONP request.
     *
     * @method send
     * @chainable
     */
    send : function () {
        var proxy   = Y.guid().replace(/-/g,'_'),
            url     = this._format('YUI.' + proxy),
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

Y.JSONPRequest = JSONPRequest;

/**
 *
 * @method Y.jsonp
 * @param url {String} the url of the JSONP service with the {callback}
 *          placeholder where the callback function name typically goes.
 * @param c {Function|Object} Callback function accepting the JSON payload
 *          as its argument, or a configuration object (see above).
 * @return {JSONPRequest}
 * @static
 */
Y.jsonp = function (url,c) {
    var req = new Y.JSONPRequest(url,c);

    // returns null if invalid inputs
    return req && req.send();
};


}, 'gallery-2009.10.27' ,{requires:['selector-css3']});
