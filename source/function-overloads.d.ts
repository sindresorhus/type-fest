import type {FunctionWithMaybeThisParameter} from './internal/function.d.ts';
import type {IsEqual} from './is-equal.d.ts';

/**
Create a union of all the function's overloads.

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
```

This type can be used to extract event types of a Vue component:

@example
```ts
// Given a component `HelloWorld` defines its events as follows:

defineEmits<{
	submit: [formData: FormData];
	cancel: [];
}>();

// Extract the type of `submit` event like this:

import type {ArrayTail, FunctionOverloads} from 'type-fest';
import HelloWorld from './HelloWorld.vue';

type SubmitEventType = ArrayTail<Parameters<Extract<FunctionOverloads<InstanceType<typeof HelloWorld>['$emit']>, (event: 'submit', ...args: any[]) => void>>>;
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
	...args: infer ParametersType extends readonly unknown[]
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
						// Credits: https://github.com/microsoft/TypeScript/issues/14107#issuecomment-1146738780
						CheckedOverloads & AllOverloads,
						CheckedOverloads & ((this: ThisType, ...args: ParametersType) => ReturnType),
						MustStopIfParametersAreEqual extends true ? false : true,
						ParametersType
			>
			| FunctionWithMaybeThisParameter<ThisType, ParametersType, ReturnType>
	: never;

export {};
