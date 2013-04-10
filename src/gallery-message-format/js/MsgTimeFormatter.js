/**
 * Time formatter
 * @class TimeFormatter
 * @extends DateFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.TimeFormatter = function(values) {
    TimeFormatter.superclass.constructor.call(this, values);
    this.styles = {
        "short": [ 0, 2 /*Y.Date.TIME_FORMATS.HM_SHORT*/, 0 ],
        "medium": [ 0, 1 /*Y.Date.TIME_FORMATS.HM_ABBREVIATED*/, 0 ],
        "long": [ 0, 1 /*Y.Date.TIME_FORMATS.HM_ABBREVIATED*/, 2 /*Y.Date.TIMEZONE_FORMATS.Z_SHORT*/ ],
        "full": [ 0, 1 /*Y.Date.TIME_FORMATS.HM_ABBREVIATED*/, 1 /*Y.Date.TIMEZONE_FORMATS.Z_ABBREVIATED*/ ]
    };
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*time\\s*(,\\s*(\\w+)\\s*)?}";
};

TimeFormatter = Y.Intl.TimeFormatter;
Y.extend(TimeFormatter, DateFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
TimeFormatter.createInstance = function(values) {
    return new TimeFormatter(values);
};
