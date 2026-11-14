import type {AnyFunction} from './basic.d.ts';
import type {FunctionParameters} from './function-parameters.d.ts';
import type {JoinOverloads} from './internal/function.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {Overloads} from './overloads.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create the signature of a function pipeline, checking that adjacent stages are compatible.

Use-case: Describe a parser or conversion chain without accepting incompatible stages.

The input must be a nonempty fixed tuple of functions. The first stage can have any parameter list. Each later stage must have exactly one parameter, which must be required and accept the entire preceding return type. A `void` parameter counts as optional, so it is not accepted. Incompatible stages, empty tuples, and arrays of unknown length give `never`. Values are passed synchronously without awaiting promises.

Stages must have concrete call signatures. Generic relationships, type predicates, receiver types, and function properties are not preserved.

Overloads are handled separately, and the valid ones are kept in their original order, so the result is `never` only when no overload is valid. The limits of {@link Overloads} for generic overloads apply. Each overload of the first stage starts a separate pipeline. A later stage uses its first overload that accepts the preceding return type, like overload resolution. A union of functions as a stage is handled through its members' overloads.

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
		? number extends Functions['length'] ? never : JoinOverloads<PipeOverloads<Overloads<First>, Rest>>
		: never;
}>;

/**
Runs the pipeline from each overload of the first stage, giving `never` for the overloads that the later stages do not accept.
*/
type PipeOverloads<FirstOverloads extends UnknownArray, Functions extends readonly AnyFunction[]> = {
	[Index in keyof FirstOverloads]: FirstOverloads[Index] extends infer First extends AnyFunction
		? PipeStages<Functions, FunctionParameters<First>, PipeReturnType<First>>
		: never;
};

/**
Checks each link, then builds the resulting function.
*/
type PipeStages<Functions extends readonly AnyFunction[], Arguments extends UnknownArray, Value> = Functions extends readonly [infer Next extends AnyFunction, ...infer Rest extends AnyFunction[]]
	? StageReturnType<Overloads<Next>, Value> extends infer Result
		// `Result` distributes, so a `never` stage gives `never` instead of matching `[infer Return]`.
		? Result extends [infer Return] ? PipeStages<Rest, Arguments, Return> : never
		: never
	: (...arguments_: Arguments) => Value;

/**
Gets the return type of the first overload that has exactly one required parameter accepting the whole value, without distributing the value.

The return type is wrapped in a tuple, because it can be `never`. Gives an empty tuple when no overload accepts the value.
*/
type StageReturnType<StageOverloads extends UnknownArray, Value> = StageOverloads extends readonly [infer Stage extends AnyFunction, ...infer Rest]
	? [FunctionParameters<Stage>] extends [never]
		? StageReturnType<Rest, Value>
		: FunctionParameters<Stage> extends readonly [infer Parameter]
			? [Value] extends [Parameter] ? [PipeReturnType<Stage>] : StageReturnType<Rest, Value>
			: StageReturnType<Rest, Value>
	: [];

/**
Extracts returns from the function's own parameters, preserving `never[]` rest parameters and unions of parameter tuples.
*/
type PipeReturnType<FunctionType extends AnyFunction> = FunctionType extends (...arguments_: FunctionParameters<FunctionType>) => infer Return ? Return : never;

export {};
