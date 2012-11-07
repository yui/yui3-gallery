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
_yuitest_coverage["/build/gallery-itsadialogbox/gallery-itsadialogbox.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-itsadialogbox/gallery-itsadialogbox.js",
    code: []
};
_yuitest_coverage["/build/gallery-itsadialogbox/gallery-itsadialogbox.js"].code=["YUI.add('gallery-itsadialogbox', function(Y) {","","'use strict';","","// TO DO:","// wait for show until the widget is rendered","// When form is disabled, the cancelbutton doesn only close when pressed twice","","/**"," * The Itsa Dialogbox module."," *"," * @module itsa-dialogbox"," */","","/**"," * Dialogbox with sugar messages"," * "," *"," * @class ITSADialogbox"," * @extends Panel"," * @constructor"," *"," * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>"," * YUI BSD License - http://developer.yahoo.com/yui/license.html"," *","*/","","// Local constants","var Lang = Y.Lang,","    ITSADIALOG_ICON_TEMPLATE = \"<div class='itsadialogbox-icon {iconclass}'></div>\",","    ITSADIALOG_BODY_TEMPLATE = \"<div{bdclass}>{bdtext}</div>\",","    ITSADIALOG_INLINEFORM = \"itsa-dialog-inlineform\";","","Y.ITSADIALOGBOX = Y.Base.create('itsadialogbox', Y.Panel, [], {","","        ICON_BUBBLE : 'icon-bubble',","        ICON_INFO : 'icon-info',","        ICON_QUESTION : 'icon-question',","        ICON_WARN : 'icon-warn',","        ICON_ERROR : 'icon-error',","        ICON_SUCCESS : 'icon-success',","        ACTION_HIDE : '_actionHide',","        ACTION_STAYALIVE : '_actionStayAlive',","        ACTION_RESET : '_actionReset',","        ACTION_CLEAR : '_actionClear',","        panelOptions : [], ","        _activePanelOption : null,","        _validationButtons : null,","        _descendantChange : 0,","","// -- Public Static Properties -------------------------------------------------","","/**"," * Reference to the editor's instance"," * @property ICON_BUBBLE"," * @type String"," */","","/**"," * Reference to the editor's instance"," * @property ICON_INFO"," * @type String"," */","","/**"," * Reference to the editor's instance"," * @property ICON_QUESTION"," * @type String"," */","","/**"," * Reference to the editor's instance"," * @property ICON_WARN"," * @type String"," */","","/**"," * Reference to the editor's instance"," * @property ICON_ERROR"," * @type String"," */","","/**"," * Reference to the editor's instance"," * @property ICON_SUCCESS"," * @type String"," */","","/**"," * Reference to the hide-function that can be attached to button.action. This function closes the Panel and executes the callback."," * @property ACTION_HIDE"," * @type String"," */","","/**"," * Reference to the stayalive-function that can be attached to button.action. This function just execute the callback, but the Panel stays alive. In need you just want to read the Panel-values."," * @property ACTION_STAYALIVE"," * @type String"," */","","/**"," * Reference to the clear-function that can be attached to button.action. This function will clear any form-elements."," * @property ACTION_CLEAR"," * @type String"," */","","/**"," * Reference to the reset-function that can be attached to button.action. This function will reset any form-elements."," * @property ACTION_RESET"," * @type String"," */","","/**"," * Internal Array that holds all registred paneloptions, created through definePanel()"," * @property panelOptions"," * @type Array"," */","","/**"," * Internal reference to the active panelOptions (which is active after showPanel() is called"," * @property _activePanelOption"," * @type Object"," * @private"," */","","/**"," * Nodelist that contains all current (from _activePanelOption) buttons that have button.validated set to true."," * @property _validationButtons"," * @type Y.NodeList"," * @private"," */","","/**"," * Internal count that keeps track of how many times a descendentChange has been taken place by the focusManager"," * @property _descendantChange"," * @type Int"," * @private"," */","","        /**","         * @method initializer","         * @protected","        */","        initializer : function() {","            var instance = this;","            instance.get('contentBox').plug(Y.Plugin.NodeFocusManager, {","                descendants: 'button, input, textarea',","                circular: true,","                focusClass: 'focus'","            });","            instance._initiatePanels();","        },","","        /**","         * Defines a new Panel and stores it to the panelOptions-Array. Returns an panelId that can be used sot show the Panel later on using showPanel(panelId).<br>","         * PanelOptions is an object that can have the following fields:<br>","           <ul><li>iconClass (String) className for the icon, for example Y.Global.ItsaDialog.ICON\\_QUESTION</li>","               <li>form (Array) Array with objects that will be transformed to Y.FORMELEMENT objects (not currently available)</li>","               <li>buttons (Object) Which buttons to use. For example:","               <br>&nbsp;&nbsp;{","                    <br>&nbsp;&nbsp;&nbsp;&nbsp;footer: [","                        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name:'cancel', label:'Cancel', action: Y.Global.ItsaDialog.ACTION\\_HIDE},","                        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name:'ok', label:'Ok', action: Y.Global.ItsaDialog.ACTION\\_HIDE, validation: true, isDefault: true}    ","                    <br>&nbsp;&nbsp;&nbsp;&nbsp;]","               <br>&nbsp;&nbsp;}","               </li>    ","            </ul>    ","            <br><br>","            You can use 4 actionfunctions to attach at the button: Y.Global.ItsaDialog.ACTION_HIDE, Y.Global.ItsaDialog.ACTION_STAYALIVE, Y.Global.ItsaDialog.ACTION_RESET and Y.Global.ItsaDialog.ACTION_CLEAR","         * @method definePanel","         * @param {Object} panelOptions The config-object.","         * @return {Integer} unique panelId","        */","        definePanel: function(panelOptions) {","            var instance = this;","            if (Lang.isObject(panelOptions)) {","                instance.panelOptions.push(panelOptions);","                return instance.panelOptions.length - 1;","            }","            else {","                return -1;","            }","        },","","        /**","         * Shows the panel when you have a panelId. For usage with custom panels. The sugarmethods (showMessage() f.i.) use this method under the hood).","         *","         * @method showPanel","         * @param {Int} panelId Id of the panel that has to be shown. Retreive this value during definePanel()","         * @param {String} [title] showed in the header of the Panel.","         * @param {String} [bodyText] showed inside the Panel.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","         * @param {Object} [customButtons] In case you want custom buttons that differ from those defined during definePanel.","         * @param {String} [customIconclass] In case you want to use an iconclass that is different from to one defined during definePanel. Example: Y.Global.ItsaDialog.ICON_WARN","         * @param {Object} [eventArgs] do not use, only internal (temporarely)","        */","        showPanel: function(panelId, title, bodyText, callback, context, args, customButtons, customIconclass, eventArgs) {","            var instance = this,","                iconClass,","                contentBox = instance.get('contentBox');","            if ((panelId>=0) && (panelId<instance.panelOptions.length)) {","                instance._activePanelOption = instance.panelOptions[panelId];","                iconClass = customIconclass || instance._activePanelOption.iconClass;","                instance.get('boundingBox').toggleClass('withicon', Lang.isString(iconClass));","                // in case no title is given, the third argument will be the callback","                if (!Lang.isString(bodyText)) {","                    args = context;","                    context = callback;","                    callback = bodyText;","                    bodyText = title;","                    title = '&nbsp;'; // making the header appear","                }","                instance.set('headerContent', title || '&nbsp;'); // always making the header appear by display &nbsp;","                instance.set('bodyContent', (iconClass ? Lang.sub(ITSADIALOG_ICON_TEMPLATE, {iconclass: iconClass}) : '') + Lang.sub(ITSADIALOG_BODY_TEMPLATE, {bdclass: (iconClass ? ' class=\"itsadialogbox-messageindent\"' : ''), bdtext: bodyText}));","                instance.set('buttons', customButtons || instance._activePanelOption.buttons || {});","                instance._activePanelOption.callback = callback;","                instance._activePanelOption.context = context;","                instance._activePanelOption.args = args;","                instance._activePanelOption.eventArgs = eventArgs;","                // refreshing focusdescendents","                contentBox.focusManager.refresh();","                // recenter dialogbox in case it has been moved","                instance.centered();","                instance.activatePanel();","                contentBox.focusManager.focus(instance._getFirstFocusNode());","                instance.show();","            }","        },","","        //==============================================================================","      ","        /**","         * Shows a Panel with the buttons: <b>Abort Ignore Retry</b><br>","         * Look for <i>e.buttonName</i> to determine which button is pressed.","         * @method getRetryConfirmation","         * @param {String} [title] showed in the header of the Panel.","         * @param {String} question showed inside the Panel.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","        */","        getRetryConfirmation: function(title, question, callback, context, args) {","            this.showPanel(0, title, question, callback, context, args);","        },","","        /**","         * Shows a Panel with the buttons: <b>No Yes</b><br>","         * Look for <i>e.buttonName</i> to determine which button is pressed.","         * @method getConfirmation","         * @param {String} [title] showed in the header of the Panel.","         * @param {String} question showed inside the Panel.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","        */","        getConfirmation: function(title, question, callback, context, args) {","            this.showPanel(1, title, question, callback, context, args);","        },","","        /**","         * Shows a Panel with an inputfield and the buttons: <b>Cancel Ok</b><br>","         * @method getInput","         * @param {String} title showed in the header of the Panel.","         * @param {String} message showed inside the Panel.","         * @param {String} [defaultmessage] showed inside the form-input.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.","         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.","         * @return {String} passed by the eventTarget in the callback<br>","         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>","         * Look for <i>e.value</i> to determine the userinput.","        */","        getInput: function(title, message, defaultmessage, callback, context, args, customButtons, customIconclass) {","            var instance = this,","                bodyMessage,","                inputElement;","            instance.inputElement = new Y.ITSAFORMELEMENT({","                name: 'value',","                type: 'input',","                value: defaultmessage,","                classNameValue: 'yui3-itsadialogbox-stringinput itsa-formelement-lastelement',","                marginTop: 10,","                initialFocus: true,","                selectOnFocus: true","            });","            instance.showPanel(2, title, message + '<br>' + instance.inputElement.render(), callback, context, args, customButtons, customIconclass);","        },","","        /**","         * Shows a Panel with an inputfield and the buttons: <b>Cancel Ok</b>. Only accepts integer-number as return.<br>","         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>","         * Look for <i>e.value</i> to determine the userinput.","         * @method getNumber","         * @param {String} title showed in the header of the Panel.","         * @param {String} message showed inside the Panel.","         * @param {Integer} [defaultvalue] showed inside the form-input.","         * @param {Integer} [minvalue] used for validation.","         * @param {Integer} [maxvalue] used for validation.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.","         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.","         * @return {Integer} passed by the eventTarget in the callback<br>","         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>","         * Look for <i>e.value</i> to determine the userinput.","        */","        getNumber: function(title, message, defaultvalue, minvalue, maxvalue, callback, context, args, customButtons, customIconclass) {","            var instance = this,","                bodyMessage,","                withMinValue = Lang.isNumber(minvalue),","                withMaxValue = Lang.isNumber(maxvalue),","                inputElement,","                validationMessage = '',","                eventArguments = {};","            if (withMinValue && withMaxValue) {","                validationMessage = 'Input must be between '+minvalue+' and '+maxvalue;","            }","            else {","                if (withMinValue) {","                    validationMessage = 'Input must not be below '+minvalue;","                }","                if (withMaxValue) {","                    validationMessage = 'Input must not be above '+maxvalue;","                }","            }","            instance.inputElement = new Y.ITSAFORMELEMENT({","                name: 'value',","                type: 'input',","                value: defaultvalue ? defaultvalue.toString() : '',","                label: message,","                keyValidation: function(e) {","                    var keycode = e.keyCode,","                        node = e.target,","                        reactivation = true,","                        cursor = node.get('selectionStart'),","                        cursorEnd = node.get('selectionEnd'),","                        previousStringValue = node.get('value'),","                        safeNumericalKeyCodeToString = String.fromCharCode(((keycode>=96) && (keycode<=105)) ? keycode - 48 : keycode),","                        nextValue,","                        minValue = e.minValue,","                        maxValue = e.maxValue,","                        digits = [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],","                        valid = [8,9,13,27,37,38,39,40,46,48,49,50,51,52,53,54,55,56,57,173,189,45,96,97,98,99,100,101,102,103,104,105,109],","                        // 173,189,45 all can be minus-token","                        minustoken = [173,189,45,109];","                    if (Y.Array.indexOf(valid, keycode) === -1) {","                        e.halt(true);","                        return false;","                    }","                    if (((e.shiftKey) && (keycode!==9) && (keycode!==37) && (keycode!==38) && (keycode!==39) && (keycode!==40)) || (e.ctrlKey) || (e.altKey) || (e.metaKey)) {","                        e.halt(true);","                        return false;","                    }","                    // no digit of zero at the beginning when minimum>0","                    if (Lang.isNumber(minValue) && (minValue>0) && (cursor===0) && ((keycode===48) || (keycode===96))) {","                        e.halt(true);","                        return false;","                    }","                    // no digit of zero at second position when first position=0","                    if ((cursor===1) && ((keycode===48) || (keycode===96)) && ((previousStringValue==='0') || (previousStringValue==='-'))) {","                        e.halt(true);","                        return false;","                    }","                    // no minus at the beginning when minimum>=0","                    if (Lang.isNumber(minValue) && (minValue>=0) && (cursor===0) && (Y.Array.indexOf(minustoken, keycode) !== -1)) {","                        e.halt(true);","                        return false;","                    }","                    // no minus when not at the beginning","                    if ((cursor>0) && (Y.Array.indexOf(minustoken, keycode) !== -1)) {","                        e.halt(true);","                        return false;","                    }","                    // not valid when number will become lower than minimum, only check if field is modified","                    if ((Lang.isNumber(minValue) || Lang.isNumber(maxValue)) && ((Y.Array.indexOf(digits, keycode) !== -1) || (keycode===8) || (keycode===46))) {","                        // transform e.keyCode to a keyCode that can be translated to chareacter --> numerical keyboard will be transformed to normal keyboard","                        if (keycode===8) {","                            nextValue = parseInt(previousStringValue.substring(0, (cursor===cursorEnd) ? cursor-1 : cursor) + previousStringValue.substring(cursorEnd), 10);","                        }","                        else if (keycode===46) {","                            nextValue = parseInt(previousStringValue.substring(0, cursor) + previousStringValue.substring((cursor===cursorEnd) ? cursorEnd+1 : cursorEnd), 10);","                        }","                        else {","                            nextValue = parseInt(previousStringValue.substring(0, cursor) + safeNumericalKeyCodeToString + previousStringValue.substring(cursorEnd), 10);","                        }","                        if (!Lang.isNumber(nextValue)) {","                            if (e.showValidation) {e.showValidation();}","                            if (e.deactivatePanel) {e.deactivatePanel();}","                            reactivation = false;","                        }","                        else if (Lang.isNumber(minValue) && (nextValue<minValue)) {","                            if (e.showValidation) {e.showValidation();}","                            if (e.deactivatePanel) {e.deactivatePanel();}","                            reactivation = false;","                        }","                        else if (Lang.isNumber(maxValue) && (nextValue>maxValue)) {","                            if (e.showValidation) {e.showValidation();}","                            if (e.deactivatePanel) {e.deactivatePanel();}","                            reactivation = false;","                        }","                    }","                    // correct possible 0x by removing leading 0","                    // because for some reason, this also is called when got blurred: do only check if number is digit","                    if ((cursor===1) && (previousStringValue==='0') && (Y.Array.indexOf(digits, keycode) !== -1)) {","                        node.set('value', '');","                    }","                    // only reactivate when the key is not a key that leaves the element","                    if ((keycode!==9) && (keycode!==13)) {","                        if (reactivation && e.hideValidation) {e.hideValidation();}","                        if (reactivation && e.activatePanel) {e.activatePanel();}","                    }","                    return true;","                },","                autoCorrection: function(e) {","                    var formelement = this,","                        minvalue = e && e.minValue,","                        maxvalue = e && e.maxValue,","                        previousValue = formelement.get('elementNode').get('value'),","                        value = ((previousValue==='') || (previousValue==='-')) ? 0 : previousValue,","                        newValue = parseInt(value, 10);","                    formelement.set('value', newValue.toString());","                    if ((Lang.isNumber(minvalue) && (newValue<minvalue)) || (Lang.isNumber(maxvalue) && (newValue>maxvalue))) {","                        if (newValue<minvalue) {","                        }","                        if (newValue>maxvalue) {","                        }","                        if (e.showValidation) {e.showValidation();}","                        if (e.activatePanel) {e.activatePanel();}","                        return false;","                    }","                    return true;","                },","                validationMessage: validationMessage,","                classNameValue: 'yui3-itsadialogbox-numberinput itsa-formelement-lastelement',","                initialFocus: true,","                selectOnFocus: true","            });","            if (Lang.isNumber(minvalue)) {eventArguments.minValue = minvalue;}","            if (Lang.isNumber(maxvalue)) {eventArguments.maxValue = maxvalue;}","            if (validationMessage) {","                eventArguments.showValidation = Y.bind(instance.inputElement.showValidation, instance.inputElement);","                eventArguments.hideValidation = Y.bind(instance.inputElement.hideValidation, instance.inputElement);","            }","            if (eventArguments.minValue || eventArguments.maxValue) {","                eventArguments.activatePanel = Y.bind(instance.activatePanel, instance);","                eventArguments.deactivatePanel = Y.bind(instance.deactivatePanel, instance);","            }","            instance.showPanel(3, title, instance.inputElement.render(), callback, context, args, customButtons, customIconclass, eventArguments);","        },","","        /**","         * Shows an ErrorMessage (Panel)","         * @method showErrorMessage","         * @param {String} [title] showed in the header of the Panel.","         * @param {String} errormessage showed inside the Panel.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","        */","        showErrorMessage: function(title, errormessage, callback, context, args) {","            this.showPanel(4, title, errormessage, callback, context, args);","        },","","        /**","         * Shows a Message (Panel)","         * @method showMessage","         * @param {String} [title] showed in the header of the Panel.","         * @param {String} errormessage showed inside the Panel.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.","         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.","        */","        showMessage: function(title, message, callback, context, args, customButtons, customIconclass) {","            this.showPanel(5, title, message, callback, context, args, customButtons, customIconclass);","        },","","        /**","         * Shows an Warning (Panel)","         * @method showWarning","         * @param {String} [title] showed in the header of the Panel.","         * @param {String} warning showed inside the Panel.","         * @param {Function} [callback] callbackfunction to be excecuted.","         * @param {Object} [context] (this) in the callback.","         * @param {String | Array} [args] Arguments for the callback.","        */","        showWarning: function(title, warning, callback, context, args) {","            this.showPanel(6, title, warning, callback, context, args);","        },","","        //==============================================================================","","        /**","         * Hides the panel and executes the callback. <br>","         * Will not execute if the targetbutton has been disabled through validation.","         * @method _actionHide","         * @param {eventTarget} e","         * @private","        */","        _actionHide: function(e){","            var instance = this,","                bd = instance.get('contentBox').one('.yui3-widget-bd'),","                ev = instance._serializeForm(bd),","                button = e.target;","            e.preventDefault();","            if (!button.hasClass('yui3-button-disabled')) {","                ev.buttonName = e.target.getData('name');","                instance.hide();       ","                if (Y.Lang.isFunction(instance._activePanelOption.callback)) {","                    Y.rbind(instance._activePanelOption.callback, instance._activePanelOption.context, ev, instance._activePanelOption.args)();","                }","            } ","        },","","        /**","         * Just executes the callback while the Panel stays on the screen. Used when you just want to read form-information for example.<br>","         * Will not execute if the targetbutton has been disabled through validation.","         * @method _actionStayAlive","         * @param {eventTarget} e","         * @private","        */","        _actionStayAlive: function(e){","            var instance = this,","                bd = instance.get('contentBox').one('.yui3-widget-bd'),","                ev = instance._serializeForm(bd),","                button = e.target;","            e.preventDefault();","            if (!button.hasClass('yui3-button-disabled')) {","                ev.buttonName = e.target.getData('name');","                if (Y.Lang.isFunction(instance._activePanelOption.callback)) {","                    Y.rbind(instance._activePanelOption.callback, instance._activePanelOption.context, ev, instance._activePanelOption.args)();","                }","            } ","        },","","        /**","         * Resets any form-elements inside the panel.<br>","         * Does not execute the callback.","         * --- This function does not work yet ---","         * @method _actionStayAlive","         * @param {eventTarget} e","         * @private","        */","        _actionReset: function(e){","            var instance = this,","                bd = instance.get('contentBox').one('.yui3-widget-bd'),","                ev = instance._serializeForm(bd);","            e.preventDefault();","            ev.buttonName = e.target.getData('name');","        },","","        /**","         * Clears all form-elements inside the panel.<br>","         * Does not execute the callback.","         * --- This function does not work yet ---","         * @method _actionStayAlive","         * @param {eventTarget} e","         * @private","        */","        _actionClear: function(e){","            var instance = this,","                bd = instance.get('contentBox').one('.yui3-widget-bd'),","                ev = instance._serializeForm(bd);","            e.preventDefault();","            ev.buttonName = e.target.getData('name');","        },","","        /**","         * overrules Y.panel.focus, by focussing on the panel furst, and then using the focusmanager to focus on the right element.","         * @method focus","        */","        focus: function(){","            var instance = this,","                contentBox = instance.get('contentBox'),","                focusManager = contentBox.focusManager;","            instance.constructor.superclass.focus.apply(instance, arguments);","            if (focusManager) {","                focusManager.focus();","            }","        },","","        /**","         * Define all eventhandlers","         * @method bindUI","        */","        bindUI: function() {","            var instance = this,","                contentBox = instance.get('contentBox'),","                focusManager = contentBox.focusManager;","            instance._panelListener = contentBox.on(","                'keydown', ","                function (e) {","                    if (e.keyCode === 9) { // tab","                        e.preventDefault();","                        this.shiftFocus(e.shiftKey);","                    }","                },","                instance","            );","            instance._buttonsListener = instance.after(","                'buttonsChange',","                instance._setValidationButtons,","                instance","            );","            instance._descendantListener = contentBox.focusManager.on(","                'activeDescendantChange',","                function (e, contentBox) {","                    var instance = this,","                        previousDescendant = e.prevVal,","                        nextDescendant = e.newVal,","                        defaultButton,","                        isButton,","                        allDescendants = contentBox.focusManager.get('descendants'),","                        sameDescendant;","                    instance._descendantChange++;","                    if (Lang.isNumber(previousDescendant) && (previousDescendant>=0)) {previousDescendant = allDescendants.item(e.prevVal);}","                    if (Lang.isNumber(nextDescendant)) {nextDescendant = allDescendants.item(e.newVal);}","                    sameDescendant = nextDescendant.compareTo(previousDescendant);","                    defaultButton = contentBox.one('.yui3-button-primary');","                    isButton = (nextDescendant.get('tagName')==='BUTTON');","                    if (defaultButton) {","                        defaultButton.toggleClass('nofocus', ((nextDescendant!==defaultButton) && isButton));","                    }","                    // to make a pressed button highlighted, we must add a seperate class","                    allDescendants.removeClass('mousepressfocus');","                    if (isButton) {","                        nextDescendant.addClass('mousepressfocus');","                    }","                    // now: by first time showing the Panel, the focusManager activeDescendent will be called three times, before steady state in case of an element that gets focused.","                    // To make the content be selected again (if requested) look at the value of instance._descendant","                    if ((!sameDescendant || (instance._descendantChange<4)) && nextDescendant.hasClass('itsa-formelement-selectall')) {","                        nextDescendant.select();","                    }","                    if (!sameDescendant) {","                        instance._validate(isButton, nextDescendant);","                    }","                },","                instance,","                contentBox","            );","            // because the header might not exists yet (at rendering it doesn't), we have to delegate next events instead of binding it to the headernode","            instance._headerMousedownListener = contentBox.delegate(","                'mousedown',","                function(e) {e.target.addClass('cursormove');},","                '.yui3-widget-hd'","            );","            instance._headerMouseupListener = contentBox.delegate(","                'mouseup',","                function(e) {e.target.removeClass('cursormove');},","                '.yui3-widget-hd'","            );","            // same for input elements","            instance._inputListener = contentBox.delegate(","                'keydown',","                instance._checkInput,","                'input',","                instance","            );","            // now, listen for checkboxes: the loose focus when they get clicked.","            instance._checkBoxListener = contentBox.delegate(","                'change',","                instance._shiftFocusFromCheckbox,","                function(){","                    var node =this;","                    return ((node.get('tagName')==='INPUT') && (node.get('type')==='checkbox'));","                },","                instance","            );","            // reset the focus when clicked on an area inside contentBox that is not an element","            contentBox.on(","                'click',","                function() {","                    // this = focusManeger","                    this.focus(this.get('activeDescendant'));","                },","                focusManager","            );","        },","","        /**","         * Hides the panel and executes the callback. <br>","         * Will not execute if the targetbutton has been disabled through validation.","         * @method shiftFocus","         * @param {Boolean} [backward] direction to shift","         * @param {eventTarget} [referenceNode] startnode, when not supplied, the node that currently has focused will be used.","        */","        shiftFocus: function(backward, referenceNode) {","            var instance = this,","                focusManager = instance.get('contentBox').focusManager,","                focusManagerNodes = focusManager.get('descendants'),","                activeDescendant = referenceNode ? focusManagerNodes.indexOf(referenceNode) : focusManager.get('activeDescendant'),","                numberDescendants = focusManagerNodes.size();","                if (referenceNode || focusManager.get('focused')) {","                    if (Lang.isBoolean(backward) && backward) {","                        activeDescendant--;","                        focusManager.focus((activeDescendant<0) ? numberDescendants-1 : activeDescendant);","                    } ","                    else {","                        activeDescendant++;","                        focusManager.focus((activeDescendant>=numberDescendants) ? 0 : activeDescendant);","                    }","                }","                else {","                    focusManager.focus(instance._getFirstFocusNode());","                }","        },","","        /**","         * Makes the focus set on next element when a checkbox is clicked.<br>","         * @method _shiftFocusFromCheckbox","         * @param {eventTarget} e","         * @private","        */","        _shiftFocusFromCheckbox: function(e) {","            var instance = this,","                checkboxNode = e.target;","            if (checkboxNode.hasClass('itsa-formelement-lastelement')) {","                instance.get('contentBox').focusManager.focus(instance._getDefaultButtonNode());","            }","            else {","                instance.shiftFocus(false, checkboxNode);","            }","        },","","        /**","         * Internal function that is called by 'keydown'-event when using input-elements.<br>","         * If the element has keyvalidation, then its keyvalidation-function is called, which could prevent the keyinput.<br>","         * If Enter is pressed, the focus is set on the next element <b>or</b> if it's the last element the ACTION_HIDE is called<br>","         * If the element has autocorrection, autocorrect-function is called.<br>","         * If this returns false, then all buttons with button.validation=true get disabled and  ACTION_HIDE is prevented, if returns true, all these buttons get enabled.","         * @method _checkInput","         * @param {eventTarget} e","         * @private","        */","        _checkInput: function(e) {","            var instance = this,","                node = e.target,","                autoCorrection,","                autoCorrectResult,","                eventArgs = instance._activePanelOption.eventArgs;","            if (node.hasClass('itsa-formelement-keyvalidation') && instance.inputElement) {","                Y.mix(e, eventArgs);","                if (!instance.inputElement.get('keyValidation')(e)) {","                    return;","                }","            }","            if (e.keyCode===13) {","                e.preventDefault();","                if (node.hasClass('itsa-formelement-lastelement')) {","                    autoCorrection = instance.inputElement && instance.inputElement.get('autoCorrection');","                    autoCorrectResult = true;","                    if (autoCorrection) {","                        autoCorrectResult = Y.bind(autoCorrection, instance.inputElement, eventArgs)();","                        if (!autoCorrectResult) {","                            eventArgs.showValidation();","                            instance.deactivatePanel();","                            instance.get('contentBox').focusManager.focus(instance._getFirstFocusNode());","                        }","                    }","                    if (autoCorrectResult) {","                        // because the callback should think the activebutton was clicked, we add the right name-data to this Node","                        node.setData('name', instance._getDefaultButtonNode().getData('name'));","                        instance._actionHide(e);","                    }","                    else {","                        node.select();","                    }","                }","                else {","                    instance.shiftFocus();","                }","            }","        },","","        /**","         * Internal function that is called when an descendant changes. To validate inputelements (if present)<br>","         * If the element has autocorrection, autocorrect-function is called.<br>If this returns false, then all buttons with button.validation=true get disabled, if returns true, all these buttons get enabled.","         * @method _validate","         * @private","        */","        _validate: function(isButton, node) {","            var instance = this,","                eventArgs = instance._activePanelOption.eventArgs,","                buttonValidation = isButton && node.hasClass('itsadialogbox-button-validated'),","                autoCorrection = instance.inputElement && instance.inputElement.get('autoCorrection'),","                autoCorrectResult = true;","            if (autoCorrection && buttonValidation) {","                autoCorrectResult = Y.bind(autoCorrection, instance.inputElement, eventArgs)();","                if (!autoCorrectResult) {","                    if (eventArgs && eventArgs.showValidation) {","                        eventArgs.showValidation();","                    }","                    instance.deactivatePanel();","                }","            }","            if (autoCorrectResult) {","                if (eventArgs && eventArgs.hideValidation) {","                    eventArgs.hideValidation();","                }","                instance.activatePanel();","            }","        },","","        /**","         * Enables the Panel in such a way that Buttons with validation are functional","         * @method activatePanel","        */","        activatePanel: function() {","            this._validationButtons.toggleClass('yui3-button-disabled', false);","        },","","        /**","         * Deactivates the Panel in such a way that it only responses to Buttons with no validation","         * @method deactivatePanel","        */","        deactivatePanel: function() {","            this._validationButtons.toggleClass('yui3-button-disabled', true);","        },","","        /**","         * Cleans up bindings","         * @method destructor","         * @protected","        */","        destructor: function() {","            var instance = this;","            if (instance.keyDownHandle) {instance.keyDownHandle.detach();}","            if (instance._panelListener) {instance._panelListener.detach();} ","            if (instance._descendantListener) {instance._descendantListener.detach();}","            if (instance._headerMousedownListener) {instance._headerMousedownListener.detach();}","            if (instance._headerMouseupListener) {instance._headerMouseupListener.detach();}","            if (instance._inputListener) {instance._inputListener.detach();}","            if (instance._checkBoxListener) {instance._checkBoxListener.detach();}","            if (instance._buttonsListener) {instance._buttonsListener.detach();}","        },","","        //==============================================================================","","        /**","         * Internal method that looks for all buttons with button.validation=true and markes them with a validated-class<br>","         * Will be executed when the buttons are changed.","         * @method _setValidationButtons","         * @param {eventTarget} e","         * @private","        */","        _setValidationButtons : function(e) {","            var instance = this,","                buttonsObject = instance._activePanelOption.buttons,","                contentBox = instance.get('contentBox');","            contentBox.all('.itsadialogbox-button-validated').removeClass('itsadialogbox-button-validated');","            if (buttonsObject) {","                if (buttonsObject.header) {","                    Y.Array.each(","                        buttonsObject.header,","                        instance._markButtonValidated,","                        instance","                    );","                }","                if (buttonsObject.body) {","                    Y.Array.each(","                        buttonsObject.body,","                        instance._markButtonValidated,","                        instance","                    );","                }","                if (buttonsObject.footer) {","                    Y.Array.each(","                        buttonsObject.footer,","                        instance._markButtonValidated,","                        instance","                    );","                }","            }","            instance._validationButtons = contentBox.all('.itsadialogbox-button-validated');","        },","","        /**","         * Internal method that markes a button with a validated-class if it has button.validation=true<br>","         * @method _markButtonValidated","         * @param {Object} buttonObject ","         * @param {Int} index","         * @param {Array} array ","         * @private","        */","        _markButtonValidated : function(buttonObject, index, array) {","            var instance = this,","                name = buttonObject.name,","                validation,","                buttonNode;","            buttonNode = instance.getButton(name);","            if (buttonNode) {","                validation = buttonObject.validation;","                if (Lang.isBoolean(validation) && validation) {","                    buttonNode.addClass('itsadialogbox-button-validated');","                }","            }","        },","","        /**","         * Definition of the predefined Panels (like showMessage() etc.)","         * @method _initiatePanels","         * @private","        */","        _initiatePanels : function() {","            var instance = this;","            // creating getRetryConfirmation","            instance.definePanel({","                iconClass: instance.ICON_WARN,","                buttons: {","                    footer: [","                        {name:'abort', label:'Abort', action:instance.ACTION_HIDE},","                        {name:'ignore', label:'Ignore', action:instance.ACTION_HIDE},","                        {name:'retry', label:'Retry', action:instance.ACTION_HIDE, isDefault: true}    ","                    ]","                }    ","            });","            // creating getConfirmation","            instance.definePanel({","                iconClass: instance.ICON_INFO,","                buttons: {","                    footer: [","                        {name:'no', label:'No', action:instance.ACTION_HIDE},","                        {name:'yes', label:'Yes', action:instance.ACTION_HIDE, isDefault: true}    ","                    ]","                }    ","            });","            // creating getInput","            instance.definePanel({","                iconClass: instance.ICON_QUESTION,","                form: [","                    {name:'count', label:'{message}', value:'{count}'}","                ],","                buttons: {","                    footer: [","                        {name:'cancel', label:'Cancel', action:instance.ACTION_HIDE},","                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, validation: true, isDefault: true}    ","                    ]","                }    ","            });","            // creating getNumber","            instance.definePanel({","                iconClass: instance.ICON_QUESTION,","                form: [","                    {name:'count', label:'{message}', value:'{count}'}","                ],","                buttons: {","                    footer: [","                        {name:'cancel', label:'Cancel', action:instance.ACTION_HIDE},","                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, validation: true, isDefault: true}    ","                    ]","                }    ","            });","            // creating showErrorMessage","            instance.definePanel({","                iconClass: instance.ICON_ERROR,","                buttons: {","                    footer: [","                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}    ","                    ]","                }    ","            });","            // creating showMessage","            instance.definePanel({","                buttons: {","                    footer: [","                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}    ","                    ]","                }    ","            });","            // creating showWarning","            instance.definePanel({","                iconClass: instance.ICON_WARN,","                buttons: {","                    footer: [","                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}    ","                    ]","                }    ","            });","        },","","        /**","         * Definition of the predefined Panels (like showMessage() etc.)","         * this can be a form-element. But if no form-element has focus defined, the first form-element should get focus.","         * If no form element is present, then the defaultbutton should get focus","         * @method _getFirstFocusNode","         * @private","         * return {Y.Node} the Node that should get focus when panel is showed.","        */","        _getFirstFocusNode: function() {","            var instance = this,","                contentBox = instance.get('contentBox'),","                focusnode;","            focusnode = contentBox.one('.itsa-formelement-firstfocus') || contentBox.one('.itsa-firstformelement') || instance._getDefaultButtonNode();","            return focusnode;","        },","","        /**","         * Returns the default button: the buttonNode that has the primary focus.<br>","         * This should be set during definition of PanelOptions.","         * @method _getDefaultButtonNode","         * @private","         * return {Y.Node} buttonNode","        */","        _getDefaultButtonNode: function() {","            var node = this.get('contentBox').one('.yui3-button-primary');","            return node;","        },","","        /**","         * Returns all form-elements in panel","         * @method _serializeForm","         * @private","         * return {Object} Contains all form-elements with name/value pair","        */","        _serializeForm: function(masterNode) {","            // At this moment only text-inputs are allowed.","            // at later stage, handle this by Y.ITSAFORM with a true serialize function","            var instance = this,","                formelements = masterNode.all('.itsa-formelement'),","                value,","                intValue,","                serialdata = {};","            formelements.each(","                function(formelementNode, index, nodeList) {","                    value = formelementNode.get('value');","                    intValue = parseInt(value, 10);","                    // now check with DOUBLE == (not threedouble) to see if value == intValue --> in that case we have an integer","                    serialdata[formelementNode.get('name')] = (value==intValue) ? intValue : value;","                }","            );","            return serialdata;","        }","","    }, {","        ATTRS : {","        }","    }",");","","//=================================================================================","","if (!Y.Global.ItsaDialog) {","    Y.Global.ItsaDialog = new Y.ITSADIALOGBOX({","        visible: false,","        centered: true,","        render : true,","        zIndex : 21000,","        modal  : true,","        bodyContent : '',","        focusOn: [","            {eventName: 'clickoutside'}","        ]","    });","    Y.Global.ItsaDialog.plug(Y.Plugin.Drag);","    Y.Global.ItsaDialog.dd.addHandle('.yui3-widget-hd');","}","","//=================================================================================","","// Y.ITSAFORMELEMENT should get an own module. For the short time being, we will keep it inside itsa-dialog","","/**"," * The Itsa Dialogbox module."," *"," * @module itsa-dialogbox"," */","","/**"," * Dialogbox with sugar messages"," * "," *"," * @class ITSAFormelement"," * @extends Panel"," * @constructor"," *"," * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>"," * YUI BSD License - http://developer.yahoo.com/yui/license.html"," *","*/","","var ITSAFORM_TABLETEMPLATE = '<td class=\"itsaform-tablelabel{classnamelabel}\"{marginstyle}>{label}</td>'","                            +'<td class=\"itsaform-tableelement\">{element}<div class=\"itsa-formelement-validationmessage itsa-formelement-hidden\">{validationMessage}</div></td>',","    ITSAFORM_INLINETEMPLATE = '<span class=\"itsaform-spanlabel{classnamelabel}\"{marginstyle}>{label}</span>'","                            +'{element}<div class=\"itsa-formelement-validationmessage itsa-formelement-hidden\">{validationMessage}</div>';","","Y.ITSAFORMELEMENT = Y.Base.create('itsaformelement', Y.Base, [], {","","        id: null,","","        /**","         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready","         *","         * @method initializer","         * @protected","        */","        initializer : function() {","            this.id = Y.guid();","        },","","        /**","         * Renderes a String that contains the completeFormElement definition.<br>","         * To be used in an external Form","         * @method render","         * @param {boolean} tableform If the renderedstring should be in tableform: encapsuled by td-elements (without tr)","         * @return {String} rendered String","        */","        render : function(tableform) {","            var instance = this,","                marginTop = instance.get('marginTop'),","                marginStyle = marginTop ? ' style=\"margin-top:' + marginTop + 'px\"' : '',","                type = instance.get('type'),","                classNameLabel = instance.get('classNameLabel'),","                classNameValue = instance.get('classNameValue'),","                initialFocus = instance.get('initialFocus'),","                selectOnFocus = instance.get('selectOnFocus'),","                keyValidation = instance.get('keyValidation'),","                validation = instance.get('validation'),","                autoCorrection = instance.get('autoCorrection'),","                initialFocusClass = initialFocus ? ' itsa-formelement-firstfocus' : '',","                selectOnFocusClass = selectOnFocus ? ' itsa-formelement-selectall' : '',","                keyValidationClass = keyValidation ? ' itsa-formelement-keyvalidation' : '',","                validationClass = validation ? ' itsa-formelement-validation' : '',","                autoCorrectionClass = autoCorrection ? ' itsa-formelement-autocorrect' : '',","                elementClass = ' class=\"itsa-formelement ' + classNameValue + initialFocusClass + selectOnFocusClass + keyValidationClass + validationClass + autoCorrectionClass+'\"',","                element = '';","            if (type==='input') {element = '<input id=\"' + instance.id + '\" type=\"text\" name=\"' + instance.get('name') + '\" value=\"' + instance.get('value') + '\"' + elementClass + marginStyle + ' />';}","            return  Lang.sub(","                        tableform ? ITSAFORM_TABLETEMPLATE : ITSAFORM_INLINETEMPLATE,","                        {","                            marginstyle: marginStyle,","                            label: instance.get('label'),","                            element: element,","                            classnamelabel: classNameLabel,","                            validationMessage: instance.get('validationMessage'),","                            classnamevalue: classNameValue","                        }","                    );","        },","","        /**","         * Shows the validationmessage","         * @method showValidation","        */","        showValidation : function() {","            var element = this.get('elementNode');","            if (element) {","                element.get('parentNode').one('.itsa-formelement-validationmessage').toggleClass('itsa-formelement-hidden', false);","            }","        },","","        /**","         * Hides the validationmessage","         * @method hideValidation","        */","        hideValidation : function() {","            var element = this.get('elementNode');","            if (element) {","                element.get('parentNode').one('.itsa-formelement-validationmessage').toggleClass('itsa-formelement-hidden', true);","            }","        },","","        /**","         * Cleans up bindings","         * @method destructor","         * @protected","        */","        destructor : function() {","            var instance = this;","            if (instance.blurevent) {instance.blurevent.detach();}","            if (instance.keyevent) {instance.keyevent.detach();}","        }","","    }, {","        ATTRS : {","            /**","             * @description The value of the element","             * @attribute [value]","             * @type String | Boolean | Array(String)","            */","            name : {","                value: 'undefined-name',","                setter: function(val) {","                    var node = this.get('elementNode');","                    if (node) {","                        node.set('name', val);","                    }","                    return val;","                },","                validator: function(val) {","                    return (Lang.isString(val));","                }","            },","            /**","             * @description Must have one of the following values:","             * <ul><li>input</li><li>password</li><li>textarea</li><li>checkbox</li><li>radiogroup</li><li>selectbox</li><li>hidden</li></ul>","             * @attribute typr","             * @type String","            */","            type : {","                value: '',","                setter: function(val) {","                    if (Lang.isString(val)) {val=val.toLowerCase();}","                    return val;","                },","                validator: function(val) {","                    return (Lang.isString(val) && ","                            ((val==='input') || ","                             (val==='password') || ","                             (val==='textarea') || ","                             (val==='checkbox') || ","                             (val==='radiogroup') || ","                             (val==='selectbox') || ","                             (val==='button') || ","                             (val==='hidden')","                            )","                    );","                }","            },","            /**","             * @description The value of the element","             * @attribute [value]","             * @type String | Boolean | Array(String)","            */","            value : {","                value: null,","                setter: function(val) {","                    var node = this.get('elementNode');","                    if (node) {","                        node.set('value', val);","                    }","                    return val;","                }","            },","            /**","             * @description The label that wis present before the element","             * @attribute [label]","             * @type String","            */","            label : {","                value: '',","                validator: function(val) {","                    return (Lang.isString(val));","                }","            },","            /**","             * @description Validation during every keypress. The function that is passed will receive the keyevent, that can thus be prevented.<br>","             * Only has effect if the masterform knows how to use it through delegation: therefore it adds the className 'itsa-formelement-keyvalidation'.","             * The function MUST return true or false.","             * @attribute [keyValidation]","             * @type Function","            */","            keyValidation : {","                value: null,","                validator: function(val) {","                    return (Lang.isFunction(val));","                }","            },","            /**","             * @description Validation after changing the value (onblur). The function should return true or false. In case of false, the validationerror is thrown.<br>","             * Only has effect if the masterform knows how to use it through delegation: therefore it adds the className 'itsa-formelement-validation'.","             * The function MUST return true or false.","             * Either use validation, or autocorrection.","             * @attribute [validation]","             * @type Function","             * @return Boolean","            */","            validation : {","                value: null,","                validator: function(val) {","                    return (Lang.isFunction(val));","                }","            },","            /**","             * @description The message that will be returned on a validationerror, this will be set within e.message.","             * @attribute [validationMessage]","             * @type String","            */","            validationMessage : {","                value: '',","                validator: function(val) {","                    return (Lang.isString(val));","                }","            },","            /**","             * @description If set, value will be replaces by the returnvalue of this function. <br>","             * Only has effect if the masterform knows how to use it through delegation: therefore it adds the className 'itsa-formelement-autocorrect'.","             * The function MUST return true or false: defining whether the input is accepted.","             * Either use validation, or autocorrection.","             * @attribute [autocorrection]","             * @type Function","             * @return Boolean","            */","            autoCorrection : {","                value: null,","                validator: function(val) {","                    return (Lang.isFunction(val));","                }","            },","            /**","             * @description Additional className that is passed on the label, during rendering.<br>","             * Only applies to rendering in tableform render(true).","             * @attribute [classNameLabel]","             * @type String","            */","            classNameLabel : {","                value: '',","                validator: function(val) {","                    return (Lang.isString(val));","                }","            },","            /**","             * @description Additional className that is passed on the value, during rendering.<br>","             * Only applies to rendering in tableform render(true).","             * @attribute [classNameValue]","             * @type String","            */","            classNameValue : {","                value: '',","                validator: function(val) {","                    return (Lang.isString(val));","                }","            },","            /**","             * @description Will create extra white whitespace during rendering.<br>","             * Only applies to rendering in tableform render(true).","             * @attribute [marginTop]","             * @type Int","            */","            marginTop : {","                value: 0,","                validator: function(val) {","                    return (Lang.isNumber(val));","                }","            },","            /**","             * @description Determines whether this element should have the initial focus.<br>","             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-firstfocus' is added).","             * @attribute [initialFocus]","             * @type Boolean","            */","            initialFocus : {","                value: false,","                validator: function(val) {","                    return (Lang.isBoolean(val));","                }","            },","            /**","             * @description Determines whether this element should completely be selected when it gets focus.<br>","             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-selectall' is added).","             * @attribute [selectOnFocus]","             * @type Boolean","            */","            selectOnFocus : {","                value: false,","                validator: function(val) {","                    return (Lang.isBoolean(val));","                }","            },","            /**","             * @description DOM-node where the elementNode is bound to.<br>","             * Be carefull: it will only return a Node when you have manually inserted the result of this.render() into the DOM. Otherwise returns null.","             * Readonly","             * @attribute [elementNode]","             * @type Y.Node","             * @readonly","            */","            elementNode : {","                value: null,","                readOnly: true,","                getter: function() {","                    return Y.one('#'+this.id);","                }","            }","        }","    }",");","","","}, 'gallery-2012.11.07-21-32' ,{requires:['base-build', 'panel', 'node-base', 'dd-plugin', 'node-focusmanager', 'event-valuechange'], skinnable:true});"];
_yuitest_coverage["/build/gallery-itsadialogbox/gallery-itsadialogbox.js"].lines = {"1":0,"3":0,"29":0,"34":0,"145":0,"146":0,"151":0,"175":0,"176":0,"177":0,"178":0,"181":0,"200":0,"203":0,"204":0,"205":0,"206":0,"208":0,"209":0,"210":0,"211":0,"212":0,"213":0,"215":0,"216":0,"217":0,"218":0,"219":0,"220":0,"221":0,"223":0,"225":0,"226":0,"227":0,"228":0,"245":0,"259":0,"278":0,"281":0,"290":0,"313":0,"320":0,"321":0,"324":0,"325":0,"327":0,"328":0,"331":0,"337":0,"351":0,"352":0,"353":0,"355":0,"356":0,"357":0,"360":0,"361":0,"362":0,"365":0,"366":0,"367":0,"370":0,"371":0,"372":0,"375":0,"376":0,"377":0,"380":0,"382":0,"383":0,"385":0,"386":0,"389":0,"391":0,"392":0,"393":0,"394":0,"396":0,"397":0,"398":0,"399":0,"401":0,"402":0,"403":0,"404":0,"409":0,"410":0,"413":0,"414":0,"415":0,"417":0,"420":0,"426":0,"427":0,"428":0,"430":0,"432":0,"433":0,"434":0,"436":0,"443":0,"444":0,"445":0,"446":0,"447":0,"449":0,"450":0,"451":0,"453":0,"466":0,"481":0,"494":0,"507":0,"511":0,"512":0,"513":0,"514":0,"515":0,"516":0,"529":0,"533":0,"534":0,"535":0,"536":0,"537":0,"551":0,"554":0,"555":0,"567":0,"570":0,"571":0,"579":0,"582":0,"583":0,"584":0,"593":0,"596":0,"599":0,"600":0,"601":0,"606":0,"611":0,"614":0,"621":0,"622":0,"623":0,"624":0,"625":0,"626":0,"627":0,"628":0,"631":0,"632":0,"633":0,"637":0,"638":0,"640":0,"641":0,"648":0,"650":0,"653":0,"655":0,"659":0,"666":0,"670":0,"671":0,"676":0,"680":0,"694":0,"699":0,"700":0,"701":0,"702":0,"705":0,"706":0,"710":0,"721":0,"723":0,"724":0,"727":0,"742":0,"747":0,"748":0,"749":0,"750":0,"753":0,"754":0,"755":0,"756":0,"757":0,"758":0,"759":0,"760":0,"761":0,"762":0,"763":0,"766":0,"768":0,"769":0,"772":0,"776":0,"788":0,"793":0,"794":0,"795":0,"796":0,"797":0,"799":0,"802":0,"803":0,"804":0,"806":0,"815":0,"823":0,"832":0,"833":0,"834":0,"835":0,"836":0,"837":0,"838":0,"839":0,"840":0,"853":0,"856":0,"857":0,"858":0,"859":0,"865":0,"866":0,"872":0,"873":0,"880":0,"892":0,"896":0,"897":0,"898":0,"899":0,"900":0,"911":0,"913":0,"924":0,"934":0,"947":0,"960":0,"969":0,"977":0,"996":0,"999":0,"1000":0,"1011":0,"1012":0,"1024":0,"1029":0,"1031":0,"1032":0,"1034":0,"1037":0,"1048":0,"1049":0,"1060":0,"1061":0,"1087":0,"1092":0,"1103":0,"1114":0,"1132":0,"1133":0,"1151":0,"1152":0,"1153":0,"1162":0,"1163":0,"1164":0,"1174":0,"1175":0,"1176":0,"1189":0,"1190":0,"1191":0,"1193":0,"1196":0,"1208":0,"1209":0,"1212":0,"1233":0,"1234":0,"1235":0,"1237":0,"1248":0,"1261":0,"1276":0,"1287":0,"1302":0,"1314":0,"1326":0,"1338":0,"1350":0,"1362":0,"1377":0};
_yuitest_coverage["/build/gallery-itsadialogbox/gallery-itsadialogbox.js"].functions = {"initializer:144":0,"definePanel:174":0,"showPanel:199":0,"getRetryConfirmation:244":0,"getConfirmation:258":0,"getInput:277":0,"keyValidation:336":0,"autoCorrection:419":0,"getNumber:312":0,"showErrorMessage:465":0,"showMessage:480":0,"showWarning:493":0,"_actionHide:506":0,"_actionStayAlive:528":0,"_actionReset:550":0,"_actionClear:566":0,"focus:578":0,"(anonymous 2):598":0,"(anonymous 3):613":0,"(anonymous 4):650":0,"(anonymous 5):655":0,"(anonymous 6):669":0,"(anonymous 7):678":0,"bindUI:592":0,"shiftFocus:693":0,"_shiftFocusFromCheckbox:720":0,"_checkInput:741":0,"_validate:787":0,"activatePanel:814":0,"deactivatePanel:822":0,"destructor:831":0,"_setValidationButtons:852":0,"_markButtonValidated:891":0,"_initiatePanels:910":0,"_getFirstFocusNode:995":0,"_getDefaultButtonNode:1010":0,"(anonymous 8):1030":0,"_serializeForm:1021":0,"initializer:1102":0,"render:1113":0,"showValidation:1150":0,"hideValidation:1161":0,"destructor:1173":0,"setter:1188":0,"validator:1195":0,"setter:1207":0,"validator:1211":0,"setter:1232":0,"validator:1247":0,"validator:1260":0,"validator:1275":0,"validator:1286":0,"validator:1301":0,"validator:1313":0,"validator:1325":0,"validator:1337":0,"validator:1349":0,"validator:1361":0,"getter:1376":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-itsadialogbox/gallery-itsadialogbox.js"].coveredLines = 300;
_yuitest_coverage["/build/gallery-itsadialogbox/gallery-itsadialogbox.js"].coveredFunctions = 60;
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1);
YUI.add('gallery-itsadialogbox', function(Y) {

_yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 3);
'use strict';

// TO DO:
// wait for show until the widget is rendered
// When form is disabled, the cancelbutton doesn only close when pressed twice

/**
 * The Itsa Dialogbox module.
 *
 * @module itsa-dialogbox
 */

/**
 * Dialogbox with sugar messages
 * 
 *
 * @class ITSADialogbox
 * @extends Panel
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// Local constants
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 29);
var Lang = Y.Lang,
    ITSADIALOG_ICON_TEMPLATE = "<div class='itsadialogbox-icon {iconclass}'></div>",
    ITSADIALOG_BODY_TEMPLATE = "<div{bdclass}>{bdtext}</div>",
    ITSADIALOG_INLINEFORM = "itsa-dialog-inlineform";

_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 34);
Y.ITSADIALOGBOX = Y.Base.create('itsadialogbox', Y.Panel, [], {

        ICON_BUBBLE : 'icon-bubble',
        ICON_INFO : 'icon-info',
        ICON_QUESTION : 'icon-question',
        ICON_WARN : 'icon-warn',
        ICON_ERROR : 'icon-error',
        ICON_SUCCESS : 'icon-success',
        ACTION_HIDE : '_actionHide',
        ACTION_STAYALIVE : '_actionStayAlive',
        ACTION_RESET : '_actionReset',
        ACTION_CLEAR : '_actionClear',
        panelOptions : [], 
        _activePanelOption : null,
        _validationButtons : null,
        _descendantChange : 0,

// -- Public Static Properties -------------------------------------------------

/**
 * Reference to the editor's instance
 * @property ICON_BUBBLE
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_INFO
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_QUESTION
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_WARN
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_ERROR
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_SUCCESS
 * @type String
 */

/**
 * Reference to the hide-function that can be attached to button.action. This function closes the Panel and executes the callback.
 * @property ACTION_HIDE
 * @type String
 */

/**
 * Reference to the stayalive-function that can be attached to button.action. This function just execute the callback, but the Panel stays alive. In need you just want to read the Panel-values.
 * @property ACTION_STAYALIVE
 * @type String
 */

/**
 * Reference to the clear-function that can be attached to button.action. This function will clear any form-elements.
 * @property ACTION_CLEAR
 * @type String
 */

/**
 * Reference to the reset-function that can be attached to button.action. This function will reset any form-elements.
 * @property ACTION_RESET
 * @type String
 */

/**
 * Internal Array that holds all registred paneloptions, created through definePanel()
 * @property panelOptions
 * @type Array
 */

/**
 * Internal reference to the active panelOptions (which is active after showPanel() is called
 * @property _activePanelOption
 * @type Object
 * @private
 */

/**
 * Nodelist that contains all current (from _activePanelOption) buttons that have button.validated set to true.
 * @property _validationButtons
 * @type Y.NodeList
 * @private
 */

/**
 * Internal count that keeps track of how many times a descendentChange has been taken place by the focusManager
 * @property _descendantChange
 * @type Int
 * @private
 */

        /**
         * @method initializer
         * @protected
        */
        initializer : function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "initializer", 144);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 145);
