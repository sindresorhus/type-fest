import {expectTypeOf} from 'nz';
import type {And, If, IsAny, IsEqual, IsFloat, IsInteger, IsNever, IsOptionalKeyOf, IsRequiredKeyOf, Not, Or, Xor} from '../index.d.ts';

// Basic
expectTypeOf<Not<true>>().toBe<false>();
expectTypeOf<Not<false>>().toBe<true>();

// Double negation returns the original value
expectTypeOf<Not<Not<true>>>().toBe<true>();
expectTypeOf<Not<Not<false>>>().toBe<false>();
// An odd number of negations stays a negation
expectTypeOf<Not<Not<Not<true>>>>().toBe<false>();

// `boolean` and `any` are distributed into both cases
expectTypeOf<Not<boolean>>().toBe<boolean>();
expectTypeOf<Not<Not<boolean>>>().toBe<boolean>();
expectTypeOf<Not<any>>().toBe<boolean>();
expectTypeOf<Not<Not<any>>>().toBe<boolean>();

// `never` is treated as `false`, like in the other logical types
expectTypeOf<Not<never>>().toBe<true>();
expectTypeOf<Not<Not<never>>>().toBe<false>();

// The operand must be a boolean
// @ts-expect-error Logical negation requires a boolean.
type UnknownNegation = Not<unknown>;
// @ts-expect-error Logical negation requires a boolean.
type NumberNegation = Not<1>;
// @ts-expect-error Logical negation requires a boolean.
type StringNegation = Not<'true'>;
// @ts-expect-error Logical negation requires a boolean.
type NullNegation = Not<null>;

// Negating a predicate that resolves to `never` gives `true`
expectTypeOf<IsFloat<never>>().toBe<never>();
expectTypeOf<IsInteger<never>>().toBe<never>();
expectTypeOf<Not<IsFloat<never>>>().toBe<true>();
expectTypeOf<Not<IsInteger<never>>>().toBe<true>();
// A predicate that is unsure about `any` keeps its result wide
expectTypeOf<Not<IsFloat<any>>>().toBe<boolean>();
expectTypeOf<Not<IsInteger<any>>>().toBe<boolean>();

// Composition with the other `Is*` types
expectTypeOf<Not<IsNever<never>>>().toBe<false>();
expectTypeOf<Not<IsNever<string>>>().toBe<true>();
expectTypeOf<Not<IsNever<any>>>().toBe<true>();

type IsNotAny<Value> = Not<IsAny<Value>>;
expectTypeOf<IsNotAny<string>>().toBe<true>();
expectTypeOf<IsNotAny<never>>().toBe<true>();
expectTypeOf<IsNotAny<any>>().toBe<false>();

expectTypeOf<Not<IsEqual<1, 1>>>().toBe<false>();
expectTypeOf<Not<IsEqual<1, 2>>>().toBe<true>();
expectTypeOf<Not<IsEqual<{a: 1}, {readonly a: 1}>>>().toBe<true>();

// A distributed predicate keeps its union result after negation
type IsString<Value> = Value extends string ? true : false;
expectTypeOf<Not<IsString<string>>>().toBe<false>();
expectTypeOf<Not<IsString<number>>>().toBe<true>();
expectTypeOf<Not<IsString<string | number>>>().toBe<boolean>();

// Negating a key predicate matches the dedicated type
type Config = {
	name: string;
	retries?: number;
};
expectTypeOf<Not<IsOptionalKeyOf<Config, 'name'>>>().toBe<IsRequiredKeyOf<Config, 'name'>>();
expectTypeOf<Not<IsOptionalKeyOf<Config, 'retries'>>>().toBe<IsRequiredKeyOf<Config, 'retries'>>();

// Composition with the other logical types
type Nand<Left extends boolean, Right extends boolean> = Not<And<Left, Right>>;
expectTypeOf<Nand<true, true>>().toBe<false>();
expectTypeOf<Nand<true, false>>().toBe<true>();
expectTypeOf<Nand<false, true>>().toBe<true>();
expectTypeOf<Nand<false, false>>().toBe<true>();
expectTypeOf<Nand<boolean, true>>().toBe<boolean>();
expectTypeOf<Nand<false, boolean>>().toBe<true>();
expectTypeOf<Nand<true, never>>().toBe<true>();

