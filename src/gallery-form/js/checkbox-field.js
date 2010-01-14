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
