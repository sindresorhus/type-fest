import {expectAssignable} from 'tsd';
import type {SetKeys} from '../source/set-keys';

const fruits = new Set(['🍎', '🍌', '🍉'] as const);

type Fruit = SetKeys<typeof fruits>;

expectAssignable<Fruit>('🍎');
expectAssignable<Fruit>('🍌');
expectAssignable<Fruit>('🍉');

type VegetableSet = Set<'🥦' | '🥕' | '🌶'>;
type Vegetable = SetKeys<VegetableSet>;

expectAssignable<Vegetable>('🥦');
expectAssignable<Vegetable>('🥕');
expectAssignable<Vegetable>('🌶');

type UserRolesSet = ReadonlySet<'regular' | 'contributor' | 'maintainer'>;
type UserRole = SetKeys<UserRolesSet>;

expectAssignable<UserRole>('regular');
expectAssignable<UserRole>('contributor');
expectAssignable<UserRole>('maintainer');
