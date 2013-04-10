/**
 * YRelativeTimeFormat class provides localized formatting of relative time values such as "3 minutes ago".
 * Relative time formats supported are defined by how many units they may include.
 * Relative time is only used for past events. The Relative time formats use appropriate singular/plural/paucal/etc. forms for all languages.
 * In order to keep relative time formats independent of time zones, relative day names such as today, yesterday, or tomorrow are not used.
 */

/**
 * Class to handle relative time formatting
 * @class __YRelativeTimeFormat
 * @namespace Date
 * @private
 * @constructor
 * @param [style='ONE_UNIT_LONG'] {Number|String} Selector for the desired relative time format. Should be key/value from Y.Date.RELATIVE_TIME_FORMATS
 */
Y.Date.__YRelativeTimeFormat = function(style) {
    if(style === null) {
        style = Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_LONG;
    } else if(Y.Lang.isString(style)) {
        style = Y.Date.RELATIVE_TIME_FORMATS[style];
    }
        
    this.patterns = Y.Intl.get(MODULE_NAME);
    this.style = style;
		
    switch(style) {
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_OR_TWO_UNITS_ABBREVIATED:
            this.numUnits = 2;
            this.abbr = true;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_OR_TWO_UNITS_LONG:
            this.numUnits = 2;
            this.abbr = false;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_ABBREVIATED:
            this.numUnits = 1;
            this.abbr = true;
            break;
        case Y.Date.RELATIVE_TIME_FORMATS.ONE_UNIT_LONG:
            this.numUnits = 1;
            this.abbr = false;
            break;
        default:
            Y.error("Unknown style: Use a style from Y.Date.RELATIVE_TIME_FORMATS");
    }
};

YRelativeTimeFormat = Y.Date.__YRelativeTimeFormat;

Y.mix(Y.Date, {
    /**
     * Returns the current date. Used to calculate relative time. Change this parameter if you require comparison with different time.
     * @property
     * @type Number|function
     * @static
     */
    currentDate: function() { return new Date(); },

    /**
     * Format Style values to use during format/parse
     * @property RELATIVE_TIME_FORMATS
     * @type Object
     * @static
     * @final
     * @for Date
     */
    RELATIVE_TIME_FORMATS: {
        ONE_OR_TWO_UNITS_ABBREVIATED: 0,
        ONE_OR_TWO_UNITS_LONG: 1,
        ONE_UNIT_ABBREVIATED: 2,
        ONE_UNIT_LONG: 4
    }
});
	
/**
 * Formats a time value.
 * @method format
 * @for Date.__YRelativeTimeFormat
 * @param {Number} timeValue The time value (seconds since Epoch) to be formatted.
 * @param {Number} [relativeTo=Current Time] The time value (seconds since Epoch) in relation to which timeValue should be formatted.
          It must be greater than or equal to timeValue
 * @return {String} The formatted string
 */
YRelativeTimeFormat.prototype.format = function(timeValue, relativeTo) {
    if(relativeTo === null) {
        relativeTo = (new Date()).getTime()/1000;
        if(timeValue > relativeTo) {
            Y.error("timeValue must be in the past");
        }
    } else if(timeValue > relativeTo) {
        Y.error("relativeTo must be greater than or equal to timeValue");
    }

    var date = new Date((relativeTo - timeValue)*1000),
        result = [],
        numUnits = this.numUnits,
        value = date.getUTCFullYear() - 1970,	//Need zero-based index
        text, pattern, i;
        
    if(value > 0) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.years_abbr : this.patterns.year_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.years : this.patterns.year);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCMonth();
    if((numUnits > 0) && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.months_abbr : this.patterns.month_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.months : this.patterns.month);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCDate()-1;			//Need zero-based index
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.days_abbr : this.patterns.day_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.days : this.patterns.day);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCHours();
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.hours_abbr : this.patterns.hour_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.hours : this.patterns.hour);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCMinutes();
    if(numUnits > 0 && (numUnits < this.numUnits || value > 0)) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.minutes_abbr : this.patterns.minute_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.minutes : this.patterns.minute);
            result.push(text);
        }
        numUnits--;
    }

    value = date.getUTCSeconds();
    if(result.length === 0 || (numUnits > 0 && (numUnits < this.numUnits || value > 0))) {
        if(this.abbr) {
            text = value + " " + (value !== 1 ? this.patterns.seconds_abbr : this.patterns.second_abbr);
            result.push(text);
        } else {
            text = value + " " + (value !== 1 ? this.patterns.seconds : this.patterns.second);
            result.push(text);
        }
        numUnits--;
    }

    pattern = (result.length === 1) ? this.patterns["RelativeTime/oneUnit"] : this.patterns["RelativeTime/twoUnits"];
        
    for(i=0; i<result.length; i++) {
        pattern = pattern.replace("{" + i + "}", result[i]);
    }
    for(i=result.length; i<this.numUnits; i++) {
        pattern = pattern.replace("{" + i + "}", "");
    }
    //Remove unnecessary whitespaces
    pattern = Y.Lang.trim(pattern.replace(/\s+/g, " "));
        
    return pattern;
};
