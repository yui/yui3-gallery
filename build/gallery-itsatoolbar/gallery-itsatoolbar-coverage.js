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
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-itsatoolbar/gallery-itsatoolbar.js",
    code: []
};
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].code=["YUI.add('gallery-itsatoolbar', function(Y) {","","'use strict';","","/**"," * The Itsa Selectlist module."," *"," * @module itsa-toolbar"," */","","/**"," * Editor Toolbar Plugin"," * "," *"," * @class Plugin.ITSAToolbar"," * @constructor"," *"," * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>"," * YUI BSD License - http://developer.yahoo.com/yui/license.html"," *","*/","","// Local constants","var Lang = Y.Lang,","    Node = Y.Node,","","    ITSA_BTNNODE = \"<button class='yui3-button'></button>\",","    ITSA_BTNINNERNODE = \"<span class='itsa-button-icon'></span>\",","    ITSA_BTNPRESSED = 'yui3-button-active',","    ITSA_BTNACTIVE = 'itsa-button-active',","    ITSA_BTNINDENT = 'itsa-button-indent',","    ITSA_BUTTON = 'itsa-button',","    ITSA_BTNSYNC = 'itsa-syncbutton',","    ITSA_BTNTOGGLE = 'itsa-togglebutton',","    ITSA_BTNGROUP = 'itsa-buttongroup',","    ITSA_BTNCUSTOMFUNC = 'itsa-button-customfunc',","    ITSA_TOOLBAR_TEMPLATE = \"<div class='itsatoolbar'></div>\",","    ITSA_TOOLBAR_SMALL = 'itsa-buttonsize-small',","    ITSA_TOOLBAR_MEDIUM = 'itsa-buttonsize-medium',","    ITSA_CLASSEDITORPART = 'itsatoolbar-editorpart',","    ITSA_SELECTCONTNODE = '<div></div>',","    ITSA_REFNODE = \"<span id='itsatoolbar-ref'></span>\",","    ITSA_REFSELECTION = 'itsa-selection-tmp',","    ITSA_FONTSIZENODE = 'itsa-fontsize';","","// -- Public Static Properties -------------------------------------------------","","/**"," * Reference to the editor's instance"," * @property editor"," * @type Y.EditorBase instance"," */","","/**"," * Reference to the Y-instance of the host-editor"," * @property editorY"," * @type YUI-instance"," */","","/**"," * Reference to the editor's iframe-node"," * @property editorNode"," * @type Y.Node"," */","","/**"," * Reference to the editor's container-node, in which the host-editor is rendered.<br>"," * This is in fact editorNode.get('parentNode')"," * @property containerNode"," * @type Y.Node"," */","","/**"," * Reference to the toolbar-node.<br>"," * @property toolbarNode"," * @type Y.Node"," */","","/**"," * Used internally to check if the toolbar should still be rendered after the editor is rendered<br>"," * To prevent rendering while it is already unplugged"," * @property _destroyed"," * @type Boolean"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_BOLD"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ITALIC"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNDERLINE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_LEFT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_CENTER"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_RIGHT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_JUSTIFY"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_SUBSCRIPT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_SUPERSCRIPT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_TEXTCOLOR"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_MARKCOLOR"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_INDENT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_OUTDENT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNORDEREDLIST"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ORDEREDLIST"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNDO"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_REDO"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_EMAIL"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_HYPERLINK"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_IMAGE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_FILE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_VIDEO"," * @type String"," */","","Y.namespace('Plugin').ITSAToolbar = Y.Base.create('itsatoolbar', Y.Plugin.Base, [], {","","        editor : null,","        editorY : null,","        editorNode : null,","        containerNode : null,","        toolbarNode : null,","        _destroyed : false,","","        ICON_BOLD : 'itsa-icon-bold',","        ICON_ITALIC : 'itsa-icon-italic',","        ICON_UNDERLINE : 'itsa-icon-underline',","        ICON_ALIGN_LEFT : 'itsa-icon-alignleft',","        ICON_ALIGN_CENTER : 'itsa-icon-aligncenter',","        ICON_ALIGN_RIGHT : 'itsa-icon-alignright',","        ICON_ALIGN_JUSTIFY : 'itsa-icon-alignjustify',","        ICON_SUBSCRIPT : 'itsa-icon-subscript',","        ICON_SUPERSCRIPT : 'itsa-icon-superscript',","        ICON_TEXTCOLOR : 'itsa-icon-textcolor',","        ICON_MARKCOLOR : 'itsa-icon-markcolor',","        ICON_INDENT : 'itsa-icon-indent',","        ICON_OUTDENT : 'itsa-icon-outdent',","        ICON_UNORDEREDLIST : 'itsa-icon-unorderedlist',","        ICON_ORDEREDLIST : 'itsa-icon-orderedlist',","        ICON_UNDO : 'itsa-icon-undo',","        ICON_REDO : 'itsa-icon-redo',","        ICON_EMAIL : 'itsa-icon-email',","        ICON_HYPERLINK : 'itsa-icon-hyperlink',","        ICON_IMAGE : 'itsa-icon-image',","        ICON_FILE : 'itsa-icon-file',","        ICON_VIDEO : 'itsa-icon-video',","        /**","         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready","         *","         * @method initializer","         * @param {Object} config The config-object.","         * @protected","        */","        initializer : function(config) {","            var instance = this;","            instance.editor = instance.get('host');","            // need to make sure we can use execCommand, so do not render before the frame exists.","            if (instance.editor.frame && instance.editor.frame.get('node')) {instance._render();}","            else {","                if (Y.UA.ie>0) {","                    // didn't find out yet: IE stops creating the editorinstance when pluggedin too soon!","                    // GOTTA check out","                    // at the time being: delaying","                    Y.later(250, instance, instance._render);","                }","                else {","                    instance.editor.on('frame:ready', instance._render, instance);","                }","            }","        },","","        /**","         * Establishes the initial DOM for the toolbar. This method ia automaticly invoked once during initialisation.","         * It will invoke renderUI, bindUI and syncUI, just as within a widget.","         *","         * @method _render","         * @private","        */","        _render : function() {","            var instance = this;","            if (!instance._destroyed) {","                instance.editorY = instance.editor.getInstance();","                instance.editorNode = instance.editor.frame.get('node');","                instance.containerNode = instance.editorNode.get('parentNode');","                instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);","                instance.editor.plug(Y.Plugin.ExecCommand);","                instance._defineCustomExecCommands();","                instance._renderUI();","                instance._bindUI();","                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object","                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!","                instance.editor.frame.focus(Y.bind(instance.sync, instance));","            }","        },","","        /**","         * Returns node at cursorposition<br>","         * This can be a selectionnode, or -in case of no selection- a new tmp-node (empty span) that will be created to serve as reference.","         * In case of selection, there will always be made a tmp-node as placeholder. But in that case, the tmp-node will be just before the returned node.","         * @method _getCursorRef","         * @private","         * @returns {Y.Node} created empty referencenode","        */","        _getCursorRef : function() {","            var instance = this,","                node;","            // insert cursor and use that node as the selected node","            // first remove previous","            instance._removeCursorRef();","            node = instance._getSelectedNode();","            if (node) {","                node.addClass(ITSA_REFSELECTION);","                instance.editorY.one('body').insertBefore(ITSA_REFNODE, node);","            }","            else {","                instance.editor.exec.command('inserthtml', ITSA_REFNODE);","                node = instance.editorY.one('#itsatoolbar-ref');","            }","            return node;","        },","","        /**","         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef","         * @method _removeCursorRef","         * @private","        */","        _removeCursorRef : function() {","            var instance = this,","                node,","                useY;","            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases","            useY = instance.editorY ? instance.editorY : Y;","            // first cleanup single referencenode","            node = useY.all('#itsatoolbar-ref');","            if (node) {node.remove();}","            // next clean up aal selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions","            node = useY.all('.' + ITSA_REFSELECTION)","            if (node.size()>0) {","                node.each(function(node){","                    node.replace(node.getHTML());","                });","            }","        },","","        /**","         * Sets the real editorcursor at the position of the tmp-node created by _getCursorRef<br>","         * Removes the cursor tmp-node afterward.","         * @method _setCursorAtRef","         * @private","        */","        _setCursorAtRef : function() {","            var instance = this,","                sel,","                node = instance.editorY.one('#itsatoolbar-ref');","            if (node) {","                sel = new instance.editorY.EditorSelection();","                sel.selectNode(node);","                instance._removeCursorRef();","            }","        },","","        /**","         * Gets the selection<br>","         * returns null when no selection is made.","         * @method _getSelectedNode","         * @private","         * @returns {Y.Node} selection-node","        */","        _getSelectedNode : function() {","            var instance = this,","                node = null,","                sel = new instance.editorY.EditorSelection(),","                out = sel.getSelected();","            if (!sel.isCollapsed && out.size()) {","                // We have a selection","                node = out.item(0);","            }","            return node;","        },","","        /**","         * Syncs the toolbar's status with the editor.<br>","         * @method sync","         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.","        */","        sync : function(e) {","            // syncUI will sync the toolbarstatus with the editors cursorposition","            var instance = this;","            if (!e || !e.changedNode) {","                e = {changedNode: instance._getCursorRef()};","                Y.later(500, instance, instance._removeCursorRef);","            }","            instance.toolbarNode.fire('itsatoolbar:statusChange', e);","        },","","        /**","         * Creates a new Button on the Toolbar. By default at the end of the toolbar.","         * @method addButton","         * @param {String} iconClass Defines the icon's look. Refer to the general moduledescription for a list with available classes.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, or you want a custom Function to be executed, you must supply an object:<br>","         * <i>- [command]</i> (String): the execcommand<br>","         * <i>- [value]</i> (String): additional value","         * <i>- [customFunc]</i> (Function): reference to custom function: typicaly, this function will call editorinstance.itstoolbar.execCommand() by itsself","         * <i>- [context]]</i> (instance): the context for customFunc","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addButton : function(iconClass, execCommand, indent, position) {","            var instance = this,","                buttonNode,","                buttonInnerNode;","            buttonNode = Node.create(ITSA_BTNNODE);","            buttonNode.addClass(ITSA_BUTTON);","            if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}","            else if (Lang.isObject(execCommand)) {","                if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}","                if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}","                if (Lang.isFunction(execCommand.customFunc)) {","                    buttonNode.addClass(ITSA_BTNCUSTOMFUNC);","                    buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);","                }","            }","            if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}","            buttonInnerNode = Node.create(ITSA_BTNINNERNODE);","            buttonInnerNode.addClass(iconClass);","            buttonNode.append(buttonInnerNode);","            instance.toolbarNode.append(buttonNode);","            return buttonNode;","        },","","        /**","         * Creates a new syncButton on the Toolbar. By default at the end of the toolbar.<br>","         * A syncButton is just like a normal toolbarButton, with the exception that the editor can sync it's status, which cannot be done with a normal button. ","         * Typically used in situations like a hyperlinkbutton: it never stays pressed, but when the cursos is on a hyperlink, he buttons look will change.","         * @method addSyncButton","         * @param {String} iconClass Defines the icon's look. Refer static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>","         * <i>- command</i> (String): the execcommand<br>","         * <i>- value</i> (String): additional value","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.","         * This function should handle the responseaction to be taken.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addSyncButton : function(iconClass, execCommand, syncFunc, context, indent, position, isToggleButton) {","            var instance = this,","                buttonNode = instance.addButton(iconClass, execCommand, indent, position);","            if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}","            instance.toolbarNode.addTarget(buttonNode);","            if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(syncFunc, context || instance));}","            return buttonNode;","        },","","        /**","         * Creates a new toggleButton on the Toolbar. By default at the end of the toolbar.","         * @method addToggleButton","         * @param {String} iconClass Defines the icon's look. Refer static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>","         * <i>- command</i> (String): the execcommand<br>","         * <i>- value</i> (String): additional value","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.","         * This function should handle the responseaction to be taken.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addToggleButton : function(iconClass, execCommand, syncFunc, context, indent, position) {","            var instance = this,","                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);","            buttonNode.addClass(ITSA_BTNTOGGLE);","            return buttonNode;","        },","","        /**","         * Creates a group of toggleButtons on the Toolbar which are related to each-other. For instance when you might need 3 related buttons: leftalign, center, rightalign.","         * Position is by default at the end of the toolbar.<br>","         * @method addButtongroup","         * @param {Array} buttons Should consist of objects with two fields:<br>","         * <i>- iconClass</i> (String): defines the icon's look. Refer static Properties for some predefined classes like ICON_BOLD.","         * <i>- command</i> (String): the execcommand that will be executed on buttonclick","         * <i>- [value]</i> (String) optional: additional value for the execcommand","         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton)","         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the first buttonnode of the created buttongroup","        */","        addButtongroup : function(buttons, indent, position) {","            var instance = this,","                buttonGroup = Y.guid(),","                button,","                buttonNode,","                returnNode = null,","                execCommand,","                i;","            for (i=0; i<buttons.length; i++) {","                button = buttons[i];","                if (button.iconClass && button.command) {","                    if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}","                    else {execCommand = button.command;}","                    buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position) ? position+i : null);","                    buttonNode.addClass(ITSA_BTNGROUP);","                    buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);","                    buttonNode.setData('buttongroup', buttonGroup);","                    instance.toolbarNode.addTarget(buttonNode);","                    if (Lang.isFunction(button.syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(button.syncFunc, button.context || instance));}","                    if (!returnNode) {returnNode = buttonNode;}","                }","            }","            return returnNode;","        },","","        /**","         * Creates a selectList on the Toolbar. By default at the end of the toolbar.","         * When fired, the event-object returnes with 2 fields:<br>","         * <i>- e.value</i>: value of selected item<br>","         * <i>- e.index</i>: indexnr of the selected item","         * @method addSelectList","         * @param {Array} items contains all the items. Should be either a list of (String), or a list of (Objects). In case of an Object-list, the objects should contain two fields:<br>","         * <i>- text</i> (String): the text shown in the selectlist<br>","         * <i>- returnValue</i> (String): the returnvalue of e.value<br>","         * In case a String-list is supplied, e.value will equal to the selected String-item (returnvalue==text)","","         * @param {String | Object} execCommand ExecCommand that will be executed after a selectChange-event is fired. e.value will be placed as the second argument in editor.execCommand().<br>","         * You could provide a second 'restoreCommand', in case you need a different execCommand to erase some format. In that case you must supply an object with three fields:<br>","         * <i>- command</i> (String): the standard execcommand<br>","         * <i>- restoreCommand</i> (String): the execcommand that will be executed in case e.value equals the restore-value<br>","         * <i>- restoreValue</i> (String): when e.value equals restoreValue, restoreCommand will be used instead of the standard command","","","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Object} [config] Object that will be passed into the selectinstance. Has with the following fields:<br>","         * <i>- listAlignRight</i> (Boolean): whether to rightalign the listitems. Default=false<br>","         * <i>- hideSelected</i> (Boolean): whether the selected item is hidden from the list. Default=false","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.ITSASelectlist} reference to the created object","        */","        addSelectlist : function(items, execCommand, syncFunc, context, indent, config, position) {","            var instance = this,","                selectlist;","            config = Y.merge(config, {items: items, defaultButtonText: ''});","            selectlist = new Y.ITSASelectList(config);","            selectlist.after('render', function(e, execCommand, syncFunc, context, indent){","                var instance = this,","                    selectlist = e.currentTarget,","                    buttonNode = selectlist.buttonNode;","                if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}","                else {","                    if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}                    ","                    if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}                    ","                    if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}                    ","                }","                if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}","                instance.toolbarNode.addTarget(buttonNode);","                selectlist.on('selectChange', instance._handleSelectChange, instance);","                if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.rbind(syncFunc, context || instance));}","                instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);","            }, instance, execCommand, syncFunc, context, indent);","            selectlist.render(instance.toolbarNode);","            return selectlist;","        },","","","        /**","         * Cleans up bindings and removes plugin","         * @method destructor","         * @protected","        */","        destructor : function() {","            var instance = this,","                srcNode = instance.get('srcNode');","             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction","            instance._destroyed = true;","            instance._removeCursorRef();","            if (instance.toolbarNode) {instance.toolbarNode.remove(true);}","        },","","        // -- Private Methods ----------------------------------------------------------","","        /**","         * Creates the toolbar in the DOM. Toolbar will appear just above the editor, or -when scrNode is defined-  it will be prepended within srcNode ","         *","         * @method _renderUI","         * @private","        */","        _renderUI : function() {","            var instance = this,","                correctedHeight = 0,","                srcNode = instance.get('srcNode'),","                btnSize = instance.get('btnSize');","            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering","            instance.toolbarNode = Node.create(ITSA_TOOLBAR_TEMPLATE);","            if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}","            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}","            if (srcNode) {","                srcNode.prepend(instance.toolbarNode);","            }","            else {","                instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);","                switch (instance.get('btnSize')) {","                    case 1:","                        correctedHeight = -40;","                    break;","                    case 2: ","                        correctedHeight = -44;","                    break;","                    case 3: ","                        correctedHeight = -46;","                    break;","                }","                correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);","                instance.editorNode.set('height', correctedHeight);","                instance.editorNode.insert(instance.toolbarNode, 'before');","            }","            instance._initializeButtons();","        },","        ","        /**","         * Binds events when there is a cursorstatus changes in the editor","         *","         * @method _bindUI","         * @private","        */","        _bindUI : function() {","            var instance = this;","            instance.editor.on('nodeChange', instance.sync, instance);","            instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance);","        },","","        /**","         * Defines all custom execCommands","         *","         * @method _defineCustomExecCommands","         * @private","        */","        _defineCustomExecCommands : function() {","            var instance = this;","            instance._defineExecCommandHeader();","            instance._defineExecCommandFontSize();","            instance._defineExecCommandHyperlink();","            instance._defineExecCommandMaillink();","            instance._defineExecCommandImage();","            instance._defineExecCommandYouTube();","        },","","        /**","         * Handling the buttonclicks for all buttons on the Toolbar within one eventhandler (delegated by the Toolbar-node)","         *","         * @method _bindUI","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _handleBtnClick : function(e) {","            var instance = this,","                node = e.currentTarget;","            // only execute for .itsa-button, not for all buttontags    ","            if (node.hasClass(ITSA_BUTTON)) {","                if (node.hasClass(ITSA_BTNTOGGLE)) {","                    node.toggleClass(ITSA_BTNPRESSED);","                }","                else if (node.hasClass(ITSA_BTNSYNC)) {","                    node.toggleClass(ITSA_BTNACTIVE, true);","                }","                else if (node.hasClass(ITSA_BTNGROUP)) {","                    instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);","                    node.toggleClass(ITSA_BTNPRESSED, true);","                }","                if (!node.hasClass(ITSA_BTNCUSTOMFUNC)) {instance._execCommandFromData(node);}","            }","        },","","        /**","         * Handling the selectChange event of a selectButton","         *","         * @method _handleSelectChange","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _handleSelectChange : function(e) {","            var selectButtonNode,","                restoreCommand,","                execCommand;","            selectButtonNode = e.currentTarget.buttonNode;","            restoreCommand = selectButtonNode.getData('restoreCommand');","            execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');","            this.execCommand(execCommand, e.value);","        },","","        /**","         * Executes this.editor.exec.command with the execCommand and value that is bound to the node through Node.setData('execCommand') and Node.setData('execValue'). <br>","         * these values are bound during definition of addButton(), addSyncButton(), addToggleButton etc.","         *","         * @method _execCommandFromData","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _execCommandFromData: function(buttonNode) {","            var execCommand,","                execValue;","            execCommand = buttonNode.getData('execCommand');","            execValue = buttonNode.getData('execValue');","            this.execCommand(execCommand, execValue);","        },","","        /**","         * Performs a execCommand that will take into account the editors cursorposition<br>","         * This means that when no selection is made, the operation still works: you can preset an command this way.","         *","         * @method execCommand","         * @param {String} command The execCommand","         * @param {String} [value] additional commandvalue","        */","        execCommand: function(command, value) {","            var instance = this;","            instance.editor.focus();","            instance.editor.exec.command(command, value);","        },","","        /**","         * Checks whether there is a selection within the editor<br>","         *","         * @method _hasSelection","         * @private","         * @returns {Boolean} whether there is a selection","        */","        _hasSelection : function() {","            var instance = this,","                sel = new instance.editorY.EditorSelection();","            return (!sel.isCollapsed  && sel.anchorNode);","        },","","        /**","         * Checks whether the cursor is inbetween a selector. For instance to check if cursor is inbetween a h1-selector","         *","         * @method _checkInbetweenSelector","         * @private","         * @param {String} selector The selector to check for","         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection","         * @returns {Boolean} whether node resides inbetween selector","        */","        _checkInbetweenSelector : function(selector, cursornode) {","            var instance = this,","                pattern = '<\\\\s*' + selector + '[^>]*>(.*?)<\\\\s*/\\\\s*' + selector  + '>',","                searchHeaderPattern = new RegExp(pattern, 'gi'),","                fragment,","                inbetween = false,","                refContent = instance.editorY.one('body').getHTML(),","                nodewrap,","                cursorindex;","            nodewrap = Node.create('<div></div>');","            nodewrap.append(cursornode.cloneNode(true));","            cursorindex = refContent.indexOf(nodewrap.getHTML());","            fragment = searchHeaderPattern.exec(refContent);","            while ((fragment !== null) && !inbetween) {","                inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));","                fragment = searchHeaderPattern.exec(refContent); // next search","            }","            return inbetween;","        },","","        /**","         * Finds the headernode where the cursor, or selection remains in","         *","         * @method _getActiveHeader","         * @private","         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection. Can be supplied by e.changedNode, or left empty to make this function determine itself.","         * @returns {Y.Node|null} the headernode where the cursor remains. Returns null if outside any header.","        */","     _getActiveHeader : function(cursornode) {","            var instance = this,","                pattern,","                searchHeaderPattern,","                fragment,","                nodeFound,","                nodewrap,","                nodetag,","                headingNumber = 0,","                returnNode = null,","                checkNode,","                endpos,","                refContent;","            if (cursornode) {    ","                // node can be a header right away, or it can be a node within a header. Check for both","                nodetag = cursornode.get('tagName');","                if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}","                if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {","                    returnNode = cursornode;","                }","                else {","                    nodewrap = Node.create('<div></div>');","                    nodewrap.append(cursornode.cloneNode(true));","                    // first look for endtag, to determine which headerlevel to search for","//                    pattern = '<\\\\s*h\\\\d[^>]*>(.*?)' + nodewrap.getHTML() + '(.*?)<\\\\s*/\\\\s*h\\\\d>';","                    pattern = nodewrap.getHTML() + '(.*?)<\\\\s*/\\\\s*h\\\\d>';","                    searchHeaderPattern = new RegExp(pattern, 'gi');","                    refContent = instance.editorY.one('body').getHTML();","                    fragment = searchHeaderPattern.exec(refContent);","                    if (fragment !== null) {","                        // search again, looking for the right headernumber","                        endpos = fragment.index+fragment[0].length-1;","                        headingNumber = refContent.substring(endpos-1, endpos);","                        pattern = '<\\\\s*h' + headingNumber + '[^>]*>(.*?)' + nodewrap.getHTML() + '(.*?)<\\\\s*/\\\\s*h' + headingNumber + '>';","                        searchHeaderPattern = new RegExp(pattern, 'gi');","                        fragment = searchHeaderPattern.exec(refContent); // next search","                        if (fragment !== null) {","                            nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);","                        }","                    }","                    if (nodeFound) {","                        checkNode = Node.create(nodeFound);","                        returnNode = instance.editorY.one('#' + checkNode.get('id'));","                    }","                }","            }","            return returnNode;","        },","","        /**","         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.","         *","         * @method _initializeButtons","         * @private","        */","        _initializeButtons : function() { ","            var instance = this,","                i, r, g, b,","                item,","                items,","                bgcolor,","                docFontSize,","                bgcolors,","                buttons;","","            // create fonffamily button","            if (instance.get('btnFontfamily')) {","                items = instance.get('fontFamilies');","                for (i=0; i<items.length; i++) {","                    item = items[i];","                    items[i] = {text: \"<span style='font-family:\"+item+\"'>\"+item+\"</span>\", returnValue: item};","                }","                instance.fontSelectlist = instance.addSelectlist(items, 'fontname2', function(e) {","                    var familyList = e.changedNode.getStyle('fontFamily'),","                        familyListArray = familyList.split(','),","                        activeFamily = familyListArray[0];","                    // some browsers place '' surround the string, when it should contain whitespaces.","                    // first remove them","                    if (activeFamily.substring(0,1)===\"'\") {activeFamily = activeFamily.substring(1, activeFamily.length-1);}","                    this.fontSelectlist.selectItemByValue(activeFamily, true, true);","                }, null, true, {buttonWidth: 145});","            }","","            // create fontsize button","            if (instance.get('btnFontsize')) {","                items = [];","                for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}","                instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {","                    var fontSize = e.changedNode.getStyle('fontSize'),","                        fontSizeNumber = parseFloat(fontSize),","                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);","                    // make sure not to display partial numbers    ","                    this.sizeSelectlist.selectItemByValue(Math.round(fontSizeNumber)+fontsizeExt, true);","                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});","            }","","            // create header button","            if (instance.get('btnHeader')) {","                items = [];","                items.push({text: 'No header', returnValue: 'none'});","                for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}","                instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {","                    var instance = this,","                        node = e.changedNode,","                        internalcall = (e.sender && e.sender==='itsaheading'),","                        activeHeader;","                    // prevent update when sync is called after heading has made changes. Check this through e.sender","                    if (!internalcall) {","                        activeHeader = instance._getActiveHeader(node);","                        instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);","                        instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());","                    }","                }, null, true, {buttonWidth: 96});","            }","","            // create bold button","            if (instance.get('btnBold')) {","                instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontWeight')==='bold'));","                }, null, true);","            }","","            // create italic button","            if (instance.get('btnItalic')) {","                instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));","                });","            }","","            // create underline button","            if (instance.get('btnUnderline')) {","                instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));","                });","            }","","            // create align buttons","            if (instance.get('grpAlign')) {","                buttons = [","                    {","                        iconClass : instance.ICON_ALIGN_LEFT,","                        command : 'JustifyLeft',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));","                                    }","                    },","                    {","                        iconClass : instance.ICON_ALIGN_CENTER,","                        command : 'JustifyCenter',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));","                                    }","                    },","                    {","                        iconClass : instance.ICON_ALIGN_RIGHT,","                        command : 'JustifyRight',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));","                                    }","                    }","                ];","            // create justify button","                if (instance.get('btnJustify')) {","                    buttons.push({","                        iconClass : instance.ICON_ALIGN_JUSTIFY,","                        command : 'JustifyFull',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));","                                    }","                    });","                }","                instance.addButtongroup(buttons, true);","            }","","            // create subsuperscript buttons","            if (instance.get('grpSubsuper')) {","                instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));","                }, null, true);","                instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));","                });","            }","","            // create textcolor button","            if (instance.get('btnTextcolor')) {","                items = [];","                bgcolors = instance.get('colorPallet');","                for (i=0; i<bgcolors.length; i++) {","                    bgcolor = bgcolors[i];","                    items.push({text: \"<div style='background-color:\"+bgcolor+\";'></div>\", returnValue: bgcolor});","                }","                instance.colorSelectlist = instance.addSelectlist(items, 'forecolor', function(e) {","                    var instance = this,","                        styleColor = e.changedNode.getStyle('color'),","                        hexColor = instance._filter_rgb(styleColor);","                    instance.colorSelectlist.selectItemByValue(hexColor, true, true);","                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});","            }","","            // create markcolor button","            if (instance.get('btnMarkcolor')) {","                items = [];","                bgcolors = instance.get('colorPallet');","                for (i=0; i<bgcolors.length; i++) {","                    bgcolor = bgcolors[i];","                    items.push({text: \"<div style='background-color:\"+bgcolor+\";'></div>\", returnValue: bgcolor});","                }","                instance.markcolorSelectlist = instance.addSelectlist(items, 'hilitecolor', function(e) {","                    var instance = this,","                        styleColor = e.changedNode.getStyle('backgroundColor'),","                        hexColor = instance._filter_rgb(styleColor);","                    instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);","                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});","            }","","            // create indent buttons","            if (instance.get('grpIndent')) {","                instance.addButton(instance.ICON_INDENT, 'indent', true);","                instance.addButton(instance.ICON_OUTDENT, 'outdent');","            }","","            // create list buttons","            if (instance.get('grpLists')) {","                instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {","                    var instance = this,","                        node = e.changedNode;","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));","                }, null, true);","                instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {","                    var instance = this,","                        node = e.changedNode;","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));","                });","            }","","            // create email button","            if (instance.get('btnEmail')) {","                instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {","                    var instance = this,","                        node = e.changedNode,","                        nodePosition,","                        isLink,","                        isEmailLink;","                    isLink =  instance._checkInbetweenSelector('a', node);","                    if (isLink) {","                        // check if its a normal href or a mailto:","                        while (node && !node.test('a')) {node=node.get('parentNode');}","                        // be carefull: do not === /match() with text, that will fail","                        isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');","                    }","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));","                }, null, true);","            }","","            // create hyperlink button","            if (instance.get('btnHyperlink')) {","                instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {","                    var instance = this,","                        posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',","                        node = e.changedNode,","                        nodePosition,","                        isLink,","                        isFileLink = false,","                        href,","                        lastDot,","                        fileExt,","                        isHyperLink;","                    isLink =  instance._checkInbetweenSelector('a', node);","                        if (isLink) {","                            // check if its a normal href or a mailto:","                            while (node && !node.test('a')) {node=node.get('parentNode');}","                            // be carefull: do not === /match() with text, that will fail","                            href = node.get('href');","                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';","                            if (isHyperLink) {","                                lastDot = href.lastIndexOf('.');","                                if (lastDot!==-1) {","                                    fileExt = href.substring(lastDot)+'.';","                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);","                                }","                            }","                        }","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));","                });","            }","","            // create image button","            if (instance.get('btnImage')) {","                instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));","                });","            }","","            // create video button","            if (instance.get('btnVideo')) {","                instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('iframe')));","                });","            }","","//************************************************","// just for temporary local use ITS Asbreuk","// should NOT be part of the gallery","            if (false) {","                instance.addSyncButton(","                    instance.ICON_FILE,","                    {   customFunc: function(e) {","                            Y.config.cmas2plus.uploader.show(","                                null, ","                                Y.bind(function(e) {","                                    this.editor.execCommand('itsacreatehyperlink', 'http://files.brongegevens.nl/' + Y.config.cmas2plusdomain + '/' + e.n);","                                }, this)","                            );","                        }","                    },","                    function(e) {","                        var instance = this,","                            posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',","                            node = e.changedNode,","                            nodePosition,","                            isFileLink = false,","                            isLink,","                            href,","                            lastDot,","                            fileExt,","                            isHyperLink;","                        isLink =  instance._checkInbetweenSelector('a', node);","                        if (isLink) {","                            // check if its a normal href or a mailto:","                            while (node && !node.test('a')) {node=node.get('parentNode');}","                            // be carefull: do not === /match() with text, that will fail","                            href = node.get('href');","                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';","                            if (isHyperLink) {","                                lastDot = href.lastIndexOf('.');","                                if (lastDot!==-1) {","                                    fileExt = href.substring(lastDot)+'.';","                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);","                                }","                            }","                        }","                        e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);","                    }","                );","            }","//************************************************","","            if (instance.get('grpUndoredo')) {","                instance.addButton(instance.ICON_UNDO, 'undo', true);","                instance.addButton(instance.ICON_REDO, 'redo');","            }","","        },","","        /**","        * Based on YUI2 rich-editor code","        * @private","        * @method _filter_rgb","        * @param String css The CSS string containing rgb(#,#,#);","        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00","        * @return String","        */","        _filter_rgb: function(css) {","            if (css.toLowerCase().indexOf('rgb') != -1) {","                var exp = new RegExp(\"(.*?)rgb\\\\s*?\\\\(\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?\\\\)(.*?)\", \"gi\"),","                    rgb = css.replace(exp, \"$1,$2,$3,$4,$5\").split(','),","                    r, g, b;","            ","                if (rgb.length === 5) {","                    r = parseInt(rgb[1], 10).toString(16);","                    g = parseInt(rgb[2], 10).toString(16);","                    b = parseInt(rgb[3], 10).toString(16);","","                    r = r.length === 1 ? '0' + r : r;","                    g = g.length === 1 ? '0' + g : g;","                    b = b.length === 1 ? '0' + b : b;","","                    css = \"#\" + r + g + b;","                }","            }","            return css;","        },","","        /**********************************************************************************************************************","        ***********************************************************************************************************************","","        FUNCTIONS BELOW REALLY NEED TO BE REDISGNED","        THEY DO NOT WORK WELL","","        ***********************************************************************************************************************","        ***********************************************************************************************************************/","","        /**","        * Defines the execCommand itsaheading","        * @method _defineExecCommandHeader","        * @private","        */","        _defineExecCommandHeader : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsaheading: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef = itsatoolbar._getCursorRef(),","                            activeHeader = itsatoolbar._getActiveHeader(noderef),","                            headingNumber = 0,","                            disableSelectbutton = false,","                            node;","                        if (val==='none') {","                            // want to clear heading","                            if (activeHeader) {","                                activeHeader.replace(\"<span class='\" + ITSA_REFSELECTION + \"'>\"+activeHeader.getHTML()+\"</span>\");","                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox","                                itsatoolbar.headerSelectlist.set('disabled', true);","                            }","                        } else {","                            // want to add or change a heading","                            if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}","                            if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {","                                node = activeHeader ? activeHeader : noderef;","                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches","                                node.replace(\"<\"+val+\" id='\" + editorY.guid() + \"'>\"+node.getHTML()+\"</\"+val+\">\");","                            }","                        }","                        itsatoolbar._setCursorAtRef();","                        // do a toolbarsync, because styles will change.","                        // but do not refresh the heading-selectlist! Therefore e.sender is defined","                        itsatoolbar.sync({sender: 'itsaheading'});","                   }","                });","            }","        },","","        /**","        * Defines the execCommand itsafontsize","        * @method _defineExecCommandFontSize","        * @private","        */","        _defineExecCommandFontSize : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                   itsafontsize: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef = itsatoolbar._getCursorRef(),","                            parentnode,","                            selection = noderef.hasClass(ITSA_REFSELECTION);","                       if (selection) {","                            //We have a selection","                            parentnode = noderef.get('parentNode');","                            if (Y.UA.webkit) {","                                parentnode.setStyle('lineHeight', '');","                            }","                            // first cleaning up old fontsize","                            noderef.all('span').setStyle('fontSize', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);","                            noderef.setStyle('fontSize', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_FONTSIZENODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            // remove the tmp-node placeholder","                            itsatoolbar._removeCursorRef();","                       }","                       else {","//                           itsatoolbar._setCursorAtRef();","                           itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_FONTSIZENODE + \"' style='font-size:\" + val + \"'>\" + ITSA_REFNODE + \"</span>\");","                           itsatoolbar._setCursorAtRef();","                       }","                   }","                });","            }","        },","","        /**","        * Defines the execCommand itsacretaehyperlink","        * @method _defineExecCommandHyperlink","        * @private","        */","        _defineExecCommandHyperlink : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    // val can be:","                    // 'img', 'url', 'video', 'email'","                    itsacreatehyperlink: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter url', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<a href=\"' + url + '\" target=\"_blank\">' + url + '</a>');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacretaeemaillink","        * @method _defineExecCommandMaillink","        * @private","        */","        _defineExecCommandMaillink : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreatemaillink: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            urltext,","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter email', '');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            urltext = url;","                            url = 'mailto:' + url;","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<a href=\"' + url+ '\">' + urltext + '</a>');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacreateimage","        * @method _defineExecCommandImage","        * @private","        */","        _defineExecCommandImage : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreateimage: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter link to image', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<img src=\"' + url + '\" />');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacreateyoutube","        * @method _defineExecCommandYouTube","        * @private","        */","        _defineExecCommandYouTube : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreateyoutube: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter link to image', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                    videoitempos = url.indexOf('watch?v=');","                                    if (videoitempos!==-1) {","                                        videoitem = url.substring(url.videoitempos+8);","                                        execCommandInstance.get('host').execCommand('inserthtml', '<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/' + videoitem + '\" frameborder=\"0\" allowfullscreen></iframe>');","                                    }","                            }","                        }","                        return a;","                    }","                });","            }","        }","","    }, {","        NS : 'itsatoolbar',","        ATTRS : {","","            /**","             * @description Defines whether keyboard-enter will lead to P-tag. Default=false (meaning that BR's will be created)","             * @attribute paraSupport","             * @type Boolean","            */","            paraSupport : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description The sourceNode that holds the Toolbar. Could be an empty DIV.<br>","             * If not defined, than the Toolbar will be created just above the Editor.","             * By specifying the srcNode, one could create the Toolbar on top of the page, regardless of the Editor's position","             * @attribute srcNode","             * @type Y.Node ","            */","            srcNode : {","                value: null,","                writeOnce: 'initOnly',","                setter: function(val) {","                    return Y.one(val);","                },","                validator: function(val) {","                    return Y.one(val);","                }","            },","","            /**","             * @description The size of the buttons<br>","             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>","             * Default = 2","             * @attribute btnSize","             * @type int","            */","            btnSize : {","                value: 2,","                validator: function(val) {","                    return (Lang.isNumber(val) && (val>0) && (val<4));","                }","            },","","            /**","             * @description The amount of headerlevels that can be selected<br>","             * Should be a value from 1-9<br>","             * Default = 6","             * @attribute headerLevels","             * @type int","            */","            headerLevels : {","                value: 6,","                validator: function(val) {","                    return (Lang.isNumber(val) && (val>0) && (val<10));","                }","            },","","            /**","             * @description The fontfamilies that can be selected<br>","             * Should be a value from 1-9<br>","             * @attribute fontFamilies","             * @type Array [String]","            */","            fontFamilies : {","                value: [","                    'Arial',","                    'Arial Black',","                    'Comic Sans MS',","                    'Courier New',","                    'Lucida Console',","                    'Tahoma',","                    'Times New Roman',","                    'Trebuchet MS',","                    'Verdana'","                ],","                validator: function(val) {","                    return (Lang.isArray(val));","                }","            },","","            /**","             * @description Whether the button fontfamily is available<br>","             * Default = true","             * @attribute btnFontfamily","             * @type Boolean","            */","            btnFontfamily : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button fontsize is available<br>","             * Default = true","             * @attribute btnFontsize","             * @type Boolean","            */","            btnFontsize : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button headers is available<br>","             * because this function doesn't work well on all browsers, it is set of by default.<br>","             * Is something to work on in fututr releases. It works within firefox though.","             * Default = false","             * @attribute btnHeader","             * @type Boolean","            */","            btnHeader : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button bold is available<br>","             * Default = true","             * @attribute btnBold","             * @type Boolean","            */","            btnBold : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button italic is available<br>","             * Default = true","             * @attribute btnItalic","             * @type Boolean","            */","            btnItalic : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button underline is available<br>","             * Default = true","             * @attribute btnUnderline","             * @type Boolean","            */","            btnUnderline : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group align is available<br>","             * Default = true","             * @attribute grpAlign","             * @type Boolean","            */","            grpAlign : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button justify is available<br>","             * will only be shown in combination with grpalign","             * Default = true","             * @attribute btnJustify","             * @type Boolean","            */","            btnJustify : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group sub/superscript is available<br>","             * Default = true","             * @attribute grpSubsuper","             * @type Boolean","            */","            grpSubsuper : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button textcolor is available<br>","             * Default = true","             * @attribute btnTextcolor","             * @type Boolean","            */","            btnTextcolor : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button markcolor is available<br>","             * Default = true","             * @attribute btnMarkcolor","             * @type Boolean","            */","            btnMarkcolor : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group indent is available<br>","             * Default = true","             * @attribute grpIndent","             * @type Boolean","            */","            grpIndent : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group lists is available<br>","             * Default = true","             * @attribute grpLists","             * @type Boolean","            */","            grpLists : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","/*","            btnremoveformat : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","            btnhiddenelements : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","*/","","            /**","             * @description Whether the group undo/redo is available<br>","             * Default = true","             * @attribute grpUndoredo","             * @type Boolean","            */","            grpUndoredo : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button email is available<br>","             * Default = true","             * @attribute btnEmail","             * @type Boolean","            */","            btnEmail : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button hyperlink is available<br>","             * Default = true","             * @attribute btnHyperlink","             * @type Boolean","            */","            btnHyperlink : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button image is available<br>","             * because this code needs to be developed in a better way, the function is disabled by default.<br>","             * It works in a simple way though.","             * Default = false","             * @attribute btnImage","             * @type Boolean","            */","            btnImage : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button video is available<br>","             * because this code needs to be developed in a better way, the function is disabled by default.<br>","             * It works in a simple way though. The end-user should enter a youtube-link once they click on this button.","             * Default = false","             * @attribute btnVideo","             * @type Boolean","            */","            btnVideo : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description The colorpallet to use<br>","             * @attribute colorPallet","             * @type Array (String)","            */","            colorPallet : {","                value : [","                    '#111111',","                    '#2D2D2D',","                    '#434343',","                    '#5B5B5B',","                    '#737373',","                    '#8B8B8B',","                    '#A2A2A2',","                    '#B9B9B9',","                    '#000000',","                    '#D0D0D0',","                    '#E6E6E6',","                    '#FFFFFF',","                    '#BFBF00',","                    '#FFFF00',","                    '#FFFF40',","                    '#FFFF80',","                    '#FFFFBF',","                    '#525330',","                    '#898A49',","                    '#AEA945',","                    '#7F7F00',","                    '#C3BE71',","                    '#E0DCAA',","                    '#FCFAE1',","                    '#60BF00',","                    '#80FF00',","                    '#A0FF40',","                    '#C0FF80',","                    '#DFFFBF',","                    '#3B5738',","                    '#668F5A',","                    '#7F9757',","                    '#407F00',","                    '#8A9B55',","                    '#B7C296',","                    '#E6EBD5',","                    '#00BF00',","                    '#00FF80',","                    '#40FFA0',","                    '#80FFC0',","                    '#BFFFDF',","                    '#033D21',","                    '#438059',","                    '#7FA37C',","                    '#007F40',","                    '#8DAE94',","                    '#ACC6B5',","                    '#DDEBE2',","                    '#00BFBF',","                    '#00FFFF',","                    '#40FFFF',","                    '#80FFFF',","                    '#BFFFFF',","                    '#033D3D',","                    '#347D7E',","                    '#609A9F',","                    '#007F7F',","                    '#96BDC4',","                    '#B5D1D7',","                    '#E2F1F4',","                    '#0060BF',","                    '#0080FF',","                    '#40A0FF',","                    '#80C0FF',","                    '#BFDFFF',","                    '#1B2C48',","                    '#385376',","                    '#57708F',","                    '#00407F',","                    '#7792AC',","                    '#A8BED1',","                    '#DEEBF6',","                    '#0000BF',","                    '#0000FF',","                    '#4040FF',","                    '#8080FF',","                    '#BFBFFF',","                    '#212143',","                    '#373E68',","                    '#444F75',","                    '#00007F',","                    '#585E82',","                    '#8687A4',","                    '#D2D1E1',","                    '#6000BF',","                    '#8000FF',","                    '#A040FF',","                    '#C080FF',","                    '#DFBFFF',","                    '#302449',","                    '#54466F',","                    '#655A7F',","                    '#40007F',","                    '#726284',","                    '#9E8FA9',","                    '#DCD1DF',","                    '#BF00BF',","                    '#FF00FF',","                    '#FF40FF',","                    '#FF80FF',","                    '#FFBFFF',","                    '#4A234A',","                    '#794A72',","                    '#936386',","                    '#7F007F',","                    '#9D7292',","                    '#C0A0B6',","                    '#ECDAE5',","                    '#BF005F',","                    '#FF007F',","                    '#FF409F',","                    '#FF80BF',","                    '#FFBFDF',","                    '#451528',","                    '#823857',","                    '#A94A76',","                    '#7F003F',","                    '#BC6F95',","                    '#D8A5BB',","                    '#F7DDE9',","                    '#C00000',","                    '#FF0000',","                    '#FF4040',","                    '#FF8080',","                    '#FFC0C0',","                    '#441415',","                    '#82393C',","                    '#AA4D4E',","                    '#800000',","                    '#BC6E6E',","                    '#D8A3A4',","                    '#F8DDDD',","                    '#BF5F00',","                    '#FF7F00',","                    '#FF9F40',","                    '#FFBF80',","                    '#FFDFBF',","                    '#482C1B',","                    '#855A40',","                    '#B27C51',","                    '#7F3F00',","                    '#C49B71',","                    '#E1C4A8',","                    '#FDEEE0'","                ],","                validator: function(val) {","                    return Lang.isArray(val) ;","                }","","            }","        }","    }",");","","","}, 'gallery-2012.09.12-20-02' ,{requires:['plugin', 'base-build', 'node-base', 'editor', 'event-delegate', 'event-custom', 'cssbutton', 'gallery-itsaselectlist'], skinnable:true});"];
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].lines = {"1":0,"3":0,"24":0,"240":0,"279":0,"280":0,"282":0,"284":0,"288":0,"291":0,"304":0,"305":0,"306":0,"307":0,"308":0,"309":0,"310":0,"311":0,"312":0,"313":0,"316":0,"329":0,"333":0,"334":0,"335":0,"336":0,"337":0,"340":0,"341":0,"343":0,"352":0,"356":0,"358":0,"359":0,"361":0,"362":0,"363":0,"364":0,"376":0,"379":0,"380":0,"381":0,"382":0,"394":0,"398":0,"400":0,"402":0,"412":0,"413":0,"414":0,"415":0,"417":0,"435":0,"438":0,"439":0,"440":0,"441":0,"442":0,"443":0,"444":0,"445":0,"446":0,"449":0,"450":0,"451":0,"452":0,"453":0,"454":0,"476":0,"478":0,"479":0,"480":0,"481":0,"501":0,"503":0,"504":0,"522":0,"529":0,"530":0,"531":0,"532":0,"534":0,"535":0,"536":0,"537":0,"538":0,"539":0,"540":0,"543":0,"574":0,"576":0,"577":0,"578":0,"579":0,"582":0,"584":0,"585":0,"586":0,"588":0,"589":0,"590":0,"591":0,"592":0,"594":0,"595":0,"605":0,"608":0,"609":0,"610":0,"622":0,"627":0,"628":0,"630":0,"631":0,"634":0,"635":0,"637":0,"638":0,"640":0,"641":0,"643":0,"644":0,"646":0,"650":0,"651":0,"653":0,"663":0,"664":0,"665":0,"675":0,"676":0,"677":0,"678":0,"679":0,"680":0,"681":0,"692":0,"695":0,"696":0,"697":0,"699":0,"700":0,"702":0,"703":0,"704":0,"706":0,"718":0,"721":0,"722":0,"723":0,"724":0,"736":0,"738":0,"739":0,"740":0,"752":0,"753":0,"754":0,"765":0,"767":0,"780":0,"788":0,"789":0,"790":0,"791":0,"792":0,"793":0,"794":0,"796":0,"808":0,"820":0,"822":0,"823":0,"824":0,"825":0,"828":0,"829":0,"832":0,"833":0,"834":0,"835":0,"836":0,"838":0,"839":0,"840":0,"841":0,"842":0,"843":0,"844":0,"847":0,"848":0,"849":0,"853":0,"863":0,"873":0,"874":0,"875":0,"876":0,"877":0,"879":0,"880":0,"885":0,"886":0,"891":0,"892":0,"893":0,"894":0,"895":0,"899":0,"904":0,"905":0,"906":0,"907":0,"908":0,"909":0,"914":0,"915":0,"916":0,"917":0,"923":0,"924":0,"925":0,"930":0,"931":0,"932":0,"937":0,"938":0,"939":0,"944":0,"945":0,"951":0,"959":0,"967":0,"972":0,"973":0,"978":0,"982":0,"986":0,"987":0,"988":0,"990":0,"991":0,"996":0,"997":0,"998":0,"999":0,"1000":0,"1001":0,"1003":0,"1004":0,"1007":0,"1012":0,"1013":0,"1014":0,"1015":0,"1016":0,"1017":0,"1019":0,"1020":0,"1023":0,"1028":0,"1029":0,"1030":0,"1034":0,"1035":0,"1036":0,"1038":0,"1040":0,"1041":0,"1043":0,"1048":0,"1049":0,"1050":0,"1055":0,"1056":0,"1058":0,"1060":0,"1062":0,"1067":0,"1068":0,"1069":0,"1079":0,"1080":0,"1082":0,"1084":0,"1085":0,"1086":0,"1087":0,"1088":0,"1089":0,"1090":0,"1094":0,"1099":0,"1100":0,"1101":0,"1106":0,"1107":0,"1108":0,"1115":0,"1116":0,"1119":0,"1122":0,"1128":0,"1138":0,"1139":0,"1141":0,"1143":0,"1144":0,"1145":0,"1146":0,"1147":0,"1148":0,"1149":0,"1153":0,"1159":0,"1160":0,"1161":0,"1175":0,"1176":0,"1180":0,"1181":0,"1182":0,"1183":0,"1185":0,"1186":0,"1187":0,"1189":0,"1192":0,"1210":0,"1211":0,"1213":0,"1221":0,"1223":0,"1224":0,"1226":0,"1230":0,"1231":0,"1232":0,"1234":0,"1237":0,"1240":0,"1254":0,"1255":0,"1257":0,"1263":0,"1265":0,"1266":0,"1267":0,"1270":0,"1272":0,"1273":0,"1275":0,"1277":0,"1279":0,"1283":0,"1284":0,"1297":0,"1298":0,"1302":0,"1311":0,"1312":0,"1313":0,"1314":0,"1315":0,"1316":0,"1317":0,"1318":0,"1319":0,"1320":0,"1321":0,"1323":0,"1324":0,"1325":0,"1327":0,"1328":0,"1329":0,"1330":0,"1336":0,"1339":0,"1351":0,"1352":0,"1354":0,"1364":0,"1365":0,"1366":0,"1367":0,"1368":0,"1369":0,"1370":0,"1371":0,"1372":0,"1373":0,"1374":0,"1375":0,"1376":0,"1378":0,"1379":0,"1380":0,"1382":0,"1383":0,"1384":0,"1385":0,"1391":0,"1394":0,"1406":0,"1407":0,"1409":0,"1418":0,"1419":0,"1420":0,"1421":0,"1422":0,"1423":0,"1424":0,"1425":0,"1426":0,"1427":0,"1428":0,"1430":0,"1431":0,"1432":0,"1434":0,"1435":0,"1436":0,"1437":0,"1443":0,"1446":0,"1458":0,"1459":0,"1461":0,"1470":0,"1471":0,"1472":0,"1473":0,"1474":0,"1475":0,"1476":0,"1477":0,"1478":0,"1479":0,"1480":0,"1482":0,"1483":0,"1484":0,"1486":0,"1487":0,"1488":0,"1489":0,"1495":0,"1496":0,"1497":0,"1498":0,"1502":0,"1520":0,"1535":0,"1538":0,"1552":0,"1566":0,"1589":0,"1602":0,"1615":0,"1630":0,"1643":0,"1656":0,"1669":0,"1682":0,"1696":0,"1709":0,"1722":0,"1735":0,"1748":0,"1761":0,"1788":0,"1801":0,"1814":0,"1829":0,"1844":0,"2001":0};
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].functions = {"initializer:278":0,"_render:303":0,"_getCursorRef:328":0,"(anonymous 2):363":0,"_removeCursorRef:351":0,"_setCursorAtRef:375":0,"_getSelectedNode:393":0,"sync:410":0,"addButton:434":0,"addSyncButton:475":0,"addToggleButton:500":0,"addButtongroup:521":0,"(anonymous 3):578":0,"addSelectlist:573":0,"destructor:604":0,"_renderUI:621":0,"_bindUI:662":0,"_defineCustomExecCommands:674":0,"_handleBtnClick:691":0,"_handleSelectChange:717":0,"_execCommandFromData:735":0,"execCommand:751":0,"_hasSelection:764":0,"_checkInbetweenSelector:779":0,"_getActiveHeader:807":0,"(anonymous 4):879":0,"(anonymous 5):894":0,"(anonymous 6):908":0,"(anonymous 7):924":0,"(anonymous 8):931":0,"(anonymous 9):938":0,"syncFunc:950":0,"syncFunc:958":0,"syncFunc:966":0,"syncFunc:977":0,"(anonymous 10):987":0,"(anonymous 11):990":0,"(anonymous 12):1003":0,"(anonymous 13):1019":0,"(anonymous 14):1035":0,"(anonymous 15):1040":0,"(anonymous 16):1049":0,"(anonymous 17):1068":0,"(anonymous 18):1100":0,"(anonymous 19):1107":0,"(anonymous 20):1121":0,"customFunc:1118":0,"(anonymous 21):1127":0,"_initializeButtons:862":0,"_filter_rgb:1174":0,"itsaheading:1212":0,"_defineExecCommandHeader:1209":0,"itsafontsize:1256":0,"_defineExecCommandFontSize:1251":0,"itsacreatehyperlink:1301":0,"_defineExecCommandHyperlink:1296":0,"itsacreatemaillink:1353":0,"_defineExecCommandMaillink:1350":0,"itsacreateimage:1408":0,"_defineExecCommandImage:1405":0,"itsacreateyoutube:1460":0,"_defineExecCommandYouTube:1457":0,"validator:1519":0,"setter:1534":0,"validator:1537":0,"validator:1551":0,"validator:1565":0,"validator:1588":0,"validator:1601":0,"validator:1614":0,"validator:1629":0,"validator:1642":0,"validator:1655":0,"validator:1668":0,"validator:1681":0,"validator:1695":0,"validator:1708":0,"validator:1721":0,"validator:1734":0,"validator:1747":0,"validator:1760":0,"validator:1787":0,"validator:1800":0,"validator:1813":0,"validator:1828":0,"validator:1843":0,"validator:2000":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].coveredLines = 478;
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].coveredFunctions = 88;
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1);
YUI.add('gallery-itsatoolbar', function(Y) {

_yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 3);
'use strict';

/**
 * The Itsa Selectlist module.
 *
 * @module itsa-toolbar
 */

/**
 * Editor Toolbar Plugin
 * 
 *
 * @class Plugin.ITSAToolbar
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// Local constants
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 24);
var Lang = Y.Lang,
    Node = Y.Node,

    ITSA_BTNNODE = "<button class='yui3-button'></button>",
    ITSA_BTNINNERNODE = "<span class='itsa-button-icon'></span>",
    ITSA_BTNPRESSED = 'yui3-button-active',
    ITSA_BTNACTIVE = 'itsa-button-active',
    ITSA_BTNINDENT = 'itsa-button-indent',
    ITSA_BUTTON = 'itsa-button',
    ITSA_BTNSYNC = 'itsa-syncbutton',
    ITSA_BTNTOGGLE = 'itsa-togglebutton',
    ITSA_BTNGROUP = 'itsa-buttongroup',
    ITSA_BTNCUSTOMFUNC = 'itsa-button-customfunc',
    ITSA_TOOLBAR_TEMPLATE = "<div class='itsatoolbar'></div>",
    ITSA_TOOLBAR_SMALL = 'itsa-buttonsize-small',
    ITSA_TOOLBAR_MEDIUM = 'itsa-buttonsize-medium',
    ITSA_CLASSEDITORPART = 'itsatoolbar-editorpart',
    ITSA_SELECTCONTNODE = '<div></div>',
    ITSA_REFNODE = "<span id='itsatoolbar-ref'></span>",
    ITSA_REFSELECTION = 'itsa-selection-tmp',
    ITSA_FONTSIZENODE = 'itsa-fontsize';

// -- Public Static Properties -------------------------------------------------

/**
 * Reference to the editor's instance
 * @property editor
 * @type Y.EditorBase instance
 */

/**
 * Reference to the Y-instance of the host-editor
 * @property editorY
 * @type YUI-instance
 */

/**
 * Reference to the editor's iframe-node
 * @property editorNode
 * @type Y.Node
 */

/**
 * Reference to the editor's container-node, in which the host-editor is rendered.<br>
 * This is in fact editorNode.get('parentNode')
 * @property containerNode
 * @type Y.Node
 */

/**
 * Reference to the toolbar-node.<br>
 * @property toolbarNode
 * @type Y.Node
 */

/**
 * Used internally to check if the toolbar should still be rendered after the editor is rendered<br>
 * To prevent rendering while it is already unplugged
 * @property _destroyed
 * @type Boolean
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_BOLD
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ITALIC
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_UNDERLINE
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_LEFT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_CENTER
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_RIGHT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ALIGN_JUSTIFY
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_SUBSCRIPT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_SUPERSCRIPT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_TEXTCOLOR
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_MARKCOLOR
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_INDENT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_OUTDENT
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_UNORDEREDLIST
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_ORDEREDLIST
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_UNDO
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_REDO
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_EMAIL
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_HYPERLINK
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_IMAGE
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_FILE
 * @type String
 */

/**
 * Can be used as iconClass within buttondefinition
 * @static
 * @property ICON_VIDEO
 * @type String
 */

_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 240);
Y.namespace('Plugin').ITSAToolbar = Y.Base.create('itsatoolbar', Y.Plugin.Base, [], {

        editor : null,
        editorY : null,
        editorNode : null,
        containerNode : null,
        toolbarNode : null,
        _destroyed : false,

        ICON_BOLD : 'itsa-icon-bold',
        ICON_ITALIC : 'itsa-icon-italic',
        ICON_UNDERLINE : 'itsa-icon-underline',
        ICON_ALIGN_LEFT : 'itsa-icon-alignleft',
        ICON_ALIGN_CENTER : 'itsa-icon-aligncenter',
        ICON_ALIGN_RIGHT : 'itsa-icon-alignright',
        ICON_ALIGN_JUSTIFY : 'itsa-icon-alignjustify',
        ICON_SUBSCRIPT : 'itsa-icon-subscript',
        ICON_SUPERSCRIPT : 'itsa-icon-superscript',
        ICON_TEXTCOLOR : 'itsa-icon-textcolor',
        ICON_MARKCOLOR : 'itsa-icon-markcolor',
        ICON_INDENT : 'itsa-icon-indent',
        ICON_OUTDENT : 'itsa-icon-outdent',
        ICON_UNORDEREDLIST : 'itsa-icon-unorderedlist',
        ICON_ORDEREDLIST : 'itsa-icon-orderedlist',
        ICON_UNDO : 'itsa-icon-undo',
        ICON_REDO : 'itsa-icon-redo',
        ICON_EMAIL : 'itsa-icon-email',
        ICON_HYPERLINK : 'itsa-icon-hyperlink',
        ICON_IMAGE : 'itsa-icon-image',
        ICON_FILE : 'itsa-icon-file',
        ICON_VIDEO : 'itsa-icon-video',
        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @param {Object} config The config-object.
         * @protected
        */
        initializer : function(config) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "initializer", 278);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 279);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 280);
