YUI.add('gallery-itsatabkeymanager', function (Y, NAME) {

'use strict';
//==============================================================================
//==============================================================================
 //
// WHILE THE SMUGMUG-FUCUSMANAGER IS NOT IN THE GALLREY, WE NEED TO DEFINE THOSE METHODS HERE
//
// SHOULD BE REMOVED ONCE THE SMUGMUG FOCUSMANAGER IS AVAILABLE IN THE GALLERY
//
//==============================================================================
//==============================================================================
function FocusManager() {
    FocusManager.superclass.constructor.apply(this, arguments);
}

Y.extend(FocusManager, Y.Plugin.Base, {

    keyCodeMap: {
        32: 'space',
        33: 'pgup',
        34: 'pgdown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },

    preventDefaultMap: {
        down  : 1,
        end   : 1,
        home  : 1,
        left  : 1,
        pgdown: 1,
        pgup  : 1,
        right : 1,
        space : 1,
        up    : 1
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        this._host = config.host;

        this._attachEvents();
        this.refresh();
    },

    destructor: function () {
        this._detachEvents();
    },

    // -- Public Methods -------------------------------------------------------

    ascend: function () {
        var container = this._getActiveContainer(),
            host      = this._host,
            parentItem;

        if (container === host) {
            return null;
        }

        parentItem = container.ancestor(this.get('itemSelector'), false, function (node) {
            // Stop ascending if we reach the host.
            return node === host;
        });

        this.set('activeItem', parentItem, {src: 'ascend'});

        return parentItem;
    },

    descend: function () {
        var activeItem                = this.get('activeItem'),
            anchoredContainerSelector = this.get('anchoredContainerSelector'),
            container;

        if (!anchoredContainerSelector || !activeItem) {
            return null;
        }

        container = activeItem.one(anchoredContainerSelector);

        return container ? this.first({container: container}) : null;
    },

    first: function (options) {
        options = options || {};

        // Get the first item that isn't disabled.
        var container        = options.container || this.get('host'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            item             = container.one(this.get('anchoredItemSelector'));

        while (item && disabledSelector && item.test(disabledSelector)) {
            item = item.next(itemSelector);
        }

        if (!options.silent) {
            this.set('activeItem', item, {src: 'first'});
        }

        return item;
    },

    last: function (options) {
        options = options || {};

        var container        = options.container || this._host,
            disabledSelector = this.get('disabledSelector'),
            items            = container.all(this.get('anchoredItemSelector')),
            item             = items.pop();

        while (item && disabledSelector && item.test(disabledSelector)) {
            item = items.pop();
        }

        if (!options.silent) {
            this.set('activeItem', item, {src: 'last'});
        }

        return item;
    },

    next: function (options) {
        options = options || {};

        var activeItem = this.get('activeItem'),
            disabledSelector, itemSelector, nextItem;

        if (!activeItem) {
            return null;
        }

        disabledSelector = this.get('disabledSelector');
        itemSelector     = this.get('itemSelector');
        nextItem         = activeItem.next(itemSelector);

        // Get the next sibling that matches the itemSelector and isn't
        // disabled.
        while (nextItem && disabledSelector && nextItem.test(disabledSelector)) {
            nextItem = nextItem.next(itemSelector);
        }

        if (nextItem) {
            if (!options.silent) {
                this.set('activeItem', nextItem, {src: 'next'});
            }
        } else {
            // If there is no next sibling and the `circular` attribute is
            // truthy, then focus the first item in this container.
            if (this.get('circular')) {
                nextItem = this.first(Y.merge(options, {
                    container: this._getActiveContainer(activeItem)
                }));
            }
        }

        return nextItem || activeItem;
    },

    previous: function (options) {
        options = options || {};

        var activeItem = this.get('activeItem'),
            disabledSelector, itemSelector, prevItem;

        if (!activeItem) {
            return null;
        }

        disabledSelector = this.get('disabledSelector');
        itemSelector     = this.get('itemSelector');
        prevItem         = activeItem.previous(itemSelector);

        // Get the previous sibling that matches the itemSelector and isn't
        // disabled.
        while (prevItem && disabledSelector && prevItem.test(disabledSelector)) {
            prevItem = prevItem.previous(itemSelector);
        }

        if (prevItem) {
            if (!options.silent) {
                this.set('activeItem', prevItem, {src: 'previous'});
            }
        } else {
            // If there is no previous sibling and the `circular` attribute is
            // truthy, then focus the last item in this container.
            prevItem = this.last(Y.merge(options, {
                container: this._getActiveContainer(activeItem)
            }));
        }

        return prevItem || activeItem;
    },

    refresh: function (container) {
        var activeItem       = this.get('activeItem'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get(container ? 'anchoredItemSelector' : 'itemSelector');

        (container || this._host).all(itemSelector).each(function (node) {
            if (disabledSelector && node.test(disabledSelector)) {
                node.removeAttribute('tabIndex');
            } else {
                node.set('tabIndex', node === activeItem ? 0 : -1);
            }
        });

        return this;
    },

    _attachEvents: function () {
        var host = this._host;

        this._events = [
            host.on('keydown', this._onKeyDown, this),
            host.after('blur', this._afterBlur, this),
            host.after('focus', this._afterFocus, this),

            this.after({
                activeItemChange: this._afterActiveItemChange
            })
        ];
    },

    _detachEvents: function () {
        new Y.EventHandle(this._events).detach();
    },

    _getActiveContainer: function (activeItem) {
        var containerSelector = this.get('containerSelector'),
            host              = this._host,
            container;

        if (!containerSelector) {
            return host;
        }

        if (!activeItem) {
            activeItem = this.get('activeItem');
        }

        if (!activeItem) {
            return host;
        }

        container = activeItem.ancestor(containerSelector, false, function (node) {
            // Stop the search if we reach the host node.
            return node === host;
        });

        return container || host;
    },

    _getAnchoredContainerSelector: function (value) {
        if (value) {
            return value;
        }

        var containerSelector = this.get('containerSelector');

        if (containerSelector) {
            return '>' + containerSelector;
        }

        return null;
    },

    _getAnchoredItemSelector: function (value) {
        if (value) {
            return value;
        }

        return '>' + this.get('itemSelector');
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterActiveItemChange: function (e) {
        var newVal  = e.newVal,
            prevVal = e.prevVal;

        if (prevVal) {
            prevVal.set('tabIndex', -1);
        }

        if (newVal) {
            newVal.set('tabIndex', 0);

            if (this.get('focused')) {
                newVal.focus();
            }
        }
    },

    _afterBlur: function () {
        this._set('focused', false);
    },

    _afterFocus: function (e) {
        var target = e.target;
        this._set('focused', true);
        if (target !== this._host && target.test(this.get('itemSelector'))) {
            this.set('activeItem', target, {src: 'focus'});
        }
    },

    _onKeyDown: function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }

        var key    = this.keyCodeMap[e.keyCode] || e.keyCode,
            keys   = this.get('keys'),
            action = keys[key] || keys[e.keyCode];

        if (action) {
            if (this.preventDefaultMap[key]) {
                e.preventDefault();
            }

            if (typeof action === 'string') {
                this[action].call(this);
            } else {
                action.call(this);
            }
        }
    }
}, {
    NAME: 'focusManager',
    NS  : 'focusManager',

    ATTRS: {
        activeItem: {
            valueFn: function () {
                // TODO: Need to be smarter about choosing the default
                // activeItem. Old FocusManager defaults to the first item with
                // tabIndex === 0, if there is one.
                return this.first();
            }
        },

        anchoredContainerSelector: {
            getter: '_getAnchoredContainerSelector'
        },

        anchoredItemSelector: {
            getter: '_getAnchoredItemSelector'
        },

        circular: {
            value: true
        },

        containerSelector: {},

        disabledSelector: {
            value: '[aria-disabled="true"], [aria-hidden="true"], [disabled]'
        },

        focused: {
            readOnly: true,
            value   : false
        },

        itemSelector: {
            value: '*'
        },

        keys: {
            cloneDefaultValue: 'shallow',

            value: {
                down : 'next',
                left : 'ascend',
                right: 'descend',
                up   : 'previous'
            }
        }
    }
});

Y.namespace('Plugin').FocusManager = FocusManager;
//==============================================================================
//==============================================================================
 //
// END OF DEFINITION SMUGMUG FOCUSMANAGER
//
//==============================================================================
//==============================================================================

/**
 * ITSAScrollViewKeyNav Plugin
 *
 *
 * Plugin that enables scrollview-navigation with keys.
 *
 * In order to response to key-events, the scrollview-instance needs to have focus. This can be set either by myScrollView.focus() -or blur()-
 * or by setting the attribute 'initialFocus' to true. The plugin also works when Plugin.ScrollViewPaginator is plugged-in. The behaviour will be
 * different, because the scrolling is paginated in that case.
 *
 *
 * If this plugin is plugged into a Y.ITSAScrollViewModellist-instance, then the keynavigation will scroll through the items in case
 * the attribute 'modelsSelectable' is set to true.
 *
 *
 * @module gallery-itsascrollviewkeynav
 * @class ITSAScrollViewKeyNav
 * @extends Plugin.Base
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// -- Public Static Properties -------------------------------------------------

/**
 * Internal list that holds event-references
 * @property _eventhandlers
 * @private
 * @type Array
 */

/**
 * The plugin's host, which should be a ScrollView-instance
 * @property host
 * @type ScrollView-instance
 */

var YArray = Y.Array,
    DEFAULT_ITEM_SELECTOR = '.focusable',
    FORMELEMENT_CLASS = 'yui3-itsaformelement',
    ITSAFORMELEMENT_SELECTONFOCUS_CLASS = FORMELEMENT_CLASS + '-selectall',
    ITSAFORMELEMENT_FIRSTFOCUS_CLASS = FORMELEMENT_CLASS + '-firstfocus';


Y.namespace('Plugin').ITSATabKeyManager = Y.Base.create('itsatabkeymanager', Y.Plugin.FocusManager, [], {

        /**
         * Internal list that holds event-references
         * @property _eventhandlers
         * @private
         * @type Array
         */
        _eventhandlers : [],

        /**
         * The plugin's host, which should be a ScrollView-instance
         * @property host
         * @type Y.Node
         */
        host : null,

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
         * @since 0.1
         */
        initializer : function() {
            var instance = this,
                host;

            instance.host = host = instance.get('host');
            instance._bindUI();
            instance.set('keys', {});
            instance.set('circular', true);
        },

        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
         * @since 0.1
        */
        destructor : function() {
            this._clearEventhandlers();
        },

        /**
         * Focuses and returns the first focusable item.
         *
         * @method first
         * @param {Object} [options] Options.
         *   @param {Node} [options.container] Descendant container to restrict the
         *       search to. Defaults to the host node.
         *   @param {Boolean} [options.silent=false] If `true`, the item will be
         *       returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there are no focusable items.
        **/

        first: function (options) {
            options = options || {};

            var instance         = this,
                container        = instance.get('host'),
                disabledSelector = instance.get('disabledSelector'),
                itemSelector     = options.selector || instance.get('itemSelector'),
                item             = container.one(itemSelector),
                i                = 0,
                allItems;

            while (item && disabledSelector && item.test(disabledSelector)) {
                allItems = allItems || container.all(itemSelector);
                item = (++i<allItems.size()) ? allItems.item(i) : null;
            }
            if (!options.silent) {
                instance.set('activeItem', item, {src: 'first'});
            }
            return item;

        },

        /**
         * Focus the initial node (first node that should be selected)
         *
         * @method focusInitialItem
         * @since 0.1
         *
        */
        focusInitialItem : function() {
            var instance = this,
                focusitem;

            focusitem = instance.first({selector: '.'+ITSAFORMELEMENT_FIRSTFOCUS_CLASS}) || instance.first();
            if (focusitem) {
                focusitem.focus();
                instance._selectNode(focusitem);
            }
        },

        /**
         * Focuses and returns the last focusable item.
         *
         * @method last
         * @param {Object} [options] Options.
         *     @param {Node} [options.container] Descendant container to restrict the
         *         search to. Defaults to the host node.
         *     @param {Boolean} [options.silent=false] If `true`, the item will be
         *         returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there are no focusable items.
        **/
        last: function (options) {
            var instance         = this,
                container        = instance._host,
                disabledSelector = instance.get('disabledSelector'),
                allItems         = container.all(instance.get('itemSelector')),
                i                = allItems.size() - 1,
                item             = allItems.pop();

            options = options || {};
            while (item && disabledSelector && item.test(disabledSelector)) {
                item = (--i>=0) ? allItems.item(i) : null;
            }

            if (!options.silent) {
                instance.set('activeItem', item, {src: 'last'});
            }

            return item;
        },

        /**
         * Focuses and returns the next focusable sibling of the current `activeItem`.
         *
         * If there is no focusable next sibling and the `circular` attribute is
        `* false`, the current `activeItem` will be returned.
         *
         * @method next
         * @param {Object} [options] Options.
         *     @param {Boolean} [options.silent=false] If `true`, the item will be
         *         returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there is no `activeItem`.
        **/
        next: function (options) {
            var instance         = this,
                container        = instance._host,
                activeItem       = instance.get('activeItem'),
                disabledSelector, nextItem, index, itemSize, allItems;

            options = options || {};
            if (!activeItem) {
                return instance.first(options);
            }
            disabledSelector = instance.get('disabledSelector');
            allItems = container.all(instance.get('itemSelector'));
            itemSize = allItems.size();
            index = allItems.indexOf(activeItem);
            nextItem = (++index<itemSize) ? allItems.item(index) : null;
            // Get the next item that matches the itemSelector and isn't
            // disabled.
            while (nextItem && disabledSelector && nextItem.test(disabledSelector)) {
                nextItem = (++index<itemSize) ? allItems.item(index) : null;
            }
            if (nextItem) {
                if (!options.silent) {
                    this.set('activeItem', nextItem, {src: 'next'});
                }
            } else {
                // If there is no next item and the `circular` attribute is
                // truthy, then focus the first item in this container.
                if (this.get('circular')) {
                    nextItem = instance.first(options);
                }
            }
            return nextItem || activeItem;
        },

        /**
         * Focuses and returns the previous focusable sibling of the current
         * `activeItem`.
         *
         * If there is no focusable previous sibling and the `circular` attribute is
         * `false`, the current `activeItem` will be returned.
         *
         * @method previous
         * @param {Object} [options] Options.
         *     @param {Boolean} [options.silent=false] If `true`, the item will be
         *         returned, but will not become the active item.
         * @return {Node|null} Focused node, or `null` if there is no `activeItem`.
        **/
        previous: function (options) {
            var instance         = this,
                container        = instance._host,
                activeItem       = instance.get('activeItem'),
                disabledSelector, prevItem, index, allItems;

            options = options || {};
            if (!activeItem) {
                return instance.first(options);
            }
            disabledSelector = instance.get('disabledSelector');
            allItems = container.all(instance.get('itemSelector'));
            index = allItems.indexOf(activeItem);
            prevItem = (--index>=0) ? allItems.item(index) : null;
            // Get the next item that matches the itemSelector and isn't
            // disabled.
            while (prevItem && disabledSelector && prevItem.test(disabledSelector)) {
                prevItem = (--index>=0) ? allItems.item(index) : null;
            }
            if (prevItem) {
                if (!options.silent) {
                    this.set('activeItem', prevItem, {src: 'previous'});
                }
            } else {
                // If there is no next item and the `circular` attribute is
                // truthy, then focus the first item in this container.
                if (this.get('circular')) {
                    prevItem = instance.last(options);
                }
            }
            return prevItem || activeItem;
        },

        /**
         * Sets the specified Node as the node that should retreive first focus.
         * (=first focus once the container gets focus and no element has focus yet)
         *
         * @method retreiveFocus
         * @param node {Y.Node|String} the Node that should gain first focus. Has to be inside the host (container) and focusable.
         * @since 0.1
        */
        setFirstFocus : function(node) {
            var instance = this,
                container = instance.get('host'),
                nodeisfocusable;

            if (typeof node === 'string') {
                node = Y.one(node);
            }
            nodeisfocusable = node && instance._nodeIsFocusable(node);
            if (nodeisfocusable) {
                container.all('.'+ITSAFORMELEMENT_FIRSTFOCUS_CLASS).removeClass(ITSAFORMELEMENT_FIRSTFOCUS_CLASS);
                node.addClass(ITSAFORMELEMENT_FIRSTFOCUS_CLASS);
            }
        },

        /**
         * Makes the Node to be in a state that all text will be selected once the Node gets Focus. Enables or disables the state.
         * Be aware that this has only effect on Nodes of the type: <b>'input[type=text], input[type=password], textarea'</b>.
         *
         * @method setSelectText
         * @param select {Boolean} whether the 'selectall' option is active or not
         * @param [node] {Y.Node|String} the Node, Nodelist or Selector of the nodes to be set. Has to be inside the host (container) and focusable.
                  If undefined, than the new setting will be applyable to all focusable text-Nodes.
         * @since 0.1
        */
        setSelectText : function(select, node) {
            var instance = this,
                container = instance.get('host'),
                nodeisfocusable, itemSelector, disabledSelector, allNodes;

            if (typeof node === 'string') {
                node = Y.all(node);
            }
            if (node && (node instanceof Y.Node)) {
                // only 1 node needs to be set
                nodeisfocusable = instance._nodeIsFocusable(node);
                if (nodeisfocusable && node.test('input[type=text], input[type=password], textarea')) {
                    node.toggleClass(ITSAFORMELEMENT_SELECTONFOCUS_CLASS, select);
                }
            }
            else {
                allNodes = node || container.all(itemSelector);
                // allNodes need to be set --> this is a NodeList
                itemSelector = instance.get('itemSelector');
                disabledSelector = instance.get('disabledSelector');
                allNodes.each(
                    function(oneNode) {
                        if (oneNode.test('input[type=text], input[type=password], textarea')
                            && (!disabledSelector || !oneNode.test(disabledSelector))) {
                            oneNode.toggleClass(ITSAFORMELEMENT_SELECTONFOCUS_CLASS, select);
                        }
                    }
                );
            }
        },

        //===============================================================================================
        // private methods
        //===============================================================================================

        /**
         * Binding events
         *
         * @method _bindUI
         * @private
         * @since 0.1
        */
        _bindUI : function() {
            var instance = this,
                host = instance.host;

            instance._eventhandlers.push(
                host.on(
                    'keydown',
                    function(e) {
                        if (e.keyCode === 9) { // tab
                            e.preventDefault();
                            if (e.shiftKey) {
                                instance.previous();
                            }
                            else {
                                instance.next();
                            }
                        }
                    }
                )
            );
            instance._eventhandlers.push(
                host.after(
                    'click',
                    Y.rbind(instance._retreiveFocus, instance)
                )
            );
        },

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
         *
        */
        _clearEventhandlers : function() {
            YArray.each(
                this._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        },

        /**
         * Checks whether a node is focusable within the host-container.
         *
         * @method _nodeIsFocusable
         * @param node {Y.Node} the node to check if it's a focusable node within the host-container.
         * @return {Boolean} focusable or not
         * @since 0.1
        */
        _nodeIsFocusable : function(node) {
            var instance            = this,
                container           = instance.get('host'),
                disabledSelector    = instance.get('disabledSelector'),
                itemSelector        = instance.get('itemSelector'),
                nodeInsideContainer = node && container.contains(node),
                isFocusable;

            isFocusable = (nodeInsideContainer && node.test(itemSelector) && (!disabledSelector || !node.test(disabledSelector)));
            return isFocusable;
        },

        /**
         * Retreive the focus agian on the 'activeItem', or -when none- on the initial Item.
         * Is called when the host-node gets focus.
         *
         * @method _retreiveFocus
         * @private
         * @since 0.1
        */
        _retreiveFocus : function() {
            var instance   = this,
                activeItem = instance.get('activeItem');

            if (activeItem) {
                activeItem.focus();
                instance._selectNode(activeItem);
            }
            else {
                instance.focusInitialItem();
            }
        },

        /**
         * Selects the text inside the Node, or repositions the cursor to the end.
         *
         * @method _selectNode
         * @private
         * @since 0.1
         *
        */
        _selectNode : function(node) {
            if (node && node.test('input[type=text], input[type=password], textarea')) {
                if (node.hasClass(ITSAFORMELEMENT_SELECTONFOCUS_CLASS)) {
                    node.select();
                }
                else {
                    node.set('selectionStart', node.get('value').length);
                    // set 'scrollTop' high to make Chrome scroll the last character into view
                    node.set('scrollTop', 999999);
                }
            }
        }

    }, {
        NS : 'itsatabkeymanager',
        ATTRS : {
            /**
             * Node that's currently either focused or focusable as part of the
             * document's tab flow. Overridden because we need a different valueFn.
             *
             * @attribute {Node|null} activeItem
            **/
            activeItem: {
                value: null,
                setter: function(val) {
                    this._selectNode(val);
                }
            },
            /**
             * Non-anchored CSS selector that matches item nodes that should be
             * focusable.
             *
             * @attribute {String} itemSelector
             * @default '.focusable'
            **/
            itemSelector: {
                value: DEFAULT_ITEM_SELECTOR,
                validator:  function(v) {
                    return typeof v === 'string';
                }
            }
        }
    }
);

}, 'gallery-2013.04.24-22-00', {
    "requires": [
        "yui-base",
        "oop",
        "base-base",
        "base-build",
        "event-custom",
        "plugin",
        "node-pluginhost",
        "event-focus",
        "selector-css3"
    ]
});
