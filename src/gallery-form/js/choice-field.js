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

        for (var i=0, l=val.length;i<l;i++) {
            if (!Y.Lang.isObject(val[i])) {
                return false;
            }
            if (!val[i].label ||
                !Y.Lang.isString(val[i].label) ||
                !val[i].value ||
                !Y.Lang.isString(val[i].value)) {
                return false;
            }
        }

        return true;
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
            i=0, l=choices.length,
            elLabel, elField;
        
        for(;i<l;i++) {
            elLabel = Y.Node.create(FormField.LABEL_TEMPLATE);
            contentBox.appendChild(elLabel);
            
            elField = Y.Node.create(FormField.INPUT_TEMPLATE);
            contentBox.appendChild(elField);
        }

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
