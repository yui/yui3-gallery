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
_yuitest_coverage["/build/gallery-node-fitvids/gallery-node-fitvids.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-node-fitvids/gallery-node-fitvids.js",
    code: []
};
_yuitest_coverage["/build/gallery-node-fitvids/gallery-node-fitvids.js"].code=["YUI.add('gallery-node-fitvids', function(Y) {","","	/**","	 * <p>The FitVids Node Plugin transforms video embeds into fluid width video embeds.","	 *","	 * <p>","	 * <code>","	 * &#60;script type=\"text/javascript\"&#62; <br>","	 * <br>","	 *       //  Call the \"use\" method, passing in \"gallery-node-fitvids\".  This will <br>","	 *       //  load the script and CSS for the FitVids Node Plugin and all of <br>","	 *       //  the required dependencies. <br>","	 * <br>","	 *       YUI().use('gallery-node-fitvids', 'event-base', function(Y) { <br>","	 * <br>","	 *           //  Use the 'contentready' event to initialize fitvids when <br>","	 *           //  the element that contains the video embed<br>","	 *           //  is ready to be scripted. <br>","	 * <br>","	 *           Y.on('contentready', function () { <br>","	 * <br>","	 *               //  The scope of the callback will be a Node instance <br>","	 *               //  representing the container element (&#60;div id=\"container\"&#62;). <br>","	 *               //  Therefore, since \"this\" represents a Node instance, it <br>","	 *               //  is possible to just call \"this.plug\" passing in a <br>","	 *               //  reference to the FitVids Node Plugin. <br>","	 * <br>","	 *               this.plug(Y.Plugin.NodeFitVids); <br>","	 * <br>","	 *           }, '#container'); <br>","	 * <br>      ","	 *       }); <br>","	 * <br>  ","	 *   &#60;/script&#62; <br>","	 * </code>","	 * </p>","	 *","	 * Based on FitVids - https://github.com/davatron5000/FitVids.js","	 *","	 * @module gallery-node-fitvids","	 */","","	var CLASS_NAME = Y.ClassNameManager.getClassName('fluid-width-video-wrapper'),","		","		ANCESTOR_SELECTOR = '.' + CLASS_NAME,","","		DATA_KEY = 'fitvids:originalAttributes',","		","		SELECTORS = [","			'iframe[src^=\"http://player.vimeo.com\"]',","			'iframe[src^=\"http://www.youtube.com\"]',","			'iframe[src^=\"https://www.youtube.com\"]',","			'iframe[src^=\"http://www.kickstarter.com\"]',","			'object',","			'embed'","		];","","	function getSelectors(customSelector) {","		var selectors = [].concat(SELECTORS);","		","		if (customSelector) {","			selectors.push(customSelector);","		}","","		return selectors.join(',');","	}","","	/**","	 * FitVids Node Plugin.","	 *","	 * @namespace Y.Plugin","	 * @class NodeFitVids","	 * @extends Plugin.Base","	 */","	Y.namespace('Plugin').NodeFitVids = Y.Base.create('NodeFitVids', Y.Plugin.Base, [], {","		initializer: function (config) {","			var host = this.get('host'),","				query = getSelectors(this.get('customSelector'));","","			if (!Y.instanceOf(host, Y.Node)) {","				return;","			}","","			host.all(query).each(function () {","				var tagName = this.get('tagName'),","					parentNode = this.get('parentNode'),","					heightAttr = this.get('height'),","					widthAttr = this.get('width'),","					data = {},","					height,","					width,","					aspectRatio;","","				if ((tagName === 'EMBED' && parentNode.get('tagName') === 'OBJECT') || parentNode.hasClass(CLASS_NAME)) {","					return;","				}","","				height = tagName === 'OBJECT' ? heightAttr : this.getComputedStyle('height');","				width = this.getComputedStyle('width');","				aspectRatio = parseInt(height, 10) / parseInt(width, 10);","","				this.wrap('<div class=\"' + CLASS_NAME + '\"></div>');","				this.ancestor(ANCESTOR_SELECTOR).setStyle('paddingTop', (aspectRatio * 100) + '%');","","				if (heightAttr) {","					data.height = heightAttr;","					this.removeAttribute('height');","				}","				","				if (widthAttr) {","					data.width = widthAttr;","					this.removeAttribute('width');","				}","","				// Save the original values of the height and width so we can restore them on unplug()","				this.setData(DATA_KEY, data);","			});","		},","		","		","		destructor: function () {","			var host = this.get('host'),","				query = getSelectors(this.get('customSelector'));","			","			if (!Y.instanceOf(host, Y.Node)) {","				return;","			}","			","			host.all(query).each(function () {","				var originalDimensions;","				","				if (this.ancestor(ANCESTOR_SELECTOR)) {","					this.unwrap();","","					originalDimensions = this.getData(DATA_KEY) || {};","					","					if (originalDimensions.height) {","						this.set('height', originalDimensions.height);","					}","","					if (originalDimensions.width) {","						this.set('width', originalDimensions.width);","					}","					","					this.clearData(DATA_KEY);","				}","			});","		}","	}, {","		NS: 'fitvids',","		","		ATTRS: {","			/**","			 * @attribute customSelector","			 * @description Video vendor selector if none of the default selectors match the the player you wish to target.","			 * @type String","			 * @writeOnce","			 */","			customSelector: null","		}","	});","","","}, 'gallery-2012.10.10-19-59' ,{skinnable:true, requires:['plugin', 'base-build', 'node-base', 'node-style', 'node-pluginhost', 'classnamemanager']});"];
_yuitest_coverage["/build/gallery-node-fitvids/gallery-node-fitvids.js"].lines = {"1":0,"43":0,"58":0,"59":0,"61":0,"62":0,"65":0,"75":0,"77":0,"80":0,"81":0,"84":0,"85":0,"94":0,"95":0,"98":0,"99":0,"100":0,"102":0,"103":0,"105":0,"106":0,"107":0,"110":0,"111":0,"112":0,"116":0,"122":0,"125":0,"126":0,"129":0,"130":0,"132":0,"133":0,"135":0,"137":0,"138":0,"141":0,"142":0,"145":0};
_yuitest_coverage["/build/gallery-node-fitvids/gallery-node-fitvids.js"].functions = {"getSelectors:58":0,"(anonymous 2):84":0,"initializer:76":0,"(anonymous 3):129":0,"destructor:121":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-node-fitvids/gallery-node-fitvids.js"].coveredLines = 40;
_yuitest_coverage["/build/gallery-node-fitvids/gallery-node-fitvids.js"].coveredFunctions = 6;
_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 1);
YUI.add('gallery-node-fitvids', function(Y) {

	/**
	 * <p>The FitVids Node Plugin transforms video embeds into fluid width video embeds.
	 *
	 * <p>
	 * <code>
	 * &#60;script type="text/javascript"&#62; <br>
	 * <br>
	 *       //  Call the "use" method, passing in "gallery-node-fitvids".  This will <br>
	 *       //  load the script and CSS for the FitVids Node Plugin and all of <br>
	 *       //  the required dependencies. <br>
	 * <br>
	 *       YUI().use('gallery-node-fitvids', 'event-base', function(Y) { <br>
	 * <br>
	 *           //  Use the 'contentready' event to initialize fitvids when <br>
	 *           //  the element that contains the video embed<br>
	 *           //  is ready to be scripted. <br>
	 * <br>
	 *           Y.on('contentready', function () { <br>
	 * <br>
	 *               //  The scope of the callback will be a Node instance <br>
	 *               //  representing the container element (&#60;div id="container"&#62;). <br>
	 *               //  Therefore, since "this" represents a Node instance, it <br>
	 *               //  is possible to just call "this.plug" passing in a <br>
	 *               //  reference to the FitVids Node Plugin. <br>
	 * <br>
	 *               this.plug(Y.Plugin.NodeFitVids); <br>
	 * <br>
	 *           }, '#container'); <br>
	 * <br>      
	 *       }); <br>
	 * <br>  
	 *   &#60;/script&#62; <br>
	 * </code>
	 * </p>
	 *
	 * Based on FitVids - https://github.com/davatron5000/FitVids.js
	 *
	 * @module gallery-node-fitvids
	 */

	_yuitest_coverfunc("/build/gallery-node-fitvids/gallery-node-fitvids.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 43);
var CLASS_NAME = Y.ClassNameManager.getClassName('fluid-width-video-wrapper'),
		
		ANCESTOR_SELECTOR = '.' + CLASS_NAME,

		DATA_KEY = 'fitvids:originalAttributes',
		
		SELECTORS = [
			'iframe[src^="http://player.vimeo.com"]',
			'iframe[src^="http://www.youtube.com"]',
			'iframe[src^="https://www.youtube.com"]',
			'iframe[src^="http://www.kickstarter.com"]',
			'object',
			'embed'
		];

	_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 58);
function getSelectors(customSelector) {
		_yuitest_coverfunc("/build/gallery-node-fitvids/gallery-node-fitvids.js", "getSelectors", 58);
_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 59);
var selectors = [].concat(SELECTORS);
		
		_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 61);
if (customSelector) {
			_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 62);
selectors.push(customSelector);
		}

		_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 65);
