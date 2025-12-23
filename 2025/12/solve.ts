import { readFile } from "fs/promises";

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

  const blockCounts: number[] = [];
  for (const piece of chunks) {
    blockCounts.push(0);
    for (const c of piece.replace(/\n/g, "").split(":")[1]) {
      if (c === "#") blockCounts[blockCounts.length - 1]++;
    }
  }

  let a = 0;
  for (const gridString of grids.trim().split("\n")) {
    const dimsString = gridString.split(":")[0];
    const counts = gridString
      .split(" ")
      .slice(1)
      .map((v) => +v);
    const dims = dimsString.split("x").map((v) => +v) as [number, number];

    const gridSize = dims[0] * dims[1];
    const blockTotal = counts
      .map((c, i) => c * blockCounts[i])
      .reduce((a, b) => a + b);
    a += blockTotal <= gridSize ? 1 : 0;
  }
  console.log(a);
}

main().catch(console.error);
