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
