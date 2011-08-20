YUI.add('gallery-md-timespinner', function(Y) {

"use strict";

var SPINNER = 'Spinner',
	Lang = Y.Lang,
	CBX = 'contentBox',
	BBX = 'boundingBox',
	CHANGE = 'Change',
	VALUE = 'value',
	UI = 'ui',
	TIMESPINNER = 'TimeSpinner',
	VARIABLE = 'VariableSpeedTimeSpinner',
	AMPM = 'ampm',
	MIN = 'min',
	MAX = 'max',
	TIMER = 'ActiveTimeSpinner',
	INTERVAL = 'interval',
	SECONDS = 'seconds',
	SPEED = 'speed',
	AFTER = 'after',
	WRAPPED = 'wrapped';
	
Y[TIMESPINNER] = Y.Base.create(
	TIMESPINNER,
	Y.Widget,
	[Y.MakeNode],
	{
		_hourSp: null,
		_minSp: null,
		_secSp: null,
		_ampmSp: null,
		f: function(t) {
			if (t) {
				return t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+t.getMilliseconds();
			}
			return t;
		},
		renderUI: function() {
			var cbx = this.get(CBX);
				
			this._hourSp = new Y[SPINNER]({
				min:0,
				max: this.get(AMPM)?11:23,
				wraparound: true
			}).render(cbx);
			this._minSp = new Y[SPINNER]({
				min:0,
				max: 59,
				wraparound: true
			}).render(cbx);
		},
		_uiSetSeconds: function(value) {
			if (value) {
				this._secSp = new Y[SPINNER]({
					min:0,
					max: 59,
					wraparound: true
				}).render();
				this._minSp.get(BBX).insert(this._secSp.get(BBX), AFTER);
				this._secSp.after(VALUE + CHANGE, this._afterValueChange, this);
				this._secSp.after(WRAPPED, this._afterWrapped, this);
			} else if (this._secSp) {
				this._secSp.destroy();
				this._secSp = null;
			}
		},
		_uiSetAmpm: function (value) {
			if (value) {
				this._ampmSp = new Y[SPINNER]({
					min:0,
					max: 1,
					formatter: function(value) {
						return value.toUpperCase()?'PM':'AM';
					},
					parser: function (value) {
						switch (value.toUpperCase()) {
							case 'AM':
								return 0;
							case 'PM':
								return 1;
							default:
								return false;
						}
					},
					wraparound: true
				}).render();
				(this._secSp?this._secSp.get(BBX):this._minSp.get(BBX)).insert(this._ampmSp.get(BBX), AFTER);
				this._ampmSp.after(VALUE + CHANGE, this._afterValueChange, this);
				this._hourSp.set(MAX, 11);
			} else {
				this._hourSp.set(MAX, 23);
				if (this._ampmSp) {
					this._ampmSp.destroy();
					this._ampmSp = null;
				}
			}
		},
		bindUI: function () {
			this._hourSp.after(VALUE + CHANGE, this._afterValueChange, this);
			this._minSp.after(VALUE + CHANGE, this._afterValueChange, this);
			this._minSp.after(WRAPPED, this._afterWrapped, this);
			
		},
		_afterValueChange: function () {
			if (this._setting) {
				return;
			}
			var d = new Date();
			d.setHours(this._hourSp.get(VALUE) + (this._ampmSp? 12 * this._ampmSp.get(VALUE):0));
			d.setMinutes(this._minSp.get(VALUE));
			d.setSeconds(this._secSp?this._secSp.get(VALUE):0);
			this.set(VALUE, d, {src: UI}); 
		},
		_afterWrapped: function (ev) {
			var dir = ev.newVal > ev.prevVal?-1:1;
			if (ev.target === this._secSp) {
				this._minSp.set(VALUE, this._minSp.get(VALUE) + dir);
			}
			if (ev.target === this._minSp) {
				this._hourSp.set(VALUE, this._hourSp.get(VALUE) + dir);
			}
		},
		_uiSetValue: function (value, src) {
			if (src === UI) {
				return;
			}
			this._setting = true;
			var hours = value.getHours();
			if (this._ampmSp) {
				this._hourSp.set(VALUE, hours >= 12?hours - 12:hours);
				this._ampmSp.set(VALUE, hours >= 12?1:0);
			} else {
				this._hourSp.set(VALUE, hours);
			}
			this._minSp.set(VALUE, value.getMinutes());
			if (this._secSp) {
				this._secSp.set(VALUE, value.getSeconds());
			}
			this._setting = false;
		}
	},
	{
		ATTRS: {
			ampm : {
				value:false,
				validator: Lang.isBoolean
			},
			seconds:{
				value:true,
				validator: Lang.isBoolean
			},
			value: {
				valueFn: function() {
					return new Date();
				},
				validator: function (value) {
					return value instanceof Date;
				}
			}
		},
		_ATTRS_2_UI: {
			BIND: [AMPM, SECONDS, VALUE],
			SYNC: [AMPM, SECONDS, VALUE]
		}
	}
);

Y[TIMER] = Y.Base.create(
	TIMER,
	Y.TimeSpinner,
	[],
	{
		_timer: null,
		_offset: 0,
		_updateTime: function() {
			this._uiSetValue(this._getTime());
		},
		_uiSetInterval: function (value) {
			if (this._timer) {
				this._timer.cancel();
			}
			this._timer = Y.later(value, this, this._updateTime, [], true);
		},
		_getTime: function() {
			return new Date(Date.now() - this._offset);
		},
		_setTime: function (value) {
			this._offset = Date.now() - value.getTime();
			return value;
		}
	},
	{
		ATTRS: {
			interval: {
				value: 500,
				validator: Lang.isNumber
			},
			value: {
				getter:'_getTime',
				setter:'_setTime'
			}
		},
		_ATTRS_2_UI: {
			BIND: INTERVAL,
			SYNC: INTERVAL
		}
	}		
);

Y[VARIABLE] = Y.Base.create(
	VARIABLE,
	Y[TIMER],
	[],
	{
		_slider: null,
		initializer: function () {
		},
		renderUI: function () {
			var cbx = this.get(CBX);
			Y[VARIABLE].superclass.renderUI.apply(this, arguments);
			cbx.appendChild(this._makeNode(Y[VARIABLE]._SLIDER_BOX_TEMPLATE));
			cbx.appendChild(this._makeNode(Y[VARIABLE]._FACTOR_TEMPLATE));
			this._locateNodes();
			this._slider = new Y.Slider().render(this._sliderNode);
			this._sliderNode.appendChild(this._factorNode);
		},
		bindUI: function () {
			this._slider.after(VALUE + CHANGE, this._afterSliderChange, this);
			this.after(SPEED + CHANGE, this._afterSpeedChange, this);
			Y[VARIABLE].superclass.bindUI.apply(this, arguments);
		},
		_uiSetSpeed: function (value, src) {
			this._factorNode.setContent(Math.round(value * 100) / 100);
			if (src !== UI) {
				this._slider.set(VALUE, Math.log(value) / Math.LN10);
			}
		},
		_uiSetMin: function (value) {
			this._slider.set(MIN, Math.log(value) / Math.LN10);
		},
		_uiSetMax: function (value) {
			this._slider.set(MAX, Math.log(value) / Math.LN10);
		},
		_afterSpeedChange: function (ev) {
			var now = Date.now();
				
			this._offset = now - (now - this._offset) * ev.prevVal / ev.newVal;
		},
		_afterSliderChange: function (ev) {
			this.set(SPEED, Math.exp(ev.newVal * Math.LN10) , {src: UI});
		},
		_getTime: function() {
			return new Date((Date.now() - this._offset) * this.get(SPEED));
		}
	},
	{
		_CLASS_NAMES: ['factor','slider'],
		_SLIDER_BOX_TEMPLATE: '<fieldset class="{c slider}"><legend>Speed Multiplier</legend></fieldset>',
		_FACTOR_TEMPLATE:'<span class="{c factor}">{@ speed}</span>',
		
		ATTRS: {
			speed: {
				value:1,
				validator: Lang.isNumber
			},
			min: {
				value: 0.5,
				validator: Lang.isNumber
			},
			max: {
				value:20,
				validator: Lang.isNumber
			}				
		},
		_ATTRS_2_UI: {
			BIND: [SPEED, MIN, MAX],
			SYNC: [SPEED, MIN, MAX]
		}
	}
);




}, '@VERSION@' ,{skinnable:false, requires:['gallery-md-spinner', 'gallery-makenode']});
