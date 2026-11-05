import {expectTypeOf} from 'nz';
import type {LiteralUnion, Simplify, SimplifyUnion, Tagged} from '../index.d.ts';

type U1 = 5 | ['b'] | symbol;
type U2 = null | '2' | {foo: 'bar'};

type MergedUnion = U1 | U2;

// Flattening a union of unions gives the same type as the union itself, with its members shown in the hints.
expectTypeOf<SimplifyUnion<MergedUnion>>().toBe<MergedUnion>();

// A union written inline gives the same result as the union of the aliases.
expectTypeOf<SimplifyUnion<5 | ['b'] | symbol | null | '2' | {foo: 'bar'}>>().toBe<MergedUnion>();

// Flattening a flattened union changes nothing.
expectTypeOf<SimplifyUnion<SimplifyUnion<MergedUnion>>>().toBe<MergedUnion>();

// Adding members that are already in the union changes nothing; TypeScript deduplicates them.
expectTypeOf<SimplifyUnion<MergedUnion | 5 | symbol>>().toBe<MergedUnion>();

// Aliases that point to other aliases are flattened too.
type AliasInner = 1 | 2;
type AliasOuter = AliasInner;
expectTypeOf<SimplifyUnion<AliasOuter | 'x'>>().toBe<1 | 2 | 'x'>();

// Members that overlap across aliases are deduplicated.
type OverlapA = 1 | 2;
type OverlapB = 2 | 3;
expectTypeOf<SimplifyUnion<OverlapA | OverlapB>>().toBe<1 | 2 | 3>();

// An alias to a single non-union type keeps its identity.
type Single = 'only';
expectTypeOf<SimplifyUnion<Single>>().toBe<Single>();

// The most common input: one alias holding a union of literals.
type SingleStatus = 'active' | 'paused';
expectTypeOf<SimplifyUnion<SingleStatus>>().toBe<'active' | 'paused'>();

// A union produced by `keyof` flattens to its members.
expectTypeOf<SimplifyUnion<keyof {a: 1; b: 2}>>().toBe<'a' | 'b'>();

declare const mergedValue: MergedUnion;
const flattenedValue: SimplifyUnion<MergedUnion> = mergedValue;
const mergedValueBack: MergedUnion = flattenedValue;

// A member that is not a union itself keeps its identity, even though the hints still show its alias name.
type ObjectAlias = {a: 1};
expectTypeOf<SimplifyUnion<ObjectAlias | {b: 2}>>().toBe<ObjectAlias | {b: 2}>();

// `Simplify` flattens the object members that `SimplifyUnion` left as aliases.
expectTypeOf<Simplify<SimplifyUnion<ObjectAlias | {b: 2}>>>().toBe<{a: 1} | {b: 2}>();

// An interface member is kept as an interface, so it stays unsealed, unlike with `Simplify`.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface SomeInterface {
	a: 1;
}

expectTypeOf<SimplifyUnion<SomeInterface | 'none'>>().toBe<SomeInterface | 'none'>();
declare const someInterfaceValue: SomeInterface;
const interfaceUnionValue: SimplifyUnion<SomeInterface> = someInterfaceValue;
const backToSomeInterface: SomeInterface = interfaceUnionValue;
// @ts-expect-error The interface is kept as is, so it is not assignable to `Record<string, unknown>`.
const unsealed: Record<string, unknown> = interfaceUnionValue;

// Edge cases
expectTypeOf<SimplifyUnion<any>>().toBe<any>();
expectTypeOf<SimplifyUnion<never>>().toBe<never>();
expectTypeOf<SimplifyUnion<unknown>>().toBe<unknown>();
expectTypeOf<SimplifyUnion<boolean>>().toBe<boolean>();
expectTypeOf<SimplifyUnion<true | false>>().toBe<boolean>();
expectTypeOf<SimplifyUnion<string | number | bigint | symbol>>().toBe<string | number | bigint | symbol>();
expectTypeOf<SimplifyUnion<null | undefined | void>>().toBe<null | undefined | void>();
expectTypeOf<SimplifyUnion<object | {}>>().toBe<object | {}>();
expectTypeOf<SimplifyUnion<Date | 'none'>>().toBe<Date | 'none'>();
expectTypeOf<SimplifyUnion<Function>>().toBe<Function>();

