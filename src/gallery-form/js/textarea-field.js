/**
 * @class TextareaField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A hidden field node
 */
function TextareaField () {
    TextareaField.superclass.constructor.apply(this,arguments);
}

Y.mix(TextareaField, {
    NAME : 'textarea-field',

    /** 
     * @property TextareaField.NODE_TEMPLATE
     * @type String
     * @description Template used to draw a textarea node
     */
    NODE_TEMPLATE : '<textarea></textarea>'
});

Y.extend(TextareaField, Y.FormField, {
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            field = contentBox.query('#' + this.get('id'));
                
        if (!field) {
            field = Y.Node.create(Y.substitute(TextareaField.NODE_TEMPLATE, {
                name : this.get('name'), 
                type : 'text',
                id : this.get('id'),
                value : this.get('value')
            }));
            contentBox.appendChild(field);
        }

		field.setAttribute('tabindex', Y.FormField.tabIndex);
		Y.FormField.tabIndex++;
        
        this._fieldNode = field;
    }
});

Y.TextareaField = TextareaField;
