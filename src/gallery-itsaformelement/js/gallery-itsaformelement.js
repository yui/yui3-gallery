'use strict';

/**
 * Class ITSAFormElement
 *
 * Basic Class that should not be used of its own: purely made for ITSAEditModel to use.
 *
 *
 * @module gallery-itsaformelement
 * @class ITSAFormElement
 * @extends Base
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var Lang  = Y.Lang,
    yDateFormat = Y.Date.format,
    ITSAFORMELEMENT_FOCUSABLE_CLASS = 'focusable',
    ITSAFORMELEMENT_CLASS = 'itsaformelement',
    yClassNameManagerGetClassName = Y.ClassNameManager.getClassName,
    ITSAFORMELEMENT_ELEMENT_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS),
    ITSAFORMELEMENT_VALIDATION_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'validation'),
    ITSAFORMELEMENT_HIDDEN_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'hidden'),
    ITSAFORMELEMENT_FIRSTFOCUS_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'firstfocus'),
    ITSAFORMELEMENT_SELECTONFOCUS_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'selectall'),
    ITSAFORMELEMENT_KEYVALIDATION_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'keyvalidation'),
    ITSAFORMELEMENT_ENTERNEXTFIELD_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'enternextfield'),
    ITSAFORMELEMENT_VALIDATION_MESSAGE_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'validationmessage'),
    ITSAFORMELEMENT_AUTOCORRECT_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'autocorrect'),
    ITSAFORMELEMENT_LIFECHANGE_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'lifechange'),
/*
    ITSAFORMELEMENT_LOADING_CHECKBOX_CLASS = 'yui3-enabled widget-loading',
    ITSAFORMELEMENT_LOADING_SELECTLIST_CLASS = 'yui3-enabled widget-loading',
    ITSAFORMELEMENT_LOADING_COMBO_CLASS = 'yui3-enabled widget-loading',
    ITSAFORMELEMENT_LOADING_RADIOGROUP_CLASS = 'yui3-enabled widget-loading',
*/
    ITSAFORMELEMENT_BUTTONTYPE_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'button'),
    ITSAFORMELEMENT_INLINEBUTTON_CLASS = yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'inlinebutton'),
    YUI3BUTTON_CLASS = 'yui3-button',
    ITSABUTTON_DATETIME_CLASS = 'itsa-button-datetime',
    ITSAFORMELEMENT_DATE_CLASS = 'itsa-datetimepicker-icondate',
    ITSAFORMELEMENT_TIME_CLASS = 'itsa-datetimepicker-icontime',
    ITSAFORMELEMENT_DATETIME_CLASS = 'itsa-datetimepicker-icondatetime',

    ELEMENT_UNDEFINED = '<span id="{id}">UNDEFINED ELEMENTTYPE</span>',
    ELEMENT_INPUT = '<input id="{id}" type="text" name="{name}" value="{value}"{classname}{placeholder} />',
    ELEMENT_PASSWORD = '<input id="{id}" type="password" name="{name}" value="{value}"{classname}{placeholder} />',
    ELEMENT_TEXTAREA = '<textarea id="{id}" name="{name}"{classname} />{value}</textarea>',
    ELEMENT_HIDDEN = '<input id="{id}" type="hidden" name="{name}" value="{value}"{classname} />',

    ELEMENT_BUTTON = '<button id="{id}" type="{type}" name="{name}"{classname}>{value}</button>',

    ELEMENT_VALIDATION = '<div class="'+ITSAFORMELEMENT_VALIDATION_MESSAGE_CLASS+' '+ITSAFORMELEMENT_HIDDEN_CLASS+'">{validation}</div>',

    ELEMENT_CHECKBOX = '<div id="{id}"{classname} /><input id="{id}_checkbox" type="checkbox" name="{name}" {checked}class="'+
                       ITSAFORMELEMENT_ELEMENT_CLASS + ' ' + ITSAFORMELEMENT_HIDDEN_CLASS+'" /></div>',
    ELEMENT_SELECTLIST = '<div id="{id}"{classname} /><select id="{id}_selectlist" name="{name}" class="'+ITSAFORMELEMENT_HIDDEN_CLASS+
                         ' ' + ITSAFORMELEMENT_ELEMENT_CLASS + '" /><option value="" selected="selected"></option></select></div>',
    ELEMENT_COMBO = '<div id="{id}"{classname} /><select id="{id}_combo" name="{name}" class="'+ITSAFORMELEMENT_HIDDEN_CLASS+
                    ' ' + ITSAFORMELEMENT_ELEMENT_CLASS + '" /><option value="" selected="selected"></option></select></div>',
    ELEMENT_RADIOGROUP = '<div id="{id}"{classname} /><input id="{id}_radiogroup" type="radio" name="{name}" value="" checked="checked" class="'+
                         ITSAFORMELEMENT_ELEMENT_CLASS + ' ' + ITSAFORMELEMENT_HIDDEN_CLASS+'" /></div>',
    ELEMENT_DATE = '<span id="{id}"{classname} />{value}</span><button id="{id}_datetime" class="'+YUI3BUTTON_CLASS+' '+ITSABUTTON_DATETIME_CLASS+
                   ' '+ITSAFORMELEMENT_INLINEBUTTON_CLASS+'{classlevel2}""><span class="'+ITSAFORMELEMENT_DATE_CLASS+'"></span></button>',
    ELEMENT_TIME = '<span id="{id}"{classname} />{value}</span><button id="{id}_datetime" class="'+YUI3BUTTON_CLASS+' '+ITSABUTTON_DATETIME_CLASS+
                   ' '+ITSAFORMELEMENT_INLINEBUTTON_CLASS+'{classlevel2}"><span class="'+ITSAFORMELEMENT_TIME_CLASS+'"></span></button>',
    ELEMENT_DATETIME = '<span id="{id}"{classname} />{value}</span><button id="{id}_datetime" class="'+YUI3BUTTON_CLASS+' '+
                       ITSABUTTON_DATETIME_CLASS+' '+ITSAFORMELEMENT_INLINEBUTTON_CLASS+'{classlevel2}"><span class="'+ITSAFORMELEMENT_DATETIME_CLASS+
                       '"></span></button>',

    ELEMENT_AUTOCOMPLETE = '<input id="{id}" type="text" name="{name}" value="{value}"{classname} />',
    ELEMENT_TOKENINPUT = '<input id="{id}" type="text" name="{name}" value="{value}"{classname} />',
    ELEMENT_TOKENAUTOCOMPLETE = '<input id="{id}" type="text" name="{name}" value="{value}"{classname} />';

