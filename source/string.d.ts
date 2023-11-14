import type {NegativeInfinity, PositiveInfinity} from './numeric';

/**
Converts a numeric string to a number.

@example
```
type PositiveInt = StringToNumber<'1234'>; // => 1234;
type NegativeInt = StringToNumber<'-1234'>; // => -1234;
type PositiveFloat = StringToNumber<'1234.56'>; // => 1234.56;
type NegativeFloat = StringToNumber<'-1234.56'>; // => -1234.56;
type PositiveInfinity = StringToNumber<'Infinity'>; // => Infinity
type NegativeInfinity = StringToNumber<'-Infinity'>; // => -Infinity
```

@category String
@category Template literal
*/
export type StringToNumber<S extends string> = S extends `${infer N extends number}`
	? N
	: S extends 'Infinity'
		? PositiveInfinity
		: S extends '-Infinity'
			? NegativeInfinity
			: never;

/**
Returns a boolean for whether the string `S` starts with `SearchString`

@example
```
StartsWith<'abcde', 'abc'>
//=> true

StartsWith<'abcde', 'bc'>
//=> false

StartsWith<string, 'bc'>
//=> boolean

StartsWith<'abcde', string>
//=> boolean
```

@category String
@category Template literal
*/
export type StartsWith<S extends string, SearchString extends string> = string extends S | SearchString
	? boolean
	: S extends `${SearchString}${infer T}`
		? true
		: false;

/**
Returns the length of the given string.

@example
```
StringLength<'abcde'>
//=> 5

StringLength<string>
//=> number
```

@category String
@category Template literal
*/
export type StringLength<S extends string> = StringToArray<S>['length'];

/**
Returns an array of the characters of the string.

@example
```
StringToArray<'abcde'>
//=> ['a', 'b', 'c', 'd', 'e']

StringToArray<string>
//=> string[]
```

@category String
*/
export type StringToArray<S extends string, Result extends string[] = []> = string extends S
	? string[]
	: S extends `${infer F}${infer R}`
		? StringToArray<R, [...Result, F]>
		: Result;
