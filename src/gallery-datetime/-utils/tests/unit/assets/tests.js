YUI.add('gallery-datetime-utils-tests', function(Y) {
"use strict";

	var date = new Date(2012, 5, 11, 14, 5, 0, 0);

	Y.Test.Runner.add(new Y.Test.Case(
	{
		name: 'DateTime utilities',

		_should:
		{
			error:
			{
				testParseDateInvalidValue:  true,
				testParseTimeInvalidValue:  true,
				testParseTimeInvalidHour:   true,
				testParseTimeInvalidMinute: true
			}
		},

		testNormalize: function()
		{
			function check(result)
			{
				Y.DateAssert.datesAreEqual(date, result.date);
				Y.DateAssert.timesAreEqual(date, result.date);
				Y.Assert.areSame(2012, result.year);
				Y.Assert.areSame(6, result.month);
				Y.Assert.areSame(11, result.day);
				Y.Assert.areSame(14, result.hour);
				Y.Assert.areSame(5, result.minute);
			}

			check(Y.DateTimeUtils.normalize(date));
			check(Y.DateTimeUtils.normalize(date.getTime()));
			check(Y.DateTimeUtils.normalize({year:2012, month:6, day:11, hour:14, minute:5}));
			check(Y.DateTimeUtils.normalize({date_str:'2012-6-11', time_str:'14:05'}));
			check(Y.DateTimeUtils.normalize({year:2012, month:6, day:11, date_str:'2011-1-1', hour:14, minute:5, time_str:'5:10'}));
			check(Y.DateTimeUtils.normalize({year:2012, month:6, day:11}, {hour:14, minute:5}));
			check(Y.DateTimeUtils.normalize({date_str:'2012-6-11'}, {hour:14, minute:5}));

			check(Y.DateTimeUtils.normalize({year:2011, month:18, day:11, hour:14, minute:5}));
			check(Y.DateTimeUtils.normalize({year:2012, month:5, day:42, hour:14, minute:5}));
			check(Y.DateTimeUtils.normalize({year:2012, month:6, day:10, hour:38, minute:5}));
			check(Y.DateTimeUtils.normalize({year:2012, month:6, day:11, hour:12, minute:125}));
		},

		testFormatDate: function()
		{
			Y.Assert.areSame('', Y.DateTimeUtils.formatDate());
			Y.Assert.areSame('', Y.DateTimeUtils.formatDate(null));
			Y.Assert.areSame('', Y.DateTimeUtils.formatDate(''));
			Y.Assert.areSame('2012-6-11', Y.DateTimeUtils.formatDate('2012-6-11'));
			Y.Assert.areSame('2012-06-11', Y.DateTimeUtils.formatDate(date));
			Y.Assert.areSame('2012-06-11', Y.DateTimeUtils.formatDate({year:2012, month:6, day:11}));
		},

		testParseDate: function()
		{
			Y.Assert.areSame(null, Y.DateTimeUtils.parseDate());
			Y.Assert.areSame(null, Y.DateTimeUtils.parseDate(null));
			Y.Assert.areSame(null, Y.DateTimeUtils.parseDate(''));
			Y.Assert.areSame(date, Y.DateTimeUtils.parseDate(date));

			function check(result)
			{
				Y.Assert.areSame(2012, result.year);
				Y.Assert.areSame(6, result.month);
				Y.Assert.areSame(11, result.day);
			}

			check(Y.DateTimeUtils.parseDate('2012-6-11'));
			check(Y.DateTimeUtils.parseDate('2012-06-11'));
			check(Y.DateTimeUtils.parseDate('2011-18-11'));
			check(Y.DateTimeUtils.parseDate('2012-5-42'));

			Y.DateTimeUtils.DATE_FIELD_DELIMITER = '/';
			Y.DateTimeUtils.DAY_POSITION         = 1;
			Y.DateTimeUtils.MONTH_POSITION       = 2;
			Y.DateTimeUtils.YEAR_POSITION        = 3;

			check(Y.DateTimeUtils.parseDate('11/6/2012'));
			check(Y.DateTimeUtils.parseDate('11/06/2012'));
			check(Y.DateTimeUtils.parseDate('2012-6-11'));

			Y.DateTimeUtils.DATE_FIELD_DELIMITER = '-';
			Y.DateTimeUtils.YEAR_POSITION        = 1;
			Y.DateTimeUtils.MONTH_POSITION       = 2;
			Y.DateTimeUtils.DAY_POSITION         = 3;
		},

		testParseDateInvalidValue: function()
		{
			Y.DateTimeUtils.parseDate('abc');
		},

		testFormatTime: function()
		{
			Y.Assert.areSame('', Y.DateTimeUtils.formatTime());
			Y.Assert.areSame('', Y.DateTimeUtils.formatTime(null));
			Y.Assert.areSame('', Y.DateTimeUtils.formatTime(''));
			Y.Assert.areSame('14:05', Y.DateTimeUtils.formatTime('14:05'));
			Y.Assert.areSame('14:05', Y.DateTimeUtils.formatTime({hour:14, minute:5}));
			Y.Assert.areSame('2:05', Y.DateTimeUtils.formatTime({hour:2, minute:5}));
			Y.Assert.areSame('14:05', Y.DateTimeUtils.formatTime(date));

			Y.DateTimeUtils.CLOCK_DISPLAY_TYPE = 12;

			Y.Assert.areSame('2:05 AM', Y.DateTimeUtils.formatTime({hour:2, minute:5}));
			Y.Assert.areSame('2:05 PM', Y.DateTimeUtils.formatTime({hour:14, minute:5}));
			Y.Assert.areSame('2:05 PM', Y.DateTimeUtils.formatTime(date));

			Y.Assert.areSame('12:00 AM', Y.DateTimeUtils.formatTime({hour:0, minute:0}));
			Y.Assert.areSame('12:02 AM', Y.DateTimeUtils.formatTime({hour:0, minute:2}));
			Y.Assert.areSame('12:00 PM', Y.DateTimeUtils.formatTime({hour:12, minute:0}));
			Y.Assert.areSame('12:05 PM', Y.DateTimeUtils.formatTime({hour:12, minute:5}));

			Y.DateTimeUtils.CLOCK_DISPLAY_TYPE = 24;
		},

		testParseTime: function()
		{
			Y.Assert.areSame(null, Y.DateTimeUtils.parseTime());
			Y.Assert.areSame(null, Y.DateTimeUtils.parseTime(null));
			Y.Assert.areSame(null, Y.DateTimeUtils.parseTime(''));
			Y.Assert.areSame(date, Y.DateTimeUtils.parseTime(date));

			function check(result)
			{
				Y.Assert.areSame(14, result.hour);
				Y.Assert.areSame(5, result.minute);
			}

			check(Y.DateTimeUtils.parseTime('14:05'));
			check(Y.DateTimeUtils.parseTime('14:5'));
			check(Y.DateTimeUtils.parseTime('2:05PM'));

			var result = Y.DateTimeUtils.parseTime('2:05 AM');
			Y.Assert.areSame(2, result.hour);
			Y.Assert.areSame(5, result.minute);

			check(Y.DateTimeUtils.parseTime('2:05:15 PM'));

			var t = Y.DateTimeUtils.parseTime('10AM');
			Y.Assert.areSame(10, t.hour);
			Y.Assert.areSame(0, t.minute);

			t = Y.DateTimeUtils.parseTime('12AM');
			Y.Assert.areSame(0, t.hour);
			Y.Assert.areSame(0, t.minute);

			t = Y.DateTimeUtils.parseTime('12:05AM');
			Y.Assert.areSame(0, t.hour);
			Y.Assert.areSame(5, t.minute);

			t = Y.DateTimeUtils.parseTime('12PM');
			Y.Assert.areSame(12, t.hour);
			Y.Assert.areSame(0, t.minute);

			t = Y.DateTimeUtils.parseTime('12:01PM');
			Y.Assert.areSame(12, t.hour);
			Y.Assert.areSame(1, t.minute);
		},

		testParseTimeInvalidValue: function()
		{
			Y.DateTimeUtils.parseTime('2a:00');
		},

		testParseTimeInvalidHour: function()
		{
			Y.DateTimeUtils.parseTime('24:00');
		},

		testParseTimeInvalidMinute: function()
		{
			Y.DateTimeUtils.parseTime('14:60');
		}
	}));

}, '@VERSION@', {requires:['gallery-datetime-utils','test']});
