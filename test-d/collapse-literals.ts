import {expectTypeOf} from 'nz';
import type {CollapseLiterals, EmptyObject, ExtractLiterals, Flavor, IsEqual, LiteralUnion, Tagged} from '../index.d.ts';

declare const symbolLiteral1: unique symbol;
declare const symbolLiteral2: unique symbol;

// Uncollapsed unions
expectTypeOf<CollapseLiterals<'foo' | 'bar' | (string & {})>>().toBe<string>();
expectTypeOf<CollapseLiterals<1 | 2 | (number & {})>>().toBe<number>();
expectTypeOf<CollapseLiterals<typeof symbolLiteral1 | typeof symbolLiteral2 | (symbol & {})>>().toBe<symbol>();
expectTypeOf<CollapseLiterals<1n | 2n | (bigint & {})>>().toBe<bigint>();
expectTypeOf<CollapseLiterals<'onChange' | 'onClick' | (`on${string}` & {})>>().toBe<`on${string}`>();
expectTypeOf<CollapseLiterals<'change' | 'click' | (`on${string}` & {})>>().toBe<'change' | 'click' | `on${string}`>();
expectTypeOf<CollapseLiterals<'drag' | 'onChange' | 'onClick' | (`on${string}` & {})>>().toBe<'drag' | `on${string}`>();

expectTypeOf<CollapseLiterals<null | undefined | 'foo' | 'bar' | (string & {})>>().toBe<null | undefined | string>();
expectTypeOf<CollapseLiterals<'foo' | 'BAR' | (Uppercase<string> & {}) | number>>().toBe<'foo' | Uppercase<string> | number>();
expectTypeOf<CollapseLiterals<typeof symbolLiteral1 | 'foo' | 'bar' | (number & {})>>().toBe<typeof symbolLiteral1 | 'foo' | 'bar' | number>();

// Already collapsed unions are returned as-is
expectTypeOf<CollapseLiterals<string>>().toBe<string>();
expectTypeOf<CollapseLiterals<bigint>>().toBe<bigint>();
expectTypeOf<CollapseLiterals<false>>().toBe<false>();
expectTypeOf<CollapseLiterals<PropertyKey>>().toBe<PropertyKey>();
expectTypeOf<CollapseLiterals<number | bigint>>().toBe<number | bigint>();
expectTypeOf<CollapseLiterals<null | undefined>>().toBe<null | undefined>();
expectTypeOf<CollapseLiterals<'foo' | 'bar'>>().toBe<'foo' | 'bar'>();
expectTypeOf<CollapseLiterals<string | number | boolean>>().toBe<string | number | boolean>();
expectTypeOf<CollapseLiterals<unknown>>().toBe<unknown>();
expectTypeOf<CollapseLiterals<string[] | [string, string]>>().toBe<string[] | [string, string]>();
expectTypeOf<CollapseLiterals<Record<string, string> | {a: string; b: number}>>().toBe<Record<string, string> | {a: string; b: number}>();

// Boundary types
expectTypeOf<CollapseLiterals<{}>>().toBe<{}>();
expectTypeOf<CollapseLiterals<never>>().toBe<never>();
expectTypeOf<CollapseLiterals<any>>().toBe<any>();

// Public LiteralUnion inputs for every primitive base
expectTypeOf<CollapseLiterals<LiteralUnion<'auto' | 'dark', string>>>().toBe<string>();
expectTypeOf<CollapseLiterals<LiteralUnion<0 | 1 | -2.5, number>>>().toBe<number>();
expectTypeOf<CollapseLiterals<LiteralUnion<0n | -1n, bigint>>>().toBe<bigint>();
expectTypeOf<CollapseLiterals<LiteralUnion<typeof symbolLiteral1, symbol>>>().toBe<symbol>();
expectTypeOf<CollapseLiterals<LiteralUnion<true, boolean>>>().toBe<boolean>();
expectTypeOf<CollapseLiterals<LiteralUnion<false, true>>>().toBe<boolean>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto', null | undefined>>>().toBe<'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<never, string>>>().toBe<string>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto', never>>>().toBe<'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto' | 1, string | number>>>().toBe<string | number>();
expectTypeOf<CollapseLiterals<LiteralUnion<typeof symbolLiteral1 | typeof symbolLiteral2, symbol>>>().toBe<symbol>();
expectTypeOf<CollapseLiterals<LiteralUnion<'a', string> | LiteralUnion<'b', string>>>().toBe<string>();
expectTypeOf<CollapseLiterals<LiteralUnion<'a' | null | undefined, string>>>().toBe<string | null | undefined>();
expectTypeOf<CollapseLiterals<LiteralUnion<true | null, boolean>>>().toBe<boolean | null>();
expectTypeOf<CollapseLiterals<LiteralUnion<any, string>>>().toBe<any>();

