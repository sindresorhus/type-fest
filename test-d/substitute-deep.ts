import {expectTypeOf} from 'nz';
import type {JsonValue, ReadonlyDate, RequiredDeep, SubstituteDeep, Tagged, TupleOf} from '../index.d.ts';

// Basic replacement, including the root and a replacement that contains the searched type
expectTypeOf<SubstituteDeep<{a: Date; b: string}, Date, number>>().toBe<{a: number; b: string}>();
expectTypeOf<SubstituteDeep<Date, Date, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<{a: Date}, {a: Date}, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, Date>>().toBe<{a: Date}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, {at: Date}>>().toBe<{a: {at: Date}}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, Date[]>>().toBe<{a: Date[]}>();

// Matching uses assignability, so a subtype matches too. The root is checked before it is walked, so `object` replaces the whole input
expectTypeOf<SubstituteDeep<{a: object}, object, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<'x', string, number>>().toBe<number>();
expectTypeOf<SubstituteDeep<{a: 'x' | 1 | true}, string | number | boolean, null>>().toBe<{a: null}>();
expectTypeOf<SubstituteDeep<{a: Tagged<string, 'brand'>}, string, number>>().toBe<{a: number}>();

// The root is checked before its branch for every container, not just objects
expectTypeOf<SubstituteDeep<{a: Date}, object, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Date[], object, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<() => void, object, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Promise<Date>, object, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Map<string, Date>, object, string>>().toBe<string>();

// A `Find` that is itself an array, tuple, or collection matches the member before its branch
expectTypeOf<SubstituteDeep<{a: Date[]}, Date[], string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: [Date]}, [Date], string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: [Date, string]}, [Date, string], number>>().toBe<{a: number}>();
expectTypeOf<SubstituteDeep<Map<string, Date>, Map<string, Date>, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Map<string, Date>, ReadonlyMap<string, Date>, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Set<Date>, ReadonlySet<Date>, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<WeakMap<object, Date>, WeakMap<object, Date>, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<WeakSet<object>, WeakSet<object>, string>>().toBe<string>();

// `unknown` matches the container root, so the element type never matters
expectTypeOf<SubstituteDeep<unknown[], unknown, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Promise<unknown>, unknown, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Map<string, unknown>, unknown, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Set<unknown>, unknown, string>>().toBe<string>();

// A mutable collection matches a readonly `Find`, while a readonly collection does not match a mutable `Find`
expectTypeOf<SubstituteDeep<{a: Map<Date, Date>}, ReadonlyMap<Date, Date>, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: Set<Date>}, ReadonlySet<Date>, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<ReadonlyMap<Date, Date>, Map<Date, Date>, string>>().toBe<ReadonlyMap<Date, Date>>();
expectTypeOf<SubstituteDeep<ReadonlySet<Date>, Set<Date>, string>>().toBe<ReadonlySet<Date>>();
expectTypeOf<SubstituteDeep<{a: ReadonlyMap<Date, Date>}, Map<Date, Date>, string>>().toBe<{a: ReadonlyMap<Date, Date>}>();
expectTypeOf<SubstituteDeep<WeakMap<object, Date>, ReadonlyMap<object, Date>, string>>().toBe<WeakMap<object, Date>>();

// A narrower `Find` does not match the collection, so it is walked without a change
expectTypeOf<SubstituteDeep<Map<string, Date>, Map<Date, Date>, string>>().toBe<Map<string, Date>>();

// Matching is directional: a wide primitive does not match a narrower literal
expectTypeOf<SubstituteDeep<{status: string; fallback: 'pending'}, 'pending', null>>().toBe<{status: string; fallback: null}>();

// Structural matches replace the whole matching object, including its additional properties
expectTypeOf<SubstituteDeep<{value: {kind: 'date'; createdAt: Date}; label: string}, {kind: 'date'}, number>>()
	.toBe<{value: number; label: string}>();

// A required structural `Find` misses an optional property, whose read type includes `undefined`
expectTypeOf<SubstituteDeep<{a?: Date}, {a: Date}, string>>().toBe<{a?: Date}>();
expectTypeOf<SubstituteDeep<{a: Date}, {a?: Date}, string>>().toBe<string>();

// `readonly` does not affect assignability
expectTypeOf<SubstituteDeep<{readonly a: Date}, {a: Date}, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<{a: Date}, {readonly a: Date}, string>>().toBe<string>();

// Index-signature `Find`s match by assignability, including every member
expectTypeOf<SubstituteDeep<{a: string}, {[key: string]: string}, number>>().toBe<number>();
expectTypeOf<SubstituteDeep<{a: string; b: number}, {[key: string]: string}, number>>().toBe<{a: string; b: number}>();
expectTypeOf<SubstituteDeep<{a: string}, Record<string, unknown>, number>>().toBe<number>();

// Function and constructor `Find`s match structurally
expectTypeOf<SubstituteDeep<{a: () => void}, () => void, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: (x: Date) => Date}, (x: Date) => Date, number>>().toBe<{a: number}>();
expectTypeOf<SubstituteDeep<{a: (x: string) => string}, (...arguments_: any[]) => any, number>>().toBe<{a: number}>();
expectTypeOf<SubstituteDeep<{a: typeof Date}, abstract new (...arguments_: any[]) => Date, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<typeof Date, new (...arguments_: any[]) => Date, string>>().toBe<string>();

// A function is not a `Date`, and a `Date` is not a `Function`
expectTypeOf<SubstituteDeep<Function, Date, string>>().toBe<Function>();
expectTypeOf<SubstituteDeep<Date, Function, string>>().toBe<Date>();

