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
_yuitest_coverage["/build/gallery-imagecropper/gallery-imagecropper.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-imagecropper/gallery-imagecropper.js",
    code: []
};
_yuitest_coverage["/build/gallery-imagecropper/gallery-imagecropper.js"].code=["YUI.add('gallery-imagecropper', function(Y) {","","'use strict';","/**"," * @description <p>Creates an Image Cropper control.</p>"," * @requires widget, resize, gallery-event-arrow"," * @module gallery-imagecropper"," */","","var Lang = Y.Lang,","	isNumber = Lang.isNumber,","	YArray = Y.Array,","	getClassName = Y.ClassNameManager.getClassName,","	IMAGE_CROPPER = 'imagecropper',","	RESIZE = 'resize',","	MASK = 'mask',","	KNOB = 'knob',","	","	_classNames = {","		cropMask: getClassName(IMAGE_CROPPER, MASK),","		resizeKnob: getClassName(IMAGE_CROPPER, RESIZE, KNOB),","		resizeMask: getClassName(IMAGE_CROPPER, RESIZE, MASK)","	},","","/**"," * @constructor"," * @class ImageCropper"," * @description <p>Creates an Image Cropper control.</p>"," * @extends Widget"," * @param {Object} config Object literal containing configuration parameters.","*/","/**"," * The identity of the widget."," *"," * @property ImageCropper.NAME"," * @type String"," * @default 'imagecropper'"," * @readOnly"," * @protected"," * @static"," */","ImageCropper = Y.Base.create('imagecropper', Y.Widget, [], {","	","	CONTENT_TEMPLATE: '<img/>',","	","	_toggleKeys: function (e) {","		if (e.newVal) {","			this._bindArrows();","		} else {","			this._unbindArrows();","		}","	},","	","	_moveResizeKnob: function (e) {","		e.preventDefault(); // prevent scroll in Firefox","		","		var resizeKnob = this.get('resizeKnob'),","			contentBox = this.get('contentBox'),","			","			knobWidth = resizeKnob.get('offsetWidth'),","			knobHeight = resizeKnob.get('offsetHeight'),","		","			tick = e.shiftKey ? this.get('shiftKeyTick') : this.get('keyTick'),","			direction = e.direction,","			","			tickH = direction.indexOf('w') > -1 ? -tick : direction.indexOf('e') > -1 ? tick : 0,","			tickV = direction.indexOf('n') > -1 ? -tick : direction.indexOf('s') > -1 ? tick : 0,","			","			x = resizeKnob.getX() + tickH,","			y = resizeKnob.getY() + tickV,","			","			minX = contentBox.getX(),","			minY = contentBox.getY(),","			","			maxX = minX + contentBox.get('offsetWidth') - knobWidth,","			maxY = minY + contentBox.get('offsetHeight') - knobHeight,","			","			o;","			","		if (x < minX) {","			x = minX;","		} else if (x > maxX) {","			x = maxX;","		}","		if (y < minY) {","			y = minY;","		} else if (y > maxY) {","			y = maxY;","		}","		resizeKnob.setXY([x, y]);","		","		o = {","			width: knobWidth,","			height: knobHeight,","			left: resizeKnob.get('offsetLeft'),","			top: resizeKnob.get('offsetTop'),","			sourceEvent: e.type","		};","		","		o[e.type + 'Event'] = e;","		this.fire('crop:start', o);","		this.fire('crop:crop', o);","		this.fire('crop:end', o);","		","		this._syncResizeMask();","	},","	","	_defCropMaskValueFn: function () {","		return Y.Node.create(ImageCropper.CROP_MASK_TEMPLATE);","	},","","	_defResizeKnobValueFn: function () {","		return Y.Node.create(ImageCropper.RESIZE_KNOB_TEMPLATE);","	},","","	_defResizeMaskValueFn: function () {","		return Y.Node.create(ImageCropper.RESIZE_MASK_TEMPLATE);","	},","","	_renderCropMask: function (boundingBox) {","		var node = this.get('cropMask');","		if (!node.inDoc()) {","			boundingBox.append(node);","		}","	},","","	_renderResizeKnob: function (boundingBox) {","		var node = this.get('resizeKnob');","		if (!node.inDoc()) {","			boundingBox.append(node);","		}","		node.setStyle('backgroundImage', 'url(' + this.get('source') + ')');","	},","","	_renderResizeMask: function () {","		var node = this.get('resizeMask');","		if (!node.inDoc()) {","			this.get('resizeKnob').append(node);","		}","	},","","	_handleSrcChange: function (e) {","		this.get('contentBox').set('src', e.newVal);","		this.get('resizeKnob').setStyle('backgroundImage', 'url(' + e.newVal + ')');","	},","	","	_syncResizeKnob: function () {","		var initialXY = this.get('initialXY');","		","		this.get('resizeKnob').setStyles({","			left: initialXY[0],","			top: initialXY[1],","			width: this.get('initWidth'),","			height: this.get('initHeight')","		});","	},","	","	_syncResizeMask: function () {","		var resizeKnob = this.get('resizeKnob');","		resizeKnob.setStyle('backgroundPosition', (-resizeKnob.get('offsetLeft')) + 'px ' + (-resizeKnob.get('offsetTop')) + 'px');","	},","	","	_syncResizeAttr: function (e) {","		if (this._resize) {","			this._resize.con.set(e.attrName, e.newVal);","		}","	},","	","	_icEventProxy: function (target, ns, eventType) {","		var sourceEvent = ns + ':' + eventType,","			resizeKnob = this.get('resizeKnob');","			","		target.on(sourceEvent, function (e) {","			","			var o = {","				width: resizeKnob.get('offsetWidth'),","				height: resizeKnob.get('offsetHeight'),","				left: resizeKnob.get('offsetLeft'),","				top: resizeKnob.get('offsetTop')","			};","			o[ns + 'Event'] = e;","			","			/**","			* @event resize:start","			* @description Relay of the Resize utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event resize:resize","			* @description Relay of the Resize utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event resize:end","			* @description Relay of the Resize utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event drag:start","			* @description Relay of the Drag utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event drag:resize","			* @description Relay of the Drag utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event drag:end","			* @description Relay of the Drag utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			this.fire(sourceEvent, o);","			","			o.sourceEvent = sourceEvent;","			","			/**","			* @event crop:start","			* @description Fires at the start of a crop operation. Unifies drag:start and and resize:start.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>","			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>","			* <dt>width</dt><dd>The new width of the crop area.</dd>","			* <dt>height</dt><dd>The new height of the crop area.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event crop:crop","			* @description Fires every time the crop area changes. Unifies drag:drag and resize:resize.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>","			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>","			* <dt>width</dt><dd>The new width of the crop area.</dd>","			* <dt>height</dt><dd>The new height of the crop area.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event crop:end","			* @description Fires at the end of a crop operation. Unifies drag:end and resize:end.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>","			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>","			* <dt>width</dt><dd>The new width of the crop area.</dd>","			* <dt>height</dt><dd>The new height of the crop area.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			this.fire('crop:' + (eventType == ns ? 'crop' : eventType), o);","			","		}, this);","	},","	","	_bindArrows: function () {","		this._arrowHandler = this.get('resizeKnob').on('arrow', this._moveResizeKnob, this);","	},","	","	_unbindArrows: function () {","		if (this._arrowHandler) {","			this._arrowHandler.detach();","		}","	},","	","	_bindResize: function (resizeKnob, contentBox) {","		var resize = this._resize = new Y.Resize({","			node: resizeKnob","		});","		resize.on('resize:resize', this._syncResizeMask, this);","		resize.plug(Y.Plugin.ResizeConstrained, {","			constrain: contentBox,","			minHeight: this.get('minHeight'),","			minWidth: this.get('minWidth'),","			preserveRatio: this.get('preserveRatio')","		});","		YArray.each(ImageCropper.RESIZE_EVENTS, Y.bind(this._icEventProxy, this, resize, 'resize'));","	},","	","	_bindDrag: function (resizeKnob, contentBox) {","		var drag = this._drag = new Y.DD.Drag({","			node: resizeKnob,","			handles: [this.get('resizeMask')]","		});","		drag.on('drag:drag', this._syncResizeMask, this);","		drag.plug(Y.Plugin.DDConstrained, {","			constrain2node: contentBox","		});","		YArray.each(ImageCropper.DRAG_EVENTS, Y.bind(this._icEventProxy, this, drag, 'drag'));","	},","	","	initializer: function () {","		this.set('initialXY', this.get('initialXY') || [10, 10]);","		this.set('initWidth', this.get('initWidth'));","		this.set('initHeight', this.get('initHeight'));","","		this.after('sourceChange', this._handleSrcChange);","		this.after('useKeysChange', this._toggleKeys);","		","		this._icHandlers = [];","		","		YArray.each(ImageCropper.RESIZE_ATTRS, function (attr) {","			this.after(attr + 'Change', this._syncResizeAttr);","		}, this);","	},","	","	renderUI: function () {","		var boundingBox = this.get('boundingBox');","		","		this._renderCropMask(boundingBox);","		this._renderResizeKnob(boundingBox);","		this._renderResizeMask();","	},","	","	bindUI: function () {","		var contentBox = this.get('contentBox'),","			resizeKnob = this.get('resizeKnob');","			","		this._icHandlers.push(","			resizeKnob.on('focus', this._attachKeyBehavior, this),","			resizeKnob.on('blur', this._detachKeyBehavior, this),","			resizeKnob.on('mousedown', resizeKnob.focus, resizeKnob)","		);","		","		this._bindArrows();","		","		this._bindResize(resizeKnob, contentBox);","		this._bindDrag(resizeKnob, contentBox);","	},","	","	syncUI: function () {","		this.get('contentBox').set('src', this.get('source'));","		","		this._syncResizeKnob();","		this._syncResizeMask();","	},","	","	/**","	 * Returns the coordinates needed to crop the image","	 * ","	 * @method getCropCoords","	 * @return {Object} The top, left, height, width and image url of the image being cropped","	 */","	getCropCoords: function () {","		var resizeKnob = this.get('resizeKnob'),","			result, xy;","		","		if (resizeKnob.inDoc()) {","			result = {","				left: resizeKnob.get('offsetLeft'),","				top: resizeKnob.get('offsetTop'),","				width: resizeKnob.get('offsetWidth'),","				height: resizeKnob.get('offsetHeight')","			};","		} else {","			xy = this.get('initialXY');","			result = {","				left: xy[0],","				top: xy[1],","				width: this.get('initWidth'),","				height: this.get('initHeight')","			};","		}","		result.image = this.get('source');","		","		return result;","	},","	","	/**","	 * Resets the crop element back to it's original position","	 * ","	 * @method reset","	 * @chainable","	 */","	reset: function () {","		var initialXY = this.get('initialXY');","		this.get('resizeKnob').setStyles({","			left: initialXY[0],","			top: initialXY[1],","			width: this.get('initWidth'),","			height: this.get('initHeight')","		});","		this._syncResizeMask();","		return this;","	},","	","	destructor: function () {","		if (this._resize) {","			this._resize.destroy();","		}","		if (this._drag) {","			this._drag.destroy();","		}","		","		YArray.each(this._icHandlers, function (handler) {","			handler.detach();","		});","		this._unbindArrows();","		","		this._drag = this._resize = null;","	}","	","}, {","	","	/**","	 * Template that will contain the ImageCropper's mask.","	 *","	 * @property ImageCropper.CROP_MASK_TEMPLATE","	 * @type {HTML}","	 * @default &lt;div class=\"[...-mask]\">&lt;/div>","	 * @protected","	 * @static","	 */","	CROP_MASK_TEMPLATE: '<div class=\"' + _classNames.cropMask + '\"></div>',","	/**","	 * Template that will contain the ImageCropper's resize node.","	 *","	 * @property ImageCropper.RESIZE_KNOB_TEMPLATE","	 * @type {HTML}","	 * @default &lt;div class=\"[...-resize-knob]\" tabindex=\"0\">&lt;/div>","	 * @protected","	 * @static","	 */","	RESIZE_KNOB_TEMPLATE: '<div class=\"' + _classNames.resizeKnob + '\" tabindex=\"0\"></div>',","	/**","	 * Template that will contain the ImageCropper's resize mask.","	 *","	 * @property ImageCropper.RESIZE_MASK_TEMPLATE","	 * @type {HTML}","	 * @default &lt;div class=\"[...-resize-mask]\">&lt;/div>","	 * @protected","	 * @static","	 */","	RESIZE_MASK_TEMPLATE: '<div class=\"' + _classNames.resizeMask + '\"></div>',","	","	/**","	 * Array of events to relay from the Resize utility to the ImageCropper ","	 *","	 * @property ImageCropper.RESIZE_EVENTS","	 * @type {Array}","	 * @private","	 * @static","	 */","	RESIZE_EVENTS: ['start', 'resize', 'end'],","	/**","	 * Array of attributes to relay from the ImageCropper to the Resize utility ","	 *","	 * @property ImageCropper.RESIZE_ATTRS","	 * @type {Array}","	 * @private","	 * @static","	 */","	RESIZE_ATTRS: ['minWidth', 'minHeight', 'preserveRatio'],","	/**","	 * Array of events to relay from the Drag utility to the ImageCropper ","	 *","	 * @property ImageCropper.DRAG_EVENTS","	 * @type {Array}","	 * @private","	 * @static","	 */","	DRAG_EVENTS: ['start', 'drag', 'end'],","	","	HTML_PARSER: {","		","		source: function (srcNode) {","			return srcNode.get('src');","		},","		","		cropMask: '.' + _classNames.cropMask,","		resizeKnob: '.' + _classNames.resizeKnob,","		resizeMask: '.' + _classNames.resizeMask","		","	},","	","	/**","	 * Static property used to define the default attribute configuration of","	 * the Widget.","	 *","	 * @property ImageCropper.ATTRS","	 * @type {Object}","	 * @protected","	 * @static","	 */","	ATTRS: {","		","		/**","		 * The source attribute of the image we are cropping","		 *","		 * @attribute source","		 * @type {String}","		 */","		source: { value: '' },","		","		/**","		 * The resize mask used to highlight the crop area","		 *","		 * @attribute resizeMask","		 * @type {Node}","		 */","		resizeMask: {","			setter: function (node) {","				node = Y.one(node);","				if (node) {","					node.addClass(_classNames.resizeMask);","				}","				return node;","			},","","			valueFn: '_defResizeMaskValueFn'","		},","		","		/**","		 * The resized element","		 *","		 * @attribute resizeKnob","		 * @type {Node}","		 */","		resizeKnob: {","			setter: function (node) {","				node = Y.one(node);","				if (node) {","					node.addClass(_classNames.resizeKnob);","				}","				return node;","			},","","			valueFn: '_defResizeKnobValueFn'","		},","		","		/**","		 * Element used to shadow the part of the image we're not cropping","		 *","		 * @attribute cropMask","		 * @type {Node}","		 */","		cropMask: {","			setter: function (node) {","				node = Y.one(node);","				if (node) {","					node.addClass(_classNames.cropMask);","				}","				return node;","			},","","			valueFn: '_defCropMaskValueFn'","		},","		","		/**","		 * Array of the XY position that we need to set the crop element to when we build it","		 *","		 * @attribute initialXY","		 * @type {Array}","		 * @default [10, 10]","		 */","		initialXY: {","			validator: Lang.isArray","		},","		","		/**","		 * The pixel tick for the arrow keys","		 *","		 * @attribute keyTick","		 * @type {Number}","		 * @default 1","		 */","		keyTick: {","			value: 1,","			validator: isNumber","		},","		","		/**","		 * The pixel tick for shift + the arrow keys","		 *","		 * @attribute shiftKeyTick","		 * @type {Number}","		 * @default 10","		 */","		shiftKeyTick: {","			value: 10,","			validator: isNumber","		},","		","		/**","		 * Should we use the Arrow keys to position the crop element","		 *","		 * @attribute useKeys","		 * @type {Boolean}","		 * @default true","		 */","		useKeys: {","			value: true,","			validator: Lang.isBoolean","		},","		","		/**","		 * Show the Resize and Drag utilities status","		 *","		 * @attribute status","		 * @type {Boolean}","		 * @readOnly","		 */","		status: {","			readOnly: true,","			getter: function () {","				var resizing = this._resize ? this._resize.get('resizing') : false,","					drag = this._drag ? this._drag.get('dragging') : false;","				return resizing || drag;","			}","		},","		","		/**","		 * MinHeight of the crop area","		 *","		 * @attribute minHeight","		 * @type {Number}","		 * @default 50","		 */","		minHeight: {","			value: 50,","			validator: isNumber","		},","		","		/**","		 * MinWidth of the crop area","		 *","		 * @attribute minWidth","		 * @type {Number}","		 * @default 50","		 */","		minWidth: {","			value: 50,","			validator: isNumber","		},","		","		/**","		 * Set the preserveRatio config option of the Resize Utlility","		 *","		 * @attribute preserveRatio","		 * @type {Boolean}","		 * @default false","		 */","		preserveRatio: {","			value: false,","			validator: Lang.isBoolean","		},","		","		/**","		 * Set the initlal height of the crop area, defaults to minHeight","		 *","		 * @attribute initHeight","		 * @type {Number}","		 */","		initHeight: {","			value: 0,","			validator: isNumber,","			setter: function (value) {","				var minHeight = this.get('minHeight');","				return value < minHeight ? minHeight : value;","			}","		},","		","		/**","		 * Set the initlal width of the crop area, defaults to minWidth","		 *","		 * @attribute initWidth","		 * @type {Number}","		 */","		initWidth: {","			value: 0,","			validator: isNumber,","			setter: function (value) {","				var minWidth = this.get('minWidth');","				return value < minWidth ? minWidth : value;","			}","		}","		","	}","	","});","","Y.ImageCropper = ImageCropper;","","","}, 'gallery-2012.08.15-20-00' ,{requires:['widget','resize','gallery-event-arrow','dd-constrain'], skinnable:true});"];
_yuitest_coverage["/build/gallery-imagecropper/gallery-imagecropper.js"].lines = {"1":0,"3":0,"10":0,"47":0,"48":0,"50":0,"55":0,"57":0,"80":0,"81":0,"82":0,"83":0,"85":0,"86":0,"87":0,"88":0,"90":0,"92":0,"100":0,"101":0,"102":0,"103":0,"105":0,"109":0,"113":0,"117":0,"121":0,"122":0,"123":0,"128":0,"129":0,"130":0,"132":0,"136":0,"137":0,"138":0,"143":0,"144":0,"148":0,"150":0,"159":0,"160":0,"164":0,"165":0,"170":0,"173":0,"175":0,"181":0,"237":0,"239":0,"277":0,"283":0,"287":0,"288":0,"293":0,"296":0,"297":0,"303":0,"307":0,"311":0,"312":0,"315":0,"319":0,"320":0,"321":0,"323":0,"324":0,"326":0,"328":0,"329":0,"334":0,"336":0,"337":0,"338":0,"342":0,"345":0,"351":0,"353":0,"354":0,"358":0,"360":0,"361":0,"371":0,"374":0,"375":0,"382":0,"383":0,"390":0,"392":0,"402":0,"403":0,"409":0,"410":0,"414":0,"415":0,"417":0,"418":0,"421":0,"422":0,"424":0,"426":0,"493":0,"529":0,"530":0,"531":0,"533":0,"547":0,"548":0,"549":0,"551":0,"565":0,"566":0,"567":0,"569":0,"632":0,"634":0,"684":0,"685":0,"699":0,"700":0,"708":0};
_yuitest_coverage["/build/gallery-imagecropper/gallery-imagecropper.js"].functions = {"_toggleKeys:46":0,"_moveResizeKnob:54":0,"_defCropMaskValueFn:108":0,"_defResizeKnobValueFn:112":0,"_defResizeMaskValueFn:116":0,"_renderCropMask:120":0,"_renderResizeKnob:127":0,"_renderResizeMask:135":0,"_handleSrcChange:142":0,"_syncResizeKnob:147":0,"_syncResizeMask:158":0,"_syncResizeAttr:163":0,"(anonymous 2):173":0,"_icEventProxy:169":0,"_bindArrows:282":0,"_unbindArrows:286":0,"_bindResize:292":0,"_bindDrag:306":0,"(anonymous 3):328":0,"initializer:318":0,"renderUI:333":0,"bindUI:341":0,"syncUI:357":0,"getCropCoords:370":0,"reset:401":0,"(anonymous 4):421":0,"destructor:413":0,"source:492":0,"setter:528":0,"setter:546":0,"setter:564":0,"getter:631":0,"setter:683":0,"setter:698":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-imagecropper/gallery-imagecropper.js"].coveredLines = 121;
_yuitest_coverage["/build/gallery-imagecropper/gallery-imagecropper.js"].coveredFunctions = 35;
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 1);
YUI.add('gallery-imagecropper', function(Y) {

_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 3);
'use strict';
/**
 * @description <p>Creates an Image Cropper control.</p>
 * @requires widget, resize, gallery-event-arrow
 * @module gallery-imagecropper
 */

_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 10);
var Lang = Y.Lang,
	isNumber = Lang.isNumber,
	YArray = Y.Array,
	getClassName = Y.ClassNameManager.getClassName,
	IMAGE_CROPPER = 'imagecropper',
	RESIZE = 'resize',
	MASK = 'mask',
	KNOB = 'knob',
	
	_classNames = {
		cropMask: getClassName(IMAGE_CROPPER, MASK),
		resizeKnob: getClassName(IMAGE_CROPPER, RESIZE, KNOB),
		resizeMask: getClassName(IMAGE_CROPPER, RESIZE, MASK)
	},

