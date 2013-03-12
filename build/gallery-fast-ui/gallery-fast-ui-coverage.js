if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-fast-ui/gallery-fast-ui.js",
    code: []
};
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].code=["YUI.add('gallery-fast-ui', function (Y, NAME) {","","function getAttribute(element, name) {","    if (!element.attributes) {","        return null;","    }","","    for (var i = 0; i < element.attributes.length; i++) {","        if (element.attributes[i].name === name) {","            return element.attributes[i].value;","        }","    }","","    return null;","}","/**"," * This holds the configuration for a single widget that is supposed to be created."," * @constructor"," */","function CustomWidgetConfig() {","    this.properties = {};","    this.globalConfig = null;","    this.srcNode = null;","}","","CustomWidgetConfig.prototype.setGlobalConfig = function(callbackName) {","    this.globalConfig = callbackName;","};","","CustomWidgetConfig.prototype.addProperty = function(name, value) {","    this.properties[name] = value;","};","","CustomWidgetConfig.prototype.setSrcNode = function(srcNode) {","    this.srcNode = srcNode;","};","","CustomWidgetConfig.buildFromElement = function(element) {","    var widgetConfig = new CustomWidgetConfig(),","        i, attributeName, attributeValue;","","    for (i = 0; i < element.attributes.length; i++) {","        attributeName = element.attributes[i].name;","        attributeValue = element.attributes[i].value;","","        if (attributeName === \"ui-config\") {","            widgetConfig.setGlobalConfig(attributeValue);","            continue;","        }","","        if (attributeName === \"ui-src\") {","            widgetConfig.setSrcNode(attributeValue);","            widgetConfig.addProperty(\"srcNode\", \"#\" + getAttribute(element, \"id\"));","            continue;","        }","","        if (attributeName === \"id\" || /^ui-/.test(attributeName)) {","            continue;","        }","","        widgetConfig.addProperty(attributeName, attributeValue);","    }","","    return widgetConfig;","};","","/**"," *"," * @param nodeId   : String             The ID in the DOM where the node should be inserted."," * @param fullName : String             The Full name of the class to be instantiated, e.g. Y.Button"," * @param config   : CustomWidgetConfig The Configuration for that widget that will be sent on construction."," * @constructor"," */","function CustomWidget(nodeId, fullName, config) {","    this.nodeId = nodeId;","    this.fullName = fullName;","    this.config = config;","}","function isIdPresent(element) {","    return !!getAttribute(element, \"id\");","}","","function getExistingId(element) {","    return getAttribute(element, \"id\");","}","","function generateNewId(element) { // FIXME: generation should be a bit more powerful.","    var newId = Y.guid(\"fast-ui-id-\");","    element.setAttribute(\"id\", newId);","","    return newId;","}","","function generateID(element) {","    if (isIdPresent(element)) {","        return getExistingId(element);","    } else {","        return generateNewId(element);","    }","}","","function getElementForTarget(targetElement) {","    var srcNodeType = getAttribute(targetElement, \"ui-src\");","","    return srcNodeType ? srcNodeType : \"span\";","}","","","function createElement(targetElement) {","    var element = targetElement.ownerDocument.createElement(getElementForTarget(targetElement)),","        child;","","    element.setAttribute(\"id\", getAttribute(targetElement, \"id\"));","","    while (targetElement.firstChild) {","        child = targetElement.firstChild;","        targetElement.removeChild(child);","        element.appendChild(child);","    }","","    return element;","}","","function replaceElement(element, newElement) {","    if (element.parentNode.nodeType !== 9) {","        element.parentNode.insertBefore(newElement, element);","        element.parentNode.removeChild(element);","    }","","    return newElement;","}","","// FIXME: this whole parsing should be externalized.","function preXmlParse(xmlContent) {","    var widgetsToCreate = [],","        variables = {},","        doc = Y.XML.parse(xmlContent),","        htmlToCreate;","","","    function traverseElement(element) {","        var i;","","        for (i = 0; i < element.childNodes.length; i++) {","            traverseElement(element.childNodes[i]);","        }","","        if (getAttribute(element, \"ui-field\")) {","            variables[ getAttribute(element, \"ui-field\") ] = generateID(element);","        }","","        if (element.namespaceURI) { // there is a namespace URI, thus I need to create a custom object","            widgetsToCreate.push(","                new CustomWidget(","                    generateID(element), // node ID","                    element.namespaceURI + \".\" + (element.localName || element.baseName), // full class","                    CustomWidgetConfig.buildFromElement(element) // configuration","                )","            );","","            return replaceElement(element, createElement(element));","        }","","        return element;","    }","","    doc = traverseElement(doc.firstChild);","    htmlToCreate = Y.XML.format(doc);","","    return {","        html : htmlToCreate,","        widgets : widgetsToCreate,","        variables : variables","    };","}function getNode(rootNode, id) {","    return rootNode.get(\"id\") === id ?","        rootNode :","        rootNode.one(\"#\" + id);","}","","function getWidgetConfig(customWidget, rootNode, config) {","    var result = {};","","    result = Y.merge(result, customWidget.config.properties);","","    if (customWidget.config.globalConfig ) {","        result = Y.merge(result, config[ customWidget.config.globalConfig ]);","    }","","    if (customWidget.config.srcNode) {","        result.srcNode = getNode(rootNode, customWidget.nodeId);","    }","","    return result;","}","","function updateVariables(widget, variables, result) {","    for (var key in variables) {","        if (widget.nodeId === variables[key]) {","            result[key] = widget;","            delete variables[key];","        }","    }","}","","function getWidgetOrNode(node, createdWidgets) {","    var widget = createdWidgets[node.get(\"id\")];","","    return widget ? widget : node;","}","","function getClass(fullName) {","    if (/^Y\\./.test(fullName)) {","        var m = /^Y\\.((.*)\\.)?(.*?)$/.exec(fullName),","            packageName = m[2],","            className = m[3];","","        if (packageName) {","            return Y.namespace(packageName)[className];","        } else {","            return Y[className];","        }","    }","}","","function createWidget(rootNode, customWidget, config) {","    var Clazz = getClass(customWidget.fullName),","        result;","","    result = new Clazz(getWidgetConfig(customWidget, rootNode[0], config));","","    if (customWidget.config.srcNode) {","        result.render();","    } else {","        result.render( rootNode[0].one('#' + customWidget.nodeId) );","    }","","    if (customWidget.nodeId === rootNode[0].get(\"id\")) {","        rootNode[0] = result.get(\"boundingBox\");","    }","","    return result;","}","","Y.fastUi = function(parent, xmlContent, msg, config) {","    var guiCreationContext = preXmlParse(xmlContent),","        widgets = guiCreationContext.widgets,","        htmlCode = guiCreationContext.html,","        variables = guiCreationContext.variables,","        translatedHtml = msg ? Y.substitute(htmlCode, msg) : htmlCode,","        // looks like IE7/8 get confused when creating elements that are not closed.","        closedNodeHtmlBugFix = translatedHtml.replace(/<([\\w\\d]+?)\\s+([^>]+?)\\/>/gm,\"<$1 $2></$1>\"),","        rootNode = [ Y.Node.create( closedNodeHtmlBugFix ) ],","        createdWidgets = {},","        result, i, variable, node, newWidget;","","    if (parent) {","        parent.appendChild( rootNode[0] ); // all the rendering takes place inside the parent node.","    }","","    result = {","        node : getWidgetOrNode( rootNode[0], createdWidgets )","    };","","    for (i = widgets.length - 1; i >= 0; i--) {","        console.log(\"creating widget: \" + widgets[i]);","        newWidget = createWidget(rootNode, widgets[i], config);","        createdWidgets[widgets[i].nodeId] = newWidget;","","        updateVariables(newWidget, variables, result);","    }","","    for (variable in variables) {","        node = rootNode[0].one('#' + variables[variable]);","        result[variable] = getWidgetOrNode( node, createdWidgets );","    }","","    return result;","};","","","}, '@VERSION@', {\"requires\": [\"datatype-xml\", \"node\", \"widget\"]});"];
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].lines = {"1":0,"3":0,"4":0,"5":0,"8":0,"9":0,"10":0,"14":0,"20":0,"21":0,"22":0,"23":0,"26":0,"27":0,"30":0,"31":0,"34":0,"35":0,"38":0,"39":0,"42":0,"43":0,"44":0,"46":0,"47":0,"48":0,"51":0,"52":0,"53":0,"54":0,"57":0,"58":0,"61":0,"64":0,"74":0,"75":0,"76":0,"77":0,"79":0,"80":0,"83":0,"84":0,"87":0,"88":0,"89":0,"91":0,"94":0,"95":0,"96":0,"98":0,"102":0,"103":0,"105":0,"109":0,"110":0,"113":0,"115":0,"116":0,"117":0,"118":0,"121":0,"124":0,"125":0,"126":0,"127":0,"130":0,"134":0,"135":0,"141":0,"142":0,"144":0,"145":0,"148":0,"149":0,"152":0,"153":0,"161":0,"164":0,"167":0,"168":0,"170":0,"175":0,"176":0,"181":0,"182":0,"184":0,"186":0,"187":0,"190":0,"191":0,"194":0,"197":0,"198":0,"199":0,"200":0,"201":0,"206":0,"207":0,"209":0,"212":0,"213":0,"214":0,"218":0,"219":0,"221":0,"226":0,"227":0,"230":0,"232":0,"233":0,"235":0,"238":0,"239":0,"242":0,"245":0,"246":0,"257":0,"258":0,"261":0,"265":0,"266":0,"267":0,"268":0,"270":0,"273":0,"274":0,"275":0,"278":0};
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].functions = {"getAttribute:3":0,"CustomWidgetConfig:20":0,"setGlobalConfig:26":0,"addProperty:30":0,"setSrcNode:34":0,"buildFromElement:38":0,"CustomWidget:74":0,"isIdPresent:79":0,"getExistingId:83":0,"generateNewId:87":0,"generateID:94":0,"getElementForTarget:102":0,"createElement:109":0,"replaceElement:124":0,"traverseElement:141":0,"preXmlParse:134":0,"getNode:175":0,"getWidgetConfig:181":0,"updateVariables:197":0,"getWidgetOrNode:206":0,"getClass:212":0,"createWidget:226":0,"fastUi:245":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].coveredLines = 128;
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].coveredFunctions = 24;
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 1);
YUI.add('gallery-fast-ui', function (Y, NAME) {

_yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 3);
function getAttribute(element, name) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getAttribute", 3);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 4);
if (!element.attributes) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 5);
return null;
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 8);
for (var i = 0; i < element.attributes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 9);
if (element.attributes[i].name === name) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 10);
return element.attributes[i].value;
        }
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 14);
return null;
}
/**
 * This holds the configuration for a single widget that is supposed to be created.
 * @constructor
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 20);
function CustomWidgetConfig() {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "CustomWidgetConfig", 20);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 21);
this.properties = {};
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 22);
this.globalConfig = null;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 23);
this.srcNode = null;
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 26);
CustomWidgetConfig.prototype.setGlobalConfig = function(callbackName) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "setGlobalConfig", 26);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 27);
this.globalConfig = callbackName;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 30);
CustomWidgetConfig.prototype.addProperty = function(name, value) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "addProperty", 30);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 31);
this.properties[name] = value;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 34);
CustomWidgetConfig.prototype.setSrcNode = function(srcNode) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "setSrcNode", 34);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 35);
this.srcNode = srcNode;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 38);
CustomWidgetConfig.buildFromElement = function(element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "buildFromElement", 38);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 39);
var widgetConfig = new CustomWidgetConfig(),
        i, attributeName, attributeValue;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 42);
for (i = 0; i < element.attributes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 43);
attributeName = element.attributes[i].name;
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 44);
attributeValue = element.attributes[i].value;

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 46);
if (attributeName === "ui-config") {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 47);
widgetConfig.setGlobalConfig(attributeValue);
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 48);
continue;
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 51);
if (attributeName === "ui-src") {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 52);
widgetConfig.setSrcNode(attributeValue);
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 53);
widgetConfig.addProperty("srcNode", "#" + getAttribute(element, "id"));
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 54);
continue;
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 57);
if (attributeName === "id" || /^ui-/.test(attributeName)) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 58);
continue;
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 61);
widgetConfig.addProperty(attributeName, attributeValue);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 64);
return widgetConfig;
};

/**
 *
 * @param nodeId   : String             The ID in the DOM where the node should be inserted.
 * @param fullName : String             The Full name of the class to be instantiated, e.g. Y.Button
 * @param config   : CustomWidgetConfig The Configuration for that widget that will be sent on construction.
 * @constructor
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 74);
function CustomWidget(nodeId, fullName, config) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "CustomWidget", 74);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 75);
this.nodeId = nodeId;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 76);
this.fullName = fullName;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 77);
this.config = config;
}
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 79);
function isIdPresent(element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "isIdPresent", 79);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 80);
return !!getAttribute(element, "id");
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 83);
function getExistingId(element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getExistingId", 83);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 84);
return getAttribute(element, "id");
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 87);
function generateNewId(element) { // FIXME: generation should be a bit more powerful.
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "generateNewId", 87);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 88);
var newId = Y.guid("fast-ui-id-");
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 89);
element.setAttribute("id", newId);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 91);
return newId;
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 94);
function generateID(element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "generateID", 94);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 95);
if (isIdPresent(element)) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 96);
return getExistingId(element);
    } else {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 98);
return generateNewId(element);
    }
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 102);
function getElementForTarget(targetElement) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getElementForTarget", 102);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 103);
var srcNodeType = getAttribute(targetElement, "ui-src");

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 105);
return srcNodeType ? srcNodeType : "span";
}


_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 109);
function createElement(targetElement) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "createElement", 109);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 110);
var element = targetElement.ownerDocument.createElement(getElementForTarget(targetElement)),
        child;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 113);
element.setAttribute("id", getAttribute(targetElement, "id"));

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 115);
while (targetElement.firstChild) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 116);
child = targetElement.firstChild;
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 117);
targetElement.removeChild(child);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 118);
element.appendChild(child);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 121);
return element;
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 124);
function replaceElement(element, newElement) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "replaceElement", 124);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 125);
if (element.parentNode.nodeType !== 9) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 126);
element.parentNode.insertBefore(newElement, element);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 127);
element.parentNode.removeChild(element);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 130);
return newElement;
}

// FIXME: this whole parsing should be externalized.
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 134);
function preXmlParse(xmlContent) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "preXmlParse", 134);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 135);
var widgetsToCreate = [],
        variables = {},
        doc = Y.XML.parse(xmlContent),
        htmlToCreate;


    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 141);
function traverseElement(element) {
        _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "traverseElement", 141);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 142);
var i;

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 144);
for (i = 0; i < element.childNodes.length; i++) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 145);
traverseElement(element.childNodes[i]);
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 148);
if (getAttribute(element, "ui-field")) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 149);
variables[ getAttribute(element, "ui-field") ] = generateID(element);
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 152);
if (element.namespaceURI) { // there is a namespace URI, thus I need to create a custom object
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 153);
widgetsToCreate.push(
                new CustomWidget(
                    generateID(element), // node ID
                    element.namespaceURI + "." + (element.localName || element.baseName), // full class
                    CustomWidgetConfig.buildFromElement(element) // configuration
                )
            );

            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 161);
return replaceElement(element, createElement(element));
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 164);
return element;
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 167);
doc = traverseElement(doc.firstChild);
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 168);
htmlToCreate = Y.XML.format(doc);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 170);
return {
        html : htmlToCreate,
        widgets : widgetsToCreate,
        variables : variables
    };
}_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 175);
function getNode(rootNode, id) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getNode", 175);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 176);
return rootNode.get("id") === id ?
        rootNode :
        rootNode.one("#" + id);
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 181);
function getWidgetConfig(customWidget, rootNode, config) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getWidgetConfig", 181);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 182);
var result = {};

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 184);
result = Y.merge(result, customWidget.config.properties);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 186);
if (customWidget.config.globalConfig ) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 187);
result = Y.merge(result, config[ customWidget.config.globalConfig ]);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 190);
if (customWidget.config.srcNode) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 191);
result.srcNode = getNode(rootNode, customWidget.nodeId);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 194);
return result;
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 197);
function updateVariables(widget, variables, result) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "updateVariables", 197);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 198);
for (var key in variables) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 199);
if (widget.nodeId === variables[key]) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 200);
result[key] = widget;
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 201);
delete variables[key];
        }
    }
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 206);
function getWidgetOrNode(node, createdWidgets) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getWidgetOrNode", 206);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 207);
var widget = createdWidgets[node.get("id")];

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 209);
return widget ? widget : node;
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 212);
function getClass(fullName) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getClass", 212);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 213);
if (/^Y\./.test(fullName)) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 214);
var m = /^Y\.((.*)\.)?(.*?)$/.exec(fullName),
            packageName = m[2],
            className = m[3];

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 218);
if (packageName) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 219);
return Y.namespace(packageName)[className];
        } else {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 221);
return Y[className];
        }
    }
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 226);
function createWidget(rootNode, customWidget, config) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "createWidget", 226);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 227);
var Clazz = getClass(customWidget.fullName),
        result;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 230);
result = new Clazz(getWidgetConfig(customWidget, rootNode[0], config));

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 232);
if (customWidget.config.srcNode) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 233);
result.render();
    } else {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 235);
result.render( rootNode[0].one('#' + customWidget.nodeId) );
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 238);
if (customWidget.nodeId === rootNode[0].get("id")) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 239);
rootNode[0] = result.get("boundingBox");
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 242);
return result;
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 245);
Y.fastUi = function(parent, xmlContent, msg, config) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "fastUi", 245);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 246);
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

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 257);
if (parent) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 258);
parent.appendChild( rootNode[0] ); // all the rendering takes place inside the parent node.
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 261);
result = {
        node : getWidgetOrNode( rootNode[0], createdWidgets )
    };

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 265);
for (i = widgets.length - 1; i >= 0; i--) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 266);
console.log("creating widget: " + widgets[i]);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 267);
newWidget = createWidget(rootNode, widgets[i], config);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 268);
createdWidgets[widgets[i].nodeId] = newWidget;

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 270);
updateVariables(newWidget, variables, result);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 273);
for (variable in variables) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 274);
node = rootNode[0].one('#' + variables[variable]);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 275);
result[variable] = getWidgetOrNode( node, createdWidgets );
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 278);
return result;
};


}, '@VERSION@', {"requires": ["datatype-xml", "node", "widget"]});
