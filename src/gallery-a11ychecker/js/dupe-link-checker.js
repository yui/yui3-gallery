(function () {

var ns = Y.namespace("a11ychecker"),
    logError = ns.logError,
    testName = "dupe-link-test",
    jsLinkRE = /(^#$)|(^javascript:)/,
    yltRE = /(;_yl[a-z]|_yl[a-z])=(\w|\W)+/g,
    EMPTY_STRING = "";


function getURL(url, ignoreYLT) {
    
    var returnVal;
    
    if (url && url.search(jsLinkRE) === -1) {
        returnVal = ignoreYLT ? url.replace(yltRE, EMPTY_STRING) : url;
    }
    
    return returnVal;
    
}


var getParent = (function() {

    var called = 0;

    return function (node, level) {
        
        level = (Y.Lang.isNumber(level) && level > 0) ? (level - 1) : 2;
        
        if (node.get("nodeName").toLowerCase() === "body") {
            called = 0;
        }
        else {
            called = called < level ? (called + 1) : 0;
        }
        
        return (called === 0);
    
    };

}());


function findAllDupeLinks(config) {

    config = config || {};

    var duplicateURLs = {},
        urls = {};

    Y.all("a").each(function(v) {

        var href, entry;

        if ((href = getURL(v.getAttribute("href", 2), config.ignoreYLT)) && !(entry = urls[href])) {
            entry = urls[href] = [];
        }
        
        if (entry) {
            entry.push(v.generateID());
        }
    
    }); 

    Y.each(urls, function(v, k) {
        if (urls[k].length > 1) {                    
            duplicateURLs[k] = v;
        }
    });
    
    return duplicateURLs;

}

function findDupeSibLinks(id, url, level, ignoreYLT) {

    var node = Y.one("#" + id),
        parent = node.ancestor(Y.rbind(getParent, null, level)),
        dupes = [];

    parent.all("a").each(function (v) {
        
        var href;

        if ((href = getURL(v.getAttribute("href", 2), ignoreYLT)) && href === url) {
            dupes.push(v);
        }
        
    });

    return dupes;

//    return parent.all("a[href='" + href + "']");
//    return parent.all("a[href^='" + href + "']");

}

function findDupeLinks(config) {
    
    config = config || {};
    duplicateURLs = findAllDupeLinks(config);
    
    var siblings,
        len;

    Y.each(duplicateURLs, function(v, k) {
        Y.each(duplicateURLs[k], function (v) {
            
            if (config.all) {
                len = duplicateURLs[k].length;
                logError(testName, v, (len - 1) + " other instance(s) of this link on this page.", "warn");
            }
            else {
                
                siblings = findDupeSibLinks(v, k, config.level, config.ignoreYLT);
                len = siblings.length;
                
                if (len > 1) {
                    Y.each(siblings, function (v) {
                        logError(testName, v, (len - 1) + " other instance(s) of this link within the same parent node.", "warn");
                    });        
                }

            }
        });
    });        
}

findDupeLinks.testName = testName;

ns.findDupeLinks = findDupeLinks;

}());