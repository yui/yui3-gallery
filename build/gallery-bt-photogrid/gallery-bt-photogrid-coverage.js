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
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].code=["YUI.add('gallery-bt-photogrid', function(Y) {","","/**"," * Provide PhotoGrid class to rendering a lot of photo in many kinds of layout"," *"," * @module gallery-bt-photogrid"," * @static"," */","","var WIDTH_CHANGE = 'widthChange',","    COLUMN_CHANGE = 'columnWidthChange',","    RENDER_FINISHED = 'renderFinished',","","    RENDER_INTERVAL = 100,","","    PREFIX = 'bpg_',","","    CLASSES = {","        COLUMN: PREFIX + 'column',","        MODULE: PREFIX + 'module'","    },","","    HTMLS = {","        COLUMN: '<div class=\"' + CLASSES.COLUMN + '\"></div>'","    },","","    GRID_CFGS = {","        vertical: 1,","        horizontal: 1","    },","","/**"," * PhotoGrid is a Widget which can help you to render a lot of photo in different patterns."," *"," * @class PhotoGrid"," * @constructor"," * @namespace Bottle"," * @extends Widget"," * @uses Bottle.SyncScroll"," * @param [config] {Object} Object literal with initial attribute values",""," */","PhotoGrid = Y.Base.create('btphotogrid', Y.Widget, [Y.Bottle.SyncScroll], {","    initializer: function () {","        this.parseImageData();","","        this.set('syncScrollMethod', this._updateColumns);","","        /**","         * Fired when all grid rendered","         *","         * @event renderFinished","         */","        this.publish(RENDER_FINISHED);","","        /**","         * internal eventhandlers, keep for destructor","         *","         * @property _bpgEventHandlers","         * @type EventHandle","         * @private","         */","        this._bpgEventHandlers = this.after(COLUMN_CHANGE, this._updateColumns)","    },","","    destructor: function () {","        this._bpgEventHandlers.detach();","        delete this._bpgEventHandlers;","    },","","    renderUI: function () {","        this._updateColumns(true);","    },","","    /**","     * append new html into photogrid. the html will be parsed into photogrid then render","     *","     * @method append","     * @param html {String} new html string","     */","    append: function (html) {","        var N = Y.Node.create(html);","","        this.parseImageData((N.getDOMNode().nodeType == 11) ? Y.Node.create('<div>' + html + '</div>') : N, true);","        this.renderImages(true);","    },","","    /**","     * parse image data from a node","     *","     * @method parseImageData","     * @param [node] {Node} node to parse data. If omitted, Widget ContentBox will be used.","     * @param [append=false] {Boolean} <b>true</b> to append data. <b>false</b> or ommited to clean old image data.","     */","    parseImageData: function (node, append) {","        var images = append ? this._bpgImages : [],","            that = this,","            css = this.get('photoNode'),","            P = node || this.get('contentBox');","","        if (!append) {","            /**","             * internal unloaded image count","             *","             * @property _bpgPending","             * @type Number","             * @protected","             */","            this._bpgPending = 0;","        }","","        P.all(this.get('moduleNode')).each(function (O) {","            var image = {","                icon: O.getData('icon'),","                img: O.getData('img'),","                width: O.getData('width'),","                height: O.getData('height'),","                module: O.addClass(CLASSES.MODULE),","                error: false","            },","            P = O.one(css);","","            if (!image.icon) {","                return;","            }","","            image.load = Y.Node.create('<img src=\"' + image.icon + '\" />');","","            if (P) {","                P.append(image.load);","            } else {","                O.insert(image.load, 0);","            }","","            if (!image.height || !image.width) {","                this._bpgPending += 1;","","                image.load.once('load', function (E) {","                    var O = E.target;","","                    this.height = O.get('height');","                    this.width = O.get('width');","","                    that._bpgPending -= 1;","                }, image);","","                image.load.once('error', function (E) {","                    this.error = true;","                    that._bpgPending -= 1;","                }, image);","            }","","            images.push(image);","        }, this);","","        /**","         * internal image meta data","         *","         * @property _bpgImages","         * @type Array","         * @protected","         */","        this._bpgImages = images;","    },","","    /**","     * Get the column with minimal height","     *","     * @method _minColumn","     * @protected","     */","    _minColumn: function () {","        var minI = 9999,","            minO;","","        this.get('contentBox').all('> div').each(function (O) {","            var H = O.get('offsetHeight');","","            if (H < minI) {","                minI = H;","                minO = O;","            }","        });","","        return minO;","    },","","    /**","     * rendering images","     *","     * @method renderImages","     * @param [start] {Node} node to parse data. If omitted, Widget ContentBox will be used.","     */","    renderImages: function (start) {","        var img,","            delay = RENDER_INTERVAL;","","        if (start && this._bpgRendering) {","            return;","        }","","        this._bpgRendering = true;","","        if (this._bpgImages.length <= this._bpgRendered) {","            this._bpgRendering = false;","            this.syncScroll();","            this.fire(RENDER_FINISHED);","            return;","        }","","        img = this._bpgImages[this._bpgRendered];","","        if (img.width || img.error) {","            if (img.error) {","                img.load.setAttribute('src', this.get('errorImage'));","            }","            this._minColumn().append(img.module);","            this._bpgRendered += 1;","            delay = 1;","        }","","        Y.later(delay, this, this.renderImages);","    },","","    /**","     * update Widget width with parent node","     *","     * @method _updateColumns","     * @param [refresh] {Boolean} <b>true</b> to clean contencBox","     * @protected","     */","    _updateColumns: function (refresh) {","        var P = this.get('contentBox'),","            W = P.get('offsetWidth'),","            w = this.get('columnWidth'),","            N = Math.round(W / w),","            a = Math.floor(W / N),","            f = W - a * (N - 1),","            HTML = HTMLS.COLUMN,","            render = refresh || (this._bpgColumns !== N),","            I;","","        if (render) {","            // clean content box","            P.all(this.get('moduleNode')).remove();","            P.set('innerHTML', '');","","            /**","             * Keep current computed column number","             *","             * @property _bpgColumns","             * @protected","             */","            this._bpgColumns = N;","","            for (I = 0;I < N;I++) {","                P.append(HTML);","            }","        }","","        P.all('> div').each(function (O, I) {","            O.set('offsetWidth', I ? a : f);","        });","","        this.syncScroll();","","        if (render) {","            /**","             * internal rendered image","             *","             * @property _bpgRendered","             * @type Number","             * @protected","             */","            this._bpgRendered = 0;","            this.renderImages(true);","        }","    }","}, {","    /**","     * Static property used to define the default attribute configuration.","     *","     * @property ATTRS","     * @type Object","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * Default error Image.","         *","         * @attribute errorImage","         * @type String","         * @default 'about:blank'","         */","        errorImage: {","            value: 'http://l.yimg.com/f/i/tw/map/i/cpx.gif',","            validator: Y.Lang.isString","        },","","        /**","         * Default column width. Column number will be decided by Math.round(parentWidth / columnWidth), and then all these columns will be fitted equally.","         *","         * @attribute columnWidth","         * @type Number","         * @default 200","         */","        columnWidth: {","            value: 200,","            validator: function (V) {","                return (V * 1 > 0);","            },","            setter: function (V) {","                return V * 1;","            }","        },","","        /**","         * Rendering mode of PhotoGrid, should be one of: 'vertical', 'horizontal'","         *","         * @attribute gridType","         * @type String","         * @default vertical","         */","        gridType: {","            value: 'vertical',","            validator: function (V) {","                return GRID_CFGS[V] ? true : false;","            }","        },","","        /**","         * Default module child nodes css selector.","         *","         * @attribute moduleNode","         * @type String","         * @default '> div'","         */","        moduleNode: {","            value: '> div',","            validator: Y.Lang.isString","        },","","        /**","         * Default image child node css selector. If can not find the Node, a new image node will be inserted under the module node.","         *","         * @attribute photoNode","         * @type String","         * @default '.img'","         */","        photoNode: {","            value: '.img',","            validator: Y.Lang.isString","        }","    },","","    /**","     * Static property used to define the default HTML parsing rules","     *","     * @property HTML_PARSER","     * @static","     * @protected","     * @type Object","     */","    HTML_PARSER: {","        errorImage: function (srcNode) {","            return srcNode.getData('error-image');","        },","        columnWidth: function (srcNode) {","            return srcNode.getData('column-width');","        },","        gridType: function (srcNode) {","            return srcNode.getData('grid-type');","        },","        moduleNode: function (srcNode) {","            return srcNode.getData('module-node');","        },","        photoNode: function (srcNode) {","            return srcNode.getData('photo-node');","        }","    }","});","","Y.namespace('Bottle').PhotoGrid = PhotoGrid;","","","}, '@VERSION@' ,{requires:['gallery-bt-syncscroll']});"];
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].lines = {"1":0,"10":0,"45":0,"47":0,"54":0,"63":0,"67":0,"68":0,"72":0,"82":0,"84":0,"85":0,"96":0,"101":0,"109":0,"112":0,"113":0,"123":0,"124":0,"127":0,"129":0,"130":0,"132":0,"135":0,"136":0,"138":0,"139":0,"141":0,"142":0,"144":0,"147":0,"148":0,"149":0,"153":0,"163":0,"173":0,"176":0,"177":0,"179":0,"180":0,"181":0,"185":0,"195":0,"198":0,"199":0,"202":0,"204":0,"205":0,"206":0,"207":0,"208":0,"211":0,"213":0,"214":0,"215":0,"217":0,"218":0,"219":0,"222":0,"233":0,"243":0,"245":0,"246":0,"254":0,"256":0,"257":0,"261":0,"262":0,"265":0,"267":0,"275":0,"276":0,"311":0,"314":0,"328":0,"367":0,"370":0,"373":0,"376":0,"379":0,"384":0};
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].functions = {"initializer:44":0,"destructor:66":0,"renderUI:71":0,"append:81":0,"(anonymous 3):138":0,"(anonymous 4):147":0,"(anonymous 2):112":0,"parseImageData:95":0,"(anonymous 5):176":0,"_minColumn:172":0,"renderImages:194":0,"(anonymous 6):261":0,"_updateColumns:232":0,"validator:310":0,"setter:313":0,"validator:327":0,"errorImage:366":0,"columnWidth:369":0,"gridType:372":0,"moduleNode:375":0,"photoNode:378":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].coveredLines = 81;
_yuitest_coverage["/build/gallery-bt-photogrid/gallery-bt-photogrid.js"].coveredFunctions = 22;
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
this._bpgEventHandlers = this.after(COLUMN_CHANGE, this._updateColumns)
    },

    destructor: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "destructor", 66);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 67);
