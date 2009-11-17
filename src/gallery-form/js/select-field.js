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
