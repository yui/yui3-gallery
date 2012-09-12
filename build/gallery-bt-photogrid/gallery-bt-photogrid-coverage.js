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
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bt-photogrid/gallery-bt-photogrid.js",
    code: []
};
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].code=["YUI.add('gallery-bt-photogrid', function(Y) {","","/**"," * Provide PhotoGrid class to rendering a lot of photo in many kinds of layout"," *"," * @module gallery-bt-photogrid"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","    COLUMN_CHANGE = 'columnWidthChange',","    RENDER_FINISHED = 'renderFinished',","","    RENDER_INTERVAL = 100,","","    PREFIX = 'bpg_',","","    CLASSES = {","        COLUMN: PREFIX + 'column',","        MODULE: PREFIX + 'module'","    },","","    HTMLS = {","        COLUMN: '<div class=\"' + CLASSES.COLUMN + '\"></div>'","    },","","    GRID_CFGS = {","        vertical: 1,","        horizontal: 1","    },","","/**"," * PhotoGrid is a Widget which can help you to render a lot of photo in different patterns."," *"," * @class PhotoGrid"," * @constructor"," * @namespace Bottle"," * @extends Widget"," * @uses Bottle.SyncScroll"," * @param [config] {Object} Object literal with initial attribute values",""," */","PhotoGrid = Y.Base.create('btphotogrid', Y.Widget, [Y.Bottle.SyncScroll], {","    initializer: function () {","        this.parseImageData();","","        this.set('syncScrollMethod', this._updateColumns);","","        /**","         * Fired when all grid rendered","         *","         * @event renderFinished","         */","        this.publish(RENDER_FINISHED);","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bpgEventHandlers","         * @type EventHandle","         * @private","         */","        this._bpgEventHandlers = new Y.EventHandle([","            this.after(WIDTH_CHANGE, this._updateColumns),","            this.after(COLUMN_CHANGE, this._updateColumns)","        ]);","    },","","    destructor: function () {","        this._bpgEventHandlers.detach();","        delete this._bpgEventHandlers;","    },","","    renderUI: function () {","        this._updateColumns(true);","    },","","    /**","     * parse image data from a node","     *","     * @method parseImageData","     * @param [node] {Node} node to parse data. If omitted, Widget ContentBox will be used.","     * @param [append=false] {Boolean} <b>true</b> to append data. <b>false</b> or ommited to clean old image data.","     */","    parseImageData: function (node, append) {","        var images = append ? this._bpgImages : [],","            css = this.get('photoNode'),","            P = node || this.get('contentBox');","","        if (!append) {","            /**","             * internal unloaded image count","             *","             * @property _bpgPending","             * @type Number","             * @protected","             */","            this._bpgPending = 0;","        }","","        P.all(this.get('moduleNode')).each(function (O) {","            var image = {","                icon: O.getData('icon'),","                img: O.getData('img'),","                width: O.getData('width'),","                height: O.getData('height'),","                module: O.addClass(CLASSES.MODULE)","            },","            P = O.one(css);","","            if (!image.icon) {","                return;","            }","","            image.load = Y.Node.create('<img src=\"' + image.icon + '\" />');","","            if (P) {","                P.append(image.load);","            } else {","                O.insert(image.load, 0);","            }","","            if (!image.height || !image.width) {","                this._bpgPending += 1;","","                image.load.once('load', function (E) {","                    var O = E.target;","","                    this.height = O.get('height');","                    this.width = O.get('width');","","                    this._bpgPending -= 1;","                }, image);","            }","","            images.push(image);","        }, this);","","        /**","         * internal image meta data","         *","         * @property _bpgImages","         * @type Array","         * @protected","         */","        this._bpgImages = images;","    },","","    /**","     * Get the column with minimal height","     *","     * @method _minColumn","     * @protected","     */","    _minColumn: function () {","        var minI = 9999,","            minO;","","        this.get('contentBox').all('> div').each(function (O) {","            var H = O.get('offsetHeight');","","            if (H < minI) {","                minI = H;","                minO = O;","            }","        });","","        return minO;","    },","","    /**","     * rendering images","     *","     * @method renderImages","     */","    renderImages: function () {","        var img,","            delay = RENDER_INTERVAL;","","        if (this._bpgImages.length <= this._bpgRendered) {","            this.syncScroll();","            this.fire(RENDER_FINISHED);","            return;","        }","","        img = this._bpgImages[this._bpgRendered];","","        if (img.width) {","            this._minColumn().append(img.module);","            this._bpgRendered += 1;","            delay = 1;","        }","","        Y.later(delay, this, this.renderImages);","    },","","    /**","     * update Widget width with parent node","     *","     * @method _updateColumns","     * @param [refresh] {Boolean} <b>true</b> to clean contencBox","     * @protected","     */","    _updateColumns: function (refresh) {","        var P = this.get('contentBox'),","            W = P.get('offsetWidth'),","            w = this.get('columnWidth'),","            N = Math.round(W / w),","            a = Math.floor(W / N),","            f = W - a * (N - 1),","            HTML = HTMLS.COLUMN,","            render = refresh || (this._bpgColumns !== N),","            I;","","        if (render) {","            // clean content box","            P.all(this.get('moduleNode')).remove();","            P.set('innerHTML', '');","","            /**","             * Keep current computed column number","             *","             * @property _bpgColumns","             * @protected","             */","            this._bpgColumns = N;","","            for (I = 0;I < N;I++) {","                P.append(HTML);","            }","        }","","        P.all('> div').each(function (O, I) {","            O.set('offsetWidth', I ? a : f);","        });","","        this.syncScroll();","","        if (render) {","            /**","             * internal rendered image","             *","             * @property _bpgRendered","             * @type Number","             * @protected","             */","            this._bpgRendered = 0;","            this.renderImages();","        }","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * Default column width. Column number will be decided by Math.round(parentWidth / columnWidth), and then all these columns will be fitted equally.","         *","         * @attribute columnWidth","         * @type Number","         * @default 200","         */","        columnWidth: {","            value: 200,","            validator: function (V) {","                return (V * 1 > 0);","            },","            setter: function (V) {","                return V * 1;","            }","        },","","        /**","         * Rendering mode of PhotoGrid, should be one of: 'vertical', 'horizontal'","         *","         * @attribute gridType","         * @type String","         * @default vertical","         */","        gridType: {","            value: 'vertical',","            validator: function (V) {","                return GRID_CFGS[V] ? true : false;","            }","        },","","        /**","         * Default module child nodes css selector.","         *","         * @attribute moduleNode","         * @type String","         * @default '> div'","         */","        moduleNode: {","            value: '> div',","            validator: Y.Lang.isString","        },","","        /**","         * Default image child node css selector. If can not find the Node, a new image node will be inserted under the module node.","         *","         * @attribute photoNode","         * @type String","         * @default '.img'","         */","        photoNode: {","            value: '.img',","            validator: Y.Lang.isString","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        columnWidth: function (srcNode) {","            return srcNode.getData('column-width');","        },","        gridType: function (srcNode) {","            return srcNode.getData('grid-type');","        },","        moduleNode: function (srcNode) {","            return srcNode.getData('module-node');","        },","        photoNode: function (srcNode) {","            return srcNode.getData('photo-node');","        }","    }","});","","Y.namespace('Bottle').PhotoGrid = PhotoGrid;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll']});"];
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].lines = {"1":0,"10":0,"45":0,"47":0,"54":0,"63":0,"70":0,"71":0,"75":0,"86":0,"90":0,"98":0,"101":0,"102":0,"111":0,"112":0,"115":0,"117":0,"118":0,"120":0,"123":0,"124":0,"126":0,"127":0,"129":0,"130":0,"132":0,"136":0,"146":0,"156":0,"159":0,"160":0,"162":0,"163":0,"164":0,"168":0,"177":0,"180":0,"181":0,"182":0,"183":0,"186":0,"188":0,"189":0,"190":0,"191":0,"194":0,"205":0,"215":0,"217":0,"218":0,"226":0,"228":0,"229":0,"233":0,"234":0,"237":0,"239":0,"247":0,"248":0,"271":0,"274":0,"288":0,"327":0,"330":0,"333":0,"336":0,"341":0};
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].functions = {"initializer:44":0,"destructor:69":0,"renderUI:74":0,"(anonymous 3):126":0,"(anonymous 2):101":0,"parseImageData:85":0,"(anonymous 4):159":0,"_minColumn:155":0,"renderImages:176":0,"(anonymous 5):233":0,"_updateColumns:204":0,"validator:270":0,"setter:273":0,"validator:287":0,"columnWidth:326":0,"gridType:329":0,"moduleNode:332":0,"photoNode:335":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].coveredLines = 68;
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].coveredFunctions = 19;
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 1);
YUI.add('gallery-bt-photogrid', function(Y) {

/**
 * Provide PhotoGrid class to rendering a lot of photo in many kinds of layout
 *
 * @module gallery-bt-photogrid
 * @static
 */

_yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 10);
var WIDTH_CHANGE = 'widthChange',
    COLUMN_CHANGE = 'columnWidthChange',
    RENDER_FINISHED = 'renderFinished',

    RENDER_INTERVAL = 100,

    PREFIX = 'bpg_',

    CLASSES = {
        COLUMN: PREFIX + 'column',
        MODULE: PREFIX + 'module'
    },

    HTMLS = {
        COLUMN: '<div class="' + CLASSES.COLUMN + '"></div>'
    },

    GRID_CFGS = {
        vertical: 1,
        horizontal: 1
    },

/**
 * PhotoGrid is a Widget which can help you to render a lot of photo in different patterns.
 *
 * @class PhotoGrid
 * @constructor
 * @namespace Bottle
 * @extends Widget
 * @uses Bottle.SyncScroll
 * @param [config] {Object} Object literal with initial attribute values

 */
PhotoGrid = Y.Base.create('btphotogrid', Y.Widget, [Y.Bottle.SyncScroll], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "initializer", 44);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 45);
this.parseImageData();

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 47);
this.set('syncScrollMethod', this._updateColumns);

        /**
         * Fired when all grid rendered
         *
         * @event renderFinished
         */
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 54);
this.publish(RENDER_FINISHED);

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bpgEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 63);
this._bpgEventHandlers = new Y.EventHandle([
            this.after(WIDTH_CHANGE, this._updateColumns),
            this.after(COLUMN_CHANGE, this._updateColumns)
        ]);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "destructor", 69);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 70);
