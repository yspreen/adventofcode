let input = await Bun.file("input").text();
if (0) input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`
const lines = input.trim().split("\n").map(l => l.split(",").map(v => +v) as [number, number]);

let max = 0
for (let i = 0; i < lines.length; i++) {
    const [ax, ay] = lines[i];

    for (let j = i + 1; j < lines.length; j++) {
        const [bx, by] = lines[j];
        
        max = Math.max(max, (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1))
    }
}

console.log(max)

let pairs: [number, number, number, number][] = []
let prev = lines[lines.length - 1]

for (let i = 0; i < lines.length; i++) {
    const [ax, ay] = prev;
    const [bx, by] = lines[i];

    pairs.push([ax, ay, bx, by])

    prev = lines[i]
}

max = 0
for (let i = 0; i < lines.length; i++) {
    const [ax, ay] = lines[i];

    for (let j = i + 1; j < lines.length; j++) {
        const [bx, by] = lines[j];

        const lowerX = Math.min(ax, bx)
        const lowerY = Math.min(ay, by)
        const upperX = Math.max(ax, bx)
        const upperY = Math.max(ay, by)

        let found = false
        for (let k = 0; k < pairs.length; k++) {
            const [_ax, _ay, _bx, _by] = pairs[k];
            if (_ax == ax && _ay == ay) continue;
            if (_bx == ax && _by == ay) continue;
            if (_ax == bx && _ay == by) continue;
            if (_bx == bx && _by == by) continue;

            if (lowerX < _ax && _ax < upperX && lowerY < _ay && _ay < upperY) {
                found = true
                break
            }
            if (lowerX < _bx && _bx < upperX && lowerY < _by && _by < upperY) {
                found = true
                break
            }
            if (_ax === _bx) {
                // | v
                let pairLowerY = Math.min(_ay, _by)
                let pairUpperY = Math.max(_ay, _by)
                if (lowerX < _ax && _ax < upperX && pairLowerY <= lowerY && pairUpperY >= upperY) {
                    found = true
                    break
                }
            } else {
                // - h
                let pairLowerX = Math.min(_ax, _bx)
                let pairUpperX = Math.max(_ax, _bx)
                if (lowerY < _ay && _ay < upperY && pairLowerX <= lowerX && pairUpperX >= upperX) {
                    found = true
                    break
                }
            }
        }
        if (found) {
            continue
        }
        
        
        max = Math.max(max, (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1))
    }
}

console.log(max)


export { }