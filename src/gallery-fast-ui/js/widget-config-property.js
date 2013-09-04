/**
 * @public
 * @param name
 * @param value
 * @param type type can be any of : string (default if it's an attribute), ui (default if it's an ui:config element),
 *              or js.
 * @constructor
 */
function WidgetConfigProperty(name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
}
