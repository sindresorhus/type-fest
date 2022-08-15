import type {Except} from './except';
import type {RequiredKeysOf} from './required-keys-of';
import type {Simplify} from './simplify';

type Spread_<FirstType extends object, SecondType extends object> = {
	[Key in keyof FirstType]: Key extends keyof SecondType
		? FirstType[Key] | Required<SecondType>[Key]
		: FirstType[Key];
} & Pick<
	SecondType,
	RequiredKeysOf<SecondType> | Exclude<keyof SecondType, keyof FirstType>
>;

/**
Mimic the type inferred by TypeScript when merging two objects using the spread operator.

@example
```
import type {Spread} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
};

type Bar = {
	b?: number;
	c: boolean;
};

const foo = {a: 1, b: '2'};
const bar = {c: false};
const fooBar = {...foo, ...bar};

type FooBar = Spread<Foo, Bar>;
// type FooBar = {
// 	a: number;
// 	b?: string | number | undefined;
// 	c: boolean;
// }

const baz = (argument: FooBar) => {
	// Do something
}

baz(fooBar);
```

@category Object
*/
export type Spread<
    FirstType extends object,
    SecondType extends object,
> = Simplify<Spread_<FirstType, SecondType>>;
