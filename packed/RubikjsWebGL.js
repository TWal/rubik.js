Rubikjs.WebGL.Buffer = function(gl, data, type) {
	this.gl = gl;
	this.type = type || this.gl.ARRAY_BUFFER;
	this.buffer = this.gl.createBuffer();
	if(data != undefined && data.length != 0) {
		this.feed(data);
	}
}

Rubikjs.WebGL.Buffer.prototype = Rubikjs.Buffer;
Rubikjs.WebGL.Buffer.prototype.constructor = Rubikjs.WebGL.Buffer;

Rubikjs.WebGL.Buffer.prototype.feed = function(data) {
	this.data = data;
	this.bind();
	var arrayType = this.type == this.gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
	this.gl.bufferData(this.type, new arrayType(this.data), this.gl.STATIC_DRAW);
}

Rubikjs.WebGL.Buffer.prototype.bind = function() {
	//Don't re-bind a buffer that is already bounded, because it is a really expansive operation
	if(this.gl.boundBuffer != this.buffer) {
		//console.log("Bound")
		this.gl.bindBuffer(this.type, this.buffer);
		this.gl.boundBuffer = this.buffer;
	} else {
		//console.log("Rebound");
	}
}


Rubikjs.WebGL.Renderer = function(element) {
	Rubikjs.Renderer.call(this, element);
	var canvas = element.localName == "canvas" ? element : null; // : element.appendChild(document.createElement("canvas").setAttribute("width", "300").setAttribute(");
	try {
		this.gl = canvas.getContext("experimental-webgl");
		if(this.gl == undefined) {
			this.gl = canvas.getContext("webgl");
		}
		if(this.gl == undefined) {
			alert("No WebGL :(");
		}
	} catch(e) {}
	this.gl.enable(this.gl.DEPTH_TEST);

	this.shader = new Rubikjs.WebGL.Shader(this.gl);
	//Some basic shaders
	this.shader.compile(
		"#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec3 aVertexPosition;attribute vec4 aVertexColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec4 vColor;void main(void) {gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);vColor = aVertexColor;}",
		"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec4 vColor;void main(void) {gl_FragColor = vColor;}"
	).uniform("uPMatrix", this.perspectiveMat, "mat4");
}

Rubikjs.WebGL.Renderer.prototype = Rubikjs.Renderer;
Rubikjs.WebGL.Renderer.prototype.constructor = Rubikjs.WebGL.Renderer;

Rubikjs.WebGL.Renderer.prototype.startFrame = function() {
	this.gl.clearColor(0, 0, 0, 0);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}
Rubikjs.WebGL.Renderer.prototype.render = function(mesh) {
	this.shader.uniform("uPMatrix", this.perspectiveMat, "mat4");
	this.shader.attrib("aVertexPosition", mesh.vertexBuffer, 3).attrib("aVertexColor", mesh.colorBuffer, 4).uniform("uMVMatrix", mesh.transform, "mat4");
	this.shader.use();
	mesh.indexBuffer.bind();
	this.gl.drawElements(this.gl.TRIANGLES, mesh.indexBuffer.data.length, this.gl.UNSIGNED_SHORT, 0);
}

Rubikjs.WebGL.Renderer.prototype.endFrame = function() {}

Rubikjs.WebGL.Renderer.prototype.createMesh = function() {
	var mesh = new Rubikjs.Mesh();
	mesh.vertexBuffer = new Rubikjs.WebGL.Buffer(this.gl, [], this.gl.ARRAY_BUFFER);
	mesh.colorBuffer = new Rubikjs.WebGL.Buffer(this.gl, [], this.gl.ARRAY_BUFFER);
	mesh.indexBuffer = new Rubikjs.WebGL.Buffer(this.gl, [], this.gl.ELEMENT_ARRAY_BUFFER);
	return mesh;
}

Rubikjs.WebGL.Shader = function(gl) {
	this.gl = gl;
	this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
	this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
	this.program = this.gl.createProgram();
}

Rubikjs.WebGL.Shader.prototype.compile = function(vertSource, fragSource) {
	this.gl.shaderSource(this.vertexShader, vertSource);
	this.gl.compileShader(this.vertexShader);
	if(!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) {
		console.error("Vertex shader compiled wrong: " + this.gl.getShaderInfoLog(this.vertexShader));
	}

	this.gl.shaderSource(this.fragmentShader, fragSource);
	this.gl.compileShader(this.fragmentShader);
	if(!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) {
		console.error("Fragment shader compiled wrong: " + this.gl.getShaderInfoLog(this.fragmentShader));
	}

	this.gl.attachShader(this.program, this.vertexShader);
	this.gl.attachShader(this.program, this.fragmentShader);
	this.gl.linkProgram(this.program);
	if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
		console.error("Program linked wrong: " + this.gl.getProgramInfoLog(this.program));
	}

	return this;
}

Rubikjs.WebGL.Shader.prototype.attrib = function(name, buffer, dimension) {
	this.use();
	buffer.bind();
	var attrLoc = this.gl.getAttribLocation(this.program, name);
	this.gl.enableVertexAttribArray(attrLoc);
	this.gl.vertexAttribPointer(attrLoc, dimension, this.gl.FLOAT, false, 0, 0);

	return this;
}

Rubikjs.WebGL.Shader.prototype.uniform = function(name, uniform, type) {
	this.use();
	var uniformLocation = this.gl.getUniformLocation(this.program, name);
	switch(type) {
		case "int":
			this.gl.uniform1iv(uniformLocation, uniform);
			break;
		case "float":
			this.gl.uniform1fv(uniformLocation, uniform);
			break;
		case "bool":
			this.gl.uniform1iv(uniformLocation, uniform);
			break;
		case "mat3":
			this.gl.uniformMatrix3fv(uniformLocation, false, uniform);
			break;
		case "mat4":
			this.gl.uniformMatrix4fv(uniformLocation, false, uniform);
			break;
		case "vec2":
			this.gl.uniform2fv(uniformLocation, uniform);
			break;
		case "vec3":
			this.gl.uniform3fv(uniformLocation, uniform);
			break;
		case "vec4":
			this.gl.uniform4fv(uniformLocation, uniform);
			break;
	}

	return this;
}

Rubikjs.WebGL.Shader.prototype.use = function() {
	//Don't re-use a program that is already used, because it is a really expansive operation
	if(this.gl.usedProgram != this.program) {
		this.gl.useProgram(this.program);
		this.gl.usedProgram = this.program;
	}
}

