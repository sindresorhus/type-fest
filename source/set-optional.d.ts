import type {Except} from './except.d.ts';
import type {If} from './if.d.ts';
import type {HomomorphicPick, IsArrayReadonly} from './internal/index.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a type that makes the given keys optional, while keeping the remaining keys as is.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are optional.

@example
```
import type {SetOptional} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
	c: boolean;
};

type SomeOptional = SetOptional<Foo, 'b' | 'c'>;
//=> {a: number; b?: string; c?: boolean}

// Set specific indices in an array to be optional.
type ArrayExample = SetOptional<[number, number, number], 1 | 2>;
//=> [number, number?, number?]
```

@category Object
*/
export type SetOptional<BaseType, Keys extends keyof BaseType> =
	(BaseType extends (...arguments_: never) => any
		? (...arguments_: Parameters<BaseType>) => ReturnType<BaseType>
		: unknown)
	& _SetOptional<BaseType, Keys>;

type _SetOptional<BaseType, Keys extends keyof BaseType> =
	BaseType extends UnknownArray
		? SetArrayOptional<BaseType, Keys> extends infer ResultantArray
			? If<IsArrayReadonly<BaseType>, Readonly<ResultantArray>, ResultantArray>
			: never
		: Simplify<
			// Pick just the keys that are readonly from the base type.
			Except<BaseType, Keys>
			// Pick the keys that should be mutable from the base type and make them mutable.
			& Partial<HomomorphicPick<BaseType, Keys>>
		>;

/**
Add the optional modifier to the specified keys in an array.
*/
type SetArrayOptional<
	TArray extends UnknownArray,
	Keys,
> = TArray extends unknown // For distributing `TArray` when it's a union
	? number extends TArray['length']
		// Enters this branch if `TArray` contains a rest element
		? TArray extends readonly [...any[], any]
			? TArray // If there are elements after the rest element, then we can't make any elements optional.
			: SetArrayOptionalHelper<TArray, Keys>
		: SetArrayOptionalHelper<TArray, Keys>
	: never;

type SetArrayOptionalHelper<
	TArray extends UnknownArray,
	Keys,
	Counter extends any[] = [],
	Accumulator extends UnknownArray = [],
	OptionalsAccumulator extends UnknownArray = [],
> = keyof TArray & `${number}` extends never
	// Enters this branch if `TArray` is empty (e.g., []), or
	// `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
	? [...Accumulator, ...Partial<OptionalsAccumulator>, ...TArray]
	: TArray extends readonly [(infer First)?, ...infer Rest]
		? '0' extends OptionalKeysOf<TArray> // If the first element of `TArray` is optional
			? [...Accumulator, ...Partial<OptionalsAccumulator>, ...TArray]
			: `${Counter['length']}` extends `${Keys & (string | number)}` // If the current index needs to be optional
				? SetArrayOptionalHelper<Rest, Keys, [...Counter, any], Accumulator, [...OptionalsAccumulator, First]>
				// If the current element is required, but it doesn't need to be optional,
				// then clear the `OptionalsAccumulator` since optional elements cannot appear before required ones.
				: SetArrayOptionalHelper<Rest, Keys, [...Counter, any], [...Accumulator, ...OptionalsAccumulator, First]>
		: never; // Should never happen, since `[(infer First)?, ...infer Rest]` is a top-type for arrays.

export {};
