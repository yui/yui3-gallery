var _C = Y.Crypto || { };

Y.mix(_C, {
	/**
	 * Adds two numerics as if they were 32-bit integers.
	 *
	 * @method add32Bit
	 * 
	 * @param {int} first operand 
	 * @param {int} second operand
	 * 
	 * @static
	 */ 
	add32Bit: function (x,y) {
		return (x  + y) & 0xffffffff;
	},
  /**
	 * Converts a standard JavaScript string (utf16) to a UTF8 string
	 *
	 * @method utf16ToUtf8
	 * 
	 * @param {string} The utf16 encoded string to convert to a utf8 array
	 * 
	 * @static
	 */ 
	utf16ToUtf8: function(string) {
		var output = "", cd, pr, i = 0;
		
		while (i < string.length) {
			cd = string.charCodeAt(i);
			pr = i + 1 < string.length ? string.charCodeAt(i + 1) : 0;
			
			if (0xd800 <= cd && cd <= 0xdbff && 0xdc00 <= pr && pr <= 0xdfff) {
				// Surrogate Pair
				cd = 0x10000 + ((cd & 0x3ff) + (pr & 0x03ff));
				i += 1;
			}
			
			if (cd <= 0x007f) {
				output += String.fromCharCode(cd);
			} else if (cd <= 0x07ff) {
				output += String.fromCharCode(0xc0 | ((cd >>> 6) & 15),
																			0x80 |  (cd & 63));
			} else if (cd <= 0xffff) {
				output += String.fromCharCode(0xe0 | ((cd >>> 12) & 15 ),
																			0x80 | ((cd >>>  6) & 63),
																			0x80 |  (cd & 63));
			} else if (cd <= 0x1fffff) {
				output += String.fromCharCode(0xf0 | ((cd >>> 18) & 15),
																			0x80 | ((cd >>> 12) & 63),
																			0x80 | ((cd >>>  6) & 63),
																			0x80 |  (cd & 63));
			}
			i += 1;
		}
		return output;
	},
	/**
	 * Converts a utf8 encoded string to a byte array. It's important to use a
	 * utf8 encoded string, because otherwise characters with individual bytes
	 * greater than 255 will be silently dropped.
	 *
	 * @method utf8ToByteArray
	 * 
	 * @param {string} The utf8 encoded string to convert to a byte array
	 * 
	 * @static
	 */ 
	utf8ToByteArray: function(string) {
		var output = Array(string.length >> 2), i, j;
		for (i = 0 ; i < output.length ; i += 1) { output[i] = 0; }
		for (i = 0 ; i < string.length ; i += 1) {
			j = i * 8;
			output[j >> 5] |= (string.charCodeAt(i) & 0xff) << (j % 32);
		}
		return output;
	},
	byteArrayToString: function(array) {
		var output = "", i, code;
		for (i = 0 ; i < array.length * 32 ; i += 8) {
			code = (array[i >> 5] >>> (i % 32));
			output += String.fromCharCode(code & 0xff);
		}
		return output;
	},
	utf8ToHex: function(string) {
		var output = "", i, cd, chars = "0123456789abcdef";
		for (i = 0 ; i < string.length ; i += 1) {
			cd = string.charCodeAt(i);
			output += chars.charAt(( cd >>> 4) & 0x0f) +
							  chars.charAt( cd & 0x0f);
		}
		return output;
	},
	/**
	 * Converts a standard JavaScript string (utf16) to a Byte Array	 *
	 * @method stringToByteArray	 * 
	 * @param {string} The utf16 encoded string to convert to a byte array
	 * 	 * @static
	 */ 
	stringToByteArray: function(string) {
		return _C.utf8ToByteArray(_C.utf16ToUtf8(string));
	}
});

Y.Crypto = _C;
