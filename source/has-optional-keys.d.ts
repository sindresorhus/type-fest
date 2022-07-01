import {OptionalKeysOf} from './optional-keys-of';

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
