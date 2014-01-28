/**
 * Provides functionality for a legend.
 *
 * @module gallery-charts-stockindicators
 */
/**
 * Displays a legend when the user interacts with the corresponding chart
 * application.
 *
 * @class StockIndicatorsLegend
 * @constructor
 * @param {Object} config Configuration parameters.
 *  <dl>
 *      <dt>dataProvider</dt><dd>Reference to the application's `dataProvider` attribute.</dd>
 *      <dt>dateColor</dt><dd>The color to be used for the date text in the legend.</dd>
 *      <dt>delim</dt><dd>String value prefixing the display name of each legend item.</dd>
 *      <dt>dateLabelFunction</dt><dd>The function used for formatting the date label.</dd>
 *      <dt>dateLabelFormat</dt><dd>The strf format used to format the date label.</dd>
 *      <dt>dateLabelScope</dt><dd>The scope for the dateLabelFunction</dd>
 *      <dt>displayKeys</dt><dd>An array of displayKeys to be used in the legend. Each display key
 *      is the text to be displayed in the legend for the corresponding value key.</dd>
 *      <dt>displayName</dt><dd>Indicates whether to display the display name. The default
 *      value is `true`.</dd>
 *      <dt>displayValue</dt><dd>Indicates whether to display the value. The default value
 *      is `true`.</dd>
 *      <dt>drawSwatch</dt><dd>Indicates whether or no to draw a colored swatch by the display
 *      name. The default value is `true`.</dd>
 *      <dt>font</dt><dd>The font to use for all text in the legend.</dd>
 *      <dt>fontSize</dt><dd>The font size to use for all text in the legend.</dd>
 *      <dt>height</dt><dd>The height of the legend.</dd>
 *      <dt>priceDownColor</dt><dd>The color to be used for the value text when the value is negative.</dd>
 *      <dt>priceUpColor</dt><dd>The color to be used for value text when the value is positive.</dd>
 *      <dt>swatchWidth</dt><dd>The width of the swatch for each legend item.</dd>
 *      <dt>valueKeys</dt><dd>The value keys, in order, to be used in the legend.</dd>
 *      <dt>valueLabelFormat</dt><dd>Object literal indicating how to format the legend values.
 *          <dl>
 *              <dt>prefix</dt><dd>The prefix.</dd>
 *              <dt>suffix</dt><dd>The suffix.</dd>
 *              <dt>thousandsSeparator</dt><dd>The thousands separator.</dd>
 *              <dt>decimalPlaces</dt><dd>The number of decimals to display.</dd>
 *              <dt>decimalsSeparator</dt><dd>The decimal separator.</dd>
 *          </dl>
 *      </dd>
 *      <dt>width</dt><dd>The width of the legend.</dd>
 *      <dt>x</dt><dd>The x-coordinate for the legend</dd>
 *      <dt>y</dt><dd>The y-coordinate for the legend</dd>
 *  </dl>
 */