var instance = this;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 146);
instance.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                descendants: 'button, input, textarea',
                circular: true,
                focusClass: 'focus'
            });
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 151);
instance._initiatePanels();
        },

        /**
         * Defines a new Panel and stores it to the panelOptions-Array. Returns an panelId that can be used sot show the Panel later on using showPanel(panelId).<br>
         * PanelOptions is an object that can have the following fields:<br>
           <ul><li>iconClass (String) className for the icon, for example Y.Global.ItsaDialog.ICON\_QUESTION</li>
               <li>form (Array) Array with objects that will be transformed to Y.FORMELEMENT objects (not currently available)</li>
               <li>buttons (Object) Which buttons to use. For example:
               <br>&nbsp;&nbsp;{
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;footer: [
                        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name:'cancel', label:'Cancel', action: Y.Global.ItsaDialog.ACTION\_HIDE},
                        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name:'ok', label:'Ok', action: Y.Global.ItsaDialog.ACTION\_HIDE, validation: true, isDefault: true}    
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;]
               <br>&nbsp;&nbsp;}
               </li>    
            </ul>    
            <br><br>
            You can use 4 actionfunctions to attach at the button: Y.Global.ItsaDialog.ACTION_HIDE, Y.Global.ItsaDialog.ACTION_STAYALIVE, Y.Global.ItsaDialog.ACTION_RESET and Y.Global.ItsaDialog.ACTION_CLEAR
         * @method definePanel
         * @param {Object} panelOptions The config-object.
         * @return {Integer} unique panelId
        */
        definePanel: function(panelOptions) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "definePanel", 174);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 175);
