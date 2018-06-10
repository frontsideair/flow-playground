// @flow

import { k } from "./combinators";

type Maybe<A, B = *> = ((A) => B, () => B) => B;
// type Maybe<A> = MaybeT<A, *>;

// const just: <A, B>(A) => Maybe<A, B> = x => (f, g) => f(x)
function just<A>(x: A): Maybe<A> {
  return (f, g) => f(x);
}

// const nothing: Maybe<*> = (f, g) => g;
// function nothing(): Maybe<*> {
function nothing<A>(): Maybe<A> {
  return (f, g) => g();
}

function isJust(fa: Maybe<*>): boolean {
  return fa(_ => true, k(false));
}

function isNothing(fa: Maybe<*>): boolean {
  return fa(_ => false, k(true));
}

function map<A, B>(f: A => B): (Maybe<A>) => Maybe<B> {
  return fa => fa(a => just(f(a)), nothing);
  // return function(fa: Maybe<A>): Maybe<B> {
  //   return fa(a => just(f(a)), nothing);
  // };
}

function eq<A>(fa: Maybe<A>, fb: Maybe<A>): boolean {
  return fa(a => fb(b => a === b, k(false)), k(fb(_ => false, k(true))));
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
  return fa(a => `Just ${a.toString()}`, k("Nothing"));
}

const _just: Maybe<number> = just(10);
const _nothing: Maybe<*> = nothing();

console.log(toString(_just), toString(_nothing));

console.log(
  toString(map(x => x + 5)(_just)),
  toString(map(x => x + 5)(_nothing))
);

console.log(
  toString(ap(just(a => a + 1))(just(3))),
  toString(ap(just(a => a + 1))(nothing)),
  toString(ap(nothing)(just(3))),
  toString(ap(nothing)(nothing))
);

function divBy(a: number): number => Maybe<number> {
  return b => {
    if (a === 0) {
      return nothing();
    } else {
      return just(b / a);
    }
  };
}

console.log(
  toString(bind(just(3))(divBy(0))),
  toString(bind(just(3))(divBy(1))),
  toString(bind(nothing)(divBy(0))),
  toString(bind(nothing)(divBy(1)))
);

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
