import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Join, JoinableItem} from './join.d.ts';
import type {JoinUnion} from './join-union.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsUnion} from './is-union.d.ts';

/**
Convert a tuple or union type into a string representation. Used for readable error messages in other types.

 - `S`: **separator** between members (`default: ','`)
 - `E`: **start** and **end** delimiters of the string (`default: ['', '']`)

@example
```
type T1 = TypeAsString<['a', 'b'], ', ', ['[', ']']>;
//=> '[a, b]'

type T2 = TypeAsString<'a' | 'b', ' | '>;
//=> 'a | b'
```
*/
// TODO: Make a separate `Stringify` type
type TypeAsString<T, S extends string = ',', E extends [string, string] = ['', '']> =
	`${E[0]}${
		[T] extends [readonly JoinableItem[]] // TODO: add `JoinableArray` type
			? IsUnion<T> extends true
				? JoinUnion<`[${Join<T, ', '>}]`, S>
				: Join<T, S>
			: [T] extends [JoinableItem]
				? JoinUnion<T, S>
				: '...' // Too complex
	}${E[1]}`;

/** Stringify a tuple as `'[a, b]'` */
type TupleAsString<T> = TypeAsString<T, ', ', ['[', ']']>;

/** Stringify a union as `'(a | b)[]'` */
type UnionAsString<U> = TypeAsString<U, ' | ', ['(', ')[]']>;

/**
Enforces that a tuple contains exactly the members of a union type, with no duplicates or omissions.

Returns the tuple `List` if valid. Otherwise, if any constraints are violated, a descriptive error message is returned as a string literal.

#### Requirements:
 - `List` **must have the same length** as the number of members in `Shape`
 - Each member of `Shape` **must appear exactly once** in `List`, **No duplicates allowed**
 - The **order does not matter**

#### Use Cases:
 - Ensuring exhaustive lists of options (e.g., all form field names, enum variants)
 - Compile-time enforcement of exact permutations without duplicates
 - Defining static configuration or table headers that match an enum or union

@example
```
import type {LiteralList} from 'type-fest';

// ✅ OK
type T1 = LiteralList<['a', 'b'], 'a' | 'b'>;
//=> ['a', 'b']

// ✅ OK
type T2 = LiteralList<[2, 1], 1 | 2>;
//=> [2, 1]

// ❌ Length mismatch
type T3 = LiteralList<['a', 'b', 'c'], 'a' | 'b'>;
//=> '(a | b)[], Type [a, b, c] is not the required length of: 2'

// ❌ Missing element
type T4 = LiteralList<['a'], 'a' | 'b'>;
//=> '(a | b)[], Type [a] is missing members: [b]'

// ❌ Extra element
type T5 = LiteralList<['a', 'e'], 'a' | 'b'>;
//=> '(a | b)[], Type [a, e] has extra members: [e]'
```

@example
```
import type {LiteralList} from 'type-fest';

type Union = 'a' | 'b' | 'c';

declare function literalList<const T extends UnknownArray>(
	list: LiteralList<T, Union>
): typeof list;

const C1 = literalList(['a', 'b', 'c'] as const);
//=> ['a', 'b', 'c']

const C2 = literalList(['c', 'a', 'b'] as const);
//=> ['c', 'a', 'b']

const C3 = literalList(['b', 'b', 'b'] as const); // ❌ Errors in Compiler and IDE
//=> '(a | b | c)[], Type [b, b, b] is missing members: [a, c]'
```

@category Type Guard
@category Utilities
*/
export type LiteralList<List extends UnknownArray, Shape extends UnknownArray | unknown> =
	IfNotAnyOrNever<List,
		_LiteralList<
			List, Shape,
			UnionToTuple<Shape>['length'],
			TupleAsString<List>,
			UnionAsString<Shape>
		>
	>;

/**
Internal comparison logic for {@link LiteralList `LiteralList`}.

Compares `T` and `U`:

 - Validates that the lengths match.
 - Then checks for extra or missing elements.
 - If mismatch found, returns a readable error string.

*/
type _LiteralList<
	T extends UnknownArray, U,
	ULength extends number,
	TString extends string,
	UString extends string,
> = (
	T['length'] extends ULength // U.length != number, T always finite
		? Exclude<T[number], U> extends infer TnU // T not U
			? Exclude<U, T[number]> extends infer UnT // U not T
				? IsNever<TnU> extends true // T includes U
					? IsNever<UnT> extends true // U includes T
						? T // T is U
						: never | `${UString}, Type ${TString} is missing members: ${TupleAsString<UnT>}`
					: never | `${UString}, Type ${TString} has extra members: ${TupleAsString<TnU>}`
				: never
			: never
		: never | `${UString}, Type ${TString} is not the required length of: ${ULength}`
);

export {};
