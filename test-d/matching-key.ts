import {expectTypeOf} from 'nz';
import type {MatchingKey, IsEqual, Tagged} from '../index.d.ts';

declare const symbolKey: unique symbol;

// `MatchingKey` reports the key in the exact form the object declares it.
type Mixed = {0: number; '1': string};
expectTypeOf<IsEqual<MatchingKey<Mixed, '0'>, 0>>().toBe<true>();
expectTypeOf<IsEqual<MatchingKey<Mixed, 0>, 0>>().toBe<true>();
expectTypeOf<IsEqual<MatchingKey<Mixed, '1'>, '1'>>().toBe<true>();
expectTypeOf<IsEqual<MatchingKey<Mixed, 1>, '1'>>().toBe<true>();

// Numeric index signatures only cover canonical numeric property names.
expectTypeOf<IsEqual<MatchingKey<Record<number, string>, '00'>, never>>().toBe<true>();
expectTypeOf<IsEqual<MatchingKey<Record<number, string>, '0x10'>, never>>().toBe<true>();

// Exact spellings still resolve, including decimals and the original form of declared keys.
expectTypeOf<MatchingKey<Record<number, string>, '16'>>().toBe<16>();
expectTypeOf<MatchingKey<Record<number, string>, '-2'>>().toBe<-2>();
expectTypeOf<MatchingKey<Record<number, string>, '1.5'>>().toBe<1.5>();
expectTypeOf<MatchingKey<Record<number, string>, '1e3' | '-0' | '+1' | ' 1'>>().toBe<never>();
expectTypeOf<MatchingKey<Record<number, string>, `${number}`>>().toBe<number>();
expectTypeOf<MatchingKey<Record<string, string>, '00'>>().toBe<'00'>();
expectTypeOf<MatchingKey<Record<number, string> & {'00': boolean}, '00'>>().toBe<'00'>();
expectTypeOf<MatchingKey<{readonly '1.5'?: string}, 1.5>>().toBe<'1.5'>();
expectTypeOf<MatchingKey<{[symbolKey]: string}, typeof symbolKey>>().toBe<typeof symbolKey>();

enum ExactCounterKey {
	First,
}

expectTypeOf<MatchingKey<{[ExactCounterKey.First]: string}, '0'>>().toBe<0>();
expectTypeOf<MatchingKey<Record<number, string>, Tagged<1, 'Index'>>>().toBe<Tagged<1, 'Index'>>();
expectTypeOf<MatchingKey<Record<number, string>, never>>().toBe<never>();
expectTypeOf<MatchingKey<{name: string}, any>>().toBe<any>();
expectTypeOf<MatchingKey<any, '00'>>().toBe<'00'>();
// @ts-expect-error Unknown does not describe an object whose keys can be looked up.
expectTypeOf<MatchingKey<unknown, 'name'>>();

function _exactNumericKey<Value>(key: number): MatchingKey<Record<number, Value>, number> {
	return key;
}

function _readExactLiteralKey<Value>(key: MatchingKey<{0: Value}, '0'>): 0 {
	return key;
}

// Key unions resolve independently, dropping missing keys and merging aliases.
expectTypeOf<MatchingKey<Mixed, '0' | 1 | 'missing'>>().toBe<0 | '1'>();
expectTypeOf<MatchingKey<Mixed, 0 | '0' | 1 | '1'>>().toBe<0 | '1'>();
expectTypeOf<MatchingKey<Mixed, keyof Mixed>>().toBe<keyof Mixed>();
expectTypeOf<MatchingKey<Mixed, 'missing' | 2>>().toBe<never>();
expectTypeOf<MatchingKey<Mixed, string | number | symbol>>().toBe<never>();

// Ordinary keys, optional properties, and property values do not affect matching.
type Properties = {readonly name?: string; missingValue: never; dynamic: any; unspecified: unknown; '': undefined};
expectTypeOf<MatchingKey<Properties, 'name' | 'missingValue' | 'dynamic' | 'unspecified' | ''>>().toBe<keyof Properties>();
expectTypeOf<MatchingKey<{readonly 2?: string}, '2'>>().toBe<2>();
expectTypeOf<MatchingKey<{readonly '2'?: string}, 2>>().toBe<'2'>();
expectTypeOf<MatchingKey<{}, 'toString' | 'constructor' | '__proto__'>>().toBe<never>();
expectTypeOf<MatchingKey<object, PropertyKey>>().toBe<never>();

// Both conversion directions work for negative keys and decimal property names.
expectTypeOf<MatchingKey<{[-2]: string}, '-2'>>().toBe<-2>();
expectTypeOf<MatchingKey<{'-2': string}, -2>>().toBe<'-2'>();
expectTypeOf<MatchingKey<{1.5: string}, '1.5'>>().toBe<1.5>();
expectTypeOf<MatchingKey<{1: string}, '01' | '1.0'>>().toBe<never>();
expectTypeOf<MatchingKey<{'01': string; '1.0': string}, 1>>().toBe<never>();
expectTypeOf<MatchingKey<{'01': string; '1.0': string}, '01' | '1.0'>>().toBe<'01' | '1.0'>();

