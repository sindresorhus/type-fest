import {expectTypeOf} from 'nz';
import type {MapKey, MapValue, ReadonlyDeep} from '../index.d.ts';

type WeakKeyObject = {id: number};

// Map
expectTypeOf<MapValue<Map<string, number>>>().toBe<number>();
expectTypeOf<MapValue<Map<string, 'a' | 'b'>>>().toBe<'a' | 'b'>();
expectTypeOf<MapValue<Map<string, {name: string}>>>().toBe<{name: string}>();

// Value kinds
expectTypeOf<MapValue<Map<string, () => void>>>().toBe<() => void>();
expectTypeOf<MapValue<Map<string, readonly [1, 2]>>>().toBe<readonly [1, 2]>();
expectTypeOf<MapValue<Map<string, string[]>>>().toBe<string[]>();
expectTypeOf<MapValue<Map<string, Promise<number>>>>().toBe<Promise<number>>();
expectTypeOf<MapValue<Map<string, Set<number>>>>().toBe<Set<number>>();
expectTypeOf<MapValue<Map<string, void>>>().toBe<void>();

// The value of a missing key is not part of the value type
expectTypeOf<MapValue<Map<string, number>>>().not.toBe<number | undefined>();
expectTypeOf<MapValue<Map<string, number | undefined>>>().toBe<number | undefined>();
expectTypeOf<MapValue<Map<string, number | null>>>().toBe<number | null>();
expectTypeOf<MapValue<Map<string, undefined>>>().toBe<undefined>();

// `any`, `unknown`, and `never` values are kept
expectTypeOf<MapValue<Map<string, any>>>().toBe<any>();
expectTypeOf<MapValue<Map<string, unknown>>>().toBe<unknown>();
expectTypeOf<MapValue<Map<string, never>>>().toBe<never>();

// The key type does not affect the value type
expectTypeOf<MapValue<Map<'a' | 'b', string>>>().toBe<string>();

// From a value
const fieldLabels = new Map([
	['first', 'First Name'],
	['last', 'Last Name'],
] as const);
expectTypeOf<MapValue<typeof fieldLabels>>().toBe<'First Name' | 'Last Name'>();

const widenedMap = new Map([['first', 1]]);
expectTypeOf<MapValue<typeof widenedMap>>().toBe<number>();

const emptyMap = new Map();
expectTypeOf<MapValue<typeof emptyMap>>().toBe<any>();

const objectEntriesMap = new Map(Object.entries({a: 1, b: 'two'}));
expectTypeOf<MapValue<typeof objectEntriesMap>>().toBe<string | number>();

function createCache() {
	return new Map<string, {expires: Date}>();
}

expectTypeOf<MapValue<ReturnType<typeof createCache>>>().toBe<{expires: Date}>();

// ReadonlyMap
expectTypeOf<MapValue<ReadonlyMap<string, number>>>().toBe<number>();
expectTypeOf<MapValue<Readonly<Map<'a', 1>>>>().toBe<1>();
expectTypeOf<MapValue<ReadonlyMap<WeakKeyObject, number>>>().toBe<number>();
expectTypeOf<MapValue<ReadonlyMap<unknown, string>>>().toBe<string>();
expectTypeOf<MapValue<ReadonlyDeep<Map<'a', {b: 1}>>>>().toBe<{readonly b: 1}>();

// WeakMap
expectTypeOf<MapValue<WeakMap<WeakKeyObject, string>>>().toBe<string>();
expectTypeOf<MapValue<WeakMap<WeakKey, unknown>>>().toBe<unknown>();
expectTypeOf<MapValue<WeakMap<symbol, 'a' | 'b'>>>().toBe<'a' | 'b'>();
expectTypeOf<MapValue<WeakMap<object, undefined>>>().toBe<undefined>();
expectTypeOf<MapValue<Readonly<WeakMap<WeakKeyObject, string>>>>().toBe<string>();
expectTypeOf<MapValue<WeakMap<never, 1>>>().toBe<1>();

// A `Map` with object, symbol, `unknown`, `any`, or `never` keys is also assignable to `WeakMap`, and it is still read as a `Map`
expectTypeOf<MapValue<Map<WeakKeyObject, string>>>().toBe<string>();
expectTypeOf<MapValue<Map<object, string>>>().toBe<string>();
expectTypeOf<MapValue<Map<symbol, string>>>().toBe<string>();
expectTypeOf<MapValue<Map<unknown, string>>>().toBe<string>();
expectTypeOf<MapValue<Map<any, string>>>().toBe<string>();
expectTypeOf<MapValue<Map<never, string>>>().toBe<string>();

// Subclasses and extended maps
class Labels extends Map<string, 'First Name' | 'Last Name'> {}
expectTypeOf<MapValue<Labels>>().toBe<'First Name' | 'Last Name'>();
expectTypeOf<MapValue<Map<string, number> & {extra: true}>>().toBe<number>();

