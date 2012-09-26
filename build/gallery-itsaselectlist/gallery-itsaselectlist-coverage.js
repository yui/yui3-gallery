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
_yuitest_coverage["/build/gallery-itsaselectlist/gallery-itsaselectlist.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-itsaselectlist/gallery-itsaselectlist.js",
    code: []
};
_yuitest_coverage["/build/gallery-itsaselectlist/gallery-itsaselectlist.js"].code=["YUI.add('gallery-itsaselectlist', function(Y) {","","'use strict';","","/**"," * The Itsa Selectlist module."," *"," * @module itsa-selectlist"," */","","","/**"," *"," * @class ITSASelectlist"," * @constructor"," *"," * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>"," * YUI BSD License - http://developer.yahoo.com/yui/license.html"," *","*/","","// Local constants","var Lang = Y.Lang,","    Node = Y.Node,","    IE = Y.UA.ie,","    ITSA_CLASSHIDDEN = 'itsa-hidden',","    ITSA_SHIM_TEMPLATE_TITLE = \"Selectlist Shim\",","    ITSA_SHIM_TEMPLATE = '<iframe frameborder=\"0\" tabindex=\"-1\" class=\"itsa-shim\" title=\"' + ITSA_SHIM_TEMPLATE_TITLE + '\" src=\"javascript:false;\"></iframe>',","    ITSA_SELECTEDMAIN_TEMPLATE = \"<span class='itsa-selectlist-selectedmain' unselectable='on'></span>\",","    ITSA_BUTTON_TEMPLATE = \"<button class='yui3-button'></button>\",","    ITSA_DOWNBUTTON_TEMPLATE = \"<span class='itsa-button-icon itsa-icon-selectdown'></span>\",","    ITSA_SELECTBOX_TEMPLATE = \"<div class='itsa-selectlist-basediv \" + ITSA_CLASSHIDDEN + \"'><div class='itsa-selectlist-scrolldiv'><ul class='itsa-selectlist-ullist'></ul></div></div>\";","","Y.ITSASelectList = Y.Base.create('itsaselectlist', Y.Widget, [], {","","","// -- Public Static Properties -------------------------------------------------","","/**"," * Reference to the editor's instance"," * @property buttonNode"," * @type Y.EditorBase instance"," */","","/**"," * Reference to the Y-instance of the host-editor"," * @private"," * @property _selectedMainItemNode"," * @type YUI-instance"," */","","/**"," * Reference to the editor's iframe-node"," * @private"," * @property _selectedItemClass"," * @type Y.Node"," */","","/**"," * Reference to the editor's container-node, in which the host-editor is rendered.<br>"," * This is in fact editorNode.get('parentNode')"," * @private"," * @property _itemsContainerNode"," * @type Y.Node"," */","","/**"," * Reference to the toolbar-node"," * @private"," * @property _itemValues"," * @type Y.Node"," */","","/**"," * Reference to the toolbar-node"," * @private"," * @property _syncWithinSetterItems"," * @type Y.Node"," */","","        buttonNode : null,","        _selectedMainItemNode : null,","        _selectedItemClass : null,","        _itemsContainerNode : null,","        _itemValues : null, // for internal use: listitems, transformed to String, so we can use selectItemByValue","        _syncWithinSetterItems : false, // no items.setter.syncUI during initializing","","","        /**","         * Sets up the selectlist during initialisation.","         *","         * @method initializer","         * @param {Object} config The config-object.","         * @protected","        */","        initializer : function(config) {","            var instance = this;","            instance._selectedItemClass = instance.get('hideSelected') ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';","        },","","        /**","         * Widget's renderUI-method. Creates the Selectlist in the DOM.","         *","         * @method renderUI ","        */","        renderUI : function() {","            var instance = this,","                contentBox = instance.get('contentBox'), ","                boundingBox = instance.get('boundingBox'),","                className = instance.get('className'),","                iconClassName = instance.get('iconClassName'),","                buttonWidth = instance.get('buttonWidth'),","                listWidth = instance.get('listWidth'),","                btnSize = instance.get('btnSize'),","                items;","            if ((IE>0) && (IE<7)) {boundingBox.append(instance.SHIM_TEMPLATE);}","            instance.buttonNode = Y.Node.create(ITSA_BUTTON_TEMPLATE);","            contentBox.append(instance.buttonNode);","            instance.buttonNode.setHTML(ITSA_DOWNBUTTON_TEMPLATE);","            instance._selectedMainItemNode = Y.Node.create(ITSA_SELECTEDMAIN_TEMPLATE);","            instance.buttonNode.append(instance._selectedMainItemNode);","            instance._itemsContainerNode = Y.Node.create(ITSA_SELECTBOX_TEMPLATE);","            instance.get('listAlignLeft') ? boundingBox.addClass('itsa-leftalign') : boundingBox.addClass('itsa-rightalign');","            if (className) {boundingBox.addClass(className);}","            if (iconClassName) {","                instance._selectedMainItemNode.addClass('itsa-button-icon');","                instance._selectedMainItemNode.addClass(iconClassName);","            }","            // must set minWidth instead of width in case of button: otherwise the 2 spans might be positioned underneath each other","            if (buttonWidth) {instance.buttonNode.setStyle('minWidth', buttonWidth+'px');}","            if (listWidth) {instance._itemsContainerNode.setStyle('width', listWidth+'px');}","            if (btnSize===1) {boundingBox.addClass('itsa-buttonsize-small');}","            else {if (btnSize===2) {boundingBox.addClass('itsa-buttonsize-medium');}}","            contentBox.append(instance._itemsContainerNode);","        },","","        /**","         * Widget's bindUI-method. Binds onclick and clickoutside-events","         *","         * @method bindUI ","        */","        bindUI : function() {","            var instance = this,","                boundingBox = instance.get('boundingBox');","            boundingBox.on('click', instance._toggleListbox, instance);","            boundingBox.on('clickoutside', instance.hideListbox, instance);","            instance._itemsContainerNode.delegate('click', instance._itemClick, 'li', instance);","            instance.on('disabledChange', instance._disabledChange, instance);","        },","","        /**","         *  Widget's syncUI-method. Renders the selectlist items","         *","         * @method syncUI","        */","        syncUI : function() {","            var instance = this,","                contentBox = instance.get('contentBox'),","                items = instance.get('items'),","                defaultItem = instance.get('defaultItem'),","                ullist = instance._itemsContainerNode.one('.itsa-selectlist-ullist'),","                i, ","                item,","                itemText,","                isDefaultItem,","                defaultItemFound,","                newNode;","            ullist.setHTML(''); // clear content","            if (items.length>0) {","                for (i=0; i<items.length; i++) {","                    item = items[i];","                    itemText = Lang.isString(item) ? itemText = item : itemText = item.text;","                    isDefaultItem = (itemText===defaultItem);","                    if (isDefaultItem) {defaultItemFound = true;}","                    newNode = Y.Node.create('<li' + ((isDefaultItem) ? ' class=\"' + instance._selectedItemClass + '\"' : '') + '>' + itemText +'</li>');","                    if (item.returnValue) {newNode.setData('returnValue', item.returnValue);}","                    ullist.append(newNode);","                }","                instance._selectedMainItemNode.setHTML((instance.get('selectionOnButton') && defaultItemFound) ? defaultItem : instance.get('defaultButtonText'));","            }","            instance._syncWithinSetterItems = true;","        },","","        /**","         * Internal function that will be called when a user changes the selected item","         *","         * @method _itemClick","         * @private","         * @param {EventFacade} e with e.currentTarget as the selected li-Node","         * @return {eventFacade} Fires a valueChange, or selectChange event.<br>","         * <i>- e.currentTarget: the selected li-Node<br>","         * <i>- e.value: returnvalue of the selected item<br>","         * <i>- e.index: index of the selected item</i>","         * ","        */","        _itemClick : function(e) {","            this._selectItem(e.currentTarget, true);","        },","","        /**","         * Selects the items at a specified index.<br>","         * When softMatch is set to true, the selected value will return to the default, even when there is no match.<br>","         * When softMatch is false, or not specified, there has to be a match in order to change.","         *","         * @method selectItem","         * @param {Int} index index to be selected","         * @param {Boolean} [softMatch] Optional. When set to true will always make a selectchange, even when the index is out of bound","         * @param {String} [softButtonText] Optional. Text to be appeared on the button in case softMatch is true and there is no match. When not specified, the attribute <i>defaultButtonText</i> will be used","         * @return {eventFacade} Fires a valueChange, NO selectChange event, because there is no userinteraction.<br>","         * <i>- e.currentTarget: the selected li-Node<br>","         * <i>- e.value: returnvalue of the selected item<br>","         * <i>- e.index: index of the selected item</i>","         * ","        */","        selectItem : function(index, softMatch, softButtonText) {","            var instance = this,","                nodelist = instance._itemsContainerNode.all('li');","            if (!instance.get('disabled')) {","                if ((index>=0) && (index<nodelist.size())) {instance._selectItem(nodelist.item(index));}","                else {","                    // no hit: return to default without selection in case of softMatch","                    if (softMatch) {","                        nodelist.removeClass(instance._selectedItemClass);","                        if (instance.get('selectionOnButton')) {instance._selectedMainItemNode.setHTML(softButtonText ? softButtonText : instance.get('defaultButtonText'));}","                    }","                }","            }","        },","","        /**","         * Selects the items based on the listvalue.<br>","         * When softMatch is set to true, the selected value will return to the default, even when there is no match.<br>","         * When softMatch is false, or not specified, there has to be a match in order to change.","         *","         * @method selectItemByValue","         * @param {String} itemText listitem to be selected","         * @param {Boolean} [softMatch] Optional. When set to true will always make a selectchange, even when the listitem is not available","         * @param {Boolean} [defaultButtonText] Optional. Whether to use the attribute <i>defaultButtonText</i> in case softMatch is true and there is no match. When set to false, <i>itemText</i> will be used when there is no match.","         * @return {eventFacade} Fires a valueChange, NO selectChange event, because there is no userinteraction.<br>","         * <i>- e.currentTarget: the selected li-Node<br>","         * <i>- e.value: returnvalue of the selected item<br>","         * <i>- e.index: index of the selected item</i>","         *","        */","        selectItemByValue : function(itemText, softMatch, defaultButtonText) {","            // by returnvalue ","            var instance = this,","                index = Y.Array.indexOf(instance._itemValues, itemText.toString().toLowerCase());","            instance.selectItem(index, softMatch, defaultButtonText ? instance.get('defaultButtonText') : itemText);","        },","","        /**","         * Does the final itemselection based on the listnode.<br>","         * Will always fire a <b>valueChange event</b>.<br>","         * Will fire a <b>selectChange event</b> only when <i>userInteraction</i> is set to true. ","         *","         * @method _selectItem","         * @private","         * @param {Y.Node} node listitem to be selected","         * @param {Boolean} userInteraction Specifies whether the selection is made by userinteraction, or by functioncall.<br>","         * In case of userinteraction,  selectChange will also be fired.","         * @return {eventFacade} Not returnvalue, but event, fired by valueChange, or selectChange.<br>","         * <i>- e.currentTarget: the selected li-Node<br>","         * <i>- e.value: returnvalue of the selected item<br>","         * <i>- e.index: index of the selected item</i>","         *","        */","        _selectItem : function(node, userInteraction) {","            var instance = this,","                previousNode = instance._itemsContainerNode.one('li.'+instance._selectedItemClass),","                nodeHTML;","            if (!instance.get('disabled') && node && (node !== previousNode)) {","                if (previousNode) {previousNode.removeClass(instance._selectedItemClass);}","                node.addClass(instance._selectedItemClass);","                nodeHTML = node.getHTML();","                if (instance.get('selectionOnButton')) {instance._selectedMainItemNode.setHTML(nodeHTML);}","                /**","                 * In case of a valuechange, valueChange will be fired. ","                 * No matter whether the change is done by userinteraction, or by a functioncall like selectItem()","                 * @event valueChange","                 * @param {EventFacade} e Event object<br>","                 * <i>- e.currentTarget: the selected li-Node<br>","                 * <i>- e.value: returnvalue of the selected item<br>","                 * <i>- e.index: index of the selected item</i>","                */                ","                instance.fire('valueChange', {currentTarget: node, value: node.getData('returnValue') || nodeHTML, index: instance._indexOf(node)});","                /**","                 * In case of a valuechange <u>triggered by userinteraction</u>, selectChange will be fired. ","                 * This way you can use functioncalls like selectItem() and prevent double programmaction (which might occur when you listen to the valueChange event)","                 * @event selectChange","                 * @param {EventFacade} e Event object<br>","                 * <i>- e.currentTarget: the selected li-Node<br>","                 * <i>- e.value: returnvalue of the selected item<br>","                 * <i>- e.index: index of the selected item</i>","                */                ","                if (userInteraction) {instance.fire('selectChange', {currentTarget: node, value: node.getData('returnValue') || nodeHTML, index: instance._indexOf(node)});}","            }","        },","","        /**","         * Will hide the listitems.","         * Will also fire a <b>hide event</b>.<br>","         * @method hideListbox","         *","        */","        hideListbox : function() {","            var instance = this;","            if (!instance.get('disabled')) {","                /**","                 * In case the listbox is opened, hide-event will be fired. ","                 * @event shide","                 * @param {EventFacade} e Event object<br>","                */                ","                instance.fire('hide');","                instance._itemsContainerNode.toggleClass(ITSA_CLASSHIDDEN, true);","            }","        },","","        /**","         * Will show the listitems.","         * Will also fire a <b>show event</b>.<br>","         * @method showListbox","         *","        */","        showListbox : function() {","            var instance = this;","            if (!instance.get('disabled')) {","                /**","                 * In case the listbox is opened, show-event will be fired. ","                 * @event show","                 * @param {EventFacade} e Event object<br>","                */                ","                instance.fire('show');","                instance._itemsContainerNode.toggleClass(ITSA_CLASSHIDDEN, false);","            }","        },","","        /**","         * Toggles between shown/hidden listitems.","         *","         * @method _toggleListbox","         * @private","         *","        */","        _toggleListbox : function() {","            var instance = this;","            if (instance._itemsContainerNode.hasClass(ITSA_CLASSHIDDEN)) {instance.showListbox();}","            else {instance.hideListbox();}","        },","","        /**","         * Returns the actual selected listitemnode.<br>","         *","         * @method currentSelected","         * @return {Y.Node} the current selected listitemnode, or null if none is selected.","        */","        currentSelected : function() {","            return this._itemsContainerNode.one('li.'+this._selectedItemClass);","        },","","        /**","         * Returns the index of the actual selected listitemnode.<br>","         *","         * @method currentIndex","         * @return {Int} index of the current selected listitem, or -1 if none is selected.","         *","        */","        currentIndex : function() {","            return this._indexOf(this.currentSelected());","        },","","        /**","         * Returns the index of a listitemnode.<br>","         *","         * @method _indexOf","         * @private","         * @param {Y.Node} node the node to search for.","         * @return {Int} index of a listitem, or -1 if not present.","         *","        */","        _indexOf : function(node) {","            var nodelist = this._itemsContainerNode.one('.itsa-selectlist-ullist').all('li');","            return nodelist.indexOf(node);","        },","        ","        /**","         * Is called after a disabledchange. Does dis/enable the inner-button element<br>","         *","         * @method _disabledChange","         * @private","         * @param {eventFacade} e passed through by widget.disabledChange event","         *","        */","        _disabledChange : function(e) {","            var instance = this;","            instance.buttonNode.toggleClass('yui3-button-disabled', e.newVal);","            instance.hideListbox();","        },","","        /**","         * Cleaning up.","         *","         * @protected","         * @method destructor","         *","        */","        destructor : function() {","            this.get('contentBox').empty();","        }","","    }, {","        ATTRS : {","","            /**","             * @description The size of the buttons<br>","             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>","             * Default = 2","             * @attribute btnSize","             * @type int","            */","            btnSize : {","                value: 3,","                validator: function(val) {","                    return (Lang.isNumber(val) && (val>0) && (val<4));","                }","            },","","            /**","             * @description Defines the defaultbuttontext when a softMatch with no hit has taken place.<br>","             * See <i>selectItem()</i> how to use a softMatch.<br>","             * Default = 'choose...'","             * @attribute defaultButtonText","             * @type String Default='choose...'","            */","            defaultButtonText : {","                value: 'choose...',","                validator: function(val) {","                    return Y.Lang.isString(val);","                }","            },","","            /**","             * @description Defines the buttonWidth<br>","             * Default = null, which means automaticly sizeing.","             * @attribute buttonWidth","             * @type Int","            */","            buttonWidth: {","                value: null,","                validator: function(val) {","                    return (Y.Lang.isNumber(val) && (val>=0));","                }","            },","","            /**","             * @description Defines the width of the listbox.<br>","             * Default = null, which means automaticly sizeing.","             * @attribute listWidth","             * @type Int","            */","            listWidth: {","                value: null,","                validator: function(val) {","                    return (Y.Lang.isNumber(val) && (val>=0));","                }","            },","","            /**","             * @description Whether the listitems should be aligned left or right.","             * Default = true.","             * @attribute listAlignLeft","             * @type Boolean","            */","            listAlignLeft : {","                value: true,","                validator: function(val) {","                    return Y.Lang.isBoolean(val);","                }","            },","","            /**","             * @description Additional className that can be added to the boundingBox","             * @attribute className","             * @type String","            */","            className : {","                value: null,","                validator: function(val) {","                    return Y.Lang.isString(val);","                }","            },","","            /**","             * @description Additional className that can be added to the selected text on the Button","             * @attribute iconClassName","             * @type String","            */","            iconClassName : {","                value: null,","                validator: function(val) {","                    return Y.Lang.isString(val);","                }","            },","","            /**","             * @description Listitems in the selectbox","             * @attribute items","             * @type Array of (String or Int)","            */","            items : {","                value: [],","                validator: function(val) {","                    return Y.Lang.isArray(val);","                },","                setter: function(val) {","                    var instance = this,","                        item,","                        i;","                    instance._itemValues = [];","                    for (i=0; i<val.length; i++) {","                        item = val[i];","                        // Make sure to fill the array with Strings. User might supply other types like numbers: you don't want to miss the hit when you search the array by value.","                        instance._itemValues.push(item.returnValue ? item.returnValue.toString().toLowerCase() : item.toString().toLowerCase());","                    }","                    // only call syncUI when items are change after rendering","                    if (this._syncWithinSetterItems) {this.syncUI();}","                    return val;","                }","            },","","            /**","             * @description The default listitem to be selected during rendering.<br>","             * Default = null","             * @attribute defaultItem","             * @type String","            */","            defaultItem : {","                value: null,","                validator: function(val) {","                    return Y.Lang.isString(val);","                }","            },","","            /**","             * @description Whether the selection should be displayed on the button.<br>","             * This is normal behaviour. Although in some cases you might not want this. For example when simulating a menubutton with static text and a dropdown with subbuttons<br>","             * Default = true<br>","             * When set to false, the buttontext will always remains the Attribute: <b>defaultButtonText</b>","             * @attribute selectionOnButton","             * @type Boolean","            */","            selectionOnButton : {","                value: true,","                validator: function(val) {","                    return Y.Lang.isBoolean(val);","                }","            },","","            /**","             * @description Determines whether to show the selected item in the selectlist, or if it should disappear from the selectlist when selected.<br>","             * Default = false.","             * @attribute hideSelected","             * @type Boolean","            */","            hideSelected : {","                value: false,","                validator: function(val) {","                    return Y.Lang.isBoolean(val);","                },","                setter: function(val) {","                    var instance = this;","                    instance._selectedItemClass = val ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';","                    return val;","                }","            }","        }","    }",");","","","}, 'gallery-2012.09.26-20-36' ,{requires:['base-build', 'widget-base', 'node-base', 'cssbutton', 'event-base', 'node-event-delegate', 'event-outside'], skinnable:true});"];
_yuitest_coverage["/build/gallery-itsaselectlist/gallery-itsaselectlist.js"].lines = {"1":0,"3":0,"23":0,"34":0,"97":0,"98":0,"107":0,"116":0,"117":0,"118":0,"119":0,"120":0,"121":0,"122":0,"123":0,"124":0,"125":0,"126":0,"127":0,"130":0,"131":0,"132":0,"134":0,"143":0,"145":0,"146":0,"147":0,"148":0,"157":0,"168":0,"169":0,"170":0,"171":0,"172":0,"173":0,"174":0,"175":0,"176":0,"177":0,"179":0,"181":0,"197":0,"216":0,"218":0,"219":0,"222":0,"223":0,"224":0,"247":0,"249":0,"269":0,"272":0,"273":0,"274":0,"275":0,"276":0,"286":0,"296":0,"307":0,"308":0,"314":0,"315":0,"326":0,"327":0,"333":0,"334":0,"346":0,"347":0,"358":0,"369":0,"382":0,"383":0,"395":0,"396":0,"397":0,"408":0,"424":0,"438":0,"451":0,"464":0,"477":0,"489":0,"501":0,"513":0,"516":0,"519":0,"520":0,"521":0,"523":0,"526":0,"527":0,"540":0,"555":0,"568":0,"571":0,"572":0,"573":0};
_yuitest_coverage["/build/gallery-itsaselectlist/gallery-itsaselectlist.js"].functions = {"initializer:96":0,"renderUI:106":0,"bindUI:142":0,"syncUI:156":0,"_itemClick:196":0,"selectItem:215":0,"selectItemByValue:245":0,"_selectItem:268":0,"hideListbox:306":0,"showListbox:325":0,"_toggleListbox:345":0,"currentSelected:357":0,"currentIndex:368":0,"_indexOf:381":0,"_disabledChange:394":0,"destructor:407":0,"validator:423":0,"validator:437":0,"validator:450":0,"validator:463":0,"validator:476":0,"validator:488":0,"validator:500":0,"validator:512":0,"setter:515":0,"validator:539":0,"validator:554":0,"validator:567":0,"setter:570":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-itsaselectlist/gallery-itsaselectlist.js"].coveredLines = 97;
_yuitest_coverage["/build/gallery-itsaselectlist/gallery-itsaselectlist.js"].coveredFunctions = 30;
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 1);
YUI.add('gallery-itsaselectlist', function(Y) {

_yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 3);
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
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 23);
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

