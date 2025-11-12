// Helper type. Not useful on its own.
type Without<FirstType, SecondType> = {[KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never};

/**
Create a type that has mutually exclusive keys.

This type was inspired by [this comment](https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604).

This type works with a helper type, called `Without`. `Without<FirstType, SecondType>` produces a type that has only keys from `FirstType` which are not present on `SecondType` and sets the value type for these keys to `never`. This helper type is then used in `MergeExclusive` to remove keys from either `FirstType` or `SecondType`.

@example
```
import type {MergeExclusive} from 'type-fest';

interface ExclusiveVariation1 {
	exclusive1: boolean;
}

interface ExclusiveVariation2 {
	exclusive2: string;
}

type ExclusiveOptions = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

let exclusiveOptions: ExclusiveOptions;

exclusiveOptions = {exclusive1: true};
//=> Works

exclusiveOptions = {exclusive2: 'hi'};
//=> Works

// @ts-expect-error
exclusiveOptions = {exclusive1: true, exclusive2: 'hi'};
//=> Error
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gWRVA5igUQA8BjAGwFcBnYANxQF84AzKCEOAciVQFpmUVGJwDcAKDHAAdjBzMAhiTTFy1OigBq8qMHkxgEKQEYMYgJApSlGvSMAuOACMIEMinlTxDCdNlQFSnAq1upaOnoGUgBMphZWavRRDkI6UrheEjzK8TYoAPJg+oZUcAC8cNh4hDnqADzBCZraukXGADRBNfRhLZFRAHziYm7wlqq5Ba1UDg0ThZFUQ2Mh9JMLZRjLjfYIUBSM4gD0h6X9cADq0ADWVBJbc1Mb6PfqSVwAFsCcDEcnZ5dQG4SY5wAACMCovEsqBIMChUDYUDEL1W82KTxRKB2MD2KA6mLenE+31+pyCCOgQA)

@category Object
*/
export type MergeExclusive<FirstType, SecondType> =
	(FirstType | SecondType) extends object ?
		(Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType) :
		FirstType | SecondType;

export {};
