/**
 * Infer the type of keys from a strongly typed {@link Set} or {@link ReadonlySet}.
 *
 * @example
 * ```
 * import type {SetKeys} from 'type-fest';
 * const fruits = new Set(['🍎', '🍌', '🍉'] as const);
 *
 * type Fruit = SetKeys<typeof fruits>; // '🍎' | '🍌' | '🍉'
 * ```
 */
export type SetKeys<
	TSetOrReadonlySet extends Set<unknown> | ReadonlySet<unknown>,
> = TSetOrReadonlySet extends ReadonlySet<infer Keys>
	? Keys
	: TSetOrReadonlySet extends Set<infer Keys>
		? Keys
		: never;
