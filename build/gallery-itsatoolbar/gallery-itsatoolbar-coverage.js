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
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].code=["YUI.add('gallery-itsatoolbar', function(Y) {","","'use strict';","","/**"," * The Itsa Selectlist module."," *"," * @module itsa-toolbar"," */","","/**"," * Editor Toolbar Plugin"," * "," *"," * @class Plugin.ITSAToolbar"," * @constructor"," *"," * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>"," * YUI BSD License - http://developer.yahoo.com/yui/license.html"," *","*/","","// Local constants","var Lang = Y.Lang,","    Node = Y.Node,","","    ITSA_BTNNODE = \"<button class='yui3-button'></button>\",","    ITSA_BTNINNERNODE = \"<span class='itsa-button-icon'></span>\",","    ITSA_BTNPRESSED = 'yui3-button-active',","    ITSA_BTNACTIVE = 'itsa-button-active',","    ITSA_BTNINDENT = 'itsa-button-indent',","    ITSA_BUTTON = 'itsa-button',","    ITSA_BTNSYNC = 'itsa-syncbutton',","    ITSA_BTNTOGGLE = 'itsa-togglebutton',","    ITSA_BTNGROUP = 'itsa-buttongroup',","    ITSA_BTNCUSTOMFUNC = 'itsa-button-customfunc',","    ITSA_TOOLBAR_TEMPLATE = \"<div class='itsatoolbar'></div>\",","    ITSA_TOOLBAR_SMALL = 'itsa-buttonsize-small',","    ITSA_TOOLBAR_MEDIUM = 'itsa-buttonsize-medium',","    ITSA_CLASSEDITORPART = 'itsatoolbar-editorpart',","    ITSA_SELECTCONTNODE = '<div></div>',","    ITSA_TMPREFNODE = \"<img id='itsatoolbar-tmpref' />\",","    ITSA_REFEMPTYCONTENT = \"<img class='itsatoolbar-tmpempty' src='itsa-buttonicons-2012-08-15.png' width=0 height=0>\",","    ITSA_REFNODE = \"<span id='itsatoolbar-ref'></span>\",","    ITSA_REFSELECTION = 'itsa-selection-tmp',","    ITSA_FONTSIZENODE = 'itsa-fontsize',","    ITSA_FONTFAMILYNODE = 'itsa-fontfamily',","    ITSA_FONTCOLORNODE = 'itsa-fontcolor',","    ITSA_MARKCOLORNODE = 'itsa-markcolor';","","// -- Public Static Properties -------------------------------------------------","","/**"," * Reference to the editor's instance"," * @property editor"," * @type Y.EditorBase instance"," */","","/**"," * Reference to the Y-instance of the host-editor"," * @property editorY"," * @type YUI-instance"," */","","/**"," * Reference to the editor's iframe-node"," * @property editorNode"," * @type Y.Node"," */","","/**"," * Reference to the editor's container-node, in which the host-editor is rendered.<br>"," * This is in fact editorNode.get('parentNode')"," * @property containerNode"," * @type Y.Node"," */","","/**"," * Reference to the toolbar-node.<br>"," * @property toolbarNode"," * @type Y.Node"," */","","/**"," * Used internally to check if the toolbar should still be rendered after the editor is rendered<br>"," * To prevent rendering while it is already unplugged"," * @property _destroyed"," * @private"," * @type Boolean"," */","","/**"," * Timer: used internally to clean up empty fontsize-markings<br>"," * @property _timerClearEmptyFontRef"," * @private"," * @type Object"," */","","/**"," * Reference to a backup cursorposition<br>"," * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected."," * Reference is made on a show-event of the selectlist."," * @property _backupCursorRef"," * @private"," * @type Y.Node"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_BOLD"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ITALIC"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNDERLINE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_LEFT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_CENTER"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_RIGHT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_JUSTIFY"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_SUBSCRIPT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_SUPERSCRIPT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_TEXTCOLOR"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_MARKCOLOR"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_INDENT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_OUTDENT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNORDEREDLIST"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ORDEREDLIST"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNDO"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_REDO"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_EMAIL"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_HYPERLINK"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_IMAGE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_FILE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_VIDEO"," * @type String"," */","","Y.namespace('Plugin').ITSAToolbar = Y.Base.create('itsatoolbar', Y.Plugin.Base, [], {","","        editor : null,","        editorY : null,","        editorNode : null,","        containerNode : null,","        toolbarNode : null,","        _destroyed : false,","        _timerClearEmptyFontRef : null,","        _backupCursorRef : null,","","        ICON_BOLD : 'itsa-icon-bold',","        ICON_ITALIC : 'itsa-icon-italic',","        ICON_UNDERLINE : 'itsa-icon-underline',","        ICON_ALIGN_LEFT : 'itsa-icon-alignleft',","        ICON_ALIGN_CENTER : 'itsa-icon-aligncenter',","        ICON_ALIGN_RIGHT : 'itsa-icon-alignright',","        ICON_ALIGN_JUSTIFY : 'itsa-icon-alignjustify',","        ICON_SUBSCRIPT : 'itsa-icon-subscript',","        ICON_SUPERSCRIPT : 'itsa-icon-superscript',","        ICON_TEXTCOLOR : 'itsa-icon-textcolor',","        ICON_MARKCOLOR : 'itsa-icon-markcolor',","        ICON_INDENT : 'itsa-icon-indent',","        ICON_OUTDENT : 'itsa-icon-outdent',","        ICON_UNORDEREDLIST : 'itsa-icon-unorderedlist',","        ICON_ORDEREDLIST : 'itsa-icon-orderedlist',","        ICON_UNDO : 'itsa-icon-undo',","        ICON_REDO : 'itsa-icon-redo',","        ICON_EMAIL : 'itsa-icon-email',","        ICON_HYPERLINK : 'itsa-icon-hyperlink',","        ICON_IMAGE : 'itsa-icon-image',","        ICON_FILE : 'itsa-icon-file',","        ICON_VIDEO : 'itsa-icon-video',","        /**","         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready","         *","         * @method initializer","         * @param {Object} config The config-object.","         * @protected","        */","        initializer : function(config) {","            var instance = this;","            instance.editor = instance.get('host');","            // need to make sure we can use execCommand, so do not render before the frame exists.","            if (instance.editor.frame && instance.editor.frame.get('node')) {instance._render();}","            else {","                var delayIE = false;","                if (delayIE && (Y.UA.ie>0)) {","                    // didn't find out yet: IE stops creating the editorinstance when pluggedin too soon!","                    // GOTTA check out","                    // at the time being: delaying","                    Y.later(250, instance, instance._render);","                }","                else {","                    // do not subscribe to the frame:ready, but to the ready-event","                    // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors","                    instance.editor.on('ready', instance._render, instance);","                }","            }","        },","","        /**","         * Establishes the initial DOM for the toolbar. This method ia automaticly invoked once during initialisation.","         * It will invoke renderUI, bindUI and syncUI, just as within a widget.","         *","         * @method _render","         * @private","        */","        _render : function() {","            var instance = this;","            if (!instance._destroyed) {","                instance.editorY = instance.editor.getInstance();","                instance.editorNode = instance.editor.frame.get('node');","                instance.containerNode = instance.editorNode.get('parentNode');","                instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);","                instance.editor.plug(Y.Plugin.ExecCommand);","                instance._defineCustomExecCommands();","                instance._renderUI();","                instance._bindUI();","                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object","                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!","                instance.editor.frame.focus(Y.bind(instance.sync, instance));","            }","        },","","        /**","         * Returns node at cursorposition<br>","         * This can be a selectionnode, or -in case of no selection- a new tmp-node (empty span) that will be created to serve as reference.","         * In case of selection, there will always be made a tmp-node as placeholder. But in that case, the tmp-node will be just before the returned node.","         * @method _getCursorRef","         * @private","         * @param {Boolean} [selectionIfAvailable] do return the selectionnode if a selection is made. If set to false, then always just the cursornode will be returned. ","         * Which means -in case of selection- that the cursornode exists as a last child of the selection. Default = false.","         * @returns {Y.Node} created empty referencenode","        */","        _getCursorRef : function(selectionIfAvailable) {","            var instance = this,","                node,","                tmpnode,","                sel,","                out;","            // insert cursor and use that node as the selected node","            // first remove previous","            instance._removeCursorRef();","            sel = new instance.editorY.EditorSelection();","            out = sel.getSelected();","            if (!sel.isCollapsed && out.size()) {","                // We have a selection","                node = out.item(0);","            }","            // node only exist when selection is available","            if (node) {","                node.addClass(ITSA_REFSELECTION);","                node.insert(ITSA_REFNODE, 'after');","                if (!(Lang.isBoolean(selectionIfAvailable) && selectionIfAvailable)) {node = instance.editorY.one('#itsatoolbar-ref');}","            }","            else {","                instance.editor.focus();","                instance.execCommand('inserthtml', ITSA_REFNODE);","                node = instance.editorY.one('#itsatoolbar-ref');","            }","            return node;","        },","","        /**","         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef","         * @method _removeCursorRef","         * @private","        */","        _removeCursorRef : function() {","            var instance = this,","                node,","                useY;","            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases","            useY = instance.editorY ? instance.editorY : Y;","            // first cleanup single referencenode","            node = useY.all('#itsatoolbar-ref');","            if (node) {node.remove();}","            node = useY.all('#itsatoolbar-tmpempty');","            if (node) {node.remove();}","            // next clean up all selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions","            node = useY.all('.' + ITSA_REFSELECTION);","            if (node.size()>0) {","                node.each(function(node){","                    node.replace(node.getHTML());","                });","            }","        },","","        /**","         * Removes temporary created font-size-ref-Node that might have been created by inserting fontsizes","         * @method _clearEmptyFontRef","         * @private","        */","        _clearEmptyFontRef : function() {","            var instance = this,","                node,","                useY;","            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases","            useY = instance.editorY ? instance.editorY : Y;","            // first cleanup single referencenode","            node = useY.all('.itsatoolbar-tmpempty');","            if (node) {node.remove();}","            // next clean up all references that are empty","            node = useY.all('.itsa-fontsize');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","            node = useY.all('.itsa-fontfamily');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","            node = useY.all('.itsa-fontcolor');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","            node = useY.all('.itsa-markcolor');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","        },","","        /**","         * Sets the real editorcursor at the position of the tmp-node created by _getCursorRef<br>","         * Removes the cursor tmp-node afterward.","         * @method _setCursorAtRef","         * @private","        */","        _setCursorAtRef : function() {","            var instance = this,","                sel,","                node = instance.editorY.one('#itsatoolbar-ref');","            if (node) {","                sel = new instance.editorY.EditorSelection();","                sel.selectNode(node);","                // DO NOT call _removeCursorref straight away --> it will make Opera crash","                Y.later(100, instance, instance._removeCursorRef);","            }","        },","","        /**","         * Creates a reference at cursorposition for backupusage<br>","         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.","         * @method _createBackupCursorRef","         * @private","        */","        _createBackupCursorRef : function() {","            var instance = this;","            instance._backupCursorRef = instance._getCursorRef(true);","        },","","        /**","         * Returns backupnode at cursorposition that is created by _createBackupCursorRef()<br>","         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.","         * So descendenst of ItsaSelectlist should refer to this cursorref.","         * @method _getBackupCursorRef","         * @private","         * @returns {Y.Node} created empty referencenode","        */","        _getBackupCursorRef : function() {","            return this._backupCursorRef;","        },","","        /**","         * Syncs the toolbar's status with the editor.<br>","         * @method sync","         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.","        */","        sync : function(e) {","            // syncUI will sync the toolbarstatus with the editors cursorposition","            var instance = this,","                cursorRef;","            if (!(e && e.changedNode)) {","                cursorRef = instance._getCursorRef(false);","                if (!e) {e = {changedNode: cursorRef};}","                else {e.changedNode = cursorRef;}","                Y.later(250, instance, instance._removeCursorRef);","            }","            instance.toolbarNode.fire('itsatoolbar:statusChange', e);","        },","","        /**","         * Creates a new Button on the Toolbar. By default at the end of the toolbar.","         * @method addButton","         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, or you want a custom Function to be executed, you must supply an object:<br>","         * <i>- [command]</i> (String): the execcommand<br>","         * <i>- [value]</i> (String): additional value","         * <i>- [customFunc]</i> (Function): reference to custom function: typicaly, this function will call editorinstance.itstoolbar.execCommand() by itsself","         * <i>- [context]]</i> (instance): the context for customFunc","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addButton : function(iconClass, execCommand, indent, position) {","            var instance = this,","                buttonNode,","                buttonInnerNode;","            buttonNode = Node.create(ITSA_BTNNODE);","            buttonNode.addClass(ITSA_BUTTON);","            if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}","            else if (Lang.isObject(execCommand)) {","                if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}","                if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}","                if (Lang.isFunction(execCommand.customFunc)) {","                    buttonNode.addClass(ITSA_BTNCUSTOMFUNC);","                    buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);","                }","            }","            if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}","            buttonInnerNode = Node.create(ITSA_BTNINNERNODE);","            buttonInnerNode.addClass(iconClass);","            buttonNode.append(buttonInnerNode);","            instance.toolbarNode.append(buttonNode);","            return buttonNode;","        },","","        /**","         * Creates a new syncButton on the Toolbar. By default at the end of the toolbar.<br>","         * A syncButton is just like a normal toolbarButton, with the exception that the editor can sync it's status, which cannot be done with a normal button. ","         * Typically used in situations like a hyperlinkbutton: it never stays pressed, but when the cursos is on a hyperlink, he buttons look will change.","         * @method addSyncButton","         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>","         * <i>- command</i> (String): the execcommand<br>","         * <i>- value</i> (String): additional value","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.","         * This function should handle the responseaction to be taken.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addSyncButton : function(iconClass, execCommand, syncFunc, context, indent, position, isToggleButton) {","            var instance = this,","                buttonNode = instance.addButton(iconClass, execCommand, indent, position);","            if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}","            instance.toolbarNode.addTarget(buttonNode);","            if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(syncFunc, context || instance));}","            return buttonNode;","        },","","        /**","         * Creates a new toggleButton on the Toolbar. By default at the end of the toolbar.","         * @method addToggleButton","         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>","         * <i>- command</i> (String): the execcommand<br>","         * <i>- value</i> (String): additional value","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.","         * This function should handle the responseaction to be taken.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addToggleButton : function(iconClass, execCommand, syncFunc, context, indent, position) {","            var instance = this,","                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);","            buttonNode.addClass(ITSA_BTNTOGGLE);","            return buttonNode;","        },","","        /**","         * Creates a group of toggleButtons on the Toolbar which are related to each-other. For instance when you might need 3 related buttons: leftalign, center, rightalign.","         * Position is by default at the end of the toolbar.<br>","         * @method addButtongroup","         * @param {Array} buttons Should consist of objects with two fields:<br>","         * <i>- iconClass</i> (String): defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * <i>- command</i> (String): the execcommand that will be executed on buttonclick","         * <i>- [value]</i> (String) optional: additional value for the execcommand","         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton)","         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the first buttonnode of the created buttongroup","        */","        addButtongroup : function(buttons, indent, position) {","            var instance = this,","                buttonGroup = Y.guid(),","                button,","                buttonNode,","                returnNode = null,","                execCommand,","                i;","            for (i=0; i<buttons.length; i++) {","                button = buttons[i];","                if (button.iconClass && button.command) {","                    if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}","                    else {execCommand = button.command;}","                    buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position) ? position+i : null);","                    buttonNode.addClass(ITSA_BTNGROUP);","                    buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);","                    buttonNode.setData('buttongroup', buttonGroup);","                    instance.toolbarNode.addTarget(buttonNode);","                    if (Lang.isFunction(button.syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(button.syncFunc, button.context || instance));}","                    if (!returnNode) {returnNode = buttonNode;}","                }","            }","            return returnNode;","        },","","        /**","         * Creates a selectList on the Toolbar. By default at the end of the toolbar.","         * When fired, the event-object returnes with 2 fields:<br>","         * <i>- e.value</i>: value of selected item<br>","         * <i>- e.index</i>: indexnr of the selected item<br>.","         * CAUTION: when using a selectlist, you <u>cannot</u? use standard execCommands. That will not work in most browsers, because the focus will be lost. <br>","         * Instead, create your customexecCommand and use cursorrefference <i>_getBackupCursorRef()</i>: see example <i>_defineExecCommandFontFamily()</i>","         * @method addSelectList","         * @param {Array} items contains all the items. Should be either a list of (String), or a list of (Objects). In case of an Object-list, the objects should contain two fields:<br>","         * <i>- text</i> (String): the text shown in the selectlist<br>","         * <i>- returnValue</i> (String): the returnvalue of e.value<br>","         * In case a String-list is supplied, e.value will equal to the selected String-item (returnvalue==text)","","         * @param {String | Object} execCommand ExecCommand that will be executed after a selectChange-event is fired. e.value will be placed as the second argument in editor.execCommand().<br>","         * You could provide a second 'restoreCommand', in case you need a different execCommand to erase some format. In that case you must supply an object with three fields:<br>","         * <i>- command</i> (String): the standard execcommand<br>","         * <i>- restoreCommand</i> (String): the execcommand that will be executed in case e.value equals the restore-value<br>","         * <i>- restoreValue</i> (String): when e.value equals restoreValue, restoreCommand will be used instead of the standard command","","","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Object} [config] Object that will be passed into the selectinstance. Has with the following fields:<br>","         * <i>- listAlignRight</i> (Boolean): whether to rightalign the listitems. Default=false<br>","         * <i>- hideSelected</i> (Boolean): whether the selected item is hidden from the list. Default=false","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.ITSASelectlist} reference to the created object","        */","        addSelectlist : function(items, execCommand, syncFunc, context, indent, config, position) {","            var instance = this,","                selectlist;","            config = Y.merge(config, {items: items, defaultButtonText: ''});","            selectlist = new Y.ITSASelectList(config);","            selectlist.after('render', function(e, execCommand, syncFunc, context, indent){","                var instance = this,","                    selectlist = e.currentTarget,","                    buttonNode = selectlist.buttonNode;","                if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}","                else {","                    if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}                    ","                    if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}                    ","                    if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}                    ","                }","                if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}","                instance.toolbarNode.addTarget(buttonNode);","                selectlist.on('show', instance._createBackupCursorRef, instance);","                selectlist.on('selectChange', instance._handleSelectChange, instance);","                if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.rbind(syncFunc, context || instance));}","                instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);","            }, instance, execCommand, syncFunc, context, indent);","            selectlist.render(instance.toolbarNode);","            return selectlist;","        },","","","        /**","         * Cleans up bindings and removes plugin","         * @method destructor","         * @protected","        */","        destructor : function() {","            var instance = this,","                srcNode = instance.get('srcNode');","             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction","            instance._destroyed = true;","            instance._removeCursorRef();","            if (instance._timerClearEmptyFontRef) {instance._timerClearEmptyFontRef.cancel();}","            instance._clearEmptyFontRef();","            if (instance.toolbarNode) {instance.toolbarNode.remove(true);}","        },","","        // -- Private Methods ----------------------------------------------------------","","        /**","         * Creates the toolbar in the DOM. Toolbar will appear just above the editor, or -when scrNode is defined-  it will be prepended within srcNode ","         *","         * @method _renderUI","         * @private","        */","        _renderUI : function() {","            var instance = this,","                correctedHeight = 0,","                srcNode = instance.get('srcNode'),","                btnSize = instance.get('btnSize');","            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering","            instance.toolbarNode = Node.create(ITSA_TOOLBAR_TEMPLATE);","            if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}","            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}","            if (srcNode) {","                srcNode.prepend(instance.toolbarNode);","            }","            else {","                instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);","                switch (instance.get('btnSize')) {","                    case 1:","                        correctedHeight = -40;","                    break;","                    case 2: ","                        correctedHeight = -44;","                    break;","                    case 3: ","                        correctedHeight = -46;","                    break;","                }","                correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);","                instance.editorNode.set('height', correctedHeight);","                instance.editorNode.insert(instance.toolbarNode, 'before');","            }","            instance._initializeButtons();","        },","        ","        /**","         * Binds events when there is a cursorstatus changes in the editor","         *","         * @method _bindUI","         * @private","        */","        _bindUI : function() {","            var instance = this;","            instance.editor.on('nodeChange', instance.sync, instance);","            instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance);","        },","","        /**","         * Defines all custom execCommands","         *","         * @method _defineCustomExecCommands","         * @private","        */","        _defineCustomExecCommands : function() {","            var instance = this;","            instance._defineExecCommandHeader();","            instance._defineExecCommandFontFamily();","            instance._defineExecCommandFontSize();","            instance._defineExecCommandFontColor();","            instance._defineExecCommandMarkColor();","            instance._defineExecCommandHyperlink();","            instance._defineExecCommandMaillink();","            instance._defineExecCommandImage();","            instance._defineExecCommandYouTube();","        },","","        /**","         * Handling the buttonclicks for all buttons on the Toolbar within one eventhandler (delegated by the Toolbar-node)","         *","         * @method _bindUI","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _handleBtnClick : function(e) {","            var instance = this,","                node = e.currentTarget;","            // only execute for .itsa-button, not for all buttontags    ","            if (node.hasClass(ITSA_BUTTON)) {","                if (node.hasClass(ITSA_BTNTOGGLE)) {","                    node.toggleClass(ITSA_BTNPRESSED);","                }","                else if (node.hasClass(ITSA_BTNSYNC)) {","                    node.toggleClass(ITSA_BTNACTIVE, true);","                }","                else if (node.hasClass(ITSA_BTNGROUP)) {","                    instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);","                    node.toggleClass(ITSA_BTNPRESSED, true);","                }","                if (!node.hasClass(ITSA_BTNCUSTOMFUNC)) {instance._execCommandFromData(node);}","            }","        },","","        /**","         * Handling the selectChange event of a selectButton","         *","         * @method _handleSelectChange","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _handleSelectChange : function(e) {","            var selectButtonNode,","                restoreCommand,","                execCommand;","            selectButtonNode = e.currentTarget.buttonNode;","            restoreCommand = selectButtonNode.getData('restoreCommand');","            execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');","            this.execCommand(execCommand, e.value);","        },","","        /**","         * Executes this.editor.exec.command with the execCommand and value that is bound to the node through Node.setData('execCommand') and Node.setData('execValue'). <br>","         * these values are bound during definition of addButton(), addSyncButton(), addToggleButton etc.","         *","         * @method _execCommandFromData","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _execCommandFromData: function(buttonNode) {","            var execCommand,","                execValue;","            execCommand = buttonNode.getData('execCommand');","            execValue = buttonNode.getData('execValue');","            this.execCommand(execCommand, execValue);","        },","","        /**","         * Performs a execCommand that will take into account the editors cursorposition<br>","         * This means that when no selection is made, the operation still works: you can preset an command this way.<br>","         * It also makes 'inserthtml' work with all browsers.","         *","         * @method execCommand","         * @param {String} command The execCommand","         * @param {String} [value] additional commandvalue","        */","        execCommand: function(command, value) {","            var instance = this,","                tmpnode;","            instance.editor.focus();","            if (command==='inserthtml') {","                // we need a tmp-ref which is an img-element instead of a span-element --> inserthtml of span does not work in chrome and safari","                // but inserting img does, which can replaced afterwards","                // first a command that I don't understand: but we need this, because otherwise some browsers will replace <br> by <p> elements","                instance.editor._execCommand('createlink', '&nbsp;');","                instance.editor.exec.command('inserthtml', ITSA_TMPREFNODE);","                tmpnode = instance.editorY.one('#itsatoolbar-tmpref');","                tmpnode.replace(value);","            }","            else {instance.editor.exec.command(command, value);}","        },","","        /**","         * Checks whether there is a selection within the editor<br>","         *","         * @method _hasSelection","         * @private","         * @returns {Boolean} whether there is a selection","        */","        _hasSelection : function() {","            var instance = this,","                sel = new instance.editorY.EditorSelection();","            return (!sel.isCollapsed  && sel.anchorNode);","        },","","        /**","         * Checks whether the cursor is inbetween a selector. For instance to check if cursor is inbetween a h1-selector","         *","         * @method _checkInbetweenSelector","         * @private","         * @param {String} selector The selector to check for","         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection","         * @returns {Boolean} whether node resides inbetween selector","        */","        _checkInbetweenSelector : function(selector, cursornode) {","            var instance = this,","                pattern = '<\\\\s*' + selector + '[^>]*>(.*?)<\\\\s*/\\\\s*' + selector  + '>',","                searchHeaderPattern = new RegExp(pattern, 'gi'),","                fragment,","                inbetween = false,","                refContent = instance.editorY.one('body').getHTML(),","                cursorid,","                cursorindex;","            cursorid = cursornode.get('id');","            cursorindex = refContent.indexOf(' id=\"' + cursorid + '\"');","            if (cursorindex===-1) {cursorindex = refContent.indexOf(\" id='\" + cursorid + \"'\");}","            if (cursorindex===-1) {cursorindex = refContent.indexOf(\" id=\" + cursorid);}","            fragment = searchHeaderPattern.exec(refContent);","            while ((fragment !== null) && !inbetween) {","                inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));","                fragment = searchHeaderPattern.exec(refContent); // next search","            }","            return inbetween;","        },","","        /**","         * Finds the headernode where the cursor, or selection remains in","         *","         * @method _getActiveHeader","         * @private","         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection. Can be supplied by e.changedNode, or left empty to make this function determine itself.","         * @returns {Y.Node|null} the headernode where the cursor remains. Returns null if outside any header.","        */","     _getActiveHeader : function(cursornode) {","            var instance = this,","                pattern,","                searchHeaderPattern,","                fragment,","                nodeFound,","                cursorid,","                nodetag,","                headingNumber = 0,","                returnNode = null,","                checkNode,","                endpos,","                refContent;","            if (cursornode) {    ","                // node can be a header right away, or it can be a node within a header. Check for both","                nodetag = cursornode.get('tagName');","                if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}","                if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {","                    returnNode = cursornode;","                }","                else {","                    cursorid = cursornode.get('id');","                    // first look for endtag, to determine which headerlevel to search for","                    pattern = ' id=(\"|\\')?' + cursorid + '(\"|\\')?(.*?)<\\\\s*/\\\\s*h\\\\d>';","                    searchHeaderPattern = new RegExp(pattern, 'gi');","                    refContent = instance.editorY.one('body').getHTML();","                    fragment = searchHeaderPattern.exec(refContent);","","","                    if (fragment !== null) {","                        // search again, looking for the right headernumber","                        endpos = fragment.index+fragment[0].length-1;","                        headingNumber = refContent.substring(endpos-1, endpos);","                        pattern = '<\\\\s*h' + headingNumber + '[^>]*>(.*?)id=(\"|\\')?' + cursorid + '(\"|\\')?(.*?)<\\\\s*/\\\\s*h' + headingNumber + '>';","                        searchHeaderPattern = new RegExp(pattern, 'gi');","                        fragment = searchHeaderPattern.exec(refContent); // next search","                        if (fragment !== null) {","                            nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);","                        }","                    }","                    if (nodeFound) {","                        checkNode = Node.create(nodeFound);","                        returnNode = instance.editorY.one('#' + checkNode.get('id'));","                    }","                }","            }","            return returnNode;","        },","","        /**","         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.","         *","         * @method _initializeButtons","         * @private","        */","        _initializeButtons : function() { ","            var instance = this,","                i, r, g, b,","                item,","                items,","                bgcolor,","                docFontSize,","                bgcolors,","                buttons;","","            // create fonffamily button","            if (instance.get('btnFontfamily')) {","                items = instance.get('fontFamilies');","                for (i=0; i<items.length; i++) {","                    item = items[i];","                    items[i] = {text: \"<span style='font-family:\"+item+\"'>\"+item+\"</span>\", returnValue: item};","                }","                instance.fontSelectlist = instance.addSelectlist(items, 'itsafontfamily', function(e) {","                    var familyList = e.changedNode.getStyle('fontFamily'),","                        familyListArray = familyList.split(','),","                        activeFamily = familyListArray[0];","                    // some browsers place '' surround the string, when it should contain whitespaces.","                    // first remove them","                    if ((activeFamily.substring(0,1)===\"'\") || (activeFamily.substring(0,1)==='\"')) {activeFamily = activeFamily.substring(1, activeFamily.length-1);}","                    this.fontSelectlist.selectItemByValue(activeFamily, true, true);","                }, null, true, {buttonWidth: 145});","            }","","            // create fontsize button","            if (instance.get('btnFontsize')) {","                items = [];","                for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}","                instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {","                    var fontSize = e.changedNode.getComputedStyle('fontSize'),","                        fontSizeNumber = parseFloat(fontSize),","                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);","                    // make sure not to display partial numbers    ","                    this.sizeSelectlist.selectItemByValue(Lang.isNumber(fontSizeNumber) ? Math.round(fontSizeNumber)+fontsizeExt : '', true);","                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});","            }","","            // create header button","            if (instance.get('btnHeader')) {","                items = [];","                items.push({text: 'No header', returnValue: 'none'});","                for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}","                instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {","                    var instance = this,","                        node = e.changedNode,","                        internalcall = (e.sender && e.sender==='itsaheading'),","                        activeHeader;","                    // prevent update when sync is called after heading has made changes. Check this through e.sender","                    if (!internalcall) {","                        activeHeader = instance._getActiveHeader(node);","                        instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);","                        instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());","                    }","                }, null, true, {buttonWidth: 96});","            }","","            // create bold button","            if (instance.get('btnBold')) {","                instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {","                    var fontWeight = e.changedNode.getStyle('fontWeight');","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (Lang.isNumber(parseInt(fontWeight, 10)) ? (fontWeight>=600) : ((fontWeight==='bold') || (fontWeight==='bolder'))));","                }, null, true);","            }","","            // create italic button","            if (instance.get('btnItalic')) {","                instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));","                });","            }","","            // create underline button","            if (instance.get('btnUnderline')) {","                instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));","                });","            }","","            // create align buttons","            if (instance.get('grpAlign')) {","                buttons = [","                    {","                        iconClass : instance.ICON_ALIGN_LEFT,","                        command : 'JustifyLeft',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));","                                    }","                    },","                    {","                        iconClass : instance.ICON_ALIGN_CENTER,","                        command : 'JustifyCenter',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));","                                    }","                    },","                    {","                        iconClass : instance.ICON_ALIGN_RIGHT,","                        command : 'JustifyRight',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));","                                    }","                    }","                ];","            // create justify button","                if (instance.get('btnJustify')) {","                    buttons.push({","                        iconClass : instance.ICON_ALIGN_JUSTIFY,","                        command : 'JustifyFull',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));","                                    }","                    });","                }","                instance.addButtongroup(buttons, true);","            }","","            // create subsuperscript buttons","            if (instance.get('grpSubsuper')) {","                instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));","                }, null, true);","                instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));","                });","            }","","            // create textcolor button","            if (instance.get('btnTextcolor')) {","                items = [];","                bgcolors = instance.get('colorPallet');","                for (i=0; i<bgcolors.length; i++) {","                    bgcolor = bgcolors[i];","                    items.push({text: \"<div style='background-color:\"+bgcolor+\";'></div>\", returnValue: bgcolor});","                }","                instance.colorSelectlist = instance.addSelectlist(items, 'itsafontcolor', function(e) {","                    var instance = this,","                        styleColor = e.changedNode.getStyle('color'),","                        hexColor = instance._filter_rgb(styleColor);","                    instance.colorSelectlist.selectItemByValue(hexColor, true, true);","                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});","            }","","            // create markcolor button","            if (instance.get('btnMarkcolor')) {","                items = [];","                bgcolors = instance.get('colorPallet');","                for (i=0; i<bgcolors.length; i++) {","                    bgcolor = bgcolors[i];","                    items.push({text: \"<div style='background-color:\"+bgcolor+\";'></div>\", returnValue: bgcolor});","                }","                instance.markcolorSelectlist = instance.addSelectlist(items, 'itsamarkcolor', function(e) {","                    var instance = this,","                        styleColor = e.changedNode.getStyle('backgroundColor'),","                        hexColor = instance._filter_rgb(styleColor);","                    instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);","                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});","            }","","            // create indent buttons","            if (instance.get('grpIndent')) {","                instance.addButton(instance.ICON_INDENT, 'indent', true);","                instance.addButton(instance.ICON_OUTDENT, 'outdent');","            }","","            // create list buttons","            if (instance.get('grpLists')) {","                instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {","                    var instance = this,","                        node = e.changedNode;","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));","                }, null, true);","                instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {","                    var instance = this,","                        node = e.changedNode;","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));","                });","            }","","            // create email button","            if (instance.get('btnEmail')) {","                instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {","                    var instance = this,","                        node = e.changedNode,","                        nodePosition,","                        isLink,","                        isEmailLink;","                    isLink =  instance._checkInbetweenSelector('a', node);","                    if (isLink) {","                        // check if its a normal href or a mailto:","                        while (node && !node.test('a')) {node=node.get('parentNode');}","                        // be carefull: do not === /match() with text, that will fail","                        isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');","                    }","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));","                }, null, true);","            }","","            // create hyperlink button","            if (instance.get('btnHyperlink')) {","                instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {","                    var instance = this,","                        posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',","                        node = e.changedNode,","                        nodePosition,","                        isLink,","                        isFileLink = false,","                        href,","                        lastDot,","                        fileExt,","                        isHyperLink;","                    isLink =  instance._checkInbetweenSelector('a', node);","                        if (isLink) {","                            // check if its a normal href or a mailto:","                            while (node && !node.test('a')) {node=node.get('parentNode');}","                            // be carefull: do not === /match() with text, that will fail","                            href = node.get('href');","                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';","                            if (isHyperLink) {","                                lastDot = href.lastIndexOf('.');","                                if (lastDot!==-1) {","                                    fileExt = href.substring(lastDot)+'.';","                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);","                                }","                            }","                        }","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));","                });","            }","","            // create image button","            if (instance.get('btnImage')) {","                instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));","                });","            }","","            // create video button","            if (instance.get('btnVideo')) {","                instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('iframe')));","                });","            }","","//************************************************","// just for temporary local use ITS Asbreuk","// should NOT be part of the gallery","            if (false) {","                instance.addSyncButton(","                    instance.ICON_FILE,","                    {   customFunc: function(e) {","                            Y.config.cmas2plus.uploader.show(","                                null, ","                                Y.bind(function(e) {","                                    this.editor.execCommand('itsacreatehyperlink', 'http://files.brongegevens.nl/' + Y.config.cmas2plusdomain + '/' + e.n);","                                }, this)","                            );","                        }","                    },","                    function(e) {","                        var instance = this,","                            posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',","                            node = e.changedNode,","                            nodePosition,","                            isFileLink = false,","                            isLink,","                            href,","                            lastDot,","                            fileExt,","                            isHyperLink;","                        isLink =  instance._checkInbetweenSelector('a', node);","                        if (isLink) {","                            // check if its a normal href or a mailto:","                            while (node && !node.test('a')) {node=node.get('parentNode');}","                            // be carefull: do not === /match() with text, that will fail","                            href = node.get('href');","                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';","                            if (isHyperLink) {","                                lastDot = href.lastIndexOf('.');","                                if (lastDot!==-1) {","                                    fileExt = href.substring(lastDot)+'.';","                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);","                                }","                            }","                        }","                        e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);","                    }","                );","            }","//************************************************","","            if (instance.get('grpUndoredo')) {","                instance.addButton(instance.ICON_UNDO, 'undo', true);","                instance.addButton(instance.ICON_REDO, 'redo');","            }","","        },","","        /**","        * Based on YUI2 rich-editor code","        * @private","        * @method _filter_rgb","        * @param String css The CSS string containing rgb(#,#,#);","        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00","        * @return String","        */","        _filter_rgb: function(css) {","            if (css.toLowerCase().indexOf('rgb') != -1) {","                var exp = new RegExp(\"(.*?)rgb\\\\s*?\\\\(\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?\\\\)(.*?)\", \"gi\"),","                    rgb = css.replace(exp, \"$1,$2,$3,$4,$5\").split(','),","                    r, g, b;","            ","                if (rgb.length === 5) {","                    r = parseInt(rgb[1], 10).toString(16);","                    g = parseInt(rgb[2], 10).toString(16);","                    b = parseInt(rgb[3], 10).toString(16);","","                    r = r.length === 1 ? '0' + r : r;","                    g = g.length === 1 ? '0' + g : g;","                    b = b.length === 1 ? '0' + b : b;","","                    css = \"#\" + r + g + b;","                }","            }","            return css;","        },","","        /**","        * Defines the execCommand itsaheading","        * @method _defineExecCommandHeader","        * @private","        */","        _defineExecCommandHeader : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsaheading: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef = itsatoolbar._getBackupCursorRef(),","                            activeHeader = itsatoolbar._getActiveHeader(noderef),","                            headingNumber = 0,","                            disableSelectbutton = false,","                            node;","                        if (val==='none') {","                            // want to clear heading","                            if (activeHeader) {","                                activeHeader.replace(\"<p>\"+activeHeader.getHTML()+\"</p>\");","                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox","                                itsatoolbar.headerSelectlist.set('disabled', true);","                            }","                        } else {","                            // want to add or change a heading","                            if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}","                            if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {","                                node = activeHeader ? activeHeader : noderef;","                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches","                                node.replace(\"<\"+val+\" id='\" + editorY.guid() + \"'>\"+node.getHTML()+\"</\"+val+\">\");","                            }","                        }","                        // do a toolbarsync, because styles will change.","                        // but do not refresh the heading-selectlist! Therefore e.sender is defined","                        itsatoolbar.sync({sender: 'itsaheading', changedNode: editorY.one('#itsatoolbar-ref')});","                        // take some time to let the sync do its work before set and remove cursor","                        Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);","                   }","                });","            }","        },","","        /**","        * Defines the execCommand itsafontfamily","        * @method _defineExecCommandFontFamily","        * @private","        */","        _defineExecCommandFontFamily : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontfamily) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsafontfamily: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            // first cleaning up old fontsize","                            noderef.all('span').setStyle('fontFamily', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_FONTFAMILYNODE).replaceClass(ITSA_FONTFAMILYNODE, ITSA_REFSELECTION);","                            noderef.setStyle('fontFamily', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_FONTFAMILYNODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_FONTFAMILYNODE + \"' style='font-family:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsafontsize","        * @method _defineExecCommandFontSize","        * @private","        */","        _defineExecCommandFontSize : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsafontsize: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            parentnode,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            //We have a selection","                            parentnode = noderef.get('parentNode');","                            if (Y.UA.webkit) {","                                parentnode.setStyle('lineHeight', '');","                            }","                            // first cleaning up old fontsize","                            noderef.all('span').setStyle('fontSize', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);","                            noderef.setStyle('fontSize', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_FONTSIZENODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_FONTSIZENODE + \"' style='font-size:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsafontcolor<br>","        * We need to overrule the standard color execCommand, because in IE the ItsaSelectlist will loose focus on the selection","        * @method _defineExecCommandFontColor","        * @private","        */","        _defineExecCommandFontColor : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontcolor) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsafontcolor: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            //We have a selection","                            // first cleaning up old fontcolors","                            noderef.all('span').setStyle('color', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_FONTCOLORNODE).replaceClass(ITSA_FONTCOLORNODE, ITSA_REFSELECTION);","                            noderef.setStyle('color', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_FONTCOLORNODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_FONTCOLORNODE + \"' style='color:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsamarkcolor<br>","        * We need to overrule the standard hilitecolor execCommand, because in IE the ItsaSelectlist will loose focus on the selection","        * @method _defineExecCommandMarkColor","        * @private","        */","        _defineExecCommandMarkColor : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsamarkcolor: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            //We have a selection","                            // first cleaning up old fontbgcolors","                            noderef.all('span').setStyle('backgroundColor', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_MARKCOLORNODE).replaceClass(ITSA_MARKCOLORNODE, ITSA_REFSELECTION);","                            noderef.setStyle('backgroundColor', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_MARKCOLORNODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            // remove the tmp-node placeholder","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_MARKCOLORNODE + \"' style='backgroundColor:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacretaehyperlink","        * @method _defineExecCommandHyperlink","        * @private","        */","        _defineExecCommandHyperlink : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    // val can be:","                    // 'img', 'url', 'video', 'email'","                    itsacreatehyperlink: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter url', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<a href=\"' + url + '\" target=\"_blank\">' + url + '</a>');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacretaeemaillink","        * @method _defineExecCommandMaillink","        * @private","        */","        _defineExecCommandMaillink : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreatemaillink: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            urltext,","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter email', '');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            urltext = url;","                            url = 'mailto:' + url;","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<a href=\"' + url+ '\">' + urltext + '</a>');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacreateimage","        * @method _defineExecCommandImage","        * @private","        */","        _defineExecCommandImage : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreateimage: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter link to image', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<img src=\"' + url + '\" />');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacreateyoutube","        * @method _defineExecCommandYouTube","        * @private","        */","        _defineExecCommandYouTube : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreateyoutube: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter link to image', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                    videoitempos = url.indexOf('watch?v=');","                                    if (videoitempos!==-1) {","                                        videoitem = url.substring(url.videoitempos+8);","                                        execCommandInstance.get('host').execCommand('inserthtml', '<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/' + videoitem + '\" frameborder=\"0\" allowfullscreen></iframe>');","                                    }","                            }","                        }","                        return a;","                    }","                });","            }","        }","","    }, {","        NS : 'itsatoolbar',","        ATTRS : {","","            /**","             * @description Defines whether keyboard-enter will lead to P-tag. Default=false (meaning that BR's will be created)","             * @attribute paraSupport","             * @type Boolean","            */","            paraSupport : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description The sourceNode that holds the Toolbar. Could be an empty DIV.<br>","             * If not defined, than the Toolbar will be created just above the Editor.","             * By specifying the srcNode, one could create the Toolbar on top of the page, regardless of the Editor's position","             * @attribute srcNode","             * @type Y.Node ","            */","            srcNode : {","                value: null,","                writeOnce: 'initOnly',","                setter: function(val) {","                    return Y.one(val);","                },","                validator: function(val) {","                    return Y.one(val);","                }","            },","","            /**","             * @description The size of the buttons<br>","             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>","             * Default = 2","             * @attribute btnSize","             * @type int","            */","            btnSize : {","                value: 2,","                validator: function(val) {","                    return (Lang.isNumber(val) && (val>0) && (val<4));","                }","            },","","            /**","             * @description The amount of headerlevels that can be selected<br>","             * Should be a value from 1-9<br>","             * Default = 6","             * @attribute headerLevels","             * @type int","            */","            headerLevels : {","                value: 6,","                validator: function(val) {","                    return (Lang.isNumber(val) && (val>0) && (val<10));","                }","            },","","            /**","             * @description The fontfamilies that can be selected.<br>","             * Be aware to supply fontFamilies that are supported by the browser.<br>","             * Typically usage is the standard families extended by some custom fonts.<br>","             * @attribute fontFamilies","             * @type Array [String]","            */","            fontFamilies : {","                value: [","                    'Arial',","                    'Arial Black',","                    'Comic Sans MS',","                    'Courier New',","                    'Lucida Console',","                    'Tahoma',","                    'Times New Roman',","                    'Trebuchet MS',","                    'Verdana'","                ],","                validator: function(val) {","                    return (Lang.isArray(val));","                }","            },","","            /**","             * @description Whether the button fontfamily is available<br>","             * Default = true","             * @attribute btnFontfamily","             * @type Boolean","            */","            btnFontfamily : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button fontsize is available<br>","             * Default = true","             * @attribute btnFontsize","             * @type Boolean","            */","            btnFontsize : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button headers is available<br>","             * because this function doesn't work well on all browsers, it is set of by default.<br>","             * Is something to work on in fututr releases. It works within firefox though.","             * Default = false","             * @attribute btnHeader","             * @type Boolean","            */","            btnHeader : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button bold is available<br>","             * Default = true","             * @attribute btnBold","             * @type Boolean","            */","            btnBold : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button italic is available<br>","             * Default = true","             * @attribute btnItalic","             * @type Boolean","            */","            btnItalic : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button underline is available<br>","             * Default = true","             * @attribute btnUnderline","             * @type Boolean","            */","            btnUnderline : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group align is available<br>","             * Default = true","             * @attribute grpAlign","             * @type Boolean","            */","            grpAlign : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button justify is available<br>","             * will only be shown in combination with grpalign","             * Default = true","             * @attribute btnJustify","             * @type Boolean","            */","            btnJustify : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group sub/superscript is available<br>","             * Default = true","             * @attribute grpSubsuper","             * @type Boolean","            */","            grpSubsuper : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button textcolor is available<br>","             * Default = true","             * @attribute btnTextcolor","             * @type Boolean","            */","            btnTextcolor : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button markcolor is available<br>","             * Default = true","             * @attribute btnMarkcolor","             * @type Boolean","            */","            btnMarkcolor : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group indent is available<br>","             * Default = true","             * @attribute grpIndent","             * @type Boolean","            */","            grpIndent : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group lists is available<br>","             * Default = true","             * @attribute grpLists","             * @type Boolean","            */","            grpLists : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","/*","            btnremoveformat : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","            btnhiddenelements : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","*/","","            /**","             * @description Whether the group undo/redo is available<br>","             * Default = true","             * @attribute grpUndoredo","             * @type Boolean","            */","            grpUndoredo : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button email is available<br>","             * Default = true","             * @attribute btnEmail","             * @type Boolean","            */","            btnEmail : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button hyperlink is available<br>","             * Default = true","             * @attribute btnHyperlink","             * @type Boolean","            */","            btnHyperlink : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button image is available<br>","             * because this code needs to be developed in a better way, the function is disabled by default.<br>","             * It works in a simple way though.","             * Default = false","             * @attribute btnImage","             * @type Boolean","            */","            btnImage : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button video is available<br>","             * because this code needs to be developed in a better way, the function is disabled by default.<br>","             * It works in a simple way though. The end-user should enter a youtube-link once they click on this button.","             * Default = false","             * @attribute btnVideo","             * @type Boolean","            */","            btnVideo : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description The colorpallet to use<br>","             * @attribute colorPallet","             * @type Array (String)","            */","            colorPallet : {","                value : [","                    '#111111',","                    '#2D2D2D',","                    '#434343',","                    '#5B5B5B',","                    '#737373',","                    '#8B8B8B',","                    '#A2A2A2',","                    '#B9B9B9',","                    '#000000',","                    '#D0D0D0',","                    '#E6E6E6',","                    '#FFFFFF',","                    '#BFBF00',","                    '#FFFF00',","                    '#FFFF40',","                    '#FFFF80',","                    '#FFFFBF',","                    '#525330',","                    '#898A49',","                    '#AEA945',","                    '#7F7F00',","                    '#C3BE71',","                    '#E0DCAA',","                    '#FCFAE1',","                    '#60BF00',","                    '#80FF00',","                    '#A0FF40',","                    '#C0FF80',","                    '#DFFFBF',","                    '#3B5738',","                    '#668F5A',","                    '#7F9757',","                    '#407F00',","                    '#8A9B55',","                    '#B7C296',","                    '#E6EBD5',","                    '#00BF00',","                    '#00FF80',","                    '#40FFA0',","                    '#80FFC0',","                    '#BFFFDF',","                    '#033D21',","                    '#438059',","                    '#7FA37C',","                    '#007F40',","                    '#8DAE94',","                    '#ACC6B5',","                    '#DDEBE2',","                    '#00BFBF',","                    '#00FFFF',","                    '#40FFFF',","                    '#80FFFF',","                    '#BFFFFF',","                    '#033D3D',","                    '#347D7E',","                    '#609A9F',","                    '#007F7F',","                    '#96BDC4',","                    '#B5D1D7',","                    '#E2F1F4',","                    '#0060BF',","                    '#0080FF',","                    '#40A0FF',","                    '#80C0FF',","                    '#BFDFFF',","                    '#1B2C48',","                    '#385376',","                    '#57708F',","                    '#00407F',","                    '#7792AC',","                    '#A8BED1',","                    '#DEEBF6',","                    '#0000BF',","                    '#0000FF',","                    '#4040FF',","                    '#8080FF',","                    '#BFBFFF',","                    '#212143',","                    '#373E68',","                    '#444F75',","                    '#00007F',","                    '#585E82',","                    '#8687A4',","                    '#D2D1E1',","                    '#6000BF',","                    '#8000FF',","                    '#A040FF',","                    '#C080FF',","                    '#DFBFFF',","                    '#302449',","                    '#54466F',","                    '#655A7F',","                    '#40007F',","                    '#726284',","                    '#9E8FA9',","                    '#DCD1DF',","                    '#BF00BF',","                    '#FF00FF',","                    '#FF40FF',","                    '#FF80FF',","                    '#FFBFFF',","                    '#4A234A',","                    '#794A72',","                    '#936386',","                    '#7F007F',","                    '#9D7292',","                    '#C0A0B6',","                    '#ECDAE5',","                    '#BF005F',","                    '#FF007F',","                    '#FF409F',","                    '#FF80BF',","                    '#FFBFDF',","                    '#451528',","                    '#823857',","                    '#A94A76',","                    '#7F003F',","                    '#BC6F95',","                    '#D8A5BB',","                    '#F7DDE9',","                    '#C00000',","                    '#FF0000',","                    '#FF4040',","                    '#FF8080',","                    '#FFC0C0',","                    '#441415',","                    '#82393C',","                    '#AA4D4E',","                    '#800000',","                    '#BC6E6E',","                    '#D8A3A4',","                    '#F8DDDD',","                    '#BF5F00',","                    '#FF7F00',","                    '#FF9F40',","                    '#FFBF80',","                    '#FFDFBF',","                    '#482C1B',","                    '#855A40',","                    '#B27C51',","                    '#7F3F00',","                    '#C49B71',","                    '#E1C4A8',","                    '#FDEEE0'","                ],","                validator: function(val) {","                    return Lang.isArray(val) ;","                }","","            }","        }","    }",");","","","}, 'gallery-2012.09.26-20-36' ,{requires:['plugin', 'base-build', 'node-base', 'editor', 'event-delegate', 'event-custom', 'cssbutton', 'gallery-itsaselectlist'], skinnable:true});"];
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].lines = {"1":0,"3":0,"24":0,"262":0,"303":0,"304":0,"306":0,"308":0,"309":0,"313":0,"318":0,"331":0,"332":0,"333":0,"334":0,"335":0,"336":0,"337":0,"338":0,"339":0,"340":0,"343":0,"358":0,"365":0,"366":0,"367":0,"368":0,"370":0,"373":0,"374":0,"375":0,"376":0,"379":0,"380":0,"381":0,"383":0,"392":0,"396":0,"398":0,"399":0,"400":0,"401":0,"403":0,"404":0,"405":0,"406":0,"417":0,"421":0,"423":0,"424":0,"426":0,"427":0,"428":0,"429":0,"432":0,"433":0,"434":0,"435":0,"438":0,"439":0,"440":0,"441":0,"444":0,"445":0,"446":0,"447":0,"459":0,"462":0,"463":0,"464":0,"466":0,"477":0,"478":0,"490":0,"500":0,"502":0,"503":0,"504":0,"506":0,"508":0,"526":0,"529":0,"530":0,"531":0,"532":0,"533":0,"534":0,"535":0,"536":0,"537":0,"540":0,"541":0,"542":0,"543":0,"544":0,"545":0,"567":0,"569":0,"570":0,"571":0,"572":0,"592":0,"594":0,"595":0,"613":0,"620":0,"621":0,"622":0,"623":0,"625":0,"626":0,"627":0,"628":0,"629":0,"630":0,"631":0,"634":0,"667":0,"669":0,"670":0,"671":0,"672":0,"675":0,"677":0,"678":0,"679":0,"681":0,"682":0,"683":0,"684":0,"685":0,"686":0,"688":0,"689":0,"699":0,"702":0,"703":0,"704":0,"705":0,"706":0,"718":0,"723":0,"724":0,"726":0,"727":0,"730":0,"731":0,"733":0,"734":0,"736":0,"737":0,"739":0,"740":0,"742":0,"746":0,"747":0,"749":0,"759":0,"760":0,"761":0,"771":0,"772":0,"773":0,"774":0,"775":0,"776":0,"777":0,"778":0,"779":0,"780":0,"791":0,"794":0,"795":0,"796":0,"798":0,"799":0,"801":0,"802":0,"803":0,"805":0,"817":0,"820":0,"821":0,"822":0,"823":0,"835":0,"837":0,"838":0,"839":0,"852":0,"854":0,"855":0,"859":0,"860":0,"861":0,"862":0,"875":0,"877":0,"890":0,"898":0,"899":0,"900":0,"901":0,"902":0,"903":0,"904":0,"905":0,"907":0,"919":0,"931":0,"933":0,"934":0,"935":0,"936":0,"939":0,"941":0,"942":0,"943":0,"944":0,"947":0,"949":0,"950":0,"951":0,"952":0,"953":0,"954":0,"955":0,"958":0,"959":0,"960":0,"964":0,"974":0,"984":0,"985":0,"986":0,"987":0,"988":0,"990":0,"991":0,"996":0,"997":0,"1002":0,"1003":0,"1004":0,"1005":0,"1006":0,"1010":0,"1015":0,"1016":0,"1017":0,"1018":0,"1019":0,"1020":0,"1025":0,"1026":0,"1027":0,"1028":0,"1034":0,"1035":0,"1036":0,"1037":0,"1042":0,"1043":0,"1044":0,"1049":0,"1050":0,"1051":0,"1056":0,"1057":0,"1063":0,"1071":0,"1079":0,"1084":0,"1085":0,"1090":0,"1094":0,"1098":0,"1099":0,"1100":0,"1102":0,"1103":0,"1108":0,"1109":0,"1110":0,"1111":0,"1112":0,"1113":0,"1115":0,"1116":0,"1119":0,"1124":0,"1125":0,"1126":0,"1127":0,"1128":0,"1129":0,"1131":0,"1132":0,"1135":0,"1140":0,"1141":0,"1142":0,"1146":0,"1147":0,"1148":0,"1150":0,"1152":0,"1153":0,"1155":0,"1160":0,"1161":0,"1162":0,"1167":0,"1168":0,"1170":0,"1172":0,"1174":0,"1179":0,"1180":0,"1181":0,"1191":0,"1192":0,"1194":0,"1196":0,"1197":0,"1198":0,"1199":0,"1200":0,"1201":0,"1202":0,"1206":0,"1211":0,"1212":0,"1213":0,"1218":0,"1219":0,"1220":0,"1227":0,"1228":0,"1231":0,"1234":0,"1240":0,"1250":0,"1251":0,"1253":0,"1255":0,"1256":0,"1257":0,"1258":0,"1259":0,"1260":0,"1261":0,"1265":0,"1271":0,"1272":0,"1273":0,"1287":0,"1288":0,"1292":0,"1293":0,"1294":0,"1295":0,"1297":0,"1298":0,"1299":0,"1301":0,"1304":0,"1313":0,"1314":0,"1316":0,"1324":0,"1326":0,"1327":0,"1329":0,"1333":0,"1334":0,"1335":0,"1337":0,"1342":0,"1344":0,"1358":0,"1359":0,"1361":0,"1367":0,"1368":0,"1369":0,"1370":0,"1371":0,"1373":0,"1375":0,"1376":0,"1378":0,"1380":0,"1381":0,"1384":0,"1385":0,"1386":0,"1401":0,"1402":0,"1404":0,"1411":0,"1412":0,"1413":0,"1414":0,"1415":0,"1417":0,"1418":0,"1419":0,"1422":0,"1424":0,"1425":0,"1427":0,"1429":0,"1430":0,"1433":0,"1434":0,"1435":0,"1451":0,"1452":0,"1454":0,"1460":0,"1461":0,"1462":0,"1463":0,"1464":0,"1467":0,"1469":0,"1470":0,"1472":0,"1474":0,"1475":0,"1478":0,"1479":0,"1480":0,"1496":0,"1497":0,"1499":0,"1505":0,"1506":0,"1507":0,"1508":0,"1509":0,"1512":0,"1514":0,"1515":0,"1517":0,"1519":0,"1521":0,"1524":0,"1525":0,"1526":0,"1539":0,"1540":0,"1544":0,"1553":0,"1554":0,"1555":0,"1556":0,"1557":0,"1558":0,"1559":0,"1560":0,"1561":0,"1562":0,"1563":0,"1565":0,"1566":0,"1567":0,"1569":0,"1570":0,"1571":0,"1572":0,"1578":0,"1581":0,"1593":0,"1594":0,"1596":0,"1606":0,"1607":0,"1608":0,"1609":0,"1610":0,"1611":0,"1612":0,"1613":0,"1614":0,"1615":0,"1616":0,"1617":0,"1618":0,"1620":0,"1621":0,"1622":0,"1624":0,"1625":0,"1626":0,"1627":0,"1633":0,"1636":0,"1648":0,"1649":0,"1651":0,"1660":0,"1661":0,"1662":0,"1663":0,"1664":0,"1665":0,"1666":0,"1667":0,"1668":0,"1669":0,"1670":0,"1672":0,"1673":0,"1674":0,"1676":0,"1677":0,"1678":0,"1679":0,"1685":0,"1688":0,"1700":0,"1701":0,"1703":0,"1712":0,"1713":0,"1714":0,"1715":0,"1716":0,"1717":0,"1718":0,"1719":0,"1720":0,"1721":0,"1722":0,"1724":0,"1725":0,"1726":0,"1728":0,"1729":0,"1730":0,"1731":0,"1737":0,"1738":0,"1739":0,"1740":0,"1744":0,"1762":0,"1777":0,"1780":0,"1794":0,"1808":0,"1832":0,"1845":0,"1858":0,"1873":0,"1886":0,"1899":0,"1912":0,"1925":0,"1939":0,"1952":0,"1965":0,"1978":0,"1991":0,"2004":0,"2031":0,"2044":0,"2057":0,"2072":0,"2087":0,"2244":0};
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].functions = {"initializer:302":0,"_render:330":0,"_getCursorRef:357":0,"(anonymous 2):405":0,"_removeCursorRef:391":0,"(anonymous 3):428":0,"(anonymous 4):434":0,"(anonymous 5):440":0,"(anonymous 6):446":0,"_clearEmptyFontRef:416":0,"_setCursorAtRef:458":0,"_createBackupCursorRef:476":0,"_getBackupCursorRef:489":0,"sync:498":0,"addButton:525":0,"addSyncButton:566":0,"addToggleButton:591":0,"addButtongroup:612":0,"(anonymous 7):671":0,"addSelectlist:666":0,"destructor:698":0,"_renderUI:717":0,"_bindUI:758":0,"_defineCustomExecCommands:770":0,"_handleBtnClick:790":0,"_handleSelectChange:816":0,"_execCommandFromData:834":0,"execCommand:851":0,"_hasSelection:874":0,"_checkInbetweenSelector:889":0,"_getActiveHeader:918":0,"(anonymous 8):990":0,"(anonymous 9):1005":0,"(anonymous 10):1019":0,"(anonymous 11):1035":0,"(anonymous 12):1043":0,"(anonymous 13):1050":0,"syncFunc:1062":0,"syncFunc:1070":0,"syncFunc:1078":0,"syncFunc:1089":0,"(anonymous 14):1099":0,"(anonymous 15):1102":0,"(anonymous 16):1115":0,"(anonymous 17):1131":0,"(anonymous 18):1147":0,"(anonymous 19):1152":0,"(anonymous 20):1161":0,"(anonymous 21):1180":0,"(anonymous 22):1212":0,"(anonymous 23):1219":0,"(anonymous 24):1233":0,"customFunc:1230":0,"(anonymous 25):1239":0,"_initializeButtons:973":0,"_filter_rgb:1286":0,"itsaheading:1315":0,"_defineExecCommandHeader:1312":0,"itsafontfamily:1360":0,"_defineExecCommandFontFamily:1355":0,"itsafontsize:1403":0,"_defineExecCommandFontSize:1398":0,"itsafontcolor:1453":0,"_defineExecCommandFontColor:1448":0,"itsamarkcolor:1498":0,"_defineExecCommandMarkColor:1493":0,"itsacreatehyperlink:1543":0,"_defineExecCommandHyperlink:1538":0,"itsacreatemaillink:1595":0,"_defineExecCommandMaillink:1592":0,"itsacreateimage:1650":0,"_defineExecCommandImage:1647":0,"itsacreateyoutube:1702":0,"_defineExecCommandYouTube:1699":0,"validator:1761":0,"setter:1776":0,"validator:1779":0,"validator:1793":0,"validator:1807":0,"validator:1831":0,"validator:1844":0,"validator:1857":0,"validator:1872":0,"validator:1885":0,"validator:1898":0,"validator:1911":0,"validator:1924":0,"validator:1938":0,"validator:1951":0,"validator:1964":0,"validator:1977":0,"validator:1990":0,"validator:2003":0,"validator:2030":0,"validator:2043":0,"validator:2056":0,"validator:2071":0,"validator:2086":0,"validator:2243":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].coveredLines = 573;
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].coveredFunctions = 100;
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
    ITSA_TMPREFNODE = "<img id='itsatoolbar-tmpref' />",
    ITSA_REFEMPTYCONTENT = "<img class='itsatoolbar-tmpempty' src='itsa-buttonicons-2012-08-15.png' width=0 height=0>",
    ITSA_REFNODE = "<span id='itsatoolbar-ref'></span>",
    ITSA_REFSELECTION = 'itsa-selection-tmp',
    ITSA_FONTSIZENODE = 'itsa-fontsize',
    ITSA_FONTFAMILYNODE = 'itsa-fontfamily',
    ITSA_FONTCOLORNODE = 'itsa-fontcolor',
    ITSA_MARKCOLORNODE = 'itsa-markcolor';

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
 * @private
 * @type Boolean
 */

/**
 * Timer: used internally to clean up empty fontsize-markings<br>
 * @property _timerClearEmptyFontRef
 * @private
 * @type Object
 */

/**
 * Reference to a backup cursorposition<br>
 * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.
 * Reference is made on a show-event of the selectlist.
 * @property _backupCursorRef
 * @private
 * @type Y.Node
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

_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 262);
Y.namespace('Plugin').ITSAToolbar = Y.Base.create('itsatoolbar', Y.Plugin.Base, [], {

        editor : null,
        editorY : null,
        editorNode : null,
        containerNode : null,
        toolbarNode : null,
        _destroyed : false,
        _timerClearEmptyFontRef : null,
        _backupCursorRef : null,

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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "initializer", 302);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 303);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 304);
instance.editor = instance.get('host');
            // need to make sure we can use execCommand, so do not render before the frame exists.
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 306);
if (instance.editor.frame && instance.editor.frame.get('node')) {instance._render();}
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 308);
var delayIE = false;
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 309);
if (delayIE && (Y.UA.ie>0)) {
                    // didn't find out yet: IE stops creating the editorinstance when pluggedin too soon!
                    // GOTTA check out
                    // at the time being: delaying
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 313);
Y.later(250, instance, instance._render);
                }
                else {
                    // do not subscribe to the frame:ready, but to the ready-event
                    // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 318);
instance.editor.on('ready', instance._render, instance);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_render", 330);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 331);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 332);
if (!instance._destroyed) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 333);
instance.editorY = instance.editor.getInstance();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 334);
instance.editorNode = instance.editor.frame.get('node');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 335);
instance.containerNode = instance.editorNode.get('parentNode');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 336);
instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 337);
instance.editor.plug(Y.Plugin.ExecCommand);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 338);
instance._defineCustomExecCommands();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 339);
instance._renderUI();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 340);
instance._bindUI();
                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object
                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 343);
instance.editor.frame.focus(Y.bind(instance.sync, instance));
            }
        },

        /**
         * Returns node at cursorposition<br>
         * This can be a selectionnode, or -in case of no selection- a new tmp-node (empty span) that will be created to serve as reference.
         * In case of selection, there will always be made a tmp-node as placeholder. But in that case, the tmp-node will be just before the returned node.
         * @method _getCursorRef
         * @private
         * @param {Boolean} [selectionIfAvailable] do return the selectionnode if a selection is made. If set to false, then always just the cursornode will be returned. 
         * Which means -in case of selection- that the cursornode exists as a last child of the selection. Default = false.
         * @returns {Y.Node} created empty referencenode
        */
        _getCursorRef : function(selectionIfAvailable) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getCursorRef", 357);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 358);
var instance = this,
                node,
                tmpnode,
                sel,
                out;
            // insert cursor and use that node as the selected node
            // first remove previous
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 365);
instance._removeCursorRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 366);
sel = new instance.editorY.EditorSelection();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 367);
out = sel.getSelected();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 368);
if (!sel.isCollapsed && out.size()) {
                // We have a selection
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 370);
node = out.item(0);
            }
            // node only exist when selection is available
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 373);
if (node) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 374);
node.addClass(ITSA_REFSELECTION);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 375);
node.insert(ITSA_REFNODE, 'after');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 376);
if (!(Lang.isBoolean(selectionIfAvailable) && selectionIfAvailable)) {node = instance.editorY.one('#itsatoolbar-ref');}
            }
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 379);
instance.editor.focus();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 380);
instance.execCommand('inserthtml', ITSA_REFNODE);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 381);
node = instance.editorY.one('#itsatoolbar-ref');
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 383);
return node;
        },

        /**
         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef
         * @method _removeCursorRef
         * @private
        */
        _removeCursorRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_removeCursorRef", 391);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 392);
