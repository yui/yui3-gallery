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
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].code=["YUI.add('gallery-bt-overlay', function(Y) {","","/*jslint nomen: true*/","/**"," * This module provides Overlay Widget which can show/hide with different transitions or directions."," *"," * @module gallery-bt-overlay"," */","var body = Y.one('body'),","    Mask = Y.one('.bt-overlay-mask') || body.appendChild(Y.Node.create('<div class=\"bt-overlay-mask\"></div>')),","    WIDTH_CHANGE = 'widthChange',","    HEIGHT_CHANGE = 'heightChange',","    VISIBLE_CHANGE = 'visibleChange',","","    hasTouch = Y.Bottle.Device.getTouchSupport(),","    scrollBase = hasTouch ? body : Y.one('html'),","","    instances = [],","    current,","","    POSITIONS = {","        top: [0, -1],","        bottom: [0, 1],","        left: [-1, 0],","        right: [1, 0]","    },","","    /**","     * A basic Overlay widget which support three types of animation. Use","     * show and hide function to display Overlay. Only one Overlay will show","     * in the same time.","     *","     * @class Overlay","     * @param [config] {Object} Object literal with initial attribute values","     * @extends Widget","     * @uses WidgetParent","     * @uses WidgetPosition","     * @uses WidgetStack","     * @uses WidgetPositionAlign","     * @uses Bottle.PushPop","     * @constructor","     * @namespace Bottle","     */","    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {","        initializer: function (cfg) {","            var msk = this.get('contentBox').getData('mask');","","            instances.push(this);","","            if (!cfg.zIndex) {","                this.set('zIndex', 200);","            }","","            this.set('mask', (msk ? (msk === 'false') : this.get('fullPage')) ? false : true);","","            /**","             * internal eventhandlers, keep for destructor","             *","             * @property _bscEventHandlers","             * @type EventHandle","             * @private","             */","            this._bscEventHandlers = new Y.EventHandle([","                this.after(WIDTH_CHANGE, this._updatePositionShow),","                this.after(HEIGHT_CHANGE, this._updatePositionShow),","                this.after(VISIBLE_CHANGE, this._doShowHide)","            ]);","        },","","        destructor: function () {","            this._bscEventHandlers.detach();","            delete this._bscEventHandlers;","        },","","        renderUI: function () {","            this.syncWH();","            this._updatePositionHide();","            this._updatePositionShow();","        },","","        /**","         * Resize the Overlay to adapt the browser width and height.","         *","         * @method olResize","         * @param [force=false] {Boolean} <b>true</b> to forece resize even when Overlay is not visibile.","         */","        olResize: function (force) {","            if (!this.get('visible') && !force) {","                return;","            }","","            //reduce syncUI times","            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth()) && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {","                return;","            }","","            this._updateFullSize();","            this._updatePositionShow();","        },","","        /**","         * handle child full Height or width","         *","         * @method _updateFullSize","         * @protected","         */","        _updateFullSize: function () {","            if (this.get('fullPage')) {","                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});","                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});","            }","        },","","        /**","         * Update showed Overlay position based on action and showFrom","         *","         * @method _updatePositionShow","         * @protected","         */","        _updatePositionShow: function (E) {","            var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                noAlign = (E && E.noAlign) ? true : false,","                move = (vis && !noAlign),","                pos = move ? this.getShowHideXY(true) : 0;","","            if (move) {","                this.move(pos[0], pos[1]);","            }","        },","","        /**","         * move the Overlay to hidden place","         *","         * @method _updatePositionHide","         * @protected","         */","        _updatePositionHide: function (E) {","            var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                pos = vis ? 0 : this.getShowHideXY(false);","","            if (!vis) {","                this.move(pos[0], pos[1]);","            }","        },","","        /**","         * Show or hide the mask.","         *","         * @method _displayMask","         * @param show {Boolean} true to display, false to hide.","         * @protected","         */","        _displayMask: function (show) {","            Mask.setStyle('display', show ? 'block' : 'none');","        },","","        /**","         * do transition on a node with top and left css properties","         *","         * @method _doTransition","         * @param node {Node} node to do transition","         * @param left {Number} css left in px","         * @param top {Number} css top in px","         * @param [done] {Function} If provided, call this function when transition done","         * @protected","         */","        _doTransition: function (node, left, top, done) {","            var that = this;","","            Y.later(1, this, function () {","                node.transition(Y.merge(this.get('olTrans'), {","                    left: left + 'px',","                    top: top + 'px'","                }), function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            });","        },","","        /**","         * handle Overlay transition when show or hide","         *","         * @method _doneShowHide","         * @protected","         */","        _doneShowHide: function () {","            var show = this.get('visible'),","                mask = this.get('mask');","","            if (mask) {","                this._displayMask(show);","            }","","            if (!show) {","                this.disable();","            }","        },","","        /**","         * get show position or hide position","         *","         * @method getShowHideXY","         * @return {Array} array of position: [x, y]","         */","        getShowHideXY: function (show) {","            var selfDir = show ? 0 : 1,","                posData = POSITIONS[this.get('showFrom')],","                W = Y.Bottle.Device.getBrowserWidth(),","                H = Y.Bottle.Device.getBrowserHeight();","","            return [","                selfDir * W * posData[0] + Math.floor((W - this.get('width')) / 2),","                selfDir * H * posData[1] + Math.floor((H - this.get('height')) / 2) + scrollBase.get('scrollTop')","            ]; ","        },","","        /**","         * handle Overlay transition when show or hide","         *","         * @method _doShowHide","         * @protected","         */","        _doShowHide: function (E) {","            var show = E.newVal;","                runthese = show && this.enable() && this._updateFullSize(),","                finalPos = this.getShowHideXY(show),","                node = this.get('boundingBox');","","            if (show) {","                this._updatePositionHide({visible: false});","                current = this;","            } else {","                this._updatePositionShow({visible: true});","                current = undefined;","            }","","            this._doTransition(node, finalPos[0], finalPos[1], this._doneShowHide);","        }","    }, {","        /**","         * Static property used to define the default attribute configuration.","         *","         * @property ATTRS","         * @protected","         * @type Object","         * @static","         */","        ATTRS: {","            /**","             * The Overlay show direction. Should be one of:","             * <dl>","             *  <dt>top</dt><dd>top</dd>","             *  <dt>left</dt><dd>left</dd>","             *  <dt>right</dt><dd>right</dd>","             *  <dt>bottom</dt><dd>bottom</dd>","             * </dl>","             *","             * @attribute showFrom","             * @type String","             * @default left","             */","            showFrom: {","                value: 'left',","                lazyAdd: false,","                validator: function (V) {","                    return POSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    if (V === this.get('showFrom')) {","                        return V;","                    }","                    this._updatePositionShow({showFrom: V});","","                    return V;","                }","            },","","            /**","             * Boolean indicating if Overlay needs to display mask or not.","             *","             * @attribute mask","             * @type Boolean","             * @default true","             */","            mask: {","                value: true,","                validator: Y.Lang.isBoolean,","                setter: function (V) {","                    if (this.get('visible')) {","                        this._displayMask(V);","                    }","","                    return V;","                }","            },","","            /**","             * Default transition setting for Overlay","             *","             * @attribute olTrans","             * @type Object","             * @default {dutation: 0.5}","             */","            olTrans: {","                value: {","                    duration: 0.5","                }","            },","","            /**","             * Boolean indicating if Overlay needs to adjusting height to match viewport when it shows from top or bottom.","             *","             * @attribute fullPage","             * @type Boolean","             * @default true","             */","            fullPage: {","                value: true,","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.olResize();","                    }","                    return V;","                }","            }","        },","","        /**","         * Static property used to define the default HTML parsing rules","         *","         * @property HTML_PARSER","         * @protected","         * @static","         * @type Object","         */","        HTML_PARSER: {","            showFrom: function (srcNode) {","                return srcNode.getData('show-from');","            },","","            olTrans: function (srcNode) {","                try {","                    return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));","                } catch (e) {","                }","            },","","            fullPage: function (srcNode) {","                return (srcNode.getData('full-page') === 'false') ? false : true;","            }","        },","","        /**","         * Get all instances of Overlay","         *","         * @method getInstances","         * @static","         * @return {Array} all instances of Overlay","         */","        getInstances: function () {","            return instances;","        },","","        /**","         * Get current visilbe Overlay","         *","         * @method getCurrent","         * @static","         * @return {Object | undefined} current visible Overlay. If no any visible Overlay, return undefined.","         */","        getCurrent: function () {","            return current;","        }","    });","","Y.Bottle.Overlay = Overlay;","","// hide shortcut when click mask","Mask.on(hasTouch ? 'gesturemoveend' : 'click', function () {","    current.hide();","});","","// disable scroll on mask","Mask.on('gesturemovestart', function (E) {","    E.preventDefault();","});","","","}, '@VERSION@' ,{requires:['widget-position', 'widget-stack', 'gallery-bt-pushpop']});"];
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].lines = {"1":0,"9":0,"46":0,"48":0,"50":0,"51":0,"54":0,"63":0,"71":0,"72":0,"76":0,"77":0,"78":0,"88":0,"89":0,"93":0,"94":0,"97":0,"98":0,"108":0,"109":0,"110":0,"121":0,"126":0,"127":0,"138":0,"141":0,"142":0,"154":0,"168":0,"170":0,"171":0,"175":0,"176":0,"189":0,"192":0,"193":0,"196":0,"197":0,"208":0,"213":0,"226":0,"227":0,"231":0,"232":0,"233":0,"235":0,"236":0,"239":0,"268":0,"271":0,"272":0,"274":0,"276":0,"291":0,"292":0,"295":0,"324":0,"325":0,"327":0,"342":0,"346":0,"347":0,"353":0,"365":0,"376":0,"380":0,"383":0,"384":0,"388":0,"389":0};
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].functions = {"initializer:45":0,"destructor:70":0,"renderUI:75":0,"olResize:87":0,"_updateFullSize:107":0,"_updatePositionShow:120":0,"_updatePositionHide:137":0,"_displayMask:153":0,"(anonymous 3):174":0,"(anonymous 2):170":0,"_doTransition:167":0,"_doneShowHide:188":0,"getShowHideXY:207":0,"_doShowHide:225":0,"validator:267":0,"setter:270":0,"setter:290":0,"setter:323":0,"showFrom:341":0,"olTrans:345":0,"fullPage:352":0,"getInstances:364":0,"getCurrent:375":0,"(anonymous 4):383":0,"(anonymous 5):388":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].coveredLines = 71;
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].coveredFunctions = 26;
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
var body = Y.one('body'),
    Mask = Y.one('.bt-overlay-mask') || body.appendChild(Y.Node.create('<div class="bt-overlay-mask"></div>')),
    WIDTH_CHANGE = 'widthChange',
    HEIGHT_CHANGE = 'heightChange',
    VISIBLE_CHANGE = 'visibleChange',

    hasTouch = Y.Bottle.Device.getTouchSupport(),
    scrollBase = hasTouch ? body : Y.one('html'),

    instances = [],
    current,

    POSITIONS = {
        top: [0, -1],
        bottom: [0, 1],
        left: [-1, 0],
        right: [1, 0]
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
     * @uses Bottle.PushPop
     * @constructor
     * @namespace Bottle
     */
    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {
        initializer: function (cfg) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "initializer", 45);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 46);