// Each base collapses independently, preserving literals outside it
type MixedLiteralUnion = LiteralUnion<'auto', string> | LiteralUnion<1, number> | LiteralUnion<1n, bigint> | LiteralUnion<typeof symbolLiteral1, symbol> | false;
expectTypeOf<CollapseLiterals<MixedLiteralUnion>>().toBe<string | number | bigint | symbol | false>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto' | 1 | true | typeof symbolLiteral1, string>>>().toBe<string | 1 | true | typeof symbolLiteral1>();
expectTypeOf<CollapseLiterals<LiteralUnion<1 | 'auto', number> | 1n>>().toBe<number | 'auto' | 1n>();

// Infinite string patterns keep their constraints and unrelated literals
expectTypeOf<CollapseLiterals<LiteralUnion<'1' | 'auto', `${number}`>>>().toBe<`${number}` | 'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'1' | '1.5' | 'auto', `${bigint}`>>>().toBe<`${bigint}` | '1.5' | 'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'100px' | 'auto', `${number}px`>>>().toBe<`${number}px` | 'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'--color' | 'auto', `--${string}`>>>().toBe<`--${string}` | 'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'DARK' | 'dark', Uppercase<string>>>>().toBe<Uppercase<string> | 'dark'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'dark' | 'DARK', Lowercase<string>>>>().toBe<Lowercase<string> | 'DARK'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'Dark' | 'dark', Capitalize<string>>>>().toBe<Capitalize<string> | 'dark'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'dark' | 'Dark', Uncapitalize<string>>>>().toBe<Uncapitalize<string> | 'Dark'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'onClick' | 'offClick' | 'click', `on${string}` | `off${string}`>>>().toBe<`on${string}` | `off${string}` | 'click'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'onClick', `on${string}`> | LiteralUnion<'offClick', `off${string}`>>>().toBe<`on${string}` | `off${string}`>();
expectTypeOf<CollapseLiterals<LiteralUnion<'onClick', `on${string}`> | LiteralUnion<'auto', string>>>().toBe<string>();
expectTypeOf<CollapseLiterals<LiteralUnion<'onClick', `on${string}`> | `onKey${string}`>>().toBe<`on${string}` | `onKey${string}`>();

// Finite unions and standalone literals must not widen
expectTypeOf<CollapseLiterals<'auto'>>().toBe<'auto'>();
expectTypeOf<CollapseLiterals<0 | -1 | 2.5>>().toBe<0 | -1 | 2.5>();
expectTypeOf<CollapseLiterals<0n | -1n>>().toBe<0n | -1n>();
expectTypeOf<CollapseLiterals<typeof symbolLiteral1 | typeof symbolLiteral2>>().toBe<typeof symbolLiteral1 | typeof symbolLiteral2>();
expectTypeOf<CollapseLiterals<true>>().toBe<true>();
expectTypeOf<CollapseLiterals<boolean>>().toBe<boolean>();
expectTypeOf<CollapseLiterals<'auto' | 1 | 1n | true | typeof symbolLiteral1>>().toBe<'auto' | 1 | 1n | true | typeof symbolLiteral1>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto', 'dark' | 'light'>>>().toBe<'auto' | 'dark' | 'light'>();
expectTypeOf<CollapseLiterals<`on${'Click' | 'Change'}`>>().toBe<'onClick' | 'onChange'>();

