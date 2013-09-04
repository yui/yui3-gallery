/**
 * Parses a XML template, and finds out what variables need to be filled in into the response,
 * what widgets need to be created, and gets from the XML a HTML template that uses just regular
 * DOM elements, deferring the build of the widges themselves to the {FastUiBuilder}.
 *
 * @constructor
 */
function TemplateParser() {
    /**
     * A map of variable to ID of element in the DOM where the variable should be extracted from.
     * @public
     * @type {Object}
     */
    this.variables = {};

    /**
     * An array of widget configs, for all the widgets that should be created. The widgets
     * are sorted from the container elements, downwards to "simple" elements.
     * @type {Array<WidgetConfig>}
     */
    this.widgets = [];

    /**
     * The html content that should be initially created, and afterwards, the widgets built on top.
     * @type {string}
     */
    this.htmlContent = "";
}

/**
 * Parse some xml content.
 * @param xmlContent
 * @returns {ParserResult}
 */
TemplateParser.prototype.parse = function (xmlContent) {
    var xmlDoc = Y.XML.parse(xmlContent);

    this.traverseElement(xmlDoc.firstChild);

    this.htmlContent = Y.XML.format(xmlDoc.firstChild);

    return new ParserResult(this.variables, this.widgets, this.htmlContent);
};

/**
 * Recursively traverses the XML document, binding variables and instantiating widgetDefinitions.
 * @param element Start element.
 */
TemplateParser.prototype.traverseElement = function (element) {
    var i,
        childElement,
        configNodes = [],
        widgetId,
        needsId = false;

    for (i = 0; i < element.childNodes.length; i++) {
        childElement = element.childNodes[i];
        // IE up to 8 incorrectly counts comment nodes
        if (childElement.nodeType === 1) {
            // if it's a configuration node, store it for widget config, and prepare to remove it from the final template.
            if (this.isConfigElement(childElement)) {
                configNodes.push(childElement);
                continue; // don't traverse the configuration node.
            }

            this.traverseElement(childElement);
        }
    }

    // remove the configuration node from the final template.
    for (i = 0; i < configNodes.length; i++) {
        element.removeChild( configNodes[i] );
    }

    widgetId = this.getId(element);

    needsId = this.registerVariable(element, widgetId) || needsId;
    needsId = this.registerWidget(element, widgetId, configNodes) || needsId;

    if (needsId) {
        this._ensureElementHasId(element, widgetId);
    }
};


TemplateParser.prototype._ensureElementHasId = function(element, widgetId) {
    if (!this.getAttribute(element, "id")) {
        element.setAttribute("id", widgetId);
    }
};

/**
 *
 * @param element
 * @param widgetId
 * @returns {boolean}
 */
TemplateParser.prototype.registerVariable = function(element, widgetId) {
    var uiField = this.getAttribute(element, 'field', 'fastui');

    if (uiField) {
        this.variables[uiField] = widgetId;
        return true;
    }

    return false;
};

TemplateParser.prototype.isConfigElement = function(element) {
    var elementName = element.localName || element.baseName;

    return element.namespaceURI &&
        element.namespaceURI === "fastui" &&
        elementName === "config";
};

TemplateParser.prototype.registerWidget = function(element, widgetId, configNodes) {
    // there is a namespace URI, we need to create a WidgetDefinition
    if (!element.namespaceURI) {
        return false;
    }

    var elementName = element.localName || element.baseName,
        placeHolderElement,
        fullClassName = element.namespaceURI + "." + elementName,
        widget = new WidgetDefinition(
            widgetId,
            fullClassName,
            WidgetConfig.buildFromElement(widgetId, element, configNodes)
        );

    placeHolderElement = this.createPlaceHolderElement(element, widgetId);

    this.widgets.push(widget);

    element.parentNode.replaceChild(placeHolderElement, element);

    return true;
};


TemplateParser.prototype.getAttribute = function(element, attributeName, namespaceURI) {
    var i, attribute, attrName;

    if (!element.attributes) {
        return null;
    }

    namespaceURI = !!namespaceURI ? namespaceURI : null;

    for (i = 0; i < element.attributes.length; i++) {
        attribute = element.attributes[i];
        attrName = attribute.localName || attribute.baseName;

        if (attrName === attributeName &&
            attribute.namespaceURI === namespaceURI) {
            return attribute.value;
        }
    }

    return null;
};

TemplateParser.prototype.getId = function(element) {
    var id = this.getAttribute(element, 'id');

    // if the element does not have an id, we create one
    if (!id) {
        id = Y.guid('fast-ui-');
    }

    return id;
};

TemplateParser.prototype.getElementType = function(element) {
    var srcNodeType = this.getAttribute(element, "srcNode", "fastui");

    return srcNodeType ? srcNodeType : "span";
};

TemplateParser.prototype.createPlaceHolderElement = function(sourceElement, widgetId) {
    var document = sourceElement.ownerDocument,
        elementType = this.getElementType(sourceElement),
        newElement = document.createElement(elementType),
        child;

    newElement.setAttribute('id', widgetId);

    while (!!(child = sourceElement.firstChild)) {
        sourceElement.removeChild(child);
        newElement.appendChild(child);
    }

    return newElement;
};

/**
 * @private
 * @param element
 * @param name
 * @param value
 */
TemplateParser.prototype.setAttribute = function(element, name, value) {
    Y.one(element).setAttribute(name, value);
};