Y.ITSAFormElement = Y.Base.create('itsaformelement', Y.Base, [], {

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
        */
        initializer : function() {
            Y.log('initializer', 'cmas', 'ITSAFORMELEMENT');
        },

        /**
         * Renderes a String that contains the completeFormElement definition.<br>
         * To be used in an external Form
         * @method render
         * @param config {Object} The config-attributes for the element which is passed through to the <b>Attributes</b> of the instance.
         * @param nodeId {String} The unique id of the node
         * @return {String} rendered Node which is NOT part of the DOM yet! Must be inserted into the DOM manually, or through Y.ITSAFORM
        */
        render : function(config, nodeId) {
            var instance = this,
                element, name, type, value, dateFormat, autoCorrection, validation, classnameAttr, classname, isDateOrTime,
                focusable, isButton, withLifeChange, classlevel2, focusinfoOnClass, focusinfo, enterNextField, placeholder, placeholdervalue;

            Y.log('renderElement', 'cmas', 'ITSAFORMELEMENT');
            if (typeof config === 'object') {
                instance.setAttrs(config);
            }
            name = instance.get('name');
            type = instance.get('type');
            value = instance.get('value');
            dateFormat = instance.get('dateFormat');
            autoCorrection = instance.get('autoCorrection');
            validation = !autoCorrection && instance.get('validation');
            enterNextField = (type==='input') || (type==='password');
            isDateOrTime = (type==='date') || (type==='time') || (type==='datetime');
            isButton = (type==='button') || (type==='submit') || (type==='reset') || (type==='save') ||
                       (type==='add') || (type==='destroy') || (type==='stopedit');
            focusable = instance.get('focusable');
            focusinfoOnClass = ((type==='input') || (type==='textarea') || (type==='password') || isButton);
            focusinfo = focusable ?
                        (
                            ITSAFORMELEMENT_FOCUSABLE_CLASS +
                            (instance.get('initialFocus') ? ' '+ITSAFORMELEMENT_FIRSTFOCUS_CLASS : '') +
                            (instance.get('selectOnFocus') ? ' '+ITSAFORMELEMENT_SELECTONFOCUS_CLASS : '')
                        )
                        : '';
            withLifeChange = (type==='input') || (type==='textarea') || (type==='password');
            classnameAttr = instance.get('className');
            classname = ' class="' + ITSAFORMELEMENT_ELEMENT_CLASS + ' ' + yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, 'property', name) +
                        ' ' + yClassNameManagerGetClassName(ITSAFORMELEMENT_CLASS, type) +
                        (classnameAttr ? ' '+classnameAttr : '') +
                        (enterNextField ? ' '+ITSAFORMELEMENT_ENTERNEXTFIELD_CLASS : '') +
                        (isButton ? ' '+YUI3BUTTON_CLASS+' '+ITSAFORMELEMENT_BUTTONTYPE_CLASS : '') +
                        (withLifeChange ? ' '+ITSAFORMELEMENT_LIFECHANGE_CLASS : '') +
                        (instance.get('keyValidation') ? ' '+ITSAFORMELEMENT_KEYVALIDATION_CLASS : '') +
                        (validation ? ' '+ITSAFORMELEMENT_VALIDATION_CLASS : '') +
                        (autoCorrection ? ' '+ITSAFORMELEMENT_AUTOCORRECT_CLASS : '') +
                        (focusinfoOnClass ? ' '+focusinfo : '') +
                        '"';
            classlevel2 = focusinfoOnClass ? '' : ' '+focusinfo;
            if (type==='input') {
                element = ELEMENT_INPUT;
                if (validation) {
                    element += ELEMENT_VALIDATION;
                }
                placeholdervalue = instance.get('placeholder');
                placeholder = placeholdervalue ? ' placeholder="'+  placeholdervalue+'"' : '';
            }
            else if (type==='password') {
                element = ELEMENT_PASSWORD;
                if (validation) {
                    element += ELEMENT_VALIDATION;
                }
                placeholdervalue = instance.get('placeholder');
                placeholder = placeholdervalue ? ' placeholder="'+  placeholdervalue+'"' : '';
            }
            else if (type==='textarea') {
                element = ELEMENT_TEXTAREA;
                if (validation) {
                    element += ELEMENT_VALIDATION;
                }
            }
            else if (isButton) {
                type = 'button';
                element = ELEMENT_BUTTON;
            }
            else if (type==='checkbox') {
                element = ELEMENT_CHECKBOX;
            }
            else if (type==='radiogroup') {
                element = ELEMENT_RADIOGROUP;
            }
            else if (type==='selectlist') {
                element = ELEMENT_SELECTLIST;
            }
            else if (type==='combo') {
                element = ELEMENT_COMBO;
            }
            else if (type==='date') {
                element = ELEMENT_DATE;
                dateFormat = dateFormat || '%x';
            }
            else if (type==='time') {
                element = ELEMENT_TIME;
                dateFormat = dateFormat || '%X';
            }
            else if (type==='datetime') {
                element = ELEMENT_DATETIME;
                dateFormat = dateFormat || '%x %X';
            }
            else if (type==='autocomplete') {
                element = ELEMENT_AUTOCOMPLETE;
            }
            else if (type==='tokeninput') {
                element = ELEMENT_TOKENINPUT;
            }
            else if (type==='tokenautocomplete') {
                element = ELEMENT_TOKENAUTOCOMPLETE;
            }
            else if (type==='hidden') {
                element = ELEMENT_HIDDEN;
            }
            else {
                element = ELEMENT_UNDEFINED;
            }
            if (isDateOrTime) {
                value = yDateFormat(value, {format: dateFormat});
                // asynchronious preloading the module
                Y.use('gallery-itsadatetimepicker');
            }
            return Lang.sub(
                            element,
                            {
                                id: nodeId,
                                name: name,
                                value: value,
                                placeholder: placeholder,
                                classname: classname,
                                classlevel2: classlevel2,
                                type: type,
                                validation: instance.get('validationMessage')
                            }
            );
        },

        /**
         * Hides the validationmessage
         * @method hideValidation
         * @param nodeId {String} Node's id
        */
        hideValidation : function(nodeId) {
            Y.log('hideValidation', 'cmas', 'ITSAFORMELEMENT');
            var elementNode = Y.one('#' + nodeId);
            if (elementNode) {
                elementNode.get('parentNode').one('.'+ITSAFORMELEMENT_VALIDATION_MESSAGE_CLASS).toggleClass(ITSAFORMELEMENT_HIDDEN_CLASS, true);
            }
        },

        /**
         * Shows the validationmessage
         * @method showValidation
         * @param nodeId {String} Node's id
        */
        showValidation : function(nodeId) {
            Y.log('showValidation', 'cmas', 'ITSAFORMELEMENT');
            var elementNode = Y.one('#' + nodeId);
            if (elementNode) {
                elementNode.get('parentNode').one('.'+ITSAFORMELEMENT_VALIDATION_MESSAGE_CLASS).toggleClass(ITSAFORMELEMENT_HIDDEN_CLASS, false);
            }
        },

        /**
         * Cleans up bindings
         * @method destructor
         * @protected
        */
        destructor : function() {
            Y.log('destructor', 'cmas', 'ITSAFORMELEMENT');
        }

    }, {
        ATTRS : {
            /**
             * @description The name of the element. You always need to set this attribute. It is used by the template to render.
             * @attribute name
             * @type String
             * @default 'undefined-name'
             * @since 0.1
            */
            name : {
                value: 'undefined-name',
                validator: function(val) {
                    return (typeof val === 'string');
                }
            },
            /**
             * @description Whether the element is focusable
             * @attribute focusable
             * @type Boolean
             * @default true
             * @since 0.1
            */
            focusable : {
                value: true,
                validator: function(val) {
                    return (typeof val === 'boolean');
                }
            },
            /**
             * @description Must have one of the following values:
             * <ul><li>input</li><li>password</li><li>textarea</li><li>checkbox</li><li>radiogroup</li><li>selectbox</li><li>hidden</li></ul>
             * @attribute type
             * @type String
             * @default ''
             * @since 0.1
            */
            type : {
                value: '',
                setter: function(val) {
                    if (Lang.isString(val)) {val=val.toLowerCase();}
                    return val;
                },
                validator: function(val) {
                    return ((typeof val === 'string') &&
                            ((val==='input') ||
                             (val==='password') ||
                             (val==='textarea') ||
//                             (val==='checkbox') ||  // not ready yet
//                             (val==='radiogroup') ||  // not ready yet
//                             (val==='selectlist') ||  // not ready yet
//                             (val==='combo') ||  // not ready yet
                             (val==='date') ||
                             (val==='time') ||
                             (val==='datetime') ||

                             (val==='button') ||
                             (val==='reset') ||
                             (val==='submit') ||
                             (val==='save') ||
                             (val==='add') ||
                             (val==='destroy') ||
                             (val==='stopedit') ||
//                             (val==='autocomplete') ||  // not ready yet
//                             (val==='tokeninput') ||  // not ready yet
//                             (val==='tokenautocomplete') ||  // not ready yet
                             (val==='hidden')
                            )
                    );
                }
            },
            /**
             * @description The value of the element
             * @attribute value
             * @type String | Boolean | Array(String)
             * @default ''
             * @since 0.1
            */
            value : {
                value: ''
            },
            /**
             * @description Placeholder for text- and password-elements
             * @attribute placeholder
             * @type String
             * @default null
             * @since 0.1
            */
            placeholder : {
                value: null,
                validator: function(val) {
                    return (typeof val === 'string');
                }
            },
            /**
             * @description Validation during every keypress. The function that is passed will receive the keyevent, that can thus be prevented.<br>
             * Only has effect if the masterform knows how to use it through delegation: therefore it adds
             * the className 'itsa-formelement-keyvalidation'
             * The function MUST return true or false.
             * @attribute keyValidation
             * @type Function
             * @default null
             * @since 0.1
            */
            keyValidation : {
                value: null,
                validator: function(val) {
                    return (typeof val === 'function');
                }
            },
            /**
             * @description Validation after changing the value (onblur). The function should return true or false.
             * In case of false, the validationerror is thrown.<br>
             * Only has effect if the masterform knows how to use it through delegation: therefore it adds
             * the className 'itsa-formelement-validation'.
             * The function MUST return true or false.
             * Either use validation, or autocorrection.
             * @attribute validation
             * @type Function
             * @default null
             * @since 0.1
            */
            validation : {
                value: null,
                validator: function(val) {
                    return (typeof val === 'function');
                }
            },
            /**
             * @description The message that will be returned on a validationerror, this will be set within e.message.
             * @attribute validationMessage
             * @type String
             * @default ''
             * @since 0.1
            */
            validationMessage : {
                value: '',
                validator: function(val) {
                    return (typeof val === 'string');
                }
            },
            /**
             * @description If set, inputvalue will be replaced by the returnvalue of this function. <br>
             * Only has effect if the masterform knows how to use it through delegation: therefore it adds
             * the className 'itsa-formelement-autocorrect'.
             * The function MUST return a valid type for the given element.
             * Either use validation, or autocorrection.
             * @attribute autocorrection
             * @type Function
             * @return Boolean
             * @default null
             * @since 0.1
            */
            autoCorrection : {
                value: null,
                validator: function(val) {
                    return (typeof val === 'function');
                }
            },
            /**
             * @description Additional className that is passed on the value, during rendering.<br>
             * Only applies to rendering in tableform render(true).
             * @attribute className
             * @type String|null
             * @default null
             * @since 0.1
            */
            className : {
                value: null,
                validator: function(val) {
                    return ((val === null) || (typeof val === 'string'));
                }
            },
            /**
             * @description To format the value<br>
             * Only applies for Date-types (attribute type).
             * @attribute dateFormat
             * @type String|null
             * @default null
             * @since 0.1
            */
            dateFormat : {
                value: null,
                validator: function(val) {
                    return ((val === null) || (typeof val === 'string'));
                }
            },
            /**
             * @description Determines whether this element should have the initial focus.<br>
             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-firstfocus' is added).
             * @attribute initialFocus
             * @type Boolean
             * @default false
             * @since 0.1
            */
            initialFocus : {
                value: false,
                validator: function(val) {
                    return (typeof val === 'boolean');
                }
            },
            /**
             * @description Determines whether this element should completely be selected when it gets focus.<br>
             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-selectall' is added).
             * @attribute selectOnFocus
             * @type Boolean
             * @default false
             * @since 0.1
            */
            selectOnFocus : {
                value: false,
                validator: function(val) {
                    return (typeof val === 'boolean');
                }
            },
            /**
             * @description config that will be added to the underlying widget (in case of Date/Time values)
             * @attribute widgetConfig
             * @type Object
             * @default {}
             * @since 0.1
             */
            widgetConfig : {
                value: {},
                validator: function(val) {
                    return (typeof val === 'boolean');
                }
            }
        }
    }
);