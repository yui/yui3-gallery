/**
 This module includes a Y.View class extension that attaches to an existing "trigger" Node and uses event delegation to listen
 for "contextmenu" requests (i.e. right-click). When the context menu is invoked, a Y.Overlay object is rendered and displayed
 that includes user-defined menu items that are related to the context where the menu was invoked.

 This view utilizes several attributes and fires several events that users can listen to in order to take specific actions based
 on the "trigger target" node.
 
 Please refer to the [trigger](#attr_trigger) ATTRIBUTE for more description of the target.node and target.trigger.

 #####Usage
 To configure a bare-bones basic contextmenu, you need to provide the `trigger` and `menuItems` attributes as;

     var cmenu = new Y.ContextMenuView({
        trigger: {
            node:   Y.one(".myExistingContainer"),
            target:  'li'
        },
        menuItems: [ "Add", "Edit", "Delete" ]
    });

 The `menuItems` can be simple entries or Objects, if they are Objects the "label" property will be used to fill the visible Menu (See [menuItems](#attr_menuItems)).
 
 #####Attributes / Events
 An implementer is typically interested in listening to the following ATTRIBUTE "change" events;
 <ul>
   <li>`selectedMenuChange` : which fires when a contextmenu choice is clicked (see [selectedMenu](#attr_selectedMenu))</li>
   <li>`contextTargetChange`: which fires when the user "right-clicks" on the target.node (see [contextTarget](#attr_contextTarget))</li>
 </ul>

 Additionally, see the [Events](#events) section for more information on available events.

 @module contextmenu
 @class Y.ContextMenuView
 @constructor
 **/
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
     * Handler for right-click event (actually "contextmenu" event) on `trigger.node`.
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
        this._set('contextTarget', contextTar );

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
     * Fired after the "contextmenu" event is initiated and the Menu has been positioned and displayed
     * @event contextMenuShow
     * @param {EventTarget} e
     */


    /**
     * Process a "click" event on the Content Menu's Overlay menuItems
     *
     * @method _selectMenuItem
     * @param {EventTarget} e
     * @private
     */
    _selectMenuItem: function(e){
        var tar = e.target,
            menuData = +(tar.getData('cmenu')),
            menuItems = this.get('menuItems');

        if ( menuItems &&  menuItems.length>0 )
            this._set('selectedMenu', {
                evt:e,
                menuItem:menuItems[menuData],
                menuIndex:menuData
            });

        this.hideOverlay();
        this.fire("contextMenuHide",e);
        this.fire("select",e);
    },

	/**
	 * Fires when a selection is "clicked" from within the pop-up menu 
	 * (a better approach is to listen on attribute [selectedMenu](#attr_selectedMenu) for "change")
	 * 
	 * @event select
	 * @param {EventTarget} e
	 **/

    /**
     * Fired after a Menu choice has been selected from the ContexMenu and the menu has been hidden
     * @event contextMenuHide
     * @param {EventTarget} e
     */

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

},{
   ATTRS:{

       /**
        * Container Node where the menu's Overlay will be rendered into.  If not provided, the
        * default will create a container from the [template](#property_template) setting.
        *
        * This is usually only set when the user has a specific Overlay container design they
        * wish to utilize.
        *
        * @attribute container
        * @type {Node}
        * @default Y.Node.create(this.template)
        */
       container:{
           valueFn:   function(){return Y.Node.create(this.template);}
       },

       /**
        * Defines the container element for the "contextmenu" event listener to attach this menu to.
        * <br/><br/>This {Object} must contain the following;<br/>
        * <ul>
        *   <li>`node` {Node} the Node instance that will have a delegated "contextmenu" listener 
        attached to it</li>
            <li>`target` {String} A CSS selector for the "target" sub-element (child of trigger.node) that will be used for the delegation and will be returned from attribute "contextTarget"</li>
        * </ul>
        *
		*
        * @example
        *       // This will define the trigger node (to accept right-clicks) as a DataTable's THEAD
        *       //  element and the target as the TH nodes.
        *       trigger : {
        *           node:   myDataTable.get('srcNode').one('thead .yui3-datatable-columns'),
        *           target: "th"
        *       }
        *
        *
        * @attribute trigger
        * @type {Object} trigger Container object to listen for "contextmenu" event on
        * @type {Node} trigger.node Container node to listen on (i.e. delegation container) for "contextmenu"
        * @type {String} trigger.target Container filter selector to assign target from container event
        * @default {node:null, target:''}
        */
       trigger: {
           value:  {node:null, target:''},
           writeOnce: true
       },

       /**
        * Set to the returned target within the `trigger.node` container that the "contextmenu" event was initiated on
        * (e.g. for a DataTable this may be a specific TR row within the table body).
        *
        * @attribute contextTarget
        * @type {Node}
        * @default null
        * @readonly
        */
       contextTarget:{
           value:   null,
           readOnly: true
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
        * Array of "menu" items as either {Strings} or {Objects} to add to the Menu.  
        * 
        * When {Objects} are included, as a minimum they must include a `label` property that contains the text to display in the menu.
        * @example
        *	menuItems: [ "one", "two", "three", "four" ]
        *	menuItems: [ "Insert", "Update", {label:"Delete", confirm:true}, "... More" ]
        *	menuItems: [ {label:"Foo", value:100}, {label:"Bar", value:105}, {label:"Baz", value:200} ]
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
        * **Default:** See [_valOverlay](#method__valOverlay) 
        * @attribute overlay
        * @type Y.Overlay 
        */
       overlay: {
           valueFn:     '_valOverlay',
           writeOnce:   true,
           validator:   function(v){ return v instanceof Y.Overlay;}
       },

       /**
        * Set to the "selected" item from the pop-up Overlay menu when clicked by user, where this
        * attribute is set to an object containing the EventTarget of the selection and the resulting
        * menuitem and menuindex that corresponds to the selection.
        *
        * This is set by the method [_selectMenuItem](#method__selectMenuItem).
        *
        * Set to an {Object} with the following properties;
        *   <ul>
        *   <li>`evt` Event target from "click" selection within displayed Overlay</li>
        *   <li>`menuItem` Menuitem object entry selected from `menuItems` array</li>
        *   <li>`menuIndex` Index of current Menuitem object within the [menuItems](#attr_menuItems) attribute array</li>
        *   </ul>
	    *
	    * @example
	    *	// If the 'selectedMenu' was set to the 2nd item from the following menuItems setting ...
	    *	myCmenu.set('menuItems',[ {label:"Foo", value:100}, {label:"Bar", value:105}, {label:"Baz", value:200} ]);
	    *	
	    *	// ... user clicks 2nd item,
	    *	myCmenu.get('selectedMenu') 
	    *	// returns {evt:'event stuff object', menuItem:{label:"Bar", value:105}, menuIndex:1 }   
        *
        * @attribute selectedMenu
        * @type {Object} obj
        * @readonly
        */
       selectedMenu: {
           value: null,
           readOnly: true
       }
   }
});
