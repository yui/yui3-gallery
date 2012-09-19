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
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].code=["YUI.add('gallery-bt-overlay', function(Y) {","","/*jslint nomen: true*/","/**"," * This module provides Overlay Widget which can show/hide with different transitions or directions."," *"," * @module gallery-bt-overlay"," */","var Mask = Y.one('.bt-overlay-mask') || Y.one('body').appendChild(Y.Node.create('<div class=\"bt-overlay-mask\"></div>')),","    WIDTH_CHANGE = 'widthChange',","    HEIGHT_CHANGE = 'heightChange',","    VISIBLE_CHANGE = 'visibleChange',","","    instances = [],","    current,","    body = Y.one('body'),","    next,","","    POSITIONS = {","        top: ['tc', 0, -1, 'bc', 0.5, 0],","        bottom: ['bc', 0, 1, 'tc', 0.5, 1],","        left: ['lc', -1, 0, 'rc', 0, 0.5],","        right: ['rc', 1, 0, 'lc', 1, 0.5]","    },","","    /**","     * A basic Overlay widget which support three types of animation. Use","     * show and hide function to display Overlay. Only one Overlay will show","     * in the same time.","     *","     * @class Overlay","     * @param [config] {Object} Object literal with initial attribute values","     * @extends Widget","     * @uses WidgetParent","     * @uses WidgetPosition","     * @uses WidgetStack","     * @uses WidgetPositionAlign","     * @uses Bottle.PushPop","     * @constructor","     * @namespace Bottle","     */","    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {","        initializer: function (cfg) {","            instances.push(this);","","            if (!cfg.zIndex) {","                this.set('zIndex', 200);","            }","","            /**","             * internal eventhandlers, keep for destructor","             *","             * @property _bscEventHandlers","             * @type EventHandle","             * @private","             */","            this._bscEventHandlers = new Y.EventHandle([","                this.after(WIDTH_CHANGE, this._updatePositionShow),","                this.after(HEIGHT_CHANGE, this._updatePositionShow),","                this.after(VISIBLE_CHANGE, this._doShowHide)","            ]);","","            //this._updatePositionHide();","            //this._updatePositionShow();","        },","","        destructor: function () {","            this._bscEventHandlers.detach();","            delete this._bscEventHandlers;","        },","","        renderUI: function () {","            var O = this.get('boundingBox'),","                W = O.get('offsetWidth'),","                H = O.get('offsetHeight');","","            if (!this.get('height') && H) {","                this.set('height', H);","            }","","            if (!this.get('width') && W) {","                this.set('width', W);","            }","        },","","        /**","         * Resize the Overlay to adapt the browser width and height.","         *","         * @method olResize","         * @param [force=false] {Boolean} <b>true</b> to forece resize even when Overlay is not visibile.","         */","        olResize: function (force) {","            //reduce syncUI times","            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {","                return;","            }","","            if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {","                return;","            }","","            if (!this.get('visible') && !force) {","                return;","            }","","            this._updateFullSize();","            this._updatePositionShow();","        },","","        /**","         * handle child full Height or width","         *","         * @method _updateFullSize","         * @protected","         */","        _updateFullSize: function () {","            if (this.get('fullPage')) {","                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});","                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});","            }","        },","","        /**","         * Update showed Overlay position based on action and showFrom","         *","         * @method _updatePositionShow","         * @protected","         */","        _updatePositionShow: function (E) {","            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                noAlign = (E && E.noAlign) ? true : false,","                posData = POSITIONS[pos];","","            if (!vis) {","                return;","            }","","            if (noAlign) {","                return;","            }","            if (this.get('fullPage')) {","                this.align(body, [posData[3], posData[3]]);","            } else {","                this.centered(body);","            }","        },","","        /**","         * move the Overlay to hidden place","         *","         * @method _updatePositionHide","         * @protected","         */","        _updatePositionHide: function (E) {","            var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                posData = POSITIONS[this.get('showFrom')];","","            if (!vis) {","                this.align(null, [posData[3], posData[0]]);","            }","        },","","        /**","         * Show or hide the mask.","         *","         * @method _displayMask","         * @param show {Boolean} true to display, false to hide.","         * @protected","         */","        _displayMask: function (show) {","            Mask.setStyle('display', show ? 'block' : 'none');","        },","","        /**","         * do transition on a node with top and left css properties","         *","         * @method _doTransition","         * @param node {Node} node to do transition","         * @param left {Number} css left in px","         * @param top {Number} css top in px","         * @param [done] {Function} If provided, call this function when transition done","         * @protected","         */","        _doTransition: function (node, left, top, done) {","            var that = this;","","            Y.later(1, this, function () {","                node.transition(Y.merge(this.get('olTrans'), {","                    left: left + 'px',","                    top: top + 'px'","                }), function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            });","        },","","        /**","         * handle Overlay transition when show or hide","         *","         * @method _doneShowHide","         * @protected","         */","        _doneShowHide: function () {","            var show = this.get('visible'),","                mask = this.get('mask');","","            if (mask) {","                this._displayMask(show);","            }","","            this.set('disabled', show ? false : true);","","            if (next) {","                next.show();","                next = undefined;","            }","        },","","        /**","         * handle Overlay transition when show or hide","         *","         * @method _doShowHide","         * @protected","         */","        _doShowHide: function (E) {","            var show = E.newVal,","                selfDir = show ? 0 : 1,","                pageDir = show ? -1 : 0,","                posData = POSITIONS[this.get('showFrom')],","                node = this.get('boundingBox'),","                pageRegion,","                nodeX,","                nodeY;","","            if (show) {","                this.enable();","                this._updateFullSize();","                this._updatePositionHide({visible: false});","                current = this;","            } else {","                this._updatePositionShow({visible: true});","                if (this.get('mask')) {","                    this._displayMask(false);","                }","                current = undefined;","            }","","            if (this.get('fullPage')) {","                this._doTransition(node, posData[4] * body.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * body.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'), this._doneShowHide);","            } else {","                pageRegion = body.get('region');","                if (show) {","                    nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);","                    nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);","                } else {","                    switch (this.get('showFrom')) {","                    case 'top':","                        nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);","                        nodeY = - this.get('height');","                        break;","                    case 'bottom':","                        nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);","                        nodeY = pageRegion.bottom;","                        break;","                    case 'right':","                        nodeX = pageRegion.right;","                        nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);","                        break;","                    case 'left':","                    default:","                        nodeX = - this.get('width');","                        nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);","                        break;","                    }","                }","                this._doTransition(node, nodeX, nodeY, this._doneShowHide);","            }","        }","    }, {","        /**","         * Static property used to define the default attribute configuration.","         *","         * @property ATTRS","         * @protected","         * @type Object","         * @static","         */","        ATTRS: {","            /**","             * The Overlay show direction. Should be one of:","             * <dl>","             *  <dt>top</dt><dd>top</dd>","             *  <dt>left</dt><dd>left</dd>","             *  <dt>right</dt><dd>right</dd>","             *  <dt>bottom</dt><dd>bottom</dd>","             * </dl>","             *","             * @attribute showFrom","             * @type String","             * @default left","             */","            showFrom: {","                value: 'left',","                lazyAdd: false,","                validator: function (V) {","                    return POSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    var F,","                        B = this.get('contentBox'),","                        fwh = POSITIONS[V][1];","","                    if (V === this.get('showFrom')) {","                        return V;","                    }","                    this._updatePositionShow({showFrom: V});","","                    return V;","                }","            },","","            /**","             * Boolean indicating if Overlay needs to display mask or not.","             *","             * @attribute mask","             * @type Boolean","             * @default true","             */","            mask: {","                value: true,","                validator: Y.Lang.isBoolean,","                setter: function (V) {","                    if (this.get('visible')) {","                        this._displayMask(V);","                    }","","                    return V;","                }","            },","","            /**","             * Default transition setting for Overlay","             *","             * @attribute olTrans","             * @type Object","             * @default {dutation: 0.5}","             */","            olTrans: {","                value: {","                    duration: 0.5","                }","            },","","            /**","             * Boolean indicating if Overlay needs to adjusting height to match viewport when it shows from top or bottom.","             *","             * @attribute fullPage","             * @type Boolean","             * @default true","             */","            fullPage: {","                value: true,","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.olResize();","                    }","                    return V;","                }","            }","        },","","        /**","         * Static property used to define the default HTML parsing rules","         *","         * @property HTML_PARSER","         * @protected","         * @static","         * @type Object","         */","        HTML_PARSER: {","            mask: function (srcNode) {","                if (srcNode.getData('mask') === 'false') {","                    return false;","                }","                return true;","            },","","            showFrom: function (srcNode) {","                return srcNode.getData('show-from');","            },","","            olTrans: function (srcNode) {","                try {","                    return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));","                } catch (e) {","                }","            },","","            fullPage: function (srcNode) {","                if (srcNode.getData('full-page') === 'false') {","                    return false;","                }","                return true;","            }","        },","","        /**","         * Get all instances of Overlay","         *","         * @method getInstances","         * @static","         * @return {Array} all instances of Overlay","         */","        getInstances: function () {","            return instances;","        },","","        /**","         * Get current visilbe Overlay","         *","         * @method getCurrent","         * @static","         * @return {Object | undefined} current visible Overlay. If no any visible Overlay, return undefined.","         */","        getCurrent: function () {","            return current;","        }","    });","","Y.Bottle.Overlay = Overlay;","","//create Overlay mask","Mask.on('click', function () {","    current.hide();","});","","","}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});"];
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].lines = {"1":0,"9":0,"44":0,"46":0,"47":0,"57":0,"68":0,"69":0,"73":0,"77":0,"78":0,"81":0,"82":0,"94":0,"95":0,"98":0,"99":0,"102":0,"103":0,"106":0,"107":0,"117":0,"118":0,"119":0,"130":0,"135":0,"136":0,"139":0,"140":0,"142":0,"143":0,"145":0,"156":0,"159":0,"160":0,"172":0,"186":0,"188":0,"189":0,"193":0,"194":0,"207":0,"210":0,"211":0,"214":0,"216":0,"217":0,"218":0,"229":0,"238":0,"239":0,"240":0,"241":0,"242":0,"244":0,"245":0,"246":0,"248":0,"251":0,"252":0,"254":0,"255":0,"256":0,"257":0,"259":0,"261":0,"262":0,"263":0,"265":0,"266":0,"267":0,"269":0,"270":0,"271":0,"274":0,"275":0,"276":0,"279":0,"309":0,"312":0,"316":0,"317":0,"319":0,"321":0,"336":0,"337":0,"340":0,"369":0,"370":0,"372":0,"387":0,"388":0,"390":0,"394":0,"398":0,"399":0,"405":0,"406":0,"408":0,"420":0,"431":0,"435":0,"438":0,"439":0};
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].functions = {"initializer:43":0,"destructor:67":0,"renderUI:72":0,"olResize:92":0,"_updateFullSize:116":0,"_updatePositionShow:129":0,"_updatePositionHide:155":0,"_displayMask:171":0,"(anonymous 3):192":0,"(anonymous 2):188":0,"_doTransition:185":0,"_doneShowHide:206":0,"_doShowHide:228":0,"validator:308":0,"setter:311":0,"setter:335":0,"setter:368":0,"mask:386":0,"showFrom:393":0,"olTrans:397":0,"fullPage:404":0,"getInstances:419":0,"getCurrent:430":0,"(anonymous 4):438":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-overlay/gallery-bt-overlay.js"].coveredLines = 104;
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

    instances = [],
    current,
    body = Y.one('body'),
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
     * @uses Bottle.PushPop
     * @constructor
     * @namespace Bottle
     */
    Overlay = Y.Base.create('btoverlay', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {
        initializer: function (cfg) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "initializer", 43);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 44);
instances.push(this);

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 46);
if (!cfg.zIndex) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 47);
this.set('zIndex', 200);
            }

            /**
             * internal eventhandlers, keep for destructor
             *
             * @property _bscEventHandlers
             * @type EventHandle
             * @private
             */
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 57);
this._bscEventHandlers = new Y.EventHandle([
                this.after(WIDTH_CHANGE, this._updatePositionShow),
                this.after(HEIGHT_CHANGE, this._updatePositionShow),
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);

            //this._updatePositionHide();
            //this._updatePositionShow();
        },

        destructor: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "destructor", 67);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 68);
