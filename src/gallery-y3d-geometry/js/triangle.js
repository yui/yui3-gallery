Y.Triangle = Y.Base.create('triangle', Y.Geometry, [], {
}, {
	ATTRS: {
		indices: {
			value: [
				0, 1, 2
			]
		},

		textureCoordinates: {
			value: [
				0, 0,
				1, 0,
				1, 1
			]
		},

		vertices: {
			value: [
				-1, -1, 0,
				1, -1, 0,
				0, Math.sqrt(0.75), 0
			]
		}
	}
});