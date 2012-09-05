if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-overlay/gallery-bt-overlay.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].code=["YUI.add('gallery-bt-overlay', function(Y) {","","/*jslint nomen: true*/","/**"," * This module provides Overlay Widget which can show/hide with different transitions or directions."," *"," * @module gallery-bt-overlay"," */","var Mask = Y.one('.bt-overlay-mask') || Y.one('body').appendChild(Y.Node.create('<div class=\"bt-overlay-mask\"></div>')),","    WIDTH_CHANGE = 'widthChange',","    HEIGHT_CHANGE = 'heightChange',","    VISIBLE_CHANGE = 'visibleChange',","","    pageWidget,","    pageNode,","","    instances = [],","    current,","    next,","","    POSITIONS = {","        top: ['tc', 0, -1, 'bc', 0.5, 0],","        bottom: ['bc', 0, 1, 'tc', 0.5, 1],","        left: ['lc', -1, 0, 'rc', 0, 0.5],","        right: ['rc', 1, 0, 'lc', 1, 0.5]","    },","","    /**","     * A basic Overlay widget which support three types of animation. Use","     * show and hide function to display Overlay. Only one Overlay will show","     * in the same time.","     *","     * @class Overlay","     * @param [config] {Object} Object literal with initial attribute values","     * @extends Widget","     * @uses WidgetParent","     * @uses WidgetPosition","     * @uses WidgetStack","     * @uses WidgetPositionAlign","     * @uses PushPop","     * @constructor","     * @namespace Bottle","     */","    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {","        initializer: function () {","            if (!pageWidget) {","                pageWidget = Y.Bottle.Page.getCurrent();","                if (pageWidget) {","                    pageNode = pageWidget.get('boundingBox');","                    pageWidget.set('zIndex', Overlay.ZINDEX_PAGE);","                }","            }","","            instances.push(this);","","            /**","             * internal eventhandlers, keep for destructor","             *","             * @property _bscEventHandlers","             * @type EventHandle","             * @private","             */","            this._bscEventHandlers = new Y.EventHandle([","                this.after(WIDTH_CHANGE, this._updatePositionShow),","                this.after(HEIGHT_CHANGE, this._updatePositionShow),","                this.after(VISIBLE_CHANGE, this._doShowHide)","            ]);","","            //this._updatePositionHide();","            //this._updatePositionShow();","        },","","        destructor: function () {","            this._bscEventHandlers.detach();","            delete this._bscEventHandlers;","        },","","        renderUI: function () {","            var O = this.get('boundingBox'),","                W = O.get('offsetWidth'),","                H = O.get('offsetHeight');","","            if (!this.get('height') && H) {","                this.set('height', H);","            }","","            if (!this.get('width') && W) {","                this.set('width', W);","            }","        },","","        /**","         * Resize the Overlay to adapt the browser width and height.","         *","         * @method olResize","         * @param [force=false] {Boolean} <b>true</b> to forece resize even when Overlay is not visibile.","         */","        olResize: function (force) {","            //reduce syncUI times","            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {","                return;","            }","","            if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {","                return;","            }","","            if (!this.get('visible') && !force) {","                return;","            }","","            this._updateFullSize();","            this._updatePositionShow();","        },","","        /**","         * handle child full Height or width","         *","         * @method _updateFullSize","         * @protected","         */","        _updateFullSize: function () {","            if (this.get('fullPage')) {","                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});","                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});","            }","        },","","        /**","         * Update showed Overlay position based on action and showFrom","         *","         * @method _updatePositionShow","         * @protected","         */","        _updatePositionShow: function (E) {","            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                noAlign = (E && E.noAlign) ? true : false,","                posData = POSITIONS[pos];","","            if (!vis) {","                return;","            }","","            if (noAlign) {","                return;","            }","            if (this.get('fullPage')) {","                this.align(pageNode, [posData[3], posData[3]]);","            } else {","                this.centered(pageNode);","            }","        },","","        /**","         * move the Overlay to hidden place","         *","         * @method _updatePositionHide","         * @protected","         */","        _updatePositionHide: function (E) {","            var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                posData = POSITIONS[this.get('showFrom')];","","            if (!vis) {","                this.align(null, [posData[3], posData[0]]);","            }","        },","","        /**","         * Show or hide the mask.","         *","         * @method _displayMask","         * @param show {Boolean} true to display, false to hide.","         * @protected","         */","        _displayMask: function (show) {","            Mask.setStyle('display', show ? 'block' : 'none');","        },","","        /**","         * do transition on a node with top and left css properties","         *","         * @method _doTransition","         * @param node {Node} node to do transition","         * @param left {Number} css left in px","         * @param top {Number} css top in px","         * @param [done] {Function} If provided, call this function when transition done","         * @protected","         */","        _doTransition: function (node, left, top, done) {","            var that = this;","","            Y.later(1, this, function () {","                node.transition(Y.merge(this.get('olTrans'), {","                    left: left + 'px',","                    top: top + 'px'","                }), function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            });","        },","","        /**","         * handle Overlay transition when show or hide","         *","         * @method _doneShowHide","         * @protected","         */","        _doneShowHide: function () {","            var show = this.get('visible'),","                mask = this.get('mask');","","            if (mask) {","                this._displayMask(show);","            }","","            this.set('disabled', show ? false : true);","            this.set('zIndex', show ? Overlay.ZINDEX_SHOW : Overlay.ZINDEX_HIDE);","","            if (next) {","                next.show();","                next = undefined;","            }","        },","","        /**","         * handle Overlay transition when show or hide","         *","         * @method _doShowHide","         * @protected","         */","        _doShowHide: function (E) {","            var show = E.newVal,","                selfDir = show ? 0 : 1,","                pageDir = show ? -1 : 0,","                posData = POSITIONS[this.get('showFrom')],","                node = this.get('boundingBox'),","                pageRegion,","                nodeX,","                nodeY;","","            if (show) {","                this.enable();","                this._updateFullSize();","                this._updatePositionHide({visible: false});","                current = this;","            } else {","                this._updatePositionShow({visible: true});","                if (this.get('mask')) {","                    this._displayMask(false);","                }","                current = undefined;","            }","","            this.set('zIndex', Overlay.ZINDEX_SHOW);","","            if (this.get('fullPage')) {","                this._doTransition(node, posData[4] * pageNode.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * pageNode.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'), this._doneShowHide);","            } else {","                pageRegion = pageNode.get('region');","                if (show) {","                    nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);","                    nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);","                } else {","                    switch (this.get('showFrom')) {","                    case 'top':","                        nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);","                        nodeY = - this.get('height');","                        break;","                    case 'bottom':","                        nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);","                        nodeY = pageRegion.bottom;","                        break;","                    case 'right':","                        nodeX = pageRegion.right;","                        nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);","                        break;","                    case 'left':","                    default:","                        nodeX = - this.get('width');","                        nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);","                        break;","                    }","                }","                this._doTransition(node, nodeX, nodeY, this._doneShowHide);","            }","        }","    }, {","        /**","         * Static property used to define the default attribute configuration.","         *","         * @property ATTRS","         * @protected","         * @type Object","         * @static","         */","        ATTRS: {","            /**","             * The Overlay show direction. Should be one of:","             * <dl>","             *  <dt>top</dt><dd>top</dd>","             *  <dt>left</dt><dd>left</dd>","             *  <dt>right</dt><dd>right</dd>","             *  <dt>bottom</dt><dd>bottom</dd>","             * </dl>","             *","             * @attribute showFrom","             * @type String","             * @default left","             */","            showFrom: {","                value: 'left',","                lazyAdd: false,","                validator: function (V) {","                    return POSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    var F,","                        B = this.get('contentBox'),","                        fwh = POSITIONS[V][1];","","                    if (V === this.get('showFrom')) {","                        return V;","                    }","                    this._updatePositionShow({showFrom: V});","","                    return V;","                }","            },","","            /**","             * Boolean indicating if Overlay needs to display mask or not.","             *","             * @attribute mask","             * @type Boolean","             * @default true","             */","            mask: {","                value: true,","                validator: Y.Lang.isBoolean,","                setter: function (V) {","                    if (this.get('visible')) {","                        this._displayMask(V);","                    }","","                    return V;","                }","            },","","            /**","             * Default transition setting for Overlay","             *","             * @attribute transition","             * @type Object","             * @default {dutation: 0.5}","             */","            olTrans: {","                value: {","                    duration: 0.5","                }","            },","","            /**","             * Boolean indicating if Overlay needs to adjusting height to match viewport when it shows from top or bottom.","             *","             * @attribute fullPage","             * @type Boolean","             * @default true","             */","            fullPage: {","                value: true,","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.olResize();","                    }","                    return V;","                }","            }","        },","","        /**","         * Static property used to define the default HTML parsing rules","         *","         * @property HTML_PARSER","         * @protected","         * @static","         * @type Object","         */","        HTML_PARSER: {","            mask: function (srcNode) {","                if (srcNode.getData('mask') === 'false') {","                    return false;","                }","                return true;","            },","","            showFrom: function (srcNode) {","                return srcNode.getData('show-from');","            },","","            olTrans: function (srcNode) {","                try {","                    return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));","                } catch (e) {","                }","            },","","            fullPage: function (srcNode) {","                if (srcNode.getData('full-page') === 'false') {","                    return false;","                }","                return true;","            }","        },","","        /**","         * Default zindex for Page","         *","         * @property ZINDEX_PAGE","         * @static","         * @type Number","         * @default 100","         */","        ZINDEX_PAGE: 100,","","        /**","         * Default zindex for visible Overlay","         *","         * @property ZINDEX_SHOW","         * @static","         * @type Number","         * @default 300","         */","        ZINDEX_SHOW: 300,","","        /**","         * Default zindex for hidden Overlay","         *","         * @property ZINDEX_HIDE","         * @static","         * @type Number","         * @default 10","         */","        ZINDEX_HIDE: 10,","","        /**","         * Get all instances of Overlay","         *","         * @method getInstances","         * @static","         * @return {Array} all instances of Overlay","         */","        getInstances: function () {","            return instances;","        },","","        /**","         * Get current visilbe Overlay","         *","         * @method getCurrent","         * @static","         * @return {Object | undefined} current visible Overlay. If no any visible Overlay, return undefined.","         */","        getCurrent: function () {","            return current;","        }","    });","","Y.Bottle.Overlay = Overlay;","","//create Overlay mask","Mask.on('click', function () {","    current.hide();","});","","","}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});"];
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].lines = {"1":0,"9":0,"46":0,"47":0,"48":0,"49":0,"50":0,"54":0,"63":0,"74":0,"75":0,"79":0,"83":0,"84":0,"87":0,"88":0,"100":0,"101":0,"104":0,"105":0,"108":0,"109":0,"112":0,"113":0,"123":0,"124":0,"125":0,"136":0,"141":0,"142":0,"145":0,"146":0,"148":0,"149":0,"151":0,"162":0,"165":0,"166":0,"178":0,"192":0,"194":0,"195":0,"199":0,"200":0,"213":0,"216":0,"217":0,"220":0,"221":0,"223":0,"224":0,"225":0,"236":0,"245":0,"246":0,"247":0,"248":0,"249":0,"251":0,"252":0,"253":0,"255":0,"258":0,"260":0,"261":0,"263":0,"264":0,"265":0,"266":0,"268":0,"270":0,"271":0,"272":0,"274":0,"275":0,"276":0,"278":0,"279":0,"280":0,"283":0,"284":0,"285":0,"288":0,"318":0,"321":0,"325":0,"326":0,"328":0,"330":0,"345":0,"346":0,"349":0,"378":0,"379":0,"381":0,"396":0,"397":0,"399":0,"403":0,"407":0,"408":0,"414":0,"415":0,"417":0,"459":0,"470":0,"474":0,"477":0,"478":0};
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].functions = {"initializer:45":0,"destructor:73":0,"renderUI:78":0,"olResize:98":0,"_updateFullSize:122":0,"_updatePositionShow:135":0,"_updatePositionHide:161":0,"_displayMask:177":0,"(anonymous 3):198":0,"(anonymous 2):194":0,"_doTransition:191":0,"_doneShowHide:212":0,"_doShowHide:235":0,"validator:317":0,"setter:320":0,"setter:344":0,"setter:377":0,"mask:395":0,"showFrom:402":0,"olTrans:406":0,"fullPage:413":0,"getInstances:458":0,"getCurrent:469":0,"(anonymous 4):477":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].coveredLines = 109;
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].coveredFunctions = 25;
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 1);
YUI.add('gallery-bt-overlay', function(Y) {

/*jslint nomen: true*/
/**
 * This module provides Overlay Widget which can show/hide with different transitions or directions.
 *
 * @module gallery-bt-overlay
 */
_yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 9);
var Mask = Y.one('.bt-overlay-mask') || Y.one('body').appendChild(Y.Node.create('<div class="bt-overlay-mask"></div>')),
    WIDTH_CHANGE = 'widthChange',
    HEIGHT_CHANGE = 'heightChange',
    VISIBLE_CHANGE = 'visibleChange',

    pageWidget,
    pageNode,

    instances = [],
    current,
    next,

    POSITIONS = {
        top: ['tc', 0, -1, 'bc', 0.5, 0],
        bottom: ['bc', 0, 1, 'tc', 0.5, 1],
        left: ['lc', -1, 0, 'rc', 0, 0.5],
        right: ['rc', 1, 0, 'lc', 1, 0.5]
    },

    /**
     * A basic Overlay widget which support three types of animation. Use
     * show and hide function to display Overlay. Only one Overlay will show
     * in the same time.
     *
     * @class Overlay
     * @param [config] {Object} Object literal with initial attribute values
     * @extends Widget
     * @uses WidgetParent
     * @uses WidgetPosition
     * @uses WidgetStack
     * @uses WidgetPositionAlign
     * @uses PushPop
     * @constructor
     * @namespace Bottle
     */
    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {
        initializer: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "initializer", 45);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 46);
