import {expectTypeOf} from 'nz';
import type {IsEqual, JsonValue, LiteralToPrimitiveDeep, Tagged, TupleOf} from '../index.d.ts';

type LiteralObject = {
	a: string;
	b: number;
	c: boolean;
	d: {
		e: bigint;
		f: symbol;
		g: {
			h: string[];
			i: {
				j: boolean;
				k: {
					l: 1;
					m: 'hello';
					o: [1, 2, 3];
					p: ['a', 'b', 'c'];
					q: [1, 'a', true];
				};
			};
		};
	};
};

type PrimitiveObject = {
	a: string;
	b: number;
	c: boolean;
	d: {
		e: bigint;
		f: symbol;
		g: {
			h: string[];
			i: {
				j: boolean;
				k: {
					l: number;
					m: string;
					o: [number, number, number];
					p: [string, string, string];
					q: [number, string, boolean];
				};
			};
		};
	};
};

declare const literalObject: LiteralToPrimitiveDeep<LiteralObject>;
expectTypeOf(literalObject).toBe<PrimitiveObject>();

// Readonly arrays must stay arrays
expectTypeOf<LiteralToPrimitiveDeep<readonly number[]>>().toBe<readonly number[]>();
expectTypeOf<LiteralToPrimitiveDeep<ReadonlyArray<{a: 1}>>>().toBe<ReadonlyArray<{a: number}>>();
expectTypeOf<LiteralToPrimitiveDeep<{a: readonly number[]}>>().toBe<{a: readonly number[]}>();
expectTypeOf<LiteralToPrimitiveDeep<number[]>>().toBe<number[]>();
expectTypeOf<LiteralToPrimitiveDeep<{a: 1}>>().toBe<{a: number}>();

// A map or set is a container, not an object whose method names should be converted.
declare const mapValue: LiteralToPrimitiveDeep<Map<string, 1>>;
expectTypeOf(mapValue).toBe<Map<string, number>>();

declare const setValue: LiteralToPrimitiveDeep<Set<1>>;
expectTypeOf(setValue).toBe<Set<number>>();

declare const readonlyMapValue: LiteralToPrimitiveDeep<ReadonlyMap<string, 1>>;
expectTypeOf(readonlyMapValue).toBe<ReadonlyMap<string, number>>();

declare const readonlySetValue: LiteralToPrimitiveDeep<ReadonlySet<1>>;
expectTypeOf(readonlySetValue).toBe<ReadonlySet<number>>();

declare const nestedMapValue: LiteralToPrimitiveDeep<{map: Map<string, 1>}>;
expectTypeOf(nestedMapValue).toBe<{map: Map<string, number>}>();

// A class constructor is a function, so it is kept as is, like the other `*Deep` types keep it.
declare class ClassWithLiteralStatic {
	static literal: 'x';
	literal: 'y';
	constructor(literal?: 'y');
}

expectTypeOf<LiteralToPrimitiveDeep<typeof ClassWithLiteralStatic>>().toBe<typeof ClassWithLiteralStatic>();

// A branded or tagged primitive is still a primitive, so it is collapsed to the primitive it wraps.
declare const brandedPrimitive: LiteralToPrimitiveDeep<Tagged<string, 'brand'>>;
expectTypeOf(brandedPrimitive).toBe<string>();

declare const nestedBrandedPrimitive: LiteralToPrimitiveDeep<{a: Tagged<1, 'brand'>}>;
expectTypeOf(nestedBrandedPrimitive).toBe<{a: number}>();

declare const brandedInArray: LiteralToPrimitiveDeep<Array<Tagged<1, 'brand'>>>;
expectTypeOf(brandedInArray).toBe<number[]>();

// Functions and non-recursive built-ins are kept as is, the way the other `*Deep` types keep them, instead of being mapped over and turned into an object of `{}` members.
declare const keepsFunction: LiteralToPrimitiveDeep<{fn: (x: number) => string; name: 'a'}>;
expectTypeOf(keepsFunction).toBe<{fn: (x: number) => string; name: string}>();

declare const keepsFunctionReturningLiteral: LiteralToPrimitiveDeep<{fn: () => 'a'}>;
expectTypeOf(keepsFunctionReturningLiteral).toBe<{fn: () => 'a'}>();

declare const keepsDate: LiteralToPrimitiveDeep<{date: Date}>;
expectTypeOf(keepsDate).toBe<{date: Date}>();

declare const keepsRegExp: LiteralToPrimitiveDeep<{pattern: RegExp}>;
expectTypeOf(keepsRegExp).toBe<{pattern: RegExp}>();

