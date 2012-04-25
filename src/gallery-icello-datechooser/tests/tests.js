YUI().use('gallery-icello-datechooser', 'gallery-icello-date', 'datatype', 'node-event-simulate', function (Y) {
    Y.on('domready', function (e) {
        var IDate = Y.Icello.Date,
            YDate = Y.DataType.Date;

        var fnGetNodeFromList = function (dateChooser, className, contentValue) {
            var nodes = dateChooser.get('contentBox').all(className);
            var node = null;
            nodes.each(function (n) {
                if (n.getContent() == contentValue)
                    node = n;
            });
            return node;
        };

        var fnGetNodeByDay = function (dateChooser, dayOfMonth) {
            return fnGetNodeFromList(dateChooser, '.yui3-icello-datechooser-viewmonth-day', dayOfMonth);
        };

        var fnGetNodeByMonth = function (dateChooser, abbrMonthStr) {
            return fnGetNodeFromList(dateChooser, '.yui3-icello-datechooser-viewyear-month', abbrMonthStr);
        };

        var fnGetNodeByYear = function (dateChooser, yearStr) {
            return fnGetNodeFromList(dateChooser, '.yui3-icello-datechooser-viewdecade-year', yearStr);
        };

        var equalDays = function (actualDate, expectedDate, contextMsg) {
            var areDaysEqual = IDate.areDaysEqual(actualDate, expectedDate);
            var actualDateStr = YDate.format(actualDate, { format: '%D' });
            var expectedDateStr = YDate.format(expectedDate, { format: '%D' });
            ok(areDaysEqual, "actualDate: " + actualDateStr + "; expectedDate: " + expectedDateStr + "; context: " + contextMsg);
        };

        module('object tests', {
            setup: function () {
                this.dc = new Y.Icello.DateChooser({
                    inputNode: '#txtDate'
                });

                this.dc.render();
            },

            teardown: function () {
                this.dc.get('inputNode').set('value', '');

                this.dc.destroy();
                this.dc = null;
            }
        });
        test("date equals today's date as default", 1, function () {
            equalDays(this.dc.get('date'), new Date(), "by default 'date' should be today's date");
        });
        test('date input', 3, function () {
            var dc = this.dc;
            var inputNode = dc.get('inputNode');

            dc.on('inputClickShow', function () {
                step(2, 'last step 2: conform date value of 10/15/2011');
                equalDays(dc.get('date'), new Date(2011, 9, 15), "on 'inputClickShow'");
            });

            step(1, 'step 1: enter 10/15/2011 date and click input Node');
            inputNode.set('value', '10/15/2011');
            inputNode.simulate('click');
        });
        test('visible/not visible', 5, function () {
            var dc = this.dc;
            var inputNode = dc.get('inputNode');

            dc.on('inputClickShow', function () {
                step(3, "step 3: check that 'visible' is true");
                ok(dc.get('visible'), "'visible', should be true after user clicks on input");
            });

            step(1, "step 1: check that 'visible' starts off as false");
            ok(!dc.get('visible'), "'visible' should start off as false");

            step(2, 'step 2: click input node with no date in text field');
            inputNode.simulate('click');
        });
        test('choose date same month', 4, function () {
            var dc = this.dc;
            var inputNode = dc.get('inputNode');

            dc.on('daySelect', function (data) {
                step(3, 'last step 3: confirm chosen date of 10/17/2011');
                equalDays(dc.get('date'), new Date(2011, 9, 17), "on 'daySelected'");
            });

            dc.on('inputClickShow', function () {
                step(2, 'step 2: in month view click the 17th');
                var node17th = fnGetNodeByDay(dc, '17');
                node17th.simulate('click');
            });

            step(1, 'step 1: set date to 10/15/2011 and click inputNode to show calendar');
            inputNode.set('value', '10/15/2011');
            inputNode.simulate('click');
        });
        test('choose next month date', 5, function () {
            var dc = this.dc;
            var inputNode = dc.get('inputNode');

            dc.on('daySelect', function () {
                step(4, 'last step 4: confirm chosen date November, 10, 2011');
                equalDays(dc.get('date'), new Date(2011, 10, 10), "on 'daySelected' for next month's view");
            });

            dc.on('monthSelect', function (data) {
                step(3, 'step 3: in month November click the 10th');
                var node10th = fnGetNodeByDay(dc, '10');
                node10th.simulate('click');
            });

            dc.on('inputClickShow', function () {
                step(2, 'step 2: in month view click next month link');
                var lnkNextMonth = dc.get('contentBox').one('.yui3-icello-datechooser-viewmonth-nextmonth');
                lnkNextMonth.simulate('click');
            });

            step(1, 'step 1: set date to 10/15/2011 and click inputNode to show calendar');
            inputNode.set('value', '10/15/2011');
            inputNode.simulate('click');
        });
        test('year view to choose month', 6, function () {
            var dc = this.dc;
            var inputNode = dc.get('inputNode');

            dc.on('daySelect', function (data) {
                step(5, 'last step 5: confirm chosen date Feb 3, 2011');
                equalDays(dc.get('date'), new Date(2011, 1, 3), "on 'daySelected' after year/month views");
            });

            dc.on('monthSelect', function () {
                step(4, 'step 4: in month view, click 3rd day of Feb 2011');
                var lnk3rd = fnGetNodeByDay(dc, '3');
                lnk3rd.simulate('click');
            });

            dc.on('yearSelect', function (data) {
                step(3, 'step 3: in 2011 year view, click Feb link');
                var lnkFeb = fnGetNodeByMonth(dc, 'Feb');
                lnkFeb.simulate('click');
            });

            dc.on('inputClickShow', function () {
                step(2, 'step 2: in month view, click month/year link to enter 2011 year view');
                var lnkMonthYear = dc.get('contentBox').one('.yui3-icello-datechooser-viewmonth-monthyear');
                lnkMonthYear.simulate('click');
            });

            step(1, 'step 1: set date to 10/15/2011 and click inputNode to show calendar');
            inputNode.set('value', '10/15/2011');
            inputNode.simulate('click');
        });
        test('choose previous decade date', 9, function () {
            var dc = this.dc;
            var inputNode = dc.get('inputNode');

            dc.on('decadeSelect', function (data) {
                var navyear = data.navdate.getFullYear();
                if (navyear == 2011) {
                    step(4, 'step 4: in decade view of 2010-2019, click prevdecade link');
                    dc.get('contentBox').one('.yui3-icello-datechooser-viewdecade-prevdecade').simulate('click');
                }
                else if (navyear == 2001) {
                    step(5, 'step 5: in decade view of 2000-2009, click year 2005');
                    fnGetNodeByYear(dc, '2005').simulate('click');
                }
            });

            dc.on('yearSelect', function (data) {
                var navyear = data.navdate.getFullYear();
                if (navyear == 2011) {
                    step(3, 'step 3: in year view of 2011, click year link to enter decade of 2010-2019');
                    dc.get('contentBox').one('.yui3-icello-datechooser-viewyear-year').simulate('click');
                }
                else if (navyear == 2005) {
                    step(6, 'step 6: in year view of 2005, click month Mar');
                    fnGetNodeByMonth(dc, 'Mar').simulate('click');
                }
            });

            dc.on('monthSelect', function (data) {
                step(7, 'step 7: in month view, slick the 14th');
                fnGetNodeByDay(dc, '14').simulate('click');
            });

            dc.on('daySelect', function (data) {
                step(8, 'last step 8: confirm date selected as 3/14/2005');
                equalDays(dc.get('date'), new Date(2005, 2, 14), "'date' chosen");
            });

            dc.on('inputClickShow', function () {
                step(2, 'step 2: in month view click month/year link to enter year 2011');
                var lnkMonthYear = dc.get('contentBox').one('.yui3-icello-datechooser-viewmonth-monthyear');
                lnkMonthYear.simulate('click');
            });

            step(1, 'step 1: set date to 10/15/2011 and click inputNode to show calendar');
            inputNode.set('value', '10/15/2011');
            inputNode.simulate('click');
        });
        test('setting "date" attribute should change Date in popup and inputNode', 6, function () {
            var dc = this.dc,
                inputNode = dc.get('inputNode');
            
            dc.on('inputClickShow', function () {
                step(3, 'step 3: in "inputClickShow" handler, confirm selected date in interface');
                var contentBox = dc.get('contentBox'),
                    nodeDaySelected = contentBox.one('.yui3-icello-datechooser-viewmonth-day-selected'),
                    nodeMonthYear = contentBox.one('.yui3-icello-datechooser-viewmonth-monthyear');
                    
                equal(nodeDaySelected.getContent(), '15', 'node content of day selected should be "15"');
                equal(nodeMonthYear.getContent(), 'October 2011', 'node content of month year should be "October 2011"');
            });
            
            step(1, 'step 1: set attribute date to "10/15/2011"');
            dc.set('date', new Date(2011, 9, 15));
            
            equal(inputNode.get('value'), '10/15/2011', '"inputNode" value should be set to "10/15/2011"');
            
            step(2, 'step 2: simulate clicking "inputNode" to open calendar');
            inputNode.simulate('click');
        });

    }); //end domready

});