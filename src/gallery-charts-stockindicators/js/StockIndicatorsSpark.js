/**
 * Creates a spark graph.
 *
 * @module gallery-charts-stockindicators
 * @class StockIndicatorsSpark
 * @constructor
 */
Y.StockIndicatorsSpark = function() {
    this._init.apply(this, arguments);
    return this;
};

Y.StockIndicatorsSpark.prototype = {
    /**
     * Maps keys to corresponding class.
     *
     * @property _graphMap
     * @type Object
     * @private
     */
    _graphMap:  {
        line: Y.LineSeries,
        marker: Y.MarkerSeries,
        column: Y.ColumnSeries,
        area: Y.AreaSeries
    },

    /**
     * Maps keys to the property of a style attribute
     * of the corresponding `SeriesBase` instance.
     *
     * @property _styleMap
     * @type Object
     * @private
     */
    _styleMap: {
        line: "line",
        marker: "marker",
        column: "marker",
        area: "area"
    },

    /**
     *  Sets properties for the graph.
     *
     *  @method _init
     *  @param {Object} config Properties for the graph.
     *  @private
     */
    _init: function(config) {
        var styles = config.styles,
            bb = document.createElement('div'),
            cb = document.createElement('div'),
            render = config.render,
            type = config.type || "line",
            style = type === "column" ? "marker" : type,
            SparkClass = this._graphMap[type];
        this.dataProvider = config.dataProvider;
        this.xKey = config.xKey;
        this.yKey = config.yKey;
        if(!styles) {
            styles = {};
            if(config[style]) {
                styles[style] = config[style];
            } else {
                styles[style] = {};
                if(config.color) {
                    styles.line.color = config.color;
                }
                if(config.alpha) {
                    styles.line.alpha = config.alpha;
                }
                if(type === "line") {
                    styles.line.weight = isNaN(config.weight) ? 1 : config.weight;
                }
            }
        }
        this.xAxis = new Y.CategoryAxisBase({
            dataProvider: this.dataProvider,
            keys: [this.xKey]
        });
        this.yAxis = new Y.NumericAxisBase({
            dataProvider: this.dataProvider,
            keys: [this.yKey],
            alwaysShowZero: false
        });
        bb.style.position = "absolute";
        Y.DOM.setStyle(bb, "inlineBlock");
        cb.style.position = "relative";
        render = document.getElementById(render);
        render.appendChild(bb);
        bb.appendChild(cb);
        cb.style.width = Y.DOM.getComputedStyle(render, "width");
        cb.style.height = Y.DOM.getComputedStyle(render, "height");
        this.graphic = new Y.Graphic({
            render: cb,
            autoDraw: false
        });
        this.graph = new SparkClass({
            rendered: true,
            dataProvider: config.dataProvider,
            graphic: this.graphic,
            styles: styles,
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            xKey: this.xKey,
            yKey: this.yKey
        });
        this.contentBox = cb;
        this.boundingBox = bb;
        this.graph.validate();
        this.graphic._redraw();
    },

    /**
     * Removes all elements of the spark.
     *
     * @method destroy
     */
    destroy: function() {
        var parentNode;
        if(this.xAxis) {
            this.xAxis.destroy(true);
        }
        if(this.yAxis) {
            this.yAxis.destroy(true);
        }
        if(this.graph) {
            this.graph.destroy();
        }
        if(this.graphic) {
            this.graphic.destroy();
        }
        if(this.contentBox) {
            parentNode = this.contentBox.parentNode;
            if(parentNode) {
                parentNode.removeChild(this.contentBox);
            }
        }
        if(this.boundingBox) {
            parentNode = this.boundingBox.parentNode;
            if(parentNode) {
                parentNode.removeChild(this.boundingBox);
            }
        }
    }
};
