import { readFile } from "fs/promises";

function hasNan(grid: number[][]) {
  for (const row of grid)
    for (const el of row) if (Number.isNaN(el)) return true;
  return false;
}

async function main() {
  let input = await readFile("input", "utf-8");
  if (1)
    input = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 3 0`;
  /*

12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
3x3: 0 0 0 0 1 0
4x4: 0 0 0 0 2 0
*/
  const chunks = input.trim().split("\n\n");

  const grids = chunks.pop()!;

  type Piece = number[][];
  function rotate(piece: Piece) {
    const zeros = piece.map((row) => row.map((_) => 0));
    piece.forEach((row, i) => {
      row.forEach((elem, j) => {
        zeros[j][piece.length - i - 1] = elem;
      });
    });
    return zeros;
  }
  function flip(piece: Piece) {
    const zeros = piece[0].map(() => piece.map((_) => 0));
    piece.forEach((row, i) => {
      row.forEach((elem, j) => {
        zeros[j][i] = elem;
      });
    });
    return rotate(zeros);
  }

  // 1 2 3
  // 4 5 6
  // 7 8 9

  // 7 4 1
  // 8 5 2
  // 9 6 3

  const pieceOrientations: Piece[][] = [];

  function contains(pieces: Piece[], piece: Piece) {
    const hashes = pieces.map((p) => p.join("."));
    return hashes.includes(piece.join("."));
  }

  let i = 0;
  for (let piece of chunks) {
    piece = piece.replace(/\n/g, "");
    piece = piece.split(":")[1]!;
    piece = piece.replace(/\#/g, "1");
    piece = piece.replace(/\./g, "0");
    piece = piece.replace(/(...)/g, "$1\n");
    let onePiece = piece
      .trim()
      .split("\n")
      .map((p) => p.split("").map((v) => +v));

    pieceOrientations.push([]);

    for (const _ of "1234") {
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

  function fits(grid: number[][], piece: Piece, x: number, y: number) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (piece[i][j] && grid[x + i][y + j]) return false;
    return true;
  }

  function allZero(numbers: number[]) {
    for (const number of numbers) {
      if (number !== 0) return false;
    }
    return true;
  }

  function place(grid: number[][], piece: Piece, x: number, y: number) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (piece[i][j]) grid[x + i][y + j] += 1;
  }
  function unPlace(grid: number[][], piece: Piece, x: number, y: number) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (piece[i][j]) grid[x + i][y + j] -= 1;
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
  function piecesFit(
    grid: number[][],
    counts: number[],
    x: number,
    y: number,
    emptyChoices = 0,
  ): boolean {
    if (y === 3) {
      debugger;
      console.log(x, y);
    }
    if (emptyChoices === 3) return false;
    if (x === grid.length - 3) return false;
    if (allZero(counts)) return true;

    let nextX = x;
    let nextY = y;
    if (y === grid[0].length - 3) {
      nextX += 1;
      nextY = 0;
    } else nextY += 1;

    for (let i = 0; i < counts.length; i++) {
      const count = counts[i];
      if (count == 0) continue;
      counts[i] -= 1;
      for (const piece of pieceOrientations[i]) {
        if (!fits(grid, piece, x, y)) continue;
        place(grid, piece, x, y);
        if (hasNan(grid)) {
          debugger;
        }
        if (piecesFit(grid, counts, nextX, nextY)) return true;
        unPlace(grid, piece, x, y);
        if (hasNan(grid)) {
          debugger;
        }
      }
      counts[i] += 1;
    }

    return piecesFit(
      grid,
      counts,
      nextX,
      nextY,
      nextY === 0 ? 0 : emptyChoices + 1,
    );
  }

  // const a = 0;

  for (const gridString of grids.trim().split("\n")) {
    console.log(gridString);
    const dimsString = gridString.split(":")[0];
    const counts = gridString
      .split(" ")
      .slice(1)
      .map((v) => +v);
    const dims = dimsString.split("x").map((v) => +v) as [number, number];
    const grid: number[][] = [];
    new Array(dims[1]).fill(0).forEach((_) => {
      grid.push(new Array(dims[0]).fill(0).map((_) => 0));
    });
    console.log(piecesFit(grid, counts, 0, 0));
    console.log(grid.join("\n"));
    //   console.log(rotate(rotate(rotate(flip(grid)))).join("\n"));
  }
}

main().catch(console.error);
export {};
