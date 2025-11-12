import type {IsNumericLiteral} from './is-literal.d.ts';
import type {IsNegative} from './numeric.d.ts';

/**
Returns a new string which contains the specified number of copies of a given string, just like `String#repeat()`.

@example
```
import {StringRepeat} from 'type-fest';

declare function stringRepeat<
	Input extends string,
	Count extends number
>(input: Input, count: Count): StringRepeat<Input, Count>;

// The return type is the exact string literal, not just `string`.

stringRepeat('foo', 2);
//=> 'foofoo'

stringRepeat('=', 3);
//=> '==='
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBAbwMoysAdgcwEoFMy4CGMAvnAGZQQhwDkMAngQLTm4DOMtA3AFC8ATXAGMANoSi4KAV3TCYwCOjic0WPAWIAeXgEgAkujDT4uAB4xc6AexWoMmADR6AwhFmmLVm3HTSQAEa4ULwAfAAUGMYwAFxwhtGOcMLu6LFwbh4AlHEoajj4RDBaCSZJmWmhfLwA9DVwACoAFlKSMNJQyowEcMC2MC1w5oTydvlwosCWUISiSegQ8ABW0pxwAAaqDusAdPxb6oXE4bTkEBC0SQBMWXx1ALyhdGcQL7T79oeaMCf3l3AAZlutRqjzo9whtCAA)

@category String
@category Template literal
*/
export type StringRepeat<
	Input extends string,
	Count extends number,
> = StringRepeatHelper<Input, Count>;

type StringRepeatHelper<
	Input extends string,
	Count extends number,
	Counter extends never[] = [],
	Accumulator extends string = '',
> =
	IsNegative<Count> extends true
		? never
		: Input extends ''
			? ''
			: Count extends Counter['length']
				? Accumulator
				: IsNumericLiteral<Count> extends false
					? string
					: StringRepeatHelper<Input, Count, [...Counter, never], `${Accumulator}${Input}`>;

export {};
