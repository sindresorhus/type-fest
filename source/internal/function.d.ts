import type {IsUnknown} from '../is-unknown.d.ts';

/**
Constructs a function type with an optional `this` parameter.

If `this` parameter is not needed, pass `unknown`.
*/
export type FunctionWithMaybeThisParameter<
	ThisParameter,
	Parameters_ extends readonly unknown[],
	TypeToReturn,
> =
	// If a function does not specify the `this` parameter, it will be inferred to `unknown`
	IsUnknown<ThisParameter> extends true
		? (...args: Parameters_) => TypeToReturn
		: (this: ThisParameter, ...args: Parameters_) => TypeToReturn;

export {};