class Registry<Item> extends Map<string, Item> {}
expectTypeOf<MapValue<Registry<Date>>>().toBe<Date>();

class ObjectCache extends WeakMap<WeakKeyObject, string> {}
expectTypeOf<MapValue<ObjectCache>>().toBe<string>();

// Unions distribute
expectTypeOf<MapValue<Map<'a', 1> | Map<'b', 2>>>().toBe<1 | 2>();
expectTypeOf<MapValue<Map<'a', 1> | Map<'b', 1>>>().toBe<1>();
expectTypeOf<MapValue<Map<'a', 1> | WeakMap<WeakKeyObject, 2>>>().toBe<1 | 2>();
expectTypeOf<MapValue<Map<'a', 1> | ReadonlyMap<'b', 2> | WeakMap<WeakKeyObject, 3>>>().toBe<1 | 2 | 3>();
expectTypeOf<MapValue<Map<'a', 1> | undefined>>().toBe<1>();
expectTypeOf<MapValue<Map<'a', 1> | null | undefined>>().toBe<1>();
expectTypeOf<MapValue<Map<'a', 1> | string>>().toBe<1>();
expectTypeOf<MapValue<Map<'a', 1> | Set<2>>>().toBe<1>();

// Nested maps
type NestedMap = Map<'outer', Map<'inner', number>>;
expectTypeOf<MapValue<NestedMap>>().toBe<Map<'inner', number>>();
expectTypeOf<MapValue<MapValue<NestedMap>>>().toBe<number>();

// Edge cases
expectTypeOf<MapValue<any>>().toBe<any>();
expectTypeOf<MapValue<never>>().toBe<never>();
expectTypeOf<MapValue<unknown>>().toBe<never>();

// Non-maps return `never`
expectTypeOf<MapValue<string>>().toBe<never>();
expectTypeOf<MapValue<number>>().toBe<never>();
expectTypeOf<MapValue<undefined>>().toBe<never>();
expectTypeOf<MapValue<null>>().toBe<never>();
expectTypeOf<MapValue<object>>().toBe<never>();
expectTypeOf<MapValue<Set<string>>>().toBe<never>();
expectTypeOf<MapValue<ReadonlySet<string>>>().toBe<never>();
expectTypeOf<MapValue<WeakSet<WeakKeyObject>>>().toBe<never>();
expectTypeOf<MapValue<Array<[string, number]>>>().toBe<never>();
expectTypeOf<MapValue<Iterable<[string, number]>>>().toBe<never>();
expectTypeOf<MapValue<Record<string, number>>>().toBe<never>();
expectTypeOf<MapValue<{get(key: string): number}>>().toBe<never>();

// Values that only contain or produce a map are not maps
expectTypeOf<MapValue<typeof Map>>().toBe<never>();
expectTypeOf<MapValue<WeakMapConstructor>>().toBe<never>();
expectTypeOf<MapValue<Promise<Map<'a', 1>>>>().toBe<never>();
expectTypeOf<MapValue<[Map<'a', 1>]>>().toBe<never>();
expectTypeOf<MapValue<Array<Map<'a', 1>>>>().toBe<never>();
expectTypeOf<MapValue<() => Map<'a', 1>>>().toBe<never>();
expectTypeOf<MapValue<ReturnType<Map<'a', 1>['values']>>>().toBe<never>();

// Combined with `MapKey`
expectTypeOf<Record<MapKey<typeof fieldLabels>, MapValue<typeof fieldLabels>>>().toBe<{
	first: 'First Name' | 'Last Name';
	last: 'First Name' | 'Last Name';
}>();

// Generic map
declare function takesString(value: string): void;

function setValue<Cache extends Map<string, number>>(cache: Cache, value: MapValue<Cache>) {
	// The value is read through the constraint, so it is a `number` and not `any`.
	// @ts-expect-error
	takesString(value);

	cache.set('key', value);
}

setValue(new Map<string, 1 | 2>(), 1);
// @ts-expect-error
setValue(new Map<string, 1 | 2>(), 3);

function setCached<Cache extends WeakMap<WeakKeyObject, string>>(cache: Cache, key: WeakKeyObject, value: MapValue<Cache>) {
	cache.set(key, value);
}

const cache = new WeakMap<WeakKeyObject, 'a' | 'b'>();
setCached(cache, {id: 1}, 'a');
// @ts-expect-error
setCached(cache, {id: 1}, 'c');

declare function getValues<MapType extends ReadonlyMap<unknown, unknown>>(map: MapType): Array<MapValue<MapType>>;

expectTypeOf(getValues(fieldLabels)).toBe<Array<'First Name' | 'Last Name'>>();
expectTypeOf(getValues(new Map<string, number>())).toBe<number[]>();
