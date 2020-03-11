/**
Merge two types deeply into a new type. Keys of the second type overrides keys of the first type.

@example
```
import {MergeDeep} from 'type-fest';

type Foo = {
	a: number;
	b: string;
	c: {
		d: number;
		e: string;
	}
};

type Bar = {
	b: number;
	c: {
		e: number;
	}
};

const foobar: MergeDeep<Foo, Bar> = {
	a: 1,
	b: 2,
	c: {
		d: 3,
		e: 4,
	}
};
```
*/
export type MergeDeep<FirstType, SecondType> = {
	[KeyType in keyof (FirstType & SecondType)]:
		KeyType extends keyof SecondType
			? KeyType extends keyof FirstType
				? FirstType[KeyType] extends object
					? SecondType[KeyType] extends object
						? MergeDeep<FirstType[KeyType], SecondType[KeyType]>
						: SecondType[KeyType]
					: SecondType[KeyType]
				: SecondType[KeyType]
			: KeyType extends keyof FirstType
				? FirstType[KeyType]
				: never
};