// A literal member absorbed by its base type stays absorbed.
expectTypeOf<SimplifyUnion<string | 'a'>>().toBe<string>();

// Literal members are kept, including the `0`/`'0'` pair and `bigint` literals.
expectTypeOf<SimplifyUnion<0 | '0'>>().toBe<0 | '0'>();
expectTypeOf<SimplifyUnion<1n | 2n>>().toBe<1n | 2n>();

// A function member keeps its call signature.
type SomeFunction = (value: string) => string;
type OverloadedFunction = {
	(value: string): string;
	(value: number): number;
};
type GenericFunction = <Value>(value: Value) => Value;

expectTypeOf<SimplifyUnion<SomeFunction | 'auto'>>().toBe<SomeFunction | 'auto'>();
expectTypeOf<SimplifyUnion<OverloadedFunction>>().toBe<OverloadedFunction>();
expectTypeOf<SimplifyUnion<GenericFunction>>().toBe<GenericFunction>();

// A union of named function aliases keeps each signature.
type ClickHandler = (event: {x: number}) => void;
type KeyHandler = (event: {key: string}) => void;

expectTypeOf<SimplifyUnion<ClickHandler | KeyHandler>>().toBe<ClickHandler | KeyHandler>();

// A `this`-typed function member keeps its `this` parameter.
type ThisTypedFunction = (this: Window, value: string) => void;

expectTypeOf<SimplifyUnion<ThisTypedFunction>>().toBe<ThisTypedFunction>();

// A function member with extra properties keeps the intersection.
type FunctionWithProps = (() => void) & {prop: 1};

expectTypeOf<SimplifyUnion<FunctionWithProps | 'none'>>().toBe<FunctionWithProps | 'none'>();

// An abstract constructor member keeps its construct signature.
type AbstractConstructor = abstract new () => object;

expectTypeOf<SimplifyUnion<AbstractConstructor | 'none'>>().toBe<AbstractConstructor | 'none'>();

class SomeClass {
	id = 'some-class';

	someMethod() {
		return 'some-method';
	}
}

// A class constructor member keeps its construct signature.
expectTypeOf<SimplifyUnion<typeof SomeClass | 'none'>>().toBe<typeof SomeClass | 'none'>();

// A class instance member keeps its identity.
expectTypeOf<SimplifyUnion<SomeClass | 'none'>>().toBe<SomeClass | 'none'>();

abstract class AbstractClass {
	abstract id: string;
}

// An abstract class constructor keeps its abstract construct signature.
expectTypeOf<SimplifyUnion<typeof AbstractClass | 'none'>>().toBe<typeof AbstractClass | 'none'>();

// Collection members like `Map`, `ReadonlySet`, and `Promise` are kept as is.
expectTypeOf<SimplifyUnion<Map<string, number> | ReadonlySet<string> | Promise<void>>>().toBe<Map<string, number> | ReadonlySet<string> | Promise<void>>();

// A plain array member is kept as is.
expectTypeOf<SimplifyUnion<string[] | number>>().toBe<string[] | number>();

// A branded primitive member is kept as is.
type UserId = Tagged<string, 'UserId'>;

expectTypeOf<SimplifyUnion<UserId | number>>().toBe<UserId | number>();
expectTypeOf<SimplifyUnion<string & {}>>().toBe<string & {}>();
expectTypeOf<SimplifyUnion<LiteralUnion<'a' | 'b', string>>>().toBe<LiteralUnion<'a' | 'b', string>>();
expectTypeOf<SimplifyUnion<LiteralUnion<'onClick', `on${string}`>>>().toBe<LiteralUnion<'onClick', `on${string}`>>();

