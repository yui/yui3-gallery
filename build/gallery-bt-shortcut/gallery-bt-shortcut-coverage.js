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
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].code=["YUI.add('gallery-bt-shortcut', function(Y) {","","/**"," * This module provides ShortCut Widget which can show/hide with different transitions or directions."," *"," * @module gallery-bt-shortcut"," */","var body = Y.one('body'),","    Mask = Y.one('.bt-shortcut-mask') || body.appendChild(Y.Node.create('<div class=\"bt-shortcut-mask\"></div>')),","    WIDTH_CHANGE = 'widthChange',","    HEIGHT_CHANGE = 'heightChange',","    VISIBLE_CHANGE = 'visibleChange',","","    pageWidget,","    pageNode,","","    instances = [],","    current,","    next,","","    TRANSITIONS = {","        unveil: 1,","        push: 1","    },","","    POSITIONS = {","        top: ['tc', 0, -1, 'bc', 0.5, 0],","        bottom: ['bc', 0, 1, 'tc', 0.5, 1],","        left: ['lc', -1, 0, 'rc', 0, 0.5],","        right: ['rc', 1, 0, 'lc', 1, 0.5]","    },","","    FULLWH = {","        'true': 1,","        'false': 1","    },","","    /**","     * A basic ShortCut widget which support three types of animation. Use","     * show and hide function to display ShortCut. Only one ShortCut will show","     * in the same time.","     *","     * @class ShortCut","     * @param [config] {Object} Object literal with initial attribute values","     * @extends Widget","     * @namespace Bottle","     * @uses WidgetParent","     * @uses WidgetPosition","     * @uses WidgetStack","     * @uses WidgetPositionAlign","     * @uses Bottle.PushPop","     * @constructor","     */","    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {","        initializer: function () {","            if (!pageWidget) {","                pageWidget = Y.Bottle.Page.getCurrent();","                if (pageWidget) {","                    pageNode = pageWidget.get('boundingBox');","                    pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);","                }","            }","","            instances.push(this);","","            /**","             * internal eventhandlers, keep for destructor","             *","             * @property _bscEventHandlers","             * @type EventHandle","             * @private","             */","            this._bscEventHandlers = new Y.EventHandle([","                this.after(WIDTH_CHANGE, this._updatePositionShow),","                this.after(HEIGHT_CHANGE, this._updatePositionShow),","                this.before(VISIBLE_CHANGE, this._beforeShowHide),","                this.after(VISIBLE_CHANGE, this._doShowHide)","            ]);","","            this.get('contentBox').setStyle('display', 'block');","","            this._updatePositionHide();","            this._updatePositionShow();","        },","","        destructor: function () {","            this._bscEventHandlers.detach();","            delete this._bscEventHandlers;","        },","","        renderUI: function () {","            var O = this.get('boundingBox'),","                P = this.get('contentBox'),","                W = O.get('offsetWidth') || P.get('offsetWidth'),","                H = O.get('offsetHeight') || P.get('offsetHeight');","","            if (!this.get('height') && H) {","                this.set('height', H);","            }","","            if (!this.get('width') && W) {","                this.set('width', W);","            }","        },","","        /**","         * Resize the ShortCut to adapt the browser width and height.","         *","         * @method scResize","         * @param [force=false] {Boolean} <b>true</b> to forece resize even when ShortCut is not visibile.","         */","        scResize: function (force) {","            //reduce syncUI times","            if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {","                return;","            }","","            if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {","                return;","            }","","            if (!this.get('visible') && !force) {","                return;","            }","","            this._updateFullSize();","            this._updatePositionShow();","        },","","        /**","         * handle child full Height or width","         *","         * @method _updateFullSize","         * @protected","         */","        _updateFullSize: function () {","            if (this.get('fullHeight')) {","                this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});","            }","","            if (this.get('fullWidth')) {","                this.set('width', Y.Bottle.Device.getBrowserWidth(), {noAlign: true});","            }","        },","","        /**","         * Update showed ShortCut position based on action and showFrom","         *","         * @method _updatePositionShow","         * @protected","         */","        _updatePositionShow: function (E) {","            var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                noAlign = (E && E.noAlign) ? true : false,","                posData = POSITIONS[pos];","","            if (!vis) {","                return;","            }","","            if (noAlign) {","                return;","            }","","            pageNode.setStyles({","                left: -posData[1] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',","                top: -posData[2] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'","            });","","            this.align(pageNode, [posData[3], posData[0]]);","        },","","        /**","         * move the ShortCut to hidden place","         *","         * @method _updatePositionHide","         * @protected","         */","        _updatePositionHide: function (E) {","            var isUnveil = (this.get('action') === 'unveil'),","                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),","                posData = POSITIONS[this.get('showFrom')];","","            if (!vis) {","                this.align(body, [isUnveil ? posData[0] : posData[3], posData[0]]);","            }","        },","","        /**","         * Show or hide the mask.","         *","         * @method _displayMask","         * @param show {Boolean} true to display, false to hide.","         * @protected","         */","        _displayMask: function (show) {","            Mask.setStyle('display', show ? 'block' : 'none');","        },","","        /**","         * do transition on a node with top and left css properties","         *","         * @method _doTransition","         * @param node {Node} node to do transition","         * @param left {Number} css left in px","         * @param top {Number} css top in px","         * @param [done] {Function} If provided, call this function when transition done","         * @protected","         */","        _doTransition: function (node, left, top, done) {","            var that = this;","","            Y.later(1, this, function () {","                node.transition(Y.merge(this.get('scTrans'), {","                    left: left + 'px',","                    top: top + 'px'","                }), function () {","                    if (done) {","                        done.apply(that);","                    }","                });","            });","        },","","        /**","         * handle other Shortcut transition when show or hide","         *","         * @method _beforeShowHide","         * @protected","         */","        _beforeShowHide: function (E) {","            var show = E.newVal;","","            if (!current || !show || (current === this)) {","                return;","            }","","            next = this;","            E.halt(); ","            current.hide();","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doneShowHide","         * @protected","         */","        _doneShowHide: function () {","            var show = this.get('visible'),","                mask = this.get('mask');","","            if (mask) {","                this._displayMask(show);","            }","","            this.set('disabled', show ? false : true);","            this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);","","            if (next) {","                next.show();","                next = undefined;","            }","        },","","        /**","         * handle Shortcut transition when show or hide","         *","         * @method _doShowHide","         * @protected","         */","        _doShowHide: function (E) {","            var show = E.newVal,","                selfDir = show ? 0 : 1,","                pageDir = show ? -1 : 0,","                posData = POSITIONS[this.get('showFrom')],","                node = this.get('boundingBox');","","            if (show) {","                this.enable();","                this._updateFullSize();","                this._updatePositionHide({visible: false});","                current = this;","            } else {","                this._updatePositionShow({visible: true});","                if (this.get('mask')) {","                    this._displayMask(false);","                }","                current = undefined;","            }","            this.set('zIndex', ShortCut.ZINDEX_HIDE);","","            this._doTransition(pageNode, pageDir * posData[1] * this.get('width'), pageDir * posData[2] * this.get('height'), this._doneShowHide);","","            if (this.get('action') !== 'unveil') {","                this._doTransition(node, posData[4] * pageNode.get('offsetWidth') + (selfDir * posData[1] - posData[4]) * this.get('width'), posData[5] * pageNode.get('offsetHeight') + (selfDir * posData[2] - posData[5]) * this.get('height'));","            }","        }","    }, {","        /**","         * Static property used to define the default attribute configuration.","         *","         * @property ATTRS","         * @protected","         * @type Object","         * @static","         */","        ATTRS: {","            /**","             * The animation action of the shortcut. Should be one of: 'push', 'unveil' .","             *","             * @attribute action","             * @type String","             * @default unveil","             */","            action: {","                value: 'unveil',","                lazyAdd: false,","                validator: function (V) {","                    return TRANSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    if (V !== this.get('action')) {","                        this._updatePositionShow({action: V});","                    }","                    return V;","                }","            },","","            /**","             * The shortcut show direction. Should be one of:","             * <dl>","             *  <dt>top</dt><dd>top</dd>","             *  <dt>left</dt><dd>left</dd>","             *  <dt>right</dt><dd>right</dd>","             *  <dt>bottom</dt><dd>bottom</dd>","             * </dl>","             *","             * @attribute showFrom","             * @type String","             * @default left","             */","            showFrom: {","                value: 'left',","                lazyAdd: false,","                validator: function (V) {","                    return POSITIONS[V] ? true : false;","                },","                setter: function (V) {","                    var F,","                        B = this.get('contentBox'), ","                        fwh = POSITIONS[V][1];","","                    if (V === this.get('showFrom')) {","                        return V;","                    }","","                    this._updatePositionShow({showFrom: V});","","                    F = B.getData('full-height');","                    if (FULLWH[F]) {","                        this.set('fullHeight', F === 'true');","                    } else {","                        this.set('fullHeight', (fwh !== 0) ? true : false);","                    }","","                    F = B.getData('full-width');","                    if (FULLWH[F]) {","                        this.set('fullWidth', F === 'true');","                    } else {","                        this.set('fullWidth', fwh === 0);","                    }","","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to display mask or not.","             *","             * @attribute mask","             * @type Boolean","             * @default true","             */","            mask: {","                value: true,","                validator: Y.Lang.isBoolean,","                setter: function (V) {","                    if (this.get('visible')) {","                        this._displayMask(V);","                    }","","                    return V;","                }","            },","","            /**","             * Default transition setting for ShortCut","             *","             * @attribute transition","             * @type Object","             * @default {dutation: 0.5}","             */","            scTrans: {","                value: {","                    duration: 0.5","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from left or right.","             *","             * @attribute fullHeight","             * @type Boolean","             * @default true","             */","            fullHeight: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            },","","            /**","             * Boolean indicating if ShortCut needs to adjusting height to match viewport when it shows from top or bottom.","             *","             * @attribute fullWidth","             * @type Boolean","             * @default true","             */","            fullWidth: {","                validator: Y.Lang.isBoolean,","                lazyAdd: false,","                setter: function (V) {","                    if (V) {","                        this.scResize();","                    }","                    return V;","                }","            }","        },","","        /**","         * Static property used to define the default HTML parsing rules","         *","         * @property HTML_PARSER","         * @protected","         * @static","         * @type Object","         */","        HTML_PARSER: {","            mask: function (srcNode) {","                if (srcNode.getData('mask') === 'false') {","                    return false;","                }","                return true;","            },","","            action: function (srcNode) {","                return srcNode.getData('action');","            },","","            showFrom: function (srcNode) {","                return srcNode.getData('show-from');","            },","","            scTrans: function (srcNode) {","                try {","                    return Y.JSON.parse(srcNode.getData('cfg-sc-trans'));","                } catch (e) {","                }","            }","        },","","        /**","         * Default zindex for Page","         *","         * @property ZINDEX_PAGE","         * @static","         * @type Number","         * @default 100","         */","        ZINDEX_PAGE: 100,","","        /**","         * Default zindex for visible ShortCut","         *","         * @property ZINDEX_SHOW","         * @static","         * @type Number","         * @default 200","         */","        ZINDEX_SHOW: 200,","","        /**","         * Default zindex for hidden ShortCut","         *","         * @property ZINDEX_HIDE","         * @static","         * @type Number","         * @default 10","         */","        ZINDEX_HIDE: 10,","","        /**","         * Get all instances of ShortCut","         *","         * @method getInstances","         * @static","         * @return {Array} all instances of ShortCut","         */","        getInstances: function () {","            return instances;","        },","","        /**","         * Get current visilbe ShortCut","         *","         * @method getCurrent","         * @static","         * @return {Object | undefined} current visible ShortCut. If no any visible ShortCut, return undefined.","         */","        getCurrent: function () {","            return current;","        }","    });","","Y.Bottle.ShortCut = ShortCut;","","//create shortcut mask","Mask.on('click', function () {","    current.hide();","});","","","}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});"];
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].lines = {"1":0,"8":0,"56":0,"57":0,"58":0,"59":0,"60":0,"64":0,"73":0,"80":0,"82":0,"83":0,"87":0,"88":0,"92":0,"97":0,"98":0,"101":0,"102":0,"114":0,"115":0,"118":0,"119":0,"122":0,"123":0,"126":0,"127":0,"137":0,"138":0,"141":0,"142":0,"153":0,"158":0,"159":0,"162":0,"163":0,"166":0,"171":0,"181":0,"185":0,"186":0,"198":0,"212":0,"214":0,"215":0,"219":0,"220":0,"233":0,"235":0,"236":0,"239":0,"240":0,"241":0,"251":0,"254":0,"255":0,"258":0,"259":0,"261":0,"262":0,"263":0,"274":0,"280":0,"281":0,"282":0,"283":0,"284":0,"286":0,"287":0,"288":0,"290":0,"292":0,"294":0,"296":0,"297":0,"321":0,"324":0,"325":0,"327":0,"348":0,"351":0,"355":0,"356":0,"359":0,"361":0,"362":0,"363":0,"365":0,"368":0,"369":0,"370":0,"372":0,"375":0,"390":0,"391":0,"394":0,"422":0,"423":0,"425":0,"440":0,"441":0,"443":0,"458":0,"459":0,"461":0,"465":0,"469":0,"473":0,"474":0,"518":0,"529":0,"533":0,"536":0,"537":0};
_yuitest_coverage["/build/gallery-bt-shortcut/gallery-bt-shortcut.js"].functions = {"initializer:55":0,"destructor:86":0,"renderUI:91":0,"scResize:112":0,"_updateFullSize:136":0,"_updatePositionShow:152":0,"_updatePositionHide:180":0,"_displayMask:197":0,"(anonymous 3):218":0,"(anonymous 2):214":0,"_doTransition:211":0,"_beforeShowHide:232":0,"_doneShowHide:250":0,"_doShowHide:273":0,"validator:320":0,"setter:323":0,"validator:347":0,"setter:350":0,"setter:389":0,"setter:421":0,"setter:439":0,"mask:457":0,"action:464":0,"showFrom:468":0,"scTrans:472":0,"getInstances:517":0,"getCurrent:528":0,"(anonymous 4):536":0,"(anonymous 1):1":0};
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
var body = Y.one('body'),
    Mask = Y.one('.bt-shortcut-mask') || body.appendChild(Y.Node.create('<div class="bt-shortcut-mask"></div>')),
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
     * @uses Bottle.PushPop
     * @constructor
     */
    ShortCut = Y.Base.create('btshortcut', Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.Bottle.PushPop], {
        initializer: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "initializer", 55);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 56);
