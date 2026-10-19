/* eslint-disable @typescript-eslint/consistent-type-definitions -- Tests the `extends` clause of interfaces. */
import {expectTypeOf} from 'nz';
import type {AsExtendable} from '../index.d.ts';

// Returns the given type as is
expectTypeOf<AsExtendable<{a: string}>>().toBe<{a: string}>();
expectTypeOf<AsExtendable<{a?: string; readonly b: number}>>().toBe<{a?: string; readonly b: number}>();
expectTypeOf<AsExtendable<{a: string} & {b: number}>>().toBe<{a: string} & {b: number}>();
expectTypeOf<AsExtendable<{a: string} | {b: number}>>().toBe<{a: string} | {b: number}>();
expectTypeOf<AsExtendable<string>>().toBe<string>();
expectTypeOf<AsExtendable<'a' | 1>>().toBe<'a' | 1>();
expectTypeOf<AsExtendable<string[]>>().toBe<string[]>();
expectTypeOf<AsExtendable<(value: number) => string>>().toBe<(value: number) => string>();
expectTypeOf<AsExtendable<any>>().toBe<any>();
expectTypeOf<AsExtendable<unknown>>().toBe<unknown>();
expectTypeOf<AsExtendable<never>>().toBe<never>();

type Config = {
	server: {
		host: string;
		port?: number;
		readonly tls: {
			cert: string;
		};
	};
	tags: Array<{name: string}>;
	pair: [first: {id: number}, second: {label: string}];
};

// Without `AsExtendable`, TypeScript rejects the `extends` and `implements` clauses below, and the linter cannot parse them, so they are not tested.

// Indexed access type
interface ServerOptions extends AsExtendable<Config['server']> {
	timeout: number;
}

declare const serverOptions: ServerOptions;
expectTypeOf(serverOptions.host).toBe<string>();
expectTypeOf(serverOptions.port).toBe<number | undefined>();
expectTypeOf(serverOptions.timeout).toBe<number>();
expectTypeOf<ServerOptions>().toBeAssignableTo<Config['server']>();
// @ts-expect-error
serverOptions.tls = {cert: ''};

// Nested indexed access type
interface TlsOptions extends AsExtendable<Config['server']['tls']> {
	key: string;
}

declare const tlsOptions: TlsOptions;
expectTypeOf(tlsOptions.cert).toBe<string>();
expectTypeOf(tlsOptions.key).toBe<string>();

// Array element and tuple element
interface Tag extends AsExtendable<Config['tags'][number]> {}
expectTypeOf<Tag['name']>().toBe<string>();

interface Second extends AsExtendable<Config['pair'][1]> {}
expectTypeOf<Second['label']>().toBe<string>();

// Qualified name with an indexed access type
// eslint-disable-next-line @typescript-eslint/no-namespace -- Mimics `JSX.IntrinsicElements`.
declare namespace Html {
	interface Elements {
		a: {
			href: string;
		};
	}
}

interface AnchorProps extends AsExtendable<Html.Elements['a']> {
	external: boolean;
}

declare const anchorProps: AnchorProps;
expectTypeOf(anchorProps.href).toBe<string>();
expectTypeOf(anchorProps.external).toBe<boolean>();

// Type of a value
const defaultOptions = {
	retries: 2,
	timeout: 1000,
};

interface ClientOptions extends AsExtendable<typeof defaultOptions> {
	signal?: AbortSignal;
}

declare const clientOptions: ClientOptions;
expectTypeOf(clientOptions.retries).toBe<number>();
expectTypeOf(clientOptions.signal).toBe<AbortSignal | undefined>();

// Object literal type
interface Point extends AsExtendable<{x: number; y: number}> {}
expectTypeOf<Point['x']>().toBe<number>();

// Intersection
interface Entity extends AsExtendable<{id: string} & {createdAt: Date}> {}
expectTypeOf<Entity['id']>().toBe<string>();
expectTypeOf<Entity['createdAt']>().toBe<Date>();

// Index signature
interface Scores extends AsExtendable<{[key: string]: number}> {
	total: number;
}

declare const scores: Scores;
expectTypeOf(scores.total).toBe<number>();
expectTypeOf(scores['alice']).toBe<number | undefined>();

// Multiple base types
interface Combined extends AsExtendable<Config['server']>, AsExtendable<typeof defaultOptions> {}

declare const combined: Combined;
expectTypeOf(combined.host).toBe<string>();
expectTypeOf(combined.retries).toBe<number>();

