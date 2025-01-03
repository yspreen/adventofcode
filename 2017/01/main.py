import pathlib


def read():
    with open(DIR / "input") as f:
        t = list(map(int, f.read().splitlines()[0]))
    return t


def easy():
    s, last = 0, 0
    for i in t + [t[0]]:
        s += i if i == last else 0
        last = i
    print(s)


def hard():
    t_, s = t + t, 0
    for i, n in enumerate(t):
        s += n if t_[i + len(t) // 2] == n else 0
    print(s)


DIR = pathlib.Path(__file__).parent.absolute()
t = read()
if __name__ == "__main__":
    easy()
    hard()
