function isIdPresent(element) {
    return !!getAttribute(element, "id");
}
function getExistingId(element) {
    return getAttribute(element, "id");
}
function generateNewId(element) {
    var newId = Y.guid("fast-ui-id-");
    element.setAttribute("id", newId);
    return newId;
}
function generateID(element) {
    if(isIdPresent(element)) {
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
    var element = targetElement.ownerDocument.createElement(getElementForTarget(targetElement)), child;
    element.setAttribute("id", getAttribute(targetElement, "id"));
    while(targetElement.firstChild) {
        child = targetElement.firstChild;
        targetElement.removeChild(child);
        element.appendChild(child);
    }
    return element;
}
function replaceElement(element, newElement) {
    if(element.parentNode.nodeType !== 9) {
        element.parentNode.insertBefore(newElement, element);
        element.parentNode.removeChild(element);
    }
    return newElement;
}
function preXmlParse(xmlContent) {
    var widgetsToCreate = [], variables = {
    }, doc = Y.XML.parse(xmlContent), htmlToCreate;
    function traverseElement(element) {
        var i;
        for(i = 0; i < element.childNodes.length; i++) {
            traverseElement(element.childNodes[i]);
        }
        if(getAttribute(element, "ui-field")) {
            variables[getAttribute(element, "ui-field")] = generateID(element);
        }
        if(element.namespaceURI) {
            widgetsToCreate.push(new CustomWidget(generateID(element), element.namespaceURI + "." + (element.localName || element.baseName), CustomWidgetConfig.buildFromElement(element)));
            return replaceElement(element, createElement(element));
        }
        return element;
    }
    doc = traverseElement(doc.firstChild);
    htmlToCreate = Y.XML.format(doc);
    return {
        html: htmlToCreate,
        widgets: widgetsToCreate,
        variables: variables
    };
}
//@ sourceMappingURL=xml-to-html-parsing.js.map