// Structural members are preserved without recursively changing their contents
type Theme = LiteralUnion<'auto' | 'dark', string>;
type ThemeObject = {readonly theme?: Theme};
type ThemeFunction = (theme: Theme) => Theme;
expectTypeOf<CollapseLiterals<ThemeObject>>().toBe<ThemeObject>();
expectTypeOf<CollapseLiterals<Theme | {theme: Theme}>>().toBe<string | {theme: Theme}>();
expectTypeOf<CollapseLiterals<Theme | ThemeObject>>().toBe<string | ThemeObject>();
expectTypeOf<CollapseLiterals<Theme | Record<string, Theme>>>().toBe<string | Record<string, Theme>>();
expectTypeOf<CollapseLiterals<Theme | ThemeFunction>>().toBe<string | ThemeFunction>();
expectTypeOf<CollapseLiterals<Theme | (abstract new () => ThemeObject)>>().toBe<string | (abstract new () => ThemeObject)>();
expectTypeOf<CollapseLiterals<Theme[]>>().toBe<Theme[]>();
expectTypeOf<CollapseLiterals<readonly [Theme, Theme?]>>().toBe<readonly [Theme, Theme?]>();
expectTypeOf<CollapseLiterals<Theme | readonly Theme[]>>().toBe<string | readonly Theme[]>();
expectTypeOf<CollapseLiterals<Theme | Promise<Theme>>>().toBe<string | Promise<Theme>>();

// Brands and tags are preserved; their literal unions are not collapsed
type TaggedTheme = Tagged<Theme, 'Theme'>;
type BrandedTheme = Theme & {readonly __brand: 'Theme'};
expectTypeOf<CollapseLiterals<TaggedTheme>>().toBe<Tagged<string, 'Theme'> | Tagged<'auto' | 'dark', 'Theme'>>();
expectTypeOf<CollapseLiterals<BrandedTheme>>().toBe<(string & {readonly __brand: 'Theme'}) | (('auto' | 'dark') & {readonly __brand: 'Theme'})>();
expectTypeOf<CollapseLiterals<Tagged<'dark', 'Theme'>>>().toBe<Tagged<'dark', 'Theme'>>();
expectTypeOf<CollapseLiterals<LiteralUnion<Tagged<'dark', 'Theme'>, string>>>().toBe<string | Tagged<'dark', 'Theme'>>();
expectTypeOf<CollapseLiterals<Theme | Tagged<LiteralUnion<1, number>, 'Size'>>>().toBe<string | Tagged<number, 'Size'> | Tagged<1, 'Size'>>();

// Top, bottom, and nullish types retain their identity
expectTypeOf<CollapseLiterals<object>>().toBe<object>();
expectTypeOf<CollapseLiterals<void>>().toBe<void>();
expectTypeOf<CollapseLiterals<null>>().toBe<null>();
expectTypeOf<CollapseLiterals<undefined>>().toBe<undefined>();
expectTypeOf<CollapseLiterals<Theme | void>>().toBe<string | void>();
expectTypeOf<CollapseLiterals<Theme | any>>().toBe<any>();
expectTypeOf<CollapseLiterals<Theme | unknown>>().toBe<unknown>();
expectTypeOf<CollapseLiterals<Theme | never>>().toBe<string>();
expectTypeOf<CollapseLiterals<{} | null | undefined>>().toBe<{} | null | undefined>();

// Enum members retain their nominal identity without a wider member
enum ThemeName {
	Auto = 'auto',
	Dark = 'dark',
}

enum Size {
	Small = 1,
	Large = 2,
}

expectTypeOf<CollapseLiterals<ThemeName>>().toBe<ThemeName.Auto | ThemeName.Dark>();
expectTypeOf<CollapseLiterals<ThemeName.Dark>>().toBe<ThemeName.Dark>();
expectTypeOf<CollapseLiterals<Size>>().toBe<Size.Small | Size.Large>();
expectTypeOf<CollapseLiterals<Size.Small>>().toBe<Size.Small>();
expectTypeOf<CollapseLiterals<LiteralUnion<ThemeName, string>>>().toBe<string>();
expectTypeOf<CollapseLiterals<LiteralUnion<Size, number>>>().toBe<number>();

