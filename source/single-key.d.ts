import type {IfEmptyObject} from '../index';
import type {IsUnion} from './internal';

/**
Create a type that only accepts an object with a single key.

@example
```
import type {SingleKey} from 'type-fest';

const processOperation = <T>(operation: SingleKey<T>) => {};

processOperation({
	operation: {
 		name: 'add'
   	}
 });

processOperation({
	operation: {
 		name: 'add'
   	},
 	'values': [1, 2]
});
// Compilation error
```

@category Object
 */

// export type SingleKey<ObjectType> =
// 	IsUnion<keyof ObjectType> extends true ? never : {} extends ObjectType ? never : ObjectType;
export type SingleKey<ObjectType> =
	IsUnion<keyof ObjectType> extends true
		? never
		: IfEmptyObject<ObjectType, never, ObjectType>;
