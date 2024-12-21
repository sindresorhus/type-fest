import type {Simplify} from './simplify';

type SetFieldTypeOptions = {
	/**
	Preserve optional and readonly modifiers for properties being updated.

	NOTE: Property modifiers will always be preserved for properties that are not being updated.

	@default true
	*/
	preservePropertyModifiers?: boolean;
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
	id: number;
	createdAt: Date;
	updatedAt: Date;
};

type MyModelApi = SetFieldType<MyModel, 'createdAt' | 'updatedAt', string>;
// {
// 	id: number;
// 	createdAt: string;
// 	updatedAt: string;
// }
```

@category Object
*/
export type SetFieldType<BaseType, Keys extends keyof BaseType, NewType, Options extends SetFieldTypeOptions = {preservePropertyModifiers: true}> =
	Simplify<{
		[P in keyof BaseType]: P extends Keys ? NewType : BaseType[P];
	} & (
		// `Record` is used to remove property modifiers
		Options['preservePropertyModifiers'] extends false ? Record<Keys, NewType> : unknown
	)>;
