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
_yuitest_coverage["/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js",
    code: []
};
_yuitest_coverage["/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js"].code=["YUI.add('gallery-bootstrap-tabview', function(Y) {","","/**","","This is a drop-in for the Twitter Bootstrap tabview, so you don't have to","schlep in jQuery.","","","@module gallery-bootstrap-tabview","**/","","/**","This is a bootstrap compatible tabview. It mostly is an extension on top of","the standard TabView, except it redefines the selectors and classes to be","compatible with the TabView that Bootstrap uses.","","See http://twitter.github.com/bootstrap/javascript.html#tabs for more","information.","","You will need to include the Bootstrap CSS. This is only the JavaScript.","","The interface aims to be completely compatible with Y.TabView. You can read","the documentation at http://yuilibrary.com/yui/docs/tabview/","","@example","","    var tabs = new Y.Bootstrap.Tabview({ node: '#tabs' });","    tabs.render();","","@class Bootstrap.TabView","**/","","var NS  = Y.namespace('Bootstrap'),","    DOT = '.',","    ","    sub = Y.Lang.sub;","","NS.TabView = Y.Base.create('bootstrapTabView', Y.TabviewBase, [ ], {","    _queries      : {","                        tabview      : DOT + 'nav-tabs',","                        tabviewList  : '> ul',","                        tab          : '> ul > li',","                        tabLabel     : '> ul > li > a ',","                        tabviewPanel : '> div',","                        tabPanel     : '> div > div',","                        selectedTab  : '> ul > ' + DOT + 'active',","                        selectedPanel: '> div ' + DOT + 'active'","                    },","    _classNames   : {","                        tabview       : 'nav-tabs',","                        tabviewList   : 'nav-tabs',","                        tabviewPanel  : 'tab-pane',","                        tab           : 'nav-tab',","                        selectedTab   : 'active',","                        selectedPanel : 'active'","                    },","","    LIST_TEMPLATE : '<ul class=\"{tabviewList}\"></ul>',","    PANEL_TEMPLATE: '<div class=\"{tabviewPanel}\"></div>',","","    _afterChildAdded: function(e) {","        this.get('contentBox').focusManager.refresh();","    },","","    _defListNodeValueFn: function() {","        return Y.Node.create(sub(this.LIST_TEMPLATE, this._classNames));","    },","","    _defPanelNodeValueFn: function() {","        return Y.Node.create(sub(this.PANEL_TEMPLATE, this._classNames));","    },","","    _afterChildRemoved: function(e) { // update the selected tab when removed","        var i = e.index,","            selection = this.get('selection');","","        if (!selection) { // select previous item if selection removed","            selection = this.item(i - 1) || this.item(0);","            if (selection) {","                selection.set('selected', 1);","            }","        }","","        this.get('contentBox').focusManager.refresh();","    },","","    _initAria: function() {","        var contentBox = this.get('contentBox'),","            tablist = contentBox.one(this._queries.tabviewList);","","        if (tablist) {","            tablist.setAttrs({","                //'aria-labelledby': ","                role: 'tablist'","            });","        }","    },","","    bindUI: function() {","        //  Use the Node Focus Manager to add keyboard support:","        //  Pressing the left and right arrow keys will move focus","        //  among each of the tabs.","","        this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {","                        descendants: DOT + this._classNames.tabLabel,","                        keys: { next: 'down:39', // Right arrow","                                previous: 'down:37' },  // Left arrow","                        circular: true","                    });","","        this.after('render', this._setDefSelection);","        this.after('addChild', this._afterChildAdded);","        this.after('removeChild', this._afterChildRemoved);","    },","    ","    renderUI: function() {","        var contentBox = this.get('contentBox'); ","        this._renderListBox(contentBox);","        this._renderPanelBox(contentBox);","        this._childrenContainer = this.get('listNode');","        this._renderTabs(contentBox);","    },","","    initEvents: function() {","        // TODO: detach prefix for delegate?","        // this._node.delegate('tabview|' + this.tabEventName),","        this._node.delegate(this.tabEventName,","            this.onTabEvent,","            this._queries.tab,","            this","        );","    },","","    initClassNames: function(index) {","        var queries    = this._queries,","            classNames = this._classNames;","","        Y.Object.each(queries, function(query, name) {","            // this === tabview._node","            if (classNames[name]) {","                var result = this.all(query);","                ","                if (index !== undefined) {","                    result = result.item(index);","                }","","                if (result) {","                    result.addClass(classNames[name]);","                }","            }","        }, this._node);","","        this._node.addClass(classNames.tabview);","    },","","    onTabEvent: function(e) {","        e.preventDefault();","        var index = -1,","            node,","            href = e.target.get('href');","","        if ( href && href.indexOf('#') >= 0 ) {","            node  = this._node.one(href.substr( href.indexOf('#')));","            index = this._node.all( this._queries.tabPanel ).indexOf(node);","        }","","        if ( index === -1 ) {","            index = this._node.all(this._queries.tab).indexOf(e.currentTarget);","        }","","        this._select( index );","    },","","    _select: function(index) {","        var _queries = this._queries,","            _classNames = this._classNames,","            node = this._node,","            oldItem = node.one(_queries.selectedTab),","            oldContent = node.one(_queries.selectedPanel),","            newItem = node.all(_queries.tab).item(index),","            newContent = node.all(_queries.tabPanel).item(index);","","        if (oldItem) {","            oldItem.removeClass(_classNames.selectedTab);","        }","","        if (oldContent) {","            oldContent.removeClass(_classNames.selectedPanel);","            oldContent.removeClass('in');","        }","","        if (newItem) {","            newItem.addClass(_classNames.selectedTab);","        }","","        if (newContent) {","            newContent.addClass(_classNames.selectedPanel);","            newContent.addClass('in');","        }","    },","","    _setDefSelection: function(contentBox) {","        //  If no tab is selected, select the first tab.","        var selection = this.get('selection') || this.item(0);","","        this.some(function(tab) {","            if (tab.get('selected')) {","                selection = tab;","                return true;","            }","        });","        if (selection) {","            // TODO: why both needed? (via widgetParent/Child)?","            this.set('selection', selection);","            selection.set('selected', 1);","        }","    },","","    _renderListBox: function(contentBox) {","        var node = this.get('listNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderPanelBox: function(contentBox) {","        var node = this.get('panelNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderTabs: function(contentBox) {","        var _queries = this._queries,","            _classNames = this._classNames,","            tabs = contentBox.all(_queries.tab),","            panelNode = this.get('panelNode'),","            panels = (panelNode) ? this.get('panelNode').get('children') : null,","            tabview = this;","","        if (tabs) { // add classNames and fill in Tab fields from markup when possible","            tabs.addClass(_classNames.tab);","            contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);","            contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);","","            tabs.each(function(node, i) {","                var panelNode = (panels) ? panels.item(i) : null;","                tabview.add({","                    boundingBox: node,","                    contentBox: node.one(DOT + _classNames.tabLabel),","                    label: node.one(DOT + _classNames.tabLabel).get('text'),","                    panelNode: panelNode","                });","            });","        }","    }","}, {","    ATTRS: {","        defaultChildType: {  ","            value: 'Tab'","        },","","        listNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(this._classNames.tabviewList);","                }","                return node;","            },","","            valueFn: '_defListNodeValueFn'","        },","","        panelNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(this._classNames.tabviewPanel);","                }","                return node;","            },","","            valueFn: '_defPanelNodeValueFn'","        },","","        tabIndex: {","            value: null","        }","    },","","    HTML_PARSER: {","        listNode  : function(node) {","            return this.get('contentBox').one(this._queries.tabviewList);","        },","        panelNode : function() {","            return this.get('contentBox').one(this._queries.tabviewPanel);","        }","    }","});","","","","}, 'gallery-2012.08.22-20-00' ,{requires:['tabview']});"];
_yuitest_coverage["/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js"].lines = {"1":0,"33":0,"38":0,"62":0,"66":0,"70":0,"74":0,"77":0,"78":0,"79":0,"80":0,"84":0,"88":0,"91":0,"92":0,"104":0,"111":0,"112":0,"113":0,"117":0,"118":0,"119":0,"120":0,"121":0,"127":0,"135":0,"138":0,"140":0,"141":0,"143":0,"144":0,"147":0,"148":0,"153":0,"157":0,"158":0,"162":0,"163":0,"164":0,"167":0,"168":0,"171":0,"175":0,"183":0,"184":0,"187":0,"188":0,"189":0,"192":0,"193":0,"196":0,"197":0,"198":0,"204":0,"206":0,"207":0,"208":0,"209":0,"212":0,"214":0,"215":0,"220":0,"221":0,"222":0,"227":0,"228":0,"229":0,"234":0,"241":0,"242":0,"243":0,"244":0,"246":0,"247":0,"248":0,"265":0,"266":0,"267":0,"269":0,"277":0,"278":0,"279":0,"281":0,"294":0,"297":0};
_yuitest_coverage["/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js"].functions = {"_afterChildAdded:61":0,"_defListNodeValueFn:65":0,"_defPanelNodeValueFn:69":0,"_afterChildRemoved:73":0,"_initAria:87":0,"bindUI:99":0,"renderUI:116":0,"initEvents:124":0,"(anonymous 2):138":0,"initClassNames:134":0,"onTabEvent:156":0,"_select:174":0,"(anonymous 3):206":0,"_setDefSelection:202":0,"_renderListBox:219":0,"_renderPanelBox:226":0,"(anonymous 4):246":0,"_renderTabs:233":0,"setter:264":0,"setter:276":0,"listNode:293":0,"panelNode:296":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js"].coveredLines = 85;
_yuitest_coverage["/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js"].coveredFunctions = 23;
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 1);
YUI.add('gallery-bootstrap-tabview', function(Y) {

/**

This is a drop-in for the Twitter Bootstrap tabview, so you don't have to
schlep in jQuery.


@module gallery-bootstrap-tabview
**/

/**
This is a bootstrap compatible tabview. It mostly is an extension on top of
the standard TabView, except it redefines the selectors and classes to be
compatible with the TabView that Bootstrap uses.

See http://twitter.github.com/bootstrap/javascript.html#tabs for more
information.

You will need to include the Bootstrap CSS. This is only the JavaScript.

The interface aims to be completely compatible with Y.TabView. You can read
the documentation at http://yuilibrary.com/yui/docs/tabview/

@example

    var tabs = new Y.Bootstrap.Tabview({ node: '#tabs' });
    tabs.render();

@class Bootstrap.TabView
**/

_yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 33);
var NS  = Y.namespace('Bootstrap'),
    DOT = '.',
    
    sub = Y.Lang.sub;

_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 38);
NS.TabView = Y.Base.create('bootstrapTabView', Y.TabviewBase, [ ], {
    _queries      : {
                        tabview      : DOT + 'nav-tabs',
                        tabviewList  : '> ul',
                        tab          : '> ul > li',
                        tabLabel     : '> ul > li > a ',
                        tabviewPanel : '> div',
                        tabPanel     : '> div > div',
                        selectedTab  : '> ul > ' + DOT + 'active',
                        selectedPanel: '> div ' + DOT + 'active'
                    },
    _classNames   : {
                        tabview       : 'nav-tabs',
                        tabviewList   : 'nav-tabs',
                        tabviewPanel  : 'tab-pane',
                        tab           : 'nav-tab',
                        selectedTab   : 'active',
                        selectedPanel : 'active'
                    },

    LIST_TEMPLATE : '<ul class="{tabviewList}"></ul>',
    PANEL_TEMPLATE: '<div class="{tabviewPanel}"></div>',

    _afterChildAdded: function(e) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_afterChildAdded", 61);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 62);
this.get('contentBox').focusManager.refresh();
    },

    _defListNodeValueFn: function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_defListNodeValueFn", 65);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 66);
return Y.Node.create(sub(this.LIST_TEMPLATE, this._classNames));
    },

    _defPanelNodeValueFn: function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_defPanelNodeValueFn", 69);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 70);