// Properties can be narrowed, but not changed to an incompatible type
interface LocalServerOptions extends AsExtendable<Config['server']> {
	host: 'localhost';
}

expectTypeOf<LocalServerOptions['host']>().toBe<'localhost'>();

// @ts-expect-error
interface InvalidPortOptions extends AsExtendable<Config['server']> {
	port: string;
}

// Generic interface
type Wrapper<Value> = {
	inner: {
		value: Value;
	};
};

interface Box<Value> extends AsExtendable<Wrapper<Value>['inner']> {}
expectTypeOf<Box<string>['value']>().toBe<string>();

// Call signatures and construct signatures are kept
declare const parse: {
	(input: string): number;
	strict: boolean;
};

interface Parser extends AsExtendable<typeof parse> {}

declare const parser: Parser;
expectTypeOf(parser('1')).toBe<number>();
expectTypeOf(parser.strict).toBe<boolean>();

declare class Service {
	static create(): Service;
	name: string;
	constructor(name: string);
}

interface ServiceConstructor extends AsExtendable<typeof Service> {}

declare const ServiceClass: ServiceConstructor;
expectTypeOf(new ServiceClass('a')).toBe<Service>();
expectTypeOf(ServiceClass.create()).toBe<Service>();

// Declaration merging still works
interface Mergeable extends AsExtendable<{a: string}> {}
interface Mergeable {
	b: number;
}

expectTypeOf<Mergeable['a']>().toBe<string>();
expectTypeOf<Mergeable['b']>().toBe<number>();

// Class `implements` clause
class Server implements AsExtendable<Config['server']> {
	host = 'localhost';
	tls = {cert: ''};
}

expectTypeOf<Server>().toBeAssignableTo<Config['server']>();

// @ts-expect-error
class IncompleteServer implements AsExtendable<Config['server']> {
	host = 'localhost';
}

class Client implements AsExtendable<typeof defaultOptions> {
	retries = 3;
	timeout = 5000;
}

expectTypeOf<Client>().toBeAssignableTo<typeof defaultOptions>();

// Array, readonly array, and tuple types
interface TagList extends AsExtendable<Config['tags']> {
	total: number;
}

declare const tagList: TagList;
expectTypeOf(tagList[0]).toBe<{name: string} | undefined>();
expectTypeOf(tagList.map(tag => tag.name)).toBe<string[]>();
expectTypeOf(tagList.total).toBe<number>();
expectTypeOf<TagList>().toBeAssignableTo<Config['tags']>();

interface ReadonlyNames extends AsExtendable<readonly string[]> {}

expectTypeOf<ReadonlyNames>().toBeAssignableTo<readonly string[]>();
expectTypeOf<ReadonlyNames>().not.toBeAssignableTo<string[]>();

interface PairBase extends AsExtendable<Config['pair']> {}
expectTypeOf<PairBase[0]>().toBe<{id: number}>();
expectTypeOf<PairBase['length']>().toBe<2>();

// Function type
interface Formatter extends AsExtendable<(value: number) => string> {
	locale: string;
}

declare const formatter: Formatter;
expectTypeOf(formatter(1)).toBe<string>();
expectTypeOf(formatter.locale).toBe<string>();

// Method overloads are kept
declare const converter: {
	convert(input: string): number;
	convert(input: number): string;
};

interface Converter extends AsExtendable<typeof converter> {}

declare const converterInstance: Converter;
expectTypeOf(converterInstance.convert('1')).toBe<number>();
expectTypeOf(converterInstance.convert(1)).toBe<string>();

// Symbol keys and getters
const idSymbol: unique symbol = Symbol('id');

const record = {
	[idSymbol]: 1,
	get size() {
		return 1;
	},
};

interface RecordLike extends AsExtendable<typeof record> {}
expectTypeOf<RecordLike[typeof idSymbol]>().toBe<number>();

declare const recordLike: RecordLike;
expectTypeOf(recordLike.size).toBe<number>();
// @ts-expect-error
recordLike.size = 2;

// Mapped types with known keys
interface OptionLabels extends AsExtendable<{[Key in keyof typeof defaultOptions]: string}> {}
expectTypeOf<keyof OptionLabels>().toBe<'retries' | 'timeout'>();
expectTypeOf<OptionLabels['retries']>().toBe<string>();

interface Coordinates extends AsExtendable<Record<'x' | 'y', number>> {}
expectTypeOf<Coordinates>().toBe<{x: number; y: number}>();

