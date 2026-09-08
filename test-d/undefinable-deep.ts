import {expectType} from 'tsd';
import type {Simplify, UndefinableDeep} from '../index.d.ts';

// Basic objects: every key's value additionally accepts `undefined`, at every level.
expectType<UndefinableDeep<{a: string; b: number}>>({} as {a: string | undefined; b: number | undefined});
expectType<UndefinableDeep<{a: {b: {c: string}}}>>({} as {a: {b: {c: string | undefined} | undefined} | undefined});

// Optionality and `readonly` modifiers are preserved.
expectType<UndefinableDeep<{a?: string; readonly b: number}>>({} as {a?: string | undefined; readonly b: number | undefined});
expectType<UndefinableDeep<{readonly a: {b: string}}>>({} as {readonly a: {b: string | undefined} | undefined});

// Built-ins pass through, but the property that holds them still accepts `undefined`.
expectType<UndefinableDeep<{a: Date; b: RegExp}>>({} as {a: Date | undefined; b: RegExp | undefined});
expectType<UndefinableDeep<string>>('' as string);
expectType<UndefinableDeep<number>>(0 as number);

// Index signatures.
expectType<UndefinableDeep<{[key: string]: {a: number}}>>({} as {[key: string]: {a: number | undefined} | undefined});

// Unions distribute.
expectType<UndefinableDeep<{a: number} | {b: string}>>({} as {a: number | undefined} | {b: string | undefined});
expectType<UndefinableDeep<{a: {b: number}} | {c: {d: string}}>>(
	{} as {a: {b: number | undefined} | undefined} | {c: {d: string | undefined} | undefined},
);

// Non-tuple arrays: elements are recursed into but not themselves widened to `undefined`.
expectType<UndefinableDeep<string[]>>({} as string[]);
expectType<UndefinableDeep<ReadonlyArray<{a: number}>>>({} as ReadonlyArray<{a: number | undefined}>);
expectType<UndefinableDeep<{a: Array<{b: number}>}>>({} as {a: Array<{b: number | undefined}> | undefined});

// Tuples: structure and `readonly`, optional, and rest modifiers are preserved; nested objects are still widened.
expectType<UndefinableDeep<[string, number]>>({} as [string, number]);
expectType<UndefinableDeep<[string, number?]>>({} as [string, number?]);
expectType<UndefinableDeep<[string, ...number[]]>>({} as [string, ...number[]]);
expectType<UndefinableDeep<readonly [string, {a: number}]>>({} as readonly [string, {a: number | undefined}]);

// Maps and Sets: recurse into keys/values/items without forcing the container slots to `undefined`.
expectType<UndefinableDeep<Map<string, {a: number}>>>({} as Map<string, {a: number | undefined}>);
expectType<UndefinableDeep<ReadonlyMap<string, {a: number}>>>({} as ReadonlyMap<string, {a: number | undefined}>);
expectType<UndefinableDeep<WeakMap<{k: object}, {a: number}>>>({} as WeakMap<{k: object | undefined}, {a: number | undefined}>);
expectType<UndefinableDeep<Set<{a: number}>>>({} as Set<{a: number | undefined}>);
expectType<UndefinableDeep<ReadonlySet<{a: number}>>>({} as ReadonlySet<{a: number | undefined}>);
expectType<UndefinableDeep<WeakSet<{a: object}>>>({} as WeakSet<{a: object | undefined}>);

// Promises.
expectType<UndefinableDeep<Promise<{a: number}>>>({} as Promise<{a: number | undefined}>);

// Functions: the call signature is preserved and own properties are made deeply undefinable.
type FunctionWithProperties = {(a1: string, a2: number): boolean; p1: string; readonly p2: {q: number}};
declare const functionWithProperties: UndefinableDeep<FunctionWithProperties>;
expectType<boolean>(functionWithProperties('foo', 1));
expectType<{p1: string | undefined; readonly p2: {q: number | undefined} | undefined}>(
	{} as Simplify<typeof functionWithProperties>,
);

// Functions with no properties pass through unchanged.
expectType<UndefinableDeep<(a: string) => number>>({} as (a: string) => number);

// `never` propagates.
expectType<UndefinableDeep<never>>({} as never);
