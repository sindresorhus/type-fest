import {expectTypeOf} from 'nz';
import type {ArrayGroupBy, TupleOf} from '../index.d.ts';

type Routes = [{method: 'GET'; path: '/users'}, {method: 'POST'; path: '/users'}, {method: 'GET'; path: '/health'}];
expectTypeOf<ArrayGroupBy<Routes, 'method'>>().toBe<{
	GET: [{method: 'GET'; path: '/users'}, {method: 'GET'; path: '/health'}];
	POST: [{method: 'POST'; path: '/users'}];
}>();
expectTypeOf<ArrayGroupBy<Readonly<Routes>, 'method'>>().toBe<{
	GET: readonly [{method: 'GET'; path: '/users'}, {method: 'GET'; path: '/health'}];
	POST: readonly [{method: 'POST'; path: '/users'}];
}>();
expectTypeOf<ArrayGroupBy<[], 'kind'>>().toBe<{}>();

// Reading a normal-sized group must not expand a chain of mapped accumulators.
expectTypeOf<ArrayGroupBy<TupleOf<60, {kind: 'a'}>, 'kind'>['a']['length']>().toBe<60>();
type MixedGroups = ArrayGroupBy<[{kind: 'rare'}, ...TupleOf<59, {kind: 'common'}>], 'kind'>;
expectTypeOf<MixedGroups['rare']>().toBe<[{kind: 'rare'}]>();
expectTypeOf<MixedGroups['common']['length']>().toBe<59>();
expectTypeOf<ArrayGroupBy<Array<{kind: 'a'; value: 1} | {kind: 'b'; value: 2}>, 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<ReadonlyArray<{kind: 'a'}>, 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: 'a'}, ...Array<{kind: 'b'}>], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: 1}, {kind: 2}, {kind: 1}], 'kind'>>().toBe<{1: [{kind: 1}, {kind: 1}]; 2: [{kind: 2}]}>();
expectTypeOf<ArrayGroupBy<[{kind: 0; value: 1}, {kind: '0'; value: 2}], 'kind'>>().toBe<{0: [{kind: 0; value: 1}, {kind: '0'; value: 2}]}>();
expectTypeOf<ArrayGroupBy<[{kind: '0'; value: 1}, {kind: 0; value: 2}], 'kind'>>().toBe<{'0': [{kind: '0'; value: 1}, {kind: 0; value: 2}]}>();
expectTypeOf<ArrayGroupBy<[{0: 'a'}], '0'>>().toBe<{a: [{0: 'a'}]}>();
expectTypeOf<ArrayGroupBy<[{'0': 'a'}], 0>>().toBe<{a: [{'0': 'a'}]}>();
expectTypeOf<ArrayGroupBy<[{kind: 'a'}] | [{kind: 'b'}], 'kind'>>().toBe<{a: [{kind: 'a'}]} | {b: [{kind: 'b'}]}>();

declare const identifier: unique symbol;
expectTypeOf<ArrayGroupBy<[{kind: typeof identifier}], 'kind'>>().toBe<{[identifier]: [{kind: typeof identifier}]}>();
expectTypeOf<ArrayGroupBy<[{[identifier]: 'a'}], typeof identifier>>().toBe<{a: [{[identifier]: 'a'}]}>();
expectTypeOf<ArrayGroupBy<[{kind: 'a' | 'b'}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: 'a'} | {kind: 'b'}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: 'a'; value: 1} | {kind: 'a'; value: 2}], 'kind'>>().toBe<{a: [{kind: 'a'; value: 1} | {kind: 'a'; value: 2}]}>();
expectTypeOf<ArrayGroupBy<[{kind: string}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: boolean}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind?: 'a'}], 'kind'>>().toBe<never>();
// @ts-expect-error The selected property must be a key of the elements.
type EmptyItemKey = ArrayGroupBy<[{}], 'kind'>;
expectTypeOf<ArrayGroupBy<[{kind: any}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: never}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: unknown}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<any, 'kind'>>().toBe<any>();
expectTypeOf<ArrayGroupBy<never, 'kind'>>().toBe<never>();
expectTypeOf<{GET: []}>().not.toBeAssignableTo<ArrayGroupBy<Routes, 'method'>>();

// @ts-expect-error The input must be an array of objects.
type UnknownItems = ArrayGroupBy<unknown, 'kind'>;
// @ts-expect-error Optional tuple elements are not accepted.
type OptionalItems = ArrayGroupBy<[{kind: 'a'}?], 'kind'>;
// @ts-expect-error The selected property must be a property key.
type UnknownKey = ArrayGroupBy<Routes, unknown>;

// Several groups, keeping input order inside each group.
type Events = [
	{type: 'click'; id: 1},
	{type: 'key'; id: 2},
	{type: 'click'; id: 3},
	{type: 'scroll'; id: 4},
	{type: 'key'; id: 5},
];
expectTypeOf<ArrayGroupBy<Events, 'type'>>().toBe<{
	click: [{type: 'click'; id: 1}, {type: 'click'; id: 3}];
	key: [{type: 'key'; id: 2}, {type: 'key'; id: 5}];
	scroll: [{type: 'scroll'; id: 4}];
}>();
expectTypeOf<ArrayGroupBy<[{kind: 'a'}, {kind: 'a'}], 'kind'>>().toBe<{a: [{kind: 'a'}, {kind: 'a'}]}>();
expectTypeOf<ArrayGroupBy<[{kind: 'a'; extra: true}, {kind: 'a'}], 'kind'>>().toBe<{a: [{kind: 'a'; extra: true}, {kind: 'a'}]}>();

