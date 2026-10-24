import type {ExactKey, NonRecursiveType, NormalizedKeys, SimplifyObject, ToString, UnwrapPathBrand} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {NonNullableDeep} from './non-nullable-deep.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
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
			: ([TerminalKeys<KeyPaths, BaseType>] extends [never]
				? BaseType
				: SimplifyObject<SetNonNullable<BaseType, TerminalKeys<KeyPaths, BaseType>>>) extends infer Result
				? {[Key in keyof Result]: SetNonNullableDeepHelper<Result[Key], SubPaths<KeyPaths, Key, Result>>}
				: never;

/**
Finds the keys of `BaseType` that the terminal paths name, matching numeric, string, and enum spellings, and keeping a numeric key such as `1.2` distinct from a dotted string path such as `'1.2'`.
*/
type TerminalKeys<KeyPaths, BaseType> = KeyPaths extends `${string}.${string}`
	? never
	: NormalizedKeys<(KeyPaths & PropertyKey) | ToString<KeyPaths>> extends infer Keys
		// An enum key and its literal spelling do not intersect, so declared keys are also matched by assignability. A key that an index signature covers is left to the intersection, because `number` is assignable to a numeric enum.
		? (Keys & keyof BaseType) | Extract<keyof OmitIndexSignature<BaseType>, Exclude<Keys, keyof PickIndexSignature<BaseType>>>
		: never;

/**
Finds the subpaths whose first property matches `Key` in `BaseType`. A declared property is selected on its own, without also changing its covering index signature.
*/
type SubPaths<KeyPaths, Key, BaseType> = KeyPaths extends `${infer Property}.${infer RestPath}`
	// A noncanonical numeric segment, such as `01`, does not name a number key or an array index.
	? Property extends ToString<(Key & string) | ExactKey<Record<Key & number, unknown>, Property>>
		? Property extends `${keyof OmitIndexSignature<BaseType> & (string | number)}`
			? `${Key & (string | number)}` extends Property
				? RestPath
				: never
			: RestPath
		: never
	: never;

export {};
