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
_yuitest_coverage["/build/gallery-accordion/gallery-accordion.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-accordion/gallery-accordion.js",
    code: []
};
_yuitest_coverage["/build/gallery-accordion/gallery-accordion.js"].code=["YUI.add('gallery-accordion', function(Y) {","","/**"," * Provides Accordion widget"," *"," * @module gallery-accordion"," */","","(function(){","","// Local constants","var Lang = Y.Lang,","    Node = Y.Node,","    Anim = Y.Anim,","    Easing = Y.Easing,","    AccName = \"accordion\",","    WidgetStdMod = Y.WidgetStdMod,","    QuirksMode = document.compatMode == \"BackCompat\",","    IEQuirksMode = QuirksMode && Y.UA.ie > 0,","    COLLAPSE_HEIGHT = IEQuirksMode ? 1 : 0,","    getCN = Y.ClassNameManager.getClassName,","    ","    C_ITEM = \"yui3-accordion-item\",","    C_PROXY_VISIBLE = getCN( AccName, \"proxyel\", \"visible\" ),","    DRAGGROUP = getCN( AccName, \"graggroup\" ),","","    BEFOREITEMADD = \"beforeItemAdd\",","    ITEMADDED = \"itemAdded\",","    ITEMCHOSEN = 'itemChosen',","    BEFOREITEMREMOVE = \"beforeItemRemove\",","    ITEMREMOVED = \"itemRemoved\",","    BEFOREITEMERESIZED = \"beforeItemResized\",","    ITEMERESIZED = \"itemResized\",","","    BEFOREITEMEXPAND  = \"beforeItemExpand\",","    BEFOREITEMCOLLAPSE = \"beforeItemCollapse\",","    ITEMEXPANDED = \"itemExpanded\",","    ITEMCOLLAPSED = \"itemCollapsed\",","","    BEFOREITEMREORDER = \"beforeItemReorder\",","    BEFOREENDITEMREORDER = \"beforeEndItemReorder\",","    ITEMREORDERED = \"itemReordered\",","    ","    DEFAULT = \"default\",","    ANIMATION = \"animation\",","    ALWAYSVISIBLE = \"alwaysVisible\",","    EXPANDED = \"expanded\",","    COLLAPSEOTHERSONEXPAND = \"collapseOthersOnExpand\",","    ITEMS = \"items\",","    CONTENT_HEIGHT = \"contentHeight\",","    ICON_CLOSE = \"iconClose\",","    ICON_ALWAYSVISIBLE = \"iconAlwaysVisible\",","    STRETCH = \"stretch\",","    PX = \"px\",","    CONTENT_BOX = \"contentBox\",","    BOUNDING_BOX = \"boundingBox\",","    SRCNODE = \"srcNode\",","    RENDERED = \"rendered\",","    BODYCONTENT = \"bodyContent\",","    CHILDREN = \"children\",","    PARENT_NODE = \"parentNode\",","    NODE = \"node\",","    DATA = \"data\";","","","/**"," * Accordion creates an widget, consists of one or more items, which can be collapsed, expanded,"," * set as always visible and reordered by using Drag&Drop. Collapsing/expanding might be animated."," *"," * @class Accordion"," * @extends Widget"," */","","Y.Accordion = Y.Base.create( AccName, Y.Widget, [], {","","    /**","     * Signals the beginning of adding an item to the Accordion.","     *","     * @event beforeItemAdd","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item being added</dd>","     *  </dl>","     */","","","    /**","     * Signals an item has been added to the Accordion.","     *","     * @event itemAdded","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item that has been added</dd>","     *  </dl>","     */","","","    /**","     * Signals the beginning of removing an item.","     *","     * @event beforeItemRemove","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item being removed</dd>","     *  </dl>","     */","","","    /**","     * Signals an item has been removed from Accordion.","     *","     * @event itemRemoved","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item that has been removed</dd>","     *  </dl>","     */","","","    /**","     * Signals the beginning of resizing an item.","     *","     * @event beforeItemResized","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item being resized</dd>","     *  </dl>","     */","","","    /**","     * Signals an item has been resized.","     *","     * @event itemResized","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item that has been resized</dd>","     *  </dl>","     */","","","    /**","     * Signals the beginning of expanding an item","     *","     * @event beforeItemExpand","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item being expanded</dd>","     *  </dl>","     */","","","    /**","     * Signals the beginning of collapsing an item","     *","     * @event beforeItemCollapse","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item being collapsed</dd>","     *  </dl>","     */","","","    /**","     * Signals an item has been expanded","     *","     * @event itemExpanded","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item that has been expanded</dd>","     *  </dl>","     */","","","    /**","     * Signals an item has been collapsed","     *","     * @event itemCollapsed","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item that has been collapsed</dd>","     *  </dl>","     */","","","    /**","     * Signals the beginning of reordering an item","     *","     * @event beforeItemReorder","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item being reordered</dd>","     *  </dl>","     */","","","    /**","     * Fires before the end of item reordering","     *","     * @event beforeEndItemReorder","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item being reordered</dd>","     *  </dl>","     */","","","    /**","     * Signals an item has been reordered","     *","     * @event itemReordered","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> instance of the item that has been reordered</dd>","     *  </dl>","     */","","","    /**","     * Initializer lifecycle implementation for the Accordion class. Publishes events,","     * initializes internal properties and subscribes for resize event.","     *","     * @method initializer","     * @protected","     * @param config {Object} Configuration object literal for the Accordion","     */","    initializer: function( config ) {","        this._initEvents();","","        this.after( \"render\", Y.bind( this._afterRender, this ) );","    },","","","    /**","     * Destructor lifecycle implementation for the Accordion class.","     * Removes and destroys all registered items.","     *","     * @method destructor","     * @protected","     */","    destructor: function() {","        var items, item, i, length;","","        items = this.get( ITEMS );","        length = items.length;","","        for( i = length - 1; i >= 0; i-- ){","            item = items[ i ];","","            items.splice( i, 1 );","","            this._removeItemHandles( item );","","            item.destroy();","        }","    },","","    /**","     * Binds an event to Accordion's contentBox.","     *","     * @method _bindItemChosenEvent","     * @protected","     */","    _bindItemChosenEvent: function(itemChosenEvent) {","        var contentBox;","","        contentBox = this.get( CONTENT_BOX );","        contentBox.delegate( itemChosenEvent, Y.bind( this._onItemChosenEvent, this ), '.yui3-widget-hd' );","    },","","    /**","     * Publishes Accordion's events","     *","     * @method _initEvents","     * @protected","     */","    _initEvents: function(){","        /**","         * Signals that an item has been chosen by user, i.e. there was interaction with this item.","         * The developer may prevent the action which follows (expanding, collapsing, closing, etc.) by preventing the default function, bound to this event.","         *","         * @event itemChosen","         * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","         *  <dl>","         *      <dt>item</dt>","         *          <dd>An <code>AccordionItem</code> item on which user has clicked or pressed key</dd>","         *      <dt>srcIconAlwaysVisible <code>Boolean</code></dt>","         *          <dd>True if user has clicked on 'set as always visible' icon</dd>","         *      <dt>srcIconClose <code>Boolean</code></dt>","         *          <dd>True if user has clicked on 'close' icon</dd>","         *  </dl>","         */","        this.publish( ITEMCHOSEN, {","            defaultFn: this._onItemChosen","        });","    },","","    /**","     * Contains items for collapsing","     * @property _forCollapsing","     * @protected","     * @type Object","     */","    _forCollapsing : {},","","","    /**","     * Contains items for expanding","     * @property _forExpanding","     * @protected","     * @type Object","     */","    _forExpanding : {},","","","    /**","    * Contains currently running animations","    * @property _animations","    * @protected","    * @type Object","    */","    _animations   : {},","","","    /**","     * Collection of items handles.","     * Keeps track of each items's event handle, as returned from <code>Y.on</code> or <code>Y.after</code>.","     * @property _itemHandles","     * @private","     * @type Object","     */","    _itemsHandles: {},","","","    /**","     * Removes all handles, attched to given item","     *","     * @method _removeItemHandles","     * @protected","     * @param item {Y.AccordionItem} The item, which handles to remove","     */","    _removeItemHandles: function( item ){","        var itemHandles, itemHandle;","","        itemHandles = this._itemsHandles[ item ];","","        for( itemHandle in itemHandles ){","            if( itemHandles.hasOwnProperty( itemHandle ) ){","                itemHandle = itemHandles[ itemHandle ];","                itemHandle.detach();","            }","        }","","        delete this._itemsHandles[ item ];","    },","","    /**","     * Obtains the precise height of the node provided, including padding and border.","     *","     * @method _getNodeOffsetHeight","     * @protected","     * @param node {Node|HTMLElement} The node to gather the height from","     * @return {Number} The calculated height or zero in case of failure","     */","    _getNodeOffsetHeight: function( node ){","        var height, preciseRegion;","","        if( node instanceof Node ){","            if( node.hasMethod( \"getBoundingClientRect\" ) ){","                preciseRegion = node.invoke( \"getBoundingClientRect\" );","","                if( preciseRegion ){","                    height = preciseRegion.bottom - preciseRegion.top;","","                    return height;","                }","            } else {","                height = node.get( \"offsetHeight\" );","                return Y.Lang.isValue( height ) ? height : 0;","            }","        } else if( node ){","            height = node.offsetHeight;","            return Y.Lang.isValue( height ) ? height : 0;","        }","","        return 0;","    },","","","    /**","     * Updates expand and alwaysVisible properties of given item with the values provided.","     * The properties will be updated only if needed.","     *","     * @method _setItemProperties","     * @protected","     * @param item {Y.AccordionItem} The item, which properties should be updated","     * @param expanding {Boolean} The new value of \"expanded\" property","     * @param alwaysVisible {Boolean} The new value of \"alwaysVisible\" property","     */","    _setItemProperties: function( item, expanding, alwaysVisible ){","        var curAlwaysVisible, curExpanded;","","        curAlwaysVisible = item.get( ALWAYSVISIBLE );","        curExpanded = item.get( EXPANDED );","","        if( expanding != curExpanded ){","            item.set( EXPANDED, expanding, {","                internalCall: true","            });","        }","","        if( alwaysVisible !== curAlwaysVisible ){","            item.set( ALWAYSVISIBLE, alwaysVisible, {","                internalCall: true","            });","        }","    },","","","    /**","     * Updates user interface of an item and marks it as expanded, alwaysVisible or both","     *","     * @method _setItemUI","     * @protected","     * @param item {Y.AccordionItem} The item, which user interface should be updated","     * @param expanding {Boolean} If true, the item will be marked as expanded.","     * If false, the item will be marked as collapsed","     * @param alwaysVisible {Boolean} If true, the item will be marked as always visible.","     * If false, the always visible mark will be removed","     */","    _setItemUI: function( item, expanding, alwaysVisible ){","        item.markAsExpanded( expanding );","        item.markAsAlwaysVisible( alwaysVisible );","    },","","","    /**","     * Sets listener to resize event","     *","     * @method _afterRender","     * @protected","     * @param e {Event} after render custom event","     */","    _afterRender: function( e ){","        var resizeEvent;","","        resizeEvent = this.get( \"resizeEvent\" );","","        this._setUpResizing( resizeEvent );","","        this.after( \"resizeEventChange\", Y.bind( this._afterResizeEventChange, this ) );","    },","","","    /**","     * Set up resizing with the new value provided","     *","     * @method _afterResizeEventChange","     * @protected","     * @param params {Event} after resizeEventChange custom event","     */","    _afterResizeEventChange: function( params ){","        this._setUpResizing( params.newVal );","    },","","","    /**","     * Distributes the involved items as result of user interaction on item header.","     * Some items might be stored in the list for collapsing, other in the list for expanding.","     * Finally, invokes <code>_processItems</code> function, except if item has been expanded and","     * user has clicked on always visible icon.","     * If the user clicked on close icon, the item will be closed.","     *","     * @method _onItemChosen","     * @protected","     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","     *  <dl>","     *      <dt>item</dt>","     *          <dd>An <code>AccordionItem</code> item on which user has clicked or pressed key</dd>","     *      <dt>srcIconAlwaysVisible {Boolean}</dt>","     *          <dd>True if user has clicked on 'set as always visible' icon</dd>","     *      <dt>srcIconClose {Boolean}</dt>","     *          <dd>True if user has clicked on 'close' icon</dd>","     *  </dl>","     */","    _onItemChosen: function( event ){","        var toBeExcluded, alwaysVisible, expanded, collapseOthersOnExpand,","            item, srcIconAlwaysVisible, srcIconClose;","","        item = event.item;","        srcIconAlwaysVisible = event.srcIconAlwaysVisible;","        srcIconClose = event.srcIconClose;","","        toBeExcluded = {};","        collapseOthersOnExpand = this.get( COLLAPSEOTHERSONEXPAND );","        alwaysVisible = item.get( ALWAYSVISIBLE );","        expanded      = item.get( EXPANDED );","","        if( srcIconClose ){","            this.removeItem( item );","            return;","        } else if( srcIconAlwaysVisible ){","            if( expanded ){","                alwaysVisible = !alwaysVisible;","                expanded = alwaysVisible ? true : expanded;","","                this._setItemProperties( item, expanded, alwaysVisible );","                this._setItemUI( item, expanded, alwaysVisible );","","                return;","            } else {","                this._forExpanding[ item ] = {","                    'item': item,","                    alwaysVisible: true","                };","","                if( collapseOthersOnExpand ){","                    toBeExcluded[ item ] = {","                        'item': item","                    };","","                    this._storeItemsForCollapsing( toBeExcluded );","                }","            }","        } else {","            /*","             * Do the opposite","             */","            if( expanded ){","                this._forCollapsing[ item ] = {","                    'item': item","                };","            } else {","                this._forExpanding[ item ] = {","                    'item': item,","                    'alwaysVisible': alwaysVisible","                };","","                if( collapseOthersOnExpand ){","                    toBeExcluded[ item ] = {","                        'item': item","                    };","","                    this._storeItemsForCollapsing( toBeExcluded );","                }","            }","        }","","        this._processItems();","    },","","","    /**","     * Helper method to adjust the height of all items, which <code>contentHeight</code> property is set as \"stretch\".","     * If some item has animation running, it will be stopped before running another one.","     *","     * @method adjustStretchItems","     * @protected","     * @return {Number} The calculated height per strech item","     */","    _adjustStretchItems: function(){","        var items = this.get( ITEMS ), heightPerStretchItem, forExpanding;","","        heightPerStretchItem = this._getHeightPerStretchItem();","        forExpanding = this._forExpanding;","","        Y.Array.each( items, function( item, index, items ){","            var body, bodyHeight, anim, heightSettings, expanded;","","            heightSettings = item.get( CONTENT_HEIGHT );","            expanded      = item.get( EXPANDED );","","            if( !forExpanding[ item ] && heightSettings.method === STRETCH && expanded ){","                anim = this._animations[ item ];","","                // stop waiting animation","                if( anim ){","                    anim.stop();","                }","","                body = item.getStdModNode( WidgetStdMod.BODY );","                bodyHeight = this._getNodeOffsetHeight( body );","","                if( heightPerStretchItem < bodyHeight ){","                    this._processCollapsing( item, heightPerStretchItem );","                } else if( heightPerStretchItem > bodyHeight ){","                    this._processExpanding( item, heightPerStretchItem );","                }","            }","        }, this );","","        return heightPerStretchItem;","    },","","    /**","     * Calculates the height per strech item.","     *","     * @method _getHeightPerStretchItem","     * @protected","     * @return {Number} The calculated height per strech item","     */","    _getHeightPerStretchItem: function(){","        var height, items, stretchCounter = 0;","","        items = this.get( ITEMS );","        height = this.get( BOUNDING_BOX ).get( \"clientHeight\" );","","        Y.Array.each( items, function( item, index, items ){","            var collapsed, itemContentHeight, header, heightSettings, headerHeight;","","            header = item.getStdModNode( WidgetStdMod.HEADER );","            heightSettings = item.get( CONTENT_HEIGHT );","","            headerHeight = this._getNodeOffsetHeight( header );","","            height -= headerHeight;","            collapsed = !item.get( EXPANDED );","","            if( collapsed ){","                height -= COLLAPSE_HEIGHT;","                return;","            }","","            if( heightSettings.method === STRETCH ){","                stretchCounter++;","            } else {","                itemContentHeight = this._getItemContentHeight( item );","                height -= itemContentHeight;","            }","        }, this );","","        if( stretchCounter > 0 ){","            height /= stretchCounter;","        }","","        if( height < 0 ){","            height = 0;","        }","","        return height;","    },","","","    /**","     * Calculates the height of given item depending on its \"contentHeight\" property.","     *","     * @method _getItemContentHeight","     * @protected","     * @param item {Y.AccordionItem} The item, which height should be calculated","     * @return {Number} The calculated item's height","     */","    _getItemContentHeight: function( item ){","        var heightSettings, height = 0, body, bodyContent;","","        heightSettings = item.get( CONTENT_HEIGHT );","","        if( heightSettings.method === \"auto\" ){","            body = item.getStdModNode( WidgetStdMod.BODY );","            bodyContent = body.get( CHILDREN ).item(0);","            height = bodyContent ? this._getNodeOffsetHeight( bodyContent ) : 0;","        } else if( heightSettings.method === \"fixed\" ) {","            height = heightSettings.height;","        } else {","            height = this._getHeightPerStretchItem();","        }","","        return height;","    },","","","    /**","     * Stores all items, which are expanded and not set as always visible in list","     * in order to be collapsed later.","     *","     * @method _storeItemsForCollapsing","     * @protected","     * @param itemsToBeExcluded {Object} (optional) Contains one or more <code>Y.AccordionItem</code> instances,","     * which should be not included in the list","     */","    _storeItemsForCollapsing: function( itemsToBeExcluded ){","        var items;","","        itemsToBeExcluded = itemsToBeExcluded || {};","        items = this.get( ITEMS );","","        Y.Array.each( items, function( item, index, items ){","            var expanded, alwaysVisible;","","            expanded = item.get( EXPANDED );","            alwaysVisible = item.get( ALWAYSVISIBLE );","","            if( expanded && !alwaysVisible && !itemsToBeExcluded[ item ] ){","                this._forCollapsing[ item ] = {","                    'item': item","                };","            }","        }, this );","    },","","","    /**","     * Expands an item to given height. This includes also an update to item's user interface","     *","     * @method _expandItem","     * @protected","     * @param item {Y.AccordionItem} The item, which should be expanded.","     * @param height {Number} The height to which we should expand the item","     */","    _expandItem: function( item, height ){","        var alwaysVisible = item.get( ALWAYSVISIBLE );","","        this._processExpanding( item, height );","        this._setItemUI( item, true, alwaysVisible );","    },","","","    /**","     * Expands an item to given height. Depending on the <code>useAnimation</code> setting,","     * the process of expanding might be animated. This setting will be ignored, if <code>forceSkipAnimation</code> param","     * is <code>true</code>.","     *","     * @method _processExpanding","     * @protected","     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be expanded","     * @param forceSkipAnimation {Boolean} If true, the animation will be skipped,","     * without taking in consideration Accordion's <code>useAnimation</code> setting","     * @param height {Number} The height to which item should be expanded","     */","    _processExpanding: function( item, height, forceSkipAnimation ){","        var anim, curAnim, animSettings, notifyOthers = false,","            accAnimationSettings, body;","","        body = item.getStdModNode( WidgetStdMod.BODY );","","        this.fire( BEFOREITEMERESIZED, {","            'item': item","        });","","        if( body.get( \"clientHeight\" ) <= COLLAPSE_HEIGHT ){","            notifyOthers = true;","            this.fire( BEFOREITEMEXPAND, {","                'item': item","            });","        }","","        if( !forceSkipAnimation && this.get( \"useAnimation\" ) ){","            animSettings = item.get( ANIMATION ) || {};","","            anim = new Anim( {","                node: body,","                to: {","                    'height': height","                }","            });","","            anim.on( \"end\", Y.bind( this._onExpandComplete, this, item, notifyOthers ) );","","            accAnimationSettings = this.get( ANIMATION );","","            anim.set( \"duration\", animSettings.duration || accAnimationSettings.duration );","            anim.set( \"easing\"  , animSettings.easing   || accAnimationSettings.easing   );","","            curAnim = this._animations[ item ];","","            if( curAnim ){","                curAnim.stop();","            }","","            item.markAsExpanding( true );","","            this._animations[ item ] = anim;","","            anim.run();","        } else {","            body.setStyle( \"height\", height + PX );","","            this.fire( ITEMERESIZED, {","                'item': item","            });","","            if( notifyOthers ){","                this.fire( ITEMEXPANDED, {","                    'item': item","                });","            }","        }","    },","","","    /**","     * Executes when animated expanding completes","     *","     * @method _onExpandComplete","     * @protected","     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance which has been expanded","     * @param notifyOthers {Boolean} If true, itemExpanded event will be fired","     */","    _onExpandComplete: function( item, notifyOthers ){","        delete this._animations[ item ];","","        item.markAsExpanding( false );","","        this.fire( ITEMERESIZED, {","            'item': item","        });","","        if( notifyOthers ){","            this.fire( ITEMEXPANDED, {","                'item': item","            });","        }","    },","","","    /**","     * Collapse an item and update its user interface","     *","     * @method _collapseItem","     * @protected","     * @param item {Y.AccordionItem} The item, which should be collapsed","     */","    _collapseItem: function( item ){","        this._processCollapsing( item, COLLAPSE_HEIGHT );","        this._setItemUI( item, false, false );","    },","","","    /**","     * Collapse an item to given height. Depending on the <code>useAnimation</code> setting,","     * the process of collapsing might be animated. This setting will be ignored, if <code>forceSkipAnimation</code> param","     * is <code>true</code>.","     *","     * @method _processCollapsing","     * @protected","     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be collapsed","     * @param height {Number} The height to which item should be collapsed","     * @param forceSkipAnimation {Boolean} If true, the animation will be skipped,","     * without taking in consideration Accordion's <code>useAnimation</code> setting","     */","    _processCollapsing: function( item, height, forceSkipAnimation ){","        var anim, curAnim, animSettings, accAnimationSettings, body,","            notifyOthers = (height === COLLAPSE_HEIGHT);","","        body = item.getStdModNode( WidgetStdMod.BODY );","","","        this.fire( BEFOREITEMERESIZED, {","            'item': item","        });","","        if( notifyOthers ){","            this.fire( BEFOREITEMCOLLAPSE, {","                'item': item","            });","        }","","        if( !forceSkipAnimation && this.get( \"useAnimation\" ) ){","            animSettings = item.get( ANIMATION ) || {};","","            anim = new Anim( {","                node: body,","                to: {","                    'height': height","                }","            });","","            anim.on( \"end\", Y.bind( this._onCollapseComplete, this, item, notifyOthers ) );","","            accAnimationSettings = this.get( ANIMATION );","","            anim.set( \"duration\", animSettings.duration || accAnimationSettings.duration );","            anim.set( \"easing\"  , animSettings.easing   || accAnimationSettings.easing );","","            curAnim = this._animations[ item ];","","            if( curAnim ){","                curAnim.stop();","            }","","            item.markAsCollapsing( true );","","            this._animations[ item ] = anim;","","            anim.run();","        } else {","            body.setStyle( \"height\", height + PX );","","            this.fire( ITEMERESIZED, {","                'item': item","            });","","            if( notifyOthers ){","                this.fire( ITEMCOLLAPSED, {","                    'item': item","                });","            }","        }","    },","","","    /**","     * Executes when animated collapsing completes","     *","     * @method _onCollapseComplete","     * @protected","     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance which has been collapsed","     * @param notifyOthers {Boolean} If true, itemCollapsed event will be fired","     */","    _onCollapseComplete: function( item, notifyOthers ){","        delete this._animations[ item ];","","        item.markAsCollapsing( false );","","        this.fire( ITEMERESIZED, {","            item: item","        });","","        if( notifyOthers ){","            this.fire( ITEMCOLLAPSED, {","                'item': item","            });","        }","    },","","","    /**","     * Make an item draggable. The item can be reordered later.","     *","     * @method _initItemDragDrop","     * @protected","     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be set as draggable","     */","    _initItemDragDrop: function( item ){","        var itemHeader, dd, bb, itemBB, ddrop;","","        itemHeader = item.getStdModNode( WidgetStdMod.HEADER );","","        if( itemHeader.dd ){","            return;","        }","","        bb = this.get( BOUNDING_BOX );","        itemBB = item.get( BOUNDING_BOX );","","        dd = new Y.DD.Drag({","            node: itemHeader,","            groups: [ DRAGGROUP ]","        }).plug(Y.Plugin.DDProxy, {","            moveOnEnd: false","        }).plug(Y.Plugin.DDConstrained, {","            constrain2node: bb","        });","","        ddrop = new Y.DD.Drop({","            node: itemBB,","            groups: [ DRAGGROUP ]","        });","","        dd.on   ( \"drag:start\",   Y.bind( this._onDragStart,  this, dd ) );","        dd.on   ( \"drag:end\"  ,   Y.bind( this._onDragEnd,    this, dd ) );","        dd.after( \"drag:end\"  ,   Y.bind( this._afterDragEnd, this, dd ) );","        dd.on   ( \"drag:drophit\", Y.bind( this._onDropHit,    this, dd ) );","    },","","","    /**","     * Sets the label of the item being dragged on the drag proxy.","     * Fires beforeItemReorder event - returning false will cancel reordering","     *","     * @method _onDragStart","     * @protected","     * @param dd {Y.DD.Drag} The drag instance of the item","     * @param e {Event} the DD instance's drag:start custom event","     */","    _onDragStart: function( dd, e ){","        var dragNode, item;","","        item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );","        dragNode = dd.get( \"dragNode\" );","","        dragNode.addClass( C_PROXY_VISIBLE );","        dragNode.set( \"innerHTML\", item.get( \"label\" ) );","","        return this.fire( BEFOREITEMREORDER, { 'item': item } );","    },","","","    /**","     * Restores HTML structure of the drag proxy.","     * Fires beforeEndItemReorder event - returning false will cancel reordering","     *","     * @method _onDragEnd","     * @protected","     * @param dd {Y.DD.Drag} The drag instance of the item","     * @param e {Event} the DD instance's drag:end custom event","     */","    _onDragEnd: function( dd, e ){","        var dragNode, item;","","        dragNode = dd.get( \"dragNode\" );","","        dragNode.removeClass( C_PROXY_VISIBLE );","        dragNode.set( \"innerHTML\", \"\" );","","        item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );","        return this.fire( BEFOREENDITEMREORDER, { 'item': item } );","    },","","","    /**","     * Set drophit to false in dragdrop instance's custom value (if there has been drophit) and fires itemReordered event","     *","     * @method _afterDragEnd","     * @protected","     * @param dd {Y.DD.Drag} The drag instance of the item","     * @param e {Event} the DD instance's drag:end custom event","     */","    _afterDragEnd: function( dd, e ){","        var item, data;","","        data = dd.get( DATA );","","        if( data.drophit ){","            item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );","","            dd.set( DATA, {","                drophit: false","            } );","","            return this.fire( ITEMREORDERED, { 'item': item } );","        }","","        return true;","    },","","","    /**","     * Moves the source item before or after target item.","     *","     * @method _onDropHit","     * @protected","     * @param dd {Y.DD.Drag} The drag instance of the item","     * @param e {Event} the DD instance's drag:drophit custom event","     */","    _onDropHit: function( dd, e) {","        var mineIndex, targetItemIndex, targetItemBB, itemBB, cb,","            goingUp, items, targetItem, item;","","        item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );","        targetItem = this.getItem( e.drop.get( NODE ) );","","        if( targetItem === item ){","            return false;","        }","","        mineIndex = this.getItemIndex( item );","        targetItemIndex = this.getItemIndex( targetItem );","        targetItemBB = targetItem.get( BOUNDING_BOX );","        itemBB = item.get( BOUNDING_BOX );","        cb = this.get( CONTENT_BOX );","        goingUp = false;","        items = this.get( ITEMS );","","        if( targetItemIndex < mineIndex ){","            goingUp = true;","        }","","        cb.removeChild( itemBB );","","        if( goingUp ){","            cb. insertBefore( itemBB, targetItemBB );","            items.splice( mineIndex, 1 );","            items.splice( targetItemIndex, 0, item );","        } else {","            cb. insertBefore( itemBB, targetItemBB.next( C_ITEM ) );","            items.splice( targetItemIndex + 1, 0, item );","            items.splice( mineIndex, 1 );","        }","","        dd.set( DATA, {","            drophit: true","        });","","        return true;","    },","","","    /**","     * Process items as result of user interaction or properties change.","     * This includes four steps:","     * 1. Update the properties of the items","     * 2. Collapse all items stored in the list for collapsing","     * 3. Adjust all stretch items","     * 4. Expand items stored in the list for expanding","     *","     * @method _processItems","     * @protected","     */","    _processItems: function(){","        var forCollapsing, forExpanding, itemCont, heightPerStretchItem,","            height, heightSettings, item;","","        forCollapsing = this._forCollapsing;","        forExpanding = this._forExpanding;","","        this._setItemsProperties();","","        for( item in forCollapsing ){","            if( forCollapsing.hasOwnProperty( item ) ){","                itemCont = forCollapsing[ item ];","","                this._collapseItem( itemCont.item );","            }","        }","","        heightPerStretchItem = this._adjustStretchItems();","","        for( item in forExpanding ){","            if( forExpanding.hasOwnProperty( item ) ){","                itemCont = forExpanding[ item ];","                item = itemCont.item;","                height = heightPerStretchItem;","                heightSettings = item.get( CONTENT_HEIGHT );","","                if( heightSettings.method !== STRETCH ){","                    height = this._getItemContentHeight( item );","                }","","                this._expandItem( item, height );","            }","        }","","        this._forCollapsing = {};","        this._forExpanding = {};","    },","","","    /**","     * Update properties of items, which were stored in the lists for collapsing or expanding","     *","     * @method _setItemsProperties","     * @protected","     */","    _setItemsProperties: function (){","        var forCollapsing, forExpanding, itemData;","","        forCollapsing = this._forCollapsing;","        forExpanding = this._forExpanding;","","        for( itemData in forCollapsing ){","            if( forCollapsing.hasOwnProperty( itemData ) ){","                itemData = forCollapsing[ itemData ];","                this._setItemProperties( itemData.item, false, false );","            }","        }","","        for( itemData in forExpanding ){","            if( forExpanding.hasOwnProperty( itemData ) ){","                itemData = forExpanding[ itemData ];","                this._setItemProperties( itemData.item, true, itemData.alwaysVisible );","            }","        }","    },","","","    /**","     * Handles the change of \"expand\" property of given item","     *","     * @method _afterItemExpand","     * @protected","     * @param params {EventFacade} The event facade for the attribute change","     */","    _afterItemExpand: function( params ){","        var expanded, item, alwaysVisible, collapseOthersOnExpand;","","        if( params.internalCall ){","            return;","        }","","        expanded = params.newVal;","        item    = params.currentTarget;","        alwaysVisible = item.get( ALWAYSVISIBLE );","        collapseOthersOnExpand = this.get( COLLAPSEOTHERSONEXPAND );","","        if( expanded ){","            this._forExpanding[ item ] = {","                'item': item,","                'alwaysVisible': alwaysVisible","            };","","            if( collapseOthersOnExpand ){","                this._storeItemsForCollapsing();","            }","        } else {","            this._forCollapsing[ item ] = {","                'item': item","            };","        }","","        this._processItems();","    },","","    /**","     * Handles the change of \"alwaysVisible\" property of given item","     *","     * @method _afterItemAlwaysVisible","     * @protected","     * @param params {EventFacade} The event facade for the attribute change","     */","    _afterItemAlwaysVisible: function( params ){","        var item, alwaysVisible, expanded;","","        if( params.internalCall ){","            return;","        }","","        alwaysVisible = params.newVal;","        item         = params.currentTarget;","        expanded     = item.get( EXPANDED );","","        if( alwaysVisible ){","            if( expanded ){","                this._setItemProperties( item, true, true );","                this._setItemUI( item, true, true );","                return;","            } else {","                this._forExpanding[ item ] = {","                    'item': item,","                    'alwaysVisible': true","                };","","                this._storeItemsForCollapsing();","            }","        } else {","            if( expanded ){","                this._setItemUI( item, true, false );","                return;","            } else {","                return;","            }","        }","","        this._processItems();","    },","","","    /**","     * Handles the change of \"contentHeight\" property of given item","     *","     * @method _afterContentHeight","     * @protected","     * @param params {EventFacade} The event facade for the attribute change","     */","    _afterContentHeight: function( params ){","        var item, itemContentHeight, body, bodyHeight, expanded;","","        item = params.currentTarget;","","        this._adjustStretchItems();","","        if( params.newVal.method !== STRETCH ){","            expanded = item.get( EXPANDED );","            itemContentHeight = this._getItemContentHeight( item );","","            body = item.getStdModNode( WidgetStdMod.BODY );","            bodyHeight = this._getNodeOffsetHeight( body );","","            if( itemContentHeight < bodyHeight ){","                this._processCollapsing( item, itemContentHeight, !expanded );","            } else if( itemContentHeight > bodyHeight ){","                this._processExpanding( item, itemContentHeight, !expanded );","            }","        }","    },","","","    /**","     * Handles the change of \"contentUpdate\" property of given item","     *","     * @method _afterContentUpdate","     * @protected","     * @param params {EventFacade} The event facade for the attribute change","     */","    _afterContentUpdate : function( params ){","        var item, body, bodyHeight, expanded, auto, anim;","","        item = params.currentTarget;","        auto = item.get( \"contentHeight\" ).method === \"auto\";","        expanded = item.get( EXPANDED );","","        body = item.getStdModNode( WidgetStdMod.BODY );","        bodyHeight = this._getNodeOffsetHeight( body );","","        if( auto && expanded && params.src !== Y.Widget.UI_SRC ){","            Y.later( 0, this, function(){","                var itemContentHeight = this._getItemContentHeight( item );","","                if( itemContentHeight !== bodyHeight ){","                    anim = this._animations[ item ];","","                    // stop waiting animation","                    if( anim ){","                        anim.stop();","                    }","","                    this._adjustStretchItems();","","                    if( itemContentHeight < bodyHeight ){","                        this._processCollapsing( item, itemContentHeight, !expanded );","                    } else if( itemContentHeight > bodyHeight ){","                        this._processExpanding( item, itemContentHeight, !expanded );","                    }","                }","            } );","        }","    },","","","    /**","     * Subscribe for resize event, which could be provided from the browser or from an arbitrary object.","     * For example, if there is LayoutManager in the page, it is preferable to subscribe to its resize event,","     * instead to those, which browser provides.","     *","     * @method _setUpResizing","     * @protected","     * @param value {String|Object} String \"default\" or object with the following properties:","     *  <dl>","     *      <dt>sourceObject</dt>","     *          <dd>An abbitrary object</dd>","     *      <dt>resizeEvent</dt>","     *          <dd>The name of its resize event</dd>","     *  </dl>","     */","    _setUpResizing: function( value ){","        if( this._resizeEventHandle ){","            this._resizeEventHandle.detach();","        }","","        if( value === DEFAULT ){","            this._resizeEventHandle = Y.on( 'windowresize', Y.bind( this._adjustStretchItems, this ) );","        } else {","            this._resizeEventHandle = value.sourceObject.on( value.resizeEvent, Y.bind( this._adjustStretchItems, this ) );","        }","    },","","","    /**","     * Creates one or more items found in Accordion's <code>contentBox</code>","     *","     * @method renderUI","     * @protected","     */","    renderUI: function(){","        var srcNode, itemsDom, contentBox, srcNodeId;","","        srcNode = this.get( SRCNODE );","        contentBox = this.get( CONTENT_BOX );","        srcNodeId = srcNode.get( \"id\" );","","        /*","         * Widget 3.1 workaround - the Id of contentBox is generated by YUI, instead to keep srcNode's Id, so we set it manually","         */","        contentBox.set( \"id\", srcNodeId );","","        itemsDom = srcNode.all( \"> .\" + C_ITEM );","","        itemsDom.each( function( itemNode, index, itemsDom ){","            var newItem;","","            if( !this.getItem( itemNode ) ){","                newItem = new Y.AccordionItem({","                    srcNode: itemNode,","                    id : itemNode.get( \"id\" )","                });","","                this.addItem( newItem );","            }","        }, this );","    },","","","    /**","     * Add listener(s) to <code>itemChosen</code> event in Accordion's content box.","     * If itemChosen is an Array, this function will invoke multiple times _bindItemChosenEvent","     *","     * @method bindUI","     * @protected","     */","    bindUI: function(){","        var i, itemChosenEvent, length;","","        itemChosenEvent = this.get( ITEMCHOSEN );","","        if( Lang.isArray(itemChosenEvent) ){","            length = itemChosenEvent.length;","","            for( i = 0; i < length; i++ ) {","                this._bindItemChosenEvent(itemChosenEvent[i]);","            }","        } else {","            this._bindItemChosenEvent(itemChosenEvent);","        }","    },","","","    /**","     * Listening for itemChosen event, determines the source (is that iconClose, iconAlwaysVisisble, etc.) and","     * invokes this._onItemChosen for further processing","     *","     * @method _onItemChosenEvent","     * @protected","     *","     * @param e {Event} The itemChosen event","     */","    _onItemChosenEvent: function(e){","        var header, itemNode, item, iconAlwaysVisible,","            iconClose, srcIconAlwaysVisible, srcIconClose;","","        header = e.currentTarget;","        itemNode = header.get( PARENT_NODE );","        item = this.getItem( itemNode );","        iconAlwaysVisible = item.get( ICON_ALWAYSVISIBLE );","        iconClose = item.get( ICON_CLOSE );","        srcIconAlwaysVisible = (iconAlwaysVisible === e.target);","        srcIconClose = (iconClose === e.target);","","        this.fire( ITEMCHOSEN, {","            item: item,","            srcIconAlwaysVisible: srcIconAlwaysVisible, ","            srcIconClose: srcIconClose","        });","    },","","","    /**","     * Add an item to Accordion. Items could be added/removed multiple times and they","     * will be rendered in the process of adding, if not.","     * The item will be expanded, collapsed, or set as always visible depending on the","     * settings. Item's properties will be also updated, if they are incomplete.","     * For example, if <code>alwaysVisible</code> is true, but <code>expanded</code>","     * property is false, it will be set to true also.","     *","     * If the second param, <code>parentItem</code> is an <code>Y.AccordionItem</code> instance,","     * registered in Accordion, the item will be added as child of the <code>parentItem</code>","     *","     * @method addItem","     * @param item {Y.AccordionItem} The item to be added in Accordion","     * @param parentItem {Y.AccordionItem} (optional) This item will be the parent of the item being added","     *","     * @return {Boolean} True in case of successfully added item, false otherwise","     */","    addItem: function( item, parentItem ){","        var expanded, alwaysVisible, itemBody, itemBodyContent, itemIndex, items, contentBox,","            itemHandles, itemContentBox, res, children;","","        res = this.fire( BEFOREITEMADD, {","            'item': item","        });","","        if( !res ){","            return false;","        }","","        items = this.get( ITEMS );","        contentBox = this.get( CONTENT_BOX );","","        itemContentBox = item.get( CONTENT_BOX );","","        if( !itemContentBox.inDoc() ){","            if( parentItem ){","                itemIndex = this.getItemIndex( parentItem );","","                if( itemIndex < 0 ){","                    return false;","                }","","                items.splice( itemIndex, 0, item );","                contentBox.insertBefore( itemContentBox, parentItem.get( BOUNDING_BOX ) );","            } else {","                items.push( item );","                contentBox.insertBefore( itemContentBox, null );","            }","        } else {","            children = contentBox.get( CHILDREN );","","            res = children.some( function( node, index, nodeList ){","                if( node === itemContentBox ){","                    items.splice( index, 0, item );","                    return true;","                } else {","                    return false;","                }","            }, this );","","            if( !res ){","                return false;","            }","        }","","        itemBody = item.getStdModNode( WidgetStdMod.BODY );","        itemBodyContent = item.get( BODYCONTENT );","","        if( !itemBody && !itemBodyContent  ){","            item.set( BODYCONTENT, \"\" );","        }","","        if( !item.get( RENDERED ) ){","            item.render();","        }","","        expanded = item.get( EXPANDED );","        alwaysVisible = item.get( ALWAYSVISIBLE );","","        expanded = expanded || alwaysVisible;","","        if( expanded ){","            this._forExpanding[ item ] = {","                'item': item,","                'alwaysVisible': alwaysVisible","            };","        } else {","            this._forCollapsing[ item ] = {","                'item': item","            };","        }","","        this._processItems();","","        if( this.get( \"reorderItems\" ) ){","            this._initItemDragDrop( item );","        }","","        itemHandles = this._itemsHandles[ item ];","","        if( !itemHandles ){","            itemHandles = {};","        }","","        itemHandles = {","            \"expandedChange\" : item.after( \"expandedChange\", Y.bind( this._afterItemExpand, this ) ),","            \"alwaysVisibleChange\" : item.after( \"alwaysVisibleChange\", Y.bind( this._afterItemAlwaysVisible, this ) ),","            \"contentHeightChange\" : item.after( \"contentHeightChange\", Y.bind( this._afterContentHeight, this ) ),","            \"contentUpdate\" : item.after( \"contentUpdate\", Y.bind( this._afterContentUpdate, this ) )","        };","","        this._itemsHandles[ item ] = itemHandles;","","        this.fire( ITEMADDED, {","            'item': item","        });","","        return true;","    },","","","    /**","     * Removes an previously registered item in Accordion","     *","     * @method removeItem","     * @param p_item {Y.AccordionItem|Number} The item to be removed, or its index","     * @return {Y.AccordionItem} The removed item or null if not found","     */","    removeItem: function( p_item ){","        var items, bb, item = null, itemIndex, allowed;","","        items = this.get( ITEMS );","","        if( Lang.isNumber( p_item ) ){","            itemIndex = p_item;","        } else if( p_item instanceof Y.AccordionItem ){","            itemIndex = this.getItemIndex( p_item );","        } else {","            return null;","        }","","        if( itemIndex >= 0 ){","            allowed = this.fire( BEFOREITEMREMOVE, {","                item: p_item","            });","","            if( !allowed ){","                return null;","            }","","            item = items.splice( itemIndex, 1 )[0];","","            this._removeItemHandles( item );","","            bb = item.get( BOUNDING_BOX );","            bb.remove();","","            this._adjustStretchItems();","","            this.fire( ITEMREMOVED, {","                item: p_item","            });","        }","","        return item;","    },","","","    /**","     * Searching for item, previously registered in Accordion","     *","     * @method getItem","     * @param param {Number|Y.Node} If number, this must be item's index.","     * If Node, it should be the value of item's <code>contentBox</code> or <code>boundingBox</code> properties","     *","     * @return {Y.AccordionItem} The found item or null","     */","    getItem: function( param ){","        var items = this.get( ITEMS ), item = null;","","        if( Lang.isNumber( param ) ){","            item = items[ param ];","            return (item instanceof Y.AccordionItem) ? item : null;","        } else if( param instanceof Node ){","            Y.Array.some( items, function( tmpItem, index, items ){","                var contentBox = tmpItem.get( CONTENT_BOX );","","                /*","                 * Both contentBox and boundingBox point to same node, so it is safe to check only one of them","                 */","                if( contentBox === param ){","                    item = tmpItem;","                    return true;","                } else {","                    return false;","                }","            }, this );","        }","","        return item;","    },","","","    /**","     * Looking for the index of previously registered item","     *","     * @method getItemIndex","     * @param item {Y.AccordionItem} The item which index should be returned","     * @return {Number} Item index or <code>-1</code> if item has been not found","     */","    getItemIndex: function( item ){","        var res = -1, items;","","        if( item instanceof Y.AccordionItem ){","            items = this.get( ITEMS );","","            Y.Array.some( items, function( tmpItem, index, items ){","                if( tmpItem === item ){","                    res = index;","                    return true;","                } else {","                    return false;","                }","            }, this );","        }","","        return res;","    },","","","    /**","     * Overwrites Y.WidgetStdMod fuction in order to resolve Widget 3.1 issue:<br>","     * If CONTENT_TEMPLATE is null, in renderUI the result of the following code:","     * <code>this.getStdModNode( Y.WidgetStdMod.HEADER );</code> is null.","     * The same is with <code>this.getStdModNode( Y.WidgetStdMod.BODY );</code>.","     *","     * @method _findStdModSection","     * @protected","     * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","     * @return {Node} The rendered node for the given section, or null if not found.","     */","    _findStdModSection: function(section) {","        return this.get(SRCNODE).one(\"> .\" + Y.WidgetStdMod.SECTION_CLASS_NAMES[section]);","    },","","    CONTENT_TEMPLATE : null","}, {","    /**","     *  Static property provides a string to identify the class.","     *","     * @property Accordion.NAME","     * @type String","     * @static","     */","    NAME : AccName,","","    /**","     * Static property used to define the default attribute","     * configuration for the Accordion.","     *","     * @property Accordion.ATTRS","     * @type Object","     * @static","     */","    ATTRS : {","        /**","         * @description The event on which Accordion should listen for user interactions.","         * The value can be also 'mousedown', 'mouseup' or ['mouseenter','click'].","         * Mousedown event can be used if drag&drop is not enabled.","         *","         * @attribute itemChosen","         * @default click","         * @type String|Array","         */","        itemChosen: {","            value: \"click\",","            validator: function( value ) {","                return Lang.isString(value) || Lang.isArray(value);","            }","        },","","        /**","         * @description Contains the items, currently added to Accordion","         *","         * @attribute items","         * @readOnly","         * @default []","         * @type Array","         */","        items: {","            value: [],","            readOnly: true,","            validator: Lang.isArray","        },","","        /**","         * @attribute resizeEvent","         *","         * @description The event on which Accordion should listen for resizing.","         * The value must be one of these:","         * <ul>","         *     <li> String \"default\" - the Accordion will subscribe to Y.windowresize event","         *     </li>","         *     <li> An object in the following form:","         *         {","         *             sourceObject: some_javascript_object,","         *             resizeEvent: an_event_to_subscribe","         *         }","         *      </li>","         * </ul>","         * For example, if we are using LayoutManager's instance as sourceObject, we will have to use its \"resize\" event as resizeEvent","         *","         * @default \"default\"","         * @type String or Object","         */","","        resizeEvent: {","            value: DEFAULT,","            validator: function( value ){","                if( value === DEFAULT ){","                    return true;","                } else if( Lang.isObject(value) ){","                    if( Lang.isValue( value.sourceObject ) && Lang.isValue( value.resizeEvent ) ){","                        return true;","                    }","                }","","                return false;","            }","        },","","        /**","         * @attribute useAnimation","         * @description Boolean indicating that Accordion should use animation when expanding or collapsing items.","         *","         * @default true","         * @type Boolean","         */","        useAnimation: {","            value: true,","            validator: Lang.isBoolean","        },","","        /**","         * @attribute animation","         * @description Animation config values, see Y.Animation","         *","         * @default <code> {","         *    duration: 1,","         *    easing: Easing.easeOutStrong","         *  }","         *  </code>","         *","         * @type Object","         */","        animation: {","            value: {","                duration: 1,","                easing: Easing.easeOutStrong","            },","            validator: function( value ){","                return Lang.isObject( value ) && Lang.isNumber( value.duration ) &&","                    Lang.isFunction( value.easing );","            }","        },","","        /**","         * @attribute reorderItems","         * @description Boolean indicating that items can be reordered via drag and drop.<br>","         *","         * Enabling items reordering requires also including the optional drag and drop modules in YUI instance:<br>","         * 'dd-constrain', 'dd-proxy', 'dd-drop', or just 'dd'","         *","         * @default false","         * @type Boolean","         */","        reorderItems: {","            value: false,","            validator: function(value){","                return Lang.isBoolean(value) && !Lang.isUndefined( Y.DD );","            }","        },","","        /**","         * @attribute collapseOthersOnExpand","         * @description If true, on item expanding, all other expanded and not set as always visible items, will be collapsed","         * Otherwise, they will stay open","         *","         * @default true","         * @type Boolean","         */","        collapseOthersOnExpand: {","            value: true,","            validator: Lang.isBoolean","        }","    }","});","","}());","","/**"," * Provides AccordionItem class"," *"," * @module gallery-accordion"," */","","(function(){","","// Local constants","var Lang = Y.Lang,","    Node = Y.Node,","    JSON = Y.JSON,","    WidgetStdMod = Y.WidgetStdMod,","    AccItemName = \"accordion-item\",","    getCN = Y.ClassNameManager.getClassName,","    ","    C_ICONEXPANDED_EXPANDING = getCN( AccItemName, \"iconexpanded\", \"expanding\" ),","    C_ICONEXPANDED_COLLAPSING = getCN( AccItemName, \"iconexpanded\", \"collapsing\" ),","","    C_ICON = getCN( AccItemName, \"icon\" ),","    C_LABEL = getCN( AccItemName, \"label\" ),","    C_ICONALWAYSVISIBLE = getCN( AccItemName, \"iconalwaysvisible\" ),","    C_ICONSCONTAINER = getCN( AccItemName, \"icons\" ),","    C_ICONEXPANDED = getCN( AccItemName, \"iconexpanded\" ),","    C_ICONCLOSE = getCN( AccItemName, \"iconclose\" ),","    C_ICONCLOSE_HIDDEN = getCN( AccItemName, \"iconclose\", \"hidden\" ),","","    C_ICONEXPANDED_ON = getCN( AccItemName, \"iconexpanded\", \"on\" ),","    C_ICONEXPANDED_OFF = getCN( AccItemName, \"iconexpanded\", \"off\" ),","","    C_ICONALWAYSVISIBLE_ON = getCN( AccItemName, \"iconalwaysvisible\", \"on\" ),","    C_ICONALWAYSVISIBLE_OFF = getCN( AccItemName, \"iconalwaysvisible\", \"off\" ),","","    C_EXPANDED =  getCN( AccItemName, \"expanded\" ),","    C_CLOSABLE =  getCN( AccItemName, \"closable\" ),","    C_ALWAYSVISIBLE =  getCN( AccItemName, \"alwaysvisible\" ),","    C_CONTENTHEIGHT =  getCN( AccItemName, \"contentheight\" ),","","    TITLE = \"title\",","    STRINGS = \"strings\",","    RENDERED = \"rendered\",","    CLASS_NAME = \"className\",","    AUTO = \"auto\",","    STRETCH = \"stretch\",","    FIXED = \"fixed\",","    HEADER_SELECTOR = \".yui3-widget-hd\",","    DOT = \".\",","    HEADER_SELECTOR_SUB = \".yui3-widget-hd \" + DOT,","    INNER_HTML = \"innerHTML\",","    ICONS_CONTAINER = \"iconsContainer\",","    ICON = \"icon\",","    NODE_LABEL = \"nodeLabel\",","    ICON_ALWAYSVISIBLE = \"iconAlwaysVisible\",","    ICON_EXPANDED = \"iconExpanded\",","    ICON_CLOSE = \"iconClose\",","    HREF = \"href\",","    HREF_VALUE = \"#\",","    YUICONFIG = \"yuiConfig\",","","    REGEX_TRUE = /^(?:true|yes|1)$/,","    REGEX_AUTO = /^auto\\s*/,","    REGEX_STRETCH = /^stretch\\s*/,","    REGEX_FIXED = /^fixed-\\d+/;","","/**"," * Create an AccordionItem widget."," *"," * @class AccordionItem"," * @extends Widget"," */","","Y.AccordionItem = Y.Base.create( AccItemName, Y.Widget, [Y.WidgetStdMod], {","    /**","     * Creates the header content","     *","     * @method _createHeader","     * @protected","     */","    _createHeader: function(){","        var closable, templates, strings,  iconsContainer,","            icon, nodeLabel, iconExpanded, iconAlwaysVisible, iconClose;","","        icon = this.get( ICON );","        nodeLabel = this.get( NODE_LABEL );","        iconExpanded = this.get( ICON_EXPANDED );","        iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );","        iconClose = this.get( ICON_CLOSE );","        iconsContainer = this.get( ICONS_CONTAINER );","","        strings = this.get( STRINGS );","        closable = this.get( \"closable\" );","        templates = Y.AccordionItem.TEMPLATES;","","        if( !icon ){","            icon = Node.create( templates.icon );","            this.set( ICON, icon );","        }","","        if( !nodeLabel ){","            nodeLabel = Node.create( templates.label );","            this.set( NODE_LABEL, nodeLabel );","        } else if( !nodeLabel.hasAttribute( HREF ) ){","            nodeLabel.setAttribute( HREF, HREF_VALUE );","        }","","        nodeLabel.setContent( this.get( \"label\" ) );","","","        if( !iconsContainer ){","            iconsContainer = Node.create( templates.iconsContainer );","            this.set( ICONS_CONTAINER, iconsContainer );","        }","","        if( !iconAlwaysVisible ){","            iconAlwaysVisible = Node.create( templates.iconAlwaysVisible );","            iconAlwaysVisible.setAttribute( TITLE, strings.title_always_visible_off );","            this.set( ICON_ALWAYSVISIBLE, iconAlwaysVisible );","        } else if( !iconAlwaysVisible.hasAttribute( HREF ) ){","            iconAlwaysVisible.setAttribute( HREF, HREF_VALUE );","        }","","","        if( !iconExpanded ){","            iconExpanded = Node.create( templates.iconExpanded );","            iconExpanded.setAttribute( TITLE, strings.title_iconexpanded_off );","            this.set( ICON_EXPANDED, iconExpanded );","        } else if( !iconExpanded.hasAttribute( HREF ) ){","            iconExpanded.setAttribute( HREF, HREF_VALUE );","        }","","","        if( !iconClose ){","            iconClose = Node.create( templates.iconClose );","            iconClose.setAttribute( TITLE, strings.title_iconclose );","            this.set( ICON_CLOSE, iconClose );","        } else if( !iconClose.hasAttribute( HREF ) ){","            iconClose.setAttribute( HREF, HREF_VALUE );","        }","","        if( closable ){","            iconClose.removeClass( C_ICONCLOSE_HIDDEN );","        } else {","            iconClose.addClass( C_ICONCLOSE_HIDDEN );","        }","","        this._addHeaderComponents();","    },","","    /**","     * Add label and icons in the header. Also, it creates header in if not set from markup","     *","     * @method _addHeaderComponents","     * @protected","     */","    _addHeaderComponents: function(){","        var header, icon, nodeLabel, iconsContainer, iconExpanded,","            iconAlwaysVisible, iconClose;","","        icon = this.get( ICON );","        nodeLabel = this.get( NODE_LABEL );","        iconExpanded = this.get( ICON_EXPANDED );","        iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );","        iconClose = this.get( ICON_CLOSE );","        iconsContainer = this.get( ICONS_CONTAINER );","","        header = this.getStdModNode( WidgetStdMod.HEADER );","","        if( !header ){","            header = new Node( document.createDocumentFragment() );","            header.appendChild( icon );","            header.appendChild( nodeLabel );","            header.appendChild( iconsContainer );","            iconsContainer.appendChild( iconAlwaysVisible );","            iconsContainer.appendChild( iconExpanded );","            iconsContainer.appendChild( iconClose );","","            this.setStdModContent( WidgetStdMod.HEADER, header, WidgetStdMod.REPLACE );","        } else {","            if( !header.contains( icon ) ){","                if( header.contains( nodeLabel ) ){","                    header.insertBefore( icon, nodeLabel );","                } else {","                    header.appendChild( icon );","                }","            }","","            if( !header.contains( nodeLabel ) ){","                header.appendChild( nodeLabel );","            }","","            if( !header.contains( iconsContainer ) ){","                header.appendChild( iconsContainer );","            }","","            if( !iconsContainer.contains( iconAlwaysVisible ) ){","                iconsContainer.appendChild( iconAlwaysVisible );","            }","","            if( !iconsContainer.contains( iconExpanded ) ){","                iconsContainer.appendChild( iconExpanded );","            }","","            if( !iconsContainer.contains( iconClose ) ){","                iconsContainer.appendChild( iconClose );","            }","        }","    },","","","    /**","     * Handles the change of \"labelChanged\" property. Updates item's UI with the label provided","     *","     * @method _labelChanged","     * @protected","     * @param params {EventFacade} The event facade for the attribute change","     */","    _labelChanged: function( params ){","        var label;","","        if( this.get( RENDERED ) ){","            label = this.get( NODE_LABEL );","            label.set( INNER_HTML, params.newVal );","        }","    },","","","    /**","     * Handles the change of \"closableChanged\" property. Hides or shows close icon","     *","     * @method _closableChanged","     * @protected","     * @param params {EventFacade} The event facade for the attribute change","     */","    _closableChanged: function( params ){","        var iconClose;","","        if( this.get( RENDERED ) ){","            iconClose = this.get( ICON_CLOSE );","","            if( params.newVal ){","                iconClose.removeClass( C_ICONCLOSE_HIDDEN );","            } else {","                iconClose.addClass( C_ICONCLOSE_HIDDEN );","            }","        }","    },","","","    /**","     * Initializer lifecycle implementation for the AccordionItem class.","     *","     * @method initializer","     * @protected","     * @param  config {Object} Configuration object literal for the AccordionItem","     */","    initializer: function( config ) {","        this.after( \"labelChange\",  Y.bind( this._labelChanged, this ) );","        this.after( \"closableChange\", Y.bind( this._closableChanged, this ) );","    },","","","    /**","     * Destructor lifecycle implementation for the AccordionItem class.","     *","     * @method destructor","     * @protected","     */","    destructor : function() {","        // EMPTY","    },","","","    /**","     * Creates AccordionItem's header.","     *","     * @method renderUI","     * @protected","     */","    renderUI: function(){","        this._createHeader();","    },","","    /**","     * Configures/Sets up listeners to bind Widget State to UI/DOM","     *","     * @method bindUI","     * @protected","     */","    bindUI: function(){","        var contentBox = this.get( \"contentBox\" );","","        contentBox.delegate( \"click\", Y.bind( this._onLinkClick, this ), HEADER_SELECTOR + ' a' );","    },","","","","    /**","     * Prevent default action on clicking the link in the label","     *","     * @method _onLinkClick","     * @protected","     *","     * @param e {Event} The click event","     */","    _onLinkClick: function( e ){","        e.preventDefault();","    },","","   /**","    * Marks the item as always visible by adding class to always visible icon.","    * The icon will be updated only if needed.","    *","    * @method markAsAlwaysVisible","    * @param alwaysVisible {Boolean} If true, the item should be marked as always visible.","    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update","    */","    markAsAlwaysVisible: function( alwaysVisible ){","        var iconAlwaysVisisble, strings;","","        iconAlwaysVisisble = this.get( ICON_ALWAYSVISIBLE );","        strings = this.get( STRINGS );","","        if( alwaysVisible ){","            if( !iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){","                iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_OFF, C_ICONALWAYSVISIBLE_ON );","                iconAlwaysVisisble.set( TITLE, strings.title_always_visible_on );","                return true;","            }","        } else {","            if( iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){","                iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_ON, C_ICONALWAYSVISIBLE_OFF );","                iconAlwaysVisisble.set( TITLE, strings.title_always_visible_off );","                return true;","            }","        }","","        return false;","    },","","","    /**","    * Marks the item as expanded by adding class to expand icon.","    * The icon will be updated only if needed.","    *","    * @method markAsExpanded","    * @param expanded {Boolean} Boolean indicating that item should be marked as expanded.","    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update","    */","    markAsExpanded: function( expanded ){","        var strings, iconExpanded;","","        iconExpanded = this.get( ICON_EXPANDED );","        strings = this.get( STRINGS );","","        if( expanded ){","            if( !iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){","                iconExpanded.replaceClass( C_ICONEXPANDED_OFF, C_ICONEXPANDED_ON );","                iconExpanded.set( TITLE , strings.title_iconexpanded_on );","                return true;","            }","        } else {","            if( iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){","                iconExpanded.replaceClass( C_ICONEXPANDED_ON, C_ICONEXPANDED_OFF );","                iconExpanded.set( TITLE , strings.title_iconexpanded_off );","                return true;","            }","        }","","        return false;","    },","","","   /**","    * Marks the item as expanding by adding class to expand icon.","    * The method will update icon only if needed.","    *","    * @method markAsExpanding","    * @param expanding {Boolean} Boolean indicating that the item should be marked as expanding.","    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update","    */","    markAsExpanding: function( expanding ){","        var iconExpanded = this.get( ICON_EXPANDED );","","        if( expanding ){","            if( !iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){","                iconExpanded.addClass( C_ICONEXPANDED_EXPANDING );","                return true;","            }","        } else {","            if( iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){","                iconExpanded.removeClass( C_ICONEXPANDED_EXPANDING );","                return true;","            }","        }","","        return false;","    },","","","   /**","    * Marks the item as collapsing by adding class to expand icon.","    * The method will update icon only if needed.","    *","    * @method markAsCollapsing","    * @param collapsing {Boolean} Boolean indicating that the item should be marked as collapsing.","    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update","    */","    markAsCollapsing: function( collapsing ){","        var iconExpanded = this.get( ICON_EXPANDED );","","        if( collapsing ){","            if( !iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){","                iconExpanded.addClass( C_ICONEXPANDED_COLLAPSING );","                return true;","            }","        } else {","            if( iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){","                iconExpanded.removeClass( C_ICONEXPANDED_COLLAPSING );","                return true;","            }","        }","","        return false;","    },","","","    /**","     * Forces the item to resize as result of direct content manipulation (via 'innerHTML').","     * This method should be invoked if 'contentHeight' property has been set to 'auto'.","     *","     * @method resize","     */","    resize : function(){","        this.fire( \"contentUpdate\" );","    },","","","    /**","     * Parses and returns the value of contentHeight property, if set method \"fixed\".","     * The value must be in this format: fixed-X, where X is integer","     *","     * @method _extractFixedMethodValue","     * @param value {String} The value to be parsed","     * @return {Number} The parsed value or null","     * @protected","     */","    _extractFixedMethodValue: function( value ){","        var i, length, chr, height = null;","","        for( i = 6, length = value.length; i < length; i++ ){ // 6 = \"fixed-\".length","            chr = value.charAt(i);","            chr = parseInt( chr, 10 );","","            if( Lang.isNumber( chr ) ){","                height = (height * 10) + chr;","            } else {","                break;","            }","        }","","        return height;","    },","","","    /**","     * Validator applied to the icon attribute. Setting new value is not allowed if Accordion has been rendered.","     *","     * @method _validateIcon","     * @param value {MIXED} the value for the icon attribute","     * @return {Boolean}","     * @protected","     */","    _validateIcon: function( value ) {","        return !this.get(RENDERED) || value;","    },","","","    /**","     * Validator applied to the nodeLabel attribute. Setting new value is not allowed if Accordion has been rendered.","     *","     * @method _validateNodeLabel","     * @param value {MIXED} the value for the nodeLabel attribute","     * @return {Boolean}","     * @protected","     */","    _validateNodeLabel: function( value ) {","        return !this.get(RENDERED) || value;","    },","","","    /**","     * Validator applied to the iconsContainer attribute. Setting new value is not allowed if Accordion has been rendered.","     *","     * @method _validateIconsContainer","     * @param value {MIXED} the value for the iconsContainer attribute","     * @return {Boolean}","     * @protected","     */","    _validateIconsContainer: function( value ) {","        return !this.get(RENDERED) || value;","    },","","","    /**","     * Validator applied to the iconExpanded attribute. Setting new value is not allowed if Accordion has been rendered.","     *","     * @method _validateIconExpanded","     * @param value {MIXED} the value for the iconExpanded attribute","     * @return {Boolean}","     * @protected","     */","    _validateIconExpanded: function( value ) {","        return !this.get(RENDERED) || value;","    },","","","    /**","     * Validator applied to the iconAlwaysVisible attribute. Setting new value is not allowed if Accordion has been rendered.","     *","     * @method _validateIconAlwaysVisible","     * @param value {MIXED} the value for the iconAlwaysVisible attribute","     * @return {Boolean}","     * @protected","     */","    _validateIconAlwaysVisible: function( value ) {","        return !this.get(RENDERED) || value;","    },","","","    /**","     * Validator applied to the iconClose attribute. Setting new value is not allowed if Accordion has been rendered.","     *","     * @method _validateIconClose","     * @param value {MIXED} the value for the iconClose attribute","     * @return {Boolean}","     * @protected","     */","    _validateIconClose: function( value ) {","        return !this.get(RENDERED) || value;","    },","","","    /**","     * Setter applied to the input when updating the icon attribute.  Input can","     * be a Node, raw HTMLElement, or a selector string to locate it.","     *","     * @method _setIcon","     * @param value {Node|HTMLElement|String} The icon element Node or selector","     * @return {Node} The Node if found, null otherwise.","     * @protected","     */","    _setIcon: function( value ){","        return Y.one( value ) || null;","    },","","","    /**","     * Setter applied to the input when updating the nodeLabel attribute.  Input can","     * be a Node, raw HTMLElement, or a selector string to locate it.","     *","     * @method _setNodeLabel","     * @param value {Node|HTMLElement|String} The nodeLabel element Node or selector","     * @return {Node} The Node if found, null otherwise.","     * @protected","     */","    _setNodeLabel: function( value ){","        return Y.one( value ) || null;","    },","","","    /**","     * Setter applied to the input when updating the iconsContainer attribute.  Input can","     * be a Node, raw HTMLElement, or a selector string to locate it.","     *","     * @method _setIconsContainer","     * @param value {Node|HTMLElement|String} The iconsContainer element Node or selector","     * @return {Node} The Node if found, null otherwise.","     * @protected","     */","    _setIconsContainer: function( value ){","        return Y.one( value ) || null;","    },","","","    /**","     * Setter applied to the input when updating the iconExpanded attribute.  Input can","     * be a Node, raw HTMLElement, or a selector string to locate it.","     *","     * @method _setIconExpanded","     * @param value {Node|HTMLElement|String} The iconExpanded element Node or selector","     * @return {Node} The Node if found, null otherwise.","     * @protected","     */","    _setIconExpanded: function( value ){","        return Y.one( value ) || null;","    },","","","    /**","     * Setter applied to the input when updating the iconAlwaysVisible attribute.  Input can","     * be a Node, raw HTMLElement, or a selector string to locate it.","     *","     * @method _setIconAlwaysVisible","     * @param value {Node|HTMLElement|String} The iconAlwaysVisible element Node or selector","     * @return {Node} The Node if found, null otherwise.","     * @protected","     */","    _setIconAlwaysVisible: function( value ){","        return Y.one( value ) || null;","    },","","","    /**","     * Setter applied to the input when updating the iconClose attribute.  Input can","     * be a Node, raw HTMLElement, or a selector string to locate it.","     *","     * @method _setIconClose","     * @param value {Node|HTMLElement|String} The iconClose element Node or selector","     * @return {Node} The Node if found, null otherwise.","     * @protected","     */","    _setIconClose: function( value ){","        return Y.one( value ) || null;","    },","","","    /**","     * Overwrites Widget's _applyParser method in order to parse yuiConfig attribute before entering in HTML_PARSER attributes","     *","     * @method _applyParser","     * @protected","     * @param config {Object} User configuration object (will be populated with values from Node)","    */","    _applyParser : function(config) {","        var srcNode;","","        srcNode = this.get( \"srcNode\" );","","        if( srcNode ){","            this._parsedYUIConfig = srcNode.getAttribute( YUICONFIG );","","            if( this._parsedYUIConfig ){","                this._parsedYUIConfig = JSON.parse( this._parsedYUIConfig );","            }","        }","","        Y.AccordionItem.superclass._applyParser.apply( this, arguments );","","        delete this._parsedYUIConfig;","    },","","","    /**","     * Overwrites Y.WidgetStdMod fuction in order to resolve Widget 3.1 issue:<br>","     * If CONTENT_TEMPLATE is null, in renderUI the result of the following code:","     * <code>this.getStdModNode( Y.WidgetStdMod.HEADER );</code> is null.","     * The same is with <code>this.getStdModNode( Y.WidgetStdMod.BODY );</code>.","     *","     * @method _findStdModSection","     * @protected","     * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","     * @return {Node} The rendered node for the given section, or null if not found.","     */","    _findStdModSection: function(section) {","        return this.get(\"srcNode\").one(\"> .\" + Y.WidgetStdMod.SECTION_CLASS_NAMES[section]);","    },","","    CONTENT_TEMPLATE : null","}, {","    /**","     *  Static property provides a string to identify the class.","     *","     * @property NAME","     * @type String","     * @static","     */","    NAME : AccItemName,","","    /**","     * Static property used to define the default attribute","     * configuration for the Accordion.","     *","     * @property Accordion.ATTRS","     * @type Object","     * @static","     */","    ATTRS : {","","        /**","         * @description The Node, representing item's icon","         *","         * @attribute icon","         * @default null","         * @type Node","         */","        icon: {","            value: null,","            validator: function( value ){","                return this._validateIcon( value );","            },","            setter : function( value ) {","                return this._setIcon( value );","            }","        },","","        /**","         * @description The label of item","         *","         * @attribute label","         * @default \"&#160;\"","         * @type String","         */","        label: {","            value: \"&#160;\",","            validator: Lang.isString","        },","","        /**","         * @description The node, which contains item's label","         *","         * @attribute nodeLabel","         * @default null","         * @type Node","         */","        nodeLabel: {","            value: null,","            validator: function( value ){","                return this._validateNodeLabel( value );","            },","            setter : function( value ) {","                return this._setNodeLabel( value );","            }","        },","","","        /**","         * @description The container of iconAlwaysVisible, iconExpanded and iconClose","         *","         * @attribute iconsContainer","         * @default null","         * @type Node","         */","        iconsContainer: {","            value: null,","            validator: function( value ){","                return this._validateIconsContainer( value );","            },","            setter : function( value ) {","                return this._setIconsContainer( value );","            }","        },","","        /**","         * @description The Node, representing icon expanded","         *","         * @attribute iconExpanded","         * @default null","         * @type Node","         */","        iconExpanded: {","            value: null,","            validator: function( value ){","                return this._validateIconExpanded( value );","            },","            setter : function( value ) {","                return this._setIconExpanded( value );","            }","        },","","","        /**","         * @description The Node, representing icon always visible","         *","         * @attribute iconAlwaysVisible","         * @default null","         * @type Node","         */","        iconAlwaysVisible: {","            value: null,","            validator: function( value ){","                return this._validateIconAlwaysVisible( value );","            },","            setter : function( value ) {","                return this._setIconAlwaysVisible( value );","            }","        },","","","        /**","         * @description The Node, representing icon close, or null if the item is not closable","         *","         * @attribute iconClose","         * @default null","         * @type Node","         */","        iconClose: {","            value: null,","            validator: function( value ){","                return this._validateIconClose( value );","            },","            setter : function( value ) {","                return this._setIconClose( value );","            }","        },","","        /**","         * @description Get/Set expanded status of the item","         *","         * @attribute expanded","         * @default false","         * @type Boolean","         */","        expanded: {","            value: false,","            validator: Lang.isBoolean","        },","","        /**","         * @description Describe the method, which will be used when expanding/collapsing","         * the item. The value should be an object with at least one property (\"method\"):","         *  <dl>","         *      <dt>method</dt>","         *          <dd>The method can be one of these: \"auto\", \"fixed\" and \"stretch\"</dd>","         *      <dt>height</dt>","         *          <dd>Must be set only if method's value is \"fixed\"</dd>","         *  </dl>","         *","         * @attribute contentHeight","         * @default auto","         * @type Object","         */","        contentHeight: {","            value: {","                method: AUTO","            },","            validator: function( value ){","                if( Lang.isObject( value ) ){","                    if( value.method === AUTO ){","                        return true;","                    } else if( value.method === STRETCH ){","                        return true;","                    } else if( value.method === FIXED && Lang.isNumber( value.height ) &&","                        value.height >= 0 ){","                        return true;","                    }","                }","","                return false;","            }","        },","","        /**","         * @description Get/Set always visible status of the item","         *","         * @attribute alwaysVisible","         * @default false","         * @type Boolean","         */","        alwaysVisible: {","            value: false,","            validator: Lang.isBoolean","        },","","","        /**","         * @description Get/Set the animaton specific settings. By default there are no any settings.","         * If set, they will overwrite Accordion's animation settings","         *","         * @attribute animation","         * @default {}","         * @type Object","         */","        animation: {","            value: {},","            validator: Lang.isObject","        },","","        /**","         * @description Provides client side string localization support.","         *","         * @attribute strings","         * @default Object English messages","         * @type Object","         */","        strings: {","            value: {","                title_always_visible_off: \"Click to set always visible on\",","                title_always_visible_on: \"Click to set always visible off\",","                title_iconexpanded_off: \"Click to expand\",","                title_iconexpanded_on: \"Click to collapse\",","                title_iconclose: \"Click to close\"","            }","        },","","        /**","         * @description Boolean indicating that the item can be closed by user.","         * If true, there will be placed close icon, otherwise not","         *","         * @attribute closable","         * @default false","         * @type Boolean","         */","        closable: {","            value: false,","            validator: Lang.isBoolean","        }","    },","","","    /**","     * Static Object hash used to capture existing markup for progressive","     * enhancement.  Keys correspond to config attribute names and values","     * are selectors used to inspect the srcNode for an existing node","     * structure.","     *","     * @property HTML_PARSER","     * @type Object","     * @protected","     * @static","     */","    HTML_PARSER : {","","        icon: HEADER_SELECTOR_SUB + C_ICON,","","        label: function( srcNode ){","            var node, labelSelector, yuiConfig, label;","","            yuiConfig = this._parsedYUIConfig;","","            if( yuiConfig && Lang.isValue( yuiConfig.label ) ){","                return yuiConfig.label;","            }","","            label = srcNode.getAttribute( \"data-label\" );","","            if( label ){","                return label;","            }","","            labelSelector = HEADER_SELECTOR_SUB + C_LABEL;","            node = srcNode.one( labelSelector );","","            return (node) ? node.get( INNER_HTML ) : null;","        },","","        nodeLabel: HEADER_SELECTOR_SUB + C_LABEL,","","        iconsContainer: HEADER_SELECTOR_SUB + C_ICONSCONTAINER,","","        iconAlwaysVisible: HEADER_SELECTOR_SUB + C_ICONALWAYSVISIBLE,","","        iconExpanded: HEADER_SELECTOR_SUB + C_ICONEXPANDED,","","        iconClose: HEADER_SELECTOR_SUB + C_ICONCLOSE,","","        expanded: function( srcNode ){","            var yuiConfig, expanded;","","            yuiConfig = this._parsedYUIConfig;","","            if( yuiConfig && Lang.isBoolean( yuiConfig.expanded ) ){","                return yuiConfig.expanded;","            }","","            expanded = srcNode.getAttribute( \"data-expanded\" );","","            if( expanded ) {","                return REGEX_TRUE.test( expanded );","            }","","            return srcNode.hasClass( C_EXPANDED );","        },","","        alwaysVisible: function( srcNode ){","            var yuiConfig, alwaysVisible;","","            yuiConfig = this._parsedYUIConfig;","","            if( yuiConfig && Lang.isBoolean( yuiConfig.alwaysVisible ) ){","                alwaysVisible = yuiConfig.alwaysVisible;","            } else {","                alwaysVisible = srcNode.getAttribute( \"data-alwaysvisible\" );","","                if( alwaysVisible ) {","                    alwaysVisible = REGEX_TRUE.test( alwaysVisible );","                } else {","                    alwaysVisible = srcNode.hasClass( C_ALWAYSVISIBLE );","                }","            }","","            if( alwaysVisible ){","                this.set( \"expanded\", true, {","                    internalCall: true","                } );","            }","","            return alwaysVisible;","        },","","        closable: function( srcNode ){","            var yuiConfig, closable;","","            yuiConfig = this._parsedYUIConfig;","","            if( yuiConfig && Lang.isBoolean( yuiConfig.closable ) ){","                return yuiConfig.closable;","            }","","            closable = srcNode.getAttribute( \"data-closable\" );","","            if( closable ) {","                return REGEX_TRUE.test( closable );","            }","","            return srcNode.hasClass( C_CLOSABLE );","        },","","        contentHeight: function( srcNode ){","            var contentHeightClass, classValue, height = 0, index, yuiConfig,","                contentHeight;","","            yuiConfig = this._parsedYUIConfig;","","            if( yuiConfig && yuiConfig.contentHeight ){","                return yuiConfig.contentHeight;","            }","","            contentHeight = srcNode.getAttribute( \"data-contentheight\" );","","            if( REGEX_AUTO.test( contentHeight ) ){","                return {","                    method: AUTO","                };","            } else if( REGEX_STRETCH.test( contentHeight ) ){","                return {","                    method: STRETCH","                };","            } else if( REGEX_FIXED.test( contentHeight ) ){","                height = this._extractFixedMethodValue( contentHeight );","","                return {","                    method: FIXED,","                    height: height","                };","            }","","","            classValue = srcNode.get( CLASS_NAME );","","            contentHeightClass = C_CONTENTHEIGHT + '-';","","            index = classValue.indexOf( contentHeightClass, 0);","","            if( index >= 0 ){","                index += contentHeightClass.length;","","                classValue = classValue.substring( index );","","                if( REGEX_AUTO.test( classValue ) ){","                    return {","                        method: AUTO","                    };","                } else if( REGEX_STRETCH.test( classValue ) ){","                    return {","                        method: STRETCH","                    };","                } else if( REGEX_FIXED.test( classValue )  ){","                    height = this._extractFixedMethodValue( classValue );","","                    return {","                        method: FIXED,","                        height: height","                    };","                }","            }","","            return null;","        }","    },","","","     /**","      * The template HTML strings for each of header components.","      * e.g.","      * <pre>","      *    {","      *       icon : '&lt;a class=\"yui3-accordion-item-icon\"&gt;&lt;/a&gt;',","      *       label: '&lt;a href=\"#\" class=\"yui3-accordion-item-label\"&gt;&lt;/a&gt;',","      *       iconsContainer: '&lt;div class=\"yui3-accordion-item-icons\"&gt;&lt;/div&gt;',","      *       iconAlwaysVisible: '&lt;a href=\"#\" class=\"yui3-accordion-item-iconalwaysvisible\"&gt;&lt;/a&gt;',","      *       iconExpanded: '&lt;a href=\"#\" class=\"yui3-accordion-item-iconexpanded\"&gt;&lt;/a&gt;',","      *       iconClose: '&lt;a href=\"#\" class=\"yui3-accordion-item-iconclose yui3-accordion-item-iconclose-hidden\"&gt;&lt;/a&gt;'","      *    }","      * </pre>","      * @property WidgetStdMod.TEMPLATES","      * @type Object","      */","    TEMPLATES : {","         icon : '<a class=\"' + C_ICON + '\"></a>',","         label: '<a href=\"#\" class=\"' + C_LABEL + '\"></a>',","         iconsContainer: '<div class=\"' + C_ICONSCONTAINER + '\"></div>',","         iconExpanded: ['<a href=\"#\" class=\"', C_ICONEXPANDED, ' ', C_ICONEXPANDED_OFF, '\"></a>'].join(''),","         iconAlwaysVisible: ['<a href=\"#\" class=\"', C_ICONALWAYSVISIBLE, ' ',  C_ICONALWAYSVISIBLE_OFF, '\"></a>'].join(''),","         iconClose: ['<a href=\"#\" class=\"', C_ICONCLOSE, ' ', C_ICONCLOSE_HIDDEN, '\"></a>'].join('')","    }","","});","","}());","","","","}, 'gallery-2012.08.15-20-00' ,{requires:['event', 'anim-easing', 'widget', 'widget-stdmod', 'json-parse'], skinnable:true, optional:['dd-constrain', 'dd-proxy', 'dd-drop']});"];
_yuitest_coverage["/build/gallery-accordion/gallery-accordion.js"].lines = {"1":0,"9":0,"12":0,"74":0,"241":0,"243":0,"255":0,"257":0,"258":0,"260":0,"261":0,"263":0,"265":0,"267":0,"278":0,"280":0,"281":0,"306":0,"356":0,"358":0,"360":0,"361":0,"362":0,"363":0,"367":0,"379":0,"381":0,"382":0,"383":0,"385":0,"386":0,"388":0,"391":0,"392":0,"394":0,"395":0,"396":0,"399":0,"414":0,"416":0,"417":0,"419":0,"420":0,"425":0,"426":0,"445":0,"446":0,"458":0,"460":0,"462":0,"464":0,"476":0,"500":0,"503":0,"504":0,"505":0,"507":0,"508":0,"509":0,"510":0,"512":0,"513":0,"514":0,"515":0,"516":0,"517":0,"518":0,"520":0,"521":0,"523":0,"525":0,"530":0,"531":0,"535":0,"542":0,"543":0,"547":0,"552":0,"553":0,"557":0,"562":0,"575":0,"577":0,"578":0,"580":0,"581":0,"583":0,"584":0,"586":0,"587":0,"590":0,"591":0,"594":0,"595":0,"597":0,"598":0,"599":0,"600":0,"605":0,"616":0,"618":0,"619":0,"621":0,"622":0,"624":0,"625":0,"627":0,"629":0,"630":0,"632":0,"633":0,"634":0,"637":0,"638":0,"640":0,"641":0,"645":0,"646":0,"649":0,"650":0,"653":0,"666":0,"668":0,"670":0,"671":0,"672":0,"673":0,"674":0,"675":0,"677":0,"680":0,"694":0,"696":0,"697":0,"699":0,"700":0,"702":0,"703":0,"705":0,"706":0,"723":0,"725":0,"726":0,"743":0,"746":0,"748":0,"752":0,"753":0,"754":0,"759":0,"760":0,"762":0,"769":0,"771":0,"773":0,"774":0,"776":0,"778":0,"779":0,"782":0,"784":0,"786":0,"788":0,"790":0,"794":0,"795":0,"812":0,"814":0,"816":0,"820":0,"821":0,"836":0,"837":0,"854":0,"857":0,"860":0,"864":0,"865":0,"870":0,"871":0,"873":0,"880":0,"882":0,"884":0,"885":0,"887":0,"889":0,"890":0,"893":0,"895":0,"897":0,"899":0,"901":0,"905":0,"906":0,"923":0,"925":0,"927":0,"931":0,"932":0,"947":0,"949":0,"951":0,"952":0,"955":0,"956":0,"958":0,"967":0,"972":0,"973":0,"974":0,"975":0,"989":0,"991":0,"992":0,"994":0,"995":0,"997":0,"1011":0,"1013":0,"1015":0,"1016":0,"1018":0,"1019":0,"1032":0,"1034":0,"1036":0,"1037":0,"1039":0,"1043":0,"1046":0,"1059":0,"1062":0,"1063":0,"1065":0,"1066":0,"1069":0,"1070":0,"1071":0,"1072":0,"1073":0,"1074":0,"1075":0,"1077":0,"1078":0,"1081":0,"1083":0,"1084":0,"1085":0,"1086":0,"1088":0,"1089":0,"1090":0,"1093":0,"1097":0,"1113":0,"1116":0,"1117":0,"1119":0,"1121":0,"1122":0,"1123":0,"1125":0,"1129":0,"1131":0,"1132":0,"1133":0,"1134":0,"1135":0,"1136":0,"1138":0,"1139":0,"1142":0,"1146":0,"1147":0,"1158":0,"1160":0,"1161":0,"1163":0,"1164":0,"1165":0,"1166":0,"1170":0,"1171":0,"1172":0,"1173":0,"1187":0,"1189":0,"1190":0,"1193":0,"1194":0,"1195":0,"1196":0,"1198":0,"1199":0,"1204":0,"1205":0,"1208":0,"1213":0,"1224":0,"1226":0,"1227":0,"1230":0,"1231":0,"1232":0,"1234":0,"1235":0,"1236":0,"1237":0,"1238":0,"1240":0,"1245":0,"1248":0,"1249":0,"1250":0,"1252":0,"1256":0,"1268":0,"1270":0,"1272":0,"1274":0,"1275":0,"1276":0,"1278":0,"1279":0,"1281":0,"1282":0,"1283":0,"1284":0,"1298":0,"1300":0,"1301":0,"1302":0,"1304":0,"1305":0,"1307":0,"1308":0,"1309":0,"1311":0,"1312":0,"1315":0,"1316":0,"1319":0,"1321":0,"1322":0,"1323":0,"1324":0,"1348":0,"1349":0,"1352":0,"1353":0,"1355":0,"1367":0,"1369":0,"1370":0,"1371":0,"1376":0,"1378":0,"1380":0,"1381":0,"1383":0,"1384":0,"1389":0,"1403":0,"1405":0,"1407":0,"1408":0,"1410":0,"1411":0,"1414":0,"1429":0,"1432":0,"1433":0,"1434":0,"1435":0,"1436":0,"1437":0,"1438":0,"1440":0,"1466":0,"1469":0,"1473":0,"1474":0,"1477":0,"1478":0,"1480":0,"1482":0,"1483":0,"1484":0,"1486":0,"1487":0,"1490":0,"1491":0,"1493":0,"1494":0,"1497":0,"1499":0,"1500":0,"1501":0,"1502":0,"1504":0,"1508":0,"1509":0,"1513":0,"1514":0,"1516":0,"1517":0,"1520":0,"1521":0,"1524":0,"1525":0,"1527":0,"1529":0,"1530":0,"1535":0,"1540":0,"1542":0,"1543":0,"1546":0,"1548":0,"1549":0,"1552":0,"1559":0,"1561":0,"1565":0,"1577":0,"1579":0,"1581":0,"1582":0,"1583":0,"1584":0,"1586":0,"1589":0,"1590":0,"1594":0,"1595":0,"1598":0,"1600":0,"1602":0,"1603":0,"1605":0,"1607":0,"1612":0,"1626":0,"1628":0,"1629":0,"1630":0,"1631":0,"1632":0,"1633":0,"1638":0,"1639":0,"1640":0,"1642":0,"1647":0,"1659":0,"1661":0,"1662":0,"1664":0,"1665":0,"1666":0,"1667":0,"1669":0,"1674":0,"1690":0,"1725":0,"1767":0,"1768":0,"1769":0,"1770":0,"1771":0,"1775":0,"1809":0,"1827":0,"1854":0,"1857":0,"1919":0,"1927":0,"1930":0,"1931":0,"1932":0,"1933":0,"1934":0,"1935":0,"1937":0,"1938":0,"1939":0,"1941":0,"1942":0,"1943":0,"1946":0,"1947":0,"1948":0,"1949":0,"1950":0,"1953":0,"1956":0,"1957":0,"1958":0,"1961":0,"1962":0,"1963":0,"1964":0,"1965":0,"1966":0,"1970":0,"1971":0,"1972":0,"1973":0,"1974":0,"1975":0,"1979":0,"1980":0,"1981":0,"1982":0,"1983":0,"1984":0,"1987":0,"1988":0,"1990":0,"1993":0,"2003":0,"2006":0,"2007":0,"2008":0,"2009":0,"2010":0,"2011":0,"2013":0,"2015":0,"2016":0,"2017":0,"2018":0,"2019":0,"2020":0,"2021":0,"2022":0,"2024":0,"2026":0,"2027":0,"2028":0,"2030":0,"2034":0,"2035":0,"2038":0,"2039":0,"2042":0,"2043":0,"2046":0,"2047":0,"2050":0,"2051":0,"2065":0,"2067":0,"2068":0,"2069":0,"2082":0,"2084":0,"2085":0,"2087":0,"2088":0,"2090":0,"2104":0,"2105":0,"2127":0,"2137":0,"2139":0,"2153":0,"2165":0,"2167":0,"2168":0,"2170":0,"2171":0,"2172":0,"2173":0,"2174":0,"2177":0,"2178":0,"2179":0,"2180":0,"2184":0,"2197":0,"2199":0,"2200":0,"2202":0,"2203":0,"2204":0,"2205":0,"2206":0,"2209":0,"2210":0,"2211":0,"2212":0,"2216":0,"2229":0,"2231":0,"2232":0,"2233":0,"2234":0,"2237":0,"2238":0,"2239":0,"2243":0,"2256":0,"2258":0,"2259":0,"2260":0,"2261":0,"2264":0,"2265":0,"2266":0,"2270":0,"2281":0,"2295":0,"2297":0,"2298":0,"2299":0,"2301":0,"2302":0,"2304":0,"2308":0,"2321":0,"2334":0,"2347":0,"2360":0,"2373":0,"2386":0,"2400":0,"2414":0,"2428":0,"2442":0,"2456":0,"2470":0,"2482":0,"2484":0,"2486":0,"2487":0,"2489":0,"2490":0,"2494":0,"2496":0,"2512":0,"2546":0,"2549":0,"2575":0,"2578":0,"2593":0,"2596":0,"2610":0,"2613":0,"2628":0,"2631":0,"2646":0,"2649":0,"2684":0,"2685":0,"2686":0,"2687":0,"2688":0,"2689":0,"2691":0,"2695":0,"2773":0,"2775":0,"2777":0,"2778":0,"2781":0,"2783":0,"2784":0,"2787":0,"2788":0,"2790":0,"2804":0,"2806":0,"2808":0,"2809":0,"2812":0,"2814":0,"2815":0,"2818":0,"2822":0,"2824":0,"2826":0,"2827":0,"2829":0,"2831":0,"2832":0,"2834":0,"2838":0,"2839":0,"2844":0,"2848":0,"2850":0,"2852":0,"2853":0,"2856":0,"2858":0,"2859":0,"2862":0,"2866":0,"2869":0,"2871":0,"2872":0,"2875":0,"2877":0,"2878":0,"2881":0,"2882":0,"2885":0,"2886":0,"2888":0,"2895":0,"2897":0,"2899":0,"2901":0,"2902":0,"2904":0,"2906":0,"2907":0,"2910":0,"2911":0,"2914":0,"2915":0,"2917":0,"2924":0};
_yuitest_coverage["/build/gallery-accordion/gallery-accordion.js"].functions = {"initializer:240":0,"destructor:254":0,"_bindItemChosenEvent:277":0,"_initEvents:290":0,"_removeItemHandles:355":0,"_getNodeOffsetHeight:378":0,"_setItemProperties:413":0,"_setItemUI:444":0,"_afterRender:457":0,"_afterResizeEventChange:475":0,"_onItemChosen:499":0,"(anonymous 3):580":0,"_adjustStretchItems:574":0,"(anonymous 4):621":0,"_getHeightPerStretchItem:615":0,"_getItemContentHeight:665":0,"(anonymous 5):699":0,"_storeItemsForCollapsing:693":0,"_expandItem:722":0,"_processExpanding:742":0,"_onExpandComplete:811":0,"_collapseItem:835":0,"_processCollapsing:853":0,"_onCollapseComplete:922":0,"_initItemDragDrop:946":0,"_onDragStart:988":0,"_onDragEnd:1010":0,"_afterDragEnd:1031":0,"_onDropHit:1058":0,"_processItems:1112":0,"_setItemsProperties:1157":0,"_afterItemExpand:1186":0,"_afterItemAlwaysVisible:1223":0,"_afterContentHeight:1267":0,"(anonymous 6):1308":0,"_afterContentUpdate:1297":0,"_setUpResizing:1347":0,"(anonymous 7):1380":0,"renderUI:1366":0,"bindUI:1402":0,"_onItemChosenEvent:1428":0,"(anonymous 8):1499":0,"addItem:1465":0,"removeItem:1576":0,"(anonymous 9):1632":0,"getItem:1625":0,"(anonymous 10):1664":0,"getItemIndex:1658":0,"_findStdModSection:1689":0,"validator:1724":0,"validator:1766":0,"validator:1808":0,"validator:1826":0,"(anonymous 2):9":0,"_createHeader:1926":0,"_addHeaderComponents:2002":0,"_labelChanged:2064":0,"_closableChanged:2081":0,"initializer:2103":0,"renderUI:2126":0,"bindUI:2136":0,"_onLinkClick:2152":0,"markAsAlwaysVisible:2164":0,"markAsExpanded:2196":0,"markAsExpanding:2228":0,"markAsCollapsing:2255":0,"resize:2280":0,"_extractFixedMethodValue:2294":0,"_validateIcon:2320":0,"_validateNodeLabel:2333":0,"_validateIconsContainer:2346":0,"_validateIconExpanded:2359":0,"_validateIconAlwaysVisible:2372":0,"_validateIconClose:2385":0,"_setIcon:2399":0,"_setNodeLabel:2413":0,"_setIconsContainer:2427":0,"_setIconExpanded:2441":0,"_setIconAlwaysVisible:2455":0,"_setIconClose:2469":0,"_applyParser:2481":0,"_findStdModSection:2511":0,"validator:2545":0,"setter:2548":0,"validator:2574":0,"setter:2577":0,"validator:2592":0,"setter:2595":0,"validator:2609":0,"setter:2612":0,"validator:2627":0,"setter:2630":0,"validator:2645":0,"setter:2648":0,"validator:2683":0,"label:2772":0,"expanded:2803":0,"alwaysVisible:2821":0,"closable:2847":0,"contentHeight:2865":0,"(anonymous 11):1854":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-accordion/gallery-accordion.js"].coveredLines = 725;
_yuitest_coverage["/build/gallery-accordion/gallery-accordion.js"].coveredFunctions = 102;
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1);
YUI.add('gallery-accordion', function(Y) {

/**
 * Provides Accordion widget
 *
 * @module gallery-accordion
 */

_yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 9);
(function(){

// Local constants
_yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 2)", 9);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 12);
var Lang = Y.Lang,
    Node = Y.Node,
    Anim = Y.Anim,
    Easing = Y.Easing,
    AccName = "accordion",
    WidgetStdMod = Y.WidgetStdMod,
    QuirksMode = document.compatMode == "BackCompat",
    IEQuirksMode = QuirksMode && Y.UA.ie > 0,
    COLLAPSE_HEIGHT = IEQuirksMode ? 1 : 0,
    getCN = Y.ClassNameManager.getClassName,
    
    C_ITEM = "yui3-accordion-item",
    C_PROXY_VISIBLE = getCN( AccName, "proxyel", "visible" ),
    DRAGGROUP = getCN( AccName, "graggroup" ),

    BEFOREITEMADD = "beforeItemAdd",
    ITEMADDED = "itemAdded",
    ITEMCHOSEN = 'itemChosen',
    BEFOREITEMREMOVE = "beforeItemRemove",
    ITEMREMOVED = "itemRemoved",
    BEFOREITEMERESIZED = "beforeItemResized",
    ITEMERESIZED = "itemResized",

    BEFOREITEMEXPAND  = "beforeItemExpand",
    BEFOREITEMCOLLAPSE = "beforeItemCollapse",
    ITEMEXPANDED = "itemExpanded",
    ITEMCOLLAPSED = "itemCollapsed",

    BEFOREITEMREORDER = "beforeItemReorder",
    BEFOREENDITEMREORDER = "beforeEndItemReorder",
    ITEMREORDERED = "itemReordered",
    
    DEFAULT = "default",
    ANIMATION = "animation",
    ALWAYSVISIBLE = "alwaysVisible",
    EXPANDED = "expanded",
    COLLAPSEOTHERSONEXPAND = "collapseOthersOnExpand",
    ITEMS = "items",
    CONTENT_HEIGHT = "contentHeight",
    ICON_CLOSE = "iconClose",
    ICON_ALWAYSVISIBLE = "iconAlwaysVisible",
    STRETCH = "stretch",
    PX = "px",
    CONTENT_BOX = "contentBox",
    BOUNDING_BOX = "boundingBox",
    SRCNODE = "srcNode",
    RENDERED = "rendered",
    BODYCONTENT = "bodyContent",
    CHILDREN = "children",
    PARENT_NODE = "parentNode",
    NODE = "node",
    DATA = "data";


/**
 * Accordion creates an widget, consists of one or more items, which can be collapsed, expanded,
 * set as always visible and reordered by using Drag&Drop. Collapsing/expanding might be animated.
 *
 * @class Accordion
 * @extends Widget
 */

_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 74);
Y.Accordion = Y.Base.create( AccName, Y.Widget, [], {

    /**
     * Signals the beginning of adding an item to the Accordion.
     *
     * @event beforeItemAdd
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being added</dd>
     *  </dl>
     */


    /**
     * Signals an item has been added to the Accordion.
     *
     * @event itemAdded
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been added</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of removing an item.
     *
     * @event beforeItemRemove
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being removed</dd>
     *  </dl>
     */


    /**
     * Signals an item has been removed from Accordion.
     *
     * @event itemRemoved
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been removed</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of resizing an item.
     *
     * @event beforeItemResized
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being resized</dd>
     *  </dl>
     */


    /**
     * Signals an item has been resized.
     *
     * @event itemResized
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been resized</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of expanding an item
     *
     * @event beforeItemExpand
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being expanded</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of collapsing an item
     *
     * @event beforeItemCollapse
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being collapsed</dd>
     *  </dl>
     */


    /**
     * Signals an item has been expanded
     *
     * @event itemExpanded
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been expanded</dd>
     *  </dl>
     */


    /**
     * Signals an item has been collapsed
     *
     * @event itemCollapsed
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been collapsed</dd>
     *  </dl>
     */


    /**
     * Signals the beginning of reordering an item
     *
     * @event beforeItemReorder
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being reordered</dd>
     *  </dl>
     */


    /**
     * Fires before the end of item reordering
     *
     * @event beforeEndItemReorder
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item being reordered</dd>
     *  </dl>
     */


    /**
     * Signals an item has been reordered
     *
     * @event itemReordered
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> instance of the item that has been reordered</dd>
     *  </dl>
     */


    /**
     * Initializer lifecycle implementation for the Accordion class. Publishes events,
     * initializes internal properties and subscribes for resize event.
     *
     * @method initializer
     * @protected
     * @param config {Object} Configuration object literal for the Accordion
     */
    initializer: function( config ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "initializer", 240);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 241);
this._initEvents();

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 243);
this.after( "render", Y.bind( this._afterRender, this ) );
    },


    /**
     * Destructor lifecycle implementation for the Accordion class.
     * Removes and destroys all registered items.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "destructor", 254);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 255);
var items, item, i, length;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 257);
items = this.get( ITEMS );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 258);
length = items.length;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 260);
for( i = length - 1; i >= 0; i-- ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 261);
item = items[ i ];

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 263);
items.splice( i, 1 );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 265);
this._removeItemHandles( item );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 267);
item.destroy();
        }
    },

    /**
     * Binds an event to Accordion's contentBox.
     *
     * @method _bindItemChosenEvent
     * @protected
     */
    _bindItemChosenEvent: function(itemChosenEvent) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_bindItemChosenEvent", 277);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 278);