return selectors.join(',');
	}

	/**
	 * FitVids Node Plugin.
	 *
	 * @namespace Y.Plugin
	 * @class NodeFitVids
	 * @extends Plugin.Base
	 */
	_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 75);
Y.namespace('Plugin').NodeFitVids = Y.Base.create('NodeFitVids', Y.Plugin.Base, [], {
		initializer: function (config) {
			_yuitest_coverfunc("/build/gallery-node-fitvids/gallery-node-fitvids.js", "initializer", 76);
_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 77);
var host = this.get('host'),
				query = getSelectors(this.get('customSelector'));

			_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 80);
if (!Y.instanceOf(host, Y.Node)) {
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 81);
return;
			}

			_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 84);
host.all(query).each(function () {
				_yuitest_coverfunc("/build/gallery-node-fitvids/gallery-node-fitvids.js", "(anonymous 2)", 84);
_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 85);
var tagName = this.get('tagName'),
					parentNode = this.get('parentNode'),
					heightAttr = this.get('height'),
					widthAttr = this.get('width'),
					data = {},
					height,
					width,
					aspectRatio;

				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 94);
if ((tagName === 'EMBED' && parentNode.get('tagName') === 'OBJECT') || parentNode.hasClass(CLASS_NAME)) {
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 95);
return;
				}

				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 98);
