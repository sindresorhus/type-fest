import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {BuildObject, KeyAliases, JsonifyObjectProperties} from '../../source/internal/index.d.ts';

// `JsonifyObjectProperties` turns `a: string | undefined` into `a?: string`.
expectTypeOf<IsEqual<JsonifyObjectProperties<{firstName: string; lastName: string | undefined}>, {firstName: string; lastName?: string}>>().toBe<true>();
expectTypeOf<IsEqual<JsonifyObjectProperties<{a: 1}>, {a: 1}>>().toBe<true>();

// `BuildObject` picks from the copied-from object when the key is already there, so the value type is replaced without the key changing form. The two that go through `Pick` are left unresolved by `IsEqual`, so they are asserted on the result directly.
declare const fromStringKey: BuildObject<'a', string, {a: 1}>;
expectTypeOf(fromStringKey).toBe<{a: string}>();
declare const fromNumberKey: BuildObject<'0', string, {0: 1}>;
expectTypeOf(fromNumberKey).toBe<{0: string}>();
// A key that is not already there keeps the form it was given in.
expectTypeOf<IsEqual<BuildObject<'b', string, {a: 1}>, {b: string}>>().toBe<true>();
expectTypeOf<IsEqual<BuildObject<'0', string>, {0: string}>>().toBe<true>();

// A record remains data when its containing property may be absent.
expectTypeOf<JsonifyObjectProperties<{value: {name: string} | undefined}>>().toBe<{value?: {name: string}}>();
expectTypeOf<JsonifyObjectProperties<{readonly value: {name: string} | null | undefined}>>().toBe<{readonly value?: {name: string} | null}>();
expectTypeOf<JsonifyObjectProperties<{value: string | (() => void) | undefined}>>().toBe<{}>();

// A literal key next to an index signature is kept, instead of being merged into the index signature.
expectTypeOf<JsonifyObjectProperties<{[key: string]: string; foo: 'a'}>>().toBe<{[key: string]: string; foo: 'a'}>();
expectTypeOf<JsonifyObjectProperties<{[key: string]: string; readonly foo: 'a'}>>().toBe<{[key: string]: string; readonly foo: 'a'}>();
expectTypeOf<JsonifyObjectProperties<{readonly [key: string]: string; foo: 'a'}>>().toBe<{readonly [key: string]: string; foo: 'a'}>();
expectTypeOf<JsonifyObjectProperties<{[key: string]: number; [key: number]: 1; foo: 2; 0: 1}>>().toBe<{[key: string]: number; [key: number]: 1; foo: 2; 0: 1}>();
expectTypeOf<JsonifyObjectProperties<{[key: `x${string}`]: number; foo: 'a'}>>().toBe<{[key: `x${string}`]: number; foo: 'a'}>();
expectTypeOf<JsonifyObjectProperties<Record<string, string> & {foo: 'a'}>>().toBe<{[key: string]: string; foo: 'a'}>();

// A property that `JSON.stringify` drops is removed.
declare const symbolKey: unique symbol;
expectTypeOf<JsonifyObjectProperties<{a: 1; b: undefined; c?: undefined; d: () => void; e: symbol; f: never; [symbolKey]: 1}>>().toBe<{a: 1}>();
expectTypeOf<JsonifyObjectProperties<{[key: symbol]: any; [symbolKey]?: unknown; a: 1}>>().toBe<{a: 1}>();
expectTypeOf<JsonifyObjectProperties<Record<string, () => void> & {foo: 'a'}>>().toBe<{foo: 'a'}>();

// An `any` or `unknown` property is kept as it is, including whether it is optional.
expectTypeOf<JsonifyObjectProperties<{a: any; b: unknown; c?: any; d?: unknown}>>().toBe<{a: any; b: unknown; c?: any; d?: unknown}>();
expectTypeOf<JsonifyObjectProperties<{readonly a: unknown; readonly b?: any}>>().toBe<{readonly a: unknown; readonly b?: any}>();

// A property that is already optional stays optional.
expectTypeOf<JsonifyObjectProperties<{a?: string; b?: string | undefined; readonly c?: 1}>>().toBe<{a?: string; b?: string; readonly c?: 1}>();
expectTypeOf<JsonifyObjectProperties<{a: null}>>().toBe<{a: null}>();
expectTypeOf<JsonifyObjectProperties<{a: null | undefined}>>().toBe<{a?: null}>();
expectTypeOf<JsonifyObjectProperties<{}>>().toBe<{}>();

// An index signature cannot be optional, so the `?` modifier adds `undefined` back to its value. `Jsonify` removes it again when it transforms the value.
expectTypeOf<JsonifyObjectProperties<{[key: string]: string | undefined; foo: 'a' | undefined}>>().toBe<{[key: string]: string | undefined; foo?: 'a'}>();