if (!pageWidget) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 57);
pageWidget = Y.Bottle.Page.getCurrent();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 58);
if (pageWidget) {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 59);
pageNode = pageWidget.get('boundingBox');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 60);
pageWidget.set('zIndex', ShortCut.ZINDEX_PAGE);
                }
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 64);
instances.push(this);

            /**
             * internal eventhandlers, keep for destructor
             *
             * @property _bscEventHandlers
             * @type EventHandle
             * @private
             */
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 73);
this._bscEventHandlers = new Y.EventHandle([
                this.after(WIDTH_CHANGE, this._updatePositionShow),
                this.after(HEIGHT_CHANGE, this._updatePositionShow),
                this.before(VISIBLE_CHANGE, this._beforeShowHide),
                this.after(VISIBLE_CHANGE, this._doShowHide)
            ]);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 80);
this.get('contentBox').setStyle('display', 'block');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 82);
this._updatePositionHide();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 83);
this._updatePositionShow();
        },

        destructor: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "destructor", 86);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 87);
this._bscEventHandlers.detach();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 88);
delete this._bscEventHandlers;
        },

        renderUI: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "renderUI", 91);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 92);
var O = this.get('boundingBox'),
                P = this.get('contentBox'),
                W = O.get('offsetWidth') || P.get('offsetWidth'),
                H = O.get('offsetHeight') || P.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 97);
