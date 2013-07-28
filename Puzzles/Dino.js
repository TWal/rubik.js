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

Rubikjs.Puzzle.Dino = function(renderManager, options) {
    if(renderManager == undefined) {
        return;
    }
    Rubikjs.Twisty.FixedPiecePlace.call(this);
    this.rendermgr = renderManager;
    this.turnDegree = 120;
    this.notation = new Rubikjs.Twisty.FixedPiecePlace.DefaultNotation(this);

    this.options = {};
    var defaultOptions = {
        colorscheme: {
            U: [1.0, 1.0, 1.0, 1.0],
            D: [1.0, 1.0, 0.0, 1.0],
            L: [0.0, 1.0, 0.0, 1.0],
            R: [0.0, 0.0, 1.0, 1.0],
            F: [1.0, 0.0, 0.0, 1.0],
            B: [1.0, 0.5, 0.0, 1.0],
        },
        plasticColor: [0.0, 0.0, 0.0, 1.0],
        minimal: false,
        stickerDist: 0.01,
        stickerMargin: 0.1,
        backStickerEnabled: true,
        backStickerDist: 2,
        backStickerMargin: 0.1,
    };
    if(options) {
        for(var key in defaultOptions) {
            this.options[key] = defaultOptions[key];
        }
        for(var key in options) {
            this.options[key] = options[key];
        }
    } else {
        this.options = defaultOptions;
    }

    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -4]);
    mat4.rotateX(cameraMatrix, cameraMatrix, Math.PI/6);
    mat4.rotateY(cameraMatrix, cameraMatrix, -Math.PI/6);
    this.rendermgr.transformCamera(cameraMatrix);

    this.initGroups();
    this.initGraphics();

    this.endInit();
};

Rubikjs.Puzzle.Dino.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.Dino.prototype.constructor = new Rubikjs.Puzzle.Dino;


Rubikjs.Puzzle.Dino.prototype.initGroups = function() {
    var self = this;
    function makePermutations(group) {
        self.groups[group[0] + group[2] + group[1]] = self.groups[group];
        self.groups[group[1] + group[0] + group[2]] = self.groups[group];
        self.groups[group[1] + group[2] + group[0]] = self.groups[group];
        self.groups[group[2] + group[0] + group[1]] = self.groups[group];
        self.groups[group[2] + group[1] + group[0]] = self.groups[group];
    }

    this.groups.UFL = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.UFL.pieces = [["UL", "UF", "FL"]];
    this.groups.UFL.rotationAxis = [-1, 1, 1];
    this.groups.UFL.rotationCenter = [-1, 1, 1];
    makePermutations("UFL");

    this.groups.UFR = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.UFR.pieces = [["UF", "UR", "FR"]];
    this.groups.UFR.rotationAxis = [1, 1, 1];
    this.groups.UFR.rotationCenter = [1, 1, 1];
    makePermutations("UFR");

    this.groups.UBL = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.UBL.pieces = [["UB", "UL", "BL"]];
    this.groups.UBL.rotationAxis = [-1, 1, -1];
    this.groups.UBL.rotationCenter = [-1, 1, -1];
    makePermutations("UBL");

    this.groups.UBR = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.UBR.pieces = [["UR", "UB", "BR"]];
    this.groups.UBR.rotationAxis = [1, 1, -1];
    this.groups.UBR.rotationCenter = [1, 1, -1];
    makePermutations("UBR");

    this.groups.DFL = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.DFL.pieces = [["DF", "DL", "FL"]];
    this.groups.DFL.rotationAxis = [-1, -1, 1];
    this.groups.DFL.rotationCenter = [-1, -1, 1];
    makePermutations("DFL");

    this.groups.DFR = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.DFR.pieces = [["DR", "DF", "FR"]];
    this.groups.DFR.rotationAxis = [1, -1, 1];
    this.groups.DFR.rotationCenter = [1, -1, 1];
    makePermutations("DFR");

    this.groups.DBL = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.DBL.pieces = [["DL", "DB", "BL"]];
    this.groups.DBL.rotationAxis = [-1, -1, -1];
    this.groups.DBL.rotationCenter = [-1, -1, -1];
    makePermutations("BDL");

    this.groups.DBR = new Rubikjs.Twisty.FixedPiecePlace.Group(this);
    this.groups.DBR.pieces = [["DB", "DR", "BR"]];
    this.groups.DBR.rotationAxis = [1, -1, -1];
    this.groups.DBR.rotationCenter = [1, -1, -1];
    makePermutations("DBR");
};