// Normalization is stable and removes only literals covered by broader members
expectTypeOf<CollapseLiterals<CollapseLiterals<Theme | 1>>>().toBe<string | 1>();
expectTypeOf<ExtractLiterals<CollapseLiterals<Theme | 1>>>().toBe<1>();
expectTypeOf<ExtractLiterals<CollapseLiterals<LiteralUnion<'onClick' | 'click', `on${string}`>>>>().toBe<'click'>();

// Conditional-type arguments resolve before the collapse
expectTypeOf<CollapseLiterals<string extends string ? (string & {}) : never>>().toBe<string>();
expectTypeOf<CollapseLiterals<typeof symbolLiteral1 extends symbol ? Theme : never>>().toBe<string>();

// Normalized values support ordinary narrowing and reject unrelated values
declare const theme: CollapseLiterals<Theme>;
if (theme === 'dark') {
	expectTypeOf<typeof theme>().toBe<'dark'>();
}

expectTypeOf<number>().not.toBeAssignableTo<CollapseLiterals<Theme>>();
expectTypeOf<'offClick'>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<'onClick', `on${string}`>>>();
expectTypeOf<true>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<false, string>>>();
expectTypeOf<{theme: number}>().not.toBeAssignableTo<CollapseLiterals<Theme | ThemeObject>>();

// Empty intersections normalize even when no explicit literal accompanies them
expectTypeOf<CollapseLiterals<string & {}>>().toBe<string>();
expectTypeOf<CollapseLiterals<number & Record<never, never>>>().toBe<number>();
expectTypeOf<CollapseLiterals<bigint & Record<never, never>>>().toBe<bigint>();
expectTypeOf<CollapseLiterals<symbol & Record<never, never>>>().toBe<symbol>();
expectTypeOf<CollapseLiterals<boolean & Record<never, never>>>().toBe<boolean>();
expectTypeOf<CollapseLiterals<`on${string}` & {}>>().toBe<`on${string}`>();
expectTypeOf<CollapseLiterals<Uppercase<string> & Record<never, never>>>().toBe<Uppercase<string>>();
expectTypeOf<CollapseLiterals<'auto' & Record<never, never>>>().toBe<'auto'>();
expectTypeOf<CollapseLiterals<typeof symbolLiteral1 & Record<never, never>>>().toBe<typeof symbolLiteral1>();
expectTypeOf<CollapseLiterals<unknown & {}>>().toBe<{}>();
expectTypeOf<CollapseLiterals<any & {}>>().toBe<any>();
expectTypeOf<CollapseLiterals<(string | number) & Record<never, never>>>().toBe<string | number>();
expectTypeOf<CollapseLiterals<(string & {}) | (number & {})>>().toBe<string | number>();
expectTypeOf<CollapseLiterals<LiteralUnion<'a', string> & {}>>().toBe<string>();

// Non-primitive members do not prevent primitive unions from collapsing
expectTypeOf<CollapseLiterals<Theme | {}>>().toBe<string | {}>();
expectTypeOf<CollapseLiterals<Theme | object>>().toBe<string | object>();
expectTypeOf<CollapseLiterals<Theme | EmptyObject>>().toBe<string | EmptyObject>();
expectTypeOf<CollapseLiterals<Theme | Record<never, never>>>().toBe<string | Record<never, never>>();
expectTypeOf<CollapseLiterals<LiteralUnion<1, number> | ThemeObject>>().toBe<number | ThemeObject>();
expectTypeOf<CollapseLiterals<LiteralUnion<1n, bigint> | ThemeObject>>().toBe<bigint | ThemeObject>();
expectTypeOf<CollapseLiterals<LiteralUnion<typeof symbolLiteral1, symbol> | ThemeObject>>().toBe<symbol | ThemeObject>();
expectTypeOf<CollapseLiterals<LiteralUnion<'onChange', `on${string}`> | ThemeObject>>().toBe<`on${string}` | ThemeObject>();
expectTypeOf<CollapseLiterals<Theme | ThemeObject | null | undefined>>().toBe<string | ThemeObject | null | undefined>();
expectTypeOf<CollapseLiterals<MixedLiteralUnion | ThemeObject>>().toBe<string | number | bigint | symbol | false | ThemeObject>();
expectTypeOf<CollapseLiterals<Theme | Record<number, Theme>>>().toBe<string | Record<number, Theme>>();
expectTypeOf<CollapseLiterals<Theme | Record<symbol, Theme>>>().toBe<string | Record<symbol, Theme>>();
expectTypeOf<CollapseLiterals<Theme | {theme?: never}>>().toBe<string | {theme?: never}>();
expectTypeOf<CollapseLiterals<Theme | {} | null | undefined>>().toBe<string | {} | null | undefined>();

