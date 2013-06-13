'use strict';

/**
 *
 * Widget ITSAViewModelPanel
 *
 *
 * Has the same functionalities as ITSAViewModel, but will come inside a Panel (which floats by default).
 * Also has standard a 'close'-button. Using WidgetButtons functionalyties, more buttons can be added.
 *
 * These buttons are available by the module and will call Model's corresponding methods:
 *
 * close (visible by default)
 * add
 * destroy
 * reset
 * save
 * submit
 *
 *
 * @class ITSAViewModelPanel
 * @constructor
 * @extends ITSAViewModel
 * @uses WidgetAutohide
 * @uses WidgetButtons
 * @uses WidgetModality
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WidgetPositionConstrain
 * @uses WidgetStack
 * @uses WidgetStdMod
 * @since 0.1
 */


var getClassName = Y.ClassNameManager.getClassName,
    Lang = Y.Lang,
    FORMELEMENT = 'yui3-itsaformelement',
    FOCUSABLE = 'focusable',
    /**
     * Fired when the 'closebutton' is pressed
     * @event model:closeclick
     * @param e {EventFacade} Event Facade including:
     * @param e.buttonNode {Y.Node} ButtonNode that was clicked
     * @param e.target {Y.Model} the Model that is currently rendered in the panel
     * @since 0.1
    **/
    EVT_CLOSE_CLICK = 'closeclick',
    /**
     * Fired when the 'submitbutton' is pressed
     * @event model:submitclick
     * @param e {EventFacade} Event Facade including:
     * @param e.buttonNode {Y.Node} ButtonNode that was clicked
     * @param e.target {Y.Model} the Model that is currently rendered in the panel
     * @param e.promise {Y.Promise} the Promise that is generated to submit the Model to the server.
     * Is in fact model.submitPromise(). Look for promised response --> resolve(response, options) OR reject(reason).
     * @since 0.1
    **/
    EVT_SUBMIT_CLICK = 'submitclick',
    /**
     * Fired when the 'savebutton' is pressed
     * @event model:saveclick
     * @param e {EventFacade} Event Facade including:
     * @param e.buttonNode {Y.Node} ButtonNode that was clicked
     * @param e.target {Y.Model} the Model that is currently rendered in the panel
     * @param e.promise {Y.Promise} the Promise that is generated to save the Model to the server.
     * Is in fact model.savePromise(). Look for promised response --> resolve(response, options) OR reject(reason).
     * @since 0.1
    **/
    EVT_SAVE_CLICK = 'saveclick',
    /**
     * Fired when the 'resetbutton' is pressed
     * @event model:resetclick
     * @param e {EventFacade} Event Facade including:
     * @param e.buttonNode {Y.Node} ButtonNode that was clicked
     * @param e.target {Y.Model} the Model that is currently rendered in the panel
     * @since 0.1
    **/
    EVT_RESET_CLICK = 'resetclick',
    /**
     * Fired when the 'addbutton' is pressed
     * @event model:addclick
     * @param e {EventFacade} Event Facade including:
     * @param e.buttonNode {Y.Node} ButtonNode that was clicked
     * @param e.target {Y.Model} the Model that is currently rendered in the panel
     * @since 0.1
    **/
    EVT_ADD_CLICK = 'addclick',
    /**
     * Fired when the 'destroybutton' is pressed
     * @event model:destroyclick
     * @param e {EventFacade} Event Facade including:
     * @param e.buttonNode {Y.Node} ButtonNode that was clicked
     * @param e.target {Y.Model} the Model that is currently rendered in the panel
     * @param e.promise {Y.Promise} the Promise that is generated to destroy the Model on the server.
     * Is in fact model.destroyPromise(). Look for promised response --> resolve(response, options) OR reject(reason).
     * @since 0.1
    **/
    EVT_DESTROY_CLICK = 'destroyclick';

