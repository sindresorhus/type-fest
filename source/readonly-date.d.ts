import type {ReadonlyDeep} from './readonly-deep.d.ts'; // For `@link`

/**
Matches a `Date` that cannot be changed.

Use-cases:
- Type a parameter of a function that only reads a date, so the function cannot change it. The [`prefer-readonly-parameter-types`](https://typescript-eslint.io/rules/prefer-readonly-parameter-types/) lint rule flags a `Date` parameter, but accepts a `ReadonlyDate`.
- Type the return value of a function that hands out a date the caller must not change.

@example
```
import type {ReadonlyDate} from 'type-fest';

function formatDate(date: ReadonlyDate): string {
	return date.toISOString().slice(0, 10);
}

declare const date: Date;
formatDate(date);
//=> string

declare const readonlyDate: ReadonlyDate;
formatDate(readonlyDate);

// @ts-expect-error -- Property 'setTime' does not exist on type 'ReadonlyDate'.
readonlyDate.setTime(0);

// Get a mutable copy when you need one.
// eslint-disable-next-line unicorn/consistent-date-clone -- A `ReadonlyDate` cannot be passed to `new Date()`.
const mutableDate = new Date(readonlyDate.getTime());
//=> Date
```

Note: A `Date` is assignable to a `ReadonlyDate`, but a `ReadonlyDate` is not assignable to a `Date`, like `ReadonlyArray` and `Array`. Code that hands a `ReadonlyDate` to a function that takes a `Date`, like most date libraries, needs `new Date(readonlyDate.getTime())`.

Note: This is only a compile-time check. The value is still a `Date` at runtime, so plain JavaScript can still change it, and `Object.freeze()` does not stop the setters. An `instanceof Date` check narrows the type back to `Date`, which brings the setters back. Use [`Temporal`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) for values that cannot be changed at runtime.

Note: It removes every `set*` method, including a setter that a project adds to `Date`.

The `*Deep` types, like {@link ReadonlyDeep `ReadonlyDeep`}, do not walk into a `ReadonlyDate`.

@category Object
*/
export type ReadonlyDate = {
	readonly [Key in keyof Date as Key extends `set${string}` ? never : Key]: Date[Key];
};

export {};