var instance = this;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 176);
if (Lang.isObject(panelOptions)) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 177);
instance.panelOptions.push(panelOptions);
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 178);
return instance.panelOptions.length - 1;
            }
            else {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 181);
return -1;
            }
        },

        /**
         * Shows the panel when you have a panelId. For usage with custom panels. The sugarmethods (showMessage() f.i.) use this method under the hood).
         *
         * @method showPanel
         * @param {Int} panelId Id of the panel that has to be shown. Retreive this value during definePanel()
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} [bodyText] showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want custom buttons that differ from those defined during definePanel.
         * @param {String} [customIconclass] In case you want to use an iconclass that is different from to one defined during definePanel. Example: Y.Global.ItsaDialog.ICON_WARN
         * @param {Object} [eventArgs] do not use, only internal (temporarely)
        */
        showPanel: function(panelId, title, bodyText, callback, context, args, customButtons, customIconclass, eventArgs) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "showPanel", 199);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 200);
var instance = this,
                iconClass,
                contentBox = instance.get('contentBox');
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 203);
if ((panelId>=0) && (panelId<instance.panelOptions.length)) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 204);
instance._activePanelOption = instance.panelOptions[panelId];
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 205);
iconClass = customIconclass || instance._activePanelOption.iconClass;
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 206);
instance.get('boundingBox').toggleClass('withicon', Lang.isString(iconClass));
                // in case no title is given, the third argument will be the callback
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 208);
if (!Lang.isString(bodyText)) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 209);
args = context;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 210);
context = callback;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 211);
callback = bodyText;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 212);
bodyText = title;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 213);
title = '&nbsp;'; // making the header appear
                }
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 215);
instance.set('headerContent', title || '&nbsp;'); // always making the header appear by display &nbsp;
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 216);
instance.set('bodyContent', (iconClass ? Lang.sub(ITSADIALOG_ICON_TEMPLATE, {iconclass: iconClass}) : '') + Lang.sub(ITSADIALOG_BODY_TEMPLATE, {bdclass: (iconClass ? ' class="itsadialogbox-messageindent"' : ''), bdtext: bodyText}));
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 217);
instance.set('buttons', customButtons || instance._activePanelOption.buttons || {});
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 218);
instance._activePanelOption.callback = callback;
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 219);
instance._activePanelOption.context = context;
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 220);
instance._activePanelOption.args = args;
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 221);
instance._activePanelOption.eventArgs = eventArgs;
                // refreshing focusdescendents
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 223);
contentBox.focusManager.refresh();
                // recenter dialogbox in case it has been moved
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 225);
instance.centered();
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 226);
instance.activatePanel();
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 227);
contentBox.focusManager.focus(instance._getFirstFocusNode());
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 228);
instance.show();
            }
        },

        //==============================================================================
      
        /**
         * Shows a Panel with the buttons: <b>Abort Ignore Retry</b><br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.
         * @method getRetryConfirmation
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} question showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
        */
        getRetryConfirmation: function(title, question, callback, context, args) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "getRetryConfirmation", 244);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 245);
