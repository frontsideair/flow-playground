// @flow

import { evolve, values } from "ramda";
import { isIP, isEmail, isURL, isLength } from "validator";

opaque type Maybe<T> = T | null;
opaque type Err = string;
opaque type Result = Err[]; // empty list = success
opaque type Validator = (string) => Result;
opaque type Form<T> = { [T]: string };
opaque type Validators<T> = { [T]: Validator };
opaque type Validation<T> = { [T]: Result };
opaque type Errors<T> = { [T]: Maybe<Err> };

function combine(f: Validator, g: Validator): Validator {
  return value => [...f(value), ...g(value)];
}

function makeValidator(f: string => boolean, error: Err): Validator {
  return value => (f(value) ? [] : [error]);
}

function isValid(result: Result): boolean {
  return result.length === 0;
}

function firstError(result: Result): Maybe<Err> {
  return isValid(result) ? null : result[0];
}

function validateForm<T>(
  form: Form<T>,
  validators: Validators<T>
): Validation<T> {
  return evolve(validators, form);
}

function isFormValid(validation: Validation<*>): boolean {
  return values(validation).every(isValid);
}

function getErrors<T>(validation: Validation<T>): Errors<T> {
  return values(validation).map(firstError); // WTF
}

// some validators
const nonEmpty: Validator = makeValidator(
  value => isLength(value, { min: 1 }),
  "Should not be empty."
);

const longerThan: number => Validator = n =>
  makeValidator(
    value => isLength(value, { min: n }),
    `Should be longer than ${n}.`
  );

const nonEmptyAndLongerThan3: Validator = combine(nonEmpty, longerThan(3));

const ipValidator: Validator = combine(
  nonEmpty,
  makeValidator(isIP, "Should be a valid IP.")
);

const emailValidator: Validator = combine(
  nonEmpty,
  makeValidator(isEmail, "Not a valid email.")
);

// tests
const r1 = nonEmptyAndLongerThan3("");
const r2 = nonEmptyAndLongerThan3("asd");
const r3 = nonEmptyAndLongerThan3("hello world");

console.log(r1, r2, r3);
console.log(isValid(r1), isValid(r2), isValid(r3));
console.log(firstError(r1), firstError(r2), firstError(r3));

const form = {
  ip: "1.1.1.1",
  email: "user@example.com",
  username1: "",
  username2: "asd",
  username3: "hello world"
};
const validators = {
  ip: ipValidator,
  email: emailValidator,
  username1: nonEmptyAndLongerThan3,
  username2: nonEmptyAndLongerThan3,
  username3: nonEmptyAndLongerThan3
};
const validation = validateForm(form, validators);
const valid = isFormValid(validation);
const errs = getErrors(validation);

console.log(validation);
console.log(valid);
console.log(errs);
