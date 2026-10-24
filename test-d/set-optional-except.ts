import {expectTypeOf} from 'nz';
import type {SetOptionalExcept, LiteralUnion, Opaque, Tagged} from '../index.d.ts';

// Makes every key optional except the given keys.
expectTypeOf<SetOptionalExcept<{a: number; b: string; c: boolean}, 'a'>>().toBe<{a: number; b?: string; c?: boolean}>();
expectTypeOf<SetOptionalExcept<{a: number; b: string; c: boolean}, 'a' | 'b'>>().toBe<{a: number; b: string; c?: boolean}>();

// The given keys are kept as is, so an optional given key stays optional.
expectTypeOf<SetOptionalExcept<{a?: number; b: string}, 'a'>>().toBe<{a?: number; b?: string}>();

// Preserves readonly modifier.
expectTypeOf<SetOptionalExcept<{readonly a: number; readonly b: string}, 'a'>>().toBe<{readonly a: number; readonly b?: string}>();

// Makes every key optional, if `Keys` is `never`.
expectTypeOf<SetOptionalExcept<{a: number; b: string}, never>>().toBe<{a?: number; b?: string}>();

// Does nothing, if `Keys` is every key or `any`.
expectTypeOf<SetOptionalExcept<{a: number; b: string}, 'a' | 'b'>>().toBe<{a: number; b: string}>();
expectTypeOf<SetOptionalExcept<{a: number; b: string}, any>>().toBe<{a: number; b: string}>();

// Works with unions, and a key of only one member is accepted.
expectTypeOf<SetOptionalExcept<{kind: 'a'; a: number} | {kind: 'b'; b: string}, 'kind'>>().toBe<{kind: 'a'; a?: number} | {kind: 'b'; b?: string}>();
expectTypeOf<SetOptionalExcept<{kind: 'a'; a: number} | {kind: 'b'; b: string}, 'a'>>().toBe<{kind?: 'a'; a: number} | {kind?: 'b'; b?: string}>();

// Works with functions containing properties.
declare const function_: SetOptionalExcept<{(a: string): number; p1: string; p2: number}, 'p1'>;
expectTypeOf(function_('foo')).toBe<number>();
expectTypeOf<Omit<typeof function_, never>>().toBe<{p1: string; p2?: number}>();

// The given keys of a type with an index signature are made optional too.
expectTypeOf<SetOptionalExcept<{[key: string]: number; a: number}, 'a'>>().toBe<{[key: string]: number | undefined; a?: number}>();

// A given key that the index signature does not cover is kept as is.
expectTypeOf<SetOptionalExcept<{[key: `x-${string}`]: number; a: number}, 'a'>>().toBe<{[key: `x-${string}`]: number | undefined; a: number}>();
expectTypeOf<SetOptionalExcept<{[key: symbol]: number; a: number}, 'a'>>().toBe<{[key: symbol]: number | undefined; a: number}>();

// Works with number keys.
expectTypeOf<SetOptionalExcept<{0: string; 1: number}, 0>>().toBe<{0: string; 1?: number}>();