declare const keepsPromise: LiteralToPrimitiveDeep<{result: Promise<{a: 'x'}>}>;
expectTypeOf(keepsPromise).toBe<{result: Promise<{a: 'x'}>}>();

declare const keepsWeakMap: LiteralToPrimitiveDeep<{cache: WeakMap<object, string>}>;
expectTypeOf(keepsWeakMap).toBe<{cache: WeakMap<object, string>}>();

declare const keepsWeakSet: LiteralToPrimitiveDeep<{tags: WeakSet<object>}>;
expectTypeOf(keepsWeakSet).toBe<{tags: WeakSet<object>}>();

declare const keepsArrayBuffer: LiteralToPrimitiveDeep<{buffer: ArrayBuffer}>;
expectTypeOf(keepsArrayBuffer).toBe<{buffer: ArrayBuffer}>();

declare const keepsDataView: LiteralToPrimitiveDeep<{view: DataView}>;
expectTypeOf(keepsDataView).toBe<{view: DataView}>();

declare const keepsTypedArray: LiteralToPrimitiveDeep<{bytes: Uint8Array}>;
expectTypeOf(keepsTypedArray).toBe<{bytes: Uint8Array}>();

declare const keepsClassConstructor: LiteralToPrimitiveDeep<{class: typeof Date}>;
expectTypeOf(keepsClassConstructor).toBe<{class: typeof Date}>();

// A `WeakMap` and a `WeakSet` are kept as is, rather than being mapped member by member into a plain object. Their key must be a weak reference, so there is nothing to convert in the container, and keeping it means a value read out of it keeps its literal type.
declare const bareWeakMap: LiteralToPrimitiveDeep<WeakMap<object, 'x'>>;
expectTypeOf(bareWeakMap.get({})).toBe<'x' | undefined>();

declare const nestedWeakMap: LiteralToPrimitiveDeep<{cache: WeakMap<object, 'x'>}>;
expectTypeOf(nestedWeakMap.cache.get({})).toBe<'x' | undefined>();

// `unknown` is the top type rather than a literal, so there is nothing to convert and no primitive it belongs to. It used to be converted to `never`, which left an object that accepts nothing.
declare const unknownProperty: LiteralToPrimitiveDeep<{a: unknown}>;
expectTypeOf(unknownProperty).toBe<{a: unknown}>();

declare const nestedUnknown: LiteralToPrimitiveDeep<{a: {b: unknown}; readonly c: unknown}>;
expectTypeOf(nestedUnknown).toBe<{a: {b: unknown}; readonly c: unknown}>();

expectTypeOf<LiteralToPrimitiveDeep<unknown>>().toBe<unknown>();

// A literal beside an `unknown` is still converted, so the guard does not swallow the conversion.
declare const mixedWithUnknown: LiteralToPrimitiveDeep<{a: unknown; b: 'x'; readonly c: 1}>;
expectTypeOf(mixedWithUnknown).toBe<{a: unknown; b: string; readonly c: number}>();

// `void` is a single value with no primitive it belongs to, so there is nothing to convert. It used to be converted to `never`, which left an object that accepts nothing, the same way `unknown` did.
declare const voidProperty: LiteralToPrimitiveDeep<{a: void}>;
expectTypeOf(voidProperty).toBe<{a: void}>();

declare const nestedVoid: LiteralToPrimitiveDeep<{a: {b: void}}>;
expectTypeOf(nestedVoid).toBe<{a: {b: void}}>();

// An index signature is a value like any other, so its value type is converted rather than the whole signature being dropped. `LiteralToPrimitiveDeep<Record<string, 1>>` used to be `{}`, which describes none of the values it was given, and a record is what `JSON.parse` hands back.
declare const record: LiteralToPrimitiveDeep<Record<string, 1>>;
expectTypeOf(record).toBe<{[k: string]: number}>();

declare const nestedRecord: LiteralToPrimitiveDeep<{a: Record<string, 1>}>;
expectTypeOf(nestedRecord).toBe<{a: {[k: string]: number}}>();

// A named key beside an index signature keeps its own type rather than being widened by it.
declare const mixedIndexSignature: LiteralToPrimitiveDeep<{[k: string]: number; a: 1}>;
expectTypeOf(mixedIndexSignature).toBe<{[k: string]: number; a: number}>();

// `object` is the top type among the non-primitives, so like `unknown` and `void` it is not a literal and there is nothing to convert. It went through the object branch, where `keyof object` is `never`, so it came back as `{}`, which is a different type: it accepts a string.
declare const objectProperty: LiteralToPrimitiveDeep<{a: object}>;
expectTypeOf(objectProperty).toBe<{a: object}>();

