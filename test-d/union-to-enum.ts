import {expectTypeOf} from 'nz';
import type {UnionToEnum} from '../index.d.ts';

// Union input
expectTypeOf<UnionToEnum<'Only'>>().toBe<{readonly Only: 'Only'}>();
expectTypeOf<UnionToEnum<'b' | 'a' | 'd' | 'c'>>().toBe<{readonly a: 'a'; readonly b: 'b'; readonly c: 'c'; readonly d: 'd'}>();
expectTypeOf<UnionToEnum<3 | 2 | 4 | 1>>().toBe<{readonly 1: 1; readonly 2: 2; readonly 3: 3; readonly 4: 4}>();
expectTypeOf<UnionToEnum<0 | -1 | 42>>().toBe<{readonly 0: 0; readonly [-1]: -1; readonly 42: 42}>();

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;
expectTypeOf<UnionToEnum<typeof sym1 | typeof sym2>>().toBe<{readonly [sym1]: typeof sym1; readonly [sym2]: typeof sym2}>();

// Non-literal members are ignored
expectTypeOf<UnionToEnum<string>>().toBe<{}>();
expectTypeOf<UnionToEnum<number>>().toBe<{}>();
expectTypeOf<UnionToEnum<symbol>>().toBe<{}>();
expectTypeOf<UnionToEnum<number | string>>().toBe<{}>();
expectTypeOf<UnionToEnum<`foo${string}` | 'bar'>>().toBe<{readonly bar: 'bar'}>();

// `never` / `any`
expectTypeOf<UnionToEnum<never>>().toBe<{}>();
expectTypeOf<UnionToEnum<any>>().toBe<{}>();

// Invalid input
// @ts-expect-error
type InvalidBoolean = UnionToEnum<boolean>;
// @ts-expect-error
type InvalidUnknown = UnionToEnum<unknown>;

// Template literal unions
type Verb = 'write' | 'read';
type Resource = 'file' | 'link';
expectTypeOf<UnionToEnum<`${Verb}_${Resource}`>>().toBe<{
	readonly write_file: 'write_file';
	readonly write_link: 'write_link';
	readonly read_file: 'read_file';
	readonly read_link: 'read_link';
}>();