instance.editor = instance.get('host');
            // need to make sure we can use execCommand, so do not render before the frame exists.
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 282);
if (instance.editor.frame && instance.editor.frame.get('node')) {instance._render();}
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 284);
if (Y.UA.ie>0) {
                    // didn't find out yet: IE stops creating the editorinstance when pluggedin too soon!
                    // GOTTA check out
                    // at the time being: delaying
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 288);
Y.later(250, instance, instance._render);
                }
                else {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 291);
instance.editor.on('frame:ready', instance._render, instance);
                }
            }
        },

        /**
         * Establishes the initial DOM for the toolbar. This method ia automaticly invoked once during initialisation.
         * It will invoke renderUI, bindUI and syncUI, just as within a widget.
         *
         * @method _render
         * @private
        */
        _render : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_render", 303);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 304);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 305);
if (!instance._destroyed) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 306);
instance.editorY = instance.editor.getInstance();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 307);
instance.editorNode = instance.editor.frame.get('node');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 308);
instance.containerNode = instance.editorNode.get('parentNode');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 309);
instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 310);
instance.editor.plug(Y.Plugin.ExecCommand);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 311);
instance._defineCustomExecCommands();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 312);
instance._renderUI();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 313);
instance._bindUI();
                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object
                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 316);
instance.editor.frame.focus(Y.bind(instance.sync, instance));
            }
        },

        /**
         * Returns node at cursorposition<br>
         * This can be a selectionnode, or -in case of no selection- a new tmp-node (empty span) that will be created to serve as reference.
         * In case of selection, there will always be made a tmp-node as placeholder. But in that case, the tmp-node will be just before the returned node.
         * @method _getCursorRef
         * @private
         * @returns {Y.Node} created empty referencenode
        */
        _getCursorRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getCursorRef", 328);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 329);
