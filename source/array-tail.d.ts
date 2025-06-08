import type {If} from './if.d.ts';
import type {IsArrayReadonly} from './internal/index.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Extracts the type of an array or tuple minus the first element.

@example
```
import type {ArrayTail} from 'type-fest';

declare const curry: <Arguments extends unknown[], Return>(
	function_: (...arguments_: Arguments) => Return,
	...arguments_: ArrayTail<Arguments>
) => (...arguments_: ArrayTail<Arguments>) => Return;

const add = (a: number, b: number) => a + b;

const add3 = curry(add, 3);

add3(4);
//=> 7
```

@category Array
*/
export type ArrayTail<TArray extends UnknownArray> =
	TArray extends UnknownArray // For distributing `TArray`
		? _ArrayTail<TArray> extends infer Result
			? If<IsArrayReadonly<TArray>, Readonly<Result>, Result>
			: never // Should never happen
		: never; // Should never happen

type _ArrayTail<TArray extends UnknownArray> = TArray extends readonly [unknown?, ...infer Tail]
	? keyof TArray & `${number}` extends never
		? []
		: Tail
	: [];