type Nor<Left extends boolean, Right extends boolean> = Not<Or<Left, Right>>;
expectTypeOf<Nor<false, false>>().toBe<true>();
expectTypeOf<Nor<false, true>>().toBe<false>();
expectTypeOf<Nor<true, false>>().toBe<false>();
expectTypeOf<Nor<true, true>>().toBe<false>();
expectTypeOf<Nor<boolean, false>>().toBe<boolean>();
expectTypeOf<Nor<never, never>>().toBe<true>();

type Xnor<Left extends boolean, Right extends boolean> = Not<Xor<Left, Right>>;
expectTypeOf<Xnor<true, true>>().toBe<true>();
expectTypeOf<Xnor<true, false>>().toBe<false>();
expectTypeOf<Xnor<false, true>>().toBe<false>();
expectTypeOf<Xnor<false, false>>().toBe<true>();
expectTypeOf<Xnor<boolean, false>>().toBe<boolean>();
expectTypeOf<Xnor<true, never>>().toBe<false>();
expectTypeOf<Xnor<false, never>>().toBe<true>();

type Unless<Condition extends boolean, Value> = If<Not<Condition>, Value, never>;
expectTypeOf<Unless<false, 'value'>>().toBe<'value'>();
expectTypeOf<Unless<true, 'value'>>().toBe<never>();
expectTypeOf<Unless<boolean, 'value'>>().toBe<'value'>();

type IfNotEqual<Left, Right, IfBranch, ElseBranch> = If<Not<IsEqual<Left, Right>>, IfBranch, ElseBranch>;
expectTypeOf<IfNotEqual<'a', 'a', 'different', 'same'>>().toBe<'same'>();
expectTypeOf<IfNotEqual<'a', 'b', 'different', 'same'>>().toBe<'different'>();

// Boolean algebra laws
expectTypeOf<Not<And<never, true>>>().toBe<Or<Not<never>, Not<true>>>();
expectTypeOf<Not<Or<never, false>>>().toBe<And<Not<never>, Not<false>>>();
// De Morgan also holds for wide operands, where both sides widen to `boolean`
expectTypeOf<Not<And<boolean, true>>>().toBe<Or<Not<boolean>, Not<true>>>();
expectTypeOf<Not<Or<boolean, false>>>().toBe<And<Not<boolean>, Not<false>>>();
// Excluded middle and non-contradiction hold
expectTypeOf<Or<false, Not<false>>>().toBe<true>();
expectTypeOf<And<true, Not<true>>>().toBe<false>();
// Excluded middle also holds when `never` is treated as `false`
expectTypeOf<Or<never, Not<never>>>().toBe<true>();
// Both laws widen with the operand
expectTypeOf<Or<boolean, Not<boolean>>>().toBe<boolean>();
expectTypeOf<And<boolean, Not<boolean>>>().toBe<boolean>();
// The `Xor` identity holds with `never` as `false`
expectTypeOf<Xor<never, true>>().toBe<Or<And<never, Not<true>>, And<Not<never>, true>>>();

// A concrete result can be used where the negated value is expected
declare function expectFalse(_: Not<true>): void;
expectFalse(false);
// @ts-expect-error `Not<true>` is `false`.
expectFalse(true);

// A generic result remains conditional until its operand is known
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

// A generic operand known to be `false` always negates to `true`
function _readKnownFalse<Flag extends false>(value: Not<Flag>): true {
	return value;
}

// A generic operand constrained to `true` may still be `never`, which negates to `true`, so the result stays wide
function _readKnownTrue<Flag extends true>(value: Not<Flag>): boolean {
	return value;
}

type GenericNegation<Value extends boolean> = Not<Value>;
expectTypeOf<GenericNegation<never>>().toBe<true>();
expectTypeOf<GenericNegation<boolean>>().toBe<boolean>();
expectTypeOf<GenericNegation<any>>().toBe<boolean>();

declare function negate<Value extends boolean>(value: Value): Not<Value>;
expectTypeOf(negate(true)).toBe<false>();
expectTypeOf(negate(false)).toBe<true>();
declare const someBoolean: boolean;
expectTypeOf(negate(someBoolean)).toBe<boolean>();
