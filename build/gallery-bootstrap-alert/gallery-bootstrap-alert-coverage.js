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
_yuitest_coverage["/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js",
    code: []
};
_yuitest_coverage["/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js"].code=["YUI.add('gallery-bootstrap-alert', function(Y) {","","/**","A Plugin which provides fading Alert behaviors on a Node with compatible syntax","and markup from Twitter's Bootstrap project.","","@module gallery-bootstrap-alert","**/","","/**","A Plugin which provides fading Alert behaviors on a Node with compatible syntax","and markup from Twitter's Bootstrap project.","","This makes it possible to have dynamic behaviors without incorporating any","JavaScript. However, it can be manually plugged into any node or node list.","","    var node = Y.one('.someNode');","    // Duration is in seconds","    node.plug( Y.Bootstrap.Alert, { duration : 5 } );","","    node.alert.close();","","@class Bootstrap.Alert","**/","","function AlertPlugin(config) {","    AlertPlugin.superclass.constructor.apply(this, arguments);","","    this.config = Y.mix( config, this.defaults );","","    var selector = this.config.selector;","","    this._node = config.host;","","    /**","    Fires when the close method is called, or when any close item has been","    clicked","","    @event close","    @preventable _dismissAlertFn","    **/","    this.publish('close', { preventable : true, defaultFn : this._dismissAlertFn });","","    this._node.delegate('click', function(e) { this.fire('close'); }, selector, this);","}","","","AlertPlugin.NAME = 'Bootstrap.Alert';","AlertPlugin.NS   = 'alert';","","Y.extend(AlertPlugin, Y.Plugin.Base, {","    /**","    @property defaults","    @type Object","    @default { duration : 0.5, selector : '.close', transition : true, destroy : true }","    **/","    defaults : {","        duration     : 0.5,","        selector     : '.close',","        transition   : true,","        destroy      : true","    },","","    /**","    @method close","    @description Closes the alert target (the host) and removes the node.","    **/","    close: function() {","        // Just a fake event facade.","        this.fire('close', { currentTarget : this._node.one('.close') });","    },","","    /**","    @method _dismissAlertFn","    @description Internal method to handle the transitions and fire the","    closed event","    @protected","    **/","    _dismissAlertFn: function(e) {","        // This could be called from directly inside the plugin or just","        // violating encapsulation entirely. I didn't want to go through","        // instantiation overhead for what really will amount to a single and","        // direct call.","        var target = e.currentTarget,","            alert,","            config,","            is_plugin,","            destroy,","            completed;","","        // If we have a node, use that. If not, find an ancestor that matches.","        if ( Y.instanceOf( this, AlertPlugin ) ) {","            alert     = this._node;","            config    = this.config;","            is_plugin = this;","        } else {","            alert  = e.target.ancestor('div.' + ( target.getData('dismiss') || 'alert' ) );","            config = AlertPlugin.prototype.defaults;","        }","","        destroy = config.destroy ? true : false;","","        completed = function() {","            if ( destroy ) { this.remove(); };","            alert.fire('closed');","            if ( is_plugin ) {","                is_plugin.fire('closed');","            }","        };","","        if ( alert ) {","            e.preventDefault();","            if ( config.transition && alert.hasClass('fade') ) {","                alert.transition(","                    {","                        duration : config.duration,","                        opacity  : 0","                    },","                    completed","                );","            } else {","                alert.hide();","                completed.apply( alert );","            }","        }","    }","});","","Y.namespace('Bootstrap').Alert = AlertPlugin;","","","","}, 'gallery-2012.08.22-20-00' ,{requires:['plugin','transition','event','event-delegate']});"];
_yuitest_coverage["/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js"].lines = {"1":0,"26":0,"27":0,"29":0,"31":0,"33":0,"42":0,"44":0,"48":0,"49":0,"51":0,"70":0,"84":0,"92":0,"93":0,"94":0,"95":0,"97":0,"98":0,"101":0,"103":0,"104":0,"105":0,"106":0,"107":0,"111":0,"112":0,"113":0,"114":0,"122":0,"123":0,"129":0};
_yuitest_coverage["/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js"].functions = {"(anonymous 2):44":0,"AlertPlugin:26":0,"close:68":0,"completed:103":0,"_dismissAlertFn:79":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js"].coveredLines = 32;
_yuitest_coverage["/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js"].coveredFunctions = 6;
_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 1);
YUI.add('gallery-bootstrap-alert', function(Y) {

/**
A Plugin which provides fading Alert behaviors on a Node with compatible syntax
and markup from Twitter's Bootstrap project.

@module gallery-bootstrap-alert
**/

/**
A Plugin which provides fading Alert behaviors on a Node with compatible syntax
and markup from Twitter's Bootstrap project.

This makes it possible to have dynamic behaviors without incorporating any
JavaScript. However, it can be manually plugged into any node or node list.

    var node = Y.one('.someNode');
    // Duration is in seconds
    node.plug( Y.Bootstrap.Alert, { duration : 5 } );

    node.alert.close();

@class Bootstrap.Alert
**/

_yuitest_coverfunc("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 26);
function AlertPlugin(config) {
    _yuitest_coverfunc("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", "AlertPlugin", 26);
_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 27);
AlertPlugin.superclass.constructor.apply(this, arguments);

    _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 29);
this.config = Y.mix( config, this.defaults );

    _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 31);
var selector = this.config.selector;

    _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 33);
