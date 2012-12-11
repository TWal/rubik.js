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

"use strict";
Rubikjs.Render.RenderManager = function(renderer) {
    this.meshs = [];
    //this.definition;
    if(renderer) {
        this.renderer = new renderer(document.getElementById("cube"));
    } else {
        this.renderer = new Rubikjs.WebGL.Renderer(document.getElementById("cube"));
    }
    mat4.translate(this.renderer.perspectiveMat, [0, 0, -15]);
    mat4.rotateX(this.renderer.perspectiveMat, Math.PI/6);
    mat4.rotateY(this.renderer.perspectiveMat, -Math.PI/6);

    /*this.meshs.push(this.renderer.createMesh());
    this.meshs[0].vertexBuffer.feed([
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ]);
    var colors = [
        [1.0, 0.0, 0.0, 1.0],     // Front face
        [1.0, 0.5, 0.0, 1.0],     // Back face
        [0.9, 0.9, 0.9, 1.0],     // Top face
        [1.0, 1.0, 1.0, 1.0],     // Bottom face
        [0.0, 0.0, 1.0, 1.0],     // Right face
        [0.0, 1.0, 0.0, 1.0]     // Left face
    ];

    var unpackedColors = [];
    for (var i = 0; i < colors.length; ++i) {
        var color = colors[i];
        for (var j = 0; j < 4; ++j) {
            unpackedColors = unpackedColors.concat(color);
        }
    }

    this.meshs[0].colorBuffer.feed(unpackedColors);


    this.meshs[0].indexBuffer.feed([
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ]);
    mat4.translate(this.meshs[0].transform, [0, 0, -3]);
    mat4.rotate(this.meshs[0].transform, 0.5, [1, 0, 0]);*/
}

Rubikjs.Render.RenderManager.prototype.render = function() {
    //mat4.rotate(this.meshs[0].transform, 0.03, [0, 1, 0]);
    this.renderer.startFrame();
    var self = this;
    this.meshs.forEach(function(mesh) {
        self.renderer.render(mesh);
    });
    this.renderer.endFrame();
}

