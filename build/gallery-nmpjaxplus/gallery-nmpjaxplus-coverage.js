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
_yuitest_coverage["/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js",
    code: []
};
_yuitest_coverage["/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js"].code=["YUI.add('gallery-nmpjaxplus', function(Y) {","","Y.PjaxPlus = Y.Base.create('pjaxplus', Y.Widget, [], { ","	initializer : function( config ) {","		// error checking for missing required variables","			","		this.set('history', new Y.History());","		this.set('historyhash', new Y.HistoryHash());","		this.set('html5support', Y.HistoryBase.html5);","		//this.set('html5support', false);","		this.ppCache = new Y.Cache({max:this.get('cacheNum')});","		this.domain = new RegExp('^(http|https):\\/\\/' + window.location.hostname.replace('.','\\.'));","			","		// remove leading dot from omitLinkClass, if any","		if (this.get('omitLinkClass').match(/^\\./)) {","			this.set('omitLinkClass', this.get('omitLinkClass').replace(/^\\./,''));","		}","	},","		","	initAjaxLinks : function() {","		var clickedLink,","		clickedTarget;","			","		if (this.get('html5support')) {","			// attach yui3-pjax class to links with REST-like URLs or URLs with permitted file extensions","			var goodext = false;","			Y.all('a:not(.' + this.get('omitLinkClass') + ')').each(function(node) {","				var pathnamearr = node.get('pathname').split(/\\//);","				var pathnameidx = pathnamearr.length - 1;","				var filename = pathnamearr[pathnameidx];","						","				if (!filename.match(/\\./)) {","					// no file extension, valid REST-like URL","					goodext = true;","				}","				else {","					// URL contains file extensions, look for permitted file extensions","					goodext = Y.Array.some(this.get('permittedFileExts'), function(ext) {","						var thisregex = new RegExp('\\.' + ext + '$');","						if (filename.match(thisregex)) {","							return true;","						}","					});","				}","					","				if (goodext && !node.get('href').match(/^(mailto|javascript):/) && !node.get('href').match(/^#/) && ","					node.get('href').match(this.domain) && !node.hasClass(this.get('omitLinkClass'))) {","						node.addClass('yui3-pjax');","					}","			}, this);","				","			var PjaxLoader = new Y.Pjax({","				addPjaxParam : this.get('addPjaxParam'),","				container: this.get('container'),","				contentSelector: this.get('contentSelector'),","				linkSelector: this.get('linkSelector'),","				navigateOnHash: this.get('navigateOnHash'),","				scrollToTop: this.get('scrollToTop'),","				timeout: this.get('timeout'),","				titleSelector: this.get('titleSelector')","			});","			","			// trigger start callback","			PjaxLoader.on('navigate', function(e) {","				// set var for currently clicked link","				clickedLink = e.originEvent.target.get('href');","				var html5support = this.get('html5support');			","					","				if (this.get('startCallbackFunc')) {		","					this.get('startCallbackFunc').call(null, {","						clickTarget:e.originEvent.target,","						path:e.originEvent.target.get('pathname'),","				    	url:e.originEvent.target.get('href'),","						queryString:e.originEvent.target.get('search'),","						html5support:html5support","					}, this);","				}","			}, this);","			","			// trigger callback","			PjaxLoader.after('load', function(e) {","				var html5support = this.get('html5support');","					","				if (this.get('callbackFunc')) {","					this.get('callbackFunc').call(null, {","						clickTarget:clickedTarget,","						path:clickedTarget.get('pathname'),","				    	url:clickedTarget.get('href'),","						queryString:clickedTarget.get('search'),							","						html5support:html5support","					}, this);","				}","				","				Y.all(this.get('container') + ' a:not(.' + this.get('omitLinkClass') + ')').addClass('yui3-pjax');","				// add content to cache","				this.ppCache.add(clickedLink, Y.one(this.get('contentSelector')).getContent());","			}, this);","				","			Y.delegate('click', function(e) {","				clickedTarget = e.target;","					","				if (this.ppCache.retrieve(e.target.get('href'))) {","					Y.one(this.get('contentSelector')).setContent(this.ppCache.retrieve(e.target.get('href')).response);","				}","			}, document.body, 'a.yui3-pjax', this);","		}","		else {","			Y.delegate('click', function(e) {","				var html5support = this.get('html5support');","					","				if (typeof e.target.get('pathname') !== \"undefined\") {","					var historyhash = e.target.get('pathname').replace(/_/g,'-');","					historyhash = e.target.get('pathname').replace(/\\//g,'_');	","					","					if (this.ppCache.retrieve(e.target.get('href'))) {","						// output cache, set history token","						Y.one(this.get('contentSelector')).setContent(this.ppCache.retrieve(e.target.get('href')).response);","						","						this.get('history').add({","							page:historyhash","						});","							","						if (this.get('callbackFunc')) {	","							// invoke custom function","						    this.get('callbackFunc').call(null, {","								clickTarget:e.target,","								path:e.target.get('pathname'),","						    	url:e.target.get('href'),","								queryString:e.target.get('search'),","								historyhash:historyhash,","								html5support:html5support","						    }, this);","						}","						return;","					}	","				}","					","				var goodext = false;","				if (typeof e.target.get('pathname') == \"undefined\") {","					// no path provided, default to homepage","					e.preventDefault();","					this.startAjaxLoad({","						clickTarget:e.target,","						url:'/'","					});","				}","				else {","					var pathnamearr = e.target.get('pathname').split(/\\//);","					var pathnameidx = pathnamearr.length - 1;","					var filename = pathnamearr[pathnameidx];","						","					if (!filename.match(/\\./)) {","						// no file extension, valid REST-like URL","						goodext = true;","					}","					else {","						// URL contains file extensions, look for permitted file extensions","						goodext = Y.Array.some(this.get('permittedFileExts'), function(ext) {","							var thisregex = new RegExp('\\.' + ext + '$');","							if (filename.match(thisregex)) {","								return true;","							}","						});","					}	","						","					if (goodext && !e.target.get('href').match(/^(mailto|javascript):/) && !e.target.get('href').match(/^#/) && ","						e.target.get('href').match(this.domain) && !e.target.hasClass(this.get('omitLinkClass'))) {","							e.preventDefault();","							this.startAjaxLoad({","								clickTarget:e.target,","								path:e.target.get('pathname'),","								url:e.target.get('href'),","								queryString:e.target.get('search'),","								historyhash:historyhash,","								html5support:html5support","							});","						}","				}","								","			}, this.get('findLinksIn'), 'a:not(.' + this.get('omitLinkClass') + ')', this);","				","		}","	},","		","	startAjaxLoad : function(configObj) {","		if (this.get('startCallbackFunc')) {","			this.get('startCallbackFunc').call(null, configObj, this);","		}","		if (!configObj.path.match(/^\\//)) {","			// make sure path has leading slash (IE seems to handle this differently)","			configObj.path = \"/\" + configObj.path;","		}","		var loadpath = configObj.queryString ? configObj.path + configObj.queryString : configObj.path;","			","		var cfg = {","			timeout: this.get('timeout'),","			on : {","				complete:Y.bind(function(id, transport) {","					var frag = Y.Node.create(transport.responseText);","					Y.one(this.get('contentSelector')).setContent(frag.one(this.get('contentSelector')).getContent());","						","					// set history token","					this.get('history').add({","						page:configObj.historyhash","					});","						","					// cache output","					this.ppCache.add(configObj.url, frag.one(this.get('contentSelector')).getContent());","						","				}, this),","					","				success:Y.bind(function(id, transport) {","					configObj.transport = transport;","						","					if (this.get('callbackFunc')) {	","						// invoke custom function","					    this.get('callbackFunc').call(null, configObj, this);","					}","				}, this)","			}","		};","			","		Y.io(loadpath, cfg);","	}","		        ","}, {","    ATTRS : { ","		findLinksIn : {","			value : document.body","		},","			","		container : {","","		},","			","		timeout : {","			value : 30000","		},","			","		addPjaxParam : {","			value : true","		},","			","		linkSelector : {","			value : 'a.yui3-pjax'","		},","			","		scrollToTop : {","			value : true","		},","			","		navigateOnHash : {","			value : false","		},","			","		titleSelector : {","			value : 'title'","		},","			","		contentSelector : {","				","		},","			","		omitLinkClass : {","","		},","			","		permittedFileExts : {","				","		},","			","		startCallbackFunc : {","","		},","			","		callbackFunc : {","				","		},","			","		cacheNum : {","			value : 10","		}","	}","});","","","}, 'gallery-2012.10.03-20-02' ,{requires:['base-build', 'widget', 'node', 'io', 'history', 'pjax', 'event-delegate', 'cache-base', 'selector-css3'], skinnable:false});"];
_yuitest_coverage["/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js"].lines = {"1":0,"3":0,"7":0,"8":0,"9":0,"11":0,"12":0,"15":0,"16":0,"21":0,"24":0,"26":0,"27":0,"28":0,"29":0,"30":0,"32":0,"34":0,"38":0,"39":0,"40":0,"41":0,"46":0,"48":0,"52":0,"64":0,"66":0,"67":0,"69":0,"70":0,"81":0,"82":0,"84":0,"85":0,"94":0,"96":0,"99":0,"100":0,"102":0,"103":0,"108":0,"109":0,"111":0,"112":0,"113":0,"115":0,"117":0,"119":0,"123":0,"125":0,"134":0,"138":0,"139":0,"141":0,"142":0,"148":0,"149":0,"150":0,"152":0,"154":0,"158":0,"159":0,"160":0,"161":0,"166":0,"168":0,"169":0,"186":0,"187":0,"189":0,"191":0,"193":0,"195":0,"199":0,"200":0,"203":0,"208":0,"213":0,"215":0,"217":0,"223":0};
_yuitest_coverage["/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js"].functions = {"initializer:4":0,"(anonymous 3):38":0,"(anonymous 2):27":0,"(anonymous 4):64":0,"(anonymous 5):81":0,"(anonymous 6):99":0,"(anonymous 8):158":0,"(anonymous 7):108":0,"initAjaxLinks:20":0,"(anonymous 9):198":0,"(anonymous 10):212":0,"startAjaxLoad:185":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js"].coveredLines = 81;
_yuitest_coverage["/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js"].coveredFunctions = 13;
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 1);
YUI.add('gallery-nmpjaxplus', function(Y) {

_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 3);
Y.PjaxPlus = Y.Base.create('pjaxplus', Y.Widget, [], { 
	initializer : function( config ) {
		// error checking for missing required variables
			
		_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "initializer", 4);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 7);
this.set('history', new Y.History());
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 8);
this.set('historyhash', new Y.HistoryHash());
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 9);
this.set('html5support', Y.HistoryBase.html5);
		//this.set('html5support', false);
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 11);
this.ppCache = new Y.Cache({max:this.get('cacheNum')});
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 12);
this.domain = new RegExp('^(http|https):\/\/' + window.location.hostname.replace('.','\.'));
			
		// remove leading dot from omitLinkClass, if any
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 15);
if (this.get('omitLinkClass').match(/^\./)) {
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 16);
this.set('omitLinkClass', this.get('omitLinkClass').replace(/^\./,''));
		}
	},
		
	initAjaxLinks : function() {
		_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "initAjaxLinks", 20);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 21);
