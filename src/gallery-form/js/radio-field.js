/**
 * @class RadioField
 * @extends CheckboxField
 * @param config {Object} Configuration object
 * @constructor
 * @description A Radio field node
 */
function RadioField () {
    RadioField.superclass.constructor.apply(this,arguments);
}

Y.mix(RadioField, {
    NAME : 'radio-field'
});

Y.extend(RadioField, Y.CheckboxField, {
    _nodeType : 'radio'
});

Y.RadioField = RadioField;
