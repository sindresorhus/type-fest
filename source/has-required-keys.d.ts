import type {RequiredKeysOf} from './required-keys-of.d.ts';

/**
Creates a type that represents `true` or `false` depending on whether the given type has any required fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of required fields.

@example
```
import type {HasRequiredKeys} from 'type-fest';

type GeneratorOptions<Template extends object> = {
	prop1: number;
	prop2: string;
} & (HasRequiredKeys<Template> extends true
	? {template: Template}
	: {template?: Template});

interface Template1 {
	optionalSubParam?: string;
}

interface Template2 {
	requiredSubParam: string;
}

type Options1 = GeneratorOptions<Template1>;
type Options2 = GeneratorOptions<Template2>;

const optA: Options1 = {
	prop1: 0,
	prop2: 'hi'
};
const optB: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {}
};
const optC: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		optionalSubParam: 'optional value'
	}
};

const optD: Options2 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		requiredSubParam: 'required value'
	}
};

```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gCQIYGcBKKAjgK7BQoAmA0iorgL5wBmUEIcA5EqgLTMpcMTgG4AUGJ5oA4igB2KKNhjQA8mBjAIc3AB4AKinAAbZWhQAPGPMq44EAEYArFAGMYAPjgBeDGICQYGxgAIwAXHByJCAOiuKBwQBMEUJQwHIA5uJMAGRwABQ4BMRkFDR0eoYmZl6W1nK2CFAkKAEA-BjW1dYRVWCm1gwBEehd-WZtvUbjgwCU4mLp1lDM2K5ofQMoIX7+EBpactjGAMokDgAK2Eogk3Cp6VliQ4tyy6vrcJtmibsUpOQqGdLtdsCAUjA0plshIpHB1JptLgdr5ZAolCooAjDpVplsQh5xHDsUjfqj5IplGoDkiDHifoSJK4kfB9jAAIIREk6FG7IL7cJwAAMABoAvywMkuAALYCcZ7iZk6VkaABCXJpPJ8fOCgtF4qSEU4ss4Yv8Yy2IyGDEVLPsGgAwhrEVrfOgDQKIvqEvspca5WaLWYRgE9prjsCrjcjWzDsc4AA3Y4teX+a0LJVCe0wAAizpxZJ1nuFZolfpNgfpPV2-n+pSB5yjYKNdcBlETyZQqfTYiAA)

@category Utilities
*/
export type HasRequiredKeys<BaseType extends object> = RequiredKeysOf<BaseType> extends never ? false : true;

export {};
