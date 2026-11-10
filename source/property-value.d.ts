import type {ExactKey} from './exact-key.d.ts'; // For `@link`
import type {Get} from './get.d.ts'; // For `@link`
import type {ValueOf} from './value-of.d.ts'; // For `@link`

/**
Get the type of a property, or `never` if the key does not exist.

Useful for safe indexed access in a generic type, where `BaseType[Key]` is an error because the key may not exist. `BaseType` can be any type, including primitives and `unknown`.

A numeric key matches in both its number and string form, like in {@link ExactKey}. For example, `'0'` reads a `0` key, but `'00'` does not. The type of an optional property includes `undefined`.

A union of keys returns a union of the values, and keys that do not exist are ignored. For a union of base types, the key must exist in every member with the same spelling, otherwise the result is `never`. Use {@link ValueOf} to read a key that exists in only some members, and {@link Get} for key paths.

An `any` base type returns `any`. A `never`, `unknown`, `null`, `undefined`, or `void` base type returns `never`. A `never` key always returns `never`.

Note: An index outside the bounds of a fixed-length tuple returns `undefined`, not `never`.

@example
```
import type {PropertyValue} from 'type-fest';

type ErrorCode<ErrorType> = PropertyValue<ErrorType, 'code'>;

type A = ErrorCode<{code: 'ENOENT'; message: string}>;
//=> 'ENOENT'

type B = ErrorCode<Error>;
//=> never

type StatusMessages = {
	200: 'OK';
	'404': 'Not found';
};

type C = PropertyValue<StatusMessages, '200'>;
//=> 'OK'

type D = PropertyValue<StatusMessages, 404 | 500>;
//=> 'Not found'
```

@example
```
import type {PropertyValue, ValueOf} from 'type-fest';

type ApiResponse = {status: 'ok'; data: string[]} | {status: 'error'; message: string};

type Status = PropertyValue<ApiResponse, 'status'>;
//=> 'ok' | 'error'

type Data = PropertyValue<ApiResponse, 'data'>;
//=> never

// Read a property from only the union members that have it.
type SuccessData = ValueOf<ApiResponse, 'data'>;
//=> string[]
```

@see {@link ExactKey}
@see {@link ValueOf}
@see {@link Get}

@category Object
*/
export type PropertyValue<BaseType, Key extends PropertyKey> =
	Key extends keyof BaseType
		? PropertyValueOfUnion<BaseType, Key>
		: Key extends number
			? `${Key}` extends keyof BaseType
				? PropertyValueOfUnion<BaseType, `${Key}`>
				: never
			: Key extends `${infer NumberKey extends number}`
				// A numeric-looking string names a number key only when its spelling survives the conversion.
				? `${NumberKey}` extends Key
					? NumberKey extends keyof BaseType
						? PropertyValueOfUnion<BaseType, NumberKey>
						: never
					: never
				: never;

/**
Read `Key` from each member of a `BaseType` union. `Key` is resolved against the whole union, so it exists in every member. An undistributed read can widen a declared symbol property's value to `unknown` when another member has a symbol index signature.
*/
type PropertyValueOfUnion<BaseType, Key extends keyof BaseType> = BaseType extends unknown ? BaseType[Key] : never;

export {};