/**
 * @constructor
 * @class ImageCropper
 * @description <p>Creates an Image Cropper control.</p>
 * @extends Widget
 * @param {Object} config Object literal containing configuration parameters.
*/
/**
 * The identity of the widget.
 *
 * @property ImageCropper.NAME
 * @type String
 * @default 'imagecropper'
 * @readOnly
 * @protected
 * @static
 */
ImageCropper = Y.Base.create('imagecropper', Y.Widget, [], {
	
	CONTENT_TEMPLATE: '<img/>',
	
	_toggleKeys: function (e) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_toggleKeys", 46);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 47);
if (e.newVal) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 48);
this._bindArrows();
		} else {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 50);
this._unbindArrows();
		}
	},
	
	_moveResizeKnob: function (e) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_moveResizeKnob", 54);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 55);
e.preventDefault(); // prevent scroll in Firefox
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 57);
var resizeKnob = this.get('resizeKnob'),
			contentBox = this.get('contentBox'),
			
			knobWidth = resizeKnob.get('offsetWidth'),
			knobHeight = resizeKnob.get('offsetHeight'),
		
			tick = e.shiftKey ? this.get('shiftKeyTick') : this.get('keyTick'),
			direction = e.direction,
			
			tickH = direction.indexOf('w') > -1 ? -tick : direction.indexOf('e') > -1 ? tick : 0,
			tickV = direction.indexOf('n') > -1 ? -tick : direction.indexOf('s') > -1 ? tick : 0,
			
			x = resizeKnob.getX() + tickH,
			y = resizeKnob.getY() + tickV,
			
			minX = contentBox.getX(),
			minY = contentBox.getY(),
			
			maxX = minX + contentBox.get('offsetWidth') - knobWidth,
			maxY = minY + contentBox.get('offsetHeight') - knobHeight,
			
			o;
			
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 80);
if (x < minX) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 81);
x = minX;
		} else {_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 82);
