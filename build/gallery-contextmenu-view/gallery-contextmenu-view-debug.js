YUI.add('gallery-contextmenu-view', function(Y) {

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
        var triggerC = this.get('trigger')['node'],
            triggerT = this.get('trigger')['target'];

        this._subscr = [];
        this._subscr.push( triggerC.delegate("contextmenu",this._onContextMenu, triggerT, this) );

        this._subscr.push( this.get('overlay').on("mouseleave",this.hideOverlay, this) );

        this._overlayDX = 5;
        this._overlayDY = 11;

        return this;
    },

    /**
     * Clean up listeners and destroys the Overlay
     * @method destructor
     * @protected
     */
    destructor: function(){
        Y.Array.each( this._subscr, function(item){
            item.detach();
        });
        this._subscr = null;

        if(this._subscrTarget) {
            this._subscrTarget.detach();
            this._subscrTarget = null;
        }

        if(this.get('overlay'))
            this.get('overlay').destroy();
    },

    /**
     *
     * @method render
     * @protected
     * @returns this
     * @chainable
     */
    render: function(){

        return this;
    },

    /**
     * Method that hides the Overlay for this contextmenu and fires the `contextMenuHide` event
     * @method hideOverlay
     * @public
     */
    hideOverlay: function(){
        if(!this.get('overlay')) return;
        this.fire('contextMenuHide');
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
        var cont  = this.get('container') || null,
            mtmpl = this.get('menuItemTemplate'),
            mitems = this.get('menuItems') || [];

        if(!cont) return false;

        cont.empty();

        var overlay = new Y.Overlay({
          srcNode: cont,
          visible: false,
          zIndex: 99,
          constrain: true
        });

        var bodyHTML = "";

        Y.Array.each( mitems, function(item,index){
            var menu = Y.Lang.sub(mtmpl,{
                menuClass:   item.className || "yui3-contextmenu-menuitem",
                menuIndex:   index,
                menuContent: (Y.Lang.isString(item)) ? item : item.label || "unknown"
            });
            bodyHTML += menu;
        });

        overlay.set('bodyContent',bodyHTML);
        overlay.render();

        return overlay;
    },

    /**
     * @method _onContextMenu
     * @param {EventTarget} e Y.Event target object created when "context" menu fires
     * @private
     */
    _onContextMenu: function(e){
        e.preventDefault();
        this._clearDOMSelection();

        //
        // Store the context "trigger" selection, who invoked the contextMenu
        //
        var contextTar = e.currentTarget;
        this.set('contextTarget', contextTar );

        //
        // Position and display the Overlay for the menu
        //
        this.get('overlay').set("xy", [e.pageX + this._overlayDX, e.pageY  + this._overlayDY] );
        //this.get('overlay').focus();
        this.get('overlay').show();

        //this._subscrTarget = contextTar.on("mouseleave",this.hideOverlay, this);

        this.fire("contextMenuShow",e);
    },

    /**
     * Process a "click" event on the Content Menu's Overlay menuItems
     * @param {EventTarget} e
     * @private
     */
    _selectMenuItem: function(e){
        var tar = e.target,
            menuData = +(tar.getData('cmenu')),
            menuItems = this.get('menuItems');

        if ( menuItems &&  menuItems.length>0 )
            this.set('selectedMenu', {
                evt:e,
                menuItem:menuItems[menuData],
                menuIndex:menuData
            });

        this.hideOverlay();
        this.fire("contextMenuHide",e);
    },

    /**
     * Helper method to clear DOM "selected" text or ranges
     * @method _clearDOMSelection
     * @private
     */
    _clearDOMSelection: function(){
        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection() : (Y.config.doc.selection) ? Y.config.doc.selection : null;
        if ( sel && sel.empty ) sel.empty();    // works on chrome
        if ( sel && sel.removeAllRanges ) sel.removeAllRanges();    // works on FireFox
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
           valueFn:   function(){return Y.Node.create(this.template);}
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
           validator:   function(v){ return v instanceof Y.Overlay;}
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
