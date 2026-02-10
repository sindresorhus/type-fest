import type {FunctionWithMaybeThisParameter, Not} from './internal/index.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a union of all the function's overloads.

TypeScript's built-in utility types like `Parameters` and `ReturnType` only work with the last overload signature, [by design](https://github.com/microsoft/TypeScript/issues/32164). This type extracts all overload signatures as a union, allowing you to work with each overload individually.

Use-cases:
- Extract parameter types from specific overloads using `Extract` and `Parameters`
- Analyze all possible function signatures in type-level code
- Extract event handler signatures from framework APIs

Known limitations:
- Functions that have identical parameters but different `this` types or return types will only extract one overload (the last one)
- Generic type parameters are lost and inferred as `unknown`

See also TypeScript limitation discussions:
- https://github.com/microsoft/TypeScript/issues/14107
- https://github.com/microsoft/TypeScript/issues/32164

@example
```ts
import type {FunctionOverloads} from 'type-fest';

function request(url: string): Promise<string>;
function request(url: string, options: {json: true}): Promise<unknown>;
function request(url: string, options?: {json?: boolean}) {
	// ...
}

type RequestFunctionType = FunctionOverloads<typeof request>;
//=> ((url: string) => Promise<string>) | ((url: string, options: {json: true}) => Promise<unknown>)

// You can also get all parameters and return types using built-in `Parameters` and `ReturnType` utilities:

type RequestParameters = Parameters<RequestFunctionType>;
//=> [url: string, options: {json: true}] | [url: string]

type RequestReturnType = ReturnType<RequestFunctionType>;
//=> Promise<string> | Promise<unknown>
```

This type can also be used to extract event parameter types from framework emit functions:

@example
```ts
// Given a Vue component that defines its events:
defineEmits<{
	submit: [formData: FormData];
	cancel: [];
}>();

// Extract the parameter types of the `submit` event:
import type {ArrayTail, FunctionOverloads} from 'type-fest';
import HelloWorld from './HelloWorld.vue';

type SubmitEventType = ArrayTail<Parameters<Extract<FunctionOverloads<InstanceType<typeof HelloWorld>['$emit']>, (event: 'submit', ...arguments_: readonly any[]) => void>>>;
//=> [formData: FormData]
```

@category Function
*/
export type FunctionOverloads<T> = FunctionOverloadsInternal<T>;

type FunctionOverloadsInternal<
	AllOverloads,
	CheckedOverloads = {},
	MustStopIfParametersAreEqual extends boolean = true,
	LastParameters = never,
> = AllOverloads extends (
	this: infer ThisType,
	...arguments_: infer ParametersType extends UnknownArray
) => infer ReturnType
	? // This simultaneously checks if the last and the current parameters are equal and `MustStopIfParametersAreEqual` flag is true
	IsEqual<
		[LastParameters, true],
		[
			ParametersType,
			[MustStopIfParametersAreEqual] extends [true] ? true : false, // Prevents distributivity
		]
	> extends true
		? never
		:
			| FunctionOverloadsInternal<
						// Normally, in `(FunctionType extends (...args: infer P) => infer R)`, compiler infers
						// `P` and `R` from the last function overload.
						// This trick (intersecting one of the function signatures with the full signature)
						// makes compiler infer a last overload that do not equal one of the concatenated ones.
						// Thus, we're ending up iterating over all the overloads from bottom to top.
						// Credits: https://github.com/microsoft/TypeScript/issues/32164#issuecomment-1146737709
						CheckedOverloads & AllOverloads,
						CheckedOverloads & ((this: ThisType, ...arguments_: ParametersType) => ReturnType),
						Not<MustStopIfParametersAreEqual>,
						ParametersType
			>
			| FunctionWithMaybeThisParameter<ThisType, ParametersType, ReturnType>
	: never;

export {};
