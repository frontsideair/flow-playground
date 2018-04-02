// @flow

import { k } from "./combinators";

type Left<T> = { tag: "left", value: T };
type Right<U> = { tag: "right", value: U };
type Either<T, U> = Left<T> | Right<U>;

export function left<T, U>(value: T): Either<T, U> {
  return { tag: "left", value };
}

export function right<T, U>(value: U): Either<T, U> {
  return { tag: "right", value };
}

type Branches<T, U, V> = {
  left: T => V,
  right: U => V
};

export function match<T, U, V>(
  branches: Branches<T, U, V>
): (Either<T, U>) => V {
  return function(either) {
    switch (either.tag) {
      case "left":
        return branches.left(either.value);
      case "right":
        return branches.right(either.value);
      default:
        throw new Error((either.tag: empty));
    }
  };
}

const either = {
  map: function<T, U, V>(f: T => U): (Either<T, V>) => Either<U, V> {
    return match({
      left: x => left(f(x)),
      right: right
    });
  },
  eq: function<T, U>(a: Either<T, U>, b: Either<T, U>): boolean {
    return match({
      left: _a => match({ left: _b => _a === _b, right: k(false) })(b), // if T is primitive
      right: _a => match({ left: k(false), right: _b => _a === _b })(b) // if T is primitive
    })(a);
  }
};

export default either;