if (x > maxX) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 83);
x = maxX;
		}}
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 85);
if (y < minY) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 86);
y = minY;
		} else {_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 87);
if (y > maxY) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 88);
y = maxY;
		}}
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 90);
resizeKnob.setXY([x, y]);
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 92);
o = {
			width: knobWidth,
			height: knobHeight,
			left: resizeKnob.get('offsetLeft'),
			top: resizeKnob.get('offsetTop'),
			sourceEvent: e.type
		};
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 100);
o[e.type + 'Event'] = e;
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 101);
this.fire('crop:start', o);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 102);
this.fire('crop:crop', o);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 103);
this.fire('crop:end', o);
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 105);
this._syncResizeMask();
	},
	
	_defCropMaskValueFn: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_defCropMaskValueFn", 108);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 109);
return Y.Node.create(ImageCropper.CROP_MASK_TEMPLATE);
	},

	_defResizeKnobValueFn: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_defResizeKnobValueFn", 112);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 113);
return Y.Node.create(ImageCropper.RESIZE_KNOB_TEMPLATE);
	},

	_defResizeMaskValueFn: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_defResizeMaskValueFn", 116);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 117);
return Y.Node.create(ImageCropper.RESIZE_MASK_TEMPLATE);
	},

	_renderCropMask: function (boundingBox) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_renderCropMask", 120);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 121);