var instance = this,
                node;
            // insert cursor and use that node as the selected node
            // first remove previous
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 333);
instance._removeCursorRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 334);
node = instance._getSelectedNode();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 335);
if (node) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 336);
node.addClass(ITSA_REFSELECTION);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 337);
instance.editorY.one('body').insertBefore(ITSA_REFNODE, node);
            }
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 340);
instance.editor.exec.command('inserthtml', ITSA_REFNODE);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 341);
node = instance.editorY.one('#itsatoolbar-ref');
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 343);
return node;
        },

        /**
         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef
         * @method _removeCursorRef
         * @private
        */
        _removeCursorRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_removeCursorRef", 351);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 352);
var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 356);
useY = instance.editorY ? instance.editorY : Y;
            // first cleanup single referencenode
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 358);
node = useY.all('#itsatoolbar-ref');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 359);
if (node) {node.remove();}
            // next clean up aal selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 361);
node = useY.all('.' + ITSA_REFSELECTION)
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 362);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 363);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 2)", 363);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 364);
node.replace(node.getHTML());
                });
            }
        },

        /**
         * Sets the real editorcursor at the position of the tmp-node created by _getCursorRef<br>
         * Removes the cursor tmp-node afterward.
         * @method _setCursorAtRef
         * @private
        */
        _setCursorAtRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_setCursorAtRef", 375);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 376);
