import type {IsEqual} from './is-equal.d.ts';

/**
Returns a boolean for whether the given type has any readonly fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of readonly fields.

@example
```
import type {HasReadonlyKeys, ReadonlyKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasReadonlyKeys<Entity> extends true
		? (field: ReadonlyKeysOf<Entity>) => Promise<void>
		: never;
};
```

@category Utilities
*/
export type HasReadonlyKeys<BaseType extends object> = (
	BaseType extends unknown // For distributing `BaseType`
		// Identity remapping compares array properties without rebuilding an array wrapper.
		? IsEqual<{[Key in keyof BaseType as Key]: BaseType[Key]}, {-readonly [Key in keyof BaseType as Key]: BaseType[Key]}> extends true
			? never
			: true
		: never
) extends never ? false : true;

export {};
