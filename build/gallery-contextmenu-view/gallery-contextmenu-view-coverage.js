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
_yuitest_coverage["/build/gallery-contextmenu-view/gallery-contextmenu-view.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-contextmenu-view/gallery-contextmenu-view.js",
    code: []
};
_yuitest_coverage["/build/gallery-contextmenu-view/gallery-contextmenu-view.js"].code=["YUI.add('gallery-contextmenu-view', function(Y) {","","Y.ContextMenuView = Y.Base.create('contextmenu', Y.View, [],{","","    /**","     * Y.View's events static property, where we define a \"click\" listener on Nodes in the","     * container that are the MenuItem nodes.                    *","     * @property events","     * @type {Object}","     * @public","     */","    events:{","        '.yui3-contextmenu-menuitem' :{","            click: '_selectMenuItem'","        }","    },","","    /**","     * Default HTML template for the container's content         *","     * @property template","     * @type {String}","     * @default '<div class=\"yui3-contextmenu-overlay\"></div>'","     * @public","     */","    template: '<div class=\"yui3-contextmenu-overlay\"></div>',","","    /**","     * A placeholder to hold subscriber EventHandles so they can be destroyed properly","     * @property _subscr","     * @type {Array}","     * @default null","     * @protected","     */","    _subscr: null,","","    //_subscrTarget:null,","","    /**","     * Sets an increment that the Overlay box will be positioned relative to the e.target \"x-coordinate\"","     * @property _overlayDX","     * @type {Integer}","     * @default 5","     * @protected","     */","    _overlayDX: null,","","    /**","     * Sets an increment that the Overlay box will be positioned relative to the e.target \"y-coordinate\"","     * @property _overlayDY","     * @type {Integer}","     * @default 11","     * @protected","     */","    _overlayDY: null,","","    /**","     * Initializer where we define initial handlers to invoke this view and to hide the Overlay","     * @method initializer","     * @protected","     */","    initializer: function(){","        var triggerC = this.get('trigger')['node'],","            triggerT = this.get('trigger')['target'];","","        this._subscr = [];","        this._subscr.push( triggerC.delegate(\"contextmenu\",this._onContextMenu, triggerT, this) );","","        this._subscr.push( this.get('overlay').on(\"mouseleave\",this.hideOverlay, this) );","","        this._overlayDX = 5;","        this._overlayDY = 11;","","        return this;","    },","","    /**","     * Clean up listeners and destroys the Overlay","     * @method destructor","     * @protected","     */","    destructor: function(){","        Y.Array.each( this._subscr, function(item){","            item.detach();","        });","        this._subscr = null;","","        if(this._subscrTarget) {","            this._subscrTarget.detach();","            this._subscrTarget = null;","        }","","        if(this.get('overlay'))","            this.get('overlay').destroy();","    },","","    /**","     *","     * @method render","     * @protected","     * @returns this","     * @chainable","     */","    render: function(){","","        return this;","    },","","    /**","     * Method that hides the Overlay for this contextmenu and fires the `contextMenuHide` event","     * @method hideOverlay","     * @public","     */","    hideOverlay: function(){","        if(!this.get('overlay')) return;","        this.fire('contextMenuHide');","        this.get('overlay').hide();","        //if(this._subscrTarget) this._subscrTarget.detach();","    },","","    /**","     * Default value setter for attribute `overlay`, creates a Y.Overlay widget to display the menu within","     *","     * @method _valOverlay","     * @return {Y.Overlay}","     * @private","     */","    _valOverlay: function(){","        var cont  = this.get('container') || null,","            mtmpl = this.get('menuItemTemplate'),","            mitems = this.get('menuItems') || [];","","        if(!cont) return false;","","        cont.empty();","","        var overlay = new Y.Overlay({","          srcNode: cont,","          visible: false,","          zIndex: 99,","          constrain: true","        });","","        var bodyHTML = \"\";","","        Y.Array.each( mitems, function(item,index){","            var menu = Y.Lang.sub(mtmpl,{","                menuClass:   item.className || \"yui3-contextmenu-menuitem\",","                menuIndex:   index,","                menuContent: (Y.Lang.isString(item)) ? item : item.label || \"unknown\"","            });","            bodyHTML += menu;","        });","","        overlay.set('bodyContent',bodyHTML);","        overlay.render();","","        return overlay;","    },","","    /**","     * @method _onContextMenu","     * @param {EventTarget} e Y.Event target object created when \"context\" menu fires","     * @private","     */","    _onContextMenu: function(e){","        e.preventDefault();","        this._clearDOMSelection();","","        //","        // Store the context \"trigger\" selection, who invoked the contextMenu","        //","        var contextTar = e.currentTarget;","        this.set('contextTarget', contextTar );","","        //","        // Position and display the Overlay for the menu","        //","        this.get('overlay').set(\"xy\", [e.pageX + this._overlayDX, e.pageY  + this._overlayDY] );","        //this.get('overlay').focus();","        this.get('overlay').show();","","        //this._subscrTarget = contextTar.on(\"mouseleave\",this.hideOverlay, this);","","        this.fire(\"contextMenuShow\",e);","    },","","    /**","     * Process a \"click\" event on the Content Menu's Overlay menuItems","     * @param {EventTarget} e","     * @private","     */","    _selectMenuItem: function(e){","        var tar = e.target,","            menuData = +(tar.getData('cmenu')),","            menuItems = this.get('menuItems');","","        if ( menuItems &&  menuItems.length>0 )","            this.set('selectedMenu', {","                evt:e,","                menuItem:menuItems[menuData],","                menuIndex:menuData","            });","","        this.hideOverlay();","        this.fire(\"contextMenuHide\",e);","    },","","    /**","     * Helper method to clear DOM \"selected\" text or ranges","     * @method _clearDOMSelection","     * @private","     */","    _clearDOMSelection: function(){","        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;","        if ( sel && sel.empty ) sel.empty();    // works on chrome","        if ( sel && sel.removeAllRanges ) sel.removeAllRanges();    // works on FireFox","    }","","","    /**","     * Fired after the \"contextmenu\" event is initiated and the Menu has been positioned and displayed","     * @event contextMenuShow","     * @param {EventTarget} e","     */","","    /**","     * Fired after a Menu choice has been selected from the ContexMenu and the menu has been hidden","     * @event contextMenuHide","     * @param {EventTarget} e","     */","","},{","   ATTRS:{","","       /**","        * Container Node where the menu's Overlay will be rendered into","        * @attribute container","        * @type {Node}","        */","       container:{","           valueFn:   function(){return Y.Node.create(this.template);}","       },","","       /**","        * Defines the container element for the \"contextmenu\" event listener to attach this menu to.","        * @attribute trigger","        * @type {Object} trigger Container object to listen for \"contextmenu\" event on","        * @type {Node} trigger.node Container node to listen on (i.e. delegation container) for \"contextmenu\"","        * @type {String} trigger.target Container filter selector to assign target from container event","        * @default null","        */","       trigger: {","           value:  {node:null, target:''}","       },","","       /**","        * Set to the returned target within the `trigger.node` container that the \"contextmenu\" event was initiated on","        * (e.g. for a DataTable this may be a specific TR row within the table body).","        *","        * This is not intended to be .set by the user, but is meant to be read by users.","        *","        * @attribute contextTarget","        * @type {Node}","        * @default null","        */","       contextTarget:{","           value:   null","       },","","       /**","        * Overrideable HTML template to use for creating each `menuItem` entry in Overlay.","        * Must include \"data-cmenu\"","        *","        * @attribute menuItemTemplate","        * @type {String}","        * @default '<div class=\"{menuClass}\" data-cmenu=\"{menuIndex}\">{menuContent}</div>'","        */","       menuItemTemplate:{","           value: '<div class=\"yui3-contextmenu-menuitem {menuClass}\" data-cmenu=\"{menuIndex}\">{menuContent}</div>'","       },","","       /**","        * Array of \"menu\" item {Objects} to add to the Menu.  Each item is an object, including the following;","        *   content, dataValue","        *","        * @attribute menuItems","        * @type {Array}","        * @default []","        */","       menuItems:{","           value:       [],","           validator:   Y.Lang.isArray","       },","","       /**","        * Y.Overlay instance used to render the pop-up context menu within","        *","        * @attribute overlay","        * @type Y.Overlay","        * @default '_valOverlay'","        */","       overlay: {","           valueFn:     '_valOverlay',","           writeOnce:   true,","           validator:   function(v){ return v instanceof Y.Overlay;}","       },","","       /**","        * Set to the \"selected\" item from the pop-up Overlay menu when clicked by user, where this","        * attribute is set to an object containing the EventTarget of the selection and the resulting","        * menuitem that that corresponds to.","        *","        * This is not intended to be .set by the user, but is meant to be read by users.","        *","        * @attribute selectedMenu","        * @type {Object} obj","        * @param {EventTarget} obj.evt Event target from \"click\" selection within displayed Overlay","        * @param {Object} obj.menuItem Menuitem object entry selected from `menuItems` array","        */","       selectedMenu: {","           value: null","       }","   }","});","","","}, 'gallery-2012.09.05-20-01' ,{skinnable:true, requires:['base-build','view', 'overlay', 'event-mouseenter']});"];
_yuitest_coverage["/build/gallery-contextmenu-view/gallery-contextmenu-view.js"].lines = {"1":0,"3":0,"62":0,"65":0,"66":0,"68":0,"70":0,"71":0,"73":0,"82":0,"83":0,"85":0,"87":0,"88":0,"89":0,"92":0,"93":0,"105":0,"114":0,"115":0,"116":0,"128":0,"132":0,"134":0,"136":0,"143":0,"145":0,"146":0,"151":0,"154":0,"155":0,"157":0,"166":0,"167":0,"172":0,"173":0,"178":0,"180":0,"184":0,"193":0,"197":0,"198":0,"204":0,"205":0,"214":0,"215":0,"216":0,"241":0,"305":0};
_yuitest_coverage["/build/gallery-contextmenu-view/gallery-contextmenu-view.js"].functions = {"initializer:61":0,"(anonymous 2):82":0,"destructor:81":0,"render:103":0,"hideOverlay:113":0,"(anonymous 3):145":0,"_valOverlay:127":0,"_onContextMenu:165":0,"_selectMenuItem:192":0,"_clearDOMSelection:213":0,"valueFn:241":0,"validator:305":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-contextmenu-view/gallery-contextmenu-view.js"].coveredLines = 49;
_yuitest_coverage["/build/gallery-contextmenu-view/gallery-contextmenu-view.js"].coveredFunctions = 13;
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 1);
YUI.add('gallery-contextmenu-view', function(Y) {

_yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 3);
Y.ContextMenuView = Y.Base.create('contextmenu', Y.View, [],{

    /**
     * Y.View's events static property, where we define a "click" listener on Nodes in the
     * container that are the MenuItem nodes.                    *
     * @property events
     * @type {Object}
     * @public
     */
    events:{
        '.yui3-contextmenu-menuitem' :{
            click: '_selectMenuItem'
        }
    },

    /**
     * Default HTML template for the container's content         *
     * @property template
     * @type {String}
     * @default '<div class="yui3-contextmenu-overlay"></div>'
     * @public
     */
    template: '<div class="yui3-contextmenu-overlay"></div>',

    /**
     * A placeholder to hold subscriber EventHandles so they can be destroyed properly
     * @property _subscr
     * @type {Array}
     * @default null
     * @protected
     */
    _subscr: null,

    //_subscrTarget:null,

    /**
     * Sets an increment that the Overlay box will be positioned relative to the e.target "x-coordinate"
     * @property _overlayDX
     * @type {Integer}
     * @default 5
     * @protected
     */
    _overlayDX: null,

    /**
     * Sets an increment that the Overlay box will be positioned relative to the e.target "y-coordinate"
     * @property _overlayDY
     * @type {Integer}
     * @default 11
     * @protected
     */
    _overlayDY: null,

    /**
     * Initializer where we define initial handlers to invoke this view and to hide the Overlay
     * @method initializer
     * @protected
     */
    initializer: function(){
        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "initializer", 61);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 62);
var triggerC = this.get('trigger')['node'],
            triggerT = this.get('trigger')['target'];

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 65);
this._subscr = [];
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 66);
this._subscr.push( triggerC.delegate("contextmenu",this._onContextMenu, triggerT, this) );

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 68);
this._subscr.push( this.get('overlay').on("mouseleave",this.hideOverlay, this) );

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 70);
this._overlayDX = 5;
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 71);
this._overlayDY = 11;

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 73);
return this;
    },

    /**
     * Clean up listeners and destroys the Overlay
     * @method destructor
     * @protected
     */
    destructor: function(){
        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "destructor", 81);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 82);
