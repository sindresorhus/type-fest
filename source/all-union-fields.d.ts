import type {IsUnion, NonRecursiveType} from './internal';
import type {ReadonlyKeysOf} from './readonly-keys-of';
import type {SharedUnionFields} from './shared-union-fields';
import type {Simplify} from './simplify';
import type {TupleToUnion} from './tuple-to-union';
import type {UnionToTuple} from './union-to-tuple';
import type {UnknownArray} from './unknown-array';

/**
AllUnionFields options.

@see {@link AllUnionFields}
*/
export type AllUnionFieldsOptions = {
	/**
	When set to true, we assume no properties other than what is declared on each object in the union exist.

	@default false
 	*/
	exact?: boolean;
};

/**
Create a type with all fields from a union of object types.

Use-cases:
- You want a safe object type where each key exists in the union object.

@example
```
import type {AllUnionFields} from 'type-fest';

type Cat = {
	name: string;
	type: 'cat';
	catType: string;
};

type Dog = {
	name: string;
	type: 'dog';
	dogType: string;
};

function displayPetInfo(petInfo: Cat | Dog) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat';
	// 	catType: string;
	// } | {
	// 	name: string;
	// 	type: 'dog';
	// 	dogType: string;
	// }

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);

	// TypeScript complains about `catType` and `dogType` not existing on type `Cat | Dog`.
	console.log('animal type: ', petInfo.catType ?? petInfo.dogType);
}

function displayPetInfo(petInfo: AllUnionFields<Cat | Dog>) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat' | 'dog';
	//  catType?: unknown;
	//  dogType?: unknown;
	// }

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);

	// No TypeScript error.
	console.log('animal type: ', petInfo.catType ?? petInfo.dogType);
}
```

@see SharedUnionFields

@category Object
@category Union
*/
export type AllUnionFields<
	Union,
	Options extends AllUnionFieldsOptions = {exact: false},
> =
	// If `Union` is not a union type, return `Union` directly.
	IsUnion<Union> extends false
		? Union
		: // `Union extends` will convert `Union`
	// to a [distributive conditionaltype](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
	// But this is not what we want, so we need to wrap `Union` with `[]` to prevent it.
		[Union] extends [
			| NonRecursiveType
			| ReadonlyMap<unknown, unknown>
			| ReadonlySet<unknown>
			| UnknownArray,
		]
			? Union
			: [Union] extends [object]
				? Simplify<
				SharedUnionFields<Union> &
				NonSharedUnionFields<UnionToTuple<Union>, keyof Union, Options>
				>
				: Union;

type NonSharedUnionFields<
	Tuple,
	SharedKeys,
	Options extends AllUnionFieldsOptions,
> = NonSharedUnionFieldsHelper<
Tuple,
Exclude<KeysOfEach<Tuple>, ReadonlyKeysOfEach<Tuple> | SharedKeys>,
Exclude<ReadonlyKeysOfEach<Tuple>, SharedKeys>,
Options
>;

type NonSharedUnionFieldsHelper<
	Tuple,
	NonReadonlyKeys extends PropertyKey,
	ReadonlyKeys extends PropertyKey,
	Options extends AllUnionFieldsOptions,
> = {
	[Key in NonReadonlyKeys]?: ValueOfEach<Tuple, Key, Options>;
} & {
	readonly [Key in ReadonlyKeys]?: ValueOfEach<Tuple, Key, Options>;
};

type KeysOfEach<Tuple> = TupleToUnion<{
	[Index in keyof Tuple]: keyof Tuple[Index];
}>;

type ReadonlyKeysOfEach<Tuple> = TupleToUnion<{
	[Index in keyof Tuple]: ReadonlyKeysOf<Tuple[Index]>;
}>;

type ValueOfEach<
	Tuple,
	Key,
	Options extends AllUnionFieldsOptions,
> = Options['exact'] extends true
	? TupleToUnion<{
		[Index in keyof Tuple]: Key extends keyof Tuple[Index]
			? Tuple[Index][Key]
			: never;
	}>
	: unknown;
