import type {IsEqual} from './is-equal.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given type has any writable fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of writable fields.

@example
```
import type {HasWritableKeys, WritableKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasWritableKeys<Entity> extends true
		? (field: WritableKeysOf<Entity>) => Promise<void>
		: never;
};
```

@category Utilities
*/
export type HasWritableKeys<BaseType extends object> = IsAny<BaseType> extends true
	? true
	: (
		BaseType extends unknown // For distributing `BaseType`
			// Identity remapping compares array properties without rebuilding an array wrapper.
			? IsEqual<{[Key in keyof BaseType as Key]: BaseType[Key]}, {readonly [Key in keyof BaseType as Key]: BaseType[Key]}> extends true
				? never
				: true
			: never
	) extends never ? false : true;

export {};