return Y.Node.create(sub(this.PANEL_TEMPLATE, this._classNames));
    },

    _afterChildRemoved: function(e) { // update the selected tab when removed
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_afterChildRemoved", 73);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 74);
var i = e.index,
            selection = this.get('selection');

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 77);
if (!selection) { // select previous item if selection removed
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 78);
selection = this.item(i - 1) || this.item(0);
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 79);
if (selection) {
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 80);
selection.set('selected', 1);
            }
        }

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 84);
this.get('contentBox').focusManager.refresh();
    },

    _initAria: function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_initAria", 87);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 88);
var contentBox = this.get('contentBox'),
            tablist = contentBox.one(this._queries.tabviewList);

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 91);
if (tablist) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 92);
tablist.setAttrs({
                //'aria-labelledby': 
                role: 'tablist'
            });
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.

        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "bindUI", 99);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 104);
this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                        descendants: DOT + this._classNames.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 111);
this.after('render', this._setDefSelection);
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 112);
this.after('addChild', this._afterChildAdded);
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 113);
this.after('removeChild', this._afterChildRemoved);
    },
    
    renderUI: function() {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "renderUI", 116);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 117);
var contentBox = this.get('contentBox'); 
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 118);
this._renderListBox(contentBox);
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 119);
this._renderPanelBox(contentBox);
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 120);
this._childrenContainer = this.get('listNode');
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 121);
this._renderTabs(contentBox);
    },

    initEvents: function() {
        // TODO: detach prefix for delegate?
        // this._node.delegate('tabview|' + this.tabEventName),
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "initEvents", 124);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 127);
this._node.delegate(this.tabEventName,
            this.onTabEvent,
            this._queries.tab,
            this
        );
    },

    initClassNames: function(index) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "initClassNames", 134);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 135);
