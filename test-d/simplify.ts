import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import {Simplify} from '../index';

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
expectType<Simplify<PositionProps & SizeProps>>(flattenProps);

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
