import {expectType} from 'tsd';
import type {SetKeys} from '../source/set-keys';

const fruits = new Set(['🍎', '🍌', '🍉'] as const);

type Fruit = SetKeys<typeof fruits>;

expectType<Fruit>('🍎');
expectType<Fruit>('🍌');
expectType<Fruit>('🍉');

type VegetableSet = Set<'🥦' | '🥕' | '🌶'>;
type Vegetable = SetKeys<VegetableSet>;

expectType<Vegetable>('🥦');
expectType<Vegetable>('🥕');
expectType<Vegetable>('🌶');

type UserRolesSet = ReadonlySet<'regular' | 'contributor' | 'maintainer'>;
type UserRole = SetKeys<UserRolesSet>;

expectType<UserRole>('regular');
expectType<UserRole>('contributor');
expectType<UserRole>('maintainer');
