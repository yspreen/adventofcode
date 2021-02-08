import numpy as np
import re
import pathlib
import json
from functools import reduce
from string import ascii_lowercase
from math import prod, gcd
from itertools import permutations, product
from multiprocessing import Pool
from sympy import simplify, symbols, solve


def read():
    with open(DIR / "input.txt") as f:
        t = f.read().splitlines()[0]
    return Segment(t[1:-1])


class Segment:
    def __init__(self, s):
        self.choices = []
        self.children = []
        self.s = s
        segments = [-1]
        splits = [-1]
        brace_num = 0
        for i, e in enumerate(s):
            if e == "(":
                brace_num += 1
                if brace_num == 1:
                    segments.append(i)
            if e == ")":
                brace_num -= 1
                if brace_num == 0:
                    segments.append(i)
            if e == "|" and brace_num == 0:
                splits.append(i)
        segments.append(len(s))
        splits.append(len(s))

        if len(splits) > 2:
            for i in range(1, len(splits)):
                a, b = splits[i - 1], splits[i]
                self.choices.append(Segment(s[a + 1 : b]))
        elif len(segments) > 2:
            for i in range(1, len(segments)):
                a, b = segments[i - 1], segments[i]
                if b - a < 2:
                    continue
                self.children.append(Segment(s[a + 1 : b]))

    def print(self, prefix=[]):
        print(*prefix, self.s)
        for i in self.children:
            i.print(prefix + [">"])
        for i in self.choices:
            i.print(prefix + ["|"])


def easy():
    return


def hard():
    return


DIR = pathlib.Path(__file__).parent.absolute()
inf = float("inf")
t = read()
# t.print()

if __name__ == "__main__":
    easy()
    hard()