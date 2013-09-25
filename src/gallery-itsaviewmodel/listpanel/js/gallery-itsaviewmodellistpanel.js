'use strict';

/**
 *
 * Widget ITSAViewModellistPanel
 *
 *
 * Has the same functionalities as ITSAViewModel, but will come inside a Panel (which floats by default).
 * Also has standard a 'close'-button. Using WidgetButtons functionalyties, more buttons can be added.
 *
 * These buttons are available by the module and will call Model's corresponding methods:
 *
 * close (visible by default)
 * add (for adding new Models to the list)
 *
 *
 * @class ITSAViewModellistPanel
 * @constructor
 * @extends ITSAViewModellist
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
    FORMELEMENT = 'yui3-itsaformelement',
    FOCUSABLE = 'focusable',
    /**
     * Fired when the 'closebutton' is pressed
     * @event closeclick
     * @param e {EventFacade} Event Facade including:
     * @param e.target {Y.ITSAViewModellistPanel} This instance
     * @since 0.1
    **/
    EVT_CLOSE_CLICK = 'closeclick',
    /**
     * Fired when the 'addbutton' is pressed
     * @event modellist:addclick
     * @param e {EventFacade} Event Facade including:
     * @param e.model {Y.Model} New model-instance
     * @param e.target {Y.ModelList} The modellist
     * @since 0.1
    **/
    EVT_ADD_CLICK = 'addclick';

Y.ITSAViewModellistPanel = Y.Base.create('itsaviewmodellistpanel', Y.ITSAViewModellist, [
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

        Y.log('initializer', 'info', 'Itsa-ViewModellistPanel');
        // declare bodyContent: this must be rendered.
        instance.set('bodyContent', '');
    },

   /**
     * Overruling _extraBindUI
     *
     * @method renderer
     * @private
    */
    _extraBindUI : function() {
        var instance = this,
            eventhandlers = instance._handlers,
            staticPosition = instance.get('staticPosition'),
            boundingBox = instance.get('boundingBox'),
            panelheader;

        Y.log('_extraBindUI', 'info', 'Itsa-ViewModellistPanel');
        instance.constructor.superclass._extraBindUI.call(instance);
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
        eventhandlers.push(
            instance.after(
                'staticPositionChange',
                function(e) {
                    var staticPosition = e.newVal;
                    boundingBox.toggleClass('itsa-staticposition', staticPosition);
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
    _addModel : function() {
        var instance = this,
            modellist = instance.get('modelList'),
            ModelClass, newModel, e;

        Y.log('_addModel', 'info', 'Itsa-ViewModellistPanel');
        if (modellist) {
            ModelClass = instance.model;
            newModel = new ModelClass();
            e = {
                model: newModel
            };
            modellist.add(newModel);
            modellist.fire(EVT_ADD_CLICK, e);
        }
    },

    /**
     * Function for the closebutton. Closes the panel the model and fires an event.
     *
     * @method _closeList
     * @private
     * @protected
    */
    _closeList : function() {
        var instance = this;

        Y.log('_closeList', 'info', 'Itsa-ViewModellistPanel');
        instance.hide();
        instance.fire(EVT_CLOSE_CLICK);
    },

    /**
     * returns the view-container, which equals this.get('contentBox')
     *
     * @method _getViewContainer
     * @private
    */
    _getViewContainer : function() {
        Y.log('_getViewContainer', 'info', 'Itsa-ViewModellistPanel');
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

        Y.log('_widgetRenderer', 'info', 'Itsa-ViewModellistPanel');
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
        Y.log('_setZIndex', 'info', 'Itsa-ViewModellistPanel');
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
        var instance = this;

        Y.log('_uiSetXY', 'info', 'Itsa-ViewModellistPanel');
        if (!instance.get('staticPosition')) {
            instance._posNode.setXY(val);
        }
    },
    // -- Public Properties ----------------------------------------------------

    /**
     * Collection of predefined buttons mapped from name => config.
     *
     * ITSAViewModelPanel includes a "close" and "add" button which can be use by name. When the close
     * button is in the header (which is the default), it will look like: [x].
     *
     * See `addButton()` for a list of possible configuration values.
     *
     * @example
     *     // ITSAViewModelPanel with close-button in header and add-button in the footer.
     *     var viewmodelpanel = new Y.ITSAViewModelPanel({
     *         buttons: ['add', 'close']
     *     });
     *
     *     // ITSAViewModelPanel with close-button in header and add-button in the footer.
     *     var otherITSAViewModelPanel = new Y.ITSAViewModelPanel({
     *         buttons: {
     *             header: ['add', close']
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
            section: 'header',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: [FORMELEMENT+'-add', FOCUSABLE]
        },
        close: {
            label  : 'Close',
            action : '_closeList',
            section: 'header',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: getClassName('button', 'close')
        }
    }
}, {
    ATTRS: {
        /**
         * Defenitions of the buttons that are on the panel. The buttons you want to show should be passed as an [String],
         * where the names can be looked up into the property BUTTONS. Values to be used are:
         * "close" and "add" which can be use by name. You can also specify the section
         * where the buttons should be rendered, in case you want it different from the default.
         * @attribute buttons
         * @type [String]
         * @default ['close']
         * @example
         *     // ITSAViewModelPanel with close-button in header and add-button in the footer.
         *     var viewmodelpanel = new Y.ITSAViewModelPanel({
         *         buttons: ['add', 'close']
         *     });
         *
         *     // ITSAViewModelPanel with close-button in header and add-button in the footer.
         *     var otherITSAViewModelPanel = new Y.ITSAViewModelPanel({
         *         buttons: {
         *             header: ['add', close']
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
         * @attribute title
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