// `{}`-assignable object members do not stop the primitive members from collapsing
expectTypeOf<CollapseLiterals<LiteralUnion<true, boolean> | ThemeObject>>().toBe<boolean | ThemeObject>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto', string> | ThemeObject | {theme: string}>>().toBe<string | ThemeObject | {theme: string}>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto', string> | undefined | ThemeObject>>().toBe<string | undefined | ThemeObject>();
expectTypeOf<CollapseLiterals<LiteralUnion<ThemeName, string> | ThemeObject>>().toBe<string | ThemeObject>();
expectTypeOf<CollapseLiterals<LiteralUnion<'a', string> | Record<string, unknown>>>().toBe<string | Record<string, unknown>>();

// Standalone structural types are returned unchanged, not `unknown`
expectTypeOf<CollapseLiterals<Record<never, never>>>().toBe<Record<never, never>>();
expectTypeOf<CollapseLiterals<EmptyObject>>().toBe<EmptyObject>();
expectTypeOf<CollapseLiterals<Record<string, never>>>().toBe<Record<string, never>>();
expectTypeOf<CollapseLiterals<Record<number, Theme>>>().toBe<Record<number, Theme>>();
expectTypeOf<CollapseLiterals<{theme?: never}>>().toBe<{theme?: never}>();

// Overlapping patterns collapse covered literals without widening their constraints
expectTypeOf<CollapseLiterals<LiteralUnion<'' | 'auto', string>>>().toBe<string>();
expectTypeOf<CollapseLiterals<LiteralUnion<'', `on${string}`>>>().toBe<'' | `on${string}`>();
expectTypeOf<CollapseLiterals<LiteralUnion<'start' | 'end', `${string}end`>>>().toBe<'start' | `${string}end`>();
expectTypeOf<CollapseLiterals<LiteralUnion<'a/b' | 'auto', `${string}/${string}`>>>().toBe<`${string}/${string}` | 'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'on1' | 'onAuto', `on${number}`>>>().toBe<`on${number}` | 'onAuto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'-1' | '1.5', `${bigint}`>>>().toBe<`${bigint}` | '1.5'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'10px' | '10em' | 'auto', `${number}${'px' | 'em'}`>>>().toBe<`${number}px` | `${number}em` | 'auto'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'data-id' | 'aria-label' | 'role', `${'data' | 'aria'}-${string}`>>>().toBe<`data-${string}` | `aria-${string}` | 'role'>();
expectTypeOf<CollapseLiterals<LiteralUnion<'ON' | 'off', Uppercase<string>> | ThemeObject>>().toBe<Uppercase<string> | 'off' | ThemeObject>();
expectTypeOf<CollapseLiterals<LiteralUnion<'yes' | 'no' | 'auto', `${boolean}`>>>().toBe<'yes' | 'no' | 'auto' | 'true' | 'false'>();
expectTypeOf<CollapseLiterals<LiteralUnion<never, `on${string}`>>>().toBe<`on${string}`>();
expectTypeOf<CollapseLiterals<LiteralUnion<'auto', `on${never}`>>>().toBe<'auto'>();

