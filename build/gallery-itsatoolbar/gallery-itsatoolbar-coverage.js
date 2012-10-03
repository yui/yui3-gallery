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
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].code=["YUI.add('gallery-itsatoolbar', function(Y) {","","'use strict';","","/**"," * The Itsa Selectlist module."," *"," * @module itsa-toolbar"," */","","/**"," * Editor Toolbar Plugin"," * "," *"," * @class Plugin.ITSAToolbar"," * @constructor"," *"," * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>"," * YUI BSD License - http://developer.yahoo.com/yui/license.html"," *","*/","","// Local constants","var Lang = Y.Lang,","    Node = Y.Node,","","    ITSA_BTNNODE = \"<button class='yui3-button'></button>\",","    ITSA_BTNINNERNODE = \"<span class='itsa-button-icon'></span>\",","    ITSA_BTNPRESSED = 'yui3-button-active',","    ITSA_BTNACTIVE = 'itsa-button-active',","    ITSA_BTNINDENT = 'itsa-button-indent',","    ITSA_BUTTON = 'itsa-button',","    ITSA_BTNSYNC = 'itsa-syncbutton',","    ITSA_BTNTOGGLE = 'itsa-togglebutton',","    ITSA_BTNGROUP = 'itsa-buttongroup',","    ITSA_BTNCUSTOMFUNC = 'itsa-button-customfunc',","    ITSA_TOOLBAR_TEMPLATE = \"<div class='itsatoolbar'></div>\",","    ITSA_TOOLBAR_SMALL = 'itsa-buttonsize-small',","    ITSA_TOOLBAR_MEDIUM = 'itsa-buttonsize-medium',","    ITSA_CLASSEDITORPART = 'itsatoolbar-editorpart',","    ITSA_SELECTCONTNODE = '<div></div>',","    ITSA_TMPREFNODE = \"<img id='itsatoolbar-tmpref' />\",","    ITSA_REFEMPTYCONTENT = \"<img class='itsatoolbar-tmpempty' src='itsa-buttonicons-2012-08-15.png' width=0 height=0>\",","    ITSA_REFNODE = \"<span id='itsatoolbar-ref'></span>\",","    ITSA_REFSELECTION = 'itsa-selection-tmp',","    ITSA_FONTSIZENODE = 'itsa-fontsize',","    ITSA_FONTFAMILYNODE = 'itsa-fontfamily',","    ITSA_FONTCOLORNODE = 'itsa-fontcolor',","    ITSA_MARKCOLORNODE = 'itsa-markcolor';","","// -- Public Static Properties -------------------------------------------------","","/**"," * Reference to the editor's instance"," * @property editor"," * @type Y.EditorBase instance"," */","","/**"," * Reference to the Y-instance of the host-editor"," * @property editorY"," * @type YUI-instance"," */","","/**"," * Reference to the editor's iframe-node"," * @property editorNode"," * @type Y.Node"," */","","/**"," * Reference to the editor's container-node, in which the host-editor is rendered.<br>"," * This is in fact editorNode.get('parentNode')"," * @property containerNode"," * @type Y.Node"," */","","/**"," * Reference to the toolbar-node.<br>"," * @property toolbarNode"," * @type Y.Node"," */","","/**"," * Used internally to check if the toolbar should still be rendered after the editor is rendered<br>"," * To prevent rendering while it is already unplugged"," * @property _destroyed"," * @private"," * @type Boolean"," */","","/**"," * Timer: used internally to clean up empty fontsize-markings<br>"," * @property _timerClearEmptyFontRef"," * @private"," * @type Object"," */","","/**"," * Reference to a backup cursorposition<br>"," * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected."," * Reference is made on a show-event of the selectlist."," * @property _backupCursorRef"," * @private"," * @type Y.Node"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_BOLD"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ITALIC"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNDERLINE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_LEFT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_CENTER"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_RIGHT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ALIGN_JUSTIFY"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_SUBSCRIPT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_SUPERSCRIPT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_TEXTCOLOR"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_MARKCOLOR"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_INDENT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_OUTDENT"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNORDEREDLIST"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_ORDEREDLIST"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_UNDO"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_REDO"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_EMAIL"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_HYPERLINK"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_IMAGE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_FILE"," * @type String"," */","","/**"," * Can be used as iconClass within buttondefinition"," * @static"," * @property ICON_VIDEO"," * @type String"," */","","Y.namespace('Plugin').ITSAToolbar = Y.Base.create('itsatoolbar', Y.Plugin.Base, [], {","","        editor : null,","        editorY : null,","        editorNode : null,","        containerNode : null,","        toolbarNode : null,","        _destroyed : false,","        _timerClearEmptyFontRef : null,","        _backupCursorRef : null,","","        ICON_BOLD : 'itsa-icon-bold',","        ICON_ITALIC : 'itsa-icon-italic',","        ICON_UNDERLINE : 'itsa-icon-underline',","        ICON_ALIGN_LEFT : 'itsa-icon-alignleft',","        ICON_ALIGN_CENTER : 'itsa-icon-aligncenter',","        ICON_ALIGN_RIGHT : 'itsa-icon-alignright',","        ICON_ALIGN_JUSTIFY : 'itsa-icon-alignjustify',","        ICON_SUBSCRIPT : 'itsa-icon-subscript',","        ICON_SUPERSCRIPT : 'itsa-icon-superscript',","        ICON_TEXTCOLOR : 'itsa-icon-textcolor',","        ICON_MARKCOLOR : 'itsa-icon-markcolor',","        ICON_INDENT : 'itsa-icon-indent',","        ICON_OUTDENT : 'itsa-icon-outdent',","        ICON_UNORDEREDLIST : 'itsa-icon-unorderedlist',","        ICON_ORDEREDLIST : 'itsa-icon-orderedlist',","        ICON_UNDO : 'itsa-icon-undo',","        ICON_REDO : 'itsa-icon-redo',","        ICON_EMAIL : 'itsa-icon-email',","        ICON_HYPERLINK : 'itsa-icon-hyperlink',","        ICON_IMAGE : 'itsa-icon-image',","        ICON_FILE : 'itsa-icon-file',","        ICON_VIDEO : 'itsa-icon-video',","        /**","         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready","         *","         * @method initializer","         * @param {Object} config The config-object.","         * @protected","        */","        initializer : function(config) {","            var instance = this;","            instance.editor = instance.get('host');","            // need to make sure we can use execCommand, so do not render before the frame exists.","            if (instance.editor.frame && instance.editor.frame.get('node')) {instance._render();}","            else {","                // do not subscribe to the frame:ready, but to the ready-event","                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors","                instance.editor.on('ready', instance._render, instance);","            }","        },","","        /**","         * Establishes the initial DOM for the toolbar. This method ia automaticly invoked once during initialisation.","         * It will invoke renderUI, bindUI and syncUI, just as within a widget.","         *","         * @method _render","         * @private","        */","        _render : function() {","            var instance = this;","            if (!instance._destroyed) {","                instance.editorY = instance.editor.getInstance();","                instance.editorNode = instance.editor.frame.get('node');","                instance.containerNode = instance.editorNode.get('parentNode');","                instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);","                instance.editor.plug(Y.Plugin.ExecCommand);","                instance._defineCustomExecCommands();","                instance._renderUI();","                instance._bindUI();","                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object","                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!","                instance.editor.frame.focus(Y.bind(instance.sync, instance));","            }","        },","","        /**","         * Returns node at cursorposition<br>","         * This can be a selectionnode, or -in case of no selection- a new tmp-node (empty span) that will be created to serve as reference.","         * In case of selection, there will always be made a tmp-node as placeholder. But in that case, the tmp-node will be just before the returned node.","         * @method _getCursorRef","         * @private","         * @param {Boolean} [selectionIfAvailable] do return the selectionnode if a selection is made. If set to false, then always just the cursornode will be returned. ","         * Which means -in case of selection- that the cursornode exists as a last child of the selection. Default = false.","         * @return {Y.Node} created empty referencenode","        */","        _getCursorRef : function(selectionIfAvailable) {","            var instance = this,","                node,","                tmpnode,","                sel,","                out;","            // insert cursor and use that node as the selected node","            // first remove previous","            instance._removeCursorRef();","            sel = new instance.editorY.EditorSelection();","            out = sel.getSelected();","            if (!sel.isCollapsed && out.size()) {","                // We have a selection","                node = out.item(0);","            }","            // node only exist when selection is available","            if (node) {","                node.addClass(ITSA_REFSELECTION);","                node.insert(ITSA_REFNODE, 'after');","                if (!(Lang.isBoolean(selectionIfAvailable) && selectionIfAvailable)) {node = instance.editorY.one('#itsatoolbar-ref');}","            }","            else {","                instance.editor.focus();","                instance.execCommand('inserthtml', ITSA_REFNODE);","                node = instance.editorY.one('#itsatoolbar-ref');","            }","            return node;","        },","","        /**","         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef","         * @method _removeCursorRef","         * @private","        */","        _removeCursorRef : function() {","            var instance = this,","                node,","                useY;","            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases","            useY = instance.editorY ? instance.editorY : Y;","            // first cleanup single referencenode","            node = useY.all('#itsatoolbar-ref');","            if (node) {node.remove();}","            node = useY.all('#itsatoolbar-tmpempty');","            if (node) {node.remove();}","            // next clean up all selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions","            node = useY.all('.' + ITSA_REFSELECTION);","            if (node.size()>0) {","                node.each(function(node){","                    node.replace(node.getHTML());","                });","            }","        },","","        /**","         * Removes temporary created font-size-ref-Node that might have been created by inserting fontsizes","         * @method _clearEmptyFontRef","         * @private","        */","        _clearEmptyFontRef : function() {","            var instance = this,","                node,","                useY;","            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases","            useY = instance.editorY ? instance.editorY : Y;","            // first cleanup single referencenode","            node = useY.all('.itsatoolbar-tmpempty');","            if (node) {node.remove();}","            // next clean up all references that are empty","            node = useY.all('.itsa-fontsize');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","            node = useY.all('.itsa-fontfamily');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","            node = useY.all('.itsa-fontcolor');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","            node = useY.all('.itsa-markcolor');","            if (node.size()>0) {","                node.each(function(node){","                    if (node.getHTML()==='') {node.remove();}","                });","            }","        },","","        /**","         * Sets the real editorcursor at the position of the tmp-node created by _getCursorRef<br>","         * Removes the cursor tmp-node afterward.","         * @method _setCursorAtRef","         * @private","        */","        _setCursorAtRef : function() {","            var instance = this,","                sel,","                node = instance.editorY.one('#itsatoolbar-ref');","            if (node) {","                sel = new instance.editorY.EditorSelection();","                sel.selectNode(node);","                // DO NOT call _removeCursorref straight away --> it will make Opera crash","                Y.later(100, instance, instance._removeCursorRef);","            }","        },","","        /**","         * Creates a reference at cursorposition for backupusage<br>","         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.","         * @method _createBackupCursorRef","         * @private","        */","        _createBackupCursorRef : function() {","            var instance = this;","            instance._backupCursorRef = instance._getCursorRef(true);","        },","","        /**","         * Returns backupnode at cursorposition that is created by _createBackupCursorRef()<br>","         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.","         * So descendenst of ItsaSelectlist should refer to this cursorref.","         * @method _getBackupCursorRef","         * @private","         * @return {Y.Node} created empty referencenode","        */","        _getBackupCursorRef : function() {","            return this._backupCursorRef;","        },","","        /**","         * Syncs the toolbar's status with the editor.<br>","         * @method sync","         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.","        */","        sync : function(e) {","            // syncUI will sync the toolbarstatus with the editors cursorposition","            var instance = this,","                cursorRef;","            if (!(e && e.changedNode)) {","                cursorRef = instance._getCursorRef(false);","                if (!e) {e = {changedNode: cursorRef};}","                else {e.changedNode = cursorRef;}","                Y.later(250, instance, instance._removeCursorRef);","            }","            if (instance.toolbarNode) {instance.toolbarNode.fire('itsatoolbar:statusChange', e);}","        },","","        /**","         * Creates a new Button on the Toolbar. By default at the end of the toolbar.","         * @method addButton","         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, or you want a custom Function to be executed, you must supply an object:<br>","         * <i>- [command]</i> (String): the execcommand<br>","         * <i>- [value]</i> (String): additional value","         * <i>- [customFunc]</i> (Function): reference to custom function: typicaly, this function will call editorinstance.itstoolbar.execCommand() by itsself","         * <i>- [context]]</i> (instance): the context for customFunc","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addButton : function(iconClass, execCommand, indent, position) {","            var instance = this,","                buttonNode,","                buttonInnerNode;","            buttonNode = Node.create(ITSA_BTNNODE);","            buttonNode.addClass(ITSA_BUTTON);","            if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}","            else if (Lang.isObject(execCommand)) {","                if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}","                if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}","                if (Lang.isFunction(execCommand.customFunc)) {","                    buttonNode.addClass(ITSA_BTNCUSTOMFUNC);","                    buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);","                }","            }","            if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}","            buttonInnerNode = Node.create(ITSA_BTNINNERNODE);","            buttonInnerNode.addClass(iconClass);","            buttonNode.append(buttonInnerNode);","            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist ","            if (instance.toolbarNode) {instance.toolbarNode.append(buttonNode);}","            else {","                // do not subscribe to the frame:ready, but to the ready-event","                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors","                instance.editor.on('ready', function(e, buttonNode){instance.toolbarNode.append(buttonNode);}, instance, buttonNode);","            }","            return buttonNode;","        },","","        /**","         * Creates a new syncButton on the Toolbar. By default at the end of the toolbar.<br>","         * A syncButton is just like a normal toolbarButton, with the exception that the editor can sync it's status, which cannot be done with a normal button. ","         * Typically used in situations like a hyperlinkbutton: it never stays pressed, but when the cursos is on a hyperlink, he buttons look will change.","         * @method addSyncButton","         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>","         * <i>- command</i> (String): the execcommand<br>","         * <i>- value</i> (String): additional value","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.","         * This function should handle the responseaction to be taken.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addSyncButton : function(iconClass, execCommand, syncFunc, context, indent, position, isToggleButton) {","            var instance = this,","                buttonNode = instance.addButton(iconClass, execCommand, indent, position);","            if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}","            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist ","            if (instance.toolbarNode) {instance.toolbarNode.addTarget(buttonNode);}","            else {","                // do not subscribe to the frame:ready, but to the ready-event","                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors","                instance.editor.on('ready', function(e, buttonNode){instance.toolbarNode.addTarget(buttonNode);}, instance, buttonNode);","            }","            if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(syncFunc, context || instance));}","            return buttonNode;","        },","","        /**","         * Creates a new toggleButton on the Toolbar. By default at the end of the toolbar.","         * @method addToggleButton","         * @param {String} iconClass Defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * @param {String | Object} execCommand ExecCommand that will be executed on buttonclick.<br>","         * when execCommand consists of a command and a value, you must supply an object with two fields:<br>","         * <i>- command</i> (String): the execcommand<br>","         * <i>- value</i> (String): additional value","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * This callbackfunction will receive the nodeChane-event, described in <a href='http://yuilibrary.com/yui/docs/editor/#nodechange' target='_blank'>http://yuilibrary.com/yui/docs/editor/#nodechange</a>.","         * This function should handle the responseaction to be taken.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.Node} reference to the created buttonnode","        */","        addToggleButton : function(iconClass, execCommand, syncFunc, context, indent, position) {","            var instance = this,","                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);","            buttonNode.addClass(ITSA_BTNTOGGLE);","            return buttonNode;","        },","","        /**","         * Creates a group of toggleButtons on the Toolbar which are related to each-other. For instance when you might need 3 related buttons: leftalign, center, rightalign.","         * Position is by default at the end of the toolbar.<br>","         * @method addButtongroup","         * @param {Array} buttons Should consist of objects with two fields:<br>","         * <i>- iconClass</i> (String): defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.","         * <i>- command</i> (String): the execcommand that will be executed on buttonclick","         * <i>- [value]</i> (String) optional: additional value for the execcommand","         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton)","         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","        */","        addButtongroup : function(buttons, indent, position) {","            var instance = this;","            if (instance.toolbarNode) {instance._addButtongroup(buttons, indent, position);}","            else {","                // do not subscribe to the frame:ready, but to the ready-event","                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors","                instance.editor.on('ready', function(e, buttons, indent, position){instance._addButtongroup(buttons, indent, position);}, instance, buttons, indent, position);","            }","        },","","        /**","         * Does the real action of addButtongroup, but assumes that the editor is rendered.<br>","         * therefore not to be called mannually, only by addButtongroup()","         * @method _addButtongroup","         * @private","         * @param {Array} buttons Should consist of objects with at least two fields:<br>","         * <i>- iconClass</i> (String): defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.<br>","         * <i>- command</i> (String): the execcommand that will be executed on buttonclick.<br>","         * <i>- [value]</i> (String) optional: additional value for the execcommand.<br>","         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton).<br>","         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance.","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","        */","        _addButtongroup : function(buttons, indent, position) {","            var instance = this,","                buttonGroup = Y.guid(),","                button,","                buttonNode,","                returnNode = null,","                execCommand,","                i;","            for (i=0; i<buttons.length; i++) {","                button = buttons[i];","                if (button.iconClass && button.command) {","                    if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}","                    else {execCommand = button.command;}","                    buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position) ? position+i : null);","                    buttonNode.addClass(ITSA_BTNGROUP);","                    buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);","                    buttonNode.setData('buttongroup', buttonGroup);","                    instance.toolbarNode.addTarget(buttonNode);","                    if (Lang.isFunction(button.syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(button.syncFunc, button.context || instance));}","                    if (!returnNode) {returnNode = buttonNode;}","                }","            }","            return returnNode;","        },","        /**","         * Creates a selectList on the Toolbar. By default at the end of the toolbar.","         * When fired, the event-object returnes with 2 fields:<br>","         * <i>- e.value</i>: value of selected item<br>","         * <i>- e.index</i>: indexnr of the selected item<br>.","         * CAUTION: when using a selectlist, you <u>cannot</u> use standard execCommands. That will not work in most browsers, because the focus will be lost. <br>","         * Instead, create your customexecCommand and use cursorrefference <i>_getBackupCursorRef()</i>: see example <i>_defineExecCommandFontFamily()</i>","         * @method addSelectList","         * @param {Array} items contains all the items. Should be either a list of (String), or a list of (Objects). In case of an Object-list, the objects should contain two fields:<br>","         * <i>- text</i> (String): the text shown in the selectlist<br>","         * <i>- returnValue</i> (String): the returnvalue of e.value<br>","         * In case a String-list is supplied, e.value will equal to the selected String-item (returnvalue==text)","","         * @param {String | Object} execCommand ExecCommand that will be executed after a selectChange-event is fired. e.value will be placed as the second argument in editor.execCommand().<br>","         * You could provide a second 'restoreCommand', in case you need a different execCommand to erase some format. In that case you must supply an object with three fields:<br>","         * <i>- command</i> (String): the standard execcommand<br>","         * <i>- restoreCommand</i> (String): the execcommand that will be executed in case e.value equals the restore-value<br>","         * <i>- restoreValue</i> (String): when e.value equals restoreValue, restoreCommand will be used instead of the standard command","","","         * @param {Function} syncFunc callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved.","         * @param {instance} [context] context for the syncFunction. Default is Toolbar's instance","         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.","         * @param {Object} [config] Object that will be passed into the selectinstance. Has with the following fields:<br>","         * <i>- listAlignRight</i> (Boolean): whether to rightalign the listitems. Default=false<br>","         * <i>- hideSelected</i> (Boolean): whether the selected item is hidden from the list. Default=false","         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.","         * @return {Y.ITSASelectlist} reference to the created object","        */","        addSelectlist : function(items, execCommand, syncFunc, context, indent, config, position) {","            var instance = this,","                selectlist;","            config = Y.merge(config, {items: items, defaultButtonText: ''});","            selectlist = new Y.ITSASelectList(config);","            selectlist.after('render', function(e, execCommand, syncFunc, context, indent){","                var instance = this,","                    selectlist = e.currentTarget,","                    buttonNode = selectlist.buttonNode;","                if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}","                else {","                    if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}                    ","                    if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}                    ","                    if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}                    ","                }","                if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}","                // instance.toolbarNode should always exist here","                instance.toolbarNode.addTarget(buttonNode);","                selectlist.on('show', instance._createBackupCursorRef, instance);","                selectlist.on('selectChange', instance._handleSelectChange, instance);","                if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.rbind(syncFunc, context || instance));}","                instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);","            }, instance, execCommand, syncFunc, context, indent);","            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist ","            if (instance.toolbarNode) {selectlist.render(instance.toolbarNode);}","            else {","                // do not subscribe to the frame:ready, but to the ready-event","                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors","                instance.editor.on('ready', function(){selectlist.render(instance.toolbarNode);}, instance);","            }","            return selectlist;","        },","","","        /**","         * Cleans up bindings and removes plugin","         * @method destructor","         * @protected","        */","        destructor : function() {","            var instance = this,","                srcNode = instance.get('srcNode');","             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction","            instance._destroyed = true;","            instance._removeCursorRef();","            if (instance._timerClearEmptyFontRef) {instance._timerClearEmptyFontRef.cancel();}","            instance._clearEmptyFontRef();","            if (instance.toolbarNode) {instance.toolbarNode.remove(true);}","        },","","        // -- Private Methods ----------------------------------------------------------","","        /**","         * Creates the toolbar in the DOM. Toolbar will appear just above the editor, or -when scrNode is defined-  it will be prepended within srcNode ","         *","         * @method _renderUI","         * @private","        */","        _renderUI : function() {","            var instance = this,","                correctedHeight = 0,","                srcNode = instance.get('srcNode'),","                btnSize = instance.get('btnSize');","            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering","            instance.toolbarNode = Node.create(ITSA_TOOLBAR_TEMPLATE);","            if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}","            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}","            if (srcNode) {","                srcNode.prepend(instance.toolbarNode);","            }","            else {","                instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);","                switch (instance.get('btnSize')) {","                    case 1:","                        correctedHeight = -40;","                    break;","                    case 2: ","                        correctedHeight = -44;","                    break;","                    case 3: ","                        correctedHeight = -46;","                    break;","                }","                correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10) ","                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);","                instance.editorNode.set('height', correctedHeight);","                instance.editorNode.insert(instance.toolbarNode, 'before');","            }","            instance._initializeButtons();","        },","        ","        /**","         * Binds events when there is a cursorstatus changes in the editor","         *","         * @method _bindUI","         * @private","        */","        _bindUI : function() {","            var instance = this;","            instance.editor.on('nodeChange', instance.sync, instance);","            instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance);","        },","","        /**","         * Defines all custom execCommands","         *","         * @method _defineCustomExecCommands","         * @private","        */","        _defineCustomExecCommands : function() {","            var instance = this;","            instance._defineExecCommandHeader();","            instance._defineExecCommandFontFamily();","            instance._defineExecCommandFontSize();","            instance._defineExecCommandFontColor();","            instance._defineExecCommandMarkColor();","            instance._defineExecCommandHyperlink();","            instance._defineExecCommandMaillink();","            instance._defineExecCommandImage();","            instance._defineExecCommandYouTube();","        },","","        /**","         * Handling the buttonclicks for all buttons on the Toolbar within one eventhandler (delegated by the Toolbar-node)","         *","         * @method _bindUI","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _handleBtnClick : function(e) {","            var instance = this,","                node = e.currentTarget;","            // only execute for .itsa-button, not for all buttontags    ","            if (node.hasClass(ITSA_BUTTON)) {","                if (node.hasClass(ITSA_BTNTOGGLE)) {","                    node.toggleClass(ITSA_BTNPRESSED);","                }","                else if (node.hasClass(ITSA_BTNSYNC)) {","                    node.toggleClass(ITSA_BTNACTIVE, true);","                }","                else if (node.hasClass(ITSA_BTNGROUP)) {","                    instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);","                    node.toggleClass(ITSA_BTNPRESSED, true);","                }","                if (!node.hasClass(ITSA_BTNCUSTOMFUNC)) {instance._execCommandFromData(node);}","            }","        },","","        /**","         * Handling the selectChange event of a selectButton","         *","         * @method _handleSelectChange","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _handleSelectChange : function(e) {","            var selectButtonNode,","                restoreCommand,","                execCommand;","            selectButtonNode = e.currentTarget.buttonNode;","            restoreCommand = selectButtonNode.getData('restoreCommand');","            execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');","            this.execCommand(execCommand, e.value);","        },","","        /**","         * Executes this.editor.exec.command with the execCommand and value that is bound to the node through Node.setData('execCommand') and Node.setData('execValue'). <br>","         * these values are bound during definition of addButton(), addSyncButton(), addToggleButton etc.","         *","         * @method _execCommandFromData","         * @private","         * @param {EventFacade} e in case of selectList, e.value and e.index are also available","        */","        _execCommandFromData: function(buttonNode) {","            var execCommand,","                execValue;","            execCommand = buttonNode.getData('execCommand');","            execValue = buttonNode.getData('execValue');","            this.execCommand(execCommand, execValue);","        },","","        /**","         * Performs a execCommand that will take into account the editors cursorposition<br>","         * This means that when no selection is made, the operation still works: you can preset an command this way.<br>","         * It also makes 'inserthtml' work with all browsers.","         *","         * @method execCommand","         * @param {String} command The execCommand","         * @param {String} [value] additional commandvalue","        */","        execCommand: function(command, value) {","            var instance = this,","                tmpnode;","            instance.editor.focus();","            if (command==='inserthtml') {","                // we need a tmp-ref which is an img-element instead of a span-element --> inserthtml of span does not work in chrome and safari","                // but inserting img does, which can replaced afterwards","                // first a command that I don't understand: but we need this, because otherwise some browsers will replace <br> by <p> elements","                instance.editor._execCommand('createlink', '&nbsp;');","                instance.editor.exec.command('inserthtml', ITSA_TMPREFNODE);","                tmpnode = instance.editorY.one('#itsatoolbar-tmpref');","                tmpnode.replace(value);","            }","            else {instance.editor.exec.command(command, value);}","        },","","        /**","         * Checks whether there is a selection within the editor<br>","         *","         * @method _hasSelection","         * @private","         * @return {Boolean} whether there is a selection","        */","        _hasSelection : function() {","            var instance = this,","                sel = new instance.editorY.EditorSelection();","            return (!sel.isCollapsed  && sel.anchorNode);","        },","","        /**","         * Checks whether the cursor is inbetween a selector. For instance to check if cursor is inbetween a h1-selector","         *","         * @method _checkInbetweenSelector","         * @private","         * @param {String} selector The selector to check for","         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection","         * @return {Boolean} whether node resides inbetween selector","        */","        _checkInbetweenSelector : function(selector, cursornode) {","            var instance = this,","                pattern = '<\\\\s*' + selector + '[^>]*>(.*?)<\\\\s*/\\\\s*' + selector  + '>',","                searchHeaderPattern = new RegExp(pattern, 'gi'),","                fragment,","                inbetween = false,","                refContent = instance.editorY.one('body').getHTML(),","                cursorid,","                cursorindex;","            cursorid = cursornode.get('id');","            cursorindex = refContent.indexOf(' id=\"' + cursorid + '\"');","            if (cursorindex===-1) {cursorindex = refContent.indexOf(\" id='\" + cursorid + \"'\");}","            if (cursorindex===-1) {cursorindex = refContent.indexOf(\" id=\" + cursorid);}","            fragment = searchHeaderPattern.exec(refContent);","            while ((fragment !== null) && !inbetween) {","                inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));","                fragment = searchHeaderPattern.exec(refContent); // next search","            }","            return inbetween;","        },","","        /**","         * Finds the headernode where the cursor, or selection remains in","         *","         * @method _getActiveHeader","         * @private","         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection. Can be supplied by e.changedNode, or left empty to make this function determine itself.","         * @return {Y.Node|null} the headernode where the cursor remains. Returns null if outside any header.","        */","     _getActiveHeader : function(cursornode) {","            var instance = this,","                pattern,","                searchHeaderPattern,","                fragment,","                nodeFound,","                cursorid,","                nodetag,","                headingNumber = 0,","                returnNode = null,","                checkNode,","                endpos,","                refContent;","            if (cursornode) {    ","                // node can be a header right away, or it can be a node within a header. Check for both","                nodetag = cursornode.get('tagName');","                if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}","                if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {","                    returnNode = cursornode;","                }","                else {","                    cursorid = cursornode.get('id');","                    // first look for endtag, to determine which headerlevel to search for","                    pattern = ' id=(\"|\\')?' + cursorid + '(\"|\\')?(.*?)<\\\\s*/\\\\s*h\\\\d>';","                    searchHeaderPattern = new RegExp(pattern, 'gi');","                    refContent = instance.editorY.one('body').getHTML();","                    fragment = searchHeaderPattern.exec(refContent);","","","                    if (fragment !== null) {","                        // search again, looking for the right headernumber","                        endpos = fragment.index+fragment[0].length-1;","                        headingNumber = refContent.substring(endpos-1, endpos);","                        pattern = '<\\\\s*h' + headingNumber + '[^>]*>(.*?)id=(\"|\\')?' + cursorid + '(\"|\\')?(.*?)<\\\\s*/\\\\s*h' + headingNumber + '>';","                        searchHeaderPattern = new RegExp(pattern, 'gi');","                        fragment = searchHeaderPattern.exec(refContent); // next search","                        if (fragment !== null) {","                            nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);","                        }","                    }","                    if (nodeFound) {","                        checkNode = Node.create(nodeFound);","                        returnNode = instance.editorY.one('#' + checkNode.get('id'));","                    }","                }","            }","            return returnNode;","        },","","        /**","         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.","         *","         * @method _initializeButtons","         * @private","        */","        _initializeButtons : function() { ","            var instance = this,","                i, r, g, b,","                item,","                items,","                bgcolor,","                docFontSize,","                bgcolors,","                buttons;","","            // create fonffamily button","            if (instance.get('btnFontfamily')) {","                items = instance.get('fontFamilies');","                for (i=0; i<items.length; i++) {","                    item = items[i];","                    items[i] = {text: \"<span style='font-family:\"+item+\"'>\"+item+\"</span>\", returnValue: item};","                }","                instance.fontSelectlist = instance.addSelectlist(items, 'itsafontfamily', function(e) {","                    var familyList = e.changedNode.getStyle('fontFamily'),","                        familyListArray = familyList.split(','),","                        activeFamily = familyListArray[0];","                    // some browsers place '' surround the string, when it should contain whitespaces.","                    // first remove them","                    if ((activeFamily.substring(0,1)===\"'\") || (activeFamily.substring(0,1)==='\"')) {activeFamily = activeFamily.substring(1, activeFamily.length-1);}","                    this.fontSelectlist.selectItemByValue(activeFamily, true, true);","                }, null, true, {buttonWidth: 145});","            }","","            // create fontsize button","            if (instance.get('btnFontsize')) {","                items = [];","                for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}","                instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {","                    var fontSize = e.changedNode.getComputedStyle('fontSize'),","                        fontSizeNumber = parseFloat(fontSize),","                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);","                    // make sure not to display partial numbers    ","                    this.sizeSelectlist.selectItemByValue(Lang.isNumber(fontSizeNumber) ? Math.round(fontSizeNumber)+fontsizeExt : '', true);","                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});","            }","","            // create header button","            if (instance.get('btnHeader')) {","                items = [];","                items.push({text: 'No header', returnValue: 'none'});","                for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}","                instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {","                    var instance = this,","                        node = e.changedNode,","                        internalcall = (e.sender && e.sender==='itsaheading'),","                        activeHeader;","                    // prevent update when sync is called after heading has made changes. Check this through e.sender","                    if (!internalcall) {","                        activeHeader = instance._getActiveHeader(node);","                        instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);","                        instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());","                    }","                }, null, true, {buttonWidth: 96});","            }","","            // create bold button","            if (instance.get('btnBold')) {","                instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {","                    var fontWeight = e.changedNode.getStyle('fontWeight');","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (Lang.isNumber(parseInt(fontWeight, 10)) ? (fontWeight>=600) : ((fontWeight==='bold') || (fontWeight==='bolder'))));","                }, null, true);","            }","","            // create italic button","            if (instance.get('btnItalic')) {","                instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));","                });","            }","","            // create underline button","            if (instance.get('btnUnderline')) {","                instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));","                });","            }","","            // create align buttons","            if (instance.get('grpAlign')) {","                buttons = [","                    {","                        iconClass : instance.ICON_ALIGN_LEFT,","                        command : 'JustifyLeft',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));","                                    }","                    },","                    {","                        iconClass : instance.ICON_ALIGN_CENTER,","                        command : 'JustifyCenter',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));","                                    }","                    },","                    {","                        iconClass : instance.ICON_ALIGN_RIGHT,","                        command : 'JustifyRight',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));","                                    }","                    }","                ];","            // create justify button","                if (instance.get('btnJustify')) {","                    buttons.push({","                        iconClass : instance.ICON_ALIGN_JUSTIFY,","                        command : 'JustifyFull',","                        value : '',","                        syncFunc : function(e) {","                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));","                                    }","                    });","                }","                instance.addButtongroup(buttons, true);","            }","","            // create subsuperscript buttons","            if (instance.get('grpSubsuper')) {","                instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));","                }, null, true);","                instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));","                });","            }","","            // create textcolor button","            if (instance.get('btnTextcolor')) {","                items = [];","                bgcolors = instance.get('colorPallet');","                for (i=0; i<bgcolors.length; i++) {","                    bgcolor = bgcolors[i];","                    items.push({text: \"<div style='background-color:\"+bgcolor+\";'></div>\", returnValue: bgcolor});","                }","                instance.colorSelectlist = instance.addSelectlist(items, 'itsafontcolor', function(e) {","                    var instance = this,","                        styleColor = e.changedNode.getStyle('color'),","                        hexColor = instance._filter_rgb(styleColor);","                    instance.colorSelectlist.selectItemByValue(hexColor, true, true);","                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});","            }","","            // create markcolor button","            if (instance.get('btnMarkcolor')) {","                items = [];","                bgcolors = instance.get('colorPallet');","                for (i=0; i<bgcolors.length; i++) {","                    bgcolor = bgcolors[i];","                    items.push({text: \"<div style='background-color:\"+bgcolor+\";'></div>\", returnValue: bgcolor});","                }","                instance.markcolorSelectlist = instance.addSelectlist(items, 'itsamarkcolor', function(e) {","                    var instance = this,","                        styleColor = e.changedNode.getStyle('backgroundColor'),","                        hexColor = instance._filter_rgb(styleColor);","                    instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);","                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});","            }","","            // create indent buttons","            if (instance.get('grpIndent')) {","                instance.addButton(instance.ICON_INDENT, 'indent', true);","                instance.addButton(instance.ICON_OUTDENT, 'outdent');","            }","","            // create list buttons","            if (instance.get('grpLists')) {","                instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {","                    var instance = this,","                        node = e.changedNode;","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));","                }, null, true);","                instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {","                    var instance = this,","                        node = e.changedNode;","                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));","                });","            }","","            // create email button","            if (instance.get('btnEmail')) {","                instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {","                    var instance = this,","                        node = e.changedNode,","                        nodePosition,","                        isLink,","                        isEmailLink;","                    isLink =  instance._checkInbetweenSelector('a', node);","                    if (isLink) {","                        // check if its a normal href or a mailto:","                        while (node && !node.test('a')) {node=node.get('parentNode');}","                        // be carefull: do not === /match() with text, that will fail","                        isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');","                    }","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));","                }, null, true);","            }","","            // create hyperlink button","            if (instance.get('btnHyperlink')) {","                instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {","                    var instance = this,","                        posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',","                        node = e.changedNode,","                        nodePosition,","                        isLink,","                        isFileLink = false,","                        href,","                        lastDot,","                        fileExt,","                        isHyperLink;","                    isLink =  instance._checkInbetweenSelector('a', node);","                        if (isLink) {","                            // check if its a normal href or a mailto:","                            while (node && !node.test('a')) {node=node.get('parentNode');}","                            // be carefull: do not === /match() with text, that will fail","                            href = node.get('href');","                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';","                            if (isHyperLink) {","                                lastDot = href.lastIndexOf('.');","                                if (lastDot!==-1) {","                                    fileExt = href.substring(lastDot)+'.';","                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);","                                }","                            }","                        }","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));","                });","            }","","            // create image button","            if (instance.get('btnImage')) {","                instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));","                });","            }","","            // create video button","            if (instance.get('btnVideo')) {","                instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {","                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('iframe')));","                });","            }","","//************************************************","// just for temporary local use ITS Asbreuk","// should NOT be part of the gallery","            if (false) {","                instance.addButton(instance.ICON_EURO, {command: 'inserthtml', value: '&#8364;'}, true);","                instance.addSyncButton(","                    instance.ICON_FILE,","                    {   customFunc: function(e) {","                            Y.config.cmas2plus.uploader.show(","                                null, ","                                Y.bind(function(e) {","                                    this.editor.execCommand('itsacreatehyperlink', 'http://files.brongegevens.nl/' + Y.config.cmas2plusdomain + '/' + e.n);","                                }, this)","                            );","                        }","                    },","                    function(e) {","                        var instance = this,","                            posibleFiles = '.doc.docx.xls.xlsx.pdf.txt.zip.rar.',","                            node = e.changedNode,","                            nodePosition,","                            isFileLink = false,","                            isLink,","                            href,","                            lastDot,","                            fileExt,","                            isHyperLink;","                        isLink =  instance._checkInbetweenSelector('a', node);","                        if (isLink) {","                            // check if its a normal href or a mailto:","                            while (node && !node.test('a')) {node=node.get('parentNode');}","                            // be carefull: do not === /match() with text, that will fail","                            href = node.get('href');","                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';","                            if (isHyperLink) {","                                lastDot = href.lastIndexOf('.');","                                if (lastDot!==-1) {","                                    fileExt = href.substring(lastDot)+'.';","                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);","                                }","                            }","                        }","                        e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);","                    }","                );","            }","//************************************************","","            if (instance.get('grpUndoredo')) {","                instance.addButton(instance.ICON_UNDO, 'undo', true);","                instance.addButton(instance.ICON_REDO, 'redo');","            }","","        },","","        /**","        * Based on YUI2 rich-editor code","        * @private","        * @method _filter_rgb","        * @param String css The CSS string containing rgb(#,#,#);","        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00","        * @return String","        */","        _filter_rgb: function(css) {","            if (css.toLowerCase().indexOf('rgb') != -1) {","                var exp = new RegExp(\"(.*?)rgb\\\\s*?\\\\(\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?\\\\)(.*?)\", \"gi\"),","                    rgb = css.replace(exp, \"$1,$2,$3,$4,$5\").split(','),","                    r, g, b;","            ","                if (rgb.length === 5) {","                    r = parseInt(rgb[1], 10).toString(16);","                    g = parseInt(rgb[2], 10).toString(16);","                    b = parseInt(rgb[3], 10).toString(16);","","                    r = r.length === 1 ? '0' + r : r;","                    g = g.length === 1 ? '0' + g : g;","                    b = b.length === 1 ? '0' + b : b;","","                    css = \"#\" + r + g + b;","                }","            }","            return css;","        },","","        /**","        * Defines the execCommand itsaheading","        * @method _defineExecCommandHeader","        * @private","        */","        _defineExecCommandHeader : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsaheading: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef = itsatoolbar._getBackupCursorRef(),","                            activeHeader = itsatoolbar._getActiveHeader(noderef),","                            headingNumber = 0,","                            disableSelectbutton = false,","                            node;","                        if (val==='none') {","                            // want to clear heading","                            if (activeHeader) {","                                activeHeader.replace(\"<p>\"+activeHeader.getHTML()+\"</p>\");","                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox","                                itsatoolbar.headerSelectlist.set('disabled', true);","                            }","                        } else {","                            // want to add or change a heading","                            if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}","                            if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {","                                node = activeHeader ? activeHeader : noderef;","                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches","                                node.replace(\"<\"+val+\" id='\" + editorY.guid() + \"'>\"+node.getHTML()+\"</\"+val+\">\");","                            }","                        }","                        // do a toolbarsync, because styles will change.","                        // but do not refresh the heading-selectlist! Therefore e.sender is defined","                        itsatoolbar.sync({sender: 'itsaheading', changedNode: editorY.one('#itsatoolbar-ref')});","                        // take some time to let the sync do its work before set and remove cursor","                        Y.later(250, itsatoolbar, itsatoolbar._setCursorAtRef);","                   }","                });","            }","        },","","        /**","        * Defines the execCommand itsafontfamily","        * @method _defineExecCommandFontFamily","        * @private","        */","        _defineExecCommandFontFamily : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontfamily) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsafontfamily: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            // first cleaning up old fontsize","                            noderef.all('span').setStyle('fontFamily', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_FONTFAMILYNODE).replaceClass(ITSA_FONTFAMILYNODE, ITSA_REFSELECTION);","                            noderef.setStyle('fontFamily', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_FONTFAMILYNODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_FONTFAMILYNODE + \"' style='font-family:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsafontsize","        * @method _defineExecCommandFontSize","        * @private","        */","        _defineExecCommandFontSize : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsafontsize: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            parentnode,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            //We have a selection","                            parentnode = noderef.get('parentNode');","                            if (Y.UA.webkit) {","                                parentnode.setStyle('lineHeight', '');","                            }","                            // first cleaning up old fontsize","                            noderef.all('span').setStyle('fontSize', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);","                            noderef.setStyle('fontSize', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_FONTSIZENODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_FONTSIZENODE + \"' style='font-size:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsafontcolor<br>","        * We need to overrule the standard color execCommand, because in IE the ItsaSelectlist will loose focus on the selection","        * @method _defineExecCommandFontColor","        * @private","        */","        _defineExecCommandFontColor : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontcolor) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsafontcolor: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            //We have a selection","                            // first cleaning up old fontcolors","                            noderef.all('span').setStyle('color', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_FONTCOLORNODE).replaceClass(ITSA_FONTCOLORNODE, ITSA_REFSELECTION);","                            noderef.setStyle('color', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_FONTCOLORNODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_FONTCOLORNODE + \"' style='color:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsamarkcolor<br>","        * We need to overrule the standard hilitecolor execCommand, because in IE the ItsaSelectlist will loose focus on the selection","        * @method _defineExecCommandMarkColor","        * @private","        */","        _defineExecCommandMarkColor : function() {","            // This function seriously needs redesigned.","            // it does work, but as you can see in the comment, there are some flaws","            if (!Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsamarkcolor: function(cmd, val) {","                        var editor = this.get('host'),","                            editorY = editor.getInstance(),","                            itsatoolbar = editor.itsatoolbar,","                            noderef,","                            browserNeedsContent,","                            selection;","                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}","                        itsatoolbar._clearEmptyFontRef();","                        noderef = itsatoolbar._getBackupCursorRef();","                        selection = noderef.hasClass(ITSA_REFSELECTION);","                        if (selection) {","                            //We have a selection","                            // first cleaning up old fontbgcolors","                            noderef.all('span').setStyle('backgroundColor', '');","                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)","                            noderef.all('.'+ITSA_MARKCOLORNODE).replaceClass(ITSA_MARKCOLORNODE, ITSA_REFSELECTION);","                            noderef.setStyle('backgroundColor', val);","                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)","                            noderef.addClass(ITSA_MARKCOLORNODE);","                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node","                            noderef.removeClass(ITSA_REFSELECTION);","                            // remove the tmp-node placeholder","                            itsatoolbar._setCursorAtRef();","                        }","                        else {","                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element","                            itsatoolbar.execCommand(\"inserthtml\", \"<span class='\" + ITSA_MARKCOLORNODE + \"' style='background-color:\" + val + \"'>\" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + \"</span>\");","                            itsatoolbar._setCursorAtRef();","                            Y.later(30000, itsatoolbar, itsatoolbar._clearEmptyFontRef);","                        }","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacretaehyperlink","        * @method _defineExecCommandHyperlink","        * @private","        */","        _defineExecCommandHyperlink : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    // val can be:","                    // 'img', 'url', 'video', 'email'","                    itsacreatehyperlink: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter url', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<a href=\"' + url + '\" target=\"_blank\">' + url + '</a>');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacretaeemaillink","        * @method _defineExecCommandMaillink","        * @private","        */","        _defineExecCommandMaillink : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreatemaillink: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            urltext,","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter email', '');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            urltext = url;","                            url = 'mailto:' + url;","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<a href=\"' + url+ '\">' + urltext + '</a>');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacreateimage","        * @method _defineExecCommandImage","        * @private","        */","        _defineExecCommandImage : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreateimage: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter link to image', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                execCommandInstance.get('host').execCommand('inserthtml', '<img src=\"' + url + '\" />');","                            }","                        }","                        return a;","                    }","                });","            }","        },","","        /**","        * Defines the execCommand itsacreateyoutube","        * @method _defineExecCommandYouTube","        * @private","        */","        _defineExecCommandYouTube : function() {","            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {","                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","                    itsacreateyoutube: function(cmd, val) {","                        var execCommandInstance = this,","                            editorY = execCommandInstance.get('host').getInstance(),","                            out, ","                            a, ","                            sel, ","                            holder, ","                            url, ","                            videoitem, ","                            videoitempos;","                        url = val || prompt('Enter link to image', 'http://');","                        if (url) {","                            holder = editorY.config.doc.createElement('div');","                            url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                            url = editorY.config.doc.createTextNode(url);","                            holder.appendChild(url);","                            url = holder.innerHTML;","                            execCommandInstance.get('host')._execCommand('createlink', url);","                            sel = new editorY.EditorSelection();","                            out = sel.getSelected();","                            if (!sel.isCollapsed && out.size()) {","                                //We have a selection","                                a = out.item(0).one('a');","                                if (a) {","                                    out.item(0).replace(a);","                                }","                                if (a && Y.UA.gecko) {","                                    if (a.get('parentNode').test('span')) {","                                        if (a.get('parentNode').one('br.yui-cursor')) {","                                           a.get('parentNode').insert(a, 'before');","                                        }","                                    }","                                }","                            } else {","                                //No selection, insert a new node..","                                    videoitempos = url.indexOf('watch?v=');","                                    if (videoitempos!==-1) {","                                        videoitem = url.substring(url.videoitempos+8);","                                        execCommandInstance.get('host').execCommand('inserthtml', '<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/' + videoitem + '\" frameborder=\"0\" allowfullscreen></iframe>');","                                    }","                            }","                        }","                        return a;","                    }","                });","            }","        }","","    }, {","        NS : 'itsatoolbar',","        ATTRS : {","","            /**","             * @description Defines whether keyboard-enter will lead to P-tag. Default=false (meaning that BR's will be created)","             * @attribute paraSupport","             * @type Boolean","            */","            paraSupport : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description The sourceNode that holds the Toolbar. Could be an empty DIV.<br>","             * If not defined, than the Toolbar will be created just above the Editor.","             * By specifying the srcNode, one could create the Toolbar on top of the page, regardless of the Editor's position","             * @attribute srcNode","             * @type Y.Node ","            */","            srcNode : {","                value: null,","                writeOnce: 'initOnly',","                setter: function(val) {","                    return Y.one(val);","                },","                validator: function(val) {","                    return Y.one(val);","                }","            },","","            /**","             * @description The size of the buttons<br>","             * Should be a value 1, 2 or 3 (the higher, the bigger the buttonsize)<br>","             * Default = 2","             * @attribute btnSize","             * @type int","            */","            btnSize : {","                value: 2,","                validator: function(val) {","                    return (Lang.isNumber(val) && (val>0) && (val<4));","                }","            },","","            /**","             * @description The amount of headerlevels that can be selected<br>","             * Should be a value from 1-9<br>","             * Default = 6","             * @attribute headerLevels","             * @type int","            */","            headerLevels : {","                value: 6,","                validator: function(val) {","                    return (Lang.isNumber(val) && (val>0) && (val<10));","                }","            },","","            /**","             * @description The fontfamilies that can be selected.<br>","             * Be aware to supply fontFamilies that are supported by the browser.<br>","             * Typically usage is the standard families extended by some custom fonts.<br>","             * @attribute fontFamilies","             * @type Array [String]","            */","            fontFamilies : {","                value: [","                    'Arial',","                    'Arial Black',","                    'Comic Sans MS',","                    'Courier New',","                    'Lucida Console',","                    'Tahoma',","                    'Times New Roman',","                    'Trebuchet MS',","                    'Verdana'","                ],","                validator: function(val) {","                    return (Lang.isArray(val));","                }","            },","","            /**","             * @description Whether the button fontfamily is available<br>","             * Default = true","             * @attribute btnFontfamily","             * @type Boolean","            */","            btnFontfamily : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button fontsize is available<br>","             * Default = true","             * @attribute btnFontsize","             * @type Boolean","            */","            btnFontsize : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button headers is available<br>","             * because this function doesn't work well on all browsers, it is set of by default.<br>","             * Is something to work on in fututr releases. It works within firefox though.","             * Default = false","             * @attribute btnHeader","             * @type Boolean","            */","            btnHeader : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button bold is available<br>","             * Default = true","             * @attribute btnBold","             * @type Boolean","            */","            btnBold : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button italic is available<br>","             * Default = true","             * @attribute btnItalic","             * @type Boolean","            */","            btnItalic : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button underline is available<br>","             * Default = true","             * @attribute btnUnderline","             * @type Boolean","            */","            btnUnderline : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group align is available<br>","             * Default = true","             * @attribute grpAlign","             * @type Boolean","            */","            grpAlign : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button justify is available<br>","             * will only be shown in combination with grpalign","             * Default = true","             * @attribute btnJustify","             * @type Boolean","            */","            btnJustify : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group sub/superscript is available<br>","             * Default = true","             * @attribute grpSubsuper","             * @type Boolean","            */","            grpSubsuper : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button textcolor is available<br>","             * Default = true","             * @attribute btnTextcolor","             * @type Boolean","            */","            btnTextcolor : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button markcolor is available<br>","             * Default = true","             * @attribute btnMarkcolor","             * @type Boolean","            */","            btnMarkcolor : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group indent is available<br>","             * Default = true","             * @attribute grpIndent","             * @type Boolean","            */","            grpIndent : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the group lists is available<br>","             * Default = true","             * @attribute grpLists","             * @type Boolean","            */","            grpLists : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","/*","            btnremoveformat : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","            btnhiddenelements : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","*/","","            /**","             * @description Whether the group undo/redo is available<br>","             * Default = true","             * @attribute grpUndoredo","             * @type Boolean","            */","            grpUndoredo : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button email is available<br>","             * Default = true","             * @attribute btnEmail","             * @type Boolean","            */","            btnEmail : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button hyperlink is available<br>","             * Default = true","             * @attribute btnHyperlink","             * @type Boolean","            */","            btnHyperlink : {","                value: true,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button image is available<br>","             * because this code needs to be developed in a better way, the function is disabled by default.<br>","             * It works in a simple way though.","             * Default = false","             * @attribute btnImage","             * @type Boolean","            */","            btnImage : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description Whether the button video is available<br>","             * because this code needs to be developed in a better way, the function is disabled by default.<br>","             * It works in a simple way though. The end-user should enter a youtube-link once they click on this button.","             * Default = false","             * @attribute btnVideo","             * @type Boolean","            */","            btnVideo : {","                value: false,","                validator: function(val) {","                    return Lang.isBoolean(val);","                }","            },","","            /**","             * @description The colorpallet to use<br>","             * @attribute colorPallet","             * @type Array (String)","            */","            colorPallet : {","                value : [","                    '#111111',","                    '#2D2D2D',","                    '#434343',","                    '#5B5B5B',","                    '#737373',","                    '#8B8B8B',","                    '#A2A2A2',","                    '#B9B9B9',","                    '#000000',","                    '#D0D0D0',","                    '#E6E6E6',","                    '#FFFFFF',","                    '#BFBF00',","                    '#FFFF00',","                    '#FFFF40',","                    '#FFFF80',","                    '#FFFFBF',","                    '#525330',","                    '#898A49',","                    '#AEA945',","                    '#7F7F00',","                    '#C3BE71',","                    '#E0DCAA',","                    '#FCFAE1',","                    '#60BF00',","                    '#80FF00',","                    '#A0FF40',","                    '#C0FF80',","                    '#DFFFBF',","                    '#3B5738',","                    '#668F5A',","                    '#7F9757',","                    '#407F00',","                    '#8A9B55',","                    '#B7C296',","                    '#E6EBD5',","                    '#00BF00',","                    '#00FF80',","                    '#40FFA0',","                    '#80FFC0',","                    '#BFFFDF',","                    '#033D21',","                    '#438059',","                    '#7FA37C',","                    '#007F40',","                    '#8DAE94',","                    '#ACC6B5',","                    '#DDEBE2',","                    '#00BFBF',","                    '#00FFFF',","                    '#40FFFF',","                    '#80FFFF',","                    '#BFFFFF',","                    '#033D3D',","                    '#347D7E',","                    '#609A9F',","                    '#007F7F',","                    '#96BDC4',","                    '#B5D1D7',","                    '#E2F1F4',","                    '#0060BF',","                    '#0080FF',","                    '#40A0FF',","                    '#80C0FF',","                    '#BFDFFF',","                    '#1B2C48',","                    '#385376',","                    '#57708F',","                    '#00407F',","                    '#7792AC',","                    '#A8BED1',","                    '#DEEBF6',","                    '#0000BF',","                    '#0000FF',","                    '#4040FF',","                    '#8080FF',","                    '#BFBFFF',","                    '#212143',","                    '#373E68',","                    '#444F75',","                    '#00007F',","                    '#585E82',","                    '#8687A4',","                    '#D2D1E1',","                    '#6000BF',","                    '#8000FF',","                    '#A040FF',","                    '#C080FF',","                    '#DFBFFF',","                    '#302449',","                    '#54466F',","                    '#655A7F',","                    '#40007F',","                    '#726284',","                    '#9E8FA9',","                    '#DCD1DF',","                    '#BF00BF',","                    '#FF00FF',","                    '#FF40FF',","                    '#FF80FF',","                    '#FFBFFF',","                    '#4A234A',","                    '#794A72',","                    '#936386',","                    '#7F007F',","                    '#9D7292',","                    '#C0A0B6',","                    '#ECDAE5',","                    '#BF005F',","                    '#FF007F',","                    '#FF409F',","                    '#FF80BF',","                    '#FFBFDF',","                    '#451528',","                    '#823857',","                    '#A94A76',","                    '#7F003F',","                    '#BC6F95',","                    '#D8A5BB',","                    '#F7DDE9',","                    '#C00000',","                    '#FF0000',","                    '#FF4040',","                    '#FF8080',","                    '#FFC0C0',","                    '#441415',","                    '#82393C',","                    '#AA4D4E',","                    '#800000',","                    '#BC6E6E',","                    '#D8A3A4',","                    '#F8DDDD',","                    '#BF5F00',","                    '#FF7F00',","                    '#FF9F40',","                    '#FFBF80',","                    '#FFDFBF',","                    '#482C1B',","                    '#855A40',","                    '#B27C51',","                    '#7F3F00',","                    '#C49B71',","                    '#E1C4A8',","                    '#FDEEE0'","                ],","                validator: function(val) {","                    return Lang.isArray(val) ;","                }","","            }","        }","    }",");","","","}, 'gallery-2012.10.03-20-02' ,{requires:['plugin', 'base-build', 'node-base', 'editor', 'event-delegate', 'event-custom', 'cssbutton', 'gallery-itsaselectlist'], skinnable:true});"];
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].lines = {"1":0,"3":0,"24":0,"262":0,"303":0,"304":0,"306":0,"310":0,"322":0,"323":0,"324":0,"325":0,"326":0,"327":0,"328":0,"329":0,"330":0,"331":0,"334":0,"349":0,"356":0,"357":0,"358":0,"359":0,"361":0,"364":0,"365":0,"366":0,"367":0,"370":0,"371":0,"372":0,"374":0,"383":0,"387":0,"389":0,"390":0,"391":0,"392":0,"394":0,"395":0,"396":0,"397":0,"408":0,"412":0,"414":0,"415":0,"417":0,"418":0,"419":0,"420":0,"423":0,"424":0,"425":0,"426":0,"429":0,"430":0,"431":0,"432":0,"435":0,"436":0,"437":0,"438":0,"450":0,"453":0,"454":0,"455":0,"457":0,"468":0,"469":0,"481":0,"491":0,"493":0,"494":0,"495":0,"497":0,"499":0,"517":0,"520":0,"521":0,"522":0,"523":0,"524":0,"525":0,"526":0,"527":0,"528":0,"531":0,"532":0,"533":0,"534":0,"536":0,"540":0,"542":0,"564":0,"566":0,"568":0,"572":0,"574":0,"575":0,"595":0,"597":0,"598":0,"615":0,"616":0,"620":0,"639":0,"646":0,"647":0,"648":0,"649":0,"651":0,"652":0,"653":0,"654":0,"655":0,"656":0,"657":0,"660":0,"692":0,"694":0,"695":0,"696":0,"697":0,"700":0,"702":0,"703":0,"704":0,"706":0,"708":0,"709":0,"710":0,"711":0,"712":0,"715":0,"719":0,"721":0,"731":0,"734":0,"735":0,"736":0,"737":0,"738":0,"750":0,"755":0,"756":0,"758":0,"759":0,"762":0,"763":0,"765":0,"766":0,"768":0,"769":0,"771":0,"772":0,"774":0,"778":0,"779":0,"781":0,"791":0,"792":0,"793":0,"803":0,"804":0,"805":0,"806":0,"807":0,"808":0,"809":0,"810":0,"811":0,"812":0,"823":0,"826":0,"827":0,"828":0,"830":0,"831":0,"833":0,"834":0,"835":0,"837":0,"849":0,"852":0,"853":0,"854":0,"855":0,"867":0,"869":0,"870":0,"871":0,"884":0,"886":0,"887":0,"891":0,"892":0,"893":0,"894":0,"907":0,"909":0,"922":0,"930":0,"931":0,"932":0,"933":0,"934":0,"935":0,"936":0,"937":0,"939":0,"951":0,"963":0,"965":0,"966":0,"967":0,"968":0,"971":0,"973":0,"974":0,"975":0,"976":0,"979":0,"981":0,"982":0,"983":0,"984":0,"985":0,"986":0,"987":0,"990":0,"991":0,"992":0,"996":0,"1006":0,"1016":0,"1017":0,"1018":0,"1019":0,"1020":0,"1022":0,"1023":0,"1028":0,"1029":0,"1034":0,"1035":0,"1036":0,"1037":0,"1038":0,"1042":0,"1047":0,"1048":0,"1049":0,"1050":0,"1051":0,"1052":0,"1057":0,"1058":0,"1059":0,"1060":0,"1066":0,"1067":0,"1068":0,"1069":0,"1074":0,"1075":0,"1076":0,"1081":0,"1082":0,"1083":0,"1088":0,"1089":0,"1095":0,"1103":0,"1111":0,"1116":0,"1117":0,"1122":0,"1126":0,"1130":0,"1131":0,"1132":0,"1134":0,"1135":0,"1140":0,"1141":0,"1142":0,"1143":0,"1144":0,"1145":0,"1147":0,"1148":0,"1151":0,"1156":0,"1157":0,"1158":0,"1159":0,"1160":0,"1161":0,"1163":0,"1164":0,"1167":0,"1172":0,"1173":0,"1174":0,"1178":0,"1179":0,"1180":0,"1182":0,"1184":0,"1185":0,"1187":0,"1192":0,"1193":0,"1194":0,"1199":0,"1200":0,"1202":0,"1204":0,"1206":0,"1211":0,"1212":0,"1213":0,"1223":0,"1224":0,"1226":0,"1228":0,"1229":0,"1230":0,"1231":0,"1232":0,"1233":0,"1234":0,"1238":0,"1243":0,"1244":0,"1245":0,"1250":0,"1251":0,"1252":0,"1259":0,"1260":0,"1261":0,"1264":0,"1267":0,"1273":0,"1283":0,"1284":0,"1286":0,"1288":0,"1289":0,"1290":0,"1291":0,"1292":0,"1293":0,"1294":0,"1298":0,"1304":0,"1305":0,"1306":0,"1320":0,"1321":0,"1325":0,"1326":0,"1327":0,"1328":0,"1330":0,"1331":0,"1332":0,"1334":0,"1337":0,"1346":0,"1347":0,"1349":0,"1357":0,"1359":0,"1360":0,"1362":0,"1366":0,"1367":0,"1368":0,"1370":0,"1375":0,"1377":0,"1391":0,"1392":0,"1394":0,"1400":0,"1401":0,"1402":0,"1403":0,"1404":0,"1406":0,"1408":0,"1409":0,"1411":0,"1413":0,"1414":0,"1418":0,"1419":0,"1420":0,"1435":0,"1436":0,"1438":0,"1445":0,"1446":0,"1447":0,"1448":0,"1449":0,"1451":0,"1452":0,"1453":0,"1456":0,"1458":0,"1459":0,"1461":0,"1463":0,"1464":0,"1468":0,"1469":0,"1470":0,"1486":0,"1487":0,"1489":0,"1495":0,"1496":0,"1497":0,"1498":0,"1499":0,"1502":0,"1504":0,"1505":0,"1507":0,"1509":0,"1510":0,"1514":0,"1515":0,"1516":0,"1532":0,"1533":0,"1535":0,"1541":0,"1542":0,"1543":0,"1544":0,"1545":0,"1548":0,"1550":0,"1551":0,"1553":0,"1555":0,"1557":0,"1561":0,"1562":0,"1563":0,"1576":0,"1577":0,"1581":0,"1590":0,"1591":0,"1592":0,"1593":0,"1594":0,"1595":0,"1596":0,"1597":0,"1598":0,"1599":0,"1600":0,"1602":0,"1603":0,"1604":0,"1606":0,"1607":0,"1608":0,"1609":0,"1615":0,"1618":0,"1630":0,"1631":0,"1633":0,"1643":0,"1644":0,"1645":0,"1646":0,"1647":0,"1648":0,"1649":0,"1650":0,"1651":0,"1652":0,"1653":0,"1654":0,"1655":0,"1657":0,"1658":0,"1659":0,"1661":0,"1662":0,"1663":0,"1664":0,"1670":0,"1673":0,"1685":0,"1686":0,"1688":0,"1697":0,"1698":0,"1699":0,"1700":0,"1701":0,"1702":0,"1703":0,"1704":0,"1705":0,"1706":0,"1707":0,"1709":0,"1710":0,"1711":0,"1713":0,"1714":0,"1715":0,"1716":0,"1722":0,"1725":0,"1737":0,"1738":0,"1740":0,"1749":0,"1750":0,"1751":0,"1752":0,"1753":0,"1754":0,"1755":0,"1756":0,"1757":0,"1758":0,"1759":0,"1761":0,"1762":0,"1763":0,"1765":0,"1766":0,"1767":0,"1768":0,"1774":0,"1775":0,"1776":0,"1777":0,"1781":0,"1799":0,"1814":0,"1817":0,"1831":0,"1845":0,"1869":0,"1882":0,"1895":0,"1910":0,"1923":0,"1936":0,"1949":0,"1962":0,"1976":0,"1989":0,"2002":0,"2015":0,"2028":0,"2041":0,"2068":0,"2081":0,"2094":0,"2109":0,"2124":0,"2281":0};
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].functions = {"initializer:302":0,"_render:321":0,"_getCursorRef:348":0,"(anonymous 2):396":0,"_removeCursorRef:382":0,"(anonymous 3):419":0,"(anonymous 4):425":0,"(anonymous 5):431":0,"(anonymous 6):437":0,"_clearEmptyFontRef:407":0,"_setCursorAtRef:449":0,"_createBackupCursorRef:467":0,"_getBackupCursorRef:480":0,"sync:489":0,"(anonymous 7):540":0,"addButton:516":0,"(anonymous 8):572":0,"addSyncButton:563":0,"addToggleButton:594":0,"(anonymous 9):620":0,"addButtongroup:614":0,"_addButtongroup:638":0,"(anonymous 10):696":0,"(anonymous 11):719":0,"addSelectlist:691":0,"destructor:730":0,"_renderUI:749":0,"_bindUI:790":0,"_defineCustomExecCommands:802":0,"_handleBtnClick:822":0,"_handleSelectChange:848":0,"_execCommandFromData:866":0,"execCommand:883":0,"_hasSelection:906":0,"_checkInbetweenSelector:921":0,"_getActiveHeader:950":0,"(anonymous 12):1022":0,"(anonymous 13):1037":0,"(anonymous 14):1051":0,"(anonymous 15):1067":0,"(anonymous 16):1075":0,"(anonymous 17):1082":0,"syncFunc:1094":0,"syncFunc:1102":0,"syncFunc:1110":0,"syncFunc:1121":0,"(anonymous 18):1131":0,"(anonymous 19):1134":0,"(anonymous 20):1147":0,"(anonymous 21):1163":0,"(anonymous 22):1179":0,"(anonymous 23):1184":0,"(anonymous 24):1193":0,"(anonymous 25):1212":0,"(anonymous 26):1244":0,"(anonymous 27):1251":0,"(anonymous 28):1266":0,"customFunc:1263":0,"(anonymous 29):1272":0,"_initializeButtons:1005":0,"_filter_rgb:1319":0,"itsaheading:1348":0,"_defineExecCommandHeader:1345":0,"itsafontfamily:1393":0,"_defineExecCommandFontFamily:1388":0,"itsafontsize:1437":0,"_defineExecCommandFontSize:1432":0,"itsafontcolor:1488":0,"_defineExecCommandFontColor:1483":0,"itsamarkcolor:1534":0,"_defineExecCommandMarkColor:1529":0,"itsacreatehyperlink:1580":0,"_defineExecCommandHyperlink:1575":0,"itsacreatemaillink:1632":0,"_defineExecCommandMaillink:1629":0,"itsacreateimage:1687":0,"_defineExecCommandImage:1684":0,"itsacreateyoutube:1739":0,"_defineExecCommandYouTube:1736":0,"validator:1798":0,"setter:1813":0,"validator:1816":0,"validator:1830":0,"validator:1844":0,"validator:1868":0,"validator:1881":0,"validator:1894":0,"validator:1909":0,"validator:1922":0,"validator:1935":0,"validator:1948":0,"validator:1961":0,"validator:1975":0,"validator:1988":0,"validator:2001":0,"validator:2014":0,"validator:2027":0,"validator:2040":0,"validator:2067":0,"validator:2080":0,"validator:2093":0,"validator:2108":0,"validator:2123":0,"validator:2280":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].coveredLines = 577;
_yuitest_coverage["/build/gallery-itsatoolbar/gallery-itsatoolbar.js"].coveredFunctions = 105;
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
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 310);
instance.editor.on('ready', instance._render, instance);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_render", 321);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 322);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 323);
if (!instance._destroyed) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 324);
instance.editorY = instance.editor.getInstance();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 325);
instance.editorNode = instance.editor.frame.get('node');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 326);
instance.containerNode = instance.editorNode.get('parentNode');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 327);
instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 328);
instance.editor.plug(Y.Plugin.ExecCommand);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 329);
instance._defineCustomExecCommands();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 330);
instance._renderUI();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 331);
instance._bindUI();
                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object
                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 334);
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
         * @return {Y.Node} created empty referencenode
        */
        _getCursorRef : function(selectionIfAvailable) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getCursorRef", 348);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 349);
