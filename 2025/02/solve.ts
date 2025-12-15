const input = await Bun.file("input").text();
const ranges = input.trim().split(",");

let invalid = 0;
for (const range of ranges) {
    const [lhs, rhs] = range.split("-").map(v => +v);
    for (let i = lhs; i <= rhs; i++) {
        const s = `${i}`;
        if (s.length % 2) continue;
        if (s.slice(0, s.length / 2) !== s.slice(s.length / 2)) continue;
        invalid += i
    }
}

console.log(invalid)

invalid = 0;
for (const range of ranges) {
    const [lhs, rhs] = range.split("-").map(v => +v);
    for (let i = lhs; i <= rhs; i++) {
        const s = `${i}`;
        for (let l = 1; l <= s.length / 2; l++) {
            if (s.length % l) continue;
            let foundWrong = false;
            for (let j = l; j < s.length; j += l) {
                if (s.slice(0, l) !== s.slice(j, j + l)) {
                    foundWrong = true
                    break
                }
            }
            if (foundWrong) continue;
            invalid += i
            break;
        }
    }
}

console.log(invalid)

export { }