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
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].code=["YUI.add('gallery-bt-shortcut', function(Y) {","","/**"," * This module provides ShortCut Widget which can show/hide with different transitions or directions."," *"," * @module gallery-bt-shortcut"," */","var body = Y.one('body'),","    Mask = Y.one('.bt-shortcut-mask') || body.appendChild(Y.Node.create('<div class=\"bt-shortcut-mask\"></div>')),","    WIDTH_CHANGE = 'widthChange',","    HEIGHT_CHANGE = 'heightChange',","    VISIBLE_CHANGE = 'visibleChange',","","    hasTouch = Y.Bottle.Device.getTouchSupport(),","    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),","","    scrollBase = hasTouch ? body : Y.one('html'),","    pageWidget,","    pageNode,","","    instances = [],","    current,","    next,","","    TRANSITIONS = {","        unveil: 1,","        push: 1","    },","","    POSITIONS = {","        top: [0, -1, 0.5, 0],","        bottom: [0, 1, 0.5, 1],","        left: [-1, 0, 0, 0.5],","        right: [1, 0, 1, 0.5]","    },","","    FULLWH = {","        'true': 1,","        'false': 1","    },","","    /**","     * A basic ShortCut widget which support three types of animation. Use","     * show and hide function to display ShortCut. Only one ShortCut will show","     * in the same time.","     *","     * @class ShortCut","     * @param [config] {Object} Object literal with initial attribute values","     * @extends Widget","     * @namespace Bottle","     * @uses WidgetParent","     * @uses WidgetPosition","     * @uses WidgetStack","     * @uses WidgetPositionAlign","     * @uses Bottle.PushPop","     * @constructor","     */","    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {","        initializer: function () {","            if (!pageWidget) {","                pageWidget = Y.Bottle.Page.getCurrent();","                if (pageWidget) {","                    pageNode = pageWidget.get('boundingBox');","                    pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);","                }","            }","","            instances.push(this);","","            /**","             * internal eventhandlers, keep for destructor","             *","             * @property _bscEventHandlers","             * @type EventHandle","             * @private","             */","            this._bscEventHandlers = new Y.EventHandle([","                this.after(WIDTH_CHANGE, this._updatePositionShow),","                this.after(HEIGHT_CHANGE, this._updatePositionShow),","                this.before(VISIBLE_CHANGE, this._beforeShowHide),","                this.after(VISIBLE_CHANGE, this._doShowHide)","            ]);","","            this.get('contentBox').setStyle('display', 'block');","","            this._updatePositionHide();","            this._updatePositionShow();","        },","","        destructor: function () {","            this._bscEventHandlers.detach();","            delete this._bscEventHandlers;","        },","","        renderUI: function () {","            this.syncWH();","        },","","        /**","         * Resize the ShortCut to adapt the browser width and height.","         *","         * @method scResize","         * @param [force=false] {Boolean} <b>true</b> to forece resize even when ShortCut is not visibile.","         */","        scResize: function (force) {","            //reduce syncUI times","            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {","                return;","            }","","            if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {","                return;","            }","","            if (!this.get('visible') && !force) {","                return;","            }","","            this._updateFullSize();","            this._updatePositionShow();","        },","","        /**","         * handle child full Height or width","         *","         * @method _updateFullSize","         * @protected","         */","        _updateFullSize: function () {","            if (this.get('fullHeight')) {","                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});","            }","","            if (this.get('fullWidth')) {","                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});","            }","        },","","","        /**","         * get show or hide position of shortcut","         *","         * @method getshowHidePosition","         */","        getShowHidePosition: function (show) {","            var selfDir = show ? 0 : 1,","                posData = POSITIONS[this.get('showFrom')];","","            return [","                Math.floor(posData[2] * Y.Bottle.Device.getBrowserWidth() + (selfDir * posData[0] - posData[2]) * this.get('width')), ","                Math.floor(posData[3] * Y.Bottle.Device.getBrowserHeight() + (selfDir * posData[1] - posData[3]) * this.get('height')) + scrollBase.get('scrollTop')","            ];","        },","","        /**","         * Update showed ShortCut position based on action and showFrom","         *","         * @method _updatePositionShow","         * @protected","         */","        _updatePositionShow: function (E) {","            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                noAlign = (E && E.noAlign) ? true : false,","                posData = POSITIONS[pos],","                XY;","","            if (!vis) {","                return;","            }","","            if (noAlign) {","                return;","            }","","            pageNode.setStyles({","                left: -posData[0] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',","                top: -posData[1] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'","            });","","            XY = this.getShowHidePosition(true);","            this.move(XY[0], XY[1]);","        },","","        /**","         * move the ShortCut to hidden place","         *","         * @method _updatePositionHide","         * @protected","         */","        _updatePositionHide: function (E) {","            var isUnveil = (this.get('action') === 'unveil'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                XY = this.getShowHidePosition(vis || isUnveil);","","            this.move(XY[0], XY[1]);","        },","","        /**","         * Show or hide the mask.","         *","         * @method _displayMask","         * @param show {Boolean} true to display, false to hide.","         * @protected","         */","        _displayMask: function (show) {","            Mask.setStyle('display', show ? 'block' : 'none');","        },","","        /**","         * do transition on a node with top and left css properties","         *","         * @method _doTransition","         * @param node {Node} node to do transition","         * @param left {Number} css left in px","         * @param top {Number} css top in px","         * @param [done] {Function} If provided, call this function when transition done","         * @param bottom {Boolean} If true, use bottom attribute to do transition","         * @protected","         */","        _doTransition: function (node, left, top, done, bottom) {","            var that = this,","                tr = Y.merge(this.get('scTrans'), {left: left + 'px'});","","            tr[bottom ? 'bottom' : 'top'] = top + 'px';","","            Y.later(1, this, function () {","                node.transition(tr, function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            });","        },","","        /**","         * handle other Shortcut transition when show or hide","         *","         * @method _beforeShowHide","         * @protected","         */","        _beforeShowHide: function (E) {","            var show = E.newVal;","","            if (!current || !show || (current === this)) {","                return;","            }","","            next = this;","            E.halt(); ","            current.hide();","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doneShowHide","         * @protected","         */","        _doneShowHide: function () {","            var show = this.get('visible'),","                mask = this.get('mask');","","            if (mask) {","                this._displayMask(show);","            }","","            this.set('disabled', show ? false : true);","            this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);","","            if (next) {","                next.show();","                next = undefined;","            }","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doShowHide","         * @protected","         */","        _doShowHide: function (E) {","            var show = E.newVal,","                pageDir = show ? -1 : 0,","                posData = POSITIONS[this.get('showFrom')],","                node = this.get('boundingBox'),","                XY;","","            if (show) {","                this.enable();","                this._updateFullSize();","                this._updatePositionHide({visible: false});","                current = this;","            } else {","                this._updatePositionShow({visible: true});","                if (this.get('mask')) {","                    this._displayMask(false);","                }","                current = undefined;","            }","            this.set('zIndex', ShortCut.ZINDEX_HIDE);","","            XY = [pageDir * posData[0] * this.get('width'), pageDir * posData[1] * this.get('height')];","","            if (fixedPos && pageWidget.get('nativeScroll')) {","                pageWidget.each(function (O) {","                    if (O.get('headerFixed')) {","                        this._doTransition(O.get('headerNode'), XY[0], XY[1]);","                    }","                    if (O.get('footerFixed')) {","                        this._doTransition(O.get('footerNode'), XY[0], -XY[1], null, true);","                    }","                }, this);","            }","","            this._doTransition(pageNode, XY[0], XY[1], this._doneShowHide);","","            if (this.get('action') !== 'unveil') {","                XY = this.getShowHidePosition(show);","                this._doTransition(node, XY[0], XY[1]);","            }","        }","    }, {","        /**","         * Static property used to define the default attribute configuration.","         *","         * @property ATTRS","         * @protected","         * @type Object","         * @static","         */","        ATTRS: {","            /**","             * The animation action of the shortcut. Should be one of: 'push', 'unveil' .","             *","             * @attribute action","             * @type String","             * @default unveil","             */","            action: {","                value: 'unveil',","                lazyAdd: false,","                validator: function (V) {","                    return TRANSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    if (V !== this.get('action')) {","                        this._updatePositionShow({action: V});","                    }","                    return V;","                }","            },","","            /**","             * The shortcut show direction. Should be one of:","             * <dl>","             *  <dt>top</dt><dd>top</dd>","             *  <dt>left</dt><dd>left</dd>","             *  <dt>right</dt><dd>right</dd>","             *  <dt>bottom</dt><dd>bottom</dd>","             * </dl>","             *","             * @attribute showFrom","             * @type String","             * @default left","             */","            showFrom: {","                value: 'left',","                lazyAdd: false,","                validator: function (V) {","                    return POSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    var F,","                        B = this.get('contentBox'), ","                        fwh = POSITIONS[V][0];","","                    if (V === this.get('showFrom')) {","                        return V;","                    }","","                    this._updatePositionShow({showFrom: V});","","                    F = B.getData('full-height');","                    if (FULLWH[F]) {","                        this.set('fullHeight', F === 'true');","                    } else {","                        this.set('fullHeight', (fwh !== 0) ? true : false);","                    }","","                    F = B.getData('full-width');","                    if (FULLWH[F]) {","                        this.set('fullWidth', F === 'true');","                    } else {","                        this.set('fullWidth', fwh === 0);","                    }","","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to display mask or not.","             *","             * @attribute mask","             * @type Boolean","             * @default true","             */","            mask: {","                value: true,","                validator: Y.Lang.isBoolean,","                setter: function (V) {","                    if (this.get('visible')) {","                        this._displayMask(V);","                    }","","                    return V;","                }","            },","","            /**","             * Default transition setting for ShortCut","             *","             * @attribute transition","             * @type Object","             * @default {dutation: 0.5}","             */","            scTrans: {","                value: {","                    duration: 0.5","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from left or right.","             *","             * @attribute fullHeight","             * @type Boolean","             * @default true","             */","            fullHeight: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from top or bottom.","             *","             * @attribute fullWidth","             * @type Boolean","             * @default true","             */","            fullWidth: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            }","        },","","        /**","         * Static property used to define the default HTML parsing rules","         *","         * @property HTML_PARSER","         * @protected","         * @static","         * @type Object","         */","        HTML_PARSER: {","            mask: function (srcNode) {","                return (srcNode.getData('mask') === 'false') ? false : true;","            },","","            action: function (srcNode) {","                return srcNode.getData('action');","            },","","            showFrom: function (srcNode) {","                return srcNode.getData('show-from');","            },","","            scTrans: function (srcNode) {","                try {","                    return Y.JSON.parse(srcNode.getData('cfg-sc-trans'));","                } catch (e) {","                }","            }","        },","","        /**","         * Default zindex for Page","         *","         * @property ZINDEX_PAGE","         * @static","         * @type Number","         * @default 100","         */","        ZINDEX_PAGE: 100,","","        /**","         * Default zindex for visible ShortCut","         *","         * @property ZINDEX_SHOW","         * @static","         * @type Number","         * @default 200","         */","        ZINDEX_SHOW: 200,","","        /**","         * Default zindex for hidden ShortCut","         *","         * @property ZINDEX_HIDE","         * @static","         * @type Number","         * @default 10","         */","        ZINDEX_HIDE: 10,","","        /**","         * Get all instances of ShortCut","         *","         * @method getInstances","         * @static","         * @return {Array} all instances of ShortCut","         */","        getInstances: function () {","            return instances;","        },","","        /**","         * Get current visilbe ShortCut","         *","         * @method getCurrent","         * @static","         * @return {Object | undefined} current visible ShortCut. If no any visible ShortCut, return undefined.","         */","        getCurrent: function () {","            return current;","        }","    });","","Y.Bottle.ShortCut = ShortCut;","","// hide shortcut when click mask","Mask.on(hasTouch ? 'gesturemoveend' : 'click', function () {","    current.hide();","});","","// disable scroll on mask","Mask.on('gesturemovestart', function (E) {","    E.preventDefault();","});","","","}, '@VERSION@' ,{requires:['gallery-bt-page']});"];
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].lines = {"1":0,"8":0,"60":0,"61":0,"62":0,"63":0,"64":0,"68":0,"77":0,"84":0,"86":0,"87":0,"91":0,"92":0,"96":0,"107":0,"108":0,"111":0,"112":0,"115":0,"116":0,"119":0,"120":0,"130":0,"131":0,"134":0,"135":0,"146":0,"149":0,"162":0,"168":0,"169":0,"172":0,"173":0,"176":0,"181":0,"182":0,"192":0,"196":0,"207":0,"222":0,"225":0,"227":0,"228":0,"229":0,"230":0,"243":0,"245":0,"246":0,"249":0,"250":0,"251":0,"261":0,"264":0,"265":0,"268":0,"269":0,"271":0,"272":0,"273":0,"284":0,"290":0,"291":0,"292":0,"293":0,"294":0,"296":0,"297":0,"298":0,"300":0,"302":0,"304":0,"306":0,"307":0,"308":0,"309":0,"311":0,"312":0,"317":0,"319":0,"320":0,"321":0,"345":0,"348":0,"349":0,"351":0,"372":0,"375":0,"379":0,"380":0,"383":0,"385":0,"386":0,"387":0,"389":0,"392":0,"393":0,"394":0,"396":0,"399":0,"414":0,"415":0,"418":0,"446":0,"447":0,"449":0,"464":0,"465":0,"467":0,"482":0,"486":0,"490":0,"494":0,"495":0,"539":0,"550":0,"554":0,"557":0,"558":0,"562":0,"563":0};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].functions = {"initializer:59":0,"destructor:90":0,"renderUI:95":0,"scResize:105":0,"_updateFullSize:129":0,"getShowHidePosition:145":0,"_updatePositionShow:161":0,"_updatePositionHide:191":0,"_displayMask:206":0,"(anonymous 3):228":0,"(anonymous 2):227":0,"_doTransition:221":0,"_beforeShowHide:242":0,"_doneShowHide:260":0,"(anonymous 4):307":0,"_doShowHide:283":0,"validator:344":0,"setter:347":0,"validator:371":0,"setter:374":0,"setter:413":0,"setter:445":0,"setter:463":0,"mask:481":0,"action:485":0,"showFrom:489":0,"scTrans:493":0,"getInstances:538":0,"getCurrent:549":0,"(anonymous 5):557":0,"(anonymous 6):562":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].coveredLines = 121;
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].coveredFunctions = 32;
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 1);
YUI.add('gallery-bt-shortcut', function(Y) {

/**
 * This module provides ShortCut Widget which can show/hide with different transitions or directions.
 *
 * @module gallery-bt-shortcut
 */
_yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 8);
var body = Y.one('body'),
    Mask = Y.one('.bt-shortcut-mask') || body.appendChild(Y.Node.create('<div class="bt-shortcut-mask"></div>')),
    WIDTH_CHANGE = 'widthChange',
    HEIGHT_CHANGE = 'heightChange',
    VISIBLE_CHANGE = 'visibleChange',

    hasTouch = Y.Bottle.Device.getTouchSupport(),
    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),

    scrollBase = hasTouch ? body : Y.one('html'),
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
        top: [0, -1, 0.5, 0],
        bottom: [0, 1, 0.5, 1],
        left: [-1, 0, 0, 0.5],
        right: [1, 0, 1, 0.5]
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
     * @uses Bottle.PushPop
     * @constructor
     */
    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {
        initializer: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "initializer", 59);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 60);
