let input = await Bun.file("input").text();
if (0) input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`
let lines = input.trim().split("\n").map(line => line.replace(/\s+/g, ' ').trim().split(' '));

let c = 0
let idx = 0
for (const operator of lines[lines.length - 1]) {
    let s = operator == '*' ? 1 : 0
    for (const line of lines.slice(0, lines.length - 1)) {
        if (operator == '*') {
            s *= +line[idx]
        } else {
            s += +line[idx]
        }
    }
    idx++;
    c += s
}
console.log(c)

lines = input.trimEnd().split("\n").map(line => line.split(''));
let transposed = new Array(lines[0].length).fill(0).map(_ => new Array(lines.length).fill(' '))
for (let i = 0; i < lines.length; i++)
    for (let j = 0; j < lines[0].length; j++) {
        transposed[j][i] = lines[i][j] || ' '
    }

let op = ''
let s = 0
let n = 0
for (const line of transposed) {
    if (line[line.length - 1] == '*') {
        s += n
        op = '*'
        n = 1
    }
    if (line[line.length - 1] == '+') {
        s += n
        op = '+'
        n = 0
    }
    let digits = line.slice(0, line.length - 1).join('').replace(/ /g, '')
    if (!digits) continue;
    let num = +digits
    if (op == '*') {
        n *= num
    } else {
        n += num
    }
}

console.log(s + n)

export { }