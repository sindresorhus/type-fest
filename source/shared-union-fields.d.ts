import type {NonRecursiveType, IsUnion} from './internal';
import type {IsNever} from './is-never';
import type {UnknownArray} from './unknown-array';

/**
Create a type with shared fields from a union of object types.

Use-cases:
- You want a safe object type where each key exists in the union object.
- You want to focus on the common fields of the union type and don't want to have to care about the other fields.

@example
```
import type {SharedUnionFields} from 'type-fest';

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
	// 	catType: string; // Needn't care about this field, because it's not a common pet info field.
	// } | {
	// 	name: string;
	// 	type: 'dog';
	// 	dogType: string; // Needn't care about this field, because it's not a common pet info field.
	// }

	// petInfo type is complex and have some needless fields

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);
}

function displayPetInfo(petInfo: SharedUnionFields<Cat | Dog>) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat' | 'dog';
	// }

	// petInfo type is simple and clear

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);
}
```

@see SharedUnionFieldsDeep

@category Object
@category Union
*/
export type SharedUnionFields<Union> =
// If `Union` is not a union type, return `Union` directly.
IsUnion<Union> extends false
	? Union
	// `Union extends` will convert `Union`
	// to a [distributive conditionaltype](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
	// But this is not what we want, so we need to wrap `Union` with `[]` to prevent it.
	: [Union] extends [NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | UnknownArray]
		? Union
		: [Union] extends [object]
			// `keyof Union` can extract the same key in union type, if there is no same key, return never.
			? keyof Union extends infer Keys
				? IsNever<Keys> extends false
					? {
						[Key in keyof Union]: Union[Key]
					}
					: {}
				: Union
			: Union;
