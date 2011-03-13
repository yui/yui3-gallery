/**
 * @class FileField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A file field node
 */

Y.FileField = Y.Base.create('file-field', Y.FormField, [Y.WidgetChild], {
    _renderFieldNode : function () {
        var contentBox = this.get('contentBox'),
            field = contentBox.one('#' + this.get('id'));
                        
        if (!field) {
            field = Y.Node.create(Y.FileField.FILE_INPUT_TEMPLATE);
            contentBox.appendChild(field);
        }

        this._fieldNode = field;
    }
}, {
    FILE_INPUT_TEMPLATE : '<input type="file" />'
});