var instance = this,
                sel,
                node = instance.editorY.one('#itsatoolbar-ref');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 379);
if (node) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 380);
sel = new instance.editorY.EditorSelection();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 381);
sel.selectNode(node);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 382);
instance._removeCursorRef();
            }
        },

        /**
         * Gets the selection<br>
         * returns null when no selection is made.
         * @method _getSelectedNode
         * @private
         * @returns {Y.Node} selection-node
        */
        _getSelectedNode : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getSelectedNode", 393);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 394);
var instance = this,
                node = null,
                sel = new instance.editorY.EditorSelection(),
                out = sel.getSelected();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 398);
if (!sel.isCollapsed && out.size()) {
                // We have a selection
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 400);
node = out.item(0);
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 402);
return node;
        },

        /**
         * Syncs the toolbar's status with the editor.<br>
         * @method sync
         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.
        */
        sync : function(e) {
            // syncUI will sync the toolbarstatus with the editors cursorposition
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "sync", 410);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 412);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 413);
if (!e || !e.changedNode) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 414);
e = {changedNode: instance._getCursorRef()};
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 415);
Y.later(500, instance, instance._removeCursorRef);
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 417);
instance.toolbarNode.fire('itsatoolbar:statusChange', e);
        },

        /**
         * Creates a new Button on the Toolbar. By default at the end of the toolbar.
         * @method addButton
         * @param {String} iconClass Defines the icon's look. Refer to the general moduledescription for a list with available classes.
         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>
         * when execCommand consists of a command and a value, or you want a custom Function to be executed, you must supply an object:<br>
         * <i>- [command]</i> (String): the execcommand<br>
         * <i>- [value]</i> (String): additional value
         * <i>- [customFunc]</i> (Function): reference to custom function: typicaly, this function will call editorinstance.itstoolbar.execCommand() by itsself
         * <i>- [context]]</i> (instance): the context for customFunc
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.Node} reference to the created buttonnode
        */
        addButton : function(iconClass, execCommand, indent, position) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addButton", 434);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 435);
