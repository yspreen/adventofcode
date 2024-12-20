from itertools import product
import copy
import pathlib

input = open(pathlib.Path(__file__).parent / "input").read().splitlines()
chars = {
    ".": 0,  # open
    "|": 1,  # tree
    "#": 2,  # lumber
}


def ha(arr, *_):
    a = "".join(["".join([str(j) for j in i]) for i in arr])
    return a


areas = {}
for i in product("012", repeat=8):
    i = "".join(i)
    trees = i.count("1")
    lumbs = i.count("2")
    i = [int(j) for j in i]
    area = [[0 for _ in range(3)] for _ in range(3)]
    area[0][0] = i[0]
    area[1][0] = i[1]
    area[2][0] = i[2]
    area[0][1] = i[3]
    area[2][1] = i[4]
    area[0][2] = i[5]
    area[1][2] = i[6]
    area[2][2] = i[7]
    for m in [0, 1, 2]:
        area[1][1] = m
        n = m
        if m == 0 and trees >= 3:
            n = 1
        if m == 1 and lumbs >= 3:
            n = 2
        if m == 2 and (lumbs == 0 or trees == 0):
            n = 0
        areas[ha(area)] = n


def unpad_zero(arr):
    del arr[-1]
    del arr[0]
    for i in arr:
        del i[-1]
        del i[0]


def pad_zero(arr):
    for col in arr:
        col.insert(0, 0)
        col.append(0)
    arr.insert(0, [0 for _ in arr[0]])
    arr.append([0 for _ in arr[0]])


cycle = []
start = 0
last_vals = {}


def easy():
    global input, areas, cycle, start, last_vals
    input_ = [[0 for _ in input] for _ in input[0]]
    for y in range(len(input)):
        for x in range(len(input[0])):
            input_[x][y] = chars[input[y][x]]
    input = input_
    len_x = len(input)
    len_y = len(input[0])
    last = 0
    set([])
    for minute in range(800):
        pad_zero(input)
        new_input = copy.deepcopy(input)
        for x in range(len_x):
            for y in range(len_y):
                area = [[0 for _ in range(3)] for _ in range(3)]
                for i in range(3):
                    for j in range(3):
                        area[i][j] = input[x + i][y + j]
                new_input[x + 1][y + 1] = areas[ha(area)]
        unpad_zero(new_input)
        input = new_input
        trees = sum([i.count(1) for i in input])
        lumbs = sum([i.count(2) for i in input])
        prod = trees * lumbs
        # print(minute + 1, trees, lumbs, prod, prod - last)
        if minute == 9:
            print(prod)
        diff = prod - last
        cycle.append(diff)
        last_vals[minute] = prod
        start = minute
        last = prod


def hard():
    global start, last_vals, cycle

    while cycle[-1] in cycle[:-1]:
        cycle = cycle[cycle[:-1].index(cycle[-1]) + 1 :]

    goal = 1000000000

    minute = start - len(cycle) + 1
    goal -= minute
    val = last_vals[minute - 1]
    val += sum(cycle) * (goal // len(cycle))
    goal %= len(cycle)
    i = 0
    while i < goal:
        val += cycle[i]
        i += 1
    print(val)


easy()
hard()