// Symbols retain their identity and never match their description as a string.
declare const otherSymbol: unique symbol;
expectTypeOf<MatchingKey<{[symbolKey]: string}, typeof otherSymbol | symbol | 'symbolKey'>>().toBe<never>();
expectTypeOf<MatchingKey<{[symbolKey]: string; 0: number}, typeof symbolKey | '0'>>().toBe<typeof symbolKey | 0>();
expectTypeOf<MatchingKey<Record<symbol, string>, symbol>>().toBe<symbol>();
expectTypeOf<MatchingKey<Record<symbol, string>, typeof symbolKey>>().toBe<typeof symbolKey>();
expectTypeOf<MatchingKey<Record<symbol, string>, string | number>>().toBe<never>();

// Index signatures preserve accepted keys instead of widening them to the signature.
expectTypeOf<MatchingKey<Record<number, string>, 3 | '4' | 'missing'>>().toBe<3 | 4>();
expectTypeOf<MatchingKey<Record<number, string>, number>>().toBe<number>();
expectTypeOf<MatchingKey<Record<number, string>, string>>().toBe<never>();
expectTypeOf<MatchingKey<Record<string, string>, 3>>().toBe<'3'>();
expectTypeOf<MatchingKey<Record<string, string>, number>>().toBe<`${number}`>();
expectTypeOf<MatchingKey<{[key: string]: string}, 3>>().toBe<3>();
expectTypeOf<MatchingKey<{[key: string]: string}, PropertyKey>>().toBe<string | number>();
expectTypeOf<MatchingKey<Record<`data-${string}`, unknown>, 'data-id' | 'other'>>().toBe<'data-id'>();
expectTypeOf<MatchingKey<Record<`${number}`, unknown>, 12>>().toBe<'12'>();
expectTypeOf<MatchingKey<{[key: number]: string; '1': string}, 1 | '1'>>().toBe<1 | '1'>();

// Tuples accept both index forms through `keyof`; this type does not check bounds.
expectTypeOf<MatchingKey<readonly [string, number?], '0' | 0 | '1' | 1>>().toBe<'0' | 0 | '1' | 1>();
expectTypeOf<MatchingKey<readonly [string], '5'>>().toBe<5>();
expectTypeOf<MatchingKey<string[], '0'>>().toBe<0>();
expectTypeOf<MatchingKey<readonly string[], 'length'>>().toBe<'length'>();
expectTypeOf<MatchingKey<string[], 'push'>>().toBe<'push'>();
expectTypeOf<MatchingKey<readonly string[], 'push'>>().toBe<never>();

// Object unions follow `keyof` without distributing over their members.
type Response = {0: string; message: string; success: true} | {0: number; message: Error; failure: true};
expectTypeOf<MatchingKey<Response, '0' | 'message' | 'success' | 'failure'>>().toBe<0 | 'message'>();
expectTypeOf<MatchingKey<{0: string} | {'0': number}, '0' | 0>>().toBe<never>();
expectTypeOf<MatchingKey<{0: string} & {'1': number}, '0' | 1>>().toBe<0 | '1'>();

enum Field {
	Name = 'name',
}

// Enum members already accepted by `keyof` keep their identity.
expectTypeOf<MatchingKey<{[Field.Name]: string}, Field.Name>>().toBe<Field.Name>();
expectTypeOf<MatchingKey<{[Field.Name]: string}, 'name'>>().toBe<never>();
expectTypeOf<MatchingKey<{name: string}, Field.Name>>().toBe<Field.Name>();

// Special types follow the same `keyof` contract.
expectTypeOf<MatchingKey<any, PropertyKey>>().toBe<PropertyKey>();
expectTypeOf<MatchingKey<never, 'name'>>().toBe<'name'>();
expectTypeOf<MatchingKey<{}, never>>().toBe<never>();
expectTypeOf<MatchingKey<any, never>>().toBe<never>();
// @ts-expect-error The object must not be a primitive.
type InvalidObject = MatchingKey<string, 'length'>;
// @ts-expect-error Unknown is not a property key.
type UnknownKey = MatchingKey<Mixed, unknown>;
// @ts-expect-error Booleans are not property keys.
type InvalidKey = MatchingKey<Mixed, true>;

// A generic indexed access works without an intersection or cast.
type IndexedAccess<ObjectType extends object, Key extends PropertyKey> = ObjectType[MatchingKey<ObjectType, Key>];
type StatusMessages = {200: 'OK'; '404': 'Not found'};
expectTypeOf<IndexedAccess<StatusMessages, '200'>>().toBe<'OK'>();
expectTypeOf<IndexedAccess<StatusMessages, 404>>().toBe<'Not found'>();
expectTypeOf<IndexedAccess<StatusMessages, '500'>>().toBe<never>();
expectTypeOf<IndexedAccess<{readonly 0?: string}, '0'>>().toBe<string | undefined>();

// The documentation's generic `Pick` works without an intersection or cast.
type PickByKey<ObjectType extends object, Key extends PropertyKey> = Pick<ObjectType, MatchingKey<ObjectType, Key>>;
expectTypeOf<PickByKey<StatusMessages, '200'>>().toBe<{200: 'OK'}>();
expectTypeOf<PickByKey<StatusMessages, 404 | '500'>>().toBe<{'404': 'Not found'}>();

// Lookup uses the branded template pattern, without widening it to a plain number.
type BrandedIndex = Tagged<number, 'Index'>;
expectTypeOf<MatchingKey<Record<`${BrandedIndex}`, string>, BrandedIndex>>().toBe<`${BrandedIndex}`>();
expectTypeOf<MatchingKey<Record<`${BrandedIndex}`, string>, '0'>>().toBe<never>();
expectTypeOf<MatchingKey<Record<`${BrandedIndex}`, string>, 0>>().toBe<never>();