if (!this.get('height') && H) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 98);
this.set('height', H);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 101);
if (!this.get('width') && W) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 102);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scResize", 112);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 114);
if (!force && (this.get('width') === Y.Bottle.Device.getBrowserWidth())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 115);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 118);
if (!force && (this.get('height') === Y.Bottle.Device.getBrowserHeight())) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 119);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 122);
if (!this.get('visible') && !force) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 123);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 126);
this._updateFullSize();
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 127);
this._updatePositionShow();
        },

        /**
         * handle child full Height or width
         *
         * @method _updateFullSize
         * @protected
         */
        _updateFullSize: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updateFullSize", 136);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 137);
if (this.get('fullHeight')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 138);
this.set('height', Y.Bottle.Device.getBrowserHeight(), {noAlign: true});
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 141);
if (this.get('fullWidth')) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 142);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionShow", 152);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 153);
var pos = (E && E.showFrom) ? E.showFrom : this.get('showFrom'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                noAlign = (E && E.noAlign) ? true : false,
                posData = POSITIONS[pos];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 158);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 159);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 162);
if (noAlign) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 163);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 166);
pageNode.setStyles({
                left: -posData[1] * ((E && (E.attrName === 'width')) ? E.newVal : this.get('width')) + 'px',
                top: -posData[2] * ((E && (E.attrName === 'height')) ? E.newVal : this.get('height')) + 'px'
            });

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 171);
this.align(pageNode, [posData[3], posData[0]]);
        },

        /**
         * move the ShortCut to hidden place
         *
         * @method _updatePositionHide
         * @protected
         */
        _updatePositionHide: function (E) {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_updatePositionHide", 180);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 181);
var isUnveil = (this.get('action') === 'unveil'),
                vis = (E && (E.visible !== undefined)) ? E.visible : this.get('visible'),
                posData = POSITIONS[this.get('showFrom')];

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 185);
if (!vis) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 186);
this.align(body, [isUnveil ? posData[0] : posData[3], posData[0]]);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_displayMask", 197);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 198);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doTransition", 211);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 212);
var that = this;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 214);
Y.later(1, this, function () {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 2)", 214);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 215);
node.transition(Y.merge(this.get('scTrans'), {
                    left: left + 'px',
                    top: top + 'px'
                }), function () {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 3)", 218);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 219);
if (done) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 220);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_beforeShowHide", 232);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 233);
var show = E.newVal;

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 235);
if (!current || !show || (current === this)) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 236);
return;
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 239);
next = this;
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 240);
E.halt(); 
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 241);
current.hide();
        },

        /**
         * handle Shortcut transition when show or hide
         *
         * @method _doneShowHide
         * @protected
         */
        _doneShowHide: function () {
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doneShowHide", 250);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 251);
var show = this.get('visible'),
                mask = this.get('mask');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 254);