Y.ITSAViewModelPanel = Y.Base.create('itsaviewmodelpanel', Y.ITSAViewModel, [
    // Other Widget extensions depend on these two.
    Y.WidgetPosition,
    Y.WidgetStdMod,

    Y.WidgetAutohide,
    Y.WidgetButtons,
    Y.WidgetModality,
    Y.WidgetPositionAlign,
    Y.WidgetPositionConstrain,
    Y.WidgetStack
], {

    initializer : function() {
        var instance = this;

        Y.log('initializer', 'info', 'Itsa-ViewModelPanel');

        // declare bodyContent: this must be rendered.
        instance.set('bodyContent', '');
    },

    _bindViewUI : function() {
        var instance = this,
            eventhandlers = instance._eventhandlers,
            staticPosition = instance.get('staticPosition'),
            boundingBox = instance.get('boundingBox'),
            view = instance.view,
            panelheader;

        Y.log('_bindViewUI', 'info', 'Itsa-ViewModelPanel');
        if (staticPosition) {
            boundingBox.addClass('itsa-staticposition');
        }
        if (instance.get('dragable') && !staticPosition) {
            panelheader = instance.getStdModNode(Y.WidgetStdMod.HEADER);
            Y.use('dd-plugin', function(Y){
                boundingBox.plug(Y.Plugin.Drag);
                if (panelheader) {
                    boundingBox.dd.addHandle('.yui3-widget-hd');
                }
            });
        }
        instance.constructor.superclass._bindViewUI.apply(instance);
        eventhandlers.push(
            view.after(
                '*:destroy',
                function(e) {
                    if (e.target instanceof Y.Model) {
                        instance.hide();
                    }
                }
            )
        );
        eventhandlers.push(
            instance.after(
                'staticPositionChange',
                function(e) {
                    var staticPosition = e.newVal;
                    boundingBox.toggleClass('itsa-staticposition', staticPosition);
                    // remove style position=relative, which is added by WidgetPosition
                    boundingBox.setStyle('position', '');
                }
            )
        );
        eventhandlers.push(
            instance.after(
                'dragableChange',
                function(e) {
                    var dragable = e.newVal;
                    if (dragable && !instance.get('staticPosition')) {
                        panelheader = instance.getStdModNode(Y.WidgetStdMod.HEADER);
                        Y.use('dd-plugin', function(Y){
                            boundingBox.plug(Y.Plugin.Drag);
                            if (panelheader) {
                                boundingBox.dd.addHandle('.yui3-widget-hd');
                            }
                        });
                    }
                    else {
                        boundingBox.unplug('dd');
                    }
                }
            )
        );
    },

    /**
     * Function for the addbutton. Adds a new model and fires an event.
     *
     * @method _addModel
     * @private
     * @protected
    */
    _addModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            ModelClass, currentConfig, newModel;

        Y.log('_addModel', 'info', 'Itsa-ViewModelPanel');
        if (model) {
            e.buttonNode = e.target;
            e.target = model;
            e.type = EVT_ADD_CLICK;
            ModelClass = instance.get('newModelClass');
            newModel = new ModelClass();
            if (model.hasPlugin('itsaeditmodel')) {
                currentConfig = Y.clone(model.itsaeditmodel.getAttrs());
                Y.use('gallery-itsaeditmodel', function(Y) {
                    newModel.plug(Y.Plugin.ITSAEditModel, currentConfig);
                });
            }
            e.newModel = newModel;
            model.fire(EVT_ADD_CLICK, e);
        }
    },

    /**
     * Function for the closebutton. Closes the panel the model and fires an event.
     *
     * @method _closeModel
     * @private
     * @protected
    */
    _closeModel : function(e) {
        var instance = this,
            model = instance.get('model');

        Y.log('_closeModel', 'info', 'Itsa-ViewModelPanel');
        if (model) {
            e.buttonNode = e.target;
            e.target = model;
            e.type = EVT_CLOSE_CLICK;
            instance.hide();
            model.fire(EVT_CLOSE_CLICK, e);
        }
    },

    /**
     * Function for the destroybutton. Destroys the model and fires an event.
     *
     * @method _destroyModel
     * @private
     * @protected
    */
    _destroyModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            syncOptions, options;

        Y.log('_destroyModel', 'info', 'Itsa-ViewModelPanel');
        if (model) {
            e.buttonNode = e.target;
            e.target = model;
            e.type = EVT_DESTROY_CLICK;
            syncOptions = instance.get('syncOptions');
            options = Y.merge({remove: true}, syncOptions.destroy || {});
            e.promise = model.destroyPromise(options);
            model.fire(EVT_DESTROY_CLICK, e);
        }
    },

    /**
     * Function for the resetbutton. Resets the model and fires an event.
     *
     * @method _resetModel
     * @private
     * @protected
    */
    _resetModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            button;

        Y.log('_resetModel', 'info', 'Itsa-ViewModelPanel');
        if (model) {
            button = e.target,
            // set the focus manually. This will cause the View to be focussed as well --> now the focusmanager works for this View-instance
            button.focus();
            e.buttonNode = button;
            e.target = model;
            e.type = EVT_RESET_CLICK;
            model.fire(EVT_RESET_CLICK, e);
        }
    },

    /**
     * Function for the savebutton. Saves the model and fires an event.
     *
     * @method _saveModel
     * @private
     * @protected
    */
    _saveModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            actionAfterSave = instance.get('actionAfterSave'),
            button, syncOptions, options;

        Y.log('_saveModel', 'info', 'Itsa-ViewModelPanel');
        if (model) {
            button = e.target,
            // set the focus manually. This will cause the View to be focussed as well --> now the focusmanager works for this View-instance
            button.focus();
            e.buttonNode = button;
            e.target = model;
            e.type = EVT_SAVE_CLICK;
            syncOptions = instance.get('syncOptions');
            options = syncOptions.save || {};
            e.promise = model.savePromise(options);
            model.fire(EVT_SAVE_CLICK, e);
            if (actionAfterSave===1) {
                instance.hide();
            }
            if (actionAfterSave===2) {
                model.unplug('itsaeditmodel');
            }
        }
    },

    /**
     * Function for the submitbutton. Submits the model and fires an event.
     *
     * @method _submitModel
     * @private
     * @protected
    */
    _submitModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            actionAfterSubmit = instance.get('actionAfterSubmit'),
            button, syncOptions, options;

        Y.log('_submitModel', 'info', 'Itsa-ViewModelPanel');
        if (model) {
            button = e.target,
            // set the focus manually. This will cause the View to be focussed as well --> now the focusmanager works for this View-instance
            button.focus();
            e.buttonNode = button;
            e.target = model;
            e.type = EVT_SUBMIT_CLICK;
            syncOptions = instance.get('syncOptions');
            options = syncOptions.submit || {};
            e.promise = model.submitPromise(options);
            model.fire(EVT_SUBMIT_CLICK, e);
            if (actionAfterSubmit===1) {
                instance.hide();
            }
            if (actionAfterSubmit===2) {
                model.unplug('itsaeditmodel');
            }
        }
    },

    /**
     * returns the view-container, which equals this.get('contentBox')
     *
     * @method _getViewContainer
     * @private
    */
    _getViewContainer : function() {
        Y.log('_getViewContainer', 'info', 'Itsa-ViewModelPanel');
        return this.getStdModNode(Y.WidgetStdMod.BODY);
    },

    /**
     * Calls the original Y.Widget.renderer. Needs to be overridden, because now we need to go 2 levels up.
     *
     * @method _widgetRenderer
     * @private
     * @protected
    */
    _widgetRenderer : function() {
        var instance = this;

        Y.log('_widgetRenderer', 'info', 'Itsa-ViewModelPanel');
        instance.constructor.superclass.constructor.superclass.renderer.apply(instance);
    },

    /**
     * Default setter for zIndex attribute changes. Normalizes zIndex values to
     * numbers, converting non-numerical values to 1.
     *
     * @method _setZIndex
     * @protected
     * @param {String | Number} zIndex
     * @return {Number} Normalized zIndex
     */
    _setZIndex: function(zIndex) {
        Y.log('_setZIndex', 'info', 'Itsa-ViewModelPanel');
        if (typeof zIndex === 'string') {
            zIndex = parseInt(zIndex, 10);
        }
        if (typeof zIndex !== 'number') {
            zIndex = 1;
        }
        if (zIndex<1) {
            zIndex = 1;
        }
        return zIndex;
    },

    _uiSetXY : function(val) {
        Y.log('_uiSetXY', 'info', 'Itsa-ViewModelPanel');
        var instance = this;
        if (!instance.get('staticPosition')) {
            instance._posNode.setXY(val);
        }
    },

    // -- Public Properties ----------------------------------------------------

    /**
     * Collection of predefined buttons mapped from name => config.
     *
     * ITSAViewModelPanel includes "close", "add", "destroy", "reset", "save" and "submit" buttons which can be use by name.
     * When the close button is in the header (which is the default), it will look like: [x].
     *
     * See `addButton()` for a list of possible configuration values.
     *
     * @example
     *     // ITSAViewModelPanel with save-button in footer.
     *     var viewmodelpanel = new Y.ITSAViewModelPanel({
     *         buttons: ['save']
     *     });
     *
     *     // ITSAViewModelPanel with reset- and close-button in footer and 'save-button' in the header.
     *     var otherITSAViewModelPanel = new Y.ITSAViewModelPanel({
     *         buttons: {
     *             header: ['save']
     *             footer: ['reset', close']
     *         }
     *     });
     *
     * @property BUTTONS
     * @type Object
     * @default {close: {}}
     * @since 0.1
     *
    **/
    BUTTONS: {
        add: {
            label  : 'Add',
            action : '_addModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-add', FOCUSABLE]
        },
        close: {
            label  : 'Close',
            action : '_closeModel',
            section: 'header',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: getClassName('button', 'close')
        },
        destroy: {
            label  : 'Destroy',
            action : '_destroyModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-destroy', FOCUSABLE]
        },
        reset: {
            label  : 'Reset',
            action : '_resetModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-reset', FOCUSABLE]
        },
        save: {
            label  : 'Save',
            action : '_saveModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-save', FOCUSABLE]
        },
        submit: {
            label  : 'Submit',
            action : '_submitModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-submit', FOCUSABLE]
        }
    }
}, {
    ATTRS: {
        /**
         * Change Panel-appearance after save is clicked.<br />
         * 0 = no action<br />
         * 1 = close panel<br />
         * 2 = unplug Y.Plugin.ITSAEditModel, resulting in rendering the original template<br />
         * @attribute actionAfterSave
         * @type Int
         * @default 0
         * @since 0.1
        */
        actionAfterSave : {
            value: 0,
            validator: function(val) {
                return (typeof val === 'number') && (val>=0) && (val<=2);
            }
        },

        /**
         * Change Panel-appearance after submit is clicked.<br />
         * 0 = no action<br />
         * 1 = close panel<br />
         * 2 = unplug Y.Plugin.ITSAEditModel, resulting in rendering the original template<br />
         * @attribute actionAfterSubmit
         * @type Int
         * @default 0
         * @since 0.1
        */
        actionAfterSubmit : {
            value: 0,
            validator: function(val) {
                return (typeof val === 'number') && (val>=0) && (val<=2);
            }
        },

        /**
         * Defenitions of the buttons that are on the panel. The buttons you want to show should be passed as an [String],
         * where the names can be looked up into the property BUTTONS. Values to be used are:
         * "close", "add", "destroy", "reset", "save" and "submit" which can be use by name. You can also specify the section
         * where the buttons should be rendered, in case you want it different from the default.
         * @attribute buttons
         * @type [String]
         * @default ['close']
         * @example
         *     // ITSAViewModelPanel with save-button in footer.
         *     var viewmodelpanel = new Y.ITSAViewModelPanel({
         *         buttons: ['save']
         *     });
         *
         *     // ITSAViewModelPanel with reset- and close-button in footer and 'save-button' in the header.
         *     var otherITSAViewModelPanel = new Y.ITSAViewModelPanel({
         *         buttons: {
         *             header: ['save']
         *             footer: ['reset', close']
         *         }
         *     });
         * @since 0.1
        */
        buttons: {
            value: ['close']
        },

        /**
         * Makes the panel dragable. Only applyable when staticPosition=false.
         * Cautious: if you set dragable and don't have a header, then the panel gets dragable by its container. This will lead
         * text to be unselectable. If there is a header, then the panel is only dragable by its header and bodytext is selectable.
         * @attribute dragable
         * @type Boolean
         * @default false
         * @since 0.1
        */
        dragable : {
            value: false,
            validator: function(val) {
                return (typeof val === 'boolean');
            }
        },

        /**
         * Title to appear in the header
         * @attribute title
         * @type String
         * @default null
         * @since 0.1
        */
        title : {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (typeof val === 'string');
            },
            setter: function(val) {
                this.set('headerContent', val);
            }
        },

        /**
         * Title to appear in the footer
         * @attribute statusText
         * @type String
         * @default null
         * @since 0.1
        */
        statusText : {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (typeof val === 'string');
            },
            setter: function(val) {
                this.set('footerContent', val);
            }
        },

        /**
         * Specifies the Class of new created Models (that is, when a model:addclick event occurs).
         * @attribute newModelClass
         * @type Model
         * @default Y.Model
         * @since 0.1
        */
        newModelClass : {
            value: Y.Model
        },

        /**
         * Makes the panel to be static (and able to go inline) instead op foated. When static positioned, you cannot use
         * the methods provided by WidgetPosition, WidgetPositionAlign and WidgetPositionConstrain and you cannot set 'dragable'
         * @attribute staticPosition
         * @type Boolean
         * @default false
         * @since 0.1
        */
        staticPosition : {
            value: false,
            validator: function(val) {
                return (typeof val === 'boolean');
            }
        },

        /**
         * Object with the properties: <b>destroy</b>, <b>save</b> and <b>submit</b>. For every property you might want to
         * specify the options-object that will be passed through to the sync- or destroy-method. The destroymethod will
         * <i>always</i> be called with 'remove=true', in order to call the sync-method.
         * @attribute syncOptions
         * @type Object
         * @default {}
         * @since 0.1
        */
        syncOptions : {
            value: {},
            validator: function(val) {
                return Lang.isObject(val);
            }
        },

        /**
         * @attribute zIndex
         * @type number
         * @default 1
         * @description The z-index to apply to the Widgets boundingBox. Non-numerical values for
         * zIndex will be converted to 1. Minumum value = 1.
         */
        zIndex: {
            value : 1,
            setter: '_setZIndex'
        }

    }
});