_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 34);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "initializer", 96);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 97);
var instance = this;
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 98);
instance._selectedItemClass = instance.get('hideSelected') ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';
        },

        /**
         * Widget's renderUI-method. Creates the Selectlist in the DOM.
         *
         * @method renderUI 
        */
        renderUI : function() {
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "renderUI", 106);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 107);
var instance = this,
                contentBox = instance.get('contentBox'), 
                boundingBox = instance.get('boundingBox'),
                className = instance.get('className'),
                iconClassName = instance.get('iconClassName'),
                buttonWidth = instance.get('buttonWidth'),
                listWidth = instance.get('listWidth'),
                btnSize = instance.get('btnSize'),
                items;
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 116);
if ((IE>0) && (IE<7)) {boundingBox.append(instance.SHIM_TEMPLATE);}
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 117);
instance.buttonNode = Y.Node.create(ITSA_BUTTON_TEMPLATE);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 118);
contentBox.append(instance.buttonNode);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 119);
instance.buttonNode.setHTML(ITSA_DOWNBUTTON_TEMPLATE);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 120);
instance._selectedMainItemNode = Y.Node.create(ITSA_SELECTEDMAIN_TEMPLATE);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 121);
instance.buttonNode.append(instance._selectedMainItemNode);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 122);
instance._itemsContainerNode = Y.Node.create(ITSA_SELECTBOX_TEMPLATE);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 123);
instance.get('listAlignLeft') ? boundingBox.addClass('itsa-leftalign') : boundingBox.addClass('itsa-rightalign');
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 124);
if (className) {boundingBox.addClass(className);}
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 125);
if (iconClassName) {
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 126);
instance._selectedMainItemNode.addClass('itsa-button-icon');
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 127);
instance._selectedMainItemNode.addClass(iconClassName);
            }
            // must set minWidth instead of width in case of button: otherwise the 2 spans might be positioned underneath each other
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 130);
if (buttonWidth) {instance.buttonNode.setStyle('minWidth', buttonWidth+'px');}
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 131);
if (listWidth) {instance._itemsContainerNode.setStyle('width', listWidth+'px');}
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 132);
if (btnSize===1) {boundingBox.addClass('itsa-buttonsize-small');}
            else {if (btnSize===2) {boundingBox.addClass('itsa-buttonsize-medium');}}
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 134);
contentBox.append(instance._itemsContainerNode);
        },

        /**
         * Widget's bindUI-method. Binds onclick and clickoutside-events
         *
         * @method bindUI 
        */
        bindUI : function() {
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "bindUI", 142);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 143);
var instance = this,
                boundingBox = instance.get('boundingBox');
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 145);
boundingBox.on('click', instance._toggleListbox, instance);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 146);
boundingBox.on('clickoutside', instance.hideListbox, instance);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 147);
instance._itemsContainerNode.delegate('click', instance._itemClick, 'li', instance);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 148);
instance.on('disabledChange', instance._disabledChange, instance);
        },

        /**
         *  Widget's syncUI-method. Renders the selectlist items
         *
         * @method syncUI
        */
        syncUI : function() {
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "syncUI", 156);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 157);
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
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 168);
ullist.setHTML(''); // clear content
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 169);
if (items.length>0) {
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 170);
for (i=0; i<items.length; i++) {
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 171);
item = items[i];
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 172);
itemText = Lang.isString(item) ? itemText = item : itemText = item.text;
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 173);
isDefaultItem = (itemText===defaultItem);
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 174);
if (isDefaultItem) {defaultItemFound = true;}
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 175);
newNode = Y.Node.create('<li' + ((isDefaultItem) ? ' class="' + instance._selectedItemClass + '"' : '') + '>' + itemText +'</li>');
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 176);
if (item.returnValue) {newNode.setData('returnValue', item.returnValue);}
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 177);
ullist.append(newNode);
                }
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 179);
instance._selectedMainItemNode.setHTML((instance.get('selectionOnButton') && defaultItemFound) ? defaultItem : instance.get('defaultButtonText'));
            }
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 181);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "_itemClick", 196);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 197);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "selectItem", 215);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 216);
var instance = this,
                nodelist = instance._itemsContainerNode.all('li');
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 218);
if (!instance.get('disabled')) {
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 219);
if ((index>=0) && (index<nodelist.size())) {instance._selectItem(nodelist.item(index));}
                else {
                    // no hit: return to default without selection in case of softMatch
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 222);
if (softMatch) {
                        _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 223);
