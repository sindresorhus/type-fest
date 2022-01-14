/**
Creates a type that mimics the structure of the specified type but replaces all the property values with a given type.

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
export type Schema<ObjectType, ValueType> = ObjectType extends string
	? ValueType
	: ObjectType extends Map<unknown, unknown>
	? ValueType
	: ObjectType extends Set<unknown>
	? ValueType
	: ObjectType extends ReadonlyMap<unknown, unknown>
	? ValueType
	: ObjectType extends ReadonlySet<unknown>
	? ValueType
	: ObjectType extends readonly unknown[]
	? ValueType
	: ObjectType extends unknown[]
	? ValueType
	: ObjectType extends (...arguments: unknown[]) => unknown
	? ValueType
	: ObjectType extends Date
	? ValueType
	: ObjectType extends Function
	? ValueType
	: ObjectType extends object
	? SchemaObject<ObjectType, ValueType>
	: ValueType;

/**
Same as `Schema`, but accepts only `object`s as inputs. Internal helper for `Schema`.
 */
type SchemaObject<ObjectType extends object, K> = {
	[KeyType in keyof ObjectType]: Schema<ObjectType[KeyType], K> | K;
};
