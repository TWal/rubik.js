Rubikjs.WebGL.Shader = function(gl) {
	this.gl = gl;
	this.vertexShader;
	this.fragmentShader;
	this.shaderProgram;
}

Rubikjs.WebGL.Shader.prototype.compile = function(vertSource, fragSource) {
	this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
	this.gl.shaderSource(vertexShader, vertSource);
	this.gl.compileShader(vertexShader);

	this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
	this.gl.shaderSource(fragmentShader, fragSource);
	this.gl.compileShader(fragmentShader);

	this.shaderProgram = this.gl.createProgram();
	this.gl.attachShader(program, vertexShader);
	this.gl.attachShader(program, fragmentShader);
	this.gl.linkProgram(program);

	return this;
}

Rubikjs.WebGL.Shader.prototype.attrib = function(name, buffer) {
	var attrLoc = this.gl.getAttribLocation(this.program, name);
	this.gl.enableVertexAttribArray(attrLoc);
	this.gl.bindBuffer(buffer.bufType, );
	this.gl.bufferData(buffer.bufType, new buffer.arrayType(buffer.data), this.gl.STATIC_DRAW);
	this.gl.vertexAttribPointer(attrLoc, buffer.nbDim, buffer.varType, false, 0, 0);

	return this;
}

