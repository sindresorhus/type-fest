import type {WritableKeysOf} from './writable-keys-of.d.ts';

/**
Creates a type that represents `true` or `false` depending on whether the given type has any writable fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of writable fields.

@example
```
import type {HasWritableKeys, WritableKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasWritableKeys<Entity> extends true
		? (field: WritableKeysOf<Entity>) => Promise<void>
		: never
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gCQIYGcDqUwM2ARgDYoDSKiuANHIcWZTXQPIBmAvnF1Agg4AciSoAtFxS4YIgNwAoReLQBVMABNsMFAGUUUAG7AAxigA8AUQB2MYojgoAHrpubccCKQBWKUzAAfHAAvBiKAJBQKCAQRigAYsAo5JoAXHA4BEQkFNS0uNZ2DsEubh4IUACuKJERAPxwABRcyakZzLlsBdxF9kiBAJShwQAKgiDAuJZGEMCagXUZNijxUIo8QA)

@category Utilities
*/
export type HasWritableKeys<BaseType extends object> = WritableKeysOf<BaseType> extends never ? false : true;

export {};
