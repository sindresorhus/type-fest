import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Returns a boolean for whether the given type has any required fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of required fields.

An index signature is not a required field, and an array only counts its required elements.

Note: A union returns `true` if any of its members has a required field, so `HasRequiredKeys<{a?: string} | {b: number}>` is `true`. Use `{} extends Type` instead if you need to know whether the type accepts an empty object.

@example
```
import type {HasRequiredKeys} from 'type-fest';

type GeneratorOptions<Template extends object> = {
	prop1: number;
	prop2: string;
} & (HasRequiredKeys<Template> extends true
	? {template: Template}
	: {template?: Template});

type Template1 = {
	optionalSubParam?: string;
};

type Template2 = {
	requiredSubParam: string;
};

type Options1 = GeneratorOptions<Template1>;
type Options2 = GeneratorOptions<Template2>;

const optA: Options1 = {
	prop1: 0,
	prop2: 'hi',
};
const optB: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {},
};
const optC: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		optionalSubParam: 'optional value',
	},
};

const optD: Options2 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		requiredSubParam: 'required value',
	},
};

```

@category Utilities
*/
export type HasRequiredKeys<BaseType extends object> =
	(BaseType extends UnknownArray // For distributing `BaseType`
		? [] extends BaseType ? never : BaseType // An array has required keys only if it has required elements
		: RequiredKeysOf<OmitIndexSignature<BaseType>>
	) extends never ? false : true;

export {};