// Unions are distributed, so a member is replaced without losing its siblings
expectTypeOf<SubstituteDeep<string | undefined, undefined, null>>().toBe<string | null>();
expectTypeOf<SubstituteDeep<string | number, string, boolean>>().toBe<boolean | number>();
expectTypeOf<SubstituteDeep<Date | string | undefined, Date, number>>().toBe<number | string | undefined>();
expectTypeOf<SubstituteDeep<{a: Date} | {b: string}, Date, number>>().toBe<{a: number} | {b: string}>();
expectTypeOf<SubstituteDeep<{a: string | null}, null, undefined>>().toBe<{a: string | undefined}>();
expectTypeOf<SubstituteDeep<{a: string | undefined}, undefined, null>>().toBe<{a: string | null}>();
expectTypeOf<SubstituteDeep<Date[] | {a: Date}, Date, string>>().toBe<string[] | {a: string}>();
expectTypeOf<SubstituteDeep<Date | Date[], Date, string>>().toBe<string | string[]>();

// `boolean` is a union too, so matching one literal keeps the other
expectTypeOf<SubstituteDeep<{enabled: boolean}, true, 'enabled'>>().toBe<{enabled: false | 'enabled'}>();
expectTypeOf<SubstituteDeep<boolean, false, null>>().toBe<true | null>();

// Discriminated unions keep the relationship between each discriminant and its payload
type SerializedEvent = SubstituteDeep<{kind: 'created'; timestamp: Date} | {kind: 'failed'; error: Error}, Date, string>;
expectTypeOf<SerializedEvent>().toBe<{kind: 'created'; timestamp: string} | {kind: 'failed'; error: Error}>();
expectTypeOf<{kind: 'created'; error: Error}>().not.toBeAssignableTo<SerializedEvent>();
expectTypeOf<{kind: 'created'; timestamp: Date}>().not.toBeAssignableTo<SerializedEvent>();

// `Find` may itself be a union
expectTypeOf<SubstituteDeep<{a: Date | RegExp; b: string}, Date | RegExp, boolean>>().toBe<{a: boolean; b: string}>();
expectTypeOf<SubstituteDeep<{a: 1 | Date}, Date | 1, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: Date}, {a: Date} | {b: string}, number>>().toBe<number>();
expectTypeOf<SubstituteDeep<{a: Date | null}, Date | null, string>>().toBe<{a: string}>();

// `any`, `never`, and `unknown`
expectTypeOf<SubstituteDeep<any, Date, string>>().toBe<any>();
expectTypeOf<SubstituteDeep<any, any, string>>().toBe<any>();
expectTypeOf<SubstituteDeep<never, Date, string>>().toBe<never>();
expectTypeOf<SubstituteDeep<unknown, Date, string>>().toBe<unknown>();
expectTypeOf<SubstituteDeep<Date, any, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Date[], never, string>>().toBe<Date[]>();
expectTypeOf<SubstituteDeep<{a: string}, unknown, number>>().toBe<number>();
expectTypeOf<SubstituteDeep<{a: unknown; b: void; c: null; d: undefined}, Date, string>>().toBe<{a: unknown; b: void; c: null; d: undefined}>();
expectTypeOf<SubstituteDeep<{a: any}, undefined, null>>().toBe<{a: any}>();
expectTypeOf<SubstituteDeep<unknown, unknown, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<any, unknown, string>>().toBe<any>();

// `Find = any` matches everything except `any` and `never`, and a `never` input stays `never`
expectTypeOf<SubstituteDeep<unknown, any, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<{a: Date}, any, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<never, any, string>>().toBe<never>();
expectTypeOf<SubstituteDeep<never, unknown, string>>().toBe<never>();
expectTypeOf<SubstituteDeep<Date, unknown, string>>().toBe<string>();

// `Find = never` is a no-op
expectTypeOf<SubstituteDeep<Date, never, string>>().toBe<Date>();
expectTypeOf<SubstituteDeep<{a: Date}, never, string>>().toBe<{a: Date}>();

// The replacement is not walked
expectTypeOf<SubstituteDeep<{a: Date}, Date, any>>().toBe<{a: any}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, unknown>>().toBe<{a: unknown}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, never>>().toBe<{a: never}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, (x: Date) => Date>>().toBe<{a: (x: Date) => Date}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, ReadonlyDate>>().toBe<{a: ReadonlyDate}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, Readonly<Date>>>().toBe<{a: Readonly<Date>}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, Set<Date>>>().toBe<{a: Set<Date>}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, object>>().toBe<{a: object}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, null | undefined>>().toBe<{a: null | undefined}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, unknown | string>>().toBe<{a: unknown}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, Date | undefined>>().toBe<{a: Date | undefined}>();
expectTypeOf<SubstituteDeep<{a: Date; b?: Date}, Date, {at: Date}>>().toBe<{a: {at: Date}; b?: {at: Date}}>();
expectTypeOf<SubstituteDeep<{a: Date}, Date, Date | string>>().toBe<{a: Date | string}>();

// `never` as a replacement removes a union member and empties containers
expectTypeOf<SubstituteDeep<{a: Date | string}, Date, never>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<Date, Date, never>>().toBe<never>();
expectTypeOf<SubstituteDeep<Date[], Date, never>>().toBe<never[]>();
expectTypeOf<SubstituteDeep<Map<Date, Date>, Date, never>>().toBe<Map<never, never>>();
expectTypeOf<SubstituteDeep<Promise<Date>, Date, never>>().toBe<Promise<never>>();

// A union member replaced with `null` joins another `null`
expectTypeOf<SubstituteDeep<{a: null | undefined}, undefined, null>>().toBe<{a: null}>();
expectTypeOf<SubstituteDeep<{a: null | undefined}, null, undefined>>().toBe<{a: undefined}>();

// Optional and readonly modifiers are kept
expectTypeOf<SubstituteDeep<{a?: Date}, Date, string>>().toBe<{a?: string}>();
expectTypeOf<SubstituteDeep<{readonly a: Date}, Date, string>>().toBe<{readonly a: string}>();
expectTypeOf<SubstituteDeep<{readonly a?: Date}, Date, string>>().toBe<{readonly a?: string}>();
expectTypeOf<SubstituteDeep<{a?: undefined}, undefined, null>>().toBe<{a?: null}>();
expectTypeOf<SubstituteDeep<{a: Date | undefined}, undefined, null>>().toBe<{a: Date | null}>();
expectTypeOf<SubstituteDeep<{a?: Date; b: Date}, Date, string>>().toBe<{a?: string; b: string}>();
expectTypeOf<SubstituteDeep<{a?: Date}, undefined, null>>().toBe<{a?: Date | null}>();
expectTypeOf<SubstituteDeep<{a?: Date}, Date, undefined>>().toBe<{a?: undefined}>();
expectTypeOf<SubstituteDeep<{a: Date | undefined}, Date, undefined>>().toBe<{a: undefined}>();