var instance = this,
                buttonNode,
                buttonInnerNode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 438);
buttonNode = Node.create(ITSA_BTNNODE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 439);
buttonNode.addClass(ITSA_BUTTON);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 440);
if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
            else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 441);
if (Lang.isObject(execCommand)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 442);
if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 443);
if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 444);
if (Lang.isFunction(execCommand.customFunc)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 445);
buttonNode.addClass(ITSA_BTNCUSTOMFUNC);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 446);
buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);
                }
            }}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 449);
if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 450);
buttonInnerNode = Node.create(ITSA_BTNINNERNODE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 451);
buttonInnerNode.addClass(iconClass);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 452);
buttonNode.append(buttonInnerNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 453);
instance.toolbarNode.append(buttonNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 454);
return buttonNode;
        },

        /**
         * Creates a new syncButton on the Toolbar. By default at the end of the toolbar.<br>
         * A syncButton is just like a normal toolbarButton, with the exception that the editor can sync it's status, which cannot be done with a normal button. 
         * Typically used in situations like a hyperlinkbutton: it never stays pressed, but when the cursos is on a hyperlink, he buttons look will change.
         * @method addSyncButton
         * @param {String} iconClass Defines the icon's look. Refer static Properties for some predefined classes like ICON_BOLD.
         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>
         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>
         * <i>- command</i> (String): the execcommand<br>
         * <i>- value</i> (String): additional value
         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.
         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.
         * This function should handle the responseaction to be taken.
         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.Node} reference to the created buttonnode
        */
        addSyncButton : function(iconClass, execCommand, syncFunc, context, indent, position, isToggleButton) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addSyncButton", 475);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 476);