if (!pageWidget) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 47);
pageWidget = Y.Bottle.Page.getCurrent();
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 48);
if (pageWidget) {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 49);
pageNode = pageWidget.get('boundingBox');
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 50);
pageWidget.set('zIndex', Overlay.ZINDEX_PAGE);
                }
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 54);
instances.push(this);

            /**
             * internal eventhandlers, keep for destructor
             *
             * @property _bscEventHandlers
             * @type EventHandle
             * @private
             */
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 63);
this._bscEventHandlers = new Y.EventHandle([
                this.after(WIDTH_CHANGE, this._updatePositionShow),
                this.after(HEIGHT_CHANGE, this._updatePositionShow),
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);

            //this._updatePositionHide();
            //this._updatePositionShow();
        },

        destructor: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "destructor", 73);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 74);
this._bscEventHandlers.detach();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 75);
delete this._bscEventHandlers;
        },

        renderUI: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "renderUI", 78);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 79);
var O = this.get('boundingBox'),
                W = O.get('offsetWidth'),
                H = O.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 83);
if (!this.get('height') && H) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 84);
this.set('height', H);
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 87);
if (!this.get('width') && W) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 88);
this.set('width', W);
            }
        },

        /**
         * Resize the Overlay to adapt the browser width and height.
         *
         * @method olResize
         * @param [force=false] {Boolean} <b>true</b> to forece resize even when Overlay is not visibile.
         */
        olResize: function (force) {
            //reduce syncUI times
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "olResize", 98);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 100);
if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 101);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 104);
if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 105);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 108);
if (!this.get('visible') && !force) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 109);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 112);
this._updateFullSize();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 113);
this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updateFullSize", 122);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 123);
if (this.get('fullPage')) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 124);
this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 125);
this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
            }
        },

        /**
         * Update showed Overlay position based on action and showFrom
         *
         * @method _updatePositionShow
         * @protected
         */
        _updatePositionShow: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updatePositionShow", 135);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 136);
