/*global YUI*/
YUI.add('gallery-time-format-test', function (Y, NAME) {
    'use strict';

    var suite = new Y.Test.Suite(NAME),
        A = Y.Assert,
        DT = Y.DataType.Date;

    suite.add(new Y.Test.Case({

        name: 'unit tests',

        /*
         * format(): Takes a native JavaScript Date and formats it as a string
         */
        'format() should throw error if there is no arguments': function () {
            var expect = 'time is required',
                actual;

            try {
                actual = DT.format();
            } catch (e) {
                actual = e.message;
            }

            A.areEqual(expect, actual);
        },

        'format() should throw error if given date string is invalid': function () {
            var expect = 'time is required',
                to = 'INVALID DATETIME STRING',
                actual;

            try {
                actual = DT.format(to);
            } catch (e) {
                actual = e.message;
            }

            A.areEqual(expect, actual);
        },

        'format() should return absolute format time by default': function () {
            // Wed, 04 Apr 2012 12:00:00 GMT
            var to = new Date('2012-04-04T12:00Z'),
                expect = '2012-04-04',
                actual = DT.format(to);

            A.areEqual(expect, actual);

            // string given
            to = '20120404T12:00';
            expect = '2012-04-04';
            actual = DT.format(to);
            A.areEqual(expect, actual);
        },

        'format() should support any strftime format if specified': function () {
            // Wed, 04 Apr 2012 12:00:00 GMT
            var to = new Date('2012-04-04T12:00Z'),
                format,
                expect,
                actual;

            format = '%x';
            expect = '04/04/12';
            actual = DT.format(to, { format: format });
            A.areEqual(expect, actual);

//TODO: detect time zone for testing
//            format = '%Y-%m-%d %H%P';
//            expect = '2012-04-04 05am';
//            actual = DT.format(to, { format: format });
//            A.areEqual(expect, actual);
        },

        'format() should support relative time format if relativeDelta is specified': function () {
            // Wed, 04 Apr 2012 12:00:00 GMT
            var to = new Date('2012-05-01T13:00Z'),
                delta = 3 * 60 * 60, // 3 hours in seconds
                from,
                expect,
                actual;

            from = to;
            expect = 'right now';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            from = new Date('2012-05-01T13:00:10Z');
            expect = 'less than a minute before';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            from = new Date('2012-05-01T13:10Z');
            expect = '10 minutes before';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            from = new Date('2012-05-01T14:00Z');
            expect = 'about an hour before';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            from = new Date('2012-05-01T16:00Z');
            expect = 'about 3 hours before';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            from = new Date('2012-05-01T12:00Z');
            expect = 'about an hour ahead';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            // increase delta to a full year
            delta = 366 * 24 * 60 * 60;

            from = new Date('2013-05-01T13:00Z');
            expect = 'about a year before';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            to = new Date();
            to.setHours(to.getHours() - 1);
            expect = 'about an hour before';
            actual = DT.format(to, { relativeDelta: delta });
            A.areEqual(expect, actual);
        },

        'format() should return absolute time format if relativeDelta is not a positive number': function () {
            var to = new Date('2012-05-01T13:00Z'),
                delta,
                from,
                expect,
                actual;

            delta = 'DELTA IS NOT A NUMBER';
            from = to;
            expect = '2012-05-01';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            // delta is a negative number
            delta = -100;
            from = new Date('2012-05-01T14:00:10Z');
            expect = '2012-05-01';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);
        },

        'format() should return absolute time format if time difference is larger than specified relativeDelta': function () {
            // Wed, 04 Apr 2012 12:00:00 GMT
            var to = new Date('2012-05-01T13:00Z'),
                delta = 3 * 60 * 60, // 3 hours in seconds
                from,
                expect,
                actual;

            from = new Date('2012-05-01T16:00:01Z');
            expect = '2012-05-01';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);

            from = new Date('2012-05-01T17:00Z');
            expect = '2012-05-01';
            actual = DT.format(to, { relativeDelta: delta, from: from });
            A.areEqual(expect, actual);
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', { requires: ['test', 'gallery-time-format'] });
