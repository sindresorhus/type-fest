import type {IsAny} from './is-any.d.ts';
import type {NonRecursiveType} from './internal/index.d.ts';
import type {Paths} from './paths.d.ts';
import type {SetRequired} from './set-required.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts';
import type {RequiredDeep} from './required-deep.d.ts';
import type {StringToNumber} from './string-to-number.d.ts';

/**
Create a type that makes the given keys required, with support for deeply nested key paths, while keeping the remaining keys as is.

Use-case: Selectively make nested properties required in complex types like models.

@example
```
import type {SetRequiredDeep} from 'type-fest';

type Foo = {
	a?: number;
	b?: string;
	c?: Array<{
		d?: number;
	}>;
};

type SomeRequiredDeep = SetRequiredDeep<Foo, 'a' | `c.${number}.d`>;
//=> {b?: string; c?: {d: number}[]; a: number}

// Set specific indices in an array to be required.
type ArrayExample = SetRequiredDeep<{a: [number?, number?, number?]}, 'a.0' | 'a.1'>;
//=> {a: [number, number, number?]}
```

@category Object
*/
export type SetRequiredDeep<BaseType, KeyPaths extends Paths<BaseType>> = IsAny<KeyPaths> extends true
	? SimplifyDeep<RequiredDeep<BaseType>>
	: SetRequiredDeepHelper<BaseType, KeyPaths>;

/**
Internal helper for {@link SetRequiredDeep}.

Recursively transforms the `BaseType` by applying all terminal keys together at each level, so the order of members in `KeyPaths` cannot affect tuple optionality.
*/
type SetRequiredDeepHelper<BaseType, KeyPaths> =
	[KeyPaths] extends [never]
		? BaseType
		: BaseType extends NonRecursiveType
			? BaseType
			: SetRequired<{
				[Key in keyof BaseType]: SetRequiredDeepHelper<BaseType[Key], SubPaths<KeyPaths, Key>>;
			}, TerminalKeys<KeyPaths> & keyof BaseType>;

/**
Converts terminal paths into keys, keeping a numeric key such as `1.2` distinct from a dotted string path such as `'1.2'`.
*/
type TerminalKeys<KeyPaths> = KeyPaths extends `${string}.${string}`
	? never
	: KeyPaths | StringToNumber<KeyPaths & string>;

/**
Finds the subpaths whose first property matches `Key` in `BaseType`.
*/
type SubPaths<KeyPaths, Key> = KeyPaths extends `${infer Property}.${infer RestPath}`
	? Property extends `${Key & (string | number)}`
		? RestPath
		: never
	: never;

export {};