this._bscEventHandlers.detach();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 69);
delete this._bscEventHandlers;
        },

        renderUI: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "renderUI", 72);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 73);
var O = this.get('boundingBox'),
                W = O.get('offsetWidth'),
                H = O.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 77);
if (!this.get('height') && H) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 78);
this.set('height', H);
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 81);
if (!this.get('width') && W) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 82);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "olResize", 92);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 94);
if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 95);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 98);
if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 99);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 102);
if (!this.get('visible') && !force) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 103);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 106);
this._updateFullSize();
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 107);
this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updateFullSize", 116);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 117);
if (this.get('fullPage')) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 118);
this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 119);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updatePositionShow", 129);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 130);
var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos];

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 135);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 136);
return;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 139);
if (noAlign) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 140);
return;
            }
            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 142);
if (this.get('fullPage')) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 143);
this.align(body, [posData[3], posData[3]]);
            } else {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 145);
this.centered(body);
            }
        },

        /**
         * move the Overlay to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_updatePositionHide", 155);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 156);
var vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                posData = POSITIONS[this.get('showFrom')];

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 159);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 160);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_displayMask", 171);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 172);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doTransition", 185);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 186);
var that = this;

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 188);
Y.later(1, this, function () {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 2)", 188);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 189);
node.transition(Y.merge(this.get('olTrans'), {
                    left: left + 'px',
                    top: top + 'px'
                }), function () {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 3)", 192);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 193);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 194);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doneShowHide", 206);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 207);
var show = this.get('visible'),
                mask = this.get('mask');

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 210);
if (mask) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 211);
this._displayMask(show);
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 214);
this.set('disabled', show ? false : true);

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 216);
if (next) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 217);
next.show();
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 218);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "_doShowHide", 228);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 229);
var show = E.newVal,
                selfDir = show ? 0 : 1,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox'),
                pageRegion,
                nodeX,
                nodeY;

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 238);
if (show) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 239);
this.enable();
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 240);
this._updateFullSize();
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 241);
this._updatePositionHide({visible: false});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 242);
current = this;
            } else {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 244);
this._updatePositionShow({visible: true});
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 245);
if (this.get('mask')) {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 246);
this._displayMask(false);
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 248);
current = undefined;
            }

            _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 251);
if (this.get('fullPage')) {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 252);
this._doTransition(node, posData[4] * body.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * body.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'), this._doneShowHide);
            } else {
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 254);
pageRegion = body.get('region');
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 255);
if (show) {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 256);
nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 257);
nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                } else {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 259);
switch (this.get('showFrom')) {
                    case 'top':
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 261);
nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 262);
nodeY = - this.get('height');
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 263);
break;
                    case 'bottom':
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 265);
nodeX = pageRegion.left + Math.floor(pageRegion.width / 2) - (this.get('width') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 266);
nodeY = pageRegion.bottom;
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 267);
break;
                    case 'right':
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 269);
nodeX = pageRegion.right;
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 270);
nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 271);
break;
                    case 'left':
                    default:
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 274);
nodeX = - this.get('width');
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 275);
nodeY = pageRegion.top + Math.floor(pageRegion.height / 2) - (this.get('height') / 2);
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 276);
break;
                    }
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 279);
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
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "validator", 308);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 309);
return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 311);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 312);
var F,
                        B = this.get('contentBox'),
                        fwh = POSITIONS[V][1];

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 316);
if (V === this.get('showFrom')) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 317);
return V;
                    }
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 319);
this._updatePositionShow({showFrom: V});

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 321);
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
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 335);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 336);
if (this.get('visible')) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 337);
this._displayMask(V);
                    }

                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 340);
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
                    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "setter", 368);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 369);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 370);
this.olResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 372);
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
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "mask", 386);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 387);
if (srcNode.getData('mask') === 'false') {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 388);
return false;
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 390);
return true;
            },

            showFrom: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "showFrom", 393);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 394);
return srcNode.getData('show-from');
            },

            olTrans: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "olTrans", 397);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 398);
try {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 399);
return Y.JSON.parse(srcNode.getData('cfg-ol-trans'));
                } catch (e) {
                }
            },

            fullPage: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "fullPage", 404);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 405);
if (srcNode.getData('full-page') === 'false') {
                    _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 406);
return false;
                }
                _yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 408);
return true;
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "getInstances", 419);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 420);
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
            _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "getCurrent", 430);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 431);
return current;
        }
    });

_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 435);
Y.Bottle.Overlay = Overlay;

//create Overlay mask
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 438);
Mask.on('click', function () {
    _yuitest_coverfunc("/build/gallery-bt-overlay/gallery-bt-overlay.js", "(anonymous 4)", 438);
_yuitest_coverline("/build/gallery-bt-overlay/gallery-bt-overlay.js", 439);
current.hide();
});


}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});