var node = this.get('cropMask');
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 122);
if (!node.inDoc()) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 123);
boundingBox.append(node);
		}
	},

	_renderResizeKnob: function (boundingBox) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_renderResizeKnob", 127);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 128);
var node = this.get('resizeKnob');
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 129);
if (!node.inDoc()) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 130);
boundingBox.append(node);
		}
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 132);
node.setStyle('backgroundImage', 'url(' + this.get('source') + ')');
	},

	_renderResizeMask: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_renderResizeMask", 135);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 136);
var node = this.get('resizeMask');
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 137);
if (!node.inDoc()) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 138);
this.get('resizeKnob').append(node);
		}
	},

	_handleSrcChange: function (e) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_handleSrcChange", 142);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 143);
this.get('contentBox').set('src', e.newVal);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 144);
this.get('resizeKnob').setStyle('backgroundImage', 'url(' + e.newVal + ')');
	},
	
	_syncResizeKnob: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_syncResizeKnob", 147);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 148);
var initialXY = this.get('initialXY');
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 150);
this.get('resizeKnob').setStyles({
			left: initialXY[0],
			top: initialXY[1],
			width: this.get('initWidth'),
			height: this.get('initHeight')
		});
	},
	
	_syncResizeMask: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_syncResizeMask", 158);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 159);
