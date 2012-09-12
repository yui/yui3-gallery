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
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-nmresizer/gallery-nmresizer.js",
    code: []
};
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].code=["YUI.add('gallery-nmresizer', function(Y) {","","Y.Nmresizer = Y.Base.create('nmresizer', Y.Widget, [], { ","	initializer : function( config ) {","			","	},","		","	loadAndResize : function(config) {","		// check for required parameters","		if (typeof config.newdiv == \"undefined\") {","			return;","		}","		else if (typeof config.resizediv == \"undefined\") {","			return;","		}","			","		// make sure provided CSS IDs include leading pound sign","		if (!config.olddiv.match(/^(#|\\.)/)) {","			config.olddiv = '#' + config.olddiv;","		}","		if (!config.newdiv.match(/^(#|\\.)/)) {","			config.newdiv = '#' + config.newdiv;","		}","		if (!config.resizediv.match(/^(#|\\.)/)) {","			config.resizediv = '#' + config.resizediv;","		}","		","		if (typeof config.animDuration !== \"undefined\") {","			// use provided animDuration, overriding default","			this.set('animDuration', config.animDuration);","		}","		if (typeof config.maxWidth !== \"undefined\") {","			this.set('maxWidth', config.maxWidth);","		}","		if (typeof config.maxHeight !== \"undefined\") {","			this.set('maxHeight', config.maxHeight);","		}","		if (typeof config.offsetWidth !== \"undefined\") {","			this.set('offsetWidth', config.offsetWidth);","		}","		if (typeof config.offsetHeight !== \"undefined\") {","			this.set('offsetHeight', config.offsetHeight);","		}","			","		config.resizediv = config.resizediv ? config.resizediv : config.newdiv;","			","		// determine current tab dimensions","		config.oldtabheight = Y.one(config.resizediv).getComputedStyle('height');","		config.oldtabwidth = Y.one(config.resizediv).getComputedStyle('width');","			","		// delay measurement until all images in config.newdiv have been loaded","		if (Y.one(config.newdiv + ' img')) {","			var totalimages = Y.all(config.newdiv + ' img').size();","			var imagesloaded = 0;","			var images = [];","			var nmresizer = this;","			Y.all(config.newdiv + ' img').each(function(o,idx) {","				if (o.get('src') && o.get('src').match(/\\.(jpg|jpeg|gif|png)$/i)) {","					images[idx] = new Image();","					images[idx].src = o.get('src');","					images[idx].onload = function() {","						//o.set('src', images[idx].src);","						imagesloaded++;","						if (imagesloaded == totalimages) {","							nmresizer.doLoadAndResize(config);","						}","					};","					images[idx].onerror = function() {","						// image load attempted, record it (perhaps image didn't exist in path)","						imagesloaded++;","						if (imagesloaded == totalimages) {","							nmresizer.doLoadAndResize(config);","						}","					};	","				}","				else {","					totalimages--;","					if (!totalimages) { this.doLoadAndResize(config); }","				}","			}, this);","		}","		else {","			this.doLoadAndResize(config);","		}","	},","		","	doLoadAndResize : function(config) {","		Y.one(config.newdiv).setStyles({","			display:'block',","			position:'absolute',","			left:'-5000px',","			visibility:'hidden'","		});","		Y.one(config.newdiv).removeClass('displaynone');","			","		if (typeof config.noWidthResize == \"undefined\") {","			// resize width","			config.newtabwidth = Y.one(config.newdiv).get('offsetWidth') + this.get('offsetWidth') + 'px';","			if (this.get('maxWidth') && parseInt(config.newtabwidth, 10) > this.get('maxWidth')) {","				config.newtabwidth = this.get('maxWidth') + 'px';","			}","		}","			","		if (typeof config.noHeightResize == \"undefined\") {","			// resize height","			config.newtabheight = Y.one(config.newdiv).get('offsetHeight') + this.get('offsetHeight') + 'px';","			if (this.get('maxHeight') && parseInt(config.newtabheight, 10) > this.get('maxHeight')) {","				config.newtabheight = this.get('maxHeight') + 'px';","			}","		}","			","			","		// return newdiv to viewport","		Y.one(config.newdiv).setStyles({","			position:'',","			left:''","		});","			","		Y.one(config.resizediv).setStyles({","			width:config.oldtabwidth,","			height:config.oldtabheight","		});","			","		if (config.onStart) {","			config.onStart(config);","		}","","		// hide olddiv","		if (config.olddiv !== config.newdiv) {","			Y.one(config.olddiv).setStyles({","				display:'none',","				width:'',","				height:''","			});	","		}","","		// start transition","		if ((config.oldtabheight == config.newtabheight && config.oldtabwidth == config.newtabwidth) || config.olddiv == config.newdiv) {","			// no transition necessary, just show new element","			Y.one(config.newdiv).setStyles({","				display:'block',","				visibility:'visible'","			});","			if (config.resizediv !== config.newdiv) {","				Y.one(config.newdiv).setStyles({","					width:'auto',","					height:'auto'","				});","			}","			if (config.onEnd) {","				config.onEnd(config);","			}","		}","		else {","			var transoptions = {","				easing:'ease-out',","				duration:this.get('animDuration')","			};","				","			if (typeof config.newtabwidth !== \"undefined\") {","				transoptions.width = config.newtabwidth;","			}","			if (typeof config.newtabheight !== \"undefined\") {","				transoptions.height = config.newtabheight;","			}","				","			// animate resizediv to fit config.newdiv","			Y.all(config.resizediv).transition(transoptions, function() {","				// release inline dimension restraints","				Y.one(config.resizediv).setStyles({","					width:'',","					height:''","				});","				// reveal contents","				Y.one(config.newdiv).setStyles({","					visibility:'visible'","				});","				if (config.resizediv !== config.newdiv) {","					Y.one(config.newdiv).setStyles({","						width:'auto',","						height:'auto'","					});","				}","				if (config.onEnd) {","					config.onEnd(config);","				}","			});","		}","	}","}, {","    ATTRS : { ","		animDuration : {","			value : 0.5","		},","		maxHeight : {","			value : 0","		},","		maxWidth : {","			value : 0","		},","		offsetWidth : {","			value : 0","		},","		offsetHeight : {","			value : 0","		}","	}","		","});","","","}, 'gallery-2012.09.12-20-02' ,{requires:['base-build','widget','event-mouseenter','node','transition']});"];
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].lines = {"1":0,"3":0,"10":0,"11":0,"13":0,"14":0,"18":0,"19":0,"21":0,"22":0,"24":0,"25":0,"28":0,"30":0,"32":0,"33":0,"35":0,"36":0,"38":0,"39":0,"41":0,"42":0,"45":0,"48":0,"49":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"63":0,"64":0,"65":0,"68":0,"70":0,"71":0,"72":0,"77":0,"78":0,"83":0,"88":0,"94":0,"96":0,"98":0,"99":0,"100":0,"104":0,"106":0,"107":0,"108":0,"114":0,"119":0,"124":0,"125":0,"129":0,"130":0,"138":0,"140":0,"144":0,"145":0,"150":0,"151":0,"155":0,"160":0,"161":0,"163":0,"164":0,"168":0,"170":0,"175":0,"178":0,"179":0,"184":0,"185":0};
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].functions = {"onload:61":0,"onerror:68":0,"(anonymous 2):57":0,"loadAndResize:8":0,"(anonymous 3):168":0,"doLoadAndResize:87":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].coveredLines = 79;
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].coveredFunctions = 7;
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 1);
YUI.add('gallery-nmresizer', function(Y) {

_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 3);
Y.Nmresizer = Y.Base.create('nmresizer', Y.Widget, [], { 
	initializer : function( config ) {
			
	},
		
	loadAndResize : function(config) {
		// check for required parameters
		_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "loadAndResize", 8);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 10);
if (typeof config.newdiv == "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 11);
return;
		}
		else {_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 13);
if (typeof config.resizediv == "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 14);
return;
		}}
			
		// make sure provided CSS IDs include leading pound sign
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 18);
if (!config.olddiv.match(/^(#|\.)/)) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 19);
config.olddiv = '#' + config.olddiv;
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 21);
if (!config.newdiv.match(/^(#|\.)/)) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 22);
config.newdiv = '#' + config.newdiv;
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 24);
if (!config.resizediv.match(/^(#|\.)/)) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 25);
config.resizediv = '#' + config.resizediv;
		}
		
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 28);
if (typeof config.animDuration !== "undefined") {
			// use provided animDuration, overriding default
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 30);
this.set('animDuration', config.animDuration);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 32);
if (typeof config.maxWidth !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 33);
this.set('maxWidth', config.maxWidth);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 35);
if (typeof config.maxHeight !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 36);
this.set('maxHeight', config.maxHeight);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 38);
if (typeof config.offsetWidth !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 39);
this.set('offsetWidth', config.offsetWidth);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 41);
if (typeof config.offsetHeight !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 42);
this.set('offsetHeight', config.offsetHeight);
		}
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 45);
config.resizediv = config.resizediv ? config.resizediv : config.newdiv;
			
		// determine current tab dimensions
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 48);
config.oldtabheight = Y.one(config.resizediv).getComputedStyle('height');
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 49);
config.oldtabwidth = Y.one(config.resizediv).getComputedStyle('width');
			
		// delay measurement until all images in config.newdiv have been loaded
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 52);
if (Y.one(config.newdiv + ' img')) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 53);
var totalimages = Y.all(config.newdiv + ' img').size();
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 54);
var imagesloaded = 0;
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 55);
var images = [];
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 56);
var nmresizer = this;
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 57);
Y.all(config.newdiv + ' img').each(function(o,idx) {
				_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "(anonymous 2)", 57);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 58);
