import {expectTypeOf} from 'nz';
import type {Simplify} from '../index.d.ts';

type PositionProperties = {
	top: number;
	left: number;
};

type SizeProperties = {
	width: number;
	height: number;
};

// Flatten the type output to improve type hints shown in editors.
const flattenProperties = {top: 120, left: 240, width: 480, height: 600};
expectTypeOf(flattenProperties).toBe<Simplify<PositionProperties & SizeProperties>>();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface SomeInterface {
	foo: number;
	bar?: string;
	baz: number | undefined;
}

type SomeInterfaceAsTypeWrittenByHand = {
	foo: number;
	bar?: string;
	baz: number | undefined;
};

const valueAsLiteral = {foo: 123, bar: 'hello', baz: 456};
const valueAsSimplifiedInterface: Simplify<SomeInterface> = valueAsLiteral;
const valueAsInterface: SomeInterface = valueAsLiteral;

declare const a: Simplify<SomeInterface>;
expectTypeOf(a).toBe<SomeInterfaceAsTypeWrittenByHand>();

// Interface is assignable to its Simplified type (created with Simplify, and by hand)
expectTypeOf(valueAsInterface).toBe<Simplify<SomeInterface>>();
expectTypeOf(valueAsInterface).toBe<SomeInterfaceAsTypeWrittenByHand>();

// The following demonstrates one reason a type may be preferred over an interface is that it can be assigned to alternate types. In this example the interface cannot be because it is not sealed and elsewhere a non-string property could be added.
expectTypeOf(valueAsLiteral).toBeAssignableTo<Record<string, unknown>>();
expectTypeOf(valueAsSimplifiedInterface).toBeAssignableTo<Record<string, unknown>>();
expectTypeOf(valueAsInterface).not.toBeAssignableTo<Record<string, unknown>>(); // Index signature is missing in interface

// The following tests should be fixed once we have determined the cause of the bug reported in https://github.com/sindresorhus/type-fest/issues/436

type SomeFunction = (type: string) => string;
type SimplifiedFunction = Simplify<SomeFunction>; // Return '{}' expected 'SomeFunction'

declare const someFunction: SimplifiedFunction;

expectTypeOf(someFunction).not.toBeAssignableTo<SomeFunction>();

// // Should return the original type if it is not simplifiable, like a function.
// type SomeFunction = (type: string) => string;
// expectType<Simplify<SomeFunction>>((type: string) => type);

// class SomeClass {
// 	id: string;

// 	private readonly code: number;

// 	constructor() {
// 		this.id = 'some-class';
// 		this.code = 42;
// 	}

// 	someMethod() {
// 		return this.code;
// 	}
// }

// expectType<Simplify<SomeClass>>(new SomeClass());

// `keyof` of an intersection is the union of its members' keys, so `Simplify` flattens both members rather than one of them.
declare const simplifyIntersection: Simplify<{a: 1} & {b?: 2}>;
expectTypeOf(simplifyIntersection).toBe<{a: 1; b?: 2}>();