var instance = this,
                node,
                tmpnode,
                sel,
                out;
            // insert cursor and use that node as the selected node
            // first remove previous
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 356);
instance._removeCursorRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 357);
sel = new instance.editorY.EditorSelection();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 358);
out = sel.getSelected();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 359);
if (!sel.isCollapsed && out.size()) {
                // We have a selection
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 361);
node = out.item(0);
            }
            // node only exist when selection is available
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 364);
if (node) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 365);
node.addClass(ITSA_REFSELECTION);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 366);
node.insert(ITSA_REFNODE, 'after');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 367);
if (!(Lang.isBoolean(selectionIfAvailable) && selectionIfAvailable)) {node = instance.editorY.one('#itsatoolbar-ref');}
            }
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 370);
instance.editor.focus();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 371);
instance.execCommand('inserthtml', ITSA_REFNODE);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 372);
node = instance.editorY.one('#itsatoolbar-ref');
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 374);
return node;
        },

        /**
         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef
         * @method _removeCursorRef
         * @private
        */
        _removeCursorRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_removeCursorRef", 382);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 383);
var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 387);
useY = instance.editorY ? instance.editorY : Y;
            // first cleanup single referencenode
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 389);
node = useY.all('#itsatoolbar-ref');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 390);
if (node) {node.remove();}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 391);
node = useY.all('#itsatoolbar-tmpempty');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 392);
if (node) {node.remove();}
            // next clean up all selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 394);
