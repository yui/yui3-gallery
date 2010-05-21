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
			Y.log('Choice values must be in an array');
            return false;
        }
		
		var i = 0, len = val.length;
		
		for (; i < len; i++) {
            if (!Y.Lang.isObject(val[i])) {
				Y.log('Choice that is not an object cannot be used');
                delete val[i];
				continue;
            }
            if (!val[i].label ||
                !Y.Lang.isString(val[i].label) ||
                !val[i].value ||
                !Y.Lang.isString(val[i].value)) {
					Y.log('Choice without label and value cannot be used');
					delete val[i];
					continue;
            }
        }
		
		if (val.length === 0) {
			return false;
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
            choices = this.get('choices');
       
		Y.Array.each(choices, function(c, i, a) {
			var cfg = {
					value : c.value,
					id : (this.get('id') + '_choice' + i),
					name : this.get('name'),
					label : c.label
				},
				fieldType = (this.get('multiple') === true ? Y.CheckboxField : Y.RadioField),
				field = new fieldType(cfg);
			
			field.render(contentBox);
        }, this);

		this._fieldNode = contentBox.all('input');
    },

	_syncFieldNode : function () {},

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
