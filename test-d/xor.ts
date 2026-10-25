import {expectTypeOf} from 'nz';
import type {Xor} from '../source/xor.d.ts';

declare const boolean: boolean;

expectTypeOf<Xor<true, true>>().toBe<false>();
expectTypeOf<Xor<true, false>>().toBe<true>();
expectTypeOf<Xor<false, true>>().toBe<true>();
expectTypeOf<Xor<false, false>>().toBe<false>();

expectTypeOf(boolean).toBe<Xor<true, boolean>>();
expectTypeOf(boolean).toBe<Xor<boolean, true>>();
expectTypeOf(boolean).toBe<Xor<false, boolean>>();
expectTypeOf(boolean).toBe<Xor<boolean, false>>();
expectTypeOf(boolean).toBe<Xor<boolean, boolean>>();

// Boundary cases
expectTypeOf(boolean).toBe<Xor<true, any>>();
expectTypeOf(boolean).toBe<Xor<any, true>>();
expectTypeOf(boolean).toBe<Xor<false, any>>();
expectTypeOf(boolean).toBe<Xor<any, false>>();
expectTypeOf(boolean).toBe<Xor<boolean, any>>();
expectTypeOf(boolean).toBe<Xor<any, boolean>>();
expectTypeOf(boolean).toBe<Xor<any, any>>();

expectTypeOf<Xor<true, never>>().toBe<true>();
expectTypeOf<Xor<never, true>>().toBe<true>();
expectTypeOf<Xor<false, never>>().toBe<false>();
expectTypeOf<Xor<never, false>>().toBe<false>();
expectTypeOf(boolean).toBe<Xor<boolean, never>>();
expectTypeOf(boolean).toBe<Xor<never, boolean>>();
expectTypeOf<Xor<never, never>>().toBe<false>();
expectTypeOf<Xor<any, never>>().toBe<boolean>();
expectTypeOf<Xor<never, any>>().toBe<boolean>();

// An unresolved operand can make exactly one operand true.
function _readGenericLeft<Value extends boolean>(value: Xor<Value, true>): true {
	// @ts-expect-error A false operand makes the result true.
	const alwaysFalse: false = value;
	// @ts-expect-error A true operand makes the result false.
	return value;
}

function _readGenericRight<Value extends boolean>(value: Xor<true, Value>): true {
	// @ts-expect-error A false operand makes the result true.
	const alwaysFalse: false = value;
	// @ts-expect-error A true operand makes the result false.
	return value;
}

// @ts-expect-error Unknown is not a boolean operand.
type UnknownLeft = Xor<unknown, true>;
// @ts-expect-error Unknown is not a boolean operand.
type UnknownRight = Xor<true, unknown>;

// A generic false operand still guarantees a false result beside false.
function _readKnownFalse<Flag extends false>(value: Xor<Flag, false>): false {
	return value;
}

declare function exclusiveFeatures<
	const Features extends Record<string, {enabled: boolean; required: boolean}>,
>(features: Features): {readonly [Key in keyof Features]: Xor<Features[Key]['enabled'], Features[Key]['required']>};
const featureFlags = exclusiveFeatures({local: {enabled: true, required: false}, remote: {enabled: boolean, required: true}, both: {enabled: true, required: true}});
expectTypeOf(featureFlags).toBe<{readonly local: true; readonly remote: boolean; readonly both: false}>();
