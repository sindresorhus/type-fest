import type {ConditionalExcept} from './conditional-except.d.ts';
import type {Merge} from './merge.d.ts';
import type {ModifyDeep} from './modify-deep.d.ts'; // For `@link`

/**
Create a type from an object type and a modifier type, where keys of the modifier type override keys of the object type, and keys with the `never` type are removed from the result.

This is like {@link Merge}, but a key of the modifier type with the `never` type removes that key from the result, instead of producing a property of type `never`, which can never be set and would make the type impossible to construct. A key with an optional `never` type is kept, because its value type is `never | undefined`, not `never`.

All other {@link Merge} behavior is unchanged: the result is flattened, unions are distributed, and modifiers and index signatures are kept. Arrays and tuples are combined position by position, and a `never` element keeps its position, because it is a fixed part of the shape.

Use {@link ModifyDeep} to merge and remove keys at every nesting level.

Known limitations:
- Like {@link Merge}, this merges at the top level only; nested objects are replaced, not merged.
- The call signature of a function type is not preserved. Use {@link Merge} when you need to keep one.
- When the result is an array or tuple, no `never` key is removed: the merged array is kept as it is, including a `never` property added by a modifier, because removing a key would turn the tuple into a plain object.

@example
```
import type {Modify} from 'type-fest';

type Foo = {
	a: string;
	b: number;
	c: boolean;
};

type Bar = {
	b: string; // Overrides Foo['b']
	c: never; // Removes Foo['c']
	d: symbol;
};

type Baz = Modify<Foo, Bar>;
//=> {a: string; b: string; d: symbol}
```

@see {@link Merge}
@see {@link ModifyDeep}
@category Object
*/
export type Modify<Destination, Source> = Merge<Destination, Source> extends infer Merged
	? Merged extends readonly unknown[]
		// `ConditionalExcept` would drop a `never` element key and turn the tuple into a plain object, so an array or tuple is kept as it is. Its element positions are a fixed part of the shape.
		? Merged
		// `ConditionalExcept` drops the call signature of a callable type. It could be restored with `CallSignatureOf<Merged> & ...`, but that leaves a `& {}` residue when every property is removed, and modifying a callable type is rare, so it stays a documented limitation.
		: ConditionalExcept<Merged, never>
	: never;

export {};