var queries    = this._queries,
            classNames = this._classNames;

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 138);
Y.Object.each(queries, function(query, name) {
            // this === tabview._node
            _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "(anonymous 2)", 138);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 140);
if (classNames[name]) {
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 141);
var result = this.all(query);
                
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 143);
if (index !== undefined) {
                    _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 144);
result = result.item(index);
                }

                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 147);
if (result) {
                    _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 148);
result.addClass(classNames[name]);
                }
            }
        }, this._node);

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 153);
this._node.addClass(classNames.tabview);
    },

    onTabEvent: function(e) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "onTabEvent", 156);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 157);
e.preventDefault();
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 158);
var index = -1,
            node,
            href = e.target.get('href');

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 162);
if ( href && href.indexOf('#') >= 0 ) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 163);
node  = this._node.one(href.substr( href.indexOf('#')));
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 164);
index = this._node.all( this._queries.tabPanel ).indexOf(node);
        }

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 167);
if ( index === -1 ) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 168);
index = this._node.all(this._queries.tab).indexOf(e.currentTarget);
        }

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 171);
this._select( index );
    },

    _select: function(index) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_select", 174);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 175);
var _queries = this._queries,
            _classNames = this._classNames,
            node = this._node,
            oldItem = node.one(_queries.selectedTab),
            oldContent = node.one(_queries.selectedPanel),
            newItem = node.all(_queries.tab).item(index),
            newContent = node.all(_queries.tabPanel).item(index);

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 183);
if (oldItem) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 184);
oldItem.removeClass(_classNames.selectedTab);
        }

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 187);
if (oldContent) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 188);
oldContent.removeClass(_classNames.selectedPanel);
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 189);
oldContent.removeClass('in');
        }

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 192);
if (newItem) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 193);
newItem.addClass(_classNames.selectedTab);
        }

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 196);
if (newContent) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 197);
newContent.addClass(_classNames.selectedPanel);
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 198);
newContent.addClass('in');
        }
    },

    _setDefSelection: function(contentBox) {
        //  If no tab is selected, select the first tab.
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_setDefSelection", 202);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 204);
var selection = this.get('selection') || this.item(0);

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 206);
this.some(function(tab) {
            _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "(anonymous 3)", 206);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 207);