this.showPanel(0, title, question, callback, context, args);
        },

        /**
         * Shows a Panel with the buttons: <b>No Yes</b><br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.
         * @method getConfirmation
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} question showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
        */
        getConfirmation: function(title, question, callback, context, args) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "getConfirmation", 258);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 259);
this.showPanel(1, title, question, callback, context, args);
        },

        /**
         * Shows a Panel with an inputfield and the buttons: <b>Cancel Ok</b><br>
         * @method getInput
         * @param {String} title showed in the header of the Panel.
         * @param {String} message showed inside the Panel.
         * @param {String} [defaultmessage] showed inside the form-input.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
         * @return {String} passed by the eventTarget in the callback<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
        */
        getInput: function(title, message, defaultmessage, callback, context, args, customButtons, customIconclass) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "getInput", 277);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 278);
var instance = this,
                bodyMessage,
                inputElement;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 281);
instance.inputElement = new Y.ITSAFORMELEMENT({
                name: 'value',
                type: 'input',
                value: defaultmessage,
                classNameValue: 'yui3-itsadialogbox-stringinput itsa-formelement-lastelement',
                marginTop: 10,
                initialFocus: true,
                selectOnFocus: true
            });
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 290);
instance.showPanel(2, title, message + '<br>' + instance.inputElement.render(), callback, context, args, customButtons, customIconclass);
        },

        /**
         * Shows a Panel with an inputfield and the buttons: <b>Cancel Ok</b>. Only accepts integer-number as return.<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
         * @method getNumber
         * @param {String} title showed in the header of the Panel.
         * @param {String} message showed inside the Panel.
         * @param {Integer} [defaultvalue] showed inside the form-input.
         * @param {Integer} [minvalue] used for validation.
         * @param {Integer} [maxvalue] used for validation.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
         * @return {Integer} passed by the eventTarget in the callback<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
        */
        getNumber: function(title, message, defaultvalue, minvalue, maxvalue, callback, context, args, customButtons, customIconclass) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "getNumber", 312);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 313);
