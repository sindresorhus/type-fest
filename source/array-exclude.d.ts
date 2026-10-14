import type {And} from './and.d.ts';
import type {If} from './if.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {IsExactOptionalPropertyTypesEnabled, Not} from './internal/type.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {IsTuple} from './is-tuple.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Exclude elements of the specified type from an array type.
*/
export type ArrayExclude<TArray extends UnknownArray, TExclude> =
	TArray extends UnknownArray // For distributing `TArray`
		? If<
			IsTuple<TArray, {fixedLengthOnly: false}>,
			TupleExclude<TArray, TExclude>,
			Array<Exclude<TArray[number], TExclude>>
		> extends infer Result
			? If<IsArrayReadonly<TArray>, Readonly<Result>, Result>
			: never
		: never; // Should never happen

type TupleExclude<
	TTuple extends UnknownArray,
	TExclude,
	ForwardAccumulator extends UnknownArray = [],
	BackwardAccumulator extends UnknownArray = [],
> =
	TTuple extends UnknownArray // For distributing `TArray`
		? keyof TTuple & `${number}` extends never
			// Enters this branch, if `TArray` is empty (e.g., `[]`),
			// or `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
			? TTuple extends readonly [...infer Rest, infer Last]
				? TupleExclude<
					Rest,
					TExclude,
					ForwardAccumulator,
					Exclude<Last, TExclude> extends infer ExcludedLast
						? If<IsNever<ExcludedLast>, BackwardAccumulator, [ExcludedLast, ...BackwardAccumulator]>
						: never
				>
				: Exclude<TTuple[number], TExclude> extends infer ExcludedRestElement
					? If<
						IsNever<ExcludedRestElement>,
						[...ForwardAccumulator, ...BackwardAccumulator],
						[...ForwardAccumulator, ...ExcludedRestElement[], ...BackwardAccumulator]
					>
					: never // Should never happen
			: TTuple extends readonly [(infer First)?, ...infer Rest]
				? TupleExclude<
					Rest,
					TExclude,
					IsOptionalKeyOf<TTuple, '0'> extends infer IsFirstOptional extends boolean
						? Exclude<
							First | (If<And<IsFirstOptional, Not<IsExactOptionalPropertyTypesEnabled>>, undefined, never>), // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
							TExclude
						> extends infer ExcludedFirst
							? If<
								IsNever<ExcludedFirst>,
								ForwardAccumulator,
								[...ForwardAccumulator, ...(If<IsFirstOptional, [ExcludedFirst?], [ExcludedFirst]>)]
							>
							: never // Should never happen
						: never, // Should never happen
					BackwardAccumulator
				>
				: never // Should never happen, since `[(infer First)?, ...infer Rest]` is a top-type for arrays.
		: never; // Should never happen

export {};
