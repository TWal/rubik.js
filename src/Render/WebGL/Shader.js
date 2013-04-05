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

