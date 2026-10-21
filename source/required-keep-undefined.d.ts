import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {PartialOnUndefinedDeep} from './partial-on-undefined-deep.d.ts'; // For `@link`
import type {SetRequired} from './set-required.d.ts'; // For `@link`
import type {UndefinedOnPartialDeep} from './undefined-on-partial-deep.d.ts'; // For `@link`
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a type that makes all keys required, while the keys that were optional also accept `undefined`.

Unlike the built-in `Required`, it adds `undefined` to the value type of the keys that were optional. An object of this type must have every key, but a key that was optional can be set to `undefined`. It works the same with and without the [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes) TSConfig setting. Only the top-level keys are changed. Nested objects are kept as is. Optional tuple elements become required elements that accept `undefined`. Arrays and rest elements are kept as is.

Use-cases:
- Make sure that an object lists every key, so that you get an error when a key is added to the type but not to the object. For example, when you map one model to another or read environment variables.
- Type the result of applying defaults, where every key is present, but some values can be `undefined`.

@example
```
import type {RequiredKeepUndefined} from 'type-fest';

type Options = {
	name: string;
	timeout?: number;
	retries?: number;
};

type ResolvedOptions = RequiredKeepUndefined<Options>;
//=> {name: string; timeout: number | undefined; retries: number | undefined}

const options: ResolvedOptions = {
	name: 'unicorn',
	timeout: undefined,
	retries: 2,
};

// A missing key is a type error, even when its value can be `undefined`.
// @ts-expect-error
const incompleteOptions: ResolvedOptions = {
	name: 'unicorn',
	retries: 2,
};

// Optional tuple elements become required elements that accept `undefined`.
type Point = RequiredKeepUndefined<[x: number, y?: number]>;
//=> [x: number, y: number | undefined]
```

@example
```
// @exactOptionalPropertyTypes: false
import type {RequiredKeepUndefined} from 'type-fest';

type Options = {
	name: string;
	timeout?: number;
};

// The built-in `Required` removes `undefined` when `exactOptionalPropertyTypes` is disabled.
type A = Required<Options>;
//=> {name: string; timeout: number}

type B = RequiredKeepUndefined<Options>;
//=> {name: string; timeout: number | undefined}
```

Known limitations:
- TypeScript can print a symbol key that was optional without `undefined` in tooltips and `.d.ts` files, although the key accepts `undefined`. For `{[Symbol.iterator]?: () => Iterator<number>}`, an inferred `export const options = resolveOptions()` is emitted as `{[Symbol.iterator]: () => Iterator<number>}`. Add a type annotation to the variable to emit the type alias instead.
- With `exactOptionalPropertyTypes`, a key that was optional cannot be set to `undefined` when an index signature does not accept `undefined`, like `{[key: string]: number; timeout?: number}`.

@see {@link SetRequired}
@see {@link UndefinedOnPartialDeep}
@see {@link PartialOnUndefinedDeep}

@category Object
@category Array
*/
export type RequiredKeepUndefined<Type extends object> =
	Type extends unknown // For distributing `Type`
		// Each value is wrapped in a tuple, because `-?` removes `undefined` from the value of an optional key when `exactOptionalPropertyTypes` is disabled, and always from array elements, optional tuple elements, rest elements, and the elements after a rest element. With the wrapper, `-?` can only remove an `undefined` around the tuple, so the value in it is kept.
		// An array type with extra keys, like `string[] & {tag?: string}`, takes the object branch, so that its extra keys lose the link (see below). Both branches turn it into the same object type.
		? ([Type, Exclude<keyof Type, keyof unknown[] | `${number}`>] extends [UnknownArray, never] // Wrapped, so that `any` does not take both branches
			// A key remap would turn arrays into objects, and tuples print correctly without one.
			? {[Key in keyof Type]-?: [Type[Key]]}
			// A mapped type links each key to its original declaration, and TypeScript then prints the original annotation for a key that was optional, without the added `undefined`, in `.d.ts` files and tooltips. A key remap removes the link. Symbol keys keep the link, because declaration emit cannot name a symbol key without it.
			: {[Key in keyof Type as Key extends symbol ? Key : never]-?: [Type[Key]]}
				& {[Key in keyof Type as Key extends symbol ? never : Key extends infer RemappedKey ? RemappedKey : never]-?: [Type[Key]]} // `infer` makes TypeScript treat this as a key remap, not as a key filter, which would keep the link.
		) extends infer RequiredType
			// Unwraps the values, and flattens the intersection of the symbol keys and the other keys. `undefined` is added explicitly, because with `exactOptionalPropertyTypes`, the `undefined` in the value of an optional key is TypeScript's internal missing type, which a later mapped type, like `Partial`, removes.
			? {[Key in keyof RequiredType]: RequiredType[Key] extends [infer Value]
				? Value | (Key extends OptionalKeysOf<Type> ? undefined : never)
				: never // Should never happen
			}
			: never // Should never happen
		: never; // Should never happen

export {};