// Enum object
enum Color {
	Red = 'red',
	Green = 'green',
}

interface ColorMap extends AsExtendable<typeof Color> {}
expectTypeOf<ColorMap['Red']>().toBe<Color.Red>();

// Parameter of a function
declare function connect(options: {host: string; port: number}): void;

interface ConnectOptions extends AsExtendable<Parameters<typeof connect>[0]> {
	retries: number;
}

expectTypeOf<ConnectOptions['port']>().toBe<number>();

// Resolved conditional type
interface InferredServer extends AsExtendable<Config extends {server: infer Server} ? Server : never> {}
expectTypeOf<InferredServer['host']>().toBe<string>();

// Recursive reference to the interface itself
interface TreeNode extends AsExtendable<{children: TreeNode[]}> {
	label: string;
}

expectTypeOf<TreeNode['children'][number]['label']>().toBe<string>();

// `any` is accepted
interface AnyBase extends AsExtendable<any> {
	name: string;
}

declare const anyBase: AnyBase;
expectTypeOf(anyBase.name).toBe<string>();
expectTypeOf(anyBase['other']).toBe<any>();

// Generic interface with statically known members
interface Container<Value> extends AsExtendable<{value: Value}> {}
expectTypeOf<Container<string>['value']>().toBe<string>();

interface KeyedContainer<Value> extends AsExtendable<Record<'value', Value>> {}
expectTypeOf<KeyedContainer<number>['value']>().toBe<number>();

// Generic interface where the members depend on a type parameter is rejected
// @ts-expect-error
interface PartialBase<Base> extends AsExtendable<Partial<Base>> {}

// @ts-expect-error
interface RecordKeyBase<Key extends string> extends AsExtendable<Record<Key, number>> {}

// @ts-expect-error
interface IndexedTypeParameterBase<Base extends {inner: object}> extends AsExtendable<Base['inner']> {}

// @ts-expect-error
interface ConditionalBase<Value> extends AsExtendable<Value extends string ? {text: Value} : {other: Value}> {}

// Conflicting members between base types are rejected
// @ts-expect-error
interface ConflictingBases extends AsExtendable<{id: string}>, AsExtendable<{id: number}> {}

// Branded primitives and unions inside intersections are rejected
// @ts-expect-error
interface BrandedBase extends AsExtendable<string & {brand: 'id'}> {}

// @ts-expect-error
interface UnionInIntersectionBase extends AsExtendable<{a: string} & ({b: number} | {c: number})> {}

// Class `implements` clause with multiple types
class ConfiguredServer implements AsExtendable<Config['server']>, AsExtendable<typeof defaultOptions> {
	host = 'localhost';
	tls = {cert: ''};
	retries = 1;
	timeout = 1000;
}

expectTypeOf<ConfiguredServer>().toBeAssignableTo<Config['server'] & typeof defaultOptions>();

// @ts-expect-error
class PartiallyConfiguredServer implements AsExtendable<Config['server']>, AsExtendable<typeof defaultOptions> {
	host = 'localhost';
	tls = {cert: ''};
}

// Abstract and generic classes
abstract class AbstractServer implements AsExtendable<Config['server']> {
	abstract host: string;
	tls = {cert: ''};
}

class ValueHolder<Value> implements AsExtendable<{value: Value}> {
	constructor(readonly value: Value) {}
}

expectTypeOf<ValueHolder<string>['value']>().toBe<string>();

// Class `implements` rejects the same types as interface `extends`
// @ts-expect-error
class UnionImplementation implements AsExtendable<{a: string} | {b: number}> {
	a = '';
}

// @ts-expect-error
class TypeParameterImplementation<Base extends object> implements AsExtendable<Base> {}

// The static side of a class cannot be implemented by an instance
// @ts-expect-error
class StaticSideImplementation implements AsExtendable<typeof Service> {
	name = '';
}

// Types that cannot be a base type are still rejected
// @ts-expect-error
interface UnionBase extends AsExtendable<{a: string} | {b: number}> {}

// @ts-expect-error
interface PrimitiveBase extends AsExtendable<string> {}

// @ts-expect-error
interface UnknownBase extends AsExtendable<unknown> {}

// @ts-expect-error
interface NeverBase extends AsExtendable<never> {}

// @ts-expect-error
interface OptionalBase extends AsExtendable<Config['server'] | undefined> {}

// @ts-expect-error
interface TypeParameterBase<Base extends object> extends AsExtendable<Base> {}
