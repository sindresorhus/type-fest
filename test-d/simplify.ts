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

type SomeType = {
  foo: number;
  bar?: string;
  baz: number | undefined;
};

const literal = {foo: 123, bar: 'hello', baz: 456};
const someType: SomeType = literal;
const someInterface: SomeInterface = literal;

// Default behavior
expectAssignable<Record<string, unknown>>(literal);
expectAssignable<Record<string, unknown>>(someType);
expectNotAssignable<Record<string, unknown>>(someInterface); // Index signature is missing in interface

// Simplify to transform an interface into a type to aide with assignability.
expectAssignable<Record<string, unknown>>(literal as Simplify<typeof literal>);
expectAssignable<Record<string, unknown>>(someType as Simplify<SomeType>);
expectType<SomeType>(someInterface as Simplify<SomeInterface>);
expectAssignable<Record<string, unknown>>(someInterface as Simplify<SomeInterface>);