var contentBox;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 280);
contentBox = this.get( CONTENT_BOX );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 281);
contentBox.delegate( itemChosenEvent, Y.bind( this._onItemChosenEvent, this ), '.yui3-widget-hd' );
    },

    /**
     * Publishes Accordion's events
     *
     * @method _initEvents
     * @protected
     */
    _initEvents: function(){
        /**
         * Signals that an item has been chosen by user, i.e. there was interaction with this item.
         * The developer may prevent the action which follows (expanding, collapsing, closing, etc.) by preventing the default function, bound to this event.
         *
         * @event itemChosen
         * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>item</dt>
         *          <dd>An <code>AccordionItem</code> item on which user has clicked or pressed key</dd>
         *      <dt>srcIconAlwaysVisible <code>Boolean</code></dt>
         *          <dd>True if user has clicked on 'set as always visible' icon</dd>
         *      <dt>srcIconClose <code>Boolean</code></dt>
         *          <dd>True if user has clicked on 'close' icon</dd>
         *  </dl>
         */
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_initEvents", 290);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 306);
this.publish( ITEMCHOSEN, {
            defaultFn: this._onItemChosen
        });
    },

    /**
     * Contains items for collapsing
     * @property _forCollapsing
     * @protected
     * @type Object
     */
    _forCollapsing : {},


    /**
     * Contains items for expanding
     * @property _forExpanding
     * @protected
     * @type Object
     */
    _forExpanding : {},


    /**
    * Contains currently running animations
    * @property _animations
    * @protected
    * @type Object
    */
    _animations   : {},


    /**
     * Collection of items handles.
     * Keeps track of each items's event handle, as returned from <code>Y.on</code> or <code>Y.after</code>.
     * @property _itemHandles
     * @private
     * @type Object
     */
    _itemsHandles: {},


    /**
     * Removes all handles, attched to given item
     *
     * @method _removeItemHandles
     * @protected
     * @param item {Y.AccordionItem} The item, which handles to remove
     */
    _removeItemHandles: function( item ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_removeItemHandles", 355);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 356);
var itemHandles, itemHandle;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 358);
itemHandles = this._itemsHandles[ item ];

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 360);
for( itemHandle in itemHandles ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 361);
if( itemHandles.hasOwnProperty( itemHandle ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 362);
itemHandle = itemHandles[ itemHandle ];
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 363);
itemHandle.detach();
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 367);
delete this._itemsHandles[ item ];
    },

    /**
     * Obtains the precise height of the node provided, including padding and border.
     *
     * @method _getNodeOffsetHeight
     * @protected
     * @param node {Node|HTMLElement} The node to gather the height from
     * @return {Number} The calculated height or zero in case of failure
     */
    _getNodeOffsetHeight: function( node ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_getNodeOffsetHeight", 378);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 379);
var height, preciseRegion;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 381);
if( node instanceof Node ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 382);
if( node.hasMethod( "getBoundingClientRect" ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 383);
preciseRegion = node.invoke( "getBoundingClientRect" );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 385);
if( preciseRegion ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 386);
height = preciseRegion.bottom - preciseRegion.top;

                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 388);
