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
