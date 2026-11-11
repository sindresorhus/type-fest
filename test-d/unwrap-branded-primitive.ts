import {expectTypeOf} from 'nz';
import type {Flavor, Opaque, Tagged, UnwrapBrandedPrimitive} from '../index.d.ts';

type Brand = {readonly __brand: unique symbol};
declare const symbolLiteral: unique symbol;

// Non-literals
expectTypeOf<UnwrapBrandedPrimitive<string & Brand>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<number & Brand>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<bigint & Brand>>().toBe<bigint>();
expectTypeOf<UnwrapBrandedPrimitive<symbol & Brand>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<boolean & Brand>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<`on${string}` & Brand>>().toBe<`on${string}`>();
expectTypeOf<UnwrapBrandedPrimitive<`on${string}` & {}>>().toBe<`on${string}`>();

// Literals
expectTypeOf<UnwrapBrandedPrimitive<'foo' & Brand>>().toBe<'foo'>();
expectTypeOf<UnwrapBrandedPrimitive<1 & Brand>>().toBe<1>();
expectTypeOf<UnwrapBrandedPrimitive<100n & Brand>>().toBe<100n>();
expectTypeOf<UnwrapBrandedPrimitive<typeof symbolLiteral & Brand>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<true & Brand>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<false & Brand>>().toBe<false>();

// Non-branded types
expectTypeOf<UnwrapBrandedPrimitive<string>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<number>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<bigint>>().toBe<bigint>();
expectTypeOf<UnwrapBrandedPrimitive<symbol>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<boolean>>().toBe<boolean>();

expectTypeOf<UnwrapBrandedPrimitive<'foo'>>().toBe<'foo'>();
expectTypeOf<UnwrapBrandedPrimitive<1>>().toBe<1>();
expectTypeOf<UnwrapBrandedPrimitive<100n>>().toBe<100n>();
expectTypeOf<UnwrapBrandedPrimitive<typeof symbolLiteral>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<true>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<false>>().toBe<false>();

// Non-primitives, `null` & `undefined`
expectTypeOf<UnwrapBrandedPrimitive<object>>().toBe<object>();
expectTypeOf<UnwrapBrandedPrimitive<{foo: string}>>().toBe<{foo: string}>();
expectTypeOf<UnwrapBrandedPrimitive<(() => string) & Brand>>().toBe<(() => string) & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<null>>().toBe<null>();
expectTypeOf<UnwrapBrandedPrimitive<undefined>>().toBe<undefined>();

// Unions
// All non-literals
expectTypeOf<UnwrapBrandedPrimitive<PropertyKey & Brand>>().toBe<PropertyKey>();
expectTypeOf<UnwrapBrandedPrimitive<(number | bigint) & Brand>>().toBe<number | bigint>();
expectTypeOf<UnwrapBrandedPrimitive<(string | number | bigint | symbol | boolean) & Brand>>().toBe<string | number | bigint | symbol | boolean>();

// All literals
expectTypeOf<UnwrapBrandedPrimitive<('a' | 'b') & Brand>>().toBe<'a' | 'b'>();
expectTypeOf<UnwrapBrandedPrimitive<(1 | 2 | 3 | 4 | 5) & Brand>>().toBe<1 | 2 | 3 | 4 | 5>();
expectTypeOf<UnwrapBrandedPrimitive<('foo' | 1 | 100n | typeof symbolLiteral | true) & Brand>>().toBe<('foo' | 1 | 100n | typeof symbolLiteral | true)>();

// Mix of non-literals and literals
expectTypeOf<UnwrapBrandedPrimitive<(Uppercase<string> | 'foo' | 'bar') & Brand>>().toBe<Uppercase<string> | 'foo' | 'bar'>();
expectTypeOf<UnwrapBrandedPrimitive<(100 | 200 | 300 | bigint) & Brand>>().toBe<100 | 200 | 300 | bigint>();
expectTypeOf<UnwrapBrandedPrimitive<(string | number | 5000n | typeof symbolLiteral) & Brand>>().toBe<(string | number | 5000n | typeof symbolLiteral)>();
expectTypeOf<UnwrapBrandedPrimitive<('foo' | 0.5 | bigint | symbol | boolean) & Brand>>().toBe<('foo' | 0.5 | bigint | symbol | boolean)>();

// Mix of non-literals, literals, and non-primitives
expectTypeOf<UnwrapBrandedPrimitive<(string | number | {foo: string}) & Brand>>().toBe<(string | number | ({foo: string} & Brand))>();
type MixedValues = 'foo' | number | 100n | typeof symbolLiteral | boolean | {foo: string};
expectTypeOf<UnwrapBrandedPrimitive<MixedValues & Brand>>().toBe<'foo' | number | 100n | typeof symbolLiteral | boolean | ({foo: string} & Brand)>();

// Types built using `Opaque`
expectTypeOf<UnwrapBrandedPrimitive<Opaque<string | number | bigint | symbol | boolean, 'Tag'>>>().toBe<string | number | bigint | symbol | boolean>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<'foo' | 1 | 100n | typeof symbolLiteral | true, 'Tag'>>>().toBe<'foo' | 1 | 100n | typeof symbolLiteral | true>();

// Types built using `Tagged`
expectTypeOf<UnwrapBrandedPrimitive<Tagged<string | number | bigint | symbol | boolean, 'Tag'>>>().toBe<string | number | bigint | symbol | boolean>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'foo' | 1 | 100n | typeof symbolLiteral | true, 'Tag'>>>().toBe<'foo' | 1 | 100n | typeof symbolLiteral | true>();

// Mix
expectTypeOf<UnwrapBrandedPrimitive<
		| ((string | number) & Brand)
		| Tagged<900n | typeof symbolLiteral, 'Tag'>
		| Opaque<true, 'Tag'>
		| {foo: string}
