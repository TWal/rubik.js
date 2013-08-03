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

Rubikjs.Puzzle.ClassicRubiksCube = function(renderManager, options) {
    if(renderManager == undefined) {
        return;
    }
    Rubikjs.Twisty.FixedPiecePlace.call(this);
    this.rendermgr = renderManager;
    this.turnDegree = 90;
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
        stickerDistance: 0.01,
        stickerMargin: 0.1,
        backStickerMargin: 0.1,
    };
    this.makeOptions(defaultOptions, options, 6);

    this.initGroups();
    this.initGraphics();

    this.endInit();
};

Rubikjs.Puzzle.ClassicRubiksCube.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.ClassicRubiksCube.prototype.constructor = new Rubikjs.Puzzle.ClassicRubiksCube;


Rubikjs.Puzzle.ClassicRubiksCube.prototype.initGroups = function() {
    this.groups.U = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBL", "UBR", "UFR", "UFL"], ["UB", "UR", "UF", "UL"], ["U"]],
        rotationAxis: [0, 1, 0],
        rotationCenter: [0, 2, 0]
    });

    this.groups.L = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBL", "UFL", "DFL", "DBL"], ["UL", "FL", "DL", "BL"], ["L"]],
        rotationAxis: [-1, 0, 0],
        rotationCenter: [-2, 0, 0]
    });

    this.groups.F = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UFR", "DFR", "DFL", "UFL"], ["UF", "FR", "DF", "FL"], ["F"]],
        rotationAxis: [0, 0, 1],
        rotationCenter: [0, 0, 2]
    });

    this.groups.R = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBR", "DBR", "DFR", "UFR"], ["UR", "BR", "DR", "FR"], ["R"]],
        rotationAxis: [1, 0, 0],
        rotationCenter: [2, 0, 0]
    });

    this.groups.B = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UBR", "UBL", "DBL", "DBR"], ["UB", "BL", "DB", "BR"], ["B"]],
        rotationAxis: [0, 0, -1],
        rotationCenter: [0, 0, -2]
    });

    this.groups.D = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["DBL", "DFL", "DFR", "DBR"], ["DF", "DR", "DB", "DL"], ["D"]],
        rotationAxis: [0, -1, 0],
        rotationCenter: [0, -2, 0]
    });

    this.groups.M = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UF", "DF", "DB", "UB"], ["U", "F", "D", "B"]],
        rotationAxis: [-1, 0, 0],
        rotationCenter: [0, 0, 0]
    });

    this.groups.S = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["UL", "UR", "DR", "DL"], ["U", "R", "D", "L"]],
        rotationAxis: [0, 0, 1],
        rotationCenter: [0, 0, 0]
    });

    this.groups.E = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: [["FL", "FR", "BR", "BL"], ["F", "R", "B", "L"]],
        rotationAxis: [0, -1, 0],
        rotationCenter: [0, 0, 0]
    });

    this.groups.u = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["E", -1]]);
    this.groups.l = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["L", 1], ["M",  1]]);
    this.groups.f = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["S",  1]]);
    this.groups.r = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["M", -1]]);
    this.groups.b = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["B", 1], ["S", -1]]);
    this.groups.d = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["D", 1], ["E",  1]]);

    this.groups.Uw = this.groups.u;
    this.groups.Lw = this.groups.l;
    this.groups.Fw = this.groups.f;
    this.groups.Rw = this.groups.r;
    this.groups.Bw = this.groups.b;
    this.groups.Dw = this.groups.d;

    this.groups.X = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["R", 1], ["M", -1], ["L", -1]]);
    this.groups.Y = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["U", 1], ["E", -1], ["D", -1]]);
    this.groups.Z = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [["F", 1], ["S",  1], ["B", -1]]);

    this.groups.x = this.groups.X;
    this.groups.y = this.groups.Y;
    this.groups.z = this.groups.Z;
};


