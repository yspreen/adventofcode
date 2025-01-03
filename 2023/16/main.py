import numpy as np
import re
import pathlib
import json
from functools import reduce
from string import ascii_lowercase
from math import prod, gcd, sqrt
from itertools import permutations, product
from llist import dllist as llist
from copy import deepcopy
from hashlib import md5, sha256
from os import environ


def read():
    with open(DIR / "input") as f:
        s = (f.read() if teststr == "" else teststr).splitlines()
    return lmap(lambda r: lmap(str, r), s)


def maybeint(line):
    try:
        return int(line)
    except:
        return line


mv = {
    "U": (-1, 0),
    "D": (1, 0),
    "L": (0, -1),
    "R": (0, 1),
}


class Head:
    def __init__(self, pos, dir, history=None):
        self.pos = pos
        self.dir = dir
        self.history = set() if history is None else history

    def step(self):
        pos = (self.pos[0] + mv[self.dir][0], self.pos[1] + mv[self.dir][1])
        state = (pos, self.dir)
        if state in self.history:
            return []
        if pos[0] < 0:
            return []
        if pos[1] < 0:
            return []
        try:
            c = t[pos[0]][pos[1]]
        except Exception:
            return []
        self.pos = pos
        self.history.add(state)
        dirs = [self.dir]
        if c == "/":
            if self.dir == "D":
                dirs = ["L"]
            if self.dir == "U":
                dirs = ["R"]
            if self.dir == "L":
                dirs = ["D"]
            if self.dir == "R":
                dirs = ["U"]
        if c == "\\":
            if self.dir == "D":
                dirs = ["R"]
            if self.dir == "U":
                dirs = ["L"]
            if self.dir == "L":
                dirs = ["U"]
            if self.dir == "R":
                dirs = ["D"]
        if c == "|":
            if self.dir == "L" or self.dir == "R":
                dirs = ["U", "D"]
        if c == "-":
            if self.dir == "U" or self.dir == "D":
                dirs = ["L", "R"]
        return [Head(self.pos, d, self.history) for d in dirs]


def count(x, y, d):
    heads = [Head((x, y), d)]
    visited = set()

    for h in heads:
        heads.extend(h.step())
        visited.add(h.pos)
    return len(visited)


def easy():
    print(count(0, -1, "R"))


def hard():
    c = 0
    for i in range(len(t)):
        c = max(c, count(i, -1, "R"))
    for i in range(len(t)):
        c = max(c, count(i, len(t), "L"))
    for i in range(len(t[0])):
        c = max(c, count(-1, i, "D"))
    for i in range(len(t[0])):
        c = max(c, count(len(t[0]), i, "U"))
    print(c)


teststr = """.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|...."""
if environ.get("AOC_SOLVE", "") == "1":
    teststr = ""
DIR = pathlib.Path(__file__).parent.absolute()
lmap = lambda *a: list(map(*a))
inf = float("inf")
t = read()
if __name__ == "__main__":
    easy()
    hard()