Y.Array.each( this._subscr, function(item){
            _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "(anonymous 2)", 82);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 83);
item.detach();
        });
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 85);
this._subscr = null;

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 87);
if(this._subscrTarget) {
            _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 88);
this._subscrTarget.detach();
            _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 89);
this._subscrTarget = null;
        }

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 92);
if(this.get('overlay'))
            {_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 93);
this.get('overlay').destroy();}
    },

    /**
     *
     * @method render
     * @protected
     * @returns this
     * @chainable
     */
    render: function(){

        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "render", 103);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 105);
return this;
    },

    /**
     * Method that hides the Overlay for this contextmenu and fires the `contextMenuHide` event
     * @method hideOverlay
     * @public
     */
    hideOverlay: function(){
        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "hideOverlay", 113);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 114);
if(!this.get('overlay')) {return;}
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 115);
this.fire('contextMenuHide');
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 116);
this.get('overlay').hide();
        //if(this._subscrTarget) this._subscrTarget.detach();
    },

    /**
     * Default value setter for attribute `overlay`, creates a Y.Overlay widget to display the menu within
     *
     * @method _valOverlay
     * @return {Y.Overlay}
     * @private
     */
    _valOverlay: function(){
        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "_valOverlay", 127);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 128);
var cont  = this.get('container') || null,
            mtmpl = this.get('menuItemTemplate'),
            mitems = this.get('menuItems') || [];

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 132);
if(!cont) {return false;}

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 134);
cont.empty();

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 136);
var overlay = new Y.Overlay({
          srcNode: cont,
          visible: false,
          zIndex: 99,
          constrain: true
        });

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 143);
var bodyHTML = "";

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 145);
Y.Array.each( mitems, function(item,index){
            _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "(anonymous 3)", 145);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 146);
