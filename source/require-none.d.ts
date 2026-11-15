import type {Except} from './except.d.ts'; // For `@link`
import type {ExclusifyUnion} from './exclusify-union.d.ts'; // For `@link`
import type {MergeExclusive} from './merge-exclusive.d.ts'; // For `@link`

/**
Create an object type that forbids the given keys, to intersect with another object type.

Use it to reject removed options, or to forbid keys on a generic object type, which {@link Except} cannot do because it only accepts keys of the object type. This does not remove properties from the other type.

Uses optional `never` properties. With `exactOptionalPropertyTypes` enabled, named keys cannot be supplied, even as `undefined`.

@example
```
import type {RequireNone} from 'type-fest';

type DeprecatedOptions = RequireNone<'legacyMode' | 'callback'>;
//=> {legacyMode?: never; callback?: never}

type Options = {url: string} & DeprecatedOptions;

const options: Options = {url: 'https://example.com'};

// @ts-expect-error
const deprecated: Options = {url: 'https://example.com', legacyMode: true};
```

@example
```
import type {RequireNone} from 'type-fest';

// The database creates the `id`, so a new row must not have one.
declare function insert<Row extends object>(row: Row & RequireNone<'id'>): void;

insert({name: 'Alice'});

// @ts-expect-error
insert({id: 1, name: 'Alice'});
```

Note: `RequireNone<never>` produces `{}`, which does not enforce an empty object. Broad keys (`string`, `number`, `symbol`, or template literal patterns) produce index signatures that allow `undefined` values. Properties absent from a value's static type cannot be checked.

@see {@link Except} with `{requireExactProps: true}` to remove keys from an object type and forbid them.
@see {@link MergeExclusive} or {@link ExclusifyUnion} to make object types mutually exclusive.

@category Object
*/
export type RequireNone<KeysType extends PropertyKey> = {[Key in KeysType]?: never};

export {};
