import {expectTypeOf} from 'nz';
import type {SetRequiredExcept, LiteralUnion, Opaque, Tagged} from '../index.d.ts';

// Makes every key required except the given keys.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string; c?: boolean}, 'a'>>().toBe<{a?: number; b: string; c: boolean}>();
expectTypeOf<SetRequiredExcept<{a?: number; b?: string; c?: boolean}, 'a' | 'b'>>().toBe<{a?: number; b?: string; c: boolean}>();

// The given keys are kept as is, so a required given key stays required.
expectTypeOf<SetRequiredExcept<{a: number; b?: string}, 'a'>>().toBe<{a: number; b: string}>();

// Only removes the optional modifier, like `SetRequired`.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string | undefined}, 'a'>>().toBe<{a?: number; b: string | undefined}>();

// Preserves readonly modifier.
expectTypeOf<SetRequiredExcept<{readonly a?: number; readonly b?: string}, 'a'>>().toBe<{readonly a?: number; readonly b: string}>();

// Makes every key required, if `Keys` is `never`.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string}, never>>().toBe<{a: number; b: string}>();

// Does nothing, if `Keys` is every key or `any`.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string}, 'a' | 'b'>>().toBe<{a?: number; b?: string}>();
expectTypeOf<SetRequiredExcept<{a?: number; b?: string}, any>>().toBe<{a?: number; b?: string}>();

// Works with unions, and a key of only one member is accepted.
expectTypeOf<SetRequiredExcept<{kind: 'a'; a?: number} | {kind: 'b'; b?: string}, 'a'>>().toBe<{kind: 'a'; a?: number} | {kind: 'b'; b: string}>();

// Works with functions containing properties.
declare const function_: SetRequiredExcept<{(a: string): number; p1?: string; p2?: number}, 'p1'>;
expectTypeOf(function_('foo')).toBe<number>();
expectTypeOf<Omit<typeof function_, never>>().toBe<{p1?: string; p2: number}>();

// The given keys of a type with an index signature are made required too.
expectTypeOf<SetRequiredExcept<{[key: string]: number; a?: number}, 'a'>>().toBe<{[key: string]: number; a: number}>();

// A given key that the index signature does not cover is kept as is.
expectTypeOf<SetRequiredExcept<{[key: `x-${string}`]: number; a?: number}, 'a'>>().toBe<{[key: `x-${string}`]: number; a?: number}>();
expectTypeOf<SetRequiredExcept<{[key: symbol]: number; a?: number}, 'a'>>().toBe<{[key: symbol]: number; a?: number}>();

// Works with number keys.
expectTypeOf<SetRequiredExcept<{0?: string; 1?: number}, 0>>().toBe<{0?: string; 1: number}>();

// A tuple stays a tuple.
expectTypeOf<SetRequiredExcept<[string?, number?, boolean?], 2>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?, boolean?], '2'>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<readonly [string?, number?, boolean?], 2>>().toBe<readonly [string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?, ...boolean[]], never>>().toBe<[string, number, ...boolean[]]>();
expectTypeOf<SetRequiredExcept<[string?, number?, ...boolean[]], 1>>().toBe<[string, number?, ...boolean[]]>();
expectTypeOf<SetRequiredExcept<[string?, number?] | [string?, number?, boolean?], 2>>().toBe<[string, number] | [string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?, boolean?], 0>>().toBe<[string?, number?, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?], number>>().toBe<[string?, number?]>();
expectTypeOf<SetRequiredExcept<[string?, number?], any>>().toBe<[string?, number?]>();
expectTypeOf<SetRequiredExcept<string[], never>>().toBe<string[]>();
expectTypeOf<SetRequiredExcept<[string?, number?] | {a?: number; b?: string}, 'a'>>().toBe<[string, number] | {a?: number; b: string}>();
expectTypeOf<SetRequiredExcept<[string?, number?] | {a?: number; b?: string}, 1>>().toBe<[string, number?] | {a: number; b: string}>();

// Edge cases.
expectTypeOf<SetRequiredExcept<any, 'a'>>().toBe<{[x: string]: any}>();
expectTypeOf<SetRequiredExcept<never, never>>().toBe<never>();
expectTypeOf<SetRequiredExcept<unknown, never>>().toBe<{}>();

// A key that does not exist is a type error.
// @ts-expect-error
type Typo = SetRequiredExcept<{a?: number; b?: string}, 'c'>;

// A branded selector names the same exempt key as its underlying literal.
expectTypeOf<SetRequiredExcept<{id?: string; name?: string}, Tagged<'name', 'Key'>>>().toBe<{id: string; name?: string}>();

