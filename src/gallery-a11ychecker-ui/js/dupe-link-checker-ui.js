(function () {

var ns = Y.namespace("a11ychecker");

ns.showDupeLinks = function () {

    var overlay = new Y.Overlay({ zIndex: 2147483647, xy: [10,10] });
    overlay.render("body");

    overlay.get("boundingBox").plug(Y.Plugin.Drag);
    
    overlay.get("contentBox").setStyles({
        borderColor: "#A6982B", 
        borderWidth: "10px 1px 1px 1px",
        borderStyle: "solid"
    });
    
    // TO DO:
    // 1) External CSS for styling the iframe content
    // 2) Means of managing the markup
    var iframe = new Y.Frame({
        extracss: "body { color: #000; padding: 5px; background-color: #FFEE69; overflow: hidden; }",
        content: '<fieldset><legend>Dupe Link Checker Options</legend><div><label for="show-dup">Show All Duplicates</label><input id="show-dup" type="checkbox"></div><div><label for="ignore-ylt">Ignore YLT</label><input id="ignore-ylt" type="checkbox" checked></div></fieldset>'
    });
    
    iframe.render(overlay.get("contentBox"));

    var iframeY = iframe.getInstance(),
        iframeNode = iframe.get("node");
    
    iframeNode.setStyle("display", "block");
    iframeNode.set("height", (iframeY.one("body").get("offsetHeight")));

    
    function showDuplicates(config) {

        ns.hideErrors();
        ns.clearErrors(ns.findDupeLinks);

        config = config || {};
        
        ns.findDupeLinks(config);
        ns.showErrors({ tooltip: true });

    }


    function runTest(e) {
    
        ns.hideErrors();

        showDuplicates({ 
            all: iframeY.one("#show-dup").get("checked"),
            ignoreYLT: iframeY.one("#ignore-ylt").get("checked")
        });
    }
    
    
    iframe.delegate("change", runTest, "#show-dup, #ignore-ylt");
    
    runTest();

};

}());