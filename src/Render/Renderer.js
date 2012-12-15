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
Rubikjs.Render.Renderer = function(element) {
    if(element) {
        this.perspectiveMat = mat4.create();
        mat4.perspective(70, element.offsetWidth/element.offsetHeight, 0.1, 100, this.perspectiveMat);
        //mat4.ortho(-2, 2, -2, 2, -10, 10, this.perspectiveMat);
        this.element = element;
    }
};

Rubikjs.Render.Renderer.prototype.startFrame = function() {};
Rubikjs.Render.Renderer.prototype.render = function(mesh) {};
Rubikjs.Render.Renderer.prototype.endFrame = function() {};
Rubikjs.Render.Renderer.prototype.createMesh = function() {
    return new Rubikjs.Mesh();
};


