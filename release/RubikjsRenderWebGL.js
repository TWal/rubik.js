"use strict";

/*
Rubik.js

Copyright (c) 2012 Théophile Wallez

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

    1. The origin of this software must not be misrepresented; you must not
    claim that you wrote the original software. If you use this software
    in a product, an acknowledgment in the product documentation would be
    appreciated but is not required.

    2. Altered source versions must be plainly marked as such, and must not be
    misrepresented as being the original software.

    3. This notice may not be removed or altered from any source
    distribution.
*/

Rubikjs.Render.WebGL.Buffer = function(gl, data, type) {
    this.gl = gl;
    this.type = type || this.gl.ARRAY_BUFFER;
    this.buffer = this.gl.createBuffer();
    if(data != undefined) {
        this.feed(data);
    }
};

Rubikjs.Render.WebGL.Buffer.prototype = new Rubikjs.Render.Buffer;
Rubikjs.Render.WebGL.Buffer.prototype.constructor = Rubikjs.Render.WebGL.Buffer;

Rubikjs.Render.WebGL.Buffer.prototype.feed = function(data) {
    this.data = data;
    this.bind();
    var arrayType = this.type == this.gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
    this.gl.bufferData(this.type, new arrayType(this.data), this.gl.STATIC_DRAW);
};

Rubikjs.Render.WebGL.Buffer.prototype.bind = function() {
    //Don't re-bind a buffer that is already bounded, because it is a really expansive operation
    if(this.gl.boundBuffer != this.buffer) {
        this.gl.bindBuffer(this.type, this.buffer);
        this.gl.boundBuffer = this.buffer;
    }
};

Rubikjs.Render.WebGL.Buffer.prototype.copy = function() {
    return new Rubikjs.Render.WebGL.Buffer(this.gl, this.data, this.type);
};

/*
Rubik.js

Copyright (c) 2012 Théophile Wallez

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

    1. The origin of this software must not be misrepresented; you must not
    claim that you wrote the original software. If you use this software
    in a product, an acknowledgment in the product documentation would be
    appreciated but is not required.

    2. Altered source versions must be plainly marked as such, and must not be
    misrepresented as being the original software.

    3. This notice may not be removed or altered from any source
    distribution.
*/

Rubikjs.Render.WebGL.Renderer = function(element) {
    Rubikjs.Render.Renderer.call(this, element);
    var canvas = element.localName == "canvas" ? element : null; // : element.appendChild(document.createElement("canvas").setAttribute("width", "300").setAttribute(");
    try {
        this.gl = canvas.getContext("experimental-webgl");
        if(this.gl == undefined) {
            this.gl = canvas.getContext("webgl");
        }
        if(this.gl == undefined) {
            Rubikjs.Core.Logger.log("WebGL Renderer", "No WebGL :(", "error");
            return;
        }
    } catch(e) {
        Rubikjs.Core.Logger.log("WebGL Renderer", "Exception caught: " + e.message, "error");
        return;
    }
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);

    this.shader = new Rubikjs.Render.WebGL.Shader(this.gl);
    //Some basic shaders
    this.shader.compile(
        "#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec3 aVertexPosition;attribute vec4 aVertexColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec4 vColor;void main(void) {gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);vColor = aVertexColor;}",
        "#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec4 vColor;void main(void) {gl_FragColor = vColor;}"
    ).uniform("uPMatrix", this.perspectiveMat, "mat4");
};

Rubikjs.Render.WebGL.Renderer.prototype = new Rubikjs.Render.Renderer;
Rubikjs.Render.WebGL.Renderer.prototype.constructor = Rubikjs.Render.WebGL.Renderer;

Rubikjs.Render.WebGL.Renderer.prototype.startFrame = function() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

Rubikjs.Render.WebGL.Renderer.prototype.render = function(mesh) {
    this.shader.uniform("uPMatrix", this.perspectiveMat, "mat4");
    this.shader.attrib("aVertexPosition", mesh.vertexBuffer, 3).attrib("aVertexColor", mesh.colorBuffer, 4).uniform("uMVMatrix", mesh.transform, "mat4");
    this.shader.use();
    mesh.indexBuffer.bind();
    this.gl.drawElements(this.gl.TRIANGLES, mesh.indexBuffer.data.length, this.gl.UNSIGNED_SHORT, 0);
};

Rubikjs.Render.WebGL.Renderer.prototype.endFrame = function() {};

Rubikjs.Render.WebGL.Renderer.prototype.createMesh = function() {
    var mesh = new Rubikjs.Render.Mesh();
    mesh.vertexBuffer = new Rubikjs.Render.WebGL.Buffer(this.gl, [], this.gl.ARRAY_BUFFER);
    mesh.colorBuffer = new Rubikjs.Render.WebGL.Buffer(this.gl, [], this.gl.ARRAY_BUFFER);
    mesh.indexBuffer = new Rubikjs.Render.WebGL.Buffer(this.gl, [], this.gl.ELEMENT_ARRAY_BUFFER);
    return mesh;
};

/*
Rubik.js

Copyright (c) 2012 Théophile Wallez

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

    1. The origin of this software must not be misrepresented; you must not
    claim that you wrote the original software. If you use this software
    in a product, an acknowledgment in the product documentation would be
    appreciated but is not required.

    2. Altered source versions must be plainly marked as such, and must not be
    misrepresented as being the original software.

    3. This notice may not be removed or altered from any source
    distribution.
*/

Rubikjs.Render.WebGL.Shader = function(gl) {
    this.gl = gl;
    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.program = this.gl.createProgram();
};

Rubikjs.Render.WebGL.Shader.prototype.compile = function(vertSource, fragSource) {
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
};

Rubikjs.Render.WebGL.Shader.prototype.attrib = function(name, buffer, dimension) {
    this.use();
    buffer.bind();
    var attrLoc = this.gl.getAttribLocation(this.program, name);
    this.gl.enableVertexAttribArray(attrLoc);
    this.gl.vertexAttribPointer(attrLoc, dimension, this.gl.FLOAT, false, 0, 0);

    return this;
};

Rubikjs.Render.WebGL.Shader.prototype.uniform = function(name, uniform, type) {
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
};

Rubikjs.Render.WebGL.Shader.prototype.use = function() {
    //Don't re-use a program that is already used, because it is a really expansive operation
    if(this.gl.usedProgram != this.program) {
        this.gl.useProgram(this.program);
        this.gl.usedProgram = this.program;
    }
};

