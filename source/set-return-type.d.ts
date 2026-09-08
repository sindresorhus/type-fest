import type {FunctionWithMaybeThisParameter} from './internal/index.d.ts';

/**
Create a function type with a return type of your choice and the same parameters as the given function type.

Use-case: You want to define a wrapped function that returns something different while receiving the same parameters. For example, you might want to wrap a function that can throw an error into one that will return `undefined` instead.

@example
```
import type {SetReturnType} from 'type-fest';

type MyFunctionThatCanThrow = (foo: string, bar: number) => boolean;

type MyWrappedFunction = SetReturnType<MyFunctionThatCanThrow, ReturnType<MyFunctionThatCanThrow> | undefined>;
//=> (foo: string, bar: number) => boolean | undefined
```

@category Function
*/
export type SetReturnType<
	Function_ extends (...arguments_: any[]) => any,
	TypeToReturn,
> = FunctionWithMaybeThisParameter<
	ThisParameterType<Function_>,
	Parameters<Function_>,
	TypeToReturn
>;

export {};
