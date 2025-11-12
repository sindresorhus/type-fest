import type {_DefaultDelimiterCaseOptions, DelimiterCase} from './delimiter-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert a string literal to snake-case.

This can be useful when, for example, converting a camel-cased object property to a snake-cased SQL column name.

@example
```
import type {SnakeCase} from 'type-fest';

// Simple

const someVariable: SnakeCase<'fooBar'> = 'foo_bar';
const noSplitOnNumbers: SnakeCase<'p2pNetwork'> = 'p2p_network';
const splitOnNumbers: SnakeCase<'p2pNetwork', {splitOnNumbers: true}> = 'p_2_p_network';

// Advanced

type SnakeCasedProperties<T> = {
	[K in keyof T as SnakeCase<K>]: T[K]
};

interface ModelProps {
	isHappy: boolean;
	fullFamilyName: string;
	foo: number;
}

const dbResult: SnakeCasedProperties<ModelProps> = {
	'is_happy': true,
	'full_family_name': 'Carla Smith',
	foo: 123
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZQHYEMDWKAwrgM4oC+cAZlBCHAORKoC01KpMjA3AFB8A9ILiZQYADYoBAYwjYucUvRQA1XFGC4ARlIBcovIRLkAPI2oQIAIQ2MAfHAC8TSxAD62u-zkL42CExJYBgAeWwAOQBXEG0UKFIDHAJiMhRzMAAmMAiUGAB3aHwHZyYssHdsPMKoYp95RVJgsMiYuISko1SzRnLcgqLGABoMJokQ8OjY+MSEKCjKRxde90z3CqqB2t4BYTgAQQATADdcbBkUQ4EWNGTjNMOABTpUWGBOUwAVJYw+AEgANoAaTgwGwcEIiAg1DgnzgZEMKRM6SB9gAugZPsC0XwKPw+GCYPFqLgLnAALIQQ4oCTPCBgUi-P7AUgACVwYDAiAM2isUjO-D+1CiEgkADFcCBgBJEBFJSgDFxNNgAOaCtwGbBteL8CiyBrwQ7aABKnBFME6SIedNeMHepFMlOptJepB+6H+jBZ7gAFhyuYwDDB5ighp7haL3CSpTLKvLA0wSFAJLhRFKYD7hv8NXAAIyZADMuJ4QA)

@category Change case
@category Template literal
*/
export type SnakeCase<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCase<Value, '_', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};
