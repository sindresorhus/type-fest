import {expectTypeOf} from 'nz';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion, SetFieldType} from '../index.d.ts';

declare const variation1: SetFieldType<{a: number}, 'a', string>;
expectTypeOf(variation1).toBe<{a: string}>();

declare const variation2: SetFieldType<{a: number; b: boolean; c: Date}, 'a' | 'b', string>;
expectTypeOf(variation2).toBe<{a: string; b: string; c: Date}>();

declare const variation3: SetFieldType<{a: string; b: boolean; c: Date}, 'b' | 'c', number>;
expectTypeOf(variation3).toBe<{a: string; b: number; c: number}>();

declare const variation4: SetFieldType<{a: string; b: string; c: string}, 'b', number>;
expectTypeOf(variation4).not.toBeAssignableTo<{a: string; b: string; c: string}>();

// Works with union types
declare const variation5: SetFieldType<{a: string; b: string} | {a: number; c: number}, 'a', boolean>;
expectTypeOf(variation5).toBe<{a: boolean; b: string} | {a: boolean; c: number}>();

declare const variation6: SetFieldType<{a: string; b: string} | {a: number; c: number}, 'a', boolean, {preservePropertyModifiers: false}>;
expectTypeOf(variation6).toBe<{a: boolean; b: string} | {a: boolean; c: number}>();

// Property modifiers are always preserved for properties that are not being updated
declare const variation7: SetFieldType<{a?: string; readonly b: string; c: string}, 'c', number>;
expectTypeOf(variation7).toBe<{a?: string; readonly b: string; c: number}>();

declare const variation8: SetFieldType<{a?: string; readonly b: string; c: string}, 'c', number, {preservePropertyModifiers: false}>;
expectTypeOf(variation8).toBe<{a?: string; readonly b: string; c: number}>();

// Preserves property modifiers
declare const variation9: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number>;
expectTypeOf(variation9).toBe<{a?: number; readonly b: string; readonly c?: number}>();

// Doesn't preserve property modifiers when `preservePropertyModifiers` is `false`
declare const variation10: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number, {preservePropertyModifiers: false}>;
expectTypeOf(variation10).toBe<{a: number; readonly b: string; c: number}>();

// Falls back to default of `true`, if `preservePropertyModifiers` is set to `boolean`
declare const variation11: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number, {preservePropertyModifiers: boolean}>;
expectTypeOf(variation11).toBe<{a?: number; readonly b: string; readonly c?: number}>();

// A tuple is keyed by a number, so the numeric index must be rewritten just like the string form is. Otherwise the request is silently ignored.
declare const tupleNumericIndex: SetFieldType<[1, 2], 0, string>;
expectTypeOf(tupleNumericIndex).toBe<[string, 2]>();

declare const tupleNumericIndexThird: SetFieldType<[string, number, boolean], 2, Date>;
expectTypeOf(tupleNumericIndexThird).toBe<[string, number, Date]>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
declare const keyOfOneMember: SetFieldType<{a: 1} | {b: 2}, 'a', string>;
expectTypeOf(keyOfOneMember).toBe<{a: string} | {b: 2}>();

declare const keyOfTheOtherMember: SetFieldType<{a: 1} | {b: 2}, 'b', string>;
expectTypeOf(keyOfTheOtherMember).toBe<{a: 1} | {b: string}>();

// A union member the key does not reach is left as it is, rather than gaining the key as a required one.
declare const withoutTheKey: SetFieldType<{a: 1} | {b: 2}, 'a', string, {preservePropertyModifiers: false}>;
expectTypeOf(withoutTheKey).toBe<{a: string} | {b: 2}>();

// A tuple stays a tuple: a `Record` over `number` would answer with every member an array has.
declare const tupleWithoutModifiers: SetFieldType<[1, 2], 0, string, {preservePropertyModifiers: false}>;
expectTypeOf(tupleWithoutModifiers).toBe<[string, 2]>();

// A branded selector names the same property as its underlying key.
expectTypeOf<SetFieldType<{value: string}, Tagged<'value', 'Key'>, number>>().toBe<{value: number}>();

