'use strict';

/*jshint maxlen:200 */

/**
 *
 * Widget ITSAPanel
 *
 *
 * Y.ITSAPanel is very much like Y.Panel. Major difference is that you can attach both View's and Strings, but there are more differences. See the docs.
 *
 *
 * @module gallery-itsapanel
 * @class ITSAPanel
 * @constructor
 * @extends Widget
 * @uses WidgetAutohide
 * @uses WidgetModality
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WidgetPositionConstrain
 * @uses WidgetStack
 * @since 0.1
 */

var ITSAPanel,
    YArray = Y.Array,
    Lang = Y.Lang,
    GALLERYCSS_ITSA = 'gallerycss-itsa-',
    DESTROYED = 'destroyed',
    STRING = 'string',
    BOOLEAN = 'boolean',
    VISIBLE = 'visible',
    WIDTH = 'width',
    HEIGHT = 'height',
    BOUNDINGBOX = 'boundingBox',
    CONTENTBOX = 'contentBox',
    PADDINGTOP = 'paddingTop',
    PADDINGBOTTOM = 'paddingBottom',
    BUTTON = 'button',
    ITSA = 'itsa-',
    FOCUSED = 'focused',
    FOCUSED_CLASS = ITSA+FOCUSED,
    HIDDEN = 'hidden',
    VIEW = 'View',
    PANEL = 'panel',
    CHANGE = 'Change',
    FLOATED = 'floated',
    BODY = 'body',
    HEADERVIEW = 'header'+VIEW,
    BODYVIEW = BODY+VIEW,
    FOOTER = 'footer',
    FOOTERVIEW = FOOTER+VIEW,
    NUMBER = 'number',
    OFFSETHEIGHT = 'offsetHeight',
    OFFSETWIDTH = 'offsetWidth',
    MODAL = 'modal',
    PX = 'px',
    TITLE = 'title',
    RIGHT = 'Right',
    CENTERED = 'centered',
    DRAG = 'drag',
    DRAGABLE = DRAG+'able',
    RESIZE = 'resize',
    RESIZABLE = 'resizable',
    DD = 'dd',
    PLUGIN = '-plugin',
    STYLED = 'styled',
    PANELCLASS = ITSA+PANEL,
    STYLEDPANELCLASS = ITSA+STYLED+PANEL,
    HIDDENPANELCLASS = ITSA+HIDDEN+PANEL,
    HIDDENSECTIONCLASS = ITSA+HIDDEN+'section',
    INLINECLASS = ITSA+'inline'+PANEL,
    CLASSNAME = 'className',
    PANELHEADERCLASS = ITSA+'panelheader',
    PANELBODYCLASS = ITSA+'panelbody',
    PANELFOOTERCLASS = ITSA+'panelfooter',
    PANELHEADERINNERCLASS = ITSA+'panelinnerheader',
    PANELBODYINNERCLASS = ITSA+'panelinnerbody',
    PANELFOOTERINNERCLASS = ITSA+'panelinnerfooter',
    ITSA_PANELCLOSEBTN = ITSA+PANEL+'closebtn',
    HEADERTEMPLATE = '<div class="'+PANELHEADERCLASS+'"><div class="'+PANELHEADERINNERCLASS+'"></div></div>',
    BODYTEMPLATE = '<div class="'+PANELBODYCLASS+'"><div class="'+PANELBODYINNERCLASS+'"></div></div>',
    FOOTERTEMPLATE = '<div class="'+PANELFOOTERCLASS+'"><div class="'+PANELFOOTERINNERCLASS+'"></div></div>',
    CLOSE_BUTTON = '<'+BUTTON+' class="pure-'+BUTTON+' itsa'+BUTTON+'-onlyicon '+ITSA_PANELCLOSEBTN+'" data-focusable="true"><i class="itsaicon-form-abort"></i></'+BUTTON+'>',
    DEFAULT_HEADERVIEW = '<div>{title}</div><div class="itsa-rightalign">{titleRight}</div>',
    DEFAULT_BODYVIEW = '{body}',
    DEFAULT_FOOTERVIEW = '<div>{footer}</div><div class="itsa-rightalign">{footerRight}</div>',
    CLICK = 'click',
    CLICK_OUTSIDE = CLICK+'outside',
    VALUE = 'value',
    /**
      * Fired when a button inside the panel is pressed.
      * Convenience-event, cannot be prevented or halted --> use the button-node's click to do that.
      *
      * @event buttonclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAPanel} The ITSAPanel-instance
      * @param e.value {Any} Should be used to identify the button --> buttons value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      *
    **/
    BUTTON_CLICK = BUTTON+CLICK,

    /**
      * Fired when a button inside the panel asks for the panel to hide.
      * Y.ITSAPanel only has the 'close'-button that can cause this, but you may force other buttons to fire this event.
      * The defaultFunction will call Panel-instance.hide();
      *
      * @event button:hide
      * @param e {EventFacade} Event Facade including:
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      *
    **/
    BUTTON_HIDE_EVENT = BUTTON+':hide';