var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 396);
useY = instance.editorY ? instance.editorY : Y;
            // first cleanup single referencenode
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 398);
node = useY.all('#itsatoolbar-ref');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 399);
if (node) {node.remove();}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 400);
node = useY.all('#itsatoolbar-tmpempty');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 401);
if (node) {node.remove();}
            // next clean up all selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 403);
node = useY.all('.' + ITSA_REFSELECTION);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 404);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 405);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 2)", 405);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 406);
node.replace(node.getHTML());
                });
            }
        },

        /**
         * Removes temporary created font-size-ref-Node that might have been created by inserting fontsizes
         * @method _clearEmptyFontRef
         * @private
        */
        _clearEmptyFontRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_clearEmptyFontRef", 416);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 417);
var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 421);
useY = instance.editorY ? instance.editorY : Y;
            // first cleanup single referencenode
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 423);
node = useY.all('.itsatoolbar-tmpempty');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 424);
if (node) {node.remove();}
            // next clean up all references that are empty
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 426);
node = useY.all('.itsa-fontsize');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 427);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 428);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 3)", 428);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 429);
if (node.getHTML()==='') {node.remove();}
                });
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 432);
node = useY.all('.itsa-fontfamily');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 433);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 434);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 4)", 434);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 435);
if (node.getHTML()==='') {node.remove();}
                });
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 438);
node = useY.all('.itsa-fontcolor');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 439);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 440);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 5)", 440);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 441);
if (node.getHTML()==='') {node.remove();}
                });
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 444);
node = useY.all('.itsa-markcolor');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 445);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 446);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 6)", 446);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 447);
if (node.getHTML()==='') {node.remove();}
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_setCursorAtRef", 458);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 459);
var instance = this,
                sel,
                node = instance.editorY.one('#itsatoolbar-ref');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 462);
