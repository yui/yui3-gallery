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
