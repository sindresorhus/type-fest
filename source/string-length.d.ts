import type {UnwrapBrand} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

/**
Returns the length of the given string.

@example
```
import type {StringLength} from 'type-fest';

type A = StringLength<'abcde'>;
//=> 5

type B = StringLength<'abcde' | 'fgh'>;
//=> 3 | 5
```

For non-literal strings, the result is `number` because the length of a non-literal string can be any number.

@example
```
import type {StringLength} from 'type-fest';

type A = StringLength<string>;
//=> number

type B = StringLength<Uppercase<string>>;
//=> number

type C = StringLength<`${string}abc`>;
//=> number
```

@category String
@category Template literal
*/
export type StringLength<S extends string> = IfNotAnyOrNever<S, {
	ifNot: IsStringLiteral<S> extends true
		// The intersection preserves the counter's recursion budget and generic numeric result.
		? StringLengthImplementation<S extends object ? UnwrapBrand<S> : S> & number
		: number;
	ifAny: number;
}>;

// The input is already a literal, so count its characters without retaining them.
type StringLengthImplementation<Value extends string, Counter extends unknown[] = []> = Value extends `${string}${infer Rest}`
	? StringLengthImplementation<Rest, [...Counter, unknown]>
	: Counter['length'];

export {};
