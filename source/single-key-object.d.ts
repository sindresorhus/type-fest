import type {IfEmptyObject} from '../index';
import type {IsUnion} from './internal';

/**
Create a type that only accepts an object with a single key.

@example
```
import type {SingleKeyObject} from 'type-fest';

const someFunction = <T>(parameter: SingleKeyObject<T>) => {};

someFunction({
	value: 'some value'
});

someFunction({
	value: 'some value',
	otherKey: 'some other value'
});
// Error: Argument of type '{ value: string; otherKey: string; }' is not assignable to parameter of type 'never'.ts(2345)
```

@category Object
*/
export type SingleKeyObject<ObjectType> =
	IsUnion<keyof ObjectType> extends true
		? never
		: IfEmptyObject<ObjectType, never, ObjectType>;
