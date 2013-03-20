/**
 * This module provides absolute/relative date and time formatting, as well as duration formatting
 * Applications can choose date, time, and time zone components separately.
 * For dates, relative descriptions (English "yesterday", German "vorgestern", Japanese "後天") are also supported.
 *
 * This module uses a few modified parts of zimbra AjxFormat to handle dates and time.
 *
 * Absolute formats use the default calendar specified in CLDR for each locale.
 * Currently this means the Buddhist calendar for Thailand; the Gregorian calendar for all other countries.
 * However, you can specify other calendars using language subtags;
 * for example, for Thai the Gregorian calendar can be specified as th-TH-u-ca-gregory.
 *
 * Relative time formats only support times in the past. It can represent times like "1 hour 5 minutes ago"
 *
 * @module datatype-date-advanced-format
 * @requires datatype-date-timezone, datatype-date-format, datatype-number-advanced-format
 */

ShortNames = {
        "weekdayMonShort":"M",
        "weekdayTueShort":"T",
        "weekdayWedShort":"W",
        "weekdayThuShort":"T",
        "weekdayFriShort":"F",
        "weekdaySatShort":"S",
        "weekdaySunShort":"S",
        "monthJanShort":"J",
        "monthFebShort":"F",
        "monthMarShort":"M",
        "monthAprShort":"A",
        "monthMayShort":"M",
        "monthJunShort":"J",
        "monthJulShort":"J",
        "monthAugShort":"A",
        "monthSepShort":"S",
        "monthOctShort":"O",
        "monthNovShort":"N",
        "monthDecShort":"D"
};
    
//
// Date format class
//

/**
 * The DateFormat class formats Date objects according to a specified pattern.
 * The patterns are defined the same as the SimpleDateFormat class in the Java libraries.
 *
 * Note:
 * The date format differs from the Java patterns a few ways: the pattern
 * "EEEEE" (5 'E's) denotes a <em>short</em> weekday and the pattern "MMMMM"
 * (5 'M's) denotes a <em>short</em> month name. This matches the extended
 * pattern found in the Common Locale Data Repository (CLDR) found at:
 * http://www.unicode.org/cldr/.
 *
 * @class __zDateFormat
 * @extends Number.__BaseFormat
 * @namespace Date
 * @private
 * @constructor
 * @param pattern {String} The pattern to format date in
 * @param formats {Object} Locale specific data
 * @param timeZoneId {String} Timezone Id according to Olson tz database
 */
Y.Date.__zDateFormat = function(pattern, formats, timeZoneId) {
    DateFormat.superclass.constructor.call(this, pattern, formats);
    this.timeZone = new Y.Date.Timezone(timeZoneId);
        
    if (pattern === null) {
        return;
    }
    var head, tail, segment, i, c, count, field;
    for (i = 0; i < pattern.length; i++) {
        // literal
        c = pattern.charAt(i);
        if (c === "'") {
            head = i + 1;
            for (i++ ; i < pattern.length; i++) {
                c = pattern.charAt(i);
                if (c === "'") {
                    if (i + 1 < pattern.length && pattern.charAt(i + 1) === "'") {
                        pattern = pattern.substr(0, i) + pattern.substr(i + 1);
                    }
                    else {
                        break;
                    }
                }
            }
            if (i === pattern.length) {
		Y.error("unterminated string literal");
            }
            tail = i;
            segment = new Format.TextSegment(this, pattern.substring(head, tail));
            this._segments.push(segment);
            continue;
        }

        // non-meta chars
        head = i;
        while(i < pattern.length) {
            c = pattern.charAt(i);
            if (DateFormat._META_CHARS.indexOf(c) !== -1 || c === "'") {
                break;
            }
            i++;
        }
        tail = i;
        if (head !== tail) {
            segment = new Format.TextSegment(this, pattern.substring(head, tail));
            this._segments.push(segment);
            i--;
            continue;
        }
		
        // meta char
        head = i;
        while(++i < pattern.length) {
            if (pattern.charAt(i) !== c) {
                break;
            }
        }
        tail = i--;
        count = tail - head;
        field = pattern.substr(head, count);
        segment = null;
        switch (c) {
            case 'G':
                segment = new DateFormat.EraSegment(this, field);
                break;
            case 'y':
                segment = new DateFormat.YearSegment(this, field);
                break;
            case 'M':
                segment = new DateFormat.MonthSegment(this, field);
                break;
            case 'w':
            case 'W':
                segment = new DateFormat.WeekSegment(this, field);
                break;
            case 'D':
            case 'd':
                segment = new DateFormat.DaySegment(this, field);
                break;
            case 'F':
            case 'E':
                segment = new DateFormat.WeekdaySegment(this, field);
                break;
            case 'a':
                segment = new DateFormat.AmPmSegment(this, field);
                break;
            case 'H':
            case 'k':
            case 'K':
            case 'h':
                segment = new DateFormat.HourSegment(this, field);
                break;
            case 'm':
                segment = new DateFormat.MinuteSegment(this, field);
                break;
            case 's':
            case 'S':
                segment = new DateFormat.SecondSegment(this, field);
                break;
            case 'z':
            case 'Z':
                segment = new DateFormat.TimezoneSegment(this, field);
                break;
        }
        if (segment !== null) {
            segment._index = this._segments.length;
            this._segments.push(segment);
        }
    }
};

