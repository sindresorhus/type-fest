import type {ExtendsStrict} from './extends-strict.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {TupleToObject} from './tuple-to-object.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

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

Note: To extract optional keys, make sure your `Condition` is a union of `undefined` (for example, `string | undefined`) as demonstrated below.

@example
```
import type {ConditionalKeys} from 'type-fest';

type StringKeysAndUndefined = ConditionalKeys<{a?: string}, string | undefined>;
//=> 'a'

type NoMatchingKeys = ConditionalKeys<{a?: string}, string>;
//=> never
```

You can also extract array indices whose value match the specified condition, as shown below:
```
import type {ConditionalKeys} from 'type-fest';

type StringValueIndices = ConditionalKeys<[string, number, string], string>;
//=> '0' | '2'

type NumberValueIndices = ConditionalKeys<[string, number?, string?], number | undefined>;
//=> '1'
```

@category Object
*/
export type ConditionalKeys<Base, Condition> = (Base extends UnknownArray ? TupleToObject<Base> : Base) extends infer _Base // Remove non-numeric keys from arrays
	? IfNotAnyOrNever<_Base, {ifNot: _ConditionalKeys<_Base, Condition>; ifAny: keyof _Base}>
	: never;

// A string index signature widens `keyof` to `string | number`, which swallows the declared
// literal keys, so they have to be collected separately and matched on their own.
type _ConditionalKeys<Base, Condition> =
	| _MatchingKeys<Base, Condition, keyof Base>
	| _MatchingKeys<Base, Condition, DeclaredKeys<Base>>;

type _MatchingKeys<Base, Condition, Keys> = keyof {
	[
	Key in (Keys & keyof Base) as // The intersection prevents homomorphism
	ExtendsStrict<Base[Key], Condition> extends true ? Key : never
	]: never
};

// The keys `Base` declares itself, without the ones contributed by a `string`, `number` or
// `symbol` index signature. Homomorphic on purpose — that is what keeps the declared keys
// visible one by one instead of collapsed into the index signature.
type DeclaredKeys<Base> = keyof {
	[
	Key in keyof Base as string extends Key ? never
		: number extends Key ? never
			: symbol extends Key ? never
				: Key
	]: never
};

export {};
