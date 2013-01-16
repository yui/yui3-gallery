/**
 This module defines a plugin that creates up to three gallery-contextmenu-view instances on a single DataTable, each
 delegated to the contextmenu event on the THEAD, TBODY and TFOOT containers.

 @class Y.Plugin.DataTableContextMenu
 @since 3.8.0
 **/
function DtContextMenu(config) {
    DtContextMenu.superclass.constructor.apply(this, arguments);
}

/**
 *
 * @property NAME
 * @static
 * @type {String}
 * @default 'DtContextMenu'
 */
DtContextMenu.NAME = "DtContextMenu";


/**
 *
 * @property NS
 * @type {String}
 * @default 'contextmenu'
 * @static
 */
DtContextMenu.NS = "contextmenu";

DtContextMenu.ATTRS = {

    /**
     * @attribute tbodyMenu
     * @type Object
     * @default null
     */
    tbodyMenu : {
        value: null

    },

    /**
     * @attribute theadMenu
     * @type Object
     * @default null
     */
    theadMenu : {
        value: null
    },

    /**
     * @attribute tfootMenu
     * @type Object
     * @default null
     */
    tfootMenu : {
        value: null
    }
};

Y.extend(DtContextMenu, Y.Plugin.Base, {

    /**
     * @property theadCMenu
     * @type View
     * @default null
     */
    theadCMenu: null,

    /**
     * @property theadCMenu
     * @type View
     * @default null
     */
    tbodyCMenu: null,

    /**
     * @property theadCMenu
     * @type View
     * @default null
     */
    tfootCMenu: null,

    /**
     * @property _menuItemTemplate
     * @type String
     * @default See Code
     */
    _menuItemTemplate:  '<div class="yui3-contextmenu-menuitem" data-cmenu="{menuIndex}">{menuContent}</div>',

    /**
     * Called when this plugin is created.  If the DT has been rendered the Views will
     * be created, otherwise a listener is set to create them after DT "renderView" fires.
     *
     * @method initializer
     * @public
     */
    initializer: function() {
        var host = this.get('host'),
            hostCB = host.get('contentBox');

        if(hostCB && hostCB.one('.'+host.getClassName('data'))) {
            this._buildUI();
        }
        this.afterHostEvent("renderView", this._onHostRenderViewEvent);

    },

    /**
     * Destroys each of the View instances of the menu and nulls them out
     *
     * @method destructor
     * @public
     */
    destructor : function() {

        if(this.theadCMenu && this.theadCMenu.destroy) {
            this.theadCMenu.destroy({remove:true});
        }

        if(this.tbodyCMenu && this.tbodyCMenu.destroy) {
            this.tbodyCMenu.destroy({remove:true});
        }

        if(this.tfootCMenu && this.tfootCMenu.destroy) {
            this.tfootCMenu.destroy({remove:true});
        }

        this.theadCMenu = null;
        this.tbodyCMenu = null;
        this.tfootCMenu = null;

    },

    /**
     * This method constructs the three context-menu View instances for this DT if the
     * appropriate ATTRS are defined
     *
     * @method _buildUI
     * @private
     */
    _buildUI: function(){
        if(this.get('theadMenu')) {
            this._makeTheadCMenu();
        }

        if(this.get('tbodyMenu')) {
            this._makeTbodyCMenu();
        }

        if(this.get('tfootMenu')) {
            this._makeTfootCMenu();
        }

        this._initBuild = true;
    },


    /**
     * Creates the context menu on the DT's header components, based upon the
     * ATTR "tbodyMenu" settings.
     *
     * @method _makeTbodyCMenu
     * @private
     */
    _makeTbodyCMenu: function() {

        var mobj = {
            triggerNodeSel: '.'+this.get('host').getClassName('data'),
            triggerTarget: 'tr td',
            menuItemTemplate: this._menuItemTemplate
        };

        var cm = this._buildCMenu(mobj,'tbodyMenu');
        if(cm) {
            this.tbodyCMenu = cm;
            this.tbodyCMenu._overlayDY = 5;
        }
    },

    /**
     * Creates the context menu on the DT's header components, based upon the
     * ATTR "theadMenu" settings.
     *
     * @method _makeTheadCMenu
     * @private
     */
    _makeTheadCMenu: function() {

        var mobj = {
            triggerNodeSel: '.'+this.get('host').getClassName('columns'),
            triggerTarget: 'tr th',
            menuItemTemplate: this._menuItemTemplate
        };

        var cm = this._buildCMenu(mobj,'theadMenu');
        if(cm) {
            this.theadCMenu = cm;
            this.theadCMenu._overlayDY = 5;
        }
    },

    /**
     * Helper method that takes as input the gallery-contextmenu-view configuration object,
     * the passed-in ATTR (which includes replaceable parts of the config obj) and creates
     * the View instance returning it.
     *
     * @param menuObject {Object} Configuration object for the View
     * @param menuAttr {String} Name of the ATTR to load into the config object
     * @return {Y.ContextMenuView}
     * @private
     */
    _buildCMenu: function(menuObject, menuAttr){
        var host = this.get('host'),
            dtCB = host.get('contentBox'),
            menuCfg = this.get(menuAttr),
            cmenu;

        menuObject = Y.merge(menuObject,menuCfg);

        menuObject.trigger = {
            node:   dtCB.one( menuObject.triggerNodeSel ),
            target: menuObject.triggerTarget
        };
        delete menuObject.triggerNodeSel;
        delete menuObject.triggerTarget;

        cmenu = new Y.ContextMenuView(menuObject);

        return cmenu;

    },

    /**
     * This listener fires after DT's "renderView" event, which means that the DT has had
     * it's UI constructed and displayed.  We use it in case the implementer plugged in this
     * module to the DT before the render call.
     *
     * @method _onHostRenderViewEvent
     * @private
     */
    _onHostRenderViewEvent: function(){
        if(!this.theadCMenu && !this.tbodyCMenu && !this.theadCMenu) {
            this._buildUI();
        }
    }


});

Y.namespace("Plugin").DataTableContextMenu = DtContextMenu;

