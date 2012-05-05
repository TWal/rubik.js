"use strict";
Rubikjs.Mesh = function() {
	this.beautifulLevel = 1;
	this.transform = mat4.create();
	mat4.identity(this.transform);

	//Buffers
	this.vertexBuffer = new Rubikjs.Buffer();
	this.colorBuffer = new Rubikjs.Buffer();
	this.indexBuffer = new Rubikjs.Buffer();
}