var menu = Y.Lang.sub(mtmpl,{
                menuClass:   item.className || "yui3-contextmenu-menuitem",
                menuIndex:   index,
                menuContent: (Y.Lang.isString(item)) ? item : item.label || "unknown"
            });
            _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 151);
bodyHTML += menu;
        });

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 154);
overlay.set('bodyContent',bodyHTML);
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 155);
overlay.render();

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 157);
return overlay;
    },

    /**
     * @method _onContextMenu
     * @param {EventTarget} e Y.Event target object created when "context" menu fires
     * @private
     */
    _onContextMenu: function(e){
        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "_onContextMenu", 165);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 166);
e.preventDefault();
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 167);
this._clearDOMSelection();

        //
        // Store the context "trigger" selection, who invoked the contextMenu
        //
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 172);
var contextTar = e.currentTarget;
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 173);
this.set('contextTarget', contextTar );

        //
        // Position and display the Overlay for the menu
        //
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 178);
this.get('overlay').set("xy", [e.pageX + this._overlayDX, e.pageY  + this._overlayDY] );
        //this.get('overlay').focus();
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 180);
this.get('overlay').show();

        //this._subscrTarget = contextTar.on("mouseleave",this.hideOverlay, this);

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 184);
this.fire("contextMenuShow",e);
    },

    /**
     * Process a "click" event on the Content Menu's Overlay menuItems
     * @param {EventTarget} e
     * @private
     */
    _selectMenuItem: function(e){
        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "_selectMenuItem", 192);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 193);