return height;
                }
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 391);
height = node.get( "offsetHeight" );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 392);
return Y.Lang.isValue( height ) ? height : 0;
            }
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 394);
if( node ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 395);
height = node.offsetHeight;
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 396);
return Y.Lang.isValue( height ) ? height : 0;
        }}

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 399);
return 0;
    },


    /**
     * Updates expand and alwaysVisible properties of given item with the values provided.
     * The properties will be updated only if needed.
     *
     * @method _setItemProperties
     * @protected
     * @param item {Y.AccordionItem} The item, which properties should be updated
     * @param expanding {Boolean} The new value of "expanded" property
     * @param alwaysVisible {Boolean} The new value of "alwaysVisible" property
     */
    _setItemProperties: function( item, expanding, alwaysVisible ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setItemProperties", 413);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 414);
var curAlwaysVisible, curExpanded;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 416);
curAlwaysVisible = item.get( ALWAYSVISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 417);
curExpanded = item.get( EXPANDED );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 419);
if( expanding != curExpanded ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 420);
item.set( EXPANDED, expanding, {
                internalCall: true
            });
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 425);
if( alwaysVisible !== curAlwaysVisible ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 426);
item.set( ALWAYSVISIBLE, alwaysVisible, {
                internalCall: true
            });
        }
    },


    /**
     * Updates user interface of an item and marks it as expanded, alwaysVisible or both
     *
     * @method _setItemUI
     * @protected
     * @param item {Y.AccordionItem} The item, which user interface should be updated
     * @param expanding {Boolean} If true, the item will be marked as expanded.
     * If false, the item will be marked as collapsed
     * @param alwaysVisible {Boolean} If true, the item will be marked as always visible.
     * If false, the always visible mark will be removed
     */
    _setItemUI: function( item, expanding, alwaysVisible ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setItemUI", 444);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 445);
item.markAsExpanded( expanding );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 446);
item.markAsAlwaysVisible( alwaysVisible );
    },


    /**
     * Sets listener to resize event
     *
     * @method _afterRender
     * @protected
     * @param e {Event} after render custom event
     */
    _afterRender: function( e ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_afterRender", 457);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 458);
var resizeEvent;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 460);
resizeEvent = this.get( "resizeEvent" );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 462);
this._setUpResizing( resizeEvent );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 464);
this.after( "resizeEventChange", Y.bind( this._afterResizeEventChange, this ) );
    },


    /**
     * Set up resizing with the new value provided
     *
     * @method _afterResizeEventChange
     * @protected
     * @param params {Event} after resizeEventChange custom event
     */
    _afterResizeEventChange: function( params ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_afterResizeEventChange", 475);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 476);
this._setUpResizing( params.newVal );
    },


    /**
     * Distributes the involved items as result of user interaction on item header.
     * Some items might be stored in the list for collapsing, other in the list for expanding.
     * Finally, invokes <code>_processItems</code> function, except if item has been expanded and
     * user has clicked on always visible icon.
     * If the user clicked on close icon, the item will be closed.
     *
     * @method _onItemChosen
     * @protected
     * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
     *  <dl>
     *      <dt>item</dt>
     *          <dd>An <code>AccordionItem</code> item on which user has clicked or pressed key</dd>
     *      <dt>srcIconAlwaysVisible {Boolean}</dt>
     *          <dd>True if user has clicked on 'set as always visible' icon</dd>
     *      <dt>srcIconClose {Boolean}</dt>
     *          <dd>True if user has clicked on 'close' icon</dd>
     *  </dl>
     */
    _onItemChosen: function( event ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onItemChosen", 499);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 500);
var toBeExcluded, alwaysVisible, expanded, collapseOthersOnExpand,
            item, srcIconAlwaysVisible, srcIconClose;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 503);
