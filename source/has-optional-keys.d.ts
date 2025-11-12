import type {OptionalKeysOf} from './optional-keys-of.d.ts';

/**
Creates a type that represents `true` or `false` depending on whether the given type has any optional fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of optional fields.

@example
```
import type {HasOptionalKeys, OptionalKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasOptionalKeys<Entity> extends true
		? (field: OptionalKeysOf<Entity>) => Promise<void>
		: never
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gCQIYGcDyYMwEAdtgDYDSKiuANHIcWZTXfgGYC+cnUEEHADkSVAFpOKXDGEBuAFAKxaAKpgAJthgoAyiigA3YAGMUAHgCipYkjgoAHjtIbccCACMAVihMwAfHAAvBgKAJBQKCAQhigAYsAoFBoAXHA4BEQk5NS0uFY2wEiBjs6uCFAArijhYQD8cAAUnInJaczZbHlcBbaI-gCUwYEACgIgwLgWhhDAGv61aaQosVAK3EA)

@category Utilities
*/
export type HasOptionalKeys<BaseType extends object> = OptionalKeysOf<BaseType> extends never ? false : true;

export {};
