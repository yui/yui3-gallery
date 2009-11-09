YUI.add('gallery-chromahash', function(Y) {

/*
 * Chroma-Hash : A sexy, non-reversable live visualization of password field input
 * Idea based on jQuery module by Mattt Thompson (http://github.com/mattt/Chroma-Hash/)
 */

var LBL_TMPL = '<label for="{id}" class="{color} chroma-hash"></label>',
		_C = function(conf) { 
			_C.superclass.constructor.apply(this, arguments);
			this._animations = [];
		};
_C.NAME = "ChromaHash";
_C.ATTRS = 
	{
		bars: {
			value: 3,
			validator: function(b) {
				if (b < 1 || b > 4) {
					return false;
				}
			}
		},
		salt: {
			value: "7be82b35cb0199120eea35a4507c9acf"
		},
		minimum: {
			value: 6
		},
		node: {
			setter: function(node) {
				var n = Y.get(node);
				if (!n && !n.test('input[type=password]')) {
					Y.fail('ChromaHash: Invalid node provided: ' + node);
				}
				return n;
			}
		}
 };
Y.extend(_C, Y.Widget, {
	renderUI: function() {
		var colors = ["primary", "secondary", "tertiary", "quaternary"].slice(0, this.get('bars')),
			c = this.get('contentBox'), n = this.get('node'), i, lbl, width = n.get('clientWidth'),
			height = n.get('clientHeight'), position = n.getXY();
		// Preferably, I'd be able to set the position on the boudningBox, but for now, this will function.
		for (i = 0 ; i < colors.length ; i += 1) {
			lbl = Y.Node.create(LBL_TMPL.replace(/\{id\}/g, n.get('id')).replace(/\{color\}/g, colors[i]));
			lbl.setStyles({
				position: 'absolute',
				height: height + "px",
				width: "8px",
				margin: "5px",
				marginLeft: "0px",
				backgroundColor: this.get('node').getStyle('backgroundColor')
			});
			c.insert(lbl);
			lbl.setXY([position[0] + width - 2 + (-8 * (i + 1)), position[1] + 3]);
			this._animations.push(new Y.Anim({node: lbl, duration: 0.5}));
		}
	},
	bindUI: function() {
		this._keyHandler = this.get('node').on('keyup', this._handleKey, this);
	},
	hide: function() {
		this.get('boundingBox').setStyle('display','none');
	},
	clear: function() {
		this.hide();
		this.get('boundingBox').set('innerHTML','');
	},
	destroy: function() {
		this._keyHandler.detach();
		this._clear();
	},
	_handleKey: function(e) {
		var n = this.get('node'), value = n.get('value'), i,
				col = [], bars = this.get('bars'), md5, g;
		if(value === "" ) {
			for( i = 0 ; i < bars ; i += 1) { col.push('fff'); }
		} else {
			md5 = Y.Crypto.MD5('' + value + ':' + this.get('salt'));
			col = md5.match(/([\dABCDEF]{6})/ig);
			if (value.length < this.get('minimum')) {
				for (i = 0; i < bars ; i += 1) {
					g = (parseInt(col[i], 0x10) % 0xF).toString(0x10);
					col[i] = g + g + g;
				}
			}
		}

		Y.Array.each(this._animations,
				function(a, index) {
					var c = a.get('node');
					a.stop();
					a.set('from', {backgroundColor: c.getStyle('backgroundColor')});
					a.set('to', {backgroundColor: '#' + col[index] });
					a.run();
				});
	}
});
Y.ChromaHash = _C;


}, 'gallery-2009.11.09-19' ,{requires:['widget', 'stylesheet', 'collection', 'anim-color', 'gallery-crypto-md5']});
