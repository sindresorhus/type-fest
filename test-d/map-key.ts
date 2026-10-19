import {expectTypeOf} from 'nz';
import type {MapKey, MapValue, ReadonlyDeep} from '../index.d.ts';

type WeakKeyObject = {id: number};

// Map
expectTypeOf<MapKey<Map<string, number>>>().toBe<string>();
expectTypeOf<MapKey<Map<'a' | 'b', number>>>().toBe<'a' | 'b'>();
expectTypeOf<MapKey<Map<number | symbol, string>>>().toBe<number | symbol>();

// Key kinds
enum Color {
	Red,
	Green,
}

enum Direction {
	Up = 'up',
	Down = 'down',
}

declare const uniqueKey: unique symbol;
type UserId = string & {readonly brand: 'UserId'};

expectTypeOf<MapKey<Map<1 | 2, string>>>().toBe<1 | 2>();
expectTypeOf<MapKey<Map<bigint, string>>>().toBe<bigint>();
expectTypeOf<MapKey<Map<boolean, string>>>().toBe<boolean>();
expectTypeOf<MapKey<Map<Color, string>>>().toBe<Color>();
expectTypeOf<MapKey<Map<Direction.Up, string>>>().toBe<Direction.Up>();
expectTypeOf<MapKey<Map<`id-${number}`, string>>>().toBe<`id-${number}`>();
expectTypeOf<MapKey<Map<typeof uniqueKey, string>>>().toBe<typeof uniqueKey>();
expectTypeOf<MapKey<Map<UserId, string>>>().toBe<UserId>();
expectTypeOf<MapKey<Map<[x: number, y: number], string>>>().toBe<[x: number, y: number]>();
expectTypeOf<MapKey<Map<() => void, string>>>().toBe<() => void>();
expectTypeOf<MapKey<Map<string | undefined, number>>>().toBe<string | undefined>();
expectTypeOf<MapKey<Map<null, number>>>().toBe<null>();
expectTypeOf<MapKey<Map<undefined | null, number>>>().toBe<undefined | null>();

// The value type does not affect the key type
expectTypeOf<MapKey<Map<string, never>>>().toBe<string>();
expectTypeOf<MapKey<Map<string, any>>>().toBe<string>();
expectTypeOf<MapKey<Map<string, unknown>>>().toBe<string>();

// From a value
const fieldLabels = new Map([
	['first', 'First Name'],
	['last', 'Last Name'],
] as const);
expectTypeOf<MapKey<typeof fieldLabels>>().toBe<'first' | 'last'>();

const widenedMap = new Map([['first', 1]]);
expectTypeOf<MapKey<typeof widenedMap>>().toBe<string>();

const emptyMap = new Map();
expectTypeOf<MapKey<typeof emptyMap>>().toBe<any>();

const objectEntriesMap = new Map(Object.entries({a: 1, b: 2}));
expectTypeOf<MapKey<typeof objectEntriesMap>>().toBe<string>();

function createRegistry() {
	return new Map<'a' | 'b', number>();
}

expectTypeOf<MapKey<ReturnType<typeof createRegistry>>>().toBe<'a' | 'b'>();

// ReadonlyMap
expectTypeOf<MapKey<ReadonlyMap<string, number>>>().toBe<string>();
expectTypeOf<MapKey<Readonly<Map<'a', 1>>>>().toBe<'a'>();
expectTypeOf<MapKey<ReadonlyMap<WeakKeyObject, number>>>().toBe<WeakKeyObject>();
expectTypeOf<MapKey<ReadonlyMap<unknown, string>>>().toBe<unknown>();
expectTypeOf<MapKey<ReadonlyDeep<Map<'a', {b: 1}>>>>().toBe<'a'>();

// WeakMap
expectTypeOf<MapKey<WeakMap<WeakKeyObject, string>>>().toBe<WeakKeyObject>();
expectTypeOf<MapKey<WeakMap<WeakKey, string>>>().toBe<WeakKey>();
expectTypeOf<MapKey<WeakMap<object, string>>>().toBe<object>();
expectTypeOf<MapKey<WeakMap<symbol, string>>>().toBe<symbol>();
expectTypeOf<MapKey<WeakMap<() => void, string>>>().toBe<() => void>();
expectTypeOf<MapKey<WeakMap<WeakKeyObject | symbol, string>>>().toBe<WeakKeyObject | symbol>();
expectTypeOf<MapKey<Readonly<WeakMap<WeakKeyObject, string>>>>().toBe<WeakKeyObject>();
expectTypeOf<MapKey<WeakMap<never, string>>>().toBe<never>();

// A `Map` with object, symbol, `unknown`, `any`, or `never` keys is also assignable to `WeakMap`, so it must still be read as a `Map`. Only `unknown` gives a different key from `WeakMap`, which limits the key to `WeakKey`.
expectTypeOf<MapKey<Map<WeakKeyObject, string>>>().toBe<WeakKeyObject>();
expectTypeOf<MapKey<Map<object, string>>>().toBe<object>();
expectTypeOf<MapKey<Map<symbol, string>>>().toBe<symbol>();
expectTypeOf<MapKey<Map<unknown, string>>>().toBe<unknown>();
expectTypeOf<MapKey<Map<any, string>>>().toBe<any>();
expectTypeOf<MapKey<Map<never, string>>>().toBe<never>();