var instance = this,
                buttonNode = instance.addButton(iconClass, execCommand, indent, position);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 478);
if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 479);
instance.toolbarNode.addTarget(buttonNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 480);
if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(syncFunc, context || instance));}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 481);
return buttonNode;
        },

        /**
         * Creates a new toggleButton on the Toolbar. By default at the end of the toolbar.
         * @method addToggleButton
         * @param {String} iconClass Defines the icon's look. Refer static Properties for some predefined classes like ICON_BOLD.
         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>
         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>
         * <i>- command</i> (String): the execcommand<br>
         * <i>- value</i> (String): additional value
         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.
         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.
         * This function should handle the responseaction to be taken.
         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.Node} reference to the created buttonnode
        */
        addToggleButton : function(iconClass, execCommand, syncFunc, context, indent, position) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addToggleButton", 500);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 501);
var instance = this,
                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 503);
buttonNode.addClass(ITSA_BTNTOGGLE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 504);
return buttonNode;
        },

        /**
         * Creates a group of toggleButtons on the Toolbar which are related to each-other. For instance when you might need 3 related buttons: leftalign, center, rightalign.
         * Position is by default at the end of the toolbar.<br>
         * @method addButtongroup
         * @param {Array} buttons Should consist of objects with two fields:<br>
         * <i>- iconClass</i> (String): defines the icon's look. Refer static Properties for some predefined classes like ICON_BOLD.
         * <i>- command</i> (String): the execcommand that will be executed on buttonclick
         * <i>- [value]</i> (String) optional: additional value for the execcommand
         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton)
         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.Node} reference to the first buttonnode of the created buttongroup
        */
        addButtongroup : function(buttons, indent, position) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addButtongroup", 521);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 522);
var instance = this,
                buttonGroup = Y.guid(),
                button,
                buttonNode,
                returnNode = null,
                execCommand,
                i;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 529);
for (i=0; i<buttons.length; i++) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 530);
button = buttons[i];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 531);
if (button.iconClass && button.command) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 532);
if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}
                    else {execCommand = button.command;}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 534);
buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position) ? position+i : null);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 535);
buttonNode.addClass(ITSA_BTNGROUP);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 536);
buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 537);
buttonNode.setData('buttongroup', buttonGroup);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 538);
instance.toolbarNode.addTarget(buttonNode);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 539);
if (Lang.isFunction(button.syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(button.syncFunc, button.context || instance));}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 540);
if (!returnNode) {returnNode = buttonNode;}
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 543);
return returnNode;
        },

        /**
         * Creates a selectList on the Toolbar. By default at the end of the toolbar.
         * When fired, the event-object returnes with 2 fields:<br>
         * <i>- e.value</i>: value of selected item<br>
         * <i>- e.index</i>: indexnr of the selected item
         * @method addSelectList
         * @param {Array} items contains all the items. Should be either a list of (String), or a list of (Objects). In case of an Object-list, the objects should contain two fields:<br>
         * <i>- text</i> (String): the text shown in the selectlist<br>
         * <i>- returnValue</i> (String): the returnvalue of e.value<br>
         * In case a String-list is supplied, e.value will equal to the selected String-item (returnvalue==text)

         * @param {String | Object} execCommand ExecCommand that will be executed after a selectChange-event is fired. e.value will be placed as the second argument in editor.execCommand().<br>
         * You could provide a second 'restoreCommand', in case you need a different execCommand to erase some format. In that case you must supply an object with three fields:<br>
         * <i>- command</i> (String): the standard execcommand<br>
         * <i>- restoreCommand</i> (String): the execcommand that will be executed in case e.value equals the restore-value<br>
         * <i>- restoreValue</i> (String): when e.value equals restoreValue, restoreCommand will be used instead of the standard command


         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.
         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Object} [config] Object that will be passed into the selectinstance. Has with the following fields:<br>
         * <i>- listAlignRight</i> (Boolean): whether to rightalign the listitems. Default=false<br>
         * <i>- hideSelected</i> (Boolean): whether the selected item is hidden from the list. Default=false
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.ITSASelectlist} reference to the created object
        */
        addSelectlist : function(items, execCommand, syncFunc, context, indent, config, position) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addSelectlist", 573);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 574);
var instance = this,
                selectlist;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 576);
config = Y.merge(config, {items: items, defaultButtonText: ''});
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 577);
selectlist = new Y.ITSASelectList(config);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 578);
selectlist.after('render', function(e, execCommand, syncFunc, context, indent){
                _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 3)", 578);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 579);
var instance = this,
                    selectlist = e.currentTarget,
                    buttonNode = selectlist.buttonNode;
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 582);
if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
                else {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 584);
if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}                    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 585);
if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}                    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 586);
if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}                    
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 588);
if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 589);
instance.toolbarNode.addTarget(buttonNode);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 590);
selectlist.on('selectChange', instance._handleSelectChange, instance);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 591);
if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.rbind(syncFunc, context || instance));}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 592);
instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);
            }, instance, execCommand, syncFunc, context, indent);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 594);
selectlist.render(instance.toolbarNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 595);
return selectlist;
        },


        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
        */
        destructor : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "destructor", 604);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 605);
var instance = this,
                srcNode = instance.get('srcNode');
             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 608);
instance._destroyed = true;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 609);
instance._removeCursorRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 610);
if (instance.toolbarNode) {instance.toolbarNode.remove(true);}
        },

        // -- Private Methods ----------------------------------------------------------

        /**
         * Creates the toolbar in the DOM. Toolbar will appear just above the editor, or -when scrNode is defined-  it will be prepended within srcNode 
         *
         * @method _renderUI
         * @private
        */
        _renderUI : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_renderUI", 621);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 622);
var instance = this,
                correctedHeight = 0,
                srcNode = instance.get('srcNode'),
                btnSize = instance.get('btnSize');
            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 627);
instance.toolbarNode = Node.create(ITSA_TOOLBAR_TEMPLATE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 628);
if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}
            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 630);
if (srcNode) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 631);
srcNode.prepend(instance.toolbarNode);
            }
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 634);
instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 635);
switch (instance.get('btnSize')) {
                    case 1:
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 637);
correctedHeight = -40;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 638);
break;
                    case 2: 
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 640);
correctedHeight = -44;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 641);
break;
                    case 3: 
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 643);
correctedHeight = -46;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 644);
break;
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 646);
correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 650);
instance.editorNode.set('height', correctedHeight);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 651);
instance.editorNode.insert(instance.toolbarNode, 'before');
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 653);
instance._initializeButtons();
        },
        
        /**
         * Binds events when there is a cursorstatus changes in the editor
         *
         * @method _bindUI
         * @private
        */
        _bindUI : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_bindUI", 662);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 663);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 664);
instance.editor.on('nodeChange', instance.sync, instance);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 665);
instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance);
        },

        /**
         * Defines all custom execCommands
         *
         * @method _defineCustomExecCommands
         * @private
        */
        _defineCustomExecCommands : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineCustomExecCommands", 674);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 675);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 676);
instance._defineExecCommandHeader();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 677);
instance._defineExecCommandFontSize();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 678);
instance._defineExecCommandHyperlink();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 679);
instance._defineExecCommandMaillink();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 680);
instance._defineExecCommandImage();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 681);
instance._defineExecCommandYouTube();
        },

        /**
         * Handling the buttonclicks for all buttons on the Toolbar within one eventhandler (delegated by the Toolbar-node)
         *
         * @method _bindUI
         * @private
         * @param {EventFacade} e in case of selectList, e.value and e.index are also available
        */
        _handleBtnClick : function(e) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_handleBtnClick", 691);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 692);
var instance = this,
                node = e.currentTarget;
            // only execute for .itsa-button, not for all buttontags    
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 695);
if (node.hasClass(ITSA_BUTTON)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 696);
if (node.hasClass(ITSA_BTNTOGGLE)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 697);
node.toggleClass(ITSA_BTNPRESSED);
                }
                else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 699);
if (node.hasClass(ITSA_BTNSYNC)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 700);
node.toggleClass(ITSA_BTNACTIVE, true);
                }
                else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 702);
if (node.hasClass(ITSA_BTNGROUP)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 703);
instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 704);
node.toggleClass(ITSA_BTNPRESSED, true);
                }}}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 706);
if (!node.hasClass(ITSA_BTNCUSTOMFUNC)) {instance._execCommandFromData(node);}
            }
        },

        /**
         * Handling the selectChange event of a selectButton
         *
         * @method _handleSelectChange
         * @private
         * @param {EventFacade} e in case of selectList, e.value and e.index are also available
        */
        _handleSelectChange : function(e) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_handleSelectChange", 717);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 718);
var selectButtonNode,
                restoreCommand,
                execCommand;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 721);
selectButtonNode = e.currentTarget.buttonNode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 722);
restoreCommand = selectButtonNode.getData('restoreCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 723);
execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 724);
this.execCommand(execCommand, e.value);
        },

        /**
         * Executes this.editor.exec.command with the execCommand and value that is bound to the node through Node.setData('execCommand') and Node.setData('execValue'). <br>
         * these values are bound during definition of addButton(), addSyncButton(), addToggleButton etc.
         *
         * @method _execCommandFromData
         * @private
         * @param {EventFacade} e in case of selectList, e.value and e.index are also available
        */
        _execCommandFromData: function(buttonNode) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_execCommandFromData", 735);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 736);
var execCommand,
                execValue;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 738);
execCommand = buttonNode.getData('execCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 739);
execValue = buttonNode.getData('execValue');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 740);
this.execCommand(execCommand, execValue);
        },

        /**
         * Performs a execCommand that will take into account the editors cursorposition<br>
         * This means that when no selection is made, the operation still works: you can preset an command this way.
         *
         * @method execCommand
         * @param {String} command The execCommand
         * @param {String} [value] additional commandvalue
        */
        execCommand: function(command, value) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "execCommand", 751);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 752);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 753);
instance.editor.focus();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 754);
instance.editor.exec.command(command, value);
        },

        /**
         * Checks whether there is a selection within the editor<br>
         *
         * @method _hasSelection
         * @private
         * @returns {Boolean} whether there is a selection
        */
        _hasSelection : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_hasSelection", 764);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 765);
var instance = this,
                sel = new instance.editorY.EditorSelection();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 767);
return (!sel.isCollapsed  && sel.anchorNode);
        },

        /**
         * Checks whether the cursor is inbetween a selector. For instance to check if cursor is inbetween a h1-selector
         *
         * @method _checkInbetweenSelector
         * @private
         * @param {String} selector The selector to check for
         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection
         * @returns {Boolean} whether node resides inbetween selector
        */
        _checkInbetweenSelector : function(selector, cursornode) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_checkInbetweenSelector", 779);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 780);
var instance = this,
                pattern = '<\\s*' + selector + '[^>]*>(.*?)<\\s*/\\s*' + selector  + '>',
                searchHeaderPattern = new RegExp(pattern, 'gi'),
                fragment,
                inbetween = false,
                refContent = instance.editorY.one('body').getHTML(),
                nodewrap,
                cursorindex;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 788);
nodewrap = Node.create('<div></div>');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 789);
nodewrap.append(cursornode.cloneNode(true));
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 790);
cursorindex = refContent.indexOf(nodewrap.getHTML());
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 791);
fragment = searchHeaderPattern.exec(refContent);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 792);
while ((fragment !== null) && !inbetween) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 793);
inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 794);
fragment = searchHeaderPattern.exec(refContent); // next search
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 796);
return inbetween;
        },

        /**
         * Finds the headernode where the cursor, or selection remains in
         *
         * @method _getActiveHeader
         * @private
         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection. Can be supplied by e.changedNode, or left empty to make this function determine itself.
         * @returns {Y.Node|null} the headernode where the cursor remains. Returns null if outside any header.
        */
     _getActiveHeader : function(cursornode) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getActiveHeader", 807);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 808);
