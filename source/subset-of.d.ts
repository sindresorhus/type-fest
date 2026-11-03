import type {Exact} from './exact.d.ts'; // For `@link`
import type {ExtendsStrict} from './extends-strict.d.ts'; // For `@link`
import type {ExtractStrict} from './extract-strict.d.ts'; // For `@link`
import type {IsMutuallyAssignable} from './is-mutually-assignable.d.ts'; // For `@link`

/**
Constrain a type to be a subset of another type, returning it as is.

This is the type-level equivalent of the `satisfies` operator for type aliases. TypeScript does not support `satisfies` in type declarations and [is unlikely to add it](https://github.com/microsoft/TypeScript/issues/52222), since a constrained helper type like this one is the recommended workaround.

Use-cases:
- Define a config type that must stay assignable to a base type, with an error as soon as it is not.
- Restrict a union to an allowed subset of another union.

@example
```
// Valid Examples
import type {SubsetOf} from 'type-fest';

type AllowedValues = 'foo' | 'bar' | 'baz';

type RestrictedValues = SubsetOf<AllowedValues, 'foo' | 'bar'>;
//=> 'foo' | 'bar'

type BaseConfig = {
	status: 'enabled' | 'disabled';
	retries: number | 'auto';
};

type ServerConfig = SubsetOf<BaseConfig, {
	status: 'enabled';
	retries: number;
}>;
//=> {status: 'enabled'; retries: number}
```

@example
```
// Invalid Examples
import type {SubsetOf} from 'type-fest';

// `'baz'` and `'qux'` are not part of `'foo' | 'bar'`
// @ts-expect-error
type NotASubset = SubsetOf<'foo' | 'bar', 'baz' | 'qux'>;
//                                        ~~~~~~~~~~~~~
// Error: Type '"baz" | "qux"' does not satisfy the constraint '"foo" | "bar"'.

// `retries` is missing
// @ts-expect-error
type MissingProperty = SubsetOf<{status: string; retries: number}, {status: string}>;
//                                                                 ~~~~~~~~~~~~~~~~
// Error: Type '{ status: string; }' does not satisfy the constraint '{ status: string; retries: number; }'.
```

Note: Assignability allows extra properties, so unlike the `satisfies` operator, excess properties are not rejected. Use {@link Exact} to reject excess properties.

Note: Assignability treats `any` as compatible with every type except `never`: `any` as the target accepts every type, and `any` as the value is accepted by every target except `never`. `never` as the value is accepted by every target, since it is the empty subset. Only `never` itself is a subset of a `never` target.

@see {@link ExtendsStrict} to check assignability as a boolean instead of constraining a type.
@see {@link IsMutuallyAssignable} to check assignability in both directions as a boolean.
@see {@link ExtractStrict} to filter the members of a type that match another type.

@category Utilities
*/
export type SubsetOf<Target, Value extends Target> = Value;

export {};