var resizeKnob = this.get('resizeKnob');
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 160);
resizeKnob.setStyle('backgroundPosition', (-resizeKnob.get('offsetLeft')) + 'px ' + (-resizeKnob.get('offsetTop')) + 'px');
	},
	
	_syncResizeAttr: function (e) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_syncResizeAttr", 163);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 164);
if (this._resize) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 165);
this._resize.con.set(e.attrName, e.newVal);
		}
	},
	
	_icEventProxy: function (target, ns, eventType) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_icEventProxy", 169);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 170);
var sourceEvent = ns + ':' + eventType,
			resizeKnob = this.get('resizeKnob');
			
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 173);
target.on(sourceEvent, function (e) {
			
			_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "(anonymous 2)", 173);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 175);
var o = {
				width: resizeKnob.get('offsetWidth'),
				height: resizeKnob.get('offsetHeight'),
				left: resizeKnob.get('offsetLeft'),
				top: resizeKnob.get('offsetTop')
			};
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 181);
o[ns + 'Event'] = e;
			
			/**
			* @event resize:start
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event resize:resize
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event resize:end
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:start
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:resize
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:end
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 237);
this.fire(sourceEvent, o);
			
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 239);
o.sourceEvent = sourceEvent;
			
			/**
			* @event crop:start
			* @description Fires at the start of a crop operation. Unifies drag:start and and resize:start.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event crop:crop
			* @description Fires every time the crop area changes. Unifies drag:drag and resize:resize.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event crop:end
			* @description Fires at the end of a crop operation. Unifies drag:end and resize:end.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 277);
this.fire('crop:' + (eventType == ns ? 'crop' : eventType), o);
			
		}, this);
	},
	
	_bindArrows: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_bindArrows", 282);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 283);
this._arrowHandler = this.get('resizeKnob').on('arrow', this._moveResizeKnob, this);
	},
	
	_unbindArrows: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_unbindArrows", 286);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 287);
if (this._arrowHandler) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 288);
this._arrowHandler.detach();
		}
	},
	
	_bindResize: function (resizeKnob, contentBox) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_bindResize", 292);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 293);
var resize = this._resize = new Y.Resize({
			node: resizeKnob
		});
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 296);
resize.on('resize:resize', this._syncResizeMask, this);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 297);
resize.plug(Y.Plugin.ResizeConstrained, {
			constrain: contentBox,
			minHeight: this.get('minHeight'),
			minWidth: this.get('minWidth'),
			preserveRatio: this.get('preserveRatio')
		});
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 303);
YArray.each(ImageCropper.RESIZE_EVENTS, Y.bind(this._icEventProxy, this, resize, 'resize'));
	},
	
	_bindDrag: function (resizeKnob, contentBox) {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "_bindDrag", 306);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 307);
var drag = this._drag = new Y.DD.Drag({
			node: resizeKnob,
			handles: [this.get('resizeMask')]
		});
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 311);
drag.on('drag:drag', this._syncResizeMask, this);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 312);
drag.plug(Y.Plugin.DDConstrained, {
			constrain2node: contentBox
		});
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 315);
YArray.each(ImageCropper.DRAG_EVENTS, Y.bind(this._icEventProxy, this, drag, 'drag'));
	},
	
	initializer: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "initializer", 318);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 319);
this.set('initialXY', this.get('initialXY') || [10, 10]);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 320);
this.set('initWidth', this.get('initWidth'));
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 321);
this.set('initHeight', this.get('initHeight'));

		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 323);
this.after('sourceChange', this._handleSrcChange);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 324);
this.after('useKeysChange', this._toggleKeys);
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 326);
this._icHandlers = [];
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 328);
YArray.each(ImageCropper.RESIZE_ATTRS, function (attr) {
			_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "(anonymous 3)", 328);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 329);
this.after(attr + 'Change', this._syncResizeAttr);
		}, this);
	},
	
	renderUI: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "renderUI", 333);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 334);
var boundingBox = this.get('boundingBox');
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 336);
this._renderCropMask(boundingBox);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 337);
this._renderResizeKnob(boundingBox);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 338);
this._renderResizeMask();
	},
	
	bindUI: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "bindUI", 341);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 342);
var contentBox = this.get('contentBox'),
			resizeKnob = this.get('resizeKnob');
			
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 345);
this._icHandlers.push(
			resizeKnob.on('focus', this._attachKeyBehavior, this),
			resizeKnob.on('blur', this._detachKeyBehavior, this),
			resizeKnob.on('mousedown', resizeKnob.focus, resizeKnob)
		);
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 351);
this._bindArrows();
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 353);
this._bindResize(resizeKnob, contentBox);
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 354);
this._bindDrag(resizeKnob, contentBox);
	},
	
	syncUI: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "syncUI", 357);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 358);
this.get('contentBox').set('src', this.get('source'));
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 360);
this._syncResizeKnob();
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 361);
this._syncResizeMask();
	},
	
	/**
	 * Returns the coordinates needed to crop the image
	 * 
	 * @method getCropCoords
	 * @return {Object} The top, left, height, width and image url of the image being cropped
	 */
	getCropCoords: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "getCropCoords", 370);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 371);