height = tagName === 'OBJECT' ? heightAttr : this.getComputedStyle('height');
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 99);
width = this.getComputedStyle('width');
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 100);
aspectRatio = parseInt(height, 10) / parseInt(width, 10);

				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 102);
this.wrap('<div class="' + CLASS_NAME + '"></div>');
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 103);
this.ancestor(ANCESTOR_SELECTOR).setStyle('paddingTop', (aspectRatio * 100) + '%');

				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 105);
if (heightAttr) {
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 106);
data.height = heightAttr;
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 107);
this.removeAttribute('height');
				}
				
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 110);
if (widthAttr) {
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 111);
data.width = widthAttr;
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 112);
this.removeAttribute('width');
				}

				// Save the original values of the height and width so we can restore them on unplug()
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 116);
this.setData(DATA_KEY, data);
			});
		},
		
		
		destructor: function () {
			_yuitest_coverfunc("/build/gallery-node-fitvids/gallery-node-fitvids.js", "destructor", 121);
_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 122);
var host = this.get('host'),
				query = getSelectors(this.get('customSelector'));
			
			_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 125);
if (!Y.instanceOf(host, Y.Node)) {
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 126);
return;
			}
			
			_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 129);
host.all(query).each(function () {
				_yuitest_coverfunc("/build/gallery-node-fitvids/gallery-node-fitvids.js", "(anonymous 3)", 129);
_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 130);
var originalDimensions;
				
				_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 132);
if (this.ancestor(ANCESTOR_SELECTOR)) {
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 133);
this.unwrap();

					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 135);
originalDimensions = this.getData(DATA_KEY) || {};
					
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 137);
if (originalDimensions.height) {
						_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 138);
this.set('height', originalDimensions.height);
					}

					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 141);
if (originalDimensions.width) {
						_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 142);
this.set('width', originalDimensions.width);
					}
					
					_yuitest_coverline("/build/gallery-node-fitvids/gallery-node-fitvids.js", 145);
this.clearData(DATA_KEY);
				}
			});
		}
	}, {
		NS: 'fitvids',
		
		ATTRS: {
			/**
			 * @attribute customSelector
			 * @description Video vendor selector if none of the default selectors match the the player you wish to target.
			 * @type String
			 * @writeOnce
			 */
			customSelector: null
		}
	});


}, 'gallery-2012.10.10-19-59' ,{skinnable:true, requires:['plugin', 'base-build', 'node-base', 'node-style', 'node-pluginhost', 'classnamemanager']});
