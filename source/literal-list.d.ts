import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {BuildTuple} from './internal/tuple.d.ts';
import type {Join, JoinableItem} from './join.d.ts';
import type {JoinUnion} from './join-union.d.ts';
import type {IsNever} from './is-never.d.ts';

type TupleOfUnions<U> = UnionToTuple<U>['length'] extends infer Length extends number
	? Readonly<BuildTuple<Length, U>>
	: never;

type TupleAsString<T, S extends string = '\', \''> = `['${
	[T] extends [JoinableItem[]]
		? Join<T, S>
		: JoinUnion<T, S>
}']`;

type LiteralList<
	T extends readonly any[],
	U extends readonly any[] | any,
> = (
	([U] extends [readonly any[]] ? U : TupleOfUnions<U>) extends infer V extends readonly any[]
		? V['length'] extends T['length']
			? Exclude<T[number], V[number]> extends infer TnV
				? Exclude<V[number], T[number]> extends infer VnT
					? IsNever<TnV> extends true
						? IsNever<VnT> extends true
							? T
							: never | `Type ${TupleAsString<T>} is missing Properties: ${TupleAsString<VnT>}`
						: never | `Type ${TupleAsString<T>} has extra Properties: ${TupleAsString<TnV>}`
					: never
				: never
			: never | `Type ${TupleAsString<T>} is not the required Length of: ${V['length']}`
		: never
);
