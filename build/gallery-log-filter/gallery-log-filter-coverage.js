if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-log-filter/gallery-log-filter.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-log-filter/gallery-log-filter.js",
    code: []
};
_yuitest_coverage["/build/gallery-log-filter/gallery-log-filter.js"].code=["YUI.add('gallery-log-filter', function(Y) {","","\"use strict\";","","/**"," * @module gallery-log-filter"," */","","/**********************************************************************"," * <p>Appends filters to the log output.</p>"," * "," * @main gallery-log-filter"," * @class LogFilter"," */","","Y.LogFilter =","{","	/**","	 * Adds a filter that filters out messages other than the given set of","	 * levels.","	 * ","	 * @method addLevelFilter","	 * @static","	 * @param levels {Array} List of log levels to pass through, e.g, `['error','warn']`.","	 */","	addLevelFilter: function(levels)","	{","		var orig_logFn = Y.config.logFn;","		Y.config.logFn = function(msg, cat, src)","		{","			if (Y.Array.indexOf(levels, cat) >= 0)","			{","				orig_logFn.apply(this, arguments);","			}","		};","	},","","	/**","	 * Adds a function to filter log messages.","	 * ","	 * @method addFilter","	 * @static","	 * @param filter {Function} Function to apply.  Called with `msg, cat, src`.  Returns `true` to pass the message.","	 */","	addFilter: function(filter)","	{","		var orig_logFn = Y.config.logFn;","		Y.config.logFn = function(msg, cat, src)","		{","			if (filter.call(this, msg, cat, src))","			{","				orig_logFn.apply(this, arguments);","			}","		};","	}","};","","","}, 'gallery-2012.08.15-20-00' );"];
_yuitest_coverage["/build/gallery-log-filter/gallery-log-filter.js"].lines = {"1":0,"3":0,"16":0,"28":0,"29":0,"31":0,"33":0,"47":0,"48":0,"50":0,"52":0};
_yuitest_coverage["/build/gallery-log-filter/gallery-log-filter.js"].functions = {"logFn:29":0,"addLevelFilter:26":0,"logFn:48":0,"addFilter:45":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-log-filter/gallery-log-filter.js"].coveredLines = 11;
_yuitest_coverage["/build/gallery-log-filter/gallery-log-filter.js"].coveredFunctions = 5;
_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 1);
YUI.add('gallery-log-filter', function(Y) {

_yuitest_coverfunc("/build/gallery-log-filter/gallery-log-filter.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 3);
"use strict";

/**
 * @module gallery-log-filter
 */

/**********************************************************************
 * <p>Appends filters to the log output.</p>
 * 
 * @main gallery-log-filter
 * @class LogFilter
 */

_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 16);
Y.LogFilter =
{
	/**
	 * Adds a filter that filters out messages other than the given set of
	 * levels.
	 * 
	 * @method addLevelFilter
	 * @static
	 * @param levels {Array} List of log levels to pass through, e.g, `['error','warn']`.
	 */
	addLevelFilter: function(levels)
	{
		_yuitest_coverfunc("/build/gallery-log-filter/gallery-log-filter.js", "addLevelFilter", 26);
_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 28);
var orig_logFn = Y.config.logFn;
		_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 29);
Y.config.logFn = function(msg, cat, src)
		{
			_yuitest_coverfunc("/build/gallery-log-filter/gallery-log-filter.js", "logFn", 29);
_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 31);
if (Y.Array.indexOf(levels, cat) >= 0)
			{
				_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 33);
orig_logFn.apply(this, arguments);
			}
		};
	},

	/**
	 * Adds a function to filter log messages.
	 * 
	 * @method addFilter
	 * @static
	 * @param filter {Function} Function to apply.  Called with `msg, cat, src`.  Returns `true` to pass the message.
	 */
	addFilter: function(filter)
	{
		_yuitest_coverfunc("/build/gallery-log-filter/gallery-log-filter.js", "addFilter", 45);
_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 47);
var orig_logFn = Y.config.logFn;
		_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 48);
Y.config.logFn = function(msg, cat, src)
		{
			_yuitest_coverfunc("/build/gallery-log-filter/gallery-log-filter.js", "logFn", 48);
_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 50);
if (filter.call(this, msg, cat, src))
			{
				_yuitest_coverline("/build/gallery-log-filter/gallery-log-filter.js", 52);
orig_logFn.apply(this, arguments);
			}
		};
	}
};


}, 'gallery-2012.08.15-20-00' );
