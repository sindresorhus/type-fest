import {expectTypeOf} from 'nz';
import type {ReadonlyDeep, SetProperty, Tagged} from '../index.d.ts';

// Key does not exist
expectTypeOf<SetProperty<{}, 'foo', number>>().toBe<{foo: number}>();
expectTypeOf<SetProperty<{foo: string}, 'bar', number>>().toBe<{foo: string; bar: number}>();
expectTypeOf<SetProperty<{}, 'foo.bar', number>>().toBe<{foo: {bar: number}}>();
expectTypeOf<SetProperty<{foo: string}, 'foo.bar', number>>().toBe<{foo: {bar: number}}>();
expectTypeOf<SetProperty<{foo: string; bar: {baz: string}}, 'bar.biz', number>>().toBe<{foo: string; bar: {baz: string; biz: number}}>();

// Deep creation
expectTypeOf<SetProperty<{a: {b: string}}, 'a.b.c.d', number>>().toBe<{a: {b: {c: {d: number}}}}>();

// A numeric segment creates an array when its container is missing or not an object.
expectTypeOf<SetProperty<{}, 'users[0].name', string>>().toBe<{users: Array<{name: string}>}>();
expectTypeOf<SetProperty<{users: null}, 'users.0.name', string>>().toBe<{users: Array<{name: string}>}>();
expectTypeOf<SetProperty<{users: string}, readonly ['users', 0, 'name'], string>>().toBe<{users: Array<{name: string}>}>();
// A numeric array-form segment creates an array too
expectTypeOf<SetProperty<{}, ['a', 0, 'name'], string>>().toBe<{a: Array<{name: string}>}>();
// Deep numeric creation nests one array per numeric key
expectTypeOf<SetProperty<{}, '0.1.2', string>>().toBe<{'0': string[][]}>();
// A dot in a string path always separates keys, so `'1.5'` addresses index `1`, then index `5`
expectTypeOf<SetProperty<{}, '1.5', number>>().toBe<{1: number[]}>();
// A literal fractional key is addressed with the array form
expectTypeOf<SetProperty<{}, ['1.5'], number>>().toBe<{1.5: number}>();
// A negative key creates an object, since it cannot be an index
expectTypeOf<SetProperty<{}, '-1', number>>().toBe<{'-1': number}>();

// Key exists
expectTypeOf<SetProperty<{foo: string}, 'foo', number>>().toBe<{foo: number}>();
expectTypeOf<SetProperty<{foo: {bar: string}}, 'foo.bar', number>>().toBe<{foo: {bar: number}}>();
expectTypeOf<SetProperty<{foo: string; bar: number}, 'foo', boolean>>().toBe<{foo: boolean; bar: number}>();

// Sibling keys are kept
expectTypeOf<SetProperty<{foo: {bar: string; baz: number}}, 'foo.bar', number>>().toBe<{foo: {bar: number; baz: number}}>();

// Optional modifiers are preserved. Reading an optional property also reads `undefined`, which sets into a new container too, so identical shapes can show as a repeated union member.
expectTypeOf<SetProperty<{foo?: {bar: string}}, 'foo.bar', number>>().toBeAssignableTo<{foo?: {bar: number}}>();
expectTypeOf<SetProperty<{foo?: {bar?: string}}, 'foo.bar.baz', number>>().toBeAssignableTo<{foo?: {bar?: {baz: number}}}>();
// The property being set can itself be optional
expectTypeOf<SetProperty<{foo?: string}, 'foo', number>>().toBe<{foo?: number}>();

// Readonly modifiers are preserved, including on the property being set
expectTypeOf<SetProperty<{readonly foo: string}, 'foo', number>>().toBe<{readonly foo: number}>();
expectTypeOf<SetProperty<{readonly foo: {readonly bar: string}}, 'foo.bar', number>>().toBe<{readonly foo: {readonly bar: number}}>();
expectTypeOf<SetProperty<{readonly foo?: string}, 'foo', number>>().toBe<{readonly foo?: number}>();

// Readonly modifiers are preserved on a deeply readonly base
expectTypeOf<SetProperty<ReadonlyDeep<{a: {b: {c: string}}}>, 'a.b.c', number>>().toBe<{readonly a: {readonly b: {readonly c: number}}}>();

