import type {NegativeInfinity, PositiveInfinity} from './numeric.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {Absolute} from './absolute.d.ts'; // For `@link`

/**
Returns the specified number with its sign reversed.

Use-case: Derive opposite offsets or directions from a set of numeric literals.

@example
```
import type {Negate} from 'type-fest';

type ForwardOffset = 4;
type BackwardOffset = Negate<ForwardOffset>;
//=> -4

type OppositeOffsets = Negate<-2 | 0 | 4>;
//=> -4 | 0 | 2
```

Supports integers, fractions, unions, and positive and negative infinity. Zero stays zero. Brands are removed from the result. Returns `number` for `number` or `any`, and `never` for `never`.

@example
```
import type {NegativeInfinity, PositiveInfinity, Negate} from 'type-fest';

type A = Negate<-1>;
//=> 1

type B = Negate<1>;
//=> -1

type C = Negate<NegativeInfinity>;
//=> Infinity

type D = Negate<PositiveInfinity>;
//=> -Infinity
```

The implementation adds or removes the leading minus sign from the number's string representation, with separate handling for zero and infinities.

@see {@link Absolute} to get the magnitude without a sign.
@category Numeric
*/
export type Negate<Value extends number> = NegateImplementation<Value extends object ? UnwrapBrand<Value> : Value>;

type NegateImplementation<Value extends number> =
	// Handle edge cases, keeping numeric enum members distinct from the widened number type.
	`${number}` extends `${Value}`
		? number
		: Value extends 0
			? 0
			: Value extends PositiveInfinity
				? NegativeInfinity
				: Value extends NegativeInfinity
					? PositiveInfinity
					// Handle negative numbers
					: `${Value}` extends `-${infer Magnitude extends number}`
						? Magnitude
						// Handle positive numbers
						: `-${Value}` extends `${infer Result extends number}`
							? Result
							: never;

export {};