// Explicit `undefined` remains allowed without adding it to other optional properties
expectTypeOf<SubstituteDeep<{implicit?: Date; explicit?: Date | undefined}, Date, string>>()
	.toBe<{implicit?: string; explicit?: string | undefined}>();

declare const readonlyProperty: SubstituteDeep<{readonly a: Date}, Date, string>;
expectTypeOf(readonlyProperty.a).toBe<string>();
// @ts-expect-error The `readonly` modifier is kept.
readonlyProperty.a = 'now';

// Tuples keep their length, labels, optional elements, rest elements, and `readonly`
expectTypeOf<SubstituteDeep<[Date, Date?], Date, string>>().toBe<[string, string?]>();
expectTypeOf<SubstituteDeep<[x: Date, y?: Date], Date, string>>().toBe<[x: string, y?: string]>();
expectTypeOf<SubstituteDeep<readonly [Date, Date?], Date, string>>().toBe<readonly [string, string?]>();
expectTypeOf<SubstituteDeep<[Date, ...Date[]], Date, string>>().toBe<[string, ...string[]]>();
expectTypeOf<SubstituteDeep<[...Date[], string], Date, number>>().toBe<[...number[], string]>();
expectTypeOf<SubstituteDeep<readonly [Date?, ...Date[]], Date, string>>().toBe<readonly [string?, ...string[]]>();
expectTypeOf<SubstituteDeep<[], Date, string>>().toBe<[]>();
expectTypeOf<SubstituteDeep<readonly [], Date, string>>().toBe<readonly []>();
expectTypeOf<SubstituteDeep<[first: Date, ...rest: Date[]], Date, string>>().toBe<[first: string, ...rest: string[]]>();
expectTypeOf<SubstituteDeep<readonly [first: Date, ...rest: Date[]], Date, string>>()
	.toBe<readonly [first: string, ...rest: string[]]>();
expectTypeOf<SubstituteDeep<[Date, ...Date[], Date], Date, string>>().toBe<[string, ...string[], string]>();
expectTypeOf<SubstituteDeep<[...Date[], Date], Date, string>>().toBe<[...string[], string]>();
expectTypeOf<SubstituteDeep<[a: Date, b?: Date, ...rest: Date[]], Date, string>>()
	.toBe<[a: string, b?: string, ...rest: string[]]>();
expectTypeOf<SubstituteDeep<[Date?, Date?], Date, string>>().toBe<[string?, string?]>();
expectTypeOf<SubstituteDeep<[Date | undefined], Date, null>>().toBe<[null | undefined]>();
expectTypeOf<SubstituteDeep<[Promise<Date>], Date, string>>().toBe<[Promise<string>]>();
expectTypeOf<SubstituteDeep<{a: [Date, {b: Date}]}, Date, string>>().toBe<{a: [string, {b: string}]}>();
expectTypeOf<SubstituteDeep<{a: readonly [Date]}, Date, string>>().toBe<{a: readonly [string]}>();
expectTypeOf<SubstituteDeep<[{d: Date}?], {d: Date}, string>>().toBe<[string?]>();
expectTypeOf<SubstituteDeep<[any], Date, string>>().toBe<[any]>();
expectTypeOf<SubstituteDeep<[never], Date, string>>().toBe<[never]>();
expectTypeOf<SubstituteDeep<[any?, never?], Date, string>>().toBe<[any?, never?]>();

// Arrays keep their mutability
expectTypeOf<SubstituteDeep<Date[], Date, string>>().toBe<string[]>();
expectTypeOf<SubstituteDeep<readonly Date[], Date, string>>().toBe<readonly string[]>();
expectTypeOf<SubstituteDeep<ReadonlyArray<{a: Date}>, Date, string>>().toBe<ReadonlyArray<{a: string}>>();
expectTypeOf<SubstituteDeep<[...Date[]], Date, string>>().toBe<string[]>();
expectTypeOf<SubstituteDeep<readonly [...Date[]], Date, string>>().toBe<readonly string[]>();
expectTypeOf<SubstituteDeep<Array<Date | string>, Date, number>>().toBe<Array<number | string>>();
expectTypeOf<SubstituteDeep<any[], Date, string>>().toBe<any[]>();
expectTypeOf<SubstituteDeep<never[], Date, string>>().toBe<never[]>();
expectTypeOf<SubstituteDeep<unknown[], Date, string>>().toBe<unknown[]>();
expectTypeOf<SubstituteDeep<readonly unknown[], Date, string>>().toBe<readonly unknown[]>();
expectTypeOf<SubstituteDeep<{a?: readonly Date[]}, Date, string>>().toBe<{a?: readonly string[]}>();
expectTypeOf<SubstituteDeep<Array<{a: Date}> & {tag: Date}, Date, string>>().toBe<Array<{a: string}>>();
expectTypeOf<SubstituteDeep<readonly Date[] & {tag: Date}, Date, string>>().toBe<readonly string[]>();

// Known limitation: an array or tuple with extra properties is rebuilt as an array, losing the extra properties and, for a tuple, the fixed length; an optional element becomes `| undefined`
expectTypeOf<SubstituteDeep<Date[] & {tag: Date}, Date, string>>().toBe<string[]>();
expectTypeOf<SubstituteDeep<Tagged<Date[], 'Id'>, Date, string>>().toBe<string[]>();
expectTypeOf<SubstituteDeep<[Date] & {tag: Date}, Date, string>>().toBe<string[]>();
expectTypeOf<SubstituteDeep<Tagged<[Date], 'Id'>, Date, string>>().toBe<string[]>();
expectTypeOf<SubstituteDeep<readonly [Date] & {tag: Date}, Date, string>>().toBe<readonly string[]>();
expectTypeOf<SubstituteDeep<Tagged<[Date?], 'Id'>, Date, string>>().toBe<Array<string | undefined>>();