// Readonly and optional combined: the result of setting into a new container is a new object without the modifiers
expectTypeOf<SetProperty<{readonly foo?: {readonly bar: string}}, 'foo.bar', number>>().toBe<{readonly foo?: {bar: number} | {readonly bar: number}}>();

// A value that is not an object is replaced by a new object at an intermediate position
expectTypeOf<SetProperty<{foo: boolean}, 'foo.bar', number>>().toBe<{foo: {bar: number}}>();
expectTypeOf<SetProperty<{foo: string}, 'foo.bar.baz', number>>().toBe<{foo: {bar: {baz: number}}}>();
// An `unknown` value at an intermediate position is replaced too, since it is not known to be an object
expectTypeOf<SetProperty<{foo: unknown}, 'foo.bar', number>>().toBe<{foo: {bar: number}}>();
// A function at an intermediate position gives a plain object, dropping the call signature
expectTypeOf<SetProperty<{callback: () => void}, 'callback.enabled', boolean>>().toBe<{callback: {enabled: boolean}}>();

// The value can be any type
expectTypeOf<SetProperty<{foo: string}, 'foo', number[]>>().toBe<{foo: number[]}>();
expectTypeOf<SetProperty<{foo: string}, 'foo', any>>().toBe<{foo: any}>();
expectTypeOf<SetProperty<{foo: string}, 'foo', unknown>>().toBe<{foo: unknown}>();
expectTypeOf<SetProperty<{foo: string}, 'foo', never>>().toBe<{foo: never}>();
// A union of values is kept as one value, not distributed
expectTypeOf<SetProperty<{foo: string}, 'foo', number | {bar: string}>>().toBe<{foo: number | {bar: string}}>();
expectTypeOf<SetProperty<{foo: string}, 'foo', () => void>>().toBe<{foo: () => void}>();
// A union of values is kept as one value when creating a key too
expectTypeOf<SetProperty<{}, 'foo', {a: 1} | {b: 2}>>().toBe<{foo: {a: 1} | {b: 2}}>();

// A union already at the property is walked member by member, so identical shapes can show as a repeated union member
expectTypeOf<SetProperty<{foo: {bar: 1} | {bar: string}}, 'foo.bar', number>>().toBeAssignableTo<{foo: {bar: number}}>();

// A union of base types sets each member on its own, and the results union
expectTypeOf<SetProperty<{foo: string; bar: number}, 'foo.bar', boolean>>().toBe<{foo: {bar: boolean}; bar: number}>();
expectTypeOf<SetProperty<{foo: string} | {foo: {bar: number}}, 'foo.bar', boolean>>().toBeAssignableTo<{foo: {bar: boolean}}>();

// Union of paths
expectTypeOf<SetProperty<{foo: string; bar: string}, 'foo' | 'bar', number>>().toBe<{foo: number; bar: string} | {foo: string; bar: number}>();
// A union of keys in the array form sets each key on its own, the same as a union of paths
expectTypeOf<SetProperty<{foo: string; bar: string}, ['foo' | 'bar'], number>>().toBe<{foo: number; bar: string} | {foo: string; bar: number}>();
expectTypeOf<SetProperty<{0: string; 1: string}, [0 | 1], number>>().toBe<{0: number; 1: string} | {0: string; 1: number}>();
expectTypeOf<SetProperty<['a', 'b'], [0 | 1], number>>().toBe<[number, 'b'] | ['a', number]>();
// A union of keys deeper in the path sets each key on its own
expectTypeOf<SetProperty<{a: {x: string; y: string}}, ['a', 'x' | 'y'], boolean>>().toBe<{a: {x: boolean; y: string} | {x: string; y: boolean}}>();
// A union of paths in different forms sets each path on its own
expectTypeOf<SetProperty<{a: {b: 1}}, 'a.b' | ['a'], string>>().toBe<{a: {b: string}} | {a: string}>();
// A union of paths at different depths sets each path on its own
expectTypeOf<SetProperty<{a: {b: string}}, 'a' | 'a.b', number>>().toBe<{a: number} | {a: {b: number}}>();

