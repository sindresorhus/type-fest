import {expectTypeOf} from 'nz';
import type {SomeExtend, SomeExtendOptions} from '../source/some-extend.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

// Known limitation: optional `never` is inferred as `undefined`; required `never` retains its strictNever policy.
expectTypeOf<SomeExtend<[never?], never>>().toBe<false>();
expectTypeOf<SomeExtend<[never?], number, {strictNever: false}>>().toBe<false>();
expectTypeOf<SomeExtend<[undefined?], never>>().toBe<false>();
expectTypeOf<SomeExtend<readonly [never?], undefined>>().toBe<true>();
expectTypeOf<SomeExtend<[never], number, {strictNever: false}>>().toBe<true>();

expectTypeOf<SomeExtend<[], number>>().toBe<false>();
expectTypeOf<SomeExtend<[1, '2', '3'], number>>().toBe<true>(); // First element matches
expectTypeOf<SomeExtend<['1', '2', 3], number>>().toBe<true>(); // Last element matches
expectTypeOf<SomeExtend<['1', 2, '3'], number>>().toBe<true>(); // Mid element matches
expectTypeOf<SomeExtend<[number, '1', 2, `${number}`], string>>().toBe<true>(); // Multiple elements match
expectTypeOf<SomeExtend<[1, 2, 3], number>>().toBe<true>(); // All elements match
// Trailing rest element
expectTypeOf<SomeExtend<['2', 1, ...string[]], number>>().toBe<true>(); // Non-rest element matches
expectTypeOf<SomeExtend<['2', '1', ...number[]], number>>().toBe<true>(); // Rest element matches
// Leading rest element
expectTypeOf<SomeExtend<[...Array<1 | -1>, number, string], string>>().toBe<true>(); // Non-rest element matches
expectTypeOf<SomeExtend<[...Array<1 | -1>, string, string], number>>().toBe<true>(); // Rest element matches
// Middle rest element
expectTypeOf<SomeExtend<[string, number, ...string[], string, string], number>>().toBe<true>(); // Non-rest element before rest element matches
expectTypeOf<SomeExtend<[string, string, ...string[], number, string], number>>().toBe<true>(); // Non-rest element after rest element matches
expectTypeOf<SomeExtend<[string, ...number[], string, string], number>>().toBe<true>(); // Rest element matches

expectTypeOf<SomeExtend<['1', '2', '3'], number>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, 3], string>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, 3, ...string[]], bigint>>().toBe<false>();
expectTypeOf<SomeExtend<[...bigint[], true, false], number | string>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, ...number[], '1', 3], true>>().toBe<false>();
expectTypeOf<SomeExtend<['1', '2', ...bigint[]], number>>().toBe<false>();

// Union targets
expectTypeOf<SomeExtend<['1', '2', 3], number | bigint>>().toBe<true>();
expectTypeOf<SomeExtend<[1, false, 0, true, 1], boolean>>().toBe<true>();
expectTypeOf<SomeExtend<[...bigint[], number, string], number | string>>().toBe<true>();

// Union type elements
expectTypeOf<boolean>().toBe<SomeExtend<[number, string | number], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<[false, false, false, boolean], true>>();
expectTypeOf<boolean>().toBe<SomeExtend<[true, true, boolean, true], false>>();
expectTypeOf<SomeExtend<[1, 2n, number | bigint, 3n], string>>().toBe<false>();
expectTypeOf<SomeExtend<['1', '2', number | bigint, '3'], number | bigint>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<[true, false, true, ...Array<string | undefined>], string | number>>();
expectTypeOf<SomeExtend<['foo', ...Array<number | string>, 'bar'], bigint | undefined>>().toBe<false>();

// Readonly arrays
expectTypeOf<SomeExtend<readonly [], number>>().toBe<false>();
expectTypeOf<SomeExtend<readonly ['1', 2, '3'], number>>().toBe<true>();
expectTypeOf<SomeExtend<readonly ['1', '2', '3'], number>>().toBe<false>();
expectTypeOf<SomeExtend<readonly ['^', ...number[], '$'], number>>().toBe<true>();

// Optional elements
// Optional absence does not add `undefined` to the declared element type.
// An explicit `undefined` still participates in the match and can make the result `boolean`.
expectTypeOf<SomeExtend<['1'?, '2'?, 3?], number>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<['1'?, (2 | undefined)?], number>>();
expectTypeOf<SomeExtend<[1?, '2'?, 3?], string | undefined>>().toBe<true>();
expectTypeOf<SomeExtend<[1, 2?, 3?, ...string[]], string>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<['1', '2'?, '3'?, ...Array<number | undefined>], number>>();
expectTypeOf<SomeExtend<[1?, 2?, 3?, ...boolean[]], string>>().toBe<false>();