>>().toBe<string | number | 900n | typeof symbolLiteral | true | {foo: string}>();

// Edge cases
expectTypeOf<UnwrapBrandedPrimitive<any>>().toBe<any>();
expectTypeOf<UnwrapBrandedPrimitive<never>>().toBe<never>();

// Repeated tags must not prevent recovering the primitive base type.
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'ab', 'Text'>, 'Validated'>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<number, 'Value'>, 'Validated'>>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<100n, 'Value'>, 'Validated'>>>().toBe<100n>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<typeof symbolLiteral, 'Value'>, 'Validated'>>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<true, 'Value'>, 'Validated'>>>().toBe<true>();

// Library tags can be combined with another primitive brand.
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'ab' & Brand, 'Text'>, 'Validated'>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'ab', 'Text'>, 'Validated'> & Brand>>().toBe<'ab'>();

// Multi-key layers, metadata, and repeated tags all recover the same base.
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'ab', 'Text', {encoding: 'utf8'}>, 'Validated' | 'Stored', Date>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'ab', 'Text'>, 'Text'>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<string, 'Text'>, 'Validated'>>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<boolean, 'Flag'>, 'Validated'>>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<Uppercase<string>, 'Text'>, 'Validated'>>>().toBe<Uppercase<string>>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<`prefix${string}`, 'Text'>, 'Validated'>>>().toBe<`prefix${string}`>();

// Unwrapping distributes over base unions and independently tagged union members.
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'ab' | 1 | 100n | typeof symbolLiteral | true, 'Value'>, 'Validated'>>>().toBe<'ab' | 1 | 100n | typeof symbolLiteral | true>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'ab', 'Text'>, 'Validated'> | Tagged<Tagged<1, 'Number'>, 'Stored'> | undefined>>().toBe<'ab' | 1 | undefined>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<Tagged<'ab', 'Text'>, {Validated: true}>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Opaque<'ab', {Text: true}>, 'Validated'>>>().toBe<'ab'>();

// Only primitive brands are removed; structured values keep their original tags.
type TaggedObject = Tagged<Tagged<{readonly value: string; optional?: number}, 'Value'>, 'Validated'>;
type TaggedFunction = Tagged<Tagged<() => string, 'Value'>, 'Validated'>;
expectTypeOf<UnwrapBrandedPrimitive<TaggedObject>>().toBe<TaggedObject>();
expectTypeOf<UnwrapBrandedPrimitive<TaggedFunction>>().toBe<TaggedFunction>();
expectTypeOf<UnwrapBrandedPrimitive<unknown>>().toBe<unknown>();

// A value can pass through many independently tagged stages.
type ManyTags = Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<'ab', 'A'>, 'B'>, 'C'>, 'D'>, 'E'>, 'F'>, 'G'>, 'H'>, 'I'>, 'J'>, 'K'>, 'L'>;
expectTypeOf<UnwrapBrandedPrimitive<ManyTags>>().toBe<'ab'>();

// A required string marker can carry a literal, structured metadata, or an unknown value.
type AccountMarker = {readonly account: 'AccountId'};
type ValidatedMarker = {validated: {rule: 'nonempty'; version: 1}};
expectTypeOf<UnwrapBrandedPrimitive<string & AccountMarker>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<'account:42' & AccountMarker>>().toBe<'account:42'>();
expectTypeOf<UnwrapBrandedPrimitive<number & ValidatedMarker>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<42 & ValidatedMarker>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<string & {metadata: unknown}>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<boolean & {metadata: {checked: true}}>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<string & {validate(): true}>>().toBe<string>();

// Multiple required properties in one marker object are removed together.
type GroupedMarkers = {readonly source: 'database'; validated: true; metadata: {version: 1}};
expectTypeOf<UnwrapBrandedPrimitive<string & GroupedMarkers>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<10 & GroupedMarkers>>().toBe<10>();
expectTypeOf<UnwrapBrandedPrimitive<bigint & GroupedMarkers>>().toBe<bigint>();
expectTypeOf<UnwrapBrandedPrimitive<false & GroupedMarkers>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<typeof symbolLiteral & GroupedMarkers>>().toBe<typeof symbolLiteral>();

// Marker symbols are independent of symbol-valued primitive bases.
declare const markerSymbol: unique symbol;
declare const otherMarkerSymbol: unique symbol;
declare const otherSymbolLiteral: unique symbol;
type SymbolMarker = {readonly [markerSymbol]: 'identifier'};
type GroupedSymbolMarkers = {readonly [markerSymbol]: 'first'; readonly [otherMarkerSymbol]: 'second'};
expectTypeOf<UnwrapBrandedPrimitive<string & SymbolMarker>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<123 & SymbolMarker>>().toBe<123>();
expectTypeOf<UnwrapBrandedPrimitive<symbol & SymbolMarker>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<typeof symbolLiteral & SymbolMarker>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<typeof otherSymbolLiteral & GroupedSymbolMarkers>>().toBe<typeof otherSymbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<typeof Symbol.iterator & SymbolMarker>>().toBe<typeof Symbol.iterator>();

// Literal preservation includes empty strings, numeric strings, signed numbers, and zero bigints.
expectTypeOf<UnwrapBrandedPrimitive<'' & Brand>>().toBe<''>();
expectTypeOf<UnwrapBrandedPrimitive<'0' & Brand>>().toBe<'0'>();
expectTypeOf<UnwrapBrandedPrimitive<'café' & Brand>>().toBe<'café'>();
expectTypeOf<UnwrapBrandedPrimitive<0 & Brand>>().toBe<0>();
expectTypeOf<UnwrapBrandedPrimitive<-42 & Brand>>().toBe<-42>();
expectTypeOf<UnwrapBrandedPrimitive<0.5 & Brand>>().toBe<0.5>();
expectTypeOf<UnwrapBrandedPrimitive<0n & Brand>>().toBe<0n>();
expectTypeOf<UnwrapBrandedPrimitive<-42n & Brand>>().toBe<-42n>();