this._bpgEventHandlers.detach();
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 68);
delete this._bpgEventHandlers;
    },

    renderUI: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "renderUI", 71);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 72);
this._updateColumns(true);
    },

    /**
     * append new html into photogrid. the html will be parsed into photogrid then render
     *
     * @method append
     * @param html {String} new html string
     */
    append: function (html) {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "append", 81);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 82);
var N = Y.Node.create(html);

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 84);
this.parseImageData((N.getDOMNode().nodeType == 11) ? Y.Node.create('<div>' + html + '</div>') : N, true);
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 85);
this.renderImages(true);
    },

    /**
     * parse image data from a node
     *
     * @method parseImageData
     * @param [node] {Node} node to parse data. If omitted, Widget ContentBox will be used.
     * @param [append=false] {Boolean} <b>true</b> to append data. <b>false</b> or ommited to clean old image data.
     */
    parseImageData: function (node, append) {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "parseImageData", 95);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 96);
var images = append ? this._bpgImages : [],
            that = this,
            css = this.get('photoNode'),
            P = node || this.get('contentBox');

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 101);
if (!append) {
            /**
             * internal unloaded image count
             *
             * @property _bpgPending
             * @type Number
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 109);
this._bpgPending = 0;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 112);
P.all(this.get('moduleNode')).each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 2)", 112);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 113);
var image = {
                icon: O.getData('icon'),
                img: O.getData('img'),
                width: O.getData('width'),
                height: O.getData('height'),
                module: O.addClass(CLASSES.MODULE),
                error: false
            },
            P = O.one(css);

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 123);
if (!image.icon) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 124);
return;
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 127);
image.load = Y.Node.create('<img src="' + image.icon + '" />');

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 129);
if (P) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 130);
P.append(image.load);
            } else {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 132);
O.insert(image.load, 0);
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 135);
if (!image.height || !image.width) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 136);
this._bpgPending += 1;

                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 138);
image.load.once('load', function (E) {
                    _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 3)", 138);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 139);
var O = E.target;

                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 141);
this.height = O.get('height');
                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 142);
this.width = O.get('width');

                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 144);
that._bpgPending -= 1;
                }, image);

                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 147);
image.load.once('error', function (E) {
                    _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 4)", 147);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 148);
this.error = true;
                    _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 149);
that._bpgPending -= 1;
                }, image);
            }

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 153);
images.push(image);
        }, this);

        /**
         * internal image meta data
         *
         * @property _bpgImages
         * @type Array
         * @protected
         */
        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 163);
