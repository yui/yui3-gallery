(function () {

YUI.namespace("a11ychecker");

var errors = YUI.a11ychecker.errors,
    ns = Y.namespace("a11ychecker");

if (!errors) {
    errors = YUI.a11ychecker.errors = {};
}

ns.logError = function(test, node, message, cat) {
    
    cat = cat || "error";
    node = Y.Lang.isString(node) ? Y.one("#" + node) : node;
    
    var nodeInfo = {},
        text = node.get("text"),
        className = node.get("className"),
        name = node.get("name"),
        id = node.generateID(),
        src = node.get("src"),
        entry;
    
    if (text) {
        nodeInfo.textLabel = text;
    }

    if (name) {
        nodeInfo.name = name;
    }            
    
    if (className) {
        nodeInfo.className = className;
    }

    if (src) {
        nodeInfo.src = src;
    }

    if (!(entry = errors[id])) {
        entry = errors[id] = {};
    }
    
    entry[test] = {
        message: message,
        nodeInfo: nodeInfo,
        category: cat 
    };

};

ns.clearErrors = function (testName) {
    
    testName = Y.Lang.isString(testName) ? testName : testName.testName;
    
    if (testName) {
        Y.each(errors, function (v, k) {

            if (v[testName]) {
                delete v[testName];
            }
            
            if (Y.Object.size(v) === 0) {
                delete errors[k];
            }
            
        });
    }
    else {
        errors = YUI.a11ychecker.errors = {};
    }
    
};

ns.getErrors = function () {
    return errors;
};

}());