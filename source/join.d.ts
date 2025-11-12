// The builtin `join` method supports all these natively in the same way that typescript handles them so we can safely accept all of them.
type JoinableItem = string | number | bigint | boolean | undefined | null;

// `null` and `undefined` are treated uniquely in the built-in join method, in a way that differs from the default `toString` that would result in the type `${undefined}`. That's why we need to handle it specifically with this helper.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join#description
type NullishCoalesce<
	Value extends JoinableItem,
	Fallback extends string,
> = Value extends undefined | null ? NonNullable<Value> | Fallback : Value;

/**
Join an array of strings and/or numbers using the given string as a delimiter.

Use-case: Defining key paths in a nested object. For example, for dot-notation fields in MongoDB queries.

@example
```
import type {Join} from 'type-fest';

// Mixed (strings & numbers) items
const path1 = ['foo', 0, 'baz'].join('.') as Join<['foo', 0, 'baz'], '.'>;
//=> 'foo.0.baz'

// Only string items
const path2 = ['foo', 'bar', 'baz'].join('.') as Join<['foo', 'bar', 'baz'], '.'>;
//=> 'foo.bar.baz'

// Only number items
const path3 = [1, 2, 3].join('.') as Join<[1, 2, 3], '.'>;
//=> '1.2.3'

// Only bigint items
const path4 = [1n, 2n, 3n].join('.') as Join<[1n, 2n, 3n], '.'>;
//=> '1.2.3'

// Only boolean items
const path5 = [true, false, true].join('.') as Join<[true, false, true], '.'>;
//=> 'true.false.true'

// Contains nullish items
const path6 = ['foo', undefined, 'baz', null, 'xyz'].join('.') as Join<['foo', undefined, 'baz', null, 'xyz'], '.'>;
//=> 'foo..baz..xyz'

// Partial tuple shapes (rest param last)
const path7 = ['prefix'].join('.') as Join<['prefix', ...string[]], '.'>;
//=> `prefix.{string}`

// Partial tuple shapes (rest param first)
const path8 = ['suffix'].join('.') as Join<[...string[], 'suffix'], '.'>;
//=> `${string}.suffix`

// Tuples items with nullish unions
const path9 = ['hello', 'world'].join('.') as Join<['hello' | undefined, 'world' | null], '.'>;
//=> '.' | '.world' | 'hello.' | 'hello.world'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gKQsAdgXzgDMoIQ4ByJVAWiJQGcYKBuAKDYHpO4BZYAB4oAJnAAUTKHgDmDOADI4uAK4gARiigMAlHGAwUIBmwDGEXEzhgAhjAAWARjgBeOAG0KRCBAoAaOAAM-hRq1gBeFAC6AHQAVji4YhTRFLrWcth4ADweXj7+QZShEZHBKQB87NzO5ZR50QHRxRQc3HAA8rgANohwkjJ6Bkam5pY29gBMLu6e3n5F1lDzIeFRcQlJKWkZCTmz+QtLwc2llBVVnDV13k2LtxGtPJ09SqoaUIOGxmYW8ON2AGZpm4HP4Jv4ATF4nhNqk4Ok4JlcDlQXBwXBIWUKJUuJdahQHNEJtEAS1cR1ur01MBpHh4PoviNflZbHYACzAhy4MHcjG4KEbZJwhFIlG8ia8gH8rE46r4wnE0mPCkvNTeLooay4T7DH5jVkAVmBMCgyhQ-iI1i6DHNCFNKAFMKF20RuzcJrNFqtNv8HodMouVyo9uilutKGifrJbQAwuYYNY8HIVF0usAGHYdd9Rn9WQA2YH7ebKXDCFBEPAiY6rfwprrBASIErrJ1beE7bK5Ob+Etliu4KsLCK15SphtNqIB3FB+r3aLRRsPckABUWMGAVoQyjAGr6dmsqDkYigjFzUGs5C66Rg2iZ+vsAHZC2ATxWBGtoYlne3XZ2KC-y0EeZ52ifpcGkNxIlOIVZTxOAAAMALfaJ0DA6R8Hg5VV1gDcui3Hc0AzA9GHEE99XPcgKy0G871zewAA5CwYZQiDfD9BTbEU3RAtDIOCZjWKA6DzmnWp4IAElQk0ZHwUCWLfTDyQAFW3DU5AZIw4AAd30TM63TTMS2AUZaJZewAE5CzsFBUwOCgtOgLphHY1thQ7ZEPGs2yKDgAAfOBe0AgdhGCByoCcnz-LrYTsUDfEUj8s4woixKKC8roIAS-y0psjLomS5ygA)

@category Array
@category Template literal
*/
export type Join<
	Items extends readonly JoinableItem[],
	Delimiter extends string,
> = Items extends readonly []
	? ''
	: Items extends readonly [JoinableItem?]
		? `${NullishCoalesce<Items[0], ''>}`
		: Items extends readonly [
			infer First extends JoinableItem,
			...infer Tail extends readonly JoinableItem[],
		]
			? `${NullishCoalesce<First, ''>}${Delimiter}${Join<Tail, Delimiter>}`
			: Items extends readonly [
				...infer Head extends readonly JoinableItem[],
				infer Last extends JoinableItem,
			]
				? `${Join<Head, Delimiter>}${Delimiter}${NullishCoalesce<Last, ''>}`
				: string;

export {};
