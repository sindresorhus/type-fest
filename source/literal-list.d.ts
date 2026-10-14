import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {UnionLength} from './union-length.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Join} from './join.d.ts';
import type {JoinableItem} from './internal/string.d.ts';
import type {JoinUnion} from './join-union.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsUnion} from './is-union.d.ts';

/**
Convert a tuple or union type into a string representation. Used for readable error messages.

@example
```
type T1 = TypeAsString<['a', 'b'], ', ', ['[', ']']>;
//=> '[a, b]'

type T2 = TypeAsString<'a' | 'b', ' | '>;
//=> 'a | b'
```
*/
// TODO: Make a separate `Stringify` type
type TypeAsString<Value, Separator extends string = ',', Wrapper extends [string, string] = ['', '']> =
	`${Wrapper[0]}${
		[Value] extends [readonly JoinableItem[]] // TODO: add `JoinableArray` type
			? IsUnion<Value> extends true
				? JoinUnion<`[${Join<Value, ', '>}]`, Separator>
				: Join<Value, Separator>
			: [Value] extends [JoinableItem]
				? JoinUnion<Value, Separator>
				: '...' // Too complex
	}${Wrapper[1]}`;

/**
Stringify a tuple as `'[a, b]'`.
*/
type TupleAsString<Tuple> = TypeAsString<Tuple, ', ', ['[', ']']>;

/**
Enforces that a tuple contains exactly the members of a union type, with no duplicates or omissions.

Returns the tuple if it is valid. Otherwise, returns an error message as a string literal type, so a value of the tuple type is not assignable to it and the message shows in the type error.

The order of the elements does not matter.

Use-cases:
- Make sure a list of options includes every member of a union, like all form field names or all enum values.
- Define static configuration or table headers that match a union.

@example
```
import type {LiteralList} from 'type-fest';

type T1 = LiteralList<['b', 'a'], 'a' | 'b'>;
//=> ['b', 'a']

type T2 = LiteralList<['a', 'b', 'c'], 'a' | 'b'>;
//=> 'Type [a, b, c] is not the required length of: 2'

type T3 = LiteralList<['a', 'a'], 'a' | 'b'>;
//=> 'Type [a, a] is missing members: [b]'

type T4 = LiteralList<['a', 'c'], 'a' | 'b'>;
//=> 'Type [a, c] has extra members: [c]'
```

To validate a value, use it in a function with a `const` type parameter. Intersect the parameter type with the type parameter, so TypeScript infers literal types without `as const`.

@example
```
import type {LiteralList, UnknownArray} from 'type-fest';

type Action = 'create' | 'update' | 'delete';

function actionList<const List extends UnknownArray>(list: List & LiteralList<List, Action>) {
	return list;
}

const actions = actionList(['update', 'create', 'delete']);
//=> readonly ['update', 'create', 'delete']

// @ts-expect-error
actionList(['create', 'update', 'update']);
// Error: … is not assignable to parameter of type '… & "Type [create, update, update] is missing members: [delete]"'.
```

@category Array
*/
export type LiteralList<List extends UnknownArray, Union> =
	IfNotAnyOrNever<List, {
		ifNot: List extends unknown // Check each tuple of a union separately
			? _LiteralList<
				List,
				Union,
				UnionLength<Union>,
				TupleAsString<List>
			>
			: never;
	}>;

/**
Compares the tuple with the union. Checks the length first, then checks for union elements, and then for extra and missing members.
*/
type _LiteralList<
	List extends UnknownArray,
	Union,
	Length extends number,
	ListString extends string,
> =
	List['length'] extends Length // `Length` is never `number`, so this also rejects arrays that are not fixed-length tuples
		? true extends {[Index in keyof List]: IsUnion<List[Index]>}[number] // An element like `'a' | 'b'` could hide duplicates
			? 'Each element must be a single member of the union'
			: Exclude<List[number], Union> extends infer Extra // Elements that are not in the union
				? Exclude<Union, List[number]> extends infer Missing // Union members that are not in the tuple
					? IsNever<Extra> extends true
						? IsNever<Missing> extends true
							? List // The tuple has exactly the union members
							: `Type ${ListString} is missing members: ${TupleAsString<Missing>}`
						: `Type ${ListString} has extra members: ${TupleAsString<Extra>}`
					: never
				: never
		: `Type ${ListString} is not the required length of: ${Length}`;

export {};
