/**
 *
 * @param {String} nodeId The ID in the DOM where the node should be inserted.
 * @param {String} className The full name of the class to be instantiated, e.g. Y.Button
 * @param config WidgetConfig The configuration for that widget that will be sent on construction.
 * @constructor
 */
function WidgetDefinition(nodeId, className, config) {
    this.nodeId = nodeId;
    this.className = className;
    this.config = config;
}