DateFormat = Y.Date.__zDateFormat;
Y.extend(DateFormat, Format);

// Constants

Y.mix(DateFormat, {
	SHORT: 0,
	MEDIUM: 1,
	LONG: 2,
	DEFAULT: 1,
	_META_CHARS: "GyMwWDdFEaHkKhmsSzZ"
});

/**
 * Format the date
 * @method format
 * @param object {Date} The date to be formatted
 * @param [relative=false] {Boolean} Whether relative dates should be used.
 * @return {String} Formatted result
 */
DateFormat.prototype.format = function(object, relative) {
    var useRelative = false,
        s = [],
        datePattern = false,
        i;

    if(relative !== null && relative !== "") {
        useRelative = true;
    }

    for (i = 0; i < this._segments.length; i++) {
        //Mark datePattern sections in case of relative dates
        if(this._segments[i].toString().indexOf("text: \"<datePattern>\"") === 0) {
            if(useRelative) {
                s.push(relative);
            }
            datePattern = true;
            continue;
        }
        if(this._segments[i].toString().indexOf("text: \"</datePattern>\"") === 0) {
            datePattern = false;
            continue;
        }
        if(!datePattern || !useRelative) {
            s.push(this._segments[i].format(object));
        }
    }
    return s.join("");
};

//
// Date segment class
//

/**
 * Date Segment in the pattern
 * @class DateSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends Number.__BaseFormat.Segment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.DateSegment = function(format, s) {
    DateFormat.DateSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.DateSegment, Format.Segment);

//
// Date era segment class
//

/**
 * Era Segment in the pattern
 * @class EraSegment
 * @for Date.__DateFormat
 * @namespace Date.__DateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__DateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.EraSegment = function(format, s) {
    DateFormat.EraSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.EraSegment, DateFormat.DateSegment);

/**
 * Format date and get the era segment. Currently it only supports the current era, and will always return localized representation of AD
 * @method format
 * //param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.EraSegment.prototype.format = function(/*date*/) {
    // NOTE: Only support current era at the moment...
    return this.getFormat().AD;
};

//
// Date year segment class
//

/**
 * Year Segment in the pattern
 * @class YearSegment
 * @namespace Date.__DateFormat
 * @for Date.__DateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__DateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.YearSegment = function(format, s) {
    DateFormat.YearSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.YearSegment, DateFormat.DateSegment);

Y.mix(DateFormat.YearSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "dateYear: \""+this._s+'"';
    },

    /**
     * Format date and get the year segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var year = String(date.getFullYear());
        return this._s.length !== 1 && this._s.length < 4 ? year.substr(year.length - 2) : Y.Number._zeroPad(year, this._s.length);
    }
}, true);

//
// Date month segment class
//

/**
 * Month Segment in the pattern
 * @class MonthSegment
 * @namepspace Date.__DateFormat
 * @for Date.__DateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__DateFormat} The parent Format object.
 * @param s {String} The pattern representing the segment
 */
