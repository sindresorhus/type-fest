import type {IsReadonlyKeyOf} from './is-readonly-key-of.d.ts';
import type {Not} from './internal/type.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is a writable key of type.

This is useful when writing utility types or schema validators that need to differentiate `writable` keys.

@example
```
import type {IsWritableKeyOf} from 'type-fest';

interface User {
	name: string;
	surname: string;

	readonly id: number;
}

interface Admin {
	name: string;
	id: string;
}

type T1 = IsWritableKeyOf<User, 'name'>;
//=> true

type T2 = IsWritableKeyOf<User, 'id'>;
//=> false

type T3 = IsWritableKeyOf<User, 'name' | 'id'>;
//=> boolean

type T4 = IsWritableKeyOf<User | Admin, 'name'>;
//=> true

type T5 = IsWritableKeyOf<User | Admin, 'id'>;
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4HUrAwCGARgDYoDSKiA8gGYC+c9UEIcA5EqgLT0psMTgG4AUGOAA7GCij0iAYzQBVbHIxiAkFKIgUALjhCCUgObit2AK5Rd+oyekWJWqCiIATCFLKI4wJ5GUtYgJHLijBLSsvJKaACCniDSmjp6hsYwpi5agY7ZzpESPGgAKgCMcAC8cDj4hKQU1HT0ADxqcgA0XPYonAB84gD0w9UDCFDWKCXI5QBMNXV4BMTkVDQMHepQPZyBgyNjEwpk6rOocGUAzEv1q00brdvdvRmccAA+XAdDYqPjOAkCAQChEKQXcoAFjuK0a6xaW06UC+cCSKSkez6h3+x0m00hVwArLCGmtmpt2sjUejpHtfkdAcDQR4pEA)

@category Type Guard
@category Utilities
*/
export type IsWritableKeyOf<Type extends object, Key extends keyof Type> =
	IsAny<Type | Key> extends true ? never
		: Key extends keyof Type
			? Not<IsReadonlyKeyOf<Type, Key>>
			: false;

export {};
