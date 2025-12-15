let input = await Bun.file("input").text();
const lines = input.trim().split("\n");

let answer = 0;

for (const line of lines) {
    let maxFirst = Math.max(...line.slice(0, line.length - 1).split('').map(v => +v));
    let firstIndex = line.length;
    for (let i = 0; i < firstIndex; i++) {
        if (+line[i] === maxFirst) firstIndex = i
    }
    let maxSecond = Math.max(...line.slice(firstIndex + 1).split('').map(v => +v));
    answer += +`${maxFirst}${maxSecond}`
}

console.log(answer)
answer = 0;

for (const line of lines) {
    let lowerLimit = 0;
    let s = '';
    for (let k = 1; k <= 12; k++) {
        let maxNum = Math.max(...line.slice(lowerLimit, line.length - (12 - k)).split('').map(v => +v));
        let idx = line.length;
        for (let i = lowerLimit; i < idx; i++) {
            if (+line[i] === maxNum) idx = i
        }
        lowerLimit = idx + 1;
        s += `${maxNum}`
    }
    answer += +s;
}

console.log(answer)

export { }