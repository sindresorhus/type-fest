import type {IsUnknown} from './is-unknown';

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
export type SetReturnType<Fn extends (...arguments_: any[]) => any, TypeToReturn> =
	// Just using `Parameters<Fn>` isn't ideal because it doesn't handle the `this` fake parameter.
	Fn extends (this: infer ThisArg, ...arguments_: infer Arguments) => any ? (
		// If a function did not specify the `this` fake parameter, it will be inferred to `unknown`.
		// We want to detect this situation just to display a friendlier type upon hovering on an IntelliSense-powered IDE.
		IsUnknown<ThisArg> extends true ? (...arguments_: Arguments) => TypeToReturn : (this: ThisArg, ...arguments_: Arguments) => TypeToReturn
	) : (
		// This part should be unreachable, but we make it meaningful just in case…
		(...arguments_: Parameters<Fn>) => TypeToReturn
	);
