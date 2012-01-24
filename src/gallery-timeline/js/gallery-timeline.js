/*global YUI*/
/**
 * @module timeline
 */

"use strict";

var Lang = Y.Lang,
	REGION = 'region',
	START = 'start',
	END = 'end',
	LEFT = 'left',
	CONTAINER = 'container',
	LOADED = 'loaded',
	CHANGE = 'Change',
	EVENT = 'event',
	CATEGORIES = 'categories',
	TOP = 'top',
	CENTER = 'center',
	RIGHT = 'right',
	PX = 'px',	
	STRINGS = 'strings',
	TIMELINE = 'timeline',
	cName = function() {
		return Y.ClassNameManager.getClassName.apply(this, [TIMELINE].concat(Y.Array(arguments)));
	},
	BLOCK_TEMPLATE = Y.Node.create('<div class="' + cName('bar') + '" />'),
	GRID_TEMPLATE = Y.Node.create('<div class="' + cName('grid') + '"/>'),
	POINTER_TEMPLATE = Y.Node.create('<div class="' + cName('pointer') + '" />'),
	CATEGORIES_TEMPLATE = '<div class="' + cName('cats') + '">{categories}<p class="' + cName('noCat') + '">{noCategory}</p></div>';		

Y.Timeline = Y.Base.create(
	TIMELINE,
	Y.Base,
	[],
	{
		initializer: function (cfg) {
			this.set(STRINGS, Y.Intl.get('gallery-' + TIMELINE));
			this.after('urlChange', this._load);
			this.after(CONTAINER + CHANGE, this._render);
			this.after(LOADED + CHANGE, this._render);
			if (cfg && cfg.url) {
				this._load();
			}
			if (cfg && cfg.container) {
				this._render();
			}
		},
		_readBoolean: function (xml, tag) {
			var val = this._readValue(xml, tag);
			return val?val.toLowerCase() === 'true':null;
		},
		_readDate: function (xml, tag) {
			var date, time,
				val = this._readValue(xml, tag);
			if (val) {
				val = val.split(' ');
				date = val[0].split('-');
				time = val[1].split(':');
				return new Date(date[0], date[1] -1 , date[2], time[0], time[1], time[2]).getTime();
			} else {
				return null;
			}
		},
		_readColor: function(xml, tag) {
			var c = this._readValue(xml, tag),
				pad = function(val) {
					return ('00' + parseInt(val,10).toString(16)).substr(-2);
				};

			if (c) {
				c = c.split(',');
				return '#' + pad(c[0]) + pad(c[1]) + pad(c[2]);
			} else {
				return null;
			}
		},
		_readValue: function(xml, tag) {
			var el = this._readEl(xml,tag);
			return el?el.textContent:null;
		},
		_readEl: function (xml, tag) {
			var el = xml.getElementsByTagName(tag);
			return (el && el.length)?el[0]:null;
		},
		_xmlReadCategories: function(cats) {
			var c = {};
			Y.each(cats.children, function (cat) {
				c[this._readValue(cat,'name')] = {
					color:this._readColor(cat,'color'),
					fontColor:this._readColor(cat,'font_color')
				};
			},this);
			this.set(CATEGORIES, c);

		},
		_xmlReadView: function (view) {
			var range = this._readEl(view,'displayed_period'),
				h = [],
				hiddenCat = this._readEl(view, 'hidden_categories').firstChild;

			if (range) {
				this.set(START, this._readDate(range, START));
				this.set(END, this._readDate(range, END));
			}
			while (hiddenCat) {
				h.push(hiddenCat.textContent);
				hiddenCat = hiddenCat.nextChild;
			}
			this.set('hiddenCats', h);
		},
		_xmlReadEvents: function (events) {
			this.events = [];
			Y.each(events.children, function (event) {
				this.events.push({						
					start: this._readDate(event, START),
					end: this._readDate(event,END),
					text: this._readValue(event,'text'),
					fuzzy: this._readBoolean(event,'fuzzy'),
					locked: this._readBoolean(event,'locked'),
					endsToday: this._readBoolean(event,'ends_today'),
					category: this._readValue(event, 'category'),
					description: this._readValue(event, 'description'),
					icon: this._readValue(event, 'icon')
				});

			}, this);

		},
		load: function (url) {
			this.set('url', url);
			return this;
		},
		_load: function () {
			var self = this;
			self.set(LOADED, false);
			Y.io(self.get('url'), {
				on: {
					success: function (id, o) {
						var xml = o.responseXML;
						self._xmlReadCategories(self._readEl(xml,CATEGORIES));
						self._xmlReadView(self._readEl(xml,'view'));
						self._xmlReadEvents(self._readEl(xml,'events'));
						self.set(LOADED, true);
					}
				}
			});


		},
		_getRegion: function (node) {
			var reg = node.get(REGION);
			reg.left -= this._left;
			reg.top -= this._top;
			return reg;
		},
		_resize: function (container) {
			container = container || this.get(CONTAINER);

			var start = this.get(START),
				end = this.get(END),
				rightEdge = this._width,
				height = this._height,
				scale = rightEdge / ( end - start),
				cats = this.get(CATEGORIES),
				bar, width, left, added = false, region, pointer,hasNoCategory = false;

			Y.each(this.events, function(event) {
				bar = event.bar || BLOCK_TEMPLATE.cloneNode();
				pointer = event.pointer;
				left = Math.round((event.start - start) * scale);
				width = Math.round(((event.endsToday?Date.now():event.end) - event.start) * scale);
				if (left + width < 0 || left > rightEdge) {
					if (event.bar) {
						event.bar.remove(true);
						event.bar = null;
						if (pointer) {
							pointer.remove(true);
							event.pointer = pointer = null;
						}
					}
					return;
				}
				event.isPoint = width === 0;
				bar.setStyles({
					left: left +PX,
					width: width?width + PX:'auto'
				});
				if (!event.bar) {
					event.bar = bar;
					if (event.category) {
						bar.setStyles({
							backgroundColor: cats[event.category].color,
							color: cats[event.category].fontColor
						});
					} else {
						hasNoCategory = true;
					}
					bar.setContent(event.text);
					bar.set('title', event.text);
					if (event.fuzzy) {
						bar.addClass(cName('fuzzy'));
					}
					if (event.description || event.icon) {
						bar.addClass(cName('hasDescr'));
					}
					bar.setData(EVENT,event);
				}
				if (!bar.inDoc()) {
					container.append(bar);
					added = true;
				}
				if (event.isPoint) {
					region = this._getRegion(bar);
					bar.setStyle(LEFT, region.left - region.width / 2 + PX);
					if (!pointer) {
						event.pointer = pointer = POINTER_TEMPLATE.cloneNode();
						pointer.setStyle(TOP, height / 2 + PX);
					}
				} else {
					if (pointer) {
						pointer.remove(true);
						event.pointer = pointer = null;
					}
				}
				if (pointer) {
					pointer.setStyle(LEFT, left + PX);
					if (!pointer.inDoc()) {
						container.append(pointer);
					}
				}

			},this);
			if (added) {
				this._locate();
			}
			container.one('.' + cName('noCat')).setStyle('display',hasNoCategory?'block':'none');
		},
		_locate: function () {
			var width, left, region,
				middle = this._height / 2,
				points = [], ranges = [],levels, isPoint,
				move = function(bar, levels, i, isPoint) {
					bar.setStyle(TOP, middle + (isPoint? 30 * i + 15:  -30 * (i+1) - 15 ) + PX);
					if (!levels[i]) {
						levels[i] = [];
					}
					levels[i].push({left:left, width:width});
					var pointer = bar.getData(EVENT).pointer;
					if (pointer) {
						pointer.setStyle('height', 30 * i + 15);
					}
				};

			this.get(CONTAINER).all('div.' + cName('bar')).each(function(bar) {
				region = this._getRegion(bar); 
				width = region.width;
				left = region.left;
				isPoint = bar.getData(EVENT).isPoint;
				levels = (isPoint?points:ranges);
				// This is to determine container to place it so that it does not overlap with any existing bar
				if (!Y.some(levels, function (level, i) {
					if (!Y.some(level, function (existing) {
						return !(existing.left > (left + width) || left > (existing.left + existing.width));
					})) {
						move(bar, levels, i, isPoint);
						return true;
					}
					return false;
				},this)) {
					move(bar, levels, levels.length, isPoint);
				}

			},this);				
		},
		_grid: function () {
			var start = this.get(START),
				end = this.get(END),
				container = this.get(CONTAINER),
				width = this._width,
				height = this._height,
				range = end - start,
				// this cover periods of 0:hours, 1:days, 2:months, 3:years, 4:decades, 5:centuries, 6:millenia, 7:tens of millenia
				// JavaScript's Date object cannot go any further anyway'
				periods = [1000*60*60, 24, 30, 12, 10, 10, 10, 10], 
				period = 1, i, next, p, edge,label, date,

			round = function (what, precision, add) {
				what = new Date(what);
				switch (precision) {
					case 0:
						return new Date(what.getFullYear(), what.getMonth(), what.getDate(), what.getHours() + add, 0, 0).getTime();

					case 1:
						return new Date(what.getFullYear(), what.getMonth(), what.getDate() + add).getTime();

					case 2:
						return new Date(what.getFullYear(), what.getMonth() + add, 1).getTime();

					default:
						precision = Math.pow(10,precision - 3);
						return new Date(Math.floor(what.getFullYear() / precision) * precision + (add?precision:0), 0, 1).getTime();



				}
			};
			container.all('div.' + cName('grid')).remove(true);

			for (i = 0; i < periods.length; i+=1) {
				period *= periods[i];
				// check if the period is wider than 20 pixels in the current container
				if (width / range * period > 20) {
					break;
				}
			}
			edge = round(start, i, 0);
			while (edge < end) {
				next = round(edge, i, 1);
				date = new Date(edge);
				p = GRID_TEMPLATE.cloneNode();
				label = [date.getHours()];
				if (label[0] === 0) {
					label[1] = date.getDate();
					if (label[1] === 1) {
						label[2] = date.getMonth();
						if (label[2] === 0) {
							label[3] = date.getFullYear();
						}
						label[2] = this.get(STRINGS).months[label[2]];
					} 
				}

				p.setContent(label.slice(Math.min(3,i)).join(', '));
				p.setStyles({
					width:Math.round((next - edge) / range * width) - 1  + PX,
					left:Math.round((edge - start)/ range * width) + PX,
					paddingTop: height/2  + PX,
					height: height/2 + PX
				});
				container.append(p);
				edge = next;

			}


		},
		render: function (container) {
			this.set(CONTAINER, container);
		},
		_render:function() {
			var container = this.get(CONTAINER);
			if (!( container && this.get(LOADED))) {
				return this;
			}
			container.addClass(cName());

			container.setContent('');
			Y.each(this.events, function (event) {
				delete event.pointer;
				delete event.bar;
			});


			var region = container.get(REGION);
			this._left = region.left;
			this._top = region.top;
			this._height = region.height;
			this._width = region.width;

			container.append(Y.Node.create('<div class="' + cName('divider') + '"/>'));
			var cats = container.appendChild(Y.Node.create(Lang.sub(CATEGORIES_TEMPLATE,this.get(STRINGS))));
			Y.each(this.get(CATEGORIES), function (cat, name) {
				cats.append(Y.Node.create('<p style="color:' + cat.fontColor + ';background-color:' + cat.color + '">' + name + '</p>'));
			});
			this._descr = container.appendChild(Y.Node.create('<div class="' + cName('descr') + '"/>'));

			this._grid();
			this._resize(container);

			container.delegate('click',this._showDescr,'div.' + cName('bar'),this);
			container.on('gesturemovestart', this._startMove, {}, this);
			container.on('gesturemove', this._dragMove, {}, this);
			container.on('gesturemoveend', this._dragMove, {}, this);
			Y.on('mousewheel', this._mouseWheel, this);
			return this;
		},
		_hideDescr: function() {
			this._descr.setStyle('display', 'none');
		},
		_showDescr: function(ev) {
			var bar = ev.target,
				event = bar.getData(EVENT),
				barRegion = this._getRegion(bar),
				descr = this._descr,
				descrRegion,
				barMidPoint = barRegion.left + barRegion.width /2,
				third = this._width / 3;

			if (event.description || event.icon) {
				descr.setContent((event.icon? '<img src="data:image/png;base64,' + event.icon + '">':'') + event.description);
				descr.setStyles({
					display:'block',
					top:0
				});
				descr.removeClass(cName(LEFT));
				descr.removeClass(cName(CENTER));
				descr.removeClass(cName(RIGHT));
				descrRegion = this._getRegion(descr);

				if (barMidPoint < third) {
					descr.setStyle(LEFT, Math.max(barMidPoint,0) + PX);
					descr.addClass(cName(LEFT));
				} else if (barMidPoint < third * 2) {
					descr.setStyle(LEFT, barMidPoint - descrRegion.width / 2  + PX);
					descr.addClass(cName(CENTER));
				} else {
					descr.setStyle(LEFT, Math.min(barMidPoint,this._width - 30) - descrRegion.width + PX);
					descr.addClass(cName(RIGHT));
				}
				descr.setStyle(TOP, Math.round(barRegion.top - descrRegion.height - 20) + PX);
			}
		},
		_startMove: function (ev) {
			ev.halt();
			this._hideDescr();
			this._pageX = ev.pageX;
			this._start = this.get(START);
			this._end = this.get(END);
		},
		_dragMove: function (ev) {

			var start = this._start,
				end = this._end,
				width = this._width,
				deltaX = Math.round((ev.pageX - this._pageX) / width * (end - start));

			if (deltaX) {
				this.set(START,  start -  deltaX);
				if (ev.ctrlKey) {
					this.set(END,  end +  deltaX);
					this._locate();
				} else {
					this.set(END,  end -  deltaX);
				}
				this._resize();
				this._grid();
			}
		},
		_mouseWheel: function (ev) {
			if (ev.target.ancestor('#' + this.get(CONTAINER).get('id'),true)) {
				ev.halt();

				this._hideDescr();
				var start = this.get(START),
					end = this.get(END),
					deltaX = (end - start) * 0.1 * (ev.wheelDelta > 0?-1:1);

				this.set(START, start - deltaX);
				if (ev.ctrlKey) {
					this.set(END, end + deltaX);
					this._locate();
				} else {
					this.set(END, end - deltaX);
				}
				this._resize();
				this._grid();
			}
		}
	},
	{
		ATTRS: {
			categories: {
				validator: Lang.isObject,
				value:{}					
			},
			hiddenCats: {
				validator: Lang.isArray,
				value:[]
			},
			start: {
				validator: Lang.isNumber,
				value: new Date(Date.now() - 1000*60*60*24*30).getTime() // previous month
			},
			end: {
				validator: Lang.isNumber,
				value: new Date(Date.now() + 1000*60*60*24*30).getTime() // next month
			},
			container: {
				setter: function (val) {
					return Y.one(val);
				}	
			},
			url: {
				validator: Lang.isString
			},
			loaded: {
				validator: Lang.isBoolean,
				value: false
			},
			strings: {
				value: {
					categories:'Categories',
					noCategory: '-no category-',
					months: ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
				}
			}

		}
	}
);

