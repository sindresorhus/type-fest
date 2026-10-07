import {expectAssignable, expectType} from 'tsd';
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
expectType<PrimitiveObject>(literalObject);

// Readonly arrays must stay arrays
expectType<readonly number[]>({} as LiteralToPrimitiveDeep<readonly number[]>);
expectType<ReadonlyArray<{a: number}>>({} as LiteralToPrimitiveDeep<ReadonlyArray<{a: 1}>>);
expectType<{a: readonly number[]}>({} as LiteralToPrimitiveDeep<{a: readonly number[]}>);
expectType<number[]>({} as LiteralToPrimitiveDeep<number[]>);
expectType<{a: number}>({} as LiteralToPrimitiveDeep<{a: 1}>);

// A map or set is a container, not an object whose method names should be converted.
declare const mapValue: LiteralToPrimitiveDeep<Map<string, 1>>;
expectType<Map<string, number>>(mapValue);

declare const setValue: LiteralToPrimitiveDeep<Set<1>>;
expectType<Set<number>>(setValue);

declare const readonlyMapValue: LiteralToPrimitiveDeep<ReadonlyMap<string, 1>>;
expectType<ReadonlyMap<string, number>>(readonlyMapValue);

declare const readonlySetValue: LiteralToPrimitiveDeep<ReadonlySet<1>>;
expectType<ReadonlySet<number>>(readonlySetValue);

declare const nestedMapValue: LiteralToPrimitiveDeep<{map: Map<string, 1>}>;
expectType<{map: Map<string, number>}>(nestedMapValue);

// A class constructor is a function, so it is kept as is, like the other `*Deep` types keep it.
declare class ClassWithLiteralStatic {
	static literal: 'x';
	literal: 'y';
	constructor(literal?: 'y');
}

expectType<typeof ClassWithLiteralStatic>({} as LiteralToPrimitiveDeep<typeof ClassWithLiteralStatic>);

// A branded or tagged primitive is still a primitive, so it is collapsed to the primitive it wraps.
declare const brandedPrimitive: LiteralToPrimitiveDeep<Tagged<string, 'brand'>>;
expectType<string>(brandedPrimitive);

declare const nestedBrandedPrimitive: LiteralToPrimitiveDeep<{a: Tagged<1, 'brand'>}>;
expectType<{a: number}>(nestedBrandedPrimitive);

declare const brandedInArray: LiteralToPrimitiveDeep<Array<Tagged<1, 'brand'>>>;
expectType<number[]>(brandedInArray);

// Functions and non-recursive built-ins are kept as is, the way the other `*Deep` types keep them, instead of being mapped over and turned into an object of `{}` members.
declare const keepsFunction: LiteralToPrimitiveDeep<{fn: (x: number) => string; name: 'a'}>;
expectType<{fn: (x: number) => string; name: string}>(keepsFunction);

declare const keepsFunctionReturningLiteral: LiteralToPrimitiveDeep<{fn: () => 'a'}>;
expectType<{fn: () => 'a'}>(keepsFunctionReturningLiteral);

declare const keepsDate: LiteralToPrimitiveDeep<{date: Date}>;
expectType<{date: Date}>(keepsDate);

declare const keepsRegExp: LiteralToPrimitiveDeep<{pattern: RegExp}>;
expectType<{pattern: RegExp}>(keepsRegExp);

declare const keepsPromise: LiteralToPrimitiveDeep<{result: Promise<{a: 'x'}>}>;
expectType<{result: Promise<{a: 'x'}>}>(keepsPromise);

declare const keepsWeakMap: LiteralToPrimitiveDeep<{cache: WeakMap<object, string>}>;
expectType<{cache: WeakMap<object, string>}>(keepsWeakMap);

declare const keepsWeakSet: LiteralToPrimitiveDeep<{tags: WeakSet<object>}>;
expectType<{tags: WeakSet<object>}>(keepsWeakSet);

declare const keepsArrayBuffer: LiteralToPrimitiveDeep<{buffer: ArrayBuffer}>;
expectType<{buffer: ArrayBuffer}>(keepsArrayBuffer);

declare const keepsDataView: LiteralToPrimitiveDeep<{view: DataView}>;
expectType<{view: DataView}>(keepsDataView);

declare const keepsTypedArray: LiteralToPrimitiveDeep<{bytes: Uint8Array}>;
expectType<{bytes: Uint8Array}>(keepsTypedArray);

declare const keepsClassConstructor: LiteralToPrimitiveDeep<{class: typeof Date}>;
expectType<{class: typeof Date}>(keepsClassConstructor);

// A `WeakMap` and a `WeakSet` are kept as is, rather than being mapped member by member into a plain object. Their key must be a weak reference, so there is nothing to convert in the container, and keeping it means a value read out of it keeps its literal type.
declare const bareWeakMap: LiteralToPrimitiveDeep<WeakMap<object, 'x'>>;
expectType<'x' | undefined>(bareWeakMap.get({}));

declare const nestedWeakMap: LiteralToPrimitiveDeep<{cache: WeakMap<object, 'x'>}>;
expectType<'x' | undefined>(nestedWeakMap.cache.get({}));

// `unknown` is the top type rather than a literal, so there is nothing to convert and no primitive it belongs to. It used to be converted to `never`, which left an object that accepts nothing.
declare const unknownProperty: LiteralToPrimitiveDeep<{a: unknown}>;
expectType<{a: unknown}>(unknownProperty);

declare const nestedUnknown: LiteralToPrimitiveDeep<{a: {b: unknown}; readonly c: unknown}>;
expectType<{a: {b: unknown}; readonly c: unknown}>(nestedUnknown);

expectType<unknown>({} as LiteralToPrimitiveDeep<unknown>);

