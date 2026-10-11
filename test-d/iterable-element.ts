import {expectTypeOf} from 'nz';
import type {IterableElement} from '../index.d.ts';

declare const iterableElement: IterableElement<ReturnType<typeof secretGenerator>>;
expectTypeOf(iterableElement).toBe<number | string>();

declare const iterableElementAsync: IterableElement<ReturnType<typeof secretGeneratorAsync>>;
expectTypeOf(iterableElementAsync).toBe<boolean | Date>();

function * secretGenerator() {
	yield 1;
	yield 'two';
}

async function * secretGeneratorAsync() {
	yield true;
	yield new Date();
}

const fruits = new Set(['🍎', '🍌', '🍉'] as const);

type Fruit = IterableElement<typeof fruits>;

expectTypeOf<'🍎'>().toBeAssignableTo<Fruit>();
expectTypeOf<'🍌'>().toBeAssignableTo<Fruit>();
expectTypeOf<'🍉'>().toBeAssignableTo<Fruit>();

type VegetableSet = Set<'🥦' | '🥕' | '🌶'>;
type Vegetable = IterableElement<VegetableSet>;

expectTypeOf<'🥦'>().toBeAssignableTo<Vegetable>();
expectTypeOf<'🥕'>().toBeAssignableTo<Vegetable>();
expectTypeOf<'🌶'>().toBeAssignableTo<Vegetable>();

type UserRolesSet = ReadonlySet<'regular' | 'contributor' | 'maintainer'>;
type UserRole = IterableElement<UserRolesSet>;

expectTypeOf<'regular'>().toBeAssignableTo<UserRole>();
expectTypeOf<'contributor'>().toBeAssignableTo<UserRole>();
expectTypeOf<'maintainer'>().toBeAssignableTo<UserRole>();