var resizeKnob = this.get('resizeKnob'),
			result, xy;
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 374);
if (resizeKnob.inDoc()) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 375);
result = {
				left: resizeKnob.get('offsetLeft'),
				top: resizeKnob.get('offsetTop'),
				width: resizeKnob.get('offsetWidth'),
				height: resizeKnob.get('offsetHeight')
			};
		} else {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 382);
xy = this.get('initialXY');
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 383);
result = {
				left: xy[0],
				top: xy[1],
				width: this.get('initWidth'),
				height: this.get('initHeight')
			};
		}
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 390);
result.image = this.get('source');
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 392);
return result;
	},
	
	/**
	 * Resets the crop element back to it's original position
	 * 
	 * @method reset
	 * @chainable
	 */
	reset: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "reset", 401);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 402);
var initialXY = this.get('initialXY');
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 403);
this.get('resizeKnob').setStyles({
			left: initialXY[0],
			top: initialXY[1],
			width: this.get('initWidth'),
			height: this.get('initHeight')
		});
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 409);
this._syncResizeMask();
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 410);
return this;
	},
	
	destructor: function () {
		_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "destructor", 413);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 414);
if (this._resize) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 415);
this._resize.destroy();
		}
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 417);
if (this._drag) {
			_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 418);
this._drag.destroy();
		}
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 421);
YArray.each(this._icHandlers, function (handler) {
			_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "(anonymous 4)", 421);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 422);
