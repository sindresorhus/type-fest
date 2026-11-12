import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsLiteral} from './is-literal.d.ts';

/**
Create a record that maps each property value to its original keys.

Use-cases:
- Derive reverse lookups for protocol codes and command identifiers.
- Keep both directions of a mapping in sync with one declaration.

Values must be property keys and properties must be required; otherwise the result is `never`, including when any union member is invalid. Duplicate values produce a union of the original keys. This describes an inverse relation, not runtime overwrite order. If any value is non-literal, every resulting key maps to the union of all original keys, since their value domains can overlap. Branded values are unsupported.

The result is mutable even when the input is readonly. Distributes over unions of records. Returns `any` for `any` and `never` for `never`.

@example
```
import type {InvertRecord} from 'type-fest';

type StatusCodes = {ok: 200; missing: 404};
type StatusNames = InvertRecord<StatusCodes>;
//=> {200: 'ok'; 404: 'missing'}

type Aliases = InvertRecord<{primary: 'blue'; secondary: 'blue'}>;
//=> {blue: 'primary' | 'secondary'}
```

Key remapping makes values into keys and combines original keys when their values coincide.

@category Object
*/
export type InvertRecord<ObjectType extends object> = IfNotAnyOrNever<ObjectType, {
	ifNot: false extends HasPropertyKeyValues<ObjectType>
		? never
		: ObjectType extends unknown
			? IsLiteral<ObjectType[keyof ObjectType]> extends true
				? {-readonly [Key in keyof ObjectType as ObjectType[Key] & PropertyKey]: Key}
				: Record<ObjectType[keyof ObjectType] & PropertyKey, keyof ObjectType>
			: never;
}>;

/**
Validates each union member before combining the results, so a broad member cannot hide invalid values.
*/
type HasPropertyKeyValues<ObjectType extends object> = ObjectType extends Record<keyof ObjectType, PropertyKey> ? true : false;

export {};