Rubikjs.Puzzle.Dino.prototype.initGraphics = function() {
    var cubie = this.rendermgr.renderer.createMesh();
    if(this.options.minimal) {
        cubie.vertexBuffer.feed([]);
        cubie.indexBuffer.feed([]);
        var colors = [];
    } else {
        cubie.vertexBuffer.feed([
             0.0,  0.0,  1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             0.0,  1.0,  0.0
        ]);

        cubie.indexBuffer.feed([
            0, 2, 1,
            1, 2, 3,
            0, 3, 2,
            0, 1, 3
        ]);

        var colors = ["p", "p", "p", "p"];
    }

    var colorscheme = this.options.colorscheme;
    var pi = Math.PI;
    var pi2 = pi/2;
    var sqrt2 = Math.SQRT2;
    var stickerZ = 1 + this.options.stickerDist;
    var stickerX = 1 - this.options.stickerMargin * (sqrt2 + 1);
    var stickerY1 = 1 - this.options.stickerMargin;
    var stickerY2 = this.options.stickerMargin * sqrt2;








    var edgeMesh = this.rendermgr.renderer.createMesh();
    edgeMesh.vertexBuffer.feed(cubie.vertexBuffer.data.concat([
        // F
         stickerX, stickerY1, stickerZ,
        -stickerX, stickerY1, stickerZ,
                0, stickerY2, stickerZ,
        // U
        -stickerX,  stickerZ, stickerY1,
         stickerX,  stickerZ, stickerY1,
                0,  stickerZ, stickerY2
    ]));

    edgeMesh.indexBuffer.feed(cubie.indexBuffer.data.concat([
        0, 1, 2, // F
        3, 4, 5  // U
    ].map(function(d) {
        return d + cubie.vertexBuffer.data.length/3;
    })));

    var edgeColors = colors.concat([
        "F", "F", "F",
        "U", "U", "U",
    ]);

    var edgeDefaultColors = {
        p: this.options.plasticColor,
        F: [0.5, 0.5, 0.5, 1.0],
        U: [0.5, 0.5, 0.5, 1.0]
    };

    if(this.options.backStickerEnabled) {
        //TODO
    }

    var edgeFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, edgeMesh.vertexBuffer, edgeMesh.indexBuffer, edgeMesh.colorBuffer, edgeColors, edgeDefaultColors);

    var edges = {
        UB: [[0, 0, 0], [0,   pi,    0], {U: colorscheme.U, F: colorscheme.B}],
        UR: [[0, 0, 0], [0,  pi2,    0], {U: colorscheme.U, F: colorscheme.R}],
        UF: [[0, 0, 0], [0,    0,    0], {U: colorscheme.U, F: colorscheme.F}],
        UL: [[0, 0, 0], [0, -pi2,    0], {U: colorscheme.U, F: colorscheme.L}],
        FL: [[0, 0, 0], [0,    0,  pi2], {U: colorscheme.L, F: colorscheme.F}],
        FR: [[0, 0, 0], [0,    0, -pi2], {U: colorscheme.R, F: colorscheme.F}],
        BR: [[0, 0, 0], [0,   pi,  pi2], {U: colorscheme.R, F: colorscheme.B}],
        BL: [[0, 0, 0], [0,   pi, -pi2], {U: colorscheme.L, F: colorscheme.B}],
        DF: [[0, 0, 0], [0,    0,   pi], {U: colorscheme.D, F: colorscheme.F}],
        DR: [[0, 0, 0], [0,  pi2,    pi], {U: colorscheme.D, F: colorscheme.R}],
        DB: [[0, 0, 0], [0,   pi,    pi], {U: colorscheme.D, F: colorscheme.B}],
        DL: [[0, 0, 0], [0, -pi2,    pi], {U: colorscheme.D, F: colorscheme.L}]
    };

    for(var i in edges) {
        var piece = edgeFactory.create(edges[i][0], edges[i][1], edges[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }
};

