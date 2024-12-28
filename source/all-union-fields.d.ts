import type {NonRecursiveType, ReadonlyKeysOfUnion, ValueOfUnion} from './internal';
import type {KeysOfUnion} from './keys-of-union';
import type {SharedUnionFields} from './shared-union-fields';
import type {Simplify} from './simplify';
import type {UnknownArray} from './unknown-array';

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
	//  catType?: string;
	//  dogType?: string;
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
export type AllUnionFields<Union> = [Union] extends [NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | UnknownArray]
	? Union
	: Simplify<
	SharedUnionFields<Union> &
	{
		readonly [P in ReadonlyKeysOfUnion<Union>]?: ValueOfUnion<Union, P>;
	} & {
		[P in Exclude<KeysOfUnion<Union>, ReadonlyKeysOfUnion<Union> | keyof Union>]?: ValueOfUnion<Union, P>;
	}
	>;
