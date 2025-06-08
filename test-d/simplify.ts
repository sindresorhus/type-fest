import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
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
expectType<Simplify<PositionProperties & SizeProperties>>(flattenProperties);

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
expectType<SomeInterfaceAsTypeWrittenByHand>(a);

// Interface is assignable to its Simplified type (created with Simplify, and by hand)
expectType<Simplify<SomeInterface>>(valueAsInterface);
expectType<SomeInterfaceAsTypeWrittenByHand>(valueAsInterface);

// The following demonstrates one reason a type may be preferred over an interface is that it can be assigned to alternate types. In this example the interface cannot be because it is not sealed and elsewhere a non-string property could be added.
expectAssignable<Record<string, unknown>>(valueAsLiteral);
expectAssignable<Record<string, unknown>>(valueAsSimplifiedInterface);
expectNotAssignable<Record<string, unknown>>(valueAsInterface); // Index signature is missing in interface

// Should return the original type if it is not simplifiable
type SomeFunction = (type: string) => string;
type SimplifiedFunction = Simplify<SomeFunction>; // Return '(type: string) => string'

declare const someFunction: SimplifiedFunction;
expectNotAssignable<SomeFunction>(someFunction);

class SomeClass {
	id: string;

	private readonly code: number;

	constructor() {
		this.id = 'some-class';
		this.code = 42;
	}

	someMethod() {
		return this.code;
	}
}

type SimplifiedClass = Simplify<typeof SomeClass>;

expectType<SimplifiedClass>(SomeClass);
