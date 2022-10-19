import {expectTypeOf} from 'expect-type';
import type {Stringified} from '../index';

declare const stringified: Stringified<{a: number; b: string}>;
expectTypeOf(stringified).toEqualTypeOf<{a: string; b: string}>();

type Car = {
	model: string;
	speed: number;
};
expectTypeOf<{model: 'Foo'; speed: 101}>().not.toMatchTypeOf<Stringified<Car>>();
expectTypeOf<{model: 'Foo'; speed: '101'}>().toMatchTypeOf<Stringified<Car>>();
