import {DelimiterCase} from './delimiter-case';

/**
Converts a string literal from any typical non-snake-case casing to a snake-case

This can be useful when eg. converting a camel cased object property to eg. a snake cased SQL column name.

@example
```
import {SnakeCase} from 'type-fest';

type SnakeCasedProps<T> = {
	[K in keyof T as SnakeCase<K>]: T[K]
};

interface ModelProps {
	isHappy: boolean;
	fullFamilyName: string;
	foo: number;
}

const dbResult: SnakeCasedProps<ModelProps> = {
	'is_happy': true,
	'full_family_name': 'Carla Smith',
	foo: 123
};
```
*/

export type SnakeCase<Value> = DelimiterCase<Value, '_'>;