DateFormat.MonthSegment = function(format, s) {
    DateFormat.MonthSegment.superclass.constructor.call(this, format, s);
    this.initialize();
};
Y.extend(DateFormat.MonthSegment, DateFormat.DateSegment);

Y.mix(DateFormat.MonthSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "dateMonth: \""+this._s+'"';
    },

    /**
     * Initialize with locale specific data.
     * @method initialize
     */
    initialize: function() {
        DateFormat.MonthSegment.MONTHS = {};
        DateFormat.MonthSegment.MONTHS[DateFormat.SHORT] = [
            ShortNames.monthJanShort,ShortNames.monthFebShort,ShortNames.monthMarShort,
            ShortNames.monthAprShort,ShortNames.monthMayShort,ShortNames.monthJunShort,
            ShortNames.monthJulShort,ShortNames.monthAugShort,ShortNames.monthSepShort,
            ShortNames.monthOctShort,ShortNames.monthNovShort,ShortNames.monthDecShort
        ];

        var Formats = this.getFormat().Formats;
        DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM] = [
            Formats.monthJanMedium, Formats.monthFebMedium, Formats.monthMarMedium,
            Formats.monthAprMedium, Formats.monthMayMedium, Formats.monthJunMedium,
            Formats.monthJulMedium, Formats.monthAugMedium, Formats.monthSepMedium,
            Formats.monthOctMedium, Formats.monthNovMedium, Formats.monthDecMedium
        ];
        DateFormat.MonthSegment.MONTHS[DateFormat.LONG] = [
            Formats.monthJanLong, Formats.monthFebLong, Formats.monthMarLong,
            Formats.monthAprLong, Formats.monthMayLong, Formats.monthJunLong,
            Formats.monthJulLong, Formats.monthAugLong, Formats.monthSepLong,
            Formats.monthOctLong, Formats.monthNovLong, Formats.monthDecLong
        ];
    },

    /**
     * Format date and get the month segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var month = date.getMonth();
        switch (this._s.length) {
            case 1:
                return String(month + 1);
            case 2:
                return Y.Number._zeroPad(month + 1, 2);
            case 3:
                return DateFormat.MonthSegment.MONTHS[DateFormat.MEDIUM][month];
            case 5:
                return DateFormat.MonthSegment.MONTHS[DateFormat.SHORT][month];
        }
        return DateFormat.MonthSegment.MONTHS[DateFormat.LONG][month];
    }
}, true);

//
// Date week segment class
//

/**
 * Week Segment in the pattern
 * @class WeekSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object. Here it would be of type DateFormat (which extends Format)
 * @param s {String} The pattern representing the segment
 */
DateFormat.WeekSegment = function(format, s) {
    DateFormat.WeekSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.WeekSegment, DateFormat.DateSegment);