ITSAPanel = Y.ITSAPanel = Y.Base.create('itsapanel', Y.Widget, [
    // Som other Widget extensions depend on Y.WidgetPosition, so set this one first.
    Y.WidgetPosition,

//    Y.WidgetStdMod,
    Y.WidgetAutohide,
    Y.WidgetModality,
    Y.WidgetPositionAlign,
    Y.WidgetPositionConstrain,
    Y.WidgetStack
], null, {
    ATTRS: {
        /**
         * Bodycontent of the view. Is only used when 'bodyView' is not set: if so then bodyView takes care of the bodysection-content.
         *
         * @attribute body
         * @type String
         * @default null
         * @since 0.1
        */
        body : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING);
            }
        },
        /**
         * Template of the bodysection. Can be either a Y.Lang.sub-template or a Y.View.<br />
         * When a String-template is set, the template can make use of {body}, which will automaticly be replaced by the body-attribute under the hood.<br />
         * When an Y.View instance is set, the View's 'container' will be bound to the bodysection-div automaticly and the View's render() method
         * will be executed to fill the section with content. If the View is designed well, the panel-content will automaticly be updated when needed.
         *
         * @attribute bodyView
         * @type {String|Y.View}
         * @default null
         * @since 0.1
        */
        bodyView : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING) || (val instanceof Y.View);
            }
        },
        /**
         * Extra classname that will be set to the boundingBox. You need to take care of the css yourself.
         *
         * @attribute className
         * @default null
         * @type String
         */
        className : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING);
            }
        },
        /**
         * Set true if you want the panel to be dragable. Unusable when floated=false.
         *
         * @attribute dragable
         * @default false
         * @type boolean
         */
        dragable: {
            value: false,
            validator: function(val) {
                return (typeof val===BOOLEAN);
            }
        },
        /**
         * Footercontent of the view. Is only used when 'footerView' is not set: if so then footerView takes care of the footersection-content.
         *
         * @attribute footer
         * @type String
         * @default null
         * @since 0.1
        */
        footer : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING);
            }
        },
        /**
         * Right side of the footer of the view. Is only used when 'footerView' is not set: if so then footerView takes care of the footersection-content.
         *
         * @attribute footerRight
         * @type String
         * @default null
         * @since 0.1
        */
        footerRight : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING);
            }
        },
        /**
         * Template of the footersection. Can be either a Y.Lang.sub-template or a Y.View.<br />
         * When a String-template is set, the template can make use of {footer} and {footerRight}, which will automaticly be replaced by the footer and footerRight-attributes under the hood.<br />
         * When an Y.View instance is set, the View's 'container' will be bound to the footersection-div automaticly and the View's render() method
         * will be executed to fill the section with content. If the View is designed well, the panel-content will automaticly be updated when needed.
         *
         * @attribute footerView
         * @type {String|Y.View}
         * @default null
         * @since 0.1
        */
        footerView : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING) || (val instanceof Y.View);
            }
        },
        /**
         * Flag indicating whether or not the Panel floats above the page.
         * When not floated, then all floated attributes like: modal, x, y, centered are disregarded.
         *
         * @attribute floated
         * @default true
         * @type boolean
         */
        floated: {
            value: true,
            validator: function(val) {
                return (typeof val===BOOLEAN);
            }
        },
        /**
         * Flag indicating whether the Panel should get focus as soon as it gets visible.
         *
         * @attribute focusOnShow
         * @default true
         * @type boolean
         */
        focusOnShow: {
            value: true,
            validator: function(val) {
                return (typeof val===BOOLEAN);
            }
        },
        /**
         * Template of the headersection. Can be either a Y.Lang.sub-template or a Y.View.<br />
         * When a String-template is set, the template can make use of {title} and {titleRight}, which will automaticly be replaced by the title and titleRight-attributes
         * under the hood. You need {titleRight} if you want the 'close-button' to render when the attribute 'titleRight' keeps undefined.<br />
         * When an Y.View instance is set, the View's 'container' will be bound to the headersection-div automaticly and the View's render() method
         * will be executed to fill the section with content. If the View is designed well, the panel-content will automaticly be updated when needed.
         *
         * @attribute headerView
         * @type {String|Y.View}
         * @default null
         * @since 0.1
        */
        headerView : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING) || (val instanceof Y.View);
            }
        },
        /**
         * Height of the Panel: need to be numbers: due to its construction no percented sizes are allowed.
         *
         * @attribute height
         * @default null
         * @type {Number}
         */
        height: {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (val===null) || (typeof val===NUMBER);
            },
            getter: '_getHeight',
            setter: '_setHeight'
        },
        /**
         * Maximum height of the Panel: need to be numbers: due to its construction no percented sizes are allowed.
         *
         * @attribute maxHeight
         * @default null
         * @type {Number}
         */
        maxHeight: {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (val===null) || (typeof val===NUMBER);
            },
            setter: '_setMaxHeight'
        },
        /**
         * Maximum width of the Panel: need to be numbers: due to its construction no percented sizes are allowed.
         *
         * @attribute maxWidth
         * @default null
         * @type {Number}
         */
        maxWidth: {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (val===null) || (typeof val===NUMBER);
            },
            setter: '_setMaxWidth'
        },
        /**
         * Minimum height of the Panel: need to be numbers: due to its construction no percented sizes are allowed.
         * Note: by css, a default minHeight of 75px is active.
         *
         * @attribute minHeight
         * @default null
         * @type {Number}
         */
        minHeight: {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (val===null) || (typeof val===NUMBER);
            },
            setter: '_setMinHeight'
        },
        /**
         * Minimum width of the Panel: need to be numbers: due to its construction no percented sizes are allowed.
         * Note: by css, a default minWidth of 1505px is active.
         *
         * @attribute minWidth
         * @default null
         * @type {Number}
         */
        minWidth: {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (val===null) || (typeof val===NUMBER);
            },
            setter: '_setMinWidth'
        },
        /**
         * @attribute resizable
         * @description Boolean indicating whether or not the Panel is resizable.
         * This will be constrained between minWidth/minHeight and maxWidth/MaxHeight (if set).
         * @default false
         * @type boolean
         */
        resizable: {
            value: false,
            validator: function(val) {
                return (typeof val===BOOLEAN);
            }
        },
        /**
         * Styles the Panel by adding the className 'itsa-styledpanel' to the container.
         * The css-rules for the class 'itsa-styledpanel' are coming together with this module.
         *
         * @attribute styled
         * @type {Boolean}
         * @default true
         * @since 0.3
         */
        styled: {
            value: true,
            validator: function(v){
                return (typeof v === BOOLEAN);
            }
        },
        /**
         * Boolean indicating whether or not the Panel is visible.
         * Standard is set to false (on the contrary to Y.Widget)
         *
         * @attribute visible
         * @default false
         * @type boolean
         */
        visible: {
            value: false,
            validator: function(val) {
                return (typeof val===BOOLEAN);
            }
        },
        /**
         * Width of the Panel: need to be numbers: due to its construction no percented sizes are allowed.
         *
         * @attribute width
         * @default null
         * @type {Number}
         */
        width: {
            value: null,
            lazyAdd: false,
            validator: function(val) {
                return (val===null) || (typeof val===NUMBER);
            },
            getter: '_getWidth',
            setter: '_setWidth'
        },
        /**
         * Title of the view (headercontent). Is only used when 'headerView' is not set: if so then headerView takes care of the headersection-content.
         *
         * @attribute title
         * @type String
         * @default null
         * @since 0.1
        */
        title : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING);
            }
        },
        /**
         * Right side of the title of the view (headercontent). Is only used when 'headerView' is not set: if so then headerView takes care of the headersection-content.
         * When not set, then Y.ITSAPanel will render a 'closebutton' in this area.
         *
         * @attribute titleRight
         * @type String
         * @default null
         * @since 0.1
        */
        titleRight : {
            value: null,
            validator: function(val) {
                return (val===null) || (typeof val===STRING);
            }
        }
    }
});

