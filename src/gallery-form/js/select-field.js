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
	OPTION_TEMPLATE : '<option></option>',

	/**
	 * @property SelectField.DEFAULT_OPTION_TEXT
	 * @type String
	 * @description The display title of the default choice in the select box
	 */
	DEFAULT_OPTION_TEXT : 'Choose one',
	
	ATTRS : {
	    /**
	     * @attribute useDefaultOption
	     * @type Boolean
	     * @default true
	     * @description If true, the first option will use the DEFAULT_OPTION_TEXT
	     *              to create a blank option
	     */
	    useDefaultOption : {
	        validator : Y.Lang.isBoolean,
	        value : true
	    }
	}
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
		if (this.get('useDefaultOption') === true) {
    		elOption = Y.Node.create(SelectField.OPTION_TEMPLATE);
    		this._fieldNode.appendChild(elOption);
		}

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
		SelectField.superclass.constructor.superclass._syncFieldNode.apply(this, arguments);

		this._fieldNode.setAttrs({
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
			options = contentBox.all('option'),
			useDefaultOption = this.get('useDefaultOption'),
			currentVal = this.get('value');

        if (useDefaultOption === true) {
            choices.unshift({
                label : SelectField.DEFAULT_OPTION_TEXT,
                value : ''
            });
        }

		options.each(function(node, index, nodeList) {
			var label = choices[index].label,
				val = choices[index].value;

			node.setAttrs({
				innerHTML : label,
				value : val
			});

			if (currentVal == val) {
				node.setAttrs({
					selected : true,
					defaultSelected : true
				});
			}
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
