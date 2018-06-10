// @flow

type Maybe<A, B = *> = ((A) => B, B) => B;
// type Maybe<A> = MaybeT<A, *>;

// const just: <A, B>(A) => Maybe<A, B> = x => (f, g) => f(x)
function just<A>(x: A): Maybe<A> {
  return (f, g) => f(x);
}

const nothing: Maybe<*> = (f, g) => g;
// function nothing<A>(): Maybe<A> {
//   return (f, g) => g;
// }

function isJust(fa: Maybe<*>): boolean {
  return fa(_ => true, false);
}

function isNothing(fa: Maybe<*>): boolean {
  return fa(_ => false, true);
}

function map<A, B>(f: A => B): (Maybe<A>) => Maybe<B> {
  return fa => fa(a => just(f(a)), nothing);
  // return function(fa: Maybe<A>): Maybe<B> {
  //   return fa(a => just(f(a)), nothing);
  // };
}

function eq<A>(fa: Maybe<A>, fb: Maybe<A>): boolean {
  return fa(a => fb(b => a === b, false), fb(_ => false, true));
}

const pure = just;

function ap<A, B>(ff: Maybe<(A) => B>): (Maybe<A>) => Maybe<B> {
  return fa => ff(f => fa(a => just(f(a)), nothing), nothing);
  // return function(fa: Maybe<A>) {
  //   return ff(f => fa(a => just(f(a)), nothing), nothing);
  // };
}

function bind<A, B>(fa: Maybe<A>): ((A) => Maybe<B>) => Maybe<B> {
  return f => fa(a => f(a), nothing);
  // return function(f: A => Maybe<B>): Maybe<B> {
  //   return fa(a => f(a), nothing);
  // };
}

interface ToString { +toString: () => string }

function toString<A: ToString>(fa: Maybe<A>): string {
  return fa(a => `Just ${a.toString()}`, "Nothing");
}

const _just: Maybe<number> = just(10);
const _nothing: Maybe<*> = nothing;

console.log(toString(_just), toString(_nothing));

console.log(toString(map(x => x + 5)(_just)));
console.log(toString(map(x => x + 5)(_nothing)));

console.log(
  toString(ap(just(a => a + 1))(just(3))),
  toString(ap(just(a => a + 1))(nothing)),
  toString(ap(nothing)(just(3))),
  toString(ap(nothing)(nothing))
);

// function divBy(a: number): number => Maybe<number> {
//   return b => {
//     if (a === 0) {
//       return nothing;
//     } else {
//       return just(b / a);
//     }
//   };
// }

// console.log(
//   toString(bind(just(3))(divBy(0))),
//   toString(bind(just(3))(divBy(1))),
//   toString(bind(nothing)(divBy(0))),
//   toString(bind(nothing)(divBy(1)))
// );

export default {
  just,
  nothing,
  isJust,
  isNothing,
  map,
  pure,
  ap,
  bind,
  eq
};

// import { k } from "./combinators";

// type Nothing = { tag: "nothing" };
// type Just<T> = { tag: "just", value: T };
// export type Maybe<T> = Nothing | Just<T>;

// export function nothing() {
//   return { tag: "nothing" };
// }

// export function just<T>(x: T): Maybe<T> {
//   return { tag: "just", value: x };
// }

// type Branches<T, U> = {
//   nothing: () => U,
//   just: T => U
// };

// export function match<T, U>(branches: Branches<T, U>): (Maybe<T>) => U {
//   return function(maybe) {
//     switch (maybe.tag) {
//       case "nothing":
//         return branches.nothing();
//       case "just":
//         return branches.just(maybe.value);
//       default:
//         throw new Error((maybe.tag: empty));
//     }
//   };
// }

// const maybe = {
//   map: function<T, U>(f: T => U): (Maybe<T>) => Maybe<U> {
//     return match({
//       nothing: nothing,
//       just: x => just(f(x))
//     });
//   },
//   eq: function<T>(a: Maybe<T>, b: Maybe<T>): boolean {
//     return match({
//       nothing: () => match({ nothing: () => true, just: k(false) })(b),
//       just: _a =>
//         match({
//           nothing: k(false),
//           just: _b => _a === _b // if T is primitive
//         })(b)
//     })(a);
//   }
// };

// export default maybe;
