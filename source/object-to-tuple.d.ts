import type {ExactKey} from './exact-key.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {TupleToObject} from './tuple-to-object.d.ts'; // For `@link`

/**
Convert an object with consecutive numeric keys starting at zero into a tuple.

Useful for recovering ordered parameter or schema types after transforming the properties of an object created with {@link TupleToObject}.

The object must have a finite set of required, consecutive keys, with no extra properties. Non-negative integer keys and their canonical string forms (such as `0` and `'0'`) are accepted. Unsupported objects, including arrays and objects with index signatures or optional properties, produce `never`. An object type with no known keys produces `[]`, including the broad `object` type.

The result is mutable, even for readonly properties. Property value types are preserved without recursive conversion. Distributes over object unions, discarding unsupported members; `any` produces `any` and `never` produces `never`.

@example
```
import type {ObjectToTuple} from 'type-fest';

type ParameterSchema = {0: {type: string}; 1: {type: number}};
type ParameterTypes = {[Key in keyof ParameterSchema]: ParameterSchema[Key]['type']};
type Arguments = ObjectToTuple<ParameterTypes>;
//=> [string, number]

type ReadonlyProperties = ObjectToTuple<{readonly '0': string; readonly '1': boolean}>;
//=> [string, boolean]

type MissingPosition = ObjectToTuple<{0: string; 2: boolean}>;
//=> never
```

@category Object
@category Array
*/
export type ObjectToTuple<ObjectType extends object> = IsAny<ObjectType> extends true
	? any
	: ObjectType extends unknown
		? ObjectToTupleHelper<ObjectType>
		: never;

// Consume the next required position until no keys remain. A missing position or an extra key rejects the whole object.
type ObjectToTupleHelper<ObjectType extends object, Result extends unknown[] = [], Key extends keyof ObjectType = ExactKey<ObjectType, Result['length']>> =
	[keyof ObjectType] extends [never]
		? Result
		: [Key] extends [never]
			? never
			// Require a declared position: optional properties and index signatures alone do not guarantee this key exists. An index signature would otherwise prevent recursion from making progress.
			: ObjectType extends Record<Key, unknown>
				? ObjectToTupleHelper<Omit<ObjectType, Result['length'] | `${Result['length']}`>, [...Result, ObjectType[Key]]>
				: never;

export {};
