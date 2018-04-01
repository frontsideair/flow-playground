// @flow

// HKT helper type
type HKT<F, T> = $Call<F, T>;
// F: (* => *)
// T: *
// F<T>: *

// TODO: not passing dicts, use classes/prototypes/`with` keyword?
// TODO: exhaustiveness

// Maybe
type Nothing = null;
type Just<T> = { value: T };
type Maybe<T> = Nothing | Just<T>;

const maybe = {
  ana: {
    nothing: function<T>(): Maybe<T> {
      return null;
    },
    just: function<T>(x: T): Maybe<T> {
      return { value: x };
    }
  },
  cata: function<T, U>({
    just,
    nothing
  }: {
    just: T => U,
    nothing: () => U
  }): (Maybe<T>) => U {
    return function(x: Maybe<T>): U {
      if (x === null) {
        return nothing();
      } else {
        return just(x.value);
      }
    };
  },
  map: f => {
    return maybe.cata({ nothing: maybe.ana.nothing, just: f });
  },
  eq: function<T>(a: Maybe<T>, b: Maybe<T>): boolean {
    return maybe.cata({
      nothing: () => maybe.cata({ nothing: () => true, just: _ => false })(b),
      just: _a =>
        maybe.cata({
          nothing: () => false,
          just: _b => _a === _b // for primitive T
        })(b)
    })(a);
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
type Left<T> = { tag: "left", value: T };
type Right<U> = { tag: "right", value: U };
type Either<T, U> = Left<T> | Right<U>;

const either = {
  ana: {
    left: function<T, U>(value: T): Either<T, U> {
      return { tag: "left", value };
    },
    right: function<T, U>(value: U): Either<T, U> {
      return { tag: "right", value };
    }
  },
  cata: function<T, U, V>({
    left,
    right
  }: {
    left: T => V,
    right: U => V
  }): (Either<T, U>) => V {
    return function(x: Either<T, U>): V {
      if (x.tag === "left") {
        return left(x.value);
      } else {
        return right(x.value);
      }
    };
  },
  map: function<T, U, V>(f: T => U): (Either<T, V>) => Either<U, V> {
    return either.cata({
      left: x => either.ana.left(f(x)),
      right: either.ana.right
    });
  },
  eq: function<T, U>(a: Either<T, U>, b: Either<T, U>): boolean {
    return either.cata({
      left: _a => either.cata({ left: _b => _a === _b, right: _ => false })(b),
      right: _a => either.cata({ left: _ => false, right: _b => _a === _b })(b)
    })(a);
  }
};

// Eq
type Eq<T> = { eq: (T, T) => boolean };

const eq = {
  eq: function<T>(dict: Eq<T>, a: T, b: T): boolean {
    return dict.eq(a, b);
  }
};

function timesTwo(x: number): number {
  return x * 2;
}

// List
type Empty = null;
type Cons<T> = { head: T, tail: List<T> };
type List<T> = Empty | Cons<T>;

const list = {
  ana: {
    empty: function<T>(): List<T> {
      return null;
    },
    cons: function<T>(head: T, tail: List<T>): List<T> {
      return { head, tail };
    }
  },
  cata: function<T, U>({
    empty,
    cons
  }: {
    empty: () => U,
    cons: (T, List<T>) => U
  }): (List<T>) => U {
    return function(list: List<T>): U {
      if (list === null) {
        return empty();
      } else {
        return cons(list.head, list.tail);
      }
    };
  },
  map: function<T, U>(f: T => U): (List<T>) => List<U> {
    return list.cata({
      empty: list.ana.empty,
      cons: (head, tail) => list.ana.cons(f(head), list.map(f)(tail))
    });
  },
  eq: function<T>(a: List<T>, b: List<T>): boolean {
    return list.cata({
      empty: () => list.cata({ empty: () => true, cons: _ => false })(b),
      cons: (ha, ta) =>
        list.cata({
          empty: () => false,
          cons: (hb, tb) => ha === hb && list.eq(ta, tb)
        })(b)
    })(a);
  }
};

console.log("fmap maybe", functor.map(maybe, timesTwo)(maybe.ana.just(3)));
console.log("fmap maybe", functor.map(maybe, timesTwo)(maybe.ana.nothing()));
console.log("fmap either", functor.map(either, timesTwo)(either.ana.left(3)));
console.log("fmap either", functor.map(either, timesTwo)(either.ana.right(3)));
console.log(
  "fmap list",
  functor.map(list, timesTwo)(
    list.ana.cons(4, list.ana.cons(5, list.ana.empty()))
  )
);
console.log("eq maybe", eq.eq(maybe, maybe.ana.just(3), maybe.ana.just(4)));
console.log("eq maybe", eq.eq(maybe, maybe.ana.nothing(), maybe.ana.nothing()));
console.log("eq either", eq.eq(either, either.ana.left(3), either.ana.left(3)));
console.log(
  "eq either",
  eq.eq(either, either.ana.left(3), either.ana.right(3))
);
console.log(
  "eq either",
  eq.eq(either, either.ana.right(3), either.ana.right(4))
);
console.log("eq list", eq.eq(list, list.ana.empty(), list.ana.empty()));
console.log(
  "eq list",
  eq.eq(list, list.ana.empty(), list.ana.cons(1, list.ana.empty()))
);
console.log(
  "eq list",
  eq.eq(
    list,
    list.ana.cons(1, list.ana.empty()),
    list.ana.cons(1, list.ana.empty())
  )
);