var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos];

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 141);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 142);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 145);
if (noAlign) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 146);
return;
            }
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 148);
if (this.get('fullPage')) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 149);
this.align(pageNode, [posData[3], posData[3]]);
            } else {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 151);
this.centered(pageNode);
            }
        },

        /**
         * move the Overlay to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updatePositionHide", 161);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 162);
var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                posData = POSITIONS[this.get('showFrom')];

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 165);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 166);
this.align(null, [posData[3], posData[0]]);
            }
        },

        /**
         * Show or hide the mask.
         *
         * @method _displayMask
         * @param show {Boolean} true to display, false to hide.
         * @protected
         */
        _displayMask: function (show) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_displayMask", 177);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 178);
Mask.setStyle('display', show ? 'block' : 'none');
        },

        /**
         * do transition on a node with top and left css properties
         *
         * @method _doTransition
         * @param node {Node} node to do transition
         * @param left {Number} css left in px
         * @param top {Number} css top in px
         * @param [done] {Function} If provided, call this function when transition done
         * @protected
         */
        _doTransition: function (node, left, top, done) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doTransition", 191);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 192);
var that = this;

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 194);
Y.later(1, this, function () {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 2)", 194);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 195);
node.transition(Y.merge(this.get('olTrans'), {
                    left: left + 'px',
                    top: top + 'px'
                }), function () {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 3)", 198);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 199);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 200);
done.apply(that);
                    }
                });
            });
        },

        /**
         * handle Overlay transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doneShowHide", 212);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 213);
var show = this.get('visible'),
                mask = this.get('mask');

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 216);
if (mask) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 217);
this._displayMask(show);
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 220);
this.set('disabled', show ? false : true);
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 221);
this.set('zIndex', show ? Overlay.ZINDEX_SHOW : Overlay.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 223);
if (next) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 224);
next.show();
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 225);
next = undefined;
            }
        },

        /**
         * handle Overlay transition when show or hide
         *
         * @method _doShowHide
         * @protected
         */
        _doShowHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doShowHide", 235);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 236);
