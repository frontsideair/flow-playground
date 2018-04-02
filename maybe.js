// @flow

import { k } from "./combinators";

type Nothing = { tag: "nothing" };
type Just<T> = { tag: "just", value: T };
export type Maybe<T> = Nothing | Just<T>;

export function nothing() {
  return { tag: "nothing" };
}

export function just<T>(x: T): Maybe<T> {
  return { tag: "just", value: x };
}

type Branches<T, U> = {
  nothing: () => U,
  just: T => U
};

export function match<T, U>(branches: Branches<T, U>): (Maybe<T>) => U {
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
      nothing: () => match({ nothing: () => true, just: k(false) })(b),
      just: _a =>
        match({
          nothing: k(false),
          just: _b => _a === _b // if T is primitive
        })(b)
    })(a);
  }
};

export default maybe;
