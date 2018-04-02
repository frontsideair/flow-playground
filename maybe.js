// @flow

// Maybe
type Nothing = { tag: "nothing" };
type Just<T> = { tag: "just", value: T };
export type Maybe<T> = Nothing | Just<T>;

export function nothing() {
  return { tag: "nothing" };
}

export function just<T>(x: T): Maybe<T> {
  return { tag: "just", value: x };
}

export function match<T, U>(branches: *): (Maybe<T>) => U {
  return function(maybe) {
    switch (maybe.tag) {
      case "nothing":
        return branches.nothing();
      case "just":
        return branches.just(maybe.value);
      default:
        throw new Error((maybe.tag: empty));
    }
  };
}

const maybe = {
  map: function<T, U>(f: T => U): (Maybe<T>) => Maybe<U> {
    return match({
      nothing: nothing,
      just: x => just(f(x))
    });
  },
  eq: function<T>(a: Maybe<T>, b: Maybe<T>): boolean {
    return match({
      nothing: () => match({ nothing: () => true, just: _ => false })(b),
      just: _a =>
        match({
          nothing: () => false,
          just: _b => _a === _b // for primitive T
        })(b)
    })(a);
  }
};

export default maybe;
