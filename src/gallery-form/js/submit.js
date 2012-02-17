/**
 * @class SubmitButton
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A submit button
 */
Y.SubmitButton = Y.Base.create('submit-button', Y.FormField, [Y.WidgetChild], {
    _renderLabelNode : function () {}
});