function StockIndicatorsLegend() {
    this.init.apply(this, arguments);
}
StockIndicatorsLegend.prototype = {
    init: function(cfg) {
        var i,
            myul,
            len,
            seriesQueue = cfg.valueKeys,
            displayNameQueue = cfg.displayKeys,
            displayName,
            item,
            indicator,
            items = this.items || {},
            indicatorColor;
            this.x = cfg.x;
            this.y = cfg.y;
            this.width = cfg.width;
            this.height = cfg.height;
            this.dataProvider = cfg.dataProvider;
            this.contentDiv = Y.DOM.create('<div style="position:absolute;top:' +
                cfg.y + 'px;' + cfg.x + '0px;height: ' + cfg.height + 'px; width: ' +
                cfg.width + 'px;" class="l-hbox">'
            );
            this.dateLabelFunction = cfg.dateLabelFunction;
            this.dateLabelFormat = cfg.dateLabelFormat;
            this.dateLabelScope = cfg.dateLabelScope || this;
            cfg.render.getDOMNode().appendChild(this.contentDiv);

            len = seriesQueue.length;
            myul = Y.DOM.create(
                '<ul  style="vertical-align: middle; line-height: ' + this.height +
                'px;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;" class="layout-item-modules pure-g">'
            );
            this.contentDiv.appendChild(myul);
            this.dateItem = {
                li: Y.DOM.create('<li class="layout-item-module pure-u" style="display:inline-block; margin: 0px 4px 0px 0px;">'),
                value: Y.DOM.create(
                    '<span style="border-left:' + cfg.swatchWidth + 'px solid #fff;font-size:' + cfg.fontSize + ';font-family:' + cfg.font +
                    ';" id="dateitem";font-color:' + cfg.dateColor +'" ></span>'
                )
            };
            this.dateItem.li.appendChild(this.dateItem.value);
            myul.appendChild(this.dateItem.li);
            for(i = 0; i < len; i = i + 1) {
                indicator = seriesQueue[i];
                displayName = displayNameQueue[i];
                item = {};
                indicatorColor = cfg.colors[indicator];
                item.li = Y.DOM.create(
                    '<li id="' + indicator + '" class="layout-item-module pure-u" style="display:inline-block; margin: 0px 4px 0px 0px;">'
                 );
                item.bullet = Y.DOM.create(
                    '<div style="display: inline-block;width:3px; height: ' + this.height + 'px; background-color:' + indicatorColor + ';"></div>'
                );
                item.label = Y.DOM.create(
                    '<span style="font-size:' + cfg.fontSize +
                    ';font-family:' + cfg.font + ';color:' + indicatorColor + ';display:inline:margin: 0px 0px 0px 0px;" id="' +
                    indicator + '" >' + cfg.delim + displayName +
                    ' : </span>'
                );
                item.value = Y.DOM.create(
                    '<span style="font-size:' + cfg.fontSize + ';font-family:' + cfg.font +
                    ';display:inline:margin: 0px 0px 0px 0px;" id="' + indicator + 'Value" ></span>'
                );
                myul.appendChild(item.li);
                item.li.appendChild(item.bullet);
                item.li.appendChild(item.label);
                item.li.appendChild(item.value);
                items[indicator] = item;
                item.li.style.display = "none";
            }
            this.list = myul;
            this.seriesQueue = seriesQueue;
            this.items = items;
            this.priceUpColor = cfg.priceUpColor;
            this.priceDownColor = cfg.priceDownColor;
            this.valueLabelFormat = cfg.valueLabelFormat;
            this.formatDate = cfg.formatDate;
            this._xy = Y.DOM.getXY(this.contentDiv);
    },
   
    /**
     * Removes all elements of the legend.
     *
     * @method destroy
     */
    destroy: function() {
        this._removeChildren(this.list);
        this._removeChildren(this.contentDiv);
        if(this.contentDiv && this.contentDiv.parentNode) {
            this.contentDiv.parentNode.removeChild(this.contentDiv);
        }
    },

    /**
     * Removes all DOM elements from an HTML element. Used to clear out labels during detruction
     * phase.
     *
     * @method _removeChildren
     * @private
     */
    _removeChildren: function(node)
    {
        if(node && node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },
   
    /**
     * Updates the legend.
     *
     * @method update
     * @param {Number} pageX
     * @param {Array} dataProvider
     */
    update: function(pageX, dataProvider, redraw) {
        var xy = this._xy,
            x = pageX - xy[0],
            index = Math.floor(x / this.width * dataProvider.length);
        this._dataItem = dataProvider[index];
        if(redraw) {
            this.redraw();
        }
    },

  
    /**
     * Draws the legend.
     *
     * @method redraw
     */
    redraw: function() {
        var queue = this.seriesQueue,
            key,
            len = queue.length,
            item,
            items = this.items,
            i,
            val,
            dateLabelFunction = this.dateLabelFunction,
            dateLabelScope = this.dateLabelScope,
            dateLabelFormat = this.dateLabelFormat,
            dateLabelArgs,
            dataItem = this._dataItem;
        if(dataItem) {
            val = dataItem.Date || dataItem.Timestamp;
            if(dateLabelFunction) {
                dateLabelArgs = [val];
                if(dateLabelFormat) {
                    dateLabelArgs.push(dateLabelFormat);
                }
                val = dateLabelFunction.apply(dateLabelScope, dateLabelArgs);
            }
            this.dateItem.value.innerHTML = Y.Escape.html(val);
            for(i = 0; i < len; i = i + 1) {
                key = queue[i];
                item = items[key];
                if(dataItem.hasOwnProperty(key)) {
                    item.li.style.display = "inline-block";
                    val = dataItem[key];
                    item.value.innerHTML = Y.Number.format(parseFloat(val), this.valueLabelFormat);
                    Y.DOM.setStyle(item.value, "color", val > 0 ? this.priceUpColor : this.priceDownColor);
                } else {
                    item.li.style.display = "none";
                }
            }
            dataItem = this._dataItem = null;
        }
    }
};
Y.StockIndicatorsLegend = StockIndicatorsLegend;