this._bpgImages = images;
    },

    /**
     * Get the column with minimal height
     *
     * @method _minColumn
     * @protected
     */
    _minColumn: function () {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "_minColumn", 172);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 173);
var minI = 9999,
            minO;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 176);
this.get('contentBox').all('> div').each(function (O) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 5)", 176);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 177);
var H = O.get('offsetHeight');

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 179);
if (H < minI) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 180);
minI = H;
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 181);
minO = O;
            }
        });

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 185);
return minO;
    },

    /**
     * rendering images
     *
     * @method renderImages
     * @param [start] {Node} node to parse data. If omitted, Widget ContentBox will be used.
     */
    renderImages: function (start) {
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "renderImages", 194);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 195);
var img,
            delay = RENDER_INTERVAL;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 198);
if (start && this._bpgRendering) {
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 199);
return;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 202);
this._bpgRendering = true;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 204);
if (this._bpgImages.length <= this._bpgRendered) {
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 205);
this._bpgRendering = false;
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 206);
this.syncScroll();
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 207);
this.fire(RENDER_FINISHED);
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 208);
return;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 211);
img = this._bpgImages[this._bpgRendered];

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 213);
if (img.width || img.error) {
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 214);
if (img.error) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 215);
img.load.setAttribute('src', this.get('errorImage'));
            }
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 217);
this._minColumn().append(img.module);
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 218);
this._bpgRendered += 1;
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 219);
delay = 1;
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 222);
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
        _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "_updateColumns", 232);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 233);
