import {expectTypeOf} from 'nz';
import type {ExactKey, IsEqual, Tagged} from '../index.d.ts';

declare const symbolKey: unique symbol;

// `ExactKey` reports the key in the exact form the object declares it.
type Mixed = {0: number; '1': string};
expectTypeOf<IsEqual<ExactKey<Mixed, '0'>, 0>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Mixed, 0>, 0>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Mixed, '1'>, '1'>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Mixed, 1>, '1'>>().toBe<true>();

// Numeric index signatures only cover canonical numeric property names.
expectTypeOf<IsEqual<ExactKey<Record<number, string>, '00'>, never>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Record<number, string>, '0x10'>, never>>().toBe<true>();

// Exact spellings still resolve, including decimals and the original form of declared keys.
expectTypeOf<ExactKey<Record<number, string>, '16'>>().toBe<16>();
expectTypeOf<ExactKey<Record<number, string>, '-2'>>().toBe<-2>();
expectTypeOf<ExactKey<Record<number, string>, '1.5'>>().toBe<1.5>();
expectTypeOf<ExactKey<Record<number, string>, '1e3' | '-0' | '+1' | ' 1'>>().toBe<never>();
expectTypeOf<ExactKey<Record<number, string>, `${number}`>>().toBe<number>();
expectTypeOf<ExactKey<Record<string, string>, '00'>>().toBe<'00'>();
expectTypeOf<ExactKey<Record<number, string> & {'00': boolean}, '00'>>().toBe<'00'>();
expectTypeOf<ExactKey<{readonly '1.5'?: string}, 1.5>>().toBe<'1.5'>();
expectTypeOf<ExactKey<{[symbolKey]: string}, typeof symbolKey>>().toBe<typeof symbolKey>();

enum ExactCounterKey {
	First,
}

expectTypeOf<ExactKey<{[ExactCounterKey.First]: string}, '0'>>().toBe<0>();
expectTypeOf<ExactKey<Record<number, string>, Tagged<1, 'Index'>>>().toBe<Tagged<1, 'Index'>>();
expectTypeOf<ExactKey<Record<number, string>, never>>().toBe<never>();
expectTypeOf<ExactKey<{name: string}, any>>().toBe<any>();
expectTypeOf<ExactKey<any, '00'>>().toBe<'00'>();
// @ts-expect-error Unknown does not describe an object whose keys can be looked up.
expectTypeOf<ExactKey<unknown, 'name'>>();

function _exactNumericKey<Value>(key: number): ExactKey<Record<number, Value>, number> {
	return key;
}

function _readExactLiteralKey<Value>(key: ExactKey<{0: Value}, '0'>): 0 {
	return key;
}

// Key unions resolve independently, dropping missing keys and merging aliases.
expectTypeOf<ExactKey<Mixed, '0' | 1 | 'missing'>>().toBe<0 | '1'>();
expectTypeOf<ExactKey<Mixed, 0 | '0' | 1 | '1'>>().toBe<0 | '1'>();
expectTypeOf<ExactKey<Mixed, keyof Mixed>>().toBe<keyof Mixed>();
expectTypeOf<ExactKey<Mixed, 'missing' | 2>>().toBe<never>();
expectTypeOf<ExactKey<Mixed, string | number | symbol>>().toBe<never>();

// Ordinary keys, optional properties, and property values do not affect matching.
type Properties = {readonly name?: string; missingValue: never; dynamic: any; unspecified: unknown; '': undefined};
expectTypeOf<ExactKey<Properties, 'name' | 'missingValue' | 'dynamic' | 'unspecified' | ''>>().toBe<keyof Properties>();
expectTypeOf<ExactKey<{readonly 2?: string}, '2'>>().toBe<2>();
expectTypeOf<ExactKey<{readonly '2'?: string}, 2>>().toBe<'2'>();
expectTypeOf<ExactKey<{}, 'toString' | 'constructor' | '__proto__'>>().toBe<never>();
expectTypeOf<ExactKey<object, PropertyKey>>().toBe<never>();

// Both conversion directions work for negative keys and decimal property names.
expectTypeOf<ExactKey<{[-2]: string}, '-2'>>().toBe<-2>();
expectTypeOf<ExactKey<{'-2': string}, -2>>().toBe<'-2'>();
expectTypeOf<ExactKey<{1.5: string}, '1.5'>>().toBe<1.5>();
expectTypeOf<ExactKey<{1: string}, '01' | '1.0'>>().toBe<never>();
expectTypeOf<ExactKey<{'01': string; '1.0': string}, 1>>().toBe<never>();
expectTypeOf<ExactKey<{'01': string; '1.0': string}, '01' | '1.0'>>().toBe<'01' | '1.0'>();