/**
 * @method initializer
 * @protected
 * @since 0.1
*/
ITSAPanel.prototype.initializer = function() {
    var instance = this,
        boundingBox = instance.get(BOUNDINGBOX),
        className = instance.get(CLASSNAME);

    Y.log('initializer ', 'info', 'ITSAPanel');
    // asynchroniously loading fonticons:
    Y.use(GALLERYCSS_ITSA+'base', GALLERYCSS_ITSA+'form');

    // publishing event 'focusnext'
    instance.publish(
        BUTTON_HIDE_EVENT,
        {
            defaultFn: Y.bind(instance.hide, instance),
            emitFacade: true
        }
    );

    /**
     * Internal list of all eventhandlers bound by this widget.
     * @property _eventhandlers
     * @private
     * @default []
     * @type Array
    */
    instance._eventhandlers = [];

    boundingBox.addClass(PANELCLASS);
    boundingBox.toggleClass(INLINECLASS, !instance.get(FLOATED));
    boundingBox.toggleClass(STYLEDPANELCLASS, instance.get(STYLED));
    boundingBox.toggleClass(FOCUSED_CLASS, instance.get(FOCUSED));
    // hide boundingBox by default and maybe inhide when rendered --> otherwise there might be a flicker effect when resetting its height
    boundingBox.addClass(HIDDENPANELCLASS);
/*jshint expr:true */
    className && boundingBox.addClass(className);
    instance.renderPromise().then(
        function() {
            instance.get(VISIBLE) && boundingBox.removeClass(HIDDENPANELCLASS);
        }
    );
/*jshint expr:false */
};