nodelist.removeClass(instance._selectedItemClass);
                        _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 224);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "selectItemByValue", 245);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 247);
var instance = this,
                index = Y.Array.indexOf(instance._itemValues, itemText.toString().toLowerCase());
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 249);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "_selectItem", 268);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 269);
var instance = this,
                previousNode = instance._itemsContainerNode.one('li.'+instance._selectedItemClass),
                nodeHTML;
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 272);
if (!instance.get('disabled') && node && (node !== previousNode)) {
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 273);
if (previousNode) {previousNode.removeClass(instance._selectedItemClass);}
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 274);
node.addClass(instance._selectedItemClass);
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 275);
nodeHTML = node.getHTML();
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 276);
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
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 286);
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
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 296);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "hideListbox", 306);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 307);
var instance = this;
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 308);
if (!instance.get('disabled')) {
                /**
                 * In case the listbox is opened, hide-event will be fired. 
                 * @event shide
                 * @param {EventFacade} e Event object<br>
                */                
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 314);
instance.fire('hide');
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 315);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "showListbox", 325);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 326);
var instance = this;
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 327);
if (!instance.get('disabled')) {
                /**
                 * In case the listbox is opened, show-event will be fired. 
                 * @event show
                 * @param {EventFacade} e Event object<br>
                */                
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 333);
instance.fire('show');
                _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 334);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "_toggleListbox", 345);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 346);
