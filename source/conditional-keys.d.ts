import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {Extends, IfNotAnyOrNever} from './internal/type.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {TupleToObject} from './tuple-to-object.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
{@link ConditionalKeys `ConditionalKeys`} options.
*/
export type ConditionalKeysOptions = {
	/**
	Require the whole value type of a key to extend the condition.

	By default, a key is included only when its entire value type extends `Condition`. Set to `false` to include it when any member of a union value type extends `Condition`.

	@default true

	@example
	```
	import type {ConditionalKeys} from 'type-fest';

	type OptionalDateKeys = ConditionalKeys<{date?: Date}, Date, {strict: false}>;
	//=> 'date'

	type StrictByDefault = ConditionalKeys<{date?: Date}, Date>;
	//=> never
	```
	*/
	strict?: boolean;
};

export type _DefaultConditionalKeysOptions = {
	strict: true;
};

/**
Extract the keys from a type where the value type of the key extends the given `Condition`.

Internally this is used for the `ConditionalPick` and `ConditionalExcept` types.

@example
```
import type {ConditionalKeys} from 'type-fest';

type Example = {
	a: string;
	b: string | number;
	c?: string;
	d: {};
};

type StringKeysOnly = ConditionalKeys<Example, string>;
//=> 'a'
```

Set the `strict` option to `false` to match any member of a union value type instead of requiring the whole value type to extend the condition. In a generic function, use concrete option values before relying on which keys are included. While any option is generic, TypeScript can read the result as if the default options were used.

Note: To extract optional keys, either include `undefined` in your `Condition` (for example, `string | undefined`) or set the `strict` option to `false`, as demonstrated below.

@example
```
import type {ConditionalKeys} from 'type-fest';

type WithUndefined = ConditionalKeys<{a?: string}, string | undefined>;
//=> 'a'

type WithLooseMatching = ConditionalKeys<{a?: string}, string, {strict: false}>;
//=> 'a'

type StrictByDefault = ConditionalKeys<{a?: string}, string>;
//=> never
```

You can also extract array indices whose values match the specified condition, as shown below:
```
import type {ConditionalKeys} from 'type-fest';

type StringValueIndices = ConditionalKeys<[string, number, string], string>;
//=> '0' | '2'

type NumberValueIndices = ConditionalKeys<[string, number?, string?], number | undefined>;
//=> '1'
```

Note: To select keys by their name instead of by their value, use the built-in `Extract` type with `keyof`, and `Exclude` to drop the matching keys, as shown below.

@example
```
import type {ConditionalKeys} from 'type-fest';

type Settings = {
	'data-user': string;
	'data-id': number;
	title: string;
};

type StringValueKeys = ConditionalKeys<Settings, string>;
//=> 'data-user' | 'title'

type DataKeys = Extract<keyof Settings, `data-${string}`>;
//=> 'data-user' | 'data-id'

type OtherKeys = Exclude<keyof Settings, `data-${string}`>;
//=> 'title'
```

@category Object
*/
export type ConditionalKeys<Base, Condition, Options extends ConditionalKeysOptions = {}> =
	ApplyDefaultOptions<ConditionalKeysOptions, _DefaultConditionalKeysOptions, Options> extends infer ResolvedOptions extends Required<ConditionalKeysOptions>
		? (Base extends UnknownArray ? TupleToObject<Base> : Base) extends infer _Base // Remove non-numeric keys from arrays
			? IfNotAnyOrNever<_Base, {ifNot: _ConditionalKeys<_Base, Condition, ResolvedOptions['strict'] extends false ? false : true>; ifAny: keyof _Base}>
			: never
		: never; // Should never happen

// An index signature widens `keyof` (for example, `string` becomes `string | number`), which swallows the declared literal keys it covers. So the declared keys are matched a second time on their own. The two key sets must stay separate, because a union of them collapses the literal keys back into the index signature.
type _ConditionalKeys<Base, Condition, Strict extends boolean> =
	| _MatchingKeys<Base, Condition, keyof Base, Strict>
	// Without an index signature, the first pass has already checked every declared key.
	| ([keyof PickIndexSignature<Base>] extends [never]
		? never
		: _MatchingKeys<Base, Condition, keyof OmitIndexSignature<Base>, Strict>);

type _MatchingKeys<Base, Condition, Keys, Strict extends boolean> = keyof {
	[
	Key in (Keys & keyof Base) as // The intersection prevents homomorphism
	Extends<Base[Key], Condition, Strict> extends true ? Key : never
	]: never
};

export {};