// Template domains and string intrinsics keep their constraints instead of widening to `string`.
expectTypeOf<UnwrapBrandedPrimitive<`account:${number}` & Brand>>().toBe<`account:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<`${bigint}` & Brand>>().toBe<`${bigint}`>();
expectTypeOf<UnwrapBrandedPrimitive<`${'http' | 'https'}://${string}` & Brand>>().toBe<`${'http' | 'https'}://${string}`>();
expectTypeOf<UnwrapBrandedPrimitive<Lowercase<string> & Brand>>().toBe<Lowercase<string>>();
expectTypeOf<UnwrapBrandedPrimitive<Capitalize<string> & Brand>>().toBe<Capitalize<string>>();
expectTypeOf<UnwrapBrandedPrimitive<Uncapitalize<string> & Brand>>().toBe<Uncapitalize<string>>();
expectTypeOf<UnwrapBrandedPrimitive<`on${Capitalize<string>}` & Brand>>().toBe<`on${Capitalize<string>}`>();
expectTypeOf<UnwrapBrandedPrimitive<Uppercase<`item-${string}`> & Brand>>().toBe<Uppercase<`item-${string}`>>();

// Unbranded constrained primitives also pass through unchanged.
expectTypeOf<UnwrapBrandedPrimitive<`account:${number}`>>().toBe<`account:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<Lowercase<string>>>().toBe<Lowercase<string>>();
expectTypeOf<UnwrapBrandedPrimitive<Capitalize<string>>>().toBe<Capitalize<string>>();
expectTypeOf<UnwrapBrandedPrimitive<Uncapitalize<string>>>().toBe<Uncapitalize<string>>();

// Independently branded members lose their markers without losing primitive distinctions.
type IndependentlyBranded = ('id' & AccountMarker) | (42 & ValidatedMarker) | (false & SymbolMarker);
expectTypeOf<UnwrapBrandedPrimitive<IndependentlyBranded>>().toBe<'id' | 42 | false>();
expectTypeOf<UnwrapBrandedPrimitive<('a' & Brand) | ('b' & AccountMarker)>>().toBe<'a' | 'b'>();
expectTypeOf<UnwrapBrandedPrimitive<(1 & Brand) | (2n & AccountMarker)>>().toBe<1 | 2n>();
expectTypeOf<UnwrapBrandedPrimitive<(typeof symbolLiteral & Brand) | (typeof otherSymbolLiteral & SymbolMarker)>>().toBe<typeof symbolLiteral | typeof otherSymbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<('branded' & Brand) | 'plain'>>().toBe<'branded' | 'plain'>();
expectTypeOf<UnwrapBrandedPrimitive<('branded' & Brand) | string>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<(1 & Brand) | number>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<('value' & Brand) | null | undefined>>().toBe<'value' | null | undefined>();

// Metadata and tag names do not change the primitive that is recovered.
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'ready', 'State', {version: 1}>>>().toBe<'ready'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<false, 'Flag', unknown>>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<symbol, typeof markerSymbol, {source: 'registry'}>>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<1n, 100, {scale: 2}>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'item', 'Parsed' | 'Stored', {version: 1}>>>().toBe<'item'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<false, 'Parsed'>, 'Stored'>>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<bigint, 'Parsed'>, 'Stored'>>>().toBe<bigint>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<symbol, 'Parsed'>, 'Stored'>>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<`id:${number}`, 'Parsed'>, 'Stored'>>>().toBe<`id:${number}`>();

// Opaque tokens can contain arbitrary metadata, and their values still retain literal precision.
expectTypeOf<UnwrapBrandedPrimitive<Opaque<'ready', {state: 'verified'}>>>().toBe<'ready'>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<false, typeof markerSymbol>>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<`id:${number}`, 'Identifier'>>>().toBe<`id:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<Lowercase<string>, {normalized: true}>>>().toBe<Lowercase<string>>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<Tagged<42, 'Parsed'>, {stored: true}>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Opaque<false, {checked: true}>, 'Stored'>>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'ready', 'State'> | Opaque<0, 'Count'> | (false & Brand)>>().toBe<'ready' | 0 | false>();

// Nonprimitive brands remain intact, including callable and constructable values.
type BrandedArray = string[] & Brand;
type BrandedReadonlyArray = readonly number[] & Brand;
type BrandedTuple = [string, number] & Brand;
type BrandedReadonlyTuple = readonly [1, 2] & Brand;
type BrandedConstructor = (new(name: string) => {name: string}) & Brand;
expectTypeOf<UnwrapBrandedPrimitive<BrandedArray>>().toBe<BrandedArray>();
expectTypeOf<UnwrapBrandedPrimitive<BrandedReadonlyArray>>().toBe<BrandedReadonlyArray>();
expectTypeOf<UnwrapBrandedPrimitive<BrandedTuple>>().toBe<BrandedTuple>();
expectTypeOf<UnwrapBrandedPrimitive<BrandedReadonlyTuple>>().toBe<BrandedReadonlyTuple>();
expectTypeOf<UnwrapBrandedPrimitive<BrandedConstructor>>().toBe<BrandedConstructor>();
expectTypeOf<UnwrapBrandedPrimitive<Date & Brand>>().toBe<Date & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<RegExp & Brand>>().toBe<RegExp & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<Map<string, number> & Brand>>().toBe<Map<string, number> & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<Set<string> & Brand>>().toBe<Set<string> & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<Promise<string> & Brand>>().toBe<Promise<string> & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<readonly [1, 2], 'Point'>>>().toBe<Tagged<readonly [1, 2], 'Point'>>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<{value: string}, 'Object'>>>().toBe<Opaque<{value: string}, 'Object'>>();