node = useY.all('.' + ITSA_REFSELECTION);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 395);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 396);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 2)", 396);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 397);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_clearEmptyFontRef", 407);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 408);
var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 412);
useY = instance.editorY ? instance.editorY : Y;
            // first cleanup single referencenode
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 414);
node = useY.all('.itsatoolbar-tmpempty');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 415);
if (node) {node.remove();}
            // next clean up all references that are empty
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 417);
node = useY.all('.itsa-fontsize');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 418);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 419);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 3)", 419);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 420);
if (node.getHTML()==='') {node.remove();}
                });
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 423);
node = useY.all('.itsa-fontfamily');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 424);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 425);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 4)", 425);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 426);
if (node.getHTML()==='') {node.remove();}
                });
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 429);
node = useY.all('.itsa-fontcolor');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 430);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 431);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 5)", 431);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 432);
if (node.getHTML()==='') {node.remove();}
                });
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 435);
node = useY.all('.itsa-markcolor');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 436);
if (node.size()>0) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 437);
node.each(function(node){
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 6)", 437);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 438);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_setCursorAtRef", 449);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 450);
var instance = this,
                sel,
                node = instance.editorY.one('#itsatoolbar-ref');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 453);
if (node) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 454);
sel = new instance.editorY.EditorSelection();
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 455);
sel.selectNode(node);
                // DO NOT call _removeCursorref straight away --> it will make Opera crash
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 457);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_createBackupCursorRef", 467);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 468);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 469);
instance._backupCursorRef = instance._getCursorRef(true);
        },

        /**
         * Returns backupnode at cursorposition that is created by _createBackupCursorRef()<br>
         * Is needed for ItsaSelectlist instances, because IE will loose focus when an item is selected.
         * So descendenst of ItsaSelectlist should refer to this cursorref.
         * @method _getBackupCursorRef
         * @private
         * @return {Y.Node} created empty referencenode
        */
        _getBackupCursorRef : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getBackupCursorRef", 480);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 481);
