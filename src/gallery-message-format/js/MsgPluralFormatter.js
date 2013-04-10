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
    
    var formats = Y.Intl.get(MODULE_NAME),
        ruleSet = formats.pluralRule;

    if(ruleSet) {
         this.rule = PluralRules.rules[ruleSet];
    }

    if(this.rule === undefined) {
         this.rule = function() { return "other"; };
    }
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
    var pluralForm = this.rule(params.value),
        result = options[pluralForm];

    if(result === undefined || result === null) {
        result = options.other;
    }

    result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    return result;
};
