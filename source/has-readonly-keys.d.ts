import type {ReadonlyKeysOf} from './readonly-keys-of.d.ts';

/**
Creates a type that represents `true` or `false` depending on whether the given type has any readonly fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of readonly fields.

@example
```
import type {HasReadonlyKeys, ReadonlyKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasReadonlyKeys<Entity> extends true
		? (field: ReadonlyKeysOf<Entity>) => Promise<void>
		: never
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gCQIYGcBKK2AJhAHYA2iA0iorgDRyEnlW30DyAZgL5zcoEEHADkSVAFpuKXDFEBuAFBKJaAKphi2GCgDKKKADdgAYxQAeAKJkYwJHBQAPXWWK44EAEYArFKZgAPjgAXgwlAEgoFBAIIxQAMWAUCmIALjgcAiJSSho6XGtbe0Rg51d3BCgAVxRIiIB+OAAKbmTUjJZc9gKeIrskQIBKUOCABSEQYFxLIwhgYkD6jLIUeKglXiA)

@category Utilities
*/
export type HasReadonlyKeys<BaseType extends object> = ReadonlyKeysOf<BaseType> extends never ? false : true;

export {};