var instance = this,
                bodyMessage,
                withMinValue = Lang.isNumber(minvalue),
                withMaxValue = Lang.isNumber(maxvalue),
                inputElement,
                validationMessage = '',
                eventArguments = {};
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 320);
if (withMinValue && withMaxValue) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 321);
validationMessage = 'Input must be between '+minvalue+' and '+maxvalue;
            }
            else {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 324);
if (withMinValue) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 325);
validationMessage = 'Input must not be below '+minvalue;
                }
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 327);
if (withMaxValue) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 328);
validationMessage = 'Input must not be above '+maxvalue;
                }
            }
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 331);
instance.inputElement = new Y.ITSAFORMELEMENT({
                name: 'value',
                type: 'input',
                value: defaultvalue ? defaultvalue.toString() : '',
                label: message,
                keyValidation: function(e) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "keyValidation", 336);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 337);
var keycode = e.keyCode,
                        node = e.target,
                        reactivation = true,
                        cursor = node.get('selectionStart'),
                        cursorEnd = node.get('selectionEnd'),
                        previousStringValue = node.get('value'),
                        safeNumericalKeyCodeToString = String.fromCharCode(((keycode>=96) && (keycode<=105)) ? keycode - 48 : keycode),
                        nextValue,
                        minValue = e.minValue,
                        maxValue = e.maxValue,
                        digits = [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],
                        valid = [8,9,13,27,37,38,39,40,46,48,49,50,51,52,53,54,55,56,57,173,189,45,96,97,98,99,100,101,102,103,104,105,109],
                        // 173,189,45 all can be minus-token
                        minustoken = [173,189,45,109];
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 351);
if (Y.Array.indexOf(valid, keycode) === -1) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 352);
e.halt(true);
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 353);
return false;
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 355);
if (((e.shiftKey) && (keycode!==9) && (keycode!==37) && (keycode!==38) && (keycode!==39) && (keycode!==40)) || (e.ctrlKey) || (e.altKey) || (e.metaKey)) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 356);
e.halt(true);
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 357);
return false;
                    }
                    // no digit of zero at the beginning when minimum>0
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 360);
if (Lang.isNumber(minValue) && (minValue>0) && (cursor===0) && ((keycode===48) || (keycode===96))) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 361);
e.halt(true);
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 362);
return false;
                    }
                    // no digit of zero at second position when first position=0
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 365);
if ((cursor===1) && ((keycode===48) || (keycode===96)) && ((previousStringValue==='0') || (previousStringValue==='-'))) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 366);
e.halt(true);
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 367);
return false;
                    }
                    // no minus at the beginning when minimum>=0
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 370);
if (Lang.isNumber(minValue) && (minValue>=0) && (cursor===0) && (Y.Array.indexOf(minustoken, keycode) !== -1)) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 371);
e.halt(true);
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 372);
return false;
                    }
                    // no minus when not at the beginning
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 375);
if ((cursor>0) && (Y.Array.indexOf(minustoken, keycode) !== -1)) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 376);
e.halt(true);
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 377);
return false;
                    }
                    // not valid when number will become lower than minimum, only check if field is modified
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 380);
if ((Lang.isNumber(minValue) || Lang.isNumber(maxValue)) && ((Y.Array.indexOf(digits, keycode) !== -1) || (keycode===8) || (keycode===46))) {
                        // transform e.keyCode to a keyCode that can be translated to chareacter --> numerical keyboard will be transformed to normal keyboard
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 382);
if (keycode===8) {
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 383);
nextValue = parseInt(previousStringValue.substring(0, (cursor===cursorEnd) ? cursor-1 : cursor) + previousStringValue.substring(cursorEnd), 10);
                        }
                        else {_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 385);