this._bpgEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 71);
delete this._bpgEventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "renderUI", 74);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 75);
this._updateColumns(true);
    },

    /**
     * parse image data from a node
     *
     * @method parseImageData
     * @param [node] {Node} node to parse data. If omitted, Widget ContentBox will be used.
     * @param [append=false] {Boolean} <b>true</b> to append data. <b>false</b> or ommited to clean old image data.
     */
    parseImageData: function (node, append) {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "parseImageData", 85);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 86);
var images = append ? this._bpgImages : [],
            css = this.get('photoNode'),
            P = node || this.get('contentBox');

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 90);
if (!append) {
            /**
             * internal unloaded image count
             *
             * @property _bpgPending
             * @type Number
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 98);
this._bpgPending = 0;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 101);
P.all(this.get('moduleNode')).each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 2)", 101);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 102);
var image = {
                icon: O.getData('icon'),
                img: O.getData('img'),
                width: O.getData('width'),
                height: O.getData('height'),
                module: O.addClass(CLASSES.MODULE)
            },
            P = O.one(css);

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 111);
if (!image.icon) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 112);
return;
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 115);
image.load = Y.Node.create('<img src="' + image.icon + '" />');

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 117);
if (P) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 118);
P.append(image.load);
            } else {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 120);
O.insert(image.load, 0);
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 123);
if (!image.height || !image.width) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 124);
this._bpgPending += 1;

                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 126);
image.load.once('load', function (E) {
                    _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 3)", 126);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 127);
var O = E.target;

                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 129);
this.height = O.get('height');
                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 130);
this.width = O.get('width');

                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 132);
this._bpgPending -= 1;
                }, image);
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 136);
images.push(image);
        }, this);

        /**
         * internal image meta data
         *
         * @property _bpgImages
         * @type Array
         * @protected
         */
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 146);
this._bpgImages = images;
    },

    /**
     * Get the column with minimal height
     *
     * @method _minColumn
     * @protected
     */
    _minColumn: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "_minColumn", 155);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 156);
