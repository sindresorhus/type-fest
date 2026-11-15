import type {IsEqual} from './is-equal.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';

declare const emptyObjectSymbol: unique symbol;

/**
Represents a strictly empty plain object, the `{}` value.

When you annotate something as the type `{}`, it can be anything except `null` and `undefined`. This means that you cannot use `{}` to represent an empty plain object ([read more](https://stackoverflow.com/questions/47339869/typescript-empty-object-and-any-difference/52193484#52193484)).

@example
```
import type {EmptyObject} from 'type-fest';

// The following illustrates the problem with `{}`.
const foo1: {} = {}; // Pass
const foo2: {} = []; // Pass
const foo3: {} = 42; // Pass
const foo4: {} = {a: 1}; // Pass

// With `EmptyObject` only the first case is valid.
const bar1: EmptyObject = {}; // Pass
// @ts-expect-error
const bar2: EmptyObject = []; // Fail
// @ts-expect-error
const bar3: EmptyObject = 42; // Fail
// @ts-expect-error
const bar4: EmptyObject = {a: 1}; // Fail
```

Unfortunately, `Record<string, never>`, `Record<keyof any, never>` and `Record<never, never>` do not work. See {@link https://github.com/sindresorhus/type-fest/issues/395 #395}.

@category Object
*/
export type EmptyObject = {[emptyObjectSymbol]?: never};

/**
Returns a boolean for whether the type is strictly equal to an empty plain object, the `{}` value.

Distributes over unions, returning `boolean` when members disagree. Returns `false` for `any`, `unknown`, and `never`.

@example
```
import type {IsEmptyObject} from 'type-fest';

type Pass = IsEmptyObject<{}>; //=> true
type Fail1 = IsEmptyObject<[]>; //=> false
type Fail2 = IsEmptyObject<null>; //=> false
type Fail3 = IsEmptyObject<{[key: string]: number}>; //=> false
type Fail4 = IsEmptyObject<{[key: symbol]: number}>; //=> false
```

@see {@link EmptyObject}
@category Object
*/
export type IsEmptyObject<T> =
	// `any` is not known to be empty, and `never` is not an object. Checking `any` first also lets generic code that wraps the result keep resolving it after instantiation.
	IsAnyOrNever<T> extends true
		? false
		: T extends EmptyObject
			// The broad `object` type also accepts nonempty objects.
			? IsEqual<T, object> extends true
				? false
				// Any declared key or index signature beyond the private marker makes the object nonempty.
				: [keyof T] extends [keyof EmptyObject]
					? true
					: false
			: false;

export {};
