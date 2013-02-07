/**
 * YDurationFormat class formats time in a language independent manner.
 * The duration formats use appropriate singular/plural/paucal/etc. forms for all languages.
 */

Y.mix(Y.Number, {
    /**
     * Strip decimal part of argument and return the integer part
     * @method _stripDecimals
     * @static
     * @private
     * @for Number
     * @param floatNum A real number
     * @return Integer part of floatNum
     */
    _stripDecimals: function (floatNum) {
        return floatNum > 0 ? Math.floor(floatNum): Math.ceil(floatNum);
    }
});

/**
 * YDurationFormat class formats time in a language independent manner.
 * @class __YDurationFormat
 * @namespace Date
 * @private
 * @constructor
 * @param style {Number|String} selector for the desired duration format. Can be key/value from Y.Date.DURATION_FORMATS
 */
Y.Date.__YDurationFormat = function(style) {
    if(style && Y.Lang.isString(style)) {
        style = Y.Date.DURATION_FORMATS[style];
    }
    this.style = style;
    this.patterns = Y.Intl.get(MODULE_NAME);
};

YDurationFormat = Y.Date.__YDurationFormat;

Y.mix(Y.Date, {
    /**
     * Format Style values to use during format/parse of Duration values
     * @property DURATION_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    DURATION_FORMATS: {
        HMS_LONG: 0,
        HMS_SHORT: 1
    }
});

Y.mix(YDurationFormat, {
    /**
     * Parse XMLDurationFormat (PnYnMnDTnHnMnS) and return an object with hours, minutes and seconds
     * Any absent values are set to -1, which will be ignored in HMS_long, and set to 0 in HMS_short
     * Year, Month and Day are ignored. Only Hours, Minutes and Seconds are used
     * @method _getDuration_XML
     * @static
     * @private
     * @for Date.__YDurationFormat
     * @param {String} xmlDuration XML Duration String.
     *      The lexical representation for duration is the [ISO 8601] extended format PnYnMnDTnHnMnS,
     *      where nY represents the number of years, nM the number of months, nD the number of days,
     *      'T' is the date/time separator,
     *      nH the number of hours, nM the number of minutes and nS the number of seconds.
     *      The number of seconds can include decimal digits to arbitrary precision.
     * @return {Object} Duration as an object with the parameters hours, minutes and seconds.
     */
    _getDuration_XML: function (xmlDuration) {
        var regex = new RegExp(/P(\d+Y)?(\d+M)?(\d+D)?T(\d+H)?(\d+M)?(\d+(\.\d+)?S)/),
            matches = xmlDuration.match(regex);
        
        if(matches === null) {
            Y.error("xmlDurationFormat should be in the format: 'PnYnMnDTnHnMnS'");
        }
        
        return {
            hours: parseInt(matches[4] || -1, 10),
            minutes: parseInt(matches[5] || -1, 10),
            seconds: parseFloat(matches[6] || -1, 10)
        };
    },
    
    /**
     * Get duration from time in seconds.
     * The value should be integer value in seconds, and should not be negative.
     * @method _getDuration_Seconds
     * @static
     * @private
     * @param {Number} timeValueInSeconds Duration in seconds
     * @return {Object} Duration as an object with the parameters hours, minutes and seconds.
     */
    _getDuration_Seconds: function (timeValueInSeconds) {
        var duration = {};
        if(timeValueInSeconds < 0) {
            Y.error("TimeValue cannot be negative");
        }
                
        duration.hours = Y.Number._stripDecimals(timeValueInSeconds / 3600);
                
        timeValueInSeconds %= 3600;
        duration.minutes = Y.Number._stripDecimals(timeValueInSeconds / 60);
                
        timeValueInSeconds %= 60;
        duration.seconds = timeValueInSeconds;
        
        return duration;
    }
});
    
/**
 * Formats the given value into a duration format string.
 * For XML duration format, the string should be in the pattern PnYnMnDTnHnMnS.
 * Please note that year, month and day fields are ignored in this version.
 * For future compatibility, please do not pass Year/Month/Day in the parameter.
 *
 * For hours, minutes, and seconds, any absent or negative parts are ignored in HMS_long format,
 * but are treated as 0 in HMS_short format style.
 *
 * @method
 * @private
 * @param oDuration {String|Number|Object} Duration as time in seconds (Integer),
          XML duration format (String), or an object with hours, minutes and seconds
 * @return {String} The formatted string
 */
YDurationFormat.prototype.format = function(oDuration) {
    if(Y.Lang.isNumber(oDuration)) {
        oDuration = YDurationFormat._getDuration_Seconds(oDuration);
    } else if(Y.Lang.isString(oDuration)) {
        oDuration = YDurationFormat._getDuration_XML(oDuration);
    }
    
    var defaultValue = this.style === Y.Date.DURATION_FORMATS.HMS_LONG ? -1: 0,
        result = {
            hours: "",
            minutes: "",
            seconds: ""
        },
        resultPattern = "";

    if(oDuration.hours === undefined || oDuration.hours === null || oDuration.hours < 0) { oDuration.hours = defaultValue; }
    if(oDuration.minutes === undefined || oDuration.minutes === null || oDuration.minutes < 0) { oDuration.minutes = defaultValue; }
    if(oDuration.seconds === undefined || oDuration.seconds === null || oDuration.seconds < 0) { oDuration.seconds = defaultValue; }
   
    //Test minutes and seconds for invalid values
    if(oDuration.minutes > 59 || oDuration.seconds > 59) {
        Y.error("Minutes and Seconds should be less than 60");
    }
    
    if(this.style === Y.Date.DURATION_FORMATS.HMS_LONG) {
        resultPattern = this.patterns.HMS_long;
        if(oDuration.hours >= 0) {
            result.hours = Y.Number.format(oDuration.hours) + " " + (oDuration.hours === 1 ? this.patterns.hour : this.patterns.hours);
        }

        if(oDuration.minutes >= 0) {
            result.minutes = oDuration.minutes + " " + (oDuration.minutes === 1 ? this.patterns.minute : this.patterns.minutes);
        }

        if(oDuration.seconds >= 0) {
            result.seconds = oDuration.seconds + " " + (oDuration.seconds === 1 ? this.patterns.second : this.patterns.seconds);
        }
    } else {                                            //HMS_SHORT
        resultPattern = this.patterns.HMS_short;
        result = {
             hours: Y.Number.format(oDuration.hours),
             minutes: Y.Number._zeroPad(oDuration.minutes, 2),
             seconds: Y.Number._zeroPad(oDuration.seconds, 2)
        };
    }
        
    resultPattern = resultPattern.replace("{0}", result.hours);
    resultPattern = resultPattern.replace("{1}", result.minutes);
    resultPattern = resultPattern.replace("{2}", result.seconds);
       
    //Remove unnecessary whitespaces
    resultPattern = Y.Lang.trim(resultPattern.replace(/\s\s+/g, " "));
       
    return resultPattern;
};
