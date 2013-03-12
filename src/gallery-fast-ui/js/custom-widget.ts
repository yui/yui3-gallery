/**
 *
 * @param nodeId   : String             The ID in the DOM where the node should be inserted.
 * @param fullName : String             The Full name of the class to be instantiated, e.g. Y.Button
 * @param config   : CustomWidgetConfig The Configuration for that widget that will be sent on construction.
 * @constructor
 */
function CustomWidget(nodeId, fullName, config) {
    this.nodeId = nodeId;
    this.fullName = fullName;
    this.config = config;
}