var minI = 9999,
            minO;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 159);
this.get('contentBox').all('> div').each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 4)", 159);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 160);
var H = O.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 162);
if (H < minI) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 163);
minI = H;
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 164);
minO = O;
            }
        });

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 168);
return minO;
    },

    /**
     * rendering images
     *
     * @method renderImages
     */
    renderImages: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "renderImages", 176);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 177);
var img,
            delay = RENDER_INTERVAL;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 180);
if (this._bpgImages.length <= this._bpgRendered) {
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 181);
this.syncScroll();
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 182);
this.fire(RENDER_FINISHED);
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 183);
return;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 186);
img = this._bpgImages[this._bpgRendered];

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 188);
if (img.width) {
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 189);
this._minColumn().append(img.module);
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 190);
this._bpgRendered += 1;
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 191);
delay = 1;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 194);
Y.later(delay, this, this.renderImages);
    },

    /**
     * update Widget width with parent node
     *
     * @method _updateColumns
     * @param [refresh] {Boolean} <b>true</b> to clean contencBox
     * @protected
     */
    _updateColumns: function (refresh) {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "_updateColumns", 204);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 205);
var P = this.get('contentBox'),
            W = P.get('offsetWidth'),
            w = this.get('columnWidth'),
            N = Math.round(W / w),
            a = Math.floor(W / N),
            f = W - a * (N - 1),
            HTML = HTMLS.COLUMN,
            render = refresh || (this._bpgColumns !== N),
            I;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 215);
