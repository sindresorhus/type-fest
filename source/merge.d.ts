import {Except} from './except';

/**
Merge two types into a new type. Keys of the second type overrides keys of the first type.

Used in cases where intersection types would result in a prop having `never` – if two different types for the same property are used, intersection types assume it's type is `never`. `MergeDeep` allows for safe intersection of two types and having the second passed in type have precedence, hence resulting in no unwanted `never` prop types.

@example
```
import {Merge} from 'type-fest';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
```
*/
export type Merge<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;
