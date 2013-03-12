/**
 * This holds the configuration for a single widget that is supposed to be created.
 * @constructor
 */
function CustomWidgetConfig() {
    this.properties = {};
    this.globalConfig = null;
    this.srcNode = null;
}

CustomWidgetConfig.prototype.setGlobalConfig = function(callbackName) {
    this.globalConfig = callbackName;
};

CustomWidgetConfig.prototype.addProperty = function(name, value) {
    this.properties[name] = value;
};

CustomWidgetConfig.prototype.setSrcNode = function(srcNode) {
    this.srcNode = srcNode;
};

CustomWidgetConfig.buildFromElement = function(element) {
    var widgetConfig = new CustomWidgetConfig(),
        i, attributeName, attributeValue;

    for (i = 0; i < element.attributes.length; i++) {
        attributeName = element.attributes[i].name;
        attributeValue = element.attributes[i].value;

        if (attributeName === "ui-config") {
            widgetConfig.setGlobalConfig(attributeValue);
            continue;
        }

        if (attributeName === "ui-src") {
            widgetConfig.setSrcNode(attributeValue);
            widgetConfig.addProperty("srcNode", "#" + getAttribute(element, "id"));
            continue;
        }

        if (attributeName === "id" || /^ui-/.test(attributeName)) {
            continue;
        }

        widgetConfig.addProperty(attributeName, attributeValue);
    }

    return widgetConfig;
};

