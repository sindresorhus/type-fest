import {expectTypeOf} from 'expect-type';
import type {Simplify} from '../index';

type PositionProps = {
	top: number;
	left: number;
};

type SizeProps = {
	width: number;
	height: number;
};

// Flatten the type output to improve type hints shown in editors.
const flattenProps = {top: 120, left: 240, width: 480, height: 600};
expectTypeOf(flattenProps).toEqualTypeOf<Simplify<PositionProps & SizeProps>>();

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
expectTypeOf(a).toEqualTypeOf<SomeInterfaceAsTypeWrittenByHand>();

// Interface is assignable to its Simplified type (created with Simplify, and by hand)
expectTypeOf(valueAsInterface).toEqualTypeOf<Simplify<SomeInterface>>();
expectTypeOf(valueAsInterface).toEqualTypeOf<SomeInterfaceAsTypeWrittenByHand>();

// The following demonstrates one reason a type may be preferred over an interface is that it can be assigned to alternate types. In this example the interface cannot be because it is not sealed and elsewhere a non-string property could be added.
expectTypeOf(valueAsLiteral).toMatchTypeOf<Record<string, unknown>>();
expectTypeOf(valueAsSimplifiedInterface).toMatchTypeOf<Record<string, unknown>>();
expectTypeOf(valueAsInterface).not.toMatchTypeOf<Record<string, unknown>>(); // Index signature is missing in interface

// The following tests should be fixed once we have determined the cause of the bug reported in https://github.com/sindresorhus/type-fest/issues/436

type SomeFunction = (type: string) => string;
type SimplifiedFunction = Simplify<SomeFunction>; // Return '{}' expected 'SomeFunction'

declare const someFunction: SimplifiedFunction;

expectTypeOf(someFunction).not.toMatchTypeOf<SomeFunction>();

// // Should return the original type if it is not simplifiable, like a function.
// type SomeFunction = (type: string) => string;
// expectTypeOf((type: string) => type).toEqualTypeOf<Simplify<SomeFunction>>();

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

// expectTypeOf(new SomeClass()).toEqualTypeOf<Simplify<SomeClass>>();
