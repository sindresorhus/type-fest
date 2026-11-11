import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {ValueOf} from './value-of.d.ts'; // For `@link`

/**
Extract all possible values for the given keys from a union of types.

Useful for reading member-specific properties of a discriminated union. Each key must exist in at least one member. Members without a selected key contribute nothing, while optional properties include `undefined`. This does not make the selected keys available on every member.

@example
```
import type {ValuesOfUnion} from 'type-fest';

type Result =
	| {status: 'success'; value: string}
	| {status: 'failure'; error: Error};

type Statuses = ValuesOfUnion<Result, 'status'>;
//=> 'success' | 'failure'

type SuccessValue = ValuesOfUnion<Result, 'value'>;
//=> string

type Payload = ValuesOfUnion<Result, 'value' | 'error'>;
//=> string | Error
```

Like {@link ValueOf}, this reads one level. It checks each key against each member's `keyof` separately, so a broad key such as `string` selects only members with a matching index signature. This also preserves precision when members have different index signatures. Prefer `ValueOf` for all values of an object or for a generic getter's return type.

@example
```
import type {ValueOf, ValuesOfUnion} from 'type-fest';

type Settings = Record<string, string> | {retries: number};

type IndexedValues = ValuesOfUnion<Settings, string>;
//=> string

type ValuesIncludingNamedProperties = ValueOf<Settings, string>;
//=> string | number
```

Keys follow TypeScript's `keyof` rules, without converting between numeric and string forms. An `any` input returns `any` for a non-`never` key. A `never` input or key returns `never`. Types with no keys, such as `unknown`, accept only a `never` key.

@see {@link KeysOfUnion}
@see {@link ValueOf}

@category Object
@category Union
*/
// Distribute over both members and keys to keep `AllUnionFields` index values precise. `ValueOf` also includes an undistributed read for generic getter assignability, which can mix values from unrelated index domains or include overlapping named properties.
export type ValuesOfUnion<Union, Key extends KeysOfUnion<Union>> =
	Union extends unknown ? Key extends keyof Union ? Union[Key] : never : never;

export {};
