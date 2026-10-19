import {expectTypeOf} from 'nz';
import type {LiteralUnion, Simplify, Tagged} from '../index.d.ts';

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

// A union that includes a function is returned as is, so its other members are not flattened.
expectTypeOf<Simplify<SomeFunction | ({a: 1} & {b: 2})>>().toBe<SomeFunction | ({a: 1} & {b: 2})>();

expectTypeOf<Simplify<SomeFunction | undefined>>().toBe<SomeFunction | undefined>();

// A branded primitive is returned as is, because flattening it would remove the primitive.
type BrandedString = string & {brand: 'BrandedString'};
expectTypeOf<Simplify<BrandedString>>().toBe<BrandedString>();
expectTypeOf<Simplify<number & {unit: 'ms'}>>().toBe<number & {unit: 'ms'}>();
expectTypeOf<Simplify<bigint & {unit: 'ns'}>>().toBe<bigint & {unit: 'ns'}>();
expectTypeOf<Simplify<true & {flag: 'on'}>>().toBe<true & {flag: 'on'}>();
expectTypeOf<Simplify<false & {flag: 'off'}>>().toBe<false & {flag: 'off'}>();
expectTypeOf<Simplify<symbol & {key: 'id'}>>().toBe<symbol & {key: 'id'}>();
expectTypeOf<Simplify<'a' & {brand: 'Letter'}>>().toBe<'a' & {brand: 'Letter'}>();
expectTypeOf<Simplify<`id-${string}` & {brand: 'Id'}>>().toBe<`id-${string}` & {brand: 'Id'}>();

type UserId = Tagged<string, 'UserId'>;
expectTypeOf<Simplify<UserId>>().toBe<UserId>();
expectTypeOf<Simplify<Tagged<number, 'Age'> | Tagged<number, 'Height'>>>().toBe<Tagged<number, 'Age'> | Tagged<number, 'Height'>>();

// A primitive intersected with an empty object type is a branded primitive too, like the `string & Record<never, never>` that `LiteralUnion` uses. Unlike `{}`, `Record<never, never>` also works with a template literal.
expectTypeOf<Simplify<string & {}>>().toBe<string & {}>();
expectTypeOf<Simplify<LiteralUnion<'a' | 'b', string>>>().toBe<LiteralUnion<'a' | 'b', string>>();
expectTypeOf<Simplify<LiteralUnion<'onClick', `on${string}`>>>().toBe<LiteralUnion<'onClick', `on${string}`>>();

// A tag with metadata, several tags, and a tagged union of literals are returned as is.
expectTypeOf<Simplify<Tagged<string, 'UserId', {length: 36}>>>().toBe<Tagged<string, 'UserId', {length: 36}>>();
expectTypeOf<Simplify<Tagged<UserId, 'Admin'>>>().toBe<Tagged<UserId, 'Admin'>>();
expectTypeOf<Simplify<Tagged<'a' | 'b', 'Letter'>>>().toBe<Tagged<'a' | 'b', 'Letter'>>();

// A brand with a symbol key and a branded enum are returned as is.
declare const brandSymbol: unique symbol;
expectTypeOf<Simplify<number & {readonly [brandSymbol]: 'Meters'}>>().toBe<number & {readonly [brandSymbol]: 'Meters'}>();
expectTypeOf<Simplify<Color & {brand: 'Color'}>>().toBe<Color & {brand: 'Color'}>();

// A brand over a union of primitives, a brand key that the primitive also has, and a brand that is an intersection are returned as is.
expectTypeOf<Simplify<(string | number) & {brand: 'Id'}>>().toBe<(string | number) & {brand: 'Id'}>();
expectTypeOf<Simplify<string & {length: 5}>>().toBe<string & {length: 5}>();
expectTypeOf<Simplify<UserId & ({a: 1} & {b: 2})>>().toBe<UserId & ({a: 1} & {b: 2})>();

// Simplifying a branded primitive again changes nothing.
expectTypeOf<Simplify<Simplify<UserId>>>().toBe<UserId>();

