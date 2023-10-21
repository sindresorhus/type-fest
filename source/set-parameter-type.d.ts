import type {IsUnknown} from './is-unknown';

/**
Create a tuple that replaces the given `Tuple`'s elements with the given `Record_`'s values at the given indices.
*/
type MergeObjectToTuple<Tuple extends unknown[], Record_ extends Record<number, unknown>> = {
	[K in keyof Tuple]: Record_ extends Record<string, unknown>
		// Handle object case like `{0: string, 1: number}`
		? K extends `${infer NumberK extends number}`
			? NumberK extends keyof Record_ ? Record_[K] : Tuple[K]
			: never // Should not happen
		// Handle tuple case like `[string, number]`
		: K extends keyof Record_ ? Record_[K] : Tuple[K]
};

/**
Create a function that replaces some parameters with the given parameters.

The parameters that not be specified will keep them as-is.

Note:
- This type will ignore the given function's generic type.
- If change the parameter type that return type depends on, the return type will not change.
	example:
	```
	const fn = (a: number) => a //=> fn: (a: number) => number;
	// Change type of `a` to `string`, but return type is still `number`
	type Fn = SetParameterType<typeof fn, {0: string}> //=> (a: string) => number;
	```

Use-case:
- Define a wrapped function that receives something different while returning the same type.
- Mocking and Testing.
- Overload function type, see example.

@example
```
import type {SetParametersType} from 'type-fest';

type HandleMessage = (data: Data, message: string) => void;

type HandleOk = SetParametersType<HandleMessage, {0: SuccessData, 1: 'ok'}>
//=> type HandleOk = (data: SuccessData, message: 'ok') => void;
type HandleError = SetParametersType<HandleMessage, [data: ErrorData, message: 'error']> // anther way to define
//=> type HandleError = (data: ErrorData, message: 'error') => void;

// Could change single parameter type
type HandleWarn = SetParametersType<HandleMessage, {1: 'warn'}>
//=> type HandleWarn = (data: Data, message: 'warn') => void;

```

@category Function
*/
export type SetParameterType<Fn extends (...arguments_: any[]) => any, P extends Record<number, unknown>> =
	// Just using `Parameters<Fn>` isn't ideal because it doesn't handle the `this` fake parameter.
	Fn extends (this: infer ThisArg, ...arguments_: infer Arguments) => any
		? (
			// If a function did not specify the `this` fake parameter, it will be inferred to `unknown`.
			// We want to detect this situation just to display a friendlier type upon hovering on an IntelliSense-powered IDE.
			IsUnknown<ThisArg> extends true
				? (...arguments_: MergeObjectToTuple<Arguments, P>) => ReturnType<Fn>
				: (this: ThisArg, ...arguments_: MergeObjectToTuple<Arguments, P>) => ReturnType<Fn>
		)
		: Fn;	// This part should be unreachable
