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
_yuitest_coverage["/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js",
    code: []
};
_yuitest_coverage["/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js"].code=["YUI.add('gallery-bootstrap-dropdown', function(Y) {","","/**","A Plugin which provides dropdown behaviors for dropdown buttons and menu","groups. This utilizes the markup from the Twitter Bootstrap Project.","","@module gallery-bootstrap-dropdown","**/","","/**","A Plugin which provides dropdown behaviors for dropdown buttons and menu","groups. This utilizes the markup from the Twitter Bootstrap Project.","","To automatically gain this functionality, you can simply add the","<code>data-toggle=dropdown</code> attribute to any element.","","It can also be plugged into any node or node list.","","@example","","  var node = Y.one('.someNode');","  node.plug( Y.Bootstrap.Dropdown );","  node.dropdown.show();","","@class Bootstrap.Dropdown","**/","","var NS = Y.namespace('Bootstrap');","","function DropdownPlugin(config) {","  DropdownPlugin.superclass.constructor.apply(this, arguments);","}","","DropdownPlugin.NAME = 'Bootstrap.Dropdown';","DropdownPlugin.NS   = 'dropdown';","","Y.extend( DropdownPlugin, Y.Plugin.Base, {","    defaults : {","        className : 'open',","        target    : 'target',","        selector  : ''","    },","    initializer : function(config) {","        this._node = config.host;","","        this.config = Y.mix( config, this.defaults );","","        this.publish('show', { preventable : true, defaultFn : this.show });","        this.publish('hide', { preventable : true, defaultFn : this.hide });","","        this._node.on('click', this.toggle, this);","    },","","    toggle : function() {","        var target    = this.getTarget(),","            className = this.config.className;","","        target.toggleClass( className );","        target.once('clickoutside', function(e) {","            target.toggleClass( className );","        });","    },","","    show : function() {","        this.getTarget().addClass( this.config.className );","    },","    hide : function() {","        this.getTarget().removeClass( this.config.className );","    },","    open : function() {","        this.getTarget().addClass( this.config.className );","    },","    close : function() {","        this.getTarget().removeClass( this.config.className );","    },","","    /**","    @method getTarget","    @description Fetches a Y.NodeList or Y.Node that should be used to modify class names","    **/ ","    getTarget : function() {","        var node     = this._node,","            selector = node.getData( this.config.target ),","            target;","","        if ( !selector ) {","            selector = node.getAttribute('href');","            selector = target && target.replace(/.*(?=#[^\\s]*$)/, ''); //strip for ie7","        }","","        target = Y.all(selector);","        if ( target.size() === 0 ) {","            target = node.get('parentNode');","        }","","        return target;","    }","});","","NS.Dropdown = DropdownPlugin;","NS.dropdown_delegation = function() {","    Y.delegate('click', function(e) {","        var target = e.currentTarget;","        e.preventDefault();","","        if ( typeof e.target.dropdown === 'undefined' ) {","            target.plug( DropdownPlugin );","            target.dropdown.toggle();","        }","    }, document.body, '*[data-toggle=dropdown]' );","};","","","}, 'gallery-2012.08.22-20-00' ,{requires:['plugin','event','event-outside']});"];
_yuitest_coverage["/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js"].lines = {"1":0,"28":0,"30":0,"31":0,"34":0,"35":0,"37":0,"44":0,"46":0,"48":0,"49":0,"51":0,"55":0,"58":0,"59":0,"60":0,"65":0,"68":0,"71":0,"74":0,"82":0,"86":0,"87":0,"88":0,"91":0,"92":0,"93":0,"96":0,"100":0,"101":0,"102":0,"103":0,"104":0,"106":0,"107":0,"108":0};
_yuitest_coverage["/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js"].functions = {"DropdownPlugin:30":0,"initializer:43":0,"(anonymous 2):59":0,"toggle:54":0,"show:64":0,"hide:67":0,"open:70":0,"close:73":0,"getTarget:81":0,"(anonymous 3):102":0,"dropdown_delegation:101":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js"].coveredLines = 36;
_yuitest_coverage["/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js"].coveredFunctions = 12;
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 1);
YUI.add('gallery-bootstrap-dropdown', function(Y) {

/**
A Plugin which provides dropdown behaviors for dropdown buttons and menu
groups. This utilizes the markup from the Twitter Bootstrap Project.

@module gallery-bootstrap-dropdown
**/

/**
A Plugin which provides dropdown behaviors for dropdown buttons and menu
groups. This utilizes the markup from the Twitter Bootstrap Project.

To automatically gain this functionality, you can simply add the
<code>data-toggle=dropdown</code> attribute to any element.

It can also be plugged into any node or node list.

@example

  var node = Y.one('.someNode');
  node.plug( Y.Bootstrap.Dropdown );
  node.dropdown.show();

@class Bootstrap.Dropdown
**/

_yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 28);
var NS = Y.namespace('Bootstrap');

_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 30);
function DropdownPlugin(config) {
  _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "DropdownPlugin", 30);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 31);
DropdownPlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 34);
DropdownPlugin.NAME = 'Bootstrap.Dropdown';
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 35);
DropdownPlugin.NS   = 'dropdown';

_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 37);
Y.extend( DropdownPlugin, Y.Plugin.Base, {
    defaults : {
        className : 'open',
        target    : 'target',
        selector  : ''
    },
    initializer : function(config) {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "initializer", 43);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 44);
this._node = config.host;

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 46);
this.config = Y.mix( config, this.defaults );

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 48);
this.publish('show', { preventable : true, defaultFn : this.show });
        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 49);
this.publish('hide', { preventable : true, defaultFn : this.hide });

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 51);
this._node.on('click', this.toggle, this);
    },

    toggle : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "toggle", 54);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 55);
var target    = this.getTarget(),
            className = this.config.className;

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 58);
target.toggleClass( className );
        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 59);
target.once('clickoutside', function(e) {
            _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "(anonymous 2)", 59);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 60);
target.toggleClass( className );
        });
    },

    show : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "show", 64);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 65);
this.getTarget().addClass( this.config.className );
    },
    hide : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "hide", 67);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 68);
this.getTarget().removeClass( this.config.className );
    },
    open : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "open", 70);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 71);
this.getTarget().addClass( this.config.className );
    },
    close : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "close", 73);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 74);
this.getTarget().removeClass( this.config.className );
    },

    /**
    @method getTarget
    @description Fetches a Y.NodeList or Y.Node that should be used to modify class names
    **/ 
    getTarget : function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "getTarget", 81);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 82);
var node     = this._node,
            selector = node.getData( this.config.target ),
            target;

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 86);
if ( !selector ) {
            _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 87);
selector = node.getAttribute('href');
            _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 88);
selector = target && target.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 91);
target = Y.all(selector);
        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 92);
if ( target.size() === 0 ) {
            _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 93);
target = node.get('parentNode');
        }

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 96);
return target;
    }
});

_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 100);
NS.Dropdown = DropdownPlugin;
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 101);
NS.dropdown_delegation = function() {
    _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "dropdown_delegation", 101);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 102);
Y.delegate('click', function(e) {
        _yuitest_coverfunc("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", "(anonymous 3)", 102);
_yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 103);
var target = e.currentTarget;
        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 104);
e.preventDefault();

        _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 106);
if ( typeof e.target.dropdown === 'undefined' ) {
            _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 107);
target.plug( DropdownPlugin );
            _yuitest_coverline("/build/gallery-bootstrap-dropdown/gallery-bootstrap-dropdown.js", 108);
target.dropdown.toggle();
        }
    }, document.body, '*[data-toggle=dropdown]' );
};


}, 'gallery-2012.08.22-20-00' ,{requires:['plugin','event','event-outside']});
