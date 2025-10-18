import type {NonRecursiveType} from './internal/type.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

export type ExclusifyUnion<Union> =
	Extract<Union, NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | UnknownArray> extends infer SkippedMembers
		? SkippedMembers | _ExclusifyUnion<Exclude<Union, SkippedMembers>>
		: never; // Should never happen

type _ExclusifyUnion<Union, UnionCopy = Union> = Union extends unknown // For distributing `Union`
	? Simplify<
		Union & Partial<Record<Exclude<KeysOfUnion<UnionCopy>, keyof Union>, never>>
	>
	: never; // Should never happen

export {};
