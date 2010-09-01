/**
 * Y.ParentWindow() function for YUI3
 * This utility provides a set of functionalities to interact with the parent window:
 * <ul>
 * <li> Controlling the parent window DOM structure through a Y instance. </li>
 * <li> Sandboxing all YUI driven modules within the iframe instance to avoid polluting the parent window. </li>
 * <li> Supporting multiple versions of YUI running in the same page without messing with the seed files. </li>
 * <li> etc. </li>
 * </ul>
 * Note that CSS modules will not be fetched to avoid polluting the parent window styles, 
 * you will have to handle this use-case manually.
 * 
 * @module gallery-parent-window
 */

/**
 * Generate a new Y instance running on top of the parent window DOM structure 
 * but using the iframe to load required modules.
 * @namespace Y
 * @class ParentWindow
 * @static
 * @param o* Up to four optional configuration objects. This object is stored
 * in YUI.config. See config for the list of supported properties.
 * @return {YUI} Y instance for parent window for chaining
 */

var res = {};
try {
	res.doc = (res.win = window.parent).document;
} catch (e) {
	Y.log('Error trying to access to the parent window property, check the cross domain policy details', 'error', 'gallery-parent-window');
	return;
}

Y.log('Creating new Y instance running on top of the parent window DOM structure', 'info', 'gallery-parent-window');
Y.ParentWindow = function(o2, o3, o4, o5) {
	var L = YUI({ fetchCSS: false }, o2, o3, o4, o5), // internal Y instance for loading purpose only.
		P = YUI({ fetchCSS: false, bootstrap: false, win: res.win, doc: res.doc }, o2, o3, o4, o5), // adding one more config to force to use the parent window as the base dom structure
		USE = P.use; // backing up the P.use

	//Dump the instance logs to the parent instance because it's hard to debug the iframe directly
	Y.log = P.log;

	// customizing the "use" method to load modules from the iframe, then inject them into the ParentWindow instance.
	P.use = function() {
		var SLICE 	 = Array.prototype.slice,
			args     = SLICE.call(arguments, 0),
			bk		 = SLICE.call(arguments, 0),
	        callback = args[args.length - 1],
			fn = function() {
				Y.log('Propagating new modules to the parent window instance', 'info', 'gallery-parent-window');
				USE.apply (P, bk);
			};
		
		// The last argument supplied to use can be a load complete callback
        if (typeof callback === 'function') {
            args.pop();
		} else {
			callback = null;
		}
		// propagating the callback call to the ParentWindow instance
		args.push(fn);

		// loading modules in the iframe doc
		Y.log('Adding new modules to the iframe instance', 'info', 'gallery-parent-window');
		L.use.apply(L, args);
		// chaining 
		return P;
	};
	// returning the parent window Y instance
	return P;
};