var show = E.newVal,
                selfDir = show ? 0 : 1,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox'),
                pageRegion,
                nodeX,
                nodeY;

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 245);
if (show) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 246);
this.enable();
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 247);
this._updateFullSize();
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 248);
this._updatePositionHide({visible: false});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 249);
current = this;
            } else {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 251);
this._updatePositionShow({visible: true});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 252);
if (this.get('mask')) {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 253);
this._displayMask(false);
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 255);
current = undefined;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 258);
this.set('zIndex', Overlay.ZINDEX_SHOW);

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 260);
if (this.get('fullPage')) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 261);
this._doTransition(node, posData[4] * pageNode.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * pageNode.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'), this._doneShowHide);
            } else {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 263);
pageRegion = pageNode.get('region');
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 264);
if (show) {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 265);
nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 266);
nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                } else {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 268);
switch (this.get('showFrom')) {
                    case 'top':
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 270);
nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 271);
nodeY = - this.get('height');
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 272);
break;
                    case 'bottom':
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 274);
nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 275);
nodeY = pageRegion.bottom;
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 276);
break;
                    case 'right':
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 278);
nodeX = pageRegion.right;
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 279);
nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 280);
break;
                    case 'left':
                    default:
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 283);
nodeX = - this.get('width');
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 284);
nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 285);
break;
                    }
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 288);
this._doTransition(node, nodeX, nodeY, this._doneShowHide);
            }
        }
    }, {
        /**
         * Static property used to define the default attribute configuration.
         *
         * @property ATTRS
         * @protected
         * @type Object
         * @static
         */
        ATTRS: {
            /**
             * The Overlay show direction. Should be one of:
             * <dl>
             *  <dt>top</dt><dd>top</dd>
             *  <dt>left</dt><dd>left</dd>
             *  <dt>right</dt><dd>right</dd>
             *  <dt>bottom</dt><dd>bottom</dd>
             * </dl>
             *
             * @attribute showFrom
             * @type String
             * @default left
             */
            showFrom: {
                value: 'left',
                lazyAdd: false,
                validator: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "validator", 317);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 318);
return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 320);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 321);
var F,
                        B = this.get('contentBox'),
                        fwh = POSITIONS[V][1];

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 325);
if (V === this.get('showFrom')) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 326);
return V;
                    }
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 328);
this._updatePositionShow({showFrom: V});

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 330);
return V;
                }
            },

            /**
             * Boolean indicating if Overlay needs to display mask or not.
             *
             * @attribute mask
             * @type Boolean
             * @default true
             */
            mask: {
                value: true,
                validator: Y.Lang.isBoolean,
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 344);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 345);
if (this.get('visible')) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 346);
this._displayMask(V);
                    }

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 349);
return V;
                }
            },

            /**
             * Default transition setting for Overlay
             *
             * @attribute transition
             * @type Object
             * @default {dutation: 0.5}
             */
            olTrans: {
                value: {
                    duration: 0.5
                }
            },

            /**
             * Boolean indicating if Overlay needs to adjusting height to match viewport when it shows from top or bottom.
             *
             * @attribute fullPage
             * @type Boolean
             * @default true
             */
            fullPage: {
                value: true,
                validator: Y.Lang.isBoolean,
                lazyAdd: false,
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 377);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 378);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 379);
this.olResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 381);
return V;
                }
            }
        },

        /**
         * Static property used to define the default HTML parsing rules
         *
         * @property HTML_PARSER
         * @protected
         * @static
         * @type Object
         */
        HTML_PARSER: {
            mask: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "mask", 395);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 396);
