import {expectTypeOf} from 'nz';
import type {DefaultsFor, Except, SetOptional} from '../index.d.ts';

type Options = {
	url: string;
	retries?: number;
	timeout?: number | undefined;
	signal?: AbortSignal | undefined;
};

// Makes the optional keys required and leaves out the required keys.
expectTypeOf<DefaultsFor<{a: number; b?: string; c?: boolean}>>().toBe<{b: string; c: boolean}>();
expectTypeOf<DefaultsFor<Options>>().toBe<{retries: number; timeout: number; signal: AbortSignal}>();

// Removes `undefined`, since an `undefined` default is the same as having none.
expectTypeOf<DefaultsFor<{a?: number | undefined}>>().toBe<{a: number}>();
expectTypeOf<DefaultsFor<{a?: string | null | undefined}>>().toBe<{a: string | null}>();
expectTypeOf<DefaultsFor<{a?: undefined}>>().toBe<{a: never}>();

// Only removes `undefined` from the option itself, not from the types inside it.
expectTypeOf<DefaultsFor<{a?: Array<string | undefined>; b?: {c: number | undefined}}>>().toBe<{a: Array<string | undefined>; b: {c: number | undefined}}>();

// A required key that accepts `undefined` is still left out.
expectTypeOf<DefaultsFor<{a: number | undefined; b?: string}>>().toBe<{b: string}>();

// Use `Except` to leave out the options that have no default.
expectTypeOf<DefaultsFor<Except<Options, 'signal'>>>().toBe<{retries: number; timeout: number}>();

// Gives an empty object when there is no optional key.
expectTypeOf<DefaultsFor<{a: number; b: string}>>().toBe<{}>();
expectTypeOf<DefaultsFor<{}>>().toBe<{}>();

// Keeps the value type of each option.
expectTypeOf<DefaultsFor<{a?: 'one' | 'two'; b?: (value: number) => string; c?: {nested?: number}}>>().toBe<{a: 'one' | 'two'; b: (value: number) => string; c: {nested?: number}}>();
expectTypeOf<DefaultsFor<{a?: unknown; b?: any; c: unknown}>>().toBe<{a: unknown; b: any}>();

// Works with optional methods.
expectTypeOf<DefaultsFor<{run?(value: number): void}>>().toBe<{run(value: number): void}>();

// Works with other types that change the optional keys.
expectTypeOf<DefaultsFor<Partial<{a: number; b: string}>>>().toBe<{a: number; b: string}>();
expectTypeOf<DefaultsFor<Required<Options>>>().toBe<{}>();
expectTypeOf<DefaultsFor<SetOptional<{a: number; b: string}, 'a'>>>().toBe<{a: number}>();

// Works with intersections.
expectTypeOf<DefaultsFor<{a: number; b?: string} & {c?: boolean}>>().toBe<{b: string; c: boolean}>();
expectTypeOf<DefaultsFor<{a?: number} & {a: number}>>().toBe<{}>();
expectTypeOf<DefaultsFor<({a?: number} | {b?: string}) & {c?: boolean}>>().toBe<{a: number; c: boolean} | {b: string; c: boolean}>();

// Preserves readonly modifier.
expectTypeOf<DefaultsFor<{readonly a?: number; b?: string; readonly c: boolean}>>().toBe<{readonly a: number; b: string}>();

// Works with interfaces.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InterfaceOptions {
	name: string;
	verbose?: boolean;
}
expectTypeOf<DefaultsFor<InterfaceOptions>>().toBe<{verbose: boolean}>();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ExtendedInterfaceOptions extends InterfaceOptions {
	retries?: number;
}
expectTypeOf<DefaultsFor<ExtendedInterfaceOptions>>().toBe<{verbose: boolean; retries: number}>();

// Works with classes.
class ClassOptions {
	name = '';
	verbose?: boolean;
}
expectTypeOf<DefaultsFor<ClassOptions>>().toBe<{verbose: boolean}>();

// Works with number and symbol keys.
declare const symbol: unique symbol;
expectTypeOf<DefaultsFor<{0?: string; 1: number; [symbol]?: boolean}>>().toBe<{0: string; [symbol]: boolean}>();

// Works with enum keys.
enum OptionKey {
	Retries = 'retries',
	Url = 'url',
}
expectTypeOf<DefaultsFor<{[OptionKey.Retries]?: number; [OptionKey.Url]: string}>>().toBe<{[OptionKey.Retries]: number}>();

// Leaves out call signatures, since they are not keys.
expectTypeOf<DefaultsFor<{(value: number): void; a?: number}>>().toBe<{a: number}>();

