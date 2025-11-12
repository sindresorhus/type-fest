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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgNIqIDOAvnAGZQQhwDkSqAtIyjTHYBuAFAiuaAKIAPEuDJoAvBhEBIEgC44AqMBwBzUaoBGWnXv1wAPnBwBXEMZRQjAYwD8ZmLoNG8W9DpRILEJOABlbwsqWgB5HDJEOGVsfEJiHHIYmgAeGTkwBQAabSiDAD5RAHoqxXKOEnYgA)

Note: To extract optional keys, make sure your `Condition` is a union of `undefined` (for example, `string | undefined`) as demonstrated below.

@example
```
import type {ConditionalKeys} from 'type-fest';

type StringKeysAndUndefined = ConditionalKeys<{a?: string}, string | undefined>;
//=> 'a'

type NoMatchingKeys = ConditionalKeys<{a?: string}, string>;
//=> never
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgNIqIDOAvnAGZQQhwDkSqAtIyjTHYBuAFAiuaAMowowHAHMqtAIL4AqvhSM5KPHAC8cbPkLEc5JTQA86EgH4AXHAGyFdADTOZc+XAA+cACumto4ugB8ogD0UfrhHCTsYhJwAHIQALIkMADGABY+lgZGuAREpJTU1raOXq7yHnU+kSIxcXBhAG4oUEA)

You can also extract array indices whose value match the specified condition, as shown below:
```
import type {ConditionalKeys} from 'type-fest';

type StringValueIndices = ConditionalKeys<[string, number, string], string>;
//=> '0' | '2'

type NumberValueIndices = ConditionalKeys<[string, number?, string?], number | undefined>;
//=> '1'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgNIqIDOAvnAGZQQhwDkSqAtIyjTHYBuAFAiuaAMowowHAHMAauQCuKAJL5gAY35wAvHGxaipStRoAeANoDZCgDRwcKkACMUUJ3bnyAut4yvgB8ogD0YfrBHAAM7HAAPhwATOxiEnAAcq4eUMpkapoEujQGRrgEpjjkVLQ2Po7OOZ4A-IH28i0BTe6eiXAq+CiMcih4oSIRURwAjOxAA)

@category Object
*/
export type ConditionalKeys<Base, Condition> = (Base extends UnknownArray ? TupleToObject<Base> : Base) extends infer _Base // Remove non-numeric keys from arrays
	? IfNotAnyOrNever<_Base, _ConditionalKeys<_Base, Condition>, keyof _Base>
	: never;

type _ConditionalKeys<Base, Condition> = keyof {
	[
	Key in (keyof Base & {}) as // `& {}` prevents homomorphism
	ExtendsStrict<Base[Key], Condition> extends true ? Key : never
	]: never
};

export {};
