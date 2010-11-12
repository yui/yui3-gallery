/**
 * @class TextareaField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A hidden field node
 */
Y.TextareaField = Y.Base.create('textarea-field', Y.FormField, [Y.WidgetChild], {
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            field = contentBox.one('#' + this.get('id'));
                
        if (!field) {
            field = Y.Node.create(Y.TextareaField.NODE_TEMPLATE);
            field.setAttrs({
                name : this.get('name'), 
                innerHTML : this.get('value')
            });
            contentBox.appendChild(field);
        }

		field.setAttribute('tabindex', Y.FormField.tabIndex);
		Y.FormField.tabIndex++;
        
        this._fieldNode = field;
    }
}, {
    /** 
     * @property TextareaField.NODE_TEMPLATE
     * @type String
     * @description Template used to draw a textarea node
     */
    NODE_TEMPLATE : '<textarea></textarea>'
});