// Boxed primitives are objects, so their brands also stay intact.
expectTypeOf<UnwrapBrandedPrimitive<InstanceType<StringConstructor> & Brand>>().toBe<InstanceType<StringConstructor> & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<InstanceType<NumberConstructor> & Brand>>().toBe<InstanceType<NumberConstructor> & Brand>();
expectTypeOf<UnwrapBrandedPrimitive<InstanceType<BooleanConstructor> & Brand>>().toBe<InstanceType<BooleanConstructor> & Brand>();

// Unwrapping one level does not remove brands from contained values.
type AccountId = string & AccountMarker;
type Account = {readonly id: AccountId; parent?: AccountId};
expectTypeOf<UnwrapBrandedPrimitive<Account>>().toBe<Account>();
expectTypeOf<UnwrapBrandedPrimitive<AccountId[]>>().toBe<AccountId[]>();
expectTypeOf<UnwrapBrandedPrimitive<readonly [AccountId, AccountId?]>>().toBe<readonly [AccountId, AccountId?]>();
expectTypeOf<UnwrapBrandedPrimitive<Promise<AccountId>>>().toBe<Promise<AccountId>>();
expectTypeOf<UnwrapBrandedPrimitive<() => AccountId>>().toBe<() => AccountId>();
expectTypeOf<UnwrapBrandedPrimitive<Array<AccountId & {name: 'unused'}>>>().toBe<Array<AccountId & {name: 'unused'}>>();
expectTypeOf<UnwrapBrandedPrimitive<AccountId | Account>>().toBe<string | Account>();
expectTypeOf<UnwrapBrandedPrimitive<(42 & Brand) | BrandedArray>>().toBe<42 | BrandedArray>();

// Key positions become usable with their unbranded string, number, and symbol literals.
type AccountKind = ('personal' | 'business') & AccountMarker;
type AccountBalances = Record<UnwrapBrandedPrimitive<AccountKind>, number>;
expectTypeOf<AccountBalances>().toBe<{personal: number; business: number}>();
expectTypeOf<AccountBalances['personal']>().toBe<number>();
expectTypeOf<keyof AccountBalances>().toBe<'personal' | 'business'>();
expectTypeOf<Record<UnwrapBrandedPrimitive<(1 | 2) & Brand>, boolean>>().toBe<{1: boolean; 2: boolean}>();
expectTypeOf<Record<UnwrapBrandedPrimitive<typeof symbolLiteral & Brand>, number>>().toBe<{[symbolLiteral]: number}>();
expectTypeOf<Record<UnwrapBrandedPrimitive<Tagged<'read' | 'write', 'Permission'>>, boolean>>().toBe<{read: boolean; write: boolean}>();
expectTypeOf<Record<UnwrapBrandedPrimitive<Opaque<0 | 1, 'Index'>>, string>>().toBe<{0: string; 1: string}>();
expectTypeOf<Pick<{personal: 1; business: 2; shared: 3}, UnwrapBrandedPrimitive<AccountKind>>>().toBe<{personal: 1; business: 2}>();

// Mapped tuples can unwrap each element explicitly while retaining their shape and modifiers.
type UnwrappedTuple<Tuple extends readonly unknown[]> = {[Index in keyof Tuple]: UnwrapBrandedPrimitive<Tuple[Index]>};
expectTypeOf<UnwrappedTuple<[AccountId, Tagged<1, 'Count'>, Opaque<false, 'Flag'>]>>().toBe<[string, 1, false]>();
expectTypeOf<UnwrappedTuple<readonly [AccountId, (number & Brand)?]>>().toBe<readonly [string, number?]>();
expectTypeOf<UnwrappedTuple<[AccountId, ...Array<number & Brand>]>>().toBe<[string, ...number[]]>();
expectTypeOf<UnwrappedTuple<AccountId[]>>().toBe<string[]>();
expectTypeOf<UnwrappedTuple<[]>>().toBe<[]>();
expectTypeOf<UnwrappedTuple<[Account, null, undefined]>>().toBe<[Account, null, undefined]>();

// Existing type operators can unwrap return values and individual parameter types.
type FindAccount = (id: AccountId) => Tagged<42, 'Balance'> | undefined;
expectTypeOf<UnwrapBrandedPrimitive<ReturnType<FindAccount>>>().toBe<42 | undefined>();
expectTypeOf<UnwrapBrandedPrimitive<Parameters<FindAccount>[0]>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<Awaited<Promise<Opaque<1n, 'Counter'>>>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<Account['id']>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<Account['parent']>>().toBe<string | undefined>();
expectTypeOf<UnwrapBrandedPrimitive<UnwrapBrandedPrimitive<IndependentlyBranded>>>().toBe<'id' | 42 | false>();

// Unconstrained and keyless inputs retain their identity.
expectTypeOf<UnwrapBrandedPrimitive<void>>().toBe<void>();
expectTypeOf<UnwrapBrandedPrimitive<{}>>().toBe<{}>();
expectTypeOf<UnwrapBrandedPrimitive<Brand>>().toBe<Brand>();
expectTypeOf<UnwrapBrandedPrimitive<readonly []>>().toBe<readonly []>();
expectTypeOf<UnwrapBrandedPrimitive<unknown | AccountId>>().toBe<unknown>();
expectTypeOf<UnwrapBrandedPrimitive<any | AccountId>>().toBe<any>();
expectTypeOf<UnwrapBrandedPrimitive<never | AccountId>>().toBe<string>();