if (node) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 463);
sel = new instance.editorY.EditorSelection();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 464);
sel.selectNode(node);
                // DO NOT call _removeCursorref straight away --> it will make Opera crash
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 466);
Y.later(100, instance, instance._removeCursorRef);
            }
        },

        /**
         * Creates a reference at cursorposition for backupusage<br>
         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.
         * @method _createBackupCursorRef
         * @private
        */
        _createBackupCursorRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_createBackupCursorRef", 476);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 477);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 478);
instance._backupCursorRef = instance._getCursorRef(true);
        },

        /**
         * Returns backupnode at cursorposition that is created by _createBackupCursorRef()<br>
         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.
         * So descendenst of ItsaSelectlist should refer to this cursorref.
         * @method _getBackupCursorRef
         * @private
         * @returns {Y.Node} created empty referencenode
        */
        _getBackupCursorRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getBackupCursorRef", 489);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 490);
return this._backupCursorRef;
        },

        /**
         * Syncs the toolbar's status with the editor.<br>
         * @method sync
         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.
        */
        sync : function(e) {
            // syncUI will sync the toolbarstatus with the editors cursorposition
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "sync", 498);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 500);
var instance = this,
                cursorRef;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 502);
if (!(e && e.changedNode)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 503);
cursorRef = instance._getCursorRef(false);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 504);
if (!e) {e = {changedNode: cursorRef};}
                else {e.changedNode = cursorRef;}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 506);
