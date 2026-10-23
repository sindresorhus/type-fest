import {expectTypeOf} from 'nz';
import type {JsonValue, SimplifyDeep} from '../index.d.ts';

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

expectTypeOf(flattenProperties).toBe<SimplifyDeep<Properties1 & Properties2>>();

// Array
declare function testArraySimplification(arg: {foo: Array<{[x: string]: string}>}): void;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface BarBaz {
	bar: string;
	baz: string;
}

// This would fail if `SimplifyDeep` did not simplify arrays,
// because interfaces being open are not compatible with index signatures.
testArraySimplification({} as SimplifyDeep<{foo: BarBaz[]}>);

// The public object-only wrapper shares the lazy recursion through arrays.
expectTypeOf<SimplifyDeep<JsonValue>>().toBeAssignableTo<JsonValue>();
expectTypeOf<JsonValue>().toBeAssignableTo<SimplifyDeep<JsonValue>>();
type IntersectionItem = {left: string} & {right: number};
expectTypeOf<SimplifyDeep<readonly IntersectionItem[]>>().toBe<ReadonlyArray<{left: string; right: number}>>();
expectTypeOf<SimplifyDeep<IntersectionItem[], IntersectionItem>>().toBe<IntersectionItem[]>();
expectTypeOf<SimplifyDeep<any>>().toBe<any>();
expectTypeOf<SimplifyDeep<never>>().toBe<never>();
expectTypeOf<SimplifyDeep<unknown>>().toBe<unknown>();
