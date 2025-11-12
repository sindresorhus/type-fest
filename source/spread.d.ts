import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {Simplify} from './simplify.d.ts';

type SpreadObject<FirstType extends object, SecondType extends object> = {
	[Key in keyof FirstType]: Key extends keyof SecondType
		? FirstType[Key] | Required<SecondType>[Key]
		: FirstType[Key];
} & Pick<
	SecondType,
RequiredKeysOf<SecondType> | Exclude<keyof SecondType, keyof FirstType>
>;

type TupleOrArray = readonly [...unknown[]];

type SpreadTupleOrArray<
	FirstType extends TupleOrArray,
	SecondType extends TupleOrArray,
> = Array<FirstType[number] | SecondType[number]>;

type Spreadable = object | TupleOrArray;

/**
Mimic the type inferred by TypeScript when merging two objects or two arrays/tuples using the spread syntax.

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

declare function baz(argument: FooBar): void;

baz(fooBar);
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZTFFBDAEwF84AzKCEOAciVQFpSUBnGagbgChO60AxCBDgBeDJwCQeAFxwAdgFcQAIxRQu4pQH4ZrKMFkBzLkS49kaAEJ4oIsRu1zFKtRIDGMpYIA2+WcdOuELKsZIK26NJwAIwANHBKMtQATNQmnIHB8ErW4e5keF7MKGkZIaSCVjai6AB0deUQcXU12VBpZqhwAhCVtti4hAA83XGVAHxcAPSTCOZdFTnVnNNwkjIKyqpTM-Y6MHqGcAA+jps2J-KyBCik+igE26t5nhA+eH7LM0Tc165e1mhSJdXDBgEF4ngAF4ACmsBkUKFkMBk3UqAEoZAA3CDAB7cbIwhro9hAA)

@example
```
import type {Spread} from 'type-fest';

const foo = [1, 2, 3];
const bar = ['4', '5', '6'];

const fooBar = [...foo, ...bar];
type FooBar = Spread<typeof foo, typeof bar>;
// FooBar = (string | number)[]

declare function baz(argument: FooBar): void;

baz(fooBar);
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZTFFBDAEwF84AzKCEOAciVQFpSUBnGagbgChOBjCAO1ZkIEOAF44AbQCMAGjgAmeQGYAulz6D4AIzxRxU6gBZq86gFZTNAGzV13TUNIiAQnoOSAdN+cR53z10oezo0ADFXdwlsXEIAHlCIUmE-BGQUJLgggD4uAHo8uAiIN30JAApWKGB+AHM4AB84fgBXEG0UKABKSVVuAhQeABs9NFIW-h4YYAEsvAAvcr1atpR+GAAuIsjurYA3CGACLk5dRd9SrvYgA)

@category Object
*/
export type Spread<
	FirstType extends Spreadable,
	SecondType extends Spreadable,
> = FirstType extends TupleOrArray
	? SecondType extends TupleOrArray
		? SpreadTupleOrArray<FirstType, SecondType>
		: Simplify<SpreadObject<FirstType, SecondType>>
	: Simplify<SpreadObject<FirstType, SecondType>>;

export {};
