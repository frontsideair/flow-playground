// @flow

export type Eq<T> = { eq: (T, T) => boolean };

const eq = {
  eq: function<T>(dict: Eq<T>, a: T, b: T): boolean {
    return dict.eq(a, b);
  }
};

export default eq;