handler.detach();
		});
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 424);
this._unbindArrows();
		
		_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 426);
this._drag = this._resize = null;
	}
	
}, {
	
	/**
	 * Template that will contain the ImageCropper's mask.
	 *
	 * @property ImageCropper.CROP_MASK_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-mask]">&lt;/div>
	 * @protected
	 * @static
	 */
	CROP_MASK_TEMPLATE: '<div class="' + _classNames.cropMask + '"></div>',
	/**
	 * Template that will contain the ImageCropper's resize node.
	 *
	 * @property ImageCropper.RESIZE_KNOB_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-resize-knob]" tabindex="0">&lt;/div>
	 * @protected
	 * @static
	 */
	RESIZE_KNOB_TEMPLATE: '<div class="' + _classNames.resizeKnob + '" tabindex="0"></div>',
	/**
	 * Template that will contain the ImageCropper's resize mask.
	 *
	 * @property ImageCropper.RESIZE_MASK_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-resize-mask]">&lt;/div>
	 * @protected
	 * @static
	 */
	RESIZE_MASK_TEMPLATE: '<div class="' + _classNames.resizeMask + '"></div>',
	
	/**
	 * Array of events to relay from the Resize utility to the ImageCropper 
	 *
	 * @property ImageCropper.RESIZE_EVENTS
	 * @type {Array}
	 * @private
	 * @static
	 */
	RESIZE_EVENTS: ['start', 'resize', 'end'],
	/**
	 * Array of attributes to relay from the ImageCropper to the Resize utility 
	 *
	 * @property ImageCropper.RESIZE_ATTRS
	 * @type {Array}
	 * @private
	 * @static
	 */
	RESIZE_ATTRS: ['minWidth', 'minHeight', 'preserveRatio'],
	/**
	 * Array of events to relay from the Drag utility to the ImageCropper 
	 *
	 * @property ImageCropper.DRAG_EVENTS
	 * @type {Array}
	 * @private
	 * @static
	 */
	DRAG_EVENTS: ['start', 'drag', 'end'],
	
	HTML_PARSER: {
		
		source: function (srcNode) {
			_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "source", 492);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 493);
return srcNode.get('src');
		},
		
		cropMask: '.' + _classNames.cropMask,
		resizeKnob: '.' + _classNames.resizeKnob,
		resizeMask: '.' + _classNames.resizeMask
		
	},
	
	/**
	 * Static property used to define the default attribute configuration of
	 * the Widget.
	 *
	 * @property ImageCropper.ATTRS
	 * @type {Object}
	 * @protected
	 * @static
	 */
	ATTRS: {
		
		/**
		 * The source attribute of the image we are cropping
		 *
		 * @attribute source
		 * @type {String}
		 */
		source: { value: '' },
		
		/**
		 * The resize mask used to highlight the crop area
		 *
		 * @attribute resizeMask
		 * @type {Node}
		 */
		resizeMask: {
			setter: function (node) {
				_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "setter", 528);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 529);
node = Y.one(node);
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 530);
if (node) {
					_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 531);
