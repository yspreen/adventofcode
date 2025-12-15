const input = await Bun.file("input").text();
const lines = input.trim().split("\n");

let i = 50
let zeros = 0
let zerosTwo = 0
let before = i
for (const line of lines) {
    if (line.slice(0, 1) === 'L') {
        i -= +line.slice(1)
    } else {
        i += +line.slice(1)
    }
    while (i < 0) { i += 100 }
    i %= 100
    if (i == 0) zeros += 1;

    if (line.slice(0, 1) === 'L') {
        if (i > before) zerosTwo++
    } else {
        if (i < before) zerosTwo++
    }
    zerosTwo += ~~((+line.slice(1)) / 100)
    before = i;
}

console.log(zeros)
console.log(zerosTwo)

export { }