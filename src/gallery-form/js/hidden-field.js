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