var instance = this,
                pattern,
                searchHeaderPattern,
                fragment,
                nodeFound,
                nodewrap,
                nodetag,
                headingNumber = 0,
                returnNode = null,
                checkNode,
                endpos,
                refContent;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 820);
if (cursornode) {    
                // node can be a header right away, or it can be a node within a header. Check for both
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 822);
nodetag = cursornode.get('tagName');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 823);
if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 824);
if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 825);
returnNode = cursornode;
                }
                else {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 828);
nodewrap = Node.create('<div></div>');
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 829);
nodewrap.append(cursornode.cloneNode(true));
                    // first look for endtag, to determine which headerlevel to search for
//                    pattern = '<\\s*h\\d[^>]*>(.*?)' + nodewrap.getHTML() + '(.*?)<\\s*/\\s*h\\d>';
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 832);
pattern = nodewrap.getHTML() + '(.*?)<\\s*/\\s*h\\d>';
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 833);
searchHeaderPattern = new RegExp(pattern, 'gi');
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 834);
refContent = instance.editorY.one('body').getHTML();
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 835);
fragment = searchHeaderPattern.exec(refContent);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 836);
if (fragment !== null) {
                        // search again, looking for the right headernumber
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 838);
endpos = fragment.index+fragment[0].length-1;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 839);
headingNumber = refContent.substring(endpos-1, endpos);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 840);
pattern = '<\\s*h' + headingNumber + '[^>]*>(.*?)' + nodewrap.getHTML() + '(.*?)<\\s*/\\s*h' + headingNumber + '>';
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 841);
searchHeaderPattern = new RegExp(pattern, 'gi');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 842);
fragment = searchHeaderPattern.exec(refContent); // next search
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 843);
if (fragment !== null) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 844);
nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);
                        }
                    }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 847);
if (nodeFound) {
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 848);
checkNode = Node.create(nodeFound);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 849);
returnNode = instance.editorY.one('#' + checkNode.get('id'));
                    }
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 853);
return returnNode;
        },

        /**
         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.
         *
         * @method _initializeButtons
         * @private
        */
        _initializeButtons : function() { 
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_initializeButtons", 862);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 863);
var instance = this,
                i, r, g, b,
                item,
                items,
                bgcolor,
                docFontSize,
                bgcolors,
                buttons;

            // create fonffamily button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 873);
if (instance.get('btnFontfamily')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 874);
items = instance.get('fontFamilies');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 875);
for (i=0; i<items.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 876);
item = items[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 877);
items[i] = {text: "<span style='font-family:"+item+"'>"+item+"</span>", returnValue: item};
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 879);
instance.fontSelectlist = instance.addSelectlist(items, 'fontname2', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 4)", 879);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 880);
var familyList = e.changedNode.getStyle('fontFamily'),
                        familyListArray = familyList.split(','),
                        activeFamily = familyListArray[0];
                    // some browsers place '' surround the string, when it should contain whitespaces.
                    // first remove them
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 885);
if (activeFamily.substring(0,1)==="'") {activeFamily = activeFamily.substring(1, activeFamily.length-1);}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 886);
this.fontSelectlist.selectItemByValue(activeFamily, true, true);
                }, null, true, {buttonWidth: 145});
            }

            // create fontsize button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 891);
if (instance.get('btnFontsize')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 892);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 893);
for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 894);
instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 5)", 894);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 895);
var fontSize = e.changedNode.getStyle('fontSize'),
                        fontSizeNumber = parseFloat(fontSize),
                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);
                    // make sure not to display partial numbers    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 899);
this.sizeSelectlist.selectItemByValue(Math.round(fontSizeNumber)+fontsizeExt, true);
                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});
            }

            // create header button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 904);
if (instance.get('btnHeader')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 905);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 906);
items.push({text: 'No header', returnValue: 'none'});
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 907);
for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 908);
instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 6)", 908);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 909);
var instance = this,
                        node = e.changedNode,
                        internalcall = (e.sender && e.sender==='itsaheading'),
                        activeHeader;
                    // prevent update when sync is called after heading has made changes. Check this through e.sender
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 914);
if (!internalcall) {
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 915);
activeHeader = instance._getActiveHeader(node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 916);
instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 917);
instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());
                    }
                }, null, true, {buttonWidth: 96});
            }

            // create bold button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 923);
if (instance.get('btnBold')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 924);
instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 7)", 924);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 925);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontWeight')==='bold'));
                }, null, true);
            }

            // create italic button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 930);
if (instance.get('btnItalic')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 931);
instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 8)", 931);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 932);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));
                });
            }

            // create underline button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 937);
if (instance.get('btnUnderline')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 938);
instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 9)", 938);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 939);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));
                });
            }

            // create align buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 944);
if (instance.get('grpAlign')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 945);
buttons = [
                    {
                        iconClass : instance.ICON_ALIGN_LEFT,
                        command : 'JustifyLeft',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 950);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 951);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_CENTER,
                        command : 'JustifyCenter',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 958);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 959);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_RIGHT,
                        command : 'JustifyRight',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 966);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 967);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));
                                    }
                    }
                ];
            // create justify button
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 972);
if (instance.get('btnJustify')) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 973);
buttons.push({
                        iconClass : instance.ICON_ALIGN_JUSTIFY,
                        command : 'JustifyFull',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 977);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 978);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));
                                    }
                    });
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 982);
instance.addButtongroup(buttons, true);
            }

            // create subsuperscript buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 986);
if (instance.get('grpSubsuper')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 987);
instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 10)", 987);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 988);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));
                }, null, true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 990);
instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 11)", 990);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 991);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));
                });
            }

            // create textcolor button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 996);
if (instance.get('btnTextcolor')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 997);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 998);
bgcolors = instance.get('colorPallet');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 999);
for (i=0; i<bgcolors.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1000);
bgcolor = bgcolors[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1001);
items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1003);
instance.colorSelectlist = instance.addSelectlist(items, 'forecolor', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 12)", 1003);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1004);
var instance = this,
                        styleColor = e.changedNode.getStyle('color'),
                        hexColor = instance._filter_rgb(styleColor);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1007);
instance.colorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});
            }

            // create markcolor button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1012);
if (instance.get('btnMarkcolor')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1013);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1014);
bgcolors = instance.get('colorPallet');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1015);
for (i=0; i<bgcolors.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1016);
bgcolor = bgcolors[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1017);
items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1019);
instance.markcolorSelectlist = instance.addSelectlist(items, 'hilitecolor', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 13)", 1019);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1020);
var instance = this,
                        styleColor = e.changedNode.getStyle('backgroundColor'),
                        hexColor = instance._filter_rgb(styleColor);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1023);
instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});
            }

            // create indent buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1028);
if (instance.get('grpIndent')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1029);
instance.addButton(instance.ICON_INDENT, 'indent', true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1030);
instance.addButton(instance.ICON_OUTDENT, 'outdent');
            }

            // create list buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1034);
if (instance.get('grpLists')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1035);
instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 14)", 1035);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1036);
var instance = this,
                        node = e.changedNode;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1038);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));
                }, null, true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1040);
instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 15)", 1040);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1041);
var instance = this,
                        node = e.changedNode;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1043);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));
                });
            }

            // create email button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1048);
if (instance.get('btnEmail')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1049);
instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 16)", 1049);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1050);
var instance = this,
                        node = e.changedNode,
                        nodePosition,
                        isLink,
                        isEmailLink;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1055);
isLink =  instance._checkInbetweenSelector('a', node);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1056);
if (isLink) {
                        // check if its a normal href or a mailto:
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1058);
while (node && !node.test('a')) {node=node.get('parentNode');}
                        // be carefull: do not === /match() with text, that will fail
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1060);
isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');
                    }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1062);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));
                }, null, true);
            }

            // create hyperlink button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1067);
if (instance.get('btnHyperlink')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1068);
instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 17)", 1068);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1069);
var instance = this,
                        posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',
                        node = e.changedNode,
                        nodePosition,
                        isLink,
                        isFileLink = false,
                        href,
                        lastDot,
                        fileExt,
                        isHyperLink;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1079);
isLink =  instance._checkInbetweenSelector('a', node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1080);
if (isLink) {
                            // check if its a normal href or a mailto:
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1082);
while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1084);
href = node.get('href');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1085);
isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1086);
if (isHyperLink) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1087);
lastDot = href.lastIndexOf('.');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1088);
if (lastDot!==-1) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1089);
fileExt = href.substring(lastDot)+'.';
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1090);
isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1094);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));
                });
            }

            // create image button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1099);
if (instance.get('btnImage')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1100);
instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 18)", 1100);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1101);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));
                });
            }

            // create video button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1106);
if (instance.get('btnVideo')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1107);
instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 19)", 1107);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1108);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('iframe')));
                });
            }

//************************************************
// just for temporary local use ITS Asbreuk
// should NOT be part of the gallery
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1115);
if (false) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1116);
instance.addSyncButton(
                    instance.ICON_FILE,
                    {   customFunc: function(e) {
                            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "customFunc", 1118);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1119);
Y.config.cmas2plus.uploader.show(
                                null, 
                                Y.bind(function(e) {
                                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 20)", 1121);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1122);
this.editor.execCommand('itsacreatehyperlink', 'http://files.brongegevens.nl/' + Y.config.cmas2plusdomain + '/' + e.n);
                                }, this)
                            );
                        }
                    },
                    function(e) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 21)", 1127);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1128);
var instance = this,
                            posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',
                            node = e.changedNode,
                            nodePosition,
                            isFileLink = false,
                            isLink,
                            href,
                            lastDot,
                            fileExt,
                            isHyperLink;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1138);
isLink =  instance._checkInbetweenSelector('a', node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1139);
if (isLink) {
                            // check if its a normal href or a mailto:
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1141);
while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1143);
href = node.get('href');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1144);
isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1145);
if (isHyperLink) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1146);
lastDot = href.lastIndexOf('.');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1147);
if (lastDot!==-1) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1148);
fileExt = href.substring(lastDot)+'.';
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1149);
isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1153);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);
                    }
                );
            }
//************************************************

            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1159);
if (instance.get('grpUndoredo')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1160);
instance.addButton(instance.ICON_UNDO, 'undo', true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1161);
instance.addButton(instance.ICON_REDO, 'redo');
            }

        },

        /**
        * Based on YUI2 rich-editor code
        * @private
        * @method _filter_rgb
        * @param String css The CSS string containing rgb(#,#,#);
        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00
        * @return String
        */
        _filter_rgb: function(css) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_filter_rgb", 1174);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1175);
if (css.toLowerCase().indexOf('rgb') != -1) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1176);
var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi"),
                    rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(','),
                    r, g, b;
            
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1180);
if (rgb.length === 5) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1181);
r = parseInt(rgb[1], 10).toString(16);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1182);
g = parseInt(rgb[2], 10).toString(16);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1183);
b = parseInt(rgb[3], 10).toString(16);

                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1185);
r = r.length === 1 ? '0' + r : r;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1186);
g = g.length === 1 ? '0' + g : g;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1187);
b = b.length === 1 ? '0' + b : b;

                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1189);
css = "#" + r + g + b;
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1192);
return css;
        },

        /**********************************************************************************************************************
        ***********************************************************************************************************************

        FUNCTIONS BELOW REALLY NEED TO BE REDISGNED
        THEY DO NOT WORK WELL

        ***********************************************************************************************************************
        ***********************************************************************************************************************/

        /**
        * Defines the execCommand itsaheading
        * @method _defineExecCommandHeader
        * @private
        */
        _defineExecCommandHeader : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandHeader", 1209);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1210);
if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1211);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsaheading: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsaheading", 1212);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1213);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef = itsatoolbar._getCursorRef(),
                            activeHeader = itsatoolbar._getActiveHeader(noderef),
                            headingNumber = 0,
                            disableSelectbutton = false,
                            node;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1221);
if (val==='none') {
                            // want to clear heading
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1223);
if (activeHeader) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1224);
activeHeader.replace("<span class='" + ITSA_REFSELECTION + "'>"+activeHeader.getHTML()+"</span>");
                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1226);
itsatoolbar.headerSelectlist.set('disabled', true);
                            }
                        } else {
                            // want to add or change a heading
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1230);
if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1231);
if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1232);
node = activeHeader ? activeHeader : noderef;
                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1234);
node.replace("<"+val+" id='" + editorY.guid() + "'>"+node.getHTML()+"</"+val+">");
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1237);
itsatoolbar._setCursorAtRef();
                        // do a toolbarsync, because styles will change.
                        // but do not refresh the heading-selectlist! Therefore e.sender is defined
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1240);
itsatoolbar.sync({sender: 'itsaheading'});
                   }
                });
            }
        },

        /**
        * Defines the execCommand itsafontsize
        * @method _defineExecCommandFontSize
        * @private
        */
        _defineExecCommandFontSize : function() {
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandFontSize", 1251);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1254);
if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1255);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                   itsafontsize: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsafontsize", 1256);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1257);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef = itsatoolbar._getCursorRef(),
                            parentnode,
                            selection = noderef.hasClass(ITSA_REFSELECTION);
                       _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1263);
