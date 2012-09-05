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
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-shortcut/gallery-bt-shortcut.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].code=["YUI.add('gallery-bt-shortcut', function(Y) {","","/**"," * This module provides ShortCut Widget which can show/hide with different transitions or directions."," *"," * @module gallery-bt-shortcut"," */","var Mask = Y.one('.bt-shortcut-mask') || Y.one('body').appendChild(Y.Node.create('<div class=\"bt-shortcut-mask\"></div>')),","    WIDTH_CHANGE = 'widthChange',","    HEIGHT_CHANGE = 'heightChange',","    VISIBLE_CHANGE = 'visibleChange',","","    pageWidget,","    pageNode,","","    instances = [],","    current,","    next,","","    TRANSITIONS = {","        unveil: 1,","        push: 1","    },","","    POSITIONS = {","        top: ['tc', 0, -1, 'bc', 0.5, 0],","        bottom: ['bc', 0, 1, 'tc', 0.5, 1],","        left: ['lc', -1, 0, 'rc', 0, 0.5],","        right: ['rc', 1, 0, 'lc', 1, 0.5]","    },","","    FULLWH = {","        'true': 1,","        'false': 1","    },","","    /**","     * A basic ShortCut widget which support three types of animation. Use","     * show and hide function to display ShortCut. Only one ShortCut will show","     * in the same time.","     *","     * @class ShortCut","     * @param [config] {Object} Object literal with initial attribute values","     * @extends Widget","     * @namespace Bottle","     * @uses WidgetParent","     * @uses WidgetPosition","     * @uses WidgetStack","     * @uses WidgetPositionAlign","     * @uses PushPop","     * @constructor","     */","    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {","        initializer: function () {","            if (!pageWidget) {","                pageWidget = Y.Bottle.Page.getCurrent();","                if (pageWidget) {","                    pageNode = pageWidget.get('boundingBox');","                    pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);","                }","            }","","            instances.push(this);","","            /**","             * internal eventhandlers, keep for destructor","             *","             * @property _bscEventHandlers","             * @type EventHandle","             * @private","             */","            this._bscEventHandlers = new Y.EventHandle([","                this.after(WIDTH_CHANGE, this._updatePositionShow),","                this.after(HEIGHT_CHANGE, this._updatePositionShow),","                this.before(VISIBLE_CHANGE, this._beforeShowHide),","                this.after(VISIBLE_CHANGE, this._doShowHide)","            ]);","","            this.get('contentBox').setStyle('display', 'block');","","            this._updatePositionHide();","            this._updatePositionShow();","        },","","        destructor: function () {","            this._bscEventHandlers.detach();","            delete this._bscEventHandlers;","        },","","        renderUI: function () {","            var O = this.get('boundingBox'),","                W = O.get('offsetWidth'),","                H = O.get('offsetHeight');","","            if (!this.get('height') && H) {","                this.set('height', H);","            }","","            if (!this.get('width') && W) {","                this.set('width', W);","            }","        },","","        /**","         * Resize the ShortCut to adapt the browser width and height.","         *","         * @method scResize","         * @param [force=false] {Boolean} <b>true</b> to forece resize even when ShortCut is not visibile.","         */","        scResize: function (force) {","            //reduce syncUI times","            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {","                return;","            }","","            if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {","                return;","            }","","            if (!this.get('visible') && !force) {","                return;","            }","","            this._updateFullSize();","            this._updatePositionShow();","        },","","        /**","         * handle child full Height or width","         *","         * @method _updateFullSize","         * @protected","         */","        _updateFullSize: function () {","            if (this.get('fullHeight')) {","                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});","            }","","            if (this.get('fullWidth')) {","                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});","            }","        },","","        /**","         * Update showed ShortCut position based on action and showFrom","         *","         * @method _updatePositionShow","         * @protected","         */","        _updatePositionShow: function (E) {","            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                noAlign = (E && E.noAlign) ? true : false,","                posData = POSITIONS[pos];","","            if (!vis) {","                return;","            }","","            if (noAlign) {","                return;","            }","","            pageNode.setStyles({","                left: -posData[1] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',","                top: -posData[2] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'","            });","","            this.align(pageNode, [posData[3], posData[0]]);","        },","","        /**","         * move the ShortCut to hidden place","         *","         * @method _updatePositionHide","         * @protected","         */","        _updatePositionHide: function (E) {","            var isUnveil = (this.get('action') === 'unveil'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                posData = POSITIONS[this.get('showFrom')];","","            if (!vis) {","                this.align(null, [isUnveil ? posData[0] : posData[3], posData[0]]);","            }","        },","","        /**","         * Show or hide the mask.","         *","         * @method _displayMask","         * @param show {Boolean} true to display, false to hide.","         * @protected","         */","        _displayMask: function (show) {","            Mask.setStyle('display', show ? 'block' : 'none');","        },","","        /**","         * do transition on a node with top and left css properties","         *","         * @method _doTransition","         * @param node {Node} node to do transition","         * @param left {Number} css left in px","         * @param top {Number} css top in px","         * @param [done] {Function} If provided, call this function when transition done","         * @protected","         */","        _doTransition: function (node, left, top, done) {","            var that = this;","","            Y.later(1, this, function () {","                node.transition(Y.merge(this.get('scTrans'), {","                    left: left + 'px',","                    top: top + 'px'","                }), function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            });","        },","","        /**","         * handle other Shortcut transition when show or hide","         *","         * @method _beforeShowHide","         * @protected","         */","        _beforeShowHide: function (E) {","            var show = E.newVal;","","            if (!current || !show || (current === this)) {","                return;","            }","","            next = this;","            E.halt(); ","            current.hide();","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doneShowHide","         * @protected","         */","        _doneShowHide: function () {","            var show = this.get('visible'),","                mask = this.get('mask');","","            if (mask) {","                this._displayMask(show);","            }","","            this.set('disabled', show ? false : true);","            this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);","","            if (next) {","                next.show();","                next = undefined;","            }","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doShowHide","         * @protected","         */","        _doShowHide: function (E) {","            var show = E.newVal,","                selfDir = show ? 0 : 1,","                pageDir = show ? -1 : 0,","                posData = POSITIONS[this.get('showFrom')],","                node = this.get('boundingBox');","","            if (show) {","                this.enable();","                this._updateFullSize();","                this._updatePositionHide({visible: false});","                current = this;","            } else {","                this._updatePositionShow({visible: true});","                if (this.get('mask')) {","                    this._displayMask(false);","                }","                current = undefined;","            }","            this.set('zIndex', ShortCut.ZINDEX_HIDE);","","            this._doTransition(pageNode, pageDir * posData[1] * this.get('width'), pageDir * posData[2] * this.get('height'), this._doneShowHide);","","            if (this.get('action') !== 'unveil') {","                this._doTransition(node, posData[4] * pageNode.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * pageNode.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'));","            }","        }","    }, {","        /**","         * Static property used to define the default attribute configuration.","         *","         * @property ATTRS","         * @protected","         * @type Object","         * @static","         */","        ATTRS: {","            /**","             * The animation action of the shortcut. Should be one of: 'push', 'unveil' .","             *","             * @attribute action","             * @type String","             * @default unveil","             */","            action: {","                value: 'unveil',","                lazyAdd: false,","                validator: function (V) {","                    return TRANSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    if (V !== this.get('action')) {","                        this._updatePositionShow({action: V});","                    }","                    return V;","                }","            },","","            /**","             * The shortcut show direction. Should be one of:","             * <dl>","             *  <dt>top</dt><dd>top</dd>","             *  <dt>left</dt><dd>left</dd>","             *  <dt>right</dt><dd>right</dd>","             *  <dt>bottom</dt><dd>bottom</dd>","             * </dl>","             *","             * @attribute showFrom","             * @type String","             * @default left","             */","            showFrom: {","                value: 'left',","                lazyAdd: false,","                validator: function (V) {","                    return POSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    var F,","                        B = this.get('contentBox'), ","                        fwh = POSITIONS[V][1];","","                    if (V === this.get('showFrom')) {","                        return V;","                    }","","                    this._updatePositionShow({showFrom: V});","","                    F = B.getData('full-height');","                    if (FULLWH[F]) {","                        this.set('fullHeight', F === 'true');","                    } else {","                        this.set('fullHeight', (fwh !== 0) ? true : false);","                    }","","                    F = B.getData('full-width');","                    if (FULLWH[F]) {","                        this.set('fullWidth', F === 'true');","                    } else {","                        this.set('fullWidth', fwh === 0);","                    }","","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to display mask or not.","             *","             * @attribute mask","             * @type Boolean","             * @default true","             */","            mask: {","                value: true,","                validator: Y.Lang.isBoolean,","                setter: function (V) {","                    if (this.get('visible')) {","                        this._displayMask(V);","                    }","","                    return V;","                }","            },","","            /**","             * Default transition setting for ShortCut","             *","             * @attribute transition","             * @type Object","             * @default {dutation: 0.5}","             */","            scTrans: {","                value: {","                    duration: 0.5","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from left or right.","             *","             * @attribute fullHeight","             * @type Boolean","             * @default true","             */","            fullHeight: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from top or bottom.","             *","             * @attribute fullWidth","             * @type Boolean","             * @default true","             */","            fullWidth: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            }","        },","","        /**","         * Static property used to define the default HTML parsing rules","         *","         * @property HTML_PARSER","         * @protected","         * @static","         * @type Object","         */","        HTML_PARSER: {","            mask: function (srcNode) {","                if (srcNode.getData('mask') === 'false') {","                    return false;","                }","                return true;","            },","","            action: function (srcNode) {","                return srcNode.getData('action');","            },","","            showFrom: function (srcNode) {","                return srcNode.getData('show-from');","            },","","            scTrans: function (srcNode) {","                try {","                    return Y.JSON.parse(srcNode.getData('cfg-sc-trans'));","                } catch (e) {","                }","            }","        },","","        /**","         * Default zindex for Page","         *","         * @property ZINDEX_PAGE","         * @static","         * @type Number","         * @default 100","         */","        ZINDEX_PAGE: 100,","","        /**","         * Default zindex for visible ShortCut","         *","         * @property ZINDEX_SHOW","         * @static","         * @type Number","         * @default 200","         */","        ZINDEX_SHOW: 200,","","        /**","         * Default zindex for hidden ShortCut","         *","         * @property ZINDEX_HIDE","         * @static","         * @type Number","         * @default 10","         */","        ZINDEX_HIDE: 10,","","        /**","         * Get all instances of ShortCut","         *","         * @method getInstances","         * @static","         * @return {Array} all instances of ShortCut","         */","        getInstances: function () {","            return instances;","        },","","        /**","         * Get current visilbe ShortCut","         *","         * @method getCurrent","         * @static","         * @return {Object | undefined} current visible ShortCut. If no any visible ShortCut, return undefined.","         */","        getCurrent: function () {","            return current;","        }","    });","","Y.Bottle.ShortCut = ShortCut;","","//create shortcut mask","Mask.on('click', function () {","    current.hide();","});","","","}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});"];
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].lines = {"1":0,"8":0,"55":0,"56":0,"57":0,"58":0,"59":0,"63":0,"72":0,"79":0,"81":0,"82":0,"86":0,"87":0,"91":0,"95":0,"96":0,"99":0,"100":0,"112":0,"113":0,"116":0,"117":0,"120":0,"121":0,"124":0,"125":0,"135":0,"136":0,"139":0,"140":0,"151":0,"156":0,"157":0,"160":0,"161":0,"164":0,"169":0,"179":0,"183":0,"184":0,"196":0,"210":0,"212":0,"213":0,"217":0,"218":0,"231":0,"233":0,"234":0,"237":0,"238":0,"239":0,"249":0,"252":0,"253":0,"256":0,"257":0,"259":0,"260":0,"261":0,"272":0,"278":0,"279":0,"280":0,"281":0,"282":0,"284":0,"285":0,"286":0,"288":0,"290":0,"292":0,"294":0,"295":0,"319":0,"322":0,"323":0,"325":0,"346":0,"349":0,"353":0,"354":0,"357":0,"359":0,"360":0,"361":0,"363":0,"366":0,"367":0,"368":0,"370":0,"373":0,"388":0,"389":0,"392":0,"420":0,"421":0,"423":0,"438":0,"439":0,"441":0,"456":0,"457":0,"459":0,"463":0,"467":0,"471":0,"472":0,"516":0,"527":0,"531":0,"534":0,"535":0};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].functions = {"initializer:54":0,"destructor:85":0,"renderUI:90":0,"scResize:110":0,"_updateFullSize:134":0,"_updatePositionShow:150":0,"_updatePositionHide:178":0,"_displayMask:195":0,"(anonymous 3):216":0,"(anonymous 2):212":0,"_doTransition:209":0,"_beforeShowHide:230":0,"_doneShowHide:248":0,"_doShowHide:271":0,"validator:318":0,"setter:321":0,"validator:345":0,"setter:348":0,"setter:387":0,"setter:419":0,"setter:437":0,"mask:455":0,"action:462":0,"showFrom:466":0,"scTrans:470":0,"getInstances:515":0,"getCurrent:526":0,"(anonymous 4):534":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].coveredLines = 114;
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].coveredFunctions = 29;
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 1);
YUI.add('gallery-bt-shortcut', function(Y) {

/**
 * This module provides ShortCut Widget which can show/hide with different transitions or directions.
 *
 * @module gallery-bt-shortcut
 */
_yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 8);
var Mask = Y.one('.bt-shortcut-mask') || Y.one('body').appendChild(Y.Node.create('<div class="bt-shortcut-mask"></div>')),
    WIDTH_CHANGE = 'widthChange',
    HEIGHT_CHANGE = 'heightChange',
    VISIBLE_CHANGE = 'visibleChange',

    pageWidget,
    pageNode,

    instances = [],
    current,
    next,

    TRANSITIONS = {
        unveil: 1,
        push: 1
    },

    POSITIONS = {
        top: ['tc', 0, -1, 'bc', 0.5, 0],
        bottom: ['bc', 0, 1, 'tc', 0.5, 1],
        left: ['lc', -1, 0, 'rc', 0, 0.5],
        right: ['rc', 1, 0, 'lc', 1, 0.5]
    },

    FULLWH = {
        'true': 1,
        'false': 1
    },

    /**
     * A basic ShortCut widget which support three types of animation. Use
     * show and hide function to display ShortCut. Only one ShortCut will show
     * in the same time.
     *
     * @class ShortCut
     * @param [config] {Object} Object literal with initial attribute values
     * @extends Widget
     * @namespace Bottle
     * @uses WidgetParent
     * @uses WidgetPosition
     * @uses WidgetStack
     * @uses WidgetPositionAlign
     * @uses PushPop
     * @constructor
     */
    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {
        initializer: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "initializer", 54);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 55);
