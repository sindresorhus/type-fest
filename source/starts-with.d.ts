import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

/**
Returns a boolean for whether the given string starts with the given prefix.

Useful for filtering or validating event names, routes, and other string literal unions. Matching is case-sensitive. A union of literal prefixes matches if any member matches. With a literal prefix, a union of literal inputs distributes: `true` when every member matches, `false` when none matches, and `boolean` when the members disagree.

A `never` input returns `never`. Otherwise, a `never` prefix returns `false`. An `any` in either position returns `boolean`, unless the other position is `never`. The empty prefix `''` returns `true` for every input that is not `never` or `any`.

Apart from `never` and `any`, a non-literal prefix, including a union that contains one, returns `boolean`. With a literal prefix, a non-literal input returns `true` when its known start guarantees a match, and `boolean` otherwise, even when the known part already differs from the prefix.

Matching follows TypeScript's template literal rules. Prefixes that end in the middle of a UTF-16 surrogate pair are unsupported, and their result depends on the TypeScript compiler.

@example
```
import type {StartsWith} from 'type-fest';

type A = StartsWith<'user:created', 'user:'>;
//=> true

type B = StartsWith<'order:created', 'user:'>;
//=> false

type C = StartsWith<string, 'user:'>;
//=> boolean

type D = StartsWith<'user:created', 'user:' | 'order:'>;
//=> true

type E = StartsWith<`user:${string}`, 'user:'>;
//=> true

type F = StartsWith<`order:${string}`, 'user:'>;
//=> boolean

type G = StartsWith<'user:created', `user:${string}`>;
//=> boolean
```

@example
```
import type {StartsWith} from 'type-fest';

type UserEvents<Event extends string> = Event extends unknown
	? StartsWith<Event, 'user:'> extends true ? Event : never
	: never;

type Events = UserEvents<'user:created' | 'order:created' | 'user:deleted'>;
//=> 'user:created' | 'user:deleted'
```

@category String
@category Template literal
@category Type Guard
*/
export type StartsWith<Value extends string, Prefix extends string> = _StartsWith<Value extends object ? UnwrapBrandedPrimitive<Value> : Value, Prefix extends object ? UnwrapBrandedPrimitive<Prefix> : Prefix>;

/**
Check each input against the complete prefix union, falling back to `boolean` when a template match cannot decide an unknown value. The literal-prefix check must come before the template match: for a non-literal prefix such as `string`, the template pattern collapses to a plain string and would match every input other than `never` and `any`.
*/
type _StartsWith<Value extends string, Prefix extends string> = Value extends unknown
	? IsNever<Prefix> extends true
		? false
		: IsStringLiteral<Prefix> extends true
			? Value extends `${Prefix}${string}`
				? true
				: IsStringLiteral<Value> extends true ? false : boolean
			: boolean
	: never;

export {};