// Bracket notation paths
expectTypeOf<SetProperty<{users: [{name: string}]}, 'users[0].name', number>>().toBe<{users: [{name: number}]}>();
expectTypeOf<SetProperty<{list: [[string]]}, 'list[0][1]', number>>().toBe<{list: [Array<string | number>]}>();
expectTypeOf<SetProperty<{list: [[string]]}, 'list.0.1', number>>().toBe<{list: [Array<string | number>]}>();

// A quoted bracket key is not unquoted, so it names the key with the quotes included
expectTypeOf<SetProperty<{a: {b: string}}, 'a["b"]', number>>().toBe<{a: {b: string; '"b"': number}}>();

// An empty segment names the empty-string key
expectTypeOf<SetProperty<{a: {'': {b: 1}}}, 'a..b', number>>().toBe<{a: {'': {b: number}}}>();

// Number keys match either spelling
expectTypeOf<SetProperty<{0: string}, '0', number>>().toBe<{0: number}>();
expectTypeOf<SetProperty<{'0': string}, '0', number>>().toBe<{'0': number}>();
expectTypeOf<SetProperty<{0: string}, 0, number>>().toBe<{0: number}>();
// A number path matches a string-spelled key
expectTypeOf<SetProperty<{'1': string}, 1, number>>().toBe<{'1': number}>();
// A fractional key is matched through its number spelling
expectTypeOf<SetProperty<{[1.5]: string}, [1.5], number>>().toBe<{1.5: number}>();
// A negative key is matched through its number spelling too
expectTypeOf<SetProperty<{[-1]: string}, '-1', number>>().toBe<{[-1]: number}>();

// Numeric keys are matched by their canonical spelling
expectTypeOf<SetProperty<{0: string}, '00', number>>().toBe<{0: string; '00': number}>();
// Numeric keys are matched by their canonical spelling deeper in a path too
expectTypeOf<SetProperty<{a: {0: string}}, 'a.00', number>>().toBe<{a: {0: string; '00': number}}>();

// Symbol keys are untouched
declare const symbolKey: unique symbol;
expectTypeOf<SetProperty<{[symbolKey]: string; foo: number}, 'foo', boolean>>().toBe<{[symbolKey]: string; foo: boolean}>();

// A string-enum key is not matched by its value or the member itself, so the created key merges with the untouched member
enum Field {
	Name = 'name',
}

expectTypeOf<SetProperty<{[Field.Name]: string}, 'name', number>>().toBe<{name: never}>();
// A deeper path intersects the old and new values instead of absorbing them
expectTypeOf<SetProperty<{[Field.Name]: {age: string}}, 'name.age', number>>().toBe<{name: {age: string} & {age: number}}>();

// Index signatures
expectTypeOf<SetProperty<Record<string, {bar: number}>, 'foo.bar', string>>().toBe<{[x: string]: {bar: number} | {bar: string}}>();
expectTypeOf<SetProperty<Record<string, number>, 'foo', string>>().toBe<{[x: string]: number | string}>();
expectTypeOf<SetProperty<Record<string, any>, 'foo.bar', number>>().toBe<{[x: string]: any}>();
expectTypeOf<SetProperty<{[key: number]: string}, 0, number>>().toBe<{[x: number]: string | number}>();
expectTypeOf<SetProperty<{[key: number]: string}, '0', number>>().toBe<{[x: number]: string | number}>();

// A key under an index signature unions, even when a member declares it, since the signature constrains every key
expectTypeOf<SetProperty<{[key: string]: number; foo: number}, 'foo', string>>().toBe<{[x: string]: number | string; foo: number | string}>();

// A key covered by no signature is created beside it
expectTypeOf<SetProperty<{[key: number]: string}, 'foo', number>>().toBe<{[x: number]: string; foo: number}>();

