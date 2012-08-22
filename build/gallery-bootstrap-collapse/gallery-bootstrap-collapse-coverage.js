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
_yuitest_coverage["/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js",
    code: []
};
_yuitest_coverage["/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js"].code=["YUI.add('gallery-bootstrap-collapse', function(Y) {","","/**","A Plugin which provides collapsing/expanding behaviors on a Node with","compatible syntax and markup from Twitter's Bootstrap project.","","@module gallery-bootstrap-collapse","**/","","/**","A Plugin which provides collapsing and expanding behaviors on a Node with","compatible syntax and markup from Twitter's Bootstrap project.","","It possible to have dynamic behaviors without incorporating any","JavaScript by setting <code>data-toggle=collapse</code> on any element.","","However, it can be manually plugged into any node or node list.","","@example","","    var node = Y.one('.someNode');","    node.plug( Y.Bootstrap.Collapse, config );","","    node.collapse.show();","","@class Bootstrap.Collapse","**/","","function CollapsePlugin(config) {","    CollapsePlugin.superclass.constructor.apply(this, arguments);","}","","CollapsePlugin.NAME = 'Bootstrap.Collapse';","CollapsePlugin.NS   = 'collapse';","","Y.extend(CollapsePlugin, Y.Plugin.Base, {","    defaults : {","        duration  : 0.25,","        easing    : 'ease-in',","        showClass : 'in',","        hideClass : 'out',","","        groupSelector : '> .accordion-group > .in'","    },","","    transitioning: false,","","    initializer : function(config) {","        this._node = config.host;","","        this.config = Y.mix( config, this.defaults );","","        this.publish('show', { preventable : true, defaultFn : this.show });","        this.publish('hide', { preventable : true, defaultFn : this.hide });","","        this._node.on('click', this.toggle, this);","    },","","    _getTarget: function() {","        var node = this._node,","            container;","","        if ( node.getData('target') ) {","            container = Y.one( node.getData('target') );","        }","        else if ( node.getAttribute('href').indexOf('#') >= 0 ) {","            container = Y.one( node.getAttribute('href').substr( node.getAttribute('href').indexOf('#') ) );","        }","        return container;","    },","","    /**","    * @method hide","    * @description Hide the collapsible target, specified by the host's","    * <code>data-target</code> or <code>href</code> attribute.","    */","    hide: function() {","        var showClass = this.config.showClass,","            hideClass = this.config.hideClass,","            node      = this._getTarget();","","        if ( this.transitioning ) {","            return;","        }","","        if ( node ) {","            this._hideElement(node);","        }","    },","","    /**","    * @method show","    * @description Show the collapsible target, specified by the host's","    * <code>data-target</code> or <code>href</code> attribute.","    */","    show: function() {","        var showClass = this.config.showClass,","            hideClass = this.config.hideClass,","            node      = this._getTarget(),","            host      = this._node,","            self      = this,","            parent,","            group_selector = this.config.groupSelector;","","        if ( this.transitioning ) {","            return;","        }","","        if ( host.getData('parent') ) {","            parent = Y.one( host.getData('parent') );","            if ( parent ) {","                parent.all(group_selector).each( function(el) {","                    self._hideElement(el);","                });","            }","        }","        this._showElement(node);","    },","","    /**","    @method toggle","    @description Toggle the state of the collapsible target, specified","    by the host's <code>data-target</code> or <code>href</code>","    attribute. Calls the <code>show</code> or <code>hide</code> method.","    **/","    toggle : function(e) {","        if ( e && Y.Lang.isFunction(e.preventDefault) ) {","            e.preventDefault();","        }","","        var target = this._getTarget();","","        if ( target.hasClass( this.config.showClass ) ) {","            this.fire('hide');","        } else {","            this.fire('show');","        }","    },","","    /**","    @method _transition","    @description Handles the transition between showing and hiding.","    @protected","    @param node {Node} node to apply transitions to","    @param method {String} 'hide' or 'show'","    **/","    _transition : function(node, method) {","        var self        = this,","            config      = this.config,","            duration    = config.duration,","            easing      = config.easing,","            // If we are hiding, then remove the show class.","            removeClass = method === 'hide' ? config.showClass : config.hideClass,","            // And if we are hiding, add the hide class.","            addClass    = method === 'hide' ? config.hideClass : config.showClass,","","            to_height   = method === 'hide' ? 0 : null,","            event       = method === 'hide' ? 'hidden' : 'shown',","","            complete = function() {","                node.removeClass(removeClass);","                node.addClass(addClass);","                self.transitioning = false;","                this.fire( event );","            };","","        if ( to_height === null ) {","            to_height = 0;","            node.all('> *').each(function(el) {","                to_height += el.get('scrollHeight');","            });","        }","","        this.transitioning = true;","","        node.transition({","            height   : to_height +'px',","            duration : duration,","            easing   : easing","        }, complete);","    },","","    /**","    @method _hideElement","    @description Calls the <code>_transition</code> method to hide a node.","    @protected","    @param node {Node} node to hide.","    **/","    _hideElement : function(node) {","        this._transition(node, 'hide');","/*","        var showClass = this.showClass,","            hideClass = this.hideClass;","","        node.removeClass(showClass);","        node.addClass(hideClass);","*/","    },","","    /**","    @method _showElement","    @description Calls the <code>_transition</code> method to show a node.","    @protected","    @param node {Node} node to show.","    **/","    _showElement : function(node) {","        this._transition(node, 'show');","/*","        var showClass = this.showClass,","            hideClass = this.hideClass;","        node.removeClass(hideClass);","        node.addClass(showClass);","*/","    }","});","","Y.namespace('Bootstrap').Collapse = CollapsePlugin;","","","","}, 'gallery-2012.08.22-20-00' ,{requires:['plugin','transition','event','event-delegate']});"];
_yuitest_coverage["/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js"].lines = {"1":0,"29":0,"30":0,"33":0,"34":0,"36":0,"49":0,"51":0,"53":0,"54":0,"56":0,"60":0,"63":0,"64":0,"66":0,"67":0,"69":0,"78":0,"82":0,"83":0,"86":0,"87":0,"97":0,"105":0,"106":0,"109":0,"110":0,"111":0,"112":0,"113":0,"117":0,"127":0,"128":0,"131":0,"133":0,"134":0,"136":0,"148":0,"161":0,"162":0,"163":0,"164":0,"167":0,"168":0,"169":0,"170":0,"174":0,"176":0,"190":0,"207":0,"217":0};
_yuitest_coverage["/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js"].functions = {"CollapsePlugin:29":0,"initializer:48":0,"_getTarget:59":0,"hide:77":0,"(anonymous 2):112":0,"show:96":0,"toggle:126":0,"complete:160":0,"(anonymous 3):169":0,"_transition:147":0,"_hideElement:189":0,"_showElement:206":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js"].coveredLines = 51;
_yuitest_coverage["/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js"].coveredFunctions = 13;
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 1);
YUI.add('gallery-bootstrap-collapse', function(Y) {

/**
A Plugin which provides collapsing/expanding behaviors on a Node with
compatible syntax and markup from Twitter's Bootstrap project.

@module gallery-bootstrap-collapse
**/

/**
A Plugin which provides collapsing and expanding behaviors on a Node with
compatible syntax and markup from Twitter's Bootstrap project.

It possible to have dynamic behaviors without incorporating any
JavaScript by setting <code>data-toggle=collapse</code> on any element.

However, it can be manually plugged into any node or node list.

@example

    var node = Y.one('.someNode');
    node.plug( Y.Bootstrap.Collapse, config );

    node.collapse.show();

@class Bootstrap.Collapse
**/

_yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 29);
function CollapsePlugin(config) {
    _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "CollapsePlugin", 29);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 30);
CollapsePlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 33);
CollapsePlugin.NAME = 'Bootstrap.Collapse';
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 34);
CollapsePlugin.NS   = 'collapse';

_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 36);
Y.extend(CollapsePlugin, Y.Plugin.Base, {
    defaults : {
        duration  : 0.25,
        easing    : 'ease-in',
        showClass : 'in',
        hideClass : 'out',

        groupSelector : '> .accordion-group > .in'
    },

    transitioning: false,

    initializer : function(config) {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "initializer", 48);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 49);
this._node = config.host;

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 51);
this.config = Y.mix( config, this.defaults );

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 53);
this.publish('show', { preventable : true, defaultFn : this.show });
        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 54);
this.publish('hide', { preventable : true, defaultFn : this.hide });

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 56);
this._node.on('click', this.toggle, this);
    },

    _getTarget: function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "_getTarget", 59);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 60);
var node = this._node,
            container;

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 63);
if ( node.getData('target') ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 64);
container = Y.one( node.getData('target') );
        }
        else {_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 66);
if ( node.getAttribute('href').indexOf('#') >= 0 ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 67);
container = Y.one( node.getAttribute('href').substr( node.getAttribute('href').indexOf('#') ) );
        }}
        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 69);
return container;
    },

    /**
    * @method hide
    * @description Hide the collapsible target, specified by the host's
    * <code>data-target</code> or <code>href</code> attribute.
    */
    hide: function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "hide", 77);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 78);
