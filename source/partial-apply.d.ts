import type {AnyFunction} from './basic.d.ts';
import type {JoinOverloads} from './internal/function.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {Overloads} from './overloads.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Curry} from './curry.d.ts'; // For `@link`

/**
Create the type of a function with the given leading arguments already applied.

Use-case: Describe a preconfigured client or a wrapper that binds leading arguments, like `function_.bind(undefined, ...arguments_)`.

Arguments can fill required parameters, optional parameters, and elements of a rest parameter. The result is `never` if an argument is not assignable to its parameter, if there are more arguments than the function accepts, or if the arguments are not a fixed tuple without optional or rest elements.

For a union of parameter tuples, only the members that accept the arguments are kept. If a parameter list has elements after a rest element, arguments can only fill the parameters before the rest element.

Parameter tuples intersected with brands or extra properties are unsupported.

Overloads are handled separately, and the valid ones are kept in their original order, so the result is `never` only when no overload is valid. The limits of {@link Overloads} for generic overloads apply.

Receiver types, generic relationships, type predicates, and function properties are not preserved. There are no placeholders.

Distributes over unions of functions and unions of argument tuples. Returns `any` if either type is `any`, and `never` if either type is `never`. The function type is checked before the arguments.

@example
```
import type {PartialApply} from 'type-fest';

type Request = (url: string, retries: number) => Promise<string>;

type RequestWithUrl = PartialApply<Request, [string]>;
//=> (retries: number) => Promise<string>

type Invalid = PartialApply<Request, [number]>;
//=> never
```

@example
```
import type {PartialApply} from 'type-fest';

type On = {
	(event: 'exit', listener: (code: number) => void): void;
	(event: 'message', listener: (message: string) => void): void;
};

type OnExit = PartialApply<On, ['exit']>;
//=> (listener: (code: number) => void) => void
```

@see {@link Curry} to apply the arguments one at a time.
@category Function
*/
export type PartialApply<FunctionType extends AnyFunction, Arguments extends UnknownArray> = IfNotAnyOrNever<FunctionType, {
	ifNot: IfNotAnyOrNever<Arguments, {
		ifNot: FunctionType extends unknown
			? Arguments extends unknown
				? JoinOverloads<PartialApplyOverloads<Overloads<FunctionType>, Arguments>>
				: never
			: never;
	}>;
}>;

/**
Applies the arguments to each overload, giving `never` for the overloads that do not accept them.
*/
type PartialApplyOverloads<Functions extends UnknownArray, Arguments extends UnknownArray> = {
	[Index in keyof Functions]: Functions[Index] extends (...arguments_: infer Parameters extends UnknownArray) => infer Return
		? RemainingParameters<Parameters, Arguments> extends infer Remaining
			// Checked without a constraint on `infer`, because an inferred `never` would become the constraint.
			? [Remaining] extends [never]
				? never
				: [Remaining] extends [UnknownArray] ? (...arguments_: Remaining) => Return : never
			: never
		: never;
};

/**
Removes the arguments from the start of the parameters, or gives `never` when the parameters do not accept the arguments.

Distributes over unions of parameter tuples.
*/
type RemainingParameters<Parameters extends UnknownArray, Arguments extends UnknownArray> = IsAny<Parameters> extends true
	? any[]
	: Parameters extends unknown
		? Arguments extends readonly [infer Argument, ...infer RestArguments]
			? Parameters extends readonly [infer Parameter, ...infer RestParameters]
				? [Argument] extends [Parameter] ? RemainingParameters<RestParameters, RestArguments> : never
				: '0' extends keyof Parameters // An optional parameter. This excludes empty parameter lists, rest parameters, and leading rest elements.
					? Parameters extends readonly [(infer Parameter)?, ...infer RestParameters]
						? [Argument] extends [Parameter | undefined] ? RemainingParameters<RestParameters, RestArguments> : never
						: never
					: Parameters extends ReadonlyArray<infer Parameter>
						? Parameter[] extends Parameters // A rest parameter, which keeps accepting arguments. This excludes leading rest elements.
							? [Argument] extends [Parameter] ? RemainingParameters<Parameters, RestArguments> : never
							: never
						: never
			: Arguments extends readonly [] ? Parameters : never
		: never;

export {};
