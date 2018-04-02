// @flow

import maybe, { nothing, just } from "./maybe";
import functor from "./functor";
import either, { left, right } from "./either";
import eq from "./eq";
import list, { empty, cons } from "./list";
import monoid from "./monoid";
import number from "./number";

// TODO: not passing dicts, use classes/prototypes/`with` keyword?
// TODO: make pattern matching a typeclass?
// TODO: easy and typesafe constructors

function x2(x: number): number {
  return x * 2;
}

function add(x: number, y: number): number {
  return x + y;
}

const l = cons(1, cons(2, cons(3, cons(4, empty()))));

console.log("fmap maybe", functor.map(maybe, x2)(just(3)));
console.log("fmap maybe", functor.map(maybe, x2)(nothing()));
console.log("fmap either", functor.map(either, x2)(left(3)));
console.log("fmap either", functor.map(either, x2)(right(3)));
console.log("fmap list", functor.map(list, x2)(cons(4, cons(5, empty()))));
console.log("eq maybe", eq.eq(maybe, just(3), just(4)));
console.log("eq maybe", eq.eq(maybe, nothing(), nothing()));
console.log("eq either", eq.eq(either, left(3), left(3)));
console.log("eq either", eq.eq(either, left(3), right(3)));
console.log("eq either", eq.eq(either, right(3), right(4)));
console.log("eq list", eq.eq(list, empty(), empty()));
console.log("eq list", eq.eq(list, empty(), cons(1, empty())));
console.log("eq list", eq.eq(list, cons(1, empty()), cons(1, empty())));
console.log(
  "append list",
  list.fold(monoid.append(list, l, l), number.empty, number.append)
);
