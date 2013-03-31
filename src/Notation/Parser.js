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

Rubikjs.Notation.Parser = function() {
    this.separator = " ";
    this.handleParenthesis = true;
    this.handleCombined = true;
};

Rubikjs.Notation.Parser.prototype.parse = function(formula) {
    var splitted = this.roughSplit(formula);
    if(splitted[0] == formula) {
        if(formula[0] == "(") {
            var matchingPar = formula.lastIndexOf(")");
            return this.multiplyInstuctions(this.parse(formula.substring(1, matchingPar)), this.getCount(formula.substring(matchingPar + 1)));
        } else if(formula[0] == "[") {
            var matchingBracket = formula.lastIndexOf("]");
            return this.combineInstructions(this.parse(formula.substring(1, matchingBracket)), this.getCount(formula.substring(matchingBracket + 1)));
        } else {
            return this.simpleParse(splitted[0]);
        }
    } else {
        return splitted.map(this.parse, this).reduce(function(a, b) {
            return a.concat(b);
        });
    }
};

Rubikjs.Notation.Parser.prototype.simpleParse = function(formula) {
    var splitted = formula.split(this.separator);
    var result = [];
    for(var i = 0; i < splitted.length; ++i) {
        if(splitted[i] != "") {
            result.push(this.parseToken(splitted[i]));
        }
    }
    return result;
};

Rubikjs.Notation.Parser.prototype.roughSplit = function(formula) {
    if(formula == "") {
        return [];
    }

    if(this.handleParenthesis && formula[0] == "(") {
        var matching = this.findMatching(formula, "(", ")");
        var matchingSeparator = formula.indexOf(this.separator, matching);
        if(matchingSeparator != -1) {
            var splitTo = matchingSeparator;
        } else {
            splitTo = formula.length;
        }
        return [formula.substring(0, splitTo)].concat(this.roughSplit(formula.substring(splitTo)));
    }

    if(this.handleCombined && formula[0] == "[") {
        var matching = this.findMatching(formula, "[", "]");
        var matchingSeparator = formula.indexOf(this.separator, matching);
        if(matchingSeparator != -1) {
            var splitTo = matchingSeparator;
        } else {
            splitTo = formula.length;
        }
        return [formula.substring(0, splitTo)].concat(this.roughSplit(formula.substring(splitTo)));
    }

    var splitTo = formula.length;
    if(this.handleParenthesis) {
        var firstPar = formula.indexOf("(");
        if(firstPar != -1 && firstPar < splitTo) {
            splitTo = firstPar;
        }
    }

    if(this.handleCombined) {
        var firstBracket = formula.indexOf("[");
        if(firstBracket != -1 && firstBracket < splitTo) {
            splitTo = firstBracket;
        }
    }

    return [formula.substring(0, splitTo)].concat(this.roughSplit(formula.substring(splitTo)));
}

Rubikjs.Notation.Parser.prototype.findMatching = function(str, open, close) {
    var i = 0;
    var depth = 1;
    while(depth != 0) {
        ++i;
        if(str[i] == open) {
            depth += 1;
        } else if(str[i] == close) {
            depth -= 1;
        }
    }

    return i;
}

Rubikjs.Notation.Parser.prototype.multiplyInstuctions = function(instructions, count) {
    if(count < 0) {
        instructions.reverse();
        for(var i = 0; i < instructions.length; ++i) {
            instructions[i].count = -instructions[i].count;
        }
        count = -count;
    }

    var result = [];
    for(var i = 0; i < count; ++i) {
        result = result.concat(instructions);
    }

    return result;
};

Rubikjs.Notation.Parser.prototype.combineInstructions = function(instructions, count) {
    for(var i = 0; i < instructions.length; ++i) {
        instructions[i].count *= count;
    }
    return new Rubikjs.Notation.MultiMove(instructions);
};

Rubikjs.Notation.Parser.prototype.getCount = function(str) {
    //Special cases
    if(str == "") {
        return 1;
    } else if(str == "'") {
        return -1;
    } else {
        var count = parseInt(str);
        if(str[str.length - 1] == "'") {
            return -count;
        } else {
            return count;
        }
    }
};

Rubikjs.Notation.Parser.prototype.parseToken = function(token) {
    return new Rubikjs.Notation.Instruction;
};

