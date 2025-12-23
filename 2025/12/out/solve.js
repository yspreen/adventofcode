"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
function hasNan(grid) {
    for (var _i = 0, grid_1 = grid; _i < grid_1.length; _i++) {
        var row = grid_1[_i];
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var el = row_1[_a];
            if (Number.isNaN(el))
                return true;
        }
    }
    return false;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function rotate(piece) {
            var zeros = piece.map(function (row) { return row.map(function (_) { return 0; }); });
            piece.forEach(function (row, i) {
                row.forEach(function (elem, j) {
                    zeros[j][piece.length - i - 1] = elem;
                });
            });
            return zeros;
        }
        function flip(piece) {
            var zeros = piece[0].map(function () { return piece.map(function (_) { return 0; }); });
            piece.forEach(function (row, i) {
                row.forEach(function (elem, j) {
                    zeros[j][i] = elem;
                });
            });
            return rotate(zeros);
        }
        function contains(pieces, piece) {
            var hashes = pieces.map(function (p) { return p.join("."); });
            return hashes.includes(piece.join("."));
        }
        function fits(grid, piece, x, y) {
            for (var i_1 = 0; i_1 < 3; i_1++)
                for (var j = 0; j < 3; j++)
                    if (piece[i_1][j] && grid[x + i_1][y + j])
                        return false;
            return true;
        }
        function allZero(numbers) {
            for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
                var number = numbers_1[_i];
                if (number !== 0)
                    return false;
            }
            return true;
        }
        function place(grid, piece, x, y) {
            for (var i_2 = 0; i_2 < 3; i_2++)
                for (var j = 0; j < 3; j++)
                    if (piece[i_2][j])
                        grid[x + i_2][y + j] += 1;
        }
        function unPlace(grid, piece, x, y) {
            for (var i_3 = 0; i_3 < 3; i_3++)
                for (var j = 0; j < 3; j++)
                    if (piece[i_3][j])
                        grid[x + i_3][y + j] -= 1;
        }
        // function piecesFit(grid: number[][], counts: number[], x: number, y: number) {
        //   console.log(grid.join("\n"));
        //   console.log(counts.join(","));
        //   console.log(x, y);
        //   const result = piecesFit_(grid, counts, x, y);
        //   console.log(result);
        //   console.log();
        //   return result;
        // }
        function piecesFit(grid, counts, x, y, emptyChoices) {
            if (emptyChoices === void 0) { emptyChoices = 0; }
            if (y === 3) {
                debugger;
                console.log(x, y);
            }
            if (emptyChoices === 3)
                return false;
            if (x === grid.length - 3)
                return false;
            if (allZero(counts))
                return true;
            var nextX = x;
            var nextY = y;
            if (y === grid[0].length - 3) {
                nextX += 1;
                nextY = 0;
            }
            else
                nextY += 1;
            for (var i_4 = 0; i_4 < counts.length; i_4++) {
                var count = counts[i_4];
                if (count == 0)
                    continue;
                counts[i_4] -= 1;
                for (var _i = 0, _a = pieceOrientations[i_4]; _i < _a.length; _i++) {
                    var piece = _a[_i];
                    if (!fits(grid, piece, x, y))
                        continue;
                    place(grid, piece, x, y);
                    if (hasNan(grid)) {
                        debugger;
                    }
                    if (piecesFit(grid, counts, nextX, nextY))
                        return true;
                    unPlace(grid, piece, x, y);
                    if (hasNan(grid)) {
                        debugger;
                    }
                }
                counts[i_4] += 1;
            }
            return piecesFit(grid, counts, nextX, nextY, nextY === 0 ? 0 : emptyChoices + 1);
        }
        var input, chunks, grids, pieceOrientations, i, _i, chunks_1, piece, onePiece, _a, _b, _, _loop_1, _c, _d, gridString;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)("input", "utf-8")];
                case 1:
                    input = _e.sent();
                    if (1)
                        input = "0:\n###\n##.\n##.\n\n1:\n###\n##.\n.##\n\n2:\n.##\n###\n##.\n\n3:\n##.\n###\n##.\n\n4:\n###\n#..\n###\n\n5:\n###\n.#.\n###\n\n4x4: 0 0 0 0 3 0";
                    chunks = input.trim().split("\n\n");
                    grids = chunks.pop();
                    pieceOrientations = [];
                    i = 0;
                    for (_i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
                        piece = chunks_1[_i];
                        piece = piece.replace(/\n/g, "");
                        piece = piece.split(":")[1];
                        piece = piece.replace(/\#/g, "1");
                        piece = piece.replace(/\./g, "0");
                        piece = piece.replace(/(...)/g, "$1\n");
                        onePiece = piece
                            .trim()
                            .split("\n")
                            .map(function (p) { return p.split("").map(function (v) { return +v; }); });
                        pieceOrientations.push([]);
                        for (_a = 0, _b = "1234"; _a < _b.length; _a++) {
                            _ = _b[_a];
                            void _;
                            onePiece = rotate(onePiece);
                            if (!contains(pieceOrientations[i], onePiece)) {
                                pieceOrientations[i].push(onePiece);
                            }
                            onePiece = flip(onePiece);
                            if (!contains(pieceOrientations[i], onePiece)) {
                                pieceOrientations[i].push(onePiece);
                            }
                            onePiece = flip(onePiece);
                        }
                        i++;
                    }
                    _loop_1 = function (gridString) {
                        console.log(gridString);
                        var dimsString = gridString.split(":")[0];
                        var counts = gridString
                            .split(" ")
                            .slice(1)
                            .map(function (v) { return +v; });
                        var dims = dimsString.split("x").map(function (v) { return +v; });
                        var grid = [];
                        new Array(dims[1]).fill(0).forEach(function (_) {
                            grid.push(new Array(dims[0]).fill(0).map(function (_) { return 0; }));
                        });
                        console.log(piecesFit(grid, counts, 0, 0));
                        console.log(grid.join("\n"));
                    };
                    // const a = 0;
                    for (_c = 0, _d = grids.trim().split("\n"); _c < _d.length; _c++) {
                        gridString = _d[_c];
                        _loop_1(gridString);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
//# sourceMappingURL=solve.js.map