if (selection) {
                            //We have a selection
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1265);
parentnode = noderef.get('parentNode');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1266);
if (Y.UA.webkit) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1267);
parentnode.setStyle('lineHeight', '');
                            }
                            // first cleaning up old fontsize
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1270);
noderef.all('span').setStyle('fontSize', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1272);
noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1273);
noderef.setStyle('fontSize', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1275);
noderef.addClass(ITSA_FONTSIZENODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1277);
noderef.removeClass(ITSA_REFSELECTION);
                            // remove the tmp-node placeholder
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1279);
itsatoolbar._removeCursorRef();
                       }
                       else {
//                           itsatoolbar._setCursorAtRef();
                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1283);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTSIZENODE + "' style='font-size:" + val + "'>" + ITSA_REFNODE + "</span>");
                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1284);
itsatoolbar._setCursorAtRef();
                       }
                   }
                });
            }
        },

        /**
        * Defines the execCommand itsacretaehyperlink
        * @method _defineExecCommandHyperlink
        * @private
        */
        _defineExecCommandHyperlink : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandHyperlink", 1296);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1297);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1298);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    // val can be:
                    // 'img', 'url', 'video', 'email'
                    itsacreatehyperlink: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreatehyperlink", 1301);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1302);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1311);
url = val || prompt('Enter url', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1312);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1313);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1314);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1315);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1316);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1317);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1318);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1319);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1320);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1321);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1323);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1324);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1325);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1327);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1328);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1329);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1330);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1336);
execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url + '" target="_blank">' + url + '</a>');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1339);
return a;
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacretaeemaillink
        * @method _defineExecCommandMaillink
        * @private
        */
        _defineExecCommandMaillink : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandMaillink", 1350);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1351);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1352);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreatemaillink: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreatemaillink", 1353);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1354);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            urltext,
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1364);
url = val || prompt('Enter email', '');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1365);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1366);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1367);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1368);
urltext = url;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1369);
url = 'mailto:' + url;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1370);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1371);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1372);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1373);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1374);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1375);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1376);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1378);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1379);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1380);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1382);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1383);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1384);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1385);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1391);
execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url+ '">' + urltext + '</a>');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1394);
return a;
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacreateimage
        * @method _defineExecCommandImage
        * @private
        */
        _defineExecCommandImage : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandImage", 1405);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1406);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1407);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateimage: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreateimage", 1408);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1409);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1418);
url = val || prompt('Enter link to image', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1419);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1420);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1421);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1422);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1423);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1424);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1425);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1426);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1427);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1428);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1430);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1431);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1432);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1434);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1435);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1436);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1437);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1443);
execCommandInstance.get('host').execCommand('inserthtml', '<img src="' + url + '" />');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1446);
return a;
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsacreateyoutube
        * @method _defineExecCommandYouTube
        * @private
        */
        _defineExecCommandYouTube : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandYouTube", 1457);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1458);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1459);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateyoutube: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreateyoutube", 1460);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1461);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1470);
url = val || prompt('Enter link to image', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1471);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1472);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1473);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1474);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1475);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1476);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1477);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1478);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1479);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1480);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1482);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1483);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1484);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1486);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1487);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1488);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1489);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1495);
videoitempos = url.indexOf('watch?v=');
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1496);
if (videoitempos!==-1) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1497);
videoitem = url.substring(url.videoitempos+8);
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1498);
execCommandInstance.get('host').execCommand('inserthtml', '<iframe width="420" height="315" src="http://www.youtube.com/embed/' + videoitem + '" frameborder="0" allowfullscreen></iframe>');
                                    }
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1502);
return a;
                    }
                });
            }
        }

    }, {
        NS : 'itsatoolbar',
        ATTRS : {

            /**
             * @description Defines whether keyboard-enter will lead to P-tag. Default=false (meaning that BR's will be created)
             * @attribute paraSupport
             * @type Boolean
            */
            paraSupport : {
                value: false,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1519);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1520);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description The sourceNode that holds the Toolbar. Could be an empty DIV.<br>
             * If not defined, than the Toolbar will be created just above the Editor.
             * By specifying the srcNode, one could create the Toolbar on top of the page, regardless of the Editor's position
             * @attribute srcNode
             * @type Y.Node 
            */
            srcNode : {
                value: null,
                writeOnce: 'initOnly',
                setter: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "setter", 1534);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1535);
return Y.one(val);
                },
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1537);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1538);
return Y.one(val);
                }
            },

            /**
             * @description The size of the buttons<br>
             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>
             * Default = 2
             * @attribute btnSize
             * @type int
            */
            btnSize : {
                value: 2,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1551);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1552);
return (Lang.isNumber(val) && (val>0) && (val<4));
                }
            },

            /**
             * @description The amount of headerlevels that can be selected<br>
             * Should be a value from 1-9<br>
             * Default = 6
             * @attribute headerLevels
             * @type int
            */
            headerLevels : {
                value: 6,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1565);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1566);
return (Lang.isNumber(val) && (val>0) && (val<10));
                }
            },

            /**
             * @description The fontfamilies that can be selected<br>
             * Should be a value from 1-9<br>
             * @attribute fontFamilies
             * @type Array [String]
            */
            fontFamilies : {
                value: [
                    'Arial',
                    'Arial Black',
                    'Comic Sans MS',
                    'Courier New',
                    'Lucida Console',
                    'Tahoma',
                    'Times New Roman',
                    'Trebuchet MS',
                    'Verdana'
                ],
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1588);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1589);
return (Lang.isArray(val));
                }
            },

            /**
             * @description Whether the button fontfamily is available<br>
             * Default = true
             * @attribute btnFontfamily
             * @type Boolean
            */
            btnFontfamily : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1601);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1602);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button fontsize is available<br>
             * Default = true
             * @attribute btnFontsize
             * @type Boolean
            */
            btnFontsize : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1614);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1615);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button headers is available<br>
             * because this function doesn't work well on all browsers, it is set of by default.<br>
             * Is something to work on in fututr releases. It works within firefox though.
             * Default = false
             * @attribute btnHeader
             * @type Boolean
            */
            btnHeader : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1629);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1630);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button bold is available<br>
             * Default = true
             * @attribute btnBold
             * @type Boolean
            */
            btnBold : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1642);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1643);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button italic is available<br>
             * Default = true
             * @attribute btnItalic
             * @type Boolean
            */
            btnItalic : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1655);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1656);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button underline is available<br>
             * Default = true
             * @attribute btnUnderline
             * @type Boolean
            */
            btnUnderline : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1668);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1669);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group align is available<br>
             * Default = true
             * @attribute grpAlign
             * @type Boolean
            */
            grpAlign : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1681);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1682);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button justify is available<br>
             * will only be shown in combination with grpalign
             * Default = true
             * @attribute btnJustify
             * @type Boolean
            */
            btnJustify : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1695);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1696);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group sub/superscript is available<br>
             * Default = true
             * @attribute grpSubsuper
             * @type Boolean
            */
            grpSubsuper : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1708);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1709);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button textcolor is available<br>
             * Default = true
             * @attribute btnTextcolor
             * @type Boolean
            */
            btnTextcolor : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1721);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1722);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button markcolor is available<br>
             * Default = true
             * @attribute btnMarkcolor
             * @type Boolean
            */
            btnMarkcolor : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1734);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1735);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group indent is available<br>
             * Default = true
             * @attribute grpIndent
             * @type Boolean
            */
            grpIndent : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1747);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1748);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the group lists is available<br>
             * Default = true
             * @attribute grpLists
             * @type Boolean
            */
            grpLists : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1760);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1761);
return Lang.isBoolean(val);
                }
            },
/*
            btnremoveformat : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },
            btnhiddenelements : {
                value: true,
                validator: function(val) {
                    return Lang.isBoolean(val);
                }
            },
*/

            /**
             * @description Whether the group undo/redo is available<br>
             * Default = true
             * @attribute grpUndoredo
             * @type Boolean
            */
            grpUndoredo : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1787);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1788);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button email is available<br>
             * Default = true
             * @attribute btnEmail
             * @type Boolean
            */
            btnEmail : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1800);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1801);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button hyperlink is available<br>
             * Default = true
             * @attribute btnHyperlink
             * @type Boolean
            */
            btnHyperlink : {
                value: true,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1813);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1814);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button image is available<br>
             * because this code needs to be developed in a better way, the function is disabled by default.<br>
             * It works in a simple way though.
             * Default = false
             * @attribute btnImage
             * @type Boolean
            */
            btnImage : {
                value: false,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1828);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1829);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description Whether the button video is available<br>
             * because this code needs to be developed in a better way, the function is disabled by default.<br>
             * It works in a simple way though. The end-user should enter a youtube-link once they click on this button.
             * Default = false
             * @attribute btnVideo
             * @type Boolean
            */
            btnVideo : {
                value: false,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1843);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1844);
return Lang.isBoolean(val);
                }
            },

            /**
             * @description The colorpallet to use<br>
             * @attribute colorPallet
             * @type Array (String)
            */
            colorPallet : {
                value : [
                    '#111111',
                    '#2D2D2D',
                    '#434343',
                    '#5B5B5B',
                    '#737373',
                    '#8B8B8B',
                    '#A2A2A2',
                    '#B9B9B9',
                    '#000000',
                    '#D0D0D0',
                    '#E6E6E6',
                    '#FFFFFF',
                    '#BFBF00',
                    '#FFFF00',
                    '#FFFF40',
                    '#FFFF80',
                    '#FFFFBF',
                    '#525330',
                    '#898A49',
                    '#AEA945',
                    '#7F7F00',
                    '#C3BE71',
                    '#E0DCAA',
                    '#FCFAE1',
                    '#60BF00',
                    '#80FF00',
                    '#A0FF40',
                    '#C0FF80',
                    '#DFFFBF',
                    '#3B5738',
                    '#668F5A',
                    '#7F9757',
                    '#407F00',
                    '#8A9B55',
                    '#B7C296',
                    '#E6EBD5',
                    '#00BF00',
                    '#00FF80',
                    '#40FFA0',
                    '#80FFC0',
                    '#BFFFDF',
                    '#033D21',
                    '#438059',
                    '#7FA37C',
                    '#007F40',
                    '#8DAE94',
                    '#ACC6B5',
                    '#DDEBE2',
                    '#00BFBF',
                    '#00FFFF',
                    '#40FFFF',
                    '#80FFFF',
                    '#BFFFFF',
                    '#033D3D',
                    '#347D7E',
                    '#609A9F',
                    '#007F7F',
                    '#96BDC4',
                    '#B5D1D7',
                    '#E2F1F4',
                    '#0060BF',
                    '#0080FF',
                    '#40A0FF',
                    '#80C0FF',
                    '#BFDFFF',
                    '#1B2C48',
                    '#385376',
                    '#57708F',
                    '#00407F',
                    '#7792AC',
                    '#A8BED1',
                    '#DEEBF6',
                    '#0000BF',
                    '#0000FF',
                    '#4040FF',
                    '#8080FF',
                    '#BFBFFF',
                    '#212143',
                    '#373E68',
                    '#444F75',
                    '#00007F',
                    '#585E82',
                    '#8687A4',
                    '#D2D1E1',
                    '#6000BF',
                    '#8000FF',
                    '#A040FF',
                    '#C080FF',
                    '#DFBFFF',
                    '#302449',
                    '#54466F',
                    '#655A7F',
                    '#40007F',
                    '#726284',
                    '#9E8FA9',
                    '#DCD1DF',
                    '#BF00BF',
                    '#FF00FF',
                    '#FF40FF',
                    '#FF80FF',
                    '#FFBFFF',
                    '#4A234A',
                    '#794A72',
                    '#936386',
                    '#7F007F',
                    '#9D7292',
                    '#C0A0B6',
                    '#ECDAE5',
                    '#BF005F',
                    '#FF007F',
                    '#FF409F',
                    '#FF80BF',
                    '#FFBFDF',
                    '#451528',
                    '#823857',
                    '#A94A76',
                    '#7F003F',
                    '#BC6F95',
                    '#D8A5BB',
                    '#F7DDE9',
                    '#C00000',
                    '#FF0000',
                    '#FF4040',
                    '#FF8080',
                    '#FFC0C0',
                    '#441415',
                    '#82393C',
                    '#AA4D4E',
                    '#800000',
                    '#BC6E6E',
                    '#D8A3A4',
                    '#F8DDDD',
                    '#BF5F00',
                    '#FF7F00',
                    '#FF9F40',
                    '#FFBF80',
                    '#FFDFBF',
                    '#482C1B',
                    '#855A40',
                    '#B27C51',
                    '#7F3F00',
                    '#C49B71',
                    '#E1C4A8',
                    '#FDEEE0'
                ],
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2000);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2001);
return Lang.isArray(val) ;
                }

            }
        }
    }
);


}, 'gallery-2012.09.12-20-02' ,{requires:['plugin', 'base-build', 'node-base', 'editor', 'event-delegate', 'event-custom', 'cssbutton', 'gallery-itsaselectlist'], skinnable:true});
