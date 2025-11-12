/**
Recursively simplifies a type while including and/or excluding certain types from being simplified.

@example
```
import type {ConditionalSimplifyDeep} from 'type-fest';

type TypeA = {
	foo: {
		a: string;
	};
};

type TypeB = {
	foo: {
		b: string;
	};
};

type SimplifyDeepTypeAB = ConditionalSimplifyDeep<TypeA & TypeB, never, object>;
//=> {foo: {a: string; b: string}}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgMqhhnABmiAIiimAL5x1QQhwDkSVAFo6KAM4w+AbgBQMwWgAqyFAEE4AXgwyAkHQgQAXNp06SxiVGA4A5rJ1tZjuQrjLUAIU0n9RkzoAjCxgrW3tnZ3kVOCpwWgZmVnc1Ly1sfEJiHHJYmnomFjAAHmT1ADI3FQ8AGjgcFAA3FChaiACAKxQAYxgAPlkAegGNXoxfY3RzOEtrOzgg6ZDZtjYgA)

@example
```
import type {ConditionalSimplifyDeep} from 'type-fest';

type SomeComplexType1 = {
	a1: string;
	b1: number;
	c1: boolean;
};

type SomeComplexType2 = {
	a2: string;
	b2: number;
	c2: boolean;
};

type TypeA = {
	foo: {
		a: string;
		complexType: SomeComplexType1;
	};
};

type TypeB = {
	foo: {
		b: string;
		complexType: SomeComplexType2;
	};
};

type SimplifyDeepTypeAB = ConditionalSimplifyDeep<TypeA & TypeB, SomeComplexType1 | SomeComplexType2, object>;
//=> {
//	foo: {
// 		a: string;
// 		b: string;
// 		complexType: SomeComplexType1 & SomeComplexType2;
//	};
// }
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgMqhhnABmiAIiimAL5x1QQhwDkSVAFo6KAM4w+AbgBQMwWgo8U2cGRQAPACrIUARjgBeDDICQJPQC44EqMBwBzWaYBGVuDgCuIFyijOAY3cXCAh1EhxZNll5XTglEBUeGk0dVAAmIxNzdOtbeyczF1yPb19-MwCSkLCUCKiYhTg0lABBLPQzOlDrTtNzPJg7R2dTAOT1bV1rBKS1VN09Z2iZFdjUZt0AIQ6unuzXQeHC-vH5qdQZ5VUUi5R05Ya5Jqo1eiYWMBbWneNsfEIxBw5FeNHezFYAB5vnAAGSbVBbAA08WuEwWqAMAB9UYkbpMWukURAXAArFABGAAPlkAHpaYYqSZ6aZuhBejJ6XB+iQjgU6bTuYcbEN+ZzBad0XcrnipS0DPDZviMfcBaYVly2EA)

@see {@link SimplifyDeep}
@category Object
*/
export type ConditionalSimplifyDeep<Type, ExcludeType = never, IncludeType = unknown> = Type extends ExcludeType
	? Type
	: Type extends IncludeType
		? {[TypeKey in keyof Type]: ConditionalSimplifyDeep<Type[TypeKey], ExcludeType, IncludeType>}
		: Type;

export {};
