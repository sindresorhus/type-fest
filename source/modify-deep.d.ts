import type {_MergeDeep, MergeDeep, MergeDeepOptions} from './merge-deep.d.ts';
import type {Modify} from './modify.d.ts'; // For `@link`

/**
Recursively create a type from an object type and a modifier type, where keys of the modifier type override keys of the object type, and keys with the `never` type are removed from the result.

This is like {@link MergeDeep}, but keys whose merged value is `never` are removed from processed records, instead of producing a property of type `never`, which can never be set and would make the type impossible to construct. A key with an optional `never` type is kept, because its value type is `never | undefined`, not `never`.

Object properties are merged recursively, and `never` keys are also removed from copied plain objects. Arrays and tuples follow the {@link MergeDeepOptions options}: only object elements that participate in recursive merging have keys removed. Copied or replaced arrays, including unmatched tuple elements and additional array properties, are kept unchanged. This preserves untouched recursive tuple values without traversing their elements.

Use {@link Modify} for a top-level-only version.

Known limitations:
- A `never` array or tuple element type is kept, because its position is a fixed part of the shape.
- Recursively merging recursive tuple types may cause excessive type instantiation, like with {@link MergeDeep}.
- Copied built-in values such as `Date`, `Map`, `Set`, functions, and thenables are left unchanged. Thenables merged as records follow the normal key-removal rules.
- A shared index signature cannot be removed by a modifier index signature with the `never` value type. `MergeDeep` unions shared index-signature values before keys are removed, so the destination value type remains.

@example
```
import type {ModifyDeep} from 'type-fest';

type Foo = {
	a: string;
	b: {
		c: number;
		d: boolean;
	};
};

type Bar = {
	a: number; // Overrides Foo['a']
	b: {
		c: never; // Removes Foo['b']['c']
		e: symbol;
	};
};

type Baz = ModifyDeep<Foo, Bar>;
//=> {a: number; b: {d: boolean; e: symbol}}
```

@example
```
import type {ModifyDeep} from 'type-fest';

type Destination = {items: Array<{id: string; obsolete: string}>};
type Modifier = {items: Array<{obsolete: never}>};

type Replaced = ModifyDeep<Destination, Modifier>;
//=> {items: {obsolete: never}[]}

type Modified = ModifyDeep<Destination, Modifier, {recurseIntoArrays: true}>;
//=> {items: {id: string}[]}
```

@see {@link MergeDeep}
@see {@link Modify}
@see {@link MergeDeepOptions}
@category Object
*/
export type ModifyDeep<
	Destination,
	Source,
	Options extends MergeDeepOptions = {},
> =
	// Post-merge cleanup eagerly expanded recursive tuples even through aliases, interfaces, `infer`, or spreads. Lazy object views broke tuple inference, and cycle/depth guards would leave deeper keys unprocessed, so removal happens during merging instead.
	_MergeDeep<Destination, Source, true, Options>;

export {};
