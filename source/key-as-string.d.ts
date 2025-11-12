/**
Get keys of the given type as strings.

Number keys are converted to strings.

Use-cases:
- Get string keys from a type which may have number keys.
- Makes it possible to index using strings retrieved from template types.

@example
```
import type {KeyAsString} from 'type-fest';

type Foo = {
	1: number;
	stringKey: string;
};

type StringKeysOfFoo = KeyAsString<Foo>;
//=> '1' | 'stringKey'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gaRYgggZwGUYpgA7AcwF84AzKCEOAciVQFpaV8ZmBuAFAC2aAGIQIcALwYBASACMALjhkAriABGKKILk9SlbIhUHyFQVUHDkaYoYrH8AeVrjJM4wXvmAPO4A+QQB6YKkAlgVmOAAfFjMjHGYgA)

@category Object
*/
export type KeyAsString<BaseType> = `${Extract<keyof BaseType, string | number>}`;

export {};
