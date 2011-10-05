/**
 * Provides an iPhone-style toggle button (checkbox) object
 * @module gallery-md-ibutton
 */
 "use strict";

var Lang = Y.Lang,
	BBX = 'boundingBox',
	CBX = 'contentBox',
	DISABLED = 'disabled',
	TITLE = 'title',
	LABEL_ON = 'labelOn',
	LABEL_OFF = 'labelOff',
	VALUE = 'value',
	REGION = 'region',
	WIDTH = 'width',
	AUTO = 'auto',
	BG_IMG = 'backgroundImage';
	
/**
 * The IButton class provides an IPhone style of sliding on/off button
 * @class IButton
 * @extends Y.Widget
 * @uses Y.MakeNode
 * @constructor
 * @param cfg {object} Configuration Attributes
 */

Y.IButton = Y.Base.create(
	'ibutton', 
	Y.Widget, 
	[Y.MakeNode], 
	{
		/** 
		 * Renders the elements and sets up the animation of the slider
		 * @method renderUI
		 * @protected
		 */
		renderUI: function () {
			this.get(CBX).append(this._makeNode());
			this._locateNodes('sliding',LABEL_ON,'slider',LABEL_OFF);
			this._slidingNode.plug(Y.Plugin.NodeFX, {
				from: {
					left: 0
				},
				to: {
					left: 0
				},

				easing: Y.Easing.easeOut,
				duration: 0.5
			});
			this._resize();
			this._slidingNode.fx.on('end', this._endAnim, this);
		},
		/**
		 * Calculates the size of the button based on the size of the labels.
		 * @method _resize
		 * @private
		 */
		_resize: function () {
			this._labelOnNode.setStyle(WIDTH, AUTO);
			this._labelOffNode.setStyle(WIDTH, AUTO);
			this.get(CBX).setStyle(WIDTH,AUTO);

			var onReg = this._labelOnNode.get(REGION),
				offReg = this._labelOffNode.get(REGION),
				w = ( Math.max(onReg.width, offReg.width) - 14) + 'px',
				sliderReg;

			this._labelOnNode.setStyle(WIDTH, w);
			this._labelOffNode.setStyle(WIDTH, w);
			onReg = this._labelOnNode.get(REGION);
			offReg = this._labelOffNode.get(REGION);
			sliderReg = this._sliderNode.get(REGION);
			
			this.get(CBX).setStyle(WIDTH,sliderReg.right - onReg.left);
			this._slidingNode.fx.set('to.left', - (sliderReg.left - onReg.left));
		},
		
		/**
		 * Responds to the end of the animation to completely hide the
		 * side that went off-screen
		 * @method _endAnim
		 * @private
		 */
		_endAnim: function () {
			(this.get(VALUE)?this._labelOffNode:this._labelOnNode).setStyle(BG_IMG, 'none');
		},
		

		/**
		 * Sets the title attribute to the bounding box
		 * @method _uiSetTitle
		 * @param title {String}
		 * @private
		 */
		_uiSetTitle: function (title) {
			this.get(BBX).set(TITLE, title);
		},

		/**
		 * Default click event handler
		 * @method _afterBoundingBoxClick
		 * @param ev {Event Facade}
		 * @private
		 */
		_afterBoundingBoxClick: function () {
			if (!this.get(DISABLED)) {
				this.toggle();
			}
		},
		/**
		 * Helper method to toggle the button state
		 * @method toggle
		 */
		toggle: function () {
			this.set(VALUE, !this.get(VALUE));
		},
		/**
		 * Sets the label for the ON side of the slider
		 * @method _uiSetLabelOn
		 * @param value {String} text of the label
		 * @private
		 */
		_uiSetLabelOn: function (value) {
			this._labelOnNode.setContent(value);
			this._resize();
		},
		/**
		 * Sets the label for the OFF side of the slider
		 * @method _uiSetLabelOff
		 * @param value {String} text of the label
		 * @private
		 */
		_uiSetLabelOff: function (value) {
			this._labelOffNode.setContent(value);
			this._resize();
		},
		/**
		 * Responds to a change in the value of the slider by moving it
		 * @method _uiSetValue
		 * @param value {Boolean} new value of the button
		 * @private
		 */
		_uiSetValue: function (value) {
			var  slidingFx = this._slidingNode.fx;
			this._labelOnNode.setStyle(BG_IMG, '');
			this._labelOffNode.setStyle(BG_IMG, '');
			slidingFx.set('reverse', value);
			slidingFx.run();
		}
	}, 
	{
		/**
		 * Template to use by the MakeNode extension
		 * @property _TEMPLATE
		 * @type String
		 * @static
		 * @protected
		 */			
		_TEMPLATE: [
			'<div class="{c sliding}">',
				'<div class="{c labelOn}">{@ labelOn}</div>',
				'<div class="{c slider}">',
					'<div class="{c sliderLeft}"></div>',
					'<div class="{c sliderCenter}"></div>',
					'<div class="{c sliderRight}"></div>',
				'</div>',
				'<div class="{c labelOff}">{@ labelOff}</div>',
			'</div>'
		].join(''),
		
		/**
		 * Class name suffixes for CSS classNames used in the widget
		 * @property Y.Button._CLASS_NAMES
		 * @type [Strings]
		 * @static
		 * @protected
		 */
		_CLASS_NAMES: ['sliding',LABEL_ON,'slider','sliderLeft','sliderCenter','sliderRight',LABEL_OFF],
		/**
		 * DOM events to be listened to, used by the MakeNode extension
		 * @property Y.Button._EVENTS
		 * @type Object
		 * @static
		 * @protected
		 */
		_EVENTS: {
			boundingBox: ['click']
		}, 
		ATTRS: {
			/**
			 * Value of the button
			 * @attribute value
			 * @type Boolean
			 * @default false
			 */
			value: {
				value: false,
				validator: Lang.isBoolean
			},
			/**
			 * Title (tooltip) of the button
			 * @attribute title
			 * @type String
			 * @default ""
			 */
			title: {
				value: '',
				validator: Lang.isString
			},
			/**
			 * Localizable strings.  Contains the default values for the on and off labels.
			 * @attribute strings
			 * @type Object
			 */
			strings: {
				value: {
					labelOn: 'on',
					labelOff: 'off'
				}
			},
			/**
			 * Text for the on side of the button
			 * @attribute labelOn
			 * @type String
			 * @default "on"
			 */
			labelOn: {
				valueFn: function () {
					return this.get('strings.labelOn');
				},
				validator: Lang.isString
			},
			/**
			 * Text for the off side of the button
			 * @attribute labelOff
			 * @type String
			 * @default "off"
			 */
			labelOff: {
				valueFn: function () {
					return this.get('strings.labelOff');
				},
				validator: Lang.isString
			}
		},
		_ATTRS_2_UI: {
			BIND: [LABEL_ON,LABEL_OFF, TITLE, VALUE],
			SYNC: [LABEL_ON,LABEL_OFF, TITLE, VALUE]
		}
	}
);
