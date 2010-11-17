YUI.add('gallery-yui3treeview', function(Y) {

var getClassName = Y.ClassNameManager.getClassName,
        TREEVIEW = 'treeview',
        TREE = 'tree',
        TREELEAF = 'treeleaf',
        CONTENT_BOX = "contentBox",
        BOUNDING_BOX = "boundingBox",
        INNERHTML = "innerHTML",
        _instances = {},
        TRUE = true,
        FALSE = false,
        classNames = {
            loading : getClassName(TREEVIEW,'loading'),
            tree : getClassName(TREE),
            treeLabel : getClassName(TREEVIEW,"treelabel"),
            treeview : getClassName(TREEVIEW),
            leaf : getClassName(TREELEAF),
            collapsed : getClassName(TREE,"collapsed"),
            hasChildren : getClassName("hasChildren"),
            expanded : getClassName(TREE,'expanded')
        };

        
/**
 * Treeview widget. Provides a tree style widget, with a hierachical representation of it's components.
 * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   
 * @class TreeView
 * @constructor
 * @uses WidgetParent, WidgetChild
 * @extends Widget
 * @param {Object} config User configuration object.
 */
    Y.TreeView = Y.Base.create("treeview", Y.Widget, [Y.WidgetParent, Y.WidgetChild], {
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
            
            this.after('parentChange', this._onParentChange,this);
            this.publish('toggleTreeState', { 
                defaultFn: this._toggleTreeState
            });
            _instances[Y.stamp(this.get(BOUNDING_BOX))] = this;

        },
        
        /**
         * Flag to determine if the tree is being rendered from markup or not
         * @property _renderFromMarkup
         * @protected
         */ 
        _renderFromMarkup : FALSE,
        
        /**
         * It fires each time there is parent change. In this case, we use it to dinamically change
         * the boundingbox to be a semantic li rather than the default div.
         * It also does some rendering operations.
         * @method _onParentChange
         * @protected
         */
        _onParentChange : function () {
            var isTree = this.get("depth") > -1,
                tag = isTree ? "<li></li>" : "<div></div>",
                treeLabelHtml,
                boundingBox = this.get(BOUNDING_BOX),
                labelContainer,
                label,
                treelabelClassName = this.getClassName("treelabel"),
                treeLabeltokens;
                
                
                //We get the anchor to retrieve the label, we add the classname
                if (this._renderFromMarkup) {
                    labelContainer = boundingBox.one("> a");
                    labelContainer.addClass(treelabelClassName);
                    label = labelContainer.get(INNERHTML);
                    this.set("label",label);
                    this._renderFromMarkup = FALSE;
                } else {
                    treeLabeltokens = {
                        treelabelClassName : treelabelClassName,
                        label : this.get("label")
                    };
                    treeLabelHtml = Y.substitute(this.TREEVIEWLABEL_TEMPLATE, treeLabeltokens);
                    treeLabelHtml = Y.Node.create(treeLabelHtml);
                    this._set(CONTENT_BOX,Y.Node.create("<ul></ul>"));
                    this._set(BOUNDING_BOX, Y.Node.create(tag));
                    boundingBox = this.get(BOUNDING_BOX).setContent(treeLabelHtml);
                    //Since we changed the boundigbox we need to update the _instance
                    _instances[Y.stamp(boundingBox)] = this;
                }
        },   
    
        CONTENT_TEMPLATE :  "<div></div>",
        
        BOUNDING_TEMPLATE : '<ul></ul>',
                              
        TREEVIEWLABEL_TEMPLATE : "<a class={treelabelClassName} href='#'>{label}</a>",
        
        EXPANDCONTROL_TEMPLATE : "<span class='{controlClassName}'>Expand/Collapse</a>",
        
        /**
         * In charge of attaching events. 
         * Plugs the NodeFocusManager for keyboard support, add an event to handle collapse events
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var boundingBox,
                contentBox;
            
            if (this.isRoot()) {
                boundingBox = this.get(BOUNDING_BOX);
                contentBox = this.get(CONTENT_BOX);
                boundingBox.on("click",this.onViewEvents,this);
                boundingBox.plug(Y.Plugin.NodeFocusManager, {
                    descendants: ".yui3-treeleaf-content, .yui3-treeview-treelabel",
                    keys: {
                        next: "down:40",    // Down arrow
                        previous: "down:38" // Up arrow 
                    },
                    circular: true
                });
            } 
        }, 
            
        /**
         * Needs to overwrite the Widget _createUIEvent, so it can reference treeview's own _instance
         * hash 
         * @method _createUIEvent
         * @protected
         */
        _createUIEvent: function (type) {
                var uiEvtNode = this._getUIEventNode(),
                    key = (Y.stamp(uiEvtNode) + type),
                    info,
                    self = this,
                    handle;
        
                    this._uievts = this._uievts || {};
                    info = this._uievts[key];
        
            //  For each Node instance: Ensure that there is only one delegated
            //  event listener used to fire Widget UI events.
            if (!info) {
                handle = uiEvtNode.delegate(type, function (evt) {
                    //access your own instance, you should be golden
                    var widget = self.getByNode(this);
                    
                    //  Make the DOM event a property of the custom event
                    //  so that developers still have access to it.
                     widget.fire(evt.type, { domEvent: evt });
            
                }, "." + Y.Widget.getClassName());
            
                this._uievts[key] = info = { instances: {}, handle: handle };
            }
            //Register this Widget as using this Node as a delegation container.
            info.instances[Y.stamp(this)] = 1;
        },

        /**
         * Needs to overwrite the Widget instance, used by _createUIEvent
         * @method getByNode
         * @param Y.Node 
         * @protected
         */
        getByNode : function (node) {
            var widget,
                widgetMarker = "yui3-widget";

            
            node = Y.Node.one(node);
            
            if (node) {
                node = node.ancestor("." + widgetMarker, true);
                if (node) {
                    widget = _instances[Y.stamp(node, TRUE)];
                }
            }
        
            return widget || null;
        },
     
    
        /**
         * Add class collapsed to all trees
         * @method renderUI
         * @protected
         */
        renderUI : function() {
            if (!this.isRoot()) {
                this.get(BOUNDING_BOX).addClass(classNames.collapsed);   
            }
        },
        
        /**
         * Toggles the collapsed/expanded class
         * @method renderUI
         * @protected
         */
        _toggleTreeState : function (e) {
            var tree = e.actionNode.ancestor('.'+classNames.treeview);                
            
            tree.toggleClass(classNames.collapsed);
        },
            
        /**
         * Handles all the internal treeview events. In this case, all it does it fires the
         * collaped/expand event when a treenode is clicked
         * @method onViewEvents
         * @protected
         */
        onViewEvents : function (event) {
            var target = event.target,
                classes,
                className,
                i,
                cLength;
            
            classes = target.get("className").split(" ");
            cLength = classes.length;
            
            event.preventDefault();
            
            for (i=0;i<cLength;i++) {
                className = classes[i];
                if (className === classNames.treeLabel) {
                    this.fire('toggleTreeState',{actionNode:target});
                }
            }
        }
    }, 
        
        { 
            NAME : "treeview",
            ATTRS : {
                /**
                 * @attribute defaultChildType
                 * @type String
                 * @readOnly
                 * @default child type definition
                 */
                defaultChildType: {  
                    value: "TreeLeaf",
                    readOnly:TRUE
                },
                /**
                 * @attribute label
                 * @type Number
                 *
                 * @description TreeView node label 
                 */
                label : {
                    validator: Y.Lang.isString
                },
                /**
                 * @attribute index
                 * @type Number
                 * @readOnly
                 *
                 * @description Number representing the Widget's ordinal position in its 
                 * parent Widget.
                 */
                loadOnDemand : {
                    value : null
                }
            },
            HTML_PARSER: {
                
                children : function (srcNode) {
                    var leafs = srcNode.all("> li"),
                        isContained = srcNode.ancestor("ul"),
                        subTree,
                        children = [];
                        
                    if (leafs.size() > 0 || isContained) {
                        this._renderFromMarkup = true;
                    } else {
                        this.CONTENT_TEMPLATE = null;
                    }
                    
                    leafs.each(function(node) {
                        var 
                            leafContent = node.one(":first-child"),
                            child = {
                                srcNode : leafContent,
                                boundingBox :node,
                                contentBox : leafContent,
                                type : null
                            };
                            
                       subTree = node.one("> ul"); 
                        
                        if (subTree){
                            child.type = "TreeView";
                            child.contentBox = subTree;
                            child.srcNode = subTree;
                        }
                        
                        children.push(child);
                    });
                    return children;
                }      
            }
        }
    );
    
    /**
     * TreeLeaf widget. Default child type for TreeView.
     * It extends  WidgetChild, please refer to it's documentation for more info.   
     * @class TreeLeaf
     * @constructor
     * @uses WidgetChild
     * @extends Widget
     * @param {Object} config User configuration object.
     */
    Y.TreeLeaf = Y.Base.create("treeleaf", Y.Widget, [Y.WidgetChild], {

        
        CONTENT_TEMPLATE : "<span></span>",
        
        BOUNDING_TEMPLATE : "<li></li>",
        
        initializer : function () {
            _instances[Y.stamp(this.get(BOUNDING_BOX))] = this;
        },
        
        renderUI: function () {
            this.get(CONTENT_BOX).setContent(this.get("label"));
        }
    }, {
        NAME : "TreeLeaf",
        ATTRS : {
            label : {
                validator: Y.Lang.isString
            },
            tabIndex: {
                value: -1
            }        
        },
        HTML_PARSER: {
            label : function (srcNode) {
                return srcNode.get(INNERHTML);
            }      
        }        
    });



}, 'gallery-2010.11.17-21-32' ,{supersedes:['substitute', 'widget', 'widget-parent', 'widget-child', 'node-focusmanager' ]});
