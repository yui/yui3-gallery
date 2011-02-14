/**
 * @class ChoiceField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A form field which allows one or multiple values from a 
 * selection of choices
 */
Y.ChoiceField = Y.Base.create('choice-field', Y.FormField, [Y.WidgetParent, Y.WidgetChild], {
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
            titleNode = Y.Node.create('<span></span>');
        
        titleNode.set('innerHTML', this.get('label'));
        contentBox.appendChild(titleNode);
        
        this._labelNode = titleNode;
    },
    
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            choices = this.get('choices'),
            multiple = this.get('multi'),
            fieldType = (multiple === true ? Y.CheckboxField : Y.RadioField);
        
        Y.Array.each(choices, function(c, i, a) {
            var cfg = {
                    value : c.value,
                    id : (this.get('id') + '_choice' + i),
                    name : this.get('name'),
                    label : c.label
                },
                field = new fieldType(cfg);
        		
            field.render(contentBox);
        }, this);
        this._fieldNode = contentBox.all('input');
    },
    
	_syncFieldNode : function () {
            var choice = this.get('value');

            if (choice) {
                this._fieldNode.some(function (node, index, list) {
                    if (node.get('value') == choice) {
                        node.setAttribute('checked', true);
                        return true;
                    }
                }, this);
            }
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

}, {
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
         * @attribute multi
         * @type Boolean
         * @default false
         * @description Set to true to allow multiple values to be selected
         */
        multi : { 
            validator : Y.Lang.isBoolean,
            value : false
        }   
    }  
});
