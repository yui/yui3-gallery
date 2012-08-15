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
_yuitest_coverage["/build/gallery-handlebars-loader/gallery-handlebars-loader.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-handlebars-loader/gallery-handlebars-loader.js",
    code: []
};
_yuitest_coverage["/build/gallery-handlebars-loader/gallery-handlebars-loader.js"].code=["YUI.add('gallery-handlebars-loader', function(Y) {","","var HandlebarsLoader = function(cfg) {","    HandlebarsLoader.superclass.constructor.apply(this, arguments);","};","","HandlebarsLoader.NAME = \"HandlebarsLoader\";","","Y.extend(HandlebarsLoader, Y.Base, {","	templates : {},","	/**","	* Retrieves the raw content of the Handlebars template","	*/","	raw: function(id){","		var el = Y.one('#' + id);","		if(el){","			return el.get('innerHTML');","		}","		return null;","	},","	/**","	* Precompiles an array of templates and stores the result in the cache","	*/","	preCompile: function(ids){","		for(var x =0;x < ids.length;x++){","			this.template(ids[x]);","		}","	},","	/**","	* Retrieve a compiled template by node id","	*/","	template: function(id){","		var self = this, raw;","		","		if(!Y.Object.hasKey(this.templates,id)){","		","			raw = this.raw(id);","			","			if(raw === null){","				if(this.get('autoLoad')){","					this.load(","						this.get('comboLoader') + this.get('idConvert')(id),","						{","							process:true,","							sync:true","						}","					);","				}","			}else{","				this.templates[id] = Y.Handlebars.compile(raw);","			}","		}","		","		return this.templates[id];","	},","	/**","	* Load one or more handlebars templates and put the resulting content in the header","	* templates are expected to have a encompassing <script id=\"some-id\" type=\"text/x-handlebars-template\">","	* url: The url that retrieves the templates","	* config.process: Compiles the template after loading","	* config.sync: Executes the load in a synchronous manner. Necessary if you use load as part of a view initialization","	* config.callback: Define a callback function that is called with the resulting compiled template (requires process to be true)","	*/","	load:function(url, config){","		Y.io(url,{","			sync:config.sync || false,","			on:{","				success:function(transactionId, response){","					var hd = Y.one('head');","					hd.append(response.responseText);","					","					if(config.process){","						hd.all('script[type=\"text/x-handlebars-template\"]').each(","							function(node){","								var tmp = this.template(node.get('id'));","							","								if(config.callback){","									config.callback(tmp);									","								}","								","							}, ","						this);","					}","				},","				failure:function(){","					throw \"Handlebars: failed to retrieve url: \" + url;","				}","			},","			context:this","		});","	},","	/**","	* Clears the cache","	*/","	clear: function(id){","		if(id){","			delete this.templates[id];","		}else{","			this.templates = {};","		}","	},destructor:function(){","		this.templates = null;","	}","},{","	ATTRS: {","		/**","		 * turns on autoLoading through the comboLoader/idConvert","		 */","		autoLoad:{","			value : false","		},","		/**","		 * comboloader url to be used in autoload scenario's","		 */","		comboLoader:{},","		/**","		 * the idConvert function is intended to automatically convert a supplied id into a remote loadable file reference","		 * e.g. inbox-message_en-hbs is converted to en/inbox/message.hbs","		 */","		idConvert:{","			value:function(id){","				return id;","			}","		}","	}","});","Y.namespace('MSA');","Y.MSA.HandlebarsLoader = HandlebarsLoader;","","","}, 'gallery-2012.08.15-20-00' ,{requires:['node-base','handlebars-base','handlebars-compiler','base-base','io-base'], skinnable:false});"];
_yuitest_coverage["/build/gallery-handlebars-loader/gallery-handlebars-loader.js"].lines = {"1":0,"3":0,"4":0,"7":0,"9":0,"15":0,"16":0,"17":0,"19":0,"25":0,"26":0,"33":0,"35":0,"37":0,"39":0,"40":0,"41":0,"50":0,"54":0,"65":0,"69":0,"70":0,"72":0,"73":0,"75":0,"77":0,"78":0,"86":0,"96":0,"97":0,"99":0,"102":0,"122":0,"127":0,"128":0};
_yuitest_coverage["/build/gallery-handlebars-loader/gallery-handlebars-loader.js"].functions = {"HandlebarsLoader:3":0,"raw:14":0,"preCompile:24":0,"template:32":0,"(anonymous 2):74":0,"success:68":0,"failure:85":0,"load:64":0,"clear:95":0,"destructor:101":0,"value:121":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-handlebars-loader/gallery-handlebars-loader.js"].coveredLines = 35;
_yuitest_coverage["/build/gallery-handlebars-loader/gallery-handlebars-loader.js"].coveredFunctions = 12;
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 1);
YUI.add('gallery-handlebars-loader', function(Y) {

_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 3);
var HandlebarsLoader = function(cfg) {
    _yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "HandlebarsLoader", 3);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 4);