// Every index signature covering the key must admit the new value.
type WithOverlappingIndexSignatures = {[key: string]: string | number; [key: number]: number};
expectTypeOf<SetProperty<WithOverlappingIndexSignatures, '0', boolean>>().toBe<{[key: string]: string | number | boolean; [key: number]: number | boolean}>();
expectTypeOf<SetProperty<{[key: `data-${string}`]: number}, 'data-id', string>>().toBe<{[key: `data-${string}`]: number | string}>();
// A template signature on numbers covers canonical numeric spellings
expectTypeOf<SetProperty<{[key: `data-${number}`]: string}, 'data-1', number>>().toBe<{[key: `data-${number}`]: string | number}>();
// A key covered by no template signature is created beside it
expectTypeOf<SetProperty<{[key: `data-${string}`]: number}, 'other', string>>().toBe<{[key: `data-${string}`]: number; other: string}>();
// A non-canonical numeric spelling is not covered by a number signature and is created beside it
expectTypeOf<SetProperty<{[key: number]: string}, '01', number>>().toBe<{[key: number]: string; '01': number}>();

// A deep write can create a dictionary entry without the other fields of an existing entry.
type UpdatedDictionary = SetProperty<Record<string, {id: number}>, 'alice.name', string>;
expectTypeOf<{alice: {name: string}}>().toBeAssignableTo<UpdatedDictionary>();
expectTypeOf<{alice: {id: number; name: string}}>().toBeAssignableTo<UpdatedDictionary>();
expectTypeOf<{alice: {name: number}}>().not.toBeAssignableTo<UpdatedDictionary>();
expectTypeOf<{0: {name: string}}>().toBeAssignableTo<SetProperty<Record<number, {id: number}>, '0.name', string>>();
// An explicitly declared required property still keeps its other fields.
type WithDeclaredUser = {[key: string]: {id: number}; alice: {id: number}};
expectTypeOf<SetProperty<WithDeclaredUser, 'alice.name', string>['alice']>().toBe<{id: number} | {id: number; name: string}>();
// A declared required property under a covering signature keeps its old value and gains the deep-set shape, and the signature unions them too
expectTypeOf<SetProperty<{[key: string]: number; foo: number}, 'foo.bar', string>>().toBe<{[key: string]: number | {bar: string}; foo: number | {bar: string}}>();
// A record with literal union keys is a plain object with those keys
expectTypeOf<SetProperty<Record<'a' | 'b', number>, 'a', string>>().toBe<{a: string; b: number}>();

// Arrays of unknown length union the deep-set element
expectTypeOf<SetProperty<{users: Array<{name: string}>}, 'users[0].name', number>>().toBe<{users: Array<{name: string} | {name: number}>}>();
expectTypeOf<SetProperty<{users: Array<{name: string}>}, 'users.0.name', number>>().toBe<{users: Array<{name: string} | {name: number}>}>();
expectTypeOf<SetProperty<{users: Array<{name: string}>}, ['users', 0, 'name'], number>>().toBe<{users: Array<{name: string} | {name: number}>}>();
// A deep write unions the created shape with the existing element shape
expectTypeOf<SetProperty<{deep: {list: Array<{id: number}>}}, 'deep.list.0.id', string>>().toBe<{deep: {list: Array<{id: number} | {id: string}>}}>();
expectTypeOf<SetProperty<string[], 0, number>>().toBe<Array<string | number>>();
expectTypeOf<SetProperty<unknown[], 0, number>>().toBe<unknown[]>();
expectTypeOf<SetProperty<never[], 0, number>>().toBe<number[]>();
// A deep write into a `never` element type behaves like an absent element, so only the created shape remains
expectTypeOf<SetProperty<{a: never[]}, 'a.0.b', number>>().toBe<{a: Array<{b: number}>}>();
// A deep write into an `unknown` element stays `unknown`
expectTypeOf<SetProperty<{a: unknown[]}, 'a.0.b', number>>().toBe<{a: unknown[]}>();
// A negative index is outside any declared position, so it unions into the element type
expectTypeOf<SetProperty<string[], '-1', number>>().toBe<Array<string | number>>();
expectTypeOf<SetProperty<['a'], '-1', number>>().toBe<Array<number | 'a'>>();
// An array with `any` elements unions the deep-set element into `any`
expectTypeOf<SetProperty<any[], '0', number>>().toBe<any[]>();
// An empty tuple has no existing element, so the element type is the assigned value.
expectTypeOf<SetProperty<[], '0', number>>().toBe<number[]>();
// A deep write into an empty tuple creates the entry in an array of unknown length
expectTypeOf<SetProperty<[], '0.name', string>>().toBe<Array<{name: string}>>();

