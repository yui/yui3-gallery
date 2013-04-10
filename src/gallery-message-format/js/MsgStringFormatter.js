/**
 * String formatter
 * @class StringFormatter
 * @namespace Intl
 * @extends MsgBaseFormatter
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.StringFormatter = function(values) {
    StringFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*}";
};

StringFormatter = Y.Intl.StringFormatter;
Y.extend(StringFormatter, Formatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
StringFormatter.createInstance = function(values) {
    return new StringFormatter(values);
};

Y.mix(StringFormatter.prototype, {
    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store key and value in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(matches && matches[1]) {
            params.key = matches[1];
            if(Formatter.prototype.getParams.call(this, params)) {
                return true;
            }
        }
	
        return false;
    },

    /**
     * Format all instances in str that can be handled by StringFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @return {String} Formatted result
     */
    format: function(str) {
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                //Got a match
                str = str.replace(matches[0], params.value);
            }

        }

        return str;
    }
}, true);