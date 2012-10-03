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
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].code=["YUI.add('gallery-bt-shortcut', function(Y) {","","/**"," * This module provides ShortCut Widget which can show/hide with different transitions or directions."," *"," * @module gallery-bt-shortcut"," */","var body = Y.one('body'),","    Mask = Y.one('.bt-shortcut-mask') || body.appendChild(Y.Node.create('<div class=\"bt-shortcut-mask\"></div>')),","    WIDTH_CHANGE = 'widthChange',","    HEIGHT_CHANGE = 'heightChange',","    VISIBLE_CHANGE = 'visibleChange',","","    hasTouch = Y.Bottle.Device.getTouchSupport(),","    fixedPos = Y.Bottle.Device.getPositionFixedSupport(),","","    scrollBase = hasTouch ? body : Y.one('html'),","    pageWidget,","    pageNode,","","    instances = [],","    current,","    next,","","    TRANSITIONS = {","        unveil: 1,","        push: 1","    },","","    POSITIONS = {","        top: [0, -1, 0.5, 0],","        bottom: [0, 1, 0.5, 1],","        left: [-1, 0, 0, 0.5],","        right: [1, 0, 1, 0.5]","    },","","    FULLWH = {","        'true': 1,","        'false': 1","    },","","    /**","     * A basic ShortCut widget which support three types of animation. Use","     * show and hide function to display ShortCut. Only one ShortCut will show","     * in the same time.","     *","     * @class ShortCut","     * @param [config] {Object} Object literal with initial attribute values","     * @extends Widget","     * @namespace Bottle","     * @uses WidgetParent","     * @uses WidgetPosition","     * @uses WidgetStack","     * @uses WidgetPositionAlign","     * @uses Bottle.PushPop","     * @constructor","     */","    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.Bottle.PushPop], {","        initializer: function () {","            if (!pageWidget) {","                pageWidget = Y.Bottle.Page.getCurrent();","                if (pageWidget) {","                    pageNode = pageWidget.get('boundingBox');","                    pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);","                }","            }","","            instances.push(this);","","            /**","             * internal eventhandlers, keep for destructor","             *","             * @property _bscEventHandlers","             * @type EventHandle","             * @private","             */","            this._bscEventHandlers = new Y.EventHandle([","                this.after(WIDTH_CHANGE, this._updatePositionShow),","                this.after(HEIGHT_CHANGE, this._updatePositionShow),","                this.before(VISIBLE_CHANGE, this._beforeShowHide),","                this.after(VISIBLE_CHANGE, this._doShowHide)","            ]);","","            this.get('contentBox').setStyle('display', 'block');","","            this._updatePositionHide();","            this._updatePositionShow();","        },","","        destructor: function () {","            this._bscEventHandlers.detach();","            delete this._bscEventHandlers;","        },","","        renderUI: function () {","            var O = this.get('boundingBox'),","                P = this.get('contentBox'),","                W = O.get('offsetWidth') || P.get('offsetWidth'),","                H = O.get('offsetHeight') || P.get('offsetHeight');","","            if (!this.get('height') && H) {","                this.set('height', H);","            }","","            if (!this.get('width') && W) {","                this.set('width', W);","            }","        },","","        /**","         * Resize the ShortCut to adapt the browser width and height.","         *","         * @method scResize","         * @param [force=false] {Boolean} <b>true</b> to forece resize even when ShortCut is not visibile.","         */","        scResize: function (force) {","            //reduce syncUI times","            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {","                return;","            }","","            if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {","                return;","            }","","            if (!this.get('visible') && !force) {","                return;","            }","","            this._updateFullSize();","            this._updatePositionShow();","        },","","        /**","         * handle child full Height or width","         *","         * @method _updateFullSize","         * @protected","         */","        _updateFullSize: function () {","            if (this.get('fullHeight')) {","                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});","            }","","            if (this.get('fullWidth')) {","                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});","            }","        },","","","        /**","         * get show or hide position of shortcut","         *","         * @method getshowHidePosition","         */","        getShowHidePosition: function (show) {","            var selfDir = show ? 0 : 1,","                posData = POSITIONS[this.get('showFrom')];","","            return [","                Math.floor(posData[2] * Y.Bottle.Device.getBrowserWidth() + (selfDir * posData[0] - posData[2]) * this.get('width')), ","                Math.floor(posData[3] * Y.Bottle.Device.getBrowserHeight() + (selfDir * posData[1] - posData[3]) * this.get('height')) + scrollBase.get('scrollTop')","            ];","        },","","        /**","         * Update showed ShortCut position based on action and showFrom","         *","         * @method _updatePositionShow","         * @protected","         */","        _updatePositionShow: function (E) {","            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                noAlign = (E && E.noAlign) ? true : false,","                posData = POSITIONS[pos],","                XY;","","            if (!vis) {","                return;","            }","","            if (noAlign) {","                return;","            }","","            pageNode.setStyles({","                left: -posData[0] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',","                top: -posData[1] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'","            });","","            XY = this.getShowHidePosition(true);","            this.move(XY[0], XY[1]);","        },","","        /**","         * move the ShortCut to hidden place","         *","         * @method _updatePositionHide","         * @protected","         */","        _updatePositionHide: function (E) {","            var isUnveil = (this.get('action') === 'unveil'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                XY = this.getShowHidePosition(vis || isUnveil);","","            this.move(XY[0], XY[1]);","        },","","        /**","         * Show or hide the mask.","         *","         * @method _displayMask","         * @param show {Boolean} true to display, false to hide.","         * @protected","         */","        _displayMask: function (show) {","            Mask.setStyle('display', show ? 'block' : 'none');","        },","","        /**","         * do transition on a node with top and left css properties","         *","         * @method _doTransition","         * @param node {Node} node to do transition","         * @param left {Number} css left in px","         * @param top {Number} css top in px","         * @param [done] {Function} If provided, call this function when transition done","         * @param bottom {Boolean} If true, use bottom attribute to do transition","         * @protected","         */","        _doTransition: function (node, left, top, done, bottom) {","            var that = this,","                tr = Y.merge(this.get('scTrans'), {left: left + 'px'});","","            tr[bottom ? 'bottom' : 'top'] = top + 'px';","","            Y.later(1, this, function () {","                node.transition(tr, function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            });","        },","","        /**","         * handle other Shortcut transition when show or hide","         *","         * @method _beforeShowHide","         * @protected","         */","        _beforeShowHide: function (E) {","            var show = E.newVal;","","            if (!current || !show || (current === this)) {","                return;","            }","","            next = this;","            E.halt(); ","            current.hide();","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doneShowHide","         * @protected","         */","        _doneShowHide: function () {","            var show = this.get('visible'),","                mask = this.get('mask');","","            if (mask) {","                this._displayMask(show);","            }","","            this.set('disabled', show ? false : true);","            this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);","","            if (next) {","                next.show();","                next = undefined;","            }","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doShowHide","         * @protected","         */","        _doShowHide: function (E) {","            var show = E.newVal,","                pageDir = show ? -1 : 0,","                posData = POSITIONS[this.get('showFrom')],","                node = this.get('boundingBox'),","                XY;","","            if (show) {","                this.enable();","                this._updateFullSize();","                this._updatePositionHide({visible: false});","                current = this;","            } else {","                this._updatePositionShow({visible: true});","                if (this.get('mask')) {","                    this._displayMask(false);","                }","                current = undefined;","            }","            this.set('zIndex', ShortCut.ZINDEX_HIDE);","","            XY = [pageDir * posData[0] * this.get('width'), pageDir * posData[1] * this.get('height')];","","            if (fixedPos && pageWidget.get('nativeScroll')) {","                pageWidget.each(function (O) {","                    if (O.get('headerFixed')) {","                        this._doTransition(O.get('headerNode'), XY[0], XY[1]);","                    }","                    if (O.get('footerFixed')) {","                        this._doTransition(O.get('footerNode'), XY[0], -XY[1], null, true);","                    }","                }, this);","            }","","            this._doTransition(pageNode, XY[0], XY[1], this._doneShowHide);","","            if (this.get('action') !== 'unveil') {","                XY = this.getShowHidePosition(show);","                this._doTransition(node, XY[0], XY[1]);","            }","        }","    }, {","        /**","         * Static property used to define the default attribute configuration.","         *","         * @property ATTRS","         * @protected","         * @type Object","         * @static","         */","        ATTRS: {","            /**","             * The animation action of the shortcut. Should be one of: 'push', 'unveil' .","             *","             * @attribute action","             * @type String","             * @default unveil","             */","            action: {","                value: 'unveil',","                lazyAdd: false,","                validator: function (V) {","                    return TRANSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    if (V !== this.get('action')) {","                        this._updatePositionShow({action: V});","                    }","                    return V;","                }","            },","","            /**","             * The shortcut show direction. Should be one of:","             * <dl>","             *  <dt>top</dt><dd>top</dd>","             *  <dt>left</dt><dd>left</dd>","             *  <dt>right</dt><dd>right</dd>","             *  <dt>bottom</dt><dd>bottom</dd>","             * </dl>","             *","             * @attribute showFrom","             * @type String","             * @default left","             */","            showFrom: {","                value: 'left',","                lazyAdd: false,","                validator: function (V) {","                    return POSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    var F,","                        B = this.get('contentBox'), ","                        fwh = POSITIONS[V][0];","","                    if (V === this.get('showFrom')) {","                        return V;","                    }","","                    this._updatePositionShow({showFrom: V});","","                    F = B.getData('full-height');","                    if (FULLWH[F]) {","                        this.set('fullHeight', F === 'true');","                    } else {","                        this.set('fullHeight', (fwh !== 0) ? true : false);","                    }","","                    F = B.getData('full-width');","                    if (FULLWH[F]) {","                        this.set('fullWidth', F === 'true');","                    } else {","                        this.set('fullWidth', fwh === 0);","                    }","","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to display mask or not.","             *","             * @attribute mask","             * @type Boolean","             * @default true","             */","            mask: {","                value: true,","                validator: Y.Lang.isBoolean,","                setter: function (V) {","                    if (this.get('visible')) {","                        this._displayMask(V);","                    }","","                    return V;","                }","            },","","            /**","             * Default transition setting for ShortCut","             *","             * @attribute transition","             * @type Object","             * @default {dutation: 0.5}","             */","            scTrans: {","                value: {","                    duration: 0.5","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from left or right.","             *","             * @attribute fullHeight","             * @type Boolean","             * @default true","             */","            fullHeight: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from top or bottom.","             *","             * @attribute fullWidth","             * @type Boolean","             * @default true","             */","            fullWidth: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            }","        },","","        /**","         * Static property used to define the default HTML parsing rules","         *","         * @property HTML_PARSER","         * @protected","         * @static","         * @type Object","         */","        HTML_PARSER: {","            mask: function (srcNode) {","                return (srcNode.getData('mask') === 'false') ? false : true;","            },","","            action: function (srcNode) {","                return srcNode.getData('action');","            },","","            showFrom: function (srcNode) {","                return srcNode.getData('show-from');","            },","","            scTrans: function (srcNode) {","                try {","                    return Y.JSON.parse(srcNode.getData('cfg-sc-trans'));","                } catch (e) {","                }","            }","        },","","        /**","         * Default zindex for Page","         *","         * @property ZINDEX_PAGE","         * @static","         * @type Number","         * @default 100","         */","        ZINDEX_PAGE: 100,","","        /**","         * Default zindex for visible ShortCut","         *","         * @property ZINDEX_SHOW","         * @static","         * @type Number","         * @default 200","         */","        ZINDEX_SHOW: 200,","","        /**","         * Default zindex for hidden ShortCut","         *","         * @property ZINDEX_HIDE","         * @static","         * @type Number","         * @default 10","         */","        ZINDEX_HIDE: 10,","","        /**","         * Get all instances of ShortCut","         *","         * @method getInstances","         * @static","         * @return {Array} all instances of ShortCut","         */","        getInstances: function () {","            return instances;","        },","","        /**","         * Get current visilbe ShortCut","         *","         * @method getCurrent","         * @static","         * @return {Object | undefined} current visible ShortCut. If no any visible ShortCut, return undefined.","         */","        getCurrent: function () {","            return current;","        }","    });","","Y.Bottle.ShortCut = ShortCut;","","// hide shortcut when click mask","Mask.on(hasTouch ? 'gesturemoveend' : 'click', function () {","    current.hide();","});","","// disable scroll on mask","Mask.on('gesturemovestart', function (E) {","    E.preventDefault();","});","","","}, '@VERSION@' ,{requires:['gallery-bt-page']});"];
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].lines = {"1":0,"8":0,"60":0,"61":0,"62":0,"63":0,"64":0,"68":0,"77":0,"84":0,"86":0,"87":0,"91":0,"92":0,"96":0,"101":0,"102":0,"105":0,"106":0,"118":0,"119":0,"122":0,"123":0,"126":0,"127":0,"130":0,"131":0,"141":0,"142":0,"145":0,"146":0,"157":0,"160":0,"173":0,"179":0,"180":0,"183":0,"184":0,"187":0,"192":0,"193":0,"203":0,"207":0,"218":0,"233":0,"236":0,"238":0,"239":0,"240":0,"241":0,"254":0,"256":0,"257":0,"260":0,"261":0,"262":0,"272":0,"275":0,"276":0,"279":0,"280":0,"282":0,"283":0,"284":0,"295":0,"301":0,"302":0,"303":0,"304":0,"305":0,"307":0,"308":0,"309":0,"311":0,"313":0,"315":0,"317":0,"318":0,"319":0,"320":0,"322":0,"323":0,"328":0,"330":0,"331":0,"332":0,"356":0,"359":0,"360":0,"362":0,"383":0,"386":0,"390":0,"391":0,"394":0,"396":0,"397":0,"398":0,"400":0,"403":0,"404":0,"405":0,"407":0,"410":0,"425":0,"426":0,"429":0,"457":0,"458":0,"460":0,"475":0,"476":0,"478":0,"493":0,"497":0,"501":0,"505":0,"506":0,"550":0,"561":0,"565":0,"568":0,"569":0,"573":0,"574":0};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].functions = {"initializer:59":0,"destructor:90":0,"renderUI:95":0,"scResize:116":0,"_updateFullSize:140":0,"getShowHidePosition:156":0,"_updatePositionShow:172":0,"_updatePositionHide:202":0,"_displayMask:217":0,"(anonymous 3):239":0,"(anonymous 2):238":0,"_doTransition:232":0,"_beforeShowHide:253":0,"_doneShowHide:271":0,"(anonymous 4):318":0,"_doShowHide:294":0,"validator:355":0,"setter:358":0,"validator:382":0,"setter:385":0,"setter:424":0,"setter:456":0,"setter:474":0,"mask:492":0,"action:496":0,"showFrom:500":0,"scTrans:504":0,"getInstances:549":0,"getCurrent:560":0,"(anonymous 5):568":0,"(anonymous 6):573":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].coveredLines = 125;
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
var O = this.get('boundingBox'),
                P = this.get('contentBox'),
                W = O.get('offsetWidth') || P.get('offsetWidth'),
                H = O.get('offsetHeight') || P.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 101);
