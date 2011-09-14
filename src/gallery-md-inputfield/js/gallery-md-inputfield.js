/**
 * Base class for all form fields to inherit from
 * @module gallery-md-inputfield
 */
 
"use strict";

var Lang = Y.Lang,
	BBX = 'boundingBox',
	CBX = 'contentBox',
	UI = 'ui',
	ID_INPUT = 'idInput',
	LABEL = 'label',
	VALUE = 'value',
	TYPE = 'type',
	FORMATTER = 'formatter',
	PARSER = 'parser',
	VALIDATOR = 'validator',
	INPUT = 'input',
	ERR_MSG = 'errorMsg',
	ERROR = 'error',
	ERR_PANEL = 'error-panel',
	TITLE = 'title',
	stringOrNull = function(value) {
		return Lang.isString(value) || Lang.isNull(value);
	};
	
Y.InputField = Y.Base.create(
	'input-field',
	Y.Widget,
	[Y.MakeNode, Y.WidgetChild],
	{
		renderUI: function () {
			this.get(CBX).append(this._makeNode());
			this._locateNodes();
			if (!this.get(ID_INPUT)) {
				this.set(ID_INPUT, this._inputNode._yuid);
			}
		},
		bindUI: function () {
			// interim solution because as of 3.4.0, valueChange cannot be listened to by delegation
			this._eventHandles.push(this._inputNode.after('valueChange', this._afterInputValueChange, this));
		},
		_uiSetIdInput: function (value) {
			this._inputNode.set('id', value);
			this._labelNode.set('for', value);
		},
		_uiSetLabel: function (value) {
			this._labelNode.setContent(value);
		},
		_uiSetValue: function (value, src) {
			if (src === UI) {
				return;
			}
			this._inputNode.set(VALUE, this.get(FORMATTER)(value) || '');
		},
		_uiSetErrorMsg: function (value) {
			var l = this._labelNode,
				bbx = this.get(BBX);
			if (value) {
				bbx.addClass(this._classNames[ERROR]);
				l.set(TITLE, value);
				this._inputNode.focus();
			} else {
				bbx.removeClass(this._classNames[ERROR]);
				l.set(TITLE, '');
			}
		},
		_uiSetType: function (value) {
			if (Y.DataTypes && Y.DataTypes[value]) {
				this.setAttrs(Y.DataTypes[value].UI || {});
			}
		},
		_afterInputValueChange: function (ev) {
			this.set(VALUE, this.get(PARSER)(ev.target.get(VALUE)), {src: UI});
		},
		_afterLabelClick: function () {
			var errMsg = this.get(ERR_MSG),
				panel = Y.InputField._errorPanel;
			if (errMsg && Y.Panel) {
				if (!panel) {
					panel = Y.InputField._errorPanel = new Y.Panel({
						hideOn: [   
							{
								eventName: "clickoutside"
							}
						]
					}).render(Y.config.doc.body);
					panel.getStdModNode(Y.WidgetStdMod.HEADER).insert('<span></span>',0);
					panel.get(BBX).addClass(this._classNames[ERR_PANEL]);
				}
				panel.setAttrs({
					bodyContent:errMsg,
					align: {
						node: this._labelNode,
						points:[Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BR]
					},
					visible: true
				});
				panel.get(CBX).one('span').setContent(this.get(LABEL));
			}
		},
		_afterInputBlur: function (value)  {
			this.set(ERR_MSG, this.get(VALIDATOR)(value));
		},
		_fnIfNull: function (value) {
			if (Lang.isFunction(value)) {
				return value;
			}
			if (Lang.isNull(value)) {
				return function (value) {
					return value;
				};
			}
			return Y.Attribute.INVALID_VALUE;
		},
		_validatorSetter: function (value) {
			if (Lang.isFunction(value)) {
				return value;
			}
			if (Lang.isNull(value)) {
				return function () {
					return null;
				};
			}
			return Y.Attribute.INVALID_VALUE;
		}
			
				
				
	},
	{
		_errorPanel: null,
		_CLASS_NAMES: [LABEL, INPUT, ERROR, ERR_PANEL],
		_TEMPLATE: '<label class="{c label}">{@ label}</label><input type="text" class="{c input}"  />',
		_ATTRS_2_UI: {
			SYNC: [ID_INPUT, TYPE, VALUE, ERR_MSG],
			BIND: [ID_INPUT, TYPE, VALUE, LABEL, ERR_MSG]
		},
		_EVENTS: {
			// input: 'valueChange',  // valueChange cannot (yet) be listened to by delegation: see this.bindUI
			label: 'click',
			input: 'blur'
		},
		ATTRS: {
			idInput: {
				validator: Lang.isString,
				value: null
			},
			label: {
				validator: Lang.isString,
				value: ''
			},
			value: {
				value: ''
			},
			type: {
				value: null,
				validator: stringOrNull
			},
			parser: {
				setter: '_fnIfNull',
				value: null
			},
			formatter: {
				setter: '_fnIfNull',
				value: null
			},
			validator: {
				setter: '_validatorSetter',
				value: null
			},
			errorMsg: {
				value: null,
				validator: stringOrNull
			}
		}
	}
);