Y.later(250, instance, instance._removeCursorRef);
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 508);
instance.toolbarNode.fire('itsatoolbar:statusChange', e);
        },

        /**
         * Creates a new Button on the Toolbar. By default at the end of the toolbar.
         * @method addButton
         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addButton", 525);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 526);
var instance = this,
                buttonNode,
                buttonInnerNode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 529);
buttonNode = Node.create(ITSA_BTNNODE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 530);
buttonNode.addClass(ITSA_BUTTON);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 531);
if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
            else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 532);
if (Lang.isObject(execCommand)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 533);
if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 534);
if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 535);
if (Lang.isFunction(execCommand.customFunc)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 536);
buttonNode.addClass(ITSA_BTNCUSTOMFUNC);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 537);
buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);
                }
            }}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 540);
if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 541);
buttonInnerNode = Node.create(ITSA_BTNINNERNODE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 542);
buttonInnerNode.addClass(iconClass);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 543);
buttonNode.append(buttonInnerNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 544);
instance.toolbarNode.append(buttonNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 545);
return buttonNode;
        },

        /**
         * Creates a new syncButton on the Toolbar. By default at the end of the toolbar.<br>
         * A syncButton is just like a normal toolbarButton, with the exception that the editor can sync it's status, which cannot be done with a normal button. 
         * Typically used in situations like a hyperlinkbutton: it never stays pressed, but when the cursos is on a hyperlink, he buttons look will change.
         * @method addSyncButton
         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addSyncButton", 566);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 567);
var instance = this,
                buttonNode = instance.addButton(iconClass, execCommand, indent, position);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 569);
if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 570);
instance.toolbarNode.addTarget(buttonNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 571);
if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(syncFunc, context || instance));}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 572);
return buttonNode;
        },

        /**
         * Creates a new toggleButton on the Toolbar. By default at the end of the toolbar.
         * @method addToggleButton
         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addToggleButton", 591);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 592);
var instance = this,
                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 594);
buttonNode.addClass(ITSA_BTNTOGGLE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 595);
return buttonNode;
        },

        /**
         * Creates a group of toggleButtons on the Toolbar which are related to each-other. For instance when you might need 3 related buttons: leftalign, center, rightalign.
         * Position is by default at the end of the toolbar.<br>
         * @method addButtongroup
         * @param {Array} buttons Should consist of objects with two fields:<br>
         * <i>- iconClass</i> (String): defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.
         * <i>- command</i> (String): the execcommand that will be executed on buttonclick
         * <i>- [value]</i> (String) optional: additional value for the execcommand
         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton)
         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
         * @return {Y.Node} reference to the first buttonnode of the created buttongroup
        */
        addButtongroup : function(buttons, indent, position) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addButtongroup", 612);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 613);