/**
 * ITSAPanel's bindUI-method. Binds events
 *
 * @method bindUI
 * @since 0.1
*/
ITSAPanel.prototype.bindUI = function() {
    var instance = this,
        boundingBox = instance.get(BOUNDINGBOX),
        contentBox = instance.get(CONTENTBOX),
        eventhandlers = instance._eventhandlers,
        headerView = instance.get(HEADERVIEW),
        bodyView = instance.get(BODYVIEW),
        footerView = instance.get(FOOTERVIEW);

    Y.log('bindUI ', 'info', 'ITSAPanel');
/*jshint expr:true */
    (headerView instanceof Y.View) && headerView.addTarget(instance);
    (bodyView instanceof Y.View) && bodyView.addTarget(instance);
    (footerView instanceof Y.View) && footerView.addTarget(instance);

    instance.get(DRAGABLE) && instance.get(FLOATED) && Y.use(DD+PLUGIN, function() {
        // NOTE: node-pluginhist and dd-ddm MUST be loaded first, otherwise you can get errors !!!
        instance.get(DESTROYED) || (boundingBox.plug(Y.Plugin.Drag).dd.addHandle('.'+PANELHEADERCLASS) && boundingBox.dd.addTarget(instance));
    });
    instance.get(RESIZABLE) && Y.use(RESIZE+PLUGIN, function() {
        // NOTE: node-pluginhist and dd-ddm MUST be loaded first, otherwise you can get errors !!!
        instance.get(DESTROYED) || contentBox.plug(Y.Plugin.Resize, {handles: ['r', 'b', 'br']}).resize.addTarget(instance);
    });
/*jshint expr:false */

    eventhandlers.push(
        instance.after(VISIBLE+CHANGE, function(e) {
            Y.log('aftersubscriptor '+VISIBLE+CHANGE, 'info', 'ITSAPanel');
            var visible = e.newVal;
            boundingBox.toggleClass(HIDDENPANELCLASS, !visible);
            if (visible) {
/*jshint expr:true */
                (instance.get(MODAL) || instance.get('focusOnShow')) && instance.focus();
/*jshint expr:true */
            }
            else {
                instance.blur();
            }
        })
    );

    eventhandlers.push(
        instance.after(FLOATED+CHANGE, function(e) {
            Y.log('aftersubscriptor '+FLOATED+CHANGE, 'info', 'ITSAPanel');
            boundingBox.toggleClass(INLINECLASS, !e.newVal);
            if (instance.get(DRAGABLE)) {
/*jshint expr:true */
            // NOTE: node-pluginhist and dd-ddm MUST be loaded first, otherwise you can get errors !!!
                e.newVal && !boundingBox.dd && Y.use(DD+PLUGIN, function() {
                    instance.get(DESTROYED) || (boundingBox.plug(Y.Plugin.Drag).dd.addHandle('.'+PANELHEADERCLASS) && boundingBox.dd.addTarget(instance));
                });
                !e.newVal && boundingBox.dd && boundingBox.dd.removeTarget(instance) && boundingBox.unplug(DD);
/*jshint expr:false */
            }
        })
    );

    eventhandlers.push(
        instance.after(DRAGABLE+CHANGE, function(e) {
            Y.log('aftersubscriptor '+DRAGABLE+CHANGE, 'info', 'ITSAPanel');
/*jshint expr:true */
            // NOTE: node-pluginhist and dd-ddm MUST be loaded first, otherwise you can get errors !!!
            e.newVal && instance.get(FLOATED) && !boundingBox.dd && Y.use(DD+PLUGIN, function() {
                instance.get(DESTROYED) || (boundingBox.plug(Y.Plugin.Drag).dd.addHandle('.'+PANELHEADERCLASS) && boundingBox.dd.addTarget(instance));
            });
            !e.newVal && boundingBox.dd && boundingBox.dd.removeTarget(instance) && boundingBox.unplug(DD);
/*jshint expr:false */
        })
    );

    eventhandlers.push(
        instance.after(RESIZABLE+CHANGE, function(e) {
            Y.log('aftersubscriptor '+RESIZABLE+CHANGE, 'info', 'ITSAPanel');
/*jshint expr:true */
            // NOTE: node-pluginhist and dd-ddm MUST be loaded first, otherwise you can get errors !!!
            e.newVal && !contentBox[RESIZE] && Y.use(RESIZE+PLUGIN, function() {
                instance.get(DESTROYED) || contentBox.plug(Y.Plugin.Resize, {handles: ['r', 'b', 'br']}).resize.addTarget(instance);
            });
            !e.newVal && contentBox[RESIZE] && contentBox[RESIZE].removeTarget(instance) && contentBox[RESIZE].unplug(RESIZE);
/*jshint expr:false */
        })
    );

    eventhandlers.push(
        instance.after([DRAG+':'+DRAG, DRAG+':end'], function() {
            Y.log('aftersubscriptor '+arguments[0].type, 'info', 'ITSAPanel');
            var itsaformelement = Y.ITSAFormElement,
                tipsyValid = itsaformelement && itsaformelement.tipsyValid,
                tipsyInvalid = itsaformelement && itsaformelement.tipsyInvalid;
/*jshint expr:true */
            tipsyValid && tipsyValid.get(VISIBLE) && tipsyValid._lastnode && tipsyValid._alignTooltip(tipsyValid._lastnode);
            tipsyInvalid && tipsyInvalid.get(VISIBLE) && tipsyInvalid._lastnode && tipsyInvalid._alignTooltip(tipsyInvalid._lastnode);
/*jshint expr:false */
        })
    );

    eventhandlers.push(
        instance.after(
            [RESIZE+':end', HEIGHT+CHANGE, WIDTH+CHANGE, 'minHeight'+CHANGE, 'minWidth'+CHANGE],
            function() {
            Y.log('aftersubscriptor '+arguments[0].type, 'info', 'ITSAPanel');
/*jshint expr:true */
                instance.get(CENTERED) && instance.centered();
/*jshint expr:false */
            }
        )
    );

    // If the model gets swapped out, reset targets accordingly.
    eventhandlers.push(
        instance.after(
            [HEADERVIEW+CHANGE, BODYVIEW+CHANGE, FOOTERVIEW+CHANGE],
            function (ev) {
            Y.log('aftersubscriptor '+ev.type, 'info', 'ITSAPanel');
    /*jshint expr:true */
                (ev.prevVal instanceof Y.View) && ev.prevVal.removeTarget(instance);
                (ev.newVal instanceof Y.View) && ev.newVal.addTarget(instance);
    /*jshint expr:false */
            }
        )
    );

    eventhandlers.push(
        instance.after(
            STYLED+CHANGE,
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSAPanel');
                boundingBox.toggleClass(STYLEDPANELCLASS, e.newVal);
            }
        )
    );

    eventhandlers.push(
        instance.after(
            CLASSNAME+CHANGE,
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSAPanel');
/*jshint expr:true */
                e.prevVal && boundingBox.removeClass(e.prevVal);
                e.newVal && boundingBox.addClass(e.newVal);
/*jshint expr:false */
            }
        )
    );

    eventhandlers.push(
        instance.on(
            MODAL+CHANGE,
            function(e) {
                Y.log('onsubscriptor '+e.type, 'info', 'ITSAPanel');
/*jshint expr:true */
                !instance.get(FLOATED) && e.preventDefault();
/*jshint expr:false */
            }
        )
    );

    eventhandlers.push(
        instance.on(
            BODYVIEW+CHANGE,
            Y.bind(instance._renderBody, instance)
        )
    );

    eventhandlers.push(
        instance.on(
            HEADERVIEW+CHANGE,
            Y.bind(instance._renderHeader, instance)
        )
    );

    eventhandlers.push(
        instance.on(
            FOOTERVIEW+CHANGE,
            Y.bind(instance._renderFooter, instance)
        )
    );

    eventhandlers.push(
        instance._header.delegate(
            CLICK,
            function(e) {
                Y.log('delegatesubscriptor panelheader delegated to itsaclosebtn', 'info', 'ITSAPanel');
                instance.fire(BUTTON_HIDE_EVENT, {buttonNode: e.target});
            },
            '.'+ITSA_PANELCLOSEBTN
        )
    );

    eventhandlers.push(
        boundingBox.delegate(
            CLICK,
            function(e) {
                Y.log('delegatesubscriptor boundingBox.click delegated to BUTTON', 'info', 'ITSAPanel');
                var buttonNode = e.currentTarget,
                    payload;
                payload = {
                    type: BUTTON_CLICK,
                    target: instance,
                    value: buttonNode && buttonNode.get(VALUE),
                    buttonNode: buttonNode
                };
                instance.fire(BUTTON_CLICK, payload);
            },
            BUTTON
        )
    );

    eventhandlers.push(
        boundingBox.on(CLICK, function() {
            Y.log('onsubscriptor boundingBox.click', 'info', 'ITSAPanel');
            instance.focus();
        })
    );

    eventhandlers.push(
        boundingBox.on(CLICK_OUTSIDE, function() {
            Y.log('onsubscriptor '+CLICK_OUTSIDE, 'info', 'ITSAPanel');
            instance.blur();
        })
    );

    eventhandlers.push(
        instance.after(FOCUSED+CHANGE, function(e) {
            Y.log('aftersubscriptor '+e.type, 'info', 'ITSAPanel');
            boundingBox.toggleClass(FOCUSED_CLASS, e.newVal);
        })
    );

    eventhandlers.push(
        instance.after('*:viewrendered', function() {
            Y.log('aftersubscriptor *:viewrendered', 'info', 'ITSAPanel');
            instance._adjustPaddingTop();
            instance._adjustPaddingBottom();
        })
    );
};