var showClass = this.config.showClass,
            hideClass = this.config.hideClass,
            node      = this._getTarget();

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 82);
if ( this.transitioning ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 83);
return;
        }

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 86);
if ( node ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 87);
this._hideElement(node);
        }
    },

    /**
    * @method show
    * @description Show the collapsible target, specified by the host's
    * <code>data-target</code> or <code>href</code> attribute.
    */
    show: function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "show", 96);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 97);
var showClass = this.config.showClass,
            hideClass = this.config.hideClass,
            node      = this._getTarget(),
            host      = this._node,
            self      = this,
            parent,
            group_selector = this.config.groupSelector;

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 105);
if ( this.transitioning ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 106);
return;
        }

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 109);
if ( host.getData('parent') ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 110);
parent = Y.one( host.getData('parent') );
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 111);
if ( parent ) {
                _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 112);
parent.all(group_selector).each( function(el) {
                    _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "(anonymous 2)", 112);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 113);
self._hideElement(el);
                });
            }
        }
        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 117);
this._showElement(node);
    },

    /**
    @method toggle
    @description Toggle the state of the collapsible target, specified
    by the host's <code>data-target</code> or <code>href</code>
    attribute. Calls the <code>show</code> or <code>hide</code> method.
    **/
    toggle : function(e) {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "toggle", 126);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 127);
if ( e && Y.Lang.isFunction(e.preventDefault) ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 128);
e.preventDefault();
        }

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 131);
var target = this._getTarget();

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 133);
if ( target.hasClass( this.config.showClass ) ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 134);
this.fire('hide');
        } else {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 136);
this.fire('show');
        }
    },

    /**
    @method _transition
    @description Handles the transition between showing and hiding.
    @protected
    @param node {Node} node to apply transitions to
    @param method {String} 'hide' or 'show'
    **/
    _transition : function(node, method) {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "_transition", 147);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 148);
var self        = this,
            config      = this.config,
            duration    = config.duration,
            easing      = config.easing,
            // If we are hiding, then remove the show class.
            removeClass = method === 'hide' ? config.showClass : config.hideClass,
            // And if we are hiding, add the hide class.
            addClass    = method === 'hide' ? config.hideClass : config.showClass,

            to_height   = method === 'hide' ? 0 : null,
            event       = method === 'hide' ? 'hidden' : 'shown',

            complete = function() {
                _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "complete", 160);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 161);
node.removeClass(removeClass);
                _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 162);
node.addClass(addClass);
                _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 163);
self.transitioning = false;
                _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 164);
this.fire( event );
            };

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 167);
if ( to_height === null ) {
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 168);
to_height = 0;
            _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 169);
node.all('> *').each(function(el) {
                _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "(anonymous 3)", 169);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 170);
to_height += el.get('scrollHeight');
            });
        }

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 174);
this.transitioning = true;

        _yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 176);
node.transition({
            height   : to_height +'px',
            duration : duration,
            easing   : easing
        }, complete);
    },

    /**
    @method _hideElement
    @description Calls the <code>_transition</code> method to hide a node.
    @protected
    @param node {Node} node to hide.
    **/
    _hideElement : function(node) {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "_hideElement", 189);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 190);
this._transition(node, 'hide');
/*
        var showClass = this.showClass,
            hideClass = this.hideClass;

        node.removeClass(showClass);
        node.addClass(hideClass);
*/
    },

    /**
    @method _showElement
    @description Calls the <code>_transition</code> method to show a node.
    @protected
    @param node {Node} node to show.
    **/
    _showElement : function(node) {
        _yuitest_coverfunc("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", "_showElement", 206);
_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 207);
this._transition(node, 'show');
/*
        var showClass = this.showClass,
            hideClass = this.hideClass;
        node.removeClass(hideClass);
        node.addClass(showClass);
*/
    }
});

_yuitest_coverline("/build/gallery-bootstrap-collapse/gallery-bootstrap-collapse.js", 217);
Y.namespace('Bootstrap').Collapse = CollapsePlugin;



}, 'gallery-2012.08.22-20-00' ,{requires:['plugin','transition','event','event-delegate']});
