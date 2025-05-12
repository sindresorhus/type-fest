import type {IsNever} from './is-never.js';

export type If<T extends boolean, True, False> =
	IsNever<T> extends true
		? False
		: T extends true
			? True
			: False;
