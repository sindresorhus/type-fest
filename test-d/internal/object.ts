import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {BuildObject, UndefinedToOptional} from '../../source/internal/index.d.ts';

// `UndefinedToOptional` turns `a: string | undefined` into `a?: string`.
expectTypeOf<IsEqual<UndefinedToOptional<{firstName: string; lastName: string | undefined}>, {firstName: string; lastName?: string}>>().toBe<true>();
expectTypeOf<IsEqual<UndefinedToOptional<{a: 1}>, {a: 1}>>().toBe<true>();

// `BuildObject` picks from the copied-from object when the key is already there, so the value type is replaced without the key changing form. The two that go through `Pick` are left unresolved by `IsEqual`, so they are asserted on the result directly.
declare const fromStringKey: BuildObject<'a', string, {a: 1}>;
expectTypeOf(fromStringKey).toBe<{a: string}>();
declare const fromNumberKey: BuildObject<'0', string, {0: 1}>;
expectTypeOf(fromNumberKey).toBe<{0: string}>();
// A key that is not already there keeps the form it was given in.
expectTypeOf<IsEqual<BuildObject<'b', string, {a: 1}>, {b: string}>>().toBe<true>();
expectTypeOf<IsEqual<BuildObject<'0', string>, {0: string}>>().toBe<true>();

// A record remains data when its containing property may be absent.
expectTypeOf<UndefinedToOptional<{value: {name: string} | undefined}>>().toBe<{value?: {name: string}}>();
expectTypeOf<UndefinedToOptional<{readonly value: {name: string} | null | undefined}>>().toBe<{readonly value?: {name: string} | null}>();
expectTypeOf<UndefinedToOptional<{value: string | (() => void) | undefined}>>().toBe<{}>();

// A literal key next to an index signature is kept, instead of being merged into the index signature.
expectTypeOf<UndefinedToOptional<{[key: string]: string; foo: 'a'}>>().toBe<{[key: string]: string; foo: 'a'}>();
expectTypeOf<UndefinedToOptional<{[key: string]: string; readonly foo: 'a'}>>().toBe<{[key: string]: string; readonly foo: 'a'}>();
expectTypeOf<UndefinedToOptional<{readonly [key: string]: string; foo: 'a'}>>().toBe<{readonly [key: string]: string; foo: 'a'}>();
expectTypeOf<UndefinedToOptional<{[key: string]: number; [key: number]: 1; foo: 2; 0: 1}>>().toBe<{[key: string]: number; [key: number]: 1; foo: 2; 0: 1}>();
expectTypeOf<UndefinedToOptional<{[key: `x${string}`]: number; foo: 'a'}>>().toBe<{[key: `x${string}`]: number; foo: 'a'}>();
expectTypeOf<UndefinedToOptional<Record<string, string> & {foo: 'a'}>>().toBe<{[key: string]: string; foo: 'a'}>();

// A property that `JSON.stringify` drops is removed.
declare const symbolKey: unique symbol;
expectTypeOf<UndefinedToOptional<{a: 1; b: undefined; c?: undefined; d: () => void; e: symbol; f: never; [symbolKey]: 1}>>().toBe<{a: 1}>();
expectTypeOf<UndefinedToOptional<{[key: symbol]: any; [symbolKey]?: unknown; a: 1}>>().toBe<{a: 1}>();
expectTypeOf<UndefinedToOptional<Record<string, () => void> & {foo: 'a'}>>().toBe<{foo: 'a'}>();

// An `any` or `unknown` property is kept as it is, including whether it is optional.
expectTypeOf<UndefinedToOptional<{a: any; b: unknown; c?: any; d?: unknown}>>().toBe<{a: any; b: unknown; c?: any; d?: unknown}>();
expectTypeOf<UndefinedToOptional<{readonly a: unknown; readonly b?: any}>>().toBe<{readonly a: unknown; readonly b?: any}>();

// A property that is already optional stays optional.
expectTypeOf<UndefinedToOptional<{a?: string; b?: string | undefined; readonly c?: 1}>>().toBe<{a?: string; b?: string; readonly c?: 1}>();
expectTypeOf<UndefinedToOptional<{a: null}>>().toBe<{a: null}>();
expectTypeOf<UndefinedToOptional<{a: null | undefined}>>().toBe<{a?: null}>();
expectTypeOf<UndefinedToOptional<{}>>().toBe<{}>();

// An index signature cannot be optional, so the `?` modifier adds `undefined` back to its value. `Jsonify` removes it again when it transforms the value.
expectTypeOf<UndefinedToOptional<{[key: string]: string | undefined; foo: 'a' | undefined}>>().toBe<{[key: string]: string | undefined; foo?: 'a'}>();

// An interface is handled like a type literal.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Indexed {
	[key: string]: string | undefined;
	foo: 'a';
	bar?: 'b';
}
expectTypeOf<UndefinedToOptional<Indexed>>().toBe<{[key: string]: string | undefined; foo: 'a'; bar?: 'b'}>();
