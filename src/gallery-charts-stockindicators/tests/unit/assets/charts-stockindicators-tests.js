YUI.add('charts-stockindicators-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: StockIndicators"),
        parentDiv = Y.DOM.create('<div style="position:absolute;top:50px;left:0px;width:1000px;height:800px" id="testdiv"></div>'),
        DOC = Y.config.doc,
        StockIndicatorChartTests;
    DOC.body.appendChild(parentDiv),

    StockIndicatorChartTests = new Y.Test.Case({
        name: "StockIndicatorCharts Tests",
       
        setUp: function() {
            this.chart = new Y.StockIndicatorsChart({
                charts: [],
                dataProvider: [],
                render: parentDiv
            });
        },

        "test: initChart" : function() {
            this.chart.initializer.apply(this.chart);
            Y.Assert.isNotNull(this.chart._charts, "There should be a charts array.");
            Y.Assert.isNotNull(this.chart._axes, "There should be a axes array.");
            Y.Assert.isNotNull(this.chart._graphs, "There should be a graphs array.");
            Y.Assert.isNotNull(this.chart._graphics, "There should be a graphics array.");
            Y.Assert.isNotNull(this.chart._crosshairs, "There should be a crosshairs array.");
            Y.Assert.isNotNull(this.chart._hotspots, "There should be a hotspots array.");
            Y.Assert.isNotNull(this.chart._legends, "There should be a legends array.");
        },

        "test: _getGraph" : function() {
            Y.Assert.areEqual(
                Y.LineSeries,
                this.chart._getGraph("line"),
                'The _getGraph method should return Y.LineSeries when "line" is the argument.'
            );
            Y.Assert.areEqual(
                Y.ColumnSeries,
                this.chart._getGraph("column"),
                'The _getGraph method should return Y.ColumnSeries when "column" is the argument.'
            );
            Y.Assert.areEqual(
                Y.MarkerSeries,
                this.chart._getGraph("marker"),
                'The _getGraph method should return Y.MarkerSeries when "marker" is the argument.'
            );
            Y.Assert.areEqual(
                Y.CandlestickSeries,
                this.chart._getGraph("candlestick"),
                'The _getGraph method should return Y.CandlestickSeries when "candlestick" is the argument.'
            );
        },

        tearDown: function() {
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        },

        testStockIndicatorCharts: function() {
        }
        
    });

    suite.add(StockIndicatorChartTests);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['gallery-charts-stockindicators']});
