YUI.add('gallery-itsatoolbar', function(Y) {

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
            Y.log('initializer', 'info', 'ITSAToolbar');
            var instance = this;
            instance.editor = instance.get('host');
            // need to make sure we can use execCommand, so do not render before the frame exists.
            if (instance.editor.frame && instance.editor.frame.get('node')) {instance._render();}
            else {
                var delayIE = false;
                if (delayIE && (Y.UA.ie>0)) {
                    // didn't find out yet: IE stops creating the editorinstance when pluggedin too soon!
                    // GOTTA check out
                    // at the time being: delaying
                    Y.later(250, instance, instance._render);
                }
                else {
                    // do not subscribe to the frame:ready, but to the ready-event
                    // Iliyan Peychev made an editor that doesn't use Frame, so this way it works on all editors
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
            Y.log('_render', 'info', 'ITSAToolbar');
            var instance = this;
            if (!instance._destroyed) {
                instance.editorY = instance.editor.getInstance();
                instance.editorNode = instance.editor.frame.get('node');
                instance.containerNode = instance.editorNode.get('parentNode');
                instance.get('paraSupport') ? instance.editor.plug(Y.Plugin.EditorPara) : instance.editor.plug(Y.Plugin.EditorBR);
                instance.editor.plug(Y.Plugin.ExecCommand);
                instance._defineCustomExecCommands();
                instance._renderUI();
                instance._bindUI();
                // first time: fire a statusChange with a e.changedNode to sync the toolbox with the editors-event object
                // be sure the editor has focus already focus, otherwise safari cannot inserthtml at cursorposition!
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
            Y.log('_getCursorRef', 'info', 'ITSAToolbar');
            var instance = this,
                node,
                tmpnode,
                sel,
                out;
            // insert cursor and use that node as the selected node
            // first remove previous
            instance._removeCursorRef();
            sel = new instance.editorY.EditorSelection();
            out = sel.getSelected();
            if (!sel.isCollapsed && out.size()) {
                // We have a selection
                node = out.item(0);
            }
            // node only exist when selection is available
            if (node) {
                node.addClass(ITSA_REFSELECTION);
                node.insert(ITSA_REFNODE, 'after');
                if (!(Lang.isBoolean(selectionIfAvailable) && selectionIfAvailable)) {node = instance.editorY.one('#itsatoolbar-ref');}
            }
            else {
                instance.editor.focus();
                instance.execCommand('inserthtml', ITSA_REFNODE);
                node = instance.editorY.one('#itsatoolbar-ref');
            }
            return node;
        },

        /**
         * Removes temporary created cursor-ref-Node that might have been created by _getCursorRef
         * @method _removeCursorRef
         * @private
        */
        _removeCursorRef : function() {
            Y.log('_removeCursorRef', 'info', 'ITSAToolbar');
            var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            useY = instance.editorY ? instance.editorY : Y;
            // first cleanup single referencenode
            node = useY.all('#itsatoolbar-ref');
            if (node) {node.remove();}
            node = useY.all('#itsatoolbar-tmpempty');
            if (node) {node.remove();}
            // next clean up all selections, by replacing the nodes with its html-content. Thus elimination the <span> definitions
            node = useY.all('.' + ITSA_REFSELECTION);
            if (node.size()>0) {
                node.each(function(node){
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
            Y.log('_clearEmptyFontRef', 'info', 'ITSAToolbar');
            var instance = this,
                node,
                useY;
            // because it can be called when editorY is already destroyed, you need to take Y-instance instead of editorY in those cases
            useY = instance.editorY ? instance.editorY : Y;
            // first cleanup single referencenode
            node = useY.all('.itsatoolbar-tmpempty');
            if (node) {node.remove();}
            // next clean up all references that are empty
            node = useY.all('.itsa-fontsize');
            if (node.size()>0) {
                node.each(function(node){
                    if (node.getHTML()==='') {node.remove();}
                });
            }
            node = useY.all('.itsa-fontfamily');
            if (node.size()>0) {
                node.each(function(node){
                    if (node.getHTML()==='') {node.remove();}
                });
            }
            node = useY.all('.itsa-fontcolor');
            if (node.size()>0) {
                node.each(function(node){
                    if (node.getHTML()==='') {node.remove();}
                });
            }
            node = useY.all('.itsa-markcolor');
            if (node.size()>0) {
                node.each(function(node){
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
            Y.log('_setCursorAtRef', 'info', 'ITSAToolbar');
            var instance = this,
                sel,
                node = instance.editorY.one('#itsatoolbar-ref');
            if (node) {
                sel = new instance.editorY.EditorSelection();
                sel.selectNode(node);
                // DO NOT call _removeCursorref straight away --> it will make Opera crash
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
            var instance = this;
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
            return this._backupCursorRef;
        },

        /**
         * Syncs the toolbar's status with the editor.<br>
         * @method sync
         * @param {EventFacade} [e] will be passed when the editor fires a nodeChange-event, but if called manually, leave e undefined. Then the function will search for the current cursorposition.
        */
        sync : function(e) {
            // syncUI will sync the toolbarstatus with the editors cursorposition
            Y.log('sync', 'info', 'ITSAToolbar');
            var instance = this,
                cursorRef;
            if (!(e && e.changedNode)) {
                cursorRef = instance._getCursorRef(false);
                if (!e) {e = {changedNode: cursorRef};}
                else {e.changedNode = cursorRef;}
                Y.later(250, instance, instance._removeCursorRef);
            }
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
            Y.log('addButton', 'info', 'ITSAToolbar');
            var instance = this,
                buttonNode,
                buttonInnerNode;
            buttonNode = Node.create(ITSA_BTNNODE);
            buttonNode.addClass(ITSA_BUTTON);
            if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
            else if (Lang.isObject(execCommand)) {
                if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}
                if (Lang.isString(execCommand.value)) {buttonNode.setData('execValue', execCommand.value);}
                if (Lang.isFunction(execCommand.customFunc)) {
                    buttonNode.addClass(ITSA_BTNCUSTOMFUNC);
                    buttonNode.on('click', execCommand.customFunc, execCommand.context || instance);
                }
            }
            if (Lang.isBoolean(indent) && indent) {buttonNode.addClass(ITSA_BTNINDENT);}
            buttonInnerNode = Node.create(ITSA_BTNINNERNODE);
            buttonInnerNode.addClass(iconClass);
            buttonNode.append(buttonInnerNode);
            instance.toolbarNode.append(buttonNode);
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
            Y.log('addSyncButton', 'info', 'ITSAToolbar');
            var instance = this,
                buttonNode = instance.addButton(iconClass, execCommand, indent, position);
            if (!isToggleButton) {buttonNode.addClass(ITSA_BTNSYNC);}
            instance.toolbarNode.addTarget(buttonNode);
            if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(syncFunc, context || instance));}
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
            Y.log('addToggleButton', 'info', 'ITSAToolbar');
            var instance = this,
                buttonNode = instance.addSyncButton(iconClass, execCommand, syncFunc, context, indent, position, true);
            buttonNode.addClass(ITSA_BTNTOGGLE);
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
            Y.log('addButtongroup', 'info', 'ITSAToolbar');
            var instance = this,
                buttonGroup = Y.guid(),
                button,
                buttonNode,
                returnNode = null,
                execCommand,
                i;
            for (i=0; i<buttons.length; i++) {
                button = buttons[i];
                if (button.iconClass && button.command) {
                    if (Lang.isString(button.value)) {execCommand = {command: button.command, value: button.value};}
                    else {execCommand = button.command;}
                    buttonNode = instance.addButton(button.iconClass, execCommand, indent && (i===0), (position) ? position+i : null);
                    buttonNode.addClass(ITSA_BTNGROUP);
                    buttonNode.addClass(ITSA_BTNGROUP+'-'+buttonGroup);
                    buttonNode.setData('buttongroup', buttonGroup);
                    instance.toolbarNode.addTarget(buttonNode);
                    if (Lang.isFunction(button.syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.bind(button.syncFunc, button.context || instance));}
                    if (!returnNode) {returnNode = buttonNode;}
                }
            }
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
            Y.log('addSelectlist', 'info', 'ITSAToolbar');
            var instance = this,
                selectlist;
            config = Y.merge(config, {items: items, defaultButtonText: ''});
            selectlist = new Y.ITSASelectList(config);
            selectlist.after('render', function(e, execCommand, syncFunc, context, indent){
                Y.log('addSelectlist - rendered', 'cmas', 'ITSAToolbar');
                var instance = this,
                    selectlist = e.currentTarget,
                    buttonNode = selectlist.buttonNode;
                if (Lang.isString(execCommand)) {buttonNode.setData('execCommand', execCommand);}
                else {
                    if (Lang.isString(execCommand.command)) {buttonNode.setData('execCommand', execCommand.command);}                    
                    if (Lang.isString(execCommand.restoreCommand)) {buttonNode.setData('restoreCommand', execCommand.restoreCommand);}                    
                    if (Lang.isString(execCommand.restoreValue)) {buttonNode.setData('restoreValue', execCommand.restoreValue);}                    
                }
                if (indent) {selectlist.get('boundingBox').addClass('itsa-button-indent');}
                instance.toolbarNode.addTarget(buttonNode);
                selectlist.on('show', instance._createBackupCursorRef, instance);
                selectlist.on('selectChange', instance._handleSelectChange, instance);
                if (Lang.isFunction(syncFunc)) {buttonNode.on('itsatoolbar:statusChange', Y.rbind(syncFunc, context || instance));}
                instance.editor.on('nodeChange', selectlist.hideListbox, selectlist);
            }, instance, execCommand, syncFunc, context, indent);
            selectlist.render(instance.toolbarNode);
            return selectlist;
        },


        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
        */
        destructor : function() {
            Y.log('destructor', 'info', 'ITSAToolbar');
            var instance = this,
                srcNode = instance.get('srcNode');
             // first, set _notDestroyed to false --> this will prevent rendering if editor.frame:ready fires after toolbars destruction
            instance._destroyed = true;
            instance._removeCursorRef();
            if (instance._timerClearEmptyFontRef) {instance._timerClearEmptyFontRef.cancel();}
            instance._clearEmptyFontRef();
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
            Y.log('_renderUI', 'info', 'ITSAToolbar');
            var instance = this,
                correctedHeight = 0,
                srcNode = instance.get('srcNode'),
                btnSize = instance.get('btnSize');
            // be sure that its.yui3-widget-loading, because display:none will make it impossible to calculate size of nodes during rendering
            instance.toolbarNode = Node.create(ITSA_TOOLBAR_TEMPLATE);
            if (btnSize===1) {instance.toolbarNode.addClass(ITSA_TOOLBAR_SMALL);}
            else {if (btnSize===2) {instance.toolbarNode.addClass(ITSA_TOOLBAR_MEDIUM);}}
            if (srcNode) {
                srcNode.prepend(instance.toolbarNode);
            }
            else {
                instance.toolbarNode.addClass(ITSA_CLASSEDITORPART);
                switch (instance.get('btnSize')) {
                    case 1:
                        correctedHeight = -40;
                    break;
                    case 2: 
                        correctedHeight = -44;
                    break;
                    case 3: 
                        correctedHeight = -46;
                    break;
                }
                correctedHeight += parseInt(instance.containerNode.get('offsetHeight'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('paddingTop'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderTopWidth'),10) 
                                 - parseInt(instance.containerNode.getComputedStyle('borderBottomWidth'),10);
                instance.editorNode.set('height', correctedHeight);
                instance.editorNode.insert(instance.toolbarNode, 'before');
            }
            instance._initializeButtons();
        },
        
        /**
         * Binds events when there is a cursorstatus changes in the editor
         *
         * @method _bindUI
         * @private
        */
        _bindUI : function() {
            Y.log('_bindUI', 'info', 'ITSAToolbar');
            var instance = this;
            instance.editor.on('nodeChange', instance.sync, instance);
            instance.toolbarNode.delegate('click', instance._handleBtnClick, 'button', instance);
        },

        /**
         * Defines all custom execCommands
         *
         * @method _defineCustomExecCommands
         * @private
        */
        _defineCustomExecCommands : function() {
            Y.log('_defineCustomExecCommands', 'info', 'ITSAToolbar');
            var instance = this;
            instance._defineExecCommandHeader();
            instance._defineExecCommandFontFamily();
            instance._defineExecCommandFontSize();
            instance._defineExecCommandFontColor();
            instance._defineExecCommandMarkColor();
            instance._defineExecCommandHyperlink();
            instance._defineExecCommandMaillink();
            instance._defineExecCommandImage();
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
            Y.log('_handleBtnClick', 'info', 'ITSAToolbar');
            var instance = this,
                node = e.currentTarget;
            // only execute for .itsa-button, not for all buttontags    
            if (node.hasClass(ITSA_BUTTON)) {
                if (node.hasClass(ITSA_BTNTOGGLE)) {
                    node.toggleClass(ITSA_BTNPRESSED);
                }
                else if (node.hasClass(ITSA_BTNSYNC)) {
                    node.toggleClass(ITSA_BTNACTIVE, true);
                }
                else if (node.hasClass(ITSA_BTNGROUP)) {
                    instance.toolbarNode.all('.' + ITSA_BTNGROUP + '-' + node.getData('buttongroup')).toggleClass(ITSA_BTNPRESSED, false);
                    node.toggleClass(ITSA_BTNPRESSED, true);
                }
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
            Y.log('_handleSelectChange', 'info', 'ITSAToolbar');
            var selectButtonNode,
                restoreCommand,
                execCommand;
            selectButtonNode = e.currentTarget.buttonNode;
            restoreCommand = selectButtonNode.getData('restoreCommand');
            execCommand = (restoreCommand && (e.value===selectButtonNode.getData('restoreValue'))) ? restoreCommand : selectButtonNode.getData('execCommand');
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
            Y.log('_execCommandFromData', 'info', 'ITSAToolbar');
            var execCommand,
                execValue;
            execCommand = buttonNode.getData('execCommand');
            execValue = buttonNode.getData('execValue');
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
            Y.log('execCommand', 'info', 'ITSAToolbar');
            var instance = this,
                tmpnode;
            instance.editor.focus();
            if (command==='inserthtml') {
                // we need a tmp-ref which is an img-element instead of a span-element --> inserthtml of span does not work in chrome and safari
                // but inserting img does, which can replaced afterwards
                // first a command that I don't understand: but we need this, because otherwise some browsers will replace <br> by <p> elements
                instance.editor._execCommand('createlink', '&nbsp;');
                instance.editor.exec.command('inserthtml', ITSA_TMPREFNODE);
                tmpnode = instance.editorY.one('#itsatoolbar-tmpref');
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
            Y.log('_hasSelection', 'info', 'ITSAToolbar');
            var instance = this,
                sel = new instance.editorY.EditorSelection();
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
            Y.log('_checkInbetweenHeader', 'info', 'ITSAToolbar');
            var instance = this,
                pattern = '<\\s*' + selector + '[^>]*>(.*?)<\\s*/\\s*' + selector  + '>',
                searchHeaderPattern = new RegExp(pattern, 'gi'),
                fragment,
                inbetween = false,
                refContent = instance.editorY.one('body').getHTML(),
                cursorid,
                cursorindex;
            cursorid = cursornode.get('id');
            cursorindex = refContent.indexOf(' id="' + cursorid + '"');
            if (cursorindex===-1) {cursorindex = refContent.indexOf(" id='" + cursorid + "'");}
            if (cursorindex===-1) {cursorindex = refContent.indexOf(" id=" + cursorid);}
            fragment = searchHeaderPattern.exec(refContent);
            while ((fragment !== null) && !inbetween) {
                inbetween = ((cursorindex>=fragment.index) && (cursorindex<(fragment.index+fragment[0].length)));
                fragment = searchHeaderPattern.exec(refContent); // next search
            }
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
            Y.log('_getActiveHeader', 'info', 'ITSAToolbar');
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
            if (cursornode) {    
                // node can be a header right away, or it can be a node within a header. Check for both
                nodetag = cursornode.get('tagName');
                if (nodetag.length>1) {headingNumber = parseInt(nodetag.substring(1), 10);}
                if ((nodetag.length===2) && (nodetag.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                    returnNode = cursornode;
                }
                else {
                    cursorid = cursornode.get('id');
                    // first look for endtag, to determine which headerlevel to search for
                    pattern = ' id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h\\d>';
                    searchHeaderPattern = new RegExp(pattern, 'gi');
                    refContent = instance.editorY.one('body').getHTML();
                    fragment = searchHeaderPattern.exec(refContent);


                    if (fragment !== null) {
                        // search again, looking for the right headernumber
                        endpos = fragment.index+fragment[0].length-1;
                        headingNumber = refContent.substring(endpos-1, endpos);
                        pattern = '<\\s*h' + headingNumber + '[^>]*>(.*?)id=("|\')?' + cursorid + '("|\')?(.*?)<\\s*/\\s*h' + headingNumber + '>';
                        searchHeaderPattern = new RegExp(pattern, 'gi');
                        fragment = searchHeaderPattern.exec(refContent); // next search
                        if (fragment !== null) {
                            nodeFound = refContent.substring(fragment.index, fragment.index+fragment[0].length);
                        }
                    }
                    if (nodeFound) {
                        checkNode = Node.create(nodeFound);
                        returnNode = instance.editorY.one('#' + checkNode.get('id'));
                    }
                }
            }
            return returnNode;
        },

        /**
         * Performs the initialisation of the visible buttons. By setting the attributes, one can change which buttons will be rendered.
         *
         * @method _initializeButtons
         * @private
        */
        _initializeButtons : function() { 
            Y.log('_initializeButtons', 'info', 'ITSAToolbar');
            var instance = this,
                i, r, g, b,
                item,
                items,
                bgcolor,
                docFontSize,
                bgcolors,
                buttons;

            // create fonffamily button
            if (instance.get('btnFontfamily')) {
                Y.log('Defining button btnFontfamily', 'info', 'ITSAToolbar');
                items = instance.get('fontFamilies');
                for (i=0; i<items.length; i++) {
                    item = items[i];
                    items[i] = {text: "<span style='font-family:"+item+"'>"+item+"</span>", returnValue: item};
                }
                instance.fontSelectlist = instance.addSelectlist(items, 'itsafontfamily', function(e) {
                    var familyList = e.changedNode.getStyle('fontFamily'),
                        familyListArray = familyList.split(','),
                        activeFamily = familyListArray[0];
                    // some browsers place '' surround the string, when it should contain whitespaces.
                    // first remove them
                    if ((activeFamily.substring(0,1)==="'") || (activeFamily.substring(0,1)==='"')) {activeFamily = activeFamily.substring(1, activeFamily.length-1);}
                    this.fontSelectlist.selectItemByValue(activeFamily, true, true);
                }, null, true, {buttonWidth: 145});
            }

            // create fontsize button
            if (instance.get('btnFontsize')) {
                Y.log('Defining button btnFontsize', 'info', 'ITSAToolbar');
                items = [];
                for (i=6; i<=32; i++) {items.push({text: i.toString(), returnValue: i+'px'});}
                instance.sizeSelectlist = instance.addSelectlist(items, 'itsafontsize', function(e) {
                    var fontSize = e.changedNode.getComputedStyle('fontSize'),
                        fontSizeNumber = parseFloat(fontSize),
                        fontsizeExt = fontSize.substring(fontSizeNumber.toString().length);
                    // make sure not to display partial numbers    
                    this.sizeSelectlist.selectItemByValue(Lang.isNumber(fontSizeNumber) ? Math.round(fontSizeNumber)+fontsizeExt : '', true);
                }, null, true, {buttonWidth: 42, className: 'itsatoolbar-fontsize', listAlignLeft: false});
            }

            // create header button
            if (instance.get('btnHeader')) {
                Y.log('Defining button btnHeader', 'info', 'ITSAToolbar');
                items = [];
                items.push({text: 'No header', returnValue: 'none'});
                for (i=1; i<=instance.get('headerLevels'); i++) {items.push({text: 'Header '+i, returnValue: 'h'+i});}
                instance.headerSelectlist = instance.addSelectlist(items, 'itsaheading', function(e) {
                    var instance = this,
                        node = e.changedNode,
                        internalcall = (e.sender && e.sender==='itsaheading'),
                        activeHeader;
                    // prevent update when sync is called after heading has made changes. Check this through e.sender
                    if (!internalcall) {
                        activeHeader = instance._getActiveHeader(node);
                        instance.headerSelectlist.selectItem(activeHeader ? parseInt(activeHeader.get('tagName').substring(1), 10) : 0);
                        instance.headerSelectlist.set('disabled', Lang.isNull(activeHeader) && !instance._hasSelection());
                    }
                }, null, true, {buttonWidth: 96});
            }

            // create bold button
            if (instance.get('btnBold')) {
                Y.log('Defining button btnBold', 'info', 'ITSAToolbar');
                instance.addToggleButton(instance.ICON_BOLD, 'bold', function(e) {
                    var fontWeight = e.changedNode.getStyle('fontWeight');
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (Lang.isNumber(parseInt(fontWeight, 10)) ? (fontWeight>=600) : ((fontWeight==='bold') || (fontWeight==='bolder'))));
                }, null, true);
            }

            // create italic button
            if (instance.get('btnItalic')) {
                Y.log('Defining button btnItalic', 'info', 'ITSAToolbar');
                instance.addToggleButton(instance.ICON_ITALIC, 'italic', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('fontStyle')==='italic'));
                });
            }

            // create underline button
            if (instance.get('btnUnderline')) {
                Y.log('Defining button btnUnderline', 'info', 'ITSAToolbar');
                instance.addToggleButton(instance.ICON_UNDERLINE, 'underline', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textDecoration')==='underline'));
                });
            }

            // create align buttons
            if (instance.get('grpAlign')) {
                Y.log('Defining buttongroup grpAlign', 'info', 'ITSAToolbar');
                buttons = [
                    {
                        iconClass : instance.ICON_ALIGN_LEFT,
                        command : 'JustifyLeft',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, ((e.changedNode.getStyle('textAlign')==='left') || (e.changedNode.getStyle('textAlign')==='start')));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_CENTER,
                        command : 'JustifyCenter',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='center'));
                                    }
                    },
                    {
                        iconClass : instance.ICON_ALIGN_RIGHT,
                        command : 'JustifyRight',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='right'));
                                    }
                    }
                ];
            // create justify button
                if (instance.get('btnJustify')) {
                    Y.log('Defining button btnJustify', 'info', 'ITSAToolbar');
                    buttons.push({
                        iconClass : instance.ICON_ALIGN_JUSTIFY,
                        command : 'JustifyFull',
                        value : '',
                        syncFunc : function(e) {
                                       e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.getStyle('textAlign')==='justify'));
                                    }
                    });
                }
                instance.addButtongroup(buttons, true);
            }

            // create subsuperscript buttons
            if (instance.get('grpSubsuper')) {
                Y.log('Defining buttongroup grpSubsuper', 'info', 'ITSAToolbar');
                instance.addToggleButton(instance.ICON_SUBSCRIPT, 'subscript', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sub')));
                }, null, true);
                instance.addToggleButton(instance.ICON_SUPERSCRIPT, 'superscript', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (e.changedNode.test('sup')));
                });
            }

            // create textcolor button
            if (instance.get('btnTextcolor')) {
                Y.log('Defining button btnTextcolor', 'info', 'ITSAToolbar');
                items = [];
                bgcolors = instance.get('colorPallet');
                for (i=0; i<bgcolors.length; i++) {
                    bgcolor = bgcolors[i];
                    items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                instance.colorSelectlist = instance.addSelectlist(items, 'itsafontcolor', function(e) {
                    var instance = this,
                        styleColor = e.changedNode.getStyle('color'),
                        hexColor = instance._filter_rgb(styleColor);
                    instance.colorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_TEXTCOLOR});
            }

            // create markcolor button
            if (instance.get('btnMarkcolor')) {
                Y.log('Defining button btnMarkcolor', 'info', 'ITSAToolbar');
                items = [];
                bgcolors = instance.get('colorPallet');
                for (i=0; i<bgcolors.length; i++) {
                    bgcolor = bgcolors[i];
                    items.push({text: "<div style='background-color:"+bgcolor+";'></div>", returnValue: bgcolor});
                }
                instance.markcolorSelectlist = instance.addSelectlist(items, 'itsamarkcolor', function(e) {
                    var instance = this,
                        styleColor = e.changedNode.getStyle('backgroundColor'),
                        hexColor = instance._filter_rgb(styleColor);
                    instance.markcolorSelectlist.selectItemByValue(hexColor, true, true);
                }, null, true, {listWidth: 256, className: 'itsatoolbar-colors', iconClassName: instance.ICON_MARKCOLOR});
            }

            // create indent buttons
            if (instance.get('grpIndent')) {
                Y.log('Defining buttongroup grpIndent', 'info', 'ITSAToolbar');
                instance.addButton(instance.ICON_INDENT, 'indent', true);
                instance.addButton(instance.ICON_OUTDENT, 'outdent');
            }

            // create list buttons
            if (instance.get('grpLists')) {
                Y.log('Defining buttongroup grpLists', 'info', 'ITSAToolbar');
                instance.addToggleButton(instance.ICON_UNORDEREDLIST, 'insertunorderedlist', function(e) {
                    var instance = this,
                        node = e.changedNode;
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ul', node)));
                }, null, true);
                instance.addToggleButton(instance.ICON_ORDEREDLIST, 'insertorderedlist', function(e) {
                    var instance = this,
                        node = e.changedNode;
                    e.currentTarget.toggleClass(ITSA_BTNPRESSED, (instance._checkInbetweenSelector('ol', node)));
                });
            }

            // create email button
            if (instance.get('btnEmail')) {
                Y.log('Defining button btnEmail', 'info', 'ITSAToolbar');
                instance.addSyncButton(instance.ICON_EMAIL, 'itsacreatemaillink', function(e) {
                    var instance = this,
                        node = e.changedNode,
                        nodePosition,
                        isLink,
                        isEmailLink;
                    isLink =  instance._checkInbetweenSelector('a', node);
                    if (isLink) {
                        // check if its a normal href or a mailto:
                        while (node && !node.test('a')) {node=node.get('parentNode');}
                        // be carefull: do not === /match() with text, that will fail
                        isEmailLink = (node.get('href').match('^mailto:', 'i')=='mailto:');
                    }
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isEmailLink));
                }, null, true);
            }

            // create hyperlink button
            if (instance.get('btnHyperlink')) {
                Y.log('Defining button btnHyperlink', 'info', 'ITSAToolbar');
                instance.addSyncButton(instance.ICON_HYPERLINK, 'itsacreatehyperlink', function(e) {
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
                    isLink =  instance._checkInbetweenSelector('a', node);
                        if (isLink) {
                            // check if its a normal href or a mailto:
                            while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            href = node.get('href');
                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            if (isHyperLink) {
                                lastDot = href.lastIndexOf('.');
                                if (lastDot!==-1) {
                                    fileExt = href.substring(lastDot)+'.';
                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (isLink && isHyperLink && !isFileLink));
                });
            }

            // create image button
            if (instance.get('btnImage')) {
                Y.log('Defining button btnImage', 'info', 'ITSAToolbar');
                instance.addSyncButton(instance.ICON_IMAGE, 'itsacreateimage', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('img')));
                });
            }

            // create video button
            if (instance.get('btnVideo')) {
                Y.log('Defining button btnVideo', 'info', 'ITSAToolbar');
                instance.addSyncButton(instance.ICON_VIDEO, 'itsacreateyoutube', function(e) {
                    e.currentTarget.toggleClass(ITSA_BTNACTIVE, (e.changedNode.test('iframe')));
                });
            }

