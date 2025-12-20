let input = await Bun.file("input").text();
if (0) input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`
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

let changed = true;
while (changed) {
    changed = false

    for (let i = 0; i < ranges.length; i++) {
        const [iLower, iUpper] = ranges[i]
        if (iUpper < iLower) continue;
        let breakOuter = false;
        for (let j = i + 1; j < ranges.length; j++) {
            const [jLower, jUpper] = ranges[j];
            if (jUpper < jLower) continue;
            if (iUpper < jLower) continue; // 1
            if (jUpper < iLower) continue; // 2
            changed = true;
            if (iLower <= jLower && jLower <= iUpper) {
                if (jUpper <= iUpper) {
                    // 6
                    ranges[j][0] = ranges[j][1] + 1;
                    continue;
                }
                // 3
                ranges[j][0] = iUpper + 1;
                continue;
            }
            if (iUpper <= jUpper) {
                // 5
                ranges[i][0] = ranges[i][1] + 1;
                breakOuter = true;
                break;
            }
            // 4
            
            ranges[j][1] = iLower - 1;
            continue;
        }
        if (breakOuter) break
    }
}


c = 0;
for (let i = 0; i < ranges.length; i++) {
    const [iLower, iUpper] = ranges[i]
    if (iUpper < iLower) continue;
    c += iUpper - iLower + 1
}

console.log(c)

export { }


/**

1
iii 
    jjj

2
     iii  
jjj 

3
iii
 jjj

4
 iii
jjj

5
  i
 jjj

6
 iii
  j
 
 */