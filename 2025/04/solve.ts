let input = await Bun.file("input").text();
if (0) input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`
const lines = input.trim().split("\n").map(l => l.split(""));

const moves = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
] as const

let answer = 0;
for (let x = 0; x < lines.length; x++)
    for (let y = 0; y < lines[0].length; y++) {
        if (lines[x][y] !== '@') continue;
        let c = 0;
        for (const m of moves) {
            const [mx, my] = m;
            const nx = x + mx;
            const ny = y + my;
            if (nx < 0) continue;
            if (ny < 0) continue;
            if (nx >= lines.length) continue;
            if (ny >= lines[0].length) continue;
            if (lines[nx][ny] !== '@') continue;
            c += 1
            if (c === 4) break;
        }
        if (c < 4) {
            answer++;
        }
    }

console.log(answer)

answer = 0;
let changes = true;
while (changes) {
    changes = false

    for (let x = 0; x < lines.length; x++)
        for (let y = 0; y < lines[0].length; y++) {
            if (lines[x][y] !== '@') continue;
            let c = 0;
            for (const m of moves) {
                const [mx, my] = m;
                const nx = x + mx;
                const ny = y + my;
                if (nx < 0) continue;
                if (ny < 0) continue;
                if (nx >= lines.length) continue;
                if (ny >= lines[0].length) continue;
                if (lines[nx][ny] !== '@') continue;
                c += 1
                if (c === 4) break;
            }
            if (c < 4) {
                answer++;
                lines[x][y] = '.'
                changes = true
            }
        }
}

console.log(answer)

export { }