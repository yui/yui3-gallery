
 /**
 *  YUI3 Treeview
 *
 * @module gallery-yui3treeview
 */

    Y.Treeview = Y.Base.create("treeview", WIDGET, [Y.WidgetParent, Y.WidgetChild, Y.WidgetHTMLRenderer], {
    
       BOUNDING_TEMPLATE : '<ul id="{{id}}" class="{{boundingClasses}}">{{{contentBox}}}</ul>',
        
        CONTENT_TEMPLATE : null,
        
        TREEVIEWLABEL_TEMPLATE : "<a class='{{treelabelClassName}}' role='treeitem' href='javascript:void(0);'><span class={{labelcontentClassName}}>{{{label}}}</span></a>",
    
        EXPANDCONTROL_TEMPLATE : "<span class='{labelcontentClassName}'>{label}</span>",
        
        _populated : null,

        /**
         * Initializer lifecycle implementation for the Treeview class. 
         * <p>Registers the Treeview instance. It subscribes to the onParentChange 
         *    event which is triggered each time a new tree is added.</p>
         * <p>It publishes the toggleTreeState event, which gets fired everytime a node is
         *    collapsed/expanded</p>
         *
         * @method initializer
         * @public
         * @param  config {Object} Configuration object literal for the widget
         */
        initializer : function (config) {
            
            this.lazyLoad = config.lazyLoad;
            
            //this.after('parentChange', this._onParentChange,this);
            this.publish('toggleTreeState', { 
                defaultFn: this._toggleTreeState
            });
        },
        
        renderUI: function (contentBuffer) {
            var label = this.get("label"),
                labelContent,
                isBranch = this.get("depth") > -1,
                handlebars = Y.Handlebars,
                treelabelClassName = this.getClassName("treelabel"),
                labelcontentClassName = classNames.labelcontent;
                
                
            this.BOUNDING_TEMPLATE = isBranch ? '<li id="{{id}}" class="{{boundingClasses}}">{{{contentBox}}}</li>' : '<ul id="{{id}}" class="{{boundingClasses}}">{{{contentBox}}}</ul>';
            this.CONTENT_TEMPLATE = isBranch ? '<ul id="{{id}}" class="{{contentClasses}}">{{{content}}}</ul>' : null;
            labelContent = handlebars.render(this.TREEVIEWLABEL_TEMPLATE, {label:label, treelabelClassName : treelabelClassName, labelcontentClassName : labelcontentClassName});
            contentBuffer.push(labelContent);
        },
        
        /**
        * Utility method to add the boundingClasses and contentClasses property values
        * to the Handlebars context passed in. Similar to _renderBoxClassNames() on
        * the Node based renderer.
        *
        * @method _renderBoxClassNames
        * @param {Object} context The Handlebars context object on which the
        * boundingClasses and contentClasses properties get added.
        */
        _renderBoxClassNames: function(context) {
            var classes = this._getClasses(),
                cl,
                i,
                contentClass = this.getClassName(CONTENT),
                boundingClasses = [];
                
                boundingClasses[boundingClasses.length] = Widget.getClassName();
                
                
            for (i = classes.length-3; i >= 0; i--) {
                cl = classes[i];
                boundingClasses[boundingClasses.length] = Y.ClassNameManager.getClassName(cl.NAME.toLowerCase()) || this.getClassName(cl.NAME.toLowerCase());
            }
            
            
            
            if (this.CONTENT_TEMPLATE === null) {
                boundingClasses.push(contentClass);
                boundingClasses.push(classNames.collapsed);
            } else {
                context.contentClasses = contentClass + " " + classNames.collapsed;
            }
            
            context.boundingClasses = boundingClasses.join(" ");
        },

    
    
        bindUI: function() {
            if (this.isRoot()) {
                this.get("boundingBox").on("click",this._onViewEvents,this);
                
                
               /*
 this.get("boundingBox").on("click", function(e) {
                            var widget = Y.Widget.getByNode(e.target);
                            // Optional - Maybe we can render here, or when user asks for a child, 
                            // so we can use get("boundingBox")/get("contentBox")?
                            // widget.render();
                            // console.log(widget.get("id") + ":" + widget.get("boundingBox").get("className"));
                            console.log(widget.get("id") + ":" + widget.name);
                        });
*/

                    }
        },
        
         /**
         * Handles all the internal treeview events. In this case, all it does it fires the
         * collaped/expand event when a treenode is clicked
         * @method onViewEvents
         * @protected
         */
        _onViewEvents : function (event) {
            var target = event.target,
                keycode = event.keyCode,
                classes,
                className,
                i,
                cLength;
            
            classes = target.get("className").split(" ");
            cLength = classes.length;
            
            event.preventDefault();
            

            for (i=0;i<cLength;i++) {
                className = classes[i];
                switch (className) {
                    case classNames.labelcontent :
                        this.fire('toggleTreeState',{actionNode:target});
                        break;
                    case classNames.treeLabel :
                        if (keycode === 39) {
                            this._expandTree(target);
                        } else if (keycode === 37) {
                            this._collapseTree(target);
                        }
                        break;
                }
            }
        },
    
    
        _renderChildren: function (contentBuffer) {
            // Left this as a string on purpose, since the other buffer was 
            // confusing you. 
            // But you can see how you could replace the
            //    childrenHTML = ""; childrenHTML += child.renderHTML(); with
            //    childrenHTML = [], childrenHTML.push(child.renderHTML());
    
            if (this.lazyLoad) {
            
            } else {
                this._onLazyRenderChildren(contentBuffer);
            }
        },
        
        _onLazyRenderChildren : function (widget,tree) {
            var childrenHTML = "";
            
                if (widget.each) {
                    widget.each(function (child) {
                        childrenHTML += child.renderHTML();
                    });
                }
                
                if (tree && tree.set) {
                    tree.append(childrenHTML);
                }
        },
        
                
        /**
         * Toggles the collapsed/expanded class
         * @method _toggleTreeState
         * @protected
         */
        _toggleTreeState : function (target) {
        
            var tree = target.actionNode.ancestor('.yui3-treeview-content'),
                widget = Y.Widget.getByNode(target.actionNode);
            
            
            if (this.lazyLoad && !tree.hasClass("rendered")) {
                this._onLazyRenderChildren(widget,tree);
                tree.addClass("rendered");

            }
            tree.toggleClass(classNames.collapsed);
        },
        
        /**
         * Collapse the tree
         * @method _collapseTree
         * @protected
         */
        _collapseTree: function (target) {
            var tree = target.ancestor('.'+classNames.treeview);   
            
            if (!tree.hasClass(classNames.collapsed)) {
                tree.toggleClass(classNames.collapsed);
            }
        },
        
        
        
        /**
         * Expands the tree
         * @method _expandTree
         * @protected
         */
        _expandTree : function (target) {
            var tree = target.ancestor('.'+classNames.treeview);   
            
            if (tree.hasClass(classNames.collapsed)) {
                tree.toggleClass(classNames.collapsed);
            }
        }
    }, {
    
        ATTRS: {
            label: {
                value:"Default Parent Label"
            },
            defaultChildType: {  
                value: "TreeLeaf"
            },
            boundingBox: {
                getter : function(val) {
                    if (this.get("initialized") && !this.get("rendered") && !this._handling && this._populated) {
                        this._handling = TRUE;
                        this.render();
                        val = this._state.get(BOUNDING_BOX, VALUE);
                    }
                    return val;
                }
            },
            contentBox: {
                getter : function(val) {
                    
                    if (this.get("initialized") && !this.get("rendered") && !this._handling && this._populated) {
                        this._handling = TRUE;
                        this.render();
                        val = this._state.get(CONTENT_BOX, VALUE);
                    }
                    return val;
                }
            }
        }
    });
    
     Y.TreeLeaf = Y.Base.create("treeleaf", WIDGET, [Y.WidgetChild,Y.WidgetHTMLRenderer], {
    
    
        BOUNDING_TEMPLATE : '<li id="{{id}}" class="{{boundingClasses}}">{{{contentBox}}}</li>',
    
        CONTENT_TEMPLATE : null,
    
    
        renderUI: function (contentBuffer) {
            contentBuffer.push(this.get("label"));
        }
    }, {
    
        ATTRS: {
            label: {
                value:"Default Child Label"
            },
            boundingBox: {
                getter : function(val) {
                    if (this.get("initialized") && !this.get("rendered") && !this._handling && this.get("parent")._populated) {
                        this._handling = TRUE;
                        this.render();
                        val = this._state.get(BOUNDING_BOX, VALUE);
                    }
                    return val;
                }
            },
            contentBox: {
                getter : function(val) {
                    if (this.get("initialized") && !this.get("rendered") && !this._handling && this.get("parent")._populated) {
                        this._handling = TRUE;
                        this.render();
                        val = this._state.get(CONTENT_BOX, VALUE);
                    }
                    return val;
                }
            }

        }
    });
