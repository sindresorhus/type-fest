import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {ApplyDefaultOptions, SimplifyObject} from './internal/index.d.ts';

export type SetFieldTypeOptions = {
	/**
	Preserve optional and readonly modifiers for properties being updated.

	NOTE: Property modifiers will always be preserved for properties that are not being updated.

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
	_SetFieldType<BaseType, Keys, NewType, ApplyDefaultOptions<SetFieldTypeOptions, DefaultSetFieldTypeOptions, Options>>;

type _SetFieldType<BaseType, Keys, NewType, Options extends Required<SetFieldTypeOptions>> =
	// The distribution comes first, so that a member the keys do not reach is left as it is. Otherwise the `Record` below hands it a key it never had, as a required one when the modifiers are not preserved.
	BaseType extends unknown
		? SimplifyObject<{
			// A tuple is keyed by a number, but a homomorphic mapped type hands its elements over under their string form, so `P extends Keys` would compare `"0"` against `0` and never match. Both forms of a key are therefore accepted.
			[P in keyof BaseType]: P extends Keys
				? NewType
				: P extends string | number | bigint | boolean | null | undefined
					? `${P}` extends `${Keys & (string | number)}`
						? NewType
						: BaseType[P]
					: BaseType[P];
		} & (
			// `Record` is used to remove property modifiers. A tuple is left out of it: `Record` over `number` answers with every member an array has, which is not a tuple.
			Options['preservePropertyModifiers'] extends false
				? BaseType extends readonly unknown[]
					? unknown
					: Record<Keys & keyof BaseType & PropertyKey, NewType>
				: unknown
		)>
		: never; // Should never happen

export {};