item = event.item;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 504);
srcIconAlwaysVisible = event.srcIconAlwaysVisible;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 505);
srcIconClose = event.srcIconClose;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 507);
toBeExcluded = {};
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 508);
collapseOthersOnExpand = this.get( COLLAPSEOTHERSONEXPAND );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 509);
alwaysVisible = item.get( ALWAYSVISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 510);
expanded      = item.get( EXPANDED );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 512);
if( srcIconClose ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 513);
this.removeItem( item );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 514);
return;
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 515);
if( srcIconAlwaysVisible ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 516);
if( expanded ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 517);
alwaysVisible = !alwaysVisible;
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 518);
expanded = alwaysVisible ? true : expanded;

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 520);
this._setItemProperties( item, expanded, alwaysVisible );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 521);
this._setItemUI( item, expanded, alwaysVisible );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 523);
return;
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 525);
this._forExpanding[ item ] = {
                    'item': item,
                    alwaysVisible: true
                };

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 530);
if( collapseOthersOnExpand ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 531);
toBeExcluded[ item ] = {
                        'item': item
                    };

                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 535);
this._storeItemsForCollapsing( toBeExcluded );
                }
            }
        } else {
            /*
             * Do the opposite
             */
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 542);
if( expanded ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 543);
this._forCollapsing[ item ] = {
                    'item': item
                };
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 547);
this._forExpanding[ item ] = {
                    'item': item,
                    'alwaysVisible': alwaysVisible
                };

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 552);
if( collapseOthersOnExpand ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 553);
toBeExcluded[ item ] = {
                        'item': item
                    };

                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 557);
