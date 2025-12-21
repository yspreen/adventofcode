import GLPK from "glpk.js";

const glpk = GLPK();

let input = await Bun.file("input").text();
if (0)
  input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;
const lines = input
  .trim()
  .split("\n")
  .map((line) => {
    const parts = line.split(" ");
    const targetString = parts[0].slice(1, -1);
    const joltage = parts
      .pop()!
      .slice(1, -1)
      .split(",")
      .map((v) => +v);
    const buttonStrings = parts.slice(1).map((b) =>
      b
        .slice(1, -1)
        .split(",")
        .map((v) => +v),
    );
    let mask = 1;
    let target = 0;
    for (const char of targetString) {
      if (char === "#") target += mask;
      mask <<= 1;
    }

    const buttons = buttonStrings.map((b) =>
      b.map((v) => 1 << v).reduce((a, b) => a | b),
    );

    return { target, buttons, joltage, buttonStrings } as const;
  });

let answer = 0;
for (const { target, buttons } of lines) {
  let states = new Set<number>([0]);
  let pressed = 0;
  while (!states.has(target)) {
    pressed += 1;
    const oldStates = states;
    states = new Set();
    for (const s of oldStates) {
      for (const b of buttons) {
        states.add(s ^ b);
      }
    }
  }
  answer += pressed;
}

console.log(answer);

answer = 0;

for (const { joltage, buttonStrings: buttons } of lines) {
  const lp = {
    name: "lp",
    objective: {
      direction: glpk.GLP_MIN,
      name: "obj",
      vars: buttons.map((_, i) => ({ name: `v${i}`, coef: 1 })),
    },
    subjectTo: joltage.map((j, i) => ({
      name: `c${i}`,
      vars: buttons.map((b, bi) => ({
        name: `v${bi}`,
        coef: b.includes(i) ? 1 : 0,
      })),
      bnds: { type: glpk.GLP_FX, lb: j, ub: j },
    })),
    bounds: buttons.map((_, i) => ({
      name: `v${i}`,
      type: glpk.GLP_LO,
      lb: 0,
      ub: Infinity,
    })),
    generals: buttons.map((_, i) => `v${i}`),
  };

  const res = glpk.solve(lp, { msglev: glpk.GLP_MSG_OFF });

  answer += res.result.z;
}

console.log(answer);
