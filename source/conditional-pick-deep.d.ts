import type {IsEqual} from './is-equal.d.ts';
import type {ConditionalSimplifyDeep} from './conditional-simplify-deep.d.ts';
import type {UnknownRecord} from './unknown-record.d.ts';
import type {IsEmptyObject} from './empty-object.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {ApplyDefaultOptions, IsPlainObject} from './internal/index.d.ts';

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
ConditionalPickDeep options.

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

Known limitations:
- Very deeply nested inputs can exceed TypeScript's instantiation budget because each level goes through a mapped type, a conditional and `ConditionalSimplifyDeep`.
- Recursion does not enter optional object properties, whose read type includes `undefined`: `ConditionalPickDeep<{data?: {a: string}}, string>` is `never`. An optional property can still be picked directly when its whole value matches the condition.
- Arrays are not recursed into, so a match that is only inside an array is not found: `ConditionalPickDeep<{a: Array<{b: 1}>}, 1>` is `never`. The comparable `*Deep` types take a `recurseIntoArrays` option for this (`PartialDeep`, `MergeDeep`, `Schema` and `SharedUnionFieldsDeep` have one), and `ConditionalPickDeep` has none. `OmitDeep` and `PickDeep` recurse into an array unconditionally instead.
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
> = _ConditionalPickDeep<
	Type,
	Condition,
	ApplyDefaultOptions<ConditionalPickDeepOptions, DefaultConditionalPickDeepOptions, Options>
>;

// `IsEmptyObject` is used instead of a raw `EmptyObject` check, because an object with only an index signature is not empty.
type _NeverIfEmpty<Type> = Type extends unknown
	? IsEmptyObject<Type> extends true ? never : Type
	: never;

// Filter empty union members at every recursive node so a wholly nonmatching member removes its key from the parent.
type _ConditionalPickDeep<
	Type,
	Condition,
	Options extends Required<ConditionalPickDeepOptions>,
> = Type extends unknown // For distributing `Type`, so each member contributes its own matching keys
	? _NeverIfEmpty<ConditionalSimplifyDeep<{
		// A value cannot distinguish an exclusion marker from matching `undefined` or `{}` values. Filter keys according to the condition and recursive result instead of removing properties by their values.
		[Key in keyof Type as AssertCondition<Type[Key], Condition, Options> extends true
			? Key
			: IsPlainObject<Type[Key]> extends true
				? IsNever<_ConditionalPickDeep<Type[Key], Condition, Options>> extends true ? never : Key
				: never]: AssertCondition<Type[Key], Condition, Options> extends true
			? Type[Key]
			: _ConditionalPickDeep<Type[Key], Condition, Options>;
	}, never, UnknownRecord>>
	: never; // Should never happen

export {};
