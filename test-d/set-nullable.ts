import {expectTypeOf} from 'nz';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion, SetNullable} from '../index.d.ts';

// Make one key nullable.
declare const variation1: SetNullable<{a: number; b: string}, 'a'>;
expectTypeOf(variation1).toBe<{a: number | null; b: string}>();

// Make multiple keys nullable.
declare const variation2: SetNullable<{a: number; b: string; c: boolean}, 'a' | 'c'>;
expectTypeOf(variation2).toBe<{a: number | null; b: string; c: boolean | null}>();

// Preserve optional modifier.
declare const variation3: SetNullable<{a: number; b?: string}, 'b'>;
expectTypeOf(variation3).toBe<{a: number; b?: string | null}>();

// Key already nullable remains unchanged.
declare const variation4: SetNullable<{a: number | null; b: string}, 'a'>;
expectTypeOf(variation4).toBe<{a: number | null; b: string}>();

// Fail if type changes even if nullable is right.
declare const variation5: SetNullable<{a: number; b: string}, 'b'>;
expectTypeOf(variation5).not.toBeAssignableTo<{a: string; b: string | null}>();

// Make all keys nullable when `Keys` generic is not passed.
declare const variation6: SetNullable<{a: number; b: string; c: boolean}>;
expectTypeOf(variation6).toBe<{a: number | null; b: string | null; c: boolean | null}>();

// Preserve readonly modifier.
declare const variation7: SetNullable<{readonly a: number; b: string}, 'a'>;
expectTypeOf(variation7).toBe<{readonly a: number | null; b: string}>();

// Works with unions.
declare const variation8: SetNullable<{a: '1'; b: string; c: boolean} | {a: '2'; b: string; c: boolean}, 'a' | 'b'>;
expectTypeOf(variation8).toBe<{a: '1' | null; b: string | null; c: boolean} | {a: '2' | null; b: string | null; c: boolean}>();

// Works with index signatures.
declare const variation9: SetNullable<{[k: string]: unknown; a: number; b: string}, 'a'>;
expectTypeOf(variation9).toBe<{[k: string]: unknown; a: number | null; b: string}>();

declare const variation9a: SetNullable<{[k: Uppercase<string>]: number; A: number; b: string}, Uppercase<string>>;
expectTypeOf(variation9a).toBe<{[k: Uppercase<string>]: number | null; A: number | null; b: string}>();

// Makes all keys nullable when `Keys` is `any`.
declare const variation10: SetNullable<{readonly a: number; b?: string; c: boolean}, any>;
expectTypeOf(variation10).toBe<{readonly a: number | null; b?: string | null; c: boolean | null}>();

// Does nothing when `Keys` is `never`.
declare const variation11: SetNullable<{a: number; readonly b?: string; readonly c: boolean}, never>;
expectTypeOf(variation11).toBe<{a: number; readonly b?: string; readonly c: boolean}>();

// Preserves existing `undefined` when adding `null`.
declare const variation12: SetNullable<{a: string | undefined; b: number}, 'a'>;
expectTypeOf(variation12).toBe<{a: string | undefined | null; b: number}>();

// Works with unions where only some keys are shared across branches.
declare const variation13: SetNullable<{a: number; c: boolean} | {a: string; d: boolean}, 'a'>;
expectTypeOf(variation13).toBe<{a: number | null; c: boolean} | {a: string | null; d: boolean}>();

// Each member of a union gets the keys it has, so the default makes every key of every member nullable.
expectTypeOf<SetNullable<{a: number; b: number} | {a: string; c: string}>>().toBe<{a: number | null; b: number | null} | {a: string | null; c: string | null}>();

// A key that only some members of a union have is accepted, and the other members are left as they are.
expectTypeOf<SetNullable<{a: 1} | {b: 2}, 'a'>>().toBe<{a: 1 | null} | {b: 2}>();

