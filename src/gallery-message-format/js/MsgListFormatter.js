/**
 * List formatter
 * @class MsgListFormatter
 * @namespace Intl
 * @extends StringFormatter
 * @private
 * @constructor
 * @param values {Array|Object} The data to be processed and inserted.
 */
Y.Intl.MsgListFormatter = function(values) {
      MsgListFormatter.superclass.constructor.call(this, values);
      this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*list\\s*}";
};

MsgListFormatter = Y.Intl.MsgListFormatter;
Y.extend(MsgListFormatter, StringFormatter);

/**
 * Create an instance of the formatter
 * @method createInstance
 * @static
 * @param values {Array|Object} The data to be processed and inserted.
 */
MsgListFormatter.createInstance = function(values) {
     return new MsgListFormatter(values);
};

Y.mix(MsgListFormatter.prototype, {
     /**
      * Format all instances in str that can be handled by MsgListFormatter
      * @method format
      * @param str {String} Input string/pattern
      * @return {String} Formatted result
      */
     format: function(str) {
          if(Y.Intl === undefined || Y.Intl.ListFormatter === undefined || Y.Intl.ListFormatter.format === undefined) { return str; }
          var regex = new RegExp(this.regex, "gm"),
              matches = null,
              params;

          while((matches = regex.exec(str))) {
              params = {};

              if(this.getParams(params, matches)) {
                  //Got a match
                  str = str.replace(
                             matches[0],
                             Y.Intl.ListFormatter.format( params.value )
                  );
              }
          }

          return str;
     }
}, true);