var clickedLink,
		clickedTarget;
			
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 24);
if (this.get('html5support')) {
			// attach yui3-pjax class to links with REST-like URLs or URLs with permitted file extensions
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 26);
var goodext = false;
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 27);
Y.all('a:not(.' + this.get('omitLinkClass') + ')').each(function(node) {
				_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 2)", 27);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 28);
var pathnamearr = node.get('pathname').split(/\//);
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 29);
var pathnameidx = pathnamearr.length - 1;
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 30);
var filename = pathnamearr[pathnameidx];
						
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 32);
if (!filename.match(/\./)) {
					// no file extension, valid REST-like URL
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 34);
goodext = true;
				}
				else {
					// URL contains file extensions, look for permitted file extensions
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 38);
goodext = Y.Array.some(this.get('permittedFileExts'), function(ext) {
						_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 3)", 38);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 39);
var thisregex = new RegExp('\.' + ext + '$');
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 40);
if (filename.match(thisregex)) {
							_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 41);
return true;
						}
					});
				}
					
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 46);
if (goodext && !node.get('href').match(/^(mailto|javascript):/) && !node.get('href').match(/^#/) && 
					node.get('href').match(this.domain) && !node.hasClass(this.get('omitLinkClass'))) {
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 48);
node.addClass('yui3-pjax');
					}
			}, this);
				
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 52);
var PjaxLoader = new Y.Pjax({
				addPjaxParam : this.get('addPjaxParam'),
				container: this.get('container'),
				contentSelector: this.get('contentSelector'),
				linkSelector: this.get('linkSelector'),
				navigateOnHash: this.get('navigateOnHash'),
				scrollToTop: this.get('scrollToTop'),
				timeout: this.get('timeout'),
				titleSelector: this.get('titleSelector')
			});
			
			// trigger start callback
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 64);
PjaxLoader.on('navigate', function(e) {
				// set var for currently clicked link
				_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 4)", 64);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 66);
clickedLink = e.originEvent.target.get('href');
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 67);
var html5support = this.get('html5support');			
					
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 69);
if (this.get('startCallbackFunc')) {		
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 70);
this.get('startCallbackFunc').call(null, {
						clickTarget:e.originEvent.target,
						path:e.originEvent.target.get('pathname'),
				    	url:e.originEvent.target.get('href'),
						queryString:e.originEvent.target.get('search'),
						html5support:html5support
					}, this);
				}
			}, this);
			
			// trigger callback
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 81);
PjaxLoader.after('load', function(e) {
				_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 5)", 81);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 82);
var html5support = this.get('html5support');
					
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 84);
if (this.get('callbackFunc')) {
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 85);
this.get('callbackFunc').call(null, {
						clickTarget:clickedTarget,
						path:clickedTarget.get('pathname'),
				    	url:clickedTarget.get('href'),
						queryString:clickedTarget.get('search'),							
						html5support:html5support
					}, this);
				}
				
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 94);
Y.all(this.get('container') + ' a:not(.' + this.get('omitLinkClass') + ')').addClass('yui3-pjax');
				// add content to cache
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 96);
this.ppCache.add(clickedLink, Y.one(this.get('contentSelector')).getContent());
			}, this);
				
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 99);
Y.delegate('click', function(e) {
				_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 6)", 99);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 100);
clickedTarget = e.target;
					
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 102);
if (this.ppCache.retrieve(e.target.get('href'))) {
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 103);
Y.one(this.get('contentSelector')).setContent(this.ppCache.retrieve(e.target.get('href')).response);
				}
			}, document.body, 'a.yui3-pjax', this);
		}
		else {
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 108);
Y.delegate('click', function(e) {
				_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 7)", 108);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 109);
var html5support = this.get('html5support');
					
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 111);
if (typeof e.target.get('pathname') !== "undefined") {
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 112);
var historyhash = e.target.get('pathname').replace(/_/g,'-');
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 113);
historyhash = e.target.get('pathname').replace(/\//g,'_');	
					
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 115);
if (this.ppCache.retrieve(e.target.get('href'))) {
						// output cache, set history token
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 117);
Y.one(this.get('contentSelector')).setContent(this.ppCache.retrieve(e.target.get('href')).response);
						
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 119);
this.get('history').add({
							page:historyhash
						});
							
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 123);
if (this.get('callbackFunc')) {	
							// invoke custom function
						    _yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 125);