// Normalize metadata on selectors while preserving value brands and property modifiers.
expectTypeOf<SetFieldType<{readonly value?: Tagged<string, 'Value'> | undefined; keep: number}, Tagged<'value', 'Key'>, Date>>().toBe<{readonly value?: Date; keep: number}>();
expectTypeOf<SetFieldType<{value: string}, Opaque<'value', 'Key'>, Date>>().toBe<{value: Date}>();
expectTypeOf<SetFieldType<{value: string}, Tagged<Tagged<'value', 'Key'>, 'Validated'>, Date>>().toBe<{value: Date}>();
expectTypeOf<SetFieldType<{value: string}, 'value' & {readonly __brand: unique symbol}, Date>>().toBe<{value: Date}>();

// Every selected key is transformed together, and absent keys do not leak into other union members.
expectTypeOf<SetFieldType<{value: string; other: number}, Tagged<'value' | 'other', 'Key'>, Date>>().toBe<{value: Date; other: Date}>();
expectTypeOf<SetFieldType<{value: string; other: number}, Tagged<'value', 'Key'> | 'other', Date>>().toBe<{value: Date; other: Date}>();
expectTypeOf<SetFieldType<{value: string} | {other: boolean}, Tagged<'value', 'Key'>, Date>>().toBe<{value: Date} | {other: boolean}>();

// Symbol selectors retain their identity, including when metadata is attached.
declare const selectorSymbol: unique symbol;
expectTypeOf<SetFieldType<{[selectorSymbol]: string}, typeof selectorSymbol, Date>>().toBe<{[selectorSymbol]: Date}>();
expectTypeOf<SetFieldType<{[selectorSymbol]: string}, Tagged<typeof selectorSymbol, 'Key'>, Date>>().toBe<{[selectorSymbol]: Date}>();

// Existing enum and empty-intersection selector behavior is unchanged.
enum SelectorKey {
	Value = 'value',
}
expectTypeOf<SetFieldType<{[SelectorKey.Value]: string}, SelectorKey.Value, Date>>().toBe<{[SelectorKey.Value]: Date}>();
expectTypeOf<SetFieldType<{value: string}, 'value' & {}, Date>>().toBe<{value: Date}>();
expectTypeOf<SetFieldType<{[key: string]: unknown; value: string}, LiteralUnion<'value', string>, Date>>().toBe<SetFieldType<{[key: string]: unknown; value: string}, string, Date>>();

// Empty selections and sentinel values retain their existing meaning.
expectTypeOf<SetFieldType<{value: string}, never, Date>>().toBe<{value: string}>();
expectTypeOf<SetFieldType<never, never, Date>>().toBe<never>();
expectTypeOf<SetFieldType<unknown, never, Date>>().toBe<{}>();
// @ts-expect-error A selector must name a property of the source.
expectTypeOf<SetFieldType<{value: string}, unknown, Date>>();

// The modifier option and tuple reconstruction receive the normalized selector too.
expectTypeOf<SetFieldType<{readonly value?: string; readonly keep?: number}, Tagged<'value', 'Key'>, Date, {preservePropertyModifiers: false}>>().toBe<{value: Date; readonly keep?: number}>();
expectTypeOf<SetFieldType<readonly [string, number?], Tagged<0 | 1, 'Key'>, Date>>().toBe<readonly [Date, Date?]>();
expectTypeOf<SetFieldType<[string, number], Tagged<number, 'Key'>, Date>>().toBe<[Date, Date]>();
expectTypeOf<SetFieldType<[string, number], LiteralUnion<0, number>, Date>>().toBe<[Date, Date]>();
expectTypeOf<SetFieldType<{value: string}, Tagged<'value', 'Key'>, any>>().toBe<{value: any}>();
expectTypeOf<SetFieldType<{value: string}, Tagged<'value', 'Key'>, never>>().toBe<{value: never}>();
expectTypeOf<SetFieldType<{value: string}, Tagged<'value', 'Key'>, unknown>>().toBe<{value: unknown}>();
expectTypeOf<SetFieldType<{a: any; b: never; c: unknown}, Tagged<'a' | 'b' | 'c', 'Key'>, Date>>().toBe<{a: Date; b: Date; c: Date}>();
expectTypeOf<SetFieldType<{a: string; b?: number}, any, Date>>().toBe<{a: Date; b?: Date}>();
expectTypeOf<{value: string}>().not.toBeAssignableTo<SetFieldType<{value: string}, Tagged<'value', 'Key'>, number>>();

