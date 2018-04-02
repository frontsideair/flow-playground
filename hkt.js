// @flow

// HKT helper type
export type HKT<F, T> = $Call<F, T>;
// F: (* => *)
// T: *
// F<T>: *
