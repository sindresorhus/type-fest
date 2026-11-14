import type {AnyFunction} from './basic.d.ts';
import type {JoinOverloads} from './internal/function.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsUnion} from './is-union.d.ts';
import type {Overloads} from './overloads.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Convert a function into a chain of functions that each accept one argument.

Use-case: Describe a curried wrapper around a function with a known parameter list.

Only one finite required parameter tuple is supported; unions of parameter tuples, optional parameters (including `void` parameters, which TypeScript treats as optional), and variable-length rest parameters give `never`. A function with no parameters remains a function with no parameters. Receiver types, generic relationships, type predicates, and function properties are not preserved. There are no placeholders or argument batches.

Parameter tuples intersected with brands or extra properties are unsupported.

Overloads are handled separately, and the valid ones are kept in their original order, so the result is `never` only when no overload is valid. The limits of {@link Overloads} for generic overloads apply. Like overload resolution, a call uses the first overload that accepts its argument, so a later overload with the same first parameter is unreachable.

Distributes over unions of functions. Returns `any` for `any` and `never` for `never`.

@example
```
import type {Curry} from 'type-fest';

type Request = (path: string, retries: number) => Promise<string>;
type CurriedRequest = Curry<Request>;
//=> (path: string) => (retries: number) => Promise<string>
```

Parameters are consumed one at a time, wrapping the remaining result in another function.

@category Function
*/
export type Curry<FunctionType extends AnyFunction> = IfNotAnyOrNever<FunctionType, {
	ifNot: FunctionType extends unknown
		? JoinOverloads<CurryOverloads<Overloads<FunctionType>>>
		: never;
}>;

/**
Curries each overload, giving `never` for the overloads with unsupported parameter lists.
*/
type CurryOverloads<Functions extends UnknownArray> = {
	[Index in keyof Functions]: Functions[Index] extends (...arguments_: infer Arguments extends UnknownArray) => infer Return
		? number extends Arguments['length']
			? never
			: IsUnion<Arguments> extends true
				? never
				: Arguments extends Required<Arguments>
					? Arguments extends [] ? () => Return : CurryArguments<Arguments, Return>
					: never
		: never;
};

/**
Builds one unary function for each remaining parameter.

The first parameter is sliced off as a tuple instead of inferred as an element, so its name is preserved.
*/
type CurryArguments<Arguments extends UnknownArray, Result> = Arguments extends readonly [unknown, ...infer Rest]
	? Arguments extends readonly [...infer First, ...Rest]
		? (...arguments_: First) => CurryArguments<Rest, Result>
		: never
	: Result;

export {};