// Known limitation: an extra `length` is not detected, so the array methods keep the old element type
type FixedLengthArray = SubstituteDeep<Date[] & {length: 3}, Date, string>;
expectTypeOf<FixedLengthArray['length']>().toBe<3>();
expectTypeOf<FixedLengthArray[0]>().toBe<string>();
expectTypeOf<ReturnType<FixedLengthArray['pop']>>().toBe<Date | undefined>();

// Known limitation: an extra numeric key is mapped, but the array methods still keep the old element type
type ExtraNumericKeyArray = SubstituteDeep<[Date] & {5: Date}, Date, string>;
expectTypeOf<ExtraNumericKeyArray['length']>().toBe<1>();
expectTypeOf<ExtraNumericKeyArray[0]>().toBe<string>();
expectTypeOf<ExtraNumericKeyArray[5]>().toBe<string>();
expectTypeOf<ReturnType<ExtraNumericKeyArray['pop']>>().toBe<Date | undefined>();

// Maps and sets are rebuilt around their contents
expectTypeOf<SubstituteDeep<Map<Date, Set<Date>>, Date, string>>().toBe<Map<string, Set<string>>>();
expectTypeOf<SubstituteDeep<ReadonlyMap<Date, ReadonlySet<Date>>, Date, string>>().toBe<ReadonlyMap<string, ReadonlySet<string>>>();
expectTypeOf<SubstituteDeep<WeakMap<Date, Date>, Date, string>>().toBe<WeakMap<Date, string>>();
expectTypeOf<SubstituteDeep<WeakSet<Date>, Date, string>>().toBe<WeakSet<Date>>();
expectTypeOf<SubstituteDeep<Map<{id: Date}, string>, Date, string>>().toBe<Map<{id: string}, string>>();
expectTypeOf<SubstituteDeep<Set<{d: Date}>, Date, string>>().toBe<Set<{d: string}>>();
expectTypeOf<SubstituteDeep<Map<string, Promise<Date>>, Date, string>>().toBe<Map<string, Promise<string>>>();
expectTypeOf<SubstituteDeep<Map<Promise<Date>, Promise<Date>>, Date, string>>().toBe<Map<Promise<string>, Promise<string>>>();
expectTypeOf<SubstituteDeep<Map<Date[], Set<Date>>, Date, string>>().toBe<Map<string[], Set<string>>>();
expectTypeOf<SubstituteDeep<Array<ReadonlyMap<Date, Date>>, Date, string>>().toBe<Array<ReadonlyMap<string, string>>>();
expectTypeOf<SubstituteDeep<Map<string, WeakMap<{d: Date}, Date>>, Date, string>>()
	.toBe<Map<string, WeakMap<{d: Date}, string>>>();

// Weak map keys are not traversed, while object values are
expectTypeOf<SubstituteDeep<WeakMap<{createdAt: Date}, {updatedAt: Date}>, Date, string>>()
	.toBe<WeakMap<{createdAt: Date}, {updatedAt: string}>>();
expectTypeOf<SubstituteDeep<WeakMap<{d: Date}, Date>, {d: Date}, number>>().toBe<WeakMap<{d: Date}, Date>>();
expectTypeOf<SubstituteDeep<WeakSet<{d: Date}>, {d: Date}, number>>().toBe<WeakSet<{d: Date}>>();

// Known limitation: extra members on a collection or promise are lost with the rebuild
expectTypeOf<SubstituteDeep<Map<string, Date> & {tag: Date}, Date, string>>().toBe<Map<string, string>>();
expectTypeOf<SubstituteDeep<Set<Date> & {tag: Date}, Date, string>>().toBe<Set<string>>();
expectTypeOf<SubstituteDeep<Promise<Date> & {tag: Date}, Date, string>>().toBe<Promise<string>>();

// Known limitation: a subclass instance is assignable to the built-in, so its own members are lost
declare class CountingMap extends Map<string, Date> {
	hits: number;
}

declare class CountingSet extends Set<Date> {
	hits: number;
}

declare class MyPromise extends Promise<Date> {
	extra: string;
}

expectTypeOf<SubstituteDeep<CountingMap, Date, string>>().toBe<Map<string, string>>();
expectTypeOf<SubstituteDeep<CountingSet, Date, string>>().toBe<Set<string>>();
expectTypeOf<SubstituteDeep<MyPromise, Date, string>>().toBe<Promise<string>>();

// Known limitation: `Readonly<Map>` and `Readonly<Set>` still have the mutating methods, so they are rebuilt as mutable
expectTypeOf<SubstituteDeep<Readonly<Map<string, Date>>, Date, string>>().toBe<Map<string, string>>();
expectTypeOf<SubstituteDeep<Readonly<Set<Date>>, Date, string>>().toBe<Set<string>>();

// Top types inside collections are kept
expectTypeOf<SubstituteDeep<Map<any, any>, Date, string>>().toBe<Map<any, any>>();
expectTypeOf<SubstituteDeep<Map<never, never>, Date, string>>().toBe<Map<never, never>>();
expectTypeOf<SubstituteDeep<Set<never>, Date, string>>().toBe<Set<never>>();
expectTypeOf<SubstituteDeep<WeakMap<object, never>, Date, string>>().toBe<WeakMap<object, never>>();
expectTypeOf<SubstituteDeep<Promise<never>, Date, string>>().toBe<Promise<never>>();
expectTypeOf<SubstituteDeep<Promise<any>, Date, string>>().toBe<Promise<any>>();

