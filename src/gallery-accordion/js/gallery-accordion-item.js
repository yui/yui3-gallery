/**
 * Provides AccordionItem class
 *
 * @module gallery-accordion
 */

(function(){

/**
 * Create an AccordionItem widget.
 * 
 * @param config {Object} Object literal specifying AccordionItem configuration properties.
 *
 * @class AccordionItem
 * @constructor
 * @extends Widget
 */

function AccordionItem( config ){
    AccordionItem.superclass.constructor.apply( this, arguments );
}

// Local constants
var Lang = Y.Lang,
    Base = Y.Base,
    Node = Y.Node,
    JSON = Y.JSON,
    WidgetStdMod = Y.WidgetStdMod,
    AccItemName = "accordion-item",
    getCN = Y.ClassNameManager.getClassName,
    
    C_ICONEXPANDED_EXPANDING = getCN( AccItemName, "iconexpanded", "expanding" ),
    C_ICONEXPANDED_COLLAPSING = getCN( AccItemName, "iconexpanded", "collapsing" ),

    C_ICON = getCN( AccItemName, "icon" ),
    C_LABEL = getCN( AccItemName, "label" ),
    C_ICONALWAYSVISIBLE = getCN( AccItemName, "iconalwaysvisible" ),
    C_ICONSCONTAINER = getCN( AccItemName, "icons" ),
    C_ICONEXPANDED = getCN( AccItemName, "iconexpanded" ),
    C_ICONCLOSE = getCN( AccItemName, "iconclose" ),
    C_ICONCLOSE_HIDDEN = getCN( AccItemName, "iconclose", "hidden" ),

    C_ICONEXPANDED_ON = getCN( AccItemName, "iconexpanded", "on" ),
    C_ICONEXPANDED_OFF = getCN( AccItemName, "iconexpanded", "off" ),

    C_ICONALWAYSVISIBLE_ON = getCN( AccItemName, "iconalwaysvisible", "on" ),
    C_ICONALWAYSVISIBLE_OFF = getCN( AccItemName, "iconalwaysvisible", "off" ),

    C_EXPANDED =  getCN( AccItemName, "expanded" ),
    C_CLOSABLE =  getCN( AccItemName, "closable" ),
    C_ALWAYSVISIBLE =  getCN( AccItemName, "alwaysvisible" ),
    C_CONTENTHEIGHT =  getCN( AccItemName, "contentheight" ),

    TITLE = "title",
    STRINGS = "strings",
    CONTENT_BOX = "contentBox",
    RENDERED = "rendered",
    CLASS_NAME = "className",
    AUTO = "auto",
    STRETCH = "stretch",
    FIXED = "fixed",
    HEADER_SELECTOR = ".yui-widget-hd",
    DOT = ".",
    HEADER_SELECTOR_SUB = ".yui-widget-hd " + DOT,
    INNER_HTML = "innerHTML",
    ICONS_CONTAINER = "iconsContainer",
    ICON = "icon",
    NODE_LABEL = "nodeLabel",
    ICON_ALWAYSVISIBLE = "iconAlwaysVisible",
    ICON_EXPANDED = "iconExpanded",
    ICON_CLOSE = "iconClose",
    HREF = "href",
    HREF_VALUE = "#",
    YUICONFIG = "yuiConfig",
    HEADER_CONTENT = "headerContent",

    REGEX_TRUE = /^(?:true|yes|1)$/,
    REGEX_AUTO = /^auto\s*/,
    REGEX_STRETCH = /^stretch\s*/,
    REGEX_FIXED = /^fixed-\d+/;

/**
 *  Static property provides a string to identify the class.
 *
 * @property AccordionItem.NAME
 * @type String
 * @static
 */
AccordionItem.NAME = AccItemName;

/**
 * Static property used to define the default attribute 
 * configuration for the Accordion.
 * 
 * @property Accordion.ATTRS
 * @type Object
 * @static
 */
AccordionItem.ATTRS = {

    /**
     * @description Item's icon
     *
     * @attribute icon
     * @default null
     * @type Node
     */
    icon: {
        value: null,
        validator: function( value ){
            return value instanceof Node;
        }
    },

    /**
     * @description The label of the item
     *
     * @attribute label
     * @default "&#160;"
     * @type String
     */
    label: {
        value: "&#160;",
        validator: Lang.isString
    },

    /**
     * @description The node, contains label
     *
     * @attribute nodeLabel
     * @default null
     * @type Node
     */
    nodeLabel: {
        value: null,
        validator: function( value ){
            return value instanceof Node;
        }
    },


    /**
     * @description The container of iconAlwaysVisible, iconExpanded and iconClose
     *
     * @attribute iconsContainer
     * @default null
     * @type Node
     */
    iconsContainer: {
        value: null,
        validator: function( value ){
            return value instanceof Node;
        }
    },

    /**
     * @description Icon expanded
     *
     * @attribute iconExpanded
     * @default null
     * @type Node
     */
    iconExpanded: {
        value: null,
        validator: function( value ){
            return value instanceof Node;
        }
    },


    /**
     * @description Icon always visible
     *
     * @attribute iconAlwaysVisible
     * @default null
     * @type Node
     */
    iconAlwaysVisible: {
        value: null,
        validator: function( value ){
            return value instanceof Node;
        }
    },


    /**
     * @description Icon close, or null if the item is not closable
     *
     * @attribute iconClose
     * @default null
     * @type Node
     */
    iconClose: {
        value: null,
        validator: function( value ){
            return value instanceof Node;
        }
    },

    /**
     * @description Get/Set expanded status of the item
     *
     * @attribute expanded
     * @default false
     * @type Boolean
     */
    expanded: {
        value: false,
        validator: Lang.isBoolean
    },

    /**
     * @description Describe the method, which will be used when expanding/collapsing
     * the item. The value should be an object with at least one property ("method"):
     *  <dl>
     *      <dt>method</dt>
     *          <dd>The method can be one of these: "auto", "fixed" and "stretch"</dd>
     *      <dt>height</dt>
     *          <dd>Must be set only if method's value is "fixed"</dd>
     *  </dl>
     *
     * @attribute contentHeight
     * @default auto
     * @type Object
     */
    contentHeight: {
        value: {
            method: AUTO
        },
        validator: function( value ){
            if( Lang.isObject( value ) ){
                if( value.method === AUTO ){
                    return true;
                } else if( value.method === STRETCH ){
                    return true;
                } else if( value.method === FIXED && Lang.isNumber( value.height ) &&
                    value.height >= 0 ){
                    return true;
                }
            }
            
            return false;
        }
    },

    /**
     * @description Get/Set always visible status of the item
     *
     * @attribute alwaysVisible
     * @default false
     * @type Boolean
     */
    alwaysVisible: {
        value: false,
        validator: Lang.isBoolean
    },
    
    
    /**
     * @description Get/Set the animaton specific settings. By default there are no any settings.
     * If set, they will overwrite Accordion's animation settings
     *
     * @attribute animation
     * @default {}
     * @type Object
     */
    animation: {
        value: {},
        validator: Lang.isObject
    },

    /**
     * @description Provides client side string localization support.
     *
     * @attribute strings
     * @default Object English messages
     * @type Object
     */
    strings: {
        value: {
            title_always_visible_off: "Click to set always visible on",
            title_always_visible_on: "Click to set always visible off",
            title_iconexpanded_off: "Click to expand",
            title_iconexpanded_on: "Click to collapse",
            title_iconclose: "Click to close"
        }
    },

    /**
     * @description Flag, indicated whether the item can be closed by user, or not
     * If yes, there will be placed close icon, otherwise not
     *
     * @attribute closable
     * @default false
     * @type Boolean
     */
    closable: {
        value: false,
        validator: Lang.isBoolean
    }
};


/**
 * Static Object hash used to capture existing markup for progressive
 * enhancement.  Keys correspond to config attribute names and values
 * are selectors used to inspect the contentBox for an existing node
 * structure.
 *
 * @property AccordionItem.HTML_PARSER
 * @type Object
 * @protected
 * @static
 */
AccordionItem.HTML_PARSER = {

    icon: function( contentBox ){
        var node, iconSelector;

        iconSelector = HEADER_SELECTOR_SUB + C_ICON;
        node = contentBox.query( iconSelector );

        return node;
    },

    label: function( contentBox ){
        var node, labelSelector, yuiConfig, label;
        
        yuiConfig = this._getConfigDOMAttribute( contentBox );
        
        if( yuiConfig && Lang.isValue( yuiConfig.label ) ){
            return yuiConfig.label;
        }

        label = contentBox.getAttribute( "data-label" );

        if( label ){
            return label;
        }

        labelSelector = HEADER_SELECTOR_SUB + C_LABEL;
        node = contentBox.query( labelSelector );

        return (node) ? node.get( INNER_HTML ) : null;
    },

    nodeLabel: function( contentBox ){
        var node, labelSelector;

        labelSelector = HEADER_SELECTOR_SUB + C_LABEL;
        node = contentBox.query( labelSelector );

        return node;
    },

    iconsContainer:  function( contentBox ){
        var node, iconsContainer;

        iconsContainer = HEADER_SELECTOR_SUB + C_ICONSCONTAINER;
        node = contentBox.query( iconsContainer );

        return node;
    },
    
    iconAlwaysVisible: function( contentBox ){
        var node, iconAlwaysVisibleSelector;

        iconAlwaysVisibleSelector = HEADER_SELECTOR_SUB + C_ICONALWAYSVISIBLE;
        node = contentBox.query( iconAlwaysVisibleSelector );

        return node;
    },

    iconExpanded: function( contentBox ){
        var node, iconExpandedSelector;

        iconExpandedSelector = HEADER_SELECTOR_SUB + C_ICONEXPANDED;
        node = contentBox.query( iconExpandedSelector );

        return node;
    },

    iconClose: function( contentBox ){
        var node, iconCloseSelector;

        iconCloseSelector = HEADER_SELECTOR_SUB + C_ICONCLOSE;
        node = contentBox.query( iconCloseSelector );

        return node;
    },

    expanded: function( contentBox ){
        var yuiConfig, expanded;

        yuiConfig = this._getConfigDOMAttribute( contentBox );

        if( yuiConfig && Lang.isBoolean( yuiConfig.expanded ) ){
            return yuiConfig.expanded;
        }

        expanded = contentBox.getAttribute( "data-expanded" );

        if( expanded ) {
            return REGEX_TRUE.test( expanded );
        }

        return contentBox.hasClass( C_EXPANDED );
    },

    alwaysVisible: function( contentBox ){
        var yuiConfig, alwaysVisible;

        yuiConfig = this._getConfigDOMAttribute( contentBox );

        if( yuiConfig && Lang.isBoolean( yuiConfig.alwaysVisible ) ){
            alwaysVisible = yuiConfig.alwaysVisible;
        } else {
            alwaysVisible = contentBox.getAttribute( "data-alwaysvisible" );

            if( alwaysVisible ) {
                alwaysVisible = REGEX_TRUE.test( alwaysVisible );
            } else {
                alwaysVisible = contentBox.hasClass( C_ALWAYSVISIBLE );
            }
        }

        if( alwaysVisible ){
            this.set( "expanded", true, {
                internalCall: true
            } );
        }

        return alwaysVisible;
    },

    closable: function( contentBox ){
        var yuiConfig, closable;

        yuiConfig = this._getConfigDOMAttribute( contentBox );

        if( yuiConfig && Lang.isBoolean( yuiConfig.closable ) ){
            return yuiConfig.closable;
        }

        closable = contentBox.getAttribute( "data-closable" );

        if( closable ) {
            return REGEX_TRUE.test( closable );
        }

        return contentBox.hasClass( C_CLOSABLE );
    },

    contentHeight: function( contentBox ){
        var contentHeightClass, classValue, height = 0, index, yuiConfig,
            contentHeight;

        yuiConfig = this._getConfigDOMAttribute( contentBox );

        if( yuiConfig && yuiConfig.contentHeight ){
            return yuiConfig.contentHeight;
        }

        contentHeight = contentBox.getAttribute( "data-contentheight" );

        if( REGEX_AUTO.test( contentHeight ) ){
            return {
                method: AUTO
            };
        } else if( REGEX_STRETCH.test( contentHeight ) ){
            return {
                method: STRETCH
            };
        } else if( REGEX_FIXED.test( contentHeight ) ){
            height = this._extractFixedMethodValue( contentHeight );

            return {
                method: FIXED,
                height: height
            };
        }


        classValue = contentBox.get( CLASS_NAME );

        contentHeightClass = C_CONTENTHEIGHT + '-';

        index = classValue.indexOf( contentHeightClass, 0);

        if( index >= 0 ){
            index += contentHeightClass.length;

            classValue = classValue.substring( index );

            if( REGEX_AUTO.test( classValue ) ){
                return {
                    method: AUTO
                };
            } else if( REGEX_STRETCH.test( classValue ) ){
                return {
                    method: STRETCH
                };
            } else if( REGEX_FIXED.test( classValue )  ){
                height = this._extractFixedMethodValue( classValue );
                
                return {
                    method: FIXED,
                    height: height
                };
            }
        }

        return null;
    }
};


 /**
  * The template HTML strings for each of header components.
  * e.g.
  * <pre>
  *    {
  *       icon : '&lt;a class="yui-accordion-item-icon"&gt;&lt;/a&gt;',
  *       label: '&lt;a href="#" class="yui-accordion-item-label"&gt;&lt;/a&gt;',
  *       iconsContainer: '&lt;div class="yui-accordion-item-icons"&gt;&lt;/div&gt;',
  *       iconAlwaysVisible: '&lt;a href="#" class="yui-accordion-item-iconalwaysvisible"&gt;&lt;/a&gt;',
  *       iconExpanded: '&lt;a href="#" class="yui-accordion-item-iconexpanded"&gt;&lt;/a&gt;',
  *       iconClose: '&lt;a href="#" class="yui-accordion-item-iconclose yui-accordion-item-iconclose-hidden"&gt;&lt;/a&gt;'
  *    }
  * </pre>
  * @property WidgetStdMod.TEMPLATES
  * @type Object
  */
AccordionItem.TEMPLATES = {
     icon : '<a class="' + C_ICON + '"></a>',
     label: '<a href="#" class="' + C_LABEL + '"></a>',
     iconsContainer: '<div class="' + C_ICONSCONTAINER + '"></div>',
     iconExpanded: ['<a href="#" class="', C_ICONEXPANDED, ' ', C_ICONEXPANDED_OFF, '"></a>'].join(''),
     iconAlwaysVisible: ['<a href="#" class="', C_ICONALWAYSVISIBLE, ' ',  C_ICONALWAYSVISIBLE_OFF, '"></a>'].join(''),
     iconClose: ['<a href="#" class="', C_ICONCLOSE, ' ', C_ICONCLOSE_HIDDEN, '"></a>'].join('')
};


// AccordionItem extends Widget

Y.extend( AccordionItem, Y.Widget, {

    /**
     * Creates the header content
     *
     * @method _createHeader
     * @protected
     */
    _createHeader: function(){
        var closable, templates, strings,  iconsContainer,
            icon, nodeLabel, iconExpanded, iconAlwaysVisible, iconClose;

        icon = this.get( ICON );
        nodeLabel = this.get( NODE_LABEL );
        iconExpanded = this.get( ICON_EXPANDED );
        iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );
        iconClose = this.get( ICON_CLOSE );
        iconsContainer = this.get( ICONS_CONTAINER );
        
        strings = this.get( STRINGS );
        closable = this.get( "closable" );
        templates = AccordionItem.TEMPLATES;
        
        if( !icon ){
            icon = Node.create( templates.icon );
            this.set( ICON, icon );
        }

        if( !nodeLabel ){
            nodeLabel = Node.create( templates.label );
            this.set( NODE_LABEL, nodeLabel );
        } else if( !nodeLabel.hasAttribute( HREF ) ){
            nodeLabel.setAttribute( HREF, HREF_VALUE );
        }

        nodeLabel.setContent( this.get( "label" ) );


        if( !iconsContainer ){
            iconsContainer = Node.create( templates.iconsContainer );
            this.set( ICONS_CONTAINER, iconsContainer );
        }

        if( !iconAlwaysVisible ){
            iconAlwaysVisible = Node.create( templates.iconAlwaysVisible );
            iconAlwaysVisible.setAttribute( TITLE, strings.title_always_visible_off );
            this.set( ICON_ALWAYSVISIBLE, iconAlwaysVisible );
        } else if( !iconAlwaysVisible.hasAttribute( HREF ) ){
            iconAlwaysVisible.setAttribute( HREF, HREF_VALUE );
        }

        
        if( !iconExpanded ){
            iconExpanded = Node.create( templates.iconExpanded );
            iconExpanded.setAttribute( TITLE, strings.title_iconexpanded_off );
            this.set( ICON_EXPANDED, iconExpanded );
        } else if( !iconExpanded.hasAttribute( HREF ) ){
            iconExpanded.setAttribute( HREF, HREF_VALUE );
        }
        
        
        if( !iconClose ){
            iconClose = Node.create( templates.iconClose );
            iconClose.setAttribute( TITLE, strings.title_iconclose );
            this.set( ICON_CLOSE, iconClose );
        } else if( !iconClose.hasAttribute( HREF ) ){
            iconClose.setAttribute( HREF, HREF_VALUE );
        }
        
        if( closable ){
            iconClose.removeClass( C_ICONCLOSE_HIDDEN );
        } else {
            iconClose.addClass( C_ICONCLOSE_HIDDEN );
        }

        this._addHeaderComponents();
    },

    /**
     * Add label and icons in the header. Also, it creates header in if not set from markup
     *
     * @method _addHeaderComponents
     * @protected
     */
    _addHeaderComponents: function(){
        var header, icon, nodeLabel, iconsContainer, iconExpanded,
            iconAlwaysVisible, iconClose;

        icon = this.get( ICON );
        nodeLabel = this.get( NODE_LABEL );
        iconExpanded = this.get( ICON_EXPANDED );
        iconAlwaysVisible = this.get( ICON_ALWAYSVISIBLE );
        iconClose = this.get( ICON_CLOSE );
        iconsContainer = this.get( ICONS_CONTAINER );

        header = this.get( HEADER_CONTENT );

        if( !header ){
            header = new Node( document.createDocumentFragment() );
            header.appendChild( icon );
            header.appendChild( nodeLabel );
            header.appendChild( iconsContainer );
            iconsContainer.appendChild( iconAlwaysVisible );
            iconsContainer.appendChild( iconExpanded );
            iconsContainer.appendChild( iconClose );

            this.setStdModContent( WidgetStdMod.HEADER, header, WidgetStdMod.REPLACE );
        } else {
            if( !header.contains( icon ) ){
                if( header.contains( nodeLabel ) ){
                    header.insertBefore( icon, nodeLabel );
                } else {
                    header.appendChild( icon );
                }
            }

            if( !header.contains( nodeLabel ) ){
                header.appendChild( nodeLabel );
            }

            if( !header.contains( iconsContainer ) ){
                header.appendChild( iconsContainer );
            }

            if( !iconsContainer.contains( iconAlwaysVisible ) ){
                iconsContainer.appendChild( iconAlwaysVisible );
            }

            if( !iconsContainer.contains( iconExpanded ) ){
                iconsContainer.appendChild( iconExpanded );
            }

            if( !iconsContainer.contains( iconClose ) ){
                iconsContainer.appendChild( iconClose );
            }
        }
    },


    /**
     * Handles the change of "labelChanged" property. Updates item's UI with the label provided
     * 
     * @method _labelChanged
     * @protected
     * @param {EventFacade} params The event facade for the attribute change
     */
    _labelChanged: function( params ){
        var label;
        
        if( this.get( RENDERED ) ){
            label = this.get( NODE_LABEL );
            label.set( INNER_HTML, params.newVal );
        }
    },


    /**
     * Handles the change of "closableChanged" property. Hides or shows close icon
     *
     * @method _closableChanged
     * @protected
     * @param {EventFacade} params The event facade for the attribute change
     */
    _closableChanged: function( params ){
        var selector, node, contentBox;

        if( this.get( RENDERED ) ){
            contentBox = this.get( CONTENT_BOX );
        
            selector = HEADER_SELECTOR_SUB + C_ICONCLOSE;
            node = contentBox.query( selector );

            if( params.newVal ){
                node.removeClass( C_ICONCLOSE_HIDDEN );
            } else {
                node.addClass( C_ICONCLOSE_HIDDEN );
            }
        }
    },


    /**
     * Initializer lifecycle implementation for the AccordionItem class.
     *
     * @method initializer
     * @protected
     * @param  config {Object} Configuration object literal for the AccordionItem
     */
    initializer: function( config ) {

        this.after( "labelChange",  Y.bind( this._labelChanged, this ) );
        this.after( "closableChange", Y.bind( this._closableChanged, this ) );
    },
    
    /**
     * Destructor lifecycle implementation for the AccordionItem class.
     *
     * @method destructor
     * @protected
     */
    destructor : function() {
        // EMPTY
    },

    
    /**
     * Creates AccordionItem's header.
     * 
     * @method renderUI
     * @protected
     */
    renderUI: function(){
        this._createHeader();
    },
    
    /**
     * Configures/Sets up listeners to bind Widget State to UI/DOM
     *
     * @method bindUI
     * @protected
     */
    bindUI: function(){
        var contentBox;
        
        contentBox = this.get( CONTENT_BOX );
        
        contentBox.delegate( "click", Y.bind( this._onLinkClick, this ), HEADER_SELECTOR + ' a' );
    },



    /**
     * Prevent default action on clicking the link in the label
     *
     * @method _onLinkClick
     * @protected
     *
     * @param e {Event} The click event
     */
    _onLinkClick: function( e ){
        e.preventDefault();
    },
    
   /**
    * Marks the item as always visible by adding class to always visible icon.
    * The icon will be updated only if needed.
    * 
    * @method markAsAlwaysVisible
    * @param {Boolean} alwaysVisible Whether or not the item should be marked as always visible
    * @return Boolean Return true if the icon has been updated, false if there was no need to update
    */
    markAsAlwaysVisible: function( alwaysVisible ){
        var iconAlwaysVisisble, strings;

        iconAlwaysVisisble = this.get( ICON_ALWAYSVISIBLE );
        strings = this.get( STRINGS );

        if( alwaysVisible ){
            if( !iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){
                iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_OFF, C_ICONALWAYSVISIBLE_ON );
                iconAlwaysVisisble.set( TITLE, strings.title_always_visible_on );
                return true;
            }
        } else {
            if( iconAlwaysVisisble.hasClass( C_ICONALWAYSVISIBLE_ON ) ){
                iconAlwaysVisisble.replaceClass( C_ICONALWAYSVISIBLE_ON, C_ICONALWAYSVISIBLE_OFF );
                iconAlwaysVisisble.set( TITLE, strings.title_always_visible_off );
                return true;
            }
        }
        
        return false;
    },

    
    /**
    * Marks the item as expanded by adding class to expand icon.
    * The icon will be updated only if needed.
    * 
    * @method markAsExpanded
    * @param {Boolean} expanded Whether or not the item should be marked as expanded
    * @return Boolean Return true if the icon has been updated, false if there was no need to update
    */
    markAsExpanded: function( expanded ){
        var strings, iconExpanded;
        
        iconExpanded = this.get( ICON_EXPANDED );
        strings = this.get( STRINGS );

        if( expanded ){
            if( !iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){
                iconExpanded.replaceClass( C_ICONEXPANDED_OFF, C_ICONEXPANDED_ON );
                iconExpanded.set( TITLE , strings.title_iconexpanded_on );
                return true;
            }
        } else {
            if( iconExpanded.hasClass( C_ICONEXPANDED_ON ) ){
                iconExpanded.replaceClass( C_ICONEXPANDED_ON, C_ICONEXPANDED_OFF );
                iconExpanded.set( TITLE , strings.title_iconexpanded_off );
                return true;
            }
        }
        
        return false;
    },

   
   /**
    * Marks the item as expanding by adding class to expand icon.
    * The method will update icon only if needed.
    * 
    * @method markAsExpanding
    * @param {Boolean} expanding Whether or not the item should be marked as expanding
    * @return Boolean Return true if the icon has been updated, false if there was no need to update
    */
    markAsExpanding: function( expanding ){
        var iconExpanded = this.get( ICON_EXPANDED );
        
        if( expanding ){
            if( !iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){
                iconExpanded.addClass( C_ICONEXPANDED_EXPANDING );
                return true;
            }
        } else {
            if( iconExpanded.hasClass( C_ICONEXPANDED_EXPANDING ) ){
                iconExpanded.removeClass( C_ICONEXPANDED_EXPANDING );
                return true;
            }
        }
        
        return false;
    },

    
   /**
    * Marks the item as collapsing by adding class to expand icon.
    * The method will update icon only if needed.
    * 
    * @method markAsCollapsing
    * @param {Boolean} collapsing Whether or not the item should be marked as collapsing
    * @return Boolean Return true if the icon has been updated, false if there was no need to update
    */
    markAsCollapsing: function( collapsing ){
        var iconExpanded = this.get( ICON_EXPANDED );

        if( collapsing ){
            if( !iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){
                iconExpanded.addClass( C_ICONEXPANDED_COLLAPSING );
                return true;
            }
        } else {
            if( iconExpanded.hasClass( C_ICONEXPANDED_COLLAPSING ) ){
                iconExpanded.removeClass( C_ICONEXPANDED_COLLAPSING );
                return true;
            }
        }
        
        return false;
    },


    /**
     * Parses and returns the yuiConfig attribute from contentBox. It must be stringified JSON object.
     * This function will be replaced with more clever solution when YUI 3.1 becomes available
     *
     * @method _getConfigDOMAttribute
     * @param {Node} contentBox Widget's contentBox
     * @return {Object} The parsed yuiConfig value
     * @private
     */
    _getConfigDOMAttribute: function( contentBox ) {
        if( !this._parsedCfg ){
            this._parsedCfg = contentBox.getAttribute( YUICONFIG );

            if( this._parsedCfg ){
                this._parsedCfg = JSON.parse( this._parsedCfg );
            }
        }

        return this._parsedCfg;
    },


    /**
     * Parses and returns the value of contentHeight property, if set method "fixed".
     * The value must be in this format: fixed-X, where X is integer
     *
     * @method _extractFixedMethodValue
     * @param {String} value The value to be parsed
     * @return {Number} The parsed value or null
     * @protected
     */
    _extractFixedMethodValue: function( value ){
        var i, length, chr, height = null;

        for( i = 6, length = value.length; i < length; i++ ){ // 6 = "fixed-".length
            chr = value.charAt(i);
            chr = parseInt( chr, 10 );

            if( Lang.isNumber( chr ) ){
                height = (height * 10) + chr;
            } else {
                break;
            }
        }

        return height;
    }
    
});

// Add WidgetStdMod's functionality to AccordionItem
Base.build( AccordionItem.NAME, AccordionItem, [ WidgetStdMod ], {
    dynamic: false
});

Y.AccordionItem = AccordionItem;

}());

