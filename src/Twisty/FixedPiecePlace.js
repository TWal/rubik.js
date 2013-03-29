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

//Use this class if you want to simulate a doctrinaire puzzle, or a shape-mod of a doctrinaire puzzle.
//A doctrinaire puzzle is a puzzle that keep its shape identical after each turn

//For example: The classic Rubik's cube is doctrinaire, and the fisher cube is a shape-mod of the classic Rubik's cube, so you should use this class for both.
//Some puzzles like the mixup cube can be considered as a shape-mod of a doctrinaire puzzle, you should use this class for them.

//There is a common thing for each of these puzzle: Each piece has a place, and each place of the puzzle has a piece in it.

//Examples: Should go here: N*N*N, fisher cube, X*Y*Z (half turn only), Mixup Cube, Megaminx, Skewb, Pyraminx, Square-2
//          Should NOT go here: Curvy-copter, TomZ's 3*4*5, TomZ's 4*4*6
//          Bandaged puzzles should NOT go here too: Square-1 (it's a square-2 bandaged), bandaged cube
Rubikjs.Twisty.FixedPiecePlace = function() {
    //These variables are here only to understand easilier the rest of the code. You must override them
    this.pieces = {};
    this.groups = {};
    this.fullRotations = {};
    this.turnDegree = 90;
    this.turnTime = 0.5;
    this.stepNumber = 10;
    this.instructionQueue = [];
    this.isProcessingQueue = false;
    this.rendermgr = null;
};

Rubikjs.Twisty.FixedPiecePlace.prototype.endInit = function() {
    var self = this;
    for(var i in this.groups) {
        this.groups[i].pieces = this.groups[i].pieces.map(function(piecesId) {
            return piecesId.map(function(pieceId) {
                return self.pieces[pieceId];
            });
        });
    }
    this.rendermgr.render();
};

Rubikjs.Twisty.FixedPiecePlace.prototype.sendInstruction = function(instruction) {
    this.instructionQueue.push(instruction);
    this.processQueue();
};


Rubikjs.Twisty.FixedPiecePlace.prototype.sendMultipleInstructions = function(instructions) {
    this.instructionQueue = this.instructionQueue.concat(instructions);
    this.processQueue();
};

Rubikjs.Twisty.FixedPiecePlace.prototype.processQueue = function() {
    if(this.isProcessingQueue) {
        return;
    } else if(this.instructionQueue.length == 0) {
        this.isProcessingQueue = false;
        return;
    }
    this.isProcessingQueue = true;

    var instruction = this.instructionQueue[0];

    var self = this;
    if(instruction instanceof Rubikjs.Notation.Move) {
        this.multipleMove(this.stepNumber, [this.groups[instruction.groupName].getTurnFunction(instruction.count, this.stepNumber)], function() {
            self.instructionQueue.shift();
            self.isProcessingQueue = false;
            self.processQueue();
        });
    } else if(instruction instanceof Rubikjs.Notation.FullRotation) {
        this.multipleMove(this.stepNumber, [this.fullRotations[instruction.rotName].getTurnFunction(instruction.count, this.stepNumber)], function() {
            self.instructionQueue.shift();
            self.isProcessingQueue = false;
            self.processQueue();
        });
    }
};

Rubikjs.Twisty.FixedPiecePlace.prototype.multipleMove = function(stepNumber, moveFunctions, callback) {
    //TODO: Better fps management
    var i = 0;
    var self = this;
    var loopFunction = function() {
        if(i < stepNumber) {
            moveFunctions.forEach(function(moveFunc) {
                moveFunc.turnFunction();
            });

            i += 1;
            setTimeout(loopFunction, self.turnTime / stepNumber * 1000);
            self.rendermgr.render();
        } else {
            moveFunctions.forEach(function(moveFunc) {
                moveFunc.endFunction();
            });

            callback();
        }
    }

    loopFunction();
};



Rubikjs.Twisty.FixedPiecePlace.Group = function(twisty) {
    this.twisty = twisty; //You should NOT change this
    this.pieces = []; //This is an array of array of pieces
    this.rotationAxis = [0, 1, 0];
    this.rotationCenter = [0, 0, 0];
};

