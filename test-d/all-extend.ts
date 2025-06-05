import {expectType} from 'tsd';
import type {AllExtend} from '../source/all-extend.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

expectType<AllExtend<[], number>>(true);
expectType<AllExtend<[1, 2, 3], number>>(true);
expectType<AllExtend<[1, 2, 3], number | bigint>>(true);
expectType<AllExtend<[true, false, true, false, boolean], boolean>>(true);
expectType<AllExtend<[string, '1', '2', `${number}`], string>>(true);
expectType<AllExtend<[1, 2, 3, ...number[]], number>>(true);
expectType<AllExtend<[number, number, ...Array<1 | -1>], number>>(true);
expectType<AllExtend<[...number[], number, string], number | string>>(true);
expectType<AllExtend<['^', ...string[], '$'], string>>(true);

expectType<AllExtend<[1, 2, '3'], number>>(false);
expectType<AllExtend<['1', 2, 3], number>>(false);
expectType<AllExtend<['1', '2', '3', 4, '5'], string>>(false);
expectType<AllExtend<[1, 2, 3, ...string[]], number>>(false);
expectType<AllExtend<[...bigint[], number, string], number | string>>(false);
expectType<AllExtend<[1, 2, ...number[], '1', 3], number>>(false);
expectType<AllExtend<[1, 2, ...string[], 3, 4], number>>(false);

// Union type elements
expectType<AllExtend<[string, string | number], string>>({} as boolean);
expectType<AllExtend<[true, true, true, boolean], true>>({} as boolean);
expectType<AllExtend<[false, false, boolean, false], false>>({} as boolean);
expectType<AllExtend<['1', '2', number | bigint, '3'], string>>(false);
expectType<AllExtend<[1, 2, number | bigint, 3], number | bigint>>(true);
expectType<AllExtend<[1, 2, 3, ...Array<string | undefined>], string | number>>({} as boolean);
expectType<AllExtend<['foo', ...Array<string | undefined>, 'bar'], string | undefined>>(true);

// Readonly arrays
expectType<AllExtend<readonly [], number>>(true);
expectType<AllExtend<readonly [1, 2, 3], number>>(true);
expectType<AllExtend<readonly [1, 2, '3'], number>>(false);
expectType<AllExtend<readonly ['^', ...string[], '$'], string>>(true);
expectType<AllExtend<readonly [number, ...readonly string[], number], string>>(false);
expectType<AllExtend<readonly [...bigint[], number, string], number | string>>(false);
expectType<AllExtend<readonly [...ReadonlyArray<string | undefined>, string, string], string | undefined>>(true);

// Optional elements
// If `exactOptionalPropertyTypes` were disabled, the target type would need an additional `| undefined` for a successful match.
// For example, `AllExtend<[1?, 2?], number>` would return `false`. To make it return `true`, the target type must be `number | undefined`.
expectType<AllExtend<[1?, 2?, 3?], number>>(true);
expectType<AllExtend<[1?, (2 | undefined)?], number>>({} as boolean);
expectType<AllExtend<[1?, 2?, 3?], number | undefined>>(true);
expectType<AllExtend<[1, 2?, 3?, ...number[]], number>>(true);
expectType<AllExtend<[1, 2?, 3?, ...Array<number | undefined>], number>>({} as boolean);
expectType<AllExtend<[1?, 2?, 3?, ...string[]], number>>(false);

// Labelled tuples
expectType<AllExtend<[x: string, y: string], string>>(true);
expectType<AllExtend<[x?: string, y?: number], string>>(false);
expectType<AllExtend<[x?: number, y?: number, ...rest: number[]], number>>(true);
expectType<AllExtend<[...rest: number[], z: string], number>>(false);

// Non-tuple arrays
expectType<AllExtend<string[], string>>(true);
expectType<AllExtend<Array<string | number>, number>>({} as boolean);
expectType<AllExtend<ReadonlyArray<string | undefined>, string>>({} as boolean);
expectType<AllExtend<[...readonly boolean[]], string>>(false);

