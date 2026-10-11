import {expectTypeOf} from 'nz';
import type {AbstractConstructor, AbstractClass, IsAny} from '../index.d.ts';

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
