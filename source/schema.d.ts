/**
Creates a type that mimics the structure of the specified type but replaces all the property values with a string-type.

Use-cases:
- Form validation, specify on every field how it should be validated.
- Form settings, specify configuration for input field.
- Provide types that allow specifying settings/behavior to types when e.g masking or parsing data.

@example
```
import {Schema} from 'type-fest';

interface User {
  id: string;
  name: {
    firstname: string;
    lastname: string;
  };
  created: Date;
  active: boolean;
  passwordHash: string;
}

type UserMask = Schema<User, 'mask' | 'hide' | 'show'>;

const userMaskSettings: UserMask = {
  id: 'show',
  name: {
    firstname: 'show',
    lastname: 'mask',
  },
  phoneNumbers: 'mask',
  created: 'show',
  active: 'show',
  passwordHash: 'hide',
}

```

@category Utilities
*/
export type Schema<TObject, ValueType> = TObject extends string
  ? ValueType
  : TObject extends Map<unknown, unknown>
  ? ValueType
  : TObject extends Set<unknown>
  ? ValueType
  : TObject extends ReadonlyMap<unknown, unknown>
  ? ValueType
  : TObject extends ReadonlySet<unknown>
  ? ValueType
  : TObject extends readonly unknown[]
  ? ValueType
  : TObject extends unknown[]
  ? ValueType
  : TObject extends (...arguments: unknown[]) => unknown
  ? ValueType
  : TObject extends Date
  ? ValueType
  : TObject extends Function
  ? ValueType
  : TObject extends object
  ? SchemaObject<TObject, ValueType>
  : ValueType;

/**
Same as `Schema`, but accepts only `object`s as inputs. Internal helper for `Schema`.
 */
type SchemaObject<ObjectType extends object, K> = {
	[KeyType in keyof ObjectType]: Schema<ObjectType[KeyType], K> | K;
};