return this._backupCursorRef;
        },

        /**
         * Syncs the toolbar's status with the editor.<br>
         * @method sync
         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.
        */
        sync : function(e) {
            // syncUI will sync the toolbarstatus with the editors cursorposition
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "sync", 489);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 491);
var instance = this,
                cursorRef;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 493);
if (!(e && e.changedNode)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 494);
cursorRef = instance._getCursorRef(false);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 495);
if (!e) {e = {changedNode: cursorRef};}
                else {e.changedNode = cursorRef;}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 497);
Y.later(250, instance, instance._removeCursorRef);
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 499);
if (instance.toolbarNode) {instance.toolbarNode.fire('itsatoolbar:statusChange', e);}
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addButton", 516);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 517);
var instance = this,
                buttonNode,
                buttonInnerNode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 520);
buttonNode = Node.create(ITSA_BTNNODE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 521);
buttonNode.addClass(ITSA_BUTTON);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 522);
if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
            else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 523);
if (Lang.isObject(execCommand)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 524);
if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 525);
if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 526);
if (Lang.isFunction(execCommand.customFunc)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 527);
buttonNode.addClass(ITSA_BTNCUSTOMFUNC);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 528);
buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);
                }
            }}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 531);
if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 532);
buttonInnerNode = Node.create(ITSA_BTNINNERNODE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 533);
buttonInnerNode.addClass(iconClass);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 534);
buttonNode.append(buttonInnerNode);
            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist 
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 536);
if (instance.toolbarNode) {instance.toolbarNode.append(buttonNode);}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 540);
instance.editor.on('ready', function(e, buttonNode){_yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 7)", 540);
instance.toolbarNode.append(buttonNode);}, instance, buttonNode);
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 542);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addSyncButton", 563);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 564);
var instance = this,
                buttonNode = instance.addButton(iconClass, execCommand, indent, position);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 566);