var instance = this,
                buttonGroup = Y.guid(),
                button,
                buttonNode,
                returnNode = null,
                execCommand,
                i;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 620);
for (i=0; i<buttons.length; i++) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 621);
button = buttons[i];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 622);
if (button.iconClass && button.command) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 623);
if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}
                    else {execCommand = button.command;}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 625);
buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position) ? position+i : null);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 626);
buttonNode.addClass(ITSA_BTNGROUP);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 627);
buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 628);
buttonNode.setData('buttongroup', buttonGroup);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 629);
instance.toolbarNode.addTarget(buttonNode);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 630);
if (Lang.isFunction(button.syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(button.syncFunc, button.context || instance));}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 631);
if (!returnNode) {returnNode = buttonNode;}
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 634);
return returnNode;
        },

        /**
         * Creates a selectList on the Toolbar. By default at the end of the toolbar.
         * When fired, the event-object returnes with 2 fields:<br>
         * <i>- e.value</i>: value of selected item<br>
         * <i>- e.index</i>: indexnr of the selected item<br>.
         * CAUTION: when using a selectlist, you <u>cannot</u? use standard execCommands. That will not work in most browsers, because the focus will be lost. <br>
         * Instead, create your customexecCommand and use cursorrefference <i>_getBackupCursorRef()</i>: see example <i>_defineExecCommandFontFamily()</i>
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addSelectlist", 666);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 667);
var instance = this,
                selectlist;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 669);
config = Y.merge(config, {items: items, defaultButtonText: ''});
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 670);
selectlist = new Y.ITSASelectList(config);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 671);
selectlist.after('render', function(e, execCommand, syncFunc, context, indent){
                _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 7)", 671);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 672);
var instance = this,
                    selectlist = e.currentTarget,
                    buttonNode = selectlist.buttonNode;
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 675);
if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
                else {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 677);
if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}                    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 678);
if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}                    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 679);
if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}                    
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 681);
if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 682);
instance.toolbarNode.addTarget(buttonNode);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 683);
selectlist.on('show', instance._createBackupCursorRef, instance);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 684);
selectlist.on('selectChange', instance._handleSelectChange, instance);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 685);
if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.rbind(syncFunc, context || instance));}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 686);
instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);
            }, instance, execCommand, syncFunc, context, indent);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 688);
selectlist.render(instance.toolbarNode);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 689);
return selectlist;
        },


        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
        */
        destructor : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "destructor", 698);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 699);
