import {expectType} from 'tsd';
import type {Every} from '../source/every.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

expectType<Every<[], number>>(true);
expectType<Every<[1, 2, 3], number>>(true);
expectType<Every<[1, 2, 3], number | bigint>>(true);
expectType<Every<[true, false, true, false, boolean], boolean>>(true);
expectType<Every<[string, '1', '2', `${number}`], string>>(true);
expectType<Every<[1, 2, 3, ...number[]], number>>(true);
expectType<Every<[number, number, ...Array<1 | -1>], number>>(true);
expectType<Every<[...number[], number, string], number | string>>(true);
expectType<Every<['^', ...string[], '$'], string>>(true);

expectType<Every<[1, 2, '3'], number>>(false);
expectType<Every<['1', 2, 3], number>>(false);
expectType<Every<['1', '2', '3', 4, '5'], string>>(false);
expectType<Every<[1, 2, 3, ...string[]], number>>(false);
expectType<Every<[...bigint[], number, string], number | string>>(false);
expectType<Every<[1, 2, ...number[], '1', 3], number>>(false);
expectType<Every<[1, 2, ...string[], 3, 4], number>>(false);

// Union type elements
expectType<Every<[string, string | number], string>>({} as boolean);
expectType<Every<[true, true, true, boolean], true>>({} as boolean);
expectType<Every<[false, false, boolean, false], false>>({} as boolean);
expectType<Every<['1', '2', number | bigint, '3'], string>>(false);
expectType<Every<[1, 2, number | bigint, 3], number | bigint>>(true);
expectType<Every<[1, 2, 3, ...Array<string | undefined>], string | number>>({} as boolean);
expectType<Every<['foo', ...Array<string | undefined>, 'bar'], string | undefined>>(true);

// Readonly arrays
expectType<Every<readonly [], number>>(true);
expectType<Every<readonly [1, 2, 3], number>>(true);
expectType<Every<readonly [1, 2, '3'], number>>(false);
expectType<Every<readonly ['^', ...string[], '$'], string>>(true);
expectType<Every<readonly [number, ...readonly string[], number], string>>(false);
expectType<Every<readonly [...bigint[], number, string], number | string>>(false);
expectType<Every<readonly [...ReadonlyArray<string | undefined>, string, string], string | undefined>>(true);

// Optional elements
// If `exactOptionalPropertyTypes` were disabled, the target type would need an additional `| undefined` for a successful match.
// For example, `Every<[1?, 2?], number>` would return `false`. To make it return `true`, the target type must be `number | undefined`.
expectType<Every<[1?, 2?, 3?], number>>(true);
expectType<Every<[1?, (2 | undefined)?], number>>({} as boolean);
expectType<Every<[1?, 2?, 3?], number | undefined>>(true);
expectType<Every<[1, 2?, 3?, ...number[]], number>>(true);
expectType<Every<[1, 2?, 3?, ...Array<number | undefined>], number>>({} as boolean);
expectType<Every<[1?, 2?, 3?, ...string[]], number>>(false);

// Labelled tuples
expectType<Every<[x: string, y: string], string>>(true);
expectType<Every<[x?: string, y?: number], string>>(false);
expectType<Every<[x?: number, y?: number, ...rest: number[]], number>>(true);
expectType<Every<[...rest: number[], z: string], number>>(false);

// Non-tuple arrays
expectType<Every<string[], string>>(true);
expectType<Every<Array<string | number>, number>>({} as boolean);
expectType<Every<ReadonlyArray<string | undefined>, string>>({} as boolean);
expectType<Every<[...readonly boolean[]], string>>(false);

// Unions
expectType<Every<[1, 2, 3] | [4, 5, 6], number>>(true); // Both `true`
expectType<Every<[1, 2, '3'] | [4, 5, '6'], number>>(false); // Both `false`
expectType<Every<[1, 2, 3] | ['1', '2', 3], number>>({} as boolean); // One `true`, one `false`
expectType<Every<[true, true] | [true, boolean], true>>({} as boolean); // One `true`, one `boolean`
expectType<Every<[true, false] | [true, boolean], true>>({} as boolean); // One `false`, one `boolean`

expectType<Every<[string, string, ...string[]] | [number, number, ...number[]], number | string>>(true);
expectType<Every<readonly [(number | bigint)?, ...string[]] | [0, 'a', 'b'] | [...ReadonlyArray<string | number>, 1], string>>(false);
expectType<Every<string[] | [...ReadonlyArray<string | number>, string], string>>({} as boolean);
expectType<Every<readonly number[] | [...rest: number[], l1: number, l2: number] | [number?, string?, ...string[]], number>>(
	{} as boolean,
);

// Boundary cases
expectType<Every<[], any>>(true);
expectType<Every<[], never>>(true);
expectType<Every<[1, 2, '3', true, false, string[], never], any>>(true);
expectType<Every<[any, any], any>>(true);
expectType<Every<[never, never], any>>(true);
expectType<Every<[1, 2], never>>(false);
expectType<Every<[never, never], never>>(true);
expectType<Every<[never, never, number], never>>(false);
expectType<Every<[number, never, never], never>>(false);
expectType<Every<[never, number, never, any, never], never>>(false);
expectType<Every<[never, any, never, any], never>>({} as boolean);
expectType<Every<[1, 2, any], number>>({} as boolean);
expectType<Every<[1, 2, never], number>>(false);
expectType<Every<[1, 2, ...never[]], number>>(false);

expectType<Every<[1, 2, ...any[]], number>>({} as boolean);
expectType<Every<[...any[], 1, 2], number>>({} as boolean);
expectType<Every<['a', 'b', ...any[], Uppercase<string>, `${number}`], string>>({} as boolean);
expectType<Every<[1, 2, ...string[]], any>>(true);
expectType<Every<[...number[], never, never], any>>(true);
expectType<Every<['a', 'b', ...any[], 1, 2], any>>(true);
expectType<Every<[never, never, ...number[]], never>>(false);
expectType<Every<[never, ...never[], never], never>>(true);
expectType<Every<[...never[], never, string], never>>(false);
expectType<Every<[never, ...any[], never], never>>({} as boolean);

// === strictNever: false ===
type NonStrictNeverEvery<TArray extends UnknownArray, Type> = Every<TArray, Type, {strictNever: false}>;

expectType<NonStrictNeverEvery<[1, 2, never], number>>(true);
expectType<NonStrictNeverEvery<[1, 2, ...never[]], number>>(true);
expectType<NonStrictNeverEvery<[...never[], 'a', 'b'], string>>(true);
expectType<NonStrictNeverEvery<[never, never], never>>(true);
expectType<NonStrictNeverEvery<[never, ...never[], never], any>>(true);
expectType<NonStrictNeverEvery<[1, 2, never, ...never[]], any>>(true);
expectType<NonStrictNeverEvery<[never, number], never>>(false);
expectType<NonStrictNeverEvery<[never, any, never, any], never>>({} as boolean);

expectType<Every<any, never>>(false);
expectType<Every<never, any>>(false);
