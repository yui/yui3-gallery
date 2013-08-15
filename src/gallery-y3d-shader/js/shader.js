var colorProgram = null,
	textureProgram = null,

	fragmentShaderSource = [
		'precision mediump float;',

		'varying vec4 fragmentColor;',
		'varying vec3 lightWeight;',

		'#ifdef USE_TEXTURE',
			'varying vec2 vertexTextureCoordinates;',
			'uniform sampler2D sampler;',
		'#endif',

		'void main(void) {',
			'gl_FragColor = fragmentColor;',

			'#ifdef USE_TEXTURE',
				'gl_FragColor = gl_FragColor * texture2D(sampler, vertexTextureCoordinates);',
			'#endif',

			'#ifdef USE_LIGHT',
				'gl_FragColor = vec4(gl_FragColor.rgb * lightWeight, gl_FragColor.a);',
			'#endif',
		'}'
	].join('\n'),

	vertexShaderSource = [
		'attribute vec3 vertexPosition;',
		'attribute vec4 vertexColor;',
		'attribute vec3 vertexNormal;',

		'#ifdef USE_TEXTURE',
			'attribute vec2 textureCoordinates;',
			'varying vec2 vertexTextureCoordinates;',
		'#endif',

		'uniform mat4 projectionMatrix;',
		'uniform mat4 modelViewMatrix;',
		'uniform mat3 normalMatrix;',

		'#ifdef USE_LIGHT',
			'uniform vec3 lightColor;',
			'uniform vec3 lightDirection;',
		'#endif',

		'varying vec4 fragmentColor;',
		'varying vec3 lightWeight;',

		'void main(void) {',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',

			'fragmentColor = vertexColor;',

			'#ifdef USE_TEXTURE',
				'vertexTextureCoordinates = textureCoordinates;',
			'#endif',

			'#ifdef USE_LIGHT',
				'vec3 ambientLightColor = vec3(1.0, 1.0, 1.0);',

				'vec3 transformedNormal = normalMatrix * vertexNormal;',
				'float directionalLightWeight = max(dot(transformedNormal, lightDirection), 0.0);',

				'lightWeight = ambientLightColor + lightColor * directionalLightWeight;',
			'#else',
				'lightWeight = vec3(1.0, 1.0, 1.0);',
				'vertexNormal;',
			'#endif',
		'}'
	].join('\n');

Y.Shader = {
	compile: function(context, type, constants) {
		var shader, source;

		if (type === 'fragment') {
			shader = context.createShader(context.FRAGMENT_SHADER);
			source = fragmentShaderSource;
		}
		else if (type === 'vertex') {
			shader = context.createShader(context.VERTEX_SHADER);
			source = vertexShaderSource;
		}

		constants = constants.join('\n');
		source = [constants, source].join('\n');

		context.shaderSource(shader, source);
		context.compileShader(shader);

		if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
			console.log(context.getShaderInfoLog(shader));

			return null;
		}

		return shader;
	},

	getColorProgram: function(options) {
		if (colorProgram !== null) {
			return colorProgram;
		}

		var context = options.context,
			constants = options.constants || [];

		colorProgram = Y.Shader.link(context, constants);

		return colorProgram;
	},

	getTextureProgram: function(options) {
		if (textureProgram !== null) {
			return textureProgram;
		}

		var context = options.context,
			constants = options.constants || [];

		constants.push('#define USE_TEXTURE');

		textureProgram = Y.Shader.link(context, constants);

		textureProgram.textureCoordinatesAttribute = context.getAttribLocation(textureProgram, "textureCoordinates");
		context.enableVertexAttribArray(textureProgram.textureCoordinatesAttribute);

		textureProgram.samplerUniform = context.getUniformLocation(textureProgram, "sampler");

		return textureProgram;
	},

	link: function(context, constants) {
		var fragmentShader = Y.Shader.compile(context, 'fragment', constants),
			vertexShader = Y.Shader.compile(context, 'vertex', constants),
			program = context.createProgram();

		context.attachShader(program, fragmentShader);
		context.attachShader(program, vertexShader);

		context.linkProgram(program);

		if (!context.getProgramParameter(program, context.LINK_STATUS)) {
			console.log("Could not link shaders");
		}

		program.vertexPositionAttribute = context.getAttribLocation(program, "vertexPosition");
		context.enableVertexAttribArray(program.vertexPositionAttribute);

		program.vertexColorAttribute = context.getAttribLocation(program, "vertexColor");
		context.enableVertexAttribArray(program.vertexColorAttribute);

		program.vertexNormalAttribute = context.getAttribLocation(program, "vertexNormal");
		context.enableVertexAttribArray(program.vertexNormalAttribute);

		program.projectionMatrixUniform = context.getUniformLocation(program, "projectionMatrix");
		program.modelViewMatrixUniform = context.getUniformLocation(program, "modelViewMatrix");
		program.normalMatrixUniform = context.getUniformLocation(program, "normalMatrix");
		program.lightColorUniform = context.getUniformLocation(program, "lightColor");
		program.lightDirectionUniform = context.getUniformLocation(program, "lightDirection");

		return program;
	}
};