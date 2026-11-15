import type {If} from '../if.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {IsReadonlyArray} from '../is-readonly-array.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {RequireAll} from './keys.d.ts';
import type {IfNotAnyOrNever} from './type.d.ts';

/**
Whether {@link FilterValues} removes the given type from each value, like `Exclude`, or keeps only the given type, like `Extract`.
*/
export type FilterValuesMode = 'exclude' | 'extract';

/**
Applies `Exclude` or `Extract` to one value.
*/
type FilterValue<Value, Type, Mode extends FilterValuesMode> = Mode extends 'exclude'
	? Exclude<Value, Type>
	: Extract<Value, Type>;

/**
Applies `Exclude` or `Extract` to every property value of an object type, or every element of an array type, and removes the properties and elements that become `never`.

Internal helper for `ExcludeValues` and `ExtractValues`.
*/
// The conditional distributes `Base`, so each member of a union is checked by itself. The mapped type is homomorphic, so the optional and `readonly` modifiers are preserved. The removal check reads one required property via `RequireAll`, so an optional property is removed when its declared value is fully removed, while an explicitly declared `undefined` still keeps the property.
export type FilterValues<Base extends object, Type, Mode extends FilterValuesMode> = Base extends UnknownArray
	? FilterArrayValues<Base, Type, Mode>
	: {[Key in keyof Base as IsNever<FilterValue<RequireAll<Base, Key>[Key], Type, Mode>> extends true ? never : Key]: FilterValue<Base[Key], Type, Mode>};

/**
The array part of {@link FilterValues}.
*/
type FilterArrayValues<ArrayType extends UnknownArray, Type, Mode extends FilterValuesMode> = IfNotAnyOrNever<ArrayType, {
	ifNot: ArrayType extends unknown // For distributing `ArrayType`
		? (
			// No tuple traversal is needed when every possible element is removed.
			[FilterValue<ArrayType[number], Type, Mode>] extends [never] ? [] : _FilterArrayValues<ArrayType, Type, Mode>
		) extends infer Result extends UnknownArray
			? If<IsReadonlyArray<ArrayType>, Readonly<Result>, Result>
			: never // Should never happen
		: never; // Should never happen
}>;

type _FilterArrayValues<
	ArrayType extends UnknownArray,
	Type,
	Mode extends FilterValuesMode,
	BeforeRestAcc extends UnknownArray = [],
	AfterRestAcc extends UnknownArray = [],
> =
	'0' extends keyof ArrayType
		// Enters this branch, if `ArrayType` starts with a non-rest element (e.g., `[string, number]` or `[string, ...number[]]`).
		? ArrayType extends readonly [infer First, infer Second, infer Third, infer Fourth, infer Fifth, ...infer Rest]
			// Filter five required positions together to reduce tuple slicing and accumulator copies.
			? _FilterArrayValues<Rest, Type, Mode, [
				...BeforeRestAcc,
				...FilterElement<First, Type, Mode>,
				...FilterElement<Second, Type, Mode>,
				...FilterElement<Third, Type, Mode>,
				...FilterElement<Fourth, Type, Mode>,
				...FilterElement<Fifth, Type, Mode>,
			], AfterRestAcc>
			: ArrayType extends readonly [(infer First)?, ...infer Rest]
				// Optional inference preserves explicitly declared `undefined`.
				? FilterValue<First, Type, Mode> extends infer Element
					// Box the result so `never` is tested without distributing. Check optionality only for elements that remain.
					? _FilterArrayValues<Rest, Type, Mode,
						[Element] extends [never]
							? BeforeRestAcc
							// A tuple allows fewer than one element only when its first element is optional.
							: ArrayType extends readonly [unknown, ...unknown[]]
								? [...BeforeRestAcc, Element]
								: [...BeforeRestAcc, Element?],
						AfterRestAcc>
					: never // Should never happen
				: never // Should never happen, since `readonly [(infer First)?, ...infer Rest]` is a top-type for arrays.
		// Enters this branch, if `ArrayType` is empty (e.g., `[]`), has no fixed length (e.g., `string[]`),
		// or contains no non-rest elements preceding the rest element (e.g., `[...string[], string]`).
		: ArrayType extends readonly [...infer Rest, infer Last]
			? FilterValue<Last, Type, Mode> extends infer Element // Accumulate elements that are present after the rest element.
				? _FilterArrayValues<Rest, Type, Mode, BeforeRestAcc, [Element] extends [never] ? AfterRestAcc : [Element, ...AfterRestAcc]>
				: never // Should never happen
			: FilterValue<ArrayType[number], Type, Mode> extends infer Element // Add the rest element between the accumulated elements.
				? [...BeforeRestAcc, ...([Element] extends [never] ? [] : Element[]), ...AfterRestAcc]
				: never; // Should never happen

/**
Keeps a required tuple position after filtering, or removes the position when its remaining type is `never`.
*/
type FilterElement<Element, Type, Mode extends FilterValuesMode> = [FilterValue<Element, Type, Mode>] extends [never] ? [] : [FilterValue<Element, Type, Mode>];

export {};
