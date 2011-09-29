(function () {

function createInputTypesSelector() {

    var selector = [];

    Y.each(INPUT_TYPES, function (v) {
        selector.push("input[type=" + v + "]");
    });

    return selector.join();

}

var INPUT_TYPES = ["file",
        "checkbox",
        "radio",
        "password",
        "text",
        "email",
        "url",
        "number",
        "range",
        "date",
        "month",
        "week",
        "time",
        "datetime",
        "datetime-local",
        "search",
        "color"],
    
    ALL_INPUTS_SELECTOR = createInputTypesSelector()+",textarea,select",
    NO_LABEL_ERROR = "Element has no label.",
    ns = Y.namespace("a11ychecker"),
    logError = ns.logError,
    testName = "label-test";


function labelIsValid(node) {
    
    var success = false,
        selector = "input,select,textarea",
        id,
        formField,
        nodeName;
    
    if (hasInnerText(node)) {
        
        id = node.get("for");
        
        if ((formField = Y.one("#" + id))) {
            
            nodeName = formField.get("nodeName").toLowerCase();

            if (selector.indexOf(nodeName) !== -1) {
                success = true;           
            }
            else {
                logError(testName, node, "The \"for\" attribute doesn't correspond to the id of an input, select or textarea.");
            }
            
        }
        else if (node.all(selector).size() !== 1) {
            logError(testName, node, "The label element has no \"for\" attribute, but doesn't contain an input, select or textarea.");
        }
        
    }
    else {
        logError(testName, node, "The label element has no inner text.");
    }            

    return success;
    
}


function hasLabelElement(node) {

    var id = node.get("id"),
        label = false;
    
    if (id) {
        label = Y.one("label[for=" + id + "]");
    }
    
    if (!label) {
        label = node.ancestor("label");
    }

    return label;        
}


function hasInnerText(node) {
    return node.get("text");
}


function hasARIALabellBy(node) {
    
    var attr = node.get("aria-labelledby"),
        success = false;
    
    if (attr) {
        success = Y.one("#" + attr);
    }

    return success;
                
}


function hasTitleorARIALabel(node) {
    return node.get("title") || node.get("aria-label");
}


function containsImgWithAlt(node) {

    var img = node.one("img"),
        success = false;
    
    if (img) {
        success = img.get("alt");
    }
    
    return success;

}

function checkLabels() {

    Y.all("label").each(function (node) {
        labelIsValid(node);
    });
    
    Y.all(ALL_INPUTS_SELECTOR).each(function (node) {
    
        if (!hasLabelElement(node) && !hasTitleorARIALabel(node) && !hasARIALabellBy(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });
    
    Y.all("button,a").each(function (node) {
    
        if (!hasInnerText(node) && !hasTitleorARIALabel(node) && !hasARIALabellBy(node) && !containsImgWithAlt(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });
    
    Y.all("input[type=button],input[type=submit],input[type=reset]").each(function (node) {
    
        if (!node.get("value") && !hasTitleorARIALabel(node) && !hasARIALabellBy(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });

    Y.all("iframe").each(function (node) {
    
        if (!hasTitleorARIALabel(node) && !hasARIALabellBy(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });
    
    Y.all("input[type=image],img").each(function (node) {
    
        if (!node.get("alt")) { // TO DO - ability to discern between no alt attribute and empty alt attribute?
            logError(testName, node, "No alt text."); 
        }
    
    });

}

checkLabels.testName = testName;

ns.checkLabels = checkLabels;

}());