// Real brand properties and tag metadata must survive empty-intersection removal
type ThemeBrand = {readonly __brand: 'Theme'};
type BrandedSize = LiteralUnion<1 | 2, number> & ThemeBrand;
type BrandedSymbol = LiteralUnion<typeof symbolLiteral1, symbol> & ThemeBrand;
type TaggedEvent = Tagged<LiteralUnion<'onClick', `on${string}`>, 'Event', {source: 'dom'}>;
type NestedTaggedTheme = Tagged<Tagged<Theme, 'Theme'>, 'Validated'>;
expectTypeOf<CollapseLiterals<BrandedSize>>().toBe<(1 & ThemeBrand) | (2 & ThemeBrand) | (number & ThemeBrand)>();
expectTypeOf<CollapseLiterals<BrandedSymbol>>().toBe<(typeof symbolLiteral1 & ThemeBrand) | (symbol & ThemeBrand)>();
expectTypeOf<CollapseLiterals<TaggedEvent>>().toBe<Tagged<'onClick', 'Event', {source: 'dom'}> | Tagged<`on${string}`, 'Event', {source: 'dom'}>>();
expectTypeOf<CollapseLiterals<NestedTaggedTheme>>().toBe<Tagged<Tagged<string, 'Theme'>, 'Validated'> | Tagged<Tagged<'auto' | 'dark', 'Theme'>, 'Validated'>>();
expectTypeOf<CollapseLiterals<Theme | TaggedEvent>>().toBe<string | Tagged<'onClick', 'Event', {source: 'dom'}> | Tagged<`on${string}`, 'Event', {source: 'dom'}>>();
expectTypeOf<CollapseLiterals<LiteralUnion<Tagged<1, 'Size'>, number>>>().toBe<number | Tagged<1, 'Size'>>();
expectTypeOf<CollapseLiterals<LiteralUnion<Tagged<typeof symbolLiteral1, 'Key'>, symbol>>>().toBe<symbol | Tagged<typeof symbolLiteral1, 'Key'>>();
type OptionalThemeBrand = {readonly metadata?: 'theme'};
expectTypeOf<CollapseLiterals<Theme & OptionalThemeBrand>>().toBe<(string & OptionalThemeBrand) | (('auto' | 'dark') & OptionalThemeBrand)>();
type UserId = Flavor<string, 'UserId'>;
expectTypeOf<CollapseLiterals<LiteralUnion<UserId, string>>>().toBe<string | UserId>();
expectTypeOf<CollapseLiterals<TaggedTheme | (string & {})>>().toBe<string | Tagged<string, 'Theme'> | Tagged<'auto' | 'dark', 'Theme'>>();

// Containers, call signatures, and constructors keep nested literal unions
type ThemeMap = Map<Theme, ThemeObject>;
type ThemeSet = ReadonlySet<Theme>;
type ThemeIntersection = ThemeObject & {readonly enabled: true};
type ThemeOverloads = {
	(theme: Theme): Theme;
	(theme: number): number;
};
declare class ThemeClass {
	protected readonly theme: Theme;
	getTheme(): Theme;
}

expectTypeOf<CollapseLiterals<ThemeMap>>().toBe<ThemeMap>();
expectTypeOf<CollapseLiterals<Theme | ThemeMap>>().toBe<string | ThemeMap>();
expectTypeOf<CollapseLiterals<Theme | ThemeSet>>().toBe<string | ThemeSet>();
expectTypeOf<CollapseLiterals<Theme | Date>>().toBe<string | Date>();
expectTypeOf<CollapseLiterals<Theme | ThemeIntersection>>().toBe<string | ThemeIntersection>();
expectTypeOf<CollapseLiterals<ThemeOverloads>>().toBe<ThemeOverloads>();
expectTypeOf<CollapseLiterals<Theme | ThemeOverloads>>().toBe<string | ThemeOverloads>();
expectTypeOf<CollapseLiterals<Theme | typeof ThemeClass>>().toBe<string | typeof ThemeClass>();
expectTypeOf<CollapseLiterals<Theme | ThemeClass>>().toBe<string | ThemeClass>();
expectTypeOf<CollapseLiterals<readonly [Theme, ...Theme[]]>>().toBe<readonly [Theme, ...Theme[]]>();
expectTypeOf<CollapseLiterals<{readonly [symbolLiteral1]?: Theme}>>().toBe<{readonly [symbolLiteral1]?: Theme}>();
expectTypeOf<CollapseLiterals<Theme | readonly []>>().toBe<string | readonly []>();

