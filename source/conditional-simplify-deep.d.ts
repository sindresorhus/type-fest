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

@see SimplifyDeep
@category Object
@category Array
@category Union
*/
export type ConditionalSimplifyDeep<Type, ExcludeType = never, IncludeType = unknown> = {
	[Member in Type as '_']: Member extends ExcludeType
		? Member
		: Member extends IncludeType
			? {[Key in keyof Member]: ConditionalSimplifyDeep<Member[Key], ExcludeType, IncludeType>}
			: Member
}['_'];
