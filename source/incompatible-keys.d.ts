import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {TupleToObject} from './tuple-to-object.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ConditionalKeys} from './conditional-keys.d.ts'; // For `@link`

/**
Get the keys that both types have, where the property in `Source` is not assignable to the property in `Target`.

Useful for finding the fields that need a conversion when you map one type to another, for example in a schema migration or an API adapter.

The check runs one way: a narrower source property (`1` to `number`) is compatible, but a wider one (`number` to `1`) is not. It follows the normal assignability rules, so an optional source property is incompatible with a required target property, and `readonly` is ignored. Keys that only one of the types has are not included. The check is shallow, so a nested object is reported by its top-level key.

A union `Source` gives the incompatible keys of each member. Tuples are compared by their indices. A number key and its string form (`0` and `'0'`) are not matched with each other.

To get the keys whose value matches one fixed type, use {@link ConditionalKeys}.

@example
```
import type {IncompatibleKeys} from 'type-fest';

type UserRow = {id: string; age: string; createdAt: string};
type User = {id: string; age: number; createdAt: Date; name: string};

type KeysToConvert = IncompatibleKeys<UserRow, User>;
//=> 'age' | 'createdAt'

type Narrowing = IncompatibleKeys<{status: 'active'}, {status: string}>;
//=> never

type Widening = IncompatibleKeys<{status: string}, {status: 'active'}>;
//=> 'status'

type OptionalToRequired = IncompatibleKeys<{name?: string}, {name: string}>;
//=> 'name'
```

@category Object
*/
export type IncompatibleKeys<Source extends object, Target extends object> =
	Source extends unknown // Distribute over `Source`, but compare each member with the whole `Target`
		? _IncompatibleKeys<ArrayToObject<Source>, ArrayToObject<Target>>
		: never;

// Remove the array methods, so that only the indices are compared.
type ArrayToObject<Type> = Type extends UnknownArray ? TupleToObject<Type> : Type;

// An index signature widens `keyof` (for example, `string` becomes `string | number`), which swallows the declared literal keys it covers. So the declared keys are checked a second time on their own. Gather declared target keys from all union members before filtering to shared keys.
type _IncompatibleKeys<Source, Target> =
	| _CheckKeys<Source, Target, keyof Source & keyof Target>
	| _CheckKeys<Source, Target, (keyof OmitIndexSignature<Source> | KeysOfUnion<OmitIndexSignature<Target>>) & keyof Source & keyof Target>;

// Compare one-property objects instead of the values, so that the optional modifier is also checked.
type _CheckKeys<Source, Target, Keys> = Keys extends keyof Source & keyof Target
	? Pick<Source, Keys> extends Pick<Target, Keys>
		? never
		: Keys
	: never;

export {};
