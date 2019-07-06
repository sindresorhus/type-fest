/**
Create a stringified type of an object.

@example
```
import {Stringified} from 'type-fest';

type Foo = {
	a: number;
	b: string;
};

type StringifiedFoo = Stringified<Foo>;
//=> {
	a: string;
	b: string;
};
```
*/
export type Stringified<ObjectType> = { [KeyType in keyof ObjectType]: string; };
