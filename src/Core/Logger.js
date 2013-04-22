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

Rubikjs.Core.Logger = function() {
};

Rubikjs.Core.Logger.levels = {
    info: 0,
    warn: 1,
    error: 2
};

Rubikjs.Core.Logger.listeners = [];

Rubikjs.Core.Logger.addListener = function(callback, minLevel, maxLevel) {
    this.listeners.push({
        callback: callback,
        minLevel: this.levels[minLevel],
        maxLevel: this.levels[maxLevel]
    });
};

Rubikjs.Core.Logger.log = function(who, text, level) {
    var rawLevel = this.levels[level];
    this.listeners.forEach(function(l) {
        if(l.minLevel <= rawLevel && l.maxLevel >= rawLevel) {
            l.callback(who, text, level);
        }
    });
};

