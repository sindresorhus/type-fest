import type {OptionalKeysOf} from './optional-keys-of';

/**
Creates a type that applies `Partial` keys that are optional and are of type Record. This applies one level deep. This is useful when you want to create an API whose behavior depends on the presence or absence of required fields.
This is also a helper type for `DeepFlattenRecord`.
@see DeepFlattenRecord

@example
```
import type { CascadeOptional } from 'type-fest';
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

type ExampleTypeCascadeOptional = CascadeOptional<ExampleType>;
//=> {
// 	arrayKey: string[];
// 	objectKey: {
// 		nestedTwoArrayKey: string[];
// 		nestedTwoObjectKey?: {
// 			nestedThreeNumberKey: number;
// 		};
// 		nestedTwoStringKey: string;
// 		nestedTwoFunctionKey: () => void;
// 	};
// 	stringKey: string;
// 	numberKey: number;
// 	functionKey: () => void;
// }
*/
export type CascadeOptional<BaseType extends Record<string | number | symbol, unknown>> = {
	// Check that the keys of the record are one of the optional keys.
	[Key in keyof BaseType]: Key extends OptionalKeysOf<BaseType>
		// If the key is optional, check if the value is a Record.
		? NonNullable<BaseType[Key]> extends Record<string | number | symbol, unknown>
			// If the value is a Record (and therefore is an optional record), return the value with `Partial` applied.
			? Partial<BaseType[Key]>
			// If the value is not a Record, return the value.
			: BaseType[Key]
		// If the key is not optional return the value.
		: BaseType[Key]
};
