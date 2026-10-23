import {expectTypeOf} from 'nz';
import type {ExclusifyUnion} from '../source/exclusify-union.d.ts';
import type {MapsSetsOrArrays, NonRecursiveType} from '../source/internal/type.d.ts';

expectTypeOf<ExclusifyUnion<{a: string} | {b: number}>>().toBe<{a: string; b?: never} | {a?: never; b: number}>();
expectTypeOf<ExclusifyUnion<{a: string} | {b: number} | {c: boolean}>>().toBe<{a: string; b?: never; c?: never} | {a?: never; b: number; c?: never} | {a?: never; b?: never; c: boolean}>();
expectTypeOf<ExclusifyUnion<{a: string; b: number} | {c: string; d: number}>>().toBe<{a: string; b: number; c?: never; d?: never} | {a?: never; b?: never; c: string; d: number}>();
expectTypeOf<ExclusifyUnion<{a: string} | {b: string; c: number} | {d: 1; e: 2; f: 3}>>().toBe<
	| {a: string; b?: never; c?: never; d?: never; e?: never; f?: never}
	| {a?: never; b: string; c: number; d?: never; e?: never; f?: never}
	| {a?: never; b?: never; c?: never; d: 1; e: 2; f: 3}>();

// Single member union
expectTypeOf<ExclusifyUnion<{a: string}>>().toBe<{a: string}>();
expectTypeOf<ExclusifyUnion<{a?: string; readonly b?: number}>>().toBe<{a?: string; readonly b?: number}>();

// Shared keys
expectTypeOf<ExclusifyUnion<{a: string} | {a: string; b: number}>>().toBe<{a: string; b?: never} | {a: string; b: number}>();
expectTypeOf<ExclusifyUnion<{a: string} | {a: string; b: number} | {b: string; c: boolean}>>().toBe<{a: string; b?: never; c?: never} | {a: string; b: number; c?: never} | {a?: never; b: string; c: boolean}>();

// Already exclusive unions
expectTypeOf<ExclusifyUnion<{a: string; b?: never} | {a?: never; b: number}>>().toBe<{a: string; b?: never} | {a?: never; b: number}>();
expectTypeOf<ExclusifyUnion<{a: string} | {a: number}>>().toBe<{a: string} | {a: number}>();

// Preserves property modifiers
expectTypeOf<ExclusifyUnion<{a?: 1; readonly b: 2; readonly c?: 3} | {d: 4; readonly e?: 5}>>().toBe<{a?: 1; readonly b: 2; readonly c?: 3; d?: never; e?: never} | {a?: never; b?: never; c?: never; d: 4; readonly e?: 5}>();
expectTypeOf<ExclusifyUnion<{a?: string; readonly b: number} | {readonly a: string; b?: number}>>().toBe<{a?: string; readonly b: number} | {readonly a: string; b?: number}>();

// Non-recursive types
expectTypeOf<ExclusifyUnion<Set<string> | Map<string, string>>>().toBe<Set<string> | Map<string, string>>();
expectTypeOf<ExclusifyUnion<WeakSet<{a: string}> | WeakMap<{a: string}, string>>>().toBe<WeakSet<{a: string}> | WeakMap<{a: string}, string>>();
expectTypeOf<ExclusifyUnion<string[] | Set<string>>>().toBe<string[] | Set<string>>();
expectTypeOf<ExclusifyUnion<NonRecursiveType>>().toBe<NonRecursiveType>();
expectTypeOf<ExclusifyUnion<MapsSetsOrArrays>>().toBe<MapsSetsOrArrays>();

// Mix of non-recursive and recursive types
expectTypeOf<ExclusifyUnion<{a: string} | {a: number; b: true} | undefined>>().toBe<{a: string; b?: never} | {a: number; b: true} | undefined>();
expectTypeOf<ExclusifyUnion<Date | {DDMMYYYY: string} | {MMDDYYYY: string}>>().toBe<Date | {DDMMYYYY: string; MMDDYYYY?: never} | {DDMMYYYY?: never; MMDDYYYY: string}>();
expectTypeOf<ExclusifyUnion<RegExp | null | {foo: string} | {bar: number; baz: {qux: string}}>>().toBe<RegExp | null | {foo: string; bar?: never; baz?: never} | {foo?: never; bar: number; baz: {qux: string}}>();

