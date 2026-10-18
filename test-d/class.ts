import {expectTypeOf} from 'nz';
import type {Class, Constructor, IsAny} from '../index.d.ts';

class Foo {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
	constructor(_x: number, _y: any) {}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	method(): void {}
}

function function_(Cls: Constructor<Foo>): Foo {
	return new Cls(1, '', 123);
}

function function2(Cls: Constructor<Foo, [number, number]>): Foo {
	// @ts-expect-error
	const _ = new Cls(1, '');
	return new Cls(1, 2);
}

function_(Foo);
function2(Foo);

// Prototype test
type PositionProperties = {
	top: number;
	left: number;
};

class Position {
	public top: number;

	public left: number;

	constructor(parameterTop: number, parameterLeft: number) {
		this.top = parameterTop;
		this.left = parameterLeft;
	}
}

declare const Bar: Class<PositionProperties>;

expectTypeOf(Position).toBeAssignableTo<Class<PositionProperties>>();

expectTypeOf(Position).not.toBeAssignableTo<Class<PositionProperties, [number]>>();

expectTypeOf(Position).toBeAssignableTo<Class<PositionProperties, [number, number]>>();
expectTypeOf(Position).toBeAssignableTo<Constructor<PositionProperties, [number, number]>>();

expectTypeOf<IsAny<typeof Bar['prototype']>>().toBe<false>();
expectTypeOf(Position.prototype).toBe<PositionProperties>();
// /Prototype test

// @ts-expect-error
const _a = new Position(17);
expectTypeOf(new Position(17, 34)).toBeAssignableTo<PositionProperties>();

// Prototype test with type parameter
class Building<T = unknown> {
	owners: T;
	constructor(buildingOwners: T) {
		this.owners = buildingOwners;
	}
}

type Census = {
	count: number;
};

class House<OwnerCount extends Census = Census> extends Building<OwnerCount> {}

class CityBlock<BuildingType extends Building> {
	residence: BuildingType;

	constructor(HousingType: Class<BuildingType, [Census]>) {
		this.residence = new HousingType({count: 2});
	}
}

const Family = (new CityBlock(House)).residence.owners;
expectTypeOf<IsAny<typeof Family>>().toBe<false>();
expectTypeOf(Family.count).toBeAssignableTo<number>();
// /Prototype test with type parameter

// Readonly arguments, such as the parameters of a function typed with `as const` arguments
class Point {
	constructor(public x: number, public y?: string) {}
}

expectTypeOf(Point).toBeAssignableTo<Constructor<Point, readonly [number, string?]>>();
expectTypeOf(Point).toBeAssignableTo<Class<Point, readonly [number, string?]>>();
expectTypeOf(Point).toBeAssignableTo<Constructor<Point, readonly [x: number]>>();
expectTypeOf(Point).not.toBeAssignableTo<Constructor<Point, readonly [string]>>();
expectTypeOf(Point).not.toBeAssignableTo<Class<Point, readonly [number, number]>>();

// A constructor with a rest parameter accepts a readonly tuple with a rest element, but not a readonly array of unknown length when its first parameter is required.
class Collection {
	items: number[];

	constructor(name: string, ...items: number[]) {
		this.items = [name.length, ...items];
	}
}

expectTypeOf(Collection).toBeAssignableTo<Constructor<Collection, readonly [string, ...number[]]>>();
expectTypeOf(Collection).toBeAssignableTo<Class<Collection, readonly [string, ...number[]]>>();
expectTypeOf(Collection).not.toBeAssignableTo<Constructor<Collection, readonly string[]>>();

declare const ReadonlyArgumentsPoint: Constructor<Point, readonly [number, string?]>;
const constArguments = [1, 'a'] as const;
expectTypeOf(new ReadonlyArgumentsPoint(...constArguments)).toBe<Point>();
expectTypeOf(new ReadonlyArgumentsPoint(1)).toBe<Point>();
// @ts-expect-error
const _b = new ReadonlyArgumentsPoint('1');
// @ts-expect-error
const _c = new ReadonlyArgumentsPoint(1, 'a', 2);

declare const ReadonlyArgumentsClass: Class<Point, readonly [number]>;
expectTypeOf(new ReadonlyArgumentsClass(1)).toBe<Point>();
expectTypeOf(ReadonlyArgumentsClass.prototype).toBe<Pick<Point, 'x' | 'y'>>();

// The arguments are passed through to the constructor signature, so `ConstructorParameters` gets them back without the `readonly` modifier, the same as for any rest parameter.
expectTypeOf<ConstructorParameters<Constructor<Point, readonly [number, string?]>>>().toBe<[number, string?]>();
expectTypeOf<ConstructorParameters<Class<Point, readonly [number, ...string[]]>>>().toBe<[number, ...string[]]>();

// The default stays a mutable array, so existing code that reads the parameters keeps getting `any[]`.
expectTypeOf<ConstructorParameters<Constructor<Point>>>().toBe<any[]>();
expectTypeOf<ConstructorParameters<Class<Point>>>().toBe<any[]>();

// A generic readonly parameter list can be passed through, which failed with the previous mutable constraint.
function createInstance<Arguments extends readonly unknown[], Instance>(Type: Constructor<Instance, Arguments>, ...arguments_: Arguments): Instance {
	return new Type(...arguments_);
}

expectTypeOf(createInstance(Point, 1)).toBe<Point>();
expectTypeOf(createInstance(Point, ...constArguments)).toBe<Point>();
// @ts-expect-error
createInstance(Point, 'a');

type ClassWithArguments<Arguments extends readonly unknown[]> = Class<Point, Arguments>;
expectTypeOf(Point).toBeAssignableTo<ClassWithArguments<typeof constArguments>>();

// Non-array arguments are still rejected.
// @ts-expect-error
type _InvalidConstructor = Constructor<Point, string>;
// @ts-expect-error
type _InvalidClass = Class<Point, {0: number; length: 1}>;
// @ts-expect-error
type _UnknownArguments = Constructor<Point, unknown>;

// `any` and `never` arguments
expectTypeOf(Point).toBeAssignableTo<Constructor<Point, any>>();
expectTypeOf<ConstructorParameters<Constructor<Point, any>>>().toBe<any[]>();
expectTypeOf<ConstructorParameters<Constructor<Point, never>>>().toBe<never>();