this.get('callbackFunc').call(null, {
								clickTarget:e.target,
								path:e.target.get('pathname'),
						    	url:e.target.get('href'),
								queryString:e.target.get('search'),
								historyhash:historyhash,
								html5support:html5support
						    }, this);
						}
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 134);
return;
					}	
				}
					
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 138);
var goodext = false;
				_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 139);
if (typeof e.target.get('pathname') == "undefined") {
					// no path provided, default to homepage
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 141);
e.preventDefault();
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 142);
this.startAjaxLoad({
						clickTarget:e.target,
						url:'/'
					});
				}
				else {
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 148);
var pathnamearr = e.target.get('pathname').split(/\//);
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 149);
var pathnameidx = pathnamearr.length - 1;
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 150);
var filename = pathnamearr[pathnameidx];
						
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 152);
if (!filename.match(/\./)) {
						// no file extension, valid REST-like URL
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 154);
goodext = true;
					}
					else {
						// URL contains file extensions, look for permitted file extensions
						_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 158);
goodext = Y.Array.some(this.get('permittedFileExts'), function(ext) {
							_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 8)", 158);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 159);
var thisregex = new RegExp('\.' + ext + '$');
							_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 160);
if (filename.match(thisregex)) {
								_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 161);
return true;
							}
						});
					}	
						
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 166);
if (goodext && !e.target.get('href').match(/^(mailto|javascript):/) && !e.target.get('href').match(/^#/) && 
						e.target.get('href').match(this.domain) && !e.target.hasClass(this.get('omitLinkClass'))) {
							_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 168);
e.preventDefault();
							_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 169);
