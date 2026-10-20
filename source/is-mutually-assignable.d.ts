import type {ExtendsStrict} from './extends-strict.d.ts'; // For `@link`
import type {IsEqual} from './is-equal.d.ts'; // For `@link`

/**
Returns a boolean for whether the two given types are mutually assignable.

Two types are mutually assignable when each type can be assigned to the other.

Use-cases:
- Assert that two types describe the same shape, even when one of them is written differently, like `{a: string}` and `{readonly a: string}`, or `{a: 0} & {b: 0}` and `{a: 0; b: 0}`.
- Check that a refactoring did not change a public type, without requiring the two types to be identical.

@example
```
import type {IsMutuallyAssignable} from 'type-fest';

type A = IsMutuallyAssignable<{a: string}, {readonly a: string}>;
//=> true

type B = IsMutuallyAssignable<{a: 0} & {b: 0}, {a: 0; b: 0}>;
//=> true

type C = IsMutuallyAssignable<{a: 0}, {a: 0; b: 0}>;
//=> false

type D = IsMutuallyAssignable<string | number, string>;
//=> false
```

Note: {@link IsEqual} also compares the identity of the two types, so it returns `false` for the first two cases above. Use this type when only assignability matters, and `IsEqual` when the types must be identical. This type is also cheaper.

Note: The result depends on the compiler options. With `strictFunctionTypes` disabled, function parameters are bivariant, so `(a: string) => void` and `(a: 'x') => void` become mutually assignable. With `exactOptionalPropertyTypes` disabled, `{a?: string}` and `{a?: string | undefined}` become mutually assignable.

Note: `any` is mutually assignable with every type except `never`, even when nested. `never` is only mutually assignable with itself.

Note: The types are compared as a whole, so a union can be mutually assignable with a type not written as a union. For example, `{a: 1 | 2}` and `{a: 1} | {a: 2}` are mutually assignable.

@see {@link IsEqual}
@see {@link ExtendsStrict}

@category Type Guard
@category Utilities
*/
export type IsMutuallyAssignable<A, B> =
	[A] extends [B]
		? [B] extends [A]
			? true
			: false
		: false;

export {};
