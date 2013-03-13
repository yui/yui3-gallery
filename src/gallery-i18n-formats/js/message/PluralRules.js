/**
 * PluralRules is used to determine the plural form in MessageFormat
 * @class PluralRules
 * @namespace Intl
 * @static
 */
Y.Intl.PluralRules = {
    /**
     * Check if n is between start and end
     * @method _inRange
     * @static
     * @private
     * @param n {Number} Number to test
     * @param start {Number} Start of range
     * @param end {Number} End of range
     * @return {Boolean} true if n is between start and end, false otherwise
     */
    _inRange: function(n, start, end) {
        return n >= start && n <= end;
    },

    /**
     * Find matching plural form for the set of rules
     * @method _matchRule
     * @static
     * @private
     * @param rules {Object} Keys will be plural forms one,two,.. Values will be boolean
     * @return {String} Returns key that has value true
     */
    _matchRule: function(rules) {
        for(var key in rules) {
            if(rules[key]) { return key; }
        }
        return "other";
    },

    /**
     * Set of rules. Each locale will have a matching rule. The corresponding functions in each set
     * will take a number as parameter and return the relevant plural form.
     */
    rules: {
        set1: function(n) {
            var mod = n % 100;
            return PluralRules._matchRule({
                few:  inRange(mod, 3, 10),
                many: inRange(mod, 11, 99),
                one:  n === 1,
                two:  n === 2,
                zero: n === 0
            });
        },

        set2: function(n) {
            return PluralRules._matchRule({
               many: n !== 0 && n%10 === 0,
               one:  n === 1,
               two:  n === 2
            });
        },

        set3: function(n) {
            return PluralRules._matchRule({
               one: n === 1
            });
        },

        set4: function(n) {
            return PluralRules._matchRule({
                one: inRange(n, 0, 1)
            });
        },

        set5: function(n) {
            return PluralRules._matchRule({
                one: inRange(n, 0, 2) && n !== 2
            });
        },

        set6: function(n) {
            return PluralRules._matchRule({
                one:  n%10 === 1 && n%100 !== 11,
                zero: n === 0
            });
        },

        set7: function(n) {
            return PluralRules._matchRule({
                one: n === 1,
                two: n === 2
            });
        },

        set8: function(n) {
            return PluralRules._matchRule({
                few:  inRange(n, 3, 6),
                many: inRange(n, 7, 10),
                one:  n === 1,
                two:  n === 2
            });
        },

        set9: function(n) {
            return PluralRules._matchRule({
                few: n === 0 || (n !== 1 && inRange(n%100, 1, 19)),
                one: n === 1
            });
        },

        set10: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few: inRange(mod10, 2, 9) && !inRange(mod100, 11, 19),
                one: mod10 === 1 && !inRange(mod100, 11, 19)
            });
        },

        set11: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few:  inRange(mod10, 2, 4) && !inRange(mod100, 12, 14),
                many: mod10 === 0 || inRange(mod10, 5, 9) || inRange(mod100, 11, 14),
                one:  mod10 === 1 && mod100 !== 11
            });
        },

        set12: function(n) {
            return PluralRules._matchRule({
                few: inRange(n, 2, 4),
                one: n === 1
            });
        },

        set13: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few:  inRange(mod10, 2, 4) && !inRange(mod100, 12, 14),
                many: n !== 1 && inRange(mod10, 0, 1) || inRange(mod10, 5, 9) || inRange(mod100, 12, 14),
                one:  n === 1
            });
        },

        set14: function(n) {
            var mod = n%100;
            return PluralRules._matchRule({
                few: inRange(mod, 3, 4),
                one: mod === 1,
                two: mod === 2
            });
        },

        set15: function(n) {
            var mod = n%100;
            return PluralRules._matchRule({
                few:  n === 0 || inRange(mod, 2, 10),
                many: inRange(mod, 11, 19),
                one:  n === 1
            });
        },

        set16: function(n) {
            return PluralRules._matchRule({
                one: n%10 === 1 && n !== 11
            });
        },

        set17: function(n) {
            return PluralRules._matchRule({
                few:  n === 3,
                many: n === 6,
                one:  n === 1,
                two:  n === 2,
                zero: n === 0
            });
        },

        set18: function(n) {
            return PluralRules._matchRule({
                one:  inRange(n, 0, 2) && n !== 0 && n !== 2,
                zero: n === 0
            });
        },

        set19: function(n) {
            return PluralRules._matchRule({
                few: inRange(n, 2, 10),
                one: inRange(n, 0, 1)
            });
        },

        set20: function(n) {
            var mod1 = n%10, mod2 = n%100, mod6 = n%1000000;
            return PluralRules._matchRule({
                few:  (inRange(mod1, 3, 4) || mod1 === 9) && !inRange(mod2, 10, 19) && !inRange(mod2, 70, 79) && !inRange(mod2, 90, 99),
                many: n !== 0 && mod6 === 0,
                one:  mod1 === 1 && mod2 !== 11 && mod2 !== 71 && mod2 !== 91,
                two:  mod1 === 2 && mod2 !== 12 && mod2 !== 72 && mod2 !== 92
            });
        },

        set21: function(n) {
            return PluralRules._matchRule({
                one:  n === 1,
                zero: n === 0
            });
        },

        set22: function(n) {
            return PluralRules._matchRule({
                one: inRange(n, 0, 1) || inRange(n, 11, 99)
            });
        },

        set23: function(n) {
            return PluralRules._matchRule({
                one: inRange(n%10, 1, 2) || n%20 === 0
            });
        },

        set24: function(n) {
            return PluralRules._matchRule({
                few: inRange(n, 3, 10) || inRange(n, 13, 19),
                one: n === 1 || n === 11,
                two: n === 2 || n === 12
            });
        },

        set25: function(n) {
            return PluralRules._matchRule({
                one: n === 1 || n === 5
            });
        },

        set26: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                one: (mod10 === 1 || mod10 === 2) && (mod100 !== 11 && mod100 !== 12)
            });
        },

        set27: function(n) {
            var mod10 = n%10, mod100 = n%100;
            return PluralRules._matchRule({
                few: mod10 === 3 && mod100 !== 13,
                one: mod10 === 1 && mod100 !== 11,
                two: mod10 === 2 && mod100 !== 12
            });
        },

        set28: function(n) {
            return PluralRules._matchRule({
                many: n === 11 || n === 8 || n === 80 || n === 800
            });
        },

        set29: function(n) {
            return PluralRules._matchRule({
                few: n === 4,
                one: n === 1 || n === 3,
                two: n === 2
            });
        },

        set30: function(n) {
            return PluralRules._matchRule({
                few: n === 4,
                one: n === 1,
                two: n === 2 || n === 3
            });
        },

        set31: function(n) {
            return PluralRules._matchRule({
                few:  n === 4,
                many: n === 6,
                one:  n === 1,
                two:  n === 2 || n === 3
            });
        },

        set32: function(n) {
            return PluralRules._matchRule({
                few:  n === 4,
                many: n === 6,
                one:  Y.Array.indexOf([1,5,7,8,9,10], n) > -1,
                two: n === 2 || n === 3
            });
        },

        set33: function(n) {
            return PluralRules._matchRule({
                few:  inRange(n, 2, 9),
                many: inRange(n, 10, 19) || inRange(n, 100, 199) || inRange(n, 1000, 1999),
                one:  n === 1
            });
        }
    }
};

PluralRules = Y.Intl.PluralRules;
inRange = PluralRules._inRange;