expectTypeOf<SetRequiredExcept<{readonly id?: Tagged<string, 'Value'>; name?: string; age?: number}, Opaque<'id', 'Key'>>>()
	.toBe<{readonly id?: Tagged<string, 'Value'>; name: string; age: number}>();
expectTypeOf<SetRequiredExcept<{id?: string; name?: string; age?: number}, Tagged<'id' | 'name', 'Key'>>>().toBe<{id?: string; name?: string; age: number}>();
expectTypeOf<SetRequiredExcept<{id?: string; name?: string}, Tagged<Tagged<'name', 'Inner'>, 'Outer'>>>().toBe<{id: string; name?: string}>();
expectTypeOf<SetRequiredExcept<{id?: string; name?: number}, 'id' & {readonly brand: true}>>().toBe<{id?: string; name: number}>();
expectTypeOf<SetRequiredExcept<{id?: string; left?: 1} | {id?: number; right?: 2}, Tagged<'id', 'Key'>>>()
	.toBe<{id?: string; left: 1} | {id?: number; right: 2}>();
expectTypeOf<SetRequiredExcept<{id?: any; name?: unknown; impossible?: never}, Tagged<'id', 'Key'>>>().toBe<{id?: any; name: unknown; impossible: never}>();

// Tuple selectors keep the same optional-element ordering rules.
expectTypeOf<SetRequiredExcept<readonly [string?, number?, boolean?], Tagged<2, 'Key'>>>().toBe<readonly [string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?, ...boolean[]], Opaque<'1', 'Key'>>>().toBe<[string, number?, ...boolean[]]>();
expectTypeOf<SetRequiredExcept<[string?, number?], Tagged<number, 'Key'>>>().toBe<[string?, number?]>();
expectTypeOf<SetRequiredExcept<[string?, number?] | {id?: string; name?: number}, Tagged<'id', 'Key'>>>()
	.toBe<[string, number] | {id?: string; name: number}>();

declare const requiredExceptSymbol: unique symbol;
expectTypeOf<SetRequiredExcept<{[requiredExceptSymbol]?: string; other?: number}, Tagged<typeof requiredExceptSymbol, 'Key'>>>()
	.toBe<{[requiredExceptSymbol]?: string; other: number}>();
enum RequiredExceptField {
	Id = 'id',
}
expectTypeOf<SetRequiredExcept<{[RequiredExceptField.Id]?: string; other?: number}, RequiredExceptField.Id>>()
	.toBe<{[RequiredExceptField.Id]?: string; other: number}>();

// Empty intersections and autocomplete unions retain their existing selector behavior.
expectTypeOf<SetRequiredExcept<{id?: string; name?: number}, 'id' & {}>>().toBe<{id?: string; name: number}>();
type RequiredExceptIndex = {[key: string]: string | undefined; id?: string};
expectTypeOf<SetRequiredExcept<RequiredExceptIndex, LiteralUnion<'id', string>>>().toBe<SetRequiredExcept<RequiredExceptIndex, string>>();
expectTypeOf<SetRequiredExcept<RequiredExceptIndex, Tagged<string, 'Key'>>>().toBe<SetRequiredExcept<RequiredExceptIndex, string>>();

declare const brandedRequiredExceptCallable: SetRequiredExcept<{(this: Date, value: string): number; id?: string; other?: number}, Tagged<'id', 'Key'>>;
expectTypeOf(brandedRequiredExceptCallable.call(new Date(), 'value')).toBe<number>();
expectTypeOf<Omit<typeof brandedRequiredExceptCallable, never>>().toBe<{id?: string; other: number}>();

// An enum exemption leaves the ordinary property with its value's name optional.
const requiredExceptEnumSelection: SetRequiredExcept<{id?: string; other?: number}, RequiredExceptField.Id> = {other: 1};
expectTypeOf(requiredExceptEnumSelection).toBe<{id?: string; other: number}>();

expectTypeOf<SetRequiredExcept<{readonly [RequiredExceptField.Id]?: string; other?: number}, RequiredExceptField.Id>>()
	.toBe<{readonly [RequiredExceptField.Id]?: string; other: number}>();
expectTypeOf<SetRequiredExcept<{id?: string; other?: number}, Tagged<RequiredExceptField.Id, 'Key'>>>().toBe<{id?: string; other: number}>();

// An empty intersection on a template literal selector resolves like the template literal itself.
expectTypeOf<SetRequiredExcept<{[key: `on${string}`]: unknown; onClick?: () => void; other?: 1}, 'onClick' | (`on${string}` & {})>>()
	.toBe<{[key: `on${string}`]: unknown; onClick?: () => void; other: 1}>();
