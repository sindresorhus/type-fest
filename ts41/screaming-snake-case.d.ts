import {SplitIncludingDelimiters} from './delimiter-case';
import {SnakeCase} from './snake-case';

/**
Returns a boolean on whether the given array contains a certain item.
*/
type Includes<Value extends any[], Item> = {
	[P in keyof Value & number as Value[P]]: true;
}[Item] extends true
	? true
	: false;

/**
Returns a boolean for whether the string is screaming snake case.
*/
type IsScreamingSnakeCase<Value extends string> = Value extends Uppercase<Value>
	? Includes<SplitIncludingDelimiters<Lowercase<Value>, '_'>, '_'> extends true
		? true
		: false
	: false;

/**
Convert a string literal to screaming-snake-case.

This can be useful when, for example, converting a camel-cased object property to a screaming-snake-cased SQL column name.

@example
```
import {ScreamingSnakeCase} from 'type-fest';

// Simple

const someVariable: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';

// Advanced

type ScreamingSnakeCasedProperties<T> = {
	[K in keyof T as ScreamingSnakeCase<K>]: T[K]
};

interface ModelProps {
	isHappy: boolean;
	fullFamilyName: string;
	foo: number;
}

const dbResult: ScreamingSnakeCasedProperties<ModelProps> = {
	'is_happy': true,
	'full_family_name': 'Carla Smith',
	foo: 123
};
```

@category Template Literals
*/
export type ScreamingSnakeCase<Value> = Value extends string
	? IsScreamingSnakeCase<Value> extends true
		? Value
		: Uppercase<SnakeCase<Value>>
	: Value;
