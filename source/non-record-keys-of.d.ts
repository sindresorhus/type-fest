/**
Get the keys of a type that are not records. This is a helper type for `DeepFlattenRecord`.
@see DeepFlattenRecord

@example
'''
import type { NonRecordKeysOf } from 'type-fest';
type ExampleType = {
	arrayKey: string[];
	objectKey: {
		nestedTwoArrayKey: string[]
		nestedTwoObjectKey?: {
			nestedThreeNumberKey: number;
		}
		nestedTwoStringKey: string;
		nestedTwoFunctionKey: () => void;
	}
	stringKey: string;
	numberKey: number;
	functionKey: () => void;
}

type ExampleTypeNonRecordKeys = NonRecordKeysOf<ExampleType>;
//=> 'arrayKey' | 'objectKey' | 'stringKey' | 'numberKey' | 'functionKey'
 '''
*/
export type NonRecordKeysOf<BaseType extends Record<string | number | symbol, unknown>> = {
	[Key in keyof BaseType]: BaseType[Key] extends unknown[]
		// Include arrays
		? Key
		: BaseType[Key] extends Function
			// Include functions
			? Key
			// Check if the value is a Record, return never if it is, otherwise return the key. (Exclude Records)
			: NonNullable<BaseType[Key]> extends Record<string | number | symbol, unknown> ? never : Key
}[keyof BaseType];
