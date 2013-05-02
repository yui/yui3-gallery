var getClassName = Y.ClassNameManager.getClassName,
    FORMELEMENT = 'yui3-itsaformelement',
    FOCUSABLE = 'focusable',
    EVT_SUBMIT_CLICK = 'submitclick',
    EVT_SAVE_CLICK = 'saveclick',
    EVT_RESET_CLICK = 'resetclick',
    EVT_ADD_CLICK = 'addclick',
    EVT_DESTROY_CLICK = 'destroyclick';

// TODO: Change this description!
/**
A basic Panel Widget, which can be positioned based on Page XY co-ordinates and
is stackable (z-index support). It also provides alignment and centering support
and uses a standard module format for it's content, with header, body and footer
section support. It can be made modal, and has functionality to hide and focus
on different events. The header and footer sections can be modified to allow for
button support.

@class ITSAViewModelPanel
@constructor
@extends ITSAViewModel
@uses WidgetAutohide
@uses WidgetButtons
@uses WidgetModality
@uses WidgetPosition
@uses WidgetPositionAlign
@uses WidgetPositionConstrain
@uses WidgetStack
@uses WidgetStdMod
@since 0.1
 */
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
            view = instance.view;

        Y.log('_bindViewUI', 'info', 'Itsa-ViewModelPanel');
        instance.constructor.superclass._bindViewUI.apply(instance);
        eventhandlers.push(
            view.after(
                'model:destroy',
                function() {
                    instance.hide();
                }
            )
        );
    },

    /**
     * Calls the original Y.Widget.renderer. Needs to be overridden, because now we need to go 2 levels up.
     *
     * @method _widgetRenderer
     * @private
     * @protected
    */
    addModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            itsaeditmodel = model && model.itsaeditmodel,
            ModelClass, modelAttrs, currentConfig, newModel;

        Y.log('addModel', 'info', 'Itsa-ViewModelPanel');
        if (itsaeditmodel) {
            e.buttonNode = e.target;
            e.target = model;
            e.type = EVT_ADD_CLICK;
            ModelClass = itsaeditmodel.get('newModelClass');
            modelAttrs = Y.clone(itsaeditmodel.get('newModelDefinition'));
            newModel = new ModelClass(modelAttrs);
            currentConfig = Y.clone(itsaeditmodel.getAttrs());
            Y.use('gallery-itsaeditmodel', function(Y) {
                newModel.plug(Y.Plugin.ITSAEditModel, currentConfig);
                e.newModel = newModel;
                model.fire(EVT_ADD_CLICK, e);

            });
        }
    },

    /**
     * Calls the original Y.Widget.renderer. Needs to be overridden, because now we need to go 2 levels up.
     *
     * @method destroyModel
     * @private
     * @protected
    */
    destroyModel : function(e) {
        var instance = this,
            model = instance.get('model');

        Y.log('destroyModel', 'info', 'Itsa-ViewModelPanel');
        if (model) {
            e.buttonNode = e.target;
            e.target = model;
            e.type = EVT_DESTROY_CLICK;
            model.fire(EVT_DESTROY_CLICK, e);
        }
    },

    /**
     * Calls the original Y.Widget.renderer. Needs to be overridden, because now we need to go 2 levels up.
     *
     * @method resetModel
     * @private
     * @protected
    */
    resetModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            itsaeditmodel = model && model.itsaeditmodel;

        Y.log('resetModel', 'info', 'Itsa-ViewModelPanel');
        if (itsaeditmodel) {
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
     * Calls the original Y.Widget.renderer. Needs to be overridden, because now we need to go 2 levels up.
     *
     * @method saveModel
     * @private
     * @protected
    */
    saveModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            itsaeditmodel = model && model.itsaeditmodel;

        Y.log('saveModel', 'info', 'Itsa-ViewModelPanel');
        if (itsaeditmodel) {
            button = e.target,
            // set the focus manually. This will cause the View to be focussed as well --> now the focusmanager works for this View-instance
            button.focus();
            e.buttonNode = button;
            e.target = model;
            e.type = EVT_SAVE_CLICK;
            model.fire(EVT_SAVE_CLICK, e);
        }
    },

    /**
     * Calls the original Y.Widget.renderer. Needs to be overridden, because now we need to go 2 levels up.
     *
     * @method submitModel
     * @private
     * @protected
    */
    submitModel : function(e) {
        var instance = this,
            model = instance.get('model'),
            itsaeditmodel = model && model.itsaeditmodel;

        Y.log('submitModel', 'info', 'Itsa-ViewModelPanel');
        if (itsaeditmodel) {
            button = e.target,
            // set the focus manually. This will cause the View to be focussed as well --> now the focusmanager works for this View-instance
            button.focus();
            e.buttonNode = button;
            e.target = model;
            e.type = EVT_SUBMIT_CLICK;
            model.fire(EVT_SUBMIT_CLICK, e);
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
        var instance = this;
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

    // -- Public Properties ----------------------------------------------------

    /**
     * Collection of predefined buttons mapped from name => config.
     *
     * Panel includes a "close" button which can be use by name. When the close
     * button is in the header (which is the default), it will look like: [x].
     *
     * See `addButton()` for a list of possible configuration values.
     *
     * @example
     *     // Panel with close button in header.
     *     var panel = new Y.Panel({
     *         buttons: ['close']
     *     });
     *
     *     // Panel with close button in footer.
     *     var otherPanel = new Y.Panel({
     *         buttons: {
     *             footer: ['close']
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
            action : 'addModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-add', FOCUSABLE]
        },
        close: {
            label  : 'Close',
            action : 'hide',
            section: 'header',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: getClassName('button', 'close')
        },
        destroy: {
            label  : 'Destroy',
            action : 'destroyModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-destroy', FOCUSABLE]
        },
        reset: {
            label  : 'Reset',
            action : 'resetModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-reset', FOCUSABLE]
        },
        save: {
            label  : 'Save',
            action : 'saveModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-save', FOCUSABLE]
        },
        submit: {
            label  : 'Submit',
            action : 'submitModel',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-submit', FOCUSABLE]
        }
    }
}, {
    ATTRS: {
        // TODO: API Docs.
        buttons: {
            value: ['close', 'reset', 'destroy', 'submit', 'save', 'add']
        }
    }
});