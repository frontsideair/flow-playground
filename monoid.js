// @flow

import type { HKT } from "./hkt";

export type Monoid<F, T> = {
  empty: () => HKT<F, T>,
  append: (HKT<F, T>, HKT<F, T>) => HKT<F, T>
};

const monoid = {
  empty: function<F, T>(dict: Monoid<F, T>): HKT<F, T> {
    return dict.empty();
  },
  append: function<F, T>(
    dict: Monoid<F, T>,
    a: HKT<F, T>,
    b: HKT<F, T>
  ): HKT<F, T> {
    return dict.append(a, b);
  }
};

export default monoid;