Rubikjs.Twisty.FixedPiecePlace.Group.prototype.cycle = function(count) {
    for(var i = 0; i < this.pieces.length; ++i) {
        //Why this? Check out this example:
        /* var toto = this.pieces[0];
         * var tata = toto;
         * tata.movable = this.pieces[1].movable;
         */
        //Attention, you changed toto.movable!
        //That's why we do this
        var movableCopy = this.pieces[i].map(function(x) {
            return x.movable;
        });
        var piecesNb = this.pieces[i].length;
        var positiveCount = (count % piecesNb) + piecesNb; //When count is negative, the index we give won't be negative
        for(var j = 0; j < piecesNb; ++j) {
            this.pieces[i][j].movable = movableCopy[(j + positiveCount) % piecesNb];
        }
    }
};

Rubikjs.Twisty.FixedPiecePlace.Group.prototype.getTurnFunction = function(count, stepNumber) {
    count = -count; //Clockwise -> trigonometric
    var stepAngle = ((this.twisty.turnDegree * Math.PI / 180) * count) / stepNumber;
    var self = this;
    var rotationMat = mat4.rotate(mat4.identity(), stepAngle, self.rotationAxis);


    return {
        turnFunction: function() {
            self.pieces.forEach(function(pieces) {
                pieces.forEach(function(piece) {
                    mat4.multiply(rotationMat, piece.movable.mesh.transform, piece.movable.mesh.transform);
                });
            });
        }, endFunction: function() {
            self.cycle(count);
        }
    };
};



Rubikjs.Twisty.FixedPiecePlace.FullRotation = function(twisty) {
    this.twisty = twisty;
    this.groups = []; //This is an array of array of groups
    this.rotationAxis = [0, 1, 0];
    this.rotationCenter = [0, 0, 0];
};

Rubikjs.Twisty.FixedPiecePlace.FullRotation.prototype.cycle = function(count) {
    for(var i = 0; i < this.groups.length; ++i) {
        var groupsPieces = {};
        for (var key in this.twisty.groups) {
            if(this.twisty.groups.hasOwnProperty(key)) {
                groupsPieces[key] = this.twisty.groups[key].pieces;
            }
        }

        var groupNb = this.groups[i].length;
        var positiveCount = (count % groupNb) + groupNb;

        for(var j = 0; j < groupNb; ++j) {
            this.twisty.groups[this.groups[i][j]].pieces = groupsPieces[this.groups[i][(j + positiveCount) % groupNb]];
        }
    }
};

Rubikjs.Twisty.FixedPiecePlace.FullRotation.prototype.getTurnFunction = function(count, stepNumber) {
    count = -count; //Clockwise -> trigonometric
    var stepAngle = ((this.twisty.turnDegree * Math.PI / 180) * count) / stepNumber;
    var self = this;
    var rotationMat = mat4.rotate(mat4.identity(), stepAngle, self.rotationAxis);


    return {
        turnFunction: function() {
            for(var key in self.twisty.pieces) {
                mat4.multiply(rotationMat, self.twisty.pieces[key].movable.mesh.transform, self.twisty.pieces[key].movable.mesh.transform);
            }
        }, endFunction: function() {
            /*for(var i = 0; i < self.groups.length; ++i) {
                for(var j = 0; j < self.groups[i].length; ++j) {
                    var fullRotationMat = mat4.rotate(mat4.identity(), (self.twisty.turnDegree * Math.PI / 180) * count, self.rotationAxis);
                    var currentGroup = self.twisty.groups[self.groups[i][j]];
                    console.log(self.groups[i][j]);
                    console.log(currentGroup.rotationAxis);
                    mat4.multiplyVec3(fullRotationMat, currentGroup.rotationAxis);
                    mat4.multiplyVec3(fullRotationMat, currentGroup.rotationCenter);
                    console.log(currentGroup.rotationAxis);
                }
            }*/
            self.cycle(count);
        }
    };
};
