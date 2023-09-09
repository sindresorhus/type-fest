/**
Create object type [key]: key.

This can be useful when, for example, converting a union string type to enum.

@example
```
type FormData = {
	id: string;
	value?: string | null;
	label: string;
};

const fieldNames: EnumObject<keyof FormData> = {
	id: 'id',
	value: 'value',
	label: 'label'
};

const union: EnumObject<first, second> = {
	first: 'first', // valid
	second: 'second' // error
}

@category Create object type [key]: key
@category Template literal
 */
// export type KebabCase<Value> = DelimiterCase<Value, '-'>;
export type EnumObject<UnionString extends string> = {
	[key in UnionString]: Extract<UnionString, key>;
};
