/**
 * @class SelectField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A select field node
 */
Y.SelectField = Y.Base.create('select-field', Y.ChoiceField, [Y.WidgetParent, Y.WidgetChild], {

    FIELD_TEMPLATE : '<select></select>',

    /**
     * @property SelectField.DEFAULT_OPTION_TEXT
     * @type String
     * @description The display title of the default choice in the select box
     */
    DEFAULT_OPTION_TEXT : 'Choose one',	

    /**
	 * @method _renderFieldNode
	 * @protected
	 * @description Draws the select node into the contentBox
	 */
    _renderFieldNode: function() {
        Y.SelectField.superclass.constructor.superclass._renderFieldNode.apply(this, arguments);
        this._renderOptionNodes();
    },

    /**
	 * @method _renderOptionNodes
	 * @protected
	 * @description Renders the option nodes into the select node
	 */
    _renderOptionNodes: function() {
        var choices = this.get('choices'),
        elOption;

        // Create the "Choose one" option
        if (this.get('useDefaultOption') === true) {
            elOption = Y.Node.create(Y.SelectField.OPTION_TEMPLATE);
            this._fieldNode.appendChild(elOption);
        }

        Y.Array.each(choices,
        function(c, i, a) {
            elOption = Y.Node.create(Y.SelectField.OPTION_TEMPLATE);
            this._fieldNode.appendChild(elOption);
        },
        this);
    },

    /**
	 * @method _syncFieldNode
	 * @protected
	 * @description Syncs the select node with the instance attributes
	 */
    _syncFieldNode: function() {
        Y.SelectField.superclass.constructor.superclass._syncFieldNode.apply(this, arguments);

        this._fieldNode.setAttrs({
            size : this.get('size'),
            multiple: (this.get('multi') === true ? 'multiple': '')
        });
    },

    /**
	 * @method _syncOptionNodes
	 * @protected
	 * @description Syncs the option nodes with the choices attribute
	 */
    _syncOptionNodes: function() {
        var choices = this.get('choices') || [],
        contentBox = this.get('contentBox'),
        options = contentBox.all('option'),
        useDefaultOption = this.get('useDefaultOption'),
        currentVal = this.get('value');

        if (useDefaultOption === true) {
            choices.unshift({
                label : this.DEFAULT_OPTION_TEXT,
                value: ''
            });
        }

        options.each(function(node, index, nodeList) {
            var label = choices[index].label,
            val = choices[index].value;

            node.setAttrs({
                innerHTML: label,
                value: val
            });

            if (currentVal == val) {
                node.setAttrs({
                    selected: true,
                    defaultSelected: true
                });
            }
        },
        this);

        if (!currentVal && !useDefaultOption && choices[0]) {
            this.set('value', choices[0].value);
        }
    },

    /**
     * @method _afterChoiceChange
     * @description When the available options for the select field change,
     *     the old ones are removed and the new ones are rendered.
     */
    _afterChoicesChange: function(evt) {
        var options = this._fieldNode.all("option");
        options.remove();
        this._renderOptionNodes();
        this._syncOptionNodes();
    },

    /**
	 * @method clear
	 * @description Restores the selected option to the default
	 */
    clear: function() {
        this._fieldNode.value = '';
    },

    bindUI: function() {
        Y.SelectField.superclass.constructor.superclass.bindUI.apply(this, arguments);
        this.after('choicesChange', this._afterChoicesChange);
    },

    syncUI: function() {
        Y.SelectField.superclass.syncUI.apply(this, arguments);
        this._syncOptionNodes();
    }
},
{
    /**
	 * @property SelectField.OPTION_TEMPLATE
	 * @type String
	 * @description Template used to draw an option node
	 */
    OPTION_TEMPLATE: '<option></option>',

    ATTRS: {
        /**
	     * @attribute useDefaultOption
	     * @type Boolean
	     * @default true
	     * @description If true, the first option will use the DEFAULT_OPTION_TEXT
	     *              to create a blank option
	     */
        useDefaultOption: {
            validator: Y.Lang.isBoolean,
            value: true
        },

        /** 
         * @attribute choices
         * @type Array
         * @description The choices to render into this field
         */
        choices: {
            validator: function(val) {
                if (this.get("useDefaultOption") &&
                    Y.Lang.isArray(val) &&
                    val.length === 0) {
                    // Empty arrays are okay if useDefaultOption is 'true'
                    return true;
                } else {
                    return this._validateChoices(val);
                }
            }
        },

        /**
         * @attribute size
         * @type String
         * @default 0
         * @description Value of 'size' attribute of the select element.
         */
        size : {
            validator : Y.Lang.isString,
            value : '0'
        }
    }
});