if (!pageWidget) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 56);
pageWidget = Y.Bottle.Page.getCurrent();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 57);
if (pageWidget) {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 58);
pageNode = pageWidget.get('boundingBox');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 59);
pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);
                }
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 63);
instances.push(this);

            /**
             * internal eventhandlers, keep for destructor
             *
             * @property _bscEventHandlers
             * @type EventHandle
             * @private
             */
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 72);
this._bscEventHandlers = new Y.EventHandle([
                this.after(WIDTH_CHANGE, this._updatePositionShow),
                this.after(HEIGHT_CHANGE, this._updatePositionShow),
                this.before(VISIBLE_CHANGE, this._beforeShowHide),
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 79);
this.get('contentBox').setStyle('display', 'block');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 81);
this._updatePositionHide();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 82);
this._updatePositionShow();
        },

        destructor: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "destructor", 85);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 86);
this._bscEventHandlers.detach();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 87);
delete this._bscEventHandlers;
        },

        renderUI: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "renderUI", 90);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 91);
var O = this.get('boundingBox'),
                W = O.get('offsetWidth'),
                H = O.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 95);
if (!this.get('height') && H) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 96);
this.set('height', H);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 99);
if (!this.get('width') && W) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 100);
this.set('width', W);
            }
        },

        /**
         * Resize the ShortCut to adapt the browser width and height.
         *
         * @method scResize
         * @param [force=false] {Boolean} <b>true</b> to forece resize even when ShortCut is not visibile.
         */
        scResize: function (force) {
            //reduce syncUI times
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scResize", 110);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 112);
if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 113);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 116);
if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 117);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 120);
if (!this.get('visible') && !force) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 121);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 124);
this._updateFullSize();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 125);
this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updateFullSize", 134);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 135);
if (this.get('fullHeight')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 136);
this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 139);
if (this.get('fullWidth')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 140);
this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
            }
        },

        /**
         * Update showed ShortCut position based on action and showFrom
         *
         * @method _updatePositionShow
         * @protected
         */
        _updatePositionShow: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionShow", 150);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 151);