if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}
            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist 
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 568);
if (instance.toolbarNode) {instance.toolbarNode.addTarget(buttonNode);}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 572);
instance.editor.on('ready', function(e, buttonNode){_yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 8)", 572);
instance.toolbarNode.addTarget(buttonNode);}, instance, buttonNode);
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 574);
if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(syncFunc, context || instance));}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 575);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addToggleButton", 594);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 595);
var instance = this,
                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 597);
buttonNode.addClass(ITSA_BTNTOGGLE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 598);
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
        */
        addButtongroup : function(buttons, indent, position) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addButtongroup", 614);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 615);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 616);
if (instance.toolbarNode) {instance._addButtongroup(buttons, indent, position);}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 620);
instance.editor.on('ready', function(e, buttons, indent, position){_yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 9)", 620);
instance._addButtongroup(buttons, indent, position);}, instance, buttons, indent, position);
            }
        },

        /**
         * Does the real action of addButtongroup, but assumes that the editor is rendered.<br>
         * therefore not to be called mannually, only by addButtongroup()
         * @method _addButtongroup
         * @private
         * @param {Array} buttons Should consist of objects with at least two fields:<br>
         * <i>- iconClass</i> (String): defines the icon's look. Refer to the static Properties for some predefined classes like ICON_BOLD.<br>
         * <i>- command</i> (String): the execcommand that will be executed on buttonclick.<br>
         * <i>- [value]</i> (String) optional: additional value for the execcommand.<br>
         * <i>- syncFunc</i> (Function): callback-function that will be called after a statusChange, when the users manupilates the text, or the cursor is moved (for more info on the sync-function, see addToggleButton).<br>
         * <i>- [context]</i> (instance): context for the syncFunction. Default is Toolbar's instance.
         * @param {Boolean} [indent] To indent the button thus creating a whitespace between the previous button. Default=false.
         * @param {Number} [position] Index where to insert the button. Default=null, which means added as the last button.
        */
        _addButtongroup : function(buttons, indent, position) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_addButtongroup", 638);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 639);