// A tuple is keyed by a number.
expectTypeOf<SetNullable<[1, 2], 0>>().toBe<[1 | null, 2]>();
expectTypeOf<SetNullable<[1, 2]>>().toBe<[1 | null, 2 | null]>();
expectTypeOf<SetNullable<[1, 2], number>>().toBe<[1 | null, 2 | null]>();
expectTypeOf<SetNullable<readonly [1, 2?], 1>>().toBe<readonly [1, (2 | null)?]>();
expectTypeOf<SetNullable<string[]>>().toBe<Array<string | null>>();

// @ts-expect-error
type InvalidKey = SetNullable<{a: number}, 'b'>;

// @ts-expect-error
type InvalidUnionKey = SetNullable<{a: 1} | {b: 2}, 'c'>;

// A numeric key does not reach a tuple's rest element or the elements after it, but `number` does. See the docs.
expectTypeOf<SetNullable<[1, ...string[]], 1>>().toBe<[1, ...string[]]>();
expectTypeOf<SetNullable<[1, ...string[]], number>>().toBe<[1 | null, ...Array<string | null>]>();
expectTypeOf<SetNullable<[1, ...string[], 2], 2>>().toBe<[1, ...string[], 2]>();
expectTypeOf<SetNullable<[1, ...string[], 2], number>>().toBe<[1 | null, ...Array<string | null>, 2 | null]>();

expectTypeOf<SetNullable<any>>().toBe<{[x: string]: any}>();
expectTypeOf<SetNullable<never>>().toBe<never>();
expectTypeOf<SetNullable<unknown>>().toBe<{}>();

// A generic `SetNullable` can be indexed by its keys.
function getNullable<BaseType extends object, Key extends keyof BaseType>(value: SetNullable<BaseType, Key>, key: Key) {
	return value[key];
}

expectTypeOf(getNullable<{a: number}, 'a'>).returns.toBe<number | null>();

// A branded selector names the same property as its underlying key.
expectTypeOf<SetNullable<{value: string}, Tagged<'value', 'Key'>>>().toBe<{value: string | null}>();

// Normalize metadata on selectors while preserving value brands and property modifiers.
expectTypeOf<SetNullable<{readonly value?: Tagged<string, 'Value'> | undefined; keep: number}, Tagged<'value', 'Key'>>>()
	.toBe<{readonly value?: Tagged<string, 'Value'> | undefined | null; keep: number}>();
expectTypeOf<SetNullable<{value: string}, Opaque<'value', 'Key'>>>().toBe<{value: string | null}>();
expectTypeOf<SetNullable<{value: string}, Tagged<Tagged<'value', 'Key'>, 'Validated'>>>().toBe<{value: string | null}>();
expectTypeOf<SetNullable<{value: string}, 'value' & {readonly __brand: unique symbol}>>().toBe<{value: string | null}>();

// Every selected key is transformed together, and absent keys do not leak into other union members.
expectTypeOf<SetNullable<{value: string; other: number}, Tagged<'value' | 'other', 'Key'>>>().toBe<{value: string | null; other: number | null}>();
expectTypeOf<SetNullable<{value: string; other: number}, Tagged<'value', 'Key'> | 'other'>>().toBe<{value: string | null; other: number | null}>();
expectTypeOf<SetNullable<{value: string} | {other: boolean}, Tagged<'value', 'Key'>>>().toBe<{value: string | null} | {other: boolean}>();

// Symbol selectors retain their identity, including when metadata is attached.
declare const selectorSymbol: unique symbol;
expectTypeOf<SetNullable<{[selectorSymbol]: string}, typeof selectorSymbol>>().toBe<{[selectorSymbol]: string | null}>();
expectTypeOf<SetNullable<{[selectorSymbol]: string}, Tagged<typeof selectorSymbol, 'Key'>>>().toBe<{[selectorSymbol]: string | null}>();

// Existing enum and empty-intersection selector behavior is unchanged.
enum SelectorKey {
	Value = 'value',
}
expectTypeOf<SetNullable<{[SelectorKey.Value]: string}, SelectorKey.Value>>().toBe<{[SelectorKey.Value]: string | null}>();
// An enum selector reaches the ordinary property with its value's name.
expectTypeOf<SetNullable<{value: string; other: number}, SelectorKey.Value>>().toBe<{value: string | null; other: number}>();
expectTypeOf<SetNullable<{value: string}, 'value' & {}>>().toBe<{value: string | null}>();
expectTypeOf<SetNullable<{[key: string]: unknown; value: string}, LiteralUnion<'value', string>>>().toBe<SetNullable<{[key: string]: unknown; value: string}, string>>();