if (keycode===46) {
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 386);
nextValue = parseInt(previousStringValue.substring(0, cursor) + previousStringValue.substring((cursor===cursorEnd) ? cursorEnd+1 : cursorEnd), 10);
                        }
                        else {
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 389);
nextValue = parseInt(previousStringValue.substring(0, cursor) + safeNumericalKeyCodeToString + previousStringValue.substring(cursorEnd), 10);
                        }}
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 391);
if (!Lang.isNumber(nextValue)) {
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 392);
if (e.showValidation) {e.showValidation();}
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 393);
if (e.deactivatePanel) {e.deactivatePanel();}
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 394);
reactivation = false;
                        }
                        else {_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 396);
if (Lang.isNumber(minValue) && (nextValue<minValue)) {
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 397);
if (e.showValidation) {e.showValidation();}
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 398);
if (e.deactivatePanel) {e.deactivatePanel();}
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 399);
reactivation = false;
                        }
                        else {_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 401);
if (Lang.isNumber(maxValue) && (nextValue>maxValue)) {
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 402);
if (e.showValidation) {e.showValidation();}
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 403);
if (e.deactivatePanel) {e.deactivatePanel();}
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 404);
reactivation = false;
                        }}}
                    }
                    // correct possible 0x by removing leading 0
                    // because for some reason, this also is called when got blurred: do only check if number is digit
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 409);
if ((cursor===1) && (previousStringValue==='0') && (Y.Array.indexOf(digits, keycode) !== -1)) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 410);
node.set('value', '');
                    }
                    // only reactivate when the key is not a key that leaves the element
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 413);
if ((keycode!==9) && (keycode!==13)) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 414);
if (reactivation && e.hideValidation) {e.hideValidation();}
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 415);
if (reactivation && e.activatePanel) {e.activatePanel();}
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 417);
return true;
                },
                autoCorrection: function(e) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "autoCorrection", 419);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 420);
var formelement = this,
                        minvalue = e && e.minValue,
                        maxvalue = e && e.maxValue,
                        previousValue = formelement.get('elementNode').get('value'),
                        value = ((previousValue==='') || (previousValue==='-')) ? 0 : previousValue,
                        newValue = parseInt(value, 10);
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 426);
formelement.set('value', newValue.toString());
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 427);
if ((Lang.isNumber(minvalue) && (newValue<minvalue)) || (Lang.isNumber(maxvalue) && (newValue>maxvalue))) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 428);
if (newValue<minvalue) {
                        }
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 430);
if (newValue>maxvalue) {
                        }
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 432);
if (e.showValidation) {e.showValidation();}
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 433);
if (e.activatePanel) {e.activatePanel();}
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 434);
return false;
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 436);
return true;
                },
                validationMessage: validationMessage,
                classNameValue: 'yui3-itsadialogbox-numberinput itsa-formelement-lastelement',
                initialFocus: true,
                selectOnFocus: true
            });
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 443);
if (Lang.isNumber(minvalue)) {eventArguments.minValue = minvalue;}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 444);
if (Lang.isNumber(maxvalue)) {eventArguments.maxValue = maxvalue;}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 445);
if (validationMessage) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 446);
eventArguments.showValidation = Y.bind(instance.inputElement.showValidation, instance.inputElement);
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 447);
eventArguments.hideValidation = Y.bind(instance.inputElement.hideValidation, instance.inputElement);
            }
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 449);
if (eventArguments.minValue || eventArguments.maxValue) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 450);
eventArguments.activatePanel = Y.bind(instance.activatePanel, instance);
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 451);
eventArguments.deactivatePanel = Y.bind(instance.deactivatePanel, instance);
            }
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 453);
instance.showPanel(3, title, instance.inputElement.render(), callback, context, args, customButtons, customIconclass, eventArguments);
        },

        /**
         * Shows an ErrorMessage (Panel)
         * @method showErrorMessage
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} errormessage showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
        */
        showErrorMessage: function(title, errormessage, callback, context, args) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "showErrorMessage", 465);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 466);
this.showPanel(4, title, errormessage, callback, context, args);
        },

        /**
         * Shows a Message (Panel)
         * @method showMessage
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} errormessage showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
        */
        showMessage: function(title, message, callback, context, args, customButtons, customIconclass) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "showMessage", 480);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 481);
this.showPanel(5, title, message, callback, context, args, customButtons, customIconclass);
        },

        /**
         * Shows an Warning (Panel)
         * @method showWarning
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} warning showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
        */
        showWarning: function(title, warning, callback, context, args) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "showWarning", 493);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 494);
this.showPanel(6, title, warning, callback, context, args);
        },

        //==============================================================================

        /**
         * Hides the panel and executes the callback. <br>
         * Will not execute if the targetbutton has been disabled through validation.
         * @method _actionHide
         * @param {eventTarget} e
         * @private
        */
        _actionHide: function(e){
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_actionHide", 506);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 507);
var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd),
                button = e.target;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 511);
e.preventDefault();
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 512);
if (!button.hasClass('yui3-button-disabled')) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 513);
ev.buttonName = e.target.getData('name');
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 514);
instance.hide();       
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 515);
if (Y.Lang.isFunction(instance._activePanelOption.callback)) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 516);
Y.rbind(instance._activePanelOption.callback, instance._activePanelOption.context, ev, instance._activePanelOption.args)();
                }
            } 
        },

        /**
         * Just executes the callback while the Panel stays on the screen. Used when you just want to read form-information for example.<br>
         * Will not execute if the targetbutton has been disabled through validation.
         * @method _actionStayAlive
         * @param {eventTarget} e
         * @private
        */
        _actionStayAlive: function(e){
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_actionStayAlive", 528);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 529);
var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd),
                button = e.target;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 533);
e.preventDefault();
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 534);
if (!button.hasClass('yui3-button-disabled')) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 535);
ev.buttonName = e.target.getData('name');
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 536);
if (Y.Lang.isFunction(instance._activePanelOption.callback)) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 537);
Y.rbind(instance._activePanelOption.callback, instance._activePanelOption.context, ev, instance._activePanelOption.args)();
                }
            } 
        },

        /**
         * Resets any form-elements inside the panel.<br>
         * Does not execute the callback.
         * --- This function does not work yet ---
         * @method _actionStayAlive
         * @param {eventTarget} e
         * @private
        */
        _actionReset: function(e){
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_actionReset", 550);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 551);
var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd);
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 554);
e.preventDefault();
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 555);
ev.buttonName = e.target.getData('name');
        },

        /**
         * Clears all form-elements inside the panel.<br>
         * Does not execute the callback.
         * --- This function does not work yet ---
         * @method _actionStayAlive
         * @param {eventTarget} e
         * @private
        */
        _actionClear: function(e){
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_actionClear", 566);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 567);
var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd);
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 570);
e.preventDefault();
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 571);
ev.buttonName = e.target.getData('name');
        },

        /**
         * overrules Y.panel.focus, by focussing on the panel furst, and then using the focusmanager to focus on the right element.
         * @method focus
        */
        focus: function(){
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "focus", 578);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 579);
var instance = this,
                contentBox = instance.get('contentBox'),
                focusManager = contentBox.focusManager;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 582);
instance.constructor.superclass.focus.apply(instance, arguments);
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 583);
if (focusManager) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 584);
focusManager.focus();
            }
        },

        /**
         * Define all eventhandlers
         * @method bindUI
        */
        bindUI: function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "bindUI", 592);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 593);
var instance = this,
                contentBox = instance.get('contentBox'),
                focusManager = contentBox.focusManager;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 596);
instance._panelListener = contentBox.on(
                'keydown', 
                function (e) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 2)", 598);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 599);
if (e.keyCode === 9) { // tab
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 600);
e.preventDefault();
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 601);
this.shiftFocus(e.shiftKey);
                    }
                },
                instance
            );
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 606);
instance._buttonsListener = instance.after(
                'buttonsChange',
                instance._setValidationButtons,
                instance
            );
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 611);
instance._descendantListener = contentBox.focusManager.on(
                'activeDescendantChange',
                function (e, contentBox) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 3)", 613);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 614);
var instance = this,
                        previousDescendant = e.prevVal,
                        nextDescendant = e.newVal,
                        defaultButton,
                        isButton,
                        allDescendants = contentBox.focusManager.get('descendants'),
                        sameDescendant;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 621);