var instance = this,
                buttonGroup = Y.guid(),
                button,
                buttonNode,
                returnNode = null,
                execCommand,
                i;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 646);
for (i=0; i<buttons.length; i++) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 647);
button = buttons[i];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 648);
if (button.iconClass && button.command) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 649);
if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}
                    else {execCommand = button.command;}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 651);
buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position) ? position+i : null);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 652);
buttonNode.addClass(ITSA_BTNGROUP);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 653);
buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 654);
buttonNode.setData('buttongroup', buttonGroup);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 655);
instance.toolbarNode.addTarget(buttonNode);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 656);
if (Lang.isFunction(button.syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(button.syncFunc, button.context || instance));}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 657);
if (!returnNode) {returnNode = buttonNode;}
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 660);
return returnNode;
        },
        /**
         * Creates a selectList on the Toolbar. By default at the end of the toolbar.
         * When fired, the event-object returnes with 2 fields:<br>
         * <i>- e.value</i>: value of selected item<br>
         * <i>- e.index</i>: indexnr of the selected item<br>.
         * CAUTION: when using a selectlist, you <u>cannot</u> use standard execCommands. That will not work in most browsers, because the focus will be lost. <br>
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "addSelectlist", 691);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 692);
var instance = this,
                selectlist;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 694);
config = Y.merge(config, {items: items, defaultButtonText: ''});
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 695);
selectlist = new Y.ITSASelectList(config);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 696);
selectlist.after('render', function(e, execCommand, syncFunc, context, indent){
                _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 10)", 696);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 697);
var instance = this,
                    selectlist = e.currentTarget,
                    buttonNode = selectlist.buttonNode;
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 700);
if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
                else {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 702);
if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}                    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 703);
if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}                    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 704);
if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}                    
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 706);
if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}
                // instance.toolbarNode should always exist here
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 708);
instance.toolbarNode.addTarget(buttonNode);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 709);
selectlist.on('show', instance._createBackupCursorRef, instance);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 710);
selectlist.on('selectChange', instance._handleSelectChange, instance);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 711);
if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.rbind(syncFunc, context || instance));}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 712);
instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);
            }, instance, execCommand, syncFunc, context, indent);
            // be aware of that addButton might get called when the editor isn't rendered yet. In that case instance.toolbarNode does not exist 
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 715);
if (instance.toolbarNode) {selectlist.render(instance.toolbarNode);}
            else {
                // do not subscribe to the frame:ready, but to the ready-event
                // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 719);
instance.editor.on('ready', function(){_yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 11)", 719);
selectlist.render(instance.toolbarNode);}, instance);
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 721);
return selectlist;
        },


        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
        */
        destructor : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "destructor", 730);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 731);
