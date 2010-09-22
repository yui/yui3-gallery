(function() {
    
    var RAPHAEL_SRC = {
        raw: 'http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael.js',
        min: 'http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael-min.js'
    };
    
    function RaphaelLoader(opts) {
        var NAME = 'RaphaelLoader',
            loadedScripts = {},
            opts = opts || {},
            defaults = {
                type: 'min'
            };
        opts = Y.mix(opts, defaults);
        return {
            use: function() {
				var self = this, scriptOpts = {},
				    plugins = Y.Lang.isArray(arguments[0]) ? arguments[0] : (Y.Lang.isString(arguments[0]) ? [arguments[0]] : []);

			    this.callback = Y.Lang.isFunction(arguments[0]) ? arguments[0] : arguments[1];
                scriptOpts.onSuccess = function(d) { 
                    Y.log('raphael.js is loaded');
                    loadedScripts[RAPHAEL_SRC[opts.type]] = true;
                    Y.Array.each(plugins, function(plugin) {
    				    loadedScripts[plugin] = false;
    				    Y.Get.script(plugin, {
    				        onSuccess: function(d) {
    				            self._ready.call(self, d);
    				        }
    				    });
    				});
                };
                scriptOpts.onFailure = function(d) { 
                    self._ready.call(self, d);
                };
                scriptOpts.onEnd = function(d) {
                    self._ready.call(self, d);
                }

                loadedScripts[RAPHAEL_SRC[opts.type]] = false;
				Y.Get.script( RAPHAEL_SRC[opts.type], scriptOpts );
				
            },
            _ready: function(d) {
                var files = [], rdy = true;
                Y.Array.each(d.nodes, function(script) {
                    var name = script.getAttribute('src');
                    loadedScripts[name] = true;
                    Y.log(name + ' ready');
                });
                
                Y.log('checking for loaded scripts...');
                Y.Object.each(loadedScripts, function(v, k, o) {
                    if (!v) {
                        Y.log('not ready. missing ' + k);
                        rdy = false;
                        return;
                    }
                });
                
                if (!rdy) return;
                
                var oldR = Raphael;
			    var newR = function() {
			        Y.log('getting Raphael through YUI...', 'info', NAME);
			        var R = oldR.apply(oldR, arguments);
			        return applyEventAugmentation(R);
			    };
			    this.callback(newR);
            }
        };
    }
    
    function applyEventAugmentation(r) {
        var i=0, vectors = ['rect', 'circle', 'ellipse', 'path', 'text'], cache = {};
        Y.Array.each(vectors, function(fnName) {
            cache[fnName] = r[fnName];
            r[fnName] = function() {
                Y.log('call to internally replaced "' + fnName + '" function');
                var inst = cache[fnName].apply(r, arguments);
                inst.$node = new Y.Node(inst.node);
                return Y.augment(inst, Y.EventTarget);
            };
        });
        return r;
    }
    
    Y.Raphael = RaphaelLoader;
    
}());