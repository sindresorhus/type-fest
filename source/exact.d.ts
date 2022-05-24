import type {Primitive} from './primitive';
import type {KeysOfUnion} from './internal';

/**
Create a type that does not allow extra properties, meaning it only allows properties that are explicitly declared.

This is useful for function type-guarding to reject arguments with excess properties. Due to the nature of TypeScript, it does not complain if excess properties are provided unless the provided value is an object literal.

*Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/12936) if you want to have this type as a built-in in TypeScript.*

@example
```
type OnlyAcceptName = {name: string};

function onlyAcceptName(args: OnlyAcceptName) {}

// TypeScript complains about excess properties when an object literal is provided.
onlyAcceptName({name: 'name', id: 1});
//=> `id` is excess

// TypeScript does not complain about excess properties when the provided value is a variable (not an object literal).
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

[Read more](https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined)

@category Utilities
*/
export type Exact<ParameterType, InputType extends ParameterType> = ParameterType extends Primitive
	? ParameterType
	/*
	Create a type from `ParameterType` and `InputType` and change keys exclusive to `InputType` to `never`.
	- Generate a list of keys that exists in `InputType` but not in `ParameterType`.
	- Mark these excess keys as `never`.
	*/
	: {[Key in keyof ParameterType]: Exact<ParameterType[Key], InputType[Key]>} & Record<Exclude<keyof InputType, KeysOfUnion<ParameterType>>, never>;
