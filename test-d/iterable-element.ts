import {expectAssignable, expectType} from 'tsd';
import type {IterableElement} from '../index.d.ts';

declare const iterableElement: IterableElement<ReturnType<typeof secretGenerator>>;
expectType<1 | 'two'>(iterableElement);

declare const iterableElementAsync: IterableElement<ReturnType<typeof secretGeneratorAsync>>;
expectType<true | Date>(iterableElementAsync);

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

expectAssignable<Fruit>('🍎');
expectAssignable<Fruit>('🍌');
expectAssignable<Fruit>('🍉');

type VegetableSet = Set<'🥦' | '🥕' | '🌶'>;
type Vegetable = IterableElement<VegetableSet>;

expectAssignable<Vegetable>('🥦');
expectAssignable<Vegetable>('🥕');
expectAssignable<Vegetable>('🌶');

type UserRolesSet = ReadonlySet<'regular' | 'contributor' | 'maintainer'>;
type UserRole = IterableElement<UserRolesSet>;

expectAssignable<UserRole>('regular');
expectAssignable<UserRole>('contributor');
expectAssignable<UserRole>('maintainer');
