import type {IsEqual} from './is-equal.d.ts';
import type {ConditionalSimplifyDeep} from './conditional-simplify-deep.d.ts';
import type {UnknownRecord} from './unknown-record.d.ts';
import type {IsEmptyObject} from './empty-object.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {ApplyDefaultOptions, IsPlainObject} from './internal/index.d.ts';
import type {ConditionalPick} from './conditional-pick.d.ts'; // For `@link`

/**
Assert the condition according to the {@link ConditionalPickDeepOptions.condition|condition} option.

Properties are excluded by their keys, so matching values like `undefined` or `{}` are kept without needing an exclusion marker.
*/
type AssertCondition<Type, Condition, Options extends ConditionalPickDeepOptions> = Options['condition'] extends 'equality'
	? IsEqual<Type, Condition>
	: Type extends Condition
		? true
		: false;

/**
Options for the `ConditionalPickDeep` type.

@see {@link ConditionalPickDeep}
*/
export type ConditionalPickDeepOptions = {
	/**
	The condition assertion mode.

	@default 'extends'
	*/
	condition?: 'extends' | 'equality';
};

type DefaultConditionalPickDeepOptions = {
	condition: 'extends';
};

/**
Pick keys recursively from the shape that matches the given condition.

In a generic function, use concrete option values before relying on which keys are picked. While any option is generic, TypeScript can read the result as if the default options were used.

Known limitations:
- Very deeply nested inputs, and inputs that reference themselves through an object property (for example `interface LinkedList {value: string; next?: LinkedList}`), can exceed TypeScript's instantiation budget.
- Arrays are not recursed into, so a match that is only inside an array is not found: `ConditionalPickDeep<{a: Array<{b: 1}>}, 1>` is `never`. The comparable `*Deep` types take a `recurseIntoArrays` option for this (`PartialDeep`, `MergeDeep`, `Schema` and `SharedUnionFieldsDeep` have one), and `ConditionalPickDeep` has none. `OmitDeep` and `PickDeep` recurse into an array unconditionally instead.
- A value that is a union with a non-object member (for example `string` or `null`) is not recursed into: `ConditionalPickDeep<{data: {b: 1} | null}, 1>` is `never`. When a value is recursed into, an `undefined` union member, including the one that reading an optional property adds, is ignored, so it neither blocks recursion nor appears in the picked value. `PickDeep` instead recurses past such members and puts them back.
- A top-level array or tuple is mapped as an object of matching keys and does not keep its array shape: `ConditionalPickDeep<[1, 2], 1>` is `{0: 1}`.

@see {@link ConditionalPick}

@example
```
import type {ConditionalPickDeep} from 'type-fest';

type Example = {
	a: string;
	b: string | boolean;
	c: {
		d: string;
		e: {
			f?: string;
			g?: boolean;
			h: string | boolean;
			i: boolean | bigint;
		};
		j: boolean;
	};
};

type StringPick = ConditionalPickDeep<Example, string>;
//=> {a: string; c: {d: string}}

type StringPickOptional = ConditionalPickDeep<Example, string | undefined>;
//=> {a: string; c: {d: string; e: {f?: string}}}

type StringPickOptionalOnly = ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
//=> {c: {e: {f?: string}}}

type BooleanPick = ConditionalPickDeep<Example, boolean | undefined>;
//=> {c: {e: {g?: boolean}; j: boolean}}

type NumberPick = ConditionalPickDeep<Example, number>;
//=> never

type OptionalObjectPick = ConditionalPickDeep<{data?: {id: string; count: number}}, string>;
//=> {data?: {id: string}}

type StringOrBooleanPick = ConditionalPickDeep<Example, string | boolean>;
//=> {
// 	a: string;
// 	b: string | boolean;
// 	c: {
// 		d: string;
// 		e: {
// 			h: string | boolean;
// 		};
// 		j: boolean;
// 	};
// }

type StringOrBooleanPickOnly = ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
//=> {b: string | boolean; c: {e: {h: string | boolean}}}
```

@category Object
*/
export type ConditionalPickDeep<
	Type,
	Condition,
	Options extends ConditionalPickDeepOptions = {},
> =
	// Resolving the options in a conditional type defers it for generic options, so declaration emit keeps this alias instead of expanding the result.
	ApplyDefaultOptions<ConditionalPickDeepOptions, DefaultConditionalPickDeepOptions, Options> extends infer ResolvedOptions extends Required<ConditionalPickDeepOptions>
		? _ConditionalPickDeep<Type, Condition, ResolvedOptions>
		: never;

// `IsEmptyObject` is used instead of a raw `EmptyObject` check, because an object with only an index signature is not empty.
type _NeverIfEmpty<Type> = Type extends unknown
	? IsEmptyObject<Type> extends true ? never : Type
	: never;

// Filter empty union members at every recursive node so a wholly nonmatching member removes its key from the parent.
// Only directly matched values need deep simplification; recursive results are already simplified.
type _ConditionalPickDeep<
	Type,
	Condition,
	Options extends Required<ConditionalPickDeepOptions>,
> = Type extends unknown // For distributing `Type`, so each member contributes its own matching keys
	? _NeverIfEmpty<{
		// A value cannot distinguish an exclusion marker from matching `undefined` or `{}` values. Filter keys according to the condition and recursive result instead of removing properties by their values.
		[Key in keyof Type as AssertCondition<Type[Key], Condition, Options> extends true
			? Key
			// Reading an optional property adds `undefined`, which is not a plain object, so it is excluded before the checks. The `undefined` member contributes no keys, so it is dropped from the value like any other nonmatching union member.
			: IsPlainObject<Exclude<Type[Key], undefined>> extends true
				? IsNever<_ConditionalPickDeep<Exclude<Type[Key], undefined>, Condition, Options>> extends true ? never : Key
				: never]: AssertCondition<Type[Key], Condition, Options> extends true
			? ConditionalSimplifyDeep<Type[Key], never, UnknownRecord>
			: _ConditionalPickDeep<Exclude<Type[Key], undefined>, Condition, Options>;
	}>
	: never; // Should never happen

export {};
