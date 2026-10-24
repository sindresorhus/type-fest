import {expectTypeOf} from 'nz';
import type {OverrideProperties} from '../source/override-properties.d.ts';

type Foo = {
	a: number;
	b: string;
};

const fixture: OverrideProperties<Foo, {b: number}> = {a: 1, b: 2};
expectTypeOf(fixture).toBe<{a: number; b: number}>();

// @ts-expect-error
type Bar1 = OverrideProperties<Foo, {c: number}>;

// @ts-expect-error
type Bar2 = OverrideProperties<Foo, {b: number; c: number}>;

// Test for https://github.com/sindresorhus/type-fest/issues/858
{ // eslint-disable-line no-lone-blocks
	type Original = {
		foo: string;
		bar: string;
	};

	type Modified = {
		foo: string | undefined;
		bar: string;
	};

	type Final = OverrideProperties<Original, Modified>;

	expectTypeOf<Final>().toBeAssignableTo<{foo: string | undefined; bar: string}>();
}

// Test for https://github.com/sindresorhus/type-fest/issues/969
{ // eslint-disable-line no-lone-blocks
	type Callable = {
		(value: string): number;
		property: number;
	};

	expectTypeOf<OverrideProperties<Callable, {property: string}>>().toBe<((value: string) => number) & {property: string}>();
}

// A canonical numeric key and its string spelling override the same existing property.
expectTypeOf<OverrideProperties<{0: string}, {'0': number}>>().toBe<{'0': number}>();
expectTypeOf<OverrideProperties<{'0': string}, {0: number}>>().toBe<{0: number}>();

// An override supplies its own modifiers and leaves unrelated properties unchanged.
expectTypeOf<OverrideProperties<{readonly 0?: string; keep?: boolean}, {'0': number}>>().toBe<{'0': number; keep?: boolean}>();
expectTypeOf<OverrideProperties<{'0': string; keep: boolean}, {readonly 0?: number}>>().toBe<{readonly 0?: number; keep: boolean}>();
expectTypeOf<OverrideProperties<{0: string; '1': boolean}, {'0': number; 1: Date}>>().toBe<{'0': number; 1: Date}>();
expectTypeOf<OverrideProperties<{[-2]: string}, {'-2': number}>>().toBe<{'-2': number}>();
expectTypeOf<OverrideProperties<{'1.5': string}, {1.5: number}>>().toBe<{1.5: number}>();

// Numeric-looking keys that are not canonical spellings are separate properties.
expectTypeOf<OverrideProperties<{'01': string; 1: boolean}, {'01': number}>>().toBe<{'01': number; 1: boolean}>();
// @ts-expect-error A padded string does not name numeric key 1.
type PaddedOverride = OverrideProperties<{1: string}, {'01': number}>;
// @ts-expect-error A numeric override does not name the padded key.
type PaddedOriginal = OverrideProperties<{'01': string}, {1: number}>;
// @ts-expect-error A fractional spelling with redundant zeros does not name numeric key 1.
type DecimalOverride = OverrideProperties<{1: string}, {'1.0': number}>;
// @ts-expect-error Scientific notation is not the spelling of numeric key 1.
type ExponentOverride = OverrideProperties<{1: string}, {'1e0': number}>;
// @ts-expect-error Aliases do not allow additional missing properties.
type MissingAliasedOverride = OverrideProperties<{0: string}, {'0': number; missing: boolean}>;

// Symbols remain distinct keys and are never converted to strings.
declare const originalSymbol: unique symbol;
declare const otherSymbol: unique symbol;
expectTypeOf<OverrideProperties<{[originalSymbol]: string; 0: boolean}, {[originalSymbol]: number}>>()
	.toBe<{[originalSymbol]: number; 0: boolean}>();
// @ts-expect-error A different symbol does not name the original property.
type MissingSymbolOverride = OverrideProperties<{[originalSymbol]: string}, {[otherSymbol]: number}>;

// Preserve the existing constraint for bare index signatures and broad override keys.
expectTypeOf<OverrideProperties<Record<number, string>, {0: 'changed'}>>().toBe<{[key: number]: string; 0: 'changed'}>();
expectTypeOf<OverrideProperties<Record<string, string>, {name: 'changed'}>>().toBe<{[key: string]: string; name: 'changed'}>();
// @ts-expect-error A bare numeric index signature does not declare a numeric-looking string property.
type NoncanonicalIndexOverride = OverrideProperties<Record<number, string>, {'01': number}>;
// @ts-expect-error A broad numeric override could include keys the original does not declare.
type BroadNumericOverride = OverrideProperties<{0: string}, Record<number, number>>;

// Property values are not constrained by the type being overridden.
expectTypeOf<OverrideProperties<{0: string}, {'0': any}>>().toBe<{'0': any}>();
expectTypeOf<OverrideProperties<{'0': string}, {0: never}>>().toBe<{0: never}>();
expectTypeOf<OverrideProperties<{0: string}, {'0': unknown}>>().toBe<{'0': unknown}>();
// @ts-expect-error An unknown override does not establish that its keys exist on the original.
type UnknownOverride = OverrideProperties<{0: string}, unknown>;

expectTypeOf<OverrideProperties<unknown, {}>>().toBe<{}>();
expectTypeOf<OverrideProperties<never, {0: number}>>().toBe<never>();
expectTypeOf<OverrideProperties<{0: string}, never>>().toBe<never>();

// A string enum key can be overridden by its runtime string spelling.
enum OverrideEnumKey {
	Name = 'name',
}

expectTypeOf<OverrideProperties<{[OverrideEnumKey.Name]: string; id: number}, {name: 'Ada'}>>().toBe<{name: 'Ada'; id: number}>();
// @ts-expect-error A missing property still cannot be overridden.
type MissingEnumOverride = OverrideProperties<{[OverrideEnumKey.Name]: string}, {other: 1}>;
