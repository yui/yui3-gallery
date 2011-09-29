(function () {

var ns = Y.namespace("a11ychecker"),
    testName = "dupe-link-labels-test";

function findDupeLinkLabels() {
    var dupes = {},
        labels = {};

    Y.all("a").each(function(v) {

        var label, entry;

        if ((label = v.get("text")) && !(entry = labels[label])) {
            entry = labels[label] = [];
        }
        
        if (entry) {
            entry.push(v.generateID());
        }
    
    }); 

    Y.each(labels, function(v, k) {
        if (labels[k].length > 1) {                    
            dupes[k] = v;
        }
    });
            
    Y.each(dupes, function(v, k) {
        Y.each(dupes[k], function (v) {
            ns.logError(testName, v, "2 or more links found with this link's label.", "warn");
        });
    });
    
    return dupes;
}

findDupeLinkLabels.testName = testName;

ns.findDupeLinkLabels = findDupeLinkLabels;

}());