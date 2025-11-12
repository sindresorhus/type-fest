import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {Not} from './internal/type.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is a required key of type.

This is useful when writing utility types or schema validators that need to differentiate `required` keys.

@example
```
import type {IsRequiredKeyOf} from 'type-fest';

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

interface Admin {
	name: string;
	surname?: string;
}

type T1 = IsRequiredKeyOf<User, 'name'>;
//=> true

type T2 = IsRequiredKeyOf<User, 'luckyNumber'>;
//=> false

type T3 = IsRequiredKeyOf<User, 'name' | 'luckyNumber'>;
//=> boolean

type T4 = IsRequiredKeyOf<User | Admin, 'name'>;
//=> true

type T5 = IsRequiredKeyOf<User | Admin, 'surname'>;
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4CUUCOArsFCgCYDSKiA8gGYC+c9UEIcA5EqgLT0psMTgG4AUGOAA7GCij0AhgGM0AVWxyMYgJBSFIFAC44QqNIDm47diJQ9B46YvidAGyJKA1ogByREABGcgD8xlL+QVDijBLSsvLKaACC5CDSWrr6RiYwZlKWOjZ2WaE5eQUxYjxoACoAjHAAvHA4+MSkFNR09AA86nIANFz2KJwAfOIA9JONYwhQRCgS1XA1AExNLXiEJGRUNAx9GlBDnO5evhFy41Mzc4quGsvItQDMm607HfvdR4PDWU4cAAPlxzt4-IFrhMxNNZnAAhAIK4UAopM9UKsACwfbbtPZdQ79KAguApNJSU4jG6wu7zRYY2oAVlxbV2nQOvWJpPJ0lORWpMLhc0RyNRUiAA)

@category Type Guard
@category Utilities
*/
export type IsRequiredKeyOf<Type extends object, Key extends keyof Type> =
	IsAny<Type | Key> extends true ? never
		: Key extends keyof Type
			? Not<IsOptionalKeyOf<Type, Key>>
			: false;

export {};
