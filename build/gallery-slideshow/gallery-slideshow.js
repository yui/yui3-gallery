YUI.add('gallery-slideshow', function(Y) {

var _S = function() {
	_S.superclass.constructor.apply(this, arguments);
}, 
	SLIDESHOW = "SlideShow", 
	ISNUMBER = Y.Lang.isNumber;
					
_S.NAME = SLIDESHOW;
_S.NS = SLIDESHOW;
_S.HTML_PARSER = 
	{
	/*	boundingBox: '.yui-slideshow',
		contentBox: '.yui-slideshow-content',
	 */
		title: function(contentBox) {
			var node = contentBox.one('.hd h4');
			return node ? node.get('innerHTML') : "";
		},
		image_height: function(contentBox) {
			var node = contentBox.one('.bd');
			return node ? parseInt(node.getStyle('height'), 10) : null;
		},
		image_width: function(contentBox) {
			var node = contentBox.one('.bd');
			return node ? parseInt(node.getStyle('width'), 10) : null;
		}
	};
_S.ATTRS = 
	{
		delay: { 
				value: 5000,
				validator: ISNUMBER
			},
		images: {
				validator: Y.Lang.isArray
			},
		animation: {
				validator: Y.Lang.isObject,
				setter: function(v) {
					if (! (v instanceof Y.Anim) ) {
						v = new Y.Anim(v);
					}
					v.on('end', function() {
						this.endTransition();
					}, this);
					return v;
				}
			},
		image_height: {
			validator: ISNUMBER,
			setter: function(value) {
				this.get('contentBox').one('.bd').setStyle('height', value);
				return value;
			}
		},
		image_width: {
			validator: ISNUMBER,
			setter: function(value) {
				this.get('contentBox').one('.bd').setStyle('width', value);
				return value;
			}
		},
		title: {
			value: "",
			validator: Y.Lang.isString,
			setter: function(value) {
				this.get('contentBox').one('.hd h4').get('innerHTML', value);
				return value;
			}
		}
	};

Y.extend(_S, Y.Widget, 
	{
		CONTENT_TEMPLATE: "<div class='yui3-slideshow-content'><div class='hd'><h4></h4></div><div class='bd'></div><div class='ft'></div></div>", 
		createImage: function(img, z) {
			var cb = this.get('contentBox').one('.bd'), 
					div = Y.Node.create("<div class='yui3-slideshow-img'><img /></div>"), 
					div_img = div.one('img');
			div_img.set('src', img.src);
			div.setStyle('zIndex', z);
			img._node = div;
			cb.insert(div);
			Y.later(1000, this, function(di, cb) {
				di.setXY(cb.getXY());
			}, [div, cb]);
			return div;
		},
		renderUI: function() {
			var images = this.get('images'), contentBox = this.get('contentBox'), title = this.get('title'), image_height = this.get('image_height'), image_width = this.get('image_width');
			if (title) { contentBox.one('.hd h4').set('innerHTML', title); }
			if (image_width) { contentBox.one('.bd').setStyle('width', image_width); }
			if (image_height) { contentBox.one('.bd').setStyle('height', image_height); }
			contentBox.all('.yui3-slideshow-img').each(function(node, index, nodeList) {
				var img = {};
				img.src = node.one('img').get('src');
				images.unshift(img);
				node.remove();
			}, this);
			Y.Array.each(images, function(i, d, a) {
				var x = this.createImage(i, -1*d);
				if (d === 0) { this.currentImage = x; }
			}, this);
		},
		bindUI: function() {
			Y.later(this.get('delay'), this, "beginTransition");
		},
		setImage: function(node, img) {
			var i = node.one('img');
			i.set('src', img.src);
		},
		beginTransition: function() {
			var anim = this.get('animation');
			
			if (anim) {
				anim.set('node', this.currentImage);
				anim.run();
			} else {
				this.endTransition();
			}
		},
		endTransition: function() {
			var images = this.get('contentBox').all('.yui3-slideshow-img'),
					anim = this.get('animation');
			
			images.each(function(img, index, array) {
				var z = +img.getStyle('zIndex'), 
				    l = -1 * array.size();
				if (z === -1) { this.currentImage = img; }
				img.setStyle('zIndex', z === 0 ? l + 1 : z + 1);
			}, this);
			images.setStyles(anim.get('from'));
			
			Y.later(this.get('delay'), this, "beginTransition");
		}
	});

Y.SlideShow = _S;


}, 'gallery-2010.03.16-20' ,{requires:['widget', 'widget-htmlparser'], optional:['anim']});