// Objects keep index signatures, named members, numeric and symbol keys, and `readonly`
expectTypeOf<SubstituteDeep<{[key: string]: Date | string; known: string}, Date, string>>().toBe<{[key: string]: string; known: string}>();
expectTypeOf<SubstituteDeep<{[key: number]: Date}, Date, string>>().toBe<{[key: number]: string}>();
expectTypeOf<SubstituteDeep<{[key: `data-${string}`]: Date}, Date, string>>().toBe<{[key: `data-${string}`]: string}>();
expectTypeOf<SubstituteDeep<{readonly [key: string]: Date}, Date, string>>().toBe<{readonly [key: string]: string}>();
expectTypeOf<SubstituteDeep<{[key: symbol]: Date}, Date, string>>().toBe<{[key: symbol]: string}>();
expectTypeOf<SubstituteDeep<{[key: `data-${number}`]: Date}, Date, string>>().toBe<{[key: `data-${number}`]: string}>();
expectTypeOf<SubstituteDeep<Record<number, Date>, Date, string>>().toBe<Record<number, string>>();
expectTypeOf<SubstituteDeep<{readonly [key: string]: readonly Date[]}, Date, string>>()
	.toBe<{readonly [key: string]: readonly string[]}>();

// Index-signature values are matched structurally and replaced per value
expectTypeOf<SubstituteDeep<{[key: string]: {d: Date}}, {d: Date}, string>>().toBe<{[key: string]: string}>();
expectTypeOf<SubstituteDeep<{[key: string]: Date}, Date, Date>>().toBe<{[key: string]: Date}>();
expectTypeOf<SubstituteDeep<{[key: string]: Date}, Date, never>>().toBe<{[key: string]: never}>();
expectTypeOf<SubstituteDeep<{[key: string]: Date | undefined}, undefined, null>>().toBe<{[key: string]: Date | null}>();
expectTypeOf<SubstituteDeep<Record<string, Date | undefined>, undefined, null>>().toBe<Record<string, Date | null>>();

declare const symbolKey: unique symbol;
expectTypeOf<SubstituteDeep<{[symbolKey]: Date}, Date, string>>().toBe<{[symbolKey]: string}>();
expectTypeOf<SubstituteDeep<{[0]: Date}, Date, string>>().toBe<{[0]: string}>();
expectTypeOf<SubstituteDeep<{[key: number]: Date; 0: Date; label: string}, Date, string>>()
	.toBe<{[key: number]: string; 0: string; label: string}>();

// Utility wrappers keep their modifiers
expectTypeOf<SubstituteDeep<Partial<{a: Date; b: string}>, Date, number>>().toBe<{a?: number; b?: string}>();
expectTypeOf<SubstituteDeep<Required<{a?: Date}>, Date, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<Partial<{a: Date}>, Date, string>>().toBe<{a?: string}>();
expectTypeOf<SubstituteDeep<Record<'a' | 'b', Date>, Date, string>>().toBe<{a: string; b: string}>();
expectTypeOf<SubstituteDeep<Record<string, Date>, Date, string>>().toBe<Record<string, string>>();
expectTypeOf<SubstituteDeep<{[key in 'a' | 'b']: Date}, Date, string>>().toBe<{a: string; b: string}>();

// Optional methods keep their `?`, and the method itself is a leaf
expectTypeOf<SubstituteDeep<{m?(): Date}, Date, string>>().toBe<{m?: () => Date}>();
expectTypeOf<SubstituteDeep<{m?(): Date}, Function, string>>().toBe<{m?: string}>();
expectTypeOf<SubstituteDeep<{m(this: Date, x: string): Date}, Date, string>>().toBe<{m(this: Date, x: string): Date}>();

// A callable object is a function, so its members are not substituted
expectTypeOf<SubstituteDeep<{(x: Date): Date; prop: Date}, Date, string>>().toBe<{(x: Date): Date; prop: Date}>();
expectTypeOf<SubstituteDeep<{(): void; prop: Date}, Date, string>>().toBe<{(): void; prop: Date}>();

// A class constructor keeps its statics, and a getter becomes a readonly property
declare class WithStatic {
	static createdAt: Date;
	constructor();
}

declare class WithGetter {
	get accessor(): Date;
}

expectTypeOf<SubstituteDeep<typeof WithStatic, Date, string>>().toBe<typeof WithStatic>();
expectTypeOf<SubstituteDeep<WithGetter, Date, string>>().toBe<{readonly accessor: string}>();

// A `Promise` is rebuilt around its value, while other thenables are leaves
expectTypeOf<SubstituteDeep<Promise<{a: Date}>, Date, string>>().toBe<Promise<{a: string}>>();
// A matching promise is replaced before its value is traversed.
expectTypeOf<SubstituteDeep<Promise<Date>, Promise<unknown>, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Promise<Promise<Date>>, Date, string>>().toBe<Promise<Promise<string>>>();
expectTypeOf<SubstituteDeep<Promise<Date[]>, Date, string>>().toBe<Promise<string[]>>();
expectTypeOf<SubstituteDeep<PromiseLike<Date>, Date, string>>().toBe<PromiseLike<Date>>();
expectTypeOf<SubstituteDeep<PromiseLike<Date> & {extra: Date}, Date, string>>().toBe<PromiseLike<Date> & {extra: Date}>();
// Known limitation: `Readonly<Promise>` is rebuilt as a mutable `Promise`.
expectTypeOf<SubstituteDeep<Readonly<Promise<Date>>, Date, string>>().toBe<Promise<string>>();
expectTypeOf<SubstituteDeep<{p: PromiseLike<Date>}, PromiseLike<unknown>, string>>().toBe<{p: string}>();

// A structural thenable, not just `PromiseLike`, is a leaf
type Thenable = {
	then<Result = Date, Rejection = never>(
		onfulfilled?: ((value: Date) => Result | PromiseLike<Result>) | null,
		onrejected?: ((reason: unknown) => Rejection | PromiseLike<Rejection>) | null,
	): PromiseLike<Result | Rejection>;
};

expectTypeOf<SubstituteDeep<Thenable, Date, string>>().toBe<Thenable>();
expectTypeOf<SubstituteDeep<{a: Thenable}, Date, string>>().toBe<{a: Thenable}>();
expectTypeOf<SubstituteDeep<Thenable, Thenable, string>>().toBe<string>();

// An object that merely has a `then` member is walked, and the member is a function leaf
expectTypeOf<SubstituteDeep<{then: (value: Date) => Date}, Date, string>>().toBe<{then: (value: Date) => Date}>();
expectTypeOf<SubstituteDeep<{then: (value: Date) => Date}, Function, string>>().toBe<{then: string}>();