if (o.get('src') && o.get('src').match(/\.(jpg|jpeg|gif|png)$/i)) {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 59);
images[idx] = new Image();
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 60);
images[idx].src = o.get('src');
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 61);
images[idx].onload = function() {
						//o.set('src', images[idx].src);
						_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "onload", 61);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 63);
imagesloaded++;
						_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 64);
if (imagesloaded == totalimages) {
							_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 65);
nmresizer.doLoadAndResize(config);
						}
					};
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 68);
images[idx].onerror = function() {
						// image load attempted, record it (perhaps image didn't exist in path)
						_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "onerror", 68);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 70);
imagesloaded++;
						_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 71);
if (imagesloaded == totalimages) {
							_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 72);
nmresizer.doLoadAndResize(config);
						}
					};	
				}
				else {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 77);
totalimages--;
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 78);
if (!totalimages) { this.doLoadAndResize(config); }
				}
			}, this);
		}
		else {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 83);
this.doLoadAndResize(config);
		}
	},
		
	doLoadAndResize : function(config) {
		_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "doLoadAndResize", 87);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 88);
Y.one(config.newdiv).setStyles({
			display:'block',
			position:'absolute',
			left:'-5000px',
			visibility:'hidden'
		});
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 94);
Y.one(config.newdiv).removeClass('displaynone');
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 96);
if (typeof config.noWidthResize == "undefined") {
			// resize width
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 98);
config.newtabwidth = Y.one(config.newdiv).get('offsetWidth') + this.get('offsetWidth') + 'px';
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 99);
if (this.get('maxWidth') && parseInt(config.newtabwidth, 10) > this.get('maxWidth')) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 100);
config.newtabwidth = this.get('maxWidth') + 'px';
			}
		}
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 104);
if (typeof config.noHeightResize == "undefined") {
			// resize height
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 106);
config.newtabheight = Y.one(config.newdiv).get('offsetHeight') + this.get('offsetHeight') + 'px';
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 107);
if (this.get('maxHeight') && parseInt(config.newtabheight, 10) > this.get('maxHeight')) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 108);
config.newtabheight = this.get('maxHeight') + 'px';
			}
		}
			
			
		// return newdiv to viewport
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 114);
Y.one(config.newdiv).setStyles({
			position:'',
			left:''
		});
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 119);
Y.one(config.resizediv).setStyles({
			width:config.oldtabwidth,
			height:config.oldtabheight
		});
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 124);
if (config.onStart) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 125);
config.onStart(config);
		}

		// hide olddiv
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 129);
if (config.olddiv !== config.newdiv) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 130);
Y.one(config.olddiv).setStyles({
				display:'none',
				width:'',
				height:''
			});	
		}

		// start transition
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 138);
if ((config.oldtabheight == config.newtabheight && config.oldtabwidth == config.newtabwidth) || config.olddiv == config.newdiv) {
			// no transition necessary, just show new element
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 140);
Y.one(config.newdiv).setStyles({
				display:'block',
				visibility:'visible'
			});
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 144);
if (config.resizediv !== config.newdiv) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 145);
Y.one(config.newdiv).setStyles({
					width:'auto',
					height:'auto'
				});
			}
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 150);
if (config.onEnd) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 151);
config.onEnd(config);
			}
		}
		else {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 155);