// An array index can be absent, so the updated element can also be a newly created object.
type UpdatedUsers = SetProperty<{users: Array<{id: number}>}, 'users.0.name', string>;
expectTypeOf<{users: [{name: string}]}>().toBeAssignableTo<UpdatedUsers>();
expectTypeOf<{users: [{id: number; name: string}]}>().toBeAssignableTo<UpdatedUsers>();
expectTypeOf<{users: [{name: number}]}>().not.toBeAssignableTo<UpdatedUsers>();
expectTypeOf<[{name: string}]>().toBeAssignableTo<SetProperty<ReadonlyArray<{id: number}>, '0.name', string>>();
// A known required tuple element exists and retains its other fields.
expectTypeOf<SetProperty<[{id: number}], '0.name', string>>().toBe<[{id: number; name: string}]>();

// A non-literal index on an array can be any element
expectTypeOf<SetProperty<{users: Array<{name: string}>}, `users.${number}.name`, number>>().toBe<{users: Array<{name: string} | {name: number}>}>();
expectTypeOf<SetProperty<{users: Array<{name: string}>}, ['users', number, 'name'], number>>().toBe<{users: Array<{name: string} | {name: number}>}>();

// Readonly arrays keep their modifier
expectTypeOf<SetProperty<readonly string[], '0', number>>().toBe<ReadonlyArray<string | number>>();
expectTypeOf<SetProperty<{arr: readonly string[]}, 'arr.0.foo', number>>().toBe<{arr: ReadonlyArray<string | {foo: number}>}>();
expectTypeOf<SetProperty<{arr: readonly unknown[]}, 'arr.0.foo', number>>().toBe<{arr: readonly unknown[]}>();

// Tuples
expectTypeOf<SetProperty<['a', 'b'], '0', number>>().toBe<[number, 'b']>();
expectTypeOf<SetProperty<['a', 'b'], '1', number>>().toBe<['a', number]>();
expectTypeOf<SetProperty<{list: ['a', 'b']}, 'list.1', number>>().toBe<{list: ['a', number]}>();

// An index past the end of a tuple falls back to an array of unknown length
expectTypeOf<SetProperty<['a', 'b'], '5', number>>().toBe<Array<'a' | 'b' | number>>();
expectTypeOf<SetProperty<readonly ['a', 'b'], '5', number>>().toBe<ReadonlyArray<'a' | 'b' | number>>();
expectTypeOf<[{id: number}, {name: string}]>().toBeAssignableTo<SetProperty<[{id: number}], '1.name', string>>();

// A non-literal index on a tuple falls back to an array of unknown length
expectTypeOf<SetProperty<['a', 'b'], `${number}`, number>>().toBe<Array<'a' | 'b' | number>>();

// Tuples with a rest element
expectTypeOf<SetProperty<[1, 2, ...number[]], '1', string>>().toBe<[1, string, ...number[]]>();
expectTypeOf<SetProperty<{list: [1, 2, ...number[]]}, 'list.0', string>>().toBe<{list: [string, 2, ...number[]]}>();
// An index inside the rest region falls back to an array of unknown length.
expectTypeOf<SetProperty<[1, 2, ...number[]], '3', string>>().toBe<Array<number | string>>();

// A tuple with a leading rest element has no static part, so it gives an array of unknown length
expectTypeOf<SetProperty<[...string[], 'end'], '0', number>>().toBe<Array<string | number>>();
// A rest element in the middle keeps the tuple shape, and the static element is replaced
expectTypeOf<SetProperty<[string, ...number[], boolean], '0', number>>().toBe<[number, ...number[], boolean]>();
// A deep write into a declared position of a tuple with a rest element keeps the shape
expectTypeOf<SetProperty<{t: [1, 2, ...number[]]}, 't.1.x', number>>().toBe<{t: [1, {x: number}, ...number[]]}>();
// A deep write into the rest region unions into the element type
expectTypeOf<SetProperty<{t: [1, 2, ...number[]]}, 't.3.x', number>>().toBe<{t: Array<number | {x: number}>}>();
// A write past the fixed prefix can replace the suffix itself.
expectTypeOf<['start', 'changed']>().toBeAssignableTo<SetProperty<[string, ...number[], boolean], '1', 'changed'>>();
expectTypeOf<SetProperty<readonly [string, ...number[], boolean], '1', 'changed'>>().toBe<ReadonlyArray<string | number | boolean>>();

