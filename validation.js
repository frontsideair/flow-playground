// @flow

opaque type Maybe<T> = T | null;
opaque type Err = string;
opaque type Result = Err[]; // empty list = success
opaque type Validator = (string) => Result;
opaque type Validators<Form> = $ObjMap<Form, () => Validator>; // { [$Keys<Form>]: Validator };
opaque type Validation<Form> = $ObjMap<Form, () => Result>; // { [$Keys<Form>]: Result };
opaque type Errors<Form> = $ObjMap<Form, () => Maybe<Err>>; // { [$Keys<Form>]: Maybe<Err> };

function base(): Result {
  return [];
}

function combine(f: Validator, g: Validator): Validator {
  return value => [...f(value), ...g(value)];
}

function combineAll(validators: Validator[]): Validator {
  return validators.reduce(combine, base);
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

function validateForm<Form: Object>(
  form: Form,
  validators: Validators<Form>
): Validation<Form> {
  return Object.keys(validators).reduce((acc, prop) => {
    const validator = validators[prop];
    const value = form[prop];
    acc[prop] = validator(value);
    return acc;
  }, {});
}

function isFormValid(validation: Validation<*>): boolean {
  return Object.keys(validation).every(prop => isValid(validation[prop]));
}

function getErrors<Form: Object>(validation: Validation<Form>): Errors<Form> {
  return Object.keys(validation).reduce((acc, prop) => {
    const result = validation[prop];
    acc[prop] = firstError(result);
    return acc;
  }, {});
}

// some validators
const nonEmpty: Validator = makeValidator(
  value => value !== "",
  "Should not be empty."
);

const longerThan: number => Validator = n =>
  makeValidator(value => value.length > n, `Should be longer than ${n}.`);

const nonEmptyAndLongerThan3: Validator = combine(nonEmpty, longerThan(3));

// tests
const form = {
  boolFlag: true,
  username1: "",
  username2: "asd",
  username3: "hello world"
};

const validators = {
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