//************************************************
// just for temporary local use ITS Asbreuk
// should NOT be part of the gallery
            if (false) {
                instance.addSyncButton(
                    instance.ICON_FILE,
                    {   customFunc: function(e) {
                            Y.config.cmas2plus.uploader.show(
                                null, 
                                Y.bind(function(e) {
                                    this.editor.execCommand('itsacreatehyperlink', 'http://files.brongegevens.nl/' + Y.config.cmas2plusdomain + '/' + e.n);
                                }, this)
                            );
                        }
                    },
                    function(e) {
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
                        isLink =  instance._checkInbetweenSelector('a', node);
                        if (isLink) {
                            // check if its a normal href or a mailto:
                            while (node && !node.test('a')) {node=node.get('parentNode');}
                            // be carefull: do not === /match() with text, that will fail
                            href = node.get('href');
                            isHyperLink = href.match('^mailto:', 'i')!='mailto:';
                            if (isHyperLink) {
                                lastDot = href.lastIndexOf('.');
                                if (lastDot!==-1) {
                                    fileExt = href.substring(lastDot)+'.';
                                    isFileLink = (posibleFiles.indexOf(fileExt) !== -1);
                                }
                            }
                        }
                        e.currentTarget.toggleClass(ITSA_BTNACTIVE, isFileLink);
                    }
                );
            }