var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 156);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 157);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 160);
if (noAlign) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 161);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 164);
pageNode.setStyles({
                left: -posData[1] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',
                top: -posData[2] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'
            });

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 169);
this.align(pageNode, [posData[3], posData[0]]);
        },

        /**
         * move the ShortCut to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionHide", 178);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 179);
var isUnveil = (this.get('action') === 'unveil'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                posData = POSITIONS[this.get('showFrom')];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 183);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 184);
this.align(null, [isUnveil ? posData[0] : posData[3], posData[0]]);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_displayMask", 195);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 196);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doTransition", 209);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 210);
var that = this;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 212);
Y.later(1, this, function () {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 2)", 212);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 213);
node.transition(Y.merge(this.get('scTrans'), {
                    left: left + 'px',
                    top: top + 'px'
                }), function () {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 3)", 216);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 217);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 218);
done.apply(that);
                    }
                });
            });
        },

        /**
         * handle other Shortcut transition when show or hide
         *
         * @method _beforeShowHide
         * @protected
         */
        _beforeShowHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_beforeShowHide", 230);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 231);
var show = E.newVal;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 233);
if (!current || !show || (current === this)) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 234);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 237);
next = this;
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 238);
E.halt(); 
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 239);
current.hide();
        },

        /**
         * handle Shortcut transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doneShowHide", 248);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 249);
var show = this.get('visible'),
                mask = this.get('mask');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 252);
if (mask) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 253);
this._displayMask(show);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 256);
this.set('disabled', show ? false : true);
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 257);
this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 259);
if (next) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 260);
next.show();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 261);
next = undefined;
            }
        },

        /**
         * handle Shortcut transition when show or hide
         *
         * @method _doShowHide
         * @protected
         */
        _doShowHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doShowHide", 271);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 272);
