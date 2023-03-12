/**
Extracts the values of a Record that are Records. This is a helper type for `DeepFlattenRecord`.
@see DeepFlattenRecord

@example
```
import type { RecordValuesOf } from 'type-fest';

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

type ExampleTypeValues = ObjectValuesOf<ExampleType>;
//=> {
//   nestedTwoArrayKey: string[];
//   nestedTwoObjectKey?: {
//       nestedThreeNumberKey: number;
//   };
//   nestedTwoStringKey: string;
//   nestedTwoFunctionKey: () => void;
// }
```
*/
export type RecordValuesOf<BaseType extends Record<string | number | symbol, unknown>> =
	Exclude<
	// 1. Extract the values of the record that are type Record.
	Extract<BaseType[keyof BaseType], Record<string | number | symbol, unknown>>,
	any[]
	>;