var P = this.get('contentBox'),
            W = P.get('offsetWidth'),
            w = this.get('columnWidth'),
            N = Math.round(W / w),
            a = Math.floor(W / N),
            f = W - a * (N - 1),
            HTML = HTMLS.COLUMN,
            render = refresh || (this._bpgColumns !== N),
            I;

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 243);
if (render) {
            // clean content box
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 245);
P.all(this.get('moduleNode')).remove();
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 246);
P.set('innerHTML', '');

            /**
             * Keep current computed column number
             *
             * @property _bpgColumns
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 254);
this._bpgColumns = N;

            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 256);
for (I = 0;I < N;I++) {
                _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 257);
P.append(HTML);
            }
        }

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 261);
P.all('> div').each(function (O, I) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "(anonymous 6)", 261);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 262);
O.set('offsetWidth', I ? a : f);
        });

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 265);
this.syncScroll();

        _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 267);
if (render) {
            /**
             * internal rendered image
             *
             * @property _bpgRendered
             * @type Number
             * @protected
             */
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 275);
this._bpgRendered = 0;
            _yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 276);
this.renderImages(true);
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
         * Default error Image.
         *
         * @attribute errorImage
         * @type String
         * @default 'about:blank'
         */
        errorImage: {
            value: 'http://l.yimg.com/f/i/tw/map/i/cpx.gif',
            validator: Y.Lang.isString
        },

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
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "validator", 310);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 311);
return (V * 1 > 0);
            },
            setter: function (V) {
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "setter", 313);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 314);
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
                _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "validator", 327);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 328);
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
        errorImage: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "errorImage", 366);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 367);
return srcNode.getData('error-image');
        },
        columnWidth: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "columnWidth", 369);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 370);
return srcNode.getData('column-width');
        },
        gridType: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "gridType", 372);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 373);
return srcNode.getData('grid-type');
        },
        moduleNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "moduleNode", 375);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 376);
return srcNode.getData('module-node');
        },
        photoNode: function (srcNode) {
            _yuitest_coverfunc("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", "photoNode", 378);
_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 379);
return srcNode.getData('photo-node');
        }
    }
});

_yuitest_coverline("/build/gallery-bt-photogrid/gallery-bt-photogrid.js", 384);
Y.namespace('Bottle').PhotoGrid = PhotoGrid;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll']});