this._storeItemsForCollapsing( toBeExcluded );
                }
            }
        }}

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 562);
this._processItems();
    },


    /**
     * Helper method to adjust the height of all items, which <code>contentHeight</code> property is set as "stretch".
     * If some item has animation running, it will be stopped before running another one.
     *
     * @method adjustStretchItems
     * @protected
     * @return {Number} The calculated height per strech item
     */
    _adjustStretchItems: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_adjustStretchItems", 574);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 575);
var items = this.get( ITEMS ), heightPerStretchItem, forExpanding;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 577);
heightPerStretchItem = this._getHeightPerStretchItem();
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 578);
forExpanding = this._forExpanding;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 580);
Y.Array.each( items, function( item, index, items ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 3)", 580);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 581);
var body, bodyHeight, anim, heightSettings, expanded;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 583);
heightSettings = item.get( CONTENT_HEIGHT );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 584);
expanded      = item.get( EXPANDED );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 586);
if( !forExpanding[ item ] && heightSettings.method === STRETCH && expanded ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 587);
anim = this._animations[ item ];

                // stop waiting animation
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 590);
if( anim ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 591);
anim.stop();
                }

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 594);
body = item.getStdModNode( WidgetStdMod.BODY );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 595);
bodyHeight = this._getNodeOffsetHeight( body );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 597);
if( heightPerStretchItem < bodyHeight ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 598);
this._processCollapsing( item, heightPerStretchItem );
                } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 599);
if( heightPerStretchItem > bodyHeight ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 600);
this._processExpanding( item, heightPerStretchItem );
                }}
            }
        }, this );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 605);
return heightPerStretchItem;
    },

    /**
     * Calculates the height per strech item.
     *
     * @method _getHeightPerStretchItem
     * @protected
     * @return {Number} The calculated height per strech item
     */
    _getHeightPerStretchItem: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_getHeightPerStretchItem", 615);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 616);
