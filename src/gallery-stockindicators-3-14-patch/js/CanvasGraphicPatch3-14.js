    if(Y.CanvasGraphic) {
        Y.CanvasGraphic.prototype.render = function(render) {
            var parentNode = render || DOCUMENT.body,
                node = this._node,
                w,
                h;
            if(render instanceof Y.Node)
            {
                parentNode = render._node;
            }
            else if(Y.Lang.isString(render))
            {
                parentNode = Y.Selector.query(render, DOCUMENT.body, true);
            }
            w = this.get("width") || parseInt(Y.DOM.getComputedStyle(parentNode, "width"), 10);
            h = this.get("height") || parseInt(Y.DOM.getComputedStyle(parentNode, "height"), 10);
            parentNode.appendChild(node);
            node.style.display = "block";
            node.style.position = "absolute";
            node.style.left = this.get("x") + "px";
            node.style.top = this.get("y") + "px";
            this.set("width", w);
            this.set("height", h);
            this.parentNode = parentNode;
            return this;
        };
    }
