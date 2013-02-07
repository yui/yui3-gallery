/**
 * Plural formatter. Select ouput based on whether value of key is singular/plural
 * @class PluralFormatter
 * @extends SelectFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.PluralFormatter = function(values) {
    PluralFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*plural\\s*,\\s*";
};

PluralFormatter = Y.Intl.PluralFormatter;
Y.extend(PluralFormatter, SelectFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
PluralFormatter.createInstance = function(values) {
    return new PluralFormatter(values);
};

/**
 * Select output depending on params.value from options
 * @method select
 * @param options {Object} Object containing results for singular/plural
 * @param params {Object} Object containing value
 * @return {String} selected result
 */
PluralFormatter.prototype.select = function(options, params) {
    var result = options.other;
    if(params.value === 0 && options.zero) {
        result = options.zero;
    }
    if(params.value === 1 && options.one) {
        result = options.one;
    }
    if(params.value === 2 && options.two) {
        result = options.two;
    }

    result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    return result;
};