var height, items, stretchCounter = 0;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 618);
items = this.get( ITEMS );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 619);
height = this.get( BOUNDING_BOX ).get( "clientHeight" );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 621);
Y.Array.each( items, function( item, index, items ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 4)", 621);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 622);
var collapsed, itemContentHeight, header, heightSettings, headerHeight;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 624);
header = item.getStdModNode( WidgetStdMod.HEADER );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 625);
heightSettings = item.get( CONTENT_HEIGHT );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 627);
headerHeight = this._getNodeOffsetHeight( header );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 629);
height -= headerHeight;
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 630);
collapsed = !item.get( EXPANDED );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 632);
if( collapsed ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 633);
height -= COLLAPSE_HEIGHT;
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 634);
return;
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 637);
if( heightSettings.method === STRETCH ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 638);
stretchCounter++;
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 640);
itemContentHeight = this._getItemContentHeight( item );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 641);
height -= itemContentHeight;
            }
        }, this );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 645);
if( stretchCounter > 0 ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 646);
height /= stretchCounter;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 649);
if( height < 0 ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 650);
height = 0;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 653);
return height;
    },


    /**
     * Calculates the height of given item depending on its "contentHeight" property.
     *
     * @method _getItemContentHeight
     * @protected
     * @param item {Y.AccordionItem} The item, which height should be calculated
     * @return {Number} The calculated item's height
     */
    _getItemContentHeight: function( item ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_getItemContentHeight", 665);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 666);
var heightSettings, height = 0, body, bodyContent;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 668);
heightSettings = item.get( CONTENT_HEIGHT );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 670);
if( heightSettings.method === "auto" ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 671);
body = item.getStdModNode( WidgetStdMod.BODY );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 672);
bodyContent = body.get( CHILDREN ).item(0);
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 673);
height = bodyContent ? this._getNodeOffsetHeight( bodyContent ) : 0;
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 674);
if( heightSettings.method === "fixed" ) {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 675);
height = heightSettings.height;
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 677);
height = this._getHeightPerStretchItem();
        }}

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 680);
return height;
    },


    /**
     * Stores all items, which are expanded and not set as always visible in list
     * in order to be collapsed later.
     *
     * @method _storeItemsForCollapsing
     * @protected
     * @param itemsToBeExcluded {Object} (optional) Contains one or more <code>Y.AccordionItem</code> instances,
     * which should be not included in the list
     */
    _storeItemsForCollapsing: function( itemsToBeExcluded ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_storeItemsForCollapsing", 693);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 694);
var items;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 696);
itemsToBeExcluded = itemsToBeExcluded || {};
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 697);
items = this.get( ITEMS );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 699);
Y.Array.each( items, function( item, index, items ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 5)", 699);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 700);
var expanded, alwaysVisible;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 702);
expanded = item.get( EXPANDED );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 703);
alwaysVisible = item.get( ALWAYSVISIBLE );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 705);
if( expanded && !alwaysVisible && !itemsToBeExcluded[ item ] ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 706);
this._forCollapsing[ item ] = {
                    'item': item
                };
            }
        }, this );
    },


    /**
     * Expands an item to given height. This includes also an update to item's user interface
     *
     * @method _expandItem
     * @protected
     * @param item {Y.AccordionItem} The item, which should be expanded.
     * @param height {Number} The height to which we should expand the item
     */
    _expandItem: function( item, height ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_expandItem", 722);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 723);
var alwaysVisible = item.get( ALWAYSVISIBLE );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 725);
this._processExpanding( item, height );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 726);
this._setItemUI( item, true, alwaysVisible );
    },


    /**
     * Expands an item to given height. Depending on the <code>useAnimation</code> setting,
     * the process of expanding might be animated. This setting will be ignored, if <code>forceSkipAnimation</code> param
     * is <code>true</code>.
     *
     * @method _processExpanding
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be expanded
     * @param forceSkipAnimation {Boolean} If true, the animation will be skipped,
     * without taking in consideration Accordion's <code>useAnimation</code> setting
     * @param height {Number} The height to which item should be expanded
     */
    _processExpanding: function( item, height, forceSkipAnimation ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_processExpanding", 742);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 743);
var anim, curAnim, animSettings, notifyOthers = false,
            accAnimationSettings, body;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 746);
body = item.getStdModNode( WidgetStdMod.BODY );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 748);
this.fire( BEFOREITEMERESIZED, {
            'item': item
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 752);
if( body.get( "clientHeight" ) <= COLLAPSE_HEIGHT ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 753);
notifyOthers = true;
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 754);
this.fire( BEFOREITEMEXPAND, {
                'item': item
            });
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 759);
if( !forceSkipAnimation && this.get( "useAnimation" ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 760);
animSettings = item.get( ANIMATION ) || {};

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 762);
anim = new Anim( {
                node: body,
                to: {
                    'height': height
                }
            });

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 769);
anim.on( "end", Y.bind( this._onExpandComplete, this, item, notifyOthers ) );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 771);
accAnimationSettings = this.get( ANIMATION );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 773);
anim.set( "duration", animSettings.duration || accAnimationSettings.duration );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 774);
anim.set( "easing"  , animSettings.easing   || accAnimationSettings.easing   );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 776);
curAnim = this._animations[ item ];

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 778);
if( curAnim ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 779);
curAnim.stop();
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 782);
item.markAsExpanding( true );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 784);
this._animations[ item ] = anim;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 786);
anim.run();
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 788);
body.setStyle( "height", height + PX );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 790);
this.fire( ITEMERESIZED, {
                'item': item
            });

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 794);
if( notifyOthers ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 795);
this.fire( ITEMEXPANDED, {
                    'item': item
                });
            }
        }
    },


    /**
     * Executes when animated expanding completes
     *
     * @method _onExpandComplete
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance which has been expanded
     * @param notifyOthers {Boolean} If true, itemExpanded event will be fired
     */
    _onExpandComplete: function( item, notifyOthers ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onExpandComplete", 811);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 812);
delete this._animations[ item ];

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 814);
item.markAsExpanding( false );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 816);
this.fire( ITEMERESIZED, {
            'item': item
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 820);
if( notifyOthers ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 821);
this.fire( ITEMEXPANDED, {
                'item': item
            });
        }
    },


    /**
     * Collapse an item and update its user interface
     *
     * @method _collapseItem
     * @protected
     * @param item {Y.AccordionItem} The item, which should be collapsed
     */
    _collapseItem: function( item ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_collapseItem", 835);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 836);
this._processCollapsing( item, COLLAPSE_HEIGHT );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 837);
this._setItemUI( item, false, false );
    },


    /**
     * Collapse an item to given height. Depending on the <code>useAnimation</code> setting,
     * the process of collapsing might be animated. This setting will be ignored, if <code>forceSkipAnimation</code> param
     * is <code>true</code>.
     *
     * @method _processCollapsing
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be collapsed
     * @param height {Number} The height to which item should be collapsed
     * @param forceSkipAnimation {Boolean} If true, the animation will be skipped,
     * without taking in consideration Accordion's <code>useAnimation</code> setting
     */
    _processCollapsing: function( item, height, forceSkipAnimation ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_processCollapsing", 853);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 854);
var anim, curAnim, animSettings, accAnimationSettings, body,
            notifyOthers = (height === COLLAPSE_HEIGHT);

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 857);
body = item.getStdModNode( WidgetStdMod.BODY );


        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 860);
this.fire( BEFOREITEMERESIZED, {
            'item': item
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 864);
if( notifyOthers ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 865);
this.fire( BEFOREITEMCOLLAPSE, {
                'item': item
            });
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 870);
if( !forceSkipAnimation && this.get( "useAnimation" ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 871);
animSettings = item.get( ANIMATION ) || {};

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 873);
anim = new Anim( {
                node: body,
                to: {
                    'height': height
                }
            });

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 880);
anim.on( "end", Y.bind( this._onCollapseComplete, this, item, notifyOthers ) );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 882);
accAnimationSettings = this.get( ANIMATION );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 884);
anim.set( "duration", animSettings.duration || accAnimationSettings.duration );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 885);
anim.set( "easing"  , animSettings.easing   || accAnimationSettings.easing );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 887);
curAnim = this._animations[ item ];

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 889);
if( curAnim ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 890);
curAnim.stop();
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 893);
item.markAsCollapsing( true );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 895);
this._animations[ item ] = anim;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 897);
anim.run();
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 899);
body.setStyle( "height", height + PX );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 901);
this.fire( ITEMERESIZED, {
                'item': item
            });

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 905);
if( notifyOthers ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 906);
this.fire( ITEMCOLLAPSED, {
                    'item': item
                });
            }
        }
    },


    /**
     * Executes when animated collapsing completes
     *
     * @method _onCollapseComplete
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance which has been collapsed
     * @param notifyOthers {Boolean} If true, itemCollapsed event will be fired
     */
    _onCollapseComplete: function( item, notifyOthers ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onCollapseComplete", 922);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 923);
delete this._animations[ item ];

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 925);
item.markAsCollapsing( false );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 927);
this.fire( ITEMERESIZED, {
            item: item
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 931);
if( notifyOthers ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 932);
this.fire( ITEMCOLLAPSED, {
                'item': item
            });
        }
    },


    /**
     * Make an item draggable. The item can be reordered later.
     *
     * @method _initItemDragDrop
     * @protected
     * @param item {Y.AccordionItem} An <code>Y.AccordionItem</code> instance to be set as draggable
     */
    _initItemDragDrop: function( item ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_initItemDragDrop", 946);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 947);
var itemHeader, dd, bb, itemBB, ddrop;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 949);
itemHeader = item.getStdModNode( WidgetStdMod.HEADER );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 951);
if( itemHeader.dd ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 952);
return;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 955);
bb = this.get( BOUNDING_BOX );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 956);
itemBB = item.get( BOUNDING_BOX );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 958);
dd = new Y.DD.Drag({
            node: itemHeader,
            groups: [ DRAGGROUP ]
        }).plug(Y.Plugin.DDProxy, {
            moveOnEnd: false
        }).plug(Y.Plugin.DDConstrained, {
            constrain2node: bb
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 967);
ddrop = new Y.DD.Drop({
            node: itemBB,
            groups: [ DRAGGROUP ]
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 972);
dd.on   ( "drag:start",   Y.bind( this._onDragStart,  this, dd ) );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 973);
dd.on   ( "drag:end"  ,   Y.bind( this._onDragEnd,    this, dd ) );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 974);
dd.after( "drag:end"  ,   Y.bind( this._afterDragEnd, this, dd ) );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 975);
dd.on   ( "drag:drophit", Y.bind( this._onDropHit,    this, dd ) );
    },


    /**
     * Sets the label of the item being dragged on the drag proxy.
     * Fires beforeItemReorder event - returning false will cancel reordering
     *
     * @method _onDragStart
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:start custom event
     */
    _onDragStart: function( dd, e ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onDragStart", 988);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 989);
var dragNode, item;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 991);
item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 992);
dragNode = dd.get( "dragNode" );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 994);
dragNode.addClass( C_PROXY_VISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 995);
dragNode.set( "innerHTML", item.get( "label" ) );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 997);
return this.fire( BEFOREITEMREORDER, { 'item': item } );
    },


    /**
     * Restores HTML structure of the drag proxy.
     * Fires beforeEndItemReorder event - returning false will cancel reordering
     *
     * @method _onDragEnd
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:end custom event
     */
    _onDragEnd: function( dd, e ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onDragEnd", 1010);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1011);
var dragNode, item;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1013);
dragNode = dd.get( "dragNode" );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1015);
dragNode.removeClass( C_PROXY_VISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1016);
dragNode.set( "innerHTML", "" );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1018);
item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1019);
return this.fire( BEFOREENDITEMREORDER, { 'item': item } );
    },


    /**
     * Set drophit to false in dragdrop instance's custom value (if there has been drophit) and fires itemReordered event
     *
     * @method _afterDragEnd
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:end custom event
     */
    _afterDragEnd: function( dd, e ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_afterDragEnd", 1031);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1032);
var item, data;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1034);
data = dd.get( DATA );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1036);
if( data.drophit ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1037);
item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1039);
dd.set( DATA, {
                drophit: false
            } );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1043);
return this.fire( ITEMREORDERED, { 'item': item } );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1046);
return true;
    },


    /**
     * Moves the source item before or after target item.
     *
     * @method _onDropHit
     * @protected
     * @param dd {Y.DD.Drag} The drag instance of the item
     * @param e {Event} the DD instance's drag:drophit custom event
     */
    _onDropHit: function( dd, e) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onDropHit", 1058);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1059);
var mineIndex, targetItemIndex, targetItemBB, itemBB, cb,
            goingUp, items, targetItem, item;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1062);
item = this.getItem( dd.get( NODE ).get( PARENT_NODE ) );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1063);
targetItem = this.getItem( e.drop.get( NODE ) );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1065);
if( targetItem === item ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1066);
return false;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1069);
mineIndex = this.getItemIndex( item );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1070);
targetItemIndex = this.getItemIndex( targetItem );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1071);
targetItemBB = targetItem.get( BOUNDING_BOX );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1072);
itemBB = item.get( BOUNDING_BOX );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1073);
cb = this.get( CONTENT_BOX );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1074);
goingUp = false;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1075);
items = this.get( ITEMS );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1077);
if( targetItemIndex < mineIndex ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1078);
goingUp = true;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1081);
cb.removeChild( itemBB );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1083);
if( goingUp ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1084);
cb. insertBefore( itemBB, targetItemBB );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1085);
items.splice( mineIndex, 1 );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1086);
items.splice( targetItemIndex, 0, item );
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1088);
cb. insertBefore( itemBB, targetItemBB.next( C_ITEM ) );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1089);
items.splice( targetItemIndex + 1, 0, item );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1090);
items.splice( mineIndex, 1 );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1093);
dd.set( DATA, {
            drophit: true
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1097);
return true;
    },


    /**
     * Process items as result of user interaction or properties change.
     * This includes four steps:
     * 1. Update the properties of the items
     * 2. Collapse all items stored in the list for collapsing
     * 3. Adjust all stretch items
     * 4. Expand items stored in the list for expanding
     *
     * @method _processItems
     * @protected
     */
    _processItems: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_processItems", 1112);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1113);
var forCollapsing, forExpanding, itemCont, heightPerStretchItem,
            height, heightSettings, item;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1116);
forCollapsing = this._forCollapsing;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1117);
forExpanding = this._forExpanding;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1119);
this._setItemsProperties();

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1121);
for( item in forCollapsing ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1122);
if( forCollapsing.hasOwnProperty( item ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1123);
itemCont = forCollapsing[ item ];

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1125);
this._collapseItem( itemCont.item );
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1129);
heightPerStretchItem = this._adjustStretchItems();

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1131);
for( item in forExpanding ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1132);
if( forExpanding.hasOwnProperty( item ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1133);
itemCont = forExpanding[ item ];
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1134);
item = itemCont.item;
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1135);
height = heightPerStretchItem;
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1136);
heightSettings = item.get( CONTENT_HEIGHT );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1138);
if( heightSettings.method !== STRETCH ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1139);
height = this._getItemContentHeight( item );
                }

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1142);
this._expandItem( item, height );
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1146);
this._forCollapsing = {};
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1147);
this._forExpanding = {};
    },


    /**
     * Update properties of items, which were stored in the lists for collapsing or expanding
     *
     * @method _setItemsProperties
     * @protected
     */
    _setItemsProperties: function (){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setItemsProperties", 1157);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1158);
var forCollapsing, forExpanding, itemData;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1160);
forCollapsing = this._forCollapsing;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1161);
forExpanding = this._forExpanding;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1163);
for( itemData in forCollapsing ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1164);
if( forCollapsing.hasOwnProperty( itemData ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1165);
itemData = forCollapsing[ itemData ];
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1166);
this._setItemProperties( itemData.item, false, false );
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1170);
for( itemData in forExpanding ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1171);
if( forExpanding.hasOwnProperty( itemData ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1172);
itemData = forExpanding[ itemData ];
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1173);
this._setItemProperties( itemData.item, true, itemData.alwaysVisible );
            }
        }
    },


    /**
     * Handles the change of "expand" property of given item
     *
     * @method _afterItemExpand
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterItemExpand: function( params ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_afterItemExpand", 1186);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1187);
var expanded, item, alwaysVisible, collapseOthersOnExpand;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1189);
if( params.internalCall ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1190);
return;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1193);
expanded = params.newVal;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1194);
item    = params.currentTarget;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1195);
alwaysVisible = item.get( ALWAYSVISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1196);
collapseOthersOnExpand = this.get( COLLAPSEOTHERSONEXPAND );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1198);
if( expanded ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1199);
this._forExpanding[ item ] = {
                'item': item,
                'alwaysVisible': alwaysVisible
            };

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1204);
if( collapseOthersOnExpand ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1205);
this._storeItemsForCollapsing();
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1208);
this._forCollapsing[ item ] = {
                'item': item
            };
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1213);
this._processItems();
    },

    /**
     * Handles the change of "alwaysVisible" property of given item
     *
     * @method _afterItemAlwaysVisible
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterItemAlwaysVisible: function( params ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_afterItemAlwaysVisible", 1223);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1224);
var item, alwaysVisible, expanded;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1226);
if( params.internalCall ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1227);
return;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1230);
alwaysVisible = params.newVal;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1231);
item         = params.currentTarget;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1232);
expanded     = item.get( EXPANDED );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1234);
if( alwaysVisible ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1235);
if( expanded ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1236);
this._setItemProperties( item, true, true );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1237);
this._setItemUI( item, true, true );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1238);
return;
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1240);
this._forExpanding[ item ] = {
                    'item': item,
                    'alwaysVisible': true
                };

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1245);
this._storeItemsForCollapsing();
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1248);
if( expanded ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1249);
this._setItemUI( item, true, false );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1250);
return;
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1252);
return;
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1256);
this._processItems();
    },


    /**
     * Handles the change of "contentHeight" property of given item
     *
     * @method _afterContentHeight
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterContentHeight: function( params ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_afterContentHeight", 1267);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1268);
var item, itemContentHeight, body, bodyHeight, expanded;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1270);
item = params.currentTarget;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1272);
this._adjustStretchItems();

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1274);
if( params.newVal.method !== STRETCH ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1275);
expanded = item.get( EXPANDED );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1276);
itemContentHeight = this._getItemContentHeight( item );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1278);
body = item.getStdModNode( WidgetStdMod.BODY );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1279);
bodyHeight = this._getNodeOffsetHeight( body );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1281);
if( itemContentHeight < bodyHeight ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1282);
this._processCollapsing( item, itemContentHeight, !expanded );
            } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1283);
if( itemContentHeight > bodyHeight ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1284);
this._processExpanding( item, itemContentHeight, !expanded );
            }}
        }
    },


    /**
     * Handles the change of "contentUpdate" property of given item
     *
     * @method _afterContentUpdate
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _afterContentUpdate : function( params ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_afterContentUpdate", 1297);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1298);
var item, body, bodyHeight, expanded, auto, anim;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1300);
item = params.currentTarget;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1301);
auto = item.get( "contentHeight" ).method === "auto";
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1302);
expanded = item.get( EXPANDED );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1304);
body = item.getStdModNode( WidgetStdMod.BODY );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1305);
bodyHeight = this._getNodeOffsetHeight( body );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1307);
if( auto && expanded && params.src !== Y.Widget.UI_SRC ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1308);
Y.later( 0, this, function(){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 6)", 1308);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1309);
var itemContentHeight = this._getItemContentHeight( item );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1311);
if( itemContentHeight !== bodyHeight ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1312);
anim = this._animations[ item ];

                    // stop waiting animation
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1315);
if( anim ){
                        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1316);
anim.stop();
                    }

                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1319);
this._adjustStretchItems();

                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1321);
if( itemContentHeight < bodyHeight ){
                        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1322);
this._processCollapsing( item, itemContentHeight, !expanded );
                    } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1323);
if( itemContentHeight > bodyHeight ){
                        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1324);
this._processExpanding( item, itemContentHeight, !expanded );
                    }}
                }
            } );
        }
    },


    /**
     * Subscribe for resize event, which could be provided from the browser or from an arbitrary object.
     * For example, if there is LayoutManager in the page, it is preferable to subscribe to its resize event,
     * instead to those, which browser provides.
     *
     * @method _setUpResizing
     * @protected
     * @param value {String|Object} String "default" or object with the following properties:
     *  <dl>
     *      <dt>sourceObject</dt>
     *          <dd>An abbitrary object</dd>
     *      <dt>resizeEvent</dt>
     *          <dd>The name of its resize event</dd>
     *  </dl>
     */
    _setUpResizing: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setUpResizing", 1347);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1348);
if( this._resizeEventHandle ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1349);
this._resizeEventHandle.detach();
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1352);
if( value === DEFAULT ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1353);
this._resizeEventHandle = Y.on( 'windowresize', Y.bind( this._adjustStretchItems, this ) );
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1355);
this._resizeEventHandle = value.sourceObject.on( value.resizeEvent, Y.bind( this._adjustStretchItems, this ) );
        }
    },


    /**
     * Creates one or more items found in Accordion's <code>contentBox</code>
     *
     * @method renderUI
     * @protected
     */
    renderUI: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "renderUI", 1366);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1367);
var srcNode, itemsDom, contentBox, srcNodeId;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1369);
srcNode = this.get( SRCNODE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1370);
contentBox = this.get( CONTENT_BOX );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1371);
srcNodeId = srcNode.get( "id" );

        /*
         * Widget 3.1 workaround - the Id of contentBox is generated by YUI, instead to keep srcNode's Id, so we set it manually
         */
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1376);
contentBox.set( "id", srcNodeId );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1378);
itemsDom = srcNode.all( "> ." + C_ITEM );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1380);
itemsDom.each( function( itemNode, index, itemsDom ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 7)", 1380);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1381);
var newItem;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1383);
if( !this.getItem( itemNode ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1384);
newItem = new Y.AccordionItem({
                    srcNode: itemNode,
                    id : itemNode.get( "id" )
                });

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1389);
this.addItem( newItem );
            }
        }, this );
    },


    /**
     * Add listener(s) to <code>itemChosen</code> event in Accordion's content box.
     * If itemChosen is an Array, this function will invoke multiple times _bindItemChosenEvent
     *
     * @method bindUI
     * @protected
     */
    bindUI: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "bindUI", 1402);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1403);
