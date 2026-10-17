import type {ToPath, ToString} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {Get} from './get.d.ts'; // For `@link`
import type {Paths} from './paths.d.ts'; // For `@link`

/**
Convert a path segment that is an array index, like `'0'`, into a number.
*/
type ToIndex<Segment extends string> =
	Segment extends `${infer Index extends number}`
		// The round trip keeps segments like `'01'` and `'0x10'` as strings, because they are not array indices. It also turns `${number}` into `number`. Negative numbers and exponent forms like `'1e-7'` survive the round trip, but are not array indices either.
		? `${Index}` extends Segment
			? Segment extends `-${string}` | `${string}e${string}` ? Segment : Index
			: Segment
		: Segment;

/**
Convert each array index in the given path segments into a number.
*/
type ToIndexes<Segments extends string[]> = {[Index in keyof Segments]: ToIndex<Segments[Index]>};

/**
Convert a path string into a tuple of its keys, with array indices as numbers.

It splits a path like {@link Get} does, with dot notation (`'users.0.name'`) and bracket notation (`'users[0].name'`).

- A key that is a non-negative integer, like `'0'` or `'42'`, becomes a number, and so does `${number}`.
- Other keys stay strings, like `'01'`, `'-1'`, `'1e3'`, and `'9007199254740993'` (which a number cannot hold exactly).
- A number path is read as its string form, so `ParsePath<1.5>` is `[1, 5]`.
- A placeholder in a template literal path, like `${string}`, is read as one key.
- A `string` path, including the one in `LiteralUnion<'a', string>`, gives `Array<string | number>`.
- A union of paths gives a union of tuples.

Use-cases:
- Type the path for an API that takes an array of keys, like the `name` of an Ant Design form field, or `_.get(object, ['users', 0, 'name'])`.
- Get the paths from {@link Paths} as tuples with `ParsePath<Paths<BaseType>>`.

If a function parameter is constrained to a `ParsePath` result, make its type parameter `const`. Otherwise, TypeScript widens number indices like `0` to `number`, and it often infers the whole constraint, so `Get<BaseType, Path>` gives a union of every value.

The result is a mutable tuple. To also accept a readonly path, constrain the parameter to `Readonly<ParsePath<…>>`.

Note: Like with `Get` and `Paths`, a key that contains a dot or brackets, like `'a.b'` or `'b[0]'`, cannot be written in a path string, because escapes like `\.` are not supported.

@example
```
import type {ParsePath} from 'type-fest';

type A = ParsePath<'users[0].name'>;
//=> ['users', 0, 'name']

type B = ParsePath<'users.0.name'>;
//=> ['users', 0, 'name']

type C = ParsePath<`users.${number}.name`>;
//=> ['users', number, 'name']
```

@example
```
import type {Get, ParsePath, Paths} from 'type-fest';

type FormValues = {
	name: string;
	tags: string[];
	address: {
		city: string;
	};
};

type FieldPath = ParsePath<Paths<FormValues>>;
//=> ['name'] | ['tags'] | ['address'] | ['tags', number] | ['address', 'city']

declare function getField<const Path extends FieldPath>(path: Path): Get<FormValues, Path>;

const city = getField(['address', 'city']);
//=> string

const tag = getField(['tags', 0]);
//=> string | undefined
```

@category Array
@category Template literal
*/
export type ParsePath<Path extends string | number> =
	IsAny<Path> extends true
		? Array<string | number>
		// Distribute here, inside the `IsAny` check, so a union of paths shows as a union of tuples. Without distribution, it shows as `ToIndexes<…>`, and with distribution at the top level, it shows as `ParsePath<…>`. Without distribution, a function parameter constrained to the result also widens string literals when it is not `const`.
		: Path extends unknown
			// Check `Path` for the `string & {}` of `LiteralUnion`, because its string form is not `string`. Also check the string form, because checking only `Path` stops a function parameter constrained to the result from inferring string literals when it is not `const`.
			? string extends Path | ToString<Path>
				? Array<string | number>
				: ToIndexes<ToPath<ToString<Path>>>
			: never;

export {};
