var Lang = Y.Lang;

Y.Texture = Y.Base.create('texture', Y.Base, [], {
}, {
	ATTRS: {
		image: {
			value: null
		},

		imageUrl: {
			value: '',
			validator: Lang.isString
		},

		webglTexture: {
			value: null
		}
	}
});