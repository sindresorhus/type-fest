import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';

/**
Returns a boolean for whether the given type is a `string` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

The implementation of this type is inspired by the trick mentioned in this [StackOverflow answer](https://stackoverflow.com/a/68261113/420747).

@example
```
import type {IsStringLiteral} from 'type-fest';

type A = IsStringLiteral<'foo'>;
//=> true

type B = IsStringLiteral<string>;
//=> false

// String types with infinite set of possible values return `false`
type C = IsStringLiteral<`on${string}`>;
//=> false

type D = IsStringLiteral<Uppercase<string>>;
//=> false

type E = IsStringLiteral<'foo' | 'bar' | 'baz'>;
//=> true

type F = IsStringLiteral<'sm' | 'md' | 'lg' | `${number}px`>;
//=> boolean
```

@example
```
import type {IsStringLiteral} from 'type-fest';

type StringLength<S extends string, Counter extends never[] = []> =
	IsStringLiteral<S> extends true
		? S extends `${string}${infer Tail}`
			? StringLength<Tail, [...Counter, never]>
			: Counter['length']
		: number; // return `number` for non-literal string types

type L1 = StringLength<'foobar'>;
//=> 6

type L2 = StringLength<Lowercase<string>>;
//=> number

type L3 = StringLength<`${number}`>;
//=> number
```

@category Type Guard
@category Utilities
*/
export type IsStringLiteral<S> = IfNotAnyOrNever<S, {
	ifNot: _IsStringLiteral<CollapseLiterals<UnwrapBrand<S>>>;
	ifAny: false;
	ifNever: false;
}>;

type _IsStringLiteral<S> =
	// If `S` is an infinite string type (e.g., `on${string}`), `Record<S, never>` produces an index signature,
	// and since `{}` extends index signatures, the result becomes `false`.
	S extends string
		? {} extends Record<S, never>
			? false
			: true
		: false;

export {};