/**
 * Format date and get the week segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.WeekSegment.prototype.format = function(date) {
    var year = date.getYear(),
        month = date.getMonth(),
        day = date.getDate(),
	ofYear = /w/.test(this._s),
        date2 = new Date(year, ofYear ? 0 : month, 1),
        week = 0;
    while (true) {
        week++;
        if (date2.getMonth() > month || (date2.getMonth() === month && date2.getDate() >= day)) {
            break;
        }
        date2.setDate(date2.getDate() + 7);
    }

    return Y.Number._zeroPad(week, this._s.length);
};

//
// Date day segment class
//

/**
 * Day Segment in the pattern
 * @class DaySegment
 * @namespace Date.__zDateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.DaySegment = function(format, s) {
    DateFormat.DaySegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.DaySegment, DateFormat.DateSegment);

/**
 * Format date and get the day segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.DaySegment.prototype.format = function(date) {
    var month = date.getMonth(),
        day = date.getDate(),
        year = date.getYear(),
        date2;

    if (/D/.test(this._s) && month > 0) {
        do {
            // set date to first day of month and then go back one day
            date2 = new Date(year, month, 1);
            date2.setDate(0);
			
            day += date2.getDate();
            month--;
        } while (month > 0);
    }
    return Y.Number._zeroPad(day, this._s.length);
};

//
// Date weekday segment class
//

/**
 * Weekday Segment in the pattern
 * @class WeekdaySegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends DateSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.WeekdaySegment = function(format, s) {
    DateFormat.WeekdaySegment.superclass.constructor.call(this, format, s);
    this.initialize();
};
Y.extend(DateFormat.WeekdaySegment, DateFormat.DateSegment);

Y.mix(DateFormat.WeekdaySegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "dateDay: \""+this._s+'"';
    },

    /**
     * Initialize with locale specific data.
     * @method initialize
     */
    initialize: function() {
        DateFormat.WeekdaySegment.WEEKDAYS = {};
        // NOTE: The short names aren't available in Java so we have to define them.
        DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.SHORT] = [
            ShortNames.weekdaySunShort,ShortNames.weekdayMonShort,ShortNames.weekdayTueShort,
            ShortNames.weekdayWedShort,ShortNames.weekdayThuShort,ShortNames.weekdayFriShort,
            ShortNames.weekdaySatShort
        ];

        var Formats = this.getFormat().Formats;
        DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.MEDIUM] = [
            Formats.weekdaySunMedium, Formats.weekdayMonMedium, Formats.weekdayTueMedium,
            Formats.weekdayWedMedium, Formats.weekdayThuMedium, Formats.weekdayFriMedium,
            Formats.weekdaySatMedium
        ];
        DateFormat.WeekdaySegment.WEEKDAYS[DateFormat.LONG] = [
            Formats.weekdaySunLong, Formats.weekdayMonLong, Formats.weekdayTueLong,
            Formats.weekdayWedLong, Formats.weekdayThuLong, Formats.weekdayFriLong,
            Formats.weekdaySatLong
        ];
    },

    /**
     * Format date and get the weekday segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var weekday = date.getDay(),
            style;
        if (/E/.test(this._s)) {
            switch (this._s.length) {
                case 4:
                    style = DateFormat.LONG;
                    break;
                case 5:
                    style = DateFormat.SHORT;
                    break;
                default:
                    style = DateFormat.MEDIUM;
            }
            return DateFormat.WeekdaySegment.WEEKDAYS[style][weekday];
        }
        return Y.Number._zeroPad(weekday, this._s.length);
    }
}, true);

//
// Time segment class
//

/**
 * Time Segment in the pattern
 * @class TimeSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends Number.__BaseFormat.Segment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.TimeSegment = function(format, s) {
    DateFormat.TimeSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.TimeSegment, Y.Number.__BaseFormat.Segment);

//
// Time hour segment class
//

/**
 * Hour Segment in the pattern
 * @class HourSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.HourSegment = function(format, s) {
    DateFormat.HourSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.HourSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.HourSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeHour: \""+this._s+'"';
    },

    /**
     * Format date and get the hour segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var hours = date.getHours();
        if (hours > 12 && /[hK]/.test(this._s)) {
            hours -= 12;
        }
        else if (hours === 0 && /[h]/.test(this._s)) {
            hours = 12;
        }
        /***
            // NOTE: This is commented out to match the Java formatter output
            //       but from the comments for these meta-chars, it doesn't
            //       seem right.
            if (/[Hk]/.test(this._s)) {
                hours--;
            }
        /***/
        return Y.Number._zeroPad(hours, this._s.length);
    }
}, true);

//
// Time minute segment class
//

