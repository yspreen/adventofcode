let input = await Bun.file("input").text();
if (0) input = `3-5
10-14
16-20
12-18

1`
const [ranges_, ids] = input.trim().split("\n\n").map(block => block.split("\n"));

const ranges = ranges_.map(line => line.split('-').map(n => +n) as [number, number])

let c = 0;
for (const id of ids.map(id => +id)) {
    for (const [lower, upper] of ranges) {
        if (lower <= id && id <= upper) {
            c += 1
            break
        }
    }
}

console.log(c)

c = 0;
for (let i = 0; i < ranges.length; i++) {
    const [iLower, iUpper] = ranges[i]
    c += iUpper - iLower + 1
    for (let j = i + 1; j < ranges.length; j++) {
        const [jLower, jUpper] = ranges[j];
        const lower = Math.max(iLower, jLower);
        const upper = Math.min(iUpper, jUpper);
        if (lower <= upper) c -= (upper - lower + 1)
    }
}

console.log(c)

export { }