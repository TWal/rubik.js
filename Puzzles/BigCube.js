/* Rubik.js

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

Rubikjs.Puzzle.BigCube = function(renderManager, options) {
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
        N: 5,
        stickerDistance: 0.01,
        stickerMargin: 0.1,
        backStickerMargin: 0.1,
    };
    this.makeOptions(defaultOptions, options, 2*(options.N || defaultOptions.N));

    if(this.options.N <= 1) {
        Rubikjs.Core.Logger.log("BigCube", "N is too low (" + this.options.N + "), exiting", "error");
        return;
    } else if(this.options.N < 4) {
        Rubikjs.Core.Logger.log("BigCube", "N is recommended to be under 4", "warn");
    }

    this.initGroups();
    this.initGraphics();

    this.endInit();
};

Rubikjs.Puzzle.BigCube.prototype = new Rubikjs.Twisty.FixedPiecePlace;
Rubikjs.Puzzle.BigCube.prototype.constructor = new Rubikjs.Puzzle.BigCube;


Rubikjs.Puzzle.BigCube.prototype.initGroups = function() {
    var N = this.options.N;
    //The size of a rectangle starting on the corner of a face, containing each type of piece, only once
    var pieceX, pieceY;
    if(N % 2) {
        pieceX = Math.floor(N / 2);
        pieceY = Math.ceil(N / 2);
    } else {
        pieceX = N / 2;
        pieceY = N / 2;
    }

    var outerFaceCycles = [];
    for(var i = 0; i < pieceX; ++i) {
        for(var j = 0; j < pieceY; ++j) {
            outerFaceCycles.push([[i, 0, j], [j, 0, N-1-i], [N-1-i, 0, N-1-j], [N-1-j, 0, i]]);
        }
    }
    if(N % 2) {
        outerFaceCycles.push([[Math.floor(N/2), 0, Math.floor(N/2)]]);
    }

    var slicesCycles = [];
    for(var i = 1; i < N-1; ++i) {
        slicesCycles[i] = [];
        for(var j = 0; j < N-1; ++j) {
            slicesCycles[i].push([[0, i, j], [j, i, N-1], [N-1, i, N-1-j], [N-1-j, i, 0]]);
        }
    }

    var deepMap = function(array, f) {
        return array.map(function(a) {
            return a.map(f);
        });
    };

    var coordFromD = {
           U: function(c) {
            return [N-1-c[0], N-1-c[1], c[2]];
        }, L: function(c) {
            return [c[1], N-1-c[0], c[2]];
        }, F: function(c) {
            return [c[0], c[2], N-1-c[1]];
        }, R: function(c) {
            return [N-1-c[1], c[0], c[2]];
        }, B: function(c) {
            return [c[0], N-1-c[2], c[1]];
        }, D: function(c) {
            return c;
        }
    };

    this.groups.U = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: deepMap(outerFaceCycles, coordFromD.U),
        rotationAxis: [0, 1, 0],
        rotationCenter: [0, 2, 0]
    });

    this.groups.L = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: deepMap(outerFaceCycles, coordFromD.L),
        rotationAxis: [-1, 0, 0],
        rotationCenter: [-2, 0, 0]
    });

    this.groups.F = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: deepMap(outerFaceCycles, coordFromD.F),
        rotationAxis: [0, 0, 1],
        rotationCenter: [0, 0, 2]
    });

    this.groups.R = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: deepMap(outerFaceCycles, coordFromD.R),
        rotationAxis: [1, 0, 0],
        rotationCenter: [2, 0, 0]
    });

    this.groups.B = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: deepMap(outerFaceCycles, coordFromD.B),
        rotationAxis: [0, 0, -1],
        rotationCenter: [0, 0, -2]
    });

    this.groups.D = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
        pieces: deepMap(outerFaceCycles, coordFromD.D),
        rotationAxis: [0, -1, 0],
        rotationCenter: [0, -2, 0]
    });

    var oppositeFaces = {
        "U": "D",
        "D": "U",
        "L": "R",
        "R": "L",
        "F": "B",
        "B": "F"
    };
    var faceNames = "ULFRBD";
    for(var i = 0; i < faceNames.length; ++i) {
        var faceName = faceNames[i];
        for(var j = 1; j < N-1; ++j) {
            var groupName = "N" + (j+1) + faceName;
            this.groups[groupName] = new Rubikjs.Twisty.FixedPiecePlace.Group(this, {
                pieces: deepMap(slicesCycles[j], coordFromD[faceName]),
                rotationAxis: this.groups[faceName].rotationAxis,
                rotationCenter: this.groups[faceName].rotationCenter
            });
            this.groups[(j+1) + faceName.toLowerCase()] = this.groups[groupName];
        }
        this.groups["N" + faceName] = this.groups["N2" + faceName];
        this.groups["N1" + faceName] = this.groups[faceName];
        this.groups["N" + N + faceName] = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, [[oppositeFaces[faceName] ,-1]]);
        this.groups[faceName.toLowerCase()] = this.groups["N2" + faceName];
        this.groups["1" + faceName.toLowerCase()] = this.groups[faceName];
        this.groups[N + faceName.toLowerCase()] = this.groups["N" + N + faceName]

        for(var j = 0; j < N; ++j) {
            var groupName = "T" + (j+1) + faceName;
            var combinations = [];
            for(var k = 0; k <= j; ++k) {
                combinations.push(["N" + (k+1) + faceName, 1]);
            }
            this.groups[groupName] = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, combinations);
            this.groups[(j+1) + faceName + "w"] = this.groups[groupName];
        }
        this.groups["T" + faceName] = this.groups["T2" + faceName];
        this.groups[faceName + "w"] = this.groups["2" + faceName + "w"];
        this.groups["C" + faceName] = this.groups["T" + N + faceName];

        for(var j = 0; j < N-1; ++j) {
            var groupName = "V" + (j+1) + faceName;
            var combinations = [];
            for(var k = 1; k <= j+1; ++k) {
                combinations.push(["N" + (k+1) + faceName, 1]);
            }
            this.groups[groupName] = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, combinations);
        }
        this.groups["V" + faceName] = this.groups["V2" + faceName];

        for(var j = 0; j < N; ++j) {
            var groupName = "M" + (j+1) + faceName;
            var combinations = [];
            var combinationsStart = Math.floor((N + 1 - j) / 2);
            for(var k = 0; k <= j; ++k) {
                combinations.push(["N" + (k+combinationsStart) + faceName, 1]);
            }
            this.groups[groupName] = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, combinations);
        }
        this.groups["M" + faceName] = this.groups["M1" + faceName];
        this.groups["W" + faceName] = this.groups["M" + (N-2) + faceName];

        for(var j = 0; j <= Math.floor(N/2); ++j) {
            var groupName = "S" + (j+1) + faceName;
            var combinations = [];
            for(var k = 0; k <= j; ++k) {
                combinations.push(["N" + (k+1) + faceName, 1]);
                combinations.push(["N" + (N-k) + faceName, 1]);
            }
            if(j == Math.floor(N/2)) {
                combinations.pop();
            }
            this.groups[groupName] = new Rubikjs.Twisty.FixedPiecePlace.Combined(this, combinations);
        }
        this.groups["S" + faceName] = this.groups["S1" + faceName];
    }

    this.groups.x = this.groups.CR;
    this.groups.X = this.groups.CR;
    this.groups.y = this.groups.CU;
    this.groups.Y = this.groups.CU;
    this.groups.z = this.groups.CF;
    this.groups.Z = this.groups.CF;
};


Rubikjs.Puzzle.BigCube.prototype.initGraphics = function() {
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
    var N = this.options.N;
    //c for "coordinate number". This number will be everywhere in the cubies coordinate
    var cn = N - 1;

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

    var corners = {};
    corners[[0,   N-1, 0  ]] = [[-cn,  cn, -cn], [0,    pi, 0], {U: colorscheme.U, F: colorscheme.B, R: colorscheme.L}]; // UBL
    corners[[N-1, N-1, 0  ]] = [[ cn,  cn, -cn], [0,   pi2, 0], {U: colorscheme.U, F: colorscheme.R, R: colorscheme.B}]; // UBR
    corners[[N-1, N-1, N-1]] = [[ cn,  cn,  cn], [0,     0, 0], {U: colorscheme.U, F: colorscheme.F, R: colorscheme.R}]; // UFR
    corners[[0,   N-1, N-1]] = [[-cn,  cn,  cn], [0,  -pi2, 0], {U: colorscheme.U, F: colorscheme.L, R: colorscheme.F}]; // UFL
    corners[[0,   0,   0  ]] = [[-cn, -cn, -cn], [pi, -pi2, 0], {U: colorscheme.D, F: colorscheme.L, R: colorscheme.B}]; // DBL
    corners[[N-1, 0,   0  ]] = [[ cn, -cn, -cn], [pi,    0, 0], {U: colorscheme.D, F: colorscheme.B, R: colorscheme.R}]; // DBR
    corners[[N-1, 0,   N-1]] = [[ cn, -cn,  cn], [pi,  pi2, 0], {U: colorscheme.D, F: colorscheme.R, R: colorscheme.F}]; // DFR
    corners[[0,   0,   N-1]] = [[-cn, -cn,  cn], [pi,   pi, 0], {U: colorscheme.D, F: colorscheme.F, R: colorscheme.L}]; // DFL

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

    var edges = [
        [0, [0,   N-1, 0  ], [0,   pi,    0], {U: colorscheme.U, F: colorscheme.B}], // UB
        [2, [N-1, N-1, 0  ], [0,  pi2,    0], {U: colorscheme.U, F: colorscheme.R}], // UR
        [0, [0,   N-1, N-1], [0,    0,    0], {U: colorscheme.U, F: colorscheme.F}], // UF
        [2, [0,   N-1, 0  ], [0, -pi2,    0], {U: colorscheme.U, F: colorscheme.L}], // UL
        [1, [0,   0,   N-1], [0,    0,  pi2], {U: colorscheme.L, F: colorscheme.F}], // FL
        [1, [N-1, 0,   N-1], [0,    0, -pi2], {U: colorscheme.R, F: colorscheme.F}], // FR
        [1, [N-1, 0,   0  ], [0,   pi,  pi2], {U: colorscheme.R, F: colorscheme.B}], // BR
        [1, [0,   0,   0  ], [0,   pi, -pi2], {U: colorscheme.L, F: colorscheme.B}], // BL
        [0, [0,   0,   N-1], [0,    0,   pi], {U: colorscheme.D, F: colorscheme.F}], // DF
        [2, [N-1, 0,   0  ], [0,  pi2,   pi], {U: colorscheme.D, F: colorscheme.R}], // DR
        [0, [0,   0,   0  ], [0,   pi,   pi], {U: colorscheme.D, F: colorscheme.B}], // DB
        [2, [0,   0,   0  ], [0, -pi2,   pi], {U: colorscheme.D, F: colorscheme.L}]  // DL
    ];

    for(var i = 0; i < edges.length; ++i) {
        var edge = edges[i];
        for(var j = 1; j < N-1; ++j) {
            var cubePos = edge[1];
            cubePos[edge[0]] = j;
            var pos = cubePos.map(function(c) {
                return c*2 - cn;
            });
            var piece = edgeFactory.create(pos, edge[2], edge[3]);
            this.rendermgr.meshs.push(piece.movable.mesh);
            this.pieces[cubePos] = piece;
        }
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

    var centers = [
        [[0, 2], [0,   N-1, 0  ], [0,    0,    0], {U: colorscheme.U}], // U
        [[1, 2], [0,   0,   0  ], [0,    0,  pi2], {U: colorscheme.L}], // L
        [[0, 1], [0,   0,   N-1], [pi2,  0,    0], {U: colorscheme.F}], // F
        [[1, 2], [N-1, 0,   0  ], [0,    0, -pi2], {U: colorscheme.R}], // R
        [[0, 1], [0,   0,   0  ], [-pi2, 0,    0], {U: colorscheme.B}], // B
        [[0, 2], [0,   0,   0  ], [pi,   0,    0], {U: colorscheme.D}]  // D
    ];

    for(var i = 0; i < centers.length; ++i) {
        var center = centers[i];
        for(var j = 1; j < N-1; ++j) {
            for(var k = 1; k < N-1; ++k) {
                var cubePos = center[1];
                cubePos[center[0][0]] = j;
                cubePos[center[0][1]] = k;
                var pos = cubePos.map(function(c) {
                    return c*2 - cn;
                });
                var piece = centerFactory.create(pos, center[2], center[3]);
                this.rendermgr.meshs.push(piece.movable.mesh);
                this.pieces[cubePos] = piece;
            }
        }
    }
};


