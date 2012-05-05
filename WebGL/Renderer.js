"use strict";
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