node.addClass(_classNames.resizeMask);
				}
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 533);
return node;
			},

			valueFn: '_defResizeMaskValueFn'
		},
		
		/**
		 * The resized element
		 *
		 * @attribute resizeKnob
		 * @type {Node}
		 */
		resizeKnob: {
			setter: function (node) {
				_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "setter", 546);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 547);
node = Y.one(node);
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 548);
if (node) {
					_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 549);
node.addClass(_classNames.resizeKnob);
				}
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 551);
return node;
			},

			valueFn: '_defResizeKnobValueFn'
		},
		
		/**
		 * Element used to shadow the part of the image we're not cropping
		 *
		 * @attribute cropMask
		 * @type {Node}
		 */
		cropMask: {
			setter: function (node) {
				_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "setter", 564);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 565);
node = Y.one(node);
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 566);
if (node) {
					_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 567);
node.addClass(_classNames.cropMask);
				}
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 569);
return node;
			},

			valueFn: '_defCropMaskValueFn'
		},
		
		/**
		 * Array of the XY position that we need to set the crop element to when we build it
		 *
		 * @attribute initialXY
		 * @type {Array}
		 * @default [10, 10]
		 */
		initialXY: {
			validator: Lang.isArray
		},
		
		/**
		 * The pixel tick for the arrow keys
		 *
		 * @attribute keyTick
		 * @type {Number}
		 * @default 1
		 */
		keyTick: {
			value: 1,
			validator: isNumber
		},
		
		/**
		 * The pixel tick for shift + the arrow keys
		 *
		 * @attribute shiftKeyTick
		 * @type {Number}
		 * @default 10
		 */
		shiftKeyTick: {
			value: 10,
			validator: isNumber
		},
		
		/**
		 * Should we use the Arrow keys to position the crop element
		 *
		 * @attribute useKeys
		 * @type {Boolean}
		 * @default true
		 */
		useKeys: {
			value: true,
			validator: Lang.isBoolean
		},
		
		/**
		 * Show the Resize and Drag utilities status
		 *
		 * @attribute status
		 * @type {Boolean}
		 * @readOnly
		 */
		status: {
			readOnly: true,
			getter: function () {
				_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "getter", 631);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 632);
var resizing = this._resize ? this._resize.get('resizing') : false,
					drag = this._drag ? this._drag.get('dragging') : false;
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 634);
return resizing || drag;
			}
		},
		
		/**
		 * MinHeight of the crop area
		 *
		 * @attribute minHeight
		 * @type {Number}
		 * @default 50
		 */
		minHeight: {
			value: 50,
			validator: isNumber
		},
		
		/**
		 * MinWidth of the crop area
		 *
		 * @attribute minWidth
		 * @type {Number}
		 * @default 50
		 */
		minWidth: {
			value: 50,
			validator: isNumber
		},
		
		/**
		 * Set the preserveRatio config option of the Resize Utlility
		 *
		 * @attribute preserveRatio
		 * @type {Boolean}
		 * @default false
		 */
		preserveRatio: {
			value: false,
			validator: Lang.isBoolean
		},
		
		/**
		 * Set the initlal height of the crop area, defaults to minHeight
		 *
		 * @attribute initHeight
		 * @type {Number}
		 */
		initHeight: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "setter", 683);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 684);
var minHeight = this.get('minHeight');
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 685);
return value < minHeight ? minHeight : value;
			}
		},
		
		/**
		 * Set the initlal width of the crop area, defaults to minWidth
		 *
		 * @attribute initWidth
		 * @type {Number}
		 */
		initWidth: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				_yuitest_coverfunc("/build/gallery-imagecropper/gallery-imagecropper.js", "setter", 698);
_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 699);
var minWidth = this.get('minWidth');
				_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 700);
return value < minWidth ? minWidth : value;
			}
		}
		
	}
	
});

_yuitest_coverline("/build/gallery-imagecropper/gallery-imagecropper.js", 708);
Y.ImageCropper = ImageCropper;


}, 'gallery-2012.08.15-20-00' ,{requires:['widget','resize','gallery-event-arrow','dd-constrain'], skinnable:true});
