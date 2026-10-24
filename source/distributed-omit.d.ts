import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';

/**
Omits keys from a type, distributing the operation over a union.

TypeScript's `Omit` doesn't distribute over unions. The result keeps only the shared properties and widens the discriminant, so narrowing no longer works. This type omits from each member separately.

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
	const aValue = omittedUnion.a;
	// Error: `a` is not a property of `{discriminant: 'A' | 'B'}`
}
```

Like `Omit`, and unlike `Except`, it accepts a key that is not present in the type. That lets a generic props type omit a key it may not have, as in `type WrapperProps<Props> = DistributedOmit<Props, 'value'>`. Use `Except` when a typo or a rename must be reported. `Except` and `DistributedOmit` both accept a key that only some members have; they differ on index signatures, where `Except` keeps the named keys that `Omit` loses.

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
	const aValue = omittedUnion.a;
	// OK

	// @ts-expect-error
	const fooValue = omittedUnion.foo;
	// Error: `foo` is not a property of `{discriminant: 'A'; a: number}`

	// @ts-expect-error
	const barValue = omittedUnion.bar;
	// Error: `bar` is not a property of `{discriminant: 'A'; a: number}`
}

// Like `Omit`, a key that is not present in the type is accepted and removes nothing.
declare const unchangedUnion: DistributedOmit<Union, 'value'>;

if (unchangedUnion.discriminant === 'C') {
	const cValue = unchangedUnion.c;
	// OK
}
```

@category Object
*/
export type DistributedOmit<ObjectType, KeyType extends LiteralUnion<KeysOfUnion<ObjectType>, PropertyKey>> =
	ObjectType extends unknown
		? Omit<ObjectType, KeyType>
		: never;

export {};
