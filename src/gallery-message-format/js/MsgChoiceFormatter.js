/**
 * Choice formatter. Select ouput based on numerical values
 * @class ChoiceFormatter
 * @extends SelectFormatter
 * @namespace Intl
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.ChoiceFormatter = function(values) {
    ChoiceFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*choice\\s*,\\s*(.+)}";
};

ChoiceFormatter = Y.Intl.ChoiceFormatter;
Y.extend(ChoiceFormatter, SelectFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
ChoiceFormatter.createInstance = function(values) {
    return new ChoiceFormatter(values);
};

Y.mix(ChoiceFormatter.prototype, {
    /**
     * Parse choices in pattern and get options array.
     * @method parseOptions
     * @param choicesStr {String} Choice string from pattern
     * @return {Array} Array of objects containing value(choice), result, and relation
     */
    parseOptions: function(choicesStr) {
        var options = [],
            choicesArray = choicesStr.split("|"),
            i, j, choice, relations, rel, mapping, ch;
        for (i=0; i<choicesArray.length; i++) {
            choice = choicesArray[i];
            relations = ['#', '<', '\u2264'];
            for (j=0; j<relations.length; j++) {
                rel = relations[j];
                if(choice.indexOf(rel) !== -1) {
                    mapping = choice.split(rel);
                    ch = {
                        value: parseInt(mapping[0], 10),
                        result: mapping[1],
                        relation: rel
                    };
                    options.push(ch);
                    break;
                }
            }
        }

        return options;
    },

    /**
     * Get parameters from regex match
     * @method getParams
     * @param params {Object} Object to receive value. Function will store the values key, value, choices in this variable
     * @param matches {Array} Result of regex match over pattern string.
     * @return {Boolean} True if value found, False otherwise
     */
    getParams: function(params, matches) {
        if(SelectFormatter.prototype.getParams.call(this, params, matches)) {
            if(matches[2]) {
                params.choices = this.parseOptions(matches[2]);
                return params.choices === [] ? false: true;
            }
        }

        return false;
    },

    /**
     * Select output depending on params.value from options in params.choices
     * @method select
     * @param params {Object} Object containing value and choices
     * @return {String} selected result
     */
    select: function(params) {
        var choice, value, result, relation, i;
        for (i=0; i<params.choices.length; i++) {
            choice = params.choices[i];
            value = choice.value, result = choice.result, relation = choice.relation;

            if( (relation === '#' && value === params.value) || (relation === '<' && value < params.value)
                || (relation === '\u2264' && value <= params.value)) {
                return result;
            }
        }

        return "";
    },

    /**
     * Format all instances in str that can be handled by ChoiceFormatter
     * @method format
     * @param str {String} Input string/pattern
     * @return {String} Formatted result
     */
    format: function(str) {
        var regex = new RegExp(this.regex, "gm"),
            matches = null,
            params, result;
        while((matches = regex.exec(str))) {
            params = {};

            if(this.getParams(params, matches)) {
                result = this.select(params);
                if(result) {
                    str = str.replace(matches[0], result);
                }
            }
        }

        return str;
    }
}, true);