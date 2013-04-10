/**
 * Date formatter
 * @class DateFormatter
 * @extends MsgBaseFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.DateFormatter = function(values) {
    DateFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "short":  [ 512 /*Y.Date.DATE_FORMATS.YMD_SHORT*/, 0, 0 ],
        "medium": [ 256 /*Y.Date.DATE_FORMATS.YMD_ABBREVIATED*/,0, 0 ],
        "long":   [ 128 /*Y.Date.DATE_FORMATS.YMD_LONG*/, 0, 0 ],
        "full":   [ 1 /*Y.Date.DATE_FORMATS.WYMD_LONG*/, 0, 0 ]
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*date\\s*(,\\s*(\\w+)\\s*)?}";
};

DateFormatter = Y.Intl.DateFormatter;
Y.extend(DateFormatter, Formatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
DateFormatter.createInstance = function(values) {
    return new DateFormatter(values);
};

Y.mix(DateFormatter.prototype, {
    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store the values key, value, style in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(matches) {
            if(matches[1]) {
                params.key = matches[1];
            }
            if(matches[3]) {
                params.style = matches[3];
            }
        }

        if(!params.style) {
            params.style = "medium";
        }			//If no style, default to medium

        if(!this.styles[params.style]) {
            return false;
        }	//Invalid style

        if(params.key && Formatter.prototype.getParams.call(this, params)) {
            return true;
        }

        return false;
    },

    /**
     * Format all instances in str that can be handled by DateFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @param [config] {Object} Optional configuration parameters. Used to pass timezone for time formatting
     * @return {String} Formatted result
     */
    format: function(str, config) {
        if(Y.Date === undefined || !Y.Date.__advancedFormat ) { return str; }
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params, style, result;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                //Got a match
                style = this.styles[params.style];
                result = Y.Date.format(new Date(params.value), {
                    timezone: config.timezone || Formatter.getCurrentTimeZone(),
                    dateFormat: style[0],
                    timeFormat: style[1],
                    timezoneFormat: style[2]
                });
                str = str.replace(matches[0], result);
            }

        }

        return str;
    }
}, true);