var msk = this.get('contentBox').getData('mask');

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 48);
instances.push(this);

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 50);
if (!cfg.zIndex) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 51);
this.set('zIndex', 200);
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 54);
this.set('mask', (msk ? (msk === 'false') : this.get('fullPage')) ? false : true);

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
        },

        destructor: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "destructor", 70);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 71);
this._bscEventHandlers.detach();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 72);
delete this._bscEventHandlers;
        },

        renderUI: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "renderUI", 75);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 76);
this.syncWH();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 77);
this._updatePositionHide();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 78);
this._updatePositionShow();
        },

        /**
         * Resize the Overlay to adapt the browser width and height.
         *
         * @method olResize
         * @param [force=false] {Boolean} <b>true</b> to forece resize even when Overlay is not visibile.
         */
        olResize: function (force) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "olResize", 87);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 88);
if (!this.get('visible') && !force) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 89);
return;
            }

            //reduce syncUI times
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 93);
if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth()) && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 94);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 97);
this._updateFullSize();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 98);
this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updateFullSize", 107);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 108);
if (this.get('fullPage')) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 109);
this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 110);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updatePositionShow", 120);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 121);
var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                move = (vis && !noAlign),
                pos = move ? this.getShowHideXY(true) : 0;

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 126);
if (move) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 127);
this.move(pos[0], pos[1]);
            }
        },

        /**
         * move the Overlay to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updatePositionHide", 137);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 138);
var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                pos = vis ? 0 : this.getShowHideXY(false);

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 141);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 142);
this.move(pos[0], pos[1]);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_displayMask", 153);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 154);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doTransition", 167);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 168);
var that = this;

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 170);
Y.later(1, this, function () {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 2)", 170);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 171);
node.transition(Y.merge(this.get('olTrans'), {
                    left: left + 'px',
                    top: top + 'px'
                }), function () {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 3)", 174);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 175);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 176);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doneShowHide", 188);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 189);
var show = this.get('visible'),
                mask = this.get('mask');

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 192);
if (mask) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 193);
this._displayMask(show);
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 196);
if (!show) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 197);
this.disable();
            }
        },

        /**
         * get show position or hide position
         *
         * @method getShowHideXY
         * @return {Array} array of position: [x, y]
         */
        getShowHideXY: function (show) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "getShowHideXY", 207);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 208);
