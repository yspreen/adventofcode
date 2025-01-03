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


def read():
    with open(DIR / "input") as f:
        s = (f.read() if teststr == "" else teststr).splitlines()
    return lmap(lambda r: lmap(str, r.split(" ")), s)


move_to_score = {
    "X": 1,
    "Y": 2,
    "Z": 3,
}
turn_to_win = {
    "AX": 3,
    "AY": 6,
    "AZ": 0,
    "BX": 0,
    "BY": 3,
    "BZ": 6,
    "CX": 6,
    "CY": 0,
    "CZ": 3,
}
outcome_to_turn = {
    "AX": "Z",
    "AY": "X",
    "AZ": "Y",
    "BX": "X",
    "BY": "Y",
    "BZ": "Z",
    "CX": "Y",
    "CY": "Z",
    "CZ": "X",
}


def easy():
    s = 0
    for theirs, mine in t:
        s += move_to_score[mine]
        s += turn_to_win[theirs + mine]
    print(s)


def hard():
    s = 0
    for theirs, outcome in t:
        mine = outcome_to_turn[theirs + outcome]
        s += move_to_score[mine]
        s += turn_to_win[theirs + mine]
    print(s)


teststr = """"""
DIR = pathlib.Path(__file__).parent.absolute()
lmap = lambda *a: list(map(*a))
inf = float("inf")
t = read()
if __name__ == "__main__":
    easy()
    hard()
