import {expectTypeOf} from 'nz';
import type {AbstractConstructor, AbstractClass, Constructor, IsAny} from '../index.d.ts';

abstract class Foo {
	x: number;

	constructor(x: number) {
		this.x = x;
	}

	abstract fooMethod(): void;
}

abstract class Bar {
	abstract barMethod(): void;
}

function functionReceivingAbsClass<T>(cls: AbstractClass<T>) {
	return cls;
}

function withBar<T extends AbstractConstructor<object>>(Ctor: T) {
	abstract class ExtendedBar extends Ctor {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		extendedBarMethod() {}
	}
	return ExtendedBar;
}

// This lacks `barMethod`.
// @ts-expect-error
class WrongConcreteExtendedBar extends withBar(Bar) {}

// This should be alright since `barMethod` is implemented.
class CorrectConcreteExtendedBar extends withBar(Bar) {
	constructor(_x: number, _y: number) {
		super();
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	barMethod() {}
}

function assertWithBar() {
	functionReceivingAbsClass<Bar>(withBar(Bar));
	functionReceivingAbsClass<Bar>(CorrectConcreteExtendedBar);
}

functionReceivingAbsClass(Foo);
// @ts-expect-error
functionReceivingAbsClass<Bar>(Foo);
assertWithBar();

expectTypeOf(Bar).toBeAssignableTo<AbstractConstructor<{barMethod(): void}, []>>();
expectTypeOf(Bar).toBeAssignableTo<AbstractClass<{barMethod(): void}, []>>();

// Prototype test
expectTypeOf(Bar.prototype).toBeAssignableTo<{barMethod(): void}>();
expectTypeOf(Bar.prototype).not.toBeAssignableTo<{fooMethod(): void}>();
// @ts-expect-error
const _a = new CorrectConcreteExtendedBar(12);
expectTypeOf(new CorrectConcreteExtendedBar(12, 15)).toBeAssignableTo<{barMethod(): void}>();
// /Prototype test

// Prototype test with type parameter
abstract class AbstractBuilding<T = unknown> {
	owners: T;
	constructor(buildingOwners: T) {
		this.owners = buildingOwners;
	}
}

type Census = {
	count: number;
};

abstract class House<OwnerCount extends Census = Census> extends AbstractBuilding<OwnerCount> {}

class CityBlock<BuildingType extends AbstractBuilding<Census>> {
	residence: BuildingType;

	constructor(HousingType: AbstractClass<BuildingType, [Census]>) {
		class Building extends HousingType {}
		this.residence = new Building({count: 2});
	}
}

const Family = (new CityBlock(House)).residence.owners;
expectTypeOf<IsAny<typeof Family>>().toBe<false>();
expectTypeOf(Family.count).toBeAssignableTo<number>();
// /Prototype test with type parameter

// Readonly arguments
abstract class Shape {
	constructor(public name: string, public sides?: number) {}

	abstract area(): number;
}

expectTypeOf(Shape).toBeAssignableTo<AbstractConstructor<Shape, readonly [string, number?]>>();
expectTypeOf(Shape).toBeAssignableTo<AbstractClass<Shape, readonly [string, number?]>>();
expectTypeOf(Shape).toBeAssignableTo<AbstractClass<Shape, readonly [name: string]>>();
expectTypeOf(Shape).not.toBeAssignableTo<AbstractConstructor<Shape, readonly [number]>>();
expectTypeOf(Shape).not.toBeAssignableTo<AbstractClass<Shape, readonly [string, string]>>();

// A concrete class also matches the abstract types with readonly arguments.
class Square extends Shape {
	area() {
		return 1;
	}
}

expectTypeOf(Square).toBeAssignableTo<AbstractConstructor<Shape, readonly [string]>>();
expectTypeOf(Square).toBeAssignableTo<AbstractClass<Square, readonly [string, number?]>>();

declare const ReadonlyArgumentsShape: AbstractClass<Shape, readonly [string, number?]>;
// It is still abstract, so it does not match a constructor that can be called with `new`.
expectTypeOf(ReadonlyArgumentsShape).not.toBeAssignableTo<Constructor<Shape, readonly [string, number?]>>();
expectTypeOf(ReadonlyArgumentsShape.prototype).toBe<Pick<Shape, 'name' | 'sides' | 'area'>>();

// An abstract class with readonly arguments can still be extended.
class Triangle extends ReadonlyArgumentsShape {
	area() {
		return 2;
	}
}

const shapeArguments = ['triangle', 3] as const;
expectTypeOf(new Triangle(...shapeArguments)).toBeAssignableTo<Shape>();
// @ts-expect-error
const _c = new Triangle(3);

// The arguments are passed through to the constructor signature, so `ConstructorParameters` gets them back without the `readonly` modifier, the same as for any rest parameter.
expectTypeOf<ConstructorParameters<AbstractConstructor<Shape, readonly [string, number?]>>>().toBe<[string, number?]>();
expectTypeOf<ConstructorParameters<AbstractClass<Shape, readonly [string, ...number[]]>>>().toBe<[string, ...number[]]>();

// The default stays a mutable array, so mixins keep working, and readonly arguments work for mixins too.
expectTypeOf<ConstructorParameters<AbstractConstructor<Shape>>>().toBe<any[]>();
expectTypeOf<ConstructorParameters<AbstractClass<Shape>>>().toBe<any[]>();

function withColor<Base extends AbstractConstructor<object, readonly any[]>>(BaseClass: Base) {
	abstract class Colored extends BaseClass {
		color = 'red';
	}

	return Colored;
}

class ColoredSquare extends withColor(Square) {}
expectTypeOf(new ColoredSquare('square').color).toBe<string>();
expectTypeOf(new ColoredSquare('square').area()).toBe<number>();

// Non-array arguments are still rejected.
// @ts-expect-error
type _InvalidAbstractConstructor = AbstractConstructor<Shape, string>;
// @ts-expect-error
type _InvalidAbstractClass = AbstractClass<Shape, unknown>;
