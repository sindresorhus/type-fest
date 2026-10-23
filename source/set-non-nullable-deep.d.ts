import type {NonRecursiveType, NormalizedKeys, SimplifyObject, UnwrapPathBrand} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {NonNullableDeep} from './non-nullable-deep.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {Paths} from './paths.d.ts';
import type {SetNonNullable} from './set-non-nullable.d.ts';
import type {SetRequiredDeep} from './set-required-deep.d.ts'; // For `@link`

/**
Create a type that makes the specified keys non-nullable (removes `null` and `undefined`), supports deeply nested key paths, and leaves all other keys unchanged.

NOTE: Optional modifiers (`?`) are not removed from properties. For example, `SetNonNullableDeep<{foo?: string | null | undefined}, 'foo'>` will result in `{foo?: string}`. To remove both optional modifiers and nullables, use {@link SetRequiredDeep} in conjunction with this type.

Known limitations:
- An index path into a tuple with a leading rest element, such as `a.1` on `[...string[], number | null]`, does nothing. The element after the rest element is keyed by a number that the walk does not reach, so pick the whole array and index into it instead.
- A path that does not exist is not a type error, so that paths deeper than `Paths` lists can be used. A missing path is ignored. A non-literal path segment, such as `string`, matches every key at its level, like a path through an index signature.

@example
```
import type {SetNonNullableDeep} from 'type-fest';

type User = {
	name: string;
	address: {
		city: string | undefined;
		street?: string | null;
	};
	contact: {
		email?: string | null | undefined;
		phone: string | undefined;
	};
};

type UpdatedUser = SetNonNullableDeep<User, 'address.street' | 'contact.email' | 'contact.phone'>;
//=> {
// 	name: string;
// 	address: {
// 		city: string | undefined;
// 		street?: string;
// 	};
// 	contact: {
// 		email?: string;
// 		phone: string;
// 	};
// }
```

@example
```
import type {SetNonNullableDeep} from 'type-fest';

// Set specific indices in an array to be non-nullable.
type ArrayExample1 = SetNonNullableDeep<{a: [number | null, number | null, number | undefined]}, 'a.1' | 'a.2'>;
//=> {a: [number | null, number, number]}

// Optional modifier (`?`) is not removed.
type ArrayExample2 = SetNonNullableDeep<{a: [(number | null)?, (number | null)?]}, 'a.1'>;
//=> {a: [(number | null)?, number?]}
```

@category Object
*/
export type SetNonNullableDeep<
	BaseType,
	// Autocomplete lists paths up to `a.b.c`, because listing deeper paths can take minutes for large union-heavy types. A generic `Paths<T>` can be a `number`, so any `number` is accepted, like any `string`.
	KeyPaths extends LiteralUnion<Paths<BaseType, {maxRecursionDepth: 2}>, string | number>,
> = IsAny<KeyPaths> extends true
	? NonNullableDeep<BaseType>
	: SetNonNullableDeepHelper<BaseType, UnwrapPathBrand<KeyPaths>>;

/**
Internal helper for {@link SetNonNullableDeep}.

Applies terminal keys together to the original container, then walks the descendant paths once. A node without terminal paths skips the shallow setter.
*/
type SetNonNullableDeepHelper<BaseType, KeyPaths> =
	[KeyPaths] extends [never]
		? BaseType
		: BaseType extends NonRecursiveType | ReadonlySet<unknown> | ReadonlyMap<unknown, unknown> // Also distributes `BaseType`
			? BaseType
			: ([TerminalKeys<KeyPaths>] extends [never]
				? BaseType
				: SimplifyObject<SetNonNullable<BaseType, TerminalKeys<KeyPaths> & keyof BaseType>>) extends infer Result
				? {[Key in keyof Result]: SetNonNullableDeepHelper<Result[Key], SubPaths<KeyPaths, Key>>}
				: never;

/**
Converts terminal paths to their numeric and string key spellings, keeping a numeric key such as `1.2` distinct from a dotted string path.
*/
type TerminalKeys<KeyPaths> = KeyPaths extends `${string}.${string}`
	? never
	: NormalizedKeys<KeyPaths & PropertyKey>;

/**
Finds the subpaths whose first property matches `Key` in `BaseType`.
*/
type SubPaths<KeyPaths, Key> = KeyPaths extends `${infer Property}.${infer RestPath}`
	? Property extends `${Key & (string | number)}`
		? RestPath
		: never
	: never;

export {};
