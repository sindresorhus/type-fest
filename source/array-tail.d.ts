import type {If} from './if.d.ts';
import type {IfNotAnyOrNever, IsArrayReadonly} from './internal/index.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Extracts the type of an array or tuple minus the first element.

@example
```
import type {ArrayTail} from 'type-fest';

type Curry<Func> = Func extends (...args_: infer Args) => infer ReturnValue
	? Args extends readonly []
		? ReturnValue
		: (arg: Args[0]) => Curry<(...args: ArrayTail<Args>) => ReturnValue>
	: never;

declare function curry<Func extends Function>(fn: Func): Curry<Func>;

declare function searchBooks(genre: string, minRating: number, available: boolean): string[];

const availableTopSciFi = curry(searchBooks)('sci-fi')(4.5)(true);
//=> string[]
```

@category Array
*/
export type ArrayTail<TArray extends UnknownArray> = IfNotAnyOrNever<TArray,
	TArray extends UnknownArray // For distributing `TArray`
		? _ArrayTail<TArray> extends infer Result
			? If<IsArrayReadonly<TArray>, Readonly<Result>, Result>
			: never // Should never happen
		: never
>;

type _ArrayTail<TArray extends UnknownArray> = TArray extends readonly [unknown?, ...infer Tail]
	? keyof TArray & `${number}` extends never
		? TArray extends readonly []
			? []
			: TArray // Happens when `TArray` is a non-tuple array (e.g., `string[]`) or has a leading rest element (e.g., `[...string[], number]`)
		: Tail
	: [];