expectTypeOf<LiteralToPrimitiveDeep<object>>().toBe<object>();

// A concrete object type still recurses, so the guard is on `object` itself and not on emptiness.
declare const concreteObject: LiteralToPrimitiveDeep<{a: {b: 'x'}}>;
expectTypeOf(concreteObject).toBe<{a: {b: string}}>();

// An optional key does not gain the `undefined` that its `?` contributes.
expectTypeOf<LiteralToPrimitiveDeep<{a?: null}>>().toBe<{a?: null}>();
expectTypeOf<LiteralToPrimitiveDeep<{a?: 'x'}>>().toBe<{a?: string}>();

declare const keepsDeclaredUndefined: LiteralToPrimitiveDeep<{a?: string | undefined}>;
expectTypeOf(keepsDeclaredUndefined).toBe<{a?: string | undefined}>();

// A required key is unaffected, because there the `undefined` was in the input to begin with.
declare const keepsRequired: LiteralToPrimitiveDeep<{a: null | undefined}>;
expectTypeOf(keepsRequired).toBe<{a: null | undefined}>();

// An `object` member is recognised as the top type through the `| undefined` an optional key is read with, so it does not become `{}`. Before, `LiteralToPrimitiveDeep<{a?: object}>` was `{a?: {}}`, and `{}` accepts a string, which the input does not.
declare const objectMember: LiteralToPrimitiveDeep<{a?: object}>;
expectTypeOf(objectMember).toBe<{a?: object}>();

declare const objectMemberWithSibling: LiteralToPrimitiveDeep<{a: string; b?: object}>;
expectTypeOf(objectMemberWithSibling).toBe<{a: string; b?: object}>();

declare const nullableObjectMember: LiteralToPrimitiveDeep<{a?: object | null}>;
expectTypeOf(nullableObjectMember).toBe<{a?: object | null}>();

// A tuple is an array, and the doc says the values inside an array are converted. Losing the tuple while converting it is a separate change that no sibling type makes: `SimplifyDeep`, `ReadonlyDeep`, `NonNullableDeep`, `RequiredDeep` and `UndefinedOnPartialDeep` all keep it.
declare const tuple: LiteralToPrimitiveDeep<[1, 'x']>;
expectTypeOf(tuple).toBe<[number, string]>();

declare const readonlyTuple: LiteralToPrimitiveDeep<readonly [1, 'x']>;
expectTypeOf(readonlyTuple).toBe<readonly [number, string]>();

declare const optionalElement: LiteralToPrimitiveDeep<[1, 2?]>;
expectTypeOf(optionalElement).toBe<[number, number?]>();

declare const trailingRest: LiteralToPrimitiveDeep<[string, ...Array<1 | 2>]>;
expectTypeOf(trailingRest).toBe<[string, ...number[]]>();

declare const nestedTuple: LiteralToPrimitiveDeep<{a: [1, {b: 'x'}]}>;
expectTypeOf(nestedTuple).toBe<{a: [number, {b: string}]}>();

// A plain array is unchanged in shape, which is what the tuple fix has to keep it doing.
declare const array: LiteralToPrimitiveDeep<Array<1 | 'x'>>;
expectTypeOf(array).toBe<Array<number | string>>();

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectTypeOf<LiteralToPrimitiveDeep<readonly [1?, 1?]>>().toBe<readonly [number?, number?]>();

// `object` in a union is kept as is, like on its own.
expectTypeOf<LiteralToPrimitiveDeep<{a: object | 'x'}>>().toBe<{a: string | object}>();

// A recursive element type is walked lazily, so it does not become infinitely deep.
({json: [{a: 1}]}) satisfies LiteralToPrimitiveDeep<{json: JsonValue}>;

// A long tuple, such as a long `as const` list, does not hit the instantiation depth limit.
declare const longTuple: LiteralToPrimitiveDeep<{items: Readonly<TupleOf<100, {id: 1}>>}>;
expectTypeOf(longTuple.items.length).toBe<100>();
expectTypeOf(longTuple.items[99]).toBe<{id: number}>();

// A union member that is as wide as `unknown` together with the others does not stop the rest from being converted.
expectTypeOf<LiteralToPrimitiveDeep<{a: 'x' | {} | null | undefined}>>().toBe<{a: string | {} | null | undefined}>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<LiteralToPrimitiveDeep<{element: HTMLElement}>>().toBe<{element: HTMLElement}>();