// Readonly tuples keep their modifier
expectTypeOf<SetProperty<readonly ['a'], '0', number>>().toBe<readonly [number]>();
expectTypeOf<SetProperty<{list: readonly ['a', 'b']}, 'list.1', number>>().toBe<{list: readonly ['a', number]}>();

// Arrays with optional elements
expectTypeOf<SetProperty<['a', 'b'?], '0', number>>().toBe<[number, 'b'?]>();
expectTypeOf<SetProperty<['a', 'b'?], '1', number>>().toBe<['a', number?]>();
expectTypeOf<SetProperty<readonly [string?], '0', number>>().toBe<readonly [number?]>();
expectTypeOf<SetProperty<[string?, ...number[]], '0', boolean>>().toBe<[boolean?, ...number[]]>();

// A non-numeric key cannot name an array element
expectTypeOf<SetProperty<string[], 'length', number>>().toBe<never>();
// A non-index key cannot set into an array, even one that exists on arrays
expectTypeOf<SetProperty<string[], 'push', number>>().toBe<never>();
// A non-canonical numeric spelling does not name a tuple element
expectTypeOf<SetProperty<['a'], '01', number>>().toBe<never>();

// A key that contains a dot is addressed with the array form
expectTypeOf<SetProperty<{'a.b': {c: number}}, ['a.b', 'c'], string>>().toBe<{'a.b': {c: string}}>();

// Each array-form path segment is normalized like a whole branded path.
expectTypeOf<SetProperty<{name: string}, [Tagged<'name', 'Key'>], number>>().toBe<{name: number}>();
expectTypeOf<SetProperty<{user: {name: string}}, readonly ['user', Tagged<'name', 'Key'>], number>>().toBe<{user: {name: number}}>();
// A whole branded path is unwrapped the same way
expectTypeOf<SetProperty<{user: {name: string}}, Tagged<'user.name', 'Key'>, number>>().toBe<{user: {name: number}}>();

// Number paths read like their string form, including in the array form
expectTypeOf<SetProperty<{0: {a: string}}, [0, 'a'], number>>().toBe<{0: {a: number}}>();

// A non-literal path cannot be walked, so the type is returned unchanged
expectTypeOf<SetProperty<{foo: string}, string, number>>().toBe<{foo: string}>();
// An array path of unknown length cannot be walked, so the type is returned unchanged
expectTypeOf<SetProperty<{foo: string}, string[], number>>().toBe<{foo: string}>();
expectTypeOf<SetProperty<{a: {b: string}}, readonly ['a', ...string[]], number>>().toBe<{a: {b: string}}>();
// A non-literal key on an object cannot name a property, so the type is returned unchanged
expectTypeOf<SetProperty<{foo: {a: string; b: string}}, `foo.${number}`, number>>().toBe<{foo: {a: string; b: string}}>();
expectTypeOf<SetProperty<{'data-name': string}, `data-${string}`, number>>().toBe<{'data-name': string}>();

// Empty paths
expectTypeOf<SetProperty<{foo: string}, '', number>>().toBe<{foo: string; '': number}>();
expectTypeOf<SetProperty<{foo: string}, [], number>>().toBe<{foo: string}>();
expectTypeOf<SetProperty<{foo: string}, [] | ['foo'], number>>().toBe<{foo: string} | {foo: number}>();

// Maps and sets are replaced as terminal values
expectTypeOf<SetProperty<{map: Map<string, number>}, 'map', string>>().toBe<{map: string}>();
expectTypeOf<SetProperty<{set: Set<number>}, 'set', string>>().toBe<{set: string}>();
// A path into a non-plain object keeps its members and gains the created key
expectTypeOf<SetProperty<{date: Date}, 'date.createdAt', string>>().toBeAssignableTo<{date: {createdAt: string}}>();
// A path into a `Map` sets its own property, flattening it to a plain object
expectTypeOf<SetProperty<{map: Map<string, number>}, 'map.size', number>>().toBeAssignableTo<{map: {size: number}}>();

