var Lang = Y.Lang;

Y.Light = Y.Base.create('light', Y.Base, [], {
	_setColor: function(value) {
		if (Lang.isString(value)) {
			value = Y.Color.normalizedColorArray(value);
		}

		return value;
	}
}, {
	ATTRS: {
		color: {
			value: 'white',
			setter: '_setColor'
		},

		direction: {
			value: [0, 0, 0]
		}
	}
});