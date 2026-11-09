import {expectTypeOf} from 'nz';
import type {RequireNone} from '../index.d.ts';

type NoneAllowed = RequireNone<'foo' | 'bar'>;

expectTypeOf<NoneAllowed>().toBe<{foo?: never; bar?: never}>();
expectTypeOf<keyof NoneAllowed>().toBe<'foo' | 'bar'>();
({}) satisfies NoneAllowed;
expectTypeOf<{foo: 'foo'}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{bar: 'bar'}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo: 'foo'; bar: 'bar'}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo: undefined}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo?: undefined}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo: null}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo: any}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo: unknown}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo?: string}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo?: never}>().toBeAssignableTo<NoneAllowed>();
expectTypeOf<NoneAllowed['foo' | 'bar']>().toBe<undefined>();

// A standalone type with only optional properties follows TypeScript's weak type checks.
expectTypeOf<{unrelated: string}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<null>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<undefined>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<unknown>().not.toBeAssignableTo<NoneAllowed>();

type SomeAllowed = Record<'bar', string> & RequireNone<'foo'>;

({bar: 'bar'}) satisfies SomeAllowed;
expectTypeOf<{foo: 'foo'}>().not.toBeAssignableTo<SomeAllowed>();
expectTypeOf<{foo: 'foo'; bar: 'bar'}>().not.toBeAssignableTo<SomeAllowed>();

// Forbidden properties are rejected on variables and spreads, beyond excess property checks.
const withForbiddenKey = {bar: 'bar', foo: 'foo'};
// @ts-expect-error The variable still has a forbidden key.
withForbiddenKey satisfies SomeAllowed;
// @ts-expect-error Object spread must not bypass the restriction.
({...withForbiddenKey}) satisfies SomeAllowed;
const withExtraKey = {bar: 'bar', extra: true};
withExtraKey satisfies SomeAllowed;

// Intersections preserve required, optional, and readonly properties.
type Options = {readonly url: string; timeout?: number} & RequireNone<'legacyMode' | 'callback'>;
({url: 'https://example.com'}) satisfies Options;
({url: 'https://example.com', timeout: 1000}) satisfies Options;
expectTypeOf<{}>().not.toBeAssignableTo<Options>();
expectTypeOf<{url: string; legacyMode: true}>().not.toBeAssignableTo<Options>();
expectTypeOf<{url: string; callback: () => void}>().not.toBeAssignableTo<Options>();
declare let options: Options;
// @ts-expect-error The existing readonly modifier is preserved.
options.url = 'https://example.org';
// @ts-expect-error Forbidden keys cannot be written, even as undefined.
options.legacyMode = undefined;
delete options.legacyMode;

// Intersecting forbids a property without removing an existing declaration of it.
type Conflicting = {legacyMode: boolean} & RequireNone<'legacyMode'>;
expectTypeOf<{}>().not.toBeAssignableTo<Conflicting>();
expectTypeOf<{legacyMode: true}>().not.toBeAssignableTo<Conflicting>();
type Replaced = Omit<{url: string; legacyMode: boolean}, 'legacyMode'> & RequireNone<'legacyMode'>;
({url: 'https://example.com'}) satisfies Replaced;

// Both branches remain usable, but a value with both keys is rejected even through a variable.
type Config =
	| ({filePath: string} & RequireNone<'content'>)
	| ({content: string} & RequireNone<'filePath'>);
({filePath: './config.json'}) satisfies Config;
({content: '{}'}) satisfies Config;
expectTypeOf<{}>().not.toBeAssignableTo<Config>();
const mixedConfig = {filePath: './config.json', content: '{}'};
// @ts-expect-error Both configuration branches cannot be supplied together.
mixedConfig satisfies Config;
expectTypeOf<{filePath: string; content: undefined}>().not.toBeAssignableTo<Config>();
declare const config: Config;
expectTypeOf(config.filePath).toBe<string | undefined>();
expectTypeOf(config.content).toBe<string | undefined>();

// Ordinary numeric keys and their string spellings refer to the same property.
expectTypeOf<RequireNone<0>>().toBe<{0?: never}>();
expectTypeOf<{'0': string}>().not.toBeAssignableTo<RequireNone<0>>();
expectTypeOf<{0: string}>().not.toBeAssignableTo<RequireNone<'0'>>();
expectTypeOf<{0: undefined}>().not.toBeAssignableTo<RequireNone<'0'>>();
expectTypeOf<{0: string}>().not.toBeAssignableTo<RequireNone<0 | '0'>>();