// A union that includes a branded primitive is returned as is, so its other members are not flattened.
expectTypeOf<Simplify<UserId | ({a: 1} & {b: 2})>>().toBe<UserId | ({a: 1} & {b: 2})>();
expectTypeOf<Simplify<(string & {}) | ({a: 1} & {b: 2})>>().toBe<(string & {}) | ({a: 1} & {b: 2})>();
expectTypeOf<Simplify<LiteralUnion<'a', string> | ({a: 1} & {b: 2})>>().toBe<LiteralUnion<'a', string> | ({a: 1} & {b: 2})>();
expectTypeOf<Simplify<UserId | null | ({a: 1} & {b: 2})>>().toBe<UserId | null | ({a: 1} & {b: 2})>();
expectTypeOf<Simplify<UserId | undefined>>().toBe<UserId | undefined>();
expectTypeOf<Simplify<UserId | SomeFunction>>().toBe<UserId | SomeFunction>();
expectTypeOf<Simplify<UserId | 'auto' | ({a: 1} & {b: 2})>>().toBe<UserId | 'auto' | ({a: 1} & {b: 2})>();

// So an interface in a union with a branded primitive is not turned into a type.
expectTypeOf<Simplify<SomeInterface | UserId>>().not.toBeAssignableTo<Record<string, unknown> | UserId>();

// A union that includes a plain primitive or `void` is flattened member by member, because flattening does not change them.
expectTypeOf<Simplify<'auto' | ({a: 1} & {b: 2})>>().toBe<'auto' | {a: 1; b: 2}>();
expectTypeOf<Simplify<1 | 2 | ({a: 1} & {b: 2})>>().toBe<1 | 2 | {a: 1; b: 2}>();
expectTypeOf<Simplify<boolean | ({a: 1} & {b: 2})>>().toBe<boolean | {a: 1; b: 2}>();
expectTypeOf<Simplify<string | number | bigint | symbol | ({a: 1} & {b: 2})>>().toBe<string | number | bigint | symbol | {a: 1; b: 2}>();
expectTypeOf<Simplify<`id-${string}` | ({a: 1} & {b: 2})>>().toBe<`id-${string}` | {a: 1; b: 2}>();
expectTypeOf<Simplify<void | ({a: 1} & {b: 2})>>().toBe<void | {a: 1; b: 2}>();
expectTypeOf<Simplify<Uppercase<string> | ({a: 1} & {b: 2})>>().toBe<Uppercase<string> | {a: 1; b: 2}>();

// So an interface in a union with a plain primitive is still turned into a type.
expectTypeOf<Simplify<SomeInterface | string>>().toBeAssignableTo<Record<string, unknown> | string>();
expectTypeOf<SomeInterface | string>().not.toBeAssignableTo<Record<string, unknown> | string>();

// A branded primitive as a property value is kept as is.
expectTypeOf<Simplify<{id: UserId} & {name: string}>>().toBe<{id: UserId; name: string}>();

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

function _simplifyGenericUnion<Type extends string | {a: number}>(value: Type): Simplify<Type> {
	return value;
}

