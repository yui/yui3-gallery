/**
 * Create a form object that can handle both client and server side validation
 *
 * @module form
 */


/**
 * Creates an form which contains fields, and does clientside validation, as well
 * as handling input from the server.
 *
 * @class Form
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */

Y.Form = Y.Base.create('form', Y.Widget, [Y.WidgetParent], {
    toString: function() {
        return this.name;
    },

    CONTENT_TEMPLATE: '<form></form>',

    /**
     * @property _ioIds
     * @type Object
     * @protected
     * @description An object who's keys represent the IO request ids sent by this Y.Form instance
     */
    _ioIds: null,

    /**
     * @method _validateAction
     * @private
     * @param {String} val
     * @description Validates the values of the 'action' attribute
     */
    _validateMethod: function(val) {
        if (!Y.Lang.isString(val)) {
            return false;
        }
        if (val.toLowerCase() != 'get' && val.toLowerCase() != 'post') {
            return false;
        }
        return true;
    },

    /**
     * @method _parseAction
     * @private
     * @param {Y.Node} contentBox
     * @description Sets the 'action' attribute based on parsed HTML
     */
    _parseAction: function(contentBox) {
        var form = contentBox.one('form');
        if (!form) {
            form = contentBox;
        }
        if (form) {
            return form.get('action');
        }
    },

    /**
     * @method _parseMethod
     * @private
     * @param {Y.Node} contentBox
     * @description Sets the 'method' attribute based on parsed HTML
     */
    _parseMethod: function(contentBox) {
        var form = contentBox.one('form');
        if (!form) {
            form = contentBox;
        }
        if (form) {
            return form.get('method');
        }
    },

    /**
     * @method _parseFields
     * @private
     * @param {Y.Node} contentBox
     * @description Sets the 'fields' attribute based on parsed HTML
     */
    _parseFields: function(contentBox) {
        var children = contentBox.all('*'),
        labels = contentBox.all('label'),
        fields = [],
        inputMap = {
            text: Y.TextField,
            hidden: Y.HiddenField,
            file: Y.FileField,
            checkbox: Y.CheckboxField,
            radio: Y.RadioField,
            reset: Y.ResetButton,
            submit: Y.SubmitButton,
            button: (Y.Button || Y.FormButton)
        };

        children.each(function(node, index, nodeList) {
            var nodeName = node.get('nodeName'),
            nodeId = node.get('id'),
            type,
            o,
            c = [];
            if (nodeName == 'INPUT') {
                type = node.get('type');
                o = {
                    type: (inputMap[type] ? inputMap[type] : Y.TextField),
                    name: node.get('name'),
                    value: node.get('value'),
                    checked: node.get('checked')
                };

                if (o.type == inputMap.button) {
                    o.label = node.get('value');
                }
            } else if (nodeName == 'BUTTON') {
                o = {
                    type: inputMap.button,
                    name: node.get('name'),
                    label: node.get('innerHTML')
                };
            } else if (nodeName == 'SELECT') {
                node.all('option').each(function(optNode, optNodeIndex, optNodeList) {
                    c.push({
                        label: optNode.get('innerHTML'),
                        value: optNode.get('value')
                    });
                });
                o = {
                    type: Y.SelectField,
                    name: node.get('name'),
                    choices: c
                };
            } else if (nodeName == 'TEXTAREA') {
                o = {
                    type: Y.TextareaField,
                    name: node.get('name'),
                    value: node.get('innerHTML')
                };
            }

            if (o) {
                if (nodeId) {
                    o.id = nodeId;
                    labels.some(function(labelNode, labelNodeIndex, labelNodeList) {
                        if (labelNode.get('htmlFor') == nodeId) {
                            o.label = labelNode.get('innerHTML');
                        }
                    });
                }
                fields.push(o);
            }
            node.remove();
        });

        return fields;
    },

    /**
     * @method _syncFormAttributes
     * @protected
     * @description Syncs the form node action and method attributes
     */
    _syncFormAttributes: function() {
        var contentBox = this.get('contentBox');
        contentBox.setAttrs({
            action: this.get('action'),
            method: this.get('method')
        });

        if (this.get('encodingType') === Y.Form.MULTIPART_ENCODED) {
            contentBox.setAttribute('enctype', 'multipart/form-data');
        }
    },

    /**
     * @method _runValidation
     * @protected
     * @description Validates the form based on each field's validator
     */
    _runValidation: function() {
        var isValid = true;

        this.each(function(f) {
            if (f.validateField() === false) {
                isValid = false;
            }
        });

        return isValid;
    },

    _enableInlineValidation: function() {
        this.each(function(f) {
            f.set('validateInline', true);
        });
    },

    _disableInlineValidation: function() {
        this.each(function(f) {
            f.set('validateInline', false);
        });
    },

    /**
     * @method _handleIOEvent
     * @protected
     * @param {String} eventName
     * @param {Number} ioId
     * @param {Object} ioResponse
     * @description Handles the IO events of transactions instantiated by this instance
     */
    _handleIOEvent: function(eventName, ioId, ioResponse) {
        if (this._ioIds[ioId] !== undefined) {
            this.fire(eventName, {
                response: ioResponse
            });
        }
    },

    /**
     * @method reset
     * @description Resets all form fields to their initial value 
     */
    reset: function() {
        var cb = Y.Node.getDOMNode(this.get('contentBox'));
        if (Y.Lang.isFunction(cb.reset)) {
            cb.reset();
        }
        this.each(function(field) {
            field.resetFieldNode();
            field.set('error', null);
        });
    },

    /**
     * @method submit
     * @description Submits the form using the defined method to the URL defined in the action
     */
    submit: function() {
        if (this.get('skipValidationBeforeSubmit') === true || this._runValidation()) {
            var formAction = this.get('action'),
            formMethod = this.get('method'),
            submitViaIO = this.get('submitViaIO'),
            io = this.get("io"),
            ioConfig = this.get('ioConfig') || {},
            transaction,
            cfg;

            if (submitViaIO === true) {
                cfg = Y.merge({
                    method: formMethod,
                    form: {
                        id: this.get('contentBox'),
                        upload: (this.get('encodingType') === Y.Form.MULTIPART_ENCODED)
                    }
                }, ioConfig);

                transaction = io(formAction, cfg);
                this._ioIds[transaction.id] = transaction;
            } else {
                this.get('contentBox').submit();
            }
        }
    },

    /**
     * @method getField
     * @param {String|Number} selector
     * @description Get a form field by its name attribute or numerical index
     */
    getField: function(selector) {
        var sel;

        if (Y.Lang.isNumber(selector)) {
            sel = this.item(selector);
        } else if (Y.Lang.isString(selector)) {
            this.each(function(f) {
                if (f.get('name') == selector) {
                    sel = f;
                }
            });
        }
        return sel;
    },

    /**
     * @method toJSON
     * @description Returns a JSON object representing the values of
     *              the form fields
     */
    toJSON : function () {
        var data = {}; 
        this.each(function (f) {
            data[f.get('name')] = (f instanceof Y.CheckboxField) ? f.get('checked') : f.get('value');
        }); 

        return data;
    },   

    initializer: function(config) {
        this._ioIds = {};

        this.publish('submit');
        this.publish('reset');
        this.publish('start');
        this.publish('success');
        this.publish('failure');
        this.publish('complete');
        this.publish('xdr');
    },

    destructor: function() {
        },

    renderUI: function() {
        },

    bindUI: function() {
        this.get('contentBox').on('submit', Y.bind(function(e) {
            e.halt();
        },
        this));

        this.after('inlineValidationChange', Y.bind(function(e) {
            if (e.newVal === true) {
                this._enableInlineValidation();
            } else {
                this._disableInlineValidation();
            }
        },
        this));

        this.after('success', Y.bind(function(e) {
            if (this.get('resetAfterSubmit') === true) {
                this.reset();
            }
        },
        this));

        Y.on('io:start', Y.bind(this._handleIOEvent, this, 'start'));
        Y.on('io:complete', Y.bind(this._handleIOEvent, this, 'complete'));
        Y.on('io:xdr', Y.bind(this._handleIOEvent, this, 'xdr'));
        Y.on('io:success', Y.bind(this._handleIOEvent, this, 'success'));
        Y.on('io:failure', Y.bind(this._handleIOEvent, this, 'failure'));

        this.each(Y.bind(function(f) {
            // This should probably be performed also when children
            // are with Form.add() after the form is rendered.
            if (f.name == 'submit-button') {
                f.on('click', Y.bind(this.submit, this));
            } else if (f.name == 'reset-button') {
                f.on('click', Y.bind(this.reset, this));
            }
        },
        this));
    },

    syncUI: function() {
        this._syncFormAttributes();
        if (this.get('inlineValidation') === true) {
            this._enableInlineValidation();
        }
    }
},
{

    /**
     * @property Form.ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        defaultChildType: {
            valueFn: function() {
                return Y.TextField;
            }
        },

        /**
         * @attribute method
         * @type String
         * @default 'post'
         * @description The method by which the form should be transmitted. Valid values are 'get' and 'post'
         */
        method: {
            value: 'post',
            validator: function(val) {
                return this._validateMethod(val);
            },
            setter: function(val) {
                return val.toLowerCase();
            }
        },

        /**
         * @attribute action
         * @type String
         * @default '.'
         * @description A url to which the validated form is to be sent
         */
        action: {
            value: '.',
            validator: Y.Lang.isString
        },

        /**
         * @attribute fields
         * @type Array
         * @deprecated Use "children" attribet instead
         * @description An array of the fields to be rendered into the Y.Form. Each item in the 
         *              array can either be a FormField instance or an object literal defining
         *              the properties of the field to be generated. Alternatively, this value
         *              will be parsed in from HTML
         */
        fields: {
            setter: function(val) {
                return this.set('children', val);
            }
        },

        /**
         * @attribute inlineValidation
         * @type Boolean
         * @description Set to true to validate fields "on the fly", where they will
         *                              validate themselves any time the value attribute is changed
         * @default false
         */
        inlineValidation: {
            value: false,
            validator: Y.Lang.isBoolean
        },

        /**
         * @attribute resetAfterSubmit
         * @type Boolean
         * @description If true, the form is reset following a successful submit event 
         * @default true
         */
        resetAfterSubmit: {
            value: true,
            validator: Y.Lang.isBoolean
        },

        /**
         * @attribute encodingType
         * @type Number
         * @description Set to Form.MULTIPART_ENCODED in order to use the FileField for uploads
         * @default Form.URL_ENCODED
         */
        encodingType: {
            value: 1,
            validator: Y.Lang.isNumber
        },

        /**
         * @attribute skipValidationBeforeSubmit
         * @type Boolean
         * @description Set to true to skip the validation step when submitting
         * @default false
         */
        skipValidationBeforeSubmit: {
            value: false,
            validator: Y.Lang.isBoolean
        },

        submitViaIO: {
            value: true,
            validator: Y.Lang.isBoolean
        },

        /**
         * @attribute io
         * @type Function
         * @description The factory for creating IO transactions, used by tests.
         * @default Y.io
         */
        io: {
            value: Y.io
        },

        ioConfig : {
        }

    },

    /**
     * @property Form.HTML_PARSER
     * @type Object
     * @static
     */
    HTML_PARSER: {
        action: function(contentBox) {
            return this._parseAction(contentBox);
        },
        method: function(contentBox) {
            return this._parseMethod(contentBox);
        },
        children: function(contentBox) {
            return this._parseFields(contentBox);
        }
    },

    /**
     * @property Form.FORM_TEMPLATE
     * @type String
     * @static
     * @description The HTML used to create the form Node
     */
    FORM_TEMPLATE: '<form></form>',

    /**
     * @property Form.URL_ENCODED
     * @type Number
     * @description Set the form the default text encoding
     */
    URL_ENCODED: 1,

    /**
     * @property Form.MULTIPART_ENCODED
     * @type Number
     * @description Set form to multipart/form-data encoding for file uploads
     */
    MULTIPART_ENCODED: 2
});
