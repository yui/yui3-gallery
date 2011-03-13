YUI.add('gallery-form', function(Y) {

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
            transaction,
            cfg;

            if (submitViaIO === true) {
                cfg = {
                    method: formMethod,
                    form: {
                        id: this.get('contentBox'),
                        upload: (this.get('encodingType') === Y.Form.MULTIPART_ENCODED)
                    }
                };

                var io = this.get("io");
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
/**
 * @class FormField
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 * @description A representation of an individual form field.
 */

Y.FormField = Y.Base.create('form-field', Y.Widget, [Y.WidgetParent, Y.WidgetChild], {
    toString: function() {
        return this.name;
    },
    /**
     * @property _labelNode
     * @protected
     * @type Object
     * @description The label node for this form field
     */
    _labelNode: null,

    /**
     * @property _fieldNode
     * @protected
     * @type Object
     * @description The form field itself
     */
    _fieldNode: null,

    /**
     * @property _errorNode
     * @protected
     * @type Object
     * @description If a validation error occurs, it will be displayed in this node
     */
    _errorNode: null,

    /**
     * @property _initialValue
     * @private
     * @type String
     * @description The initial value set on this field, reset will set the value to this
     */
    _initialValue: null,

    /**
     * @method _validateError
     * @protected
     * @param val {Mixed}
     * @description Validates the value passed to the error attribute
     * @return {Boolean}
     */
    _validateError: function(val) {
        if (Y.Lang.isString(val)) {
            return true;
        }
        if (val === null || typeof val == 'undefined') {
            return true;
        }

        return false;
    },

    /**
     * @method _validateValidator
     * @protected
     * @param val {Mixed}
     * @description Validates the input of the validator attribute
     * @return {Boolean}
     */
    _validateValidator: function(val) {
        if (Y.Lang.isString(val)) {
            var validate = /^(email|phone|ip|date|time|postal|special)$/;
            if (validate.test(val) === true) {
                return true;
            }
        }
        if (Y.Lang.isFunction(val)) {
            return true;
        }
        return false;
    },

    /**
     * @method _setValidator
     * @protected
     * @param {val} {String|Function}
     * @description Sets the validator to the supplied method or if one of the 
     *              convenience strings is passed, the corresponding utility
     *              validator
     * @return {Function}
     */
    _setValidator: function(val) {
        Y.log('Set: ' + val);
        var valMap = {
            email: Y.FormField.VALIDATE_EMAIL_ADDRESS,
            phone: Y.FormField.VALIDATE_PHONE_NUMBER,
            ip: Y.FormField.VALIDATE_IP_ADDRESS,
            date: Y.FormField.VALIDATE_DATE,
            time: Y.FormField.VALIDATE_TIME,
            postal: Y.FormField.VALIDATE_POSTAL_CODE,
            special: Y.FormField.VALIDATE_NO_SPECIAL_CHARS
        };

        return (valMap[val] ? valMap[val] : val);
    },

    /**
     * @method _renderLabelNode
     * @protected
     * @description Draws the form field's label node into the contentBox
     */
    _renderLabelNode: function() {
        var contentBox = this.get('contentBox'),
        labelNode = contentBox.one('label');

        if (!labelNode || labelNode.get('for') != this.get('id')) {
            labelNode = Y.Node.create(Y.FormField.LABEL_TEMPLATE);
            contentBox.appendChild(labelNode);
        }

        this._labelNode = labelNode;
    },

    /**
     * @method _renderFieldNode
     * @protected
     * @description Draws the field node into the contentBox
     */
    _renderFieldNode: function() {
        var contentBox = this.get('contentBox'),
        field = contentBox.one('#' + this.get('id'));

        if (!field) {
            field = Y.Node.create(Y.FormField.INPUT_TEMPLATE);
            contentBox.appendChild(field);
        }

        this._fieldNode = field;
    },

    /**
     * @method _syncLabelNode
     * @protected
     * @description Syncs the the label node and this instances attributes
     */
    _syncLabelNode: function() {
        if (this._labelNode) {
            this._labelNode.setAttrs({
                innerHTML: this.get('label')
            });
            this._labelNode.setAttribute('for', this.get('id') + Y.FormField.FIELD_ID_SUFFIX);
        }
    },

    /**
     * @method _syncLabelNode
     * @protected
     * @description Syncs the fieldNode and this instances attributes
     */
    _syncFieldNode: function() {
        var nodeType = this.name.split('-')[0];
        if (!nodeType) {
            return;
        }

        this._fieldNode.setAttrs({
            name: this.get('name'),
            type: nodeType,
            id: this.get('id') + Y.FormField.FIELD_ID_SUFFIX,
            value: this.get('value')
        });

        this._fieldNode.setAttribute('tabindex', Y.FormField.tabIndex);
        Y.FormField.tabIndex++;
    },

    /**
     * @method _syncError
     * @private
     * @description Displays any pre-defined error message
     */
    _syncError: function() {
        var err = this.get('error');
        if (err) {
            this._showError(err);
        }
    },

    _syncDisabled: function(e) {
        var dis = this.get('disabled');
        if (dis === true) {
            this._fieldNode.setAttribute('disabled', 'disabled');
        } else {
            this._fieldNode.removeAttribute('disabled');
        }
    },

    /**
     * @method _checkRequired
     * @private
     * @description if the required attribute is set to true, returns whether or not a value has been set
     * @return {Boolean}
     */
    _checkRequired: function() {
        if (this.get('required') === true && this.get('value').length === 0) {
            return false;
        }
        return true;
    },

    /**
     * @method _showError
     * @param {String} errMsg
     * @private
     * @description Adds an error node with the supplied message
     */
    _showError: function(errMsg) {
        var contentBox = this.get('contentBox'),
        errorNode = Y.Node.create('<span>' + errMsg + '</span>');

        errorNode.addClass('error');
        contentBox.insertBefore(errorNode, this._labelNode);

        this._errorNode = errorNode;
    },

    /**
     * @method _clearError
     * @private
     * @description Removes the error node from this field
     */
    _clearError: function() {
        if (this._errorNode) {
            var contentBox = this.get('contentBox');
            contentBox.removeChild(this._errorNode);
            this._errorNode = null;
        }
    },

    _enableInlineValidation: function() {
        this.after('valueChange', this.validateField, this);
    },

    _disableInlineValidation: function() {
        this.detach('valueChange', this.validateField, this);
    },

    /**
     * @method validateField
     * @description Runs the validation functions of this form field
     * @return {Boolean}
     */
    validateField: function(e) {
        var value = this.get('value'),
        validator = this.get('validator');

        this.set('error', null);

        if (e && e.src != 'ui') {
            return false;
        }

        if (!this._checkRequired()) {
            this.set('error', Y.FormField.REQUIRED_ERROR_TEXT);
            return false;
        } else if (!value) {
            return true;
        }

        return validator.call(this, value, this);
    },

    resetFieldNode: function() {
        this.set('value', this._initialValue);
        this._fieldNode.set('value', this._initialValue);
        this.fire('nodeReset');
    },

    /**
     * @method clear
     * @description Clears the value AND the initial value of this field
     */
    clear: function() {
        this.set('value', '');
        this._fieldNode.set('value', '');
        this._initialValue = null;
        this.fire('clear');
    },

    initializer: function() {
        this.publish('blur');
        this.publish('change');
        this.publish('focus');
        this.publish('clear');
        this.publish('nodeReset');

        this._initialValue = this.get('value');
    },

    destructor: function(config) {

    },

    renderUI: function() {
        this._renderLabelNode();
        this._renderFieldNode();
    },

    bindUI: function() {
        this._fieldNode.on('change', Y.bind(function(e) {
            this.set('value', this._fieldNode.get('value'), {
                src: 'ui'
            });
        },
        this));

        this.on('valueChange', Y.bind(function(e) {
            if (e.src != 'ui') {
                this._fieldNode.set('value', e.newVal);
            }
        },
        this));

        this._fieldNode.on('blur', Y.bind(function(e) {
            this.set('value', this._fieldNode.get('value'), {
                src: 'ui'
            });
        },
        this));

        this._fieldNode.on('focus', Y.bind(function(e) {
            this.fire('focus', e);
        },
        this));

        this.on('errorChange', Y.bind(function(e) {
            if (e.newVal) {
                this._showError(e.newVal);
            } else {
                this._clearError();
            }
        },
        this));

        this.on('validateInlineChange', Y.bind(function(e) {
            if (e.newVal === true) {
                this._enableInlineValidation();
            } else {
                this._disableInlineValidation();
            }
        },
        this));

        this.after('disabledChange', Y.bind(function(e) {
            this._syncDisabled();
        },
        this));
    },

    syncUI: function() {
        this.get('boundingBox').removeAttribute('tabindex');
        this._syncLabelNode();
        this._syncFieldNode();
        this._syncError();
        this._syncDisabled();

        if (this.get('validateInline') === true) {
            this._enableInlineValidation();
        }
    }
},
{
    /**
     * @property FormField.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS: {
        /**
         * @attribute id
         * @type String
         * @default Either a user defined ID or a randomly generated by Y.guid()
         * @description A randomly generated ID that will be assigned to the field and used 
         * in the label's for attribute
         */
        id: {
            value: Y.guid(),
            validator: Y.Lang.isString,
            writeOnce: true
        },

        /**
         * @attribute name
         * @type String
         * @default ""
         * @writeOnce
         * @description The name attribute to use on the field
         */
        name: {
            validator: Y.Lang.isString,
            writeOnce: true
        },

        /**
         * @attribute value
         * @type String
         * @default ""
         * @description The current value of the form field
         */
        value: {
            value: '',
            validator: Y.Lang.isString
        },

        /**
         * @attribute label
         * @type String
         * @default ""
         * @description Label of the form field
         */
        label: {
            value: '',
            validator: Y.Lang.isString
        },

        /**
         * @attribute validator
         * @type Function
         * @default "function () { return true; }"
         * @description Used to validate this field by the Form class
         */
        validator: {
            value: function(val) {
                return true;
            },
            validator: function(val) {
                return this._validateValidator(val);
            },
            setter: function(val) {
                return this._setValidator(val);
            }
        },

        /**
         * @attribute error
         * @type String
         * @description An error message associated with this field. Setting this will
         *              cause validation to fail until a new value is entered
         */
        error: {
            value: false,
            validator: function(val) {
                return this._validateError(val);
            }
        },

        /**
         * @attribute required
         * @type Boolean
         * @default false
         * @description Set true if this field must be filled out when submitted
         */
        required: {
            value: false,
            validator: Y.Lang.isBoolean
        },

        /**
         * @attribute validateInline
         * @type Boolean
         * @default false
         * @description Set to true to validate this field whenever it's value is changed
         */
        validateInline: {
            value: false,
            validator: Y.Lang.isBoolean
        }
    },

    /**
     * @property FormField.tabIndex
     * @type Number
     * @description The current tab index of all Y.FormField instances
     */
    tabIndex: 1,

    /**
     * @method FormField.VALIDATE_EMAIL_ADDRESS
     * @static
     * @description Utility function to validate an email address
     */
    VALIDATE_EMAIL_ADDRESS: function(val, field) {
        var filter = /^([\w]+(?:\.[\w]+)*)@((?:[\w]+\.)*\w[\w]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (filter.test(val) === false) {
            field.set('error', Y.FormField.INVALID_EMAIL_MESSAGE);
            return false;
        }

        return true;
    },

    /**
     * @property FormField.INVALID_EMAIL_MESSAGE
     * @type String
     * @description Message to display when an invalid email address is entered
     */
    INVALID_EMAIL_MESSAGE: "Please enter a valid email address",

    /**
     * @method FormField.VALIDATE_PHONE_NUMBER
     * @static
     * @description Utility function to validate US and international phone numbers
     */
    VALIDATE_PHONE_NUMBER: function(val, field) {
        var filter = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
        if (filter.test(val) === false) {
            field.set('error', Y.FormField.INVALID_PHONE_NUMBER);
            return false;
        }
        return true;
    },

    /**
     * @property FormField.INVALID_PHONE_NUMBER
     * @type String
     * @description Message to display when an invalid phone number is entered
     */
    INVALID_PHONE_NUMBER: "Please enter a valid phone number",

    /**
     * @method FormField.VALIDATE_IP_ADDRESS
     * @static
     * @description Utility function to validate IPv4 addresses
     */
    VALIDATE_IP_ADDRESS: function(val, field) {
        var filter = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
        arr,
        valid = true;

        if (filter.test(val) === false) {
            valid = false;
        }

        arr = val.split(".");
        Y.Array.each(arr,
        function(v, i, a) {
            var n = parseInt(v, 10);
            if (n < 0 || n > 255) {
                valid = false;
            }
        });

        if (valid === false) {
            field.set('error', Y.FormField.INVALID_IP_MESSAGE);
        }

        return valid;
    },

    /**
     * @property FormField.INVALID_IP_MESSAGE
     * @type String
     * @description Message to display when an invalid IP address is entered
     */
    INVALID_IP_MESSAGE: "Please enter a valid IP address",

    /**
     * @method FormField.VALIDATE_DATE
     * @static
     * @description Utility function to validate dates
     */
    VALIDATE_DATE: function(val, field) {
        var filter = /^([1-9]|1[0-2])(\-|\/)([0-2][0-9]|3[0-1])(\-|\/)(\d{4}|\d{2})$/;
        if (filter.test(val) === false) {
            field.set('error', Y.FormField.INVALID_DATE_MESSAGE);
            return false;
        }
        return true;
    },

    /**
     * @property FormField.INVALID_DATE_MESSAGE
     * @type String
     * @description Message to display when an invalid date is entered
     */
    INVALID_DATE_MESSAGE: "Please enter a a valid date",

    /**
     * @method FormField.VALIDATE_TIME
     * @static
     * @description Utility function to validate times
     */
    VALIDATE_TIME: function(val, field) {
        var filter = /^([1-9]|1[0-2]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?$/;
        if (filter.test(val) === false) {
            field.set('error', Y.FormField.INVALID_TIME_MESSAGE);
            return false;
        }
        return true;
    },

    /**
     * @property FormField.INVALID_TIME_MESSAGE
     * @type String
     * @description Message to display when an invalid time is entered
     */
    INVALID_TIME_MESSAGE: "Please enter a valid time",

    /**
     * @method FormField.VALIDATE_POSTAL_CODE
     * @static
     * @description Utility function to validate US and international postal codes
     */
    VALIDATE_POSTAL_CODE: function(val, field) {
        var filter,
        valid = true;

        if (val.length == 6 || val.length == 7) {
            filter = /^[a-zA-Z]\d[a-zA-Z](-|\s)?\d[a-zA-Z]\d$/;
        } else if (val.length == 5 || val.length == 10) {
            filter = /^\d{5}((-|\s)\d{4})?$/;
        } else if (val.length > 0) {
            valid = false;
        }

        if (valid === false || (filter && filter.test(val) === false)) {
            field.set('error', Y.FormField.INVALID_POSTAL_CODE_MESSAGE);
            return false;
        }
        return true;
    },

    /**
     * @property FormField.INVALID_POSTAL_CODE_MESSAGE
     * @type String
     * @description Message to display when an invalid postal code is entered
     */
    INVALID_POSTAL_CODE_MESSAGE: "Please enter a valid postal code",

    /**
     * @method FormField.VALIDATE_NO_SPECIAL_CHARS
     * @static
     * @description Utility function to validate only alphanumeric characters
     */
    VALIDATE_NO_SPECIAL_CHARS: function(val, field) {
        var filter = /^[a-zA-Z0-9]*$/;
        if (filter.test(val) === false) {
            field.set('error', Y.FormField.INVALID_SPECIAL_CHARS);
            return false;
        }
        return true;
    },

    /**
     * @property FormField.INVALID_SPECIAL_CHARS
     * @type String
     * @description Message to display when invalid characters are entered
     */
    INVALID_SPECIAL_CHARS: "Please use only letters and numbers",

    /**
     * @property FormField.INPUT_TEMPLATE
     * @type String
     * @description Template used to draw an input node
     */
    INPUT_TEMPLATE: '<input />',

    /**
     * @property FormField.LABEL_TEMPLATE
     * @type String
     * @description Template used to draw a label node
     */
    LABEL_TEMPLATE: '<label></label>',

    /**
     * @property FormField.REQUIRED_ERROR_TEXT
     * @type String
     * @description Error text to display for a required field
     */
    REQUIRED_ERROR_TEXT: 'This field is required',

    /**
     * @property FormField.FIELD_ID_SUFFIX
     * @type String
     */
    FIELD_ID_SUFFIX: '-field'
});
/**
 * @class TextField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A text field node
 */
Y.TextField = Y.Base.create('text-field', Y.FormField, [Y.WidgetChild]);
/**
 * @class PasswordField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A password field node
 */
Y.PasswordField = Y.Base.create('password-field', Y.FormField, [Y.WidgetChild]);
/**
 * @class CheckboxField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A checkbox field node
 */

Y.CheckboxField = Y.Base.create('checkbox-field', Y.FormField, [Y.WidgetChild], {
    _syncChecked : function () {
        this._fieldNode.set('checked', this.get('checked'));
    },

    initializer : function () {
        Y.CheckboxField.superclass.initializer.apply(this, arguments);
    },

    syncUI : function () {
        Y.CheckboxField.superclass.syncUI.apply(this, arguments);
        this._syncChecked();
    },

    bindUI :function () {
        Y.CheckboxField.superclass.bindUI.apply(this, arguments);
        this.after('checkedChange', Y.bind(function(e) {
            if (e.src != 'ui') {
                this._fieldNode.set('checked', e.newVal);
            }
        }, this));

        this._fieldNode.after('change', Y.bind(function (e) {
            this.set('checked', e.currentTarget.get('checked'), {src : 'ui'});
        }, this));
    }
}, {
    ATTRS : {
        'checked' : {
            value : false,
            validator : Y.Lang.isBoolean
        }
    }
});
/**
 * @class RadioField
 * @extends CheckboxField
 * @param config {Object} Configuration object
 * @constructor
 * @description A Radio field node
 */
Y.RadioField = Y.Base.create('radio-field', Y.FormField, [Y.WidgetChild]);
/**
 * @class HiddenField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A hidden field node
 */
Y.HiddenField = Y.Base.create('hidden-field', Y.FormField, [Y.WidgetChild], {
    /**
     * @property _valueDisplayNode
     * @protected
     * @type Y.Node
     * @description Node used to display the value of this field
     */
    _valueDisplayNode: null,

    _renderValueDisplayNode: function() {
        if (this.get('displayValue') === true) {
            var div = Y.Node.create('<div></div>'),
            contentBox = this.get('contentBox');

            contentBox.appendChild(div);
            this._valueDisplayNode = div;
        }
    },

    renderUI: function() {
        Y.HiddenField.superclass.renderUI.apply(this, arguments);
        this._renderValueDisplayNode();
    },

    bindUI: function() {
        Y.HiddenField.superclass.bindUI.apply(this, arguments);

        if (this.get('displayValue') === true) {
            this.after('valueChange', Y.bind(function(m, e) {
                this._valueDisplayNode.set('innerHTML', e.newVal);
            },
            this, true));
        }
    },

    clear: function() {}
},
{
    /**
	 * @property HiddenField.ATTRS
	 * @type Object
	 * @static
	 */
    ATTRS: {
        /**
		 * @attribute displayValue
		 * @type Boolean
		 * @default false
		 * @writeOnce
		 * @description Set to true to render this field with node displaying the current value
		 */
        displayValue: {
            value: false,
            writeOnce: true,
            validator: Y.Lang.isBoolean
        }
    }

});
/**
 * @class TextareaField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A hidden field node
 */
Y.TextareaField = Y.Base.create('textarea-field', Y.FormField, [Y.WidgetChild], {
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            field = contentBox.one('#' + this.get('id'));
                
        if (!field) {
            field = Y.Node.create(Y.TextareaField.NODE_TEMPLATE);
            field.setAttrs({
                name : this.get('name'), 
                innerHTML : this.get('value')
            });
            contentBox.appendChild(field);
        }

		field.setAttribute('tabindex', Y.FormField.tabIndex);
		Y.FormField.tabIndex++;
        
        this._fieldNode = field;
    }
}, {
    /** 
     * @property TextareaField.NODE_TEMPLATE
     * @type String
     * @description Template used to draw a textarea node
     */
    NODE_TEMPLATE : '<textarea></textarea>'
});
/**
 * @class ChoiceField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A form field which allows one or multiple values from a 
 * selection of choices
 */
Y.ChoiceField = Y.Base.create('choice-field', Y.FormField, [Y.WidgetParent, Y.WidgetChild], {
    /**
     * @method _validateChoices
     * @protected
     * @param {Object} val
     * @description Validates the value passe to the choices attribute
     */
    _validateChoices: function(val) {
        if (!Y.Lang.isArray(val)) {
            Y.log('Choice values must be in an array');
            return false;
        }

        var i = 0,
        len = val.length;

        for (; i < len; i++) {
            if (!Y.Lang.isObject(val[i])) {
                Y.log('Choice that is not an object cannot be used');
                delete val[i];
                continue;
            }
            if (!val[i].label ||
            !Y.Lang.isString(val[i].label) ||
            !val[i].value ||
            !Y.Lang.isString(val[i].value)) {
                Y.log('Choice without label and value cannot be used');
                delete val[i];
                continue;
            }
        }

        if (val.length === 0) {
            return false;
        }

        return true;
    },

    _renderLabelNode: function() {
        var contentBox = this.get('contentBox'),
        titleNode = Y.Node.create('<span></span>');

        titleNode.set('innerHTML', this.get('label'));
        contentBox.appendChild(titleNode);

        this._labelNode = titleNode;
    },

    _renderFieldNode: function() {
        var contentBox = this.get('contentBox'),
        choices = this.get('choices'),
        multiple = this.get('multi'),
        fieldType = (multiple === true ? Y.CheckboxField: Y.RadioField);

        Y.Array.each(choices,
        function(c, i, a) {
            var cfg = {
                value: c.value,
                id: (this.get('id') + '_choice' + i),
                name: this.get('name'),
                label: c.label
            },
            field = new fieldType(cfg);

            field.render(contentBox);
        }, this);
        this._fieldNode = contentBox.all('input');
    },

    _syncFieldNode: function() {
        var choices = this.get('value').split(',');

        if (choices && choices.length > 0) {
            Y.Array.each(choices, function(choice) {
                this._fieldNode.each(function(node, index, list) {
                    if (Y.Lang.trim(node.get('value')) == Y.Lang.trim(choice)) {
                        node.set('checked', true);
                        return true;
                    }
                }, this);
            }, this);
        }
    },

    clear: function() {
        this._fieldNode.each(function(node, index, list) {
            node.set('checked', false);
        },
        this);

        this.set('value', '');
    },

    bindUI: function() {
        this._fieldNode.on('change', Y.bind(function(e) {
            var value = '';
            this._fieldNode.each(function(node, index, list) {
                if (node.get('checked') === true) {
                    if (value.length > 0) {
                        value += ',';
                    }
                    value += node.get('value');
                }
            }, this);
            this.set('value', value);
        },
        this));
    }

},
{
    ATTRS: {
        /** 
         * @attribute choices
         * @type Array
         * @description The choices to render into this field
         */
        choices: {
            validator: function(val) {
                return this._validateChoices(val);
            }
        },

        /** 
         * @attribute multi
         * @type Boolean
         * @default false
         * @description Set to true to allow multiple values to be selected
         */
        multi: {
            validator: Y.Lang.isBoolean,
            value: false
        }
    }
});
/**
 * @class SelectField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A select field node
 */
Y.SelectField = Y.Base.create('select-field', Y.ChoiceField, [Y.WidgetParent, Y.WidgetChild], {
    /**
	 * @method _renderFieldNode
	 * @protected
	 * @description Draws the select node into the contentBox
	 */
    _renderFieldNode: function() {
        var contentBox = this.get('contentBox'),
        field = contentBox.one('#' + this.get('id'));

        if (!field) {
            field = Y.Node.create(Y.SelectField.NODE_TEMPLATE);
            contentBox.appendChild(field);
        }

        this._fieldNode = field;

        this._renderOptionNodes();
    },

    /**
	 * @method _renderOptionNodes
	 * @protected
	 * @description Renders the option nodes into the select node
	 */
    _renderOptionNodes: function() {
        var choices = this.get('choices'),
        elOption;

        // Create the "Choose one" option
        if (this.get('useDefaultOption') === true) {
            elOption = Y.Node.create(Y.SelectField.OPTION_TEMPLATE);
            this._fieldNode.appendChild(elOption);
        }

        Y.Array.each(choices,
        function(c, i, a) {
            elOption = Y.Node.create(Y.SelectField.OPTION_TEMPLATE);
            this._fieldNode.appendChild(elOption);
        },
        this);
    },

    /**
	 * @method _syncFieldNode
	 * @protected
	 * @description Syncs the select node with the instance attributes
	 */
    _syncFieldNode: function() {
        Y.SelectField.superclass.constructor.superclass._syncFieldNode.apply(this, arguments);

        this._fieldNode.setAttrs({
            multiple: (this.get('multi') === true ? 'multiple': '')
        });
    },

    /**
	 * @method _syncOptionNodes
	 * @protected
	 * @description Syncs the option nodes with the choices attribute
	 */
    _syncOptionNodes: function() {
        var choices = this.get('choices'),
        contentBox = this.get('contentBox'),
        options = contentBox.all('option'),
        useDefaultOption = this.get('useDefaultOption'),
        currentVal = this.get('value');

        if (useDefaultOption === true) {
            choices.unshift({
                label: Y.SelectField.DEFAULT_OPTION_TEXT,
                value: ''
            });
        }

        options.each(function(node, index, nodeList) {
            var label = choices[index].label,
            val = choices[index].value;

            node.setAttrs({
                innerHTML: label,
                value: val
            });

            if (currentVal == val) {
                node.setAttrs({
                    selected: true,
                    defaultSelected: true
                });
            }
        },
        this);
    },

    /**
	 * @method clear
	 * @description Restores the selected option to the default
	 */
    clear: function() {
        this._fieldNode.value = '';
    },

    bindUI: function() {
        Y.SelectField.superclass.constructor.superclass.bindUI.apply(this, arguments);
    },

    syncUI: function() {
        Y.SelectField.superclass.syncUI.apply(this, arguments);
        this._syncOptionNodes();
    }
},
{
    /**
     * @property SelectField.NODE_TEMPLATE
     * @type String
     * @description Template used to draw a select node
     */
    NODE_TEMPLATE: '<select></select>',

    /**
	 * @property SelectField.OPTION_TEMPLATE
	 * @type String
	 * @description Template used to draw an option node
	 */
    OPTION_TEMPLATE: '<option></option>',

    /**
	 * @property SelectField.DEFAULT_OPTION_TEXT
	 * @type String
	 * @description The display title of the default choice in the select box
	 */
    DEFAULT_OPTION_TEXT: 'Choose one',

    ATTRS: {
        /**
	     * @attribute useDefaultOption
	     * @type Boolean
	     * @default true
	     * @description If true, the first option will use the DEFAULT_OPTION_TEXT
	     *              to create a blank option
	     */
        useDefaultOption: {
            validator: Y.Lang.isBoolean,
            value: true
        }
    }
});
Y.FormButton = Y.Base.create('button-field', Y.FormField, [Y.WidgetChild], {
    _renderButtonNode : function () {
        var contentBox = this.get('contentBox'), bn;
        
        bn = Y.Node.create(Y.FormButton.NODE_TEMPLATE);
        contentBox.appendChild(bn);
        this._fieldNode = bn;
    },

    _syncLabelNode: function () {},

    _syncFieldNode : function () {
        this._fieldNode.setAttrs({
            innerHTML : this.get('label'),
            id : this.get('id') + Y.FormField.FIELD_ID_SUFFIX
        });
        
        this.get('contentBox').addClass('first-child');
    },

    _setClickHandler : function () {
        if (!this._fieldNode) {
            return;
        }

        var oc = this.get('onclick');
        Y.Event.purgeElement(this._fieldNode, true, 'click');
        Y.on('click', Y.bind(oc.fn, oc.scope, true), this._fieldNode);
    },

    renderUI : function () {
        this._renderButtonNode();
    },

    bindUI : function () {
        this.after('onclickChange', Y.bind(this._setClickHandler, this, true));
        this._setClickHandler();
    }
}, {
    ATTRS : {
        onclick : {
            validator : function (val) {
                if (Y.Lang.isObject(val) === false) {
                    return false;
                }
                if (typeof val.fn == 'undefined' ||
                    Y.Lang.isFunction(val.fn) === false) {
                    return false;
                }
                return true;
            },
            value : {
                fn : function (e) {

                }
            },
            setter : function (val) {
                val.scope = val.scope || this;
                val.argument = val.argument || {};
                return val;
            }
        }
    },

    NODE_TEMPLATE : '<button></button>'
});
/**
 * @class FileField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A file field node
 */

Y.FileField = Y.Base.create('file-field', Y.FormField, [Y.WidgetChild], {
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            field = contentBox.one('#' + this.get('id'));
                        
        if (!field) {
            field = Y.Node.create(Y.FileField.FILE_INPUT_TEMPLATE);
            contentBox.appendChild(field);
        }

        this._fieldNode = field;
    }
}, {
    FILE_INPUT_TEMPLATE : '<input type="file" />'
});
/**
 * @class SubmitButton
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A submit button
 */
Y.SubmitButton = Y.Base.create('submit-button', Y.FormField, [Y.WidgetChild], {
    _renderLabelNode : function () {}
});
/**
 * @class ResetButton
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A reset button
 */
Y.ResetButton = Y.Base.create('reset-button', Y.FormField, [Y.WidgetChild], {
    _renderLabelNode: function() {}
});


}, 'gallery-2011.02.23-19-01' ,{requires:['node', 'widget-base', 'widget-htmlparser', 'io-form', 'widget-parent', 'widget-child', 'base-build', 'substitute', 'io-upload-iframe']});
