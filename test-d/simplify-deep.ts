import {expectType} from 'tsd';
import type {SimplifyDeep} from '../index.d.ts';

type Properties1 = {
	height: number;
	position: {
		top: number;
		bottom: number;
	};
};

type Properties2 = {
	width: number;
	position: {
		left: number;
		right: number;
	};
};

// Flatten the type output to improve type hints shown in editors.
declare const flattenProperties: {
	height: number;
	width: number;
	position: {
		top: number;
		bottom: number;
		left: number;
		right: number;
	};
};

expectType<SimplifyDeep<Properties1 & Properties2>>(flattenProperties);

// Array
type ArrayType = Array<{
	a: string;
}>;

declare const flattenProperties2: {
	arrayType: Array<{
		a: string;
	}>;
};
expectType<SimplifyDeep<{arrayType: ArrayType}>>(flattenProperties2);

declare function testArraySimplification(arg: {foo: Array<{[x: string]: string}>}): void;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface BarBaz {
	bar: string;
	baz: string;
}

// This would fail if `SimplifyDeep` did not simplify arrays,
// because interfaces being open are not compatible with index signatures.
testArraySimplification({} as SimplifyDeep<{foo: BarBaz[]}>);