HandlebarsLoader.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 7);
HandlebarsLoader.NAME = "HandlebarsLoader";

_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 9);
Y.extend(HandlebarsLoader, Y.Base, {
	templates : {},
	/**
	* Retrieves the raw content of the Handlebars template
	*/
	raw: function(id){
		_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "raw", 14);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 15);
var el = Y.one('#' + id);
		_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 16);
if(el){
			_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 17);
return el.get('innerHTML');
		}
		_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 19);
return null;
	},
	/**
	* Precompiles an array of templates and stores the result in the cache
	*/
	preCompile: function(ids){
		_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "preCompile", 24);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 25);
for(var x =0;x < ids.length;x++){
			_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 26);
this.template(ids[x]);
		}
	},
	/**
	* Retrieve a compiled template by node id
	*/
	template: function(id){
		_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "template", 32);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 33);
var self = this, raw;
		
		_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 35);
if(!Y.Object.hasKey(this.templates,id)){
		
			_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 37);
raw = this.raw(id);
			
			_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 39);
if(raw === null){
				_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 40);
if(this.get('autoLoad')){
					_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 41);
this.load(
						this.get('comboLoader') + this.get('idConvert')(id),
						{
							process:true,
							sync:true
						}
					);
				}
			}else{
				_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 50);
this.templates[id] = Y.Handlebars.compile(raw);
			}
		}
		
		_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 54);
return this.templates[id];
	},
	/**
	* Load one or more handlebars templates and put the resulting content in the header
	* templates are expected to have a encompassing <script id="some-id" type="text/x-handlebars-template">
	* url: The url that retrieves the templates
	* config.process: Compiles the template after loading
	* config.sync: Executes the load in a synchronous manner. Necessary if you use load as part of a view initialization
	* config.callback: Define a callback function that is called with the resulting compiled template (requires process to be true)
	*/
	load:function(url, config){
		_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "load", 64);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 65);
Y.io(url,{
			sync:config.sync || false,
			on:{
				success:function(transactionId, response){
					_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "success", 68);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 69);
var hd = Y.one('head');
					_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 70);
hd.append(response.responseText);
					
					_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 72);
if(config.process){
						_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 73);
hd.all('script[type="text/x-handlebars-template"]').each(
							function(node){
								_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "(anonymous 2)", 74);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 75);
var tmp = this.template(node.get('id'));
							
								_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 77);
if(config.callback){
									_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 78);
config.callback(tmp);									
								}
								
							}, 
						this);
					}
				},
				failure:function(){
					_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "failure", 85);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 86);
throw "Handlebars: failed to retrieve url: " + url;
				}
			},
			context:this
		});
	},
	/**
	* Clears the cache
	*/
	clear: function(id){
		_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "clear", 95);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 96);
if(id){
			_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 97);
delete this.templates[id];
		}else{
			_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 99);
this.templates = {};
		}
	},destructor:function(){
		_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "destructor", 101);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 102);
this.templates = null;
	}
},{
	ATTRS: {
		/**
		 * turns on autoLoading through the comboLoader/idConvert
		 */
		autoLoad:{
			value : false
		},
		/**
		 * comboloader url to be used in autoload scenario's
		 */
		comboLoader:{},
		/**
		 * the idConvert function is intended to automatically convert a supplied id into a remote loadable file reference
		 * e.g. inbox-message_en-hbs is converted to en/inbox/message.hbs
		 */
		idConvert:{
			value:function(id){
				_yuitest_coverfunc("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", "value", 121);
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 122);
return id;
			}
		}
	}
});
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 127);
Y.namespace('MSA');
_yuitest_coverline("/build/gallery-handlebars-loader/gallery-handlebars-loader.js", 128);
Y.MSA.HandlebarsLoader = HandlebarsLoader;


}, 'gallery-2012.08.15-20-00' ,{requires:['node-base','handlebars-base','handlebars-compiler','base-base','io-base'], skinnable:false});