var instance = this,
                srcNode = instance.get('srcNode');
             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 734);
instance._destroyed = true;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 735);
instance._removeCursorRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 736);
if (instance._timerClearEmptyFontRef) {instance._timerClearEmptyFontRef.cancel();}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 737);
instance._clearEmptyFontRef();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 738);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_renderUI", 749);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 750);
var instance = this,
                correctedHeight = 0,
                srcNode = instance.get('srcNode'),
                btnSize = instance.get('btnSize');
            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 755);
instance.toolbarNode = Node.create(ITSA_TOOLBAR_TEMPLATE);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 756);
if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}
            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 758);
if (srcNode) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 759);
srcNode.prepend(instance.toolbarNode);
            }
            else {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 762);
instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 763);
switch (instance.get('btnSize')) {
                    case 1:
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 765);
correctedHeight = -40;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 766);
break;
                    case 2: 
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 768);
correctedHeight = -44;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 769);
break;
                    case 3: 
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 771);
correctedHeight = -46;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 772);
break;
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 774);
correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 778);
instance.editorNode.set('height', correctedHeight);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 779);
instance.editorNode.insert(instance.toolbarNode, 'before');
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 781);
instance._initializeButtons();
        },
        
        /**
         * Binds events when there is a cursorstatus changes in the editor
         *
         * @method _bindUI
         * @private
        */
        _bindUI : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_bindUI", 790);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 791);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 792);
instance.editor.on('nodeChange', instance.sync, instance);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 793);
instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance);
        },

        /**
         * Defines all custom execCommands
         *
         * @method _defineCustomExecCommands
         * @private
        */
        _defineCustomExecCommands : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineCustomExecCommands", 802);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 803);
var instance = this;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 804);
instance._defineExecCommandHeader();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 805);
instance._defineExecCommandFontFamily();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 806);
instance._defineExecCommandFontSize();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 807);
instance._defineExecCommandFontColor();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 808);
instance._defineExecCommandMarkColor();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 809);
instance._defineExecCommandHyperlink();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 810);
instance._defineExecCommandMaillink();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 811);
instance._defineExecCommandImage();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 812);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_handleBtnClick", 822);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 823);
var instance = this,
                node = e.currentTarget;
            // only execute for .itsa-button, not for all buttontags    
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 826);
if (node.hasClass(ITSA_BUTTON)) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 827);
if (node.hasClass(ITSA_BTNTOGGLE)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 828);
node.toggleClass(ITSA_BTNPRESSED);
                }
                else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 830);
if (node.hasClass(ITSA_BTNSYNC)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 831);
node.toggleClass(ITSA_BTNACTIVE, true);
                }
                else {_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 833);
if (node.hasClass(ITSA_BTNGROUP)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 834);
instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 835);
node.toggleClass(ITSA_BTNPRESSED, true);
                }}}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 837);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_handleSelectChange", 848);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 849);
var selectButtonNode,
                restoreCommand,
                execCommand;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 852);
selectButtonNode = e.currentTarget.buttonNode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 853);
restoreCommand = selectButtonNode.getData('restoreCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 854);
execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 855);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_execCommandFromData", 866);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 867);
var execCommand,
                execValue;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 869);
execCommand = buttonNode.getData('execCommand');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 870);
execValue = buttonNode.getData('execValue');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 871);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "execCommand", 883);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 884);
var instance = this,
                tmpnode;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 886);
instance.editor.focus();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 887);
if (command==='inserthtml') {
                // we need a tmp-ref which is an img-element instead of a span-element --> inserthtml of span does not work in chrome and safari
                // but inserting img does, which can replaced afterwards
                // first a command that I don't understand: but we need this, because otherwise some browsers will replace <br> by <p> elements
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 891);
instance.editor._execCommand('createlink', '&nbsp;');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 892);
instance.editor.exec.command('inserthtml', ITSA_TMPREFNODE);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 893);
tmpnode = instance.editorY.one('#itsatoolbar-tmpref');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 894);
tmpnode.replace(value);
            }
            else {instance.editor.exec.command(command, value);}
        },

        /**
         * Checks whether there is a selection within the editor<br>
         *
         * @method _hasSelection
         * @private
         * @return {Boolean} whether there is a selection
        */
        _hasSelection : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_hasSelection", 906);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 907);
var instance = this,
                sel = new instance.editorY.EditorSelection();
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 909);
return (!sel.isCollapsed  && sel.anchorNode);
        },

        /**
         * Checks whether the cursor is inbetween a selector. For instance to check if cursor is inbetween a h1-selector
         *
         * @method _checkInbetweenSelector
         * @private
         * @param {String} selector The selector to check for
         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection
         * @return {Boolean} whether node resides inbetween selector
        */
        _checkInbetweenSelector : function(selector, cursornode) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_checkInbetweenSelector", 921);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 922);
var instance = this,
                pattern = '<\\s*' + selector + '[^>]*>(.*?)<\\s*/\\s*' + selector  + '>',
                searchHeaderPattern = new RegExp(pattern, 'gi'),
                fragment,
                inbetween = false,
                refContent = instance.editorY.one('body').getHTML(),
                cursorid,
                cursorindex;
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 930);
cursorid = cursornode.get('id');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 931);
cursorindex = refContent.indexOf(' id="' + cursorid + '"');
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 932);
if (cursorindex===-1) {cursorindex = refContent.indexOf(" id='" + cursorid + "'");}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 933);
if (cursorindex===-1) {cursorindex = refContent.indexOf(" id=" + cursorid);}
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 934);
fragment = searchHeaderPattern.exec(refContent);
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 935);
while ((fragment !== null) && !inbetween) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 936);
inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 937);
fragment = searchHeaderPattern.exec(refContent); // next search
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 939);
return inbetween;
        },

        /**
         * Finds the headernode where the cursor, or selection remains in
         *
         * @method _getActiveHeader
         * @private
         * @param {Y.Node} cursornode Active node where the cursor resides, or the selection. Can be supplied by e.changedNode, or left empty to make this function determine itself.
         * @return {Y.Node|null} the headernode where the cursor remains. Returns null if outside any header.
        */
     _getActiveHeader : function(cursornode) {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_getActiveHeader", 950);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 951);
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
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 963);
if (cursornode) {    
                // node can be a header right away, or it can be a node within a header. Check for both
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 965);
nodetag = cursornode.get('tagName');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 966);
if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 967);
if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 968);
returnNode = cursornode;
                }
                else {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 971);
cursorid = cursornode.get('id');
                    // first look for endtag, to determine which headerlevel to search for
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 973);
pattern = ' id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h\\d>';
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 974);
searchHeaderPattern = new RegExp(pattern, 'gi');
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 975);
refContent = instance.editorY.one('body').getHTML();
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 976);
fragment = searchHeaderPattern.exec(refContent);


                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 979);
if (fragment !== null) {
                        // search again, looking for the right headernumber
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 981);
endpos = fragment.index+fragment[0].length-1;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 982);
headingNumber = refContent.substring(endpos-1, endpos);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 983);
pattern = '<\\s*h' + headingNumber + '[^>]*>(.*?)id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h' + headingNumber + '>';
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 984);
searchHeaderPattern = new RegExp(pattern, 'gi');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 985);
fragment = searchHeaderPattern.exec(refContent); // next search
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 986);
if (fragment !== null) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 987);
nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);
                        }
                    }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 990);
if (nodeFound) {
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 991);
checkNode = Node.create(nodeFound);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 992);
returnNode = instance.editorY.one('#' + checkNode.get('id'));
                    }
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 996);
return returnNode;
        },

        /**
         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.
         *
         * @method _initializeButtons
         * @private
        */
        _initializeButtons : function() { 
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_initializeButtons", 1005);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1006);
var instance = this,
                i, r, g, b,
                item,
                items,
                bgcolor,
                docFontSize,
                bgcolors,
                buttons;

            // create fonffamily button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1016);
if (instance.get('btnFontfamily')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1017);
items = instance.get('fontFamilies');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1018);
for (i=0; i<items.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1019);
item = items[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1020);
items[i] = {text: "<span style='font-family:"+item+"'>"+item+"</span>", returnValue: item};
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1022);
instance.fontSelectlist = instance.addSelectlist(items, 'itsafontfamily', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 12)", 1022);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1023);
var familyList = e.changedNode.getStyle('fontFamily'),
                        familyListArray = familyList.split(','),
                        activeFamily = familyListArray[0];
                    // some browsers place '' surround the string, when it should contain whitespaces.
                    // first remove them
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1028);
if ((activeFamily.substring(0,1)==="'") || (activeFamily.substring(0,1)==='"')) {activeFamily = activeFamily.substring(1, activeFamily.length-1);}
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1029);
this.fontSelectlist.selectItemByValue(activeFamily, true, true);
                }, null, true, {buttonWidth: 145});
            }

            // create fontsize button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1034);
if (instance.get('btnFontsize')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1035);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1036);
for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1037);
instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 13)", 1037);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1038);
var fontSize = e.changedNode.getComputedStyle('fontSize'),
                        fontSizeNumber = parseFloat(fontSize),
                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);
                    // make sure not to display partial numbers    
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1042);
this.sizeSelectlist.selectItemByValue(Lang.isNumber(fontSizeNumber) ? Math.round(fontSizeNumber)+fontsizeExt : '', true);
                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});
            }

            // create header button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1047);
if (instance.get('btnHeader')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1048);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1049);
items.push({text: 'No header', returnValue: 'none'});
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1050);
for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1051);
instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 14)", 1051);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1052);
var instance = this,
                        node = e.changedNode,
                        internalcall = (e.sender && e.sender==='itsaheading'),
                        activeHeader;
                    // prevent update when sync is called after heading has made changes. Check this through e.sender
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1057);
if (!internalcall) {
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1058);
activeHeader = instance._getActiveHeader(node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1059);
instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1060);
instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());
                    }
                }, null, true, {buttonWidth: 96});
            }

            // create bold button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1066);
if (instance.get('btnBold')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1067);
instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 15)", 1067);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1068);
var fontWeight = e.changedNode.getStyle('fontWeight');
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1069);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (Lang.isNumber(parseInt(fontWeight, 10)) ? (fontWeight>=600) : ((fontWeight==='bold') || (fontWeight==='bolder'))));
                }, null, true);
            }

            // create italic button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1074);
if (instance.get('btnItalic')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1075);
instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 16)", 1075);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1076);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));
                });
            }

            // create underline button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1081);
if (instance.get('btnUnderline')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1082);
instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 17)", 1082);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1083);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));
                });
            }

            // create align buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1088);
if (instance.get('grpAlign')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1089);
buttons = [
                    {
                        iconClass : instance.ICON_ALIGN_LEFT,
                        command : 'JustifyLeft',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1094);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1095);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_CENTER,
                        command : 'JustifyCenter',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1102);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1103);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_RIGHT,
                        command : 'JustifyRight',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1110);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1111);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));
                                    }
                    }
                ];
            // create justify button
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1116);
if (instance.get('btnJustify')) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1117);
buttons.push({
                        iconClass : instance.ICON_ALIGN_JUSTIFY,
                        command : 'JustifyFull',
                        value : '',
                        syncFunc : function(e) {
                                       _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "syncFunc", 1121);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1122);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));
                                    }
                    });
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1126);
instance.addButtongroup(buttons, true);
            }

            // create subsuperscript buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1130);
if (instance.get('grpSubsuper')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1131);
instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 18)", 1131);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1132);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));
                }, null, true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1134);
instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 19)", 1134);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1135);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));
                });
            }

            // create textcolor button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1140);
if (instance.get('btnTextcolor')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1141);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1142);
bgcolors = instance.get('colorPallet');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1143);
for (i=0; i<bgcolors.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1144);
bgcolor = bgcolors[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1145);
items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1147);
instance.colorSelectlist = instance.addSelectlist(items, 'itsafontcolor', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 20)", 1147);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1148);
var instance = this,
                        styleColor = e.changedNode.getStyle('color'),
                        hexColor = instance._filter_rgb(styleColor);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1151);
instance.colorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});
            }

            // create markcolor button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1156);
