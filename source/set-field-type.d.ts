import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {ApplyDefaultOptions, KeySelector, SelectedKeyAlias, SelectedKeys, SimplifyObject, UnwrapPathBrand} from './internal/index.d.ts';

export type SetFieldTypeOptions = {
	/**
	Preserve optional and readonly modifiers for properties being updated.

	NOTE: Property modifiers will always be preserved for properties that are not being updated.

	Known limitation: A numeric key that is selected in the other spelling (`'0'` for a key declared as `0`, or the reverse) gets the new type, but keeps its modifiers.

	@default true
	*/
	preservePropertyModifiers?: boolean;
};

type DefaultSetFieldTypeOptions = {
	preservePropertyModifiers: true;
};

/**
Create a type that changes the type of the given keys.

Use-cases:
- Creating variations of a base model.
- Fixing incorrect external types.

@see `Merge` if you need to change multiple properties to different types.

@example
```
import type {SetFieldType} from 'type-fest';

type MyModel = {
	readonly id: number;
	readonly createdAt: Date;
	updatedAt?: Date;
};

type MyModelApi1 = SetFieldType<MyModel, 'createdAt' | 'updatedAt', string>;
// {
// 	readonly id: number;
// 	readonly createdAt: string;
// 	updatedAt?: string;
// }

// `preservePropertyModifiers` option can be set to `false` if you want to remove property modifiers for properties being updated
type MyModelApi2 = SetFieldType<MyModel, 'createdAt' | 'updatedAt', string, {preservePropertyModifiers: false}>;
// {
// 	readonly id: number;
// 	createdAt: string; // no longer readonly
// 	updatedAt: string; // no longer optional
// }
```

@category Object
*/
export type SetFieldType<BaseType, Keys extends KeysOfUnion<BaseType>, NewType, Options extends SetFieldTypeOptions = {}> =
	_SetFieldType<BaseType, KeySelector<UnwrapPathBrand<Keys>>, NewType, ApplyDefaultOptions<SetFieldTypeOptions, DefaultSetFieldTypeOptions, Options>>;

type _SetFieldType<BaseType, Keys, NewType, Options extends Required<SetFieldTypeOptions>> =
	// The distribution comes first, so that a member the keys do not reach is left as it is. Otherwise the `Record` below hands it a key it never had, as a required one when the modifiers are not preserved.
	BaseType extends unknown
		? SimplifyObject<{
			// Tuple elements use string indices, so look up their canonical numeric aliases in the selector, which matches each union member by its own spelling. Other numeric-looking names, like '01', stay distinct.
			[P in keyof BaseType]: P extends SelectedKeys<BaseType, Keys>
				? NewType
				: [SelectedKeyAlias<Keys, P>] extends [never]
					? BaseType[P]
					: NewType;
		} & (
			// `Record` is used to remove property modifiers. Matching declared spellings are added without replacing the original selector, so autocomplete unions retain their known required members beside index signatures. A tuple is left out of it: `Record` over `number` answers with every member an array has, which is not a tuple.
			Options['preservePropertyModifiers'] extends false
				? BaseType extends readonly unknown[]
					? unknown
					: Record<SelectedKeys<BaseType, Keys> & PropertyKey, NewType>
				: unknown
		)>
		: never; // Should never happen

export {};
