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
    NAME : 'checkbox-field',

	ATTRS : {
		'checked' : {
			value : false,
			validator : Y.Lang.isBoolean
		}
	}
});

Y.extend(CheckboxField, Y.FormField, {
    _nodeType : 'checkbox',

	_syncChecked : function () {
		this._fieldNode.set('checked', this.get('checked'));
	},

	initializer : function () {
		CheckboxField.superclass.initializer.apply(this, arguments);
	},

	/*renderUI : function () {
		this._renderFieldNode();
		this._renderLabelNode();
	},*/

	syncUI : function () {
		CheckboxField.superclass.syncUI.apply(this, arguments);
		this._syncChecked();
	},

	bindUI :function () {
		CheckboxField.superclass.bindUI.apply(this, arguments);
		this.after('checkedChange', Y.bind(function(e) {
			if (e.src != 'ui') {
				this._fieldNode.set('checked', e.newVal);
			}
		}, this));

		this._fieldNode.after('change', Y.bind(function (e) {
			this.set('checked', e.currentTarget.get('checked'), {src : 'ui'});
		}, this));
	}
});

Y.CheckboxField = CheckboxField;