if (!pageWidget) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 61);
pageWidget = Y.Bottle.Page.getCurrent();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 62);
if (pageWidget) {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 63);
pageNode = pageWidget.get('boundingBox');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 64);
pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);
                }
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 68);
instances.push(this);

            /**
             * internal eventhandlers, keep for destructor
             *
             * @property _bscEventHandlers
             * @type EventHandle
             * @private
             */
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 77);
this._bscEventHandlers = new Y.EventHandle([
                this.after(WIDTH_CHANGE, this._updatePositionShow),
                this.after(HEIGHT_CHANGE, this._updatePositionShow),
                this.before(VISIBLE_CHANGE, this._beforeShowHide),
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 84);
this.get('contentBox').setStyle('display', 'block');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 86);
this._updatePositionHide();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 87);
this._updatePositionShow();
        },

        destructor: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "destructor", 90);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 91);
this._bscEventHandlers.detach();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 92);
delete this._bscEventHandlers;
        },

        renderUI: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "renderUI", 95);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 96);
this.syncWH();
        },

        /**
         * Resize the ShortCut to adapt the browser width and height.
         *
         * @method scResize
         * @param [force=false] {Boolean} <b>true</b> to forece resize even when ShortCut is not visibile.
         */
        scResize: function (force) {
            //reduce syncUI times
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scResize", 105);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 107);
if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 108);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 111);
if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 112);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 115);
if (!this.get('visible') && !force) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 116);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 119);
this._updateFullSize();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 120);
this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updateFullSize", 129);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 130);
if (this.get('fullHeight')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 131);
this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 134);
if (this.get('fullWidth')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 135);
this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
            }
        },


        /**
         * get show or hide position of shortcut
         *
         * @method getshowHidePosition
         */
        getShowHidePosition: function (show) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getShowHidePosition", 145);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 146);
