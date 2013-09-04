/**
 * @public
 * @param {Element} parent       Where should the built UI be appended after it's built.
 * @param {string} xmlContent   The UI that is supposed to be built.
 * @param {object} msg          I18N messages, that will be substituted in the XML.
 * @param {object} globalConfig Configuration for various UI elements.
 * @constructor
 */
function FastUiBuilder(parent, xmlContent, msg, globalConfig) {
    this.parent = !!parent ? Y.one(parent) : null;
    this.xmlContent = xmlContent;
    this.msg = msg;
    this.globalConfig = globalConfig;
}

/**
 * Creates all the DOM elements and widgets that were in this.xmlContent.
 *
 * @public
 * @this {FastUiBuilder}
 * @returns {object} A map of widgets or dom elements that were created, that were marked with the ui:field attribute.
 */
FastUiBuilder.prototype.parse = function() {
    var parseResult = this._parseXmlTemplate(),
        variables = parseResult.variables,
        widgetDefinitions = parseResult.widgetDefinitions,
        newWidget,
        key,
        nodeId,
        i;

    this.rootNode = this._createRootDomNode(parseResult);
    this.createdWidgets = {}; // // so far no widgets are yet created.

    this.result = {};

    // build the widgets and keep track of the created widgets.
    for (i = widgetDefinitions.length - 1; i >= 0; i--) {
        newWidget = this._createWidget(widgetDefinitions[i]);
        this.createdWidgets[widgetDefinitions[i].nodeId] = newWidget;
    }

    for (key in variables) {
        if (variables.hasOwnProperty(key)) {
            nodeId = variables[key];
            this.result[key] = this._getWidgetOrNode(nodeId);
        }
    }

    this.result._rootNode = this.rootNode;

    if (this.parent) {
        this.parent.appendChild(this.rootNode);
    } else {
        Y.one("body").removeChild( this.rootNode );
    }

    return this.result;
};

/**
 * Translate and parse the XML.
 * @private
 * @returns {ParserResult}
 */
FastUiBuilder.prototype._parseXmlTemplate = function() {
    var translatedXml = this.msg ? Y.Lang.sub(this.xmlContent, this.msg) : this.xmlContent;

    return new TemplateParser().parse(translatedXml);
};


/**
 * Create the initial DOM nodes, on top which the widgets will be created.
 * @private
 * @param parseResult
 * @returns {Y.Node}
 */
FastUiBuilder.prototype._createRootDomNode = function(parseResult) {
    var htmlContent = parseResult.htmlContent,
        closedNodeHtmlBugFix = htmlContent.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>"),
        rootNode;

    rootNode = Y.Node.create(closedNodeHtmlBugFix);

    Y.one("body").appendChild(rootNode);

    return rootNode;
};

/**
 * Given an ID return either the node whose ID it is, or if a widget was created for that ID,
 * return the widget.
 * @private
 * @param nodeId
 * @returns {Element | Object}
 */
FastUiBuilder.prototype._getWidgetOrNode = function(nodeId) {
    var widget = this.createdWidgets[nodeId];

    return widget ? widget : this.rootNode.one("#" + nodeId);
};

/**
 * Create a widget, using the given WidgetConfig.
 * @private
 * @param {WidgetConfig} widget Widget configuration (usually obtain after parsing).
 * @returns {Object} Newly created widget.
 */
FastUiBuilder.prototype._createWidget = function(widget) {
    var ClassConstructor = this._getClassConstructor(widget.className),
        classConfig = this._getClassConfig(widget.config),
        classInstance = new ClassConstructor(classConfig),
        placeHolderElement;

    // the widget will render it's content on the 'srcNode', if it has one
    if (widget.config.srcNode) {
        classInstance.render();
    } else {
        placeHolderElement = this._findElement(widget.nodeId);
        classInstance.render(placeHolderElement);
    }

    if (widget.nodeId === this.rootNode.get("id")) {
        this.rootNode = classInstance.get("boundingBox");
    }

    return classInstance;
};

/**
 * Attempt to find an element under the rootNode.
 * @private
 * @param {String} id Id of the element to be found.
 * @returns {Y.Node}
 */
FastUiBuilder.prototype._findElement = function(id) {
    if (this.rootNode.get("id") === id) {
        return this.rootNode;
    } else {
        return this.rootNode.one("#" + id);
    }
};

/**
 * From a given class name, obtain the function that we're supposed to instantiate.
 * @private
 * @param {String} fullyQualifiedName The name of the function that needs to be created.
 * @returns {Function} Function class that needs to be created.
 */
FastUiBuilder.prototype._getClassConstructor = function(fullyQualifiedName) {
    if (/^Y\./.test(fullyQualifiedName)) {
        var matches = /^Y\.((.*)\.)?(.*?)$/.exec(fullyQualifiedName),
            packageName = matches[2],
            className = matches[3];

        if (packageName) {
            return Y.namespace(packageName)[className];
        } else {
            return Y[className];
        }
    }
};

/**
 * Obtain the object that needs to be passed as an argument to the function, from a widgetConfiguration.
 * @private
 * @param {WidgetConfig} widgetConfig
 * @returns {Object} Configuration object.
 */
FastUiBuilder.prototype._getClassConfig = function(widgetConfig) {
    var widgetGlobalConfig, finalConfig = {};

    // widgetConfig.srcNode gets in
    mix(finalConfig, this._evaluateProperties(widgetConfig.properties));

    if (this.globalConfig && widgetConfig.globalConfigKey) {
        widgetGlobalConfig = this.globalConfig[widgetConfig.globalConfigKey];

        mix(finalConfig, widgetGlobalConfig);
    }

    return finalConfig;
};

/**
 *
 * @param {Object} propertiesMap A map of {WidgetConfigProperty}
 * @returns {Object}
 * @private
 */
FastUiBuilder.prototype._evaluateProperties = function(propertiesMap) {
    var key,
        result = {};

    for (key in propertiesMap) {
        if (propertiesMap.hasOwnProperty(key)) {
            result[key] = this.evaluatePropertyValue(
                propertiesMap[key],
                null
            );
        }
    }

    return result;
};

/**
 * @private
 * @param {WidgetConfigProperty} widgetConfigProperty
 * @param config
 * @returns {*}
 */
FastUiBuilder.prototype.evaluatePropertyValue = function(widgetConfigProperty, config) {
    if ("string" === widgetConfigProperty.type &&
        "srcNode" === widgetConfigProperty.name) {

        return this.rootNode.one(widgetConfigProperty.value);
    }

    if ("string" === widgetConfigProperty.type) {
        return widgetConfigProperty.value;
    } else if ("ui" === widgetConfigProperty.type) {
        var builtUi = new FastUiBuilder(null, widgetConfigProperty.value, null, config).parse();

        mix(this.result, builtUi);

        return builtUi._rootNode;
    } else if ("js" === widgetConfigProperty.type) {
        return eval(widgetConfigProperty.value);
    }
};

/**
 * @private
 * @param {Object} target The target where the properties of the other arguments will be copied into.
 * @param {...Object} args Objects that will have their properties copied into the target.
 * Add one or more items passed as arguments into the target.
 */
function mix(target) {
    var i, key;

    for (i = 1; i < arguments.length; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                target[key] = arguments[i][key];
            }
        }
    }
}
