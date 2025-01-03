import pathlib
from functools import reduce

DIR = pathlib.Path(__file__).parent.absolute()


def read():
    with open(DIR / "input") as f:
        t = f.read().replace("\r", "").split("\n")
    return " " + "\n ".join(t), [
        [l.split(" (")[0].split(" "), l.split(" (")[1][9:-1].split(", ")]
        for l in t[:-1]
    ]


s, t = read()

allergens = set()
could_contain = foods = set()


def easy():
    global allergens, foods, could_contain
    for food, a in t:
        allergens |= set(a)
        foods |= set(food)
    could_contain = {a: set(foods) for a in allergens}
    for food, a in t:
        for allergen in a:
            could_contain[allergen] &= set(food)
    changed = True
    filtered = set()
    while changed:
        changed = False
        for k, v in could_contain.items():
            if k in filtered or len(v) != 1:
                continue
            changed = True
            filtered.add(k)
            for l in set(could_contain.keys()) - set([k]):
                could_contain[l] -= v
            break
    contains_none = reduce(lambda a, b: a - b[1], could_contain.items(), set(foods))
    counter = reduce(lambda a, b: a + s.count(" " + b + " "), contains_none, 0)
    print(counter)


def hard():
    food = list([(list(v)[0], k) for k, v in could_contain.items()])
    food.sort(key=lambda i: i[1])
    print(",".join([t[0] for t in food]))


if __name__ == "__main__":
    easy()
    hard()
