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

    // FIXME: this should be moved outside, but it depends on the variables and widgetsToCreate from the context.
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
}