if (render) {
            // clean content box
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 217);
P.all(this.get('moduleNode')).remove();
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 218);
P.set('innerHTML', '');

            /**
             * Keep current computed column number
             *
             * @property _bpgColumns
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 226);
this._bpgColumns = N;

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 228);
for (I = 0;I < N;I++) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 229);
P.append(HTML);
            }
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 233);
P.all('> div').each(function (O, I) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 5)", 233);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 234);
O.set('offsetWidth', I ? a : f);
        });

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 237);
this.syncScroll();

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 239);
if (render) {
            /**
             * internal rendered image
             *
             * @property _bpgRendered
             * @type Number
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 247);
this._bpgRendered = 0;
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 248);
this.renderImages();
        }
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @type Object
     * @static
     * @protected
     */
    ATTRS: {
        /**
         * Default column width. Column number will be decided by Math.round(parentWidth / columnWidth), and then all these columns will be fitted equally.
         *
         * @attribute columnWidth
         * @type Number
         * @default 200
         */
        columnWidth: {
            value: 200,
            validator: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "validator", 270);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 271);
return (V * 1 > 0);
            },
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "setter", 273);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 274);
return V * 1;
            }
        },

        /**
         * Rendering mode of PhotoGrid, should be one of: 'vertical', 'horizontal'
         *
         * @attribute gridType
         * @type String
         * @default vertical
         */
        gridType: {
            value: 'vertical',
            validator: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "validator", 287);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 288);
return GRID_CFGS[V] ? true : false;
            }
        },

        /**
         * Default module child nodes css selector.
         *
         * @attribute moduleNode
         * @type String
         * @default '> div'
         */
        moduleNode: {
            value: '> div',
            validator: Y.Lang.isString
        },

        /**
         * Default image child node css selector. If can not find the Node, a new image node will be inserted under the module node.
         *
         * @attribute photoNode
         * @type String
         * @default '.img'
         */
        photoNode: {
            value: '.img',
            validator: Y.Lang.isString
        }
    },

    /**
     * Static property used to define the default HTML parsing rules
     *
     * @property HTML_PARSER
     * @static
     * @protected
     * @type Object
     */
    HTML_PARSER: {
        columnWidth: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "columnWidth", 326);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 327);
return srcNode.getData('column-width');
        },
        gridType: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "gridType", 329);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 330);
return srcNode.getData('grid-type');
        },
        moduleNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "moduleNode", 332);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 333);
return srcNode.getData('module-node');
        },
        photoNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "photoNode", 335);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 336);
return srcNode.getData('photo-node');
        }
    }
});

_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 341);
Y.namespace('Bottle').PhotoGrid = PhotoGrid;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll']});
