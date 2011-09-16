
var Lang = Y.Lang,
	BBX = 'boundingBox',
	CBX = 'contentBox',
	UI = 'ui',
	LABEL = 'label',
	stringOrNull = function(value) {
		return Lang.isString(value) || Lang.isNull(value);
	};
	
Y.FieldGroup = Y.Base.create(
	'field-group',
	Y.Widget,
	[Y.MakeNode, Y.WidgetParent],
	{
		CONTENT_TEMPLATE: '<fieldset></fieldset>',
		renderUI: function () {
			this.get(CBX).append(this._makeNode());
			this._locateNodes();
		},
		_uiSetLabel: function (value) {
			this._labelNode.setContent(value || '');
		}
	},
	{
		_TEMPLATE: '<legend class="{c label}"></legend>',
		_CLASS_NAMES: [LABEL],
		_ATTRS_2_UI: {
			SYNC: [LABEL],
			BIND: [LABEL]
		},
		ATTRS: {
			label: {
				value: null,
				validator: stringOrNull
			},
			defaultChildType: {
				value: Y.InputField
			}
		}
	}
);