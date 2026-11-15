import type {CollapseLiterals} from './collapse-literals.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsStringLiteral, _IsStringLiteral} from './is-string-literal.d.ts'; // `IsStringLiteral` is for `@link`.
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';

/**
Returns a boolean for whether the given type is a [template literal type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html): a `string` type with infinitely many possible values, other than plain `string`.

This distinguishes an open-ended string pattern, like `` `on${string}` ``, from an unconstrained `string` and a finite set of string literals. Use {@link IsStringLiteral} to classify the finite string literals.

Returns `false` for `any`, `never`, and `unknown`. Unions are normalized before classification; mixed results return `boolean`.

The classification is based on the set of possible values, not the source syntax: A template that TypeScript resolves to a finite union of literals, like `` `v${1 | 2}` ``, returns `false`. `` `${string}` `` is resolved to plain `string` and returns `false`. Infinite intrinsic string types, like `Uppercase<string>`, behave like patterns and return `true`.

@example
```
import type {IsTemplateLiteral} from 'type-fest';

type A = IsTemplateLiteral<`item-${number}`>;
//=> true

type B = IsTemplateLiteral<`${string}`>;
//=> false

type C = IsTemplateLiteral<'item-1'>;
//=> false

type D = IsTemplateLiteral<string>;
//=> false

type E = IsTemplateLiteral<`on${string}` | `off${string}`>;
//=> true

type F = IsTemplateLiteral<'sm' | 'md' | `${number}px`>;
//=> boolean
```

@example
```
import type {IsTemplateLiteral} from 'type-fest';

type RouteHandler<Route extends string> =
	IsTemplateLiteral<Route> extends true
		? (parameters: Record<string, string>) => void // A pattern can match many paths.
		: () => void; // An exact path needs no parameters.

type A = RouteHandler<'/health'>;
//=> () => void

type B = RouteHandler<`/users/${string}`>;
//=> (parameters: Record<string, string>) => void
```

@category Type Guard
@category Utilities
*/
// The plain-`string` check also rejects `any`; only `never` needs a separate guard.
export type IsTemplateLiteral<Value> = IsNever<Value> extends true
	? false
	: _IsTemplateLiteral<CollapseLiterals<Value extends object ? UnwrapBrandedPrimitive<Value> : Value>>;

type _IsTemplateLiteral<Value> =
	Value extends string
		// Plain `string`, including collapsed spellings like `` `${string}` ``.
		? string extends Value
			? false
			// Finite literals and unions of literals are not patterns.
			: _IsStringLiteral<Value> extends true
				? false
				// Every remaining string type has infinitely many values.
				: true
		: false;

export {};