if (instance.get('btnMarkcolor')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1157);
items = [];
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1158);
bgcolors = instance.get('colorPallet');
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1159);
for (i=0; i<bgcolors.length; i++) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1160);
bgcolor = bgcolors[i];
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1161);
items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1163);
instance.markcolorSelectlist = instance.addSelectlist(items, 'itsamarkcolor', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 21)", 1163);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1164);
var instance = this,
                        styleColor = e.changedNode.getStyle('backgroundColor'),
                        hexColor = instance._filter_rgb(styleColor);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1167);
instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});
            }

            // create indent buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1172);
if (instance.get('grpIndent')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1173);
instance.addButton(instance.ICON_INDENT, 'indent', true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1174);
instance.addButton(instance.ICON_OUTDENT, 'outdent');
            }

            // create list buttons
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1178);
if (instance.get('grpLists')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1179);
instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 22)", 1179);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1180);
var instance = this,
                        node = e.changedNode;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1182);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));
                }, null, true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1184);
instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 23)", 1184);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1185);
var instance = this,
                        node = e.changedNode;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1187);
e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));
                });
            }

            // create email button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1192);
if (instance.get('btnEmail')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1193);
instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 24)", 1193);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1194);
var instance = this,
                        node = e.changedNode,
                        nodePosition,
                        isLink,
                        isEmailLink;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1199);
isLink =  instance._checkInbetweenSelector('a', node);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1200);
if (isLink) {
                        // check if its a normal href or a mailto:
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1202);
while (node && !node.test('a')) {node=node.get('parentNode');}
                        // be carefull: do not === /match() with text, that will fail
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1204);
isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');
                    }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1206);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));
                }, null, true);
            }

            // create hyperlink button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1211);
if (instance.get('btnHyperlink')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1212);
instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 25)", 1212);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1213);
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
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1223);
isLink =  instance._checkInbetweenSelector('a', node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1224);
if (isLink) {
                            // check if its a normal href or a mailto:
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1226);
while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1228);
href = node.get('href');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1229);
isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1230);
if (isHyperLink) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1231);
lastDot = href.lastIndexOf('.');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1232);
if (lastDot!==-1) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1233);
fileExt = href.substring(lastDot)+'.';
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1234);
isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1238);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));
                });
            }

            // create image button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1243);
if (instance.get('btnImage')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1244);
instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 26)", 1244);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1245);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));
                });
            }

            // create video button
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1250);
if (instance.get('btnVideo')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1251);
instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 27)", 1251);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1252);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('iframe')));
                });
            }

//************************************************
// just for temporary local use ITS Asbreuk
// should NOT be part of the gallery
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1259);
if (false) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1260);
instance.addButton(instance.ICON_EURO, {command: 'inserthtml', value: '&#8364;'}, true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1261);
instance.addSyncButton(
                    instance.ICON_FILE,
                    {   customFunc: function(e) {
                            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "customFunc", 1263);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1264);
Y.config.cmas2plus.uploader.show(
                                null, 
                                Y.bind(function(e) {
                                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 28)", 1266);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1267);
this.editor.execCommand('itsacreatehyperlink', 'http://files.brongegevens.nl/' + Y.config.cmas2plusdomain + '/' + e.n);
                                }, this)
                            );
                        }
                    },
                    function(e) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "(anonymous 29)", 1272);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1273);
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
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1283);
isLink =  instance._checkInbetweenSelector('a', node);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1284);
if (isLink) {
                            // check if its a normal href or a mailto:
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1286);
while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1288);
href = node.get('href');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1289);
isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1290);
if (isHyperLink) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1291);
lastDot = href.lastIndexOf('.');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1292);
if (lastDot!==-1) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1293);
fileExt = href.substring(lastDot)+'.';
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1294);
isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1298);
e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);
                    }
                );
            }
//************************************************

            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1304);
if (instance.get('grpUndoredo')) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1305);
instance.addButton(instance.ICON_UNDO, 'undo', true);
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1306);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_filter_rgb", 1319);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1320);
if (css.toLowerCase().indexOf('rgb') != -1) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1321);
var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi"),
                    rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(','),
                    r, g, b;
            
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1325);
if (rgb.length === 5) {
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1326);
r = parseInt(rgb[1], 10).toString(16);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1327);
g = parseInt(rgb[2], 10).toString(16);
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1328);
b = parseInt(rgb[3], 10).toString(16);

                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1330);
r = r.length === 1 ? '0' + r : r;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1331);
g = g.length === 1 ? '0' + g : g;
                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1332);
b = b.length === 1 ? '0' + b : b;

                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1334);
css = "#" + r + g + b;
                }
            }
            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1337);
return css;
        },

        /**
        * Defines the execCommand itsaheading
        * @method _defineExecCommandHeader
        * @private
        */
        _defineExecCommandHeader : function() {
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandHeader", 1345);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1346);
if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1347);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsaheading: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsaheading", 1348);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1349);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef = itsatoolbar._getBackupCursorRef(),
                            activeHeader = itsatoolbar._getActiveHeader(noderef),
                            headingNumber = 0,
                            disableSelectbutton = false,
                            node;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1357);
if (val==='none') {
                            // want to clear heading
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1359);
if (activeHeader) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1360);
activeHeader.replace("<p>"+activeHeader.getHTML()+"</p>");
                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1362);
itsatoolbar.headerSelectlist.set('disabled', true);
                            }
                        } else {
                            // want to add or change a heading
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1366);
if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1367);
if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1368);
node = activeHeader ? activeHeader : noderef;
                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1370);
node.replace("<"+val+" id='" + editorY.guid() + "'>"+node.getHTML()+"</"+val+">");
                            }
                        }
                        // do a toolbarsync, because styles will change.
                        // but do not refresh the heading-selectlist! Therefore e.sender is defined
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1375);
itsatoolbar.sync({sender: 'itsaheading', changedNode: editorY.one('#itsatoolbar-ref')});
                        // take some time to let the sync do its work before set and remove cursor
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1377);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandFontFamily", 1388);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1391);
if (!Y.Plugin.ExecCommand.COMMANDS.itsafontfamily) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1392);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontfamily: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsafontfamily", 1393);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1394);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1400);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1401);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1402);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1403);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1404);
if (selection) {
                            // first cleaning up old fontsize
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1406);
noderef.all('span').setStyle('fontFamily', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1408);
noderef.all('.'+ITSA_FONTFAMILYNODE).replaceClass(ITSA_FONTFAMILYNODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1409);
noderef.setStyle('fontFamily', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1411);
noderef.addClass(ITSA_FONTFAMILYNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1413);
noderef.removeClass(ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1414);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1418);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTFAMILYNODE + "' style='font-family:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1419);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1420);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandFontSize", 1432);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1435);
if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1436);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontsize: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsafontsize", 1437);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1438);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            parentnode,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1445);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1446);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1447);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1448);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1449);
if (selection) {
                            //We have a selection
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1451);
parentnode = noderef.get('parentNode');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1452);
if (Y.UA.webkit) {
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1453);
parentnode.setStyle('lineHeight', '');
                            }
                            // first cleaning up old fontsize
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1456);
noderef.all('span').setStyle('fontSize', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1458);
noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1459);
noderef.setStyle('fontSize', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1461);
noderef.addClass(ITSA_FONTSIZENODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1463);
noderef.removeClass(ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1464);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1468);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTSIZENODE + "' style='font-size:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1469);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1470);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandFontColor", 1483);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1486);
if (!Y.Plugin.ExecCommand.COMMANDS.itsafontcolor) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1487);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontcolor: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsafontcolor", 1488);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1489);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1495);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1496);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1497);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1498);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1499);
if (selection) {
                            //We have a selection
                            // first cleaning up old fontcolors
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1502);
noderef.all('span').setStyle('color', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1504);
noderef.all('.'+ITSA_FONTCOLORNODE).replaceClass(ITSA_FONTCOLORNODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1505);
noderef.setStyle('color', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1507);
noderef.addClass(ITSA_FONTCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1509);
noderef.removeClass(ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1510);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1514);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTCOLORNODE + "' style='color:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1515);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1516);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandMarkColor", 1529);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1532);
if (!Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1533);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsamarkcolor: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsamarkcolor", 1534);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1535);
var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1541);
if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1542);
itsatoolbar._clearEmptyFontRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1543);
noderef = itsatoolbar._getBackupCursorRef();
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1544);
selection = noderef.hasClass(ITSA_REFSELECTION);
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1545);
if (selection) {
                            //We have a selection
                            // first cleaning up old fontbgcolors
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1548);
noderef.all('span').setStyle('backgroundColor', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1550);
noderef.all('.'+ITSA_MARKCOLORNODE).replaceClass(ITSA_MARKCOLORNODE, ITSA_REFSELECTION);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1551);
noderef.setStyle('backgroundColor', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1553);
noderef.addClass(ITSA_MARKCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1555);
noderef.removeClass(ITSA_REFSELECTION);
                            // remove the tmp-node placeholder
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1557);
itsatoolbar._setCursorAtRef();
                        }
                        else {
                            // Don't forget to place a ITSA_REFEMPTYCONTENT before ITSA_REFNODE --> IE cannot focus cursor inside an empty <span>-element and would otherwise focus just before the outerside <span>-element
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1561);
itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_MARKCOLORNODE + "' style='background-color:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1562);
itsatoolbar._setCursorAtRef();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1563);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandHyperlink", 1575);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1576);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1577);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    // val can be:
                    // 'img', 'url', 'video', 'email'
                    itsacreatehyperlink: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreatehyperlink", 1580);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1581);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1590);
url = val || prompt('Enter url', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1591);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1592);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1593);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1594);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1595);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1596);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1597);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1598);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1599);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1600);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1602);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1603);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1604);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1606);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1607);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1608);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1609);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1615);
execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url + '" target="_blank">' + url + '</a>');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1618);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandMaillink", 1629);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1630);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1631);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreatemaillink: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreatemaillink", 1632);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1633);
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
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1643);
url = val || prompt('Enter email', '');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1644);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1645);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1646);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1647);
urltext = url;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1648);
url = 'mailto:' + url;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1649);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1650);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1651);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1652);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1653);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1654);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1655);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1657);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1658);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1659);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1661);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1662);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1663);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1664);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1670);
execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url+ '">' + urltext + '</a>');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1673);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandImage", 1684);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1685);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1686);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateimage: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreateimage", 1687);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1688);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1697);
url = val || prompt('Enter link to image', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1698);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1699);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1700);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1701);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1702);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1703);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1704);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1705);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1706);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1707);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1709);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1710);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1711);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1713);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1714);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1715);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1716);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1722);
execCommandInstance.get('host').execCommand('inserthtml', '<img src="' + url + '" />');
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1725);
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
            _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "_defineExecCommandYouTube", 1736);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1737);
if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {
                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1738);
Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateyoutube: function(cmd, val) {
                        _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "itsacreateyoutube", 1739);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1740);
var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1749);
url = val || prompt('Enter link to image', 'http://');
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1750);
if (url) {
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1751);
holder = editorY.config.doc.createElement('div');
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1752);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1753);
url = editorY.config.doc.createTextNode(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1754);
holder.appendChild(url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1755);
url = holder.innerHTML;
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1756);
execCommandInstance.get('host')._execCommand('createlink', url);
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1757);
sel = new editorY.EditorSelection();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1758);
out = sel.getSelected();
                            _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1759);
if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1761);
a = out.item(0).one('a');
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1762);
if (a) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1763);
out.item(0).replace(a);
                                }
                                _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1765);
if (a && Y.UA.gecko) {
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1766);
if (a.get('parentNode').test('span')) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1767);
if (a.get('parentNode').one('br.yui-cursor')) {
                                           _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1768);
a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1774);
videoitempos = url.indexOf('watch?v=');
                                    _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1775);
if (videoitempos!==-1) {
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1776);
videoitem = url.substring(url.videoitempos+8);
                                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1777);
execCommandInstance.get('host').execCommand('inserthtml', '<iframe width="420" height="315" src="http://www.youtube.com/embed/' + videoitem + '" frameborder="0" allowfullscreen></iframe>');
                                    }
                            }
                        }
                        _yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1781);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1798);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1799);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "setter", 1813);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1814);
return Y.one(val);
                },
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1816);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1817);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1830);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1831);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1844);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1845);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1868);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1869);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1881);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1882);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1894);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1895);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1909);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1910);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1922);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1923);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1935);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1936);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1948);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1949);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1961);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1962);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1975);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1976);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 1988);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 1989);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2001);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2002);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2014);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2015);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2027);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2028);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2040);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2041);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2067);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2068);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2080);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2081);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2093);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2094);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2108);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2109);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2123);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2124);
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
                    _yuitest_coverfunc("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", "validator", 2280);
_yuitest_coverline("/build/gallery-itsatoolbar/gallery-itsatoolbar.js", 2281);
return Lang.isArray(val) ;
                }

            }
        }
    }
);


}, 'gallery-2012.10.03-20-02' ,{requires:['plugin', 'base-build', 'node-base', 'editor', 'event-delegate', 'event-custom', 'cssbutton', 'gallery-itsaselectlist'], skinnable:true});
