import type {FunctionWithMaybeThisParameter} from './internal/index.d.ts';

/**
Create a function type with a return type of your choice and the same parameters as the given function type.

Use-case: You want to define a wrapped function that returns something different while receiving the same parameters. For example, you might want to wrap a function that can throw an error into one that will return `undefined` instead.

@example
```
import type {SetReturnType} from 'type-fest';

type MyFunctionThatCanThrow = (foo: SomeType, bar: unknown) => SomeOtherType;

type MyWrappedFunction = SetReturnType<MyFunctionThatCanThrow, SomeOtherType | undefined>;
//=> type MyWrappedFunction = (foo: SomeType, bar: unknown) => SomeOtherType | undefined;
```

@category Function
*/
export type SetReturnType<Function_ extends (...arguments_: any[]) => any, TypeToReturn> =
	// Just using `Parameters<Fn>` isn't ideal because it doesn't handle the `this` fake parameter.
	Function_ extends (this: infer ThisArgument, ...arguments_: infer Arguments) => any
		? FunctionWithMaybeThisParameter<ThisArgument, Arguments, TypeToReturn>
		: // This part should be unreachable, but we make it meaningful just in case…
		(...arguments_: Parameters<Function_>) => TypeToReturn;

export {};