// The documented comparison use-case observes normalization
expectTypeOf<IsEqual<Theme, string>>().toBe<false>();
expectTypeOf<IsEqual<CollapseLiterals<Theme>, string>>().toBe<true>();
expectTypeOf<IsEqual<CollapseLiterals<Theme | ThemeObject>, string | ThemeObject>>().toBe<true>();
expectTypeOf<Extract<CollapseLiterals<Theme | null>, null>>().toBe<null>();
expectTypeOf<Exclude<CollapseLiterals<Theme | ThemeObject>, string>>().toBe<ThemeObject>();
expectTypeOf<ExtractLiterals<CollapseLiterals<MixedLiteralUnion>>>().toBe<false>();
expectTypeOf<ExtractLiterals<CollapseLiterals<Theme | ThemeObject>>>().toBe<never>();
expectTypeOf<CollapseLiterals<CollapseLiterals<Theme | ThemeObject | null>>>().toBe<string | ThemeObject | null>();
expectTypeOf<CollapseLiterals<CollapseLiterals<TaggedTheme>>>().toBe<Tagged<string, 'Theme'> | Tagged<'auto' | 'dark', 'Theme'>>();
expectTypeOf<CollapseLiterals<CollapseLiterals<LiteralUnion<'a', string> | {theme?: string}>>>().toBe<string | {theme?: string}>();

// Collapsing only normalizes, so the accepted values do not change
expectTypeOf<Theme>().toBeAssignableTo<CollapseLiterals<Theme>>();
expectTypeOf<CollapseLiterals<Theme>>().toBeAssignableTo<Theme>();
expectTypeOf<CollapseLiterals<TaggedTheme>>().toBeAssignableTo<TaggedTheme>();

// Narrow bases still reject values outside their pattern or primitive family
expectTypeOf<1.5>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<'1', `${number}`>>>();
expectTypeOf<'1.5'>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<'auto', `${bigint}`>>>();
expectTypeOf<'dark'>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<'AUTO', Uppercase<string>>>>();
expectTypeOf<'1em'>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<'auto', `${number}px`>>>();
expectTypeOf<number>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<0n, bigint>>>();
expectTypeOf<bigint>().not.toBeAssignableTo<CollapseLiterals<LiteralUnion<0, number>>>();
expectTypeOf<typeof symbolLiteral2>().not.toBeAssignableTo<CollapseLiterals<typeof symbolLiteral1>>();
expectTypeOf<null>().not.toBeAssignableTo<CollapseLiterals<Theme | {}>>();
expectTypeOf<undefined>().not.toBeAssignableTo<CollapseLiterals<Theme | object>>();
expectTypeOf<string>().not.toBeAssignableTo<CollapseLiterals<BrandedTheme>>();
expectTypeOf<number>().not.toBeAssignableTo<CollapseLiterals<BrandedSize>>();
expectTypeOf<symbol>().not.toBeAssignableTo<CollapseLiterals<BrandedSymbol>>();
expectTypeOf<Tagged<Theme, 'OtherTheme'>>().not.toBeAssignableTo<CollapseLiterals<TaggedTheme>>();

// Normalizing primitives must preserve non-nullable non-primitive members
expectTypeOf<CollapseLiterals<NonNullable<void>>>().toBe<NonNullable<void>>();
expectTypeOf<undefined>().not.toBeAssignableTo<CollapseLiterals<NonNullable<void>>>();
expectTypeOf<CollapseLiterals<Theme | NonNullable<void>>>().toBe<string | NonNullable<void>>();

function _collapsedStringConstraint<Value extends string>(value: CollapseLiterals<Value>): string {
	return value;
}

function _collapsedNumberConstraint<Value extends number>(value: CollapseLiterals<Value>): number {
	return value;
}

function _collapsedObjectConstraint<Value extends object>(value: CollapseLiterals<Value>): object {
	return value;
}

function _collapsedNullishConstraint<Value extends null | undefined>(value: CollapseLiterals<Value>): null | undefined {
	return value;
}

// Invalid usage
// @ts-expect-error
type MissingArgument = CollapseLiterals;