var instance = this;
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 347);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "currentSelected", 357);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 358);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "currentIndex", 368);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 369);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "_indexOf", 381);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 382);
var nodelist = this._itemsContainerNode.one('.itsa-selectlist-ullist').all('li');
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 383);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "_disabledChange", 394);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 395);
var instance = this;
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 396);
instance.buttonNode.toggleClass('yui3-button-disabled', e.newVal);
            _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 397);
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
            _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "destructor", 407);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 408);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 423);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 424);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 437);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 438);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 450);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 451);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 463);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 464);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 476);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 477);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 488);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 489);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 500);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 501);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 512);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 513);
return Y.Lang.isArray(val);
                },
                setter: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "setter", 515);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 516);
var instance = this,
                        item,
                        i;
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 519);
instance._itemValues = [];
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 520);
for (i=0; i<val.length; i++) {
                        _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 521);
item = val[i];
                        // Make sure to fill the array with Strings. User might supply other types like numbers: you don't want to miss the hit when you search the array by value.
                        _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 523);
instance._itemValues.push(item.returnValue ? item.returnValue.toString().toLowerCase() : item.toString().toLowerCase());
                    }
                    // only call syncUI when items are change after rendering
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 526);
if (this._syncWithinSetterItems) {this.syncUI();}
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 527);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 539);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 540);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 554);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 555);
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
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "validator", 567);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 568);
return Y.Lang.isBoolean(val);
                },
                setter: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", "setter", 570);
_yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 571);
var instance = this;
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 572);
instance._selectedItemClass = val ? ITSA_CLASSHIDDEN : 'itsa-selectlist-selected';
                    _yuitest_coverline("/build/gallery-itsaselectlist/gallery-itsaselectlist.js", 573);
return val;
                }
            }
        }
    }
);


}, 'gallery-2012.09.26-20-36' ,{requires:['base-build', 'widget-base', 'node-base', 'cssbutton', 'event-base', 'node-event-delegate', 'event-outside'], skinnable:true});