var transoptions = {
				easing:'ease-out',
				duration:this.get('animDuration')
			};
				
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 160);
if (typeof config.newtabwidth !== "undefined") {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 161);
transoptions.width = config.newtabwidth;
			}
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 163);
if (typeof config.newtabheight !== "undefined") {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 164);
transoptions.height = config.newtabheight;
			}
				
			// animate resizediv to fit config.newdiv
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 168);
Y.all(config.resizediv).transition(transoptions, function() {
				// release inline dimension restraints
				_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "(anonymous 3)", 168);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 170);
Y.one(config.resizediv).setStyles({
					width:'',
					height:''
				});
				// reveal contents
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 175);
Y.one(config.newdiv).setStyles({
					visibility:'visible'
				});
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 178);
if (config.resizediv !== config.newdiv) {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 179);
Y.one(config.newdiv).setStyles({
						width:'auto',
						height:'auto'
					});
				}
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 184);
if (config.onEnd) {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 185);
config.onEnd(config);
				}
			});
		}
	}
}, {
    ATTRS : { 
		animDuration : {
			value : 0.5
		},
		maxHeight : {
			value : 0
		},
		maxWidth : {
			value : 0
		},
		offsetWidth : {
			value : 0
		},
		offsetHeight : {
			value : 0
		}
	}
		
});


}, 'gallery-2012.09.12-20-02' ,{requires:['base-build','widget','event-mouseenter','node','transition']});
