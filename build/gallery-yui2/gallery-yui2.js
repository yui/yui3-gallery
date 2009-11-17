YUI.add('gallery-yui2', function(Y) {

/**
* <p>The YUI 2 wrapper makes it easy to transform existing YUI 2 code into YUI 3 compatible code, 
* using lazy load to include the required yui2 modules, Leveraging YUI Loader Utility.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "gallery-yui2".  This will <br>
* 		//	load a wrapper for YUI 2 code. This wrapper will allow you to define<br>
*       //  yui 2 dependencies, and wrapping yui 2 code using lazy load using YUI 2 Loader<br>
*       //  to include those dependencies. <br>
* <br>
* 		YUI().use("gallery-yui2", function(Y) { <br>
* <br>
* 			Y.yui2().use("tabview", function () { <br>
* <br>
* 				//	The scope of the callback will be a reference to Y <br>
* <br>			
* 				var myTabs = new YAHOO.widget.TabView("demo"); <br>
* <br>
* 			}); <br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
* 
* @module gallery-yui2
*/


//	Util shortcuts

var Env = Y.Env,
	_config = ((typeof YAHOO_config == "undefined" || !YAHOO_config)?{}:YAHOO_config),
	_base = _config.base || 'http://yui.yahooapis.com/2.8.0/build/',
	_seed = _config.seed || 'yuiloader/yuiloader-min.js',
	_ready = !(typeof YAHOO == "undefined" || !YAHOO || !YAHOO.util || !YAHOO.util.YUILoader),
	_loader,
	_useQueue;

/**
 * Initialization process for the YUI Loader obj. In YUI 2.x we should
 * have a single instance to control everything.
 * @method _initLoader
 * @private
 * @static
 * @param l configuration object, normally a reference to YAHOO_config
 * @return object
 */
function _initLoader (l) {
	/* creating the loader object */
	l.combine = l.combine || true; /* using the Combo Handle by default */
	l.filter = l.filter || 'min';  /* using production mode by default */
	return (new YAHOO.util.YUILoader(l));	
}

/**
 * Add a module to the queue. When the loader become available, the module will be added to the loader list automatically, 
 * this method also normalize the module information before include it
 * @method _register
 * @private
 * @static
 * @param name {string} name of the module
 * @param m {string|object} module meta-data
 * @return void
 */
function _register (name, m) {
	// adding a module to the queue 
	if (Y.isObject(m)) {
		m.name = m.name || name;
		m.type = m.type || ((m.fullpath || m.path).indexOf('.css')>=0?'css':'js');
		Env._legacy._useQueue.add ({
			fn: function () {
				Env._legacy._loader.addModule (m);
			},
			autoContinue: true
		});
	}
} 

/**
 * Verify if the current configuration object just defines new modules. If that's the case, 
 * we will use "_config" as the computed configuration, and "o" as the list of modules to add.
 * @method _filterConf
 * @param o {object} currrent configuration object
 * @private
 * @static
 * @return void
 */
function _filterConf(o) {
	o = o || {};
	var m = o.modules || {},
		i;
	for (i in m) {
	  	if (m.hasOwnProperty(i)) {
	  		_register(i, m[i]);
		}
	}
	return o;
}

// preparing the queue and loading yui2 loader if needed
if (!Env._legacy) {
	Env._legacy = {_useQueue: new Y.AsyncQueue()};
	if (!_ready) {
		// loading the loader
		Env._legacy._useQueue.add ({
			fn: function () {
				YUI ({
					modules: {
						'yui2-yuiloader': {
							fullpath: _base+_seed
						}
					}
				}).use ('yui2-yuiloader', function (X, result) {
					if (result.success) {
						Env._legacy._loader = _initLoader(_config);
						Env._legacy._useQueue.run();
					} else {
					}
				});
			},
			autoContinue: false
		}).run();
	}
	// registering the default set of modules defined by YAHOO_config
	_config = _filterConf(_config);
}

/**
 * The yui2 is a utility to load YUI 2 modules within a YUI 3 Sandbox object. This utility is very handy
 * for incremental migration. It provides an easy way to bring YUI 2 code into YUI 3 world,
 * relying in YUI 3 lazy loading system and organization, and providing an easy way to mashup
 * yui2 and yui3 code. It uses a YUI 2 Loader under the hook so you don't need to worry about dependencies,
 * and it also provides a pipeline to add custom YUI 2 modules, and a filter by type (css or JS) during the
 * loading process.
 *
 * @class yui2
 */
 
/**
 * Mimic YUI 3 systax to load yui 2 modules.
 * 
 * @method yui2
 * @static
 * @public
 * @param o Optional configuration object.  Options:
 * <ul>
 *  <li>type:
 *  js or css, by default the loader will include both</li>
 *  <li>timeout:
 *  number of milliseconds before a timeout occurs when dynamically loading nodes.  in not set, there is no timeout</li>
 *  <li>modules:
 *  A list of module definitions.  See Loader.addModule for the supported module metadata</li>
 * </ul>
 */
Y.yui2 = function (o) {
	o = _filterConf(o);
	return {
		/**
	     * Load a set of modules and notify thru the callback method.
	     * @method use
	     * @param modules* {string} 1-n modules to bind (uses arguments array)
	     * @param *callback {function} callback function executed when 
	     * the instance has the required functionality.  If included, it
	     * must be the last parameter.
	     *
	     * Y.yui2().use('tabview', callback)
	     *
	     * @return void
	     */
		use: function () {
			var a=Array.prototype.slice.call(arguments, 0),
				callback = a.pop (),
				_queue = Env._legacy._useQueue;

			_queue.add ({
				fn: function () {
					var _loader = Env._legacy._loader;
					_loader.require(a);
					_loader.insert({
						onSuccess: function (o) {
							_queue.run();
							callback.apply(Y, [Y, {success: o}]);
						},
						onFailure: function(o){
							_queue.run();
							callback.apply(Y, [Y, {failure: o}]);
						},
						onTimeout: function () {
							_queue.run();
							callback.apply(Y, [Y, {failure: { timeout: true }}]);
						}
					}, o.type);
				},
				autoContinue: false
			});
			// verifying if the loader is ready in the page, if not, it will be 
			// included automatically and then the process will continue.
			if (!_queue.isRunning() && _queue.size()===1) {
				_queue.run ();
			}
		}
	};
};


}, 'gallery-2009.11.17-23' ,{requires:['node-base', 'get', 'async-queue']});