// Empty selections and sentinel values retain their existing meaning.
expectTypeOf<SetNullable<{value: string}, never>>().toBe<{value: string}>();
expectTypeOf<SetNullable<never, never>>().toBe<never>();
expectTypeOf<SetNullable<unknown, never>>().toBe<{}>();
// @ts-expect-error A selector must name a property of the source.
expectTypeOf<SetNullable<{value: string}, unknown>>();

// A tuple keeps its positions and modifiers, and literal keys still do not reach the rest element.
expectTypeOf<SetNullable<readonly [string, number?], Tagged<0 | 1, 'Key'>>>().toBe<readonly [string | null, (number | null)?]>();
expectTypeOf<SetNullable<[string, ...number[]], Tagged<1, 'Key'>>>().toBe<[string, ...number[]]>();
expectTypeOf<SetNullable<[string, ...number[]], Tagged<number, 'Key'>>>().toBe<[string | null, ...Array<number | null>]>();
expectTypeOf<SetNullable<[string, number], LiteralUnion<0, number>>>().toBe<[string | null, number | null]>();
expectTypeOf<SetNullable<{a: any; b: never; c: unknown}, Tagged<'a' | 'b' | 'c', 'Key'>>>().toBe<{a: any; b: null; c: unknown}>();
expectTypeOf<SetNullable<{a: string; b?: number}, any>>().toBe<{a: string | null; b?: number | null}>();
expectTypeOf<{value: null; keep: null}>().not.toBeAssignableTo<SetNullable<{value: string; keep: number}, Tagged<'value', 'Key'>>>();

// A broad branded selector keeps the same coverage as the corresponding index signature.
expectTypeOf<SetNullable<{[key: string]: unknown; value?: string | null}, Tagged<string, 'Key'>>>()
	.toBe<SetNullable<{[key: string]: unknown; value?: string | null}, string>>();

// Moving the map behind a selector-normalizing boundary preserves reverse inference.
declare function inferNullableSource<BaseType>(value: SetNullable<BaseType>): BaseType;
expectTypeOf(inferNullableSource({name: 'value', count: 1})).toBe<{name: string; count: number}>();

declare function inferSelectedNullableSource<BaseType, Key extends keyof BaseType>(value: SetNullable<BaseType, Key>, key: Key): BaseType;
expectTypeOf(inferSelectedNullableSource({name: 'value', count: 1}, 'name')).toBe<{name: string; count: number}>();

// A numeric enum selector selects the declared key with its value, but not a `number` index signature, even though `number` is assignable to a numeric enum.
enum NumericSelectorKey {
	Zero,
	One,
}
expectTypeOf<SetNullable<{[key: number]: string | null; 1: string}, NumericSelectorKey.One>>().toBe<{[key: number]: string | null; 1: string | null}>();
expectTypeOf<SetNullable<{[key: number]: string; 1: string}, NumericSelectorKey.One>[number]>().toBe<string>();
expectTypeOf<SetNullable<{0: string; 1: number}, NumericSelectorKey.Zero>>().toBe<{0: string | null; 1: number}>();
expectTypeOf<SetNullable<{[NumericSelectorKey.One]: string; other: number}, NumericSelectorKey.One>>().toBe<{[NumericSelectorKey.One]: string | null; other: number}>();
expectTypeOf<SetNullable<{[NumericSelectorKey.One]: string; other: number}, 1>>().toBe<{[NumericSelectorKey.One]: string | null; other: number}>();
expectTypeOf<SetNullable<string[], NumericSelectorKey.Zero>>().toBe<string[]>();
expectTypeOf<SetNullable<[string, string], NumericSelectorKey.One>>().toBe<[string, string | null]>();