/**
 * Minute Segment in the pattern
 * @class MinuteSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.MinuteSegment = function(format, s) {
    DateFormat.MinuteSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.MinuteSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.MinuteSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeMinute: \""+this._s+'"';
    },

    /**
     * Format date and get the minute segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var minutes = date.getMinutes();
        return Y.Number._zeroPad(minutes, this._s.length);
    }
}, true);

//
// Time second segment class
//

/**
 * Second Segment in the pattern
 * @class SecondSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.SecondSegment = function(format, s) {
    DateFormat.SecondSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.SecondSegment, DateFormat.TimeSegment);

/**
 * Format date and get the second segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
DateFormat.SecondSegment.prototype.format = function(date) {
    var minutes = /s/.test(this._s) ? date.getSeconds() : date.getMilliseconds();
    return Y.Number._zeroPad(minutes, this._s.length);
};

//
// Time am/pm segment class
//

/**
 * AM/PM Segment in the pattern
 * @class AmPmSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object. Here it would be of type DateFormat (which extends Format)
 * @param s {String} The pattern representing the segment
 */
DateFormat.AmPmSegment = function(format, s) {
    DateFormat.AmPmSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.AmPmSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.AmPmSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeAmPm: \""+this._s+'"';
    },

    /**
     * Format date and get the AM/PM segment.
     * @method format
     * @param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(date) {
        var hours = date.getHours();
        return hours < 12 ? this.getFormat().Formats.periodAm : this.getFormat().Formats.periodPm;
    }
}, true);

//
// Time timezone segment class
//

/**
 * TimeZone Segment in the pattern
 * @class TimezoneSegment
 * @namespace Date.__zDateFormat
 * @for Date.__zDateFormat
 * @extends TimeSegment
 * @private
 * @constructor
 * @param format {Date.__zDateFormat} The parent Format object
 * @param s {String} The pattern representing the segment
 */
DateFormat.TimezoneSegment = function(format, s) {
    DateFormat.TimezoneSegment.superclass.constructor.call(this, format, s);
};
Y.extend(DateFormat.TimezoneSegment, DateFormat.TimeSegment);

Y.mix(DateFormat.TimezoneSegment.prototype, {
    /**
     * Return a string representation of the object
     * @method toString
     * @return {String}
     */
    toString: function() {
        return "timeTimezone: \""+this._s+'"';
    },

    /**
     * Format date and get the timezone segment.
     * @method format
     * //param date {Date} The date to be formatted
     * @return {String} Formatted result
     */
    format: function(/*date*/) {
        var timeZone = this.getFormat().timeZone;
        if (/Z/.test(this._s)) {
            return timeZone.getShortName();
        }
        return this._s.length < 4 ? timeZone.getMediumName() : timeZone.getLongName();
    }
}, true);
    
//
// Non-Gregorian Calendars
//

/*
 * Buddhist Calendar. This is normally used only for Thai locales (th).
 * @class __BuddhistDateFormat
 * @namespace Date
 * @extends __zDateFormat
 * @constructor
 * @private
 * @param pattern {String} The pattern to format date in
 * @param formats {Object} Locale specific data
 * @param timeZoneId {String} Timezone Id according to Olson tz database
 */
Y.Date.__BuddhistDateFormat = function(pattern, formats, timeZoneId) {
    BuddhistDateFormat.superclass.constructor.call(this, pattern, formats, timeZoneId);
        
    //Iterate through _segments, and replace the ones that are different for Buddhist Calendar
    var segments = this._segments, i;
    for(i=0; i<segments.length; i++) {
        if(segments[i] instanceof DateFormat.YearSegment) {
            segments[i] = new BuddhistDateFormat.YearSegment(segments[i]);
        } else if (segments[i] instanceof DateFormat.EraSegment) {
            segments[i] = new BuddhistDateFormat.EraSegment(segments[i]);
        }
    }
};

BuddhistDateFormat = Y.Date.__BuddhistDateFormat;
Y.extend(BuddhistDateFormat, DateFormat);
    
