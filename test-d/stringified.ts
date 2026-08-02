import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {Stringified} from '../index.d.ts';

declare const stringified: Stringified<{a: number; b: string}>;
expectType<{a: string; b: string}>(stringified);

type Car = {
	model: string;
	speed: number;
};
expectNotAssignable<Stringified<Car>>({model: 'Foo', speed: 101});
expectAssignable<Stringified<Car>>({model: 'Foo', speed: '101'});