instance._descendantChange++;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 622);
if (Lang.isNumber(previousDescendant) && (previousDescendant>=0)) {previousDescendant = allDescendants.item(e.prevVal);}
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 623);
if (Lang.isNumber(nextDescendant)) {nextDescendant = allDescendants.item(e.newVal);}
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 624);
sameDescendant = nextDescendant.compareTo(previousDescendant);
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 625);
defaultButton = contentBox.one('.yui3-button-primary');
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 626);
isButton = (nextDescendant.get('tagName')==='BUTTON');
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 627);
if (defaultButton) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 628);
defaultButton.toggleClass('nofocus', ((nextDescendant!==defaultButton) && isButton));
                    }
                    // to make a pressed button highlighted, we must add a seperate class
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 631);
allDescendants.removeClass('mousepressfocus');
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 632);
if (isButton) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 633);
nextDescendant.addClass('mousepressfocus');
                    }
                    // now: by first time showing the Panel, the focusManager activeDescendent will be called three times, before steady state in case of an element that gets focused.
                    // To make the content be selected again (if requested) look at the value of instance._descendant
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 637);
if ((!sameDescendant || (instance._descendantChange<4)) && nextDescendant.hasClass('itsa-formelement-selectall')) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 638);
nextDescendant.select();
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 640);
if (!sameDescendant) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 641);
instance._validate(isButton, nextDescendant);
                    }
                },
                instance,
                contentBox
            );
            // because the header might not exists yet (at rendering it doesn't), we have to delegate next events instead of binding it to the headernode
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 648);
instance._headerMousedownListener = contentBox.delegate(
                'mousedown',
                function(e) {_yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 4)", 650);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 650);
e.target.addClass('cursormove');},
                '.yui3-widget-hd'
            );
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 653);
instance._headerMouseupListener = contentBox.delegate(
                'mouseup',
                function(e) {_yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 5)", 655);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 655);
e.target.removeClass('cursormove');},
                '.yui3-widget-hd'
            );
            // same for input elements
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 659);
instance._inputListener = contentBox.delegate(
                'keydown',
                instance._checkInput,
                'input',
                instance
            );
            // now, listen for checkboxes: the loose focus when they get clicked.
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 666);
instance._checkBoxListener = contentBox.delegate(
                'change',
                instance._shiftFocusFromCheckbox,
                function(){
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 6)", 669);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 670);
var node =this;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 671);
return ((node.get('tagName')==='INPUT') && (node.get('type')==='checkbox'));
                },
                instance
            );
            // reset the focus when clicked on an area inside contentBox that is not an element
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 676);
contentBox.on(
                'click',
                function() {
                    // this = focusManeger
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 7)", 678);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 680);
this.focus(this.get('activeDescendant'));
                },
                focusManager
            );
        },

        /**
         * Hides the panel and executes the callback. <br>
         * Will not execute if the targetbutton has been disabled through validation.
         * @method shiftFocus
         * @param {Boolean} [backward] direction to shift
         * @param {eventTarget} [referenceNode] startnode, when not supplied, the node that currently has focused will be used.
        */
        shiftFocus: function(backward, referenceNode) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "shiftFocus", 693);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 694);
var instance = this,
                focusManager = instance.get('contentBox').focusManager,
                focusManagerNodes = focusManager.get('descendants'),
                activeDescendant = referenceNode ? focusManagerNodes.indexOf(referenceNode) : focusManager.get('activeDescendant'),
                numberDescendants = focusManagerNodes.size();
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 699);
if (referenceNode || focusManager.get('focused')) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 700);
if (Lang.isBoolean(backward) && backward) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 701);
activeDescendant--;
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 702);
focusManager.focus((activeDescendant<0) ? numberDescendants-1 : activeDescendant);
                    } 
                    else {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 705);
activeDescendant++;
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 706);
focusManager.focus((activeDescendant>=numberDescendants) ? 0 : activeDescendant);
                    }
                }
                else {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 710);
focusManager.focus(instance._getFirstFocusNode());
                }
        },

        /**
         * Makes the focus set on next element when a checkbox is clicked.<br>
         * @method _shiftFocusFromCheckbox
         * @param {eventTarget} e
         * @private
        */
        _shiftFocusFromCheckbox: function(e) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_shiftFocusFromCheckbox", 720);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 721);
var instance = this,
                checkboxNode = e.target;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 723);
if (checkboxNode.hasClass('itsa-formelement-lastelement')) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 724);
instance.get('contentBox').focusManager.focus(instance._getDefaultButtonNode());
            }
            else {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 727);
instance.shiftFocus(false, checkboxNode);
            }
        },

        /**
         * Internal function that is called by 'keydown'-event when using input-elements.<br>
         * If the element has keyvalidation, then its keyvalidation-function is called, which could prevent the keyinput.<br>
         * If Enter is pressed, the focus is set on the next element <b>or</b> if it's the last element the ACTION_HIDE is called<br>
         * If the element has autocorrection, autocorrect-function is called.<br>
         * If this returns false, then all buttons with button.validation=true get disabled and  ACTION_HIDE is prevented, if returns true, all these buttons get enabled.
         * @method _checkInput
         * @param {eventTarget} e
         * @private
        */
        _checkInput: function(e) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_checkInput", 741);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 742);
var instance = this,
                node = e.target,
                autoCorrection,
                autoCorrectResult,
                eventArgs = instance._activePanelOption.eventArgs;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 747);
if (node.hasClass('itsa-formelement-keyvalidation') && instance.inputElement) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 748);
Y.mix(e, eventArgs);
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 749);
if (!instance.inputElement.get('keyValidation')(e)) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 750);
return;
                }
            }
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 753);
if (e.keyCode===13) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 754);
e.preventDefault();
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 755);
if (node.hasClass('itsa-formelement-lastelement')) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 756);
autoCorrection = instance.inputElement && instance.inputElement.get('autoCorrection');
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 757);
autoCorrectResult = true;
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 758);
if (autoCorrection) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 759);
autoCorrectResult = Y.bind(autoCorrection, instance.inputElement, eventArgs)();
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 760);
if (!autoCorrectResult) {
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 761);
eventArgs.showValidation();
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 762);
instance.deactivatePanel();
                            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 763);
instance.get('contentBox').focusManager.focus(instance._getFirstFocusNode());
                        }
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 766);
if (autoCorrectResult) {
                        // because the callback should think the activebutton was clicked, we add the right name-data to this Node
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 768);
node.setData('name', instance._getDefaultButtonNode().getData('name'));
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 769);
instance._actionHide(e);
                    }
                    else {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 772);
node.select();
                    }
                }
                else {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 776);
instance.shiftFocus();
                }
            }
        },

        /**
         * Internal function that is called when an descendant changes. To validate inputelements (if present)<br>
         * If the element has autocorrection, autocorrect-function is called.<br>If this returns false, then all buttons with button.validation=true get disabled, if returns true, all these buttons get enabled.
         * @method _validate
         * @private
        */
        _validate: function(isButton, node) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_validate", 787);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 788);
var instance = this,
                eventArgs = instance._activePanelOption.eventArgs,
                buttonValidation = isButton && node.hasClass('itsadialogbox-button-validated'),
                autoCorrection = instance.inputElement && instance.inputElement.get('autoCorrection'),
                autoCorrectResult = true;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 793);
if (autoCorrection && buttonValidation) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 794);
autoCorrectResult = Y.bind(autoCorrection, instance.inputElement, eventArgs)();
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 795);
if (!autoCorrectResult) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 796);
if (eventArgs && eventArgs.showValidation) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 797);
eventArgs.showValidation();
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 799);
instance.deactivatePanel();
                }
            }
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 802);
if (autoCorrectResult) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 803);
if (eventArgs && eventArgs.hideValidation) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 804);
eventArgs.hideValidation();
                }
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 806);
instance.activatePanel();
            }
        },

        /**
         * Enables the Panel in such a way that Buttons with validation are functional
         * @method activatePanel
        */
        activatePanel: function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "activatePanel", 814);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 815);
this._validationButtons.toggleClass('yui3-button-disabled', false);
        },

        /**
         * Deactivates the Panel in such a way that it only responses to Buttons with no validation
         * @method deactivatePanel
        */
        deactivatePanel: function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "deactivatePanel", 822);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 823);
this._validationButtons.toggleClass('yui3-button-disabled', true);
        },

        /**
         * Cleans up bindings
         * @method destructor
         * @protected
        */
        destructor: function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "destructor", 831);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 832);
var instance = this;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 833);
if (instance.keyDownHandle) {instance.keyDownHandle.detach();}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 834);
if (instance._panelListener) {instance._panelListener.detach();} 
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 835);
if (instance._descendantListener) {instance._descendantListener.detach();}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 836);
if (instance._headerMousedownListener) {instance._headerMousedownListener.detach();}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 837);
if (instance._headerMouseupListener) {instance._headerMouseupListener.detach();}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 838);
if (instance._inputListener) {instance._inputListener.detach();}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 839);
if (instance._checkBoxListener) {instance._checkBoxListener.detach();}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 840);
if (instance._buttonsListener) {instance._buttonsListener.detach();}
        },

        //==============================================================================

        /**
         * Internal method that looks for all buttons with button.validation=true and markes them with a validated-class<br>
         * Will be executed when the buttons are changed.
         * @method _setValidationButtons
         * @param {eventTarget} e
         * @private
        */
        _setValidationButtons : function(e) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_setValidationButtons", 852);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 853);
var instance = this,
                buttonsObject = instance._activePanelOption.buttons,
                contentBox = instance.get('contentBox');
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 856);
contentBox.all('.itsadialogbox-button-validated').removeClass('itsadialogbox-button-validated');
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 857);
if (buttonsObject) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 858);
if (buttonsObject.header) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 859);
Y.Array.each(
                        buttonsObject.header,
                        instance._markButtonValidated,
                        instance
                    );
                }
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 865);
if (buttonsObject.body) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 866);
Y.Array.each(
                        buttonsObject.body,
                        instance._markButtonValidated,
                        instance
                    );
                }
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 872);
if (buttonsObject.footer) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 873);
Y.Array.each(
                        buttonsObject.footer,
                        instance._markButtonValidated,
                        instance
                    );
                }
            }
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 880);
instance._validationButtons = contentBox.all('.itsadialogbox-button-validated');
        },

        /**
         * Internal method that markes a button with a validated-class if it has button.validation=true<br>
         * @method _markButtonValidated
         * @param {Object} buttonObject 
         * @param {Int} index
         * @param {Array} array 
         * @private
        */
        _markButtonValidated : function(buttonObject, index, array) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_markButtonValidated", 891);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 892);
var instance = this,
                name = buttonObject.name,
                validation,
                buttonNode;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 896);
buttonNode = instance.getButton(name);
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 897);
if (buttonNode) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 898);
validation = buttonObject.validation;
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 899);
if (Lang.isBoolean(validation) && validation) {
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 900);
buttonNode.addClass('itsadialogbox-button-validated');
                }
            }
        },

        /**
         * Definition of the predefined Panels (like showMessage() etc.)
         * @method _initiatePanels
         * @private
        */
        _initiatePanels : function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_initiatePanels", 910);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 911);
var instance = this;
            // creating getRetryConfirmation
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 913);
instance.definePanel({
                iconClass: instance.ICON_WARN,
                buttons: {
                    footer: [
                        {name:'abort', label:'Abort', action:instance.ACTION_HIDE},
                        {name:'ignore', label:'Ignore', action:instance.ACTION_HIDE},
                        {name:'retry', label:'Retry', action:instance.ACTION_HIDE, isDefault: true}    
                    ]
                }    
            });
            // creating getConfirmation
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 924);
instance.definePanel({
                iconClass: instance.ICON_INFO,
                buttons: {
                    footer: [
                        {name:'no', label:'No', action:instance.ACTION_HIDE},
                        {name:'yes', label:'Yes', action:instance.ACTION_HIDE, isDefault: true}    
                    ]
                }    
            });
            // creating getInput
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 934);
instance.definePanel({
                iconClass: instance.ICON_QUESTION,
                form: [
                    {name:'count', label:'{message}', value:'{count}'}
                ],
                buttons: {
                    footer: [
                        {name:'cancel', label:'Cancel', action:instance.ACTION_HIDE},
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, validation: true, isDefault: true}    
                    ]
                }    
            });
            // creating getNumber
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 947);
instance.definePanel({
                iconClass: instance.ICON_QUESTION,
                form: [
                    {name:'count', label:'{message}', value:'{count}'}
                ],
                buttons: {
                    footer: [
                        {name:'cancel', label:'Cancel', action:instance.ACTION_HIDE},
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, validation: true, isDefault: true}    
                    ]
                }    
            });
            // creating showErrorMessage
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 960);
instance.definePanel({
                iconClass: instance.ICON_ERROR,
                buttons: {
                    footer: [
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}    
                    ]
                }    
            });
            // creating showMessage
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 969);
instance.definePanel({
                buttons: {
                    footer: [
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}    
                    ]
                }    
            });
            // creating showWarning
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 977);
instance.definePanel({
                iconClass: instance.ICON_WARN,
                buttons: {
                    footer: [
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}    
                    ]
                }    
            });
        },

        /**
         * Definition of the predefined Panels (like showMessage() etc.)
         * this can be a form-element. But if no form-element has focus defined, the first form-element should get focus.
         * If no form element is present, then the defaultbutton should get focus
         * @method _getFirstFocusNode
         * @private
         * return {Y.Node} the Node that should get focus when panel is showed.
        */
        _getFirstFocusNode: function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_getFirstFocusNode", 995);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 996);