this.startAjaxLoad({
								clickTarget:e.target,
								path:e.target.get('pathname'),
								url:e.target.get('href'),
								queryString:e.target.get('search'),
								historyhash:historyhash,
								html5support:html5support
							});
						}
				}
								
			}, this.get('findLinksIn'), 'a:not(.' + this.get('omitLinkClass') + ')', this);
				
		}
	},
		
	startAjaxLoad : function(configObj) {
		_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "startAjaxLoad", 185);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 186);
if (this.get('startCallbackFunc')) {
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 187);
this.get('startCallbackFunc').call(null, configObj, this);
		}
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 189);
if (!configObj.path.match(/^\//)) {
			// make sure path has leading slash (IE seems to handle this differently)
			_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 191);
configObj.path = "/" + configObj.path;
		}
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 193);
var loadpath = configObj.queryString ? configObj.path + configObj.queryString : configObj.path;
			
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 195);
var cfg = {
			timeout: this.get('timeout'),
			on : {
				complete:Y.bind(function(id, transport) {
					_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 9)", 198);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 199);
var frag = Y.Node.create(transport.responseText);
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 200);
Y.one(this.get('contentSelector')).setContent(frag.one(this.get('contentSelector')).getContent());
						
					// set history token
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 203);
this.get('history').add({
						page:configObj.historyhash
					});
						
					// cache output
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 208);
this.ppCache.add(configObj.url, frag.one(this.get('contentSelector')).getContent());
						
				}, this),
					
				success:Y.bind(function(id, transport) {
					_yuitest_coverfunc("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", "(anonymous 10)", 212);
_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 213);
configObj.transport = transport;
						
					_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 215);
