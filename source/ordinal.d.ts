/**
Create a type that converts a number literal type to its ordinal string representation.

This type is useful when:
- Formatting numbers for display in text (e.g., 'You finished 1st!')
- Creating human-readable labels (e.g., '21st century')
- Generating ordinal dates (e.g., 'March 3rd')

The type follows English ordinal number rules:
- Numbers ending in 1 get 'st' (except 11)
- Numbers ending in 2 get 'nd' (except 12)
- Numbers ending in 3 get 'rd' (except 13)
- All other numbers get 'th'
- Numbers 11, 12, and 13 are special cases that always get 'th'

@example
```
import type {Ordinal} from 'type-fest';

type First = Ordinal<1>;
//=> '1st'
type Second = Ordinal<2>;
//=> '2nd'
type Third = Ordinal<3>;
//=> '3rd'
type Fourth = Ordinal<4>;
//=> '4th'
type Eleventh = Ordinal<11>;
//=> '11th'
type TwentyFirst = Ordinal<21>;
//=> '21st'
```

@category Template Literals
*/
export type Ordinal<N extends number> = `${N}` extends
	| `-${number}`
	| `${number}.${number}`
	? never
	: `${N}${OrdinalSuffix<N>}`;

/**
Determines the correct ordinal suffix for a number.
*/
type OrdinalSuffix<N extends number> = `${N}` extends
	| `${string}11`
	| `${string}12`
	| `${string}13`
	? 'th'
	: `${N}` extends `${string}1`
		? 'st'
		: `${N}` extends `${string}2`
			? 'nd'
			: `${N}` extends `${string}3`
				? 'rd'
				: 'th';
