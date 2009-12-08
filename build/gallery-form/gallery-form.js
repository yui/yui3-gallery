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
function Form () {
	Form.superclass.constructor.apply(this,arguments);
}

Y.mix(Form, {
	/**
	 * @property Form.NAME
	 * @type String
	 * @static
	 */
	NAME : 'form',
	
	/**
	 * @property Form.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {
		/**
		 * @attribute method
		 * @type String
		 * @default 'post'
		 * @description The method by which the form should be transmitted. Valid values are 'get' and 'post'
		 */
		method : {
			value : 'post',
			validator : function (val) {
				return this._validateMethod(val);
			},
			setter : function (val) {
				return val.toLowerCase();
			}
		},

		/**
		 * @attribute action
		 * @type String
		 * @default ''
		 * @description A url to which the validated form is to be sent
		 */
		action : {
			value : '',
			validator : Y.Lang.isString
		},

		/**
		 * @attribute fields
		 * @type Array
		 * @description An array of the fields to be rendered into the form. Each item in the array can either be
		 *				a FormField instance or an object literal defining the properties of the field to be
		 *				generated. Alternatively, this value will be parsed in from HTML
		 */
		fields : {
			writeOnce : true,
			validator : function (val) {
				return this._validateFields(val);
			},
			setter : function (val) {
				return this._setFields(val);
			}
			
		},

		/**
		 * @attribute oftValidation
		 * @type Boolean
		 * @description Set to true to validate fields "on the fly", where they will
		 *				validate themselves any time the value attribute is changed
		 */
		inlineValidation : {
			value : false,
			validator : Y.Lang.isBoolean
		}
	},

	/**
	 * @property Form.HTML_PARSER
	 * @type Object
	 * @static
	 */
	HTML_PARSER : {
		action : function (contentBox) {
			return this._parseAction(contentBox);
		},
		method : function (contentBox) {
			return this._parseMethod(contentBox);
		},
		fields : function (contentBox) {
			return this._parseFields(contentBox);
		}
	},

	/**
	 * @property Form.FORM_TEMPLATE
	 * @type String
	 * @static
	 * @description The HTML used to create the form Node
	 */
	FORM_TEMPLATE : '<form></form>'
});

