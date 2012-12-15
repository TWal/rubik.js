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

Rubikjs.Render.Canvas.Renderer = function(element) {
    Rubikjs.Render.Renderer.call(this, element);
    var canvas = element.localName == "canvas" ? element : undefined;
    if(canvas != undefined) {
        try {
            this.ctx = element.getContext("2d");
            if(this.ctx == undefined) {
                alert("No canvas :("); //To be removed in the future
            }
        } catch(e) {}
    }
    this.triangles = [];
};

Rubikjs.Render.Canvas.Renderer.prototype = new Rubikjs.Render.Renderer;
Rubikjs.Render.Canvas.Renderer.prototype.constructor = Rubikjs.Render.Canvas.Renderer

Rubikjs.Render.Canvas.Renderer.prototype.startFrame = function() {
    this.triangles = [];
    this.ctx.clearRect(0, 0, 500, 500);
};

Rubikjs.Render.Canvas.Renderer.prototype.render = function(mesh) {
    var mvproj = mat4.create();
    mat4.multiply(this.perspectiveMat, mesh.transform, mvproj);

    var vertexProj = [];
    for(var i = 0; i < mesh.vertexBuffer.data.length; i+=3) {
        var currentPt = mat4.multiplyVec4(mvproj, [mesh.vertexBuffer.data[i], mesh.vertexBuffer.data[i+1], mesh.vertexBuffer.data[i+2], 1], [0,0,0,0]);

        currentPt[0] = -currentPt[0];

        var invW = 1.0 / currentPt[3];
        currentPt[0] *= invW;
        currentPt[1] *= invW;
        currentPt[2] *= invW;
        currentPt[3] = 1.0; //W * (1/W) = 1

        currentPt[0] *= -1;
        currentPt[1] *= -1;

        currentPt[0] += 1;
        currentPt[1] += 1;

        currentPt[0] *= this.element.offsetWidth * 0.5;
        currentPt[1] *= this.element.offsetHeight * 0.5;

        vertexProj.push(currentPt);
    }

    for(var i = 0; i < mesh.indexBuffer.data.length; i+=3) {
        var colorId = mesh.indexBuffer.data[i]*4;
        var tri = {
            pt0: vertexProj[mesh.indexBuffer.data[i]],
            pt1: vertexProj[mesh.indexBuffer.data[i+1]],
            pt2: vertexProj[mesh.indexBuffer.data[i+2]],
            color: [Math.round(mesh.colorBuffer.data[colorId]*255),
                    Math.round(mesh.colorBuffer.data[colorId+1]*255),
                    Math.round(mesh.colorBuffer.data[colorId+2]*255),
                    Math.round(mesh.colorBuffer.data[colorId+3]*255)],
            zmean: 0
        };
        tri.zmean = (tri.pt0[2] + tri.pt1[2] + tri.pt2[2]) / 3.0;
        tri.sortz = [tri.pt0[2], tri.pt1[2], tri.pt2[2]];
        tri.sortz.sort();

        this.triangles.push(tri);
    }
};

Rubikjs.Render.Canvas.Renderer.prototype.endFrame = function() {
    this.triangles.sort(function(tri0, tri1) {
        //return tri1.zmean - tri0.zmean;
        if(tri0.sortz[0] != tri1.sortz[0]) {
            return tri1.sortz[0] - tri0.sortz[0];
        } else if(tri0.sortz[1] != tri1.sortz[1]) {
            return tri1.sortz[1] - tri0.sortz[1];
        } else {
            return tri1.sortz[2] - tri0.sortz[2];
        }
    });

    this.ctx.clearRect(0, 0, 500, 500);

    var self = this;
    this.triangles.forEach(function(tri) {
        self.ctx.fillStyle = "rgba("+tri.color[0]+", "+tri.color[1]+", "+tri.color[2]+", "+tri.color[3]+")";
        self.ctx.strokeStyle = self.ctx.fillStyle;
        self.ctx.beginPath();
        self.ctx.moveTo(tri.pt0[0], tri.pt0[1]);
        self.ctx.lineTo(tri.pt1[0], tri.pt1[1]);
        self.ctx.lineTo(tri.pt2[0], tri.pt2[1]);
        self.ctx.closePath();
        self.ctx.fill();
        self.ctx.stroke();
    });
};

Rubikjs.Render.Canvas.Renderer.prototype.createMesh = function() {
    return new Rubikjs.Render.Mesh();
};
