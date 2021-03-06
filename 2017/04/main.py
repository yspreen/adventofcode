import numpy as np
import re
import pathlib
import json
from functools import reduce
from string import ascii_lowercase
from math import prod, gcd, sqrt
from itertools import permutations, product


def lmap(*a):
    return list(map(*a))


def read():
    with open(DIR / "input") as f:
        t = lmap(lambda r: r.split(" "), f.read().splitlines())
    return t


def easy():
    c = 0
    for r in t:
        c += 1
        s = set()
        for w in r:
            if w in s:
                c -= 1
                break
            s.add(w)
    print(c)


def vect(w):
    v = [0] * len(ascii_lowercase)
    for c in w:
        v[ascii_lowercase.index(c)] += 1
    return tuple(v)


def hard():
    c = 0
    for r in t:
        c += 1
        s = set()
        for w in r:
            w = vect(w)
            if w in s:
                c -= 1
                break
            s.add(w)
    print(c)


DIR = pathlib.Path(__file__).parent.absolute()
inf = float("inf")
t = read()
if __name__ == "__main__":
    easy()
    hard()