// A single optional marker, including `Flavor`, is removed from each primitive kind.
expectTypeOf<UnwrapBrandedPrimitive<Flavor<string, 'Identifier'>>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<42, 'Count'>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<100n, 'Counter'>>>().toBe<100n>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<false, 'Flag'>>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<typeof symbolLiteral, 'Token'>>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<('ready' | 1) & {brand?: 'Checked'}>>().toBe<'ready' | 1>();
expectTypeOf<UnwrapBrandedPrimitive<`id:${number}` & {required: 'Id'; optional?: 'Checked'}>>().toBe<`id:${number}`>();

// The documentation examples preserve the finite key union for records.
type Status = ('draft' | 'published') & {readonly __brand: 'Status'};
expectTypeOf<UnwrapBrandedPrimitive<Status>>().toBe<'draft' | 'published'>();
expectTypeOf<Record<UnwrapBrandedPrimitive<Status>, number>>().toBe<{draft: number; published: number}>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<string, 'UserId'>>>().toBe<string>();
const statusCounts: Record<UnwrapBrandedPrimitive<Status>, number> = {draft: 1, published: 2};
expectTypeOf(statusCounts.draft).toBe<number>();
expectTypeOf<{draft: number}>().not.toBeAssignableTo<typeof statusCounts>();
expectTypeOf<{draft: string; published: number}>().not.toBeAssignableTo<typeof statusCounts>();
expectTypeOf<'archived'>().not.toBeAssignableTo<UnwrapBrandedPrimitive<Status>>();

// @ts-expect-error The input type argument is required.
type MissingInput = UnwrapBrandedPrimitive;

// Optional marker properties work on broad primitives as well as individual literals.
type OptionalMarker = {readonly optionalBrand?: 'Identifier'};
expectTypeOf<UnwrapBrandedPrimitive<string & OptionalMarker>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<number & OptionalMarker>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<bigint & OptionalMarker>>().toBe<bigint>();
expectTypeOf<UnwrapBrandedPrimitive<boolean & OptionalMarker>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<symbol & OptionalMarker>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<'' & OptionalMarker>>().toBe<''>();
expectTypeOf<UnwrapBrandedPrimitive<0 & OptionalMarker>>().toBe<0>();
expectTypeOf<UnwrapBrandedPrimitive<0n & OptionalMarker>>().toBe<0n>();
expectTypeOf<UnwrapBrandedPrimitive<true & OptionalMarker>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<false & OptionalMarker>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<typeof symbolLiteral & OptionalMarker>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<Uppercase<string> & OptionalMarker>>().toBe<Uppercase<string>>();
expectTypeOf<UnwrapBrandedPrimitive<`item:${bigint}` & OptionalMarker>>().toBe<`item:${bigint}`>();
expectTypeOf<UnwrapBrandedPrimitive<PropertyKey & OptionalMarker>>().toBe<PropertyKey>();
expectTypeOf<UnwrapBrandedPrimitive<('a' | 0 | false) & OptionalMarker>>().toBe<'a' | 0 | false>();
expectTypeOf<UnwrapBrandedPrimitive<string & {marker?: never}>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<1 & {marker?: undefined}>>().toBe<1>();
expectTypeOf<UnwrapBrandedPrimitive<true & {marker?: unknown}>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<symbol & {marker?: any}>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<1n & {readonly [markerSymbol]?: 'Counter'}>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<symbol & {readonly [markerSymbol]?: 'Token'}>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<string & Partial<GroupedMarkers>>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<42 & Partial<GroupedSymbolMarkers>>>().toBe<42>();

// A single marker object can be a named object type or a mapped type.
type IdentifierMarker = {
	readonly identifier: 'Identifier';
};
type VerifiedIdentifierMarker = {
	readonly identifier: 'Identifier';
	verified?: true;
};
type MixedMarkerKeys = {readonly label?: 'Id'; readonly [markerSymbol]: {source: 'api'}};
expectTypeOf<UnwrapBrandedPrimitive<'id' & IdentifierMarker>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<number & IdentifierMarker>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<42n & VerifiedIdentifierMarker>>().toBe<42n>();
expectTypeOf<UnwrapBrandedPrimitive<boolean & VerifiedIdentifierMarker>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<symbol & VerifiedIdentifierMarker>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<'id' & Readonly<GroupedMarkers>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<42 & Required<OptionalMarker>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<false & Pick<GroupedMarkers, 'source' | 'validated'>>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<1n & Omit<GroupedMarkers, 'metadata'>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<string & Record<'checked' | 'stored', true>>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<typeof symbolLiteral & MixedMarkerKeys>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<`id:${number}` & Partial<MixedMarkerKeys>>>().toBe<`id:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<42 & {marker: never}>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<'id' & {marker: undefined}>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<false & {marker: any}>>().toBe<false>();

// Marker values are metadata, so removing a marker does not inspect its contents.
type RecursiveMarker = {readonly marker: {next?: RecursiveMarker; value: AccountId}};
expectTypeOf<UnwrapBrandedPrimitive<string & RecursiveMarker>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<0 & {marker: AccountId}>>().toBe<0>();
expectTypeOf<UnwrapBrandedPrimitive<1n & {marker: Tagged<1n, 'Counter'>}>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<true & {marker: () => AccountId}>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<symbol & {marker: readonly AccountId[]}>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<'id' & {marker: {first: 1} | {second: 2}}>>().toBe<'id'>();

// Single tags accept empty or broad tag-name domains and any metadata type.
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'id', never>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<42, string>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<true, number>>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<1n, symbol>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<typeof symbolLiteral, PropertyKey>>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'id', 'Id', any>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<42, 'Count', unknown>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<1n, 'Counter', never>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<true, 'Flag', undefined>>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<symbol, 'Token', null>>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<`id:${number}`, 'Id', AccountId>>>().toBe<`id:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<boolean, 'Flag', RecursiveMarker>>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'id', typeof markerSymbol | 42 | 'Id', {version: 1}>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<never, 'Absent'>>>().toBe<never>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<any, 'Unchecked'>>>().toBe<any>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<unknown, 'Object'>>>().toBe<Tagged<unknown, 'Object'>>();