var i, itemChosenEvent, length;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1405);
itemChosenEvent = this.get( ITEMCHOSEN );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1407);
if( Lang.isArray(itemChosenEvent) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1408);
length = itemChosenEvent.length;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1410);
for( i = 0; i < length; i++ ) {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1411);
this._bindItemChosenEvent(itemChosenEvent[i]);
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1414);
this._bindItemChosenEvent(itemChosenEvent);
        }
    },


    /**
     * Listening for itemChosen event, determines the source (is that iconClose, iconAlwaysVisisble, etc.) and
     * invokes this._onItemChosen for further processing
     *
     * @method _onItemChosenEvent
     * @protected
     *
     * @param e {Event} The itemChosen event
     */
    _onItemChosenEvent: function(e){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onItemChosenEvent", 1428);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1429);
var header, itemNode, item, iconAlwaysVisible,
            iconClose, srcIconAlwaysVisible, srcIconClose;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1432);
header = e.currentTarget;
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1433);
itemNode = header.get( PARENT_NODE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1434);
item = this.getItem( itemNode );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1435);
iconAlwaysVisible = item.get( ICON_ALWAYSVISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1436);
iconClose = item.get( ICON_CLOSE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1437);
srcIconAlwaysVisible = (iconAlwaysVisible === e.target);
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1438);
srcIconClose = (iconClose === e.target);

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1440);
this.fire( ITEMCHOSEN, {
            item: item,
            srcIconAlwaysVisible: srcIconAlwaysVisible, 
            srcIconClose: srcIconClose
        });
    },


    /**
     * Add an item to Accordion. Items could be added/removed multiple times and they
     * will be rendered in the process of adding, if not.
     * The item will be expanded, collapsed, or set as always visible depending on the
     * settings. Item's properties will be also updated, if they are incomplete.
     * For example, if <code>alwaysVisible</code> is true, but <code>expanded</code>
     * property is false, it will be set to true also.
     *
     * If the second param, <code>parentItem</code> is an <code>Y.AccordionItem</code> instance,
     * registered in Accordion, the item will be added as child of the <code>parentItem</code>
     *
     * @method addItem
     * @param item {Y.AccordionItem} The item to be added in Accordion
     * @param parentItem {Y.AccordionItem} (optional) This item will be the parent of the item being added
     *
     * @return {Boolean} True in case of successfully added item, false otherwise
     */
    addItem: function( item, parentItem ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "addItem", 1465);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1466);
var expanded, alwaysVisible, itemBody, itemBodyContent, itemIndex, items, contentBox,
            itemHandles, itemContentBox, res, children;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1469);
res = this.fire( BEFOREITEMADD, {
            'item': item
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1473);
if( !res ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1474);
return false;
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1477);
items = this.get( ITEMS );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1478);
contentBox = this.get( CONTENT_BOX );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1480);
itemContentBox = item.get( CONTENT_BOX );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1482);
if( !itemContentBox.inDoc() ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1483);
if( parentItem ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1484);
itemIndex = this.getItemIndex( parentItem );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1486);
if( itemIndex < 0 ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1487);
return false;
                }

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1490);
items.splice( itemIndex, 0, item );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1491);
contentBox.insertBefore( itemContentBox, parentItem.get( BOUNDING_BOX ) );
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1493);
items.push( item );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1494);
contentBox.insertBefore( itemContentBox, null );
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1497);
children = contentBox.get( CHILDREN );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1499);
res = children.some( function( node, index, nodeList ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 8)", 1499);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1500);
if( node === itemContentBox ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1501);
items.splice( index, 0, item );
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1502);
return true;
                } else {
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1504);
return false;
                }
            }, this );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1508);
if( !res ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1509);
return false;
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1513);
itemBody = item.getStdModNode( WidgetStdMod.BODY );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1514);
itemBodyContent = item.get( BODYCONTENT );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1516);
if( !itemBody && !itemBodyContent  ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1517);
item.set( BODYCONTENT, "" );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1520);
if( !item.get( RENDERED ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1521);
item.render();
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1524);
expanded = item.get( EXPANDED );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1525);
alwaysVisible = item.get( ALWAYSVISIBLE );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1527);
expanded = expanded || alwaysVisible;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1529);
if( expanded ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1530);
this._forExpanding[ item ] = {
                'item': item,
                'alwaysVisible': alwaysVisible
            };
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1535);
this._forCollapsing[ item ] = {
                'item': item
            };
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1540);
this._processItems();

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1542);
if( this.get( "reorderItems" ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1543);
this._initItemDragDrop( item );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1546);
itemHandles = this._itemsHandles[ item ];

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1548);
if( !itemHandles ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1549);
itemHandles = {};
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1552);
itemHandles = {
            "expandedChange" : item.after( "expandedChange", Y.bind( this._afterItemExpand, this ) ),
            "alwaysVisibleChange" : item.after( "alwaysVisibleChange", Y.bind( this._afterItemAlwaysVisible, this ) ),
            "contentHeightChange" : item.after( "contentHeightChange", Y.bind( this._afterContentHeight, this ) ),
            "contentUpdate" : item.after( "contentUpdate", Y.bind( this._afterContentUpdate, this ) )
        };

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1559);
this._itemsHandles[ item ] = itemHandles;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1561);
this.fire( ITEMADDED, {
            'item': item
        });

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1565);
return true;
    },


    /**
     * Removes an previously registered item in Accordion
     *
     * @method removeItem
     * @param p_item {Y.AccordionItem|Number} The item to be removed, or its index
     * @return {Y.AccordionItem} The removed item or null if not found
     */
    removeItem: function( p_item ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "removeItem", 1576);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1577);
var items, bb, item = null, itemIndex, allowed;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1579);
items = this.get( ITEMS );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1581);
if( Lang.isNumber( p_item ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1582);
itemIndex = p_item;
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1583);
if( p_item instanceof Y.AccordionItem ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1584);
itemIndex = this.getItemIndex( p_item );
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1586);
return null;
        }}

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1589);
if( itemIndex >= 0 ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1590);
allowed = this.fire( BEFOREITEMREMOVE, {
                item: p_item
            });

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1594);
if( !allowed ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1595);
return null;
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1598);
item = items.splice( itemIndex, 1 )[0];

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1600);
this._removeItemHandles( item );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1602);
bb = item.get( BOUNDING_BOX );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1603);
bb.remove();

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1605);
this._adjustStretchItems();

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1607);
this.fire( ITEMREMOVED, {
                item: p_item
            });
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1612);
return item;
    },


    /**
     * Searching for item, previously registered in Accordion
     *
     * @method getItem
     * @param param {Number|Y.Node} If number, this must be item's index.
     * If Node, it should be the value of item's <code>contentBox</code> or <code>boundingBox</code> properties
     *
     * @return {Y.AccordionItem} The found item or null
     */
    getItem: function( param ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "getItem", 1625);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1626);
var items = this.get( ITEMS ), item = null;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1628);
if( Lang.isNumber( param ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1629);
item = items[ param ];
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1630);
return (item instanceof Y.AccordionItem) ? item : null;
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1631);
if( param instanceof Node ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1632);
Y.Array.some( items, function( tmpItem, index, items ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 9)", 1632);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1633);
var contentBox = tmpItem.get( CONTENT_BOX );

                /*
                 * Both contentBox and boundingBox point to same node, so it is safe to check only one of them
                 */
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1638);
if( contentBox === param ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1639);
item = tmpItem;
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1640);
return true;
                } else {
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1642);
return false;
                }
            }, this );
        }}

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1647);
return item;
    },


    /**
     * Looking for the index of previously registered item
     *
     * @method getItemIndex
     * @param item {Y.AccordionItem} The item which index should be returned
     * @return {Number} Item index or <code>-1</code> if item has been not found
     */
    getItemIndex: function( item ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "getItemIndex", 1658);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1659);
var res = -1, items;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1661);
if( item instanceof Y.AccordionItem ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1662);
items = this.get( ITEMS );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1664);
Y.Array.some( items, function( tmpItem, index, items ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 10)", 1664);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1665);
if( tmpItem === item ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1666);
res = index;
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1667);
return true;
                } else {
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1669);
return false;
                }
            }, this );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1674);
return res;
    },


    /**
     * Overwrites Y.WidgetStdMod fuction in order to resolve Widget 3.1 issue:<br>
     * If CONTENT_TEMPLATE is null, in renderUI the result of the following code:
     * <code>this.getStdModNode( Y.WidgetStdMod.HEADER );</code> is null.
     * The same is with <code>this.getStdModNode( Y.WidgetStdMod.BODY );</code>.
     *
     * @method _findStdModSection
     * @protected
     * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
     * @return {Node} The rendered node for the given section, or null if not found.
     */
    _findStdModSection: function(section) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_findStdModSection", 1689);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1690);
return this.get(SRCNODE).one("> ." + Y.WidgetStdMod.SECTION_CLASS_NAMES[section]);
    },

    CONTENT_TEMPLATE : null
}, {
    /**
     *  Static property provides a string to identify the class.
     *
     * @property Accordion.NAME
     * @type String
     * @static
     */
    NAME : AccName,

    /**
     * Static property used to define the default attribute
     * configuration for the Accordion.
     *
     * @property Accordion.ATTRS
     * @type Object
     * @static
     */
    ATTRS : {
        /**
         * @description The event on which Accordion should listen for user interactions.
         * The value can be also 'mousedown', 'mouseup' or ['mouseenter','click'].
         * Mousedown event can be used if drag&drop is not enabled.
         *
         * @attribute itemChosen
         * @default click
         * @type String|Array
         */
        itemChosen: {
            value: "click",
            validator: function( value ) {
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 1724);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1725);
return Lang.isString(value) || Lang.isArray(value);
            }
        },

        /**
         * @description Contains the items, currently added to Accordion
         *
         * @attribute items
         * @readOnly
         * @default []
         * @type Array
         */
        items: {
            value: [],
            readOnly: true,
            validator: Lang.isArray
        },

        /**
         * @attribute resizeEvent
         *
         * @description The event on which Accordion should listen for resizing.
         * The value must be one of these:
         * <ul>
         *     <li> String "default" - the Accordion will subscribe to Y.windowresize event
         *     </li>
         *     <li> An object in the following form:
         *         {
         *             sourceObject: some_javascript_object,
         *             resizeEvent: an_event_to_subscribe
         *         }
         *      </li>
         * </ul>
         * For example, if we are using LayoutManager's instance as sourceObject, we will have to use its "resize" event as resizeEvent
         *
         * @default "default"
         * @type String or Object
         */

        resizeEvent: {
            value: DEFAULT,
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 1766);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1767);
if( value === DEFAULT ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1768);
return true;
                } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1769);
if( Lang.isObject(value) ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1770);
if( Lang.isValue( value.sourceObject ) && Lang.isValue( value.resizeEvent ) ){
                        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1771);
return true;
                    }
                }}

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1775);
return false;
            }
        },

        /**
         * @attribute useAnimation
         * @description Boolean indicating that Accordion should use animation when expanding or collapsing items.
         *
         * @default true
         * @type Boolean
         */
        useAnimation: {
            value: true,
            validator: Lang.isBoolean
        },

        /**
         * @attribute animation
         * @description Animation config values, see Y.Animation
         *
         * @default <code> {
         *    duration: 1,
         *    easing: Easing.easeOutStrong
         *  }
         *  </code>
         *
         * @type Object
         */
        animation: {
            value: {
                duration: 1,
                easing: Easing.easeOutStrong
            },
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 1808);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1809);
return Lang.isObject( value ) && Lang.isNumber( value.duration ) &&
                    Lang.isFunction( value.easing );
            }
        },

        /**
         * @attribute reorderItems
         * @description Boolean indicating that items can be reordered via drag and drop.<br>
         *
         * Enabling items reordering requires also including the optional drag and drop modules in YUI instance:<br>
         * 'dd-constrain', 'dd-proxy', 'dd-drop', or just 'dd'
         *
         * @default false
         * @type Boolean
         */
        reorderItems: {
            value: false,
            validator: function(value){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 1826);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1827);
return Lang.isBoolean(value) && !Lang.isUndefined( Y.DD );
            }
        },

        /**
         * @attribute collapseOthersOnExpand
         * @description If true, on item expanding, all other expanded and not set as always visible items, will be collapsed
         * Otherwise, they will stay open
         *
         * @default true
         * @type Boolean
         */
        collapseOthersOnExpand: {
            value: true,
            validator: Lang.isBoolean
        }
    }
});

}());

/**
 * Provides AccordionItem class
 *
 * @module gallery-accordion
 */

_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1854);
(function(){

// Local constants
_yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "(anonymous 11)", 1854);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1857);
var Lang = Y.Lang,
    Node = Y.Node,
    JSON = Y.JSON,
    WidgetStdMod = Y.WidgetStdMod,
    AccItemName = "accordion-item",
    getCN = Y.ClassNameManager.getClassName,
    
    C_ICONEXPANDED_EXPANDING = getCN( AccItemName, "iconexpanded", "expanding" ),
    C_ICONEXPANDED_COLLAPSING = getCN( AccItemName, "iconexpanded", "collapsing" ),

    C_ICON = getCN( AccItemName, "icon" ),
    C_LABEL = getCN( AccItemName, "label" ),
    C_ICONALWAYSVISIBLE = getCN( AccItemName, "iconalwaysvisible" ),
    C_ICONSCONTAINER = getCN( AccItemName, "icons" ),
    C_ICONEXPANDED = getCN( AccItemName, "iconexpanded" ),
    C_ICONCLOSE = getCN( AccItemName, "iconclose" ),
    C_ICONCLOSE_HIDDEN = getCN( AccItemName, "iconclose", "hidden" ),

    C_ICONEXPANDED_ON = getCN( AccItemName, "iconexpanded", "on" ),
    C_ICONEXPANDED_OFF = getCN( AccItemName, "iconexpanded", "off" ),

    C_ICONALWAYSVISIBLE_ON = getCN( AccItemName, "iconalwaysvisible", "on" ),
    C_ICONALWAYSVISIBLE_OFF = getCN( AccItemName, "iconalwaysvisible", "off" ),

    C_EXPANDED =  getCN( AccItemName, "expanded" ),
    C_CLOSABLE =  getCN( AccItemName, "closable" ),
    C_ALWAYSVISIBLE =  getCN( AccItemName, "alwaysvisible" ),
    C_CONTENTHEIGHT =  getCN( AccItemName, "contentheight" ),

    TITLE = "title",
    STRINGS = "strings",
    RENDERED = "rendered",
    CLASS_NAME = "className",
    AUTO = "auto",
    STRETCH = "stretch",
    FIXED = "fixed",
    HEADER_SELECTOR = ".yui3-widget-hd",
    DOT = ".",
    HEADER_SELECTOR_SUB = ".yui3-widget-hd " + DOT,
    INNER_HTML = "innerHTML",
    ICONS_CONTAINER = "iconsContainer",
    ICON = "icon",
    NODE_LABEL = "nodeLabel",
    ICON_ALWAYSVISIBLE = "iconAlwaysVisible",
    ICON_EXPANDED = "iconExpanded",
    ICON_CLOSE = "iconClose",
    HREF = "href",
    HREF_VALUE = "#",
    YUICONFIG = "yuiConfig",

    REGEX_TRUE = /^(?:true|yes|1)$/,
    REGEX_AUTO = /^auto\s*/,
    REGEX_STRETCH = /^stretch\s*/,
    REGEX_FIXED = /^fixed-\d+/;

/**
 * Create an AccordionItem widget.
 *
 * @class AccordionItem
 * @extends Widget
 */

_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1919);
Y.AccordionItem = Y.Base.create( AccItemName, Y.Widget, [Y.WidgetStdMod], {
    /**
     * Creates the header content
     *
     * @method _createHeader
     * @protected
     */
    _createHeader: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_createHeader", 1926);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1927);
var closable, templates, strings,  iconsContainer,
            icon, nodeLabel, iconExpanded, iconAlwaysVisible, iconClose;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1930);
icon = this.get( ICON );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1931);
nodeLabel = this.get( NODE_LABEL );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1932);
iconExpanded = this.get( ICON_EXPANDED );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1933);
iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1934);
iconClose = this.get( ICON_CLOSE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1935);
iconsContainer = this.get( ICONS_CONTAINER );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1937);
strings = this.get( STRINGS );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1938);
closable = this.get( "closable" );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1939);
templates = Y.AccordionItem.TEMPLATES;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1941);
if( !icon ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1942);
icon = Node.create( templates.icon );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1943);
this.set( ICON, icon );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1946);
if( !nodeLabel ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1947);
nodeLabel = Node.create( templates.label );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1948);
this.set( NODE_LABEL, nodeLabel );
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1949);
if( !nodeLabel.hasAttribute( HREF ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1950);
nodeLabel.setAttribute( HREF, HREF_VALUE );
        }}

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1953);
nodeLabel.setContent( this.get( "label" ) );


        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1956);
if( !iconsContainer ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1957);
iconsContainer = Node.create( templates.iconsContainer );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1958);
this.set( ICONS_CONTAINER, iconsContainer );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1961);
if( !iconAlwaysVisible ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1962);
iconAlwaysVisible = Node.create( templates.iconAlwaysVisible );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1963);
iconAlwaysVisible.setAttribute( TITLE, strings.title_always_visible_off );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1964);
this.set( ICON_ALWAYSVISIBLE, iconAlwaysVisible );
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1965);
if( !iconAlwaysVisible.hasAttribute( HREF ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1966);
iconAlwaysVisible.setAttribute( HREF, HREF_VALUE );
        }}


        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1970);
if( !iconExpanded ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1971);
iconExpanded = Node.create( templates.iconExpanded );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1972);
iconExpanded.setAttribute( TITLE, strings.title_iconexpanded_off );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1973);
this.set( ICON_EXPANDED, iconExpanded );
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1974);
if( !iconExpanded.hasAttribute( HREF ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1975);
iconExpanded.setAttribute( HREF, HREF_VALUE );
        }}


        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1979);
if( !iconClose ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1980);
iconClose = Node.create( templates.iconClose );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1981);
iconClose.setAttribute( TITLE, strings.title_iconclose );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1982);
this.set( ICON_CLOSE, iconClose );
        } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1983);
if( !iconClose.hasAttribute( HREF ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1984);
iconClose.setAttribute( HREF, HREF_VALUE );
        }}

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1987);
if( closable ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1988);
iconClose.removeClass( C_ICONCLOSE_HIDDEN );
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1990);
iconClose.addClass( C_ICONCLOSE_HIDDEN );
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 1993);
this._addHeaderComponents();
    },

    /**
     * Add label and icons in the header. Also, it creates header in if not set from markup
     *
     * @method _addHeaderComponents
     * @protected
     */
    _addHeaderComponents: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_addHeaderComponents", 2002);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2003);
var header, icon, nodeLabel, iconsContainer, iconExpanded,
            iconAlwaysVisible, iconClose;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2006);
icon = this.get( ICON );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2007);
nodeLabel = this.get( NODE_LABEL );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2008);
iconExpanded = this.get( ICON_EXPANDED );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2009);
iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2010);
iconClose = this.get( ICON_CLOSE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2011);
iconsContainer = this.get( ICONS_CONTAINER );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2013);
header = this.getStdModNode( WidgetStdMod.HEADER );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2015);
if( !header ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2016);
header = new Node( document.createDocumentFragment() );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2017);
header.appendChild( icon );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2018);
header.appendChild( nodeLabel );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2019);
header.appendChild( iconsContainer );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2020);
iconsContainer.appendChild( iconAlwaysVisible );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2021);
iconsContainer.appendChild( iconExpanded );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2022);
iconsContainer.appendChild( iconClose );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2024);
this.setStdModContent( WidgetStdMod.HEADER, header, WidgetStdMod.REPLACE );
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2026);
if( !header.contains( icon ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2027);
if( header.contains( nodeLabel ) ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2028);
header.insertBefore( icon, nodeLabel );
                } else {
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2030);
header.appendChild( icon );
                }
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2034);
if( !header.contains( nodeLabel ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2035);
header.appendChild( nodeLabel );
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2038);
if( !header.contains( iconsContainer ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2039);
header.appendChild( iconsContainer );
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2042);
if( !iconsContainer.contains( iconAlwaysVisible ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2043);
iconsContainer.appendChild( iconAlwaysVisible );
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2046);
if( !iconsContainer.contains( iconExpanded ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2047);
iconsContainer.appendChild( iconExpanded );
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2050);
if( !iconsContainer.contains( iconClose ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2051);
iconsContainer.appendChild( iconClose );
            }
        }
    },


    /**
     * Handles the change of "labelChanged" property. Updates item's UI with the label provided
     *
     * @method _labelChanged
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _labelChanged: function( params ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_labelChanged", 2064);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2065);
var label;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2067);
if( this.get( RENDERED ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2068);
label = this.get( NODE_LABEL );
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2069);
label.set( INNER_HTML, params.newVal );
        }
    },


    /**
     * Handles the change of "closableChanged" property. Hides or shows close icon
     *
     * @method _closableChanged
     * @protected
     * @param params {EventFacade} The event facade for the attribute change
     */
    _closableChanged: function( params ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_closableChanged", 2081);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2082);
var iconClose;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2084);
if( this.get( RENDERED ) ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2085);
iconClose = this.get( ICON_CLOSE );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2087);
if( params.newVal ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2088);
iconClose.removeClass( C_ICONCLOSE_HIDDEN );
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2090);
iconClose.addClass( C_ICONCLOSE_HIDDEN );
            }
        }
    },


    /**
     * Initializer lifecycle implementation for the AccordionItem class.
     *
     * @method initializer
     * @protected
     * @param  config {Object} Configuration object literal for the AccordionItem
     */
    initializer: function( config ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "initializer", 2103);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2104);