// Functions are leaves unless they match `Find`
expectTypeOf<SubstituteDeep<{a: (x: string) => string}, Date, string>>().toBe<{a: (x: string) => string}>();
expectTypeOf<SubstituteDeep<{a: (x: Date) => Date}, undefined, null>>().toBe<{a: (x: Date) => Date}>();
expectTypeOf<SubstituteDeep<{a: () => void}, Function, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: <Value>(x: Value) => Value}, Function, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: {(): void; (x: number): string}}, Function, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<(x: Date) => Date, (x: Date) => Date, number>>().toBe<number>();
expectTypeOf<SubstituteDeep<typeof Date, Function, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<typeof Date, abstract new (...arguments_: never[]) => unknown, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Function, Function, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<{f: {(): void; prop: Date}}, Date, string>>().toBe<{f: {(): void; prop: Date}}>();
expectTypeOf<SubstituteDeep<{f: {(): void; prop: Date}}, Function, string>>().toBe<{f: string}>();

// Non-recursive built-ins are leaves unless they match `Find`
expectTypeOf<SubstituteDeep<{date: Date; pattern: RegExp}, undefined, null>>().toBe<{date: Date; pattern: RegExp}>();
expectTypeOf<SubstituteDeep<{bytes: Uint8Array; view: DataView; buffer: ArrayBuffer}, Date, string>>()
	.toBe<{bytes: Uint8Array; view: DataView; buffer: ArrayBuffer}>();
expectTypeOf<SubstituteDeep<{element: HTMLElement}, Date, string>>().toBe<{element: HTMLElement}>();
expectTypeOf<SubstituteDeep<{a: SharedArrayBuffer; b: Int32Array; c: Float64Array; d: Document; e: Text; f: Node}, Date, string>>()
	.toBe<{a: SharedArrayBuffer; b: Int32Array; c: Float64Array; d: Document; e: Text; f: Node}>();
expectTypeOf<SubstituteDeep<{s: string; n: number; b: boolean; bi: bigint; sy: symbol; u: undefined; nl: null; v: void}, Date, number>>()
	.toBe<{s: string; n: number; b: boolean; bi: bigint; sy: symbol; u: undefined; nl: null; v: void}>();
expectTypeOf<SubstituteDeep<{a: bigint}, bigint, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: symbol}, symbol, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: true}, boolean, string>>().toBe<{a: string}>();

// `ReadonlyDate` is not assignable to `Date`, so it is a leaf. `Readonly<Date>` is assignable, so it matches.
expectTypeOf<SubstituteDeep<ReadonlyDate, Date, string>>().toBe<ReadonlyDate>();
expectTypeOf<SubstituteDeep<{when: Readonly<Date>}, Date, string>>().toBe<{when: string}>();

// A `Find` of `ReadonlyDate` matches both a `Date` and a `ReadonlyDate`
expectTypeOf<SubstituteDeep<ReadonlyDate, ReadonlyDate, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<Date, ReadonlyDate, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<{when: ReadonlyDate}, ReadonlyDate, string>>().toBe<{when: string}>();
expectTypeOf<SubstituteDeep<{a: Date; b: ReadonlyDate}, ReadonlyDate, string>>().toBe<{a: string; b: string}>();
expectTypeOf<SubstituteDeep<{a: Readonly<Date>}, ReadonlyDate, string>>().toBe<{a: string}>();

// Wide types are kept
expectTypeOf<SubstituteDeep<object, Date, string>>().toBe<object>();
expectTypeOf<SubstituteDeep<{}, Date, string>>().toBe<{}>();
expectTypeOf<SubstituteDeep<{a: object}, Date, string>>().toBe<{a: object}>();
expectTypeOf<SubstituteDeep<{a: void}, void, string>>().toBe<{a: string}>();
expectTypeOf<SubstituteDeep<{a: {}}, Date, string>>().toBe<{a: {}}>();
expectTypeOf<SubstituteDeep<{a: {b: object}}, Date, string>>().toBe<{a: {b: object}}>();
expectTypeOf<SubstituteDeep<{a: object | 'x'}, Date, string>>().toBe<{a: object | 'x'}>();

// Top types as members are kept, and a union with `any` collapses to `any`
expectTypeOf<SubstituteDeep<{a: never}, Date, string>>().toBe<{a: never}>();
expectTypeOf<SubstituteDeep<{a?: never}, Date, string>>().toBe<{a?: never}>();
expectTypeOf<SubstituteDeep<{a?: any}, undefined, null>>().toBe<{a?: any}>();
expectTypeOf<SubstituteDeep<{a: any | undefined}, undefined, null>>().toBe<{a: any}>();
expectTypeOf<SubstituteDeep<{a: unknown | undefined}, undefined, null>>().toBe<{a: unknown}>();

// Class instances are walked, keeping their methods
declare class Model {
	createdAt: Date;
	getName(): string;
}

expectTypeOf<SubstituteDeep<Model, Date, string>>().toBe<{createdAt: string; getName: () => string}>();

// Intersections are flattened by the mapped type
expectTypeOf<SubstituteDeep<{a: Date} & {b: Date}, Date, string>>().toBe<{a: string; b: string}>();
expectTypeOf<SubstituteDeep<{a: Date} & {b?: Date}, Date, string>>().toBe<{a: string; b?: string}>();
expectTypeOf<SubstituteDeep<{a: Date} & {a: string}, Date, string>>().toBe<{a: string}>();

// Recursive types stay lazy, and a recursive JSON type does not expand forever
type RecursiveNode = {value: Date; child?: RecursiveNode};
type ExpectedRecursiveNode = {value: string; child?: ExpectedRecursiveNode};
expectTypeOf<SubstituteDeep<RecursiveNode, Date, string>>().toBe<ExpectedRecursiveNode>();
expectTypeOf<SubstituteDeep<JsonValue, undefined, null>>().toBe<JsonValue>();
expectTypeOf<SubstituteDeep<RecursiveNode, RecursiveNode, string>>().toBe<string>();
expectTypeOf<SubstituteDeep<{a: RecursiveNode}, RecursiveNode, string>>().toBe<{a: string}>();

