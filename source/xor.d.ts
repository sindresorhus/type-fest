import type {IsAnyOrNever, IsFalse, IsTrue} from './internal/type.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {Includes} from './includes.d.ts';
import type {CountOf} from './count-of.d.ts';
import type {IsEqual} from './is-equal.d.ts';

type XorOptions = {
	/**
	Only match a specific number of trues.

	@default 1 <= x <= length - 1
	*/
	strict?: number;
};

type DefaultXorOptions = {
	strict: -1;
};

type Xor<A extends boolean, B extends boolean> = XorAll<[A, B]>;

type XorAll<T extends boolean[], Options extends XorOptions = {}> = (
	ApplyDefaultOptions<XorOptions, DefaultXorOptions, Options> extends infer ResolvedOptions extends Required<XorOptions>
		? IsAnyOrNever<T[number]> extends false
			? Includes<T, boolean> extends false
				? [IsFalse<T[number]> | IsTrue<T[number]>] extends [false]
					? ResolvedOptions['strict'] extends infer TrueCount extends number
						? TrueCount extends -1 ? true
							: IsEqual<CountOf<T, true>, TrueCount>
						: never
					: false
				: never
			: never
		: never
);
