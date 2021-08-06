import {Except} from './except';
import {Simplify} from './simplify';

/**
Create a type that removes nullish (optional, undefined and null) types from the given keys. The remaining keys are kept as is.
This behaves in a similar manor to `SetRequired<T,K>` by removing optionals, however also applies the `NonNullable<T>` operator to the values at the specified keys.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.

@example
```
import {SetNonNullable} from 'type-fest';

type Foo = {
	a?: number;
	b: string;
	c?: boolean;
	d: number | null;
	e: string | undefined;
}

type SomeNonNullable = SetNonNullable<Foo, 'b' | 'c' | 'd' | 'e'>;
// type SomeNonNullable = {
// 	a?: number;
// 	b: string; // Was already not nullish and still is.
// 	c: boolean; // Is now not optional.
//  d: number; // Is now not null
//	e: string; // Is now not undefined
// }

function hasRequiredKeys(foo: Foo): foo is SomeNonNullable;
```

This is especially useful in cases where you want to write a type-guard that asserts one or more values of an object are not null.

@example
```
type Person {
	firstName?: string | null;
	lastName?: string | null;
}

function hasFirstName(person: Person) person is SetNonNullable<Person, "firstName"> {
	return typeof person.firstName === "string";
}
```

*/
export type SetNonNullable<BaseType, Keys extends keyof BaseType> = Simplify<
	// Pick just the keys that are optional from the base type.
	Except<BaseType, Keys> &
		// For each 'Key' provided, make it not optional or nullable
		{ [Key in Keys]-?: NonNullable<BaseType[Key]> }
>;
