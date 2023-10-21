import type {Except} from './except';
import type {Simplify} from './simplify';

/**
Create a type that changes the given keys types.

Use-case: You want to change the type of one or more fields of a model.

@example
```
import type {SetFieldType} from 'type-fest';

type MyModel = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
};

type MyModelApi = SetFieldType<MyModel, 'createdAt' | 'updatedAt', string>;
/*
{
	id: number;
 	createdAt: string;
  	updatedAt: string;
}
*/
```

@category Object
*/
export type SetFieldType<BaseType, Keys extends keyof BaseType, NewType> =
	Simplify<
	Except<BaseType, Keys> &
	Record<Keys, NewType>
	>;