/**
 * ITSAPanel's renderUI-method. Creates the dom-elements.
 *
 * @method renderUI
 * @since 0.1
*/
ITSAPanel.prototype.renderUI = function() {
    var instance = this,
        contentBox = instance.get(CONTENTBOX);

    Y.log('renderUI ', 'info', 'ITSAPanel');
    contentBox.setHTML(HEADERTEMPLATE+BODYTEMPLATE+FOOTERTEMPLATE);
    instance._header = contentBox.one('.'+PANELHEADERINNERCLASS);
    instance._body = contentBox.one('.'+PANELBODYINNERCLASS);
    instance._footer = contentBox.one('.'+PANELFOOTERINNERCLASS);
    instance._footercont = contentBox.one('.'+PANELFOOTERCLASS);
    instance._renderHeader();
    instance._renderBody();
    instance._renderFooter();
};

/**
 * Cleans up bindings
 * @method destructor
 * @protected
 * @since 0.1
*/
ITSAPanel.prototype.destructor = function() {
    var instance = this,
        boundingBox = instance.get(BOUNDINGBOX),
        contentBox = instance.get(CONTENTBOX),
        headerView = instance.get(HEADERVIEW),
        bodyView = instance.get(BODYVIEW),
        footerView = instance.get(FOOTERVIEW);

    Y.log('destructor ', 'info', 'ITSAPanel');
/*jshint expr:true */
    (headerView instanceof Y.View) && headerView.removeTarget(instance);
    (bodyView instanceof Y.View) && bodyView.removeTarget(instance);
    (footerView instanceof Y.View) && footerView.removeTarget(instance);
    boundingBox.hasPlugin(DD) && boundingBox.dd.removeTarget(instance) && boundingBox.unplug(DD);
    contentBox.hasPlugin[RESIZE] && contentBox[RESIZE].removeTarget(instance) && contentBox.unplug(RESIZE);
/*jshint expr:false */
    instance._clearEventhandlers();
};

