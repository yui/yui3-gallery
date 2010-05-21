/**
 * @class FileField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A file field node
 */
function FileField () {
    FileField.superclass.constructor.apply(this,arguments);
}
 
Y.mix(FileField, {
    NAME : 'file-field',

	FILE_INPUT_TEMPLATE : '<input type="file" />'
});
 
Y.extend(FileField, Y.FormField, {
    _nodeType : 'file',

	_renderFieldNode : function () {
		var contentBox = this.get('contentBox'),
			field = contentBox.query('#' + this.get('id'));
				
		if (!field) {
			field = Y.Node.create(FileField.FILE_INPUT_TEMPLATE);
			contentBox.appendChild(field);
		}

		this._fieldNode = field;
	}
});
 
Y.FileField = FileField;
