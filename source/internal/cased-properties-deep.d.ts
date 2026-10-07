import type {CamelCase} from '../camel-case.d.ts';
import type {DelimiterCase} from '../delimiter-case.d.ts';
import type {PascalCase} from '../pascal-case.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {WordsOptions} from '../words.d.ts';
import type {IsArrayOfUnknownLength} from './array.d.ts';
import type {NonRecursiveType} from './type.d.ts';

/**
The casing that {@link CasedPropertiesDeep} converts every key to: camel case, pascal case, or a delimiter case such as `{delimiter: '-'}`.
*/
export type PropertyCasing = 'camel' | 'pascal' | {delimiter: string};

/**
Converts one key to the given casing.
*/
type CaseKey<Key, Casing extends PropertyCasing, Options extends Required<WordsOptions>> =
	Casing extends 'camel'
		? CamelCase<Key, Options>
		: Casing extends 'pascal'
			? PascalCase<Key, Options>
			: Casing extends {delimiter: infer Delimiter extends string}
				? DelimiterCase<Key, Delimiter, Options>
				: never;

/**
The shared walker behind `CamelCasedPropertiesDeep`, `PascalCasedPropertiesDeep` and `DelimiterCasedPropertiesDeep`. Converts the keys of every object it finds, and rebuilds arrays, tuples, maps and sets around their converted contents.
*/
export type CasedPropertiesDeep<Value, Casing extends PropertyCasing, Options extends Required<WordsOptions>> =
	Value extends NonRecursiveType
		? Value
		: Value extends UnknownArray
			? IsArrayOfUnknownLength<Value> extends false
				// A homomorphic mapped type keeps the length, the optional elements, the rest element and `readonly`, without a recursion step per element.
				? {[Key in keyof Value]: CasedPropertiesDeep<Value[Key], Casing, Options>}
				// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
				: Value extends unknown[]
					? Array<CasedPropertiesDeep<Value[number], Casing, Options>>
					: ReadonlyArray<CasedPropertiesDeep<Value[number], Casing, Options>>
			: Value extends Map<infer KeyType, infer ValueType>
				? Map<CasedPropertiesDeep<KeyType, Casing, Options>, CasedPropertiesDeep<ValueType, Casing, Options>>
				: Value extends ReadonlyMap<infer KeyType, infer ValueType>
					? ReadonlyMap<CasedPropertiesDeep<KeyType, Casing, Options>, CasedPropertiesDeep<ValueType, Casing, Options>>
					: Value extends WeakMap<infer KeyType, infer ValueType>
						? WeakMap<CasedPropertiesDeep<KeyType, Casing, Options>, CasedPropertiesDeep<ValueType, Casing, Options>>
						: Value extends Set<infer Item>
							? Set<CasedPropertiesDeep<Item, Casing, Options>>
							: Value extends ReadonlySet<infer Item>
								? ReadonlySet<CasedPropertiesDeep<Item, Casing, Options>>
								: Value extends WeakSet<infer Item>
									? WeakSet<CasedPropertiesDeep<Item, Casing, Options>>
									: Value extends object
										? {[Key in keyof Value as CaseKey<Key, Casing, Options>]: CasedPropertiesDeep<Value[Key], Casing, Options>}
										: Value;

export {};
