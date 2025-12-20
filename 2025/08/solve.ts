let input = await Bun.file("input").text();
if (0) input = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`
const lines = input.trim().split("\n").map(line => line.split(',').map(n => +n) as [number, number, number]);

const distances: Record<string, string> = {}
const revDistances: Record<string, [number, number][]> = {}
const allDistances: Set<string> = new Set()
const idToNetwork: Record<number, number> = {}
const networkToIds: Record<number, Set<number>> = {}

for (let i = 0; i < lines.length; i++) {
    const [ax, ay, az] = lines[i];

    idToNetwork[i] = i;
    networkToIds[i] = new Set([i]);
    
    for (let j = i + 1; j < lines.length; j++) {
        const [bx, by, bz] = lines[j];
        const dist = Math.sqrt(
            Math.pow(ax - bx, 2) +
            Math.pow(ay - by, 2) +
            Math.pow(az - bz, 2) 
        ).toString()
        distances[`${i}.${j}`] = dist
        distances[`${j}.${i}`] = dist
        revDistances[dist] = revDistances[dist] ?? []
        revDistances[dist]?.push([i, j])
        allDistances.add(dist)
    }
}

const allDistancesSorted = Array.from(allDistances).toSorted((a, b) => +b - +a)

let stepsMade = 0
const N = 1000
while (stepsMade < N) {
    const dist = allDistancesSorted.pop()!
    for (const [i, j] of revDistances[dist]) {
        if (stepsMade++ === N) break
        if (idToNetwork[i] === idToNetwork[j]) {
            continue;
        }
        const toBeDeleted = idToNetwork[j]
        const newId = idToNetwork[i]
        for (const member of networkToIds[toBeDeleted]) {
            networkToIds[newId].add(member)
            idToNetwork[member] = newId
        }
        delete networkToIds[toBeDeleted]
    }
}

const sizes = Object.values(networkToIds).map(v => v.size)
sizes.sort((a, b) => +a - +b)

console.log(sizes.pop()! * sizes.pop()! * sizes.pop()!)


export { }