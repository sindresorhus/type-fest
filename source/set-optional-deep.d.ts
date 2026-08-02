import type {If} from './if.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsArrayReadonly, NonRecursiveType} from './internal/index.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {PartialDeep} from './partial-deep.d.ts';
import type {Paths} from './paths.d.ts';
import type {SetOptional} from './set-optional.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts';
import type {StringToNumber} from './string-to-number.d.ts';
import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a type that makes the given keys optional, with support for deeply nested key paths, while keeping the remaining keys as is.

Use-case: Selectively make nested properties optional in complex types like models.

@example
```
import type {SetOptionalDeep} from 'type-fest';

type Foo = {
	a: number;
	b: string;
	c: Array<{
		d: number;
	}>;
};

type SomeOptionalDeep = SetOptionalDeep<Foo, 'a' | `c.${number}.d`>;
//=> {b: string; c: {d?: number}[]; a?: number}

// Set specific indices in an array to be optional.
type ArrayExample = SetOptionalDeep<{a: [number, number, number]}, 'a.1' | 'a.2'>;
//=> {a: [number, number?, number?]}
```

@category Object
*/
export type SetOptionalDeep<BaseType, KeyPaths extends Paths<BaseType>> = IsAny<KeyPaths> extends true
	? SimplifyDeep<PartialDeep<BaseType>>
	: SetOptionalDeepHelper<BaseType, UnionToTuple<KeyPaths>>;

/**
Internal helper for {@link SetOptionalDeep}.

Recursively transforms the `BaseType` by applying {@link SetOptionalDeepSinglePath} for each path in `KeyPathsTuple`.
*/
type SetOptionalDeepHelper<BaseType, KeyPathsTuple extends UnknownArray> =
	KeyPathsTuple extends [infer KeyPath, ...infer RestPaths]
		? SetOptionalDeepHelper<SetOptionalDeepSinglePath<BaseType, KeyPath>, RestPaths>
		: BaseType;

/**
Makes a single path optional in `BaseType`.
*/
type SetOptionalDeepSinglePath<BaseType, KeyPath> = BaseType extends NonRecursiveType
	? BaseType
	: KeyPath extends `${infer Property}.${infer RestPath}`
		? {
			[Key in keyof BaseType]: Property extends `${Key & (string | number)}`
				? SetOptionalDeepSinglePath<BaseType[Key], RestPath>
				: BaseType[Key];
		}
		: SetOptionalLeaf<BaseType, (KeyPath | StringToNumber<KeyPath & string>) & keyof BaseType>;

/**
Makes the given keys optional at a single level, dispatching to array-aware handling for tuples.
*/
type SetOptionalLeaf<BaseType, Keys extends keyof BaseType> =
	BaseType extends UnknownArray
		? SetArrayOptional<BaseType, Keys> extends infer ResultantArray
			? If<IsArrayReadonly<BaseType>, Readonly<ResultantArray>, ResultantArray>
			: never
		: SetOptional<BaseType, Keys>;

/**
Add the optional modifier to the specified keys in an array.

Optional elements can only appear at the tail of a tuple, so making one element
optional forces every element after it to become optional too. The tail is cut at
the earliest requested index and everything from there on is made optional.
*/
type SetArrayOptional<TArray extends UnknownArray, Keys> =
	TArray extends unknown // For distributing `TArray` when it's a union
		? number extends TArray['length']
			// A non-tuple array (e.g. `string[]`) or a variadic tuple with a rest
			// element has no fixed trailing index to mark optional, so leave it as is.
			? TArray
			: MakeTailOptional<TArray, TupleCut<TArray, Keys>>
		: never;

/**
Find the earliest requested index. Everything from that index to the end of the tuple can be made optional.
*/
type TupleCut<
	TArray extends UnknownArray,
	Keys,
	Counter extends any[] = [],
> = TArray extends readonly [(infer First)?, ...infer Rest]
	? keyof TArray & `${number}` extends never
		? Counter
		: `${Counter['length']}` extends `${Keys & (string | number)}`
			? Counter
			: TupleCut<Rest, Keys, [...Counter, any]>
	: Counter;

/**
Keep the first `Keep['length']` elements untouched and make every following element optional.
*/
type MakeTailOptional<
	TArray extends UnknownArray,
	Keep extends any[],
	Accumulator extends UnknownArray = [],
> = TArray extends readonly [(infer First)?, ...infer Rest]
	? keyof TArray & `${number}` extends never
		? [...Accumulator, ...TArray]
		: Keep extends [any, ...infer KeepRest]
			? '0' extends OptionalKeysOf<TArray>
				? MakeTailOptional<Rest, KeepRest extends any[] ? KeepRest : [], [...Accumulator, First?]>
				: MakeTailOptional<Rest, KeepRest extends any[] ? KeepRest : [], [...Accumulator, TArray[0]]>
			: MakeTailOptional<Rest, [], [...Accumulator, First?]>
	: [...Accumulator, ...TArray];

export {};