// Intersections and derived object types work as the base
expectTypeOf<SetProperty<{a: string} & {b: number}, 'a', boolean>>().toBe<{a: boolean; b: number}>();
expectTypeOf<SetProperty<Omit<{a: string; b: number; c: boolean}, 'c'>, 'a', number>>().toBe<{a: number; b: number}>();

// Changing a property preserves class instances in siblings and replacement values.
class User {
	get #name() {
		return 'Alice';
	}

	get name() {
		return this.#name;
	}
}

expectTypeOf<SetProperty<{user: User; enabled: boolean}, 'enabled', true>>().toBe<{user: User; enabled: true}>();
expectTypeOf<SetProperty<{user: string}, 'user', User>>().toBe<{user: User}>();
expectTypeOf<SetProperty<{user: string}, 'user', {profile: User}>>().toBe<{user: {profile: User}}>();
// A path into a class instance flattens it to a plain object, keeping public members and dropping private ones
expectTypeOf<SetProperty<{user: User}, 'user.name', string>>().toBe<{user: {readonly name: string}}>();

// Special values
expectTypeOf<SetProperty<any, 'foo.bar', number>>().toBe<any>();
expectTypeOf<SetProperty<{foo: any}, 'foo.bar', number>>().toBe<{foo: any}>();
expectTypeOf<SetProperty<never, 'foo', number>>().toBe<never>();
// A `never` value absorbs the set value deeper in a path too
expectTypeOf<SetProperty<{foo: never}, 'foo.bar', number>>().toBe<{foo: never}>();
// A `never` property absorbs the set value at the top level too
expectTypeOf<SetProperty<{foo: never}, 'foo', number>>().toBe<{foo: never}>();
// A `never` tuple element absorbs the set value at any depth too
expectTypeOf<SetProperty<[never, string], '0', number>>().toBe<[never, string]>();
expectTypeOf<SetProperty<[never, string], '0.x', number>>().toBe<[never, string]>();

// The result can type a function that sets a property at a key path, like `dot-prop`'s `setProperty`
declare function setPropertyAt<BaseType extends object, const Path extends string | number | ReadonlyArray<string | number>>(
	object: BaseType,
	path: Path,
	value: number,
): SetProperty<BaseType, Path, number>;

expectTypeOf(setPropertyAt({} as {theme: {color: string}}, 'theme.fontSize', 12)).toBe<{theme: {color: string; fontSize: number}}>();

// A nullish value is replaced by a new object, like `dot-prop` and Lodash do at runtime
expectTypeOf<SetProperty<{foo: null}, 'foo.bar', number>>().toBe<{foo: {bar: number}}>();
expectTypeOf<SetProperty<{foo: undefined}, 'foo.bar', number>>().toBe<{foo: {bar: number}}>();
expectTypeOf<SetProperty<{foo: null}, 'foo', number>>().toBe<{foo: number}>();
expectTypeOf<SetProperty<{foo: undefined}, 'foo', number>>().toBe<{foo: number}>();
expectTypeOf<SetProperty<{foo: null}, 'foo.bar.baz', number>>().toBe<{foo: {bar: {baz: number}}}>();
// A nullish value behind an optional property sets into a new object, and the identical result of the non-nullish member collapses with it
expectTypeOf<SetProperty<{foo?: string}, 'foo.bar', number>>().toBe<{foo?: {bar: number}}>();
// A nullish member of a union is replaced by a new object, and the other members still set. Shapes that coincide can show as a repeated union member.
expectTypeOf<SetProperty<{foo: {bar: string} | null}, 'foo.bar', number>>().toBeAssignableTo<{foo: {bar: number}}>();
expectTypeOf<SetProperty<{foo: {bar: string} | null}, 'foo.baz', number>>().toBe<{foo: {bar: string; baz: number} | {baz: number}}>();
expectTypeOf<SetProperty<{arr: [{name: string} | null]}, 'arr.0.baz', number>>().toBe<{arr: [{name: string; baz: number} | {baz: number}]}>();

// Should not accept a non-object base type
// @ts-expect-error
type Invalid = SetProperty<number, 'foo', string>;
