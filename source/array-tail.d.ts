import type {UnknownArrayOrTuple} from './internal';

/**
Extracts the type of an array or tuple minus the first element.

@example
```
import type {ArrayTail} from 'type-fest';

declare const curry: <TArguments extends unknown[], TReturn>(
	fn: (...args: TArguments) => TReturn,
	...args: ArrayTail<TArguments>
) => (...args: ArrayTail<TArguments>) => TReturn;

const add = (a: number, b: number) => a + b;

const add3 = curry(add, 3);

add3(4);
//=> 7
```

@category Array
*/
export type ArrayTail<TArray extends UnknownArrayOrTuple> = TArray extends readonly [unknown, ...infer TTail] ? TTail : [];