/**
 * Sets the paddingbottom-value of the contentBox to the height of the footer-section.
 * This makes all section to fit inside the contentBox.
 *
 * @method _adjustPaddingBottom
 * @private
 * @protected
 * @since 0.1
*/
ITSAPanel.prototype._adjustPaddingBottom = function() {
    var instance = this;

    Y.log('_adjustPaddingBottom ', 'info', 'ITSAPanel');
    instance.get(CONTENTBOX).setStyle(PADDINGBOTTOM, instance._footer.get(OFFSETHEIGHT)+PX);
};

/**
 * Sets the paddingtop-value of the contentBox to the height of the header-section.
 * This makes all section to fit inside the contentBox.
 *
 * @method _adjustPaddingTop
 * @private
 * @protected
 * @since 0.1
*/
ITSAPanel.prototype._adjustPaddingTop = function() {
    var instance = this;

    Y.log('_adjustPaddingTop ', 'info', 'ITSAPanel');
    instance.get(CONTENTBOX).setStyle(PADDINGTOP, instance._header.get(OFFSETHEIGHT)+PX);
};

/**
 * Cleaning up all eventlisteners
 *
 * @method _clearEventhandlers
 * @private
 * @protected
 * @since 0.1
*/
ITSAPanel.prototype._clearEventhandlers = function() {
    Y.log('_clearEventhandlers ', 'info', 'ITSAPanel');
    YArray.each(
        this._eventhandlers,
        function(item){
            item.detach();
        }
    );
};

