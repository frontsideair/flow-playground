// @flow

// HKT helper type
type HKT<F, T> = $Call<F, T>;
// F: (* => *) => T: * => F<T>: *

// TODO: constructors and destructors (case expressions), class/instanceof?
// TODO: not passing dicts, use classes/prototypes/`with` keyword?
// TODO: exhaustiveness (cata?)
// TODO: Eq<T> ???

// Maybe
type Maybe<T> = "Nothing" | { value: T };
// type Maybe<T> = null | T; // unboxed

const maybe = {
  nothing: function() {
    return "Nothing";
  },
  pure: function<T>(x: T): Maybe<T> {
    return { value: x };
  },
  map: function<T, U>(f: T => U): (Maybe<T>) => Maybe<U> {
    return x => {
      if (x === "Nothing") {
        return "Nothing";
      } else {
        return maybe.pure(f(x.value));
      }
    };
  },
  eq: function<T>(a: Maybe<T>, b: Maybe<T>): boolean {
    if (a === "Nothing" && b === "Nothing") {
      return true;
    } else if (a !== "Nothing" && b !== "Nothing") {
      // if primitive (===), else (.eq)
      return a.value === b.value; // assume primitive
    } else {
      return false;
    }
  }
};

// Functor
// interface Functor<F, T, U> { map: ((T) => U) => (HKT<F, T>) => HKT<F, U> } // F<T> => F<U>
type Functor<F, T, U> = { map: ((T) => U) => (HKT<F, T>) => HKT<F, U> };

const functor = {
  map: function<F, T, U>(
    dict: Functor<F, T, U>,
    f: T => U
  ): (HKT<F, T>) => HKT<F, U> {
    return dict.map(f);
  }
};

// Either
type Either<T, U> = { tag: "left", value: T } | { tag: "right", value: U };
// type Either<T, U> = T | U // unboxed

const either = {
  pure: function<T, U>(x: T): Either<T, U> {
    return { tag: "left", value: x };
  },
  map: function<T, U, V>(f: T => U): (Either<T, V>) => Either<U, V> {
    return x => {
      if (x.tag === "left") {
        return either.pure(f(x.value));
      } else {
        return x;
      }
    };
  }
};

// Eq
interface Eq<F, T> { eq: (HKT<F, T>, HKT<F, T>) => boolean }
// type Eq<F, T> = { eq: (HKT<F, T>, HKT<F, T>) => boolean };

const eq = {
  eq: function<F, T>(dict: Eq<F, T>, a: HKT<F, T>, b: HKT<F, T>) {
    return dict.eq(a, b);
  }
};

function timesTwo(x: number): number {
  return x * 2;
}

// List
type List<T> = { head: T, tail: List<T> } | null;

const list = {
  pure: function<T>(x: T): List<T> {
    return { head: x, tail: list.empty };
  },
  cons: function<T>(head: T, tail: List<T>): List<T> {
    return { head, tail };
  },
  empty: null,
  map: function<T, U>(f: T => U): (List<T>) => List<U> {
    return x => {
      if (x === null) {
        return null;
      } else {
        return { head: f(x.head), tail: list.map(f)(x.tail) };
      }
    };
  },
  eq: function<T>(a: List<T>, b: List<T>): boolean {
    if (a === null && b === null) {
      return true;
    } else if (a !== null && b !== null) {
      return a.head === b.head && list.eq(a.tail, b.tail);
    } else {
      return false;
    }
  }
};

console.log(functor.map(maybe, timesTwo)(maybe.pure(3)));
console.log(functor.map(maybe, timesTwo)(maybe.nothing()));
console.log(functor.map(either, timesTwo)(either.pure(3)));
console.log(eq.eq(maybe, maybe.pure(3), maybe.pure(4)));
console.log(maybe.eq(maybe.pure(3), maybe.pure(3)));
// console.log(eq.eq(pure())
