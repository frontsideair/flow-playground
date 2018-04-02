// @flow

import type { HKT } from "./hkt";

export type Functor<F, T, U> = { map: ((T) => U) => (HKT<F, T>) => HKT<F, U> };
// interface Functor<F, T, U> { map: ((T) => U) => (HKT<F, T>) => HKT<F, U> } // F<T> => F<U>

const functor = {
  map: function<F, T, U>(
    dict: Functor<F, T, U>,
    f: T => U
  ): (HKT<F, T>) => HKT<F, U> {
    return dict.map(f);
  }
};

export default functor;
