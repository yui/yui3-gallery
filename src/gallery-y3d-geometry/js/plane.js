Y.Plane = Y.Base.create('plane', Y.Geometry, [], {
}, {
	ATTRS: {
		indices: {
			value: [
				0, 1, 2,
				0, 2, 3
			]
		},

		textureCoordinates: {
			value: [
				0, 0,
				1, 0,
				1, 1,
				0, 1
			]
		},

		vertices: {
			value: [
				-1, -1,  0,
				1,  -1,  0,
				1,   1,  0,
				-1,  1,  0
			]
		}
	}
});