this._node = config.host;

    /**
    Fires when the close method is called, or when any close item has been
    clicked

    @event close
    @preventable _dismissAlertFn
    **/
    _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 42);
this.publish('close', { preventable : true, defaultFn : this._dismissAlertFn });

    _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 44);
this._node.delegate('click', function(e) { _yuitest_coverfunc("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", "(anonymous 2)", 44);
this.fire('close'); }, selector, this);
}


_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 48);
AlertPlugin.NAME = 'Bootstrap.Alert';
_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 49);
AlertPlugin.NS   = 'alert';

_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 51);
Y.extend(AlertPlugin, Y.Plugin.Base, {
    /**
    @property defaults
    @type Object
    @default { duration : 0.5, selector : '.close', transition : true, destroy : true }
    **/
    defaults : {
        duration     : 0.5,
        selector     : '.close',
        transition   : true,
        destroy      : true
    },

    /**
    @method close
    @description Closes the alert target (the host) and removes the node.
    **/
    close: function() {
        // Just a fake event facade.
        _yuitest_coverfunc("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", "close", 68);
_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 70);
this.fire('close', { currentTarget : this._node.one('.close') });
    },

    /**
    @method _dismissAlertFn
    @description Internal method to handle the transitions and fire the
    closed event
    @protected
    **/
    _dismissAlertFn: function(e) {
        // This could be called from directly inside the plugin or just
        // violating encapsulation entirely. I didn't want to go through
        // instantiation overhead for what really will amount to a single and
        // direct call.
        _yuitest_coverfunc("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", "_dismissAlertFn", 79);
_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 84);
var target = e.currentTarget,
            alert,
            config,
            is_plugin,
            destroy,
            completed;

        // If we have a node, use that. If not, find an ancestor that matches.
        _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 92);
if ( Y.instanceOf( this, AlertPlugin ) ) {
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 93);
alert     = this._node;
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 94);
config    = this.config;
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 95);
is_plugin = this;
        } else {
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 97);
alert  = e.target.ancestor('div.' + ( target.getData('dismiss') || 'alert' ) );
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 98);
config = AlertPlugin.prototype.defaults;
        }

        _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 101);
destroy = config.destroy ? true : false;

        _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 103);
completed = function() {
            _yuitest_coverfunc("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", "completed", 103);
_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 104);
if ( destroy ) { this.remove(); };
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 105);
alert.fire('closed');
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 106);
if ( is_plugin ) {
                _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 107);
is_plugin.fire('closed');
            }
        };

        _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 111);
if ( alert ) {
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 112);
e.preventDefault();
            _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 113);
if ( config.transition && alert.hasClass('fade') ) {
                _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 114);
alert.transition(
                    {
                        duration : config.duration,
                        opacity  : 0
                    },
                    completed
                );
            } else {
                _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 122);
alert.hide();
                _yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 123);
completed.apply( alert );
            }
        }
    }
});

_yuitest_coverline("/build/gallery-bootstrap-alert/gallery-bootstrap-alert.js", 129);
Y.namespace('Bootstrap').Alert = AlertPlugin;



}, 'gallery-2012.08.22-20-00' ,{requires:['plugin','transition','event','event-delegate']});