if (mask) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 255);
this._displayMask(show);
            }

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 258);
this.set('disabled', show ? false : true);
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 259);
this.set('zIndex', show ? ShortCut.ZINDEX_SHOW : ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 261);
if (next) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 262);
next.show();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 263);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "_doShowHide", 273);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 274);
var show = E.newVal,
                selfDir = show ? 0 : 1,
                pageDir = show ? -1 : 0,
                posData = POSITIONS[this.get('showFrom')],
                node = this.get('boundingBox');

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 280);
if (show) {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 281);
this.enable();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 282);
this._updateFullSize();
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 283);
this._updatePositionHide({visible: false});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 284);
current = this;
            } else {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 286);
this._updatePositionShow({visible: true});
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 287);
if (this.get('mask')) {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 288);
this._displayMask(false);
                }
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 290);
current = undefined;
            }
            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 292);
this.set('zIndex', ShortCut.ZINDEX_HIDE);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 294);
this._doTransition(pageNode, pageDir * posData[1] * this.get('width'), pageDir * posData[2] * this.get('height'), this._doneShowHide);

            _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 296);
if (this.get('action') !== 'unveil') {
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 297);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 320);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 321);
return TRANSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 323);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 324);
if (V !== this.get('action')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 325);
this._updatePositionShow({action: V});
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 327);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "validator", 347);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 348);
return POSITIONS[V] ? true : false;
                },
                setter: function (V) {
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 350);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 351);
var F,
                        B = this.get('contentBox'), 
                        fwh = POSITIONS[V][1];

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 355);
if (V === this.get('showFrom')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 356);
return V;
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 359);
this._updatePositionShow({showFrom: V});

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 361);
F = B.getData('full-height');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 362);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 363);
this.set('fullHeight', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 365);
this.set('fullHeight', (fwh !== 0) ? true : false);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 368);
F = B.getData('full-width');
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 369);
if (FULLWH[F]) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 370);
this.set('fullWidth', F === 'true');
                    } else {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 372);
