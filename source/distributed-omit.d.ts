import type {KeysOfUnion} from './keys-of-union.d.ts';

/**
Omits keys from a type, distributing the operation over a union.

TypeScript's `Omit` doesn't distribute over unions, leading to the erasure of unique properties from union members when omitting keys. This creates a type that only retains properties common to all union members, making it impossible to access member-specific properties after the Omit. Essentially, using `Omit` on a union type merges the types into a less specific one, hindering type narrowing and property access based on discriminants. This type solves that.

Example:

```
type A = {
	discriminant: 'A';
	foo: string;
	a: number;
};

type B = {
	discriminant: 'B';
	foo: string;
	b: string;
};

type Union = A | B;

type OmittedUnion = Omit<Union, 'foo'>;
//=> {discriminant: 'A' | 'B'}

declare const omittedUnion: OmittedUnion;

if (omittedUnion.discriminant === 'A') {
	// We would like to narrow `omittedUnion`'s type
	// to `A` here, but we can't because `Omit`
	// doesn't distribute over unions.

	// @ts-expect-error
	omittedUnion.a;
	//=> Error: `a` is not a property of `{discriminant: 'A' | 'B'}`
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/C4TwDgpgBAglC8UDeAoAkAEwJYGcDGATlgLZYB2AhmcAFxQDkM9A3OgGYD2HdOwRZAc1ZoKdMgFdiAIwgFWAX1YpQkKACEEydNnxFSlanXpqW7Ljz7kh6KRf7XFKZeGgBVMlg5lNcAD7qlFWgAeVJgYAgMd09vRFCsYAAeaK8AGgZODnoAPlYAejz4bOQdQhJyKloGJih-Y3p5JwwIPAAbCgJoPC9eKA4wiKiPLzp48MiUsiUsNigACn6EwcmAOlK9CuoEeERGegBKLTQCqAB1aAB3DnFWjChWrABraGAOKEoCAg4LqAADRfGQxiv3oOCgQXQJ1efxgvygAAtZBB0lJxMAoBculR6OiZHgKOIcNBfmNfpC8lAMBwIDgyDjKbhLKiIn0AG6yKDiYZkHArJzHCkAAWAOAAtBAAB6QPDAcWfDgEdAA5bclYUYQFIpQACi8oIdF+FDhuHeHHRFCgYC+kAIoD6s1+SHW5QMVT2tQYJnkZPkQA)

While `Except` solves this problem, it restricts the keys you can omit to the ones that are present in **ALL** union members, where `DistributedOmit` allows you to omit keys that are present in **ANY** union member.

@example
```
import type {DistributedOmit} from 'type-fest';

type A = {
	discriminant: 'A';
	foo: string;
	a: number;
};

type B = {
	discriminant: 'B';
	foo: string;
	bar: string;
	b: string;
};

type C = {
	discriminant: 'C';
	bar: string;
	c: boolean;
};

// Notice that `foo` exists in `A` and `B`, but not in `C`, and
// `bar` exists in `B` and `C`, but not in `A`.

type Union = A | B | C;

type OmittedUnion = DistributedOmit<Union, 'foo' | 'bar'>;

declare const omittedUnion: OmittedUnion;

if (omittedUnion.discriminant === 'A') {
	omittedUnion.a;
 	//=> OK

	// @ts-expect-error
	omittedUnion.foo;
	//=> Error: `foo` is not a property of `{discriminant: 'A'; a: string}`

	// @ts-expect-error
	omittedUnion.bar;
 	//=> Error: `bar` is not a property of `{discriminant: 'A'; a: string}`
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gEWAZxlYAIwFcYUATAeRGBgF84AzKCEOAciVQFpGU92AbgBQwrmgCCcALwZhASHK4AxgRoA7AIbqYALg4ShCxhAj68BdQHMR8zfvXEQhFFBF0RY5GgBCMuYoqasBaOvrsPkbyJmZwFiE2CoSaUOb4CbaEaZaJHqLicADC-ugKSjiqoCHaehyFUcmpcenWtsr6hKYANija7p4A9ANwAHIQMMDKaDAAFprwAAYxC3AoAB64MDhwIXALEiva5Hs+CwA0cCTw6uM76nuF53BHwkN7jSvrm9u7C6fP6mOC0eFyucBu8F+BwAdPlvHAAKrqYAQe6yKQAHzgfixhU8BWotDI5CRKLRcGw8SuFEJMAAPKTURd2DF2HAsexGuwAHyecgoZRdFJoZSovBwVhEiiM9T6WnEmWeYCMOAACklMAVyNR0PKlQ0NRk0lk7EMAEoAhqtWToZoRHB5ENpNy4JQANKiR3DAACW2461Qyhg-qgLCgCit0u16mhMVsTpdAFFQ9B9EtTCtcODbpo4GAWKhYIgJSqFug9cFQrVTUJntkEnQFp63r6cP61oHg64wxGaJqozbGvavc64Mmw2mPjtthDnnmC64kCW9uWglUq+FDII680co3hHQgA)

@category Object
*/
export type DistributedOmit<ObjectType, KeyType extends KeysOfUnion<ObjectType>> =
	ObjectType extends unknown
		? Omit<ObjectType, KeyType>
		: never;

export {};
