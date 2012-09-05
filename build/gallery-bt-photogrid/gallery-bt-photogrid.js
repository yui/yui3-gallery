YUI.add('gallery-bt-photogrid', function(Y) {

/**
 * Provide PhotoGrid class to rendering a lot of photo in many kinds of layout
 *
 * @module gallery-bt-photogrid
 * @static
 */

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
        this.parseImageData();

        this.set('syncScrollMethod', this._updateColumns);

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bpgEventHandlers
         * @type EventHandle
         * @private
         */
        this._bpgEventHandlers = new Y.EventHandle([
            this.after(WIDTH_CHANGE, this._updateColumns),
            this.after(COLUMN_CHANGE, this._updateColumns)
        ]);
    },

    destructor: function () {
        this._bpgEventHandlers.detach();
        delete this._bpgEventHandlers;
    },

    renderUI: function () {
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
        var images = append ? this._bpgImages : [],
            css = this.get('photoNode'),
            P = node || this.get('contentBox');

        if (!append) {
            /**
             * internal unloaded image count
             *
             * @property _bpgPending
             * @type Number
             * @protected
             */
            this._bpgPending = 0;
        }

        P.all(this.get('moduleNode')).each(function (O) {
            var image = {
                icon: O.getData('icon'),
                img: O.getData('img'),
                width: O.getData('width'),
                height: O.getData('height'),
                module: O.addClass(CLASSES.MODULE)
            },
            P = O.one(css);

            if (!image.icon) {
                return;
            }

            image.load = Y.Node.create('<img src="' + image.icon + '" />');

            if (P) {
                P.append(image.load);
            } else {
                O.insert(image.load, 0);
            }

            if (!image.height || !image.width) {
                this._bpgPending += 1;

                image.load.once('load', function (E) {
                    var O = E.target;

                    this.height = O.get('height');
                    this.width = O.get('width');

                    this._bpgPending -= 1;
                }, image);
            }

            images.push(image);
        }, this);

        /**
         * internal image meta data
         *
         * @property _bpgImages
         * @type Array
         * @protected
         */
        this._bpgImages = images;
    },

    /**
     * Get the column with minimal height
     *
     * @method _minColumn
     * @protected
     */
    _minColumn: function () {
        var minI = 9999,
            minO;

        this.get('contentBox').all('> div').each(function (O) {
            var H = O.get('offsetHeight');

            if (H < minI) {
                minI = H;
                minO = O;
            }
        });

        return minO;
    },

    /**
     * rendering images
     *
     * @method renderImages
     */
    renderImages: function () {
        var img,
            delay = RENDER_INTERVAL;

        if (this._bpgImages.length <= this._bpgRendered) {
            this.syncScroll();
            return;
        }

        img = this._bpgImages[this._bpgRendered];

        if (img.width) {
            this._minColumn().append(img.module);
            this._bpgRendered += 1;
            delay = 1;
        }

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
        var P = this.get('contentBox'),
            W = P.get('offsetWidth'),
            w = this.get('columnWidth'),
            N = Math.round(W / w),
            a = Math.floor(W / N),
            f = W - a * (N - 1),
            HTML = HTMLS.COLUMN,
            render = refresh || (this._bpgColumns !== N),
            I;

        if (render) {
            // clean content box
            P.all(this.get('moduleNode')).remove();
            P.set('innerHTML', '');

            /**
             * Keep current computed column number
             *
             * @property _bpgColumns
             * @protected
             */
            this._bpgColumns = N;

            for (I = 0;I < N;I++) {
                P.append(HTML);
            }
        }

        P.all('> div').each(function (O, I) {
            O.set('offsetWidth', I ? a : f);
        });

        this.syncScroll();

        if (render) {
            /**
             * internal rendered image
             *
             * @property _bpgRendered
             * @type Number
             * @protected
             */
            this._bpgRendered = 0;
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
                return (V * 1 > 0);
            },
            setter: function (V) {
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
            return srcNode.getData('column-width');
        },
        gridType: function (srcNode) {
            return srcNode.getData('grid-type');
        },
        moduleNode: function (srcNode) {
            return srcNode.getData('module-node');
        },
        photoNode: function (srcNode) {
            return srcNode.getData('photo-node');
        }
    }
});

Y.namespace('Bottle').PhotoGrid = PhotoGrid;


}, '@VERSION@' ,{requires:['gallery-bt-syncscroll']});
