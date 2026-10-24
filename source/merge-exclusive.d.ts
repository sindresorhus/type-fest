import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {NormalizedKeys, ToString} from './internal/index.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';

// Declared numeric and enum keys also have their runtime string spellings. Keep index signatures unchanged.
type KeysWithAliases<Type> = KeysOfUnion<Type> | NormalizedKeys<ToString<KeysOfUnion<OmitIndexSignature<Type>>>>;

// Helper type. Not useful on its own. Distribute before taking keys so `never` adds no forbidden properties, while every union member contributes its own keys. Only declared keys can be forbidden; an open index domain would also block the other alternative.
type Without<FirstType, SecondType> = {[KeyType in FirstType extends unknown ? Exclude<keyof OmitIndexSignature<FirstType>, KeysWithAliases<SecondType>> : never]?: never};

/**
Create a type that has mutually exclusive keys.

This type was inspired by [this comment](https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604).

This type works with a helper type, called `Without`. `Without<FirstType, SecondType>` produces a type that has only keys from `FirstType` which are not present on `SecondType` and sets the value type for these keys to `never`. This helper type is then used in `MergeExclusive` to remove keys from either `FirstType` or `SecondType`.

Index signatures are preserved, but only declared keys contribute exclusions. Forbidding an open index domain would also forbid the other alternative's declared properties.

@example
```
import type {MergeExclusive} from 'type-fest';

type ExclusiveVariation1 = {
	exclusive1: boolean;
};

type ExclusiveVariation2 = {
	exclusive2: string;
};

type ExclusiveOptions = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

let exclusiveOptions: ExclusiveOptions;

exclusiveOptions = {exclusive1: true};
// Works

exclusiveOptions = {exclusive2: 'hi'};
// Works

// @ts-expect-error
exclusiveOptions = {exclusive1: true, exclusive2: 'hi'};
// Error
```

@category Object
*/
export type MergeExclusive<FirstType, SecondType> =
	(FirstType | SecondType) extends object
		? (Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType)
		: FirstType | SecondType;

export {};
