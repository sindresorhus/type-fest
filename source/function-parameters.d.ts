import type {UnknownArray} from './unknown-array.d.ts';
import type {OverloadParameters} from './overload-parameters.d.ts'; // For `@link`

/**
Extract the parameters of a function type as a tuple.

Use-case: The built-in `Parameters` type returns `never` or `unknown[]` when the function has a `readonly` rest parameter ([TypeScript issue](https://github.com/microsoft/TypeScript/issues/45276)). This type returns the correct parameters.

@example
```
import type {FunctionParameters} from 'type-fest';

type Sum = (...values: readonly number[]) => number;

type BuiltIn = Parameters<Sum>;
//=> never

type SumParameters = FunctionParameters<Sum>;
//=> readonly number[]

type Callback = (error: Error | undefined, value?: string) => void;

type CallbackParameters = FunctionParameters<Callback>;
//=> [error: Error | undefined, value?: string | undefined]
```

@example
```
import type {FunctionParameters} from 'type-fest';

// With `Parameters`, the returned function could not be called when given a function with a `readonly` rest parameter.
declare function debounce<FunctionType extends (...arguments_: readonly any[]) => void>(
	function_: FunctionType,
	wait: number,
): (...arguments_: FunctionParameters<FunctionType>) => void;

const log = debounce((...messages: readonly string[]) => {
	console.log(...messages);
}, 100);

log('foo', 'bar');
```

Note: The `readonly` modifier is only preserved when the rest parameter is the only parameter and is not a single tuple. In other cases, like `(...arguments_: readonly [string, number]) => void`, TypeScript expands the rest parameter into separate parameters.

Note: For an overloaded function, only the last overload is used.

@see {@link OverloadParameters} to get the parameters of all overloads.
@category Function
*/
export type FunctionParameters<FunctionType extends (...arguments_: any) => any> = FunctionType extends (...arguments_: infer Parameters_ extends UnknownArray) => any ? Parameters_ : never;

export {};