// Labelled tuples
expectTypeOf<SomeExtend<[x: string, y: number], string>>().toBe<true>();
expectTypeOf<SomeExtend<[x?: number, y?: number], string>>().toBe<false>();
expectTypeOf<SomeExtend<[x?: string, y?: string, ...rest: number[]], number>>().toBe<true>();
expectTypeOf<SomeExtend<[...rest: number[], z: string], string>>().toBe<true>();
expectTypeOf<SomeExtend<[...rest: number[], z: string], bigint>>().toBe<false>();

// Non-tuple arrays
expectTypeOf<SomeExtend<string[], string>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<Array<string | number>, number>>();
expectTypeOf<boolean>().toBe<SomeExtend<ReadonlyArray<string | undefined>, string>>();
expectTypeOf<SomeExtend<[...readonly boolean[]], string>>().toBe<false>();

// Unions
expectTypeOf<SomeExtend<['1', '2', 3] | ['4', 5, '6'], number>>().toBe<true>(); // Both `true`
expectTypeOf<SomeExtend<[1, 2, 3] | ['4', '5', '6'], bigint>>().toBe<false>(); // Both `false`
expectTypeOf<boolean>().toBe<SomeExtend<['1', '2', '3'] | ['1', '2', 3], number>>(); // One `true`, one `false`
expectTypeOf<boolean>().toBe<SomeExtend<[true, false] | [false, boolean], true>>(); // One `true`, one `boolean`
expectTypeOf<boolean>().toBe<SomeExtend<[false, false] | [boolean, false], true>>(); // One `false`, one `boolean`

expectTypeOf<SomeExtend<[string, string, ...number[]] | [number, string, ...number[]], number>>().toBe<true>();
expectTypeOf<SomeExtend<readonly [(number | bigint)?, ...string[]] | [0, 'a', 'b'] | [...ReadonlyArray<string | number>, 1], true>>().toBe<false>();
expectTypeOf<boolean>().toBe<SomeExtend<number[] | [...ReadonlyArray<string | number>, number], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<readonly number[] | [...rest: string[], l1: string, l2: string] | [(number | string)?, string?, ...string[]], number>>();

// Boundary cases
expectTypeOf<SomeExtend<[], any>>().toBe<false>();
expectTypeOf<SomeExtend<[], never>>().toBe<false>();
// `never` target
expectTypeOf<SomeExtend<[number, string, boolean], never>>().toBe<false>();
expectTypeOf<SomeExtend<[number, string, never], never>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<[number, string, any], never>>();
// `any` target
expectTypeOf<SomeExtend<[number], any>>().toBe<true>();
expectTypeOf<SomeExtend<[never], any>>().toBe<true>();
expectTypeOf<SomeExtend<[any], any>>().toBe<true>();
// `never` and `any` elements
expectTypeOf<SomeExtend<[1, 2, never], string>>().toBe<false>();
expectTypeOf<boolean>().toBe<SomeExtend<[1, 2, any], string>>();
// `never[]` and `any[]` elements
expectTypeOf<boolean>().toBe<SomeExtend<[1, 2, ...any[]], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<[1, 2, ...any[], 3, 4], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<[...any[], 3, 4], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<any[], number>>();
expectTypeOf<SomeExtend<[1, 2, ...never[]], string>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, ...never[], 3, 4], string>>().toBe<false>();
expectTypeOf<SomeExtend<[...never[], 1, 2], string>>().toBe<false>();
expectTypeOf<SomeExtend<never[], number>>().toBe<false>();

// === strictNever: false ===
type NonStrictNeverSomeExtend<TArray extends UnknownArray, Type> = SomeExtend<TArray, Type, {strictNever: false}>;

// `never` elements
expectTypeOf<NonStrictNeverSomeExtend<[1, 2, never], string>>().toBe<true>();
// `never[]` elements
expectTypeOf<NonStrictNeverSomeExtend<[1, 2, ...never[]], string>>().toBe<true>();
expectTypeOf<NonStrictNeverSomeExtend<[1, 2, ...never[], 3, 4], string>>().toBe<true>();
expectTypeOf<NonStrictNeverSomeExtend<[...never[], 1, 2], string>>().toBe<true>();
expectTypeOf<NonStrictNeverSomeExtend<never[], number>>().toBe<true>();

expectTypeOf<SomeExtend<any, never>>().toBe<false>();
expectTypeOf<SomeExtend<never, any>>().toBe<false>();

// Recursion depth at which the previous non-tail-recursive implementation started to fail.
// The rest-first case below stays at 200 because collapsing a long rest frontier is still expensive.
type TwoHundredZeroes = TupleOf<200, '0'>;
expectTypeOf<SomeExtend<TwoHundredZeroes, number>>().toBe<false>();

// Elements that follow a rest element are collapsed by a separate branch.
expectTypeOf<SomeExtend<[...number[], ...TwoHundredZeroes], bigint>>().toBe<false>();