var selfDir = show ? 0 : 1,
                posData = POSITIONS[this.get('showFrom')],
                W = Y.Bottle.Device.getBrowserWidth(),
                H = Y.Bottle.Device.getBrowserHeight();

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 213);
return [
                selfDir * W * posData[0] + Math.floor((W - this.get('width')) / 2),
                selfDir * H * posData[1] + Math.floor((H - this.get('height')) / 2) + scrollBase.get('scrollTop')
            ]; 
        },

        /**
         * handle Overlay transition when show or hide
         *
         * @method _doShowHide
         * @protected
         */
        _doShowHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doShowHide", 225);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 226);
var show = E.newVal;
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 227);
runthese = show && this.enable() && this._updateFullSize(),
                finalPos = this.getShowHideXY(show),
                node = this.get('boundingBox');

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 231);
if (show) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 232);
this._updatePositionHide({visible: false});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 233);
current = this;
            } else {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 235);
this._updatePositionShow({visible: true});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 236);
current = undefined;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 239);
this._doTransition(node, finalPos[0], finalPos[1], this._doneShowHide);
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
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "validator", 267);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 268);
return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 270);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 271);
if (V === this.get('showFrom')) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 272);
return V;
                    }
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 274);
this._updatePositionShow({showFrom: V});

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 276);
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
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 290);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 291);
if (this.get('visible')) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 292);
this._displayMask(V);
                    }

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 295);
return V;
                }
            },

            /**
             * Default transition setting for Overlay
             *
             * @attribute olTrans
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
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 323);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 324);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 325);
this.olResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 327);
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
            showFrom: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "showFrom", 341);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 342);
return srcNode.getData('show-from');
            },

            olTrans: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "olTrans", 345);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 346);
try {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 347);
return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));
                } catch (e) {
                }
            },

            fullPage: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "fullPage", 352);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 353);
return (srcNode.getData('full-page') === 'false') ? false : true;
            }
        },

        /**
         * Get all instances of Overlay
         *
         * @method getInstances
         * @static
         * @return {Array} all instances of Overlay
         */
        getInstances: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "getInstances", 364);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 365);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "getCurrent", 375);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 376);
return current;
        }
    });

_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 380);
Y.Bottle.Overlay = Overlay;

// hide shortcut when click mask
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 383);
Mask.on(hasTouch ? 'gesturemoveend' : 'click', function () {
    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 4)", 383);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 384);
current.hide();
});

// disable scroll on mask
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 388);
Mask.on('gesturemovestart', function (E) {
    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 5)", 388);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 389);
E.preventDefault();
});


}, '@VERSION@' ,{requires:['widget-position', 'widget-stack', 'gallery-bt-pushpop']});
