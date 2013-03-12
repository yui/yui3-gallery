YUI.add('gallery-fast-ui', function (Y, NAME) {

function getAttribute(element, name) {
    if (!element.attributes) {
        return null;
    }

    for (var i = 0; i < element.attributes.length; i++) {
        if (element.attributes[i].name === name) {
            return element.attributes[i].value;
        }
    }

    return null;
}
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
function isIdPresent(element) {
    return !!getAttribute(element, "id");
}

function getExistingId(element) {
    return getAttribute(element, "id");
}

function generateNewId(element) { // FIXME: generation should be a bit more powerful.
    var newId = Y.guid("fast-ui-id-");
    element.setAttribute("id", newId);

    return newId;
}

function generateID(element) {
    if (isIdPresent(element)) {
        return getExistingId(element);
    } else {
        return generateNewId(element);
    }
}

function getElementForTarget(targetElement) {
    var srcNodeType = getAttribute(targetElement, "ui-src");

    return srcNodeType ? srcNodeType : "span";
}


function createElement(targetElement) {
    var element = targetElement.ownerDocument.createElement(getElementForTarget(targetElement)),
        child;

    element.setAttribute("id", getAttribute(targetElement, "id"));

    while (targetElement.firstChild) {
        child = targetElement.firstChild;
        targetElement.removeChild(child);
        element.appendChild(child);
    }

    return element;
}

function replaceElement(element, newElement) {
    if (element.parentNode.nodeType !== 9) {
        element.parentNode.insertBefore(newElement, element);
        element.parentNode.removeChild(element);
    }

    return newElement;
}

// FIXME: this whole parsing should be externalized.
function preXmlParse(xmlContent) {
    var widgetsToCreate = [],
        variables = {},
        doc = Y.XML.parse(xmlContent),
        htmlToCreate;


    function traverseElement(element) {
        var i;

        for (i = 0; i < element.childNodes.length; i++) {
            traverseElement(element.childNodes[i]);
        }

        if (getAttribute(element, "ui-field")) {
            variables[ getAttribute(element, "ui-field") ] = generateID(element);
        }

        if (element.namespaceURI) { // there is a namespace URI, thus I need to create a custom object
            widgetsToCreate.push(
                new CustomWidget(
                    generateID(element), // node ID
                    element.namespaceURI + "." + (element.localName || element.baseName), // full class
                    CustomWidgetConfig.buildFromElement(element) // configuration
                )
            );

            return replaceElement(element, createElement(element));
        }

        return element;
    }

    doc = traverseElement(doc.firstChild);
    htmlToCreate = Y.XML.format(doc);

    return {
        html : htmlToCreate,
        widgets : widgetsToCreate,
        variables : variables
    };
}function getNode(rootNode, id) {
    return rootNode.get("id") === id ?
        rootNode :
        rootNode.one("#" + id);
}

function getWidgetConfig(customWidget, rootNode, config) {
    var result = {};

    result = Y.merge(result, customWidget.config.properties);

    if (customWidget.config.globalConfig ) {
        result = Y.merge(result, config[ customWidget.config.globalConfig ]);
    }

    if (customWidget.config.srcNode) {
        result.srcNode = getNode(rootNode, customWidget.nodeId);
    }

    return result;
}

function updateVariables(widget, variables, result) {
    for (var key in variables) {
        if (widget.nodeId === variables[key]) {
            result[key] = widget;
            delete variables[key];
        }
    }
}

function getWidgetOrNode(node, createdWidgets) {
    var widget = createdWidgets[node.get("id")];

    return widget ? widget : node;
}

function getClass(fullName) {
    if (/^Y\./.test(fullName)) {
        var m = /^Y\.((.*)\.)?(.*?)$/.exec(fullName),
            packageName = m[2],
            className = m[3];

        if (packageName) {
            return Y.namespace(packageName)[className];
        } else {
            return Y[className];
        }
    }
}

function createWidget(rootNode, customWidget, config) {
    var Clazz = getClass(customWidget.fullName),
        result;

    result = new Clazz(getWidgetConfig(customWidget, rootNode[0], config));

    if (customWidget.config.srcNode) {
        result.render();
    } else {
        result.render( rootNode[0].one('#' + customWidget.nodeId) );
    }

    if (customWidget.nodeId === rootNode[0].get("id")) {
        rootNode[0] = result.get("boundingBox");
    }

    return result;
}

Y.fastUi = function(parent, xmlContent, msg, config) {
    var guiCreationContext = preXmlParse(xmlContent),
        widgets = guiCreationContext.widgets,
        htmlCode = guiCreationContext.html,
        variables = guiCreationContext.variables,
        translatedHtml = msg ? Y.substitute(htmlCode, msg) : htmlCode,
        // looks like IE7/8 get confused when creating elements that are not closed.
        closedNodeHtmlBugFix = translatedHtml.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>"),
        rootNode = [ Y.Node.create( closedNodeHtmlBugFix ) ],
        createdWidgets = {},
        result, i, variable, node, newWidget;

    if (parent) {
        parent.appendChild( rootNode[0] ); // all the rendering takes place inside the parent node.
    }

    result = {
        node : getWidgetOrNode( rootNode[0], createdWidgets )
    };

    for (i = widgets.length - 1; i >= 0; i--) {
        console.log("creating widget: " + widgets[i]);
        newWidget = createWidget(rootNode, widgets[i], config);
        createdWidgets[widgets[i].nodeId] = newWidget;

        updateVariables(newWidget, variables, result);
    }

    for (variable in variables) {
        node = rootNode[0].one('#' + variables[variable]);
        result[variable] = getWidgetOrNode( node, createdWidgets );
    }

    return result;
};


}, '@VERSION@', {"requires": ["datatype-xml", "node", "widget"]});
