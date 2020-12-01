/**
Merge two types deeply into a new type. Keys of the second type overrides keys of the first type.

Use-cases:
- Where intersection types would result in a property having `never`. If two different types for the same property are used, intersection types assume its type is `never`. `MergeDeep` allows for safe intersection of two types and having the second passed in type have precedence, hence resulting in no unwanted `never` prop types.
- Merging complex, multi-level interfaces that share common properties across different levels.

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

const intersectFooWithBar: Foo & Bar = {b: 2};
//=> Type 'number' is not assignable to type 'never'.
```
*/
export type MergeDeep<FirstType, SecondType> = {
	[KeyType in keyof (FirstType & SecondType)]:
		KeyType extends keyof SecondType
			? KeyType extends keyof FirstType
				? FirstType[KeyType] extends object
					? SecondType[KeyType] extends object
						? FirstType[KeyType] extends Array<infer FirstArrayElement>
							? SecondType[KeyType] extends Array<infer SecondArrayElement>
								? Array<MergeDeep<FirstArrayElement, SecondArrayElement>>
								: SecondType<KeyType>
							: MergeDeep<FirstType[KeyType], SecondType[KeyType]>
						: SecondType[KeyType]
					: SecondType[KeyType]
				: SecondType[KeyType]
			: KeyType extends keyof FirstType
				? FirstType[KeyType]
				: never
};