if (srcNode.getData('mask') === 'false') {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 397);
return false;
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 399);
return true;
            },

            showFrom: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "showFrom", 402);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 403);
return srcNode.getData('show-from');
            },

            olTrans: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "olTrans", 406);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 407);
try {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 408);
return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));
                } catch (e) {
                }
            },

            fullPage: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "fullPage", 413);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 414);
if (srcNode.getData('full-page') === 'false') {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 415);
return false;
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 417);
return true;
            }
        },

        /**
         * Default zindex for Page
         *
         * @property ZINDEX_PAGE
         * @static
         * @type Number
         * @default 100
         */
        ZINDEX_PAGE: 100,

        /**
         * Default zindex for visible Overlay
         *
         * @property ZINDEX_SHOW
         * @static
         * @type Number
         * @default 300
         */
        ZINDEX_SHOW: 300,

        /**
         * Default zindex for hidden Overlay
         *
         * @property ZINDEX_HIDE
         * @static
         * @type Number
         * @default 10
         */
        ZINDEX_HIDE: 10,

        /**
         * Get all instances of Overlay
         *
         * @method getInstances
         * @static
         * @return {Array} all instances of Overlay
         */
        getInstances: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "getInstances", 458);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 459);
return instances;
        },

        /**
         * Get current visilbe Overlay
         *
         * @method getCurrent
         * @static
         * @return {Object | undefined} current visible Overlay. If no any visible Overlay, return undefined.
         */
        getCurrent: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "getCurrent", 469);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 470);
return current;
        }
    });

_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 474);
Y.Bottle.Overlay = Overlay;

//create Overlay mask
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 477);
Mask.on('click', function () {
    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 4)", 477);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 478);
current.hide();
});


}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});