var instance = this,
                contentBox = instance.get('contentBox'),
                focusnode;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 999);
focusnode = contentBox.one('.itsa-formelement-firstfocus') || contentBox.one('.itsa-firstformelement') || instance._getDefaultButtonNode();
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1000);
return focusnode;
        },

        /**
         * Returns the default button: the buttonNode that has the primary focus.<br>
         * This should be set during definition of PanelOptions.
         * @method _getDefaultButtonNode
         * @private
         * return {Y.Node} buttonNode
        */
        _getDefaultButtonNode: function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_getDefaultButtonNode", 1010);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1011);
var node = this.get('contentBox').one('.yui3-button-primary');
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1012);
return node;
        },

        /**
         * Returns all form-elements in panel
         * @method _serializeForm
         * @private
         * return {Object} Contains all form-elements with name/value pair
        */
        _serializeForm: function(masterNode) {
            // At this moment only text-inputs are allowed.
            // at later stage, handle this by Y.ITSAFORM with a true serialize function
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "_serializeForm", 1021);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1024);
var instance = this,
                formelements = masterNode.all('.itsa-formelement'),
                value,
                intValue,
                serialdata = {};
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1029);
formelements.each(
                function(formelementNode, index, nodeList) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "(anonymous 8)", 1030);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1031);
value = formelementNode.get('value');
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1032);
intValue = parseInt(value, 10);
                    // now check with DOUBLE == (not threedouble) to see if value == intValue --> in that case we have an integer
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1034);
serialdata[formelementNode.get('name')] = (value==intValue) ? intValue : value;
                }
            );
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1037);
return serialdata;
        }

    }, {
        ATTRS : {
        }
    }
);

//=================================================================================

_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1048);
if (!Y.Global.ItsaDialog) {
    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1049);
Y.Global.ItsaDialog = new Y.ITSADIALOGBOX({
        visible: false,
        centered: true,
        render : true,
        zIndex : 21000,
        modal  : true,
        bodyContent : '',
        focusOn: [
            {eventName: 'clickoutside'}
        ]
    });
    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1060);
Y.Global.ItsaDialog.plug(Y.Plugin.Drag);
    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1061);
Y.Global.ItsaDialog.dd.addHandle('.yui3-widget-hd');
}

//=================================================================================

// Y.ITSAFORMELEMENT should get an own module. For the short time being, we will keep it inside itsa-dialog

/**
 * The Itsa Dialogbox module.
 *
 * @module itsa-dialogbox
 */

/**
 * Dialogbox with sugar messages
 * 
 *
 * @class ITSAFormelement
 * @extends Panel
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1087);
var ITSAFORM_TABLETEMPLATE = '<td class="itsaform-tablelabel{classnamelabel}"{marginstyle}>{label}</td>'
                            +'<td class="itsaform-tableelement">{element}<div class="itsa-formelement-validationmessage itsa-formelement-hidden">{validationMessage}</div></td>',
    ITSAFORM_INLINETEMPLATE = '<span class="itsaform-spanlabel{classnamelabel}"{marginstyle}>{label}</span>'
                            +'{element}<div class="itsa-formelement-validationmessage itsa-formelement-hidden">{validationMessage}</div>';

_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1092);
Y.ITSAFORMELEMENT = Y.Base.create('itsaformelement', Y.Base, [], {

        id: null,

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
        */
        initializer : function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "initializer", 1102);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1103);
this.id = Y.guid();
        },

        /**
         * Renderes a String that contains the completeFormElement definition.<br>
         * To be used in an external Form
         * @method render
         * @param {boolean} tableform If the renderedstring should be in tableform: encapsuled by td-elements (without tr)
         * @return {String} rendered String
        */
        render : function(tableform) {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "render", 1113);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1114);
var instance = this,
                marginTop = instance.get('marginTop'),
                marginStyle = marginTop ? ' style="margin-top:' + marginTop + 'px"' : '',
                type = instance.get('type'),
                classNameLabel = instance.get('classNameLabel'),
                classNameValue = instance.get('classNameValue'),
                initialFocus = instance.get('initialFocus'),
                selectOnFocus = instance.get('selectOnFocus'),
                keyValidation = instance.get('keyValidation'),
                validation = instance.get('validation'),
                autoCorrection = instance.get('autoCorrection'),
                initialFocusClass = initialFocus ? ' itsa-formelement-firstfocus' : '',
                selectOnFocusClass = selectOnFocus ? ' itsa-formelement-selectall' : '',
                keyValidationClass = keyValidation ? ' itsa-formelement-keyvalidation' : '',
                validationClass = validation ? ' itsa-formelement-validation' : '',
                autoCorrectionClass = autoCorrection ? ' itsa-formelement-autocorrect' : '',
                elementClass = ' class="itsa-formelement ' + classNameValue + initialFocusClass + selectOnFocusClass + keyValidationClass + validationClass + autoCorrectionClass+'"',
                element = '';
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1132);
if (type==='input') {element = '<input id="' + instance.id + '" type="text" name="' + instance.get('name') + '" value="' + instance.get('value') + '"' + elementClass + marginStyle + ' />';}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1133);
return  Lang.sub(
                        tableform ? ITSAFORM_TABLETEMPLATE : ITSAFORM_INLINETEMPLATE,
                        {
                            marginstyle: marginStyle,
                            label: instance.get('label'),
                            element: element,
                            classnamelabel: classNameLabel,
                            validationMessage: instance.get('validationMessage'),
                            classnamevalue: classNameValue
                        }
                    );
        },

        /**
         * Shows the validationmessage
         * @method showValidation
        */
        showValidation : function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "showValidation", 1150);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1151);
var element = this.get('elementNode');
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1152);
if (element) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1153);
element.get('parentNode').one('.itsa-formelement-validationmessage').toggleClass('itsa-formelement-hidden', false);
            }
        },

        /**
         * Hides the validationmessage
         * @method hideValidation
        */
        hideValidation : function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "hideValidation", 1161);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1162);
var element = this.get('elementNode');
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1163);
if (element) {
                _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1164);
element.get('parentNode').one('.itsa-formelement-validationmessage').toggleClass('itsa-formelement-hidden', true);
            }
        },

        /**
         * Cleans up bindings
         * @method destructor
         * @protected
        */
        destructor : function() {
            _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "destructor", 1173);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1174);
var instance = this;
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1175);
if (instance.blurevent) {instance.blurevent.detach();}
            _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1176);
if (instance.keyevent) {instance.keyevent.detach();}
        }

    }, {
        ATTRS : {
            /**
             * @description The value of the element
             * @attribute [value]
             * @type String | Boolean | Array(String)
            */
            name : {
                value: 'undefined-name',
                setter: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "setter", 1188);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1189);
var node = this.get('elementNode');
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1190);
if (node) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1191);
node.set('name', val);
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1193);
return val;
                },
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1195);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1196);
return (Lang.isString(val));
                }
            },
            /**
             * @description Must have one of the following values:
             * <ul><li>input</li><li>password</li><li>textarea</li><li>checkbox</li><li>radiogroup</li><li>selectbox</li><li>hidden</li></ul>
             * @attribute typr
             * @type String
            */
            type : {
                value: '',
                setter: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "setter", 1207);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1208);
if (Lang.isString(val)) {val=val.toLowerCase();}
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1209);
return val;
                },
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1211);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1212);
return (Lang.isString(val) && 
                            ((val==='input') || 
                             (val==='password') || 
                             (val==='textarea') || 
                             (val==='checkbox') || 
                             (val==='radiogroup') || 
                             (val==='selectbox') || 
                             (val==='button') || 
                             (val==='hidden')
                            )
                    );
                }
            },
            /**
             * @description The value of the element
             * @attribute [value]
             * @type String | Boolean | Array(String)
            */
            value : {
                value: null,
                setter: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "setter", 1232);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1233);
var node = this.get('elementNode');
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1234);
if (node) {
                        _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1235);
node.set('value', val);
                    }
                    _yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1237);
return val;
                }
            },
            /**
             * @description The label that wis present before the element
             * @attribute [label]
             * @type String
            */
            label : {
                value: '',
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1247);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1248);
return (Lang.isString(val));
                }
            },
            /**
             * @description Validation during every keypress. The function that is passed will receive the keyevent, that can thus be prevented.<br>
             * Only has effect if the masterform knows how to use it through delegation: therefore it adds the className 'itsa-formelement-keyvalidation'.
             * The function MUST return true or false.
             * @attribute [keyValidation]
             * @type Function
            */
            keyValidation : {
                value: null,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1260);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1261);
return (Lang.isFunction(val));
                }
            },
            /**
             * @description Validation after changing the value (onblur). The function should return true or false. In case of false, the validationerror is thrown.<br>
             * Only has effect if the masterform knows how to use it through delegation: therefore it adds the className 'itsa-formelement-validation'.
             * The function MUST return true or false.
             * Either use validation, or autocorrection.
             * @attribute [validation]
             * @type Function
             * @return Boolean
            */
            validation : {
                value: null,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1275);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1276);
return (Lang.isFunction(val));
                }
            },
            /**
             * @description The message that will be returned on a validationerror, this will be set within e.message.
             * @attribute [validationMessage]
             * @type String
            */
            validationMessage : {
                value: '',
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1286);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1287);
return (Lang.isString(val));
                }
            },
            /**
             * @description If set, value will be replaces by the returnvalue of this function. <br>
             * Only has effect if the masterform knows how to use it through delegation: therefore it adds the className 'itsa-formelement-autocorrect'.
             * The function MUST return true or false: defining whether the input is accepted.
             * Either use validation, or autocorrection.
             * @attribute [autocorrection]
             * @type Function
             * @return Boolean
            */
            autoCorrection : {
                value: null,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1301);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1302);
return (Lang.isFunction(val));
                }
            },
            /**
             * @description Additional className that is passed on the label, during rendering.<br>
             * Only applies to rendering in tableform render(true).
             * @attribute [classNameLabel]
             * @type String
            */
            classNameLabel : {
                value: '',
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1313);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1314);
return (Lang.isString(val));
                }
            },
            /**
             * @description Additional className that is passed on the value, during rendering.<br>
             * Only applies to rendering in tableform render(true).
             * @attribute [classNameValue]
             * @type String
            */
            classNameValue : {
                value: '',
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1325);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1326);
return (Lang.isString(val));
                }
            },
            /**
             * @description Will create extra white whitespace during rendering.<br>
             * Only applies to rendering in tableform render(true).
             * @attribute [marginTop]
             * @type Int
            */
            marginTop : {
                value: 0,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1337);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1338);
return (Lang.isNumber(val));
                }
            },
            /**
             * @description Determines whether this element should have the initial focus.<br>
             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-firstfocus' is added).
             * @attribute [initialFocus]
             * @type Boolean
            */
            initialFocus : {
                value: false,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1349);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1350);
return (Lang.isBoolean(val));
                }
            },
            /**
             * @description Determines whether this element should completely be selected when it gets focus.<br>
             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-selectall' is added).
             * @attribute [selectOnFocus]
             * @type Boolean
            */
            selectOnFocus : {
                value: false,
                validator: function(val) {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "validator", 1361);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1362);
return (Lang.isBoolean(val));
                }
            },
            /**
             * @description DOM-node where the elementNode is bound to.<br>
             * Be carefull: it will only return a Node when you have manually inserted the result of this.render() into the DOM. Otherwise returns null.
             * Readonly
             * @attribute [elementNode]
             * @type Y.Node
             * @readonly
            */
            elementNode : {
                value: null,
                readOnly: true,
                getter: function() {
                    _yuitest_coverfunc("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", "getter", 1376);
_yuitest_coverline("/build/gallery-itsadialogbox/gallery-itsadialogbox.js", 1377);
return Y.one('#'+this.id);
                }
            }
        }
    }
);


}, 'gallery-2012.11.07-21-32' ,{requires:['base-build', 'panel', 'node-base', 'dd-plugin', 'node-focusmanager', 'event-valuechange'], skinnable:true});