// Practical test cases
type FileConfig = {filePath: string};
type InlineConfig = {content: string};

type Config = ExclusifyUnion<FileConfig | InlineConfig>;
//=> {filePath: string; content?: never} | {content: string; filePath?: never}

declare function loadConfig(options: Config): void;

// @ts-expect-error
loadConfig({filePath: './config.json', content: '{ "name": "app" }'}); // Cannot provide both properties
loadConfig({filePath: './config.json'}); // Ok
loadConfig({content: '{ "name": "app" }'}); // Ok

type CardPayment = {amount: number; cardNumber: string};
type PaypalPayment = {amount: number; paypalId: string};

function processPayment(payment: ExclusifyUnion<CardPayment | PaypalPayment>) {
	// Can access `cardNumber` or `paypalId` directly
	// And, the resulting type is also correctly `string`
	const details = payment.cardNumber ?? payment.paypalId;
	expectTypeOf(details).toBe<string>();
}

type Success = {data: string};
type Failure = {error: Error};

declare function fetchData(): ExclusifyUnion<Success | Failure>;

function handleResult() {
	// Can destructure `data` and `error` directly
	const {data, error} = fetchData();
	expectTypeOf(data).toBe<string | undefined>();
	expectTypeOf(error).toBe<Error | undefined>();

	// And, the destructured variables are still narrowed together
	if (error) {
		expectTypeOf(data).toBe<undefined>();
	} else {
		expectTypeOf(data).toBe<string>();
	}
}

// Boundary types
expectTypeOf<ExclusifyUnion<unknown>>().toBe<unknown>();
expectTypeOf<ExclusifyUnion<any>>().toBe<any>();
expectTypeOf<ExclusifyUnion<never>>().toBe<never>();

// A string index signature contributes `string | number` to the keys of the union, and adding those as `never` keys collides with the other members' own named string keys, which left the union with nothing assignable to it. The type only ever adds keys, so it must not reject a member of its input.
({a: 'x'}) satisfies ExclusifyUnion<{[k: string]: number} | {a: string}>;
({a: 'x'}) satisfies ExclusifyUnion<Record<string, number> | {a: string}>;

// A `number` or `symbol` index signature does not cover a named string key, so those keys are still added as `never` and the member keeps its own index signature.
expectTypeOf<ExclusifyUnion<{[k: number]: number} | {a: string}>>().toBe<{[k: number]: number; a?: never} | {a: string}>();
expectTypeOf<ExclusifyUnion<{[k: symbol]: number} | {a: string}>>().toBe<{[k: symbol]: number; a?: never} | {a: string}>();

// Numeric keys and their canonical string spellings are the same property, so neither input member may be forbidden.
type NumericAliasAlternatives = {0: string} | {'0': number};
expectTypeOf<{0: string}>().toBeAssignableTo<ExclusifyUnion<NumericAliasAlternatives>>();
expectTypeOf<{'0': number}>().toBeAssignableTo<ExclusifyUnion<NumericAliasAlternatives>>();

expectTypeOf<ExclusifyUnion<NumericAliasAlternatives>>().toBe<NumericAliasAlternatives>();
expectTypeOf<{0: boolean}>().not.toBeAssignableTo<ExclusifyUnion<NumericAliasAlternatives>>();

// Other alternatives must still forbid the shared runtime property. Duplicate aliases must not erase the forbidden key.
type NumericAliasChoices = NumericAliasAlternatives | {other: true};
expectTypeOf<{0: string}>().toBeAssignableTo<ExclusifyUnion<NumericAliasChoices>>();
expectTypeOf<{'0': number}>().toBeAssignableTo<ExclusifyUnion<NumericAliasChoices>>();
expectTypeOf<{other: true}>().toBeAssignableTo<ExclusifyUnion<NumericAliasChoices>>();
expectTypeOf<{other: true; 0: string}>().not.toBeAssignableTo<ExclusifyUnion<NumericAliasChoices>>();
expectTypeOf<{other: true; '0': number}>().not.toBeAssignableTo<ExclusifyUnion<NumericAliasChoices>>();
expectTypeOf<{other: true; 0: undefined}>().not.toBeAssignableTo<ExclusifyUnion<NumericAliasChoices>>();