// Distinct nested tags can carry unrelated metadata without altering the primitive base.
type ValidatedText = Tagged<Tagged<'id', 'Parsed', {parser: 'json'}>, 'Validated', {rule: 'identifier'}>;
expectTypeOf<UnwrapBrandedPrimitive<ValidatedText>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<42, 'Parsed', any>, 'Validated', unknown>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<1n, 'Parsed', null>, 'Validated', undefined>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<true, 'Parsed', never>, 'Validated', any>>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<false, 0, string>, 1, number>>>().toBe<false>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<symbol, typeof markerSymbol, Date>, typeof otherMarkerSymbol, RegExp>>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<`id:${number}`, 'Parsed', 1>, 'Validated' | 'Stored', 2>>>().toBe<`id:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<ValidatedText, 'Stored', RecursiveMarker>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<'' & OptionalMarker, 'Parsed'>, 'Stored'>>>().toBe<''>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Tagged<42, 'Parsed'>, 'Stored'> & OptionalMarker>>().toBe<42>();

// A single flavor can have a union of names and can be combined with required tags.
expectTypeOf<UnwrapBrandedPrimitive<Flavor<number, 'Count'>>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<bigint, 'Counter'>>>().toBe<bigint>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<boolean, 'Flag'>>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<symbol, 'Token'>>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<'', 'Text'>>>().toBe<''>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<0, 'Count'>>>().toBe<0>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<true, 'Flag'>>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<`id:${number}`, 'Id' | 'Checked'>>>().toBe<`id:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<symbol, typeof markerSymbol>>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<1n, 42>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<never, 'Absent'>>>().toBe<never>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<any, 'Unchecked'>>>().toBe<any>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<unknown, 'Object'>>>().toBe<Flavor<unknown, 'Object'>>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Flavor<'id', 'Id'>, 'Checked'>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<Tagged<42, 'Checked'>, 'Count'>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<'id', 'Id'> | Tagged<0, 'Count'> | undefined>>().toBe<'id' | 0 | undefined>();