// A literal beside an `unknown` is still converted, so the guard does not swallow the conversion.
declare const mixedWithUnknown: LiteralToPrimitiveDeep<{a: unknown; b: 'x'; readonly c: 1}>;
expectType<{a: unknown; b: string; readonly c: number}>(mixedWithUnknown);

// `void` is a single value with no primitive it belongs to, so there is nothing to convert. It used to be converted to `never`, which left an object that accepts nothing, the same way `unknown` did.
declare const voidProperty: LiteralToPrimitiveDeep<{a: void}>;
expectType<{a: void}>(voidProperty);

declare const nestedVoid: LiteralToPrimitiveDeep<{a: {b: void}}>;
expectType<{a: {b: void}}>(nestedVoid);

// An index signature is a value like any other, so its value type is converted rather than the whole signature being dropped. `LiteralToPrimitiveDeep<Record<string, 1>>` used to be `{}`, which describes none of the values it was given, and a record is what `JSON.parse` hands back.
declare const record: LiteralToPrimitiveDeep<Record<string, 1>>;
expectType<{[k: string]: number}>(record);

declare const nestedRecord: LiteralToPrimitiveDeep<{a: Record<string, 1>}>;
expectType<{a: {[k: string]: number}}>(nestedRecord);

// A named key beside an index signature keeps its own type rather than being widened by it.
declare const mixedIndexSignature: LiteralToPrimitiveDeep<{[k: string]: number; a: 1}>;
expectType<{[k: string]: number; a: number}>(mixedIndexSignature);

// `object` is the top type among the non-primitives, so like `unknown` and `void` it is not a literal and there is nothing to convert. It went through the object branch, where `keyof object` is `never`, so it came back as `{}`, which is a different type: it accepts a string.
declare const objectProperty: LiteralToPrimitiveDeep<{a: object}>;
expectType<{a: object}>(objectProperty);

expectType<object>({} as LiteralToPrimitiveDeep<object>);

// A concrete object type still recurses, so the guard is on `object` itself and not on emptiness.
declare const concreteObject: LiteralToPrimitiveDeep<{a: {b: 'x'}}>;
expectType<{a: {b: string}}>(concreteObject);

// An optional key does not gain the `undefined` that its `?` contributes.
expectType<{a?: null}>({} as LiteralToPrimitiveDeep<{a?: null}>);
expectType<{a?: string}>({} as LiteralToPrimitiveDeep<{a?: 'x'}>);

declare const keepsDeclaredUndefined: LiteralToPrimitiveDeep<{a?: string | undefined}>;
expectType<{a?: string | undefined}>(keepsDeclaredUndefined);

// A required key is unaffected, because there the `undefined` was in the input to begin with.
declare const keepsRequired: LiteralToPrimitiveDeep<{a: null | undefined}>;
expectType<{a: null | undefined}>(keepsRequired);

// An `object` member is recognised as the top type through the `| undefined` an optional key is read with, so it does not become `{}`. Before, `LiteralToPrimitiveDeep<{a?: object}>` was `{a?: {}}`, and `{}` accepts a string, which the input does not.
declare const objectMember: LiteralToPrimitiveDeep<{a?: object}>;
expectType<{a?: object}>(objectMember);

declare const objectMemberWithSibling: LiteralToPrimitiveDeep<{a: string; b?: object}>;
expectType<{a: string; b?: object}>(objectMemberWithSibling);

declare const nullableObjectMember: LiteralToPrimitiveDeep<{a?: object | null}>;
expectType<{a?: object | null}>(nullableObjectMember);

// A tuple is an array, and the doc says the values inside an array are converted. Losing the tuple while converting it is a separate change that no sibling type makes: `SimplifyDeep`, `ReadonlyDeep`, `NonNullableDeep`, `RequiredDeep` and `UndefinedOnPartialDeep` all keep it.
declare const tuple: LiteralToPrimitiveDeep<[1, 'x']>;
expectType<[number, string]>(tuple);

declare const readonlyTuple: LiteralToPrimitiveDeep<readonly [1, 'x']>;
expectType<readonly [number, string]>(readonlyTuple);

declare const optionalElement: LiteralToPrimitiveDeep<[1, 2?]>;
expectType<[number, number?]>(optionalElement);

declare const trailingRest: LiteralToPrimitiveDeep<[string, ...Array<1 | 2>]>;
expectType<[string, ...number[]]>(trailingRest);

declare const nestedTuple: LiteralToPrimitiveDeep<{a: [1, {b: 'x'}]}>;
expectType<{a: [number, {b: string}]}>(nestedTuple);

// A plain array is unchanged in shape, which is what the tuple fix has to keep it doing.
declare const array: LiteralToPrimitiveDeep<Array<1 | 'x'>>;
expectType<Array<number | string>>(array);

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectType<readonly [number?, number?]>({} as LiteralToPrimitiveDeep<readonly [1?, 1?]>);

// `object` in a union is kept as is, like on its own.
expectType<{a: string | object}>({} as LiteralToPrimitiveDeep<{a: object | 'x'}>);

// A recursive element type is walked lazily, so it does not become infinitely deep.
expectAssignable<LiteralToPrimitiveDeep<{json: JsonValue}>>({json: [{a: 1}]});

// A long tuple, such as a long `as const` list, does not hit the instantiation depth limit.
declare const longTuple: LiteralToPrimitiveDeep<{items: Readonly<TupleOf<100, {id: 1}>>}>;
expectType<100>(longTuple.items.length);
expectType<{id: number}>(longTuple.items[99]);

// A union member that is as wide as `unknown` together with the others does not stop the rest from being converted.
expectType<{a: string | {} | null | undefined}>({} as LiteralToPrimitiveDeep<{a: 'x' | {} | null | undefined}>);