var selfDir = show ? 0 : 1,
                posData = POSITIONS[this.get('showFrom')];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 149);
return [
                Math.floor(posData[2] * Y.Bottle.Device.getBrowserWidth() + (selfDir * posData[0] - posData[2]) * this.get('width')), 
                Math.floor(posData[3] * Y.Bottle.Device.getBrowserHeight() + (selfDir * posData[1] - posData[3]) * this.get('height')) + scrollBase.get('scrollTop')
            ];
        },

        /**
         * Update showed ShortCut position based on action and showFrom
         *
         * @method _updatePositionShow
         * @protected
         */
        _updatePositionShow: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionShow", 161);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 162);
var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos],
                XY;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 168);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 169);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 172);
if (noAlign) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 173);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 176);
pageNode.setStyles({
                left: -posData[0] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',
                top: -posData[1] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'
            });

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 181);
XY = this.getShowHidePosition(true);
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 182);
this.move(XY[0], XY[1]);
        },

        /**
         * move the ShortCut to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionHide", 191);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 192);
var isUnveil = (this.get('action') === 'unveil'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                XY = this.getShowHidePosition(vis || isUnveil);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 196);
this.move(XY[0], XY[1]);
        },

        /**
         * Show or hide the mask.
         *
         * @method _displayMask
         * @param show {Boolean} true to display, false to hide.
         * @protected
         */
        _displayMask: function (show) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_displayMask", 206);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 207);
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
         * @param bottom {Boolean} If true, use bottom attribute to do transition
         * @protected
         */
        _doTransition: function (node, left, top, done, bottom) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doTransition", 221);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 222);
