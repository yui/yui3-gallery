/**
 * Number formatter
 * @class NumberFormatter
 * @extends MsgBaseFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.NumberFormatter = function(values) {
    NumberFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "integer": 4 /*Y.Number.STYLES.NUMBER_STYLE*/,
        "percent": 8 /*Y.Number.STYLES.PERCENT_STYLE*/,
        "currency": 1 /*Y.Number.STYLES.CURRENCY_STYLE*/
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*number\\s*(,\\s*(\\w+)\\s*)?}";
};

NumberFormatter = Y.Intl.NumberFormatter;
Y.extend(NumberFormatter, Formatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
NumberFormatter.createInstance = function(values) {
    return new NumberFormatter(values);
};

Y.mix(NumberFormatter.prototype, {
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
            params.style = "integer";	//If no style, default to medium
            params.showDecimal = true;	//Show decimal parts too
        }

        if(!this.styles[params.style]) {	//Invalid style
            return false;
        }

        if(params.key && Formatter.prototype.getParams.call(this, params)) {
            return true;
        }

        return false;
    },

    /**
     * Format all instances in str that can be handled by NumberFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @return {String} Formatted result
     */
    format: function(str) {
        if(Y.Number === undefined || !Y.Number.__advancedFormat) { return str; }
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params, config;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                //Got a match
                config = {
                    style: this.styles[params.style]
                };
                if(params.style === "integer" && !params.showDecimal) {
                    config.parseIntegerOnly = true;
                }
                str = str.replace(matches[0], Y.Number.format(params.value, config));
            }
        }

        return str;
    }
}, true);
