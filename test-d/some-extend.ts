import {expectType} from 'tsd';
import type {SomeExtend} from '../source/some-extend.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

expectType<SomeExtend<[], number>>(false);
expectType<SomeExtend<[1, '2', '3'], number>>(true); // First element matches
expectType<SomeExtend<['1', '2', 3], number>>(true); // Last element matches
expectType<SomeExtend<['1', 2, '3'], number>>(true); // Mid element matches
expectType<SomeExtend<[number, '1', 2, `${number}`], string>>(true); // Multiple elements match
expectType<SomeExtend<[1, 2, 3], number>>(true); // All elements match
// Trailing rest element
expectType<SomeExtend<['2', 1, ...string[]], number>>(true); // Non-rest element matches
expectType<SomeExtend<['2', '1', ...number[]], number>>(true); // Rest element matches
// Leading rest element
expectType<SomeExtend<[...Array<1 | -1>, number, string], string>>(true); // Non-rest element matches
expectType<SomeExtend<[...Array<1 | -1>, string, string], number>>(true); // Rest element matches
// Middle rest element
expectType<SomeExtend<[string, number, ...string[], string, string], number>>(true); // Non-rest element before rest element matches
expectType<SomeExtend<[string, string, ...string[], number, string], number>>(true); // Non-rest element after rest element matches
expectType<SomeExtend<[string, ...number[], string, string], number>>(true); // Rest element matches

expectType<SomeExtend<['1', '2', '3'], number>>(false);
expectType<SomeExtend<[1, 2, 3], string>>(false);
expectType<SomeExtend<[1, 2, 3, ...string[]], bigint>>(false);
expectType<SomeExtend<[...bigint[], true, false], number | string>>(false);
expectType<SomeExtend<[1, 2, ...number[], '1', 3], true>>(false);
expectType<SomeExtend<['1', '2', ...bigint[]], number>>(false);

// Union targets
expectType<SomeExtend<['1', '2', 3], number | bigint>>(true);
expectType<SomeExtend<[1, false, 0, true, 1], boolean>>(true);
expectType<SomeExtend<[...bigint[], number, string], number | string>>(true);

// Union type elements
expectType<SomeExtend<[number, string | number], string>>({} as boolean);
expectType<SomeExtend<[false, false, false, boolean], true>>({} as boolean);
expectType<SomeExtend<[true, true, boolean, true], false>>({} as boolean);
expectType<SomeExtend<[1, 2n, number | bigint, 3n], string>>(false);
expectType<SomeExtend<['1', '2', number | bigint, '3'], number | bigint>>(true);
expectType<SomeExtend<[true, false, true, ...Array<string | undefined>], string | number>>({} as boolean);
expectType<SomeExtend<['foo', ...Array<number | string>, 'bar'], bigint | undefined>>(false);

// Readonly arrays
expectType<SomeExtend<readonly [], number>>(false);
expectType<SomeExtend<readonly ['1', 2, '3'], number>>(true);
expectType<SomeExtend<readonly ['1', '2', '3'], number>>(false);
expectType<SomeExtend<readonly ['^', ...number[], '$'], number>>(true);

// Optional elements
// If `exactOptionalPropertyTypes` were disabled, the target type would need an additional `| undefined` for a successful match.
// For example, `SomeExtend<['1'?, 2?], number>` would return `boolean`. To make it return `true`, the target type must be `number | undefined`.
expectType<SomeExtend<['1'?, '2'?, 3?], number>>(true);
expectType<SomeExtend<['1'?, (2 | undefined)?], number>>({} as boolean);
expectType<SomeExtend<[1?, '2'?, 3?], string | undefined>>(true);
expectType<SomeExtend<[1, 2?, 3?, ...string[]], string>>(true);
expectType<SomeExtend<['1', '2'?, '3'?, ...Array<number | undefined>], number>>({} as boolean);
expectType<SomeExtend<[1?, 2?, 3?, ...boolean[]], string>>(false);