if (tab.get('selected')) {
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 208);
selection = tab;
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 209);
return true;
            }
        });
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 212);
if (selection) {
            // TODO: why both needed? (via widgetParent/Child)?
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 214);
this.set('selection', selection);
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 215);
selection.set('selected', 1);
        }
    },

    _renderListBox: function(contentBox) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_renderListBox", 219);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 220);
var node = this.get('listNode');
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 221);
if (!node.inDoc()) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 222);
contentBox.append(node);
        }
    },

    _renderPanelBox: function(contentBox) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_renderPanelBox", 226);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 227);
var node = this.get('panelNode');
        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 228);
if (!node.inDoc()) {
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 229);
contentBox.append(node);
        }
    },

    _renderTabs: function(contentBox) {
        _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "_renderTabs", 233);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 234);
var _queries = this._queries,
            _classNames = this._classNames,
            tabs = contentBox.all(_queries.tab),
            panelNode = this.get('panelNode'),
            panels = (panelNode) ? this.get('panelNode').get('children') : null,
            tabview = this;

        _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 241);
if (tabs) { // add classNames and fill in Tab fields from markup when possible
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 242);
tabs.addClass(_classNames.tab);
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 243);
contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);
            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 244);
contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);

            _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 246);
tabs.each(function(node, i) {
                _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "(anonymous 4)", 246);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 247);
var panelNode = (panels) ? panels.item(i) : null;
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 248);
tabview.add({
                    boundingBox: node,
                    contentBox: node.one(DOT + _classNames.tabLabel),
                    label: node.one(DOT + _classNames.tabLabel).get('text'),
                    panelNode: panelNode
                });
            });
        }
    }
}, {
    ATTRS: {
        defaultChildType: {  
            value: 'Tab'
        },

        listNode: {
            setter: function(node) {
                _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "setter", 264);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 265);
node = Y.one(node);
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 266);
if (node) {
                    _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 267);
node.addClass(this._classNames.tabviewList);
                }
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 269);
return node;
            },

            valueFn: '_defListNodeValueFn'
        },

        panelNode: {
            setter: function(node) {
                _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "setter", 276);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 277);
node = Y.one(node);
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 278);
if (node) {
                    _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 279);
node.addClass(this._classNames.tabviewPanel);
                }
                _yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 281);
return node;
            },

            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null
        }
    },

    HTML_PARSER: {
        listNode  : function(node) {
            _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "listNode", 293);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 294);
return this.get('contentBox').one(this._queries.tabviewList);
        },
        panelNode : function() {
            _yuitest_coverfunc("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", "panelNode", 296);
_yuitest_coverline("/build/gallery-bootstrap-tabview/gallery-bootstrap-tabview.js", 297);
return this.get('contentBox').one(this._queries.tabviewPanel);
        }
    }
});



}, 'gallery-2012.08.22-20-00' ,{requires:['tabview']});