var instance = this,
                srcNode = instance.get('srcNode');
             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 702);
instance._destroyed = true;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 703);
instance._removeCursorRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 704);
if (instance._timerClearEmptyFontRef) {instance._timerClearEmptyFontRef.cancel();}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 705);
instance._clearEmptyFontRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 706);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_renderUI", 717);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 718);
var instance = this,
                correctedHeight = 0,
                srcNode = instance.get('srcNode'),
                btnSize = instance.get('btnSize');
            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 723);
instance.toolbarNode = Node.create(ITSA_TOOLBAR_TEMPLATE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 724);
if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}
            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 726);
if (srcNode) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 727);
srcNode.prepend(instance.toolbarNode);
            }
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 730);
instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 731);
switch (instance.get('btnSize')) {
                    case 1:
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 733);
correctedHeight = -40;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 734);
break;
                    case 2: 
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 736);
correctedHeight = -44;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 737);
break;
                    case 3: 
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 739);
correctedHeight = -46;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 740);
break;
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 742);
correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 746);
instance.editorNode.set('height', correctedHeight);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 747);
instance.editorNode.insert(instance.toolbarNode, 'before');
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 749);
instance._initializeButtons();
        },
        
        /**
         * Binds events when there is a cursorstatus changes in the editor
         *
         * @method _bindUI
         * @private
        */
        _bindUI : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_bindUI", 758);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 759);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 760);