// Labelled tuples
expectType<SomeExtend<[x: string, y: number], string>>(true);
expectType<SomeExtend<[x?: number, y?: number], string>>(false);
expectType<SomeExtend<[x?: string, y?: string, ...rest: number[]], number>>(true);
expectType<SomeExtend<[...rest: number[], z: string], string>>(true);
expectType<SomeExtend<[...rest: number[], z: string], bigint>>(false);

// Non-tuple arrays
expectType<SomeExtend<string[], string>>(true);
expectType<SomeExtend<Array<string | number>, number>>({} as boolean);
expectType<SomeExtend<ReadonlyArray<string | undefined>, string>>({} as boolean);
expectType<SomeExtend<[...readonly boolean[]], string>>(false);

// Unions
expectType<SomeExtend<['1', '2', 3] | ['4', 5, '6'], number>>(true); // Both `true`
expectType<SomeExtend<[1, 2, 3] | ['4', '5', '6'], bigint>>(false); // Both `false`
expectType<SomeExtend<['1', '2', '3'] | ['1', '2', 3], number>>({} as boolean); // One `true`, one `false`
expectType<SomeExtend<[true, false] | [false, boolean], true>>({} as boolean); // One `true`, one `boolean`
expectType<SomeExtend<[false, false] | [boolean, false], true>>({} as boolean); // One `false`, one `boolean`

expectType<SomeExtend<[string, string, ...number[]] | [number, string, ...number[]], number>>(true);
expectType<SomeExtend<readonly [(number | bigint)?, ...string[]] | [0, 'a', 'b'] | [...ReadonlyArray<string | number>, 1], true>>(false);
expectType<SomeExtend<number[] | [...ReadonlyArray<string | number>, number], string>>({} as boolean);
expectType<SomeExtend<readonly number[] | [...rest: string[], l1: string, l2: string] | [(number | string)?, string?, ...string[]], number>>(
	{} as boolean,
);

// Boundary cases
expectType<SomeExtend<[], any>>(false);
expectType<SomeExtend<[], never>>(false);
// `never` target
expectType<SomeExtend<[number, string, boolean], never>>(false);
expectType<SomeExtend<[number, string, never], never>>(true);
expectType<SomeExtend<[number, string, any], never>>({} as boolean);
// `any` target
expectType<SomeExtend<[number], any>>(true);
expectType<SomeExtend<[never], any>>(true);
expectType<SomeExtend<[any], any>>(true);
// `never` and `any` elements
expectType<SomeExtend<[1, 2, never], string>>(false);
expectType<SomeExtend<[1, 2, any], string>>({} as boolean);
// `never[]` and `any[]` elements
expectType<SomeExtend<[1, 2, ...any[]], string>>({} as boolean);
expectType<SomeExtend<[1, 2, ...any[], 3, 4], string>>({} as boolean);
expectType<SomeExtend<[...any[], 3, 4], string>>({} as boolean);
expectType<SomeExtend<any[], number>>({} as boolean);
expectType<SomeExtend<[1, 2, ...never[]], string>>(false);
expectType<SomeExtend<[1, 2, ...never[], 3, 4], string>>(false);
expectType<SomeExtend<[...never[], 1, 2], string>>(false);
expectType<SomeExtend<never[], number>>(false);

// === strictNever: false ===
type NonStrictNeverSomeExtend<TArray extends UnknownArray, Type> = SomeExtend<TArray, Type, {strictNever: false}>;

// `never` elements
expectType<NonStrictNeverSomeExtend<[1, 2, never], string>>(true);
// `never[]` elements
expectType<NonStrictNeverSomeExtend<[1, 2, ...never[]], string>>(true);
expectType<NonStrictNeverSomeExtend<[1, 2, ...never[], 3, 4], string>>(true);
expectType<NonStrictNeverSomeExtend<[...never[], 1, 2], string>>(true);
expectType<NonStrictNeverSomeExtend<never[], number>>(true);

expectType<SomeExtend<any, never>>(false);
expectType<SomeExtend<never, any>>(false);
