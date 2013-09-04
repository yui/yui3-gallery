function WidgetConfig(properties, globalConfigKey, srcNode) {
    this.properties = !!properties ? properties : {};
    this.globalConfigKey = globalConfigKey;
    this.srcNode = srcNode;
}

WidgetConfig.prototype.addProperty = function(name, value, type) {
    type = !!type ? type : "string";

    this.properties[name] = new WidgetConfigProperty(name, value, type);
};

/**
 * Builds a WidgetConfig from the DOM element given.
 */
WidgetConfig.buildFromElement = function(id, element, configNodes) {
    var widgetConfig = new WidgetConfig();

    readConfigFromAttributes(id, widgetConfig, element);
    readConfigFromElements(widgetConfig, configNodes);

    return widgetConfig;
};

/**
 * Read values that should be passed to the config from the attributes of the element.
 * @param {string} id - unique ID in the DOM.
 * @param {WidgetConfig} widgetConfig
 * @param element
 */
function readConfigFromAttributes(id, widgetConfig, element) {
    var attribute,
        attributeName,
        attributeValue,
        attributeNamespace,
        i;

    for (i = 0; i < element.attributes.length; i++) {
        attribute = element.attributes[i];

        attributeName = attribute.localName || attribute.baseName;
        attributeValue = attribute.value;
        attributeNamespace = !!attribute.namespaceURI ? attribute.namespaceURI : null;

        if (attributeName === "config-key" && attributeNamespace === "fastui") {
            widgetConfig.globalConfigKey = attributeValue;
            continue;
        }

        if (attributeName === "srcNode" && attributeNamespace === "fastui") {
            widgetConfig.srcNode = attributeValue;
            widgetConfig.addProperty("srcNode", "#" + id);

            continue;
        }

        if (attributeName === "id" || !!attributeNamespace) {
            continue;
        }

        widgetConfig.addProperty(attributeName, attributeValue);
    }
}

/**
 * Read the values that should be passed to the config from &lt;ui:config&gt; elements.
 * @param widgetConfig
 * @param configNodes
 */
function readConfigFromElements(widgetConfig, configNodes) {
    var configNode, name, value, type, i;

    for (i = 0; i < configNodes.length; i++) {
        configNode = configNodes[i];

        name = configNode.getAttribute("name");
        type = configNode.getAttribute("type");
        type = !!type ? type : "js"; // the default type for config elements is "js"

        value = extractContents(configNode, type);

        widgetConfig.addProperty(name, value, type);
    }
}

/**
 * Extract the contents from the element depending on the type of the node.
 */
function extractContents(xmlNode, type) {
    if ("ui" === type) {
        return getUiNodeAsString(xmlNode);
    } else if ("js" === type) {
        return getJsNodeAsString(xmlNode);
    }
    return getStringNodeAsString(xmlNode);
}

/**
 * Returns the contents of the node, and wrap it in a span, since multiple nodes could exist.
 * @param xmlNode
 */
function getUiNodeAsString(xmlNode) {
    var i,
        result = "<span>";

    for (i = 0; i < xmlNode.childNodes.length; i++) {
        result += Y.XML.format(xmlNode.childNodes[i]);
    }

    result += "</span>";

    return result;
}

/**
 * Returns the contents of the JS node as a string.
 * @param xmlNode
 * @returns {*}
 */
function getJsNodeAsString(xmlNode) {
    return xmlNode.textContent || xmlNode.text;
}

/**
 * Returns the contents of the String node as a string.
 * @param xmlNode
 * @returns {*}
 */
function getStringNodeAsString(xmlNode) {
    return xmlNode.textContent || xmlNode.text;
}