/**
 * Getter of the 'height'-attribute
 *
 * @method _getHeight
 * @private
 * @return {Number} height in pixels
 * @since 0.1
*/
ITSAPanel.prototype._getHeight = function() {
    Y.log('_getHeight ', 'info', 'ITSAPanel');
    return Math.round(this.get(BOUNDINGBOX).get(OFFSETHEIGHT));
};

/**
 * Getter of the 'width'-attribute
 *
 * @method _getWidth
 * @private
 * @return {Number} height in pixels
 * @since 0.1
*/
ITSAPanel.prototype._getWidth = function() {
    Y.log('_getWidth ', 'info', 'ITSAPanel');
    return Math.round(this.get(BOUNDINGBOX).get(OFFSETWIDTH));
};

/**
 * Renderes the header-content. Either by templating (if 'headerView' is a String), or by calling headerView.render() in case headerView is a Y.View-instance.
 *
 * @method _renderHeader
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._renderHeader = function() {
    var instance = this,
        title = instance.get(TITLE),
        titleRight = instance.get(TITLE+RIGHT),
        headerView = instance.get(HEADERVIEW);

    Y.log('_renderHeader ', 'info', 'ITSAPanel');
    if (!headerView || (typeof headerView===STRING)) {
        instance._header.setHTML(Lang.sub((headerView || DEFAULT_HEADERVIEW), {title: (title || ''), titleRight: ((titleRight===null) ? CLOSE_BUTTON : titleRight)}));
    }
    else if (headerView instanceof Y.View) {
        headerView._set('container', instance._header);
/*jshint expr:true */
        headerView.render && headerView.render();
/*jshint expr:false */
    }
    instance._adjustPaddingTop();
};

