import { readFile } from "fs/promises";

const pieceOrientations: Piece[][] = [];

type Piece = number[][];

function getEmptyRegions(grid: number[][]): number[][][] {
  const h = grid.length;
  const w = grid[0].length;
  const seen = Array.from({ length: h }, () =>
    Array(w)
      .fill(0)
      .map(() => false),
  );
  const regions: number[][][] = [];

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let x = 0; x < h; x++) {
    for (let y = 0; y < w; y++) {
      if (grid[x][y] !== 0 || seen[x][y]) continue;

      const region: number[][] = [];
      const stack = [[x, y]];
      seen[x][y] = true;

      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        region.push([cx, cy]);

        for (const [dx, dy] of dirs) {
          const nx = cx + dx,
            ny = cy + dy;
          if (
            nx >= 0 &&
            nx < h &&
            ny >= 0 &&
            ny < w &&
            !seen[nx][ny] &&
            grid[nx][ny] === 0
          ) {
            seen[nx][ny] = true;
            stack.push([nx, ny]);
          }
        }
      }

      regions.push(region);
    }
  }

  return regions;
}

function regionIsFillable(
  grid: number[][],
  region: number[][],
  counts: number[],
): boolean {
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] === 0) continue;

    for (const piece of pieceOrientations[i]) {
      for (const [x, y] of region) {
        if (fits(grid, piece, x, y)) {
          return true;
        }
      }
    }
  }
  return false;
}

function allRegionsFeasible(grid: number[][], counts: number[]): boolean {
  const regions = getEmptyRegions(grid);
  for (const region of regions) {
    if (!regionIsFillable(grid, region, counts)) {
      return false;
    }
  }
  return true;
}

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

function contains(pieces: Piece[], piece: Piece) {
  const hashes = pieces.map((p) => p.join("."));
  return hashes.includes(piece.join("."));
}

function fits(grid: number[][], piece: Piece, x: number, y: number) {
  if (x >= grid.length - 2) return false;
  if (y >= grid[0].length - 2) return false;
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
  if (x === grid.length - 2) return false;
  if (allZero(counts)) return true;

  let nextX = x;
  let nextY = y + 1;
  if (nextY === grid[0].length - 2) {
    nextX += 1;
    nextY = 0;
  }

  for (let i = 0; i < counts.length; i++) {
    const count = counts[i];
    if (count == 0) continue;
    counts[i] -= 1;
    for (const piece of pieceOrientations[i]) {
      if (!fits(grid, piece, x, y)) continue;
      place(grid, piece, x, y);
      if (
        allRegionsFeasible(grid, counts) &&
        piecesFit(grid, counts, nextX, nextY)
      )
        return true;
      unPlace(grid, piece, x, y);
    }
    counts[i] += 1;
  }

  if (!allRegionsFeasible(grid, counts)) return false;

  return piecesFit(
    grid,
    counts,
    nextX,
    nextY,
    nextY === 0 ? 0 : emptyChoices + 1,
  );
}

async function main() {
  let input = await readFile("input", "utf-8");
  if (0)
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

3x3: 0 0 0 0 1 0
4x4: 0 0 0 0 2 0
4x4: 0 0 0 0 3 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;
  /*

*/
  const chunks = input.trim().split("\n\n");

  const grids = chunks.pop()!;

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
