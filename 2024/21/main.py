import pathlib
from functools import cache
from itertools import permutations

def read():
    with open(pathlib.Path(__file__).parent.absolute() / "input") as f:
        return f.read().splitlines()

def getidx(keypad, btn):
    x = 0
    y = 0
    for c in keypad:
        if btn == c:
            return (x, y)
        if c == "\n":
            x += 1
            y = 0
        else:
            y += 1

KEYA = "789\n456\n123\n.0A"
KEYB = ".^A\n<v>"
IDX_KEYA = {c: getidx(KEYA, c) for c in KEYA if c != "\n"}
IDX_KEYB = {c: getidx(KEYB, c) for c in KEYB if c != "\n"}

def all_movement(btn, btn_, keypad):
    if btn == btn_:
        return [""]

    idx_map = IDX_KEYA if keypad == "A" else IDX_KEYB
    x, y = idx_map[btn]
    x_, y_ = idx_map[btn_]
    dot_pos = idx_map["."]

    # Collect required moves in each dimension
    moves = []
    if y_ - y > 0:  # right
        moves.append(">" * (y_ - y))
    if y - y_ > 0:  # left
        moves.append("<" * (y - y_))
    if x - x_ > 0:  # up
        moves.append("^" * (x - x_))
    if x_ - x > 0:  # down
        moves.append("v" * (x_ - x))

    # Generate all possible orderings of the move groups
    results = []
    for perm in permutations(moves):
        path = "".join(perm)

        # Validate path doesn't hit '.'
        curr_x, curr_y = x, y
        valid = True

        for move in path:
            if move == ">":
                curr_y += 1
            elif move == "<":
                curr_y -= 1
            elif move == "^":
                curr_x -= 1
            else:
                curr_x += 1

            if (curr_x, curr_y) == dot_pos:
                valid = False
                break

        if valid:
            results.append(path)

    return results

def two_stride(s):
    return [s[i - 1 : i + 1] for i in range(1, len(s))]

@cache
def minimum_amount_for_levels(line, levels, use_keypad_A=False):
    if levels == 0:
        return len(line)

    l = 0
    for s in two_stride("A" + line):
        l += min([
            minimum_amount_for_levels(m + "A", levels - 1)
            for m in all_movement(s[0], s[1], "A" if use_keypad_A else "B")
        ])

    return l


def run(levels):
    s = 0
    for line in t:
        s += minimum_amount_for_levels(line, levels + 1, True) * int(line.replace("A", ""))
    print(s)

t = read()
run(2)
run(25)
