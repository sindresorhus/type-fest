import type {AnyFunction} from './basic.d.ts';
import type {Curry} from './curry.d.ts'; // For `@link`
import type {JoinOverloads} from './internal/function.d.ts';
import type {IfNotAnyOrNever, IsAnyOrNever} from './internal/type.d.ts';
import type {Overloads} from './overloads.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Convert a chain of functions into a function that accepts all arguments at once.

Use-case: Describe a wrapper that accepts the arguments of a curried function at once.

The parameters of each nested function are appended to the accumulated ones until the return type is not a function, including `any` and `never`. Parameter lists are appended as they are, except that an optional parameter, including `void`, becomes required and accepts `undefined` when a required parameter follows it in the result. A function-valued result is flattened too, so use this type only when the nesting represents sequential arguments. A chain that returns itself has no finite result.

Rest parameters follow TypeScript's tuple spread rules. Multiple rest parameters, or optional parameters after a rest parameter, can merge into one rest parameter, losing argument order and required parameters. These combinations are best-effort.

A returned union is flattened only when every member is a function. Overloads are flattened in order, with the limits of {@link Overloads} for generic overloads. Receiver types, generic relationships, type predicates, assertion signatures, and function properties are not preserved.

Distributes over unions of functions. Returns `any` for `any` and `never` for `never`.

@example
```
import type {Uncurry} from 'type-fest';

type CurriedRequest = (path: string) => (retries: number) => Promise<string>;
type Request = Uncurry<CurriedRequest>;
//=> (path: string, retries: number) => Promise<string>
```

@see {@link Curry} to create the chain.
@category Function
*/
export type Uncurry<FunctionType extends AnyFunction> = IfNotAnyOrNever<FunctionType, {
	ifNot: FunctionType extends unknown
		? JoinOverloads<UncurriedOverloads<[], Overloads<FunctionType>>>
		: never;
}>;

/**
Uncurries each overload, appending its parameters to the accumulated ones.
*/
type UncurriedOverloads<Arguments extends UnknownArray, Functions extends UnknownArray> = {
	[Index in keyof Functions]: Functions[Index] extends (...arguments_: infer NextArguments extends UnknownArray) => infer NextReturn
		? UncurriedChain<[...Arguments, ...NextArguments], NextReturn>
		: never;
};

/**
Appends parameters while the return type is a function, then emits the final function.

The return check is non-distributive, so a `boolean` return stays `boolean` instead of splitting into `false` and `true` branches.
*/
type UncurriedChain<Arguments extends UnknownArray, Return> =
	IsAnyOrNever<Return> extends true
		? (...arguments_: Arguments) => Return
		: [Return] extends [AnyFunction]
			? JoinOverloads<UncurriedOverloads<Arguments, Overloads<Return>>>
			: (...arguments_: Arguments) => Return;

export {};