/**
 * Renderes the BODY-content. Either by templating (if 'BODYView' is a String), or by calling BODYView.render() in case BODYView is a Y.View-instance.
 *
 * @method _renderBody
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._renderBody = function() {
    var instance = this,
        body = instance.get(BODY),
        bodyView = instance.get(BODYVIEW);

    Y.log('_renderBody ', 'info', 'ITSAPanel');
    if (!bodyView || (typeof bodyView===STRING)) {
        instance._body.setHTML(Lang.sub((bodyView || DEFAULT_BODYVIEW), {body: (body || '')}));
    }
    else if (bodyView instanceof Y.View) {
        bodyView._set('container', instance._body);
/*jshint expr:true */
        bodyView.render && bodyView.render();
/*jshint expr:false */
    }
};

/**
 * Renderes the footer-content. Either by templating (if 'footerView' is a String), or by calling footerView.render() in case footerView is a Y.View-instance.
 *
 * @method _renderFooter
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._renderFooter = function() {
    var instance = this,
        footer = instance.get(FOOTER),
        footerRight = instance.get(FOOTER+RIGHT),
        footerView = instance.get(FOOTERVIEW),
        instanceFooter = instance._footer,
        hideFooter = !footerView && !footer && !footerRight;

    Y.log('_renderFooter ', 'info', 'ITSAPanel');
    if (!hideFooter) {
        if (!footerView || (typeof footerView===STRING)) {
            instanceFooter.setHTML(Lang.sub((footerView || DEFAULT_FOOTERVIEW), {footer: (footer || ''), footerRight: (footerRight || '')}));
        }
        else if (footerView instanceof Y.View) {
            footerView._set('container', instance._footer);
/*jshint expr:true */
            footerView.render && footerView.render();
/*jshint expr:false */
        }
    }
    instance._footercont.toggleClass(HIDDENSECTIONCLASS, hideFooter);
    instance._adjustPaddingBottom();
};

/**
 * Setter for the 'height'-attribute. For architecture reasons, the value will be set on the contentBox instead of the boundingBox.
 *
 * @method _setHeight
 * @param val {Number} new value
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._setHeight = function(val) {
    var instance = this;
    Y.log('_setHeight ', 'info', 'ITSAPanel');
    instance.get(CONTENTBOX).setStyle(HEIGHT, (val ? (val+PX) : ''));
};

/**
 * Setter for the 'maxHeight'-attribute. For architecture reasons, the value will be set on the contentBox instead of the boundingBox.
 *
 * @method _setMaxHeight
 * @param val {Number} new value
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._setMaxHeight = function(val) {
    Y.log('_setMaxHeight ', 'info', 'ITSAPanel');
    this.get(CONTENTBOX).setStyle('maxHeight', (val ? (val+PX) : ''));
};

/**
 * Setter for the 'maxWidth'-attribute. For architecture reasons, the value will be set on the contentBox instead of the boundingBox.
 *
 * @method _setMaxWidth
 * @param val {Number} new value
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._setMaxWidth = function(val) {
    Y.log('_setMaxWidth ', 'info', 'ITSAPanel');
    this.get(CONTENTBOX).setStyle('maxWidth', (val ? (val+PX) : ''));
};

/**
 * Setter for the 'minHeight'-attribute. For architecture reasons, the value will be set on the contentBox instead of the boundingBox.
 *
 * @method _setMinHeight
 * @param val {Number} new value
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._setMinHeight = function(val) {
    Y.log('_setMinHeight ', 'info', 'ITSAPanel');
    this.get(CONTENTBOX).setStyle('minHeight', (val ? (val+PX) : ''));
};

/**
 * Setter for the 'minWidth'-attribute. For architecture reasons, the value will be set on the contentBox instead of the boundingBox.
 *
 * @method _setMinWidth
 * @param val {Number} new value
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._setMinWidth = function(val) {
    Y.log('_setMinWidth ', 'info', 'ITSAPanel');
    this.get(CONTENTBOX).setStyle('minWidth', (val ? (val+PX) : ''));
};

/**
 * Setter for the 'width'-attribute. For architecture reasons, the value will be set on the contentBox instead of the boundingBox.
 *
 * @method _setWidth
 * @param val {Number} new value
 * @private
 * @since 0.1
*/
ITSAPanel.prototype._setWidth = function(val) {
    var instance = this;

    Y.log('_setWidth ', 'info', 'ITSAPanel');
    instance.get(CONTENTBOX).setStyle(WIDTH, (val ? (val+PX) : ''));
};