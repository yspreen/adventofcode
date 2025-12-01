const input = await Bun.file("input").text();
const lines = input.trim().split("\n");

let position = 50;
let count = 0;

for (const line of lines) {
  const direction = line[0];
  const distance = parseInt(line.slice(1));

  if (direction === "L") {
    // Going left: we hit 0 at clicks P, P+100, P+200, ... (if P > 0)
    // Or at clicks 100, 200, 300, ... (if P = 0)
    if (position === 0) {
      count += Math.floor(distance / 100);
    } else if (distance >= position) {
      count += Math.floor((distance - position) / 100) + 1;
    }
    position = ((position - distance) % 100 + 100) % 100;
  } else {
    // Going right: we hit 0 at clicks (100-P), (200-P), ... (if P > 0)
    // Or at clicks 100, 200, 300, ... (if P = 0)
    if (position === 0) {
      count += Math.floor(distance / 100);
    } else if (distance >= 100 - position) {
      count += Math.floor((distance + position - 100) / 100) + 1;
    }
    position = (position + distance) % 100;
  }
}

console.log(count);
