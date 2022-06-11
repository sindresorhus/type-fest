/**
Pick all required keys from the given base type.

This is useful when you want to create a new type that contains different type values for the required keys only or use the list of keys for validation purposes, etc...

@example
```
import type {RequiredKeysOf} from 'type-fest';

declare function createValidation<Entity extends object, Key extends RequiredKeysOf<Entity> = RequiredKeysOf<Entity>>(field: Key, validator: (value: Entity[Key]) => boolean): ValidatorFn;

interface User {
  name: string;
  surname: string;

  luckyNumber?: number;
}

const validator1 = createValidation<User>('name', value => value.length < 25);
const validator2 = createValidation<User>('surname', value => value.length < 25);
```

@category Utilities
 */
export type RequiredKeysOf<BaseType extends object> = Exclude<{
	[Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]>
		? Key
		: never
}[keyof BaseType], undefined>;

/**
Creates a type that represents `true` or `false` depending on the presence or absence of required fields.

This is useful when you want to create an API whose behaviour depends on the presence or absence of required fields.

@example
```
import type {HasRequiredKeys} from 'type-fest';

type GeneratorOptions<Template extends object> = {
  prop1: number;
  prop2: string;
} & (HasRequiredKeys<Template> extends true
  ? { template: Template; }
  : { template?: Template; });

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

@category Utilities
 */
export type HasRequiredKeys<BaseType extends object> = RequiredKeysOf<BaseType> extends never ? false : true;
