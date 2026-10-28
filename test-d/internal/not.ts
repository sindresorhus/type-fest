import {expectTypeOf} from 'nz';
import type {Not} from '../../source/internal/index.d.ts';

expectTypeOf<Not<true>>().toBe<false>();
expectTypeOf<Not<false>>().toBe<true>();
expectTypeOf<boolean>().toBe<Not<boolean>>();

expectTypeOf<Not<any>>().toBe<boolean>();
expectTypeOf<Not<never>>().toBe<never>();
// @ts-expect-error Logical negation requires a boolean.
type UnknownNegation = Not<unknown>;

// A generic result remains conditional until its operand is known.
function _readNegation<Value extends boolean>(value: Not<Value>): boolean {
	return value;
}

function _rejectAlwaysTrue<Value extends boolean>(value: Not<Value>): true {
	// @ts-expect-error A true operand produces false.
	return value;
}

function _rejectAlwaysFalse<Value extends boolean>(value: Not<Value>): false {
	// @ts-expect-error A false operand produces true.
	return value;
}