//************************************************

            if (instance.get('grpUndoredo')) {
                Y.log('Defining buttongroup grpundoredo', 'info', 'ITSAToolbar');
                instance.addButton(instance.ICON_UNDO, 'undo', true);
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
            Y.log('_filter_rgb', 'info', 'ITSAToolbar');
            if (css.toLowerCase().indexOf('rgb') != -1) {
                var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi"),
                    rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(','),
                    r, g, b;
            
                if (rgb.length === 5) {
                    r = parseInt(rgb[1], 10).toString(16);
                    g = parseInt(rgb[2], 10).toString(16);
                    b = parseInt(rgb[3], 10).toString(16);

                    r = r.length === 1 ? '0' + r : r;
                    g = g.length === 1 ? '0' + g : g;
                    b = b.length === 1 ? '0' + b : b;

                    css = "#" + r + g + b;
                }
            }
            return css;
        },

        /**
        * Defines the execCommand itsaheading
        * @method _defineExecCommandHeader
        * @private
        */
        _defineExecCommandHeader : function() {
            if (!Y.Plugin.ExecCommand.COMMANDS.itsaheading) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsaheading', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsaheading: function(cmd, val) {
                        Y.log('executing custom execCommand itsaheading', 'info', 'ITSAToolbar');
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef = itsatoolbar._getBackupCursorRef(),
                            activeHeader = itsatoolbar._getActiveHeader(noderef),
                            headingNumber = 0,
                            disableSelectbutton = false,
                            node;
                        if (val==='none') {
                            // want to clear heading
                            if (activeHeader) {
                                activeHeader.replace("<p>"+activeHeader.getHTML()+"</p>");
                                // need to disable the selectbutton right away, because there will be no syncing on the headerselectbox
                                itsatoolbar.headerSelectlist.set('disabled', true);
                            }
                        } else {
                            // want to add or change a heading
                            if (val.length>1) {headingNumber = parseInt(val.substring(1), 10);}
                            if ((val.length===2) && (val.toLowerCase().substring(0,1)==='h') && (headingNumber>0) && (headingNumber<10)) {
                                node = activeHeader ? activeHeader : noderef;
                                // make sure you set an id to the created header-element. Otherwise _getActiveHeader() cannot find it in next searches
                                node.replace("<"+val+" id='" + editorY.guid() + "'>"+node.getHTML()+"</"+val+">");
                            }
                        }
                        // do a toolbarsync, because styles will change.
                        // but do not refresh the heading-selectlist! Therefore e.sender is defined
                        itsatoolbar.sync({sender: 'itsaheading', changedNode: editorY.one('#itsatoolbar-ref')});
                        // take some time to let the sync do its work before set and remove cursor
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
            Y.log('_defineExecCommandFontFamily', 'info', 'ITSAToolbar');
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontfamily) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsafontfamily', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontfamily: function(cmd, val) {
                        Y.log('executing custom execCommand itsafontfamily', 'info', 'ITSAToolbar');
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            // first cleaning up old fontsize
                            noderef.all('span').setStyle('fontFamily', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_FONTFAMILYNODE).replaceClass(ITSA_FONTFAMILYNODE, ITSA_REFSELECTION);
                            noderef.setStyle('fontFamily', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_FONTFAMILYNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTFAMILYNODE + "' style='font-family:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
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
            Y.log('_defineExecCommandFontSize', 'info', 'ITSAToolbar');
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontsize) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsafontsize', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontsize: function(cmd, val) {
                        Y.log('executing custom execCommand itsafontsize', 'info', 'ITSAToolbar');
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            parentnode,
                            browserNeedsContent,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            //We have a selection
                            parentnode = noderef.get('parentNode');
                            if (Y.UA.webkit) {
                                parentnode.setStyle('lineHeight', '');
                            }
                            // first cleaning up old fontsize
                            noderef.all('span').setStyle('fontSize', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_FONTSIZENODE).replaceClass(ITSA_FONTSIZENODE, ITSA_REFSELECTION);
                            noderef.setStyle('fontSize', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_FONTSIZENODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTSIZENODE + "' style='font-size:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
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
            Y.log('_defineExecCommandFontSize', 'info', 'ITSAToolbar');
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            if (!Y.Plugin.ExecCommand.COMMANDS.itsafontcolor) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsafontcolor', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsafontcolor: function(cmd, val) {
                        Y.log('executing custom execCommand itsafontcolor', 'info', 'ITSAToolbar');
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            //We have a selection
                            // first cleaning up old fontcolors
                            noderef.all('span').setStyle('color', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_FONTCOLORNODE).replaceClass(ITSA_FONTCOLORNODE, ITSA_REFSELECTION);
                            noderef.setStyle('color', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_FONTCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_FONTCOLORNODE + "' style='color:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
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
            Y.log('_defineExecCommandFontSize', 'info', 'ITSAToolbar');
            // This function seriously needs redesigned.
            // it does work, but as you can see in the comment, there are some flaws
            if (!Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsamarkcolor', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsamarkcolor: function(cmd, val) {
                        Y.log('executing custom execCommand itsamarkcolor', 'info', 'ITSAToolbar');
                        var editor = this.get('host'),
                            editorY = editor.getInstance(),
                            itsatoolbar = editor.itsatoolbar,
                            noderef,
                            browserNeedsContent,
                            selection;
                        if (itsatoolbar._timerClearEmptyFontRef) {itsatoolbar._timerClearEmptyFontRef.cancel();}
                        itsatoolbar._clearEmptyFontRef();
                        noderef = itsatoolbar._getBackupCursorRef();
                        selection = noderef.hasClass(ITSA_REFSELECTION);
                        if (selection) {
                            //We have a selection
                            // first cleaning up old fontbgcolors
                            noderef.all('span').setStyle('backgroundColor', '');
                            // now previous created span-tags will be marked as temp-selection --> this way the can be removed (retaining innerhtml)
                            noderef.all('.'+ITSA_MARKCOLORNODE).replaceClass(ITSA_MARKCOLORNODE, ITSA_REFSELECTION);
                            noderef.setStyle('backgroundColor', val);
                            // now, mark this node, so we know it is made by itsafontsize. This way, we can cleanup when fontsize is generated multiple times (prevent creating span within span)
                            noderef.addClass(ITSA_MARKCOLORNODE);
                            // remove the selection-mark before removing tmp-node placeholder: we need to keep the node
                            noderef.removeClass(ITSA_REFSELECTION);
                            // remove the tmp-node placeholder
                            itsatoolbar._setCursorAtRef();
                        }
                        else {
                            itsatoolbar.execCommand("inserthtml", "<span class='" + ITSA_MARKCOLORNODE + "' style='backgroundColor:" + val + "'>" + ITSA_REFEMPTYCONTENT + ITSA_REFNODE + "</span>");
                            itsatoolbar._setCursorAtRef();
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
            Y.log('_defineExecCommandHyperlink', 'info', 'ITSAToolbar');
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    // val can be:
                    // 'img', 'url', 'video', 'email'
                    itsacreatehyperlink: function(cmd, val) {
                        Y.log('executing custom execCommand itsacreatehyperlink', 'info', 'ITSAToolbar');
                        var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        url = val || prompt('Enter url', 'http://');
                        if (url) {
                            holder = editorY.config.doc.createElement('div');
                            url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            url = editorY.config.doc.createTextNode(url);
                            holder.appendChild(url);
                            url = holder.innerHTML;
                            execCommandInstance.get('host')._execCommand('createlink', url);
                            sel = new editorY.EditorSelection();
                            out = sel.getSelected();
                            if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                a = out.item(0).one('a');
                                if (a) {
                                    out.item(0).replace(a);
                                }
                                if (a && Y.UA.gecko) {
                                    if (a.get('parentNode').test('span')) {
                                        if (a.get('parentNode').one('br.yui-cursor')) {
                                           a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url + '" target="_blank">' + url + '</a>');
                            }
                        }
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
            Y.log('_defineExecCommandMaillink', 'info', 'ITSAToolbar');
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsacreatemaillink', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreatemaillink: function(cmd, val) {
                        Y.log('executing custom execCommand itsacreatemaillink', 'info', 'ITSAToolbar');
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
                        url = val || prompt('Enter email', '');
                        if (url) {
                            holder = editorY.config.doc.createElement('div');
                            url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            urltext = url;
                            url = 'mailto:' + url;
                            url = editorY.config.doc.createTextNode(url);
                            holder.appendChild(url);
                            url = holder.innerHTML;
                            execCommandInstance.get('host')._execCommand('createlink', url);
                            sel = new editorY.EditorSelection();
                            out = sel.getSelected();
                            if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                a = out.item(0).one('a');
                                if (a) {
                                    out.item(0).replace(a);
                                }
                                if (a && Y.UA.gecko) {
                                    if (a.get('parentNode').test('span')) {
                                        if (a.get('parentNode').one('br.yui-cursor')) {
                                           a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                execCommandInstance.get('host').execCommand('inserthtml', '<a href="' + url+ '">' + urltext + '</a>');
                            }
                        }
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
            Y.log('_defineExecCommandImage', 'info', 'ITSAToolbar');
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateimage) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsacreateimage', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateimage: function(cmd, val) {
                        Y.log('executing custom execCommand itsacreateimage', 'info', 'ITSAToolbar');
                        var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        url = val || prompt('Enter link to image', 'http://');
                        if (url) {
                            holder = editorY.config.doc.createElement('div');
                            url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            url = editorY.config.doc.createTextNode(url);
                            holder.appendChild(url);
                            url = holder.innerHTML;
                            execCommandInstance.get('host')._execCommand('createlink', url);
                            sel = new editorY.EditorSelection();
                            out = sel.getSelected();
                            if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                a = out.item(0).one('a');
                                if (a) {
                                    out.item(0).replace(a);
                                }
                                if (a && Y.UA.gecko) {
                                    if (a.get('parentNode').test('span')) {
                                        if (a.get('parentNode').one('br.yui-cursor')) {
                                           a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                execCommandInstance.get('host').execCommand('inserthtml', '<img src="' + url + '" />');
                            }
                        }
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
            Y.log('_defineExecCommandYouTube', 'info', 'ITSAToolbar');
            if (!Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube) {
                Y.log('declaring Y.Plugin.ExecCommand.COMMANDS.itsacreateyoutube', 'info', 'ITSAToolbar');
                Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
                    itsacreateyoutube: function(cmd, val) {
                        Y.log('executing custom execCommand itsacreateyoutube', 'info', 'ITSAToolbar');
                        var execCommandInstance = this,
                            editorY = execCommandInstance.get('host').getInstance(),
                            out, 
                            a, 
                            sel, 
                            holder, 
                            url, 
                            videoitem, 
                            videoitempos;
                        url = val || prompt('Enter link to image', 'http://');
                        if (url) {
                            holder = editorY.config.doc.createElement('div');
                            url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                            url = editorY.config.doc.createTextNode(url);
                            holder.appendChild(url);
                            url = holder.innerHTML;
                            execCommandInstance.get('host')._execCommand('createlink', url);
                            sel = new editorY.EditorSelection();
                            out = sel.getSelected();
                            if (!sel.isCollapsed && out.size()) {
                                //We have a selection
                                a = out.item(0).one('a');
                                if (a) {
                                    out.item(0).replace(a);
                                }
                                if (a && Y.UA.gecko) {
                                    if (a.get('parentNode').test('span')) {
                                        if (a.get('parentNode').one('br.yui-cursor')) {
                                           a.get('parentNode').insert(a, 'before');
                                        }
                                    }
                                }
                            } else {
                                //No selection, insert a new node..
                                    videoitempos = url.indexOf('watch?v=');
                                    if (videoitempos!==-1) {
                                        videoitem = url.substring(url.videoitempos+8);
                                        execCommandInstance.get('host').execCommand('inserthtml', '<iframe width="420" height="315" src="http://www.youtube.com/embed/' + videoitem + '" frameborder="0" allowfullscreen></iframe>');
                                    }
                            }
                        }
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
                    return Y.one(val);
                },
                validator: function(val) {
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
                    return Lang.isArray(val) ;
                }

            }
        }
    }
);


}, 'gallery-2012.09.26-20-36' ,{requires:['plugin', 'base-build', 'node-base', 'editor', 'event-delegate', 'event-custom', 'cssbutton', 'gallery-itsaselectlist'], skinnable:true});
