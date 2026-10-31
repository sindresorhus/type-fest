import type {IsNever} from './is-never.d.ts';
import type {IsMutuallyAssignable} from './is-mutually-assignable.d.ts'; // For `@link`
import type {ExtendsStrict} from './extends-strict.d.ts'; // For `@link`
import type {IsNullable} from './is-nullable.d.ts'; // For `@link`
import type {IsOptional} from './is-optional.d.ts'; // For `@link`

/**
Returns a boolean for whether the given union type includes the given member.

Use-cases:
- Make a function parameter optional only when its type includes `undefined`, like in an event emitter or a generated API client.
- Branch on whether a union type has a certain member, like a sentinel value, before mapping over it.

@example
```
import type {IsUnionMember} from 'type-fest';

type T1 = IsUnionMember<'foo' | 'bar', 'foo'>;
//=> true

type T2 = IsUnionMember<'foo' | 'bar', 'baz'>;
//=> false

type T3 = IsUnionMember<string | undefined, undefined>;
//=> true

type T4 = IsUnionMember<string, undefined>;
//=> false
```

@example
```
import type {IsUnionMember} from 'type-fest';

type Handler<Properties> = IsUnionMember<Properties, undefined> extends true
	? (properties?: Properties) => void
	: (properties: Properties) => void;

type T1 = Handler<{id: string} | undefined>;
//=> (properties?: {id: string} | undefined) => void

type T2 = Handler<{id: string}>;
//=> (properties: {id: string}) => void
```

Note: A type that is not a union counts as a union of one member, so `IsUnionMember<'foo', 'foo'>` is `true`.

Note: When `Member` is a union, every one of its members must be a member of `Union`. `IsUnionMember<'foo' | 'bar', 'foo' | 'baz'>` is `false`, because `'baz'` is not a member.

Note: Membership is not assignability. `IsUnionMember<string | number, 5>` is `false`, because the members of the union are `string` and `number`, not `5`. `IsUnionMember<unknown, string>` is also `false`, because the only member of `unknown` is `unknown` itself, even though `string` is assignable to it. `IsUnionMember<unknown | undefined, undefined>` is `false` too, because TypeScript reduces `unknown | undefined` to `unknown`. Use {@link ExtendsStrict} to test assignability instead.

Note: Each member of `Member` is compared with one member of `Union` at a time, using {@link IsMutuallyAssignable}. So `{readonly a: 1}` is a member of `{a: 1} | {b: 2}`, but `{a: 1 | 2}` is not a member of `{a: 1} | {a: 2}`, even though the two types are mutually assignable as a whole. Different types that are mutually assignable also count as the same member, like a numeric enum member and `number`, `{}` and `object`, or `{a: any}` and `{a: string}`.

Note: `any` gives `true` on either side, unless the other type is `never`. `never` is not a member of any union, so it gives `false` on either side.

Note: {@link IsOptional} asks this question for `undefined`, and {@link IsNullable} for `null`.

@see {@link IsOptional}
@see {@link IsNullable}
@see {@link IsMutuallyAssignable}

@category Type Guard
@category Utilities
*/
// Each member of `Member` is compared with one member of `Union` at a time. Comparing whole types would let several members of `Union` together match a type that is none of them, like `{a: 1} | {a: 2}` and `{a: 1 | 2}`. `never` has no members, so without the first check, `IsUnionMember<Union, never>` would be `true` for every `Union`.
export type IsUnionMember<Union, Member> =
	IsNever<Member> extends true
		? false
		: [Member extends unknown ? HasMember<Union, Member> : never] extends [true]
			? true
			: false;

/**
Returns a boolean for whether some member of `Union` is mutually assignable with the given non-union `Member`.
*/
// This inlines `IsMutuallyAssignable`. The check runs once for every pair of members, and the extra instantiations of the alias exceed the compiler limit when both unions are large.
type HasMember<Union, Member> =
	true extends (Union extends Member ? ([Member] extends [Union] ? true : never) : never)
		? true
		: false;

export {};
