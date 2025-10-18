import type {IsUnknown} from '../is-unknown.d.ts';

/**
Test if the given function has multiple call signatures.

Needed to handle the case of a single call signature with properties.

Multiple call signatures cannot currently be supported due to a TypeScript limitation.
@see https://github.com/microsoft/TypeScript/issues/29732
*/
export type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> =
	T extends {(...arguments_: infer A): unknown; (...arguments_: infer B): unknown}
		? B extends A
			? A extends B
				? false
				: true
			: true
		: false;

/**
Extract the call signature of an object type.
*/
export type ExtractCallSignature<Type> =
	Type extends (this: infer This, ...args: infer Parameters) => infer Return
		? IsUnknown<This> extends true // TODO: replace with `FunctionWithMaybeThisParameter`
			? (...args: Parameters) => Return
			: (this: This, ...args: Parameters) => Return
		: unknown;

export {};