// A tuple member keeps its shape.
expectTypeOf<SimplifyUnion<readonly [1, 2] | {a?: 1}>>().toBe<readonly [1, 2] | {a?: 1}>();
expectTypeOf<SimplifyUnion<[label: string, count?: number] | 'none'>>().toBe<[label: string, count?: number] | 'none'>();

// Property modifiers and intersections are kept.
expectTypeOf<SimplifyUnion<{readonly a: 1} | {b?: 2}>>().toBe<{readonly a: 1} | {b?: 2}>();
expectTypeOf<SimplifyUnion<{a: 1} & {b: 2} | 'none'>>().toBe<{a: 1} & {b: 2} | 'none'>();
expectTypeOf<SimplifyUnion<string[] & {total: number}>>().toBe<string[] & {total: number}>();
expectTypeOf<SimplifyUnion<'none' | {[key: string]: number}>>().toBe<'none' | {[key: string]: number}>();

// A method-bearing object member is kept as is.
type WithMethods = {run(): void; prop: string};

expectTypeOf<SimplifyUnion<WithMethods | 'idle'>>().toBe<WithMethods | 'idle'>();

// A recursive union is kept as is.
type Json = string | number | boolean | null | Json[] | {[key: string]: Json};

expectTypeOf<SimplifyUnion<Json>>().toBe<Json>();

// A tag over a union of literals is one intersection member; flattening keeps the brand.
type TaggedLetter = Tagged<'a' | 'b', 'Letter'>;
expectTypeOf<SimplifyUnion<TaggedLetter>>().toBe<TaggedLetter>();

// Each branded member of a union keeps its brand.
expectTypeOf<SimplifyUnion<Tagged<string, 'A'> | Tagged<string, 'B'>>>().toBe<Tagged<string, 'A'> | Tagged<string, 'B'>>();

declare const symbolKey: unique symbol;

// A unique symbol member is kept as is.
expectTypeOf<SimplifyUnion<typeof symbolKey | 'auto'>>().toBe<typeof symbolKey | 'auto'>();

enum Color {
	Red = 'red',
	Green = 'green',
}

// An enum is decomposed into a union of its members, which is assignable in both directions but not the same type.
expectTypeOf<SimplifyUnion<Color>>().toBe<Color.Red | Color.Green>();
expectTypeOf<SimplifyUnion<Color>>().not.toBe<Color>();
expectTypeOf<SimplifyUnion<Color>>().toBeAssignableTo<Color>();
expectTypeOf<Color>().toBeAssignableTo<SimplifyUnion<Color>>();

// An enum member in a union keeps the enum intact.
expectTypeOf<SimplifyUnion<Color | 'auto' | number>>().toBe<Color | 'auto' | number>();

// Multiple enums in a union keep the enums intact too.
enum Size {
	Small = 'small',
	Large = 'large',
}

expectTypeOf<SimplifyUnion<Color | Size>>().toBe<Color | Size>();

// A numeric enum is decomposed exactly like a string enum.
enum Direction {
	Up,
	Down,
}

expectTypeOf<SimplifyUnion<Direction>>().toBe<Direction.Up | Direction.Down>();

// A template literal intersected with `{}` loses the `{}`.
expectTypeOf<SimplifyUnion<`on${string}` & {}>>().toBe<`on${string}`>();

// A union of template literal types is kept as is.
expectTypeOf<SimplifyUnion<`on${string}` | `off${string}`>>().toBe<`on${string}` | `off${string}`>();

// An unresolved generic type is not assignable to its flattened version, and the other way around.
function _simplifyUnionGeneric<Type>(value: Type): SimplifyUnion<Type> {
	// @ts-expect-error The flattening only happens once `Type` is a concrete type.
	return value;
}

function _simplifyUnionGenericConstrained<Value extends string | number>(value: Value): SimplifyUnion<Value> {
	// @ts-expect-error A type parameter constraint does not make the flattening happen earlier.
	return value;
}

function _simplifyUnionGenericReverse<Type>(value: SimplifyUnion<Type>): Type {
	// @ts-expect-error The flattened generic type cannot be related to `Type`.
	return value;
}