this.set('fullWidth', fwh === 0);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 375);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 389);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 390);
if (this.get('visible')) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 391);
this._displayMask(V);
                    }

                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 394);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 421);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 422);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 423);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 425);
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
                    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "setter", 439);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 440);
if (V) {
                        _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 441);
this.scResize();
                    }
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 443);
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
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "mask", 457);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 458);
if (srcNode.getData('mask') === 'false') {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 459);
return false;
                }
                _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 461);
return true;
            },

            action: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "action", 464);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 465);
return srcNode.getData('action');
            },

            showFrom: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "showFrom", 468);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 469);
return srcNode.getData('show-from');
            },

            scTrans: function (srcNode) {
                _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "scTrans", 472);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 473);
try {
                    _yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 474);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getInstances", 517);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 518);
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
            _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "getCurrent", 528);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 529);
return current;
        }
    });

_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 533);
Y.Bottle.ShortCut = ShortCut;

//create shortcut mask
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 536);
Mask.on('click', function () {
    _yuitest_coverfunc("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", "(anonymous 4)", 536);
_yuitest_coverline("/build/gallery-bt-shortcut/gallery-bt-shortcut.js", 537);
current.hide();
});


}, '@VERSION@' ,{requires:['widget-position-align', 'gallery-bt-page']});
