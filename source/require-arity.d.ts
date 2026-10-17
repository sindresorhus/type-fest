import type {IsAny} from './is-any.d.ts';
import type {TupleOf} from './tuple-of.d.ts';
import type {AnyFunction} from './basic.d.ts';
import type {FunctionParameters} from './internal/index.d.ts';

/**
Require a function to have at least the given number of required parameters.

TypeScript accepts a function with fewer parameters where a function with more parameters is expected, because a function can ignore the arguments it gets. This is usually what you want, but not when a callback is pointless without its parameters.

Use-cases:
- Require a `sort` comparator to declare both of its parameters.
- Require an async effect callback to declare its `isMounted` parameter.

The result is the given function if it has at least `Count` (default: `1`) required parameters, and `never` if not. It must wrap a type parameter that is inferred from the argument and whose constraint has at least `Count` required parameters, like `callback: RequireArity<Callback>`, because a plain function type cannot reject a function with fewer parameters. With a weaker constraint, an inline callback gets no parameter types and is rejected.

Optional parameters and rest parameters with an array type are not counted. A parameter with a default value is optional, so it is not counted either, unless a required parameter comes after it.

@example
```
import type {RequireArity} from 'type-fest';

declare function useAsyncEffect<Callback extends (isMounted: () => boolean) => Promise<void>>(callback: RequireArity<Callback>): void;

useAsyncEffect(async isMounted => {
	await Promise.resolve();

	if (isMounted()) {
		console.log('Still mounted');
	}
});
// OK

// @ts-expect-error
useAsyncEffect(async () => {
	await Promise.resolve();
});
// Error: Argument of type '() => Promise<void>' is not assignable to parameter of type 'never'.
```

@example
```
import type {RequireArity} from 'type-fest';

declare function sortNumbers<Compare extends (a: number, b: number) => number>(compare: RequireArity<Compare, 2>): void;

sortNumbers((a, b) => a - b);
// OK

// @ts-expect-error
sortNumbers(a => a);
// Error: Argument of type '(a: number) => number' is not assignable to parameter of type 'never'.
```

Note:
- This only checks that the parameters are declared, not that they are used. For example, an `isMounted` parameter that is never read is accepted. Use the `noUnusedParameters` compiler option or a lint rule for that.
- An overloaded function is checked by its last signature only, due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@category Function
*/
export type RequireArity<Function_ extends AnyFunction, Count extends number = 1> =
	IsAny<Function_> extends true
		? Function_
		: FunctionParameters<Function_> extends readonly [...TupleOf<Count>, ...unknown[]]
			? Function_
			: never;

export {};
