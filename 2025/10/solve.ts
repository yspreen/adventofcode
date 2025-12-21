const input = await Bun.file("input").text();
const lines = input
  .trim()
  .split("\n")
  .map((line) => {
    const parts = line.split(" ");
    const targetString = parts[0].slice(1, -1);
    const joltage = parts.pop();
    const buttonStrings = parts.slice(1);
    let mask = 1;
    let target = 0;
    for (const char of targetString) {
      if (char === "#") target += mask;
      mask <<= 1;
    }

    const buttons = buttonStrings.map((b) =>
      b
        .slice(1, -1)
        .split(",")
        .map((v) => 1 << +v)
        .reduce((a, b) => a | b),
    );

    return [target, buttons, joltage] as const;
  });

let answer = 0;
for (const [target, buttons, _] of lines) {
  void _;
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

export {};