// Leaves out index signatures, since they are not optional keys.
expectTypeOf<DefaultsFor<{[key: string]: number | undefined; a?: number}>>().toBe<{a: number}>();
expectTypeOf<DefaultsFor<{[key: `data-${string}`]: string; a?: number}>>().toBe<{a: number}>();
expectTypeOf<DefaultsFor<Record<string, number>>>().toBe<{}>();

// Works with unions, with the defaults of each member.
expectTypeOf<DefaultsFor<{type: 'file'; encoding?: string} | {type: 'url'; timeout?: number}>>().toBe<{encoding: string} | {timeout: number}>();
expectTypeOf<DefaultsFor<{a?: number; b: string} | {a: number; b?: string}>>().toBe<{a: number} | {b: string}>();
expectTypeOf<DefaultsFor<{type: 'file'; encoding?: string} | {type: 'stdin'}>>().toBe<{encoding: string} | {}>();
expectTypeOf<DefaultsFor<{a?: string} | {a?: number}>>().toBe<{a: string} | {a: number}>();
expectTypeOf<DefaultsFor<{type?: 'file'; encoding?: string} | {type: 'url'}>>().toBe<{type: 'file'; encoding: string} | {}>();

// Accepts a defaults object.
const defaults = {retries: 2, timeout: 10_000} as const satisfies DefaultsFor<Except<Options, 'signal'>>;
expectTypeOf(defaults).toBe<{readonly retries: 2; readonly timeout: 10_000}>();

// Accepts a `null` default when the option accepts `null`.
const nullDefault: DefaultsFor<{name: string; className?: string | null}> = {className: null};

// The defaults are partial options, so they can be merged with the options.
expectTypeOf<DefaultsFor<Options>>().toBeAssignableTo<Partial<Options>>();

// A union of options accepts the defaults of any of its members.
type SourceOptions = {type: 'file'; encoding?: string} | {type: 'url'; timeout?: number};
const fileDefaults: DefaultsFor<SourceOptions> = {encoding: 'utf8'};
const urlDefaults: DefaultsFor<SourceOptions> = {timeout: 10_000};

// Works in a generic function that merges the defaults with the options.
function withDefaults<GenericOptions extends object>(defaultValues: DefaultsFor<GenericOptions>, options: GenericOptions) {
	return {...defaultValues, ...options};
}

const resolved = withDefaults<{url: string; retries?: number}>({retries: 2}, {url: 'https://example.com'});
expectTypeOf(resolved.url).toBe<string>();
expectTypeOf(resolved.retries).toBe<number>();

// The defaults can be read in a generic function.
function readRetries<GenericOptions extends {retries?: number}>(defaultValues: DefaultsFor<GenericOptions>) {
	expectTypeOf(defaultValues.retries).toBe<number>();
}

// A missing default and a misspelled key are type errors in a generic function too.
// @ts-expect-error
withDefaults<{url: string; retries?: number}>({}, {url: 'https://example.com'});
// @ts-expect-error
withDefaults<{url: string; retries?: number}>({retries: 2, retires: 3}, {url: 'https://example.com'});

// A missing default is a type error.
// @ts-expect-error
const missingDefault: DefaultsFor<Except<Options, 'signal'>> = {retries: 2};

// An `undefined` default is a type error.
// @ts-expect-error
const undefinedDefault: DefaultsFor<Except<Options, 'signal'>> = {retries: 2, timeout: undefined};

// A default of the wrong type is a type error.
// @ts-expect-error
const wrongTypeDefault: DefaultsFor<Except<Options, 'signal'>> = {retries: '2', timeout: 10_000};

// A misspelled key is a type error.
// @ts-expect-error
const misspelledKey: DefaultsFor<Except<Options, 'signal'>> = {retries: 2, timout: 10_000};

// A default for a required key is a type error in an object literal.
// @ts-expect-error
const requiredKeyDefault: DefaultsFor<Except<Options, 'signal'>> = {url: 'https://example.com', retries: 2, timeout: 10_000};
// @ts-expect-error
const requiredKeyDefaultSatisfies = {url: 'https://example.com', retries: 2, timeout: 10_000} satisfies DefaultsFor<Except<Options, 'signal'>>;

// Known limitation: A misspelled key is not a type error when the object is not a literal.
const defaultsWithMisspelledKey = {retries: 2, timeout: 10_000, timout: 10_000};
const fromVariable: DefaultsFor<Except<Options, 'signal'>> = defaultsWithMisspelledKey;

// A union of options needs all the defaults of one of its members.
// @ts-expect-error
const noUnionDefaults: DefaultsFor<SourceOptions> = {};

// Edge cases.
expectTypeOf<DefaultsFor<any>>().toBe<{}>();
expectTypeOf<DefaultsFor<never>>().toBe<never>();

// A non-object type is a type error.
// @ts-expect-error
type NotObject = DefaultsFor<unknown>;
// @ts-expect-error
type Primitive = DefaultsFor<string>;
