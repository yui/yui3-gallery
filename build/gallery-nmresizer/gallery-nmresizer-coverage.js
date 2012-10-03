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
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].code=["YUI.add('gallery-nmresizer', function(Y) {","","Y.Nmresizer = Y.Base.create('nmresizer', Y.Widget, [], { ","	initializer : function( config ) {","			","	},","		","	loadAndResize : function(config) {","		// check for required parameters","		if (typeof config.newdiv == \"undefined\") {","			return;","		}","		else if (typeof config.resizediv == \"undefined\") {","			return;","		}","			","		// make sure provided CSS IDs include leading pound sign","		if (config.olddiv && !config.olddiv.match(/^(#|\\.)/)) {","			config.olddiv = '#' + config.olddiv;","		}","		if (!config.newdiv.match(/^(#|\\.)/)) {","			config.newdiv = '#' + config.newdiv;","		}","		if (!config.resizediv.match(/^(#|\\.)/)) {","			config.resizediv = '#' + config.resizediv;","		}","		if (config.resizeclass && !config.resizeclass.match(/^\\./)) {","			config.resizeclass = '.' + config.resizeclass;","		}","			","		if (typeof config.animDuration !== \"undefined\") {","			// use provided animDuration, overriding default","			this.set('animDuration', config.animDuration);","		}","		if (typeof config.maxWidth !== \"undefined\") {","			config.maxWidth = String(config.maxWidth);","			if (config.maxWidth.match(/px$/)) { config.maxWidth = config.maxWidth.replace(/px$/,''); }","			this.set('maxWidth', config.maxWidth);","		}","		if (typeof config.maxHeight !== \"undefined\") {","			config.maxHeight = String(config.maxHeight);				","			if (config.maxHeight.match(/px$/)) { config.maxHeight = config.maxHeight.replace(/px$/,''); }","			this.set('maxHeight', config.maxHeight);","		}","		if (typeof config.restrainHeight !== \"undefined\") {","			config.restrainHeight = String(config.restrainHeight);				","			if (config.restrainHeight.match(/px$/)) { config.restrainHeight = config.restrainHeight.replace(/px$/,''); }","			this.set('restrainHeight', config.restrainHeight);","		}","		if (typeof config.restrainWidth !== \"undefined\") {","			config.restrainWidth = String(config.restrainWidth);","			if (config.restrainWidth.match(/px$/)) { config.restrainWidth = config.restrainWidth.replace(/px$/,''); }			","			this.set('restrainWidth', config.restrainWidth);","		}","		if (typeof config.offsetWidth !== \"undefined\") {","			config.offsetWidth = String(config.offsetWidth);				","			if (config.offsetWidth.match(/px$/)) { config.offsetWidth = config.offsetWidth.replace(/px$/,''); }	","			this.set('offsetWidth', config.offsetWidth);","		}","		if (typeof config.offsetHeight !== \"undefined\") {","			config.offsetHeight = String(config.offsetHeight);					","			if (config.offsetHeight.match(/px$/)) { config.offsetHeight = config.offsetHeight.replace(/px$/,''); }	","			this.set('offsetHeight', config.offsetHeight);","		}","			","		config.resizediv = config.resizediv ? config.resizediv : config.newdiv;","			","		// determine current tab dimensions","		config.oldtabheight = Y.one(config.resizediv).getComputedStyle('height');","		config.oldtabwidth = Y.one(config.resizediv).getComputedStyle('width');","			","		// delay measurement until all images in config.newdiv have been loaded","		if (Y.one(config.newdiv + ' img')) {","			var totalimages = Y.all(config.newdiv + ' img').size();","			var imagesloaded = 0;","			var images = [];","			var nmresizer = this;","			Y.all(config.newdiv + ' img').each(function(o,idx) {","				if (o.get('src') && o.get('src').match(/\\.(jpg|jpeg|gif|png)$/i)) {","					images[idx] = new Image();","					images[idx].src = o.get('src');","					images[idx].onload = function() {","						//o.set('src', images[idx].src);","						imagesloaded++;","						if (imagesloaded == totalimages) {","							nmresizer.doLoadAndResize(config);","						}","					};","					images[idx].onerror = function() {","						// image load attempted, record it (perhaps image didn't exist in path)","						imagesloaded++;","						if (imagesloaded == totalimages) {","							nmresizer.doLoadAndResize(config);","						}","					};	","				}","				else {","					totalimages--;","					if (!totalimages) { this.doLoadAndResize(config); }","				}","			}, this);","		}","		else {","			this.doLoadAndResize(config);","		}","	},","		","	doLoadAndResize : function(config) {","		var offviewportwidth = this.get('restrainWidth') ? this.get('restrainWidth') + 'px' : 'auto';			","		var offviewportheight = this.get('restrainHeight') ? this.get('restrainHeight') + 'px' : 'auto';","			","		Y.one(config.newdiv).setStyles({","			display:'block',","			position:'absolute',","			left:'-5000px',","			visibility:'hidden',","			width:offviewportwidth,","			height:offviewportheight","		});","		Y.one(config.newdiv).removeClass('displaynone');","			","		if (typeof config.noWidthResize == \"undefined\" || !config.noWidthResize) {","			// resize width","			config.newtabwidth = parseInt(Y.one(config.newdiv).get('offsetWidth')) + parseInt(this.get('offsetWidth')) + 'px';","			if (this.get('maxWidth') && parseInt(config.newtabwidth, 10) > this.get('maxWidth')) {","				config.newtabwidth = this.get('maxWidth') + 'px';","			}","		}","			","		if (typeof config.noHeightResize == \"undefined\" || !config.noHeightResize) {","			// resize height","			config.newtabheight = parseInt(Y.one(config.newdiv).get('offsetHeight')) + parseInt(this.get('offsetHeight')) + 'px';","			if (this.get('maxHeight') && parseInt(config.newtabheight, 10) > this.get('maxHeight')) {","				config.newtabheight = this.get('maxHeight') + 'px';","			}","		}","			","		if (config.onStart) {","			config.onStart(config);","		}","			","		// return newdiv to viewport","		Y.one(config.newdiv).setStyles({","			position:'',","			left:''","		});","			","		Y.one(config.resizediv).setStyles({","			width:config.oldtabwidth,","			height:config.oldtabheight","		});","			","		// hide olddiv","		if (config.olddiv !== config.newdiv) {","			Y.one(config.olddiv).setStyles({","				display:'none',","				width:'',","				height:''","			});	","		}","","		// start transition","		if (config.oldtabheight == config.newtabheight && config.oldtabwidth == config.newtabwidth) {","			// no transition necessary, just show new element","			Y.one(config.newdiv).setStyles({","				display:'block',","				visibility:'visible'","			});","			if (config.resizediv !== config.newdiv) {","				Y.one(config.newdiv).setStyles({","					width:'auto',","					height:'auto'","				});","			}","			if (config.onEnd) {","				config.onEnd(config);","			}","		}","		else {","			var transoptions = {","				easing:'ease-out',","				duration:this.get('animDuration')","			};","				","			if (typeof config.newtabwidth !== \"undefined\") {","				transoptions.width = config.newtabwidth;","			}","			if (typeof config.newtabheight !== \"undefined\") {","				transoptions.height = config.newtabheight;","			}","				","			if (typeof config.resizeclass !== \"undefined\" && config.resizeclass) {","				// now that resizediv has been measured, resize all divs assigned to ","				// class rather than single div","				config.resizediv = config.resizeclass;","			}","","			// animate resizediv to fit config.newdiv","			Y.all(config.resizediv).transition(transoptions, function() {","				// release inline dimension restraints","				/*","				Y.one(config.resizediv).setStyles({","					width:'',","					height:''","				});","				*/","				// reveal contents","				Y.one(config.newdiv).setStyles({","					visibility:'visible'","				});","				if (config.resizediv !== config.newdiv) {","					Y.one(config.newdiv).setStyles({","						width:'auto',","						height:'auto'","					});","				}","				if (config.onEnd) {","					config.onEnd(config);","				}","			});","		}","	}","}, {","    ATTRS : { ","		animDuration : {","			value : 0.5","		},","		maxHeight : {","			value : 0","		},","		maxWidth : {","			value : 0","		},","		restrainHeight : {","			value : 0","		},","		restrainWidth: {","			value : 0","		},","		offsetWidth : {","			value : 0","		},","		offsetHeight : {","			value : 0","		}","	}","		","});","","","}, 'gallery-2012.10.03-20-02' ,{requires:['base-build','widget','event-mouseenter','node','transition']});"];
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].lines = {"1":0,"3":0,"10":0,"11":0,"13":0,"14":0,"18":0,"19":0,"21":0,"22":0,"24":0,"25":0,"27":0,"28":0,"31":0,"33":0,"35":0,"36":0,"37":0,"38":0,"40":0,"41":0,"42":0,"43":0,"45":0,"46":0,"47":0,"48":0,"50":0,"51":0,"52":0,"53":0,"55":0,"56":0,"57":0,"58":0,"60":0,"61":0,"62":0,"63":0,"66":0,"69":0,"70":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"79":0,"80":0,"81":0,"82":0,"84":0,"85":0,"86":0,"89":0,"91":0,"92":0,"93":0,"98":0,"99":0,"104":0,"109":0,"110":0,"112":0,"120":0,"122":0,"124":0,"125":0,"126":0,"130":0,"132":0,"133":0,"134":0,"138":0,"139":0,"143":0,"148":0,"154":0,"155":0,"163":0,"165":0,"169":0,"170":0,"175":0,"176":0,"180":0,"185":0,"186":0,"188":0,"189":0,"192":0,"195":0,"199":0,"208":0,"211":0,"212":0,"217":0,"218":0};
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].functions = {"onload:82":0,"onerror:89":0,"(anonymous 2):78":0,"loadAndResize:8":0,"(anonymous 3):199":0,"doLoadAndResize:108":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-nmresizer/gallery-nmresizer.js"].coveredLines = 100;
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
if (config.olddiv && !config.olddiv.match(/^(#|\.)/)) {
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
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 27);
if (config.resizeclass && !config.resizeclass.match(/^\./)) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 28);
config.resizeclass = '.' + config.resizeclass;
		}
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 31);
if (typeof config.animDuration !== "undefined") {
			// use provided animDuration, overriding default
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 33);
this.set('animDuration', config.animDuration);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 35);
if (typeof config.maxWidth !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 36);
config.maxWidth = String(config.maxWidth);
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 37);
if (config.maxWidth.match(/px$/)) { config.maxWidth = config.maxWidth.replace(/px$/,''); }
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 38);
this.set('maxWidth', config.maxWidth);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 40);
if (typeof config.maxHeight !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 41);
config.maxHeight = String(config.maxHeight);				
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 42);
if (config.maxHeight.match(/px$/)) { config.maxHeight = config.maxHeight.replace(/px$/,''); }
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 43);
this.set('maxHeight', config.maxHeight);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 45);
if (typeof config.restrainHeight !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 46);
config.restrainHeight = String(config.restrainHeight);				
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 47);
if (config.restrainHeight.match(/px$/)) { config.restrainHeight = config.restrainHeight.replace(/px$/,''); }
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 48);
this.set('restrainHeight', config.restrainHeight);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 50);
if (typeof config.restrainWidth !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 51);
config.restrainWidth = String(config.restrainWidth);
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 52);
if (config.restrainWidth.match(/px$/)) { config.restrainWidth = config.restrainWidth.replace(/px$/,''); }			
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 53);
this.set('restrainWidth', config.restrainWidth);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 55);
if (typeof config.offsetWidth !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 56);
config.offsetWidth = String(config.offsetWidth);				
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 57);
if (config.offsetWidth.match(/px$/)) { config.offsetWidth = config.offsetWidth.replace(/px$/,''); }	
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 58);
this.set('offsetWidth', config.offsetWidth);
		}
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 60);
if (typeof config.offsetHeight !== "undefined") {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 61);
config.offsetHeight = String(config.offsetHeight);					
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 62);
if (config.offsetHeight.match(/px$/)) { config.offsetHeight = config.offsetHeight.replace(/px$/,''); }	
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 63);
this.set('offsetHeight', config.offsetHeight);
		}
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 66);
config.resizediv = config.resizediv ? config.resizediv : config.newdiv;
			
		// determine current tab dimensions
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 69);
config.oldtabheight = Y.one(config.resizediv).getComputedStyle('height');
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 70);
config.oldtabwidth = Y.one(config.resizediv).getComputedStyle('width');
			
		// delay measurement until all images in config.newdiv have been loaded
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 73);
if (Y.one(config.newdiv + ' img')) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 74);
var totalimages = Y.all(config.newdiv + ' img').size();
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 75);
var imagesloaded = 0;
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 76);
var images = [];
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 77);
var nmresizer = this;
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 78);
Y.all(config.newdiv + ' img').each(function(o,idx) {
				_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "(anonymous 2)", 78);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 79);