// Each member keeps the modifiers of its own properties.
type ModifiedAliases = {readonly 0?: string; kind: 'text'} | {'0': number; kind: 'count'} | {fallback: boolean};
expectTypeOf<ExclusifyUnion<ModifiedAliases>>().toBe<
	| {readonly 0?: string; kind: 'text'; fallback?: never}
	| {'0': number; kind: 'count'; fallback?: never}
	| {fallback: boolean; kind?: never; 0?: never}
>();
expectTypeOf<{kind: 'text'}>().toBeAssignableTo<ExclusifyUnion<ModifiedAliases>>();
expectTypeOf<{0: number; kind: 'count'}>().toBeAssignableTo<ExclusifyUnion<ModifiedAliases>>();
expectTypeOf<{kind: 'count'}>().not.toBeAssignableTo<ExclusifyUnion<ModifiedAliases>>();
expectTypeOf<{kind: 'text'; fallback: true}>().not.toBeAssignableTo<ExclusifyUnion<ModifiedAliases>>();

// Preserve the declared numeric key identities of ordinary unions, including keys only present as optional.
type NumericKeys = ExclusifyUnion<{readonly 0: string} | {1: number}>;
expectTypeOf<keyof NumericKeys>().toBe<0 | 1>();
expectTypeOf<{0: string}>().toBeAssignableTo<Pick<NumericKeys, 0>>();
expectTypeOf<Pick<NumericKeys, 0>[0]>().toBe<string | undefined>();
type OptionalNumericKeys = ExclusifyUnion<{0?: string} | {1?: number}>;
expectTypeOf<keyof OptionalNumericKeys>().toBe<0 | 1>();
expectTypeOf<{}>().toBeAssignableTo<Pick<OptionalNumericKeys, 0>>();
expectTypeOf<Pick<OptionalNumericKeys, 0>[0]>().toBe<string | undefined>();
expectTypeOf<keyof ExclusifyUnion<{'0': string} | {'1': number}>>().toBe<'0' | '1'>();

// Signed and fractional numbers also have canonical string aliases; padded spellings remain distinct keys.
expectTypeOf<ExclusifyUnion<{[-2]: string} | {'-2': number}>>().toBe<{[-2]: string} | {'-2': number}>();
expectTypeOf<ExclusifyUnion<{1.5?: string} | {'1.5': number}>>().toBe<{1.5?: string} | {'1.5': number}>();
type NoncanonicalChoices = ExclusifyUnion<{1: string} | {'01': number}>;
expectTypeOf<{1: string}>().toBeAssignableTo<NoncanonicalChoices>();
expectTypeOf<{'01': number}>().toBeAssignableTo<NoncanonicalChoices>();
expectTypeOf<{1: string; '01': number}>().not.toBeAssignableTo<NoncanonicalChoices>();
expectTypeOf<keyof NoncanonicalChoices>().toBe<1 | '01'>();

// Symbols remain independent forbidden properties beside numeric aliases.
declare const uniqueChoice: unique symbol;
type SymbolChoice = ExclusifyUnion<NumericAliasAlternatives | {[uniqueChoice]: true}>;
expectTypeOf<{[uniqueChoice]: true}>().toBeAssignableTo<SymbolChoice>();
expectTypeOf<{0: string}>().toBeAssignableTo<SymbolChoice>();
expectTypeOf<{[uniqueChoice]: true; '0': number}>().not.toBeAssignableTo<SymbolChoice>();

// Value types and skipped primitive/collection members are preserved.
expectTypeOf<ExclusifyUnion<{0: any} | {'0': unknown}>>().toBe<{0: any} | {'0': unknown}>();
expectTypeOf<ExclusifyUnion<{0: never} | {'0': string}>>().toBe<{0: never} | {'0': string}>();
expectTypeOf<ExclusifyUnion<NumericAliasAlternatives | undefined>>().toBe<NumericAliasAlternatives | undefined>();
expectTypeOf<ExclusifyUnion<NumericAliasAlternatives | string[]>>().toBe<NumericAliasAlternatives | string[]>();
