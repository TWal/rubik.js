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

    var defaultOptions = {
        colorscheme: {
            U: [1.0, 1.0, 1.0, 1.0],
            D: [1.0, 1.0, 0.0, 1.0],
            L: [0.0, 1.0, 0.0, 1.0],
            R: [0.0, 0.0, 1.0, 1.0],
            F: [1.0, 0.0, 0.0, 1.0],
            B: [1.0, 0.5, 0.0, 1.0],
        },
        stickerDistance: 0.005,
        stickerMargin: 0.05,
        backStickerMargin: 0.05,
    };
    this.makeOptions(defaultOptions, options, 2);

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

    this.groups.UFL = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UL", "UF", "FL"]],
        rotationAxis: [-1, 1, 1],
        rotationCenter: [-1, 1, 1]
    });
    makePermutations("UFL");

    this.groups.UFR = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UF", "UR", "FR"]],
        rotationAxis: [1, 1, 1],
        rotationCenter: [1, 1, 1]
    });
    makePermutations("UFR");

    this.groups.UBL = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UB", "UL", "BL"]],
        rotationAxis: [-1, 1, -1],
        rotationCenter: [-1, 1, -1]
    });
    makePermutations("UBL");

    this.groups.UBR = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UR", "UB", "BR"]],
        rotationAxis: [1, 1, -1],
        rotationCenter: [1, 1, -1]
    });
    makePermutations("UBR");

    this.groups.DFL = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["DF", "DL", "FL"]],
        rotationAxis: [-1, -1, 1],
        rotationCenter: [-1, -1, 1]
    });
    makePermutations("DFL");

    this.groups.DFR = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["DR", "DF", "FR"]],
        rotationAxis: [1, -1, 1],
        rotationCenter: [1, -1, 1]
    });
    makePermutations("DFR");

    this.groups.DBL = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["DL", "DB", "BL"]],
        rotationAxis: [-1, -1, -1],
        rotationCenter: [-1, -1, -1]
    });
    makePermutations("DBL");

    this.groups.DBR = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["DB", "DR", "BR"]],
        rotationAxis: [1, -1, -1],
        rotationCenter: [1, -1, -1]
    });
    makePermutations("DBR");


    this.groups.X = new Rubikjs.Twisty.FixedPiecePlace.FullRotation(this, {
        groups: [["UFL", "UBL", "DBL", "DFL"], ["UFR", "UBR", "DBR", "DFR"]],
        rotationAxis: [1, 0, 0],
        rotationCenter: [0, 0, 0],
        turnDegree: 90
    });
    this.groups.x = this.groups.X;

    this.groups.Y = new Rubikjs.Twisty.FixedPiecePlace.FullRotation(this, {
        groups: [["UFL", "UBL", "UBR", "UFR"], ["DFL", "DBL", "DBR", "DFR"]],
        rotationAxis: [0, 1, 0],
        rotationCenter: [0, 0, 0],
        turnDegree: 90
    });
    this.groups.y = this.groups.Y;

    this.groups.Z = new Rubikjs.Twisty.FixedPiecePlace.FullRotation(this, {
        groups: [["UFL", "UFR", "DFR", "DFL"], ["UBL", "UBR", "DBR", "DBL"]],
        rotationAxis: [0, 0, 1],
        rotationCenter: [0, 0, 0],
        turnDegree: 90
    });
    this.groups.z = this.groups.Z;

};


Rubikjs.Puzzle.Dino.prototype.initGraphics = function() {
    var edgeMesh = this.rendermgr.renderer.createMesh();
    if(this.options.minimal) {
        edgeMesh.vertexBuffer.feed([]);
        edgeMesh.indexBuffer.feed([]);
        var colors = [];
    } else {
        edgeMesh.vertexBuffer.feed([
             0.0,  0.0,  1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             0.0,  1.0,  0.0
        ]);

        edgeMesh.indexBuffer.feed([
            0, 2, 1,
            1, 2, 3,
            0, 3, 2,
            0, 1, 3
        ]);

        var colors = ["p", "p", "p", "p"];
    }

    var stickerCreator = new Rubikjs.Render.StickerHelper(function(margin, distance) {
        var sqrt2 = Math.SQRT2;
        var stickerZ = 1 + distance;
        var stickerX = 1 - margin * (sqrt2 + 1);
        var stickerY1 = 1 - margin;
        var stickerY2 = margin * sqrt2;

        colors = colors.concat([
            "F", "F", "F",
            "U", "U", "U",
        ]);

        return {
            vertex: [
                // F
                 stickerX, stickerY1, stickerZ,
                -stickerX, stickerY1, stickerZ,
                        0, stickerY2, stickerZ,
                // U
                -stickerX,  stickerZ, stickerY1,
                 stickerX,  stickerZ, stickerY1,
                        0,  stickerZ, stickerY2
            ], index: [
                0, 1, 2, // F
                3, 4, 5  // U
            ]
        };
    });

    stickerCreator.create(edgeMesh, this.options.stickerMargin, this.options.stickerDistance, false);

    if(this.options.backStickerEnabled) {
        stickerCreator.create(edgeMesh, this.options.backStickerMargin, this.options.backStickerDistance, true);
    }

    var colorscheme = this.options.colorscheme;
    var pi = Math.PI;
    var pi2 = pi/2;

    var edgeDefaultColors = {
        p: this.options.plasticColor,
        F: [0.5, 0.5, 0.5, 1.0],
        U: [0.5, 0.5, 0.5, 1.0]
    };
    var edgeFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, edgeMesh, colors, edgeDefaultColors);

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
        DR: [[0, 0, 0], [0,  pi2,   pi], {U: colorscheme.D, F: colorscheme.R}],
        DB: [[0, 0, 0], [0,   pi,   pi], {U: colorscheme.D, F: colorscheme.B}],
        DL: [[0, 0, 0], [0, -pi2,   pi], {U: colorscheme.D, F: colorscheme.L}]
    };

    for(var i in edges) {
        var piece = edgeFactory.create(edges[i][0], edges[i][1], edges[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }
};

