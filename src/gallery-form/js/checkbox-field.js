/**
 * @class CheckboxField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A checkbox field node
 */
function CheckboxField () {
    CheckboxField.superclass.constructor.apply(this,arguments);
}

Y.mix(CheckboxField, {
    NAME : 'checkbox-field'
});

Y.extend(CheckboxField, Y.FormField, {
    _nodeType : 'checkbox'
});

Y.CheckboxField = CheckboxField;
