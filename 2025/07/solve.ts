let input = await Bun.file("input").text();
if (0) {
    input = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`
}
const lines = input.trim().split("\n");

let heads = [lines[0].search('S')] as number[]
let idx = 1

let splits = 0
while (idx < lines.length) {
    const line = lines[idx++]
    let newHeads: number[] = []
    for (const h of heads) {
        if (line[h] === '^') {
            newHeads.push(h - 1)
            newHeads.push(h + 1)
            splits += 1
        } else {
            newHeads.push(h)
        }
    }
    heads = Array.from(new Set(newHeads))
}

console.log(splits)

let headCounts = { [lines[0].search('S')]: 1} as Record<number, number>
idx = 1
while (idx < lines.length) {
    const line = lines[idx++]
    let newHeads: Record<number, number> = {}
    for (const h_ of Object.keys(headCounts)) {
        const h = +h_
        if (line[h] === '^') {
            newHeads[h - 1] = newHeads[h - 1] ?? 0
            newHeads[h - 1] += headCounts[h]
            newHeads[h + 1] = newHeads[h + 1] ?? 0
            newHeads[h + 1] += headCounts[h]
        } else {
            newHeads[h] = newHeads[h] ?? 0
            newHeads[h] += headCounts[h]
        }
    }
    headCounts = newHeads
}

console.log(Object.keys(headCounts).map(k => headCounts[+k]).reduce((lhs, rhs) => lhs + rhs))


export { }