Rubikjs.Puzzle.ClassicRubiksCube.prototype.initGraphics = function() {
    var cubie = this.rendermgr.renderer.createMesh();
    if(this.options.minimal) {
        cubie.vertexBuffer.feed([]);
        cubie.indexBuffer.feed([]);
        var colors = [];
    } else {
        cubie.vertexBuffer.feed([
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
        ]);

        cubie.indexBuffer.feed([
            1, 5, 7,    1, 7, 3, // F
            0, 2, 6,    0, 6, 4, // B
            2, 3, 7,    2, 7, 6, // U
            0, 4, 5,    0, 5, 1, // D
            4, 6, 7,    4, 7, 5, // R
            0, 1, 3,    0, 3, 2  // L
        ]);

        var colors = ["p", "p", "p", "p", "p", "p", "p", "p"];
    }

    var colorscheme = this.options.colorscheme;
    var pi = Math.PI;
    var pi2 = pi/2;

    var stickerGenerator = function(n) {
        return function(margin, distance) {
            var stickerZ = 1 + distance;
            var stickerXY = 1 - margin;

            return {
                vertex: [
                    // U
                    -stickerXY,  stickerZ,  -stickerXY,
                    -stickerXY,  stickerZ,   stickerXY,
                     stickerXY,  stickerZ,   stickerXY,
                     stickerXY,  stickerZ,  -stickerXY,
                    // F
                    -stickerXY, -stickerXY,  stickerZ,
                     stickerXY, -stickerXY,  stickerZ,
                     stickerXY,  stickerXY,  stickerZ,
                    -stickerXY,  stickerXY,  stickerZ,
                    // R
                     stickerZ,  -stickerXY, -stickerXY,
                     stickerZ,   stickerXY, -stickerXY,
                     stickerZ,   stickerXY,  stickerXY,
                     stickerZ,  -stickerXY,  stickerXY
                ].slice(0, n*12),
                index: [
                    0, 1, 2,      0, 2, 3,    // U
                    4, 5, 6,      4, 6, 7,    // F
                    8, 9, 10,     8, 10, 11   // R
                ].slice(0, n*6),
                other: {
                    colors: [
                        "U", "U", "U", "U",
                        "F", "F", "F", "F",
                        "R", "R", "R", "R"
                    ].slice(0, n*4)
                }
            };
        };
    };

    var defaultColors = {
        p: this.options.plasticColor,
        F: [0.5, 0.5, 0.5, 1.0],
        U: [0.5, 0.5, 0.5, 1.0],
        R: [0.5, 0.5, 0.5, 1.0]
    };


    // ----- Corners -----

    var cornerMesh = cubie.copy();
    cornerMesh.colors = colors.slice(0);
    var cornerStickerCreator = new Rubikjs.Render.StickerHelper(stickerGenerator(3));
    cornerStickerCreator.create(cornerMesh, this.options.stickerMargin, this.options.stickerDistance, false);

    if(this.options.backStickerEnabled) {
        cornerStickerCreator.create(cornerMesh, this.options.backStickerMargin, this.options.backStickerDistance, true);
    }

    var cornerFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, cornerMesh, cornerMesh.colors, defaultColors);

    var corners = {
        UBL: [[-2,  2, -2], [0,    pi, 0], {U: colorscheme.U, F: colorscheme.B, R: colorscheme.L}],
        UBR: [[ 2,  2, -2], [0,   pi2, 0], {U: colorscheme.U, F: colorscheme.R, R: colorscheme.B}],
        UFR: [[ 2,  2,  2], [0,     0, 0], {U: colorscheme.U, F: colorscheme.F, R: colorscheme.R}],
        UFL: [[-2,  2,  2], [0,  -pi2, 0], {U: colorscheme.U, F: colorscheme.L, R: colorscheme.F}],
        DBL: [[-2, -2, -2], [pi, -pi2, 0], {U: colorscheme.D, F: colorscheme.L, R: colorscheme.B}],
        DBR: [[ 2, -2, -2], [pi,    0, 0], {U: colorscheme.D, F: colorscheme.B, R: colorscheme.R}],
        DFR: [[ 2, -2,  2], [pi,  pi2, 0], {U: colorscheme.D, F: colorscheme.R, R: colorscheme.F}],
        DFL: [[-2, -2,  2], [pi,   pi, 0], {U: colorscheme.D, F: colorscheme.F, R: colorscheme.L}]
    };
    for(var i in corners) {
        var piece = cornerFactory.create(corners[i][0], corners[i][1], corners[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }

    // ----- Edges -----

    var edgeMesh = cubie.copy();
    edgeMesh.colors = colors.slice(0);
    var edgeStickerCreator = new Rubikjs.Render.StickerHelper(stickerGenerator(2));
    edgeStickerCreator.create(edgeMesh, this.options.stickerMargin, this.options.stickerDistance, false);

    if(this.options.backStickerEnabled) {
        edgeStickerCreator.create(edgeMesh, this.options.backStickerMargin, this.options.backStickerDistance, true);
    }

    var edgeFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, edgeMesh, edgeMesh.colors, defaultColors);

    var edges = {
        UB: [[ 0,  2, -2], [0,   pi,    0], {U: colorscheme.U, F: colorscheme.B}],
        UR: [[ 2,  2,  0], [0,  pi2,    0], {U: colorscheme.U, F: colorscheme.R}],
        UF: [[ 0,  2,  2], [0,    0,    0], {U: colorscheme.U, F: colorscheme.F}],
        UL: [[-2,  2,  0], [0, -pi2,    0], {U: colorscheme.U, F: colorscheme.L}],
        FL: [[-2,  0,  2], [0,    0,  pi2], {U: colorscheme.L, F: colorscheme.F}],
        FR: [[ 2,  0,  2], [0,    0, -pi2], {U: colorscheme.R, F: colorscheme.F}],
        BR: [[ 2,  0, -2], [0,   pi,  pi2], {U: colorscheme.R, F: colorscheme.B}],
        BL: [[-2,  0, -2], [0,   pi, -pi2], {U: colorscheme.L, F: colorscheme.B}],
        DF: [[ 0, -2,  2], [0,    0,   pi], {U: colorscheme.D, F: colorscheme.F}],
        DR: [[ 2, -2,  0], [0,  pi2,    pi], {U: colorscheme.D, F: colorscheme.R}],
        DB: [[ 0, -2, -2], [0,   pi,    pi], {U: colorscheme.D, F: colorscheme.B}],
        DL: [[-2, -2,  0], [0, -pi2,    pi], {U: colorscheme.D, F: colorscheme.L}]
    };

    for(var i in edges) {
        var piece = edgeFactory.create(edges[i][0], edges[i][1], edges[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }

    // ----- Centers -----

    var centerMesh = cubie.copy();
    centerMesh.colors = colors.slice(0);
    var centerStickerCreator = new Rubikjs.Render.StickerHelper(stickerGenerator(1));
    centerStickerCreator.create(centerMesh, this.options.stickerMargin, this.options.stickerDistance, false);

    if(this.options.backStickerEnabled) {
        centerStickerCreator.create(centerMesh, this.options.backStickerMargin, this.options.backStickerDistance, true);
    }

    var centerFactory = new Rubikjs.Render.PieceFactory(Rubikjs.Twisty.FixedPiecePlace.Piece, centerMesh, centerMesh.colors, defaultColors);

    var centers = {
        U: [[ 0,  2,  0], [0,    0,    0], {U: colorscheme.U}],
        L: [[-2,  0,  0], [0,    0,  pi2], {U: colorscheme.L}],
        F: [[ 0,  0,  2], [pi2,  0,    0], {U: colorscheme.F}],
        R: [[ 2,  0,  0], [0,    0, -pi2], {U: colorscheme.R}],
        B: [[ 0,  0, -2], [-pi2, 0,    0], {U: colorscheme.B}],
        D: [[ 0, -2,  0], [pi,   0,    0], {U: colorscheme.D}]
    };

    for(var i in centers) {
        var piece = centerFactory.create(centers[i][0], centers[i][1], centers[i][2]);
        this.rendermgr.meshs.push(piece.movable.mesh);
        this.pieces[i] = piece;
    }
};