/**
 * YearSegment class for Buddhist Calender
 * @class YearSegment
 * @namespace Date.__BuddhistDateFormat
 * @extends Date.__zDateFormat.YearSegment
 * @private
 * @constructor
 * @param segment {Date.__zDateFormat.YearSegment}
 */
BuddhistDateFormat.YearSegment = function(segment) {
    BuddhistDateFormat.YearSegment.superclass.constructor.call(this, segment._parent, segment._s);
};

Y.extend(BuddhistDateFormat.YearSegment, DateFormat.YearSegment);

/**
 * Format date and get the year segment.
 * @method format
 * @param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
BuddhistDateFormat.YearSegment.prototype.format = function(date) {
    var year = date.getFullYear();
    year = String(year + 543);      //Buddhist Calendar epoch is in 543 BC
    return this._s.length !== 1 && this._s.length < 4 ? year.substr(year.length - 2) : Y.Number._zeroPad(year, this._s.length);
};
    
/**
 * EraSegment class for Buddhist Calender
 * @class EraSegment
 * @for Date.__BuddhistDateFormat
 * @namespace Date.__BuddhistDateFormat
 * @extends Date.__zDateFormat.EraSegment
 * @private
 * @constructor
 * @param segment {Date.__zDateFormat.EraSegment}
 */
BuddhistDateFormat.EraSegment = function(segment) {
    BuddhistDateFormat.EraSegment.superclass.constructor.call(this, segment._parent, segment._s);
};

Y.extend(BuddhistDateFormat.EraSegment, DateFormat.EraSegment);

/**
 * Format date and get the era segment.
 * @method format
 * //param date {Date} The date to be formatted
 * @return {String} Formatted result
 */
BuddhistDateFormat.EraSegment.prototype.format = function(/*date*/) {
    return "BE";    //Only Buddhist Era supported for now
};

/**
 * Wrapper around the zimbra-based DateFormat for use in YUI. API designed to be similar to ICU
 * @class __YDateFormat
 * namespace Date
 * @private
 * @constructor
 * @param {String} [timeZone] TZ database ID for the time zone that should be used.
 *                            If omitted, defaults to the system timezone
 * @param {Number} [dateFormat=0] Selector for the desired date format from Y.Date.DATE_FORMATS.
 * @param {Number} [timeFormat=0] Selector for the desired time format from Y.Date.TIME_FORMATS.
 * @param {Number} [timeZoneFormat=0] Selector for the desired time zone format from Y.Date.TIMEZONE_FORMATS.
 */
Y.Date.__YDateFormat = function(timeZone, dateFormat, timeFormat, timeZoneFormat) {
        
    if(timeZone === undefined || timeZone === null) {
        timeZone = Y.Date.Timezone.getTimezoneIdForOffset( new Date().getTimezoneOffset() * -60 );
    }

    this._Formats = Y.Intl.get(MODULE_NAME);
        
    //If not valid time zone
    if(!Y.Date.Timezone.isValidTimezoneId(timeZone)) {
	Y.error("Could not find timezone: " + timeZone);
    }

    this._timeZone = timeZone;
    this._timeZoneInstance = new Y.Date.Timezone(this._timeZone);

    this._dateFormat = dateFormat || 0;
    this._timeFormat = timeFormat || 0;
    this._timeZoneFormat = timeZoneFormat || 0;

    this._relative = false;
    this._pattern = this._generatePattern();

    var locale = Y.Intl.getLang(MODULE_NAME);
        
    if(locale.match(/^th/) && !locale.match(/u-ca-gregory/)) {
        //Use buddhist calendar
        this._dateFormatInstance = new BuddhistDateFormat(this._pattern, this._Formats, this._timeZone);
    } else {
        //Use gregorian calendar
        this._dateFormatInstance = new DateFormat(this._pattern, this._Formats, this._timeZone);
    }
};

YDateFormat = Y.Date.__YDateFormat;