// A recursive JSON type is substituted, not merely returned
type NumberJson = number | boolean | null | NumberJson[] | readonly NumberJson[] | {[key: string]: NumberJson};
expectTypeOf<SubstituteDeep<JsonValue, string, number>>().toBe<NumberJson>();

// Recursive arrays, maps, and sets transform their contents without expanding forever
type Tree = {createdAt: Date; children: Tree[]};
type SerializedTree = {createdAt: string; children: SerializedTree[]};
expectTypeOf<SubstituteDeep<Tree, Date, string>>().toBe<SerializedTree>();

type DateIndex = Map<string, Date | DateIndex>;
type SerializedDateIndex = Map<string, string | SerializedDateIndex>;
expectTypeOf<SubstituteDeep<DateIndex, Date, string>>().toBe<SerializedDateIndex>();

type DateSet = Set<string | DateSet>;
type StringSet = Set<string | StringSet>;
expectTypeOf<SubstituteDeep<DateSet, Date, string>>().toBe<StringSet>();

type RecursiveReadonlyArray = ReadonlyArray<Date | RecursiveReadonlyArray>;
type SerializedRecursiveReadonlyArray = ReadonlyArray<string | SerializedRecursiveReadonlyArray>;
expectTypeOf<SubstituteDeep<RecursiveReadonlyArray, Date, string>>().toBe<SerializedRecursiveReadonlyArray>();

// Mutually recursive objects are walked lazily
type MutualA = {b?: MutualB; when: Date};
type MutualB = {a?: MutualA};
type ExpectedMutualA = {b?: ExpectedMutualB; when: string};
type ExpectedMutualB = {a?: ExpectedMutualA};
expectTypeOf<SubstituteDeep<MutualA, Date, string>>().toBe<ExpectedMutualA>();

// Applying the same substitution twice changes nothing
expectTypeOf<SubstituteDeep<SubstituteDeep<{a: Date}, Date, string>, Date, number>>().toBe<{a: string}>();

// A long tuple does not hit the instantiation depth limit
declare const longTuple: SubstituteDeep<{items: Readonly<TupleOf<100, {id: Date}>>}, Date, string>;
expectTypeOf(longTuple.items.length).toBe<100>();
expectTypeOf(longTuple.items[99]).toBe<{id: string}>();

declare const longDateTuple: SubstituteDeep<TupleOf<100, Date>, Date, string>;
expectTypeOf(longDateTuple[0]).toBe<string>();
expectTypeOf(longDateTuple[50]).toBe<string>();
expectTypeOf(longDateTuple[99]).toBe<string>();
expectTypeOf(longDateTuple.length).toBe<100>();

// A generic wrapper defers the transformation until the type is known
declare function serialize<Type>(value: Type): SubstituteDeep<Type, Date, string>;
expectTypeOf(serialize({createdAt: new Date(), title: 'x'})).toBe<{createdAt: string; title: string}>();

declare function serializeConst<const Value>(value: Value): SubstituteDeep<Value, Date, string>;
expectTypeOf(serializeConst({createdAt: new Date(), tags: ['a']}))
	.toBe<{readonly createdAt: string; readonly tags: readonly ['a']}>();

declare function serializeList<Value>(values: Value[]): SubstituteDeep<Value[], Date, string>;
expectTypeOf(serializeList([{createdAt: new Date()}])).toBe<Array<{createdAt: string}>>();

declare function serializeConstrained<Value extends {createdAt: Date}>(value: Value): SubstituteDeep<Value, Date, string>;
expectTypeOf(serializeConstrained({createdAt: new Date(), id: 1})).toBe<{createdAt: string; id: number}>();

// The issue 641 request, using `RequiredDeep` to make properties required and `undefined` become `null`
type IssueA = {a?: string; b?: {c?: number}; d: boolean};
expectTypeOf<SubstituteDeep<IssueA, undefined, null>>()
	.toBe<{a?: string | null; b?: {c?: number | null} | null; d: boolean}>();
expectTypeOf<RequiredDeep<SubstituteDeep<IssueA, undefined, null>>>()
	.toBe<{a: string | null; b: {c: number | null} | null; d: boolean}>();
expectTypeOf<SubstituteDeep<IssueA['a'], undefined, null>>().toBe<string | null>();
expectTypeOf<SubstituteDeep<IssueA['b'], undefined, null>>().toBe<{c?: number | null} | null>();
expectTypeOf<RequiredDeep<SubstituteDeep<IssueA['a'], undefined, null>>>().toBe<string | null>();
expectTypeOf<SubstituteDeep<{a?: string}['a'], undefined, null>>().toBe<string | null>();

// Substitution keeps tuple elements optional until `RequiredDeep` is applied
expectTypeOf<SubstituteDeep<[Date?], undefined, null>>().toBe<[(Date | null)?]>();
expectTypeOf<RequiredDeep<SubstituteDeep<readonly [Date?], undefined, null>>>().toBe<readonly [Date | null]>();

// Replacing `undefined` before applying `RequiredDeep` preserves absence inside promises as `null`
type PromiseResponse = RequiredDeep<SubstituteDeep<{data: Promise<{name?: string}>}, undefined, null>>;
expectTypeOf<PromiseResponse>().toBe<{data: Promise<{name: string | null}>}>();

// Explicit `undefined` inside a promise is also replaced before `RequiredDeep` is applied
type ExplicitUndefinedPromiseResponse = RequiredDeep<SubstituteDeep<Promise<{name?: string | undefined}>, undefined, null>>;
expectTypeOf<ExplicitUndefinedPromiseResponse>().toBe<Promise<{name: string | null}>>();

// The recipe handles optional objects in tuples, rest elements, and map keys and values
type NullableRestTuple = RequiredDeep<SubstituteDeep<[{name?: string}?, ...Array<{when?: Date}>], undefined, null>>;
expectTypeOf<NullableRestTuple>().toBe<[{name: string | null} | null, ...Array<{when: Date | null}>]>();

