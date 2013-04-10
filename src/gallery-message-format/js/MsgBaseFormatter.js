var MODULE_NAME = "gallery-message-format",
    PluralRules, inRange,
    Formatter, StringFormatter, DateFormatter, TimeFormatter, NumberFormatter,SelectFormatter,
    PluralFormatter, ChoiceFormatter, MsgListFormatter, formatters;

/**
 * Formatter base class
 * @class MsgBaseFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.MsgBaseFormatter = function(values) {
    this.values = values;
};

Formatter = Y.Intl.MsgBaseFormatter;

Y.mix(Formatter.prototype, {
    /**
     * Get value of key
     * @method getValue
     * @param key {String|Number} Key/index of value in the object/array 'values'
     * @return Value from the data in 'values'
     */
    getValue: function(key) {
        if(Y.Lang.isArray(this.values)) {
            key = parseInt(key, 10);
        }
        return this.values[key];
    },

    /**
     * Get value of params.key
     * The value found will be set to params.value
     * @method getParams
     * @param params {Object} Object containing key as in { key: "KEY" }
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params) {
        if(!params || !params.key) {
            return false;
        }

        var value = this.getValue(params.key);
	
        if(value !== undefined) {
            params.value = value;
            return true;
        }

        return false;
    },

    /**
     * Format string. Will be overridden in descendants
     * @method format
     */
    format: function(/*str, config*/) {
        Y.error('Not implemented');	//Must override in descendants
    }
});

//For date and time formatters
Y.mix(Formatter, {
    /**
     * Create an instance of the formatter
     * @method createInstance
     * @static
     * //param values {Array|Object} The data to be processed and inserted.
     */
    createInstance: function(/*values*/) {
        //return new Formatter(values);
        Y.error('Not implemented');	//Must override in descendants
    },

    /**
     * Get current timezone. Used for time format
     * @method getCurrentTimeZone
     * @return {Y.Date.Timezone}
     */
    getCurrentTimeZone: function() {
        if(Y.Date === undefined || Y.Date.Timezone === undefined) { return "GMT"; }
        var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;
        return Y.Date.Timezone.getTimezoneIdForOffset(systemTZoneOffset);
    }
});
