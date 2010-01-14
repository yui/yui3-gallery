/**
 * @class TextField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A text field node
 */
function TextField () {
    TextField.superclass.constructor.apply(this,arguments);
}

Y.mix(TextField, {
    NAME : 'text-field'
});

Y.extend(TextField, Y.FormField, {
    _nodeType : 'text'
});

Y.TextField = TextField;
