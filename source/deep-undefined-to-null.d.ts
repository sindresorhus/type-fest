import type {OptionalKeysOf} from './optional-keys-of';
import type {RequiredKeysOf} from './required-keys-of';

type AnyRecord = Record<symbol, unknown>

export type DeepUndefinedToNull<BaseType extends AnyRecord> =
	| never // eslint-disable-line @typescript-eslint/no-redundant-type-constituents
	| {
		[Key in keyof Required<BaseType>]:
		Required<BaseType>[Key] extends AnyRecord
			? DeepUndefinedToNull<Exclude<Required<BaseType>[Key], undefined>>
			: Key extends OptionalKeysOf<BaseType>
				? null | Exclude<BaseType[Key], undefined>
				: Key extends RequiredKeysOf<BaseType>
					? BaseType[Key]
					: never
	};
