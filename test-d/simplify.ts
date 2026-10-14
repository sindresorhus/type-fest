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

// A function cannot be flattened into an object, so it is returned as is, keeping its overloads and type parameters.
type SomeFunction = (type: string) => string;
expectTypeOf<Simplify<SomeFunction>>().toBe<SomeFunction>();

type OverloadedFunction = {
	(value: string): string;
	(value: number): number;
};
expectTypeOf<Simplify<OverloadedFunction>>().toBe<OverloadedFunction>();

type GenericFunction = <Value>(value: Value) => Value;
expectTypeOf<Simplify<GenericFunction>>().toBe<GenericFunction>();

// A function with properties keeps its call signature instead of being turned into an object of its properties.
type FunctionWithProperties = SomeFunction & {description: string};
expectTypeOf<Simplify<FunctionWithProperties>>().toBe<FunctionWithProperties>();

type CallableObject = {
	(value: string): void;
	description: string;
};
expectTypeOf<Simplify<CallableObject>>().toBe<CallableObject>();

class SomeClass {
	id = 'some-class';

	private get code() {
		return 42;
	}

	someMethod() {
		return this.code;
	}
}

// A class constructor keeps its construct signature.
expectTypeOf<Simplify<typeof SomeClass>>().toBe<typeof SomeClass>();

abstract class AbstractClass {
	abstract id: string;
}

expectTypeOf<Simplify<typeof AbstractClass>>().toBe<typeof AbstractClass>();

// A class instance is flattened into its public members.
expectTypeOf<Simplify<SomeClass>>().toBe<{id: string; someMethod: () => number}>();

// A union that includes a function is returned as is.
expectTypeOf<Simplify<SomeFunction | {a: 1}>>().toBe<SomeFunction | {a: 1}>();

expectTypeOf<Simplify<SomeFunction | undefined>>().toBe<SomeFunction | undefined>();

// A union of objects is flattened member by member.
expectTypeOf<Simplify<({a: 1} & {b: 2}) | {c: 3}>>().toBe<{a: 1; b: 2} | {c: 3}>();

// Edge cases
expectTypeOf<Simplify<any>>().toBe<any>();
expectTypeOf<Simplify<never>>().toBe<never>();
expectTypeOf<Simplify<unknown>>().toBe<{}>();

// A generic type stays assignable to its simplified version.
function _simplifyGeneric<Type>(value: Type): Simplify<Type> {
	return value;
}

function _simplifyGenericObject<Type extends {a: number}>(value: Simplify<Type>): number {
	return value.a;
}

// `keyof` of an intersection is the union of its members' keys, so `Simplify` flattens both members rather than one of them.
declare const simplifyIntersection: Simplify<{a: 1} & {b?: 2}>;
expectTypeOf(simplifyIntersection).toBe<{a: 1; b?: 2}>();

// `Omit` drops the call signature, so wrapping it gives only the properties.
expectTypeOf<Simplify<Omit<FunctionWithProperties, never>>>().toBe<{description: string}>();