// An interface is handled like a type literal.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Indexed {
	[key: string]: string | undefined;
	foo: 'a';
	bar?: 'b';
}
expectTypeOf<JsonifyObjectProperties<Indexed>>().toBe<{[key: string]: string | undefined; foo: 'a'; bar?: 'b'}>();

// A numeric key copies the modifiers of a property declared using its string form.
declare const numericKeyFromString: BuildObject<0, string, {readonly '0'?: 1}>;
expectTypeOf(numericKeyFromString).toBe<{readonly '0'?: string}>();
expectTypeOf<BuildObject<0, string, {'0'?: 1}>>().toBe<{'0'?: string}>();
expectTypeOf<BuildObject<0, string, {readonly '0': 1}>>().toBe<{readonly '0': string}>();
expectTypeOf<BuildObject<'0', string, {readonly 0?: 1}>>().toBe<{readonly 0?: string}>();
expectTypeOf<BuildObject<1.5, boolean, {readonly '1.5'?: number}>>().toBe<{readonly '1.5'?: boolean}>();
expectTypeOf<BuildObject<-1, boolean, {readonly '-1'?: number}>>().toBe<{readonly '-1'?: boolean}>();

// Existing keys keep their original spelling, and distinct padded keys remain distinct.
expectTypeOf<keyof BuildObject<0, string, {'0'?: 1}>>().toBe<'0'>();
expectTypeOf<BuildObject<'01', string, {readonly 1?: number}>>().toBe<{'01': string}>();
expectTypeOf<BuildObject<1, string, {readonly '01'?: number}>>().toBe<{1: string}>();
expectTypeOf<BuildObject<'missing', string, {readonly present?: number}>>().toBe<{missing: string}>();

// Key unions continue producing one object per key, while symbols need no conversion.
expectTypeOf<BuildObject<0 | 'a', boolean, {readonly '0'?: number; a: string}>>().toBe<{readonly '0'?: boolean} | {a: boolean}>();
expectTypeOf<BuildObject<typeof symbolKey, boolean, {readonly [symbolKey]?: number}>>().toBe<{readonly [symbolKey]?: boolean}>();
expectTypeOf<BuildObject<0, any, {readonly '0'?: number}>>().toBe<{readonly '0'?: any}>();
expectTypeOf<BuildObject<0, unknown, {readonly '0'?: number}>>().toBe<{readonly '0'?: unknown}>();
expectTypeOf<BuildObject<0, never, {readonly '0'?: number}>>().toBe<{readonly '0'?: never}>();
expectTypeOf<BuildObject<never, string, {'0'?: number}>>().toBe<never>();

// Jsonify normalizes symbols before this helper makes undefined-valued properties optional.
expectTypeOf<JsonifyObjectProperties<{keep: 1; value: string | symbol}>>().toBe<{keep: 1; value: string | symbol}>();
expectTypeOf<JsonifyObjectProperties<{readonly keep: 1; value?: string | symbol}>>().toBe<{readonly keep: 1; value?: string | symbol}>();
expectTypeOf<JsonifyObjectProperties<{keep?: 1; value: string | symbol | undefined}>>().toBe<{keep?: 1; value?: string | symbol}>();
expectTypeOf<JsonifyObjectProperties<{[key: string]: string | symbol; id: 'kept'}>>().toBe<{[key: string]: string | symbol; id: 'kept'}>();
expectTypeOf<JsonifyObjectProperties<{[key: number]: number | symbol; keep: 1}>>().toBe<{[key: number]: number | symbol; keep: 1}>();
expectTypeOf<JsonifyObjectProperties<{0: number | symbol; readonly keep?: 1}>>().toBe<{0: number | symbol; readonly keep?: 1}>();
expectTypeOf<JsonifyObjectProperties<{[symbolKey]: string; keep: 1; value: string | symbol}>>().toBe<{keep: 1; value: string | symbol}>();
expectTypeOf<JsonifyObjectProperties<{any: any; unknown: unknown; impossible: never; value: string | symbol}>>()
	.toBe<{any: any; unknown: unknown; value: string | symbol}>();
expectTypeOf<JsonifyObjectProperties<{value: string | (() => void)}>>().toBe<{}>();
expectTypeOf<JsonifyObjectProperties<{value: {name: string}; other: string | symbol}>>().toBe<{value: {name: string}; other: string | symbol}>();
expectTypeOf<JsonifyObjectProperties<{value: string | bigint}>>().toBe<{value: string | bigint}>();

enum KeyAliasEnum {
	Red = 'red',
}

expectTypeOf<KeyAliases<0 | KeyAliasEnum.Red>>().toBe<0 | '0' | KeyAliasEnum.Red | 'red'>();
expectTypeOf<KeyAliases<'1' | symbol>>().toBe<'1' | 1 | symbol>();
expectTypeOf<KeyAliases<string>>().toBe<string | number>();
