import type {AnyFunction} from './basic.d.ts';
import type {FunctionParameters} from './function-parameters.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create the signature of a function pipeline, checking that adjacent stages are compatible.

Use-case: Describe a parser or conversion chain without accepting incompatible stages.

The input must be a nonempty fixed tuple of functions. The first stage can have any parameter list. Each later stage must have exactly one parameter, which must be required and accept the entire preceding return type. A `void` parameter counts as optional, so it is not accepted. Incompatible stages, empty tuples, and arrays of unknown length give `never`. Values are passed synchronously without awaiting promises.

Stages must have concrete call signatures. Generic relationships, type predicates, receiver types, and function properties are not preserved. Only the last overload is used; union-valued stages are unsupported.

Pipeline tuples with added properties, including tagged tuples and tuple intersections, are unsupported.

Distributes over unions of pipeline tuples. Returns `any` for `any` and `never` for `never`.

@example
```
import type {Pipe} from 'type-fest';

type ParseSetting = Pipe<[
	(text: string) => number,
	(value: number) => boolean,
]>;
//=> (text: string) => boolean

type Invalid = Pipe<[(text: string) => number, (value: Date) => boolean]>;
//=> never
```

Each return type is checked against the next parameter before constructing the final signature from the first parameters and last return type.

@category Function
*/
export type Pipe<Functions extends readonly AnyFunction[]> = IfNotAnyOrNever<Functions, {
	ifNot: Functions extends readonly [infer First extends AnyFunction, ...infer Rest extends AnyFunction[]]
		? number extends Functions['length'] ? never : PipeStages<Rest, FunctionParameters<First>, PipeReturnType<First>>
		: never;
}>;

/**
Checks each link without distributing the preceding return type, then builds the resulting function.
*/
type PipeStages<Functions extends readonly AnyFunction[], Arguments extends UnknownArray, Value> = Functions extends readonly [infer Next extends AnyFunction, ...infer Rest extends AnyFunction[]]
	? [FunctionParameters<Next>] extends [never]
		? never
		: FunctionParameters<Next> extends readonly [infer Parameter]
			? [Value] extends [Parameter] ? PipeStages<Rest, Arguments, PipeReturnType<Next>> : never
			: never
	: (...arguments_: Arguments) => Value;

/**
Extracts returns from the function's own parameters, preserving `never[]` rest parameters and unions of parameter tuples.
*/
type PipeReturnType<FunctionType extends AnyFunction> = FunctionType extends (...arguments_: FunctionParameters<FunctionType>) => infer Return ? Return : never;

export {};