// The first element decides this query without traversing the remaining 1,200 elements.
type LongUndecidedTail = [...TupleOf<600, 1>, ...TupleOf<600, 1>];
expectTypeOf<SomeExtend<[0, ...LongUndecidedTail], 0>>().toBe<true>();

// Metadata must not change the existing element-inference boundary.
expectTypeOf<SomeExtend<readonly [1, 2?] & {readonly metadata: 'tuple'}, number>>().toBe<true>();
expectTypeOf<SomeExtend<readonly [unknown, ...never[]], never>>().toBe<true>();
expectTypeOf<SomeExtend<readonly [(number | undefined)?], number>>().toBe<boolean>();

function _genericSomeResult<Values extends UnknownArray, Target, Options extends SomeExtendOptions>(result: SomeExtend<Values, Target, Options>): boolean {
	return result;
}

declare function containsString<const Values extends UnknownArray>(values: Values & (SomeExtend<Values, string> extends true ? unknown : never)): Values;
// Binding the call to a variable drops the contextual type, which earlier versions used to widen the `const` tuple to mutable.
const readyValues = containsString([1, 'ready']);
expectTypeOf(readyValues).toBe<readonly [1, 'ready']>();
// @ts-expect-error At least one element must be a string.
containsString([1, 2]);
// @ts-expect-error An empty tuple has no matching element.
containsString([]);

// A late match still decides the result when the required prefix never matches.
expectTypeOf<SomeExtend<[...TwoHundredZeroes, 1], number>>().toBe<true>();
expectTypeOf<SomeExtend<readonly ['skip', (2 | undefined)?, ...number[]], undefined>>().toBe<boolean>();
expectTypeOf<SomeExtend<readonly [...number[], false, true], true>>().toBe<true>();
const readonlyStrings = [1, 'ready'] as const;
expectTypeOf(containsString(readonlyStrings)).toBe<typeof readonlyStrings>();
// @ts-expect-error The input must be an array or tuple.
type UnknownSome = SomeExtend<unknown, number>;

// Definite union-element matches must not consume a recursion frame for every union member.
expectTypeOf<SomeExtend<TupleOf<200, 1 | 2>, string>>().toBe<false>();

// Normalizing a match must retain its original generic constraint.
function _nonNumericSome<Value extends string>(value: SomeExtend<[Value], number>): false {
	return value;
}

expectTypeOf<SomeExtend<Readonly<TupleOf<500, 1 | 2>>, string>>().toBe<false>();
expectTypeOf<SomeExtend<readonly [...TupleOf<200, 1 | 2>, 3 | 'found'], string>>().toBe<boolean>();
expectTypeOf<SomeExtend<[...TupleOf<200, 1 | 2>, 3 | 'found', 'found'], string>>().toBe<true>();

// A known strict mode remains constructible while its options are generic.
function _strictNeverSomeOptions<Options extends {strictNever: true}>(): SomeExtend<[never], number, Options> {
	return false;
}

// Optional settings and sentinel option objects keep their defaults.
expectTypeOf<SomeExtend<[never], number, {strictNever?: boolean}>>().toBe<false>();
expectTypeOf<SomeExtend<[never], number, any>>().toBe<false>();
expectTypeOf<SomeExtend<[never], number, never>>().toBe<false>();

// A definite match can be constructed while unrelated options remain generic.
function _constructKnownSomeMatch<Options extends SomeExtendOptions>(): SomeExtend<[1], number, Options> {
	return true;
}

// A definite result can be read through a conditional type while the options are generic.
type DefiniteSomeMatch<Options extends SomeExtendOptions> = SomeExtend<[1, 2], number, Options> extends true ? 'yes' : 'no';
function _readDefiniteSomeMatch<Options extends SomeExtendOptions>(value: DefiniteSomeMatch<Options>): 'yes' {
	return value;
}

// An unresolved element may match, so the result cannot be assumed to be false.
function _readGenericMatch<Value extends boolean>(value: SomeExtend<[Value], true>): false {
	// @ts-expect-error Instantiating Value as true makes this result true.
	return value;
}

// A generic target can still include the element being tested.
function _readGenericTarget<Target extends string>(value: SomeExtend<['ready'], Target>): false {
	// @ts-expect-error Target can be instantiated as 'ready'.
	return value;
}

// Object constraints must retain the possibility of a structural match.
function _readGenericObject<Value extends {id: number}>(value: SomeExtend<readonly [Value], {id: number}>): false {
	// @ts-expect-error A matching object makes this result true.
	return value;
}

function readGenericResult<Value extends boolean>(value: SomeExtend<[Value], true>): boolean {
	return value;
}

expectTypeOf(readGenericResult<true>(true)).toBe<boolean>();
expectTypeOf(readGenericResult<false>(false)).toBe<boolean>();
// @ts-expect-error A matching element cannot produce false.
readGenericResult<true>(false);
// @ts-expect-error A non-matching element cannot produce true.
readGenericResult<false>(true);
