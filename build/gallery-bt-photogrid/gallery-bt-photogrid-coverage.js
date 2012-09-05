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
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].code=["YUI.add('gallery-bt-photogrid', function(Y) {","","/**"," * Provide PhotoGrid class to rendering a lot of photo in many kinds of layout"," *"," * @module gallery-bt-photogrid"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","    COLUMN_CHANGE = 'columnWidthChange',","","    RENDER_INTERVAL = 100,","","    PREFIX = 'bpg_',","","    CLASSES = {","        COLUMN: PREFIX + 'column',","        MODULE: PREFIX + 'module'","    },","","    HTMLS = {","        COLUMN: '<div class=\"' + CLASSES.COLUMN + '\"></div>'","    },","","    GRID_CFGS = {","        vertical: 1,","        horizontal: 1","    },","","/**"," * PhotoGrid is a Widget which can help you to render a lot of photo in different patterns."," *"," * @class PhotoGrid"," * @constructor"," * @namespace Bottle"," * @extends Widget"," * @uses SyncScroll"," * @param [config] {Object} Object literal with initial attribute values",""," */","PhotoGrid = Y.Base.create('btphotogrid', Y.Widget, [Y.Bottle.SyncScroll], {","    initializer: function () {","        this.parseImageData();","","        this.set('syncScrollMethod', this._updateColumns);","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bpgEventHandlers","         * @type EventHandle","         * @private","         */","        this._bpgEventHandlers = new Y.EventHandle([","            this.after(WIDTH_CHANGE, this._updateColumns),","            this.after(COLUMN_CHANGE, this._updateColumns)","        ]);","    },","","    destructor: function () {","        this._bpgEventHandlers.detach();","        delete this._bpgEventHandlers;","    },","","    renderUI: function () {","        this._updateColumns(true);","    },","","    /**","     * parse image data from a node","     *","     * @method parseImageData","     * @param [node] {Node} node to parse data. If omitted, Widget ContentBox will be used.","     * @param [append=false] {Boolean} <b>true</b> to append data. <b>false</b> or ommited to clean old image data.","     */","    parseImageData: function (node, append) {","        var images = append ? this._bpgImages : [],","            css = this.get('photoNode'),","            P = node || this.get('contentBox');","","        if (!append) {","            /**","             * internal unloaded image count","             *","             * @property _bpgPending","             * @type Number","             * @protected","             */","            this._bpgPending = 0;","        }","","        P.all(this.get('moduleNode')).each(function (O) {","            var image = {","                icon: O.getData('icon'),","                img: O.getData('img'),","                width: O.getData('width'),","                height: O.getData('height'),","                module: O.addClass(CLASSES.MODULE)","            },","            P = O.one(css);","","            if (!image.icon) {","                return;","            }","","            image.load = Y.Node.create('<img src=\"' + image.icon + '\" />');","","            if (P) {","                P.append(image.load);","            } else {","                O.insert(image.load, 0);","            }","","            if (!image.height || !image.width) {","                this._bpgPending += 1;","","                image.load.once('load', function (E) {","                    var O = E.target;","","                    this.height = O.get('height');","                    this.width = O.get('width');","","                    this._bpgPending -= 1;","                }, image);","            }","","            images.push(image);","        }, this);","","        /**","         * internal image meta data","         *","         * @property _bpgImages","         * @type Array","         * @protected","         */","        this._bpgImages = images;","    },","","    /**","     * Get the column with minimal height","     *","     * @method _minColumn","     * @protected","     */","    _minColumn: function () {","        var minI = 9999,","            minO;","","        this.get('contentBox').all('> div').each(function (O) {","            var H = O.get('offsetHeight');","","            if (H < minI) {","                minI = H;","                minO = O;","            }","        });","","        return minO;","    },","","    /**","     * rendering images","     *","     * @method renderImages","     */","    renderImages: function () {","        var img,","            delay = RENDER_INTERVAL;","","        if (this._bpgImages.length <= this._bpgRendered) {","            this.syncScroll();","            return;","        }","","        img = this._bpgImages[this._bpgRendered];","","        if (img.width) {","            this._minColumn().append(img.module);","            this._bpgRendered += 1;","            delay = 1;","        }","","        Y.later(delay, this, this.renderImages);","    },","","    /**","     * update Widget width with parent node","     *","     * @method _updateColumns","     * @param [refresh] {Boolean} <b>true</b> to clean contencBox","     * @protected","     */","    _updateColumns: function (refresh) {","        var P = this.get('contentBox'),","            W = P.get('offsetWidth'),","            w = this.get('columnWidth'),","            N = Math.round(W / w),","            a = Math.floor(W / N),","            f = W - a * (N - 1),","            HTML = HTMLS.COLUMN,","            render = refresh || (this._bpgColumns !== N),","            I;","","        if (render) {","            // clean content box","            P.all(this.get('moduleNode')).remove();","            P.set('innerHTML', '');","","            /**","             * Keep current computed column number","             *","             * @property _bpgColumns","             * @protected","             */","            this._bpgColumns = N;","","            for (I = 0;I < N;I++) {","                P.append(HTML);","            }","        }","","        P.all('> div').each(function (O, I) {","            O.set('offsetWidth', I ? a : f);","        });","","        this.syncScroll();","","        if (render) {","            /**","             * internal rendered image","             *","             * @property _bpgRendered","             * @type Number","             * @protected","             */","            this._bpgRendered = 0;","            this.renderImages();","        }","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * Default column width. Column number will be decided by Math.round(parentWidth / columnWidth), and then all these columns will be fitted equally.","         *","         * @attribute columnWidth","         * @type Number","         * @default 200","         */","        columnWidth: {","            value: 200,","            validator: function (V) {","                return (V * 1 > 0);","            },","            setter: function (V) {","                return V * 1;","            }","        },","","        /**","         * Rendering mode of PhotoGrid, should be one of: 'vertical', 'horizontal'","         *","         * @attribute gridType","         * @type String","         * @default vertical","         */","        gridType: {","            value: 'vertical',","            validator: function (V) {","                return GRID_CFGS[V] ? true : false;","            }","        },","","        /**","         * Default module child nodes css selector.","         *","         * @attribute moduleNode","         * @type String","         * @default '> div'","         */","        moduleNode: {","            value: '> div',","            validator: Y.Lang.isString","        },","","        /**","         * Default image child node css selector. If can not find the Node, a new image node will be inserted under the module node.","         *","         * @attribute photoNode","         * @type String","         * @default '.img'","         */","        photoNode: {","            value: '.img',","            validator: Y.Lang.isString","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        columnWidth: function (srcNode) {","            return srcNode.getData('column-width');","        },","        gridType: function (srcNode) {","            return srcNode.getData('grid-type');","        },","        moduleNode: function (srcNode) {","            return srcNode.getData('module-node');","        },","        photoNode: function (srcNode) {","            return srcNode.getData('photo-node');","        }","    }","});","","Y.namespace('Bottle').PhotoGrid = PhotoGrid;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll']});"];
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].lines = {"1":0,"10":0,"44":0,"46":0,"55":0,"62":0,"63":0,"67":0,"78":0,"82":0,"90":0,"93":0,"94":0,"103":0,"104":0,"107":0,"109":0,"110":0,"112":0,"115":0,"116":0,"118":0,"119":0,"121":0,"122":0,"124":0,"128":0,"138":0,"148":0,"151":0,"152":0,"154":0,"155":0,"156":0,"160":0,"169":0,"172":0,"173":0,"174":0,"177":0,"179":0,"180":0,"181":0,"182":0,"185":0,"196":0,"206":0,"208":0,"209":0,"217":0,"219":0,"220":0,"224":0,"225":0,"228":0,"230":0,"238":0,"239":0,"262":0,"265":0,"279":0,"318":0,"321":0,"324":0,"327":0,"332":0};
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].functions = {"initializer:43":0,"destructor:61":0,"renderUI:66":0,"(anonymous 3):118":0,"(anonymous 2):93":0,"parseImageData:77":0,"(anonymous 4):151":0,"_minColumn:147":0,"renderImages:168":0,"(anonymous 5):224":0,"_updateColumns:195":0,"validator:261":0,"setter:264":0,"validator:278":0,"columnWidth:317":0,"gridType:320":0,"moduleNode:323":0,"photoNode:326":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].coveredLines = 66;
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
 * @uses SyncScroll
 * @param [config] {Object} Object literal with initial attribute values

 */
PhotoGrid = Y.Base.create('btphotogrid', Y.Widget, [Y.Bottle.SyncScroll], {
    initializer: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "initializer", 43);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 44);
this.parseImageData();

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 46);
this.set('syncScrollMethod', this._updateColumns);

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bpgEventHandlers
         * @type EventHandle
         * @private
         */
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 55);
this._bpgEventHandlers = new Y.EventHandle([
            this.after(WIDTH_CHANGE, this._updateColumns),
            this.after(COLUMN_CHANGE, this._updateColumns)
        ]);
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "destructor", 61);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 62);
this._bpgEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 63);
delete this._bpgEventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "renderUI", 66);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 67);
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
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "parseImageData", 77);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 78);
var images = append ? this._bpgImages : [],
            css = this.get('photoNode'),
            P = node || this.get('contentBox');

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 82);
if (!append) {
            /**
             * internal unloaded image count
             *
             * @property _bpgPending
             * @type Number
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 90);
this._bpgPending = 0;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 93);
P.all(this.get('moduleNode')).each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 2)", 93);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 94);
var image = {
                icon: O.getData('icon'),
                img: O.getData('img'),
                width: O.getData('width'),
                height: O.getData('height'),
                module: O.addClass(CLASSES.MODULE)
            },
            P = O.one(css);

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 103);
if (!image.icon) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 104);
return;
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 107);
image.load = Y.Node.create('<img src="' + image.icon + '" />');

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 109);
if (P) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 110);
P.append(image.load);
            } else {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 112);
O.insert(image.load, 0);
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 115);
if (!image.height || !image.width) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 116);
this._bpgPending += 1;

                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 118);
image.load.once('load', function (E) {
                    _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 3)", 118);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 119);
var O = E.target;

                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 121);
this.height = O.get('height');
                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 122);
this.width = O.get('width');

                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 124);
this._bpgPending -= 1;
                }, image);
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 128);
images.push(image);
        }, this);

        /**
         * internal image meta data
         *
         * @property _bpgImages
         * @type Array
         * @protected
         */
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 138);
this._bpgImages = images;
    },

    /**
     * Get the column with minimal height
     *
     * @method _minColumn
     * @protected
     */
    _minColumn: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "_minColumn", 147);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 148);
