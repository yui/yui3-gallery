YUI.add('gallery-itsaselectlist', function(Y) {

'use strict';

/**
 * The Itsa Selectlist module.
 *
 * @module itsa-selectlist
 */


/**
 *
 * @class ITSASelectlist
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// Local constants
var Lang = Y.Lang,
    Node = Y.Node,
    IE = Y.UA.ie,
    ITSA_CLASSHIDDEN = 'itsa-hidden',
    ITSA_SHIM_TEMPLATE_TITLE = "Selectlist Shim",
    ITSA_SHIM_TEMPLATE = '<iframe frameborder="0" tabindex="-1" class="itsa-shim" title="' + ITSA_SHIM_TEMPLATE_TITLE + '" src="javascript:false;"></iframe>',
    ITSA_SELECTEDMAIN_TEMPLATE = "<span class='itsa-selectlist-selectedmain' unselectable='on'></span>",
    ITSA_BUTTON_TEMPLATE = "<button class='yui3-button'></button>",
    ITSA_DOWNBUTTON_TEMPLATE = "<span class='itsa-button-icon itsa-icon-selectdown'></span>",
    ITSA_SELECTBOX_TEMPLATE = "<div class='itsa-selectlist-basediv " + ITSA_CLASSHIDDEN + "'><div class='itsa-selectlist-scrolldiv'><ul class='itsa-selectlist-ullist'></ul></div></div>";

Y.ITSASelectList = Y.Base.create('itsaselectlist', Y.Widget, [], {


// -- Public Static Properties -------------------------------------------------

/**
 * Reference to the editor's instance
 * @property buttonNode
 * @type Y.EditorBase instance
 */

/**
 * Reference to the Y-instance of the host-editor
 * @private
 * @property _selectedMainItemNode
 * @type YUI-instance
 */

/**
 * Reference to the editor's iframe-node
 * @private
 * @property _selectedItemClass
 * @type Y.Node
 */

/**
 * Reference to the editor's container-node, in which the host-editor is rendered.<br>
 * This is in fact editorNode.get('parentNode')
 * @private
 * @property _itemsContainerNode
 * @type Y.Node
 */

/**
 * Reference to the toolbar-node
 * @private
 * @property _itemValues
 * @type Y.Node
 */

/**
 * Reference to the toolbar-node
 * @private
 * @property _syncWithinSetterItems
 * @type Y.Node
 */

        buttonNode : null,
        _selectedMainItemNode : null,
        _selectedItemClass : null,
        _itemsContainerNode : null,
        _itemValues : null, // for internal use: listitems, transformed to String, so we can use selectItemByValue
        _syncWithinSetterItems : false, // no items.setter.syncUI during initializing


        /**
         * Sets up the selectlist during initialisation.
         *
         * @method initializer
         * @param {Object} config The config-object.
         * @protected
        */
        initializer : function(config) {
            Y.log('initializer ', 'cmas', 'ITSASelectList');
            var instance = this;
            instance._selectedItemClass = instance.get('hideSelected') ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';
        },

        /**
         * Widget's renderUI-method. Creates the Selectlist in the DOM.
         *
         * @method renderUI 
        */
        renderUI : function() {
            Y.log('renderUI ', 'cmas', 'ITSASelectList');
            var instance = this,
                contentBox = instance.get('contentBox'), 
                boundingBox = instance.get('boundingBox'),
                className = instance.get('className'),
                iconClassName = instance.get('iconClassName'),
                buttonWidth = instance.get('buttonWidth'),
                listWidth = instance.get('listWidth'),
                btnSize = instance.get('btnSize'),
                items;
            if ((IE>0) && (IE<7)) {boundingBox.append(instance.SHIM_TEMPLATE);}
            instance.buttonNode = Y.Node.create(ITSA_BUTTON_TEMPLATE);
            contentBox.append(instance.buttonNode);
            instance.buttonNode.setHTML(ITSA_DOWNBUTTON_TEMPLATE);
            instance._selectedMainItemNode = Y.Node.create(ITSA_SELECTEDMAIN_TEMPLATE);
            instance.buttonNode.append(instance._selectedMainItemNode);
            instance._itemsContainerNode = Y.Node.create(ITSA_SELECTBOX_TEMPLATE);
            instance.get('listAlignLeft') ? boundingBox.addClass('itsa-leftalign') : boundingBox.addClass('itsa-rightalign');
            if (className) {boundingBox.addClass(className);}
            if (iconClassName) {
                instance._selectedMainItemNode.addClass('itsa-button-icon');
                instance._selectedMainItemNode.addClass(iconClassName);
            }
            // must set minWidth instead of width in case of button: otherwise the 2 spans might be positioned underneath each other
            if (buttonWidth) {instance.buttonNode.setStyle('minWidth', buttonWidth+'px');}
            if (listWidth) {instance._itemsContainerNode.setStyle('width', listWidth+'px');}
            if (btnSize===1) {boundingBox.addClass('itsa-buttonsize-small');}
            else {if (btnSize===2) {boundingBox.addClass('itsa-buttonsize-medium');}}
            contentBox.append(instance._itemsContainerNode);
        },

        /**
         * Widget's bindUI-method. Binds onclick and clickoutside-events
         *
         * @method bindUI 
        */
        bindUI : function() {
            Y.log('bindUI ', 'cmas', 'ITSASelectList');
            var instance = this,
                boundingBox = instance.get('boundingBox');
            boundingBox.on('click', instance._toggleListbox, instance);
            boundingBox.on('clickoutside', instance.hideListbox, instance);
            instance._itemsContainerNode.delegate('click', instance._itemClick, 'li', instance);
            instance.on('disabledChange', instance._disabledChange, instance);
        },

        /**
         *  Widget's syncUI-method. Renders the selectlist items
         *
         * @method syncUI
        */
        syncUI : function() {
            Y.log('syncUI ', 'cmas', 'ITSASelectList');
            var instance = this,
                contentBox = instance.get('contentBox'),
                items = instance.get('items'),
                defaultItem = instance.get('defaultItem'),
                ullist = instance._itemsContainerNode.one('.itsa-selectlist-ullist'),
                i, 
                item,
                itemText,
                isDefaultItem,
                defaultItemFound,
                newNode;
            ullist.setHTML(''); // clear content
            if (items.length>0) {
                for (i=0; i<items.length; i++) {
                    item = items[i];
                    itemText = Lang.isString(item) ? itemText = item : itemText = item.text;
                    isDefaultItem = (itemText===defaultItem);
                    if (isDefaultItem) {defaultItemFound = true;}
                    newNode = Y.Node.create('<li' + ((isDefaultItem) ? ' class="' + instance._selectedItemClass + '"' : '') + '>' + itemText +'</li>');
                    if (item.returnValue) {newNode.setData('returnValue', item.returnValue);}
                    ullist.append(newNode);
                }
                instance._selectedMainItemNode.setHTML((instance.get('selectionOnButton') && defaultItemFound) ? defaultItem : instance.get('defaultButtonText'));
            }
            instance._syncWithinSetterItems = true;
        },

        /**
         * Internal function that will be called when a user changes the selected item
         *
         * @method _itemClick
         * @private
         * @param {EventFacade} e with e.currentTarget as the selected li-Node
         * @return {eventFacade} Fires a valueChange, or selectChange event.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         * 
        */
        _itemClick : function(e) {
            Y.log('_itemClick ', 'cmas', 'ITSASelectList');
            this._selectItem(e.currentTarget, true);
        },

        /**
         * Selects the items at a specified index.<br>
         * When softMatch is set to true, the selected value will return to the default, even when there is no match.<br>
         * When softMatch is false, or not specified, there has to be a match in order to change.
         *
         * @method selectItem
         * @param {Int} index index to be selected
         * @param {Boolean} [softMatch] Optional. When set to true will always make a selectchange, even when the index is out of bound
         * @param {String} [softButtonText] Optional. Text to be appeared on the button in case softMatch is true and there is no match. When not specified, the attribute <i>defaultButtonText</i> will be used
         * @return {eventFacade} Fires a valueChange, NO selectChange event, because there is no userinteraction.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         * 
        */
        selectItem : function(index, softMatch, softButtonText) {
            Y.log('selectItem ', 'cmas', 'ITSASelectList');
            var instance = this,
                nodelist = instance._itemsContainerNode.all('li');
            if (!instance.get('disabled')) {
                if ((index>=0) && (index<nodelist.size())) {instance._selectItem(nodelist.item(index));}
                else {
                    // no hit: return to default without selection in case of softMatch
                    if (softMatch) {
                        nodelist.removeClass(instance._selectedItemClass);
                        if (instance.get('selectionOnButton')) {instance._selectedMainItemNode.setHTML(softButtonText ? softButtonText : instance.get('defaultButtonText'));}
                    }
                }
            }
        },

        /**
         * Selects the items based on the listvalue.<br>
         * When softMatch is set to true, the selected value will return to the default, even when there is no match.<br>
         * When softMatch is false, or not specified, there has to be a match in order to change.
         *
         * @method selectItemByValue
         * @param {String} itemText listitem to be selected
         * @param {Boolean} [softMatch] Optional. When set to true will always make a selectchange, even when the listitem is not available
         * @param {Boolean} [defaultButtonText] Optional. Whether to use the attribute <i>defaultButtonText</i> in case softMatch is true and there is no match. When set to false, <i>itemText</i> will be used when there is no match.
         * @return {eventFacade} Fires a valueChange, NO selectChange event, because there is no userinteraction.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         *
        */
        selectItemByValue : function(itemText, softMatch, defaultButtonText) {
            // by returnvalue 
            Y.log('selectItemByValue', 'cmas', 'ITSASelectList');
            var instance = this,
                index = Y.Array.indexOf(instance._itemValues, itemText.toString().toLowerCase());
            instance.selectItem(index, softMatch, defaultButtonText ? instance.get('defaultButtonText') : itemText);
        },

        /**
         * Does the final itemselection based on the listnode.<br>
         * Will always fire a <b>valueChange event</b>.<br>
         * Will fire a <b>selectChange event</b> only when <i>userInteraction</i> is set to true. 
         *
         * @method _selectItem
         * @private
         * @param {Y.Node} node listitem to be selected
         * @param {Boolean} userInteraction Specifies whether the selection is made by userinteraction, or by functioncall.<br>
         * In case of userinteraction,  selectChange will also be fired.
         * @return {eventFacade} Not returnvalue, but event, fired by valueChange, or selectChange.<br>
         * <i>- e.currentTarget: the selected li-Node<br>
         * <i>- e.value: returnvalue of the selected item<br>
         * <i>- e.index: index of the selected item</i>
         *
        */
        _selectItem : function(node, userInteraction) {
            Y.log('_selectItem ', 'cmas', 'ITSASelectList');
            var instance = this,
                previousNode = instance._itemsContainerNode.one('li.'+instance._selectedItemClass),
                nodeHTML;
            if (!instance.get('disabled') && node && (node !== previousNode)) {
                if (previousNode) {previousNode.removeClass(instance._selectedItemClass);}
                node.addClass(instance._selectedItemClass);
                nodeHTML = node.getHTML();
                if (instance.get('selectionOnButton')) {instance._selectedMainItemNode.setHTML(nodeHTML);}
                /**
                 * In case of a valuechange, valueChange will be fired. 
                 * No matter whether the change is done by userinteraction, or by a functioncall like selectItem()
                 * @event valueChange
                 * @param {EventFacade} e Event object<br>
                 * <i>- e.currentTarget: the selected li-Node<br>
                 * <i>- e.value: returnvalue of the selected item<br>
                 * <i>- e.index: index of the selected item</i>
                */                
                instance.fire('valueChange', {currentTarget: node, value: node.getData('returnValue') || nodeHTML, index: instance._indexOf(node)});
                /**
                 * In case of a valuechange <u>triggered by userinteraction</u>, selectChange will be fired. 
                 * This way you can use functioncalls like selectItem() and prevent double programmaction (which might occur when you listen to the valueChange event)
                 * @event selectChange
                 * @param {EventFacade} e Event object<br>
                 * <i>- e.currentTarget: the selected li-Node<br>
                 * <i>- e.value: returnvalue of the selected item<br>
                 * <i>- e.index: index of the selected item</i>
                */                
                if (userInteraction) {instance.fire('selectChange', {currentTarget: node, value: node.getData('returnValue') || nodeHTML, index: instance._indexOf(node)});}
            }
        },

        /**
         * Will hide the listitems.
         * Will also fire a <b>hide event</b>.<br>
         * @method hideListbox
         *
        */
        hideListbox : function() {
            Y.log('hideListbox ', 'cmas', 'ITSASelectList');
            var instance = this;
            if (!instance.get('disabled')) {
                /**
                 * In case the listbox is opened, hide-event will be fired. 
                 * @event shide
                 * @param {EventFacade} e Event object<br>
                */                
                instance.fire('hide');
                instance._itemsContainerNode.toggleClass(ITSA_CLASSHIDDEN, true);
            }
        },

        /**
         * Will show the listitems.
         * Will also fire a <b>show event</b>.<br>
         * @method showListbox
         *
        */
        showListbox : function() {
            Y.log('showListbox ', 'cmas', 'ITSASelectList');
            var instance = this;
            if (!instance.get('disabled')) {
                /**
                 * In case the listbox is opened, show-event will be fired. 
                 * @event show
                 * @param {EventFacade} e Event object<br>
                */                
                instance.fire('show');
                instance._itemsContainerNode.toggleClass(ITSA_CLASSHIDDEN, false);
            }
        },

        /**
         * Toggles between shown/hidden listitems.
         *
         * @method _toggleListbox
         * @private
         *
        */
        _toggleListbox : function() {
            Y.log('_toggleListbox ', 'cmas', 'ITSASelectList');
            var instance = this;
            if (instance._itemsContainerNode.hasClass(ITSA_CLASSHIDDEN)) {instance.showListbox();}
            else {instance.hideListbox();}
        },

        /**
         * Returns the actual selected listitemnode.<br>
         *
         * @method currentSelected
         * @return {Y.Node} the current selected listitemnode, or null if none is selected.
        */
        currentSelected : function() {
            Y.log('currentSelected', 'cmas', 'ITSASelectList');
            return this._itemsContainerNode.one('li.'+this._selectedItemClass);
        },

        /**
         * Returns the index of the actual selected listitemnode.<br>
         *
         * @method currentIndex
         * @return {Int} index of the current selected listitem, or -1 if none is selected.
         *
        */
        currentIndex : function() {
            Y.log('currentIndex', 'cmas', 'ITSASelectList');
            return this._indexOf(this.currentSelected());
        },

        /**
         * Returns the index of a listitemnode.<br>
         *
         * @method _indexOf
         * @private
         * @param {Y.Node} node the node to search for.
         * @return {Int} index of a listitem, or -1 if not present.
         *
        */
        _indexOf : function(node) {
            Y.log('_searchIndex ', 'cmas', 'ITSASelectList');
            var nodelist = this._itemsContainerNode.one('.itsa-selectlist-ullist').all('li');
            return nodelist.indexOf(node);
        },
        
        /**
         * Is called after a disabledchange. Does dis/enable the inner-button element<br>
         *
         * @method _disabledChange
         * @private
         * @param {eventFacade} e passed through by widget.disabledChange event
         *
        */
        _disabledChange : function(e) {
            var instance = this;
            instance.buttonNode.toggleClass('yui3-button-disabled', e.newVal);
            instance.hideListbox();
        },

        /**
         * Cleaning up.
         *
         * @protected
         * @method destructor
         *
        */
        destructor : function() {
            Y.log('destructor ', 'cmas', 'ITSASelectList');
            this.get('contentBox').empty();
        }

    }, {
        ATTRS : {

            /**
             * @description The size of the buttons<br>
             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>
             * Default = 2
             * @attribute btnSize
             * @type int
            */
            btnSize : {
                value: 3,
                validator: function(val) {
                    return (Lang.isNumber(val) && (val>0) && (val<4));
                }
            },

            /**
             * @description Defines the defaultbuttontext when a softMatch with no hit has taken place.<br>
             * See <i>selectItem()</i> how to use a softMatch.<br>
             * Default = 'choose...'
             * @attribute defaultButtonText
             * @type String Default='choose...'
            */
            defaultButtonText : {
                value: 'choose...',
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description Defines the buttonWidth<br>
             * Default = null, which means automaticly sizeing.
             * @attribute buttonWidth
             * @type Int
            */
            buttonWidth: {
                value: null,
                validator: function(val) {
                    return (Y.Lang.isNumber(val) && (val>=0));
                }
            },

            /**
             * @description Defines the width of the listbox.<br>
             * Default = null, which means automaticly sizeing.
             * @attribute listWidth
             * @type Int
            */
            listWidth: {
                value: null,
                validator: function(val) {
                    return (Y.Lang.isNumber(val) && (val>=0));
                }
            },

            /**
             * @description Whether the listitems should be aligned left or right.
             * Default = true.
             * @attribute listAlignLeft
             * @type Boolean
            */
            listAlignLeft : {
                value: true,
                validator: function(val) {
                    return Y.Lang.isBoolean(val);
                }
            },

            /**
             * @description Additional className that can be added to the boundingBox
             * @attribute className
             * @type String
            */
            className : {
                value: null,
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description Additional className that can be added to the selected text on the Button
             * @attribute iconClassName
             * @type String
            */
            iconClassName : {
                value: null,
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description Listitems in the selectbox
             * @attribute items
             * @type Array of (String or Int)
            */
            items : {
                value: [],
                validator: function(val) {
                    return Y.Lang.isArray(val);
                },
                setter: function(val) {
                    var instance = this,
                        item,
                        i;
                    instance._itemValues = [];
                    for (i=0; i<val.length; i++) {
                        item = val[i];
                        // Make sure to fill the array with Strings. User might supply other types like numbers: you don't want to miss the hit when you search the array by value.
                        instance._itemValues.push(item.returnValue ? item.returnValue.toString().toLowerCase() : item.toString().toLowerCase());
                    }
                    // only call syncUI when items are change after rendering
                    if (this._syncWithinSetterItems) {this.syncUI();}
                    return val;
                }
            },

            /**
             * @description The default listitem to be selected during rendering.<br>
             * Default = null
             * @attribute defaultItem
             * @type String
            */
            defaultItem : {
                value: null,
                validator: function(val) {
                    return Y.Lang.isString(val);
                }
            },

            /**
             * @description Whether the selection should be displayed on the button.<br>
             * This is normal behaviour. Although in some cases you might not want this. For example when simulating a menubutton with static text and a dropdown with subbuttons<br>
             * Default = true<br>
             * When set to false, the buttontext will always remains the Attribute: <b>defaultButtonText</b>
             * @attribute selectionOnButton
             * @type Boolean
            */
            selectionOnButton : {
                value: true,
                validator: function(val) {
                    return Y.Lang.isBoolean(val);
                }
            },

            /**
             * @description Determines whether to show the selected item in the selectlist, or if it should disappear from the selectlist when selected.<br>
             * Default = false.
             * @attribute hideSelected
             * @type Boolean
            */
            hideSelected : {
                value: false,
                validator: function(val) {
                    return Y.Lang.isBoolean(val);
                },
                setter: function(val) {
                    var instance = this;
                    instance._selectedItemClass = val ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';
                    return val;
                }
            }
        }
    }
);


}, 'gallery-2012.09.26-20-36' ,{requires:['base-build', 'widget-base', 'node-base', 'cssbutton', 'event-base', 'node-event-delegate', 'event-outside'], skinnable:true});