var tar = e.target,
            menuData = +(tar.getData('cmenu')),
            menuItems = this.get('menuItems');

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 197);
if ( menuItems &&  menuItems.length>0 )
            {_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 198);
this.set('selectedMenu', {
                evt:e,
                menuItem:menuItems[menuData],
                menuIndex:menuData
            });}

        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 204);
this.hideOverlay();
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 205);
this.fire("contextMenuHide",e);
    },

    /**
     * Helper method to clear DOM "selected" text or ranges
     * @method _clearDOMSelection
     * @private
     */
    _clearDOMSelection: function(){
        _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "_clearDOMSelection", 213);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 214);
var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 215);
if ( sel && sel.empty ) {sel.empty();}    // works on chrome
        _yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 216);
if ( sel && sel.removeAllRanges ) {sel.removeAllRanges();}    // works on FireFox
    }


    /**
     * Fired after the "contextmenu" event is initiated and the Menu has been positioned and displayed
     * @event contextMenuShow
     * @param {EventTarget} e
     */

    /**
     * Fired after a Menu choice has been selected from the ContexMenu and the menu has been hidden
     * @event contextMenuHide
     * @param {EventTarget} e
     */

},{
   ATTRS:{

       /**
        * Container Node where the menu's Overlay will be rendered into
        * @attribute container
        * @type {Node}
        */
       container:{
           valueFn:   function(){_yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "valueFn", 241);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 241);
return Y.Node.create(this.template);}
       },

       /**
        * Defines the container element for the "contextmenu" event listener to attach this menu to.
        * @attribute trigger
        * @type {Object} trigger Container object to listen for "contextmenu" event on
        * @type {Node} trigger.node Container node to listen on (i.e. delegation container) for "contextmenu"
        * @type {String} trigger.target Container filter selector to assign target from container event
        * @default null
        */
       trigger: {
           value:  {node:null, target:''}
       },

       /**
        * Set to the returned target within the `trigger.node` container that the "contextmenu" event was initiated on
        * (e.g. for a DataTable this may be a specific TR row within the table body).
        *
        * This is not intended to be .set by the user, but is meant to be read by users.
        *
        * @attribute contextTarget
        * @type {Node}
        * @default null
        */
       contextTarget:{
           value:   null
       },

       /**
        * Overrideable HTML template to use for creating each `menuItem` entry in Overlay.
        * Must include "data-cmenu"
        *
        * @attribute menuItemTemplate
        * @type {String}
        * @default '<div class="{menuClass}" data-cmenu="{menuIndex}">{menuContent}</div>'
        */
       menuItemTemplate:{
           value: '<div class="yui3-contextmenu-menuitem {menuClass}" data-cmenu="{menuIndex}">{menuContent}</div>'
       },

       /**
        * Array of "menu" item {Objects} to add to the Menu.  Each item is an object, including the following;
        *   content, dataValue
        *
        * @attribute menuItems
        * @type {Array}
        * @default []
        */
       menuItems:{
           value:       [],
           validator:   Y.Lang.isArray
       },

       /**
        * Y.Overlay instance used to render the pop-up context menu within
        *
        * @attribute overlay
        * @type Y.Overlay
        * @default '_valOverlay'
        */
       overlay: {
           valueFn:     '_valOverlay',
           writeOnce:   true,
           validator:   function(v){ _yuitest_coverfunc("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", "validator", 305);
_yuitest_coverline("/build/gallery-contextmenu-view/gallery-contextmenu-view.js", 305);
return v instanceof Y.Overlay;}
       },

       /**
        * Set to the "selected" item from the pop-up Overlay menu when clicked by user, where this
        * attribute is set to an object containing the EventTarget of the selection and the resulting
        * menuitem that that corresponds to.
        *
        * This is not intended to be .set by the user, but is meant to be read by users.
        *
        * @attribute selectedMenu
        * @type {Object} obj
        * @param {EventTarget} obj.evt Event target from "click" selection within displayed Overlay
        * @param {Object} obj.menuItem Menuitem object entry selected from `menuItems` array
        */
       selectedMenu: {
           value: null
       }
   }
});


}, 'gallery-2012.09.05-20-01' ,{skinnable:true, requires:['base-build','view', 'overlay', 'event-mouseenter']});
