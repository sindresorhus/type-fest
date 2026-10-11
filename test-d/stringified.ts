import {expectTypeOf} from 'nz';
import type {Stringified} from '../index.d.ts';

declare const stringified: Stringified<{a: number; b: string}>;
expectTypeOf(stringified).toBe<{a: string; b: string}>();

type Car = {
	model: string;
	speed: number;
};
expectTypeOf<{model: 'Foo'; speed: 101}>().not.toBeAssignableTo<Stringified<Car>>();
({model: 'Foo', speed: '101'}) satisfies Stringified<Car>;