// A tuple stays a tuple.
expectTypeOf<SetOptionalExcept<[string, number, boolean], 0>>().toBe<[string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number, boolean], '0'>>().toBe<[string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<readonly [string, number, boolean], 0>>().toBe<readonly [string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number, ...boolean[]], never>>().toBe<[string?, number?, ...boolean[]]>();
expectTypeOf<SetOptionalExcept<[string, number, ...boolean[]], 0>>().toBe<[string, number?, ...boolean[]]>();
expectTypeOf<SetOptionalExcept<[string, number] | [string, number, boolean], 0>>().toBe<[string, number?] | [string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number, boolean], 1>>().toBe<[string | undefined, number, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number], number>>().toBe<[string, number]>();
expectTypeOf<SetOptionalExcept<[string, number], any>>().toBe<[string, number]>();
expectTypeOf<SetOptionalExcept<string[], never>>().toBe<string[]>();
expectTypeOf<SetOptionalExcept<[string, number] | {a: number; b: string}, 'a'>>().toBe<[string?, number?] | {a: number; b?: string}>();
expectTypeOf<SetOptionalExcept<[string, number] | {a: number; b: string}, 0>>().toBe<[string, number?] | {a?: number; b?: string}>();

// Edge cases.
expectTypeOf<SetOptionalExcept<any, 'a'>>().toBe<{[x: string]: any}>();
expectTypeOf<SetOptionalExcept<never, never>>().toBe<never>();
expectTypeOf<SetOptionalExcept<unknown, never>>().toBe<{}>();

// A key that does not exist is a type error.
// @ts-expect-error
type Typo = SetOptionalExcept<{a: number; b: string}, 'c'>;

// A branded selector names the same exempt key as its underlying literal.
expectTypeOf<SetOptionalExcept<{id: string; name: string}, Tagged<'id', 'Key'>>>().toBe<{id: string; name?: string}>();

expectTypeOf<SetOptionalExcept<{readonly id: Tagged<string, 'Value'>; name: string; age: number}, Opaque<'id', 'Key'>>>()
	.toBe<{readonly id: Tagged<string, 'Value'>; name?: string; age?: number}>();
expectTypeOf<SetOptionalExcept<{id: string; name: string; age: number}, Tagged<'id' | 'name', 'Key'>>>().toBe<{id: string; name: string; age?: number}>();
expectTypeOf<SetOptionalExcept<{id: string; name: string}, Tagged<Tagged<'id', 'Inner'>, 'Outer'>>>().toBe<{id: string; name?: string}>();
expectTypeOf<SetOptionalExcept<{id?: string; name: number}, 'id' & {readonly brand: true}>>().toBe<{id?: string; name?: number}>();
expectTypeOf<SetOptionalExcept<{id: string; left: 1} | {id: number; right: 2}, Tagged<'id', 'Key'>>>()
	.toBe<{id: string; left?: 1} | {id: number; right?: 2}>();
expectTypeOf<SetOptionalExcept<{id: any; name: unknown; impossible: never}, Tagged<'id', 'Key'>>>().toBe<{id: any; name?: unknown; impossible?: never}>();

// Tuple selectors keep the same optional-element ordering rules.
expectTypeOf<SetOptionalExcept<readonly [string, number, boolean], Tagged<0, 'Key'>>>().toBe<readonly [string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number, ...boolean[]], Opaque<'0', 'Key'>>>().toBe<[string, number?, ...boolean[]]>();
expectTypeOf<SetOptionalExcept<[string, number], Tagged<number, 'Key'>>>().toBe<[string, number]>();
expectTypeOf<SetOptionalExcept<[string, number] | {id: string; name: number}, Tagged<'id', 'Key'>>>()
	.toBe<[string?, number?] | {id: string; name?: number}>();

declare const optionalExceptSymbol: unique symbol;
expectTypeOf<SetOptionalExcept<{[optionalExceptSymbol]: string; other: number}, Tagged<typeof optionalExceptSymbol, 'Key'>>>()
	.toBe<{[optionalExceptSymbol]: string; other?: number}>();
enum OptionalExceptField {
	Id = 'id',
}
expectTypeOf<SetOptionalExcept<{[OptionalExceptField.Id]: string; other: number}, OptionalExceptField.Id>>()
	.toBe<{[OptionalExceptField.Id]: string; other?: number}>();

// Empty intersections and autocomplete unions retain their existing selector behavior.
expectTypeOf<SetOptionalExcept<{id: string; name: number}, 'id' & {}>>().toBe<{id: string; name?: number}>();
type OptionalExceptIndex = {[key: string]: string; id: string};
expectTypeOf<SetOptionalExcept<OptionalExceptIndex, LiteralUnion<'id', string>>>().toBe<SetOptionalExcept<OptionalExceptIndex, string>>();
expectTypeOf<SetOptionalExcept<OptionalExceptIndex, Tagged<string, 'Key'>>>().toBe<SetOptionalExcept<OptionalExceptIndex, string>>();

declare const brandedOptionalExceptCallable: SetOptionalExcept<{(this: Date, value: string): number; id: string; other: number}, Tagged<'id', 'Key'>>;
expectTypeOf(brandedOptionalExceptCallable.call(new Date(), 'value')).toBe<number>();
expectTypeOf<Omit<typeof brandedOptionalExceptCallable, never>>().toBe<{id: string; other?: number}>();

// An enum exemption leaves the ordinary property with its value's name required.
expectTypeOf<SetOptionalExcept<{id: string; other: number}, OptionalExceptField.Id>>().toBe<{id: string; other?: number}>();
function _readOptionalExceptEnumSelection(value: SetOptionalExcept<{id: string; other: number}, OptionalExceptField.Id>): string {
	return value.id;
}

expectTypeOf<SetOptionalExcept<{readonly [OptionalExceptField.Id]: string; other: number}, OptionalExceptField.Id>>()
	.toBe<{readonly [OptionalExceptField.Id]: string; other?: number}>();
expectTypeOf<SetOptionalExcept<{id: string; other: number}, Tagged<OptionalExceptField.Id, 'Key'>>>().toBe<{id: string; other?: number}>();