function _simplifyGenericBranded<Type extends UserId>(value: Type): Simplify<Type> {
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

// Property modifiers are kept.
expectTypeOf<Simplify<{readonly a: 1} & {b?: 2}>>().toBe<{readonly a: 1; b?: 2}>();

// A key in more than one member is readonly or optional only if it is in every member.
expectTypeOf<Simplify<{readonly a: 1} & {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<Simplify<{a?: 1} & {a: 1}>>().toBe<{a: 1}>();

// A key in more than one member gets the intersection of its values.
expectTypeOf<Simplify<{a: string} & {a: 'x'}>>().toBe<{a: 'x'}>();

// Index signatures, symbol keys, and number keys are kept.
declare const symbolKey: unique symbol;
expectTypeOf<Simplify<{[key: string]: number} & {a: 1}>>().toBe<{[key: string]: number; a: 1}>();
expectTypeOf<Simplify<{[key: `data-${string}`]: string} & {id: number}>>().toBe<{[key: `data-${string}`]: string; id: number}>();
expectTypeOf<Simplify<{[symbolKey]: 1} & {a: 2}>>().toBe<{[symbolKey]: 1; a: 2}>();
expectTypeOf<Simplify<{0: 'a'} & {1: 'b'}>>().toBe<{0: 'a'; 1: 'b'}>();

// A getter stays readonly.
expectTypeOf<Simplify<{get a(): number} & {b: 1}>>().toBe<{readonly a: number; b: 1}>();

// Simplifying a simplified type flattens it with the rest.
expectTypeOf<Simplify<Simplify<{a: 1} & {b: 2}> & {c: 3}>>().toBe<{a: 1; b: 2; c: 3}>();

// A recursive type is flattened only at the top level.
type Tree = {value: number} & {children: Tree[]};
expectTypeOf<Simplify<Tree>>().toBe<{value: number; children: Tree[]}>();

// The `object` type is not changed.
expectTypeOf<Simplify<object>>().toBe<object>();

// A primitive, `null`, `undefined`, `void`, or an enum is returned as is.
enum Color {
	Red,
	Blue,
}

expectTypeOf<Simplify<string>>().toBe<string>();
expectTypeOf<Simplify<'a' | 'b'>>().toBe<'a' | 'b'>();
expectTypeOf<Simplify<string | number | bigint | boolean | symbol>>().toBe<string | number | bigint | boolean | symbol>();
expectTypeOf<Simplify<null>>().toBe<null>();
expectTypeOf<Simplify<undefined>>().toBe<undefined>();
expectTypeOf<Simplify<void>>().toBe<void>();
expectTypeOf<Simplify<Color>>().toBe<Color>();
expectTypeOf<Simplify<Color.Red>>().toBe<Color.Red>();
expectTypeOf<Simplify<typeof symbolKey>>().toBe<typeof symbolKey>();
expectTypeOf<Simplify<null | undefined>>().toBe<null | undefined>();

// An enum or a unique symbol in a union does not stop the other members from being flattened.
expectTypeOf<Simplify<Color | ({a: 1} & {b: 2})>>().toBe<Color | {a: 1; b: 2}>();
expectTypeOf<Simplify<typeof symbolKey | ({a: 1} & {b: 2})>>().toBe<typeof symbolKey | {a: 1; b: 2}>();

// `null` and `undefined` in a union are kept, while the other members are flattened.
expectTypeOf<Simplify<({a: 1} & {b: 2}) | null | undefined>>().toBe<{a: 1; b: 2} | null | undefined>();

// Only the top level is flattened, so a property value is kept as is.
expectTypeOf<Simplify<{a: {b: 1} & {c: 2}} & {d: 3}>>().toBe<{a: {b: 1} & {c: 2}; d: 3}>();

// An array or a tuple keeps its shape.
expectTypeOf<Simplify<string[]>>().toBe<string[]>();
expectTypeOf<Simplify<readonly string[]>>().toBe<readonly string[]>();
expectTypeOf<Simplify<unknown[]>>().toBe<unknown[]>();
expectTypeOf<Simplify<any[]>>().toBe<any[]>();
expectTypeOf<Simplify<never[]>>().toBe<never[]>();
expectTypeOf<Simplify<[]>>().toBe<[]>();
expectTypeOf<Simplify<readonly [1, 2]>>().toBe<readonly [1, 2]>();
expectTypeOf<Simplify<readonly [string, ...number[]]>>().toBe<readonly [string, ...number[]]>();
expectTypeOf<Simplify<string[] | readonly [1]>>().toBe<string[] | readonly [1]>();
expectTypeOf<Simplify<[label: string, count?: number, ...rest: boolean[]]>>().toBe<[label: string, count?: number, ...rest: boolean[]]>();
expectTypeOf<Simplify<[1, ...string[], 2]>>().toBe<[1, ...string[], 2]>();

// The elements of an array or a tuple are kept as is, like property values.
expectTypeOf<Simplify<Array<{a: 1} & {b: 2}>>>().toBe<Array<{a: 1} & {b: 2}>>();
expectTypeOf<Simplify<[{a: 1} & {b: 2}]>>().toBe<[{a: 1} & {b: 2}]>();

// So an interface element is not turned into a type. `SimplifyDeep` does that.
expectTypeOf<Simplify<SomeInterface[]>>().not.toBeAssignableTo<Array<Record<string, unknown>>>();

// An intersection of only arrays is kept as is, because TypeScript maps each array on its own. The arrays are not merged, because `X[] & Y[]` is not the same type as `(X & Y)[]`.
expectTypeOf<Simplify<Array<{a: 1}> & Array<{b: 2}>>>().toBe<Array<{a: 1}> & Array<{b: 2}>>();

// A generic tuple keeps its element positions.
function _simplifyGenericTuple<Type extends [string, number]>(value: Simplify<Type>): number {
	return value[1];
}