type NullableMap = RequiredDeep<SubstituteDeep<Map<{key?: string}, {value?: Date}>, undefined, null>>;
expectTypeOf<NullableMap>().toBe<Map<{key: string | null}, {value: Date | null}>>();

// The recipe also works over arrays, sets, readonly sets, and weak map values
expectTypeOf<SubstituteDeep<Array<{a?: Date}>, undefined, null>>().toBe<Array<{a?: Date | null}>>();
expectTypeOf<RequiredDeep<SubstituteDeep<Array<{a?: Date}>, undefined, null>>>().toBe<Array<{a: Date | null}>>();
expectTypeOf<RequiredDeep<SubstituteDeep<Map<string, {a?: string}>, undefined, null>>>().toBe<Map<string, {a: string | null}>>();
expectTypeOf<RequiredDeep<SubstituteDeep<Set<{a?: string}>, undefined, null>>>().toBe<Set<{a: string | null}>>();
expectTypeOf<RequiredDeep<SubstituteDeep<ReadonlySet<{a?: string}>, undefined, null>>>().toBe<ReadonlySet<{a: string | null}>>();
expectTypeOf<RequiredDeep<SubstituteDeep<WeakMap<object, {a?: Date}>, undefined, null>>>()
	.toBe<WeakMap<object, {a: Date | null}>>();

// Optional containers become `| null` before `RequiredDeep` removes the `?`
expectTypeOf<RequiredDeep<SubstituteDeep<{list?: Array<{id: number; when?: Date}>; map?: Map<string, {value?: string}>}, undefined, null>>>()
	.toBe<{list: Array<{id: number; when: Date | null}> | null; map: Map<string, {value: string | null}> | null}>();

// Promises are walked, thenables are not
expectTypeOf<SubstituteDeep<Promise<Date | undefined>, undefined, null>>().toBe<Promise<Date | null>>();
expectTypeOf<SubstituteDeep<{a: Promise<Date | undefined>}, undefined, null>>().toBe<{a: Promise<Date | null>}>();
expectTypeOf<SubstituteDeep<PromiseLike<Date | undefined>, undefined, null>>().toBe<PromiseLike<Date | undefined>>();

// `undefined` replacement variants
expectTypeOf<SubstituteDeep<{a: undefined}, undefined, null>>().toBe<{a: null}>();
expectTypeOf<SubstituteDeep<{a?: string}, undefined, null>>().toBe<{a?: string | null}>();
expectTypeOf<SubstituteDeep<{a?: string | undefined}, undefined, null>>().toBe<{a?: string | null}>();
expectTypeOf<SubstituteDeep<{a?: undefined}['a'], undefined, null>>().toBe<null>();

// The doc comment example, verbatim
type DocUser = {
	id: number;
	name?: string;
	createdAt?: Date;
};

expectTypeOf<SubstituteDeep<DocUser, Date, string>>().toBe<{id: number; name?: string; createdAt?: string}>();
expectTypeOf<RequiredDeep<SubstituteDeep<DocUser, undefined, null>>>()
	.toBe<{id: number; name: string | null; createdAt: Date | null}>();

// Real-world shapes
type GraphQlUser = {
	id: number;
	name?: string;
	address?: {
		city?: string;
	};
};

type GraphQlResponse = RequiredDeep<SubstituteDeep<GraphQlUser, undefined, null>>;
expectTypeOf<GraphQlResponse>().toBe<{id: number; name: string | null; address: {city: string | null} | null}>();

type FirestoreModel = {
	createdAt: Date;
	updatedAt?: Date;
	tags: Map<string, Date>;
};

type BrowserServerModel = {
	createdAt: Date | {seconds: number; nanoseconds: number};
	updatedAt?: Date | {seconds: number; nanoseconds: number};
	tags: Map<string, Date | {seconds: number; nanoseconds: number}>;
};

expectTypeOf<SubstituteDeep<FirestoreModel, Date, Date | {seconds: number; nanoseconds: number}>>().toBe<BrowserServerModel>();

type Store = {
	value: string;
	onChange?: (value: string) => void;
};

expectTypeOf<SubstituteDeep<Store, Function, string>>().toBe<{value: string; onChange?: string}>();

// Several replacements compose, as in a JSON serializer
type Post = {
	title: string;
	publishedAt?: Date;
	render?: (post: Post) => string;
	meta?: {
		updatedAt?: Date;
	};
};

type SerializedPost = RequiredDeep<SubstituteDeep<SubstituteDeep<SubstituteDeep<Post, Date, string>, Function, string>, undefined, null>>;
expectTypeOf<SerializedPost>()
	.toBe<{title: string; publishedAt: string | null; render: string | null; meta: {updatedAt: string | null} | null}>();

// Replacing a structural error type with a serializable shape
expectTypeOf<SubstituteDeep<{error: Error}, Error, {message: string}>>().toBe<{error: {message: string}}>();

// A set of functions becomes a set of strings
expectTypeOf<SubstituteDeep<{listeners: Set<() => void>}, Function, string>>().toBe<{listeners: Set<string>}>();

// A branded `Date` still matches `Date`
expectTypeOf<SubstituteDeep<{at: Tagged<Date, 'Utc'>}, Date, string>>().toBe<{at: string}>();

// Negative tests
expectTypeOf<{a: Date}>().not.toBeAssignableTo<SubstituteDeep<{a: Date}, Date, string>>();
expectTypeOf<{a: string}>().not.toBeAssignableTo<SubstituteDeep<{a: Date}, Date, null>>();
expectTypeOf<readonly string[]>().not.toBeAssignableTo<SubstituteDeep<Date[], Date, string>>();
expectTypeOf<Map<string, Date>>().not.toBeAssignableTo<SubstituteDeep<Map<Date, Date>, Date, string>>();
expectTypeOf<Set<string>>().not.toBeAssignableTo<SubstituteDeep<Set<Date>, Date, number>>();
expectTypeOf<{a: string | undefined}>().not.toBeAssignableTo<RequiredDeep<SubstituteDeep<{a?: string}, undefined, null>>>();