// Grouping by a different property of the same items.
expectTypeOf<ArrayGroupBy<Routes, 'path'>>().toBe<{
	'/users': [{method: 'GET'; path: '/users'}, {method: 'POST'; path: '/users'}];
	'/health': [{method: 'GET'; path: '/health'}];
}>();

// `as const` values are readonly, both the groups and the items.
const routes = [
	{method: 'GET', path: '/'},
	{method: 'PUT', path: '/'},
] as const;
expectTypeOf<ArrayGroupBy<typeof routes, 'method'>>().toBe<{
	GET: readonly [{readonly method: 'GET'; readonly path: '/'}];
	PUT: readonly [{readonly method: 'PUT'; readonly path: '/'}];
}>();

// Mixed key types.
expectTypeOf<ArrayGroupBy<[{kind: 1}, {kind: 'a'}, {kind: typeof identifier}], 'kind'>>().toBe<{
	1: [{kind: 1}];
	a: [{kind: 'a'}];
	[identifier]: [{kind: typeof identifier}];
}>();
expectTypeOf<ArrayGroupBy<[{1: 'a'}, {1: 'b'}], 1>>().toBe<{a: [{1: 'a'}]; b: [{1: 'b'}]}>();

enum Kind {
	First = 'first',
	Second = 'second',
}
expectTypeOf<ArrayGroupBy<[{kind: Kind.First}, {kind: Kind.Second}, {kind: Kind.First}], 'kind'>>().toBe<{
	[Kind.First]: [{kind: Kind.First}, {kind: Kind.First}];
	[Kind.Second]: [{kind: Kind.Second}];
}>();

// Tuples are objects too, so they can be grouped by an index.
expectTypeOf<ArrayGroupBy<[['a', 1], ['b', 2], ['a', 3]], 0>>().toBe<{a: [['a', 1], ['a', 3]]; b: [['b', 2]]}>();

// Interfaces.
type Item = {readonly kind: 'item'};
expectTypeOf<ArrayGroupBy<[Item, Item], 'kind'>>().toBe<{item: [Item, Item]}>();

// Unions of keys distribute.
expectTypeOf<ArrayGroupBy<[{a: 'x'; b: 'y'}], 'a' | 'b'>>().toBe<{x: [{a: 'x'; b: 'y'}]} | {y: [{a: 'x'; b: 'y'}]}>();
// @ts-expect-error Every key in a union must be a key of the elements.
type PartlyMissingKey = ArrayGroupBy<[{a: 'x'}], 'a' | 'missing'>;
expectTypeOf<ArrayGroupBy<[{a: 'x'}], never>>().toBe<never>();

// Every element must have one literal group value.
// @ts-expect-error The selected property must be a key of every element.
type MissingItemKey = ArrayGroupBy<[{kind: 'a'}, {}], 'kind'>;
expectTypeOf<ArrayGroupBy<[{kind: 'a'}, {kind: 'a' | 'b'}], 'kind'>>().toBe<never>();
// @ts-expect-error A misspelled key is rejected instead of giving `never`.
type MisspelledKey = ArrayGroupBy<Routes, 'methd'>;
expectTypeOf<ArrayGroupBy<[{kind: number}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: symbol}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: `item-${string}`}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: null}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: undefined}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: true}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: 'a' | undefined}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[{kind: {}}], 'kind'>>().toBe<never>();
expectTypeOf<ArrayGroupBy<[Record<string, 'a'>], 'kind'>>().toBe<{a: [Record<string, 'a'>]}>();

// Unions of arrays, where invalid members are dropped.
expectTypeOf<ArrayGroupBy<[{kind: 'a'}] | Array<{kind: 'b'}>, 'kind'>>().toBe<{a: [{kind: 'a'}]}>();
expectTypeOf<ArrayGroupBy<[{kind: 'a'}] | readonly [{kind: 'b'}], 'kind'>>().toBe<{a: [{kind: 'a'}]} | {b: readonly [{kind: 'b'}]}>();

// Long tuples.
expectTypeOf<ArrayGroupBy<TupleOf<300, {kind: 'a'}>, 'kind'>['a']['length']>().toBe<300>();
expectTypeOf<ArrayGroupBy<[...TupleOf<100, {kind: 'a'}>, ...TupleOf<100, {kind: 'b'}>], 'kind'>['b']['length']>().toBe<100>();

// Assignability and access.
expectTypeOf<ArrayGroupBy<Readonly<Routes>, 'method'>>().not.toBeAssignableTo<ArrayGroupBy<Routes, 'method'>>();
expectTypeOf<ArrayGroupBy<Routes, 'method'>>().toBeAssignableTo<ArrayGroupBy<Readonly<Routes>, 'method'>>();

declare const groups: ArrayGroupBy<Routes, 'method'>;
expectTypeOf(groups.POST[0].path).toBe<'/users'>();
// @ts-expect-error There is no `PUT` group.
const _missingGroup: unknown = groups.PUT;
// @ts-expect-error The `POST` group has only one route.
const _missingRoute: unknown = groups.POST[1];