var show = E.newVal,
                selfDir = show ? 0 : 1,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 278);
if (show) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 279);
this.enable();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 280);
this._updateFullSize();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 281);
this._updatePositionHide({visible: false});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 282);
current = this;
            } else {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 284);
this._updatePositionShow({visible: true});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 285);
if (this.get('mask')) {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 286);
this._displayMask(false);
                }
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 288);
current = undefined;
            }
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 290);
this.set('zIndex', ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 292);
this._doTransition(pageNode, pageDir * posData[1] * this.get('width'), pageDir * posData[2] * this.get('height'), this._doneShowHide);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 294);
if (this.get('action') !== 'unveil') {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 295);
this._doTransition(node, posData[4] * pageNode.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * pageNode.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'));
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
             * The animation action of the shortcut. Should be one of: 'push', 'unveil' .
             *
             * @attribute action
             * @type String
             * @default unveil
             */
            action: {
                value: 'unveil',
                lazyAdd: false,
                validator: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 318);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 319);
return TRANSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 321);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 322);
if (V !== this.get('action')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 323);
this._updatePositionShow({action: V});
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 325);
return V;
                }
            },

            /**
             * The shortcut show direction. Should be one of:
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 345);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 346);
return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 348);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 349);
var F,
                        B = this.get('contentBox'), 
                        fwh = POSITIONS[V][1];

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 353);
if (V === this.get('showFrom')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 354);
return V;
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 357);
this._updatePositionShow({showFrom: V});

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 359);
F = B.getData('full-height');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 360);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 361);
this.set('fullHeight', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 363);
this.set('fullHeight', (fwh !== 0) ? true : false);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 366);
F = B.getData('full-width');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 367);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 368);
this.set('fullWidth', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 370);
this.set('fullWidth', fwh === 0);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 373);
return V;
                }
            },

            /**
             * Boolean indicating if ShortCut needs to display mask or not.
             *
             * @attribute mask
             * @type Boolean
             * @default true
             */
            mask: {
                value: true,
                validator: Y.Lang.isBoolean,
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 387);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 388);
if (this.get('visible')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 389);
this._displayMask(V);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 392);
return V;
                }
            },

            /**
             * Default transition setting for ShortCut
             *
             * @attribute transition
             * @type Object
             * @default {dutation: 0.5}
             */
            scTrans: {
                value: {
                    duration: 0.5
                }
            },

            /**
             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from left or right.
             *
             * @attribute fullHeight
             * @type Boolean
             * @default true
             */
            fullHeight: {
                validator: Y.Lang.isBoolean,
                lazyAdd: false,
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 419);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 420);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 421);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 423);
return V;
                }
            },

            /**
             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from top or bottom.
             *
             * @attribute fullWidth
             * @type Boolean
             * @default true
             */
            fullWidth: {
                validator: Y.Lang.isBoolean,
                lazyAdd: false,
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 437);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 438);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 439);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 441);
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
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "mask", 455);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 456);
if (srcNode.getData('mask') === 'false') {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 457);
return false;
                }
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 459);
return true;
            },

            action: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "action", 462);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 463);
