YUI.add('gallery-itsaviewmodel', function (Y, NAME) {

'use strict';

/**
 *
 * Widget ITSAViewModel
 *
 *
 * This widget renderes Y.Model-instances -or just plain objects- inside the widgets contentBox.
 * It uses Y.View under the hood, where Y.View.container is bound to the 'contentBox'. The render-method must be defined
 * by the widget's attribute 'template'. The Model (or object) must be set through the attribute 'model'.
 *
 * Events can be set through the attribute 'events' and follow the same pattern as Y.View does. As a matter of fact, all attributes
 * (template, model, events) are passed through to the widgets Y.View instance (which has the property 'view').
 *
 *
 * Using this widget is great to render Model on the page, where the widget keeps synced with the model. Whenever a new Model-instance
 * is attached to the widget, or another template is used, the wodget will be re-rendered automaticly.
 *
 * Attaching Y.Model-instances or objects?
 * Both can be attached. Whenever widgetattribute change, the widget will be re-rendered is needed (template- or model-attribute). This also
 * counts for attached objects. However, changes inside an object itself (updated property-value) cannot be caught by the widget, so you need
 * to call syncUI() yourself after an object-change. Y.Model-instances -on the other hand- do fire a *:change-event which is caught by the widget.
 * This makes the widget re-render after a Model-instance changes some of its attributes.
 *
 *
 * By default, the widget comes with its own style. You can disable this by setting the attribute 'styled' to false.
 *
 * @module gallery-itsaviewmodel
 * @extends Widget
 * @class ITSAViewModel
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var Lang = Y.Lang,
    YArray = Y.Array,
    YTemplateMicro = Y.Template.Micro,
    MODELVIEW_STYLED = 'itsa-modelview-styled',
    MODELVIEW_STYLED_FORM = 'yui3-form',
    FORMELEMENT_CLASS = 'yui3-itsaformelement',
    ITSAFORMELEMENT_CHANGED_CLASS = FORMELEMENT_CLASS + '-changed';


//===============================================================================================
//
// First: extend Y.Node with the method cleanup()
//
//===============================================================================================

function ITSANodeCleanup() {}

Y.mix(ITSANodeCleanup.prototype, {

    //
    // Destroys all widgets inside the node by calling widget.destroy(true);
    //
    // @method cleanup
    // @param destroyAllNodes {Boolean} If true, all nodes contained within the Widget are removed and destroyed.
    //                        Defaults to false due to potentially high run-time cost.
    // @since 0.1
    //
    //
    cleanupWidgets: function(destroyAllNodes) {
        var node = this,
            YWidget = Y.Widget;

        Y.log('cleanup', 'info', 'Itsa-NodeCleanup');
        if (YWidget) {
            node.all('.yui3-widget').each(
                function(widgetNode) {
                    if (node.one('#'+widgetNode.get('id'))) {
                        var widgetInstance = YWidget.getByNode(widgetNode);
                        if (widgetInstance) {
                            widgetInstance.destroy(destroyAllNodes);
                        }
                    }
                }
            );
        }
    },

    //
    // Cleansup the node by calling node.empty(), as well as destroying all widgets that lie
    // within the node by calling widget.destroy(true);
    //
    // @method cleanup
    // @since 0.1
    //
    //
    cleanup: function() {
        var node = this;

        Y.log('cleanup', 'info', 'Itsa-NodeCleanup');
        node.cleanupWidgets(true);
        node.empty();
    }

}, true);

Y.Node.ITSANodeCleanup = ITSANodeCleanup;

Y.Base.mix(Y.Node, [ITSANodeCleanup]);

//===============================================================================================
//
// Next we create the widget
//
//===============================================================================================

Y.ITSAViewModel = Y.Base.create('itsaviewmodel', Y.Widget, [], {

        /**
         * Internally generated Y.View-instance that has its 'container' bound to the 'contentBox'
         * @property view
         * @type Y.View
        */
        view : null,

        /**
         * Internal flag that tells wheter a Template.Micro is being used.
         * @property _isMicroTemplate
         * @private
         * @default null
         * @type Boolean
        */
        _isMicroTemplate : null,

        /**
         * Internal Function that is generated to automaticly make use of the template.
         * The function has the structure of: _modelRenderer = function(model) {return {String}};
         * @property _modelRenderer
         * @private
         * @default function(model) {return ''};
         * @type Function
        */
        _modelRenderer : null,

        /**
         * Internal list of all eventhandlers bound by this widget.
         * @property _eventhandlers
         * @private
         * @default []
         * @type Array
        */
        _eventhandlers : [],

        _initialEditAttrs : null,



        /**
         * @method initializer
         * @protected
        */
        initializer : function() {
            Y.log('initializer', 'info', 'Itsa-ViewModel');
        },

       /**
         * Overruled renderer-method, to make sure rendering is done after asynchronious initialisation.
         *
         * @method renderer
         * @protected
        */
        renderer : function() {
            var instance = this,
                boundingBox = instance.get('boundingBox'),
                model = instance.get('model'),
                modelEditable = instance.get('modelEditable'),
                itsaeditmodel = (modelEditable && model.itsaeditmodel);

            Y.log('renderer', 'info', 'Itsa-ViewModel');
            if (itsaeditmodel && !boundingBox.itsatabkeymanager) {
                Y.use('gallery-itsatabkeymanager', function(Y) {
                    boundingBox.plug(Y.Plugin.ITSATabKeyManager);
                    instance.renderFurther(boundingBox, model, itsaeditmodel);
                });
            }
            else {
                instance.renderFurther(boundingBox, model, itsaeditmodel);
            }
        },

        /**
         * @method renderFurther
         * @protected
        */
        renderFurther : function(boundingBox, model, itsaeditmodel) {
            var instance = this,
                contentBox = instance.get('contentBox'),
                events = instance.get('events'),
                template = itsaeditmodel ? model.itsaeditmodel.get('template') : instance.get('template'),
                styled = instance.get('styled'),
                view;

            Y.log('renderFurther', 'info', 'Itsa-ViewModel');
            if (styled) {
                boundingBox.addClass(MODELVIEW_STYLED).addClass(MODELVIEW_STYLED_FORM);
            }
            view = instance.view = new Y.View({
                container: contentBox,
                model: model
            });
            view.events = events;
            view.template = template;
            instance._setTemplateRenderer(template, itsaeditmodel);
            view.render = Y.rbind(instance._viewRenderer, instance);
            if (model && model.addTarget) {
                model.addTarget(view);
            }
            instance.constructor.superclass.renderer.apply(instance);
         },

        /**
         * Sets up DOM and CustomEvent listeners for the widget.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this,
                boundingBox = instance.get('boundingBox'),
                model = instance.get('model'),
                eventhandlers = instance._eventhandlers,
                itsatabkeymanager = boundingBox.itsatabkeymanager,
                view = instance.view;

            Y.log('bindUI', 'info', 'Itsa-ViewModel');
            eventhandlers.push(
                instance.after(
                    'modelChange',
                    function(e) {
                        var prevVal = e.prevVal,
                            newVal = e.newVal;
                        if (prevVal && prevVal.removeTarget) {
                            prevVal.removeTarget(view);
                        }
                        if (newVal && newVal.addTarget) {
                            newVal.addTarget(view);
                        }
                        view.set('model', newVal);
                        model = instance.get('model');
                        view.render();
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'model:templateChange',
                    function(e) {
                        var newTemplate = e.newVal,
                            modelEditable = instance.get('modelEditable');
                        if (!modelEditable || !model.itsaeditmodel) {
                            view.template = newTemplate;
                            instance._setTemplateRenderer(newTemplate, false);
                            view.render();
                        }
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'itsaeditmodel:templateChange',
                    function(e) {
                        var newTemplate = e.newVal,
                            modelEditable = instance.get('modelEditable');
                        if (modelEditable && model.itsaeditmodel) {
                            view.template = newTemplate;
                            instance._setTemplateRenderer(newTemplate, true);
                            view.render();
                        }
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'model:resetclick',
                    function(e) {
                        var model = e.target, // NOT e.currentTarget: that is the (scroll)View-instance (?)
                            options = {fromEditModel: true}; // set Attribute with option: '{fromEditModel: true}'
                                                             // --> now the view knows it must not re-render.
                        model.setAttrs(instance._initialEditAttrs, options);
                        view.render();
                        if (itsatabkeymanager) {
                            itsatabkeymanager.focusInitialItem();
                        }
                    }
                )
            );
            eventhandlers.push(
                instance.after(
                    'modelEditableChange',
                    function(e) {
                        var newEditable = e.newVal,
                            template;
                        // if model.itsaeditmodel exists, then we need to rerender
                        if (model.itsaeditmodel) {
                            template = newEditable ? model.itsaeditmodel.get('template') : instance.get('template');
                            view.template = template;
                            instance._setTemplateRenderer(template, newEditable);
                            view.render();
                        }
                    }
                )
            );
            eventhandlers.push(
                instance.after(
                    'itsaeditmodel:editmodelConfigAttrsChange',
                    function() {
                        if (model.itsaeditmodel && instance.get('modelEditable')) {
                            view.render();
                        }
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'itsaeditmodel:destroy',
                    function() {
                        if (instance.get('modelEditable')) {
                            var template = instance.get('template');
                            view.template = template;
                            instance._setTemplateRenderer(template, false);
                            view.render();
                        }
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'itsaeditmodel:pluggedin',
                    function() {
                        Y.use('gallery-itsatabkeymanager', function(Y) {
                            if (!boundingBox.itsatabkeymanager) {
                                boundingBox.plug(Y.Plugin.ITSATabKeyManager);
                            }
                            if (instance.get('modelEditable')) {
                                var template = model.itsaeditmodel.get('template');
                                view.template = template;
                                instance._setTemplateRenderer(template, true);
                                view.render();
                            }
                        });
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'itsaeditmodel:focusnext',
                    function() {
                        var itsatabkeymanager = boundingBox.itsatabkeymanager;
                        if (itsatabkeymanager && instance.get('focused')) {
                            Y.log('focus to next field', 'info', 'Itsa-ViewModel');
                            itsatabkeymanager.next();
                        }
                        else {
                            Y.log('No focus to next field: Y.Plugin.ITSATabKeyManager not plugged in', 'info', 'Itsa-ViewModel');
                        }
                    }
                )
            );
            eventhandlers.push(
                instance.after(
                    'eventsChange',
                    function(e) {
                        view.events = e.newVal;
                    }
                )
            );
            eventhandlers.push(
                instance.after(
                    'styledChange',
                    function(e) {
                        boundingBox.toggleClass(MODELVIEW_STYLED, e.newVal).toggleClass(MODELVIEW_STYLED_FORM, e.newVal);
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'model:change',
                    function() {
                        if (!instance.get('modelEditable') || !model.itsaeditmodel) {
                            view.render(false);
                        }
                        else {
                            view.get('container').all('.'+ITSAFORMELEMENT_CHANGED_CLASS).removeClass(ITSAFORMELEMENT_CHANGED_CLASS);
                        }
                    }
                )
            );
            eventhandlers.push(
                view.after(
                    'model:destroy',
                    function() {
                        view.render(true);
                    }
                )
            );
        },

        /**
         * Returns the Model as an object. Regardless whether it is a Model-instance, or an item of a LazyModelList
         * which might be an Object or a Model. Caution: If it is a Model-instance, than you get a Clone. If not
         * -in case of an object from a LazyModelList- than you get the reference to the original object.
         *
         * @method getModelToJSON
         * @param {Y.Model} model Model or Object
         * @return {Object} Object or model.toJSON()
         * @since 0.1
         *
        */
        getModelToJSON : function(model) {
            Y.log('getModelToJSON', 'info', 'Itsa-ViewModel');
            return (model.get && (Lang.type(model.get) === 'function')) ? model.toJSON() : model;
        },

        /**
         * Updates the widget-content by calling view.render();
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            this.view.render();
        },

        /**
         * Cleans up bindings
         * @method destructor
         * @protected
        */
        destructor: function() {
            var instance = this,
                boundingBox = instance.get('boundingBox');

            Y.log('destructor', 'info', 'Itsa-ViewModel');
            instance._clearEventhandlers();
            instance.view.destroy();
            if (boundingBox.hasPlugin('itsatabkeymanager')) {
                boundingBox.unplug('itsatabkeymanager');
            }
        },

        //===============================================================================================
        // private methods
        //===============================================================================================

        /**
         * Function-factory that binds a function to the property '_modelRenderer'. '_modelRenderer' will be defined like
         * _modelRenderer = function(model) {return {String}};
         * which means: it will return a rendered String that is modified by the attribute 'template'. The rendering
         * is done either by Y.Lang.sub or by Y.Template.Micro, depending on the value of 'template'.
         *
         * @method _viewRenderer
         * @param template {String} template to be rendered
         * @param editTemplate {Boolean} whether or not the template is an 'editTemplate' from Y.Plugin.ITSAEditModel
         * @private
         * @chainable
         * @since 0.1
         *
        */
        _setTemplateRenderer : function(template, editTemplate) {
            var instance = this,
                isMicroTemplate, ismicrotemplate, compiledModelEngine;

            Y.log('_clearEventhandlers', 'info', 'Itsa-ViewModel');
            isMicroTemplate = function() {
                var microTemplateRegExp = /<%(.+)%>/;
                return microTemplateRegExp.test(template);
            };
            ismicrotemplate = instance._isMicroTemplate = isMicroTemplate();
            if (ismicrotemplate) {
                compiledModelEngine = YTemplateMicro.compile(template);
                instance._modelRenderer = function(model) {
                    var jsondata = editTemplate ? model.itsaeditmodel.toJSON(model.itsaeditmodel.get('editmodelConfigAttrs'))
                                   : instance.getModelToJSON(model);
                    return compiledModelEngine(jsondata);
                };
            }
            else {
                instance._modelRenderer = function(model) {
                    var jsondata = editTemplate ? model.itsaeditmodel.toJSON(model.itsaeditmodel.get('editmodelConfigAttrs'))
                                   : instance.getModelToJSON(model);
                    return Lang.sub(template, jsondata);
                };
            }
        },

        /**
         * Method that is responsible for rendering the Model into the view.
         *
         * @method _viewRenderer
         * @param {Boolean} [clear] whether to clear the view. normally you don't want this: leaving empty means the Model is drawn.
         * @private
         * @chainable
         * @since 0.1
         *
        */
        _viewRenderer : function (clear) {
            var instance = this,
                boundingBox = instance.get('boundingBox'),
                itsatabkeymanager = boundingBox.itsatabkeymanager,
                view = instance.view,
                container = view.get('container'),
                model = view.get('model'),
                editMode = model.itsaeditmodel && instance.get('modelEditable'),
                itsaDateTimePicker = Y.Global.ItsaDateTimePicker,
                html = clear ? '' : instance._modelRenderer(model);

            Y.log('_viewRenderer', 'info', 'Itsa-ViewModel');
            // Render this view's HTML into the container element.
            // Because Y.Node.setHTML DOES NOT destroy its nodes (!) but only remove(), we destroy them ourselves first
            if (editMode || instance._isMicroTemplate) {
                if (editMode) {
                    instance._initialEditAttrs = model.getAttrs();
                }
                container.cleanupWidgets(true);
            }

            container.setHTML(html);
            // If Y.Plugin.ITSATabKeyManager is plugged in, then refocus to the first item
            if (itsatabkeymanager) {
                itsatabkeymanager.refresh(boundingBox);
                if (instance.get('focused')) {
                    itsatabkeymanager.focusInitialItem();
                }
            }
            if (itsaDateTimePicker && itsaDateTimePicker.panel.get('visible')) {
                itsaDateTimePicker.hide(true);
            }
            return instance;
        },

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
         *
        */
        _clearEventhandlers : function() {
            Y.log('_clearEventhandlers', 'info', 'Itsa-ViewModel');
            YArray.each(
                this._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        }

    }, {
        ATTRS : {
            /**
             * Hash of CSS selectors mapped to events to delegate to elements matching
             * those selectors.
             *
             * CSS selectors are relative to the `contentBox` element, which is in fact
             * the view-container. Events are attached to this container (contentBox), and
             * delegation is used so that subscribers are only notified of events that occur on
             * elements inside the container that match the specified selectors. This allows the
             * contentBox to be re-rendered as needed without losing event subscriptions.
             *
             * Event handlers can be specified either as functions or as strings that map
             * to function names. IN the latter case, you must declare the functions as part
             * of the 'view'-property (which is a Y.View instance).
             *
             * The `this` object in event handlers will refer to the 'view'-property (which is a
             * Y.View instance, created during initialisation of this widget. If you'd prefer `this`
             * to be something else, use `Y.bind()` to bind a custom `this` object.
             *
             * @example
             *     var viewModel = new Y.ViewITSAViewModel({
             *         events: {
             *             // Call `this.toggle()` whenever the element with the id
             *             // "toggle-button" is clicked.
             *             '#toggle-button': {click: 'toggle'},
             *
             *             // Call `this.hoverOn()` when the mouse moves over any element
             *             // with the "hoverable" class, and `this.hoverOff()` when the
             *             // mouse moves out of any element with the "hoverable" class.
             *             '.hoverable': {
             *                 mouseover: 'hoverOn',
             *                 mouseout : 'hoverOff'
             *             }
             *         }
             *     });
             *
             * @attribute events
             * @type {object}
             * @default {}
             * @since 0.1
             */
            events: {
                value: {},
                validator: function(v){ return Lang.isObject(v);}
            },

            /**
             * Makes the View to render the editable-version of the Model. Only when the Model has <b>Y.Plugin.ITSAEditModel</b> plugged in.
             *
             * @attribute modelEditable
             * @type {Boolean}
             * @default false
             * @since 0.1
             */
            modelEditable: {
                value: false,
                lazyAdd: false,
                validator: function(v){
                    return Lang.isBoolean(v);
                }
            },

            /**
             * The Y.Model that will be rendered in the view. May also be an Object, which is handy in case the source is an
             * item of a Y.LazyModelList
             *
             * @attribute model
             * @type {Y.Model|Object}
             * @default {}
             * @since 0.1
             */
            model: {
                value: null,
                validator: function(v){ return ((v instanceof Y.Model) || Lang.isObject(v) || (v===null)); }
            },

           /**
            * Whether the View is styled using the css of this module.
            * In fact, just the classname 'itsa-modelview-styled' is added to the boundingBox
            * and the css-rules do all the rest. The developer may override these rules, or set this value to false
            * while creatiung their own css. In the latter case it is advisable to take a look at all the css-rules
            * that are supplied by this module.
            *
            * @default true
            * @attribute styled
            * @type {Boolean}
            * @since 0.1
            */
            styled: {
                value: true,
                validator:  function(v) {
                    return Lang.isBoolean(v);
                }
            },

        /**
         * Template to render the Model. The attribute MUST be a template that can be processed by either <i>Y.Lang.sub or Y.Template.Micro</i>,
         * where Y.Lang.sub is more lightweight.
         *
         * <b>Example with Y.Lang.sub:</b> '{slices} slice(s) of {type} pie remaining. <button class="eat">Eat a Slice!</button>'
         * <b>Example with Y.Template.Micro:</b>
         * '<%= data.slices %> slice(s) of <%= data.type %> pie remaining <button class="eat">Eat a Slice!</button>'
         * <b>Example 2 with Y.Template.Micro:</b>
         * '<%= data.slices %> slice(s) of <%= data.type %> pie remaining<% if (data.slices>0) {%> <button class="eat">Eat a Slice!</button><% } %>'
         *
         * <u>If you set this attribute after the view is rendered, the view will be re-rendered.</u>
         *
         * @attribute template
         * @type {String}
         * @default '{clientId}'
         * @since 0.1
         */
            template: {
                value: '{clientId}',
                validator: function(v){ return Lang.isString(v); }
            }

        }
    }
);

}, 'gallery-2013.04.24-22-00', {
    "requires": [
        "base-build",
        "widget",
        "view",
        "template-micro",
        "model",
        "pluginhost-base"
    ],
    "skinnable": true
});
