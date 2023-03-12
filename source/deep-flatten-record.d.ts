import type {NonRecordKeysOf} from './non-record-keys-of';
import type {UnionToIntersection} from './union-to-intersection';
import type {CascadeOptional} from './cascade-optional';
import type {RecordValuesOf} from './record-values-of';

/**
DeepFlattenRecord options

@see DeepFlattenRecord
*/
export type DeepFlattenOptions = {
	/**
	 Whether to cascade optionality on an object (e.g. if a parent is optional, all children will be as well regardless of their original optionality)
	 @default true
	 */
	readonly cascadeOptionality?: boolean;
};

/**
Deeply flattens a Record type recursively. If a key is an object, it will be flattened into the parent object.
By default, if a key containing an object is optional,the object will be flattened into the parent object and all
it's keys will be optional. This can be disabled by setting `cascadeOptionality` in `DeepFlattenOptions` to `false`.

@see DeepFlattenOptions

This is useful when you have a nested object that you want to use as a form or table schema, but you want to flatten it into a single object.

@param BaseType The type to flatten
@param {{ cascadeOptionality?: boolean }} Options The options to use when flattening
@example
```
import type { DeepFlattenRecord } from 'type-fest';

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

type ExampleTypeFlattened = DeepFlattenRecord<ExampleType>
//=>{
//  	arrayKey: string[];
//  	nestedTwoArrayKey: string[];
//  	nestedThreeNumberKey?: number;
//  	nestedTwoStringKey: string;
//  	nestedTwoFunctionKey: () => void;
//  	stringKey: string;
//  	numberKey: number;
//  	functionKey: () => void;
//  }
```
*/
export type DeepFlattenRecord<BaseType, Options extends DeepFlattenOptions = {cascadeOptionality: true}> =
	// Check if the type is a Record
	BaseType extends Record<string | number | symbol, unknown>
		// If it is, start by grabbing all the keys that are not Records
		? Pick<BaseType, NonRecordKeysOf<BaseType>>
		// Then, grab all the keys that are Records and flatten them
		& UnionToIntersection<DeepFlattenRecord<RecordValuesOf<
		// If cascadeOptionality is true and the BaseType is optional, make all the child keys optional
		Options['cascadeOptionality'] extends true ? CascadeOptional<BaseType> : BaseType
		>>>
		// If it's not a Record, just 'return'
		: never;