this.after( "labelChange",  Y.bind( this._labelChanged, this ) );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2105);
this.after( "closableChange", Y.bind( this._closableChanged, this ) );
    },


    /**
     * Destructor lifecycle implementation for the AccordionItem class.
     *
     * @method destructor
     * @protected
     */
    destructor : function() {
        // EMPTY
    },


    /**
     * Creates AccordionItem's header.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "renderUI", 2126);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2127);
this._createHeader();
    },

    /**
     * Configures/Sets up listeners to bind Widget State to UI/DOM
     *
     * @method bindUI
     * @protected
     */
    bindUI: function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "bindUI", 2136);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2137);
var contentBox = this.get( "contentBox" );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2139);
contentBox.delegate( "click", Y.bind( this._onLinkClick, this ), HEADER_SELECTOR + ' a' );
    },



    /**
     * Prevent default action on clicking the link in the label
     *
     * @method _onLinkClick
     * @protected
     *
     * @param e {Event} The click event
     */
    _onLinkClick: function( e ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_onLinkClick", 2152);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2153);
e.preventDefault();
    },

   /**
    * Marks the item as always visible by adding class to always visible icon.
    * The icon will be updated only if needed.
    *
    * @method markAsAlwaysVisible
    * @param alwaysVisible {Boolean} If true, the item should be marked as always visible.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsAlwaysVisible: function( alwaysVisible ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "markAsAlwaysVisible", 2164);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2165);
var iconAlwaysVisisble, strings;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2167);
iconAlwaysVisisble = this.get( ICON_ALWAYSVISIBLE );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2168);
strings = this.get( STRINGS );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2170);
if( alwaysVisible ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2171);
if( !iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2172);
iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_OFF, C_ICONALWAYSVISIBLE_ON );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2173);
iconAlwaysVisisble.set( TITLE, strings.title_always_visible_on );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2174);
return true;
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2177);
if( iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2178);
iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_ON, C_ICONALWAYSVISIBLE_OFF );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2179);
iconAlwaysVisisble.set( TITLE, strings.title_always_visible_off );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2180);
return true;
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2184);
return false;
    },


    /**
    * Marks the item as expanded by adding class to expand icon.
    * The icon will be updated only if needed.
    *
    * @method markAsExpanded
    * @param expanded {Boolean} Boolean indicating that item should be marked as expanded.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsExpanded: function( expanded ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "markAsExpanded", 2196);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2197);
var strings, iconExpanded;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2199);
iconExpanded = this.get( ICON_EXPANDED );
        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2200);
strings = this.get( STRINGS );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2202);
if( expanded ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2203);
if( !iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2204);
iconExpanded.replaceClass( C_ICONEXPANDED_OFF, C_ICONEXPANDED_ON );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2205);
iconExpanded.set( TITLE , strings.title_iconexpanded_on );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2206);
return true;
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2209);
if( iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2210);
iconExpanded.replaceClass( C_ICONEXPANDED_ON, C_ICONEXPANDED_OFF );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2211);
iconExpanded.set( TITLE , strings.title_iconexpanded_off );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2212);
return true;
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2216);
return false;
    },


   /**
    * Marks the item as expanding by adding class to expand icon.
    * The method will update icon only if needed.
    *
    * @method markAsExpanding
    * @param expanding {Boolean} Boolean indicating that the item should be marked as expanding.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsExpanding: function( expanding ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "markAsExpanding", 2228);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2229);
var iconExpanded = this.get( ICON_EXPANDED );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2231);
if( expanding ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2232);
if( !iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2233);
iconExpanded.addClass( C_ICONEXPANDED_EXPANDING );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2234);
return true;
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2237);
if( iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2238);
iconExpanded.removeClass( C_ICONEXPANDED_EXPANDING );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2239);
return true;
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2243);
return false;
    },


   /**
    * Marks the item as collapsing by adding class to expand icon.
    * The method will update icon only if needed.
    *
    * @method markAsCollapsing
    * @param collapsing {Boolean} Boolean indicating that the item should be marked as collapsing.
    * @return {Boolean} Return true if the icon has been updated, false if there was no need to update
    */
    markAsCollapsing: function( collapsing ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "markAsCollapsing", 2255);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2256);
var iconExpanded = this.get( ICON_EXPANDED );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2258);
if( collapsing ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2259);
if( !iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2260);
iconExpanded.addClass( C_ICONEXPANDED_COLLAPSING );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2261);
return true;
            }
        } else {
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2264);
if( iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2265);
iconExpanded.removeClass( C_ICONEXPANDED_COLLAPSING );
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2266);
return true;
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2270);
return false;
    },


    /**
     * Forces the item to resize as result of direct content manipulation (via 'innerHTML').
     * This method should be invoked if 'contentHeight' property has been set to 'auto'.
     *
     * @method resize
     */
    resize : function(){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "resize", 2280);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2281);
this.fire( "contentUpdate" );
    },


    /**
     * Parses and returns the value of contentHeight property, if set method "fixed".
     * The value must be in this format: fixed-X, where X is integer
     *
     * @method _extractFixedMethodValue
     * @param value {String} The value to be parsed
     * @return {Number} The parsed value or null
     * @protected
     */
    _extractFixedMethodValue: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_extractFixedMethodValue", 2294);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2295);
var i, length, chr, height = null;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2297);
for( i = 6, length = value.length; i < length; i++ ){ // 6 = "fixed-".length
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2298);
chr = value.charAt(i);
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2299);
chr = parseInt( chr, 10 );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2301);
if( Lang.isNumber( chr ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2302);
height = (height * 10) + chr;
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2304);
break;
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2308);
return height;
    },


    /**
     * Validator applied to the icon attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIcon
     * @param value {MIXED} the value for the icon attribute
     * @return {Boolean}
     * @protected
     */
    _validateIcon: function( value ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_validateIcon", 2320);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2321);
return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the nodeLabel attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateNodeLabel
     * @param value {MIXED} the value for the nodeLabel attribute
     * @return {Boolean}
     * @protected
     */
    _validateNodeLabel: function( value ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_validateNodeLabel", 2333);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2334);
return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconsContainer attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconsContainer
     * @param value {MIXED} the value for the iconsContainer attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconsContainer: function( value ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_validateIconsContainer", 2346);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2347);
return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconExpanded attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconExpanded
     * @param value {MIXED} the value for the iconExpanded attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconExpanded: function( value ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_validateIconExpanded", 2359);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2360);
return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconAlwaysVisible attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconAlwaysVisible
     * @param value {MIXED} the value for the iconAlwaysVisible attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconAlwaysVisible: function( value ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_validateIconAlwaysVisible", 2372);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2373);
return !this.get(RENDERED) || value;
    },


    /**
     * Validator applied to the iconClose attribute. Setting new value is not allowed if Accordion has been rendered.
     *
     * @method _validateIconClose
     * @param value {MIXED} the value for the iconClose attribute
     * @return {Boolean}
     * @protected
     */
    _validateIconClose: function( value ) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_validateIconClose", 2385);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2386);
return !this.get(RENDERED) || value;
    },


    /**
     * Setter applied to the input when updating the icon attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIcon
     * @param value {Node|HTMLElement|String} The icon element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIcon: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setIcon", 2399);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2400);
return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the nodeLabel attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setNodeLabel
     * @param value {Node|HTMLElement|String} The nodeLabel element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setNodeLabel: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setNodeLabel", 2413);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2414);
return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconsContainer attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconsContainer
     * @param value {Node|HTMLElement|String} The iconsContainer element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconsContainer: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setIconsContainer", 2427);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2428);
return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconExpanded attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconExpanded
     * @param value {Node|HTMLElement|String} The iconExpanded element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconExpanded: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setIconExpanded", 2441);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2442);
return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconAlwaysVisible attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconAlwaysVisible
     * @param value {Node|HTMLElement|String} The iconAlwaysVisible element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconAlwaysVisible: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setIconAlwaysVisible", 2455);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2456);
return Y.one( value ) || null;
    },


    /**
     * Setter applied to the input when updating the iconClose attribute.  Input can
     * be a Node, raw HTMLElement, or a selector string to locate it.
     *
     * @method _setIconClose
     * @param value {Node|HTMLElement|String} The iconClose element Node or selector
     * @return {Node} The Node if found, null otherwise.
     * @protected
     */
    _setIconClose: function( value ){
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_setIconClose", 2469);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2470);
return Y.one( value ) || null;
    },


    /**
     * Overwrites Widget's _applyParser method in order to parse yuiConfig attribute before entering in HTML_PARSER attributes
     *
     * @method _applyParser
     * @protected
     * @param config {Object} User configuration object (will be populated with values from Node)
    */
    _applyParser : function(config) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_applyParser", 2481);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2482);
var srcNode;

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2484);
srcNode = this.get( "srcNode" );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2486);
if( srcNode ){
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2487);
this._parsedYUIConfig = srcNode.getAttribute( YUICONFIG );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2489);
if( this._parsedYUIConfig ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2490);
this._parsedYUIConfig = JSON.parse( this._parsedYUIConfig );
            }
        }

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2494);
Y.AccordionItem.superclass._applyParser.apply( this, arguments );

        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2496);
delete this._parsedYUIConfig;
    },


    /**
     * Overwrites Y.WidgetStdMod fuction in order to resolve Widget 3.1 issue:<br>
     * If CONTENT_TEMPLATE is null, in renderUI the result of the following code:
     * <code>this.getStdModNode( Y.WidgetStdMod.HEADER );</code> is null.
     * The same is with <code>this.getStdModNode( Y.WidgetStdMod.BODY );</code>.
     *
     * @method _findStdModSection
     * @protected
     * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
     * @return {Node} The rendered node for the given section, or null if not found.
     */
    _findStdModSection: function(section) {
        _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "_findStdModSection", 2511);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2512);
return this.get("srcNode").one("> ." + Y.WidgetStdMod.SECTION_CLASS_NAMES[section]);
    },

    CONTENT_TEMPLATE : null
}, {
    /**
     *  Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME : AccItemName,

    /**
     * Static property used to define the default attribute
     * configuration for the Accordion.
     *
     * @property Accordion.ATTRS
     * @type Object
     * @static
     */
    ATTRS : {

        /**
         * @description The Node, representing item's icon
         *
         * @attribute icon
         * @default null
         * @type Node
         */
        icon: {
            value: null,
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 2545);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2546);
return this._validateIcon( value );
            },
            setter : function( value ) {
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "setter", 2548);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2549);
return this._setIcon( value );
            }
        },

        /**
         * @description The label of item
         *
         * @attribute label
         * @default "&#160;"
         * @type String
         */
        label: {
            value: "&#160;",
            validator: Lang.isString
        },

        /**
         * @description The node, which contains item's label
         *
         * @attribute nodeLabel
         * @default null
         * @type Node
         */
        nodeLabel: {
            value: null,
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 2574);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2575);
return this._validateNodeLabel( value );
            },
            setter : function( value ) {
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "setter", 2577);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2578);
return this._setNodeLabel( value );
            }
        },


        /**
         * @description The container of iconAlwaysVisible, iconExpanded and iconClose
         *
         * @attribute iconsContainer
         * @default null
         * @type Node
         */
        iconsContainer: {
            value: null,
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 2592);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2593);
return this._validateIconsContainer( value );
            },
            setter : function( value ) {
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "setter", 2595);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2596);
return this._setIconsContainer( value );
            }
        },

        /**
         * @description The Node, representing icon expanded
         *
         * @attribute iconExpanded
         * @default null
         * @type Node
         */
        iconExpanded: {
            value: null,
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 2609);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2610);
return this._validateIconExpanded( value );
            },
            setter : function( value ) {
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "setter", 2612);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2613);
return this._setIconExpanded( value );
            }
        },


        /**
         * @description The Node, representing icon always visible
         *
         * @attribute iconAlwaysVisible
         * @default null
         * @type Node
         */
        iconAlwaysVisible: {
            value: null,
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 2627);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2628);
return this._validateIconAlwaysVisible( value );
            },
            setter : function( value ) {
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "setter", 2630);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2631);
return this._setIconAlwaysVisible( value );
            }
        },


        /**
         * @description The Node, representing icon close, or null if the item is not closable
         *
         * @attribute iconClose
         * @default null
         * @type Node
         */
        iconClose: {
            value: null,
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 2645);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2646);
return this._validateIconClose( value );
            },
            setter : function( value ) {
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "setter", 2648);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2649);
return this._setIconClose( value );
            }
        },

        /**
         * @description Get/Set expanded status of the item
         *
         * @attribute expanded
         * @default false
         * @type Boolean
         */
        expanded: {
            value: false,
            validator: Lang.isBoolean
        },

        /**
         * @description Describe the method, which will be used when expanding/collapsing
         * the item. The value should be an object with at least one property ("method"):
         *  <dl>
         *      <dt>method</dt>
         *          <dd>The method can be one of these: "auto", "fixed" and "stretch"</dd>
         *      <dt>height</dt>
         *          <dd>Must be set only if method's value is "fixed"</dd>
         *  </dl>
         *
         * @attribute contentHeight
         * @default auto
         * @type Object
         */
        contentHeight: {
            value: {
                method: AUTO
            },
            validator: function( value ){
                _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "validator", 2683);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2684);
if( Lang.isObject( value ) ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2685);
if( value.method === AUTO ){
                        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2686);
return true;
                    } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2687);
if( value.method === STRETCH ){
                        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2688);
return true;
                    } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2689);
if( value.method === FIXED && Lang.isNumber( value.height ) &&
                        value.height >= 0 ){
                        _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2691);
return true;
                    }}}
                }

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2695);
return false;
            }
        },

        /**
         * @description Get/Set always visible status of the item
         *
         * @attribute alwaysVisible
         * @default false
         * @type Boolean
         */
        alwaysVisible: {
            value: false,
            validator: Lang.isBoolean
        },


        /**
         * @description Get/Set the animaton specific settings. By default there are no any settings.
         * If set, they will overwrite Accordion's animation settings
         *
         * @attribute animation
         * @default {}
         * @type Object
         */
        animation: {
            value: {},
            validator: Lang.isObject
        },

        /**
         * @description Provides client side string localization support.
         *
         * @attribute strings
         * @default Object English messages
         * @type Object
         */
        strings: {
            value: {
                title_always_visible_off: "Click to set always visible on",
                title_always_visible_on: "Click to set always visible off",
                title_iconexpanded_off: "Click to expand",
                title_iconexpanded_on: "Click to collapse",
                title_iconclose: "Click to close"
            }
        },

        /**
         * @description Boolean indicating that the item can be closed by user.
         * If true, there will be placed close icon, otherwise not
         *
         * @attribute closable
         * @default false
         * @type Boolean
         */
        closable: {
            value: false,
            validator: Lang.isBoolean
        }
    },


    /**
     * Static Object hash used to capture existing markup for progressive
     * enhancement.  Keys correspond to config attribute names and values
     * are selectors used to inspect the srcNode for an existing node
     * structure.
     *
     * @property HTML_PARSER
     * @type Object
     * @protected
     * @static
     */
    HTML_PARSER : {

        icon: HEADER_SELECTOR_SUB + C_ICON,

        label: function( srcNode ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "label", 2772);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2773);
var node, labelSelector, yuiConfig, label;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2775);
yuiConfig = this._parsedYUIConfig;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2777);
if( yuiConfig && Lang.isValue( yuiConfig.label ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2778);
return yuiConfig.label;
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2781);
label = srcNode.getAttribute( "data-label" );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2783);
if( label ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2784);
return label;
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2787);
labelSelector = HEADER_SELECTOR_SUB + C_LABEL;
            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2788);
node = srcNode.one( labelSelector );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2790);
return (node) ? node.get( INNER_HTML ) : null;
        },

        nodeLabel: HEADER_SELECTOR_SUB + C_LABEL,

        iconsContainer: HEADER_SELECTOR_SUB + C_ICONSCONTAINER,

        iconAlwaysVisible: HEADER_SELECTOR_SUB + C_ICONALWAYSVISIBLE,

        iconExpanded: HEADER_SELECTOR_SUB + C_ICONEXPANDED,

        iconClose: HEADER_SELECTOR_SUB + C_ICONCLOSE,

        expanded: function( srcNode ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "expanded", 2803);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2804);
var yuiConfig, expanded;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2806);
yuiConfig = this._parsedYUIConfig;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2808);
if( yuiConfig && Lang.isBoolean( yuiConfig.expanded ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2809);
return yuiConfig.expanded;
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2812);
expanded = srcNode.getAttribute( "data-expanded" );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2814);
if( expanded ) {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2815);
return REGEX_TRUE.test( expanded );
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2818);
return srcNode.hasClass( C_EXPANDED );
        },

        alwaysVisible: function( srcNode ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "alwaysVisible", 2821);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2822);
var yuiConfig, alwaysVisible;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2824);
yuiConfig = this._parsedYUIConfig;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2826);
if( yuiConfig && Lang.isBoolean( yuiConfig.alwaysVisible ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2827);
alwaysVisible = yuiConfig.alwaysVisible;
            } else {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2829);
alwaysVisible = srcNode.getAttribute( "data-alwaysvisible" );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2831);
if( alwaysVisible ) {
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2832);
alwaysVisible = REGEX_TRUE.test( alwaysVisible );
                } else {
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2834);
alwaysVisible = srcNode.hasClass( C_ALWAYSVISIBLE );
                }
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2838);
if( alwaysVisible ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2839);
this.set( "expanded", true, {
                    internalCall: true
                } );
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2844);
return alwaysVisible;
        },

        closable: function( srcNode ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "closable", 2847);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2848);
var yuiConfig, closable;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2850);
yuiConfig = this._parsedYUIConfig;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2852);
if( yuiConfig && Lang.isBoolean( yuiConfig.closable ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2853);
return yuiConfig.closable;
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2856);
closable = srcNode.getAttribute( "data-closable" );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2858);
if( closable ) {
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2859);
return REGEX_TRUE.test( closable );
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2862);
return srcNode.hasClass( C_CLOSABLE );
        },

        contentHeight: function( srcNode ){
            _yuitest_coverfunc("/build/gallery-accordion/gallery-accordion.js", "contentHeight", 2865);
_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2866);
var contentHeightClass, classValue, height = 0, index, yuiConfig,
                contentHeight;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2869);
yuiConfig = this._parsedYUIConfig;

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2871);
if( yuiConfig && yuiConfig.contentHeight ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2872);
return yuiConfig.contentHeight;
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2875);
contentHeight = srcNode.getAttribute( "data-contentheight" );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2877);
if( REGEX_AUTO.test( contentHeight ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2878);
return {
                    method: AUTO
                };
            } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2881);
if( REGEX_STRETCH.test( contentHeight ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2882);
return {
                    method: STRETCH
                };
            } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2885);
if( REGEX_FIXED.test( contentHeight ) ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2886);
height = this._extractFixedMethodValue( contentHeight );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2888);
return {
                    method: FIXED,
                    height: height
                };
            }}}


            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2895);
classValue = srcNode.get( CLASS_NAME );

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2897);
contentHeightClass = C_CONTENTHEIGHT + '-';

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2899);
index = classValue.indexOf( contentHeightClass, 0);

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2901);
if( index >= 0 ){
                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2902);
index += contentHeightClass.length;

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2904);
classValue = classValue.substring( index );

                _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2906);
if( REGEX_AUTO.test( classValue ) ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2907);
return {
                        method: AUTO
                    };
                } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2910);
if( REGEX_STRETCH.test( classValue ) ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2911);
return {
                        method: STRETCH
                    };
                } else {_yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2914);
if( REGEX_FIXED.test( classValue )  ){
                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2915);
height = this._extractFixedMethodValue( classValue );

                    _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2917);
return {
                        method: FIXED,
                        height: height
                    };
                }}}
            }

            _yuitest_coverline("/build/gallery-accordion/gallery-accordion.js", 2924);
return null;
        }
    },


     /**
      * The template HTML strings for each of header components.
      * e.g.
      * <pre>
      *    {
      *       icon : '&lt;a class="yui3-accordion-item-icon"&gt;&lt;/a&gt;',
      *       label: '&lt;a href="#" class="yui3-accordion-item-label"&gt;&lt;/a&gt;',
      *       iconsContainer: '&lt;div class="yui3-accordion-item-icons"&gt;&lt;/div&gt;',
      *       iconAlwaysVisible: '&lt;a href="#" class="yui3-accordion-item-iconalwaysvisible"&gt;&lt;/a&gt;',
      *       iconExpanded: '&lt;a href="#" class="yui3-accordion-item-iconexpanded"&gt;&lt;/a&gt;',
      *       iconClose: '&lt;a href="#" class="yui3-accordion-item-iconclose yui3-accordion-item-iconclose-hidden"&gt;&lt;/a&gt;'
      *    }
      * </pre>
      * @property WidgetStdMod.TEMPLATES
      * @type Object
      */
    TEMPLATES : {
         icon : '<a class="' + C_ICON + '"></a>',
         label: '<a href="#" class="' + C_LABEL + '"></a>',
         iconsContainer: '<div class="' + C_ICONSCONTAINER + '"></div>',
         iconExpanded: ['<a href="#" class="', C_ICONEXPANDED, ' ', C_ICONEXPANDED_OFF, '"></a>'].join(''),
         iconAlwaysVisible: ['<a href="#" class="', C_ICONALWAYSVISIBLE, ' ',  C_ICONALWAYSVISIBLE_OFF, '"></a>'].join(''),
         iconClose: ['<a href="#" class="', C_ICONCLOSE, ' ', C_ICONCLOSE_HIDDEN, '"></a>'].join('')
    }

});

}());



}, 'gallery-2012.08.15-20-00' ,{requires:['event', 'anim-easing', 'widget', 'widget-stdmod', 'json-parse'], skinnable:true, optional:['dd-constrain', 'dd-proxy', 'dd-drop']});