var minI = 9999,
            minO;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 151);
this.get('contentBox').all('> div').each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 4)", 151);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 152);
var H = O.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 154);
if (H < minI) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 155);
minI = H;
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 156);
minO = O;
            }
        });

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 160);
return minO;
    },

    /**
     * rendering images
     *
     * @method renderImages
     */
    renderImages: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "renderImages", 168);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 169);
var img,
            delay = RENDER_INTERVAL;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 172);
if (this._bpgImages.length <= this._bpgRendered) {
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 173);
this.syncScroll();
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 174);
return;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 177);
img = this._bpgImages[this._bpgRendered];

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 179);
if (img.width) {
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 180);
this._minColumn().append(img.module);
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 181);
this._bpgRendered += 1;
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 182);
delay = 1;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 185);
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
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "_updateColumns", 195);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 196);
var P = this.get('contentBox'),
            W = P.get('offsetWidth'),
            w = this.get('columnWidth'),
            N = Math.round(W / w),
            a = Math.floor(W / N),
            f = W - a * (N - 1),
            HTML = HTMLS.COLUMN,
            render = refresh || (this._bpgColumns !== N),
            I;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 206);
if (render) {
            // clean content box
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 208);
P.all(this.get('moduleNode')).remove();
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 209);
P.set('innerHTML', '');

            /**
             * Keep current computed column number
             *
             * @property _bpgColumns
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 217);
this._bpgColumns = N;

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 219);
for (I = 0;I < N;I++) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 220);
P.append(HTML);
            }
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 224);
P.all('> div').each(function (O, I) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 5)", 224);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 225);
O.set('offsetWidth', I ? a : f);
        });

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 228);
this.syncScroll();

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 230);
if (render) {
            /**
             * internal rendered image
             *
             * @property _bpgRendered
             * @type Number
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 238);
this._bpgRendered = 0;
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 239);
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
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "validator", 261);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 262);
return (V * 1 > 0);
            },
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "setter", 264);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 265);
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
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "validator", 278);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 279);
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
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "columnWidth", 317);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 318);
return srcNode.getData('column-width');
        },
        gridType: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "gridType", 320);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 321);
return srcNode.getData('grid-type');
        },
        moduleNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "moduleNode", 323);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 324);
return srcNode.getData('module-node');
        },
        photoNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "photoNode", 326);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 327);
return srcNode.getData('photo-node');
        }
    }
});

_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 332);
Y.namespace('Bottle').PhotoGrid = PhotoGrid;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll']});
