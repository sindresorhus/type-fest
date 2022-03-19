import {Primitive} from './primitive';
import {KeysOfUnion} from './internal';

/**
Create a type which properties are restricted only to those explicitly declared.

This is useful for function type-guarding to reject arguments with excess
properties. Due to the nature of TypeScript, it does not complain if excess properties are
provided unless the provided value is an object literal.

@example
```
type OnlyAcceptName = {name: string};

function onlyAcceptName(args: OnlyAcceptName) {}

// TypeScript complains excess fields when an object literal is provided.
onlyAcceptName({name: 'name', id: 1});
//=> `id` is excess

// TypeScript does not complain excess fields when the provided value is a variable (not an object literal).
const invalidInput = {name: 'name', id: 1};
onlyAcceptName(invalidInput); // No errors
```

Having `Exact` allows TypeScript to reject excess properties.

@example
```
import {Exact} from 'type-fest';

type OnlyAcceptName = {name: string};

function onlyAcceptNameImproved<T extends Exact<OnlyAcceptName, T>>(args: T) {}

const invalidInput = {name: 'name', id: 1};
onlyAcceptNameImproved(invalidInput); // Compilation error
```

@category Utilities
*/
export type Exact<ParameterType, InputType extends ParameterType> = ParameterType extends Primitive
	? ParameterType
	/*
   Create a type from type ParameterType and InputType and change keys exclusive to type InputType to `never`.
	 - Generate the list of keys that exist in the InputType but not in the ParameterType.
	 - Mark these excess keys as `never`
	 */
	: {[Key in keyof ParameterType]: Exact<ParameterType[Key], InputType[Key]>} & Record<Exclude<keyof InputType, KeysOfUnion<ParameterType>>, never>;