// Symbols retain their identity and never match their description as a string.
declare const otherSymbol: unique symbol;
expectTypeOf<ExactKey<{[symbolKey]: string}, typeof otherSymbol | symbol | 'symbolKey'>>().toBe<never>();
expectTypeOf<ExactKey<{[symbolKey]: string; 0: number}, typeof symbolKey | '0'>>().toBe<typeof symbolKey | 0>();
expectTypeOf<ExactKey<Record<symbol, string>, symbol>>().toBe<symbol>();
expectTypeOf<ExactKey<Record<symbol, string>, typeof symbolKey>>().toBe<typeof symbolKey>();
expectTypeOf<ExactKey<Record<symbol, string>, string | number>>().toBe<never>();

// Index signatures preserve accepted keys instead of widening them to the signature.
expectTypeOf<ExactKey<Record<number, string>, 3 | '4' | 'missing'>>().toBe<3 | 4>();
expectTypeOf<ExactKey<Record<number, string>, number>>().toBe<number>();
expectTypeOf<ExactKey<Record<number, string>, string>>().toBe<never>();
expectTypeOf<ExactKey<Record<string, string>, 3>>().toBe<'3'>();
expectTypeOf<ExactKey<Record<string, string>, number>>().toBe<`${number}`>();
expectTypeOf<ExactKey<{[key: string]: string}, 3>>().toBe<3>();
expectTypeOf<ExactKey<{[key: string]: string}, PropertyKey>>().toBe<string | number>();
expectTypeOf<ExactKey<Record<`data-${string}`, unknown>, 'data-id' | 'other'>>().toBe<'data-id'>();
expectTypeOf<ExactKey<Record<`${number}`, unknown>, 12>>().toBe<'12'>();
expectTypeOf<ExactKey<{[key: number]: string; '1': string}, 1 | '1'>>().toBe<1 | '1'>();

// Tuples accept both index forms through `keyof`; this type does not check bounds.
expectTypeOf<ExactKey<readonly [string, number?], '0' | 0 | '1' | 1>>().toBe<'0' | 0 | '1' | 1>();
expectTypeOf<ExactKey<readonly [string], '5'>>().toBe<5>();
expectTypeOf<ExactKey<string[], '0'>>().toBe<0>();
expectTypeOf<ExactKey<readonly string[], 'length'>>().toBe<'length'>();
expectTypeOf<ExactKey<string[], 'push'>>().toBe<'push'>();
expectTypeOf<ExactKey<readonly string[], 'push'>>().toBe<never>();

// Object unions follow `keyof` without distributing over their members.
type Response = {0: string; message: string; success: true} | {0: number; message: Error; failure: true};
expectTypeOf<ExactKey<Response, '0' | 'message' | 'success' | 'failure'>>().toBe<0 | 'message'>();
expectTypeOf<ExactKey<{0: string} | {'0': number}, '0' | 0>>().toBe<never>();
expectTypeOf<ExactKey<{0: string} & {'1': number}, '0' | 1>>().toBe<0 | '1'>();

enum Field {
	Name = 'name',
}

// Enum members already accepted by `keyof` keep their identity.
expectTypeOf<ExactKey<{[Field.Name]: string}, Field.Name>>().toBe<Field.Name>();
expectTypeOf<ExactKey<{[Field.Name]: string}, 'name'>>().toBe<never>();
expectTypeOf<ExactKey<{name: string}, Field.Name>>().toBe<Field.Name>();

// Special types follow the same `keyof` contract.
expectTypeOf<ExactKey<any, PropertyKey>>().toBe<PropertyKey>();
expectTypeOf<ExactKey<never, 'name'>>().toBe<'name'>();
expectTypeOf<ExactKey<{}, never>>().toBe<never>();
expectTypeOf<ExactKey<any, never>>().toBe<never>();
// @ts-expect-error The object must not be a primitive.
type InvalidObject = ExactKey<string, 'length'>;
// @ts-expect-error Unknown is not a property key.
type UnknownKey = ExactKey<Mixed, unknown>;
// @ts-expect-error Booleans are not property keys.
type InvalidKey = ExactKey<Mixed, true>;

// A generic indexed access works without an intersection or cast.
type IndexedAccess<ObjectType extends object, Key extends PropertyKey> = ObjectType[ExactKey<ObjectType, Key>];
type StatusMessages = {200: 'OK'; '404': 'Not found'};
expectTypeOf<IndexedAccess<StatusMessages, '200'>>().toBe<'OK'>();
expectTypeOf<IndexedAccess<StatusMessages, 404>>().toBe<'Not found'>();
expectTypeOf<IndexedAccess<StatusMessages, '500'>>().toBe<never>();
expectTypeOf<IndexedAccess<{readonly 0?: string}, '0'>>().toBe<string | undefined>();

// The documentation's generic `Pick` works without an intersection or cast.
type PickByKey<ObjectType extends object, Key extends PropertyKey> = Pick<ObjectType, ExactKey<ObjectType, Key>>;
expectTypeOf<PickByKey<StatusMessages, '200'>>().toBe<{200: 'OK'}>();
expectTypeOf<PickByKey<StatusMessages, 404 | '500'>>().toBe<{'404': 'Not found'}>();
