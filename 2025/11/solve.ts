let input = await Bun.file("input").text();
if (0) input = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`
const lines = input.trim().split("\n");

let map: Record<string, Set<string>> = {}

for (const line of lines) {
    const head = line.split(":")[0]!
    const tail = line.split(" ").slice(1)
    map[head] = new Set(tail)
}

let answer = 0
let heads: Record<string, number> = { 'you': 1 }

while (Object.keys(heads).length) {
    let newHeads: typeof heads = {}

    for (const head of Object.keys(heads)) {
        const count = heads[head]

        for (const out of map[head]) {
            if (out === 'out') {
                answer += count
                continue
            }
            newHeads[out] = newHeads[out] ?? 0
            newHeads[out] += count
        }
    }

    heads = newHeads
}

console.log(answer)
answer = 0
let headers: Record<string, number> = { 'svr.f.f': 1 }

while (Object.keys(headers).length) {
    let newHeads: typeof headers = {}

    for (const fullHead of Object.keys(headers)) {
        const [head, v1, v2] = fullHead.split('.')
        const count = headers[fullHead]

        for (const out of (map[head] ?? new Set())) {
            if (out === 'out' && v1 === 't' && v2 === 't') {
                answer += count
                continue
            }
            const newHead = `${out}.${out === 'dac' ? 't' : v1}.${out === 'fft' ? 't' : v2}`
            newHeads[newHead] = newHeads[newHead] ?? 0
            newHeads[newHead] += count
        }
    }

    headers = newHeads
}

console.log(answer)

export { }