var _S = 	function() {
						_S.superclass.constructor.apply(this, arguments);
						//this._imageLoader = new Y.ImgLoadGroup({ timeLimit: 1 });
					};
					
_S.NAME = "SlideShow";
_S.NS = "SlideShow";
_S.ATTRS = 
		{
			delay: { 
					value: 5000,
					validator: Y.Lang.isNumber
				},
			images: {
					validator: Y.Lang.isArray
				},
			animation: {
					validator: function(v) {
						return Y.Lang.isObject(Y.Anim) && v instanceof Y.Anim;
					},
					setter: function(v) {
						v.on('end', function() {
							this.endTransition();
						}, this);
					}
				}
		};

Y.extend(_S, Y.Widget, 
	{ 
		createImage: function(img, z) {
			var cb = this.get('contentBox'), 
					div = Y.Node.create("<div class='yui-slideshow-img'><img /></div>"), 
					div_img = div.one('img');
			div_img.set('src', img.src);
			div.setStyle('zIndex', z);
			cb.insert(div);
			Y.later(1000, this, function(di, cb) {
				di.setXY(cb.getXY());
			}, [div, cb]);
			return div;
		},
		renderUI: function() {
			var i = this.get('images'), vl = i.length;
			this.get('contentBox').all('.yui-slideshow-img').remove();
			Y.Array.each(i, function(i, d, a) {
				var x = this.createImage(i, vl-d);
				if (d == 0) this.currentImage = x;
			}, this);
		},
		bindUI: function() {
			Y.later(this.get('delay'), this, "beginTransition");
		},
		setImage: function(node, img) {
			var i = node.one('img'), bb = this.get('boundingBox'),
					width = this.get('width') || 'auto', 
					height = this.get('height') || 'auto';
			i.set('src', img.src);
		},
		beginTransition: function() {
			var anim = this.get('animation'), img = this.get('contentBox').get('.yui-slideshow-img');
			
			if (anim) {
				anim.set('node', this.currentImage);
				anim.run();
			} else {
				this.endTransition();
			}
		},
		endTransition: function() {
			var images = this.get('contentBox').all('.yui-slideshow-img'),
					anim = this.get('animation');
			
			images.each(function(img, index, array) {
				var z = +img.getStyle('zIndex');
				if (z === array.size() - 1) { this.currentImage = img; }
				img.setStyle('zIndex', z === array.size() ? 1 : z + 1);
			}, this);
			images.setStyles(anim.get('from'));
			
			Y.later(this.get('delay'), this, "beginTransition");
		}
	});

Y.SlideShow = _S;