Y.extend(Form, Y.Widget, {
	/**
	 * @property _formNode
	 * @type Y.Node
	 * @protected
	 * @description The Y.Node representing the form element
	 */
	_formNode : null,
	
	/**
	 * @property _ioIds
	 * @type Object
	 * @protected
	 * @description An object who's keys represent the IO request ids sent by this Y.Form instance
	 */
	_ioIds : null,
	
	/**
	 * @method _validateAction
	 * @private
	 * @param {String} val
	 * @description Validates the values of the 'action' attribute
	 */
	_validateMethod : function (val) {
		if (!Y.Lang.isString(val)) {
			return false;
		}
		if (val.toLowerCase() != 'get' && val.toLowerCase() != 'post') {
			return false;
		}
		return true;	
	},
	
	/**
	 * @method _validateFields
	 * @private
	 * @param {Array} val
	 * @description Validates the values of the 'fields' attribute
	 */
	_validateFields : function (val) {
		if (!Y.Lang.isArray(val)) {
			return false;
		}

		var valid = true;
		Y.Array.each(val, function (f, i, a) {
			if ((!f instanceof Y.FormField) || (!Y.Lang.isObject(f))) {
				valid = false;
			}
		});
		return valid;
	},

	/**
	 * @method _setFields
	 * @private
	 * @param {Array} fields
	 * @description Transforms the values passed to the 'fields' attribute into an array of 
	 *				Y.FormField objects
	 */
	_setFields : function (fields) {
		fields = fields || [];
		var fieldType, t;

		Y.Array.each(fields, function (f, i, a) {
			if (!f._classes) {
				t = f.type;
				if (Y.Lang.isFunction(t)) {
					fieldType = t;
				} else {
					if (t == 'hidden') {
						fieldType = Y.HiddenField;
					} else if (t == 'checkbox') {
						fieldType = Y.CheckboxField;
					} else if (t == 'password') {
						fieldType = Y.PasswordField;
					} else if (t == 'textarea') {
						fieldType = Y.TextareaField;
					} else if (t == 'select') {
						fieldType = Y.SelectField;
					} else if (t == 'choice') {
						fieldType = Y.ChoiceField;
					} else if (t == 'button' || t == 'submit' || t == 'reset') {
						fieldType = Y.Button;
						if (t =='submit') {
							f.onclick = {
								fn : this.submit,
								scope : this
							};
						} else if (t == 'reset') {
							f.onclick = {
								fn : this.reset,
								scope : this
							};
						}
					} else {
						fieldType = Y.TextField;
					}
				}
				
				fields[i] = new fieldType(f);
			}
		}, this);
		return fields;
	},

	/**
	 * @method _parseAction
	 * @private
	 * @param {Y.Node} contentBox
	 * @description Sets the 'action' attribute based on parsed HTML
	 */
	_parseAction : function (contentBox) {
		var form = contentBox.one('form');
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
	_parseMethod : function (contentBox) {
		var form = contentBox.one('form');
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
	_parseFields : function (contentBox) {
		var children = contentBox.all('*'),
			labels = contentBox.all('label'),
			fields = [];
		
		children.each(function(node, index, nodeList) {
			var nodeName = node.get('nodeName'), 
				nodeId = node.get('id'),
				o, c = [];
			if (nodeName == 'INPUT') {
				o = {
					type: node.get('type'),
					name : node.get('name'),
					value : node.get('value')
				};

				if (o.type == 'submit' || o.type == 'reset' || o.type == 'button') {
					o.label = node.get('value');
				}
			} else if (nodeName == 'BUTTON') {
				o = {
					type : 'button',
					name : node.get('name'),
					label : node.get('innerHTML')
				};
			} else if (nodeName == 'SELECT') {
				node.all('option').each(function (optNode, optNodeIndex, optNodeList) {
					c.push({
						label : optNode.get('innerHTML'),
						value : optNode.get('value')
					});
				});
				o = {
					type : 'select',
					name : node.get('name'),
					choices : c
				};
			} else if (nodeName == 'TEXTAREA') {
				o = {
					type: 'textarea',
					name : node.get('name'),
					value : node.get('innerHTML')
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
	 * @method _renderFormNode
	 * @protected
	 * @description Draws the form node into the contentBox
	 */
	_renderFormNode : function () {
		var contentBox = this.get('contentBox'),
			form = contentBox.query('form');

		if (!form) {
			form = Y.Node.create(Form.FORM_TEMPLATE);
			contentBox.appendChild(form);
		}
		
		this._formNode = form;
	},
	
	/**
	 * @method _renderFormFields
	 * @protected
	 * @description Draws the form fields into the form node
	 */
	_renderFormFields : function () {
		var fields = this.get('fields');

		Y.Array.each(fields, function (f, i, a) {
			f.render(this._formNode);
		}, this);
	},

	/**
	 * @method _syncFormAttributes
	 * @protected
	 * @description Syncs the form node action and method attributes
	 */
	_syncFormAttributes : function () {
		this._formNode.setAttrs({
			action : this.get('action'),
			method : this.get('method'),
			id : this.get('id')
		});    
	},
	
	/**
	 * @method _runValidation
	 * @protected
	 * @description Validates the form based on each field's validator
	 */
	_runValidation : function () {
		var fields = this.get('fields'),
			isValid = true;
		
		Y.Array.each(fields, function (f, i, a) {
			f.set('error',null);
			if (f.validateField() === false) {
				isValid = false;
			}
		});
			   
		return isValid;
	},

	_enableInlineValidation : function () {
		var fields = this.get('fields');
		Y.Array.each(fields, function (f, i, a) {
			f.set('validateInline', true);
		});
	},

	_disableInlineValidation : function () {
		var fields = this.get('fields');
		Y.Array.each(fields, function (f, i, a) {
			f.set('validateInline', false);
		});
	},

	/**
	 * @method _handleIOSuccess
	 * @protected
	 * @param {Number} ioId
	 * @param {Object} ioResponse
	 * @description Handles the success event of IO transactions instantiated by this instance
	 */
	_handleIOSuccess : function (ioId, ioResponse) {
		if (typeof this._ioIds[ioId] != 'undefined') {
			delete this._ioIds[ioId];
			this.fire('success', {response : ioResponse});
		}
	},

	/**
	 * @method _handleIOFailure
	 * @protected
	 * @param {Number} ioId
	 * @param {Object} ioResponse
	 * @description Handles the failure event of the IO transactions instantiated by this instance
	 */
	_handleIOFailure : function (ioId, ioResponse) {
		if (typeof this._ioIds[ioId] != 'undefined') {
			this.fire('failure', {response : ioResponse});
			delete this._ioIds[ioId];
		}
	},
	
	/**
	 * @method reset
	 * @description Resets all form fields to their initial value 
	 */
	reset : function () {
		this._formNode.reset();
		var fields = this.get('fields');
		Y.Array.each(fields, function (f, i, a) {
			f.clear();
		});
	},
	
	/**
	 * @method submit
	 * @description Submits the form using the defined method to the URL defined in the action
	 */
	submit : function () {
		if (this._runValidation()) {
			var formAction = this.get('action'),
				formMethod = this.get('method'),
				fields = this.get('fields'), 
				postData = '', 
				transaction, cfg;

			Y.Array.each(fields, function (f, i, a) {
				if (f.get('name') !== null) {
					postData += encodeURIComponent(f.get('name')) + '=' +
								(encodeURIComponent(f.get('value')) || '') + '&';
				}
			});

			cfg = {
				method : formMethod,
				data : postData
			};

			transaction = Y.io(formAction, cfg);

			this._ioIds[transaction.id] = transaction;
		}
	},
	
	/**
	 * @method getField
	 * @param {String | Number} selector
	 * @description Get a form field by its name attribute or numerical index
	 */
	getField : function (selector) {
		var fields = this.get('fields'),
			sel;

		if (Y.Lang.isNumber(selector)) {
			return fields[selector];
		} else if (Y.Lang.isString(selector)) {
			Y.Array.each(fields, function (f, i, a) {
				if (f.get('name') == selector) {
					sel = f;
				}
			});
			return sel;
		}
	},
	
	initializer : function (config) {
		this._ioIds = {};

		this.publish('submit');
		this.publish('reset');
		this.publish('success');
		this.publish('failure');
	},
	
	destructor : function () {
		this._formNode = null;
	},
	
	renderUI : function () {
		this._renderFormNode();
		this._renderFormFields();
	},
	
	bindUI : function () {
		this._formNode.on('submit', Y.bind(function (e) {
			e.halt();
		}, this));

		this.after('inlineValidationChange', Y.bind(function (e) {
			if (e.newValue === true) {
				this._enableInlineValidation();
			} else {
				this._disableInlineValidation();
			}
		}, this));

		this.after('success', Y.bind(function(e) {
			this.reset();
		}, this));

		Y.on('io:success', Y.bind(this._handleIOSuccess, this));
		Y.on('io:failure', Y.bind(this._handleIOFailure, this));
	},
	
	syncUI : function () {
		this._syncFormAttributes();
		if (this.get('inlineValidation') === true) {
			this._enableInlineValidation();
		}
	}
});

Y.Form = Form;
/**
 * @class FormField
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 * @description A representation of an individual form field.
 */
function FormField () {
	FormField.superclass.constructor.apply(this,arguments);
}

Y.mix(FormField, {
	
	/**
	 * @property FormField.NAME
	 * @type String
	 * @static
	 */
	NAME : 'form-field',
	
	/**
	 * @property FormField.ATTRS
	 * @type Object
	 * @protected
	 * @static
	 */    
	ATTRS : {
		/**
		 * @attribute id
		 * @type String
		 * @default Either a user defined ID or a randomly generated by Y.guid()
		 * @description A randomly generated ID that will be assigned to the field and used 
		 * in the label's for attribute
		 */
		id : {
			value : Y.guid(),
			validator : Y.Lang.isString,
			writeOnce : true
		},
				
		/**
		 * @attribute name
		 * @type String
		 * @default ""
		 * @writeOnce
		 * @description The name attribute to use on the field
		 */		   
		name : {
			validator : Y.Lang.isString,
			writeOnce : true
		},
		
		/**
		 * @attribute value
		 * @type String
		 * @default ""
		 * @description The current value of the form field
		 */
		value : {
			value : '',
			validator : Y.Lang.isString
		},
		
		/**
		 * @attribute label
		 * @type String
		 * @default ""
		 * @description Label of the form field
		 */
		label : {
			value : '',
			validator : Y.Lang.isString
		},
		
		/**
		 * @attribute validator
		 * @type Function
		 * @default "function () { return true; }"
		 * @description Used to validate this field by the Form class
		 */
		validator : {
			value : function (val) {
				return true;
			},
			validator : function (val) {
				return this._validateValidator(val);
			},
			setter : function (val) {
				return this._setValidator(val);
			}
		},

		/**
		 * @attribute error
		 * @type String
		 * @description An error message associated with this field. Setting this will
		 *				cause validation to fail until a new value is entered
		 */
		 error : {
			value : false,
			validator : function (val) {
				return this._validateError(val);
			}
		 },
		
		/**
		 * @attribute required
		 * @type Boolean
		 * @default false
		 * @description Set true if this field must be filled out when submitted
		 */
		required : {
			value : false,
			validator : Y.Lang.isBoolean
		},

		/**
		 * @attribute validateInline
		 * @type Boolean
		 * @default false
		 * @description Set to true to validate this field whenever it's value is changed
		 */
		validateInline : {
			value : false,
			validator : Y.Lang.isBoolean
		}
	},

	/**
	 * @property FormField.tabIndex
	 * @type Number
	 * @description The current tab index of all FormField instances
	 */
	tabIndex : 0,
	
	/**
	 * @method FormField.VALIDATE_EMAIL_ADDRESS
	 * @static
	 * @description Utility function to validate an email address
	 */
	VALIDATE_EMAIL_ADDRESS : function (val, field) {
		var filter = /^([\w]+(?:\.[\w]+)*)@((?:[\w]+\.)*\w[\w]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if (filter.test(val) === false) {
			field.set('error', FormField.INVALID_EMAIL_MESSAGE);
			return false;
		}
		
		return true;
	},

	/**
	 * @property FormField.INVALID_EMAIL_MESSAGE
	 * @type String
	 * @description Message to display when an invalid email address is entered
	 */
	INVALID_EMAIL_MESSAGE : "Please enter a valid email address",

	/**
	 * @method FormField.VALIDATE_PHONE_NUMBER
	 * @static
	 * @description Utility function to validate US and international phone numbers
	 */
	VALIDATE_PHONE_NUMBER : function(val, field) {
		var filter = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
		if (filter.test(val) === false) {
			field.set('error', FormField.INVALID_PHONE_NUMBER);
			return false;
		}
		return true;
	},

	/**
	 * @property FormField.INVALID_PHONE_NUMBER
	 * @type String
	 * @description Message to display when an invalid phone number is entered
	 */
	INVALID_PHONE_NUMBER : "Please enter a valid phone number",

	/**
	 * @method FormField.VALIDATE_IP_ADDRESS
	 * @static
	 * @description Utility function to validate IPv4 addresses
	 */
	VALIDATE_IP_ADDRESS : function (val, field) {
		var filter = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
			arr, valid = true;

		if (filter.test(val) === false) {
			valid = false;
		}
		
		arr = val.split(".");
		Y.Array.each(arr, function (v, i, a) {
			var n = parseInt(v, 10);
			if (n < 0 || n > 255) {
				valid = false;
			}
		});

		if (valid === false) {
			field.set('error', FormField.INVALID_IP_MESSAGE);
		}

		return valid;
	},

	/**
	 * @property FormField.INVALID_IP_MESSAGE
	 * @type String
	 * @description Message to display when an invalid IP address is entered
	 */
	INVALID_IP_MESSAGE : "Please enter a valid IP address",

	/**
	 * @method FormField.VALIDATE_DATE
	 * @static
	 * @description Utility function to validate dates
	 */
	VALIDATE_DATE : function (val, field) {
		var filter = /^([1-9]|1[0-2])(\-|\/)([0-2][0-9]|3[0-1])(\-|\/)(\d{4}|\d{2})$/;
		if (filter.test(val) === false) {
			field.set('error', FormField.INVALID_DATE_MESSAGE);
			return false;
		}
		return true;
	},

	/**
	 * @property FormField.INVALID_DATE_MESSAGE
	 * @type String
	 * @description Message to display when an invalid date is entered
	 */
	INVALID_DATE_MESSAGE : "Please enter a a valid date",

	/**
	 * @method FormField.VALIDATE_TIME
	 * @static
	 * @description Utility function to validate times
	 */
	VALIDATE_TIME : function (val, field) {
		var filter = /^([1-9]|1[0-2]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?$/;
		if (filter.test(val) === false) {
			field.set('error', FormField.INVALID_TIME_MESSAGE);
			return false;
		}
		return true;
	},

	/**
	 * @property FormField.INVALID_TIME_MESSAGE
	 * @type String
	 * @description Message to display when an invalid time is entered
	 */
	INVALID_TIME_MESSAGE : "Please enter a valid time",

	/**
	 * @method FormField.VALIDATE_POSTAL_CODE
	 * @static
	 * @description Utility function to validate US and international postal codes
	 */
	VALIDATE_POSTAL_CODE : function (val, field) {
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
			field.set('error', FormField.INVALID_POSTAL_CODE_MESSAGE);
			return false;
		}
		return true;
	},

	/**
	 * @property FormField.INVALID_POSTAL_CODE_MESSAGE
	 * @type String
	 * @description Message to display when an invalid postal code is entered
	 */
	INVALID_POSTAL_CODE_MESSAGE : "Please enter a valid postal code",

	/**
	 * @method FormField.VALIDATE_NO_SPECIAL_CHARS
	 * @static
	 * @description Utility function to validate only alphanumeric characters
	 */
	VALIDATE_NO_SPECIAL_CHARS : function (val, field) {
		var filter = /^[a-zA-Z0-9]*$/;
		if(filter.test(val) === false) {
			field.set('error', FormField.INVALID_SPECIAL_CHARS);
			return false;
		}
		return true;
	},

	/**
	 * @property FormField.INVALID_SPECIAL_CHARS
	 * @type String
	 * @description Message to display when invalid characters are entered
	 */
	INVALID_SPECIAL_CHARS : "Please use only letters and numbers",

	/**
	 * @property FormField.INPUT_TEMPLATE
	 * @type String
	 * @description Template used to draw an input node
	 */
	INPUT_TEMPLATE : '<input>',
	
	/**
	 * @property FormField.TEXTAREA_TEMPLATE
	 * @type String
	 * @description Template used to draw a textarea node
	 */
	TEXTAREA_TEMPLATE : '<textarea></textarea>',
	
	/**
	 * @property FormField.LABEL_TEMPLATE
	 * @type String
	 * @description Template used to draw a label node
	 */
	LABEL_TEMPLATE : '<label></label>',

	/**
	 * @property FormField.SELECT_TEMPLATE
	 * @type String
	 * @description Template used to draw a select node
	 */
	SELECT_TEMPLATE : '<select></select>'
});

Y.extend(FormField, Y.Widget, {
	/**
	 * @property _labelNode
	 * @protected
	 * @type Object
	 * @description The label node for this form field
	 */
	_labelNode : null,

	/**
	 * @property _fieldNode
	 * @protected
	 * @type Object
	 * @description The form field itself
	 */    
	_fieldNode : null,

	/**
	 * @property _errorNode
	 * @protected
	 * @type Object
	 * @description If a validation error occurs, it will be displayed in this node
	 */    
	_errorNode : null,
	
	/**
	 * @property _nodeType
	 * @protected
	 * @type String
	 * @description The type of form field to draw
	 */
	_nodeType : 'text',
	
	/**
	 * @method _validateError
	 * @protected
	 * @param val {Mixed}
	 * @description Validates the value passed to the error attribute
	 * @return {Boolean}
	 */
	_validateError : function (val) {
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
	 _validateValidator : function (val) {
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
	 *				convenience strings is passed, the corresponding utility
	 *				validator
	 * @return {Function}
	 */
	 _setValidator : function (val) {
		if (val == "email") {
			return FormField.VALIDATE_EMAIL_ADDRESS;
		} else if (val == "phone") {
			return FormField.VALIDATE_PHONE_NUMBER;
		} else if (val == "ip") {
			return FormField.VALIDATE_IP_ADDRESS;
		} else if (val == "date") {
			return FormField.VALIDATE_DATE;
		} else if (val == "time") {
			return FormField.VALIDATE_TIME;
		} else if (val == "postal") {
			return FormField.VALIDATE_POSTAL_CODE;
		} else if (val == "special") {
			return FormField.VALIDATE_NO_SPECIAL_CHARS;
		}

		return val;
	 },

	/**
	 * @method _renderLabelNode
	 * @protected
	 * @description Draws the form field's label node into the contentBox
	 */
	_renderLabelNode : function () {
		var contentBox = this.get('contentBox'),
			labelNode = contentBox.query('label');
		
		if (!labelNode || labelNode.get('for') != this.get('id')) {
			labelNode = Y.Node.create(FormField.LABEL_TEMPLATE);
			contentBox.appendChild(labelNode);
		}
		
		this._labelNode = labelNode;	 
	},
	
	/**
	 * @method _renderFieldNode
	 * @protected
	 * @description Draws the field node into the contentBox
	 */
	_renderFieldNode : function () {
		var contentBox = this.get('contentBox'),
			field = contentBox.query('#' + this.get('id'));
				
		if (!field) {
			field = Y.Node.create(FormField.INPUT_TEMPLATE);
			contentBox.appendChild(field);
		}

		this._fieldNode = field;
	},

	/**
	 * @method _syncLabelNode
	 * @protected
	 * @description Syncs the the label node and this instances attributes
	 */
	_syncLabelNode : function () {
		if (this._labelNode) {
			this._labelNode.setAttrs({
				innerHTML : this.get('label')
			});
			this._labelNode.setAttribute('for', this.get('id'));
		}
	},

	/**
	 * @method _syncLabelNode
	 * @protected
	 * @description Syncs the fieldNode and this instances attributes
	 */
	_syncFieldNode : function () {
		this._fieldNode.setAttrs({
			name : this.get('name'), 
			type : this._nodeType,
			id : this.get('id'),
			value : this.get('value')
		});
		this._fieldNode.setAttribute('tabindex', FormField.tabIndex);
		FormField.tabIndex++;
	},

	/**
	 * @method _syncError
	 * @private
	 * @description Displays any pre-defined error message
	 */
	_syncError : function () {
		var err = this.get('error');
		if (err) {
			this._showError(err);
		}
	},
	
	/**
	 * @method _checkRequired
	 * @private
	 * @description if the required attribute is set to true, returns whether or not a value has been set
	 * @return {Boolean}
	 */
	_checkRequired : function () {
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
	_showError : function (errMsg) {
		var contentBox = this.get('contentBox'),
			errorNode = Y.Node.create('<span>' + errMsg + '</span>');
		
		errorNode.addClass('error');
		contentBox.insertBefore(errorNode,this._labelNode);
		
		this._errorNode = errorNode;
	},
	
	/**
	 * @method _clearError
	 * @private
	 * @description Removes the error node from this field
	 */
	_clearError : function () {
		if (this._errorNode) {
			var contentBox = this.get('contentBox');
			contentBox.removeChild(this._errorNode);
			this._errorNode = null;
		}
	},

	_enableInlineValidation : function () {
		this.after('valueChange', Y.bind(this.validateField, this));
	},

	_disableInlineValidation : function () {
		this.detach('valueChange', this.validateField, this);
	},
	
	/**
	 * @method validateField
	 * @description Runs the validation functions of this form field
	 * @return {Boolean}
	 */
	validateField : function (e) {
		var value = this.get('value'),
			validator = this.get('validator');

		this.set('error', null);

		if (e && e.src != 'ui') {
			return false;
		}

		if (!this._checkRequired()) {
			this.set('error', 'This field is required');
			return false;
		}
							
		return validator.call(this, value, this);
	},

	/**
	 * @method clear
	 * @description Clears the value of this field
	 */
	 clear : function () {
		this.set('value', '');
		this._fieldNode.set('value', '');
	},

	initializer : function () {
		this.publish('blur');
		this.publish('change');
		this.publish('focus');
	},

	destructor : function (config) {
	
	},

	renderUI : function () {
		this._renderLabelNode();
		this._renderFieldNode();
	},

	bindUI : function () {
		this._fieldNode.on('change', Y.bind(function (e) {
			this.set('value', this._fieldNode.get('value'), {src : 'ui'});
			this.fire('change', e);
		}, this));
		
		this.on('valueChange', Y.bind(function (e) {
			if (e.src != 'ui') {
				this._fieldNode.set('value', e.newVal);
			}			
		}, this));

		this._fieldNode.on('blur', Y.bind(function (e) {
			this.set('value', this._fieldNode.get('value'), {src : 'ui'});
			this.fire('blur', e);
		}, this));

		this._fieldNode.on('focus', Y.bind(function(e) {
			this.fire('focus', e);
		}, this));
		
		this.on('errorChange', Y.bind(function (e) {
			if (e.newVal) {
				this._showError(e.newVal);
			} else {
				this._clearError();
			}
		}, this));

		this.on('validateInlineChange', Y.bind(function (e) {
			if (e.newVal === true) {
				this._enableInlineValidation();
			} else {
				this._disableInlineValidation();
			}
		}, this));
	},

	syncUI : function () {
		this.get('boundingBox').removeAttribute('tabindex');
		this._syncLabelNode();
		this._syncFieldNode();
		this._syncError();

		if (this.get('validateInline') === true) {
			this._enableInlineValidation();
		}
	}
});

Y.FormField = FormField;
/**
 * @class TextField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A text field node
 */
function TextField () {
    TextField.superclass.constructor.apply(this,arguments);
}

Y.mix(TextField, {
    NAME : 'text-field'
});

Y.extend(TextField, Y.FormField, {
    _nodeType : 'text'
});

Y.TextField = TextField;
/**
 * @class PasswordField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A password field node
 */
function PasswordField () {
    PasswordField.superclass.constructor.apply(this,arguments);
}

Y.mix(PasswordField, {
    NAME : 'password-field'
});

Y.extend(PasswordField, Y.FormField, {
    _nodeType : 'password'
});

Y.PasswordField = PasswordField;
/**
 * @class CheckboxField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A checkbox field node
 */
function CheckboxField () {
    CheckboxField.superclass.constructor.apply(this,arguments);
}

Y.mix(CheckboxField, {
    NAME : 'checkbox-field'
});

Y.extend(CheckboxField, Y.FormField, {
    _nodeType : 'checkbox',

	_getValue : function (val, attrname) {
		if (this._fieldNode.get('checked') === true) {
			return val;
		} else {
			return '';
		}
	},

	initializer : function () {
		CheckboxField.superclass.initializer.apply(this, arguments);

		this.modifyAttr('value', {
			getter : function (val, attrName) {
				return this._getValue(val, attrName);
			},
			writeOnce : true
		});
	}
});

Y.CheckboxField = CheckboxField;
/**
 * @class HiddenField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A hidden field node
 */
function HiddenField () {
    HiddenField.superclass.constructor.apply(this,arguments);
}

Y.mix(HiddenField, {
	/**
	 * @property HiddenField.NAME
	 * @type String
	 * @static
	 */
    NAME : 'hidden-field',

	/**
	 * @property HiddenField.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {
		/**
		 * @attribute displayValue
		 * @type Boolean
		 * @default false
		 * @writeOnce
		 * @description Set to true to render this field with node displaying the current value
		 */
		displayValue : {
			value : false,
			writeOnce : true,
			validator : Y.Lang.isBoolean
		}
	}

});

Y.extend(HiddenField, Y.FormField, {
    _nodeType : 'hidden',

	/**
	 * @property _valueDisplayNode
	 * @protected
	 * @type Y.Node
	 * @description Node used to display the value of this field
	 */
	_valueDisplayNode : null,

	_renderValueDisplayNode : function() {
		if (this.get('displayValue') === true) {
			var div = Y.Node.create('<div></div>'),
				contentBox = this.get('contentBox');

			contentBox.appendChild(div);
			this._valueDisplayNode = div;
		}
	},

	renderUI : function () {
		HiddenField.superclass.renderUI.apply(this, arguments);
		this._renderValueDisplayNode();
	},

	bindUI : function () {
		HiddenField.superclass.bindUI.apply(this, arguments);

		if (this.get('displayValue') === true) {
			this.after('valueChange', Y.bind(function(m, e) {
				this._valueDisplayNode.set('innerHTML', e.newVal);
			}, this, true));
		}
	}
});

Y.HiddenField = HiddenField;
/**
 * @class TextareaField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A hidden field node
 */
function TextareaField () {
    TextareaField.superclass.constructor.apply(this,arguments);
}

Y.mix(TextareaField, {
    NAME : 'textarea-field',

    /** 
     * @property TextareaField.NODE_TEMPLATE
     * @type String
     * @description Template used to draw a textarea node
     */
    NODE_TEMPLATE : '<textarea></textarea>'
});

Y.extend(TextareaField, Y.FormField, {
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            field = contentBox.query('#' + this.get('id'));
                
        if (!field) {
            field = Y.Node.create(Y.substitute(TextareaField.NODE_TEMPLATE, {
                name : this.get('name'), 
                type : 'text',
                id : this.get('id'),
                value : this.get('value')
            }));
            contentBox.appendChild(field);
        }

		field.setAttribute('tabindex', Y.FormField.tabIndex);
		Y.FormField.tabIndex++;
        
        this._fieldNode = field;
    }
});

Y.TextareaField = TextareaField;
/**
 * @class ChoiceField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A form field which allows one or multiple values from a 
 * selection of choices
 */
function ChoiceField() {
    ChoiceField.superclass.constructor.apply(this,arguments);
}

Y.mix(ChoiceField, {
    NAME : 'choice-field',
    
	ATTRS : { 
        /** 
         * @attribute choices
         * @type Array
         * @description The choices to render into this field
         */
        choices : { 
            validator : function (val) {
                return this._validateChoices(val);
            }
        },  

        /** 
         * @attribute multiple
         * @type Boolean
         * @default false
         * @description Set to true to allow multiple values to be selected
         */
        multiple : { 
            validator : Y.Lang.isBoolean,
            value : false
        }   
    }  
});

Y.extend(ChoiceField, Y.FormField, {
    /**
     * @method _validateChoices
     * @protected
     * @param {Object} val
     * @description Validates the value passe to the choices attribute
     */
    _validateChoices : function (val) {
        if (!Y.Lang.isArray(val)) {
            return false;
        }
		
		var valid = true;

		Y.Array.each(val, function(c, i, a) {
            if (!Y.Lang.isObject(c)) {
                valid = false;
				return;
            }
            if (!c.label ||
                !Y.Lang.isString(c.label) ||
                !c.value ||
                !Y.Lang.isString(c.value)) {
					valid = false;
					return;
            }
        });

        return valid;
    },

    _renderLabelNode : function () {
        var contentBox = this.get('contentBox'),
            titleNode = Y.Node.create('<span>' + this.get('label') + '</span>');
        
        contentBox.appendChild(titleNode);
        
        this._labelNode = titleNode;
    },
    
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            choices = this.get('choices'),
            elLabel, elField;
       
		Y.Array.each(choices, function(c, i, a) {
            elLabel = Y.Node.create(FormField.LABEL_TEMPLATE);
            contentBox.appendChild(elLabel);
            
            elField = Y.Node.create(FormField.INPUT_TEMPLATE);
            contentBox.appendChild(elField);
        });

		this._fieldNode = contentBox.all('input');
    },

	_syncFieldNode : function () {
		var choices = this.get('choices'),
			contentBox = this.get('contentBox'),
			labels = contentBox.all('label'),
			choiceType = (this.get('multiple') === true ? 'checkbox' : 'radio');

		labels.each(function (node, index, list) {
			node.setAttrs({
				innerHTML : choices[index].label
			});
			node.setAttribute('for', (this.get('id') + '_choice' + index));
		}, this);

		this._fieldNode.each(function (node, index, list) {
			node.setAttrs({
				value : choices[index].value,
				id : (this.get('id') + '_choice' + index),
				name : this.get('name'),
				type : choiceType
			});

			// Setting value above doesn't seem to work (bug?), this forces it
			var domNode = Y.Node.getDOMNode(node);
			domNode.value = choices[index].value;
		}, this);
	},
            
    clear : function () {
        this._fieldNode.each(function (node, index, list) {
            node.setAttribute('checked', false);
        }, this);
        
        this.set('value', '');
    },

	bindUI : function () {
		this._fieldNode.on('change', Y.bind(function (e) {
			this._fieldNode.each(function (node, index, list) {
				if (node.get('checked') === true) {
					this.set('value', node.get('value'));
				}
			}, this);
		}, this));
	}

});

Y.ChoiceField = ChoiceField;
/**
 * @class SelectField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A select field node
 */
function SelectField () {
    SelectField.superclass.constructor.apply(this,arguments);
}

Y.mix(SelectField, {
    NAME : 'select-field',

    /**
     * @property SelectField.NODE_TEMPLATE
     * @type String
     * @description Template used to draw a select node
     */
    NODE_TEMPLATE : '<select></select>',

	/**
	 * @property SelectField.OPTION_TEMPLATE
	 * @type String
	 * @description Template used to draw an option node
	 */
	 OPTION_TEMPLATE : '<option></option>'
});

Y.extend(SelectField, Y.ChoiceField, {
	/**
	 * @method _renderFieldNode
	 * @protected
	 * @description Draws the select node into the contentBox
	 */
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            field = contentBox.query('#' + this.get('id'));
                
        if (!field) {
            field = Y.Node.create(SelectField.NODE_TEMPLATE);
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
    _renderOptionNodes : function () {
        var choices = this.get('choices'),
            elOption;
       
		// Create the "Choose one" option
		elOption = Y.Node.create(SelectField.OPTION_TEMPLATE);
		this._fieldNode.appendChild(elOption);

		Y.Array.each(choices, function (c, i, a) {
			elOption = Y.Node.create(SelectField.OPTION_TEMPLATE);
            this._fieldNode.appendChild(elOption);
        }, this);
    },

	/**
	 * @method _syncFieldNode
	 * @protected
	 * @description Syncs the select node with the instance attributes
	 */
	_syncFieldNode : function () {
		this._fieldNode.setAttrs({
			name : this.get('name'), 
			id : this.get('id'),
			multiple : (this.get('multiple') === true ? 'multiple' : '')
		});
	},

	/**
	 * @method _syncOptionNodes
	 * @protected
	 * @description Syncs the option nodes with the choices attribute
	 */
	_syncOptionNodes : function () {
        var choices = this.get('choices'),
			contentBox = this.get('contentBox'),
			options = contentBox.all('option');

		options.each(function(node, index, nodeList) {
			var label = (index === 0 ? 'Choose one' : choices[index - 1].label),
				val = (index === 0 ? '' : choices[index - 1].value);

			node.setAttrs({
				innerHTML : label,
				value : val
			});
		}, this);
	},
    
	/**
	 * @method clear
	 * @description Restores the selected option to the default
	 */
    clear : function () {
        this._fieldNode.value = '';
    },

	bindUI : function () {
		SelectField.superclass.constructor.superclass.bindUI.apply(this, arguments);
	},

	syncUI : function () {
		SelectField.superclass.syncUI.apply(this, arguments);
		this._syncOptionNodes();
	}
});

Y.SelectField = SelectField;
function Button () {
    Button.superclass.constructor.apply(this,arguments);
}

Y.mix(Button, {
    NAME : 'button',
    
    HTML_PARSER : {
        
    },

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

Y.extend(Button, Y.FormField, {
    _renderButtonNode : function () {
        var contentBox = this.get('contentBox'), bn;
        
        bn = Y.Node.create(Button.NODE_TEMPLATE);
        contentBox.appendChild(bn);
        this._fieldNode = bn;
    },

	_syncLabelNode: function () {},

	_syncFieldNode : function () {
		this._fieldNode.setAttrs({
            innerHTML : this.get('label'),
            id : this.get('id')
        });
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
});

Y.Button = Button;


}, 'gallery-2009.12.08-22' ,{requires:['node', 'widget', 'io-base']});
