/**
 * @class TextareaField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A hidden field node
 */
Y.TextareaField = Y.Base.create('textarea-field', Y.FormField, [Y.WidgetChild], {

    FIELD_TEMPLATE : '<textarea></textarea>'

});
