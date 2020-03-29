/**
Create a type with all of the inputed types keys transformed into strings.

Use case: changes a types values to string in order to use it as a form model.

@example
```
import {Stringified} from 'type-fest';

type Car {
	model: string;
	speed: number;
}

const carForm: Stringified<Car> = {
	model: 'Foo',
	speed: '101'
};
```
*/
export type Stringified<ObjectType> = {[KeyType in keyof ObjectType]: string};