instance.editor.on('nodeChange', instance.sync, instance);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 761);
instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance);
        },

        /**
         * Defines all custom execCommands
         *
         * @method _defineCustomExecCommands
         * @private
        */
        _defineCustomExecCommands : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineCustomExecCommands", 770);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 771);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 772);
instance._defineExecCommandHeader();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 773);
instance._defineExecCommandFontFamily();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 774);
instance._defineExecCommandFontSize();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 775);
instance._defineExecCommandFontColor();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 776);
instance._defineExecCommandMarkColor();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 777);
instance._defineExecCommandHyperlink();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 778);
instance._defineExecCommandMaillink();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 779);
instance._defineExecCommandImage();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 780);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_handleBtnClick", 790);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 791);
var instance = this,
                node = e.currentTarget;
            // only execute for .itsa-button, not for all buttontags    
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 794);
if (node.hasClass(ITSA_BUTTON)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 795);
if (node.hasClass(ITSA_BTNTOGGLE)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 796);
node.toggleClass(ITSA_BTNPRESSED);
                }
                else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 798);
if (node.hasClass(ITSA_BTNSYNC)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 799);
node.toggleClass(ITSA_BTNACTIVE, true);
                }
                else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 801);
if (node.hasClass(ITSA_BTNGROUP)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 802);
instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 803);
node.toggleClass(ITSA_BTNPRESSED, true);
                }}}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 805);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_handleSelectChange", 816);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 817);
var selectButtonNode,
                restoreCommand,
                execCommand;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 820);
selectButtonNode = e.currentTarget.buttonNode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 821);
restoreCommand = selectButtonNode.getData('restoreCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 822);
execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 823);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_execCommandFromData", 834);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 835);
var execCommand,
                execValue;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 837);
execCommand = buttonNode.getData('execCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 838);
execValue = buttonNode.getData('execValue');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 839);
this.execCommand(execCommand, execValue);
        },

        /**
         * Performs a execCommand that will take into account the editors cursorposition<br>
         * This means that when no selection is made, the operation still works: you can preset an command this way.<br>
         * It also makes 'inserthtml' work with all browsers.
         *
         * @method execCommand
         * @param {String} command The execCommand
         * @param {String} [value] additional commandvalue
        */
        execCommand: function(command, value) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "execCommand", 851);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 852);
var instance = this,
                tmpnode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 854);
instance.editor.focus();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 855);
if (command==='inserthtml') {
                // we need a tmp-ref which is an img-element instead of a span-element --> inserthtml of span does not work in chrome and safari
                // but inserting img does, which can replaced afterwards
                // first a command that I don't understand: but we need this, because otherwise some browsers will replace <br> by <p> elements
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 859);
instance.editor._execCommand('createlink', '&nbsp;');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 860);
instance.editor.exec.command('inserthtml', ITSA_TMPREFNODE);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 861);
tmpnode = instance.editorY.one('#itsatoolbar-tmpref');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 862);
tmpnode.replace(value);
            }
            else {instance.editor.exec.command(command, value);}
        },

        /**
         * Checks whether there is a selection within the editor<br>
         *
         * @method _hasSelection
         * @private
         * @returns {Boolean} whether there is a selection
        */
        _hasSelection : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_hasSelection", 874);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 875);
var instance = this,
                sel = new instance.editorY.EditorSelection();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 877);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_checkInbetweenSelector", 889);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 890);
var instance = this,
                pattern = '<\\s*' + selector + '[^>]*>(.*?)<\\s*/\\s*' + selector  + '>',
                searchHeaderPattern = new RegExp(pattern, 'gi'),
                fragment,
                inbetween = false,
                refContent = instance.editorY.one('body').getHTML(),
                cursorid,
                cursorindex;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 898);
cursorid = cursornode.get('id');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 899);
cursorindex = refContent.indexOf(' id="' + cursorid + '"');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 900);
if (cursorindex===-1) {cursorindex = refContent.indexOf(" id='" + cursorid + "'");}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 901);
if (cursorindex===-1) {cursorindex = refContent.indexOf(" id=" + cursorid);}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 902);
fragment = searchHeaderPattern.exec(refContent);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 903);
while ((fragment !== null) && !inbetween) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 904);
inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 905);
fragment = searchHeaderPattern.exec(refContent); // next search
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 907);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getActiveHeader", 918);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 919);
var instance = this,
                pattern,
                searchHeaderPattern,
                fragment,
                nodeFound,
                cursorid,
                nodetag,
                headingNumber = 0,
                returnNode = null,
                checkNode,
                endpos,
                refContent;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 931);
if (cursornode) {    
                // node can be a header right away, or it can be a node within a header. Check for both
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 933);
nodetag = cursornode.get('tagName');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 934);
if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 935);
if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 936);
returnNode = cursornode;
                }
                else {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 939);
cursorid = cursornode.get('id');
                    // first look for endtag, to determine which headerlevel to search for
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 941);
pattern = ' id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h\\d>';
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 942);
searchHeaderPattern = new RegExp(pattern, 'gi');
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 943);
refContent = instance.editorY.one('body').getHTML();
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 944);
fragment = searchHeaderPattern.exec(refContent);


                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 947);
if (fragment !== null) {
                        // search again, looking for the right headernumber
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 949);
endpos = fragment.index+fragment[0].length-1;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 950);
headingNumber = refContent.substring(endpos-1, endpos);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 951);
pattern = '<\\s*h' + headingNumber + '[^>]*>(.*?)id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h' + headingNumber + '>';
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 952);
searchHeaderPattern = new RegExp(pattern, 'gi');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 953);
fragment = searchHeaderPattern.exec(refContent); // next search
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 954);
if (fragment !== null) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 955);
nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);
                        }
                    }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 958);
if (nodeFound) {
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 959);
checkNode = Node.create(nodeFound);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 960);
returnNode = instance.editorY.one('#' + checkNode.get('id'));
                    }
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 964);
return returnNode;
        },

        /**
         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.
         *
         * @method _initializeButtons
         * @private
        */
        _initializeButtons : function() { 
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_initializeButtons", 973);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 974);
var instance = this,
                i, r, g, b,
                item,
                items,
                bgcolor,
                docFontSize,
                bgcolors,
                buttons;

            // create fonffamily button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 984);
if (instance.get('btnFontfamily')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 985);
items = instance.get('fontFamilies');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 986);
for (i=0; i<items.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 987);
item = items[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 988);
items[i] = {text: "<span style='font-family:"+item+"'>"+item+"</span>", returnValue: item};
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 990);
instance.fontSelectlist = instance.addSelectlist(items, 'itsafontfamily', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 8)", 990);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 991);
var familyList = e.changedNode.getStyle('fontFamily'),
                        familyListArray = familyList.split(','),
                        activeFamily = familyListArray[0];
                    // some browsers place '' surround the string, when it should contain whitespaces.
                    // first remove them
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 996);
if ((activeFamily.substring(0,1)==="'") || (activeFamily.substring(0,1)==='"')) {activeFamily = activeFamily.substring(1, activeFamily.length-1);}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 997);
this.fontSelectlist.selectItemByValue(activeFamily, true, true);
                }, null, true, {buttonWidth: 145});
            }

            // create fontsize button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1002);
if (instance.get('btnFontsize')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1003);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1004);
for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1005);
instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 9)", 1005);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1006);
var fontSize = e.changedNode.getComputedStyle('fontSize'),
                        fontSizeNumber = parseFloat(fontSize),
                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);
                    // make sure not to display partial numbers    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1010);
this.sizeSelectlist.selectItemByValue(Lang.isNumber(fontSizeNumber) ? Math.round(fontSizeNumber)+fontsizeExt : '', true);
                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});
            }

            // create header button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1015);
if (instance.get('btnHeader')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1016);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1017);
items.push({text: 'No header', returnValue: 'none'});
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1018);
for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1019);
instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 10)", 1019);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1020);
var instance = this,
                        node = e.changedNode,
                        internalcall = (e.sender && e.sender==='itsaheading'),
                        activeHeader;
                    // prevent update when sync is called after heading has made changes. Check this through e.sender
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1025);
if (!internalcall) {
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1026);
activeHeader = instance._getActiveHeader(node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1027);
instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1028);
instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());
                    }
                }, null, true, {buttonWidth: 96});
            }

            // create bold button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1034);
if (instance.get('btnBold')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1035);
instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 11)", 1035);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1036);
var fontWeight = e.changedNode.getStyle('fontWeight');
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1037);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (Lang.isNumber(parseInt(fontWeight, 10)) ? (fontWeight>=600) : ((fontWeight==='bold') || (fontWeight==='bolder'))));
                }, null, true);
            }

            // create italic button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1042);
if (instance.get('btnItalic')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1043);
instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 12)", 1043);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1044);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));
                });
            }

            // create underline button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1049);
if (instance.get('btnUnderline')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1050);
instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 13)", 1050);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1051);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));
                });
            }

            // create align buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1056);
if (instance.get('grpAlign')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1057);
buttons = [
                    {
                        iconClass : instance.ICON_ALIGN_LEFT,
                        command : 'JustifyLeft',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1062);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1063);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_CENTER,
                        command : 'JustifyCenter',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1070);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1071);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_RIGHT,
                        command : 'JustifyRight',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1078);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1079);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));
                                    }
                    }
                ];
            // create justify button
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1084);
if (instance.get('btnJustify')) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1085);
buttons.push({
                        iconClass : instance.ICON_ALIGN_JUSTIFY,
                        command : 'JustifyFull',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1089);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1090);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));
                                    }
                    });
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1094);
instance.addButtongroup(buttons, true);
            }

            // create subsuperscript buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1098);
if (instance.get('grpSubsuper')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1099);
instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 14)", 1099);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1100);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));
                }, null, true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1102);
instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 15)", 1102);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1103);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));
                });
            }

            // create textcolor button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1108);
if (instance.get('btnTextcolor')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1109);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1110);
bgcolors = instance.get('colorPallet');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1111);
for (i=0; i<bgcolors.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1112);
bgcolor = bgcolors[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1113);
items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1115);
instance.colorSelectlist = instance.addSelectlist(items, 'itsafontcolor', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 16)", 1115);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1116);
var instance = this,
                        styleColor = e.changedNode.getStyle('color'),
                        hexColor = instance._filter_rgb(styleColor);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1119);
instance.colorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});
            }

            // create markcolor button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1124);
