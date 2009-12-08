/**
 * @class PasswordField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A password field node
 */
function PasswordField () {
    PasswordField.superclass.constructor.apply(this,arguments);
}

Y.mix(PasswordField, {
    NAME : 'password-field'
});

Y.extend(PasswordField, Y.FormField, {
    _nodeType : 'password'
});

Y.PasswordField = PasswordField;