// Unions
expectType<AllExtend<[1, 2, 3] | [4, 5, 6], number>>(true); // Both `true`
expectType<AllExtend<[1, 2, '3'] | [4, 5, '6'], number>>(false); // Both `false`
expectType<AllExtend<[1, 2, 3] | ['1', '2', 3], number>>({} as boolean); // One `true`, one `false`
expectType<AllExtend<[true, true] | [true, boolean], true>>({} as boolean); // One `true`, one `boolean`
expectType<AllExtend<[true, false] | [true, boolean], true>>({} as boolean); // One `false`, one `boolean`

expectType<AllExtend<[string, string, ...string[]] | [number, number, ...number[]], number | string>>(true);
expectType<AllExtend<readonly [(number | bigint)?, ...string[]] | [0, 'a', 'b'] | [...ReadonlyArray<string | number>, 1], string>>(false);
expectType<AllExtend<string[] | [...ReadonlyArray<string | number>, string], string>>({} as boolean);
expectType<AllExtend<readonly number[] | [...rest: number[], l1: number, l2: number] | [number?, string?, ...string[]], number>>(
	{} as boolean,
);

// Boundary cases
expectType<AllExtend<[], any>>(true);
expectType<AllExtend<[], never>>(true);
expectType<AllExtend<[1, 2, '3', true, false, string[], never], any>>(true);
expectType<AllExtend<[any, any], any>>(true);
expectType<AllExtend<[never, never], any>>(true);
expectType<AllExtend<[1, 2], never>>(false);
expectType<AllExtend<[never, never], never>>(true);
expectType<AllExtend<[never, never, number], never>>(false);
expectType<AllExtend<[number, never, never], never>>(false);
expectType<AllExtend<[never, number, never, any, never], never>>(false);
expectType<AllExtend<[never, any, never, any], never>>({} as boolean);
expectType<AllExtend<[1, 2, any], number>>({} as boolean);
expectType<AllExtend<[1, 2, never], number>>(false);
expectType<AllExtend<[1, 2, ...never[]], number>>(false);

expectType<AllExtend<[1, 2, ...any[]], number>>({} as boolean);
expectType<AllExtend<[...any[], 1, 2], number>>({} as boolean);
expectType<AllExtend<['a', 'b', ...any[], Uppercase<string>, `${number}`], string>>({} as boolean);
expectType<AllExtend<[1, 2, ...string[]], any>>(true);
expectType<AllExtend<[...number[], never, never], any>>(true);
expectType<AllExtend<['a', 'b', ...any[], 1, 2], any>>(true);
expectType<AllExtend<[never, never, ...number[]], never>>(false);
expectType<AllExtend<[never, ...never[], never], never>>(true);
expectType<AllExtend<[...never[], never, string], never>>(false);
expectType<AllExtend<[never, ...any[], never], never>>({} as boolean);

// === strictNever: false ===
type NonStrictNeverAllExtend<TArray extends UnknownArray, Type> = AllExtend<TArray, Type, {strictNever: false}>;

expectType<NonStrictNeverAllExtend<[1, 2, never], number>>(true);
expectType<NonStrictNeverAllExtend<[1, 2, ...never[]], number>>(true);
expectType<NonStrictNeverAllExtend<[...never[], 'a', 'b'], string>>(true);
expectType<NonStrictNeverAllExtend<[never, never], never>>(true);
expectType<NonStrictNeverAllExtend<[never, ...never[], never], any>>(true);
expectType<NonStrictNeverAllExtend<[1, 2, never, ...never[]], any>>(true);
expectType<NonStrictNeverAllExtend<[never, number], never>>(false);
expectType<NonStrictNeverAllExtend<[never, any, never, any], never>>({} as boolean);

expectType<AllExtend<any, never>>(false);
expectType<AllExtend<never, any>>(false);
