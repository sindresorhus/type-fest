import {expectTypeOf} from 'nz';
import type {And} from '../source/and.d.ts';

declare const boolean: boolean;

expectTypeOf<And<true, true>>().toBe<true>();
expectTypeOf<And<true, false>>().toBe<false>();
expectTypeOf<And<false, true>>().toBe<false>();
expectTypeOf<And<false, false>>().toBe<false>();

expectTypeOf(boolean).toBe<And<true, boolean>>();
expectTypeOf(boolean).toBe<And<boolean, true>>();
expectTypeOf<And<false, boolean>>().toBe<false>();
expectTypeOf<And<boolean, false>>().toBe<false>();
expectTypeOf(boolean).toBe<And<boolean, boolean>>();

// Boundary cases
expectTypeOf(boolean).toBe<And<any, true>>();
expectTypeOf(boolean).toBe<And<true, any>>();
expectTypeOf<And<any, false>>().toBe<false>();
expectTypeOf<And<false, any>>().toBe<false>();
expectTypeOf(boolean).toBe<And<any, boolean>>();
expectTypeOf(boolean).toBe<And<boolean, any>>();
expectTypeOf(boolean).toBe<And<any, any>>();

expectTypeOf<And<never, true>>().toBe<false>();
expectTypeOf<And<true, never>>().toBe<false>();
expectTypeOf<And<never, false>>().toBe<false>();
expectTypeOf<And<false, never>>().toBe<false>();
expectTypeOf<And<never, boolean>>().toBe<false>();
expectTypeOf<And<boolean, never>>().toBe<false>();
expectTypeOf<And<never, never>>().toBe<false>();

// A generic condition can resolve to true, so its result must not narrow to false.
function _readGenericLeft<Value extends boolean>(value: And<Value, true>): false {
	// @ts-expect-error A true result is possible.
	return value;
}

function _readGenericRight<Value extends boolean>(value: And<true, Value>): false {
	// @ts-expect-error A true result is possible.
	return value;
}

expectTypeOf<And<any, never>>().toBe<false>();
expectTypeOf<And<never, any>>().toBe<false>();

// Generic consumers must retain both possible results until the operands are known.
function readGeneric<Left extends boolean, Right extends boolean>(value: And<Left, Right>): boolean {
	return value;
}

expectTypeOf(readGeneric<true, true>(true)).toBe<boolean>();
expectTypeOf(readGeneric<true, false>(false)).toBe<boolean>();
// @ts-expect-error Both operands are true.
readGeneric<true, true>(false);
// @ts-expect-error A false operand makes the result false.
readGeneric<true, false>(true);

function _createFalseResult<Value extends boolean>(): And<Value, false> {
	return false;
}

function _createNeverResult<Value extends boolean>(): And<Value, never> {
	return false;
}

// @ts-expect-error Unknown is not a boolean operand.
type UnknownLeft = And<unknown, true>;
// @ts-expect-error Unknown is not a boolean operand.
type UnknownRight = And<true, unknown>;