if (o.get('src') && o.get('src').match(/\.(jpg|jpeg|gif|png)$/i)) {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 80);
images[idx] = new Image();
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 81);
images[idx].src = o.get('src');
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 82);
images[idx].onload = function() {
						//o.set('src', images[idx].src);
						_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "onload", 82);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 84);
imagesloaded++;
						_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 85);
if (imagesloaded == totalimages) {
							_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 86);
nmresizer.doLoadAndResize(config);
						}
					};
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 89);
images[idx].onerror = function() {
						// image load attempted, record it (perhaps image didn't exist in path)
						_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "onerror", 89);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 91);
imagesloaded++;
						_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 92);
if (imagesloaded == totalimages) {
							_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 93);
nmresizer.doLoadAndResize(config);
						}
					};	
				}
				else {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 98);
totalimages--;
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 99);
if (!totalimages) { this.doLoadAndResize(config); }
				}
			}, this);
		}
		else {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 104);
this.doLoadAndResize(config);
		}
	},
		
	doLoadAndResize : function(config) {
		_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "doLoadAndResize", 108);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 109);
var offviewportwidth = this.get('restrainWidth') ? this.get('restrainWidth') + 'px' : 'auto';			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 110);
var offviewportheight = this.get('restrainHeight') ? this.get('restrainHeight') + 'px' : 'auto';
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 112);
Y.one(config.newdiv).setStyles({
			display:'block',
			position:'absolute',
			left:'-5000px',
			visibility:'hidden',
			width:offviewportwidth,
			height:offviewportheight
		});
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 120);
Y.one(config.newdiv).removeClass('displaynone');
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 122);
if (typeof config.noWidthResize == "undefined" || !config.noWidthResize) {
			// resize width
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 124);
config.newtabwidth = parseInt(Y.one(config.newdiv).get('offsetWidth')) + parseInt(this.get('offsetWidth')) + 'px';
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 125);
if (this.get('maxWidth') && parseInt(config.newtabwidth, 10) > this.get('maxWidth')) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 126);
config.newtabwidth = this.get('maxWidth') + 'px';
			}
		}
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 130);
if (typeof config.noHeightResize == "undefined" || !config.noHeightResize) {
			// resize height
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 132);
config.newtabheight = parseInt(Y.one(config.newdiv).get('offsetHeight')) + parseInt(this.get('offsetHeight')) + 'px';
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 133);
if (this.get('maxHeight') && parseInt(config.newtabheight, 10) > this.get('maxHeight')) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 134);
config.newtabheight = this.get('maxHeight') + 'px';
			}
		}
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 138);
if (config.onStart) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 139);
config.onStart(config);
		}
			
		// return newdiv to viewport
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 143);
Y.one(config.newdiv).setStyles({
			position:'',
			left:''
		});
			
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 148);
Y.one(config.resizediv).setStyles({
			width:config.oldtabwidth,
			height:config.oldtabheight
		});
			
		// hide olddiv
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 154);
if (config.olddiv !== config.newdiv) {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 155);
Y.one(config.olddiv).setStyles({
				display:'none',
				width:'',
				height:''
			});	
		}

		// start transition
		_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 163);