return srcNode.getData('action');
            },

            showFrom: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "showFrom", 466);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 467);
return srcNode.getData('show-from');
            },

            scTrans: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scTrans", 470);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 471);
try {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 472);
return Y.JSON.parse(srcNode.getData('cfg-sc-trans'));
                } catch (e) {
                }
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
         * Default zindex for visible ShortCut
         *
         * @property ZINDEX_SHOW
         * @static
         * @type Number
         * @default 200
         */
        ZINDEX_SHOW: 200,

        /**
         * Default zindex for hidden ShortCut
         *
         * @property ZINDEX_HIDE
         * @static
         * @type Number
         * @default 10
         */
        ZINDEX_HIDE: 10,

        /**
         * Get all instances of ShortCut
         *
         * @method getInstances
         * @static
         * @return {Array} all instances of ShortCut
         */
        getInstances: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getInstances", 515);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 516);
return instances;
        },

        /**
         * Get current visilbe ShortCut
         *
         * @method getCurrent
         * @static
         * @return {Object | undefined} current visible ShortCut. If no any visible ShortCut, return undefined.
         */
        getCurrent: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getCurrent", 526);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 527);
return current;
        }
    });

_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 531);
Y.Bottle.ShortCut = ShortCut;

//create shortcut mask
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 534);
Mask.on('click', function () {
    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 4)", 534);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 535);
current.hide();
});


}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});
