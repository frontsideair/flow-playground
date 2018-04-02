// @flow

type Empty = null;
type Cons<T> = { head: T, tail: List<T> };
type List<T> = Empty | Cons<T>;

export function empty<T>(): List<T> {
  return null;
}

export function cons<T>(head: T, tail: List<T>): List<T> {
  return { head, tail };
}

type Branches<T, U> = {
  empty: () => U,
  cons: (T, List<T>) => U
};

export function match<T, U>(branches: Branches<T, U>): (List<T>) => U {
  return function(list) {
    if (list === null) {
      return branches.empty();
    } else {
      return branches.cons(list.head, list.tail);
    }
  };
}

const list = {
  map: function<T, U>(f: T => U): (List<T>) => List<U> {
    return match({
      empty: empty,
      cons: (head, tail) => cons(f(head), list.map(f)(tail))
    });
  },
  eq: function<T>(a: List<T>, b: List<T>): boolean {
    return match({
      empty: () => match({ empty: () => true, cons: _ => false })(b),
      cons: (ha, ta) =>
        match({
          empty: () => false,
          cons: (hb, tb) => ha === hb && list.eq(ta, tb)
        })(b)
    })(a);
  },
  empty: empty,
  append: function<T>(l1: List<T>, l2: List<T>): List<T> {
    return match({
      empty: () => l2,
      cons: (head, tail) => cons(head, list.append(tail, l2))
    })(l1);
  },
  fold: function<T, U>(l: List<T>, base: () => U, f: (T, U) => U): U {
    return match({
      empty: base,
      cons: (head, tail) => f(head, list.fold(tail, base, f))
    })(l);
  }
};

export default list;
