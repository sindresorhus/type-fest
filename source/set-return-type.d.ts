type IsAny<T> = 0 extends (1 & T) ? true : false; // https://stackoverflow.com/a/49928360/3406963
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnknown<T> = IsNever<T> extends false ? T extends unknown ? unknown extends T ? IsAny<T> extends false ? true : false : false : false : false;

/**
Get a function type based on another, changing the return type to one of your choice.

Use-case: You want to define a wrapped function that returns something different while receiving the same parameters.

@example
```
import {SetReturnType} from 'type-fest';

type MyFunction = (foo: SomeType, bar: unknown) => SomeOtherType;

type MyWrappedFunction = SetReturnType<MyFunction, boolean>;
// type MyWrappedFunction = (foo: SomeType, bar: unknown) => boolean;
```
*/
export type SetReturnType<Fn extends (...args: any[]) => any, TypeToReturn> =
	// Just using `Parameters<Fn>` isn't ideal because it doesn't handle the `this` fake parameter
	Fn extends (this: infer ThisArg, ...args: infer Arguments) => any ? (
		// If a function did not specify the `this` fake parameter, it will be inferred to `unknown`
		// We want to detect this situation just to display a friendlier type upon hovering on an IntelliSense-powered IDE.
		IsUnknown<ThisArg> extends true ? (...args: Arguments) => TypeToReturn : (this: ThisArg, ...args: Arguments) => TypeToReturn
	) : (
		// This part should be unreachable, but we make it meaningful just in case...
		(...args: Parameters<Fn>) => TypeToReturn
	);
