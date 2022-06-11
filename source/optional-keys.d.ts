/**
Pick all optional keys from the given base type.

This is useful when you want to create a new type that contains different type values for the optional keys only

@example
```
import type {OptionalKeysOf, Except} from 'type-fest';

interface User {
  name: string;
  surname: string;

  luckyNumber?: number;
}

const REMOVE_FIELD = Symbol('remove field symbol');
type UpdateOperation<Entity extends object> = Except<Partial<Entity>, OptionalKeysOf<Entity>> & {
  [Key in OptionalKeysOf<Entity>]?: Entity[Key] | typeof REMOVE_FIELD;
};

const update1: UpdateOperation<User> = {
  name: 'Alice'
};

const update2: UpdateOperation<User> = {
  name: 'Bob',
  luckyNumber: REMOVE_FIELD
};
```

@category Utilities
 */
export type OptionalKeysOf<BaseType extends object> = Exclude<{
	[Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]>
		? never
		: Key
}[keyof BaseType], undefined>;

/**
Creates a type that represents `true` or `false` depending on the presence or absence of optional fields.

This is useful when you want to create an API whose behaviour depends on the presence or absence of optional fields.

@example
```
import type {HasOptionalKeys, OptionalKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
  removeField: HasOptionalKeys<Entity> extends true
    ? (field: OptionalKeysOf<Entity>) => Promise<void>
    : never
}
```

@category Utilities
 */
export type HasOptionalKeys<BaseType extends object> = OptionalKeysOf<BaseType> extends never ? false : true;
