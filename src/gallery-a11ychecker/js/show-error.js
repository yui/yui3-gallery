(function () {

    YUI.namespace("a11ychecker");

    var ns = Y.namespace("a11ychecker"),

        getErrors = ns.getErrors,
    
        ERROR_CLASS_NAME = "a11y-checker-error",
        ERROR_CLASS_SELECTOR = "." + ERROR_CLASS_NAME,
        ERROR_BORDER_STYLE = "solid 2px red",
        EMPTY_STRING = "",
        HASH_SYMBOL = "#",
        BORDER = "border";


    function onTriggerEnter(e) {

        var node = e.node,
            id = node.get("id"),
            errors = getErrors(),
            nodeErrors = errors[id],
            triggerContent = [],
            startHTML = "",
            endHTML = "",
            errorTag = "div",
            iframe,
            iframeBody;

        if (nodeErrors) {

            if (Y.Object.size(nodeErrors) > 1) {
                startHTML = "<ol>";
                endHTML = "</ol>";
                errorTag = "li";
            }
        
            if (!(iframe = this.iframe)) {
                iframe = new Y.Frame({ extracss: "body { color: #000; padding: 2px 5px; border-color: #D4C237 #A6982B #A6982B #A6982B; border-width: 1px; border-style: solid; background-color: #FFEE69; overflow: hidden; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -o-user-select: none; user-select: none; }" });
                iframe.render(this.get("contentBox"));
                iframe.get("node").setStyle("display", "block");
                
                this.iframe = iframe;
            }


            Y.each(nodeErrors, function (v, k) {
                triggerContent.push("<"+errorTag+">" + v.message + "</"+errorTag+">");
            });


            iframe.set("content", (startHTML + triggerContent.join(EMPTY_STRING) + endHTML));            


            iframeBody = iframe.getInstance().one("body");

            iframeBody.set("unselectable", "on");            
            iframe.get("node").set("height", iframeBody.get("offsetHeight"));
            
        }
    
    }


    function createTooltip(config) {

        config = config || {};
        
        var tooltip = YUI.a11ychecker.tooltip;

        if (!tooltip) {

            tooltip = YUI.a11ychecker.tooltip = new ns.Tooltip({
                triggerNodes: ERROR_CLASS_SELECTOR,
                zIndex: 2147483647
            });
            
            tooltip.get("boundingBox").setStyle("position", "absolute");

            tooltip.render();

            tooltip.after("visibleChange", function (e) {
                var value = e.newVal ? "visible" : "hidden";
                tooltip.get("boundingBox").setStyle("visibility", value);
            });

            tooltip.on("triggerEnter", onTriggerEnter);

        }
        else {
            tooltip.set("triggerNodes", ERROR_CLASS_SELECTOR);
        }

        return tooltip; 
    
    }


    ns.hideErrors = function () {

        Y.each(getErrors(), function (v, k) {
            Y.one(HASH_SYMBOL + k).setStyle(BORDER, EMPTY_STRING);
        });
        
        Y.all(ERROR_CLASS_SELECTOR).removeClass(ERROR_CLASS_NAME);
        
        var tooltip = YUI.a11ychecker.tooltip;
        
        if (tooltip) {
            tooltip.set("triggerNodes", null);
        }

    };


    ns.showErrors = function (config) {

        config = config || {};
        
        var ttConfig = config.tooltip,
            node;
        
        Y.each(getErrors(), function (v, k) {

            node = Y.one(HASH_SYMBOL + k);
            node.setStyle(BORDER, ERROR_BORDER_STYLE);
            
            if (ttConfig) {
                node.addClass(ERROR_CLASS_NAME);
            }
            
        });

        if (ttConfig) {
            createTooltip(ttConfig);
        }
    
    };     

}());