// Forbidden numeric and symbol keys cannot be supplied, even as explicit undefined.
declare const forbiddenSymbol: unique symbol;
expectTypeOf<RequireNone<0 | typeof forbiddenSymbol>>().toBe<{0?: never; [forbiddenSymbol]?: never}>();
expectTypeOf<{0: undefined}>().not.toBeAssignableTo<RequireNone<0>>();
expectTypeOf<{[forbiddenSymbol]: undefined}>().not.toBeAssignableTo<RequireNone<typeof forbiddenSymbol>>();
expectTypeOf<{[forbiddenSymbol]: string}>().not.toBeAssignableTo<RequireNone<typeof forbiddenSymbol>>();
expectTypeOf<{[Symbol.iterator]: () => Iterator<string>}>().not.toBeAssignableTo<RequireNone<typeof Symbol.iterator>>();
({}) satisfies RequireNone<'name' | 0 | typeof forbiddenSymbol>;
expectTypeOf<RequireNone<'name' | 0 | typeof forbiddenSymbol>>().toBe<{name?: never; 0?: never; [forbiddenSymbol]?: never}>();

// A finite template literal union forbids every generated key together.
type DeprecatedEvents = RequireNone<`on${'Click' | 'Focus'}`>;
expectTypeOf<DeprecatedEvents>().toBe<{onClick?: never; onFocus?: never}>();
expectTypeOf<{onClick: () => void}>().not.toBeAssignableTo<DeprecatedEvents>();
expectTypeOf<{onFocus: undefined}>().not.toBeAssignableTo<DeprecatedEvents>();

// Broad key domains produce index signatures, which allow undefined values.
expectTypeOf<RequireNone<string>>().toBe<{[key: string]: undefined}>();
expectTypeOf<RequireNone<number>>().toBe<{[key: number]: undefined}>();
expectTypeOf<RequireNone<symbol>>().toBe<{[key: symbol]: undefined}>();
({}) satisfies RequireNone<PropertyKey>;
({name: undefined, 0: undefined, [forbiddenSymbol]: undefined}) satisfies RequireNone<PropertyKey>;
expectTypeOf<{name: string}>().not.toBeAssignableTo<RequireNone<string>>();
expectTypeOf<{0: string}>().not.toBeAssignableTo<RequireNone<number>>();
expectTypeOf<{[forbiddenSymbol]: string}>().not.toBeAssignableTo<RequireNone<symbol>>();

// A broad domain does not forbid keys in another domain.
({name: 'Alice', 0: undefined}) satisfies {name: string} & RequireNone<number>;
({name: 'Alice', [forbiddenSymbol]: undefined}) satisfies {name: string} & RequireNone<symbol>;
({[forbiddenSymbol]: 'allowed'}) satisfies RequireNone<string>;

// Template literal patterns constrain only matching keys and share index signature behavior.
type NoDataAttributes = {id: string} & RequireNone<`data-${string}`>;
({id: 'button'}) satisfies NoDataAttributes;
({id: 'button', 'data-test': undefined}) satisfies NoDataAttributes;
expectTypeOf<{id: string; 'data-test': string}>().not.toBeAssignableTo<NoDataAttributes>();
const withAriaAttribute = {id: 'button', 'aria-label': 'Submit'};
withAriaAttribute satisfies NoDataAttributes;

// An empty key union adds no constraints and does not mean a strictly empty object.
expectTypeOf<RequireNone<never>>().toBe<{}>();
expectTypeOf<{value: string}>().toBeAssignableTo<RequireNone<never>>();
expectTypeOf<number>().toBeAssignableTo<RequireNone<never>>();
expectTypeOf<{value: string}>().toBeAssignableTo<{value: string} & RequireNone<never>>();
({}) satisfies RequireNone<any>;
({value: undefined}) satisfies RequireNone<any>;
expectTypeOf<{value: string}>().not.toBeAssignableTo<RequireNone<any>>();
// @ts-expect-error Forbidden keys must be property keys.
type UnknownForbiddenKey = RequireNone<unknown>;
// @ts-expect-error Objects are not property keys.
type ObjectForbiddenKey = RequireNone<{name: string}>;
// @ts-expect-error A union containing a non-key is invalid.
type InvalidForbiddenKeyUnion = RequireNone<'name' | undefined>;

function _createNoKeys<Key extends PropertyKey>(): RequireNone<Key> {
	return {};
}

function _readForbiddenKey<Key extends PropertyKey>(value: RequireNone<Key>, key: Key): undefined {
	return value[key];
}
