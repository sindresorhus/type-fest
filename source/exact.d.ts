import {Primitive} from './primitive';
import {KeysOfUnion} from './internal';

/**
Create a type from type A and B and changes keys exclusive to type B to `never`.

This is useful for function type-guarding to reject arguments with excess
properties. Due to the nature of TypeScript, it does not complain if excess properties are
provided unless the provided value is an object literal.

@example
```
type OnlyAcceptName = {name: string};

function onlyAcceptName(args: OnlyAcceptName) {}

// TypeScript complains this because it's an object literal.
onlyAcceptName({name: 'name', id: 1});
//=> `id` is excess

// TypeScript does not complain because it's not an object literal.
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

The solution of `Exact` is
- take both the preferred type and actual provided type as input.
- generates the list of keys that exist in the provided type but not in the
 defined type.
- mark these excess keys as `never`
```

@category Utilities
*/
export type Exact<ParameterType, InputType extends ParameterType> = ParameterType extends Primitive
	? ParameterType
	: {[Key in keyof ParameterType]: Exact<ParameterType[Key], InputType[Key]>} & Record<Exclude<keyof InputType, KeysOfUnion<ParameterType>>, never>;
