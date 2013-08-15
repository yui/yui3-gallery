var Color = {
	normalizedColorArray: function(str) {
		var color = Y.Color.toRGBA(str),
			arr = Y.Color.toArray(color),
			r = parseInt(arr[0], 10) / 255,
			g = parseInt(arr[1], 10) / 255,
			b = parseInt(arr[2], 10) / 255,
			a = parseFloat(arr[3]);

		return [r, g, b, a];
	}
};

Y.Color = Y.mix(Color, Y.Color);