if (instance.get('btnMarkcolor')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1125);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1126);
bgcolors = instance.get('colorPallet');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1127);
for (i=0; i<bgcolors.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1128);
bgcolor = bgcolors[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1129);
items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1131);
instance.markcolorSelectlist = instance.addSelectlist(items, 'itsamarkcolor', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 17)", 1131);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1132);
var instance = this,
                        styleColor = e.changedNode.getStyle('backgroundColor'),
                        hexColor = instance._filter_rgb(styleColor);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1135);
instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});
            }

            // create indent buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1140);
if (instance.get('grpIndent')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1141);
instance.addButton(instance.ICON_INDENT, 'indent', true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1142);
instance.addButton(instance.ICON_OUTDENT, 'outdent');
            }

            // create list buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1146);
if (instance.get('grpLists')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1147);
instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 18)", 1147);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1148);
var instance = this,
                        node = e.changedNode;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1150);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));
                }, null, true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1152);
instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 19)", 1152);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1153);
var instance = this,
                        node = e.changedNode;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1155);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));
                });
            }

            // create email button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1160);
if (instance.get('btnEmail')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1161);
instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 20)", 1161);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1162);
var instance = this,
                        node = e.changedNode,
                        nodePosition,
                        isLink,
                        isEmailLink;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1167);
isLink =  instance._checkInbetweenSelector('a', node);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1168);
if (isLink) {
                        // check if its a normal href or a mailto:
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1170);
while (node && !node.test('a')) {node=node.get('parentNode');}
                        // be carefull: do not === /match() with text, that will fail
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1172);
isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');
                    }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1174);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));
                }, null, true);
            }

            // create hyperlink button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1179);
if (instance.get('btnHyperlink')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1180);
instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 21)", 1180);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1181);
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
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1191);
isLink =  instance._checkInbetweenSelector('a', node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1192);
if (isLink) {
                            // check if its a normal href or a mailto:
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1194);
while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1196);
href = node.get('href');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1197);
isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1198);
if (isHyperLink) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1199);
lastDot = href.lastIndexOf('.');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1200);
if (lastDot!==-1) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1201);
fileExt = href.substring(lastDot)+'.';
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1202);
isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1206);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));
                });
            }

            // create image button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1211);
if (instance.get('btnImage')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1212);
instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 22)", 1212);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1213);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));
                });
            }

            // create video button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1218);
if (instance.get('btnVideo')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1219);
instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 23)", 1219);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1220);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('iframe')));
                });
            }

//************************************************
// just for temporary local use ITS Asbreuk
// should NOT be part of the gallery
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1227);
if (false) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1228);
instance.addSyncButton(
                    instance.ICON_FILE,
                    {   customFunc: function(e) {
                            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "customFunc", 1230);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1231);
Y.config.cmas2plus.uploader.show(
                                null, 
                                Y.bind(function(e) {
                                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 24)", 1233);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1234);
this.editor.execCommand('itsacreatehyperlink', 'http://files.brongegevens.nl/' + Y.config.cmas2plusdomain + '/' + e.n);
                                }, this)
                            );
                        }
                    },
                    function(e) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 25)", 1239);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1240);
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
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1250);
isLink =  instance._checkInbetweenSelector('a', node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1251);
if (isLink) {
                            // check if its a normal href or a mailto:
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1253);
while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1255);
href = node.get('href');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1256);
isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1257);
if (isHyperLink) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1258);
lastDot = href.lastIndexOf('.');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1259);
if (lastDot!==-1) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1260);
fileExt = href.substring(lastDot)+'.';
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1261);
isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1265);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);
                    }
                );
            }
//************************************************

            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1271);
if (instance.get('grpUndoredo')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1272);
instance.addButton(instance.ICON_UNDO, 'undo', true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1273);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_filter_rgb", 1286);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1287);
if (css.toLowerCase().indexOf('rgb') != -1) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1288);
var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi"),
                    rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(','),
                    r, g, b;
            
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1292);
if (rgb.length === 5) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1293);
r = parseInt(rgb[1], 10).toString(16);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1294);
g = parseInt(rgb[2], 10).toString(16);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1295);
b = parseInt(rgb[3], 10).toString(16);

                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1297);
r = r.length === 1 ? '0' + r : r;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1298);
g = g.length === 1 ? '0' + g : g;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1299);
b = b.length === 1 ? '0' + b : b;

                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1301);
css = "#" + r + g + b;
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1304);
return css;
        },

        /**
        * Defines the execCommand itsaheading
        * @method _defineExecCommandHeader
        * @private
        */
        _defineExecCommandHeader : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandHeader", 1312);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1313);
if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1314);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsaheading: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsaheading", 1315);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1316);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef = itsatoolbar._getBackupCursorRef(),
                            activeHeader = itsatoolbar._getActiveHeader(noderef),
                            headingNumber = 0,
                            disableSelectbutton = false,
                            node;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1324);
if (val==='none') {
                            // want to clear heading
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1326);
if (activeHeader) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1327);
activeHeader.replace("<p>"+activeHeader.getHTML()+"</p>");
                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1329);
itsatoolbar.headerSelectlist.set('disabled', true);
                            }
                        } else {
                            // want to add or change a heading
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1333);
if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1334);
if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1335);
node = activeHeader ? activeHeader : noderef;
                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1337);
node.replace("<"+val+" id='" + editorY.guid() + "'>"+node.getHTML()+"</"+val+">");
                            }
                        }
                        // do a toolbarsync, because styles will change.
                        // but do not refresh the heading-selectlist! Therefore e.sender is defined
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1342);
itsatoolbar.sync({sender: 'itsaheading', changedNode: editorY.one('#itsatoolbar-ref')});
                        // take some time to let the sync do its work before set and remove cursor
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1344);
Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);
                   }
                });
            }
        },

        /**
        * Defines the execCommand itsafontfamily
        * @method _defineExecCommandFontFamily
        * @private
        */
        _defineExecCommandFontFamily : function() {
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandFontFamily", 1355);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1358);
if (!Y.Plugin.ExecCommand.COMMANDS.itsafontfamily) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1359);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontfamily: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsafontfamily", 1360);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1361);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1367);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1368);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1369);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1370);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1371);
if (selection) {
                            // first cleaning up old fontsize
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1373);
noderef.all('span').setStyle('fontFamily', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1375);
noderef.all('.'+ITSA_FONTFAMILYNODE).replaceClass(ITSA_FONTFAMILYNODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1376);
noderef.setStyle('fontFamily', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1378);
noderef.addClass(ITSA_FONTFAMILYNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1380);
noderef.removeClass(ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1381);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1384);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTFAMILYNODE + "' style='font-family:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1385);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1386);
Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
                        }
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandFontSize", 1398);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1401);
if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1402);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontsize: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsafontsize", 1403);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1404);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            parentnode,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1411);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1412);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1413);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1414);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1415);
if (selection) {
                            //We have a selection
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1417);
parentnode = noderef.get('parentNode');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1418);
if (Y.UA.webkit) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1419);
parentnode.setStyle('lineHeight', '');
                            }
                            // first cleaning up old fontsize
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1422);
noderef.all('span').setStyle('fontSize', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1424);
noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1425);
noderef.setStyle('fontSize', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1427);
noderef.addClass(ITSA_FONTSIZENODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1429);
noderef.removeClass(ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1430);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1433);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTSIZENODE + "' style='font-size:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1434);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1435);
Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsafontcolor<br>
        * We need to overrule the standard color execCommand, because in IE the ItsaSelectlist will loose focus on the selection
        * @method _defineExecCommandFontColor
        * @private
        */
        _defineExecCommandFontColor : function() {
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandFontColor", 1448);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1451);
if (!Y.Plugin.ExecCommand.COMMANDS.itsafontcolor) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1452);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontcolor: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsafontcolor", 1453);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1454);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1460);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1461);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1462);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1463);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1464);
if (selection) {
                            //We have a selection
                            // first cleaning up old fontcolors
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1467);
noderef.all('span').setStyle('color', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1469);
noderef.all('.'+ITSA_FONTCOLORNODE).replaceClass(ITSA_FONTCOLORNODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1470);
noderef.setStyle('color', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1472);
noderef.addClass(ITSA_FONTCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1474);
noderef.removeClass(ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1475);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1478);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTCOLORNODE + "' style='color:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1479);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1480);
Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
                        }
                    }
                });
            }
        },

        /**
        * Defines the execCommand itsamarkcolor<br>
        * We need to overrule the standard hilitecolor execCommand, because in IE the ItsaSelectlist will loose focus on the selection
        * @method _defineExecCommandMarkColor
        * @private
        */
        _defineExecCommandMarkColor : function() {
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandMarkColor", 1493);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1496);
if (!Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1497);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsamarkcolor: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsamarkcolor", 1498);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1499);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1505);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1506);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1507);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1508);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1509);
if (selection) {
                            //We have a selection
                            // first cleaning up old fontbgcolors
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1512);
noderef.all('span').setStyle('backgroundColor', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1514);
noderef.all('.'+ITSA_MARKCOLORNODE).replaceClass(ITSA_MARKCOLORNODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1515);
noderef.setStyle('backgroundColor', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1517);
noderef.addClass(ITSA_MARKCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1519);
noderef.removeClass(ITSA_REFSELECTION);
                            // remove the tmp-node placeholder
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1521);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1524);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_MARKCOLORNODE + "' style='backgroundColor:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1525);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1526);
Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandHyperlink", 1538);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1539);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1540);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    // val can be:
                    // 'img', 'url', 'video', 'email'
                    itsacreatehyperlink: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreatehyperlink", 1543);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1544);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1553);
url = val || prompt('Enter url', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1554);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1555);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1556);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1557);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1558);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1559);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1560);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1561);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1562);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1563);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1565);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1566);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1567);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1569);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1570);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1571);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1572);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1578);
execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url + '" target="_blank">' + url + '</a>');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1581);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandMaillink", 1592);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1593);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1594);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreatemaillink: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreatemaillink", 1595);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1596);
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
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1606);
url = val || prompt('Enter email', '');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1607);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1608);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1609);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1610);
urltext = url;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1611);
url = 'mailto:' + url;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1612);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1613);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1614);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1615);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1616);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1617);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1618);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1620);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1621);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1622);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1624);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1625);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1626);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1627);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1633);
execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url+ '">' + urltext + '</a>');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1636);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandImage", 1647);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1648);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1649);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateimage: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreateimage", 1650);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1651);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1660);
url = val || prompt('Enter link to image', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1661);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1662);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1663);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1664);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1665);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1666);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1667);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1668);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1669);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1670);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1672);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1673);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1674);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1676);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1677);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1678);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1679);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1685);
execCommandInstance.get('host').execCommand('inserthtml', '<img src="' + url + '" />');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1688);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandYouTube", 1699);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1700);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1701);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateyoutube: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreateyoutube", 1702);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1703);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1712);
url = val || prompt('Enter link to image', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1713);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1714);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1715);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1716);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1717);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1718);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1719);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1720);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1721);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1722);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1724);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1725);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1726);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1728);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1729);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1730);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1731);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1737);
videoitempos = url.indexOf('watch?v=');
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1738);
if (videoitempos!==-1) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1739);
videoitem = url.substring(url.videoitempos+8);
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1740);
execCommandInstance.get('host').execCommand('inserthtml', '<iframe width="420" height="315" src="http://www.youtube.com/embed/' + videoitem + '" frameborder="0" allowfullscreen></iframe>');
                                    }
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1744);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1761);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1762);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "setter", 1776);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1777);
return Y.one(val);
                },
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1779);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1780);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1793);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1794);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1807);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1808);
return (Lang.isNumber(val) && (val>0) && (val<10));
                }
            },

            /**
             * @description The fontfamilies that can be selected.<br>
             * Be aware to supply fontFamilies that are supported by the browser.<br>
             * Typically usage is the standard families extended by some custom fonts.<br>
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1831);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1832);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1844);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1845);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1857);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1858);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1872);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1873);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1885);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1886);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1898);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1899);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1911);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1912);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1924);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1925);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1938);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1939);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1951);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1952);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1964);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1965);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1977);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1978);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1990);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1991);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2003);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2004);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2030);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2031);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2043);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2044);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2056);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2057);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2071);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2072);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2086);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2087);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2243);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2244);
return Lang.isArray(val) ;
                }

            }
        }
    }
);


}, 'gallery-2012.09.26-20-36' ,{requires:['plugin', 'base-build', 'node-base', 'editor', 'event-delegate', 'event-custom', 'cssbutton', 'gallery-itsaselectlist'], skinnable:true});