if (!this.get('height') && H) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 102);
this.set('height', H);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 105);
if (!this.get('width') && W) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 106);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scResize", 116);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 118);
if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 119);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 122);
if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 123);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 126);
if (!this.get('visible') && !force) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 127);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 130);
this._updateFullSize();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 131);
this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updateFullSize", 140);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 141);
if (this.get('fullHeight')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 142);
this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 145);
if (this.get('fullWidth')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 146);
this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});
            }
        },


        /**
         * get show or hide position of shortcut
         *
         * @method getshowHidePosition
         */
        getShowHidePosition: function (show) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getShowHidePosition", 156);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 157);
var selfDir = show ? 0 : 1,
                posData = POSITIONS[this.get('showFrom')];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 160);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionShow", 172);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 173);
var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos],
                XY;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 179);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 180);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 183);
if (noAlign) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 184);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 187);
pageNode.setStyles({
                left: -posData[0] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',
                top: -posData[1] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'
            });

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 192);
XY = this.getShowHidePosition(true);
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 193);
this.move(XY[0], XY[1]);
        },

        /**
         * move the ShortCut to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionHide", 202);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 203);
var isUnveil = (this.get('action') === 'unveil'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                XY = this.getShowHidePosition(vis || isUnveil);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 207);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_displayMask", 217);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 218);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doTransition", 232);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 233);
var that = this,
                tr = Y.merge(this.get('scTrans'), {left: left + 'px'});

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 236);
tr[bottom ? 'bottom' : 'top'] = top + 'px';

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 238);
Y.later(1, this, function () {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 2)", 238);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 239);
node.transition(tr, function () {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 3)", 239);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 240);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 241);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_beforeShowHide", 253);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 254);
var show = E.newVal;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 256);
if (!current || !show || (current === this)) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 257);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 260);
next = this;
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 261);
E.halt(); 
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 262);
current.hide();
        },

        /**
         * handle Shortcut transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doneShowHide", 271);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 272);
var show = this.get('visible'),
                mask = this.get('mask');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 275);
if (mask) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 276);
this._displayMask(show);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 279);
this.set('disabled', show ? false : true);
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 280);
this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 282);
if (next) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 283);
next.show();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 284);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doShowHide", 294);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 295);
var show = E.newVal,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox'),
                XY;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 301);
if (show) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 302);
this.enable();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 303);
this._updateFullSize();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 304);
this._updatePositionHide({visible: false});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 305);
current = this;
            } else {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 307);
this._updatePositionShow({visible: true});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 308);
if (this.get('mask')) {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 309);
this._displayMask(false);
                }
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 311);
current = undefined;
            }
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 313);
this.set('zIndex', ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 315);
XY = [pageDir * posData[0] * this.get('width'), pageDir * posData[1] * this.get('height')];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 317);
if (fixedPos && pageWidget.get('nativeScroll')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 318);
pageWidget.each(function (O) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 4)", 318);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 319);
if (O.get('headerFixed')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 320);
this._doTransition(O.get('headerNode'), XY[0], XY[1]);
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 322);
if (O.get('footerFixed')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 323);
this._doTransition(O.get('footerNode'), XY[0], -XY[1], null, true);
                    }
                }, this);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 328);
this._doTransition(pageNode, XY[0], XY[1], this._doneShowHide);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 330);
if (this.get('action') !== 'unveil') {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 331);
XY = this.getShowHidePosition(show);
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 332);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 355);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 356);
return TRANSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 358);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 359);
if (V !== this.get('action')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 360);
this._updatePositionShow({action: V});
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 362);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 382);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 383);
return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 385);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 386);
var F,
                        B = this.get('contentBox'), 
                        fwh = POSITIONS[V][0];

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 390);
if (V === this.get('showFrom')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 391);
return V;
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 394);
this._updatePositionShow({showFrom: V});

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 396);
F = B.getData('full-height');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 397);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 398);
this.set('fullHeight', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 400);
this.set('fullHeight', (fwh !== 0) ? true : false);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 403);
F = B.getData('full-width');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 404);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 405);
this.set('fullWidth', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 407);
this.set('fullWidth', fwh === 0);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 410);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 424);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 425);
if (this.get('visible')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 426);
this._displayMask(V);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 429);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 456);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 457);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 458);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 460);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 474);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 475);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 476);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 478);
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
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "mask", 492);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 493);
return (srcNode.getData('mask') === 'false') ? false : true;
            },

            action: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "action", 496);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 497);
return srcNode.getData('action');
            },

            showFrom: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "showFrom", 500);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 501);
return srcNode.getData('show-from');
            },

            scTrans: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scTrans", 504);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 505);
try {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 506);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getInstances", 549);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 550);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getCurrent", 560);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 561);
return current;
        }
    });

_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 565);
Y.Bottle.ShortCut = ShortCut;

// hide shortcut when click mask
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 568);
Mask.on(hasTouch ? 'gesturemoveend' : 'click', function () {
    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 5)", 568);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 569);
current.hide();
});

// disable scroll on mask
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 573);
Mask.on('gesturemovestart', function (E) {
    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 6)", 573);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 574);
E.preventDefault();
});


}, '@VERSION@' ,{requires:['gallery-bt-page']});
