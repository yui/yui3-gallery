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
     * @property FormField.FIELD_TEMPLATE
     * @type String
     * @description Template used to render the field node
     */
    FIELD_TEMPLATE : '<input>',

    /**
     * @property FormField.FIELD_CLASS
     * @type String
     * @description CSS class used to locate a placeholder for
     *     the field node and style it.
     */
    FIELD_CLASS : 'field',

    /**
     * @property FormField.LABEL_TEMPLATE
     * @type String
     * @description Template used to draw a label node
     */
    LABEL_TEMPLATE : '<label></label>',

    /**
     * @property FormField.LABEL_CLASS
     * @type String
     * @description CSS class used to locate a placeholder for
     *     the label node and style it.
     */
    LABEL_CLASS : 'label',

    /**
     * @property FormField.HINT_TEMPLATE
     * @type String
     * @description Optionally a template used to draw a hint node. Derived
     *     classes can use it to provide additional information about the field
     */
    HINT_TEMPLATE : '',

    /**
     * @property FormField.HINT_CLASS
     * @type String
     * @description CSS class used to locate a placeholder for
     *     the hint node and style it.
     */
    HINT_CLASS : 'hint',

    /**
     * @property FormField.ERROR_TEMPLATE
     * @type String
     * @description Template used to draw an error node
     */
    ERROR_TEMPLATE : '<span></span>',

    /**
     * @property FormField.ERROR_CLASS
     * @type String
     * @description CSS class used to locate a placeholder for
     *     the error node and style it.
     */
    ERROR_CLASS : 'error',

    /**
     * @property _labelNode
     * @protected
     * @type Object
     * @description The label node for this form field
     */
    _labelNode: null,

     /**
     * @property _hintNode
     * @protected
     * @type Object
     * @description The hint node with extra text describing the field
     */    
    _hintNode : null,

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
     * @method _renderNode
     * @protected
     * @description Helper method to render new nodes, possibly replacing
     *     markup placeholders.
     */
    _renderNode : function (nodeTemplate, nodeClass, nodeBefore) {
        if (!nodeTemplate) {
            return null;
        }
        var contentBox = this.get('contentBox'),
            node = Y.Node.create(nodeTemplate),
            placeHolder = contentBox.one('.' + nodeClass);

        node.addClass(nodeClass);

        if (placeHolder) {
            placeHolder.replace(node);
        } else {
            if (nodeBefore) {
                contentBox.insertBefore(node, nodeBefore);
            } else {
                contentBox.appendChild(node);
            }
        }

        return node;
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
            labelNode = this._renderNode(this.LABEL_TEMPLATE, this.LABEL_CLASS);
        }

        this._labelNode = labelNode;
    },

    /**
     * @method _renderHintNode
     * @protected
     * @description Draws the hint node into the contentBox. If a node is
     *     found in the contentBox with class HINT_CLASS, it will be
     *     considered a markup placeholder and replaced with the hint node.
     */
    _renderHintNode : function () {
        this._hintNode = this._renderNode(this.HINT_TEMPLATE,
                                          this.HINT_CLASS);
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
            field = this._renderNode(this.FIELD_TEMPLATE, this.FIELD_CLASS);
        }

        this._fieldNode = field;
    },

    /**
     * @method _syncLabelNode
     * @protected
     * @description Syncs the the label node and this instances attributes
     */
    _syncLabelNode: function() {
        var label = this.get('label'),
            required = this.get('required'),
            requiredLabel = this.get('requiredLabel');
        if (this._labelNode) {
            this._labelNode.set("text", "");
            if (label) {
                this._labelNode.append("<span class='caption'>" + label + "</span>"); 
            }
            if (required && requiredLabel) {
                this._labelNode.append("<span class='separator'> </span>");
                this._labelNode.append("<span class='required'>" + requiredLabel + "</span>");
            }
            this._labelNode.setAttribute('for', this.get('id') + Y.FormField.FIELD_ID_SUFFIX);
        }
    },

    /**
     * @method _syncHintNode
     * @protected
     * @description Syncs the hintNode
     */
    _syncHintNode : function () {
        if (this._hintNode) {
            this._hintNode.set("text", this.get("hint"));
        }
    },

    /**
     * @method _syncFieldNode
     * @protected
     * @description Syncs the fieldNode and this instances attributes
     */
    _syncFieldNode: function() {
        var nodeType = this.INPUT_TYPE || this.name.split('-')[0];
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
        var errorNode = this._renderNode(this.ERROR_TEMPLATE, this.ERROR_CLASS, this._labelNode);

        errorNode.set("text", errMsg);
        this._errorNode = errorNode;
    },

    /**
     * @method _clearError
     * @private
     * @description Removes the error node from this field
     */
    _clearError: function() {
        if (this._errorNode) {
            this._errorNode.remove();
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
        this._renderHintNode();
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
        this._syncHintNode();
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
         * @attribute hint
         * @type String
         * @default ""
         * @description Extra text explaining what the field is about.
         */
        hint : {
            value : '',
            validator : Y.Lang.isString
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
        },

        /**
         * @attribute requiredLabel
         * @type String
         * @description Text to append to the labal caption for a required
         *     field, by default nothing will be appended.
         */
        requiredLabel : {
            value : '',
            validator : Y.Lang.isString
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