// Legacy opaque tokens are removed as one layer, without interpreting the token as a primitive base.
expectTypeOf<UnwrapBrandedPrimitive<Opaque<'id'>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<42, unknown>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<1n, any>>>().toBe<1n>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<true, null>>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<symbol, undefined>>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<'id', false>>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<number, 0>>>().toBe<number>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<boolean, {}>>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<`id:${number}`, RecursiveMarker>>>().toBe<`id:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<never, 'Absent'>>>().toBe<never>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<any, 'Unchecked'>>>().toBe<any>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<unknown, 'Object'>>>().toBe<Opaque<unknown, 'Object'>>();

// Unwrapping an enum removes only the marker and preserves enum-member identity.
enum Direction {
	Up = 'up',
	Down = 'down',
}
enum ResponseCode {
	Success = 200,
	Failure = 500,
}
enum MixedCode {
	Success = 1,
	Failure = 'failure',
}
expectTypeOf<UnwrapBrandedPrimitive<Direction>>().toBe<Direction>();
expectTypeOf<UnwrapBrandedPrimitive<Direction.Up>>().toBe<Direction.Up>();
expectTypeOf<UnwrapBrandedPrimitive<Direction & Brand>>().toBe<Direction.Up | Direction.Down>();
expectTypeOf<UnwrapBrandedPrimitive<Direction.Down & OptionalMarker>>().toBe<Direction.Down>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<Direction.Up, 'Direction'>>>().toBe<Direction.Up>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<Direction, 'Direction'>>>().toBe<Direction.Up | Direction.Down>();
expectTypeOf<UnwrapBrandedPrimitive<ResponseCode>>().toBe<ResponseCode>();
expectTypeOf<UnwrapBrandedPrimitive<ResponseCode.Success>>().toBe<ResponseCode.Success>();
expectTypeOf<UnwrapBrandedPrimitive<ResponseCode & Brand>>().toBe<ResponseCode.Success | ResponseCode.Failure>();
expectTypeOf<UnwrapBrandedPrimitive<ResponseCode.Failure & OptionalMarker>>().toBe<ResponseCode.Failure>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<ResponseCode.Success, 'ResponseCode'>>>().toBe<ResponseCode.Success>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<ResponseCode, 'ResponseCode'>>>().toBe<ResponseCode.Success | ResponseCode.Failure>();
expectTypeOf<UnwrapBrandedPrimitive<MixedCode & Brand>>().toBe<MixedCode.Success | MixedCode.Failure>();
expectTypeOf<UnwrapBrandedPrimitive<(Direction.Up | ResponseCode.Success) & SymbolMarker>>().toBe<Direction.Up | ResponseCode.Success>();
expectTypeOf<UnwrapBrandedPrimitive<Direction.Up & Brand>>().not.toBe<'up'>();
expectTypeOf<UnwrapBrandedPrimitive<ResponseCode.Success & Brand>>().not.toBe<200>();

// Distinct brands of the same value collapse, while unrelated and structured members survive.
expectTypeOf<UnwrapBrandedPrimitive<('id' & Brand) | ('id' & SymbolMarker)>>().toBe<'id'>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<42, 'Count'> | Flavor<42, 'Count'>>>().toBe<42>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<true, 'Flag'> | (true & OptionalMarker)>>().toBe<true>();
expectTypeOf<UnwrapBrandedPrimitive<('id' & Brand) | ('id' & SymbolMarker) | 'other'>>().toBe<'id' | 'other'>();
expectTypeOf<UnwrapBrandedPrimitive<(true & Brand) | false>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<(false & OptionalMarker) | true>>().toBe<boolean>();
expectTypeOf<UnwrapBrandedPrimitive<(1n & Brand) | bigint>>().toBe<bigint>();
expectTypeOf<UnwrapBrandedPrimitive<(typeof symbolLiteral & Brand) | symbol>>().toBe<symbol>();
expectTypeOf<UnwrapBrandedPrimitive<(`id:${number}` & Brand) | `id:${number}`>>().toBe<`id:${number}`>();
expectTypeOf<UnwrapBrandedPrimitive<(string & AccountMarker) | AccountMarker>>().toBe<string | AccountMarker>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<'id', 'Id'> | Tagged<Account, 'Id'>>>().toBe<'id' | Tagged<Account, 'Id'>>();
expectTypeOf<UnwrapBrandedPrimitive<(1 & Brand) | void>>().toBe<1 | void>();

// Structured values are returned unchanged, even when their keys and values are branded.
expectTypeOf<UnwrapBrandedPrimitive<Map<AccountId, Tagged<42, 'Count'>>>>().toBe<Map<AccountId, Tagged<42, 'Count'>>>();
expectTypeOf<UnwrapBrandedPrimitive<ReadonlyMap<AccountId, Account>>>().toBe<ReadonlyMap<AccountId, Account>>();
expectTypeOf<UnwrapBrandedPrimitive<Set<AccountId>>>().toBe<Set<AccountId>>();
expectTypeOf<UnwrapBrandedPrimitive<ReadonlySet<AccountId>>>().toBe<ReadonlySet<AccountId>>();
expectTypeOf<UnwrapBrandedPrimitive<WeakMap<Account, AccountId>>>().toBe<WeakMap<Account, AccountId>>();
expectTypeOf<UnwrapBrandedPrimitive<WeakSet<Account>>>().toBe<WeakSet<Account>>();
expectTypeOf<UnwrapBrandedPrimitive<PromiseLike<AccountId>>>().toBe<PromiseLike<AccountId>>();
expectTypeOf<UnwrapBrandedPrimitive<Iterable<AccountId>>>().toBe<Iterable<AccountId>>();
expectTypeOf<UnwrapBrandedPrimitive<Iterator<AccountId, Tagged<true, 'Done'>>>>().toBe<Iterator<AccountId, Tagged<true, 'Done'>>>();
expectTypeOf<UnwrapBrandedPrimitive<Record<AccountId, number>>>().toBe<Record<AccountId, number>>();
expectTypeOf<UnwrapBrandedPrimitive<OptionalMarker>>().toBe<OptionalMarker>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<AccountId[], 'Ids'>>>().toBe<Tagged<AccountId[], 'Ids'>>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<Account, 'Account'>>>().toBe<Flavor<Account, 'Account'>>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<() => AccountId, 'Lookup'>>>().toBe<Flavor<() => AccountId, 'Lookup'>>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<BrandedReadonlyTuple, 'Tuple'>>>().toBe<Opaque<BrandedReadonlyTuple, 'Tuple'>>();

// Generic key consumers can build records and template literals directly from the result.
type UnbrandedRecord<Key extends PropertyKey> = Record<UnwrapBrandedPrimitive<Key>, number>;
type UnbrandedEvent<Value extends string> = `on:${UnwrapBrandedPrimitive<Value>}`;
expectTypeOf<UnbrandedRecord<Status>>().toBe<{draft: number; published: number}>();
expectTypeOf<UnbrandedRecord<Tagged<1 | 2, 'Index'>>>().toBe<{1: number; 2: number}>();
expectTypeOf<UnbrandedRecord<typeof symbolLiteral & Brand>>().toBe<{[symbolLiteral]: number}>();
expectTypeOf<UnbrandedRecord<never>>().toBe<{}>();
expectTypeOf<UnbrandedEvent<'ready' & Brand>>().toBe<'on:ready'>();
expectTypeOf<UnbrandedEvent<Flavor<'ready' | 'stored', 'Event'>>>().toBe<'on:ready' | 'on:stored'>();
expectTypeOf<UnbrandedEvent<`item:${number}` & OptionalMarker>>().toBe<`on:item:${number}`>();
expectTypeOf<UnbrandedEvent<never>>().toBe<never>();

// Explicit property mapping keeps modifiers and does not recurse into structured properties.
type UnwrappedProperties<Value> = {[Key in keyof Value]: UnwrapBrandedPrimitive<Value[Key]>};
type BrandedFields = {readonly id: AccountId; count?: Tagged<42, 'Count'>; nested: Account; flag: Flavor<true, 'Flag'> | null};
type PlainFields = {readonly id: string; count?: 42; nested: Account; flag: true | null};
expectTypeOf<UnwrappedProperties<BrandedFields>>().toBe<PlainFields>();
expectTypeOf<UnwrappedProperties<Readonly<BrandedFields>>>().toBe<Readonly<PlainFields>>();
expectTypeOf<UnwrappedProperties<Required<BrandedFields>>>().toBe<Required<PlainFields>>();
expectTypeOf<UnwrappedProperties<Partial<BrandedFields>>>().toBe<Partial<PlainFields>>();
expectTypeOf<UnwrappedProperties<{[markerSymbol]: typeof symbolLiteral & Brand}>>().toBe<{[markerSymbol]: typeof symbolLiteral}>();
expectTypeOf<UnwrappedProperties<Record<string, Flavor<42, 'Count'>>>>().toBe<Record<string, 42>>();
expectTypeOf<UnwrappedProperties<{empty: never; unchecked: any; input: unknown}>>().toBe<{empty: never; unchecked: any; input: unknown}>();
expectTypeOf<UnwrappedProperties<Account>>().toBe<{readonly id: string; parent?: string}>();

// Finite key records accept all required keys and reject missing keys or incompatible values.
type MixedKeyRecord = Record<UnwrapBrandedPrimitive<('id' | 0 | typeof symbolLiteral) & Brand>, number>;
expectTypeOf<MixedKeyRecord>().toBe<{id: number; 0: number; [symbolLiteral]: number}>();
const mixedKeyRecord: MixedKeyRecord = {id: 1, 0: 2, [symbolLiteral]: 3};
expectTypeOf(mixedKeyRecord.id).toBe<number>();
expectTypeOf(mixedKeyRecord[0]).toBe<number>();
expectTypeOf(mixedKeyRecord[symbolLiteral]).toBe<number>();
expectTypeOf<{id: number; 0: number}>().not.toBeAssignableTo<MixedKeyRecord>();
expectTypeOf<{id: number; [symbolLiteral]: number}>().not.toBeAssignableTo<MixedKeyRecord>();
expectTypeOf<{0: number; [symbolLiteral]: number}>().not.toBeAssignableTo<MixedKeyRecord>();
expectTypeOf<{id: number; 0: string; [symbolLiteral]: number}>().not.toBeAssignableTo<MixedKeyRecord>();
expectTypeOf<{id: number; 0: number; [otherSymbolLiteral]: number}>().not.toBeAssignableTo<MixedKeyRecord>();
expectTypeOf<keyof MixedKeyRecord>().toBe<'id' | 0 | typeof symbolLiteral>();
expectTypeOf<'other'>().not.toBeAssignableTo<keyof MixedKeyRecord>();
expectTypeOf<1>().not.toBeAssignableTo<keyof MixedKeyRecord>();
expectTypeOf<typeof otherSymbolLiteral>().not.toBeAssignableTo<keyof MixedKeyRecord>();

// Removing a required brand does not make the plain result valid where a brand is still required.
expectTypeOf<UnwrapBrandedPrimitive<AccountId>>().not.toBeAssignableTo<AccountId>();
expectTypeOf<UnwrapBrandedPrimitive<Tagged<42, 'Count'>>>().not.toBeAssignableTo<Tagged<42, 'Count'>>();
expectTypeOf<UnwrapBrandedPrimitive<Opaque<true, 'Flag'>>>().not.toBeAssignableTo<Opaque<true, 'Flag'>>();
expectTypeOf<UnwrapBrandedPrimitive<typeof symbolLiteral & SymbolMarker>>().not.toBeAssignableTo<typeof symbolLiteral & SymbolMarker>();
expectTypeOf<AccountId>().toBeAssignableTo<UnwrapBrandedPrimitive<AccountId>>();
expectTypeOf<Flavor<'id', 'Id'>>().toBeAssignableTo<UnwrapBrandedPrimitive<Flavor<'id', 'Id'>>>();
expectTypeOf<UnwrapBrandedPrimitive<Flavor<'id', 'Id'>>>().toBeAssignableTo<Flavor<'id', 'Id'>>();
expectTypeOf<UnwrapBrandedPrimitive<BrandedFields>>().not.toBe<PlainFields>();

// Ordinary object operations can consume recovered keys without accepting unrelated keys.
type StatusMessages = {draft: 'Editing'; published: 'Live'; archived: 'Hidden'};
expectTypeOf<StatusMessages[UnwrapBrandedPrimitive<Status>]>().toBe<'Editing' | 'Live'>();
expectTypeOf<Omit<StatusMessages, UnwrapBrandedPrimitive<Status>>>().toBe<{archived: 'Hidden'}>();
expectTypeOf<Exclude<keyof StatusMessages, UnwrapBrandedPrimitive<Status>>>().toBe<'archived'>();
expectTypeOf<Extract<keyof StatusMessages, UnwrapBrandedPrimitive<Status>>>().toBe<'draft' | 'published'>();
expectTypeOf<Record<UnwrapBrandedPrimitive<Flavor<'draft' | 'published', 'Status'>>, number>>().toBe<{draft: number; published: number}>();
// @ts-expect-error The recovered literal union does not include this key.
const invalidStatusCounts: Record<UnwrapBrandedPrimitive<Status>, number> = {draft: 1, published: 2, archived: 3};
// @ts-expect-error All recovered keys are required.
const missingStatusCounts: Record<UnwrapBrandedPrimitive<Status>, number> = {draft: 1};
// @ts-expect-error The recovered numeric key does not permit a string value.
const invalidMixedKeyRecord: MixedKeyRecord = {id: 1, 0: 'two', [symbolLiteral]: 3};
// @ts-expect-error Other unique symbols do not name the recovered symbol key.
type InvalidSymbolIndex = MixedKeyRecord[typeof otherSymbolLiteral];
// @ts-expect-error Unwrapping retains the finite numeric key.
type InvalidNumberIndex = MixedKeyRecord[1];

// Metadata can be combined in one layer or kept under distinct tag names.
type CheckedUserId = Tagged<string, 'Checked', {parsed: true; validated: true}>;
type StoredUserId = Tagged<CheckedUserId, 'Stored', {table: 'users'}>;
expectTypeOf<UnwrapBrandedPrimitive<CheckedUserId>>().toBe<string>();
expectTypeOf<UnwrapBrandedPrimitive<StoredUserId>>().toBe<string>();