// Subclasses and extended maps
class FieldMap extends Map<'first' | 'last', string> {}
expectTypeOf<MapKey<FieldMap>>().toBe<'first' | 'last'>();
expectTypeOf<MapKey<Map<string, number> & {extra: true}>>().toBe<string>();

class Registry<Key extends string> extends Map<Key, number> {}
expectTypeOf<MapKey<Registry<'a' | 'b'>>>().toBe<'a' | 'b'>();

class ObjectCache extends WeakMap<WeakKeyObject, string> {}
expectTypeOf<MapKey<ObjectCache>>().toBe<WeakKeyObject>();

// Unions distribute
expectTypeOf<MapKey<Map<'a', 1> | Map<'b', 2>>>().toBe<'a' | 'b'>();
expectTypeOf<MapKey<Map<'a', 1> | Map<'a', 2>>>().toBe<'a'>();
expectTypeOf<MapKey<Map<'a', 1> | WeakMap<WeakKeyObject, 2>>>().toBe<'a' | WeakKeyObject>();
expectTypeOf<MapKey<Map<'a', 1> | ReadonlyMap<'b', 2> | WeakMap<WeakKeyObject, 3>>>().toBe<'a' | 'b' | WeakKeyObject>();
expectTypeOf<MapKey<Map<unknown, 1> | WeakMap<WeakKeyObject, 2>>>().toBe<unknown>();
expectTypeOf<MapKey<Map<'a', 1> | undefined>>().toBe<'a'>();
expectTypeOf<MapKey<Map<'a', 1> | null | undefined>>().toBe<'a'>();
expectTypeOf<MapKey<Map<'a', 1> | string>>().toBe<'a'>();
expectTypeOf<MapKey<Map<'a', 1> | Set<'b'>>>().toBe<'a'>();

// Nested maps
type NestedMap = Map<'outer', Map<'inner', number>>;
expectTypeOf<MapKey<NestedMap>>().toBe<'outer'>();
expectTypeOf<MapKey<MapValue<NestedMap>>>().toBe<'inner'>();

// Edge cases
expectTypeOf<MapKey<any>>().toBe<any>();
expectTypeOf<MapKey<never>>().toBe<never>();
expectTypeOf<MapKey<unknown>>().toBe<never>();

// Non-maps return `never`
expectTypeOf<MapKey<string>>().toBe<never>();
expectTypeOf<MapKey<number>>().toBe<never>();
expectTypeOf<MapKey<undefined>>().toBe<never>();
expectTypeOf<MapKey<null>>().toBe<never>();
expectTypeOf<MapKey<object>>().toBe<never>();
expectTypeOf<MapKey<Set<string>>>().toBe<never>();
expectTypeOf<MapKey<ReadonlySet<string>>>().toBe<never>();
expectTypeOf<MapKey<WeakSet<WeakKeyObject>>>().toBe<never>();
expectTypeOf<MapKey<Array<[string, number]>>>().toBe<never>();
expectTypeOf<MapKey<Iterable<[string, number]>>>().toBe<never>();
expectTypeOf<MapKey<Record<string, number>>>().toBe<never>();
expectTypeOf<MapKey<{get(key: string): number}>>().toBe<never>();

// Values that only contain or produce a map are not maps
expectTypeOf<MapKey<typeof Map>>().toBe<never>();
expectTypeOf<MapKey<WeakMapConstructor>>().toBe<never>();
expectTypeOf<MapKey<Promise<Map<'a', 1>>>>().toBe<never>();
expectTypeOf<MapKey<[Map<'a', 1>]>>().toBe<never>();
expectTypeOf<MapKey<Array<Map<'a', 1>>>>().toBe<never>();
expectTypeOf<MapKey<() => Map<'a', 1>>>().toBe<never>();
expectTypeOf<MapKey<ReturnType<Map<'a', 1>['keys']>>>().toBe<never>();

// Generic map
declare function takesNumber(value: number): void;

function getLabel<FieldLabels extends ReadonlyMap<string, string>>(labels: FieldLabels, field: MapKey<FieldLabels>) {
	// The key is read through the constraint, so it is a `string` and not `any`.
	// @ts-expect-error
	takesNumber(field);

	return labels.get(field);
}

getLabel(fieldLabels, 'first');
// @ts-expect-error
getLabel(fieldLabels, 'middle');

function getCached<Cache extends WeakMap<WeakKeyObject, string>>(cache: Cache, key: MapKey<Cache>) {
	return cache.get(key);
}

const cache = new WeakMap<WeakKeyObject, string>();
getCached(cache, {id: 1});
// @ts-expect-error
getCached(cache, {name: 'id'});

declare function getKeys<MapType extends ReadonlyMap<unknown, unknown>>(map: MapType): Array<MapKey<MapType>>;

expectTypeOf(getKeys(fieldLabels)).toBe<Array<'first' | 'last'>>();
expectTypeOf(getKeys(new Map<number, string>())).toBe<number[]>();
