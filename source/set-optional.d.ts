import type {Except} from './except.d.ts';
import type {If} from './if.d.ts';
import type {HomomorphicPick, IsArrayReadonly} from './internal/index.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {SplitOnRestElement} from './split-on-rest-element.d.ts';
import type {Subtract} from './subtract.d.ts';
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
	? SplitOnRestElement<TArray> extends readonly [infer BeforeRest extends UnknownArray, infer Rest extends UnknownArray, infer AfterRest extends UnknownArray]
		? AfterRest extends readonly []
			? SetArrayBeforeRestOptional<BeforeRest, Keys> extends infer ResultantArray extends UnknownArray
				? [...ResultantArray, ...Rest]
				: never
			: TArray // If there are elements after the rest element, then we can't make any elements optional.
		: never
	: never;

type SetArrayBeforeRestOptional<
	TArray extends UnknownArray,
	Keys,
	ReverseCounter extends number = Subtract<Required<TArray>['length'], 1>,
	Accumulator extends UnknownArray = [],
> = TArray extends readonly []
	? Accumulator
	: TArray extends readonly [...infer Rest, (infer Last)?]
		? TArray extends readonly [...any[], any] // If last element is required
			? `${ReverseCounter}` extends `${Keys & (string | number)}` // If the current index needs to be optional
				? SetArrayBeforeRestOptional<Rest, Keys, Subtract<ReverseCounter, 1>, [Last?, ...Accumulator]>
				// If the current element is required, but it doesn't need to be optional,
				// then we can exit early, since no further elements can now be made optional.
				: [...TArray, ...Accumulator]
			: SetArrayBeforeRestOptional<Rest, Keys, Subtract<ReverseCounter, 1>, [Last?, ...Accumulator]>
		: never; // Should never happen, since `[...infer Rest, (infer Last)?]` is a top-type for arrays.

export {};
