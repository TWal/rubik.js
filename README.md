Rubik.js
========

Rubik.js is a javascript library to render and simulate twisty puzzles (commonly know as Rubik's Cube).

Renderers
---------

Rubik.js only support WebGL and Canvas for the moment (see todo-list for more).

Puzzle support
--------------

I would like rubik.js to support almost all twisty puzzle, like Rubik's Cube, Rubik's Revenge, V-Cube-7, Skweb, Megaminx, Square-One, and so on. I won't support helicopter and gear puzzles, to begin, because they seem to hard to implement.

Wanted features
---------------

* Support of almost any twisty puzzle
* WebGL, Canvas, and SVG support
* Mouse control (camera rotation and puzzle turning)
* User-defined sticker color (=> grey sticker)
* An ergonomic user interface
* An optional rear view

How to use pack.sh
------------------

Do `./pack.sh` to create one file per module, in the release directory, with "use strict";
Do `./pack.sh --release` to do the same thing as `./pack.sh`, and minify the source code with closure.
