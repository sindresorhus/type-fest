import type {UnknownArrayOrTuple} from './internal/array.d.ts';

export type Concat<
	First extends UnknownArrayOrTuple,
	Second extends UnknownArrayOrTuple,
> = [...First, ...Second];

export {};
