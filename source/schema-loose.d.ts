/**
Create a deep version of another object type where property values are recursively replaced into a given value type.

Use-cases:
- Form validation: Define how each field should be validated.
- Form settings: Define configuration for input fields.
- Parsing: Define types that specify special behavior for specific fields.

@example
```
import type {SchemaLoose} from 'type-fest';

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

type UserMask = SchemaLoose<User, 'mask' | 'hide' | 'show'>;

const userMaskSettings: UserMask = {
	id: 'show',
	name: {
		firstname: 'show',
		lastname: 'mask',
	},
	created: 'show',
	active: 'show',
	passwordHash: 'hide',
}
```

@category Object
*/
export type SchemaLoose<ObjectType, ValueType> = ObjectType extends string
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
							: ObjectType extends (...arguments_: unknown[]) => unknown
								? ValueType
								: ObjectType extends Date
									? ValueType
									: ObjectType extends Function
										? ValueType
										: ObjectType extends RegExp
											? ValueType
											: ObjectType extends object
												? SchemaLooseObject<ObjectType, ValueType>
												: ValueType;

/**
Same as `SchemaLoose`, but accepts only `object`s as inputs. Internal helper for `SchemaLoose`.
*/
type SchemaLooseObject<ObjectType extends object, K> = {
	[KeyType in keyof ObjectType]: SchemaLoose<ObjectType[KeyType], K> | K;
};
