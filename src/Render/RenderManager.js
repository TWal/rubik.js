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

Rubikjs.Render.RenderManager = function(renderer) {
    this.meshs = [];
    if(renderer) {
        this.renderer = new renderer(document.getElementById("cube"));
    } else {
        this.renderer = new Rubikjs.WebGL.Renderer(document.getElementById("cube"));
    }
    mat4.translate(this.renderer.perspectiveMat, this.renderer.perspectiveMat, [0, 0, -15]);
    mat4.rotateX(this.renderer.perspectiveMat, this.renderer.perspectiveMat, Math.PI/6);
    mat4.rotateY(this.renderer.perspectiveMat, this.renderer.perspectiveMat, -Math.PI/6);
};

Rubikjs.Render.RenderManager.prototype.render = function() {
    this.renderer.startFrame();
    var self = this;
    this.meshs.forEach(function(mesh) {
        self.renderer.render(mesh);
    });
    this.renderer.endFrame();
};