if (config.oldtabheight == config.newtabheight && config.oldtabwidth == config.newtabwidth) {
			// no transition necessary, just show new element
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 165);
Y.one(config.newdiv).setStyles({
				display:'block',
				visibility:'visible'
			});
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 169);
if (config.resizediv !== config.newdiv) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 170);
Y.one(config.newdiv).setStyles({
					width:'auto',
					height:'auto'
				});
			}
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 175);
if (config.onEnd) {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 176);
config.onEnd(config);
			}
		}
		else {
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 180);
var transoptions = {
				easing:'ease-out',
				duration:this.get('animDuration')
			};
				
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 185);
if (typeof config.newtabwidth !== "undefined") {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 186);
transoptions.width = config.newtabwidth;
			}
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 188);
if (typeof config.newtabheight !== "undefined") {
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 189);
transoptions.height = config.newtabheight;
			}
				
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 192);
if (typeof config.resizeclass !== "undefined" && config.resizeclass) {
				// now that resizediv has been measured, resize all divs assigned to 
				// class rather than single div
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 195);
config.resizediv = config.resizeclass;
			}

			// animate resizediv to fit config.newdiv
			_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 199);
Y.all(config.resizediv).transition(transoptions, function() {
				// release inline dimension restraints
				/*
				Y.one(config.resizediv).setStyles({
					width:'',
					height:''
				});
				*/
				// reveal contents
				_yuitest_coverfunc("/build/gallery-nmresizer/gallery-nmresizer.js", "(anonymous 3)", 199);
_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 208);
Y.one(config.newdiv).setStyles({
					visibility:'visible'
				});
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 211);
if (config.resizediv !== config.newdiv) {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 212);
Y.one(config.newdiv).setStyles({
						width:'auto',
						height:'auto'
					});
				}
				_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 217);
if (config.onEnd) {
					_yuitest_coverline("/build/gallery-nmresizer/gallery-nmresizer.js", 218);
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
		restrainHeight : {
			value : 0
		},
		restrainWidth: {
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


}, 'gallery-2012.10.03-20-02' ,{requires:['base-build','widget','event-mouseenter','node','transition']});