if (this.get('callbackFunc')) {	
						// invoke custom function
					    _yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 217);
this.get('callbackFunc').call(null, configObj, this);
					}
				}, this)
			}
		};
			
		_yuitest_coverline("/build/gallery-nmpjaxplus/gallery-nmpjaxplus.js", 223);
Y.io(loadpath, cfg);
	}
		        
}, {
    ATTRS : { 
		findLinksIn : {
			value : document.body
		},
			
		container : {

		},
			
		timeout : {
			value : 30000
		},
			
		addPjaxParam : {
			value : true
		},
			
		linkSelector : {
			value : 'a.yui3-pjax'
		},
			
		scrollToTop : {
			value : true
		},
			
		navigateOnHash : {
			value : false
		},
			
		titleSelector : {
			value : 'title'
		},
			
		contentSelector : {
				
		},
			
		omitLinkClass : {

		},
			
		permittedFileExts : {
				
		},
			
		startCallbackFunc : {

		},
			
		callbackFunc : {
				
		},
			
		cacheNum : {
			value : 10
		}
	}
});


}, 'gallery-2012.10.03-20-02' ,{requires:['base-build', 'widget', 'node', 'io', 'history', 'pjax', 'event-delegate', 'cache-base', 'selector-css3'], skinnable:false});