var that = this,
                tr = Y.merge(this.get('scTrans'), {left: left + 'px'});

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 225);
tr[bottom ? 'bottom' : 'top'] = top + 'px';

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 227);
Y.later(1, this, function () {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 2)", 227);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 228);
node.transition(tr, function () {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 3)", 228);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 229);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 230);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_beforeShowHide", 242);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 243);
var show = E.newVal;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 245);
if (!current || !show || (current === this)) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 246);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 249);
next = this;
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 250);
E.halt(); 
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 251);
current.hide();
        },

        /**
         * handle Shortcut transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doneShowHide", 260);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 261);
var show = this.get('visible'),
                mask = this.get('mask');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 264);
if (mask) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 265);
this._displayMask(show);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 268);
this.set('disabled', show ? false : true);
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 269);
this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 271);
if (next) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 272);
next.show();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 273);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doShowHide", 283);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 284);
var show = E.newVal,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox'),
                XY;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 290);
if (show) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 291);
this.enable();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 292);
this._updateFullSize();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 293);
this._updatePositionHide({visible: false});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 294);
current = this;
            } else {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 296);
this._updatePositionShow({visible: true});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 297);
if (this.get('mask')) {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 298);
this._displayMask(false);
                }
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 300);
current = undefined;
            }
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 302);
this.set('zIndex', ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 304);
XY = [pageDir * posData[0] * this.get('width'), pageDir * posData[1] * this.get('height')];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 306);
if (fixedPos && pageWidget.get('nativeScroll')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 307);
pageWidget.each(function (O) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 4)", 307);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 308);
if (O.get('headerFixed')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 309);
this._doTransition(O.get('headerNode'), XY[0], XY[1]);
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 311);
if (O.get('footerFixed')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 312);
this._doTransition(O.get('footerNode'), XY[0], -XY[1], null, true);
                    }
                }, this);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 317);
this._doTransition(pageNode, XY[0], XY[1], this._doneShowHide);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 319);
if (this.get('action') !== 'unveil') {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 320);
XY = this.getShowHidePosition(show);
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 321);
this._doTransition(node, XY[0], XY[1]);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 344);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 345);
return TRANSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 347);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 348);
if (V !== this.get('action')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 349);
this._updatePositionShow({action: V});
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 351);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 371);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 372);
return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 374);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 375);
var F,
                        B = this.get('contentBox'), 
                        fwh = POSITIONS[V][0];

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 379);
if (V === this.get('showFrom')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 380);
return V;
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 383);
this._updatePositionShow({showFrom: V});

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 385);
F = B.getData('full-height');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 386);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 387);
this.set('fullHeight', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 389);
this.set('fullHeight', (fwh !== 0) ? true : false);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 392);
F = B.getData('full-width');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 393);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 394);
this.set('fullWidth', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 396);
this.set('fullWidth', fwh === 0);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 399);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 413);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 414);
if (this.get('visible')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 415);
this._displayMask(V);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 418);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 445);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 446);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 447);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 449);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 463);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 464);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 465);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 467);
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
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "mask", 481);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 482);
return (srcNode.getData('mask') === 'false') ? false : true;
            },

            action: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "action", 485);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 486);
return srcNode.getData('action');
            },

            showFrom: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "showFrom", 489);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 490);
return srcNode.getData('show-from');
            },

            scTrans: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scTrans", 493);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 494);
try {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 495);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getInstances", 538);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 539);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getCurrent", 549);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 550);
return current;
        }
    });

_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 554);
Y.Bottle.ShortCut = ShortCut;

// hide shortcut when click mask
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 557);
Mask.on(hasTouch ? 'gesturemoveend' : 'click', function () {
    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 5)", 557);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 558);
current.hide();
});

// disable scroll on mask
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 562);
Mask.on('gesturemovestart', function (E) {
    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 6)", 562);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 563);
E.preventDefault();
});


}, '@VERSION@' ,{requires:['gallery-bt-page']});