Y.mix(Y.Date, {
    /**
     * Date Format Style values to use during format/parse
     * @property DATE_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    DATE_FORMATS: {
        NONE: 0,
        WYMD_LONG: 1,
        WYMD_ABBREVIATED: 4,
        WYMD_SHORT: 8,
        WMD_LONG: 16,
        WMD_ABBREVIATED: 32,
        WMD_SHORT: 64,
        YMD_LONG: 128,
        YMD_ABBREVIATED: 256,
        YMD_SHORT: 512,
        YM_LONG: 1024,
        MD_LONG: 2048,
        MD_ABBREVIATED: 4096,
        MD_SHORT: 8192,
        W_LONG: 16384,
        W_ABBREVIATED: 32768,
        M_LONG: 65536,
        M_ABBREVIATED: 131072,
        YMD_FULL: 262144,
        RELATIVE_DATE: 524288
    },

    /**
     * Time Format Style values to use during format/parse
     * @property TIME_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    TIME_FORMATS: {
        NONE: 0,
        HM_ABBREVIATED: 1,
        HM_SHORT: 2,
        H_ABBREVIATED: 4
    },

    /**
     * Timezone Format Style values to use during format/parse
     * @property TIMEZONE_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    TIMEZONE_FORMATS: {
        NONE: 0,
        Z_ABBREVIATED: 1,
        Z_SHORT: 2
    }
});

Y.mix(YDateFormat.prototype, {
    /**
     * Generate date pattern for selected format. For internal use only.
     * @method _generateDatePattern
     * @for Date.__YDateFormat
     * @private
     * @return {String} Date pattern
     */
    _generateDatePattern: function() {
        var format = this._dateFormat;
        if(format && Y.Lang.isString(format)) {
            format = Y.Date.DATE_FORMATS[format];
        }
    
        if(format === null) { return ""; }
        /*jshint bitwise: false*/
        if(format & Y.Date.DATE_FORMATS.RELATIVE_DATE) {
            this._relative = true;
            format = format ^ Y.Date.DATE_FORMATS.RELATIVE_DATE;
        }
        /*jshint bitwise: true*/
        switch(format) {
            //Use relative only for formats with day component
            case Y.Date.DATE_FORMATS.NONE:
                this._relative = false;
                return "";
            case Y.Date.DATE_FORMATS.WYMD_LONG:
                return this._Formats.WYMD_long;
            case Y.Date.DATE_FORMATS.WYMD_ABBREVIATED:
                return this._Formats.WYMD_abbreviated;
            case Y.Date.DATE_FORMATS.WYMD_SHORT:
                return this._Formats.WYMD_short;
            case Y.Date.DATE_FORMATS.WMD_LONG:
                return this._Formats.WMD_long;
            case Y.Date.DATE_FORMATS.WMD_ABBREVIATED:
                return this._Formats.WMD_abbreviated;
            case Y.Date.DATE_FORMATS.WMD_SHORT:
                return this._Formats.WMD_short;
            case Y.Date.DATE_FORMATS.YMD_LONG:
                return this._Formats.YMD_long;
            case Y.Date.DATE_FORMATS.YMD_ABBREVIATED:
                return this._Formats.YMD_abbreviated;
            case Y.Date.DATE_FORMATS.YMD_SHORT:
                return this._Formats.YMD_short;
            case Y.Date.DATE_FORMATS.YM_LONG:
                this._relative = false;
                return this._Formats.YM_long;
            case Y.Date.DATE_FORMATS.MD_LONG:
                return this._Formats.MD_long;
            case Y.Date.DATE_FORMATS.MD_ABBREVIATED:
                return this._Formats.MD_abbreviated;
            case Y.Date.DATE_FORMATS.MD_SHORT:
                return this._Formats.MD_short;
            case Y.Date.DATE_FORMATS.W_LONG:
                this._relative = false;
                return this._Formats.W_long;
            case Y.Date.DATE_FORMATS.W_ABBREVIATED:
                this._relative = false;
                return this._Formats.W_abbreviated;
            case Y.Date.DATE_FORMATS.M_LONG:
                this._relative = false;
                return this._Formats.M_long;
            case Y.Date.DATE_FORMATS.M_ABBREVIATED:
                this._relative = false;
                return this._Formats.M_abbreviated;
            case Y.Date.DATE_FORMATS.YMD_FULL:
                return this._Formats.YMD_full;
            default:
                Y.error("Date format given does not exist");	//Error no such pattern.
        }
    },
        
    /**
     * Generate time pattern for selected format. For internal use only
     * @method _generateTimePattern
     * @private
     * @return {String} Time pattern
     */
    _generateTimePattern: function() {
        var format = this._timeFormat;
        if(format && Y.Lang.isString(format)) {
            format = Y.Date.TIME_FORMATS[format];
        }
    
        if(format === null) { return ""; }
        switch(format) {
            case Y.Date.TIME_FORMATS.NONE:
                return "";
            case Y.Date.TIME_FORMATS.HM_ABBREVIATED:
                return this._Formats.HM_abbreviated;
            case Y.Date.TIME_FORMATS.HM_SHORT:
                return this._Formats.HM_short;
            case Y.Date.TIME_FORMATS.H_ABBREVIATED:
                return this._Formats.H_abbreviated;
            default:
                Y.error("Time format given does not exist");	//Error no such pattern.
        }
    },
    
    /**
     * Generate time-zone pattern for selected format. For internal use only.
     * @method _generateTimeZonePattern
     * @private
     * @return {String} Time-Zone pattern
     */
    _generateTimeZonePattern: function() {
        var format = this._timeZoneFormat;
        if(format && Y.Lang.isString(format)) {
            format = Y.Date.TIMEZONE_FORMATS[format];
        }
    
        if(format === null) { return ""; }
        switch(format) {
            case Y.Date.TIMEZONE_FORMATS.NONE:
                return "";
            case Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED:
                return "z";
            case Y.Date.TIMEZONE_FORMATS.Z_SHORT:
                return "Z";
            default:
                Y.error("Time Zone format given does not exist");	//Error no such pattern.
        }
    },
    
    /**
     * Generate pattern for selected date, time and time-zone formats. For internal use only
     * @method _generatePattern
     * @private
     * @return {String} Combined pattern for date, time and time-zone
     */
    _generatePattern: function() {
        var datePattern = this._generateDatePattern(),
            timePattern = this._generateTimePattern(),
            timeZonePattern = this._generateTimeZonePattern(),
            pattern = "";

        //Combine patterns. Mark date pattern part, to use with relative dates.
        if(datePattern !== "") {
            datePattern = "'<datePattern>'" + datePattern + "'</datePattern>'";
        }
        
        if(timePattern !== "" && timeZonePattern !== "") {
            pattern = this._Formats.DateTimeTimezoneCombination;
        } else if (timePattern !== "") {
            pattern = this._Formats.DateTimeCombination;
        } else if(timeZonePattern !== "") {
            pattern = this._Formats.DateTimezoneCombination;
        } else if(datePattern !== ""){
            //Just date
            pattern = "{1}";
        }
        
        pattern = pattern.replace("{0}", timePattern).replace("{1}", datePattern).replace("{2}", timeZonePattern);
        
        //Remove unnecessary whitespaces
        pattern = Y.Lang.trim(pattern.replace(/\s\s+/g, " "));

        return pattern;
    },

    /**
     * Formats a date
     * @method format
     * @param {Date} date The date to be formatted.
     * @return {String} The formatted string
     */
    format: function(date) {
        if(date === null || !Y.Lang.isDate(date)) {
            Y.error("format called without a date.");
        }
        
        var offset = this._timeZoneInstance.getRawOffset() * 1000,
            relativeDate = null,
            today = new Date(),
            tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000),
            yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + offset);

        if(this._relative) {
            if(date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
                relativeDate = this._Formats.today;
            }

            if(date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate()) {
                relativeDate = this._Formats.tomorrow;
            }

            if(date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()) {
                relativeDate = this._Formats.yesterday;
            }
        }

        return this._dateFormatInstance.format(date, relativeDate);
    }
}, true);