// A broad branded selector keeps the same coverage as the corresponding index signature.
expectTypeOf<SetFieldType<{[key: string]: unknown; value?: string | null}, Tagged<string, 'Key'>, Date>>()
	.toBe<SetFieldType<{[key: string]: unknown; value?: string | null}, string, Date>>();

// An autocomplete selector retains its literal required property when modifiers are removed.
declare const autocompleteField: SetFieldType<{[key: string]: unknown; readonly id?: string}, LiteralUnion<'id', string>, boolean, {preservePropertyModifiers: false}>;
expectTypeOf(autocompleteField.id).toBe<boolean>();
expectTypeOf<{}>().not.toBeAssignableTo<typeof autocompleteField>();
declare const autocompleteNumericField: SetFieldType<{[key: number]: unknown; readonly 0?: string}, LiteralUnion<0, number>, boolean, {preservePropertyModifiers: false}>;
expectTypeOf(autocompleteNumericField[0]).toBe<boolean>();
expectTypeOf<{}>().not.toBeAssignableTo<typeof autocompleteNumericField>();

// An enum selector also removes the ordinary field's modifiers when requested.
declare const enumFieldWithoutModifiers: SetFieldType<{readonly value?: string; other: number}, SelectorKey.Value, boolean, {preservePropertyModifiers: false}>;
expectTypeOf(enumFieldWithoutModifiers).toBe<{value: boolean; other: number}>();
enumFieldWithoutModifiers.value = true;
expectTypeOf<{other: number}>().not.toBeAssignableTo<typeof enumFieldWithoutModifiers>();

// Modifier removal keeps the declared key when the source itself uses an enum.
type EnumFieldSource = {readonly [SelectorKey.Value]?: string; keep: number};
declare let changedEnumSource: SetFieldType<EnumFieldSource, Tagged<SelectorKey.Value, 'Key'>, boolean, {preservePropertyModifiers: false}>;
expectTypeOf<keyof typeof changedEnumSource>().toBe<keyof EnumFieldSource>();
changedEnumSource[SelectorKey.Value] = true;
expectTypeOf(changedEnumSource[SelectorKey.Value]).toBe<boolean>();

// An autocomplete selector over a template literal index signature keeps its literal member required.
declare const autocompleteTemplateField: SetFieldType<{[key: `on${string}`]: unknown; onClick?: () => void}, LiteralUnion<'onClick', `on${string}`>, boolean, {preservePropertyModifiers: false}>;
expectTypeOf(autocompleteTemplateField.onClick).toBe<boolean>();
expectTypeOf<{}>().not.toBeAssignableTo<typeof autocompleteTemplateField>();

// An empty intersection on a template literal selector resolves like the template literal itself.
expectTypeOf<SetFieldType<{[key: `on${string}`]: unknown; onClick?: () => void}, 'onClick' | (`on${string}` & {}), Date>>().toBe<{[key: `on${string}`]: Date; onClick?: Date}>();

// A numeric enum selector selects the declared key with its value, but not a `number` index signature, even though `number` is assignable to a numeric enum.
enum NumericSelectorKey {
	Zero,
	One,
}
expectTypeOf<SetFieldType<{[key: number]: string | boolean; 1: string}, NumericSelectorKey.One, boolean>>().toBe<{[key: number]: string | boolean; 1: boolean}>();
expectTypeOf<SetFieldType<{[key: number]: string | boolean; readonly 1?: string}, NumericSelectorKey.One, boolean, {preservePropertyModifiers: false}>>()
	.toBe<{[key: number]: string | boolean; 1: boolean}>();
expectTypeOf<SetFieldType<{0: string; 1: number}, NumericSelectorKey.Zero, boolean>>().toBe<{0: boolean; 1: number}>();
expectTypeOf<SetFieldType<{readonly 0?: string; 1: number}, NumericSelectorKey.Zero, boolean, {preservePropertyModifiers: false}>>().toBe<{0: boolean; 1: number}>();
expectTypeOf<SetFieldType<{[NumericSelectorKey.One]: string; other: number}, NumericSelectorKey.One, boolean>>().toBe<{[NumericSelectorKey.One]: boolean; other: number}>();
expectTypeOf<SetFieldType<{[NumericSelectorKey.One]: string; other: number}, 1, boolean>>().toBe<{[NumericSelectorKey.One]: boolean; other: number}>();
expectTypeOf<SetFieldType<string[], NumericSelectorKey.Zero, boolean>>().toBe<string[]>();
