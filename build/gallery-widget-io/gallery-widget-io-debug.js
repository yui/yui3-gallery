YUI.add('gallery-widget-io', function(Y) {

    /* Plugin Constructor */
    function WidgetIO(config) {
        WidgetIO.superclass.constructor.apply(this, arguments);
    }

    /* 
     * The namespace for the plugin. This will be the property on the widget, which will 
     * reference the plugin instance, when it's plugged in
     */
    WidgetIO.NS = 'io';

    /*
     * The NAME of the WidgetIO class. Used to prefix events generated
     * by the plugin class.
     */
    WidgetIO.NAME = 'widgetIO';

    /*
     * The default set of attributes for the WidgetIO class.
     */
    WidgetIO.ATTRS = {
        /*
         * The uri to use for the io request
         */
        uri: {
            value:null
        },

        /*
         * The io configuration object, to pass to io when intiating a transaction
         */
        cfg: {
            value:null
        },

        /*
         * The default formatter to use when formatting response data. The default
         * implementation simply passes back the response data passed in. 
         */
        formatter: {
            valueFn: function() {
                return this._defFormatter;
            }
        },

        /*
         * The default loading indicator to use, when an io transaction is in progress.
         */
        loading: {
            value: '<img class="yui3-loading" width="32px" height="32px" src="<?php echo $assetsDirectory ?>img/ajax-loader.gif">'
        }
    };

    /* Extend the base plugin class */
    Y.extend(WidgetIO, Y.Plugin.Base, {
        /*
         * Destruction code. Terminates the activeIO transaction if it exists
         */
        destructor: function() {
            if (this._activeIO) {
                Y.io.abort(this._activeIO);
                this._activeIO = null;
            }
        },

        /*
         * IO Plugin specific method, use to initiate a new io request using the current
         * io configuration settings.
         */
        refresh: function() {
            if (!this._activeIO) {
                var uri = this.get('uri');

                if (uri) {

                    cfg = this.get('cfg') || {};
                    cfg.on = cfg.on || {};

                    cfg.on.start = cfg.on.start || Y.bind(this._defStartHandler, this);
                    cfg.on.complete = cfg.on.complete || Y.bind(this._defCompleteHandler, this);
    
                    cfg.on.success = cfg.on.success || Y.bind(this._defSuccessHandler, this);
                    cfg.on.failure = cfg.on.failure || Y.bind(this._defFailureHandler, this);

                    cfg.method = cfg.method;  // io defaults to "GET" if not defined

                    Y.io(uri, cfg);
                }
            }
        },

        /*
         * Helper method for setting host content 
         */
        setContent: function(content) {
            this.get('host').get('contentBox').setContent(content);
        },

        /*
         * The default io transaction success handler
         */
        _defSuccessHandler: function(id, o) {
            var response = o.responseText;
            var formatter = this.get('formatter');

            this.setContent(formatter(response));
        },

        /*
         * The default io transaction failure handler
         */
        _defFailureHandler: function(id, o) {
            this.setContent('Failed to retrieve content');
        },

        /*
         * The default io transaction start handler
         */
        _defStartHandler: function(id, o) {
            this._activeIO = o;
            this.setContent(this.get('loading'));
        },

        /*
         * The default io transaction complete handler
         */
        _defCompleteHandler: function(id, o) {
            this._activeIO = null;
        },

        /*
         * The default response formatter
         */
        _defFormatter: function(val) {
            return val;
        }
    });

    Y.Plugin.WidgetIO = WidgetIO;



}, 'gallery-2010.03.16-20' ,{requires:['plugin', 'widget', 'io']});
