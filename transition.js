// @flow

type From<A> = { tag: "from", from: A };
type Between<A, B> = { tag: "between", from: A, to: B };
type To<B> = { tag: "to", to: B };
type Transition<A, B> = From<A> | Between<A, B> | To<B>;

export function from<A>(from: A): From<A> {
  return { tag: "from", from };
}

export function between<A, B>(from: A, to: B): Between<A, B> {
  return { tag: "between", from, to };
}

export function to<B>(to: B): To<B> {
  return { tag: "to", to };
}

type Branches<A, B, O> = {
  from: A => O,
  between: (A, B) => O,
  to: B => O
};

export function match<A, B, O>(
  val: Transition<A, B>,
  branches: Branches<A, B, O>
): O {
  switch (val.tag) {
    case "from":
      return branches.from(val.from);
    case "between":
      return branches.between(val.from, val.to);
    case "to":
      return branches.to(val.to);
    default:
      throw new Error((val.